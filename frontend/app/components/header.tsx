'use client';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Box, Button, Flex, Image } from '@chakra-ui/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <>
      {/* ここにロゴや他のヘッダー要素を配置できます */}
      {status === 'authenticated' ? (
        <Flex align="center" height="40px">
          <Button
            onClick={() => signOut()}
            bg="orange.50"
            color="gray.700"
            _hover={{ bg: 'orange.100' }}
            height="40px"
            mr={2}
            fontWeight="normal"
          >
            ログアウト
          </Button>
          <Box
            width="40px"
            height="40px"
            borderRadius="full"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={session.user?.image ?? '/default-avatar.png'}
              alt="User Avatar"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
        </Flex>
      ) : (
        <Button
          onClick={() => signIn('google')}
          bg="orange.50"
          color="gray.700"
          _hover={{ bg: 'orange.100' }}
          height="40px"
          fontWeight="normal"
        >
          登録 / ログイン
        </Button>
      )}
    </>
  );
}
