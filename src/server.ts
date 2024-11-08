import { ApolloServer } from "apollo-server-express";
import express from "express";
import { readFileSync } from "fs";
import resolvers from "./resolvers";
import { config } from "dotenv";
import { PubSub } from "graphql-subscriptions";
import graphqlPlayground from "graphql-playground-middleware-express";

config();

const typeDefs = readFileSync("src/schema.graphql", "utf8");
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.APOLLO_INTROSPECTION === "true",
  context: () => ({ pubsub }),
});

const app = express();
const PORT = process.env.PORT || 4000;

server.start().then(() => {
  server.applyMiddleware({ app });

  // Manually add a route for the old Playground
  if (process.env.APOLLO_PLAYGROUND === "true") {
    app.get("/playground", graphqlPlayground({ endpoint: "/graphql" }));
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    if (process.env.APOLLO_PLAYGROUND === "true") {
      console.log(`🎮 Playground available at http://localhost:${PORT}/playground`);
    }
  });
});
