const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const { z } = require('zod');
const User = require('../models/userSchema.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
});

userRouter.post('/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        console.log(req.body);
        userSchema.parse(req.body);
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.put('/updatePassword', async (req, res) => {
    try {
        const { password, confirmPassword, currentPassword } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid current password' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(req.userId, { password: hashedPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = userRouter;
