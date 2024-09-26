import { DateTimeResolver } from "graphql-scalars";
import { Mutation } from "./mutation/mutation.js";
import { Query } from "./query/query.js";
import { Recipe } from "./resolvers/Recipe.js";
import { User } from "./resolvers/User.js";

export const resolvers = {
	DateTime: DateTimeResolver,
	Query,
	Mutation,
	User,
	Recipe,
};
