import React, { useState, useCallback, useRef, useEffect } from "react";
import { useFriend } from "./../Contexts/Friend";
import { useNavigate } from 'react-router-dom';
import { RandomString } from "../JavaScriptFun/RandomString";



 

function StartMeet() {
 const [isClick, setIsClick] = useState(false);
 const [adminName, setAdminName] = useState('');
 const [meetingId, setMeetingId] = useState('');
 const nameRef= useRef();
 const navigate = useNavigate();
 const {setAdminCon } = useFriend();


// click on start instant meeting
const startMeet = useCallback(()=>{
  console.log("StartMeet Click");
  setIsClick(true);
},[]);

const saveMeet = useCallback(()=>{
  console.log("saveMeetCallback");
  if(adminName !== '' && meetingId !== ''){
    console.log("fetch request sent",adminName,meetingId);
    const content = {adminName:adminName,meetingId:meetingId}
    fetch(`https://facesyncbackend.onrender.com/saveMeet`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content)
    }).then(data=>data.json()).then((data)=>{
if(data.status === 'success'){
  const cleanName = adminName.toLowerCase().replace(/\s+/g, "");
  navigate(`/meeting/?adminName=${cleanName}&meetingId=${meetingId}`)}
    }).catch(err=>console.log(err));
  }
},[adminName,meetingId,navigate]);

useEffect(()=>{
saveMeet();
},[saveMeet]);


const sendMeet = useCallback(()=>{
  console.log("sendMeetCallback");
  console.log("Send Meet",nameRef.current.value.trim())
  setAdminName(nameRef.current.value.trim());
  setAdminCon(nameRef.current.value.trim());
  const rs = RandomString(6);
  setMeetingId(rs);
},[nameRef,setAdminCon]);
  return (
    <React.Fragment>
    <div className=" flex flex-col h-svh w-full items-center justify-center gap-16  bg-blm ">
      <div>
        <img
          className="w-44 aspect-square "
          src="/images/welcome.png"
          alt="Welcome"
        />
        <div className="flex flex-col items-center mt-3">
          <h1 className="text-2xl font-[600]">Let's Meet</h1>
          <p className="text-blt font-[500] text-sm">Dil khol k baaten kro</p>
        </div>
      </div>
      {isClick && (
        <React.Fragment>
        <input className="border border-blt rounded-md py-2 bg-blg" ref={nameRef}  type="text" />
        <button onClick={sendMeet}>Continue</button>
        </React.Fragment>
      )}
      {!isClick && (
        <button onClick={startMeet}>Start Instant Meeting</button>
      )}
    </div>
    </React.Fragment>
  );
}
export default StartMeet;

 
   
 

