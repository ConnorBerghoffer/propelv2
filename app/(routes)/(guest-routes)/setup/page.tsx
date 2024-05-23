'use client'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';
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

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
    <ArtistProfileModal isOpen={isArtistOpen} onClose={() => setIsArtistOpen(!isArtistOpen)}/>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Setup your profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button colorScheme="blue" onClick={() => setIsArtistOpen(true)}>Create Artist Profile</Button>
          <Button ml={4} colorScheme="gray" onClick={handleDefaultUser}>Continue as Default</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SetupPage;
