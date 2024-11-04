// pages/CreateRecipe.tsx
'use client';
import { useSession } from 'next-auth/react';
import { Box, useToast } from '@chakra-ui/react';
import { useCreateRecipeMutation } from '@/src/generated/graphql';
import { RecipeForm, RecipeFormData } from '../components/RecipeForm';

function CreateRecipe() {
  const { data: session, status } = useSession();
  const toast = useToast();
  const [createRecipe, { loading }] = useCreateRecipeMutation();

  const handleSubmit = async (formData: RecipeFormData) => {
    if (!session?.user?.id) {
      toast({
        title: 'ログインが必要です',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await createRecipe({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            userId: session.user.id,
            ingredients: formData.ingredients.map((ingredient) => ({
              ingredientId: ingredient.id!,
              quantity: ingredient.quantity,
            })),
          },
        },
      });

      if (result.data) {
        toast({
          title: 'レシピを作成しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('レシピ作成エラー:', error);
    }
  };

  // 非ログイン時とローディング時の表示は同じ
  if (status === 'unauthenticated') {
    return (
      <Box p={10}>
        <Box fontSize="lg" mb={4}>
          レシピを作成するにはログインが必要です
        </Box>
      </Box>
    );
  }

  return (
    <Box w="600px" m={5}>
      <RecipeForm
        onSubmit={handleSubmit}
        isLoading={loading}
        submitButtonText="登録"
      />
    </Box>
  );
}

export default CreateRecipe;
