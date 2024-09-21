import { PrismaClient } from "@prisma/client";
import { Recipe } from "./resolvers/Recipe.js";
import { User } from "./resolvers/User.js";
import { Mutation } from "./resolvers/mutation.js";
import { Query } from "./resolvers/query.js";

const prisma = new PrismaClient();

export const resolvers = {
	Query,
	Mutation,
	User,
	Recipe,
};
