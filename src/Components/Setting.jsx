import React, { useCallback, useEffect, useRef } from "react";
import { useStream } from "../Contexts/Stream";

function Setting({ localVideoRef }) {
  const { stream, setStream, constraints, setConstraints, setting, setSetting } = useStream();
  const audioInputRef = useRef(null); // Use useRef for storing the select element
  const audioOutputRef = useRef(null);
  const videoInputRef = useRef(null);

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);

      devices.forEach((d) => {
        const option = document.createElement("option");
        option.value = d.deviceId;
        option.text = d.label;

        if (d.kind === "audioinput") {
          audioInputRef.current.appendChild(option); // Use current property
        } else if (d.kind === "audiooutput") {
          audioOutputRef.current.appendChild(option);
        } else if (d.kind === "videoinput") {
          videoInputRef.current.appendChild(option);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  const changeAudioInput = async (e) => {
    // ... (rest of your code)
  };

  const changeAudioOutput = async (e) => {
    await localVideoRef.current.setSinkId(e.target.value);
    console.log("Changed audio device!");
  };

  const changeVideo = async (e) => {
    // ... (rest of your code)
  };

  return (
    <div>
      <button onClick={() => setSetting(false)}>Done</button>
      <div>
        <label>Select audio input: </label>
        <select onChange={changeAudioInput} ref={audioInputRef} id="audio-input">
          {/* Options will be populated dynamically */}
        </select>
      </div>
      <div>
        <label>Select audio output: </label>
        <select onChange={changeAudioOutput} ref={audioOutputRef} id="audio-output">
          {/* Options will be populated dynamically */}
        </select>
      </div>
      <div>
        <label>Select video input: </label>
        <select onChange={changeVideo} ref={videoInputRef} id="video-input">
          {/* Options will be populated dynamically */}
        </select>
      </div>
    </div>
  );
}

export default Setting;