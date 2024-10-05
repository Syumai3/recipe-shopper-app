'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { SendImageForm } from '../components/SendImageForm';

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

function CreateRecipe() {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: 0, unit: '' },
  ]);
  const [description, setDescription] = useState('');

  // 材料の追加
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: '' }]);
  };
  // 材料の削除
  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // 材料の更新
  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const handleSubmit = () => {
    // バックエンドへ送信する処理を書く
    console.log({ recipeName, ingredients, description });
  };

  return (
    <Stack spacing={3} w="600px" m={5}>
      {/* 画像データアップロードに関しては後回しにする */}
      {/* <SendImageForm /> */}
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
            <HStack key={index}>
              <Input
                placeholder="材料名"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, 'name', e.target.value)
                }
              />
              <Input
                placeholder="数量"
                value={ingredient.quantity}
                onChange={(e) =>
                  updateIngredient(index, 'quantity', e.target.value)
                }
              />
              <Input
                placeholder="単位"
                value={ingredient.unit}
                onChange={(e) =>
                  updateIngredient(index, 'unit', e.target.value)
                }
              />
              <IconButton
                aria-label="Remove ingredient"
                icon={<DeleteIcon />}
                onClick={() => removeIngredient(index)}
                size="sm"
              />
            </HStack>
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
        <Button colorScheme="orange" w="100px">
          登録
        </Button>
      </Box>
    </Stack>
  );
}

export default CreateRecipe;
