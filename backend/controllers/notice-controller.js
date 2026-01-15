const Notice = require('../models/noticeSchema.js');

const noticeCreate = async (req, res) => {
  try {
    const { title, description, adminID } = req.body;

    if (!title || !description || !adminID) {
      return res.status(400).json({ message: "Title, description, and admin ID are required" });
    }

    const notice = new Notice({
      title: title.trim(),
      description: description.trim(),
      school: adminID.trim()
    });

    const result = await notice.save();
    return res.status(201).json(result);

  } catch (err) {
    console.error("Notice create error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const noticeList = async (req, res) => {
  try {
    const schoolId = req.params.id.trim();

    const notices = await Notice.find({ school: schoolId });
    if (!notices.length) {
      return res.status(404).json({ message: "No notices found" });
    }

    return res.status(200).json(notices);

  } catch (err) {
    console.error("Notice list error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const noticeId = req.params.id.trim();
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();

    const result = await Notice.findByIdAndUpdate(
      noticeId,
      { $set: updateData },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Notice not found" });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error("Update notice error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const noticeId = req.params.id.trim();

    const result = await Notice.findByIdAndDelete(noticeId);
    if (!result) {
      return res.status(404).json({ message: "Notice not found" });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error("Delete notice error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteNotices = async (req, res) => {
  try {
    const schoolId = req.params.id.trim();

    const result = await Notice.deleteMany({ school: schoolId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notices found to delete" });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error("Delete notices error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  noticeCreate,
  noticeList,
  updateNotice,
  deleteNotice,
  deleteNotices
};
