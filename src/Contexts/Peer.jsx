import React, { useEffect, useState, useCallback } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => {
  return React.useContext(PeerContext);
};

function PeerProvider(props) {
  const [remoteStream, setRemoteStream] = useState(null);
  const [setting, setSetting] = useState("none");
  const [cons, setCons] = useState(null);
  const [mainStream, setMainStream] = useState(false);
  const [peer , setPeer] = useState(null)

  useEffect(() => {
    if (mainStream) {
      const newPeer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
  
      setPeer(newPeer);
      // Handle other setup processes as needed
    }
  }, [mainStream]);
  
  
  
  // Create offer
  const createOffer = async () => {
   
      const offer = peer.createOffer();
      await peer.setLocalDescription(offer);
      return offer;
  
  };

  // Create Answer
  const createAnswer = async (offer) => {
    
      console.log("state of wbeb setremote offer", peer.connectionState);
      peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return answer;
  
  };

  // Final description
  const setRemoteAnswer = async (answer) => {
      console.log("state of wbeb setremote answer", peer.connectionState);
      await peer.setRemoteDescription(answer);
      return true;
  };

  // sendig Vidoe
  const sendVideo = useCallback(async (video) => {
      const tracks = video.getTracks();
      for (const track of tracks) {
        peer.addTrack(track, video);
      }
  },[peer]) ;

   // close connection
   const disconnect = useCallback(() => {
      if (peer.connectionState !== "closed") {
        peer.close();
        setRemoteStream(null); // Optionally, reset other relevant state variables (setting, cons)
    }
  }, [peer]);

  

  const handleSendVideo = useCallback(async (event) => {
      const video = await event.streams;
      console.log("GOT TRACKS!!", video[0]);
      setRemoteStream(video[0]);

  },[]);

  const CheckTracks =useCallback(()=>{
    if(peer){
      peer.addEventListener("track", handleSendVideo);
      return () => {
        peer.removeEventListener("track", handleSendVideo);
        disconnect();
      }
    }
  },[peer,handleSendVideo,disconnect]) ;

  useEffect(()=>{
  CheckTracks();
  },[CheckTracks]);

  return (
    <PeerContext.Provider
      value={{
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
        setCons,
        setMainStream
      }}
    ><div>
      <h1>Hi</h1>
     {props.children}
     </div>
    </PeerContext.Provider>
  );
}

export default PeerProvider;
