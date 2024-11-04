// components/EditRecipeDialog.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
} from '@chakra-ui/react';
import { RecipeForm, RecipeFormData } from './RecipeForm';
import { useUpdateRecipeMutation } from '@/src/generated/graphql';
import { GetUserRecipesQuery } from '@/src/generated/graphql';

type EditRecipeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  recipe: NonNullable<
    NonNullable<GetUserRecipesQuery['recipesByUserId']>[number]
  >;
};

export function EditRecipeDialog({
  isOpen,
  onClose,
  recipe,
}: EditRecipeDialogProps) {
  const toast = useToast();
  const [updateRecipe, { loading }] = useUpdateRecipeMutation();

  const handleSubmit = async (formData: RecipeFormData) => {
    try {
      const result = await updateRecipe({
        variables: {
          input: {
            id: recipe.id,
            name: formData.name,
            description: formData.description,
            ingredients: formData.ingredients.map((ingredient) => ({
              ingredientId: ingredient.id!,
              quantity: ingredient.quantity,
            })),
          },
        },
      });

      if (result.data) {
        toast({
          title: 'レシピを更新しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('レシピ更新エラー:', error);
    }
  };

  const initialData: RecipeFormData = {
    name: recipe.name,
    description: recipe.description || '',
    ingredients: recipe.recipeIngredients.map((ri) => ({
      id: ri.ingredient.id,
      name: ri.ingredient.name,
      quantity: ri.quantity,
      unit: ri.ingredient.unit?.unit || '',
    })),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>レシピの編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <RecipeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={loading}
            submitButtonText="更新"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
