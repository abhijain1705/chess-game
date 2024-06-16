import { createServer } from "./server";
import passport from "passport";
import { z } from "zod";
import { Strategy as TwitterStrategy } from "passport-twitter";
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

server.use(passport.initialize());
server.use(passport.session());

passport.use(
  new TwitterStrategy(
    {
      consumerKey: "ts1pZMITpFbnVbvlxQ0FEbK9K",
      consumerSecret: "IFrihOyiHPgkb9T6abc2ql2JBX8G9oQQ8nyC9jwVknOXlMr4To",
      callbackURL: "http://localhost:3000/auth/twitter/callback",
    },
    function (token, tokenSecret, profile, done) {
      console.log(token);
      console.log(tokenSecret);
      console.log(profile);
      // Here you can save the user's profile information to your database.
      // For example, you could save the user's Twitter ID, username, and email address.

      // Once you have saved the user's profile information, you can call the `done()` callback.
      // This will tell Passport that the authentication process is complete.

      done(null, profile);
    }
  )
);

server.get("/auth/twitter", passport.authenticate("twitter"));

server.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

server.listen(port, async () => {
  await verifyDbConnection(); // Verify the database connection
  console.log(`API running on ${port}`);
});
