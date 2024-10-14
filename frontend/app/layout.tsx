import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ApolloChakraProvider from './ApolloChakraProvider';
import Sidebar from './components/Sidebar';
import { SessionProvider } from 'next-auth/react';
import Header from './components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ApolloChakraProvider>
          <SessionProvider>
            <Flex
              h="100vh"
              w="100%"
              bgColor="orange.100"
              alignItems="stretch"
              p={4}
            >
              <Sidebar />
              <Flex flexDirection="column" flexGrow={1} p={4} overflowY="auto">
                <Box
                  h="60px"
                  w="100%"
                  bgColor="orange.50"
                  borderRadius={10}
                  mb={4}
                  display="flex"
                  alignItems="center"
                  padding={4}
                  justifyContent="flex-end"
                >
                  <Header />
                </Box>
                <Box
                  flexGrow={1}
                  w="100%"
                  bgColor="orange.50"
                  borderRadius={10}
                  p={4}
                  overflowY="auto"
                >
                  {children}
                </Box>
              </Flex>
            </Flex>
          </SessionProvider>
        </ApolloChakraProvider>
      </body>
    </html>
  );
}
