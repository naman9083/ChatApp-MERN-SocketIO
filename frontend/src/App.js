import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/home";
import ChatPage from "./components/Chats/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
