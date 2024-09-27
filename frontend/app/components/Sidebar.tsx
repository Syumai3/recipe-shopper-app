import { Box, Link as ChakraLink, VStack } from "@chakra-ui/react";
import React from "react";

export default function Sidebar() {
	return (
		<Box
			w={{ base: "200px", md: "300px" }}
			maxW="30%"
			bgColor="orange.50"
			borderRadius={10}
		>
			<VStack align="start" m={5}>
				<ChakraLink
					href="./"
					fontSize="xl"
					color="gray.600"
					_hover={{ textDecoration: "none", color: "gray.400" }}
				>
					[アプリ名]
				</ChakraLink>
				<ChakraLink
					href="./menu"
					fontSize="xl"
					color="gray.600"
					_hover={{ textDecoration: "none", color: "gray.400" }}
				>
					献立
				</ChakraLink>
				<ChakraLink
					href="./createRecipe"
					fontSize="xl"
					color="gray.600"
					_hover={{ textDecoration: "none", color: "gray.400" }}
				>
					レシピを作成する
				</ChakraLink>
				<ChakraLink
					href="./recipes"
					fontSize="xl"
					color="gray.600"
					_hover={{ textDecoration: "none", color: "gray.400" }}
				>
					レシピを確認する
				</ChakraLink>
			</VStack>
		</Box>
	);
}
