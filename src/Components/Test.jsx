import React, { useCallback, useEffect, useRef, useState } from "react";
import Setting from "./Setting";
import { usePeer } from "./../Contexts/Peer";
import MicOff from "./../assets/images/micOff.png";
import CutCall from "./../assets/images/cutCall.png";
import VideoOff from "./../assets/images/videoOff.png";
import Mute from "./../assets/images/mute.png";
import Settings from "./../assets/images/setting.png";

function Test() {
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendVideo,
    remoteStream,
    setting,
    setSetting,
  } = usePeer();
  const [stream, setStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const dummyVideo = useCallback(async () => {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(newStream);
    if (localVideoRef.current && remoteVideoRef.current && stream) {
      // localVideoRef.current.srcObject = stream;
      // remoteVideoRef.current.srcObject = stream;
    }
  }, [stream]);
  useEffect(() => {
    dummyVideo();
  });
const handleMore = useCallback(async()=>{
  setSetting("start");
},[setSetting]);

const handleMute = useCallback(async()=>{
  setSetting("start");
},[setSetting]);
const handleDisconnect = useCallback(async()=>{
  setSetting("start");
},[setSetting]);
const handleStop = useCallback(async()=>{
  setSetting("start");
},[setSetting]);
const handleSilence = useCallback(async()=>{
  setSetting("start");
},[setSetting]);





  return (
    <React.Fragment>
      {setting === "ok" ? (
        <div className="w-svw h-svh bg-blm  flex justify-center items-center ">
          <div className="bg-blf h-full sm:w-1/2 md:w-1/4   flex flex-col justify-between overflow-hidden relative px-2 pt-2">
            <video
              ref={localVideoRef}
              muted
              autoPlay
              playsInline
              className="absolute right-3 top-3 rounded-md  object-cover h-24 w-16 ring-1 ring-black"
            ></video>
            <div className="flex flex-col justify-center items-center h-full">
              <video
                ref={remoteVideoRef}
                muted
                autoPlay
                playsInline
                className="w-full h-full ring-2 ring-black bg-blm rounded-md  object-cover  "
              ></video>
            </div>
            <div className="w-full bg-transparent  py-2 flex items-center justify-center">
              <div className="flex justify-between w-full rounded-md ring-2 ring-black items-center px-4 py-2 bg-blm h-fit ">
                <button  onClick={handleMute} className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    className="size-8 p-1 rounded-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.40135 12.5C9.63354 12.9014 9.95606 13.244 10.3411 13.5M9.17071 4C9.58254 2.83481 10.6938 2 12 2C13.6569 2 15 3.34315 15 5L15 10.5"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6 11C6 14.3137 8.68629 17 12 17C12.4675 17 12.9225 16.9465 13.3592 16.8454M18 11C18 11.854 17.8216 12.6663 17.5 13.4017"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="12"
                      y1="18"
                      x2="12"
                      y2="20"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="10"
                      y1="21"
                      x2="14"
                      y2="21"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <line
                      x1="2.4137"
                      y1="2.03821"
                      x2="19.0382"
                      y2="19.5863"
                      stroke="#333333"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                  <p>Mute</p>
                </button>

                <button  onClick={handleStop} className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                     className="size-8 p-1 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
                    />
                  </svg>
                  Stop
                </button>
                <button  onClick={handleDisconnect} className="flex flex-col text-sm items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  className="size-8 p-1 bg-ble text-blm rounded-full">
  <path fill-rule="evenodd" d="M15.22 3.22a.75.75 0 0 1 1.06 0L18 4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L19.06 6l1.72 1.72a.75.75 0 0 1-1.06 1.06L18 7.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L16.94 6l-1.72-1.72a.75.75 0 0 1 0-1.06ZM1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
</svg>

                  Disconnect
                </button>
                <button  onClick={handleSilence}  className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-8 p-1 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                  Silence
                </button>

                <button onClick={handleMore} className="flex flex-col text-sm items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-8 p-1 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  More
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Setting localVideoRef={localVideoRef} />
      )}
    </React.Fragment>
  );
}

export default Test;
