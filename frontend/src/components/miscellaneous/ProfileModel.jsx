import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} />
      )}
      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent  >
          <Center>
            <ModalHeader fontSize="40px" width="100%" style={{whiteSpace:"nowrap"}} >{user.name}</ModalHeader>
          </Center>
          <ModalCloseButton />
          <ModalBody display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between">
        
              <Image
                src={user.pic}
                borderRadius="full"
                boxSize="150px"
                alt={user.name}
                mb="20px"
              />
      
              <Text fontSize={{ base: "28px", md: "30px" }}>{user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModel;
