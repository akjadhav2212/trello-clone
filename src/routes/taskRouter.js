const express = require('express');
const taskRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/taskSchema.model');
const Project = require('../models/projectSchema.model');  

//get all tasks in which user is a assignee
taskRouter.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ assignee: req.userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get all tasks for given project id
taskRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//create task in project only by project members
taskRouter.post('/',authMiddleware,async (req, res)=>{
    try {
        const project = await Project.findById(req.body.project);
        req.body.dueDate = new Date(req.body.dueDate);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this project' });
        }
        const task = new Task({...req.body});
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//update task in project only by project members
taskRouter.put('/',authMiddleware, async (req, res) => {
    try{
        const project = await Project.findById(req.body.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this project' });
        }
        const task = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });
        res.status(200).json(task);
    }
    catch(error){
        return res.send(error.message);
    }
})

//update the status of task in project only by assignee and project members
taskRouter.put('/updatestatus',authMiddleware, async (req, res) => {
    try{
        const task = await Task.findById(req.body.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const project = await Project.findById(task.project.toString());
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!task.assignee == req.userId && !project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }
        const updatedTask = await Task.findByIdAndUpdate(req.body.taskId, {status:req.body.status}, { new: true });
        res.status(200).json(updatedTask);
    }
    catch(error){
        return res.send(error.message);
    }
})

//delete task in project only by project members
taskRouter.delete('/',authMiddleware,async (req, res)=>{
    try {
        const project = await Project.findById(req.body.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }
        await Task.findByIdAndDelete(req.body.taskId);
        res.status(204).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports = taskRouter;