const express = require('express');
const projectRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Project = require('../models/projectSchema.model');
const { default: mongoose } = require('mongoose');
const sendEmail = require('../helper/sendMail');
const User = require('../models/userSchema.model')
//get all projects in which user is a member
projectRouter.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ members: req.userId });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get project by id in which user is a member
projectRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to view this project' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// create new project
projectRouter.post('/', authMiddleware,async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = new Project({name, description,members: [req.userId]});
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//update project
projectRouter.put('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this project' });
        }
        req.body.members = project.members;
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//update project members
projectRouter.put('/members/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this project' });
        }
        console.log(req.body.members)
        const updatedMembers = (project.members).concat(req.body.members.map((ele) => {
            return new mongoose.Types.ObjectId(ele);
        }));
        req.body.members.forEach(async(ele)=>{
            const usr = await User.findOne({_id:ele})
            if(usr){sendEmail(usr.email,'Welcome to the team', `Hello ${usr.name}!`, `You have been added to ${project.name} project`)}
        })

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, {$set: {members:updatedMembers}}, { new: true });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete project
projectRouter.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project.members.includes(req.userId)) {
            return res.status(403).json({ message: 'You are not authorized to delete this project' });
        }
        await Project.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = projectRouter;