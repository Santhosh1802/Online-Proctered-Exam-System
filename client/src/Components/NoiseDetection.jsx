import React, { useEffect, useState } from 'react';

const NoiseDetection = () => {
  const [volume, setVolume] = useState(0);
  const [isViolation, setIsViolation] = useState(false);
  const threshold = 80; 
  const smoothingFactor = 0.9; 

  useEffect(() => {
    let audioContext, analyser, dataArray;
    let previousVolume = 0;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;  
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        const monitorAudio = () => {
          analyser.getByteFrequencyData(dataArray);

          const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          
          const smoothedVolume = smoothingFactor * previousVolume + (1 - smoothingFactor) * avgVolume;

          setVolume(smoothedVolume);
          if (smoothedVolume > threshold) {
            setIsViolation(true);
            console.log("Violation detected: High noise level!");
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
    };
  }, []);

  return (
    <div>
      {/* <h2>Audio Monitoring</h2>
      <p>Current Volume: {volume.toFixed(2)}</p> */}
      {isViolation && <p style={{ color: 'red' }}>Violation detected: High noise level!</p>}
    </div>
  );
};

export default NoiseDetection;
