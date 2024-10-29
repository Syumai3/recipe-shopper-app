import { PrismaClient } from '@prisma/client';
import { MyContext } from '../../index.js';

const prisma = new PrismaClient();

export const Query = {
  // 特定のユーザーを取得するためのリゾルバ
  user: async (_: unknown, { id }: { id: string }) => {
    return prisma.user.findUnique({
      where: { id },
      include: { recipes: true },
    });
  },
  // 全てのユーザーを取得するためのリゾルバ
  users: async () => {
    return prisma.user.findMany({
      include: { recipes: true },
    });
  },
  // 特定のレシピを取得するためのリゾルバ
  recipe: async (_: unknown, { id }: { id: string }) => {
    return prisma.recipe.findUnique({
      where: { id: Number.parseInt(id) },
      include: { user: true },
    });
  },
   // 全てのレシピを取得するためのリゾルバ
   recipes: async () => {
    return prisma.recipe.findMany({
      include: {
        user: true,
        recipeIngredients: {
          include: {
            ingredient: {
              include: {
                unit: true
              }
            }
          }
        }
      },
    });
  },
  // 材料を検索するためのリゾルバ
  searchIngredients: async (
    _: unknown,
    { searchTerm }: { searchTerm: string },
    context: MyContext,
  ) => {
    const ingredients = await context.prisma.ingredient.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      include: { unit: true },
    });
    return ingredients;
  },
};
