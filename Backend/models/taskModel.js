import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, "text is required"],
        }
    }, { timestamps: true })
const Task = mongoose.model("Task", taskSchema)
export default Task