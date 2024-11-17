'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  SimpleGrid,
  Skeleton,
  Heading,
  Text,
  Stack,
} from '@chakra-ui/react';
import { useGetUserRecipesQuery } from '@/src/generated/graphql';
import RecipeCard from './RecipeCard';

function Recipes() {
  const { data: session, status } = useSession();
  const { data, loading, error } = useGetUserRecipesQuery({
    variables: {
      userId: session?.user?.id ?? '',
    },
    skip: !session?.user?.id,
  });

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
          レシピを確認するにはログインが必要です
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
  if (loading) {
    return (
      <Stack spacing={3} w="100%" maxW="1200px" mx="auto" p={5}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="200px" />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  if (!data?.recipesByUserId?.length) {
    return (
      <Box p={5}>
        <Text>まだレシピが登録されていません。</Text>
      </Box>
    );
  }

  return (
    <Stack spacing={3} w="100%" maxW="1200px" mx="auto" p={5}>
      <Box mb={6}>
        <Heading size="lg">マイレシピ一覧</Heading>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {data.recipesByUserId.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default Recipes;
