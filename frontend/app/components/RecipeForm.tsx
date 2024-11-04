// components/RecipeForm.tsx
'use client';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchIngredientsLazyQuery } from '@/src/generated/graphql';
import { useDebounceCallback } from '@react-hook/debounce';

type Ingredient = {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
};

export type RecipeFormData = {
  name: string;
  description: string;
  ingredients: Ingredient[];
};

type RecipeFormProps = {
  initialData?: RecipeFormData;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  submitButtonText?: string;
  isLoading?: boolean;
};

export function RecipeForm({
  initialData,
  onSubmit,
  submitButtonText = '登録',
  isLoading = false,
}: RecipeFormProps) {
  const [recipeName, setRecipeName] = useState(initialData?.name ?? '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients ?? [
      { id: undefined, name: '', quantity: 0, unit: '' },
    ],
  );
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  // 材料を検索するクエリ
  const [searchIngredients, { data: searchData }] =
    useSearchIngredientsLazyQuery();
  // 選択された材料のインデックスを保持する
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState<
    number | null
  >(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // 検索した結果、0.5秒間何も入力がなければ検索を実行する
  const debouncedSearch = useDebounceCallback((searchTerm: string) => {
    if (searchTerm.length > 0) {
      searchIngredients({ variables: { searchTerm } });
    }
  }, 500);

  // 材料を追加する関数
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: '' }]);
  };
  // 材料を削除する関数
  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  // 材料を更新する関数
  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return {
          ...ingredient,
          [field]:
            field === 'quantity' ? parseFloat(value.toString()) || 0 : value,
        };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  // 材料を検索する関数
  const handleIngredientSearch = (index: number, term: string) => {
    // 材料を更新する
    updateIngredient(index, 'name', term);
    // アクティブな材料のインデックスを更新する
    setSelectedIngredientIndex(index);
    // 検索関数を呼び出す
    debouncedSearch(term);
  };

  // 検索候補の中の材料を選択する関数
  const handleIngredientSelect = (index: number, selectedIngredient: any) => {
    // 新しい材料のリストを作成して操作する
    const newIngredients = [...ingredients];
    // 選択された材料の中のオブジェクトを更新する
    newIngredients[index] = {
      ...newIngredients[index],
      id: selectedIngredient.id,
      name: selectedIngredient.name,
      unit: selectedIngredient.unit.unit,
    };
    setIngredients(newIngredients);
    setSelectedIngredientIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setSelectedIngredientIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // レシピを登録する関数
  const handleSubmit = async () => {
    await onSubmit({
      name: recipeName,
      description,
      ingredients,
    });
  };

  return (
    <Stack spacing={3} w="100%">
      <FormControl>
        <FormLabel htmlFor="recipe-name">レシピ名</FormLabel>
        <Input
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          id="recipe-name"
          w="100%"
          variant="outline"
        />
      </FormControl>

      <FormControl>
        <FormLabel>材料</FormLabel>
        <VStack
          align="stretch"
          maxH="200px"
          overflowY="auto"
          borderWidth={1}
          borderRadius="md"
          p={2}
        >
          {ingredients.map((ingredient, index) => (
            <Box position="relative" key={index}>
              <HStack>
                <Input
                  placeholder="材料名"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientSearch(index, e.target.value)
                  }
                  onFocus={() => setSelectedIngredientIndex(index)}
                />
                <Input
                  placeholder="数量"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    updateIngredient(index, 'quantity', e.target.value)
                  }
                />
                <Input placeholder="単位" value={ingredient.unit} readOnly />
                <IconButton
                  aria-label="Remove ingredient"
                  icon={<DeleteIcon />}
                  onClick={() => removeIngredient(index)}
                  size="sm"
                />
              </HStack>
              {/* 材料の検索結果を表示する */}
              {selectedIngredientIndex === index &&
                searchData?.searchIngredients && (
                  <List
                    ref={listRef}
                    position="absolute"
                    zIndex={1}
                    bg="white"
                    borderWidth={1}
                    borderRadius="md"
                    width="50%"
                    maxH="200px"
                    overflowY="auto"
                  >
                    {searchData.searchIngredients.map((searchIngredient) => (
                      <ListItem
                        key={searchIngredient.id}
                        onClick={() =>
                          handleIngredientSelect(index, searchIngredient)
                        }
                        p={2}
                        _hover={{ bg: 'gray.100' }}
                        cursor="pointer"
                      >
                        {searchIngredient.name}(
                        {searchIngredient.unit?.unit || '単位なし'})
                      </ListItem>
                    ))}
                  </List>
                )}
            </Box>
          ))}
        </VStack>
        <Button leftIcon={<AddIcon />} onClick={addIngredient} mt={2} size="sm">
          材料を追加
        </Button>
      </FormControl>

      <FormLabel htmlFor="description">説明</FormLabel>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        id="description"
        variant="outline"
      />

      <Box display="flex" justifyContent="flex-end">
        <Button
          colorScheme="orange"
          w="100px"
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          {submitButtonText}
        </Button>
      </Box>
    </Stack>
  );
}
