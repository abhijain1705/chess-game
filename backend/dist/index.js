"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.connectToDatabase = void 0;
const server_1 = require("./server");
require("dotenv/config");
const mongodb_1 = require("mongodb");
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_1 = require("./controllers/auth");
const uri = process.env.MONGODB_URI || "";
const client = new mongodb_1.MongoClient(uri);
const port = process.env.PORT || 3001;
const server = (0, server_1.createServer)();
let db;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!db) {
        yield client.connect();
        db = client.db("chess-game");
    }
    return db;
});
exports.connectToDatabase = connectToDatabase;
// Function to verify the database connection
const verifyDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, exports.connectToDatabase)();
        yield db.command({ ping: 1 });
        console.log("Connected to the database successfully!");
    }
    catch (error) {
        console.log("Failed to connect to the database");
        console.log(error);
        process.exit(1); // Exit the process with failure
    }
});
// Helper function to send email
const sendResetPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    yield transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        text: `Click the link to reset your password: ${resetLink}`,
        html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
// Signup endpoint
server.post("/auth/v1/signup", auth_1.signup);
// Login endpoint
server.post("/auth/v1/login", auth_1.login);
// Forgot password endpoint
server.post("/auth/v1/forgot-password", auth_1.forgotPassword);
// Reset password endpoint
server.post("/auth/v1/reset-password/:token", auth_1.resetPassword);
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield verifyDbConnection(); // Verify the database connection
    console.log(`API running on ${port}`);
}));
