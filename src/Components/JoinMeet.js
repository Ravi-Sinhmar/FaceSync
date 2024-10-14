import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


// Components
import Setting from "./Setting";

// Contexts 
import { usePeer } from "./../Contexts/Peer";
import { useSocket } from "./../Contexts/Socket";


function JoinMeet() {
  const navigate = useNavigate();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const inputRef = useRef();
  const [searchParams,setSearchParams] = useSearchParams();
  const [myVideo, setMyVideo] = useState(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true);
  const [isJoin,setIsJoin] = useState(false);

 

   // Contexts
   const {adminName,setAdminName,isUser,isAdmin,meetingId,setMeetingId,setIsAdmin,setIsUser,userSocket,adminSocket,userSocketStatus,adminSocketStatus} = useSocket();
   const{
    peer,
    disconnect,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendVideo,
    remoteStream,
    setting,
    setSetting,
    cons,
    setCons
  } = usePeer();

  // Get the Name
  const handleJoinClick = ()=>{
   const aName = inputRef.current.value;
   setAdminName(aName);
   setIsJoin(true);
  }

   // Check if it's Admin or  User
  const seeMeet = useCallback(() => {
    const meetId = searchParams.get("meetingId");
    setMeetingId(meetId);
    if(adminName){
      const content = { adminName:adminName, meetingId:meetId };
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
            console.log("success");
            console.log(data.token);
            setIsAdmin(data.token);
            setIsUser(!data.token);
          }
          if (data.status === "fail") {
            console.log("Fetch /seeMeet failed")
          }
        })
        .catch((err) => console.log(err));
      }
  }, [searchParams,adminName,setMeetingId,setIsAdmin,setIsUser]);
  
  useEffect(() => {
    seeMeet();
  },[seeMeet]);

  useEffect(() => {
    console.log("adminName:", adminName);
  }, [adminName]);

  useEffect(() => {
    console.log("meid:", meetingId);
  }, [meetingId]);


  useEffect(() => {
    console.log("isUser:", isUser);
  }, [isUser]);

  useEffect(() => {
    console.log("isAdmin:", isAdmin);
  }, [isAdmin]);


  useEffect(() => {
    console.log("isJon:", isJoin);
  }, [isJoin]);
//  Collect My Stream 
  // const getMyVideo = useCallback(async () => {
  //   try {
  //     const st = await navigator.mediaDevices.getUserMedia(cons);
  //     setMyVideo(st);
  //     // Set the video source to the `videoRef`
  //     if (localVideoRef.current) {
  //       localVideoRef.current.srcObject = st;
  //     }
  //   } catch (error) {
  //     console.error('Error accessing camera:', error);
  //   }
  // }, [cons]);
  
  // useEffect(() => {
  //   getMyVideo();
  // }, [getMyVideo]);

  


  useEffect(()=>{
if(userSocketStatus && useSocket){
  const adminMessageListener = async (event)=>{
console.log("test msg user");
  
    }

console.log("test msg out");

  userSocket.send(JSON.stringify({Message:"Hellow,from User"}));
      // Listening to Messages
   adminSocket.addEventListener("message", adminMessageListener);
  return () => {
    adminSocket.removeEventListener("message", adminMessageListener);
  };

}
if(adminSocketStatus && adminSocket){
  const userMessageListener = async(event)=>{
  // const data = JSON.parse(event.data);
console.log("test msg admins");
          };
   // Listening to Messages
console.log("test msg admins out");

adminSocket.send(JSON.stringify({Message:"Hellow,from Admin"}));
userSocket.addEventListener("message", userMessageListener);
return () => {
  userSocket.removeEventListener("message", userMessageListener);
};
}
  },[adminSocketStatus,userSocketStatus,adminSocket,userSocket]);



  // Don't Know
  // const getRemoteVideo = useCallback(()=>{
  //   if (remoteVideoRef.current) {
  //     remoteVideoRef.current.srcObject = remoteStream;
  //   }
  // },[remoteStream]);

  // useEffect(()=>{
  //   getRemoteVideo();
  // },[getRemoteVideo]);


// Don't know where to use this code
//  useEffect(() => {
//       sendVideo(myVideo);
//   }, [sendVideo,myVideo]);



  // NavButton Functions..........
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

  const toggleRemoteAudio = () => {
    if (remoteStream) {
      const audioTrack = remoteStream.getAudioTracks()[0];
      audioTrack.enabled = !isRemoteAudioEnabled;
      setIsRemoteAudioEnabled(!isRemoteAudioEnabled);
    }
  };

  const cutCall = ()=>{
    disconnect();
    navigate("/")
  };

  const handleMore = useCallback(async()=>{
    setSetting("start");
  },[setSetting]);

  // Jsx Code Start here 
  return (
    <div>
      <h1>Hi</h1>
{true ? (<React.Fragment> <input

                ref={inputRef}
                placeholder="Your name please"
                className="border border-blt rounded-md py-2 bg-blm"
                type="text"
              />
              <button onClick={handleJoinClick} >JOIN</button>
            </React.Fragment>
          ) : null}

      {true ? (
        <div className="w-svw h-svh bg-blm  flex justify-center items-center ">
          <div className="bg-blf h-full sm:w-1/2 md:w-1/4   flex flex-col justify-between overflow-hidden relative px-2 pt-2">
            <video
              ref={localVideoRef}
              muted
              autoPlay
              playsInline
              className="absolute right-3 top-3 rounded-md  object-cover h-24 w-16 ring-1 ring-black"
            ></video>
            <div className="flex flex-col justify-center items-center h-full">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full ring-2 ring-black bg-blm rounded-md  object-cover  "
              ></video>
            </div>
            <div className="w-full bg-transparent  py-2 flex items-center justify-center">
              <div className="flex justify-between w-full rounded-md ring-2 ring-black items-center px-4 py-2 bg-blm h-fit ">
                <button  onClick={toggleMic} className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    className="size-8 p-1 rounded-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.40135 12.5C9.63354 12.9014 9.95606 13.244 10.3411 13.5M9.17071 4C9.58254 2.83481 10.6938 2 12 2C13.6569 2 15 3.34315 15 5L15 10.5"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6 11C6 14.3137 8.68629 17 12 17C12.4675 17 12.9225 16.9465 13.3592 16.8454M18 11C18 11.854 17.8216 12.6663 17.5 13.4017"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="12"
                      y1="18"
                      x2="12"
                      y2="20"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="10"
                      y1="21"
                      x2="14"
                      y2="21"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="2.4137"
                      y1="2.03821"
                      x2="19.0382"
                      y2="19.5863"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                  <p>Mute</p>
                </button>

                <button  onClick={toggleVideo} className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                     className="size-8 p-1 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
                    />
                  </svg>
                  Stop
                </button>
                <button  onClick={cutCall} className="flex flex-col text-sm items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  className="size-8 p-1 bg-ble text-blm rounded-full">
  <path fill-rule="evenodd" d="M15.22 3.22a.75.75 0 0 1 1.06 0L18 4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L19.06 6l1.72 1.72a.75.75 0 0 1-1.06 1.06L18 7.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L16.94 6l-1.72-1.72a.75.75 0 0 1 0-1.06ZM1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
</svg>

                  Disconnect
                </button>
                <button  onClick={toggleRemoteAudio}  className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-8 p-1 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                  Silence
                </button>

                <button onClick={handleMore} className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-8 p-1 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  More
                </button>
                <button onClick={()=>window.location.reload()}>Reload</button>
              </div>
            </div>
          </div>
        </div>
      ) : 
      null
      }
    </div>
  );
}
export default JoinMeet;
