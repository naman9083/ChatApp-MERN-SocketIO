import {
  Button,

  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";

import { ChatState } from "../../Context/ChatProvider";

const UpdateProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = ChatState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "naman4563");
      fetch("https://api.cloudinary.com/v1_1/naman4563/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  useEffect(() => {
    setName(user.name);
    setPic(user.pic);
    console.log(user.name, user.pic);
  }, [user.name, user.pic]);
  const updateUser = async () => {
    if (name === "" && password === "" && confirmpassword === "") {
      toast({
        title: "Please Fill the Form!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Password not matching!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if(pic===""){
        toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
    }
    try {
      const { data } = await axios.put("/api/user/rename", {
        _id:user._id,
        name:name,
        password:password,
        pic:pic,
      });
      console.log(data);
      toast({
        title: "Profile Updated! Login Again",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      onClose();
      localStorage.removeItem("userInfo");
      window.location.reload();
    } catch (err) {
      toast({
        title: "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };
  return (
    <div>
      <span onClick={onOpen}>{children}</span>
      <Modal
        size={{ base: "sm", md: "md", lg: "lg", sm: "sm" }}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack spacing="5px">
              <Image
                src={user.pic}
                borderRadius="full"
                boxSize="120px"
                onClick={onButtonClick}
                alt={user.name}
                mb="20px"
              />
              <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder={user.name}
                  maxLength={15}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl id="New password" isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter New Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShow(!show)}
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="New password" isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Confirm New password"
                    onChange={(e) => setConfirmpassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShow(!show)}
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <input
                type="file"
                id="file"
                ref={inputFile}
                onChange={(e) => postDetails(e.target.files[0])}
                style={{ display: "none" }}
              />

              <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={updateUser}
                isLoading={loading}
              >
                Update Profile
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateProfileModal;
