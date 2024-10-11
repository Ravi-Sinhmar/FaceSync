import React, { useMemo, useEffect, useState, useCallback } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => {
  return React.useContext(PeerContext);
};

function PeerProvider(props) {
  const [remoteStream, setRemoteStream] = useState();
  
  const peer = useMemo(() => 
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
  []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    await peer.setRemoteDescription(answer);
    return true;
  };

  const sendVideo = async (video) => {
    const tracks = video.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, video);
    }
  };

  const handleSendVideo = useCallback((event) => {
    const remoteStream = event.streams[0];
    setRemoteStream(remoteStream);
  }, []);

  useEffect(() => {
    peer.addEventListener('track', handleSendVideo);
    peer.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        // Send the candidate to the remote peer
      }
    });

    return () => {
      peer.removeEventListener('track', handleSendVideo);
      peer.close();
    };
  }, [peer, handleSendVideo]);

  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendVideo, remoteStream }}>
      {props.children}
    </PeerContext.Provider>
  );
}

export default PeerProvider;
