import { createServer } from "./server";
import "dotenv/config";
import { MongoClient, Db } from "mongodb";
import nodemailer from "nodemailer";
import {
  signup,
  resetPassword,
  getUserFromEmail,
  login,
  forgotPassword,
} from "./controllers/auth";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

const port = process.env.PORT || 3001;
const server = createServer();

let db: Db;

export const connectToDatabase = async () => {
  if (!db) {
    await client.connect();
    db = client.db("chess-game");
  }
  return db;
};

// Function to verify the database connection
const verifyDbConnection = async () => {
  try {
    const db = await connectToDatabase();
    await db.command({ ping: 1 });
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.log("Failed to connect to the database");
    console.log(error);
    process.exit(1); // Exit the process with failure
  }
};

// Helper function to send email
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  });
};

// Signup endpoint
server.post("/auth/v1/signup", signup);

// Login endpoint
server.post("/auth/v1/login", login);

// Forgot password endpoint
server.post("/auth/v1/forgot-password", forgotPassword);

server.post("/auth/v1/getUserFromEmail", getUserFromEmail);

// Reset password endpoint
server.post("/auth/v1/reset-password/:token", resetPassword);

server.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(port, async () => {
  await verifyDbConnection(); // Verify the database connection
  console.log(`API running on ${port}`);
});
