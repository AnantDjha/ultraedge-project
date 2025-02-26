import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    attempts: { type: Number, required: true }
})

export const UserCollection = mongoose.model(
    "usercollection",
    userSchema
)

