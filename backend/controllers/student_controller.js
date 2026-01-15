const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

// ========================
// STUDENT REGISTRATION
// ========================
const studentRegister = async (req, res) => {
  try {
    const { rollNum, studentName, password, adminID, sclassName } = req.body;

    // Validate required fields
    if (!rollNum || !studentName || !password || !adminID || !sclassName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Sanitize inputs
    const safeRollNum = rollNum.trim();
    const safeStudentName = studentName.trim();
    const safeAdminID = adminID.trim();
    const safeSclassName = sclassName.trim();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Check if student already exists
    const existingStudent = await Student.findOne({
      rollNum: safeRollNum,
      school: safeAdminID,
      sclassName: safeSclassName,
    });

    if (existingStudent) {
      return res.status(400).json({ message: "Roll Number already exists" });
    }

    const student = new Student({
      ...req.body,
      rollNum: safeRollNum,
      studentName: safeStudentName,
      school: safeAdminID,
      sclassName: safeSclassName,
      password: hashedPass,
    });

    const result = await student.save();
    const studentResponse = result.toObject();
    delete studentResponse.password;

    return res.status(201).json(studentResponse);

  } catch (err) {
    console.error("Student registration error:", err);
    return res.status(500).json({ message: "Server error during registration", error: err.message });
  }
};

// ========================
// STUDENT LOGIN
// ========================
const studentLogIn = async (req, res) => {
  try {
    const { rollNum, studentName, password } = req.body;

    if (!rollNum || !studentName || !password) {
      return res.status(400).json({ message: "Roll number, name, and password are required" });
    }

    const safeRollNum = rollNum.trim();
    const safeStudentName = studentName.trim();

    const student = await Student.findOne({ rollNum: safeRollNum, studentName: safeStudentName });
    if (!student) return res.status(401).json({ message: "Student not found" });

    const validated = await bcrypt.compare(password, student.password);
    if (!validated) return res.status(401).json({ message: "Invalid password" });

    await student.populate("school", "schoolName");
    await student.populate("sclassName", "sclassName");

    const studentResponse = student.toObject();
    delete studentResponse.password;
    delete studentResponse.examResult;
    delete studentResponse.attendance;

    return res.status(200).json(studentResponse);

  } catch (err) {
    console.error("Student login error:", err);
    return res.status(500).json({ message: "Server error during login", error: err.message });
  }
};

// ========================
// GET STUDENTS BY SCHOOL
// ========================
const getStudents = async (req, res) => {
  try {
    const schoolID = req.params.id.trim();

    const students = await Student.find({ school: schoolID }).populate("sclassName", "sclassName");
    if (!students.length) return res.status(404).json({ message: "No students found" });

    const sanitized = students.map(s => {
      const obj = s.toObject();
      delete obj.password;
      return obj;
    });

    return res.status(200).json(sanitized);

  } catch (err) {
    console.error("Get students error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// GET STUDENT DETAIL
// ========================
const getStudentDetail = async (req, res) => {
  try {
    const studentID = req.params.id.trim();

    const student = await Student.findById(studentID)
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .populate("examResult.subName", "subName")
      .populate("attendance.subName", "subName sessions");

    if (!student) return res.status(404).json({ message: "No student found" });

    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res.status(200).json(studentResponse);

  } catch (err) {
    console.error("Get student detail error:", err);
    if (err.kind === "ObjectId") return res.status(400).json({ message: "Invalid student ID" });
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// DELETE STUDENT(S)
// ========================
const deleteStudent = async (req, res) => {
  try {
    const studentID = req.params.id.trim();
    const deleted = await Student.findByIdAndDelete(studentID);

    if (!deleted) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json(deleted);

  } catch (err) {
    console.error("Delete student error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteStudents = async (req, res) => {
  try {
    const schoolID = req.params.id.trim();
    const result = await Student.deleteMany({ school: schoolID });

    if (result.deletedCount === 0) return res.status(404).json({ message: "No students found to delete" });

    return res.status(200).json(result);

  } catch (err) {
    console.error("Delete students error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteStudentsByClass = async (req, res) => {
  try {
    const classID = req.params.id.trim();
    const result = await Student.deleteMany({ sclassName: classID });

    if (result.deletedCount === 0) return res.status(404).json({ message: "No students found to delete" });

    return res.status(200).json(result);

  } catch (err) {
    console.error("Delete students by class error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// UPDATE STUDENT
// ========================
const updateStudent = async (req, res) => {
  try {
    const studentID = req.params.id.trim();

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await Student.findByIdAndUpdate(studentID, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });

    const studentResponse = updated.toObject();
    delete studentResponse.password;

    return res.status(200).json(studentResponse);

  } catch (err) {
    console.error("Update student error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// UPDATE EXAM RESULT
// ========================
const updateExamResult = async (req, res) => {
  try {
    const { subName, marksObtained } = req.body;
    const studentID = req.params.id.trim();

    const student = await Student.findById(studentID);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existingResult = student.examResult.find(r => r.subName.toString() === subName);
    if (existingResult) existingResult.marksObtained = marksObtained;
    else student.examResult.push({ subName, marksObtained });

    const result = await student.save();
    return res.status(200).json(result);

  } catch (err) {
    console.error("Update exam result error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// STUDENT ATTENDANCE
// ========================
const studentAttendance = async (req, res) => {
  try {
    const { subName, status, date } = req.body;
    const studentID = req.params.id.trim();

    const student = await Student.findById(studentID);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const subject = await Subject.findById(subName);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const existingAttendance = student.attendance.find(
      a => a.date.toDateString() === new Date(date).toDateString() &&
           a.subName.toString() === subName
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      const attendedSessions = student.attendance.filter(a => a.subName.toString() === subName).length;
      if (attendedSessions >= subject.sessions) {
        return res.status(400).json({ message: "Maximum attendance limit reached" });
      }
      student.attendance.push({ date, status, subName });
    }

    const result = await student.save();
    return res.status(200).json(result);

  } catch (err) {
    console.error("Student attendance error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// CLEAR / REMOVE ATTENDANCE
// ========================
const clearAllStudentsAttendanceBySubject = async (req, res) => {
  try {
    const subName = req.params.id.trim();
    const result = await Student.updateMany({ 'attendance.subName': subName }, { $pull: { attendance: { subName } } });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Clear attendance by subject error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const clearAllStudentsAttendance = async (req, res) => {
  try {
    const schoolID = req.params.id.trim();
    const result = await Student.updateMany({ school: schoolID }, { $set: { attendance: [] } });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Clear all attendance error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const removeStudentAttendanceBySubject = async (req, res) => {
  try {
    const studentID = req.params.id.trim();
    const subName = req.body.subId;

    const result = await Student.updateOne({ _id: studentID }, { $pull: { attendance: { subName } } });
    return res.status(200).json(result);

  } catch (err) {
    console.error("Remove attendance by subject error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const removeStudentAttendance = async (req, res) => {
  try {
    const studentID = req.params.id.trim();
    const result = await Student.updateOne({ _id: studentID }, { $set: { attendance: [] } });
    return res.status(200).json(result);
  } catch (err) {
    console.error("Remove attendance error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,
  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
};
