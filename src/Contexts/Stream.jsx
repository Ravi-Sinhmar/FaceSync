import React, {useState,useCallback, useEffect} from 'react';
const MyContext = React.createContext(null);

 export const useStream = () =>{
    return React.useContext(MyContext);
}
function StreamProvider(props){
  const [stream,setStream] = useState(null);
  const [setting, setSetting] = useState(false);
  const [constraints,setConstraints] = useState({
    video: true,
    audio: true,
  });

  const getStream = useCallback(async () => {
  try{
    const st = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(st);
    const tracks = st.getTracks();
    console.log(tracks);
    setStream(st);
}catch(err){
    console.log(err)
}},[]);

useEffect(()=>{
    getStream();
},[getStream]);

    return(
        <MyContext.Provider value={{constraints,setConstraints,stream,setStream,setting,setSetting}}>
            {props.children}
        </MyContext.Provider>
    )
}

export default StreamProvider;



 