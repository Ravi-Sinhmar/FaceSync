import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useFriend } from "./../Contexts/Friend";
import { usePeer } from "./../Contexts/Peer";
import { useNavigate } from 'react-router-dom';

import Setting from "./Setting";

function JoinMeet() {
  const navigate = useNavigate();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [adminName, setAdminName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [needWebSocket, setNeedWebSocket] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [finalOffer, setFinalOffer] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(false);
  const [joined, setJoined] = useState(false);
  const [adminSocket, setAdminSocket] = useState(null);
  const [userSocket, setUserSocket] = useState(null);
  const [adminSocketStatus, setAdminSocketStatus] = useState(false);
  const [userSocketStatus, setUserSocketStatus] = useState(false);
  const [myVideo, setMyVideo] = useState(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
 
  // contexts
  const {adminCon, setAdminCon} = useFriend();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendVideo,
    remoteStream,
    setting,setSetting,cons,disconnect
  } = usePeer();

  const handleInputChange = (event) => {
    let uName = event.target.value;
    setFullName(uName);
    uName = uName.toLowerCase().replace(/\s+/g, "");
    setUserName(uName);
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


  useEffect(()=>{
    if(setting === "ok"){
      setNeedWebSocket(true);
    }
  },[setting]);


const startAdminSocket = useCallback(() => {
      if (needWebSocket && admin) {
        const newSocket = new WebSocket(
          `wss://facesyncbackend.onrender.com/?fullMeetId=${adminName}${meetingId}&deviceName=${adminName}`
        );
        setAdminSocket(newSocket);
      }
  }, [needWebSocket, admin, adminName, meetingId]);

  const startUserSocket = useCallback(() => {
    if (needWebSocket && user && joined) {
        const cleanName = userName.toLowerCase().replace(/\s+/g, "");
        const newSocket = new WebSocket(
          `wss://facesyncbackend.onrender.com/?fullMeetId=${cleanName}${meetingId}&deviceName=${userName}`
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



  const getMyVideo = useCallback(async () => {
    try {
      const st = await navigator.mediaDevices.getUserMedia(cons);
      setMyVideo(st);
      console.log('Video tracks:', st.getVideoTracks());
      console.log('Audio tracks:', st.getAudioTracks());
  
      // Set the video source to the `videoRef`
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = st;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [cons]);
  
  useEffect(() => {
    if( setting === "ok");
    getMyVideo();
  }, [getMyVideo,setting]);

  const toggleMic = () => {
    if (myVideo) {
      const audioTrack = myVideo.getAudioTracks()[0];
      audioTrack.enabled = !isMicEnabled;
      setIsMicEnabled(!isMicEnabled);
    }
  };

  const toggleVideo = () => {
    if (myVideo) {
      const videoTrack = myVideo.getVideoTracks()[0];
      videoTrack.enabled = !isVideoEnabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const cutCall = ()=>{
    disconnect();
    navigate("/")
  }


  const getRemoteVideo = useCallback(()=>{
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  },[remoteStream]);

  useEffect(()=>{
    getRemoteVideo();
  },[getRemoteVideo]);

  useEffect(()=>{
if(adminSocketStatus){
  const wsMessage = {
    admin:true,
    cleanUserName: adminCon,
    fullUserName:"updateMe",
    cleanFriendName : "updateMe",
    fullFiendName:"updateMe",
  };
  const adminMessageListener =async (event)=>{
    const data = JSON.parse(event.data);
    // if Someone Reset or Refresh or Firsttime going on link
 if (data.type === "userOn" || data.type === "askingOffer") {
  const offer = await createOffer();
  setFinalOffer(offer);
  adminSocket.send(JSON.stringify({ ...wsMessage,type:"sendingOffer",content: offer}));
 };
//  Getting Anser
 if (data.type === "sendingAnswer") {
  await setRemoteAnswer(data.content);
 };

 //  neg Anser
 if (data.type === "negAnswer") {
   await setRemoteAnswer(data.content);
};
      };


  adminSocket.send(JSON.stringify({ ...wsMessage,type:"adminOn"}));
   // Listening for messages 
   adminSocket.addEventListener("message", adminMessageListener);
  return () => {
    adminSocket.removeEventListener("message", adminMessageListener);
  };

};

if(userSocketStatus && joined){
  const wsMessage = {
    admin:false,
    cleanUserName: userName,
    fullUserName:fullName,
    cleanFriendName :adminCon,
    fullFiendName:"updateMe",
  };
  const userMessageListener = async(event)=>{
    const data = JSON.parse(event.data);
    // If admin Reset or refresh
    if (data.type === "adminOn") {
    userSocket.send(JSON.stringify({ ...wsMessage,type:"askingOffer"}));
     };

     // If getting offer
     if (data.type === "sendingOffer") {
      const answer = await createAnswer(data.content);
      userSocket.send(JSON.stringify({ ...wsMessage,type:"sendingAnswer", content: answer}));
       };

         // If neg need
     if (data.type === "negNeed") {
      const answer = await createAnswer(data.content)
      userSocket.send(JSON.stringify({ ...wsMessage,type:"negAnswer", content: answer}));
       };
            };

  userSocket.send(JSON.stringify({ ...wsMessage,type:"userOn"}));
  userSocket.addEventListener("message", userMessageListener);
return () => {
  userSocket.removeEventListener("message", userMessageListener);
};
}
  },[adminSocketStatus,userSocketStatus,adminCon,adminSocket,userSocket,userName,joined,fullName,createAnswer,createOffer,setRemoteAnswer]);

  const handleNeg = useCallback(async () => {
    console.log("nego need");
    const wsMessage = {
      admin:true,
      cleanUserName: adminCon,
      fullUserName:"updateMe",
      cleanFriendName : "updateMe",
      fullFiendName:"updateMe",
    };
    const offer = await createOffer();
    adminSocket.send(JSON.stringify({ ...wsMessage,type:"negNeed",content: offer}));
  }, [adminCon,adminSocket,createOffer]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNeg);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNeg);
    };
  }, [handleNeg, peer]);

 useEffect(() => {
    if (setting === "ok") {
      sendVideo(myVideo);
    }
  }, [sendVideo, myVideo,setting]);

  return (
    <React.Fragment>
      {setting === "ok" ?(
        <div className="bg-blf w-svw h-svh flex flex-col justify-between overflow-hidden">
          <video ref={localVideoRef} muted autoPlay playsInline className="absolute right-2 top-2 rounded-md object-cover h-24 w-16"></video>
        <div className="flex flex-col justify-center items-center h-full">
        <video ref={remoteVideoRef}  autoPlay playsInline className="rounded-md object-cover w-full h-full "></video>
        {user && !joined ? (<React.Fragment> <input
                value={userName}
                onChange={handleInputChange}
                placeholder="Your name please"
                className="border border-blt rounded-md py-2 bg-blm"
                type="text"
              />
              <button onClick={()=>{setJoined(true)}} >JOIN</button>
        
            </React.Fragment>
          ) : null}
          
        </div>
        <div className="flex justify-between items-center px-10 py-4 bg-blm rounded-lg h-fit">
        <button onClick={toggleMic}>
          Toggle Audio
        </button>
        <button onClick={toggleVideo}>
          Toggle Video
        </button>

        <button onClick={cutCall}>
          Cut Calll
        </button>
        
        </div>
        </div>
      ) : <Setting localVideoRef={localVideoRef} />
      }
      
    </React.Fragment>
  );
}
export default JoinMeet;
