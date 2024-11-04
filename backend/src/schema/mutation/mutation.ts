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

  // レシピを更新するためのリゾルバ
  updateRecipe: async (
    _: unknown,
    {
      input,
    }: {
      input: {
        id: number;
        name: string;
        description?: string;
        ingredients: Array<{
          ingredientId: number;
          quantity: number;
        }>;
      };
    },
  ) => {
    try {
      // トランザクションを使用して、レシピと材料を一緒に更新
      return await prisma.$transaction(async (tx) => {
        // 既存のレシピを更新
        const updatedRecipe = await tx.recipe.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            // 一旦既存の材料関連をすべて削除
            recipeIngredients: {
              deleteMany: {},
            },
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

        // 新しい材料関連を作成
        await tx.recipeIngredient.createMany({
          data: input.ingredients.map((ing) => ({
            recipeId: updatedRecipe.id,
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
          })),
        });

        // 更新後のレシピを取得して返す
        return await tx.recipe.findUnique({
          where: { id: input.id },
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
      });
    } catch (error) {
      console.error('Recipe update error:', error);
      throw new Error('レシピの更新に失敗しました');
    }
  },
  // レシピを削除するためのリゾルバ
  deleteRecipe: async (_: unknown, { id }: { id: number }) => {
    try {
      // トランザクションを使用して、関連データと共に削除
      return await prisma.$transaction(async (tx) => {
        // 削除前のレシピ情報を取得
        const recipe = await tx.recipe.findUnique({
          where: { id },
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

        if (!recipe) {
          throw new Error('Recipe not found');
        }

        // 関連するrecipeIngredientsを削除
        await tx.recipeIngredient.deleteMany({
          where: {
            recipeId: id,
          },
        });

        // 次に、レシピ自体を削除
        await tx.recipe.delete({
          where: { id },
        });

        return recipe;
      });
    } catch (error) {
      console.error('Recipe deletion error:', error);
      throw new Error('レシピの削除に失敗しました');
    }
  },
};
