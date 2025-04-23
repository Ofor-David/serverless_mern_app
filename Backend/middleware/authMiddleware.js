import express from "express";
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";
import asyncHandler from 'express-async-handler'

const authMiddleware = asyncHandler(async (req, res, next) => {

    let token;
    //check for token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded) {
            const user = await User.findById(decoded.id)
            if (!user) {
                res.status(404).json({ msg: 'user not found' })
            } else {
                req.user = await User.findById(decoded.id).select('-password')
                next()
            }
        } else {
            res.status(404).json({ msg: 'NOT AUTHORIZED' })
        }

    } else {
        res.status(401).json({ msg: 'unauthorized: no token provied or expired token' })
    }
})

export default authMiddleware