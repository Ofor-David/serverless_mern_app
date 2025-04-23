import express from 'express'
import { registerUser, loginUser, getUserProfile, deleteUser } from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const userRoute = express.Router()

userRoute.post('/register', registerUser)
userRoute.post('/login', loginUser)
userRoute.get('/profile', authMiddleware, getUserProfile)
userRoute.delete('/profile', authMiddleware, deleteUser)

export default userRoute