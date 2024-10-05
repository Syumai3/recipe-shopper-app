import { Box, Button, HStack, Input, Stack, VStack } from "@chakra-ui/react";
import React from "react";
import { SendImageForm } from "../components/SendImageForm";

function CreateRecipe() {
  return (
    <Stack spacing={3} w="600px" m={10}>
      <SendImageForm />
      <label htmlFor="recipe-name">レシピ名</label>
      <Input id="recipe-name" w="100%" variant="outline" />

      <HStack>
        <Stack>
          <label htmlFor="ingredients">材料</label>
          <Input id="ingredients" w="400px" variant="outline" />
        </Stack>
        <Stack>
          <label htmlFor="ingredients">数量</label>
          <Input id="ingredients" w="100%" variant="outline" />
        </Stack>
        <Stack>
          <label htmlFor="ingredients">単位</label>
          <Input id="ingredients" w="100%" variant="outline" />
        </Stack>
      </HStack>
      <label htmlFor="description">説明</label>
      <Input id="description" variant="outline" />
      <Box display="flex" justifyContent="flex-end">
        <Button colorScheme="orange" w="100px">
          登録
        </Button>
      </Box>
    </Stack>
  );
}

export default CreateRecipe;
