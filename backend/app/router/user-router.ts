import express from "express"
import { loginUser, signupUser } from "../controller/user-controller";

const userRouter = express.Router();

userRouter.post("/", signupUser);
userRouter.post("/login", loginUser);

export default userRouter;