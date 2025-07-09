import { createContext,useContext,useState } from "react";
const FetchContext=createContext();

export const FetchProvider=({children})=>{
    const [param,setParam]=useState("Hotels")
    const[id,setId]=useState(null)
    return <FetchContext.Provider value={{param,setParam,id,setId}}>
        {children}
    </FetchContext.Provider>
};
export const useFetch=()=>{
return useContext(FetchContext)
};