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
  getUserFromName,
} from "./controllers/auth";
import { Server } from "socket.io";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

const port = process.env.PORT || 3001;
const { server, app } = createServer();
const io = new Server(server);

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

  const resetLink = `${process.env.UI_ROUTE}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<div>
        <h1>FORGOT PASSWORD</h1>
        <p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
     </div>`,
  });
};

// Signup endpoint
app.post("/auth/v1/signup", signup);

// Login endpoint
app.post("/auth/v1/login", login);

// Forgot password endpoint
app.post("/auth/v1/forgot-password", forgotPassword);

// get user from email
app.post("/auth/v1/getUserFromEmail", getUserFromEmail);

// get user from username
app.post("/auth/v1/getUserFromName", getUserFromName);

// Reset password endpoint
app.post("/auth/v1/reset-password/:token", resetPassword);

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(port, async () => {
  await verifyDbConnection(); // Verify the database connection
  console.log(`API running on ${port}`);
});
