import { PrismaClient } from '@prisma/client';
import { MyContext } from '../../index.js';

const prisma = new PrismaClient();

type CreateRecipeInput = {
  name: string;
  description?: string;
  ingredients: {
    ingredientId: number;
    quantity: number;
  }[];
  userId: string;
};

export const Mutation = {
  // ユーザーを作成するためのリゾルバ
  createUser: async (
    _: unknown,
    { input }: { input: { id: string; username: string; email: string } },
  ) => {
    try {
      // 既存のユーザーを検索
      const existingUser = await prisma.user.findUnique({
        where: { id: input.id },
      });

      if (existingUser) {
        // 既存のユーザーが見つかった場合は更新
        return prisma.user.update({
          where: { id: input.id },
          data: {
            username: input.username,
            email: input.email,
          },
        });
      }

      // 新規ユーザーの作成
      return prisma.user.create({
        data: {
          id: input.id, // Google認証から取得したIDを使用
          username: input.username,
          email: input.email,
        },
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },
  // レシピを作成するためのリゾルバ
  createRecipe: async (
    _: unknown,
    { input }: { input: CreateRecipeInput },
    context: MyContext,
  ) => {
    return context.prisma.recipe.create({
      data: {
        name: input.name,
        description: input.description || '',
        user: { connect: { id: input.userId } },
        recipeIngredients: {
          create: input.ingredients.map((ing) => ({
            quantity: ing.quantity,
            ingredient: { connect: { id: ing.ingredientId } },
          })),
        },
      },
      include: {
        user: true,
        recipeIngredients: {
          include: { ingredient: { include: { unit: true } } },
        },
      },
    });
  },
};
