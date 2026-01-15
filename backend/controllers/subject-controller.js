const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');
const subjectCreate = async (req, res) => {
  try {
    const { subjects, sclassName, adminID } = req.body;

    if (!subjects || !sclassName || !adminID) {
      return res.status(400).json({ message: "Subjects, class ID, and admin ID are required" });
    }

    const safeSclassName = sclassName.trim();
    const safeAdminID = adminID.trim();

    // Extract all subCodes from input
    const subCodes = subjects.map(s => s.subCode.trim());

    // Check if any subCodes already exist in the school
    const existingSubject = await Subject.findOne({
      subCode: { $in: subCodes },
      school: safeAdminID,
    });

    if (existingSubject) {
      return res.status(400).json({ message: `Subject code ${existingSubject.subCode} already exists.` });
    }

    const subjectsToInsert = subjects.map(s => ({
      ...s,
      subCode: s.subCode.trim(),
      sclassName: safeSclassName,
      school: safeAdminID,
    }));

    const result = await Subject.insertMany(subjectsToInsert);
    return res.status(201).json(result);

  } catch (err) {
    console.error("Subject creation error:", err);
    return res.status(500).json({ message: "Error creating subjects", error: err.message });
  }
};

const allSubjects = async (req, res) => {
  try {
    const schoolID = req.params.id.trim();

    const subjects = await Subject.find({ school: schoolID }).populate("sclassName", "sclassName");
    if (!subjects.length) return res.status(404).json({ message: "No subjects found" });

    return res.status(200).json(subjects);

  } catch (err) {
    console.error("Get all subjects error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const classSubjects = async (req, res) => {
  try {
    const classID = req.params.id.trim();

    const subjects = await Subject.find({ sclassName: classID });
    if (!subjects.length) return res.status(404).json({ message: "No subjects found" });

    return res.status(200).json(subjects);

  } catch (err) {
    console.error("Get class subjects error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const freeSubjectList = async (req, res) => {
  try {
    const classID = req.params.id.trim();

    const subjects = await Subject.find({ sclassName: classID, teacher: { $exists: false } });
    if (!subjects.length) return res.status(404).json({ message: "No free subjects found" });

    return res.status(200).json(subjects);

  } catch (err) {
    console.error("Free subjects error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getSubjectDetail = async (req, res) => {
  try {
    const subjectID = req.params.id.trim();

    const subject = await Subject.findById(subjectID)
      .populate("sclassName", "sclassName")
      .populate("teacher", "name");

    if (!subject) return res.status(404).json({ message: "No subject found" });

    return res.status(200).json(subject);

  } catch (err) {
    console.error("Get subject detail error:", err);
    if (err.kind === 'ObjectId') return res.status(400).json({ message: "Invalid subject ID" });
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteSubject = async (req, res) => {
  try {
    const subjectID = req.params.id.trim();

    const deletedSubject = await Subject.findByIdAndDelete(subjectID);
    if (!deletedSubject) return res.status(404).json({ message: "Subject not found" });

    // Remove subject from Teachers
    await Teacher.updateOne(
      { teachSubject: deletedSubject._id },
      { $unset: { teachSubject: "" } }
    );

    // Remove subject references from Students
    await Student.updateMany(
      {},
      {
        $pull: {
          examResult: { subName: deletedSubject._id },
          attendance: { subName: deletedSubject._id },
        }
      }
    );

    return res.status(200).json(deletedSubject);

  } catch (err) {
    console.error("Delete subject error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteSubjects = async (req, res) => {
  try {
    const schoolID = req.params.id.trim();

    const subjectsToDelete = await Subject.find({ school: schoolID });
    const subjectIds = subjectsToDelete.map(s => s._id);

    const result = await Subject.deleteMany({ school: schoolID });
    if (result.deletedCount === 0) return res.status(404).json({ message: "No subjects found to delete" });

    await Teacher.updateMany(
      { teachSubject: { $in: subjectIds } },
      { $unset: { teachSubject: "" } }
    );

    await Student.updateMany(
      {},
      { $pull: { examResult: { subName: { $in: subjectIds } }, attendance: { subName: { $in: subjectIds } } } }
    );

    return res.status(200).json(result);

  } catch (err) {
    console.error("Delete subjects error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteSubjectsByClass = async (req, res) => {
  try {
    const classID = req.params.id.trim();

    const subjectsToDelete = await Subject.find({ sclassName: classID });
    const subjectIds = subjectsToDelete.map(s => s._id);

    const result = await Subject.deleteMany({ sclassName: classID });
    if (result.deletedCount === 0) return res.status(404).json({ message: "No subjects found for this class" });

    await Teacher.updateMany(
      { teachSubject: { $in: subjectIds } },
      { $unset: { teachSubject: "" } }
    );

    await Student.updateMany(
      { sclassName: classID },
      { $pull: { examResult: { subName: { $in: subjectIds } }, attendance: { subName: { $in: subjectIds } } } }
    );

    return res.status(200).json(result);

  } catch (err) {
    console.error("Delete subjects by class error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  subjectCreate,
  freeSubjectList,
  classSubjects,
  getSubjectDetail,
  deleteSubjectsByClass,
  deleteSubjects,
  deleteSubject,
  allSubjects
};
