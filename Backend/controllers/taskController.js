import mongoose from "mongoose"
import Task from "../models/taskModel.js"
import User from "../models/userModel.js"
import asyncHandler from "express-async-handler"

export const createTask = asyncHandler(async (req, res) => {

    const task = await Task.create({ text: req.body.text, user: req.user.id })
    return res.status(201).json(task)

})

export const getTasks = asyncHandler(async (req, res) => {

    const task = await Task.find({ user: req.user.id })

    if (!task) {
        return res.status(404).json({ msg: 'No tasks to display' })
    } else {
        return res.status(200).json(task)
    }


})

export const getTaskbyID = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!user) {
        return res.status(404).json({ msg: 'user not found' })
    }
    if (!task) {
        return res.status(404).json({ msg: 'task not found' })
    }
    return res.status(200).json(task)
})

export const updateTask = asyncHandler(async (req, res) => {


    const user = await User.findById(req.user.id)
    const task = await Task.findOne({ user: req.user.id, _id: req.params.id })

    if (!user) {
        return res.status(404).json({ msg: 'user not found' })
    }
    if (!task) {
        return res.status(404).json({ msg: 'task not found' })
    }

    const updatedTask = await Task.findOneAndUpdate({ user: req.user.id, _id: req.params.id }, req.body, { new: true, runValidators: true })
    return res.status(200).json(updatedTask)

})

export const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({ user: req.user.id, _id: req.params.id })
    const user = await User.findById(req.user.id)
    if (!task) {
        return res.status(404).json({ msg: 'task not found' })
    }
    if (!user) {
        return res.status(404).json({ msg: 'user not found' })
    }
    await Task.findOneAndDelete({ user: req.user.id, _id: req.params.id })
    return res.status(200).send('deleted task successfully')
})

