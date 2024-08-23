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
  const [adminSocket, setAdminSocket] = useState(null);
  const [userSocket, setUserSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [myVideo, setMyVideo] = useState(null);
  const [neg, setNeg] = useState(false);
  const [negOffer, setNegOffer] = useState(null);
  const [first, setFirst] = useState('ok');

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
  }, [adminName, meetingId, searchParams, setAdminCon]);

  useEffect(() => {
    seeMeet();
  }, [seeMeet]);

  const startAdminSocket = useCallback(() => {
    if (needWebSocket) {
      if (admin) {
        const newSocket = new WebSocket(
          `wss://facesyncbackend.onrender.com/?userName=${adminName}${meetingId}&name=${adminName}`
        );
        setAdminSocket(newSocket);
      }
    }
  }, [needWebSocket, admin, adminName, meetingId]);

  const startUserSocket = useCallback(() => {
    if (needWebSocket) {
      if (user && friend) {
        const cleanName = userName.toLowerCase().replace(/\s+/g, "");
        const newSocket = new WebSocket(
          `wss://facesyncbackend.onrender.com/?userName=${cleanName}${meetingId}&name=${userName}`
        );
        setUserSocket(newSocket);
      }
    }
  }, [needWebSocket, meetingId, userName, user, friend]);

  useEffect(() => {
    startUserSocket();
  }, [startUserSocket]);

  useEffect(() => {
    startAdminSocket();
  }, [startAdminSocket]);

  useEffect(() => {
    const handleSocketOpen = () => {
      setOpen(true);
    };
    if (admin && adminSocket !== null) {
      adminSocket.addEventListener("open", handleSocketOpen);
    }
    if (userSocket !== null && friend !== null) {
      userSocket.addEventListener("open", handleSocketOpen);
    }
    return () => {
      if (adminSocket !== null) {
        adminSocket.removeEventListener("open", handleSocketOpen);
      } else {
        return;
      }
      if (userSocket !== null) {
        userSocket.removeEventListener("open", handleSocketOpen);
      } else {
        return;
      }
    };
  }, [adminSocket, userSocket, userName, admin, friend]);

  const getMyVideo = useCallback(async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyVideo(video);
  }, []);

  useEffect(()=>{
    if(friend){
    const timer = setTimeout(() => {
        userSocket.send(
          JSON.stringify({
            type: "askingOffer",
            userName: friend,
            friendName: adminCon,
          })
        )
    }, 3000);
    return ()=>{
      clearTimeout(timer);
    }
  }
  },[adminCon,userSocket,friend]);

  useEffect(() => {
    if (open && user) {
      const userListener = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "sendingOffer") {
          const answer = await createAnswer(data.content);
          // Update state with offer data
          userSocket.send(
            JSON.stringify({
              type: "sendingAnswer",
              userName: friend,
              friendName: adminCon,
              content: answer,
            })
          );
        } else if (data.type === "negOffer") {
          
          alert("got neg offer");
          setNegOffer(data.content);
          const answer = await createAnswer(data.content);
          userSocket.send(
            JSON.stringify({
              type: "negAnswer",
              userName: friend,
              friendName: adminCon,
              content: answer,
            })
          );

          alert("i wish");
          setFirst('not');
        }
      };
      userSocket.addEventListener("message", userListener);
      return () => {
        userSocket.removeEventListener("message", userListener);
        setFirst('no');
      };
    } else if (open && admin) {
      const adminListener = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "askingOffer") {
          setFriend(data.userName);

          const offer = await createOffer();
          adminSocket.send(
            JSON.stringify({
              type: "sendingOffer",
              userName: adminCon,
              friendName: data.userName,
              content: offer,
            })
          );
        } else if (data.type === "sendingAnswer") {
          await setRemoteAnswer(data.content);
          setNeg(true);

          // Update state with answer data
        } else if (data.type === "negAnswer") {
          alert("got negAnswer");
          await peer.setLocalDescription(data.content);
        }
      };
      adminSocket.addEventListener("message", adminListener);
      return () => {
        adminSocket.removeEventListener("message", adminListener);
        setFirst('no');
      };
    }
   });

  useEffect(() => {
    getMyVideo();
  }, [getMyVideo]);

  const handleNeg = useCallback(async () => {
    alert("nego need");
    const offer = await peer.createOffer();

    adminSocket.send(
      JSON.stringify({
        type: "negOffer",
        userName: adminCon,
        friendName: friend,
        content: offer,
      })
    );
  }, [adminSocket, friend, adminCon, peer]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNeg);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNeg);
    };
  }, [handleNeg, peer]);

  useEffect(() => {
    if (neg) {
      sendVideo(myVideo);
    }
  }, [neg, sendVideo, myVideo]);

  const handleJoin = () => {
    setFriend(nameRef.current.value.trim());
    setUserName(nameRef.current.value.trim());
  };
  return (
    <React.Fragment>
      {true ? (
        <div className="flex flex-col justify-center items-center h-full w-full ">
          <ReactPlayer
            playing
            muted
            className="w-20 aspect-square bg-blf"
            url={remoteStream}
          ></ReactPlayer>
          <br />
          {user && !open ? (
            <React.Fragment>
              <input
                ref={nameRef}
                className="border border-blt rounded-md py-2 bg-blm"
                type="text"
              />
              <button onClick={handleJoin}>JOIN</button>
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
