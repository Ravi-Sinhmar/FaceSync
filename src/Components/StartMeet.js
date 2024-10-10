import React, { useState, useCallback } from "react";
import { useFriend } from "./../Contexts/Friend";
import { useNavigate } from 'react-router-dom';
import { RandomString } from "../JavaScriptFun/RandomString";
function StartMeet() {
 const [isClick, setIsClick] = useState(false);
 const [adminName, setAdminName] = useState('');

 const navigate = useNavigate();
 const {setAdminCon } = useFriend();


// click on start instant meeting
const startMeet = useCallback(()=>{
  console.log("StartMeet Click");
  setIsClick(true);
},[]);

const handleInputChange = (event) => {
  setAdminName(event.target.value);
  setAdminCon(event.target.value);
};

const saveMeet = useCallback(()=>{
  console.log("saveMeetCallback");
  const meetId = RandomString(6);
    console.log("fetch request sent",adminName,meetId);
    const content = {adminName:adminName,meetingId:meetId}
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
  navigate(`/meeting/?adminName=${cleanName}&meetingId=${meetId}`)}
    }).catch(err=>console.log(err));
},[adminName,navigate]);
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
        <input value={adminName}
        onChange={handleInputChange} className="border border-blt rounded-md py-2 bg-blg"  type="text" />
        <button onClick={saveMeet}>Continue</button>
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

 
   