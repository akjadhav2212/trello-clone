const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  dueDate: { type: Date },
  status: { type: String, enum: ["todo", "doing", "done"], default: "todo" }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task