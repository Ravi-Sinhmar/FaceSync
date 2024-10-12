import React , {useCallback, useEffect, useRef} from "react";
import {useStream} from "../Contexts/Stream";

function Setting({localVideoRef}) {
    const {stream, setStream , constraints,setConstraints,setting,setSetting } = useStream();
    const audioInputEl = useRef(null);
    const audioOutputEl =useRef(null);
    const videoInputEl =useRef(null);
    const getDevices = useCallback(async()=>{
        try{
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log(devices)
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
    },[]);
    
    useEffect(()=>{
        getDevices();
    },[getDevices])
    const changeAudioInput = async(e)=>{
        //changed audio input!!!
        const deviceId = e.target.value;
        setConstraints({
            audio: {deviceId: {exact: deviceId}},
            video: true,
        });
    }
    const changeAudioOutput = async(e)=>{
      await localVideoRef.current.setSinkId(e.target.value);
        console.log("Changed audio device!")
    }
    
    const changeVideo = async(e)=>{
        //changed video input!!!
        const deviceId = e.target.value;
        setConstraints({
            audio: true,
            video: {deviceId: {exact: deviceId}},
        })
       
    }
    
    return(
    <div>
    <button onClick={() => {
  setSetting(false);
}}>Done</button>
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
