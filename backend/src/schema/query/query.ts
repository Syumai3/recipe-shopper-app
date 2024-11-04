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
                unit: true,
              },
            },
          },
        },
      },
    });
  },

  // ユーザーIDに基づいてレシピを取得する新しいリゾルバー
  recipesByUserId: async (_: unknown, { userId }: { userId: string }) => {
    return prisma.recipe.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        recipeIngredients: {
          include: {
            ingredient: {
              include: {
                unit: true,
              },
            },
          },
        },
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

  // レシピから買い物リストを生成するリゾルバ
  myShoppingList: async (
    _: unknown,
    { recipeIds, servings }: { recipeIds: number[]; servings: number[] },
  ) => {
    const recipes = await prisma.recipe.findMany({
      where: {
        id: { in: recipeIds },
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: {
              include: {
                unit: true,
              },
            },
          },
        },
      },
    });

    // 材料ごとに数量を集計
    const ingredientTotals = new Map();

    recipes.forEach((recipe, index) => {
      recipe.recipeIngredients.forEach((ri) => {
        const key = ri.ingredient.id;
        const currentTotal = ingredientTotals.get(key) || {
          ingredient: ri.ingredient,
          totalQuantity: 0,
        };
        currentTotal.totalQuantity += ri.quantity * servings[index];
        ingredientTotals.set(key, currentTotal);
      });
    });

    return Array.from(ingredientTotals.values());
  },
};
