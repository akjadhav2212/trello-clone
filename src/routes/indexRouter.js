const express = require('express');
const indexRouter = express.Router();
const projectRouter = require('./projectRouter');
const userRouter = require('./userRouter');
const taskRouter = require('./taskRouter');

indexRouter.use('/user',userRouter);
indexRouter.use('/project',projectRouter);
indexRouter.use('/task', taskRouter);

module.exports = indexRouter