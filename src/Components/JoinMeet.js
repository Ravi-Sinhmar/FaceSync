import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { useSearchParams } from "react-router-dom";
import { useFriend } from "./../Contexts/Friend";
import { usePeer } from "./../Contexts/Peer";

function JoinMeet() {
  const nameRef = useRef();
  const [adminName, setAdminName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [needWebSocket, setNeedWebSocket] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(false);
  const [joined, setJoined] = useState(false);
  const [adminSocket, setAdminSocket] = useState(null);
  const [userSocket, setUserSocket] = useState(null);
  const [adminSocketStatus, setAdminSocketStatus] = useState(false);
  const [userSocketStatus, setUserSocketStatus] = useState(false);
  const [myVideo, setMyVideo] = useState(null);
 
  // contexts
  const { setFriend, adminCon, friend, setAdminCon } = useFriend();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendVideo,
    remoteStream,
  } = usePeer();

  const handleInputChange = (event) => {
    setUserName(event.target.value);
  };


  const seeMeet = useCallback(() => {
    const ad = searchParams.get("adminName");
    const mId = searchParams.get("meetingId");
    setAdminName(ad);
    setAdminCon(ad);
    setMeetingId(mId);
    if (adminName && meetingId) {
      const content = { adminName, meetingId };
      fetch(`https://facesyncbackend.onrender.com/seeMeet`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.status === "success") {
            setNeedWebSocket(true);
            setAdmin(data.token);
            setUser(!data.token);
          }
          if (data.status === "fail") {
          }
        })
        .catch((err) => console.log(err));
    }
  }, [searchParams,setAdminCon,adminName,meetingId]);
  useEffect(() => {
    seeMeet();
  },[seeMeet]);


const startAdminSocket = useCallback(() => {
      if (needWebSocket && admin) {
        const newSocket = new WebSocket(
          `wss://facesyncbackend.onrender.com/?userName=${adminName}${meetingId}&name=${adminName}`
        );
        setAdminSocket(newSocket);
      }
  }, [needWebSocket, admin, adminName, meetingId]);

  const startUserSocket = useCallback(() => {
    if (needWebSocket && user && joined) {
        const cleanName = userName.toLowerCase().replace(/\s+/g, "");
        const newSocket = new WebSocket(
          `wss://facesyncbackend.onrender.com/?userName=${cleanName}${meetingId}&name=${userName}`
        );
        setUserSocket(newSocket);
    }
  }, [needWebSocket, meetingId, userName, user,joined]);

  useEffect(() => {
    startUserSocket();
  }, [startUserSocket]);

  useEffect(() => {
    startAdminSocket();
  }, [startAdminSocket]);

  const handleAdminSocketStatus = () => {
    setAdminSocketStatus(true);
  };

  const handleUserSocketStatus = () => {
    setUserSocketStatus(true);
  };
  
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
      } else {
        return;
      }
      if (userSocket !== null) {
        userSocket.removeEventListener("open", handleUserSocketStatus);
      } else {
        return;
      }
    };
  }, [adminSocket, userSocket]);

  // const getMyVideo = useCallback(async () => {
  //   const video = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   setMyVideo(video);
  //   console.log('Video tracks:', video.getVideoTracks());
  //   console.log('Audio tracks:', video.getAudioTracks());
  // }, []);
  // useEffect(() => {
  //   getMyVideo();
  // }, [getMyVideo]);



  

  const adminMessageListener = ()=>{
    alert("got a messages on admin side");
       };
       const userMessageListener = ()=>{
        alert("got a messages on user side");
           };

  useEffect(()=>{
if(adminSocketStatus){
  // case 1 When admin refresh but firend is still there
 
  adminSocket.send(
    JSON.stringify({
      type: "askingOffer",
      userName: adminCon,
      friendName: "need",
    })
  );
   // Listening for messages 
   adminSocket.addEventListener("message", adminMessageListener);
  return () => {
    adminSocket.removeEventListener("message", adminMessageListener);
  };

};

if(userSocketStatus && joined){
  userSocket.send(
    JSON.stringify({
      type: "askingOffer",
      userName: userName,
      friendName: adminCon,
    })
  );
  userSocket.addEventListener("message", userMessageListener);
return () => {
  userSocket.removeEventListener("message", userMessageListener);
};
}


  },[adminSocketStatus,userSocketStatus,adminCon,adminSocket,userSocket,userName,joined]);


  return (
    <React.Fragment>
      {true ? (
        <div className="flex flex-col justify-center items-center h-full w-full ">
          <ReactPlayer
            className="w-20 aspect-square bg-blf"
            url={remoteStream}
          ></ReactPlayer>
          <br />
          {user ? (
            <React.Fragment>
              <input
                value={userName}
                onChange={handleInputChange}
                className="border border-blt rounded-md py-2 bg-blm"
                type="text"
              />
              <button onClick={()=>{setJoined(true)}} >JOIN</button>
            </React.Fragment>
          ) : null}
          <ReactPlayer
            playing
            muted
            className="w-20 aspect-square bg-blt"
            url={myVideo}
          ></ReactPlayer>
        </div>
      ) : null}
    </React.Fragment>
  );
}
export default JoinMeet;
