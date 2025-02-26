import { Request, Response } from "express"
import { codeCollection } from "../model/code-model";
import { UserCollection } from "../model/user-model";

export const validateCode = async (request: Request, response: Response) => {
    try {
        const { code, email } = request.body;

        const attempts = await UserCollection.findOne({ email: email });

        if (attempts && attempts?.attempts >= 3) {
            response.status(401).json({ success: false, message: "Sorry! Maximum attempts reached" })
            return;
        }

        const result = await codeCollection.findOne({ code: code });

        if (!result) {
            await UserCollection.updateOne({ email: email }, { $set: { attempts: (attempts?.attempts || 0) + 1 } })
            response.status(404).json({ success: false, message: "Invalid Code" });
            return;
        }

        const random = Math.floor(1000 + Math.random() * 9000);

        await codeCollection.updateOne({ id: result.id }, { $set: { code: random } })
        await UserCollection.updateOne({ email: email }, { $set: { attempts: 0 } })

        response.status(200).json({ success: true, message: "SuccessFully authenticated" })
    }
    catch (e) {
        response.status(500).json({ success: false, message: "Something went wrong" })
    }
}