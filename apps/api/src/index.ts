import { createServer } from "./server";
import { log } from "@repo/logger";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";

const prisma = new PrismaClient();

const port = process.env.PORT || 3001;
const server = createServer();

// Function to verify the database connection
const verifyDbConnection = async () => {
  try {
    // Run a simple query to check the connection
    await prisma.$connect();
    log("Connected to the database successfully!");
  } catch (error) {
    log("Failed to connect to the database");
    log(error);
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
      callbackURL: "http://localhost:3001/auth/twitter/callback",
    },
    function (token, tokenSecret, profile, done) {
      log(token);
      log(tokenSecret);
      log(profile);
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
  log(`API running on ${port}`);
});
