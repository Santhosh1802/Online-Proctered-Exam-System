import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProctoring } from "../Store/testSlice";

const TabSwitchDetector = ({toast}) => {
  const [isInactive, setIsInactive] = useState(false); // Track window state
  const dispatch = useDispatch();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isInactive) {
        setIsInactive(true);
        dispatch(updateProctoring({ tab_score: 1 })); // Dispatch only once
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Tab switched!', life: 3000 });
      } else if (!document.hidden) {
        setIsInactive(false); // Reset when window becomes active again
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, isInactive,toast]);

  return null;
};

export default TabSwitchDetector;
