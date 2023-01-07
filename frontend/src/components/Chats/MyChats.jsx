import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider"
import {useToast }from "@chakra-ui/react";
import axios from "axios";
const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const {loggedUser,setLoggedUser} = useState();
  const Toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.get("/api/chats", config);
      setChats(res);
    } catch (error) {
      console.log(error);
    }
  };

  return <div>MyChats</div>;
};

export default MyChats;
    