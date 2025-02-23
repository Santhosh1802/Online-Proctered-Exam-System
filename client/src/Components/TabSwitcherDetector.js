import React, { useState, useEffect } from "react";

const TabSwitchDetector = () => {
  const [isTabActive, setIsTabActive] = useState(true); 
  const [switchCount, setSwitchCount] = useState(0); 

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
        setSwitchCount((prevCount) => prevCount + 1);
      } else {
        setIsTabActive(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* <h1>Tab Switch Detection</h1> */}
      {/* <p>
        Tab is currently: <b>{isTabActive ? "Active" : "Inactive"}</b>
      </p> */}
      <p>
        You have switched tabs <b>{switchCount}</b> times.
      </p>
    </div>
  );
};

export default TabSwitchDetector;
