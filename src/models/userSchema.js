

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const userModel = mongoose.model("User", userSchema)