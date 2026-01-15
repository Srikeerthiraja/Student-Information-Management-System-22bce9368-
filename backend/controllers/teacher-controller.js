const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
  try {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;

    if (!name || !email || !password || !school) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const safeEmail = email.trim().toLowerCase();

    const existingTeacher = await Teacher.findOne({ email: safeEmail });
    if (existingTeacher) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name: name.trim(),
      email: safeEmail,
      password: hashedPass,
      role,
      school,
      teachSubject,
      teachSclass
    });

    const result = await teacher.save();

    if (teachSubject) {
      await Subject.findByIdAndUpdate(
        teachSubject,
        { teacher: result._id },
        { new: true }
      );
    }

    const teacherResponse = result.toObject();
    delete teacherResponse.password;

    return res.status(201).json(teacherResponse);

  } catch (err) {
    console.error("Teacher registration error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const teacherLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const teacher = await Teacher.findOne({ email: email.trim().toLowerCase() });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validated = await bcrypt.compare(password, teacher.password);
    if (!validated) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const populatedTeacher = await teacher
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");

    const response = populatedTeacher.toObject();
    delete response.password;

    return res.status(200).json(response);

  } catch (err) {
    console.error("Teacher login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    const schoolId = req.params.id.trim();

    const teachers = await Teacher.find({ school: schoolId })
      .populate("teachSubject", "subName")
      .populate("teachSclass", "sclassName");

    if (!teachers.length) {
      return res.status(404).json({ message: "No teachers found" });
    }

    const sanitized = teachers.map(t => {
      const obj = t.toObject();
      delete obj.password;
      return obj;
    });

    return res.status(200).json(sanitized);

  } catch (err) {
    console.error("Get teachers error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getTeacherDetail = async (req, res) => {
  try {
    const teacherId = req.params.id.trim();

    const teacher = await Teacher.findById(teacherId)
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const response = teacher.toObject();
    delete response.password;

    return res.status(200).json(response);

  } catch (err) {
    console.error("Get teacher detail error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateTeacherSubject = async (req, res) => {
  try {
    const { teacherId, teachSubject } = req.body;

    if (!teacherId || !teachSubject) {
      return res.status(400).json({ message: "Teacher ID and subject required" });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await Subject.findByIdAndUpdate(
      teachSubject,
      { teacher: updatedTeacher._id }
    );

    const response = updatedTeacher.toObject();
    delete response.password;

    return res.status(200).json(response);

  } catch (err) {
    console.error("Update teacher subject error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id.trim();

    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await Subject.updateMany(
      { teacher: deletedTeacher._id },
      { $unset: { teacher: "" } }
    );

    return res.status(200).json(deletedTeacher);

  } catch (err) {
    console.error("Delete teacher error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteTeachers = async (req, res) => {
  try {
    const schoolId = req.params.id.trim();

    const teachers = await Teacher.find({ school: schoolId });
    if (!teachers.length) {
      return res.status(404).json({ message: "No teachers found" });
    }

    const teacherIds = teachers.map(t => t._id);

    await Teacher.deleteMany({ school: schoolId });

    await Subject.updateMany(
      { teacher: { $in: teacherIds } },
      { $unset: { teacher: "" } }
    );

    return res.status(200).json({ deletedCount: teacherIds.length });

  } catch (err) {
    console.error("Delete teachers error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const teacherAttendance = async (req, res) => {
  try {
    const { status, date } = req.body;

    if (!status || !date) {
      return res.status(400).json({ message: "Status and date required" });
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const attendanceDate = new Date(date).toDateString();

    const existing = teacher.attendance.find(
      a => a.date.toDateString() === attendanceDate
    );

    if (existing) {
      existing.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    return res.status(200).json(result);

  } catch (err) {
    console.error("Teacher attendance error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  teacherAttendance
};
