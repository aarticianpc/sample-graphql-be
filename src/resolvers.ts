import { PubSub } from "graphql-subscriptions";
import { v4 as uuidv4 } from 'uuid';

const pubsub = new PubSub();

interface Resource {
  id: string;
  name: string;
  type: string;
  status: string;
}

const resources: Resource[] = [
  { id: "1", name: "Compute Engine", type: "VM", status: "running" },
  { id: "2", name: "Storage Bucket", type: "Storage", status: "available" },
];

const resolvers = {
  Query: {
    resources: (_: any, { filter, search }: { filter?: string; search?: string }) => {
      return resources.filter((resource) => {
        const matchesFilter = filter ? resource.type === filter : true;
        const matchesSearch = search ? resource.name.toLowerCase().includes(search.toLowerCase()) : true;
        return matchesFilter && matchesSearch;
      });
    },
  },
  Mutation: {
    addResource: (_: any, { name, type, status }: { name: string; type: string, status: string }) => {
      const newResource = { id: uuidv4(), name, type, status };
      resources.push(newResource); // Assuming `resources` is an in-memory array
      return newResource;
    },
  },
  Subscription: {
    resourceUpdated: {
      subscribe: () => pubsub.asyncIterator("RESOURCE_UPDATED"),
    },
  },
};

export default resolvers;

