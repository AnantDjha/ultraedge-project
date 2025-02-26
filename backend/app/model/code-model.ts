import mongoose, { Schema } from "mongoose";


const codeSchema = new Schema({
    id: { type: Number, required: true },
    code: { type: String, required: true },
})

export const codeCollection = mongoose.model(
    "codeCollecton",
    codeSchema
)

