'use client';
import { useSession } from 'next-auth/react';
import { Box, Heading, useToast, Text } from '@chakra-ui/react';
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

  if (status === 'unauthenticated') {
    return (
      <Box
        p={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="200px"
        textAlign="center"
      >
        <Heading size="md" mb={4} color="gray.600">
          レシピを作成するにはログインが必要です
        </Heading>
      </Box>
    );
  }

  // ローディング中の表示
  if (status === 'loading') {
    return (
      <Box p={5}>
        <Text>読み込み中...</Text>
      </Box>
    );
  }

  return (
    <Box w={{ base: '100%', md: '600px' }} m={5}>
      <RecipeForm
        onSubmit={handleSubmit}
        isLoading={loading}
        submitButtonText="登録"
      />
    </Box>
  );
}

export default CreateRecipe;
