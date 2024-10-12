import React, {useState,useCallback, useEffect} from 'react';
const MyContext = React.createContext(null);

 export const useStream = () =>{
    return React.useContext(MyContext);
}
function StreamProvider(props){
  const [stream,setStream] = useState(null);
  const [setting, setSetting] = useState(false);
  const [test, setTest] = useState(false);
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
}},[constraints]);

useEffect(()=>{
    if(test){
        getStream();
    }
},[getStream,test]);

    return(
        <MyContext.Provider value={{constraints,setConstraints,stream,setStream,setting,setSetting,test,setTest}}>
            {props.children}
        </MyContext.Provider>
    )
}

export default StreamProvider;



 