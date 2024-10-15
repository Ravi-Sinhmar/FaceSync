import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartMeet from "./Components/StartMeet";
// import Test from "./Components/Test";
import JoinMeet from "./Components/JoinMeet";
import PeerProvider from './Contexts/Peer';
import SocketProvider from "./Contexts/Socket";



import "./App.css";
import "./index.css";

function App() {
  return (
   
      <PeerProvider>
    <SocketProvider>

    <Router>
      <Routes>
        {/* <Route path="/" element={<Test />} /> */}
        <Route path="/" element={<StartMeet />} />
        <Route path="/meeting" element={<JoinMeet />} />
      </Routes>
    </Router>
    </SocketProvider>

    </PeerProvider>
   

  );
}

export default App;
