import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFlag, updateProctoring } from "../Store/testSlice";
import { convertToISTWithTime } from "../Utils/time";

const TabSwitchDetector = ({ toast }) => {
  const [isInactive, setIsInactive] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isInactive) {
        setIsInactive(true);
        dispatch(updateProctoring({ tab_score: 1 }));
        dispatch(
          addFlag("Tab switched at " + convertToISTWithTime(new Date()))
        );
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Tab switched!",
          life: 3000,
        });
      } else if (!document.hidden) {
        setIsInactive(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, isInactive, toast]);

  return null;
};

export default TabSwitchDetector;
