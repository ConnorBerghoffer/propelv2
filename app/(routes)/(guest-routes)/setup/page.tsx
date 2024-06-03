'use client'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Box, Text, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import ArtistProfileModal from '@/components/modals/ArtistProfileModal';

const SetupPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isArtistOpen, setIsArtistOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth()

  const handleDefaultUser = async () => {
    // Assuming you have the user's session information available
    const { data, error } = await supabase.from('users').insert([ { uuid: user?.id, f_name: 'First', l_name: 'Last' } ]);

    if (!error) {
      await supabase.from('permission_groups').insert([ { uuid: user?.id, permissions: ['like', 'comment', 'chat'] } ]);
      router.push('/');
    }
  };

  return (
    <Box className="bg-bgDark">
    {isArtistOpen ? 
        <Flex className="items-center justify-center w-full min-h-screen">
            <Box className='p-8 rounded-md bg-bgCard'>
            <Flex direction={'column'} justifyContent={'center'} alignItems={'center'} gap={4}>
                <Text className="text-lg font-bold">Setup your profile</Text>
                <Button colorScheme="orange" onMouseDown={() => setIsArtistOpen(true)}>Create Artist Profile</Button>
                <Button colorScheme="gray" onMouseDown={handleDefaultUser}>Continue as Default</Button>
            </Flex>
        </Box> 
        </Flex>
        : <ArtistProfileModal/>
    }
    </Box>
  );
};

export default SetupPage;
