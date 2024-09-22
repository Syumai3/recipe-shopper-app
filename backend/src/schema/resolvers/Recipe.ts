import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Recipe = {
	// 特定のレシピを作成したユーザーを取得するためのリゾルバ
	createdBy: async (parent: { userId: number }) => {
		return prisma.user.findUnique({
			where: { id: parent.userId },
		});
	},
};
