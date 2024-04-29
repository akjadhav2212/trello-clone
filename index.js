//write express backend
const express = require('express');
const cors = require('cors')
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/db/db');
connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const indexRouter = require('./src/routes/indexRouter');
app.use('/api/v1',indexRouter);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
