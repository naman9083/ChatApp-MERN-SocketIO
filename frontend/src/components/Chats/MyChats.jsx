import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider"
import {useToast }from "@chakra-ui/react";
import axios from "axios";
const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser,setLoggedUser] = useState();
  const Toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {res} = await axios.get("/api/chat", config);
      setChats(res);
    } catch (error) {
      Toast({
        title: "Something went wrong",
        description: "Please try again later",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      }); 
    }

  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats(); 
  }, []); 

  return <div>MyChats</div>;
};

export default MyChats;
    