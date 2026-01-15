const Complain = require('../models/complainSchema.js');

const complainCreate = async (req, res) => {
  try {
    const { title, description, user, school } = req.body;

    if (!title || !description || !user || !school) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complain = new Complain({
      title: title.trim(),
      description: description.trim(),
      user,
      school
    });

    const result = await complain.save();
    return res.status(201).json(result);

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const complainList = async (req, res) => {
  try {
    const schoolId = req.params.id.trim();

    const complains = await Complain.find({ school: schoolId }).populate("user", "name");

    if (!complains.length) {
      return res.status(404).json({ message: "No complains found" });
    }

    return res.status(200).json(complains);

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  complainCreate,
  complainList
};
