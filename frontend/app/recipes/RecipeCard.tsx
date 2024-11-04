// RecipeCard.tsx
import { Card, CardHeader, CardBody, Heading, Text } from '@chakra-ui/react';
import { GetUserRecipesQuery } from '@/src/generated/graphql';

// RecipeCardのProps型定義
export type RecipeCardProps = {
  recipe: NonNullable<
    NonNullable<GetUserRecipesQuery['recipesByUserId']>[number]
  >;
};

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card cursor="pointer" _hover={{ shadow: 'md' }} transition="all 0.2s">
      <CardHeader>
        <Heading size="md">{recipe.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text noOfLines={2} color="gray.600">
          {recipe.description || '説明なし'}
        </Text>
      </CardBody>
    </Card>
  );
}

export default RecipeCard;
