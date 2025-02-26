import { Request, Response, NextFunction } from "express"
import { verifyJWT } from "./auth/authentication";

export const verifyToken = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const authHeader = request.headers.authorization as string;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            response.status(401).json({ type: "error", message: "Authorization token is missing" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyJWT(token);

        if (!decoded) {
            response.status(401).json({ type: "error", message: "Authotization unsuccessfull" });
            return;
        }

        next()
    }
    catch (e) {
        console.log(e);

        response.status(400).json({ success: "false", message: "Error while verification" })
    }
}