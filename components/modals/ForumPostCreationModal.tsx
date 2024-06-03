import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

const ForumPostCreationModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Event form inputs and content here */}
          <p>Event creation form will go here.</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Create Event</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ForumPostCreationModal;
