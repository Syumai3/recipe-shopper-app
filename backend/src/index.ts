import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";

const server = new ApolloServer({
	typeDefs,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 4001 },
});

console.log(`Server ready at: ${url}`);
