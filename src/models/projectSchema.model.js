const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;