import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export const Recipe = {
	// 特定のレシピを作成したユーザーを取得するためのリゾルバ
	Recipe: {
		createdBy: async (parent: { userId: number }) => {
			return prisma.user.findUnique({
				where: { id: parent.userId },
			});
		},
	},
};
