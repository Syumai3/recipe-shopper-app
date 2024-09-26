import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Mutation = {
	// ユーザーを作成するためのリゾルバ
	createUser: async (
		_: unknown,
		{ input }: { input: { username: string; email: string; password: string } },
	) => {
		return prisma.user.create({
			data: input,
		});
	},
	// レシピを作成するためのリゾルバ
	createRecipe: async (
		_: unknown,
		{
			name,
			description,
			ingredients,
			userId,
		}: {
			name: string;
			description: string;
			ingredients: Array<{
				ingredientId: number;
				quantity: number;
				unit: string;
			}>;
			userId: string;
		},
	) => {
		return prisma.recipe.create({
			data: {
				name,
				description,
				user: { connect: { id: Number.parseInt(userId) } },
				recipeIngredients: {
					create: ingredients.map((ingredient) => ({
						ingredient: { connect: { id: ingredient.ingredientId } },
						quantity: ingredient.quantity,
						unit: ingredient.unit,
					})),
				},
			},
			include: {
				user: true,
				recipeIngredients: { include: { ingredient: true } },
			},
		});
	},
};
