import React, { useMemo,useEffect,useState, useCallback } from "react";
const PeerContext = React.createContext(null);
export const usePeer = () =>{
  return React.useContext(PeerContext);
}

function PeerProvider(props){
  const [remoteStream,setRemoteStream] = useState();
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
    await peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  };

  const createAnswer  = async (offer)=>{
    console.log("state of wbeb setremote offer",peer.connectionState);

    peer.setRemoteDescription(offer);
const answer = await peer.createAnswer();
peer.setLocalDescription(new RTCSessionDescription(answer));
return answer;
  };

  const setRemoteAnswer = async(answer)=>{
    console.log("state of wbeb setremote answer",peer.connectionState);
 await peer.setRemoteDescription(new RTCSessionDescription(answer));
  }


// sendig Vidoe
const sendVideo = (video)=>{
  const tracks = video.getTracks();
  for(const track of tracks){
    peer.addTrack(track,video);
  }
}

const handleSendVideo = useCallback((event)=>{
  const video =  event.streams;
  console.log("GOT TRACKS!!",video[0]);
  setRemoteStream(video[0]);
},[])

useEffect(()=>{
  peer.addEventListener('track',handleSendVideo);
  return ()=>{
    peer.removeEventListener('track',handleSendVideo);
  }

},[peer,handleSendVideo]);


  return (
    <PeerContext.Provider value={{ peer , createOffer,createAnswer,setRemoteAnswer,sendVideo,remoteStream}}>
      {props.children}
    </PeerContext.Provider>
  );
};


export default PeerProvider;