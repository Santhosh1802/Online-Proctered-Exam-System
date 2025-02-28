import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProctoring } from "../Store/testSlice";

const TabSwitchDetector = () => {
  const [switchCount, setSwitchCount] = useState(0); 
  const dispatch=useDispatch();
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSwitchCount((prevCount) => prevCount + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(()=>{
    if(switchCount>0){
      dispatch(updateProctoring({tab_score:switchCount}));
    }
  })
  return (
    <div>
    </div>
  );
};

export default TabSwitchDetector;
