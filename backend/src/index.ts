import { createServer } from "./server";
import { z } from "zod";
import { MongoClient, Db } from "mongodb";
// import { UserSchema, User } from "../schemas/user";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://abhijain3002:cgX2dtNunGiTMjgM@cluster0.llej5uj.mongodb.net/";
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

server.listen(port, async () => {
  await verifyDbConnection(); // Verify the database connection
  console.log(`API running on ${port}`);
});
