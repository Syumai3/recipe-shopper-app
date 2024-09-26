import { Box, HStack, Spinner, Stack, VStack } from "@chakra-ui/react";

export default function HomePage() {
	return (
		<HStack h="100vh" w="100%" alignItems="stretch" bgColor="orange.100" p={4}>
			<Box
				w={{ base: "200px", md: "300px" }}
				maxW="30%"
				bgColor="orange.50"
				borderRadius={10}
			>
				<h1>サイドバー</h1>
			</Box>

			<VStack flexGrow={1} spacing={0}>
				<Box h="60px" w="100%" bgColor="orange.50" borderTopRadius={10}>
					<h1>ヘッダー</h1>
				</Box>
				<Box flexGrow={1} w="100%" bgColor="orange.50" borderBottomRadius={10}>
					<h1>メインコンテンツ</h1>
				</Box>
			</VStack>
		</HStack>
	);
}
