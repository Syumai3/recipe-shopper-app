import { DateTimeResolver } from "graphql-scalars";
import { Recipe } from "./resolvers/Recipe.js";
import { User } from "./resolvers/User.js";
import { Mutation } from "./resolvers/mutation.js";
import { Query } from "./resolvers/query.js";

export const resolvers = {
	DateTime: DateTimeResolver,
	Query,
	Mutation,
	User,
	Recipe,
};
