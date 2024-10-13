import React, { useMemo,useEffect,useState, useCallback } from "react";
const PeerContext = React.createContext(null);
export const usePeer = () =>{
  return React.useContext(PeerContext);
}

function PeerProvider(props){
  const [remoteStream,setRemoteStream] = useState(null);
  const [setting,setSetting] = useState("none");
  const [cons,setCons] = useState(null);

  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  // create offer
  const createOffer = async()=>{
    const offer = peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer  = async (offer)=>{
  console.log("state of wbeb setremote offer",peer.connectionState);
  peer.setRemoteDescription(offer);
const answer = await peer.createAnswer();
await peer.setLocalDescription(answer);
return answer;
  };

  const setRemoteAnswer = async(answer)=>{
    console.log("state of wbeb setremote answer",peer.connectionState);
 await peer.setRemoteDescription(answer);
return true;
  };


// sendig Vidoe
const sendVideo = async (video)=>{
  const tracks = video.getTracks();
  for(const track of tracks){
    peer.addTrack(track,video);
  }

}

const handleSendVideo = useCallback(async(event)=>{
  const video =await event.streams;
  console.log("GOT TRACKS!!",video[0]);
  setRemoteStream(video[0]);
},[]);

// close connection
const disconnect = useCallback(() => {
  if (peer.connectionState !== "closed") {
    peer.close();
    setRemoteStream(null);
    // Optionally, reset other relevant state variables (setting, cons)
  }
}, [peer]);


useEffect(()=>{
  peer.addEventListener('track',handleSendVideo);
  return ()=>{
    peer.removeEventListener('track',handleSendVideo);
    disconnect();
  }
},[peer,handleSendVideo,disconnect]);


  return (
    <PeerContext.Provider value={{ peer ,disconnect, createOffer,createAnswer,setRemoteAnswer,sendVideo,remoteStream, setRemoteStream,setting,setSetting,cons,setCons}}>
      {props.children}
    </PeerContext.Provider>
  );
};


export default PeerProvider;