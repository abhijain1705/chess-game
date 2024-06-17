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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
const user_1 = require("../schemas/user");
const index_1 = require("../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
// Helper function to hash passwords
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return yield bcrypt_1.default.hash(password, saltRounds);
});
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password, username } = req.body;
        try {
            // Validate the input
            user_1.UserSchema.parse({
                name,
                email,
                password,
                username,
            });
            // Connect to the database
            const db = yield (0, index_1.connectToDatabase)();
            const usersCollection = db.collection("users");
            // Check if the user already exists
            const existingUser = yield usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists" });
            }
            // Hash the password
            const hashedPassword = yield hashPassword(password);
            // Create the new user
            const newUser = {
                name,
                email,
                password: hashedPassword,
                username,
                score: 0,
                lastLogInDate: new Date(),
                match_played: 0,
                match_failed: 0,
                match_win: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            // Save the user to the database
            yield usersCollection.insertOne(newUser);
            res.status(201).json({ message: "User created successfully" });
        }
        catch (error) {
            console.log(error, "error h bhai");
            res.status(500).json({ error: error.message });
        }
    });
}
exports.signup = signup;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            // Validate the input
            user_1.UserSchema.pick({ email: true, password: true }).parse({ email, password });
            // Connect to the database
            const db = yield (0, index_1.connectToDatabase)();
            const usersCollection = db.collection("users");
            // Find the user by email
            const user = yield usersCollection.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
            // Verify the password
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
            // Update last login date and device
            yield usersCollection.updateOne({ email }, {
                $set: { lastLogInDate: new Date() },
            });
            // Store user information in the session (minimal info for session)
            req.session.user = { email: user.email, username: user.username };
            // Return the complete user data (excluding the password for security reasons)
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            res
                .status(200)
                .json({ message: "Login successful", user: userWithoutPassword });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
exports.login = login;
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { email } = req.body;
        try {
            // Validate the email
            zod_1.z.string().email().parse(email);
            // Connect to the database
            const db = yield (0, index_1.connectToDatabase)();
            const usersCollection = db.collection("users");
            // Find the user by email
            const user = yield usersCollection.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "No user found with this email" });
            }
            // Create a reset token
            const token = jsonwebtoken_1.default.sign({ email }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
                expiresIn: "1h",
            });
            // Send the reset password email
            yield (0, index_1.sendResetPasswordEmail)(email, token);
            res.status(200).json({ message: "Reset password email sent" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
exports.forgotPassword = forgotPassword;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { token } = req.params;
        const { newPassword } = req.body;
        try {
            // Validate the new password
            zod_1.z.string().min(6).parse(newPassword);
            // Verify the token
            const decoded = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "");
            // Connect to the database
            const db = yield (0, index_1.connectToDatabase)();
            const usersCollection = db.collection("users");
            // Find the user by email
            const user = yield usersCollection.findOne({ email: decoded.email });
            if (!user) {
                return res.status(400).json({ error: "Invalid token" });
            }
            // Hash the new password
            const hashedPassword = yield hashPassword(newPassword);
            // Update the user's password
            yield usersCollection.updateOne({ email: decoded.email }, { $set: { password: hashedPassword, updatedAt: new Date() } });
            res.status(200).json({ message: "Password reset successful" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
exports.resetPassword = resetPassword;
