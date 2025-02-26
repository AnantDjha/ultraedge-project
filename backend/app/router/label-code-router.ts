import express from "express"
import { validateCode } from "../controller/label-code";

const codeRouter = express.Router();

codeRouter.post("/", validateCode);

export default codeRouter;