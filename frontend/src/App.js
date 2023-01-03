import React from "react";
import {BrowserRouter as Router, Route } from "react-router-dom";
import Chats from "./components/chats";
import Home from "./components/home";

function App() {
  return (
    <div>
      <Router>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
        
      </Router>
    </div>
  );
}

export default App;
