import { Request, Response } from "express"
import { UserCollection } from "../model/user-model";
import bcrypt from "bcrypt"
import { createJwt } from "../auth/authentication";

export const signupUser = async (request: Request, response: Response) => {
    try {
        console.log("chal raha");

        const { name, email, phone, password } = request.body;

        const alreadySignedUp = await UserCollection.findOne(
            { $or: [{ email: email }, { phone: phone }] }
        ).lean();

        if (alreadySignedUp) {
            response.status(200).json({ success: false, message: "User already exists" })
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserCollection(
            {
                name,
                email,
                phone,
                password: hashedPassword,
                attempts: 0
            }
        )
        const result = await newUser.save();

        if (result) {
            console.log("done");

            response.status(201).json({ success: true, message: "User registered successfully" });
            return;
        }

        throw new Error("Error submitting form")
    }
    catch (e) {
        console.log(e);
        response.status(500).json({ success: false, message: "Error submitting form" })
    }
}


export const loginUser = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body;

        const user = await UserCollection.findOne({ email });

        if (!user) {
            response.status(404).json({ success: false, message: "No user found" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            response.status(401).json({ success: false, message: "Invalid Password" });
            return;
        }

        const token = createJwt(user);

        response.status(200).json({
            success: true,
            message: "Login successful",
            user: user,
            token
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        response.status(500).json({ success: false, message: "Error submitting form" });
    }
};
