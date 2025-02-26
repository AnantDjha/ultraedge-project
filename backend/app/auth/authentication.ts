import { UserType } from "../../lib/types";
import jwt from "jsonwebtoken"

const secretKey = process.env.JWT_SECRET || "any_other"

export const createJwt = (data: UserType): string | null => {

    return jwt.sign({
        name: data.name,
        email: data.email,
        phone: data.phone
    },
        secretKey,
        { expiresIn: "1d" }
    );


};

export const verifyJWT = (token: string): boolean => {
    jwt.verify(token, secretKey, (err, user) => {
        if (err)
            return null
    });
    return true;
}