import { PrismaClient } from '@prisma/client';
import { MyContext } from '../../index.js';
import { v4 as uuidv4 } from 'uuid';

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
    { input }: { input: { id:string, username: string; email: string } },
  ) => {
    return prisma.user.create({
      data: {
        id: uuidv4(),  // UUIDを自動生成
        username: input.username,
        email: input.email,
      },
    });
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
