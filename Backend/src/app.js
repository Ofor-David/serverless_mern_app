import express, { urlencoded } from 'express'
import mongoose from 'mongoose';
import taskRoute from '../routes/taskRoute.js';
import userRoute from '../routes/userRoute.js';
import logger from '../middleware/logger.js';
import cors from 'cors';
//consts
const port = process.env.port
const mongodb_url = process.env.mongodb_url
if (!mongodb_url) {
    console.log('no mongodb url provided in serverless.yaml file')
    process.exit(0)
}
//create server
const app = express();

//config accept json
app.use(express.json())
app.use(urlencoded({ extended: false }))

//use middleware
app.use(logger)

const corsOptions = {
    origin: process.env.frontend_url,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    credentials: true,  // Allow credentials (e.g., cookies, authorization headers)
};
// Enable CORS for all origins (you can restrict to a specific domain for security)
app.use(cors(corsOptions));



//use routes
app.use('/api/tasks', taskRoute)
app.use('/api/users', userRoute)

//Init server

async function connectDB() {
    try {
        await mongoose.connect(mongodb_url)
        console.log("connected to DB")
    } catch (error) {
        console.log(error)
    }
}
connectDB()

export default app
