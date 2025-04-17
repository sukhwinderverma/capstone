import express from "express";
import { ApolloServer } from "apollo-server-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {} from "./model/dbconnection.js"; 
import { resolvers } from "./graphql/resolvers/resolver.js"; 
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(cors());

const typeDefs = fs.readFileSync(
  path.join(__dirname, "graphql/schemas/schema.graphql"),
  "utf-8"
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return { headers: req.headers };
    }
});

server.start().then(() => {
    server.applyMiddleware({ app, path: "/graphql" });
});

// No email sending logic anymore, so the email endpoint is removed

const port = process.env.PORT || 4005;

app.listen(port, () => {
    console.log(`GraphQL Server is running at http://localhost:${port}`);
});
