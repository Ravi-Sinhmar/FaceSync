import React, { useState, useEffect, useCallback } from "react";
const MyContext = React.createContext(null);
export const useSocket = () => {
  return React.useContext(MyContext);
};
function SocketProvider(props) {
  const [meetingId, setMeetingId] = useState(null); // MeetingId to make diffrent links and varifictaion
  const [adminName ,setAdminName] = useState("");

  // My both Sockets
  const [userSocket, setUserSocket] = useState(null);
  const [adminSocket, setAdminSocket] = useState(null);

  // To check which side is which one
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  // Status of Sockets Open or not
  const [userSocketStatus, setUserSocketStatus] = useState(false);
  const [adminSocketStatus, setAdminSocketStatus] = useState(false);


//   Start Sockets Callback functions...
  const startAdminSocket = useCallback(() => {
    if (isAdmin) {
      console.log("isAdmin Soket is goin to generate")
      const newSocket = new WebSocket(
        `wss://facesyncbackend.onrender.com/?fullMeetId=${meetingId}__.ad`
      );
      setAdminSocket(newSocket);
      console.log("admin Socket",)
    }
  }, [isAdmin, meetingId]);

  const startUserSocket = useCallback(() => {
    if (isUser) {
      console.log("isUser Soket is goin to generate")
      const newSocket = new WebSocket(
        `wss://facesyncbackend.onrender.com/?fullMeetId=${meetingId}__.us`
      );
      setUserSocket(newSocket);
      console.log("userSoket",newSocket);
    }
  }, [meetingId, isUser]);

  useEffect(() => {
    startUserSocket();
    console.log("st us");

  }, [startUserSocket]);

  useEffect(() => {
    startAdminSocket();
    console.log("st ad");
  }, [startAdminSocket]);

//  Socket status handling functions
  const handleAdminSocketStatus = () => {
    console.log("h ad");

    setAdminSocketStatus(true);
  };
  const handleUserSocketStatus = () => {
    console.log("h u");

    setUserSocketStatus(true);
  };

//   Socket status updating useEffect
  useEffect(() => {
    if (adminSocket !== null) {
      adminSocket.addEventListener("open", handleAdminSocketStatus);
    }
    if (userSocket !== null) {
      userSocket.addEventListener("open", handleUserSocketStatus);
    }
    return () => {
      if (adminSocket !== null) {
        adminSocket.removeEventListener("open", handleAdminSocketStatus);
      } ;
      if (userSocket !== null) {
        userSocket.removeEventListener("open", handleUserSocketStatus);
      } ;
    };
  }, [adminSocket, userSocket]);



  return (
    <MyContext.Provider value={{setAdminName,adminName,userSocket,adminSocket,userSocketStatus,adminSocketStatus,isAdmin,setIsAdmin,isUser,setIsUser,setMeetingId}}>
    <div>
      <h1>Hi</h1>
     {props.children}
     </div>
    </MyContext.Provider>
  );
}

export default SocketProvider;
