import express from 'express'
import { createTask, getTasks, getTaskbyID, updateTask, deleteTask } from '../controllers/taskController.js'
import authMiddleware   from '../middleware/authMiddleware.js'
const taskRoute = express.Router()

taskRoute.post('/', authMiddleware,createTask)
taskRoute.get('/:id',authMiddleware, getTaskbyID)
taskRoute.get('/', authMiddleware, getTasks)
taskRoute.put('/:id', authMiddleware, updateTask)
taskRoute.delete('/:id', authMiddleware, deleteTask)
export default taskRoute