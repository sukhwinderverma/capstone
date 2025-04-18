import express from "express";
import { ApolloServer } from "apollo-server-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { resolvers } from "./graphql/resolvers/resolver.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: [process.env.CORS_ORIGIN, "https://capstone-frontend-5ide.onrender.com"],
  credentials: true,
}));

app.use(express.json());

const typeDefs = fs.readFileSync(
  path.join(__dirname, "graphql/schemas/schema.graphql"),
  "utf-8"
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ headers: req.headers }),
    cache: "bounded",
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const port = process.env.PORT || 4005;

  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`);
  });
};

startServer();

process.on('SIGINT', async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
