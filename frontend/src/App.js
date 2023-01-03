import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatsPage from "./components/chats";
import './App.css'
import Home from "./components/home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
