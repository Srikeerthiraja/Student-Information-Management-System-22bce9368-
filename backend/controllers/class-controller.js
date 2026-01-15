const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

// ========================
// CREATE CLASS
// ========================
const sclassCreate = async (req, res) => {
  try {
    const { sclassName, adminID } = req.body;

    // Validate inputs
    if (!sclassName || !adminID) {
      return res.status(400).json({ message: "Class name and admin ID are required" });
    }

    const safeSclassName = sclassName.trim();
    const safeAdminID = adminID.trim();

    // Check for existing class
    const existingSclass = await Sclass.findOne({
      sclassName: safeSclassName,
      school: safeAdminID
    });

    if (existingSclass) {
      return res.status(400).json({ message: "Sorry, this class name already exists" });
    }

    const sclass = new Sclass({
      sclassName: safeSclassName,
      school: safeAdminID
    });

    const result = await sclass.save();
    return res.status(201).json(result);

  } catch (err) {
    console.error("Create class error:", err);
    return res.status(500).json({ message: "Server error during class creation", error: err.message });
  }
};

// ========================
// LIST CLASSES
// ========================
const sclassList = async (req, res) => {
  try {
    const schoolID = req.params.id.trim();

    const sclasses = await Sclass.find({ school: schoolID });
    if (sclasses.length === 0) {
      return res.status(404).json({ message: "No classes found" });
    }

    return res.status(200).json(sclasses);

  } catch (err) {
    console.error("List classes error:", err);
    return res.status(500).json({ message: "Server error while listing classes", error: err.message });
  }
};

// ========================
// GET CLASS DETAIL
// ========================
const getSclassDetail = async (req, res) => {
  try {
    const sclassID = req.params.id.trim();

    let sclass = await Sclass.findById(sclassID);
    if (!sclass) {
      return res.status(404).json({ message: "No class found" });
    }

    sclass = await sclass.populate("school", "schoolName");
    return res.status(200).json(sclass);

  } catch (err) {
    console.error("Get class detail error:", err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid class ID" });
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// GET STUDENTS OF CLASS
// ========================
const getSclassStudents = async (req, res) => {
  try {
    const sclassID = req.params.id.trim();

    const students = await Student.find({ sclassName: sclassID });
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    const sanitizedStudents = students.map((student) => {
      const obj = student.toObject();
      delete obj.password;
      return obj;
    });

    return res.status(200).json(sanitizedStudents);

  } catch (err) {
    console.error("Get class students error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// DELETE SINGLE CLASS
// ========================
const deleteSclass = async (req, res) => {
  try {
    const sclassID = req.params.id.trim();

    const deletedClass = await Sclass.findByIdAndDelete(sclassID);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    await Student.deleteMany({ sclassName: sclassID });
    await Subject.deleteMany({ sclassName: sclassID });
    await Teacher.deleteMany({ teachSclass: sclassID });

    return res.status(200).json({ message: "Class and related data deleted", deletedClass });

  } catch (err) {
    console.error("Delete class error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ========================
// DELETE ALL CLASSES OF SCHOOL
// ========================
const deleteSclasses = async (req, res) => {
  try {
    const schoolID = req.params.id.trim();

    const deletedClasses = await Sclass.deleteMany({ school: schoolID });
    if (deletedClasses.deletedCount === 0) {
      return res.status(404).json({ message: "No classes found to delete" });
    }

    await Student.deleteMany({ school: schoolID });
    await Subject.deleteMany({ school: schoolID });
    await Teacher.deleteMany({ school: schoolID });

    return res.status(200).json({ message: "All classes and related data deleted", deletedClasses });

  } catch (err) {
    console.error("Delete all classes error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  sclassCreate,
  sclassList,
  getSclassDetail,
  getSclassStudents,
  deleteSclass,
  deleteSclasses
};
