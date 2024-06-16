import { createServer } from "./server";
import { z } from "zod";
import "dotenv/config";
import { MongoClient, Db } from "mongodb";
import { UserSchema } from "./schemas/user";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

const port = process.env.PORT || 3001;
const server = createServer();

let db: Db;

const connectToDatabase = async () => {
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

// Helper function to hash passwords
const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to send email
const sendResetPasswordEmail = async (email: string, token: string) => {
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
server.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password, username, lastLogInDevice } = req.body;

  try {
    // Validate the input
    UserSchema.parse({ name, email, password, username, lastLogInDevice });

    // Connect to the database
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      username,
      score: 0,
      lastLogInDate: new Date(),
      lastLogInDevice,
      match_played: 0,
      match_failed: 0,
      match_win: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save the user to the database
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

server.post("/login", async (req: Request, res: Response) => {
  const { email, password, lastLogInDevice } = req.body;

  try {
    // Validate the input
    UserSchema.pick({ email: true, password: true }).parse({ email, password });

    // Connect to the database
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Update last login date and device
    await usersCollection.updateOne(
      { email },
      { $set: { lastLogInDate: new Date(), lastLogInDevice } }
    );

    // Store user information in the session (minimal info for session)
    req.session.user = { email: user.email, username: user.username };

    // Return the complete user data (excluding the password for security reasons)
    const { password: _, ...userWithoutPassword } = user;

    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot password endpoint
server.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Validate the email
    z.string().email().parse(email);

    // Connect to the database
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "No user found with this email" });
    }

    // Create a reset token
    const token = jwt.sign({ email }, process.env.JWT_SECRET ?? "", {
      expiresIn: "1h",
    });

    // Send the reset password email
    await sendResetPasswordEmail(email, token);

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password endpoint
server.post("/reset-password/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Validate the new password
    z.string().min(6).parse(newPassword);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
      email: string;
    };

    // Connect to the database
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user by email
    const user = await usersCollection.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    await usersCollection.updateOne(
      { email: decoded.email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(port, async () => {
  await verifyDbConnection(); // Verify the database connection
  console.log(`API running on ${port}`);
});
