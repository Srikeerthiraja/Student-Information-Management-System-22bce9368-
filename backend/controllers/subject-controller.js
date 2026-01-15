const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        }));

        // Check if any subject code already exists
        const existingSubjectBySubCode = await Subject.findOne({
            subCode: subjects[0].subCode,
            school: req.body.adminID,
        });

        if (existingSubjectBySubCode) {
            return res.status(400).json({ message: 'Sorry this subcode must be unique as it already exists' });
        }

        const newSubjects = subjects.map((subject) => ({
            ...subject,
            sclassName: req.body.sclassName,
            school: req.body.adminID,
        }));

        const result = await Subject.insertMany(newSubjects);
        return res.status(201).json(result);

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const allSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ school: req.params.id })
            .populate("sclassName", "sclassName");
        
        if (subjects.length > 0) {
            return res.status(200).json(subjects);
        } else {
            return res.status(404).json({ message: "No subjects found" });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const classSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ sclassName: req.params.id });
        
        if (subjects.length > 0) {
            return res.status(200).json(subjects);
        } else {
            return res.status(404).json({ message: "No subjects found" });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const freeSubjectList = async (req, res) => {
    try {
        const subjects = await Subject.find({ 
            sclassName: req.params.id, 
            teacher: { $exists: false } 
        });
        
        if (subjects.length > 0) {
            return res.status(200).json(subjects);
        } else {
            return res.status(404).json({ message: "No subjects found" });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        let subject = await Subject.findById(req.params.id);
        
        if (subject) {
            subject = await subject.populate("sclassName", "sclassName");
            subject = await subject.populate("teacher", "name");
            return res.status(200).json(subject);
        } else {
            return res.status(404).json({ message: "No subject found" });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Set the teachSubject field to null in teachers (fixed duplicate $unset)
        await Teacher.updateMany(
            { teachSubject: deletedSubject._id },
            { $unset: { teachSubject: "" } }
        );

        // Remove the objects containing the deleted subject from students' examResult array
        await Student.updateMany(
            {},
            { $pull: { examResult: { subName: deletedSubject._id } } }
        );

        // Remove the objects containing the deleted subject from students' attendance array
        await Student.updateMany(
            {},
            { $pull: { attendance: { subName: deletedSubject._id } } }
        );

        return res.status(200).json({ message: "Subject deleted successfully", data: deletedSubject });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteSubjects = async (req, res) => {
    try {
        // First get all subjects to be deleted
        const subjectsToDelete = await Subject.find({ school: req.params.id });

        if (subjectsToDelete.length === 0) {
            return res.status(404).json({ message: "No subjects found to delete" });
        }

        const subjectIds = subjectsToDelete.map(subject => subject._id);

        // Delete all subjects
        const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

        // Set the teachSubject field to null in teachers (fixed duplicate $unset)
        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $unset: { teachSubject: "" } }
        );

        // Set examResult and attendance to null in all students
        await Student.updateMany(
            { school: req.params.id },
            { $set: { examResult: [], attendance: [] } }
        );

        return res.status(200).json({ 
            message: "All subjects deleted successfully", 
            deletedCount: deletedSubjects.deletedCount 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        // First get all subjects to be deleted
        const subjectsToDelete = await Subject.find({ sclassName: req.params.id });

        if (subjectsToDelete.length === 0) {
            return res.status(404).json({ message: "No subjects found to delete" });
        }

        const subjectIds = subjectsToDelete.map(subject => subject._id);

        // Delete all subjects
        const deletedSubjects = await Subject.deleteMany({ sclassName: req.params.id });

        // Set the teachSubject field to null in teachers (fixed duplicate $unset)
        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $unset: { teachSubject: "" } }
        );

        // Set examResult and attendance to empty arrays in students of this class
        await Student.updateMany(
            { sclassName: req.params.id },
            { $set: { examResult: [], attendance: [] } }
        );

        return res.status(200).json({ 
            message: "Class subjects deleted successfully", 
            deletedCount: deletedSubjects.deletedCount 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
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
