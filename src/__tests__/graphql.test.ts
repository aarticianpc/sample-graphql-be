import request from "supertest";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { readFileSync } from "fs";
import resolvers from "../resolvers";

// Create a server instance for testing
let app: express.Application;

const resources: { id: string; name: string; type: string }[] = [];

beforeEach(() => {
  // Clear the resources array before each test if needed
  resources.length = 0;
});

beforeAll(async () => {
  app = express();

  const server = new ApolloServer({
    typeDefs: readFileSync("src/schema.graphql", "utf8"),
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
});

// Example test cases
describe("GraphQL API Tests", () => {
  // Test a query
  it("fetches existing resources", async () => {
    const query = `
      query {
        resources {
          id
          name
          type
        }
      }
    `;
    const response = await request(app)
      .post("/graphql")
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.resources).toBeInstanceOf(Array); // Check if it's an array
  });

  // Test a mutation
  it("adds a new resource", async () => {
    const mutation = `
      mutation AddResource($name: String!, $type: String!, $status: String!) {
        addResource(name: $name, type: $type, status: $status) {
          id
          name
          type
          status
        }
      }
    `;
  
    const variables = {
      name: "Test Resource",
      type: "exampleType",
      status: "available"
    };
  
    const response = await request(app)
      .post("/graphql")
      .send({ query: mutation, variables });
  
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.addResource).toHaveProperty("id");
    expect(response.body.data.addResource.name).toBe("Test Resource");
    expect(response.body.data.addResource.type).toBe("exampleType");
    expect(response.body.data.addResource.status).toBe("available");
  });
});

