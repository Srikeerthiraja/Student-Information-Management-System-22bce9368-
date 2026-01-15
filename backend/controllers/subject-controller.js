const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

const subjectCreate = async (req, res) => {
    try {
        const { subjects, sclassName, adminID } = req.body;

        // Extract all subCodes from the input
        const subCodes = subjects.map(s => s.subCode);

        // Check if any of these subCodes already exist in this school
        const existingSubject = await Subject.findOne({
            subCode: { $in: subCodes },
            school: adminID,
        });

        if (existingSubject) {
            return res.status(400).send({ message: `Subject code ${existingSubject.subCode} already exists.` });
        }

        const subjectsToInsert = subjects.map((subject) => ({
            ...subject,
            sclassName,
            school: adminID,
        }));

        const result = await Subject.insertMany(subjectsToInsert);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).json({ message: "Error creating subjects", error: err.message });
    }
};

const allSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ school: req.params.id })
            .populate("sclassName", "sclassName");
        
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.status(404).send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ sclassName: req.params.id });
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.status(404).send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeSubjectList = async (req, res) => {
    try {
        // Find subjects where no teacher is assigned
        let subjects = await Subject.find({ sclassName: req.params.id, teacher: { $exists: false } });
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.status(404).send({ message: "No free subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        let subject = await Subject.findById(req.params.id)
            .populate("sclassName", "sclassName")
            .populate("teacher", "name");
        
        if (subject) {
            res.send(subject);
        } else {
            res.status(404).send({ message: "No subject found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // 1. Remove subject from Teachers
        await Teacher.updateOne(
            { teachSubject: deletedSubject._id },
            { $unset: { teachSubject: "" } }
        );

        // 2. Remove subject specific data from all students
        await Student.updateMany(
            {},
            { 
                $pull: { 
                    examResult: { subName: deletedSubject._id },
                    attendance: { subName: deletedSubject._id }
                } 
            }
        );

        res.send(deletedSubject);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjects = async (req, res) => {
    try {
        // Find subjects first to get IDs (deleteMany doesn't return them)
        const subjectsToDelete = await Subject.find({ school: req.params.id });
        const subjectIds = subjectsToDelete.map(sub => sub._id);

        const result = await Subject.deleteMany({ school: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "No subjects found to delete" });
        }

        // Clean up Teachers
        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $unset: { teachSubject: "" } }
        );

        // Clean up Students (Pull only the specific deleted subjects)
        await Student.updateMany(
            {},
            { 
                $pull: { 
                    examResult: { subName: { $in: subjectIds } },
                    attendance: { subName: { $in: subjectIds } }
                } 
            }
        );

        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const subjectsToDelete = await Subject.find({ sclassName: req.params.id });
        const subjectIds = subjectsToDelete.map(sub => sub._id);

        const result = await Subject.deleteMany({ sclassName: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "No subjects found for this class" });
        }

        // Clean up Teachers
        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $unset: { teachSubject: "" } }
        );

        // Clean up Students
        await Student.updateMany(
            { sclassName: req.params.id }, // Only target students of that class
            { 
                $pull: { 
                    examResult: { subName: { $in: subjectIds } },
                    attendance: { subName: { $in: subjectIds } }
                } 
            }
        );

        res.send(result);
    } catch (error) {
        res.status(500).json(error);
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
