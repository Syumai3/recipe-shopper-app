import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export const User = {
	// 特定のユーザーのレシピを取得するためのリゾルバ
	User: {
		recipes: async (parent: { id: number }) => {
			return prisma.recipe.findMany({
				where: { userId: parent.id },
			});
		},
	},
};
