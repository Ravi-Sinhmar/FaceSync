import React, {useState} from 'react';
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
    return(
        <MyContext.Provider value={{constraints,setConstraints,stream,setStream,setting,setSetting}}>
            {props.children}
        </MyContext.Provider>
    )
}

export default StreamProvider;



 