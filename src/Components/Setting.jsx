import React , {useCallback, useEffect, useRef} from "react";
import { usePeer } from "./../Contexts/Peer";
function Setting({localVideoRef}) {
    const audioInputEl = useRef(null);
    const audioOutputEl =useRef(null);
    const videoInputEl =useRef(null);
    const errV =useRef(null);
    const {setSetting,setCons} = usePeer();
    const getStream = useCallback(async () => {
        try{
         await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      }catch(err){
          console.log(err)
      }},[]);
      useEffect(()=>{
          getStream();
      },[getStream]);
    const getDevices = useCallback(async()=>{
        try{
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log(devices)
            setCons({video:true,audio:true});
            devices.forEach(d=>{
                const option = document.createElement('option') //create the option tag
                option.value = d.deviceId
                option.text = d.label
                //add the option tag we just created to the right select
                if(d.kind === "audioinput"){
                    audioInputEl.current.appendChild(option)    
                }else if(d.kind === "audiooutput"){
                    audioOutputEl.current.appendChild(option)    
                }else if(d.kind === "videoinput"){
                    videoInputEl.current.appendChild(option)    
                }
            })
        }catch(err){
            console.log(err);
        }
    },[setCons]);
    
    useEffect(()=>{
        getDevices();
    },[getDevices])
    const changeAudioInput = async(e)=>{
        //changed audio input!!!
        const deviceId = e.target.value;
        console.log("changed audio input");
        const newConstraints = {
            audio: {deviceId: {exact: deviceId}},
            video: true,
        };
        setCons(newConstraints);

    }
    const changeAudioOutput = async(e)=>{
        alert(localVideoRef);
      await localVideoRef.current.setSinkId(e.target.value);
        console.log("Changed audio device!")
    }
    
    const changeVideo = async(e)=>{
        //changed video input!!!
        const deviceId = e.target.value;
        console.log("changed Vid input");
        alert("vid change")
        const newConstraints = {
            audio: true,
            video: {deviceId: {exact: deviceId}},
        }
        setCons(newConstraints);
    }
    
    return(
    <div>
    <button onClick={() => {
  setSetting("ok");
}}>Done</button>
<h6 ref={errV}>Error</h6>
             <div>
                <label>Select audio input: </label>
                <select onChange={changeAudioInput} ref={audioInputEl} id="audio-input"></select>
            </div>
            <div>
                <label>Select audio output: </label>
                <select onChange={changeAudioOutput} ref={audioOutputEl} id="audio-output"></select>
            </div>
            <div>
                <label>Select video input: </label>
                <select onChange={changeVideo} ref={videoInputEl} id="video-input"></select>
            </div>
        </div>
    )
}

export default Setting;
