import express from "express";
import { ApolloServer } from "apollo-server-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {} from "./model/dbconnection.js";
import { resolvers } from "./graphql/resolvers/resolver.js";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();


app.use(cors({
  origin: "https://capstone-frontend-5ide.onrender.com",
  credentials: true,
}));

app.use(express.json());

const typeDefs = fs.readFileSync(
  path.join(__dirname, "graphql/schemas/schema.graphql"),
  "utf-8"
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ headers: req.headers }),
});

await server.start();
server.applyMiddleware({ app, path: "/graphql" });

const port = process.env.PORT || 4005;
app.listen(port, () => {
  console.log(`🚀 GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`);
});
