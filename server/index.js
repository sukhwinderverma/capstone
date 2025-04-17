import express from "express";
import { ApolloServer } from "apollo-server-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { resolvers } from "./graphql/resolvers/resolver.js";

dotenv.config();  // Load environment variables

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Set up CORS
app.use(cors({
  origin: ["https://capstone-frontend-5ide.onrender.com", "http://localhost:3000"], // Adjust as per your setup
  credentials: true,
}));

app.use(express.json());

// Load GraphQL schema file
const typeDefs = fs.readFileSync(
  path.join(__dirname, "graphql/schemas/schema.graphql"),
  "utf-8"
);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ headers: req.headers }),
  cache: "bounded",
});

await server.start();
server.applyMiddleware({ app, path: "/graphql" });

// Start the server
const port = process.env.PORT || 4005;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`);
});
