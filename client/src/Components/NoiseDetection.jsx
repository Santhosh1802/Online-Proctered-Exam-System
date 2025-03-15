/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addFlag, updateProctoring } from "../Store/testSlice";
import { convertToISTWithTime } from "../Utils/time";

const NoiseDetection = ({ toast }) => {
  const [volume, setVolume] = useState(0);
  const [isViolation, setIsViolation] = useState(false);
  const threshold = 80;
  const smoothingFactor = 0.9;
  const dispatch = useDispatch();
  const violationTimeout = useRef(null);

  useEffect(() => {
    let audioContext, analyser, dataArray;
    let previousVolume = 0;
    let hasDispatched = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        const monitorAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const avgVolume =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          const smoothedVolume =
            smoothingFactor * previousVolume +
            (1 - smoothingFactor) * avgVolume;

          setVolume(smoothedVolume);

          if (smoothedVolume > threshold) {
            if (!hasDispatched) {
              setIsViolation(true);
              toast.current.show({
                severity: "warn",
                summary: "Warning",
                detail: "High noise detected!",
                life: 3000,
              });
              dispatch(updateProctoring({ noise_score: 1 }));
              dispatch(
                addFlag(
                  "Heavy Noise detected at " + convertToISTWithTime(new Date())
                )
              );
              hasDispatched = true;

              if (violationTimeout.current)
                clearTimeout(violationTimeout.current);
              violationTimeout.current = setTimeout(() => {
                hasDispatched = false;
              }, 5000);
            }
          } else {
            setIsViolation(false);
          }

          previousVolume = smoothedVolume;
          requestAnimationFrame(monitorAudio);
        };

        monitorAudio();
      })
      .catch((err) => console.error("Audio monitoring failed:", err));

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (violationTimeout.current) {
        clearTimeout(violationTimeout.current);
      }
    };
  }, [toast, dispatch]);

  return <div></div>;
};

export default NoiseDetection;
