import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"


config();

const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser())

//cors setup
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);

if (!MONGO_URL) {
    console.error("MONGO_URL is not defined in .env file!");
    process.exit(1);
}

mongoose
    .connect(MONGO_URL)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((error) => {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process if DB connection fails
    });

// importing routes
import userRouter from "./router/user-router";
import codeRouter from "./router/label-code-router";
import { verifyToken } from "./middleware";

//creating routers 
app.use("/user", userRouter)
app.use("/api/code-validation", verifyToken, codeRouter)

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
