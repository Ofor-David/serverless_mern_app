import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import Task from "../models/taskModel.js";

//register
export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body
    //check for all fields
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('please fill in all fields')
    } else {

        //check if user already exists
        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({ msg: 'User already exists, Login instead' })
        } else {
            //hash passowrd
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = await User.create({ name: name, email: email, password: hashedPassword })
            //verify user created successfully
            if (user) {
                return res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                })
            } else {
                res.status(400)
                throw new Error('invalid user data')
            }
        }
    }


});

//login
export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    //authenticate
    if (user && (await bcrypt.compare(password, user.password))) {

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        return res.status(400).json({ msg: 'invalid credentials, register instead' })
    }

})

//get me
export const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    if (user) {
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        return res.status(400).json({ msg: 'invalid credentials' })
    }

})

//delete user
export const deleteUser = asyncHandler(async (req, res) => {

    await User.findByIdAndDelete(req.user._id)
    await Task.deleteMany({ user: req.user._id })
    return res.status(200).json({ msg: 'user deleted successfuly' })

})
//generate JWT

function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })

}
