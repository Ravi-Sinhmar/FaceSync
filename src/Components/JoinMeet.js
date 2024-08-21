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
  

  // contexts
  const { setFriend, adminCon, friend, setAdminCon } = useFriend();
  const { peer, createOffer, createAnswer, setRemoteAnswer,sendVideo ,remoteStream} = usePeer();

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
            console.log(data.token);
            setAdmin(data.token);
            setUser(!data.token);
          }
          if (data.status === "fail") {
            console.log("Status:fail in seeMeet()", data.message);
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
        alert("set");
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
      console.log("setOpen");
      setOpen(true);
    };
    if (admin && adminSocket !== null) {
      adminSocket.addEventListener("open", handleSocketOpen);
    }
    if (userSocket !== null && friend !== null) {
      alert(userName);
      alert(friend);
      userSocket.addEventListener("open", handleSocketOpen);
    }
    return () => {
      if (adminSocket !== null) {
        console.log("clear");
        adminSocket.removeEventListener("open", handleSocketOpen);
      } else {
        return;
      }
      if (userSocket !== null) {
        console.log("clear");
        userSocket.removeEventListener("open", handleSocketOpen);
      } else {
        return;
      }
    };
  }, [adminSocket, userSocket, userName, admin, friend]);

const getMyVideo = useCallback(async()=>{
  const video = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  setMyVideo(video);
},[]);

  useEffect(() => {
    console.log("just enter in useeffect");
    if (open && user) {
      console.log("open and user");
      const userListener = async (event) => {
        const data = JSON.parse(event.data);
        console.log("message come not admin");
        if (data.type === "sendingOffer") {
          const answer = await createAnswer(data.content);
          console.log("got offer from", data.userName);
          // Update state with offer data
          userSocket.send(
            JSON.stringify({
              type: "sendingAnswer",
              userName: friend,
              friendName: adminCon,
              content: answer,
            })
          );
        }
      };
      userSocket.send(
        JSON.stringify({
          type: "askingOffer",
          userName: friend,
          friendName: adminCon,
        })
      );
      userSocket.addEventListener("message", userListener);
      return () => {
        userSocket.removeEventListener("message", userListener);
      };
    } else if (open && admin) {
      console.log("open and admin");
      const adminListener = async (event) => {
        const data = JSON.parse(event.data);
        console.log("message come admin");
        if (data.type === "askingOffer") {
          setFriend(data.userName);
          console.log("Asking Offer by", data.userName);
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
          console.log("got answer from", data.userName);
          // Update state with answer data
        }
      };
      adminSocket.addEventListener("message", adminListener);
      return () => {
        adminSocket.removeEventListener("message", adminListener);
      };
    }
  }, [admin,adminSocket,open,friend,createOffer,createAnswer,user,userSocket,adminCon,setFriend,setRemoteAnswer]);


  useEffect(()=>{
     getMyVideo();
  },[getMyVideo]);

  const handleJoin = () => {
    setFriend(nameRef.current.value.trim());
    setUserName(nameRef.current.value.trim());
  };
  return (
    <React.Fragment>
      {true ? (
        <div className="flex flex-col justify-center items-center h-full w-full ">
         <ReactPlayer playing muted className="w-20 aspect-square bg-blf" url={remoteStream}></ReactPlayer>
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
        <ReactPlayer playing muted  className="w-20 aspect-square bg-blt" url={myVideo} ></ReactPlayer>
      <button onClick={e => sendVideo(myVideo)}>Send My Vidoe</button>
        </div>
      ) : null}
    </React.Fragment>
  );
}
export default JoinMeet;
