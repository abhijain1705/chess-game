import { createServer } from "./server";
import { log } from "@repo/logger";
import { PrismaClient } from "@prisma/client";

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

server.listen(port, async () => {
  await verifyDbConnection(); // Verify the database connection
  log(`API running on ${port}`);
});
