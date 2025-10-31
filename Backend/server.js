const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const multer = require("multer");
const db = require("./db"); // تأكدي من إعداد اتصالك بقاعدة البيانات هنا
require("dotenv").config();
const path = require("path");

const mime = require("mime"); // لتحديد نوع الملفات بدقة
const app = express();
const PORT = process.env.PORT || 5000;

// ======= Middleware =======
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // لعرض الملفات
// ✅ اختبار السيرفر
app.get("/", (req, res) => res.send("✅ Server is running"));

// =================== المستخدمين ===================

// تسجيل مستخدم جديد
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role)
    return res.status(400).json({ message: "رجاءً املأ جميع الحقول" });

  if (!["طالب", "مدرس"].includes(role))
    return res.status(400).json({ message: "دور غير صالح للمستخدم" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, role]
    );
    res.status(201).json({ message: "تم إنشاء الحساب بنجاح!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقًا" });
    else {
      console.error(err);
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  }
});

// تسجيل الدخول
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "رجاءً املأ جميع الحقول" });

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: "البريد الإلكتروني غير موجود" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "كلمة المرور غير صحيحة" });

    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح!",
      user: {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName, 
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// نسيان كلمة المرور
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "يرجى إدخال البريد الإلكتروني" });

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: "البريد الإلكتروني غير مسجل" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.execute("DELETE FROM password_resets WHERE email = ?", [email]);
    await db.execute(
      "INSERT INTO password_resets (email, code, expiresAt) VALUES (?, ?, ?)",
      [email, code, expiresAt]
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "كود استعادة كلمة المرور",
      text: `كود استعادة كلمة المرور الخاص بك هو: ${code}. صالح لمدة 5 دقائق.`,
    });

    res.status(200).json({ message: "تم إرسال كود التحقق إلى بريدك" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// التحقق من الكود
app.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "يرجى إدخال البريد والكود" });

  try {
    const [rows] = await db.execute(
      "SELECT * FROM password_resets WHERE email=? AND code=?",
      [email, code]
    );
    if (rows.length === 0) return res.status(400).json({ message: "الكود غير صحيح" });

    if (new Date(rows[0].expiresAt) < new Date()) {
      await db.execute("DELETE FROM password_resets WHERE email=?", [email]);
      return res.status(400).json({ message: "انتهت صلاحية الكود" });
    }

    res.status(200).json({ message: "تم التحقق من الكود بنجاح" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// إعادة تعيين كلمة المرور
app.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: "يرجى إدخال جميع الحقول" });

  try {
    const [rows] = await db.execute(
      "SELECT * FROM password_resets WHERE email=? AND code=?",
      [email, code]
    );
    if (rows.length === 0) return res.status(400).json({ message: "الكود غير صحيح" });

    if (new Date(rows[0].expiresAt) < new Date()) {
      await db.execute("DELETE FROM password_resets WHERE email=?", [email]);
      return res.status(400).json({ message: "انتهت صلاحية الكود" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password=? WHERE email=?", [hashedPassword, email]);
    await db.execute("DELETE FROM password_resets WHERE email=?", [email]);

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// =================== مساقات المعلمين ===================

// إضافة مساق جديد (بانتظار موافقة الأدمن)
app.post("/api/courses/add", async (req, res) => {
  const { teacherId, courseCode, courseName, description, maxStudents, durationHours, price } = req.body;

  if (!teacherId || !courseCode || !courseName)
    return res.status(400).json({ message: "يرجى إدخال جميع الحقول المطلوبة" });

  try {
    const [existing] = await db.execute("SELECT * FROM courses WHERE courseCode = ?", [courseCode]);
    if (existing.length > 0) return res.status(400).json({ message: "كود المساق مستخدم مسبقاً" });

    await db.execute(
      `INSERT INTO courses 
      (teacherId, courseCode, courseName, description, maxStudents, durationHours, price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [teacherId, courseCode, courseName, description || '', maxStudents || 30, durationHours || 0, price || 0]
    );

    res.json({ message: "تم إرسال المساق للإدارة للموافقة عليه ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// جلب جميع المساقات الخاصة بالمدرس
app.get("/api/courses/my/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM courses WHERE teacherId = ?", [teacherId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء الجلب" });
  }
});
// =================== Multer Setup ===================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads/")); // مجلد رفع الملفات
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // يسمح برفع ملفات حتى 100MB
});


// =================== API TASKS ===================

// إضافة مهمة جديدة
app.post("/api/tasks/add", upload.single("file"), async (req, res) => {
  const { courseId, title, description, type, startDate, dueDate } = req.body;
  let fileUrl = null;

  if (req.file) {
    fileUrl = `/uploads/${req.file.filename}`;
  }

  if (!courseId || !title || !startDate || !dueDate)
    return res.status(400).json({ message: "يرجى إدخال جميع الحقول المطلوبة" });

  try {
    await db.execute(
      `INSERT INTO tasks (courseId, title, description, type, fileUrl, startDate, dueDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [courseId, title, description || "", type || "other", fileUrl, startDate, dueDate]
    );

    res.json({ message: "تم إضافة المهمة بنجاح ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
});

// جلب جميع المهام لمادة معينة
app.get("/api/tasks/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const [rows] = await db.execute("SELECT * FROM tasks WHERE courseId = ?", [courseId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء الجلب" });
  }
});

// حذف مهمة
app.delete("/api/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    await db.execute("DELETE FROM tasks WHERE id = ?", [taskId]);
    res.json({ message: "تم حذف المهمة بنجاح ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء الحذف" });
  }
});


// ===== رفع الدرس =====
app.post("/api/lessons/upload", upload.single("file"), async (req, res) => {
  try {
    const { teacherId, courseId, lessonTypes, title } = req.body;
    const file = req.file;

    if (!teacherId || !courseId || !lessonTypes || !title)
      return res.status(400).json({ message: "البيانات غير مكتملة" });

    const filePath = file ? `/uploads/${file.filename}` : null;

    await db.execute(
      `INSERT INTO lessons (teacherId, courseId, lessonTypes, title, filePath)
       VALUES (?, ?, ?, ?, ?)`,
      [teacherId, courseId, lessonTypes, title, filePath]
    );

    res.status(201).json({
      message: "✅ تم رفع الدرس بنجاح!",
      filePath: filePath,
    });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء رفع الدرس" });
  }
});

// ===== جعل مجلد uploads متاح للوصول العام =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
