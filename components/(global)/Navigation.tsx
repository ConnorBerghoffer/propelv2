'use client'
import { useAuth } from '@/app/hooks/useAuth';
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, Link } from '@chakra-ui/react';
import React from 'react';

type Props = {}

const Navigation = (props: Props) => {
  const { user, logout, login } = useAuth();

  return (
    <Box mt={10}>
      <Box h={10} alignItems={'center'} px={4} className="fixed top-0 left-0 flex w-full bg-gradient-to-br from-bgLight to-bgCard">
      <Box className="font-bold text-primary">
        Propel
      </Box>
      <Flex marginRight="auto" alignItems="center" className='justify-between w-full'>
        <Box>
          <Link href="/" fontSize={'sm'} ml={6} >Home</Link>
          <Link href="/broadcast"  fontSize={'sm'} ml={6}>Music</Link>
          <Link href="/music"  fontSize={'sm'} ml={6}>Video</Link>
          <Link href="/forum"  fontSize={'sm'} ml={6}>Forum</Link>
        </Box>
        {user ? (
          <Menu>
            <MenuButton as={Button} variant="ghost">
              <Avatar size="sm" name={user.email} src={user.user_metadata.avatar_url} />
            </MenuButton>
            <MenuList className="bg-bgDark">
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button onClick={login} colorScheme="orange">Login</Button>
        )}
      </Flex>
    </Box>
  </Box>
  );
};

export default Navigation;
