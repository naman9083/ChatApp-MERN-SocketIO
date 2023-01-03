import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
const ChatsPage = () => {
  const [chats, setChats] = useState([]);
 const fetchChats = async () => {
    const response = await axios.get('/api/chat');
    setChats(response.data);
  };

  useEffect(() => {
    fetchChats();
  }, []);


  return (
    <div>
      {chats.map((chat) => (
       <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default ChatsPage;