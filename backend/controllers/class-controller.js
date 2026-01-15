const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const sclassCreate = async (req, res) => {
    try {
        // Check if class already exists BEFORE creating instance
        const existingSclassByName = await Sclass.findOne({
            sclassName: req.body.sclassName,
            school: req.body.adminID
        });

        if (existingSclassByName) {
            return res.status(400).json({ message: 'Sorry this class name already exists' });
        }

        // Only create instance if it doesn't exist
        const sclass = new Sclass({
            sclassName: req.body.sclassName,
            school: req.body.adminID
        });

        const result = await sclass.save();
        return res.status(201).json(result);

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const sclassList = async (req, res) => {
    try {
        const sclasses = await Sclass.find({ school: req.params.id });
        
        if (sclasses.length > 0) {
            return res.status(200).json(sclasses);
        } else {
            return res.status(404).json({ message: "No sclasses found" });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getSclassDetail = async (req, res) => {
    try {
        let sclass = await Sclass.findById(req.params.id);
        
        if (sclass) {
            sclass = await sclass.populate("school", "schoolName");
            return res.status(200).json(sclass);
        } else {
            return res.status(404).json({ message: "No class found" });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getSclassStudents = async (req, res) => {
    try {
        const students = await Student.find({ sclassName: req.params.id });
        
        if (students.length > 0) {
            const modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            return res.status(200).json(modifiedStudents);
        } else {
            return res.status(404).json({ message: "No students found" });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
        
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Delete all related data
        await Student.deleteMany({ sclassName: req.params.id });
        await Subject.deleteMany({ sclassName: req.params.id });
        await Teacher.deleteMany({ teachSclass: req.params.id });

        return res.status(200).json({ message: "Class deleted successfully", data: deletedClass });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
        
        if (deletedClasses.deletedCount === 0) {
            return res.status(404).json({ message: "No classes found to delete" });
        }

        // Delete all related data
        await Student.deleteMany({ school: req.params.id });
        await Subject.deleteMany({ school: req.params.id });
        await Teacher.deleteMany({ school: req.params.id });

        return res.status(200).json({ 
            message: "All classes deleted successfully", 
            deletedCount: deletedClasses.deletedCount 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { 
    sclassCreate, 
    sclassList, 
    deleteSclass, 
    deleteSclasses, 
    getSclassDetail, 
    getSclassStudents 
};
