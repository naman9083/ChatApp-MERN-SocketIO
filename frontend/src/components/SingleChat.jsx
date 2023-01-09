import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import Lottie from "react-lottie";
import { useState } from "react";
import { getSender, getSenderFull } from "../config/ChatsLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./UserItems/ScrollableChat";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import "./UserItems/styles.css";
// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://tanz-a-tive.onrender.com";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT,{
      transports: ['websocket'],
     });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => { 
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      // if(selectedChatCompare._id === selectedChat._id)
      setIsTyping(false);
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  console.log(notification, "notification");
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <div>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            display="flex"
            w={{ base: "75vw", md: "62vw", lg: "64vw", sm: "85vw" }}
            justifyContent={{ base: "space-between", md: "flex-start" }}
            alignItems={{ base: "center", md: "flex-start" }}
            fontWeight="bold"
            mb={2}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<i className="fas fa-arrow-left"></i>}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <Box
                width="80vw"
                display="flex"
                justifyContent="space-between"
                mr={4}
              >
                <Text ml={5} display="flex">
                  {getSender(user, selectedChat.users)
                    .substring(0, 1)
                    .toUpperCase() +
                    getSender(user, selectedChat.users).substring(1)}
                </Text>
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </Box>
            ) : (
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                mr={4}
              >
                {<Text ml={5}>{selectedChat.chatName.toUpperCase()}</Text>}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </Box>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            mx={5}
            alignItems="flex-start"
            height={{ base: "75vh", md: "70vh", lg: "70vh", sm: "70vh" }}
            my={3}
            p={3}
            borderRadius="lg"
            bg="#E8E8E8"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                color="blue.500"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div >
                  <Lottie
        
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 45, marginLeft: 0 , position: "absolute", bottom: "0", left: "0",color: "red"}}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                varient="filled"
                bg="#E8E8E8"
                textColor="black"
                color="red"
                placeholder="Enter a message...."
                _placeholder={{
                  color: "inherit",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
                value={newMessage}
                onChange={typingHandler}
              ></Input>
            </FormControl>
          </Box>
        </div>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
          h="100%"
          pb={3}
          fontSize="3xl"
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text>Click on a chat to start messaging</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
