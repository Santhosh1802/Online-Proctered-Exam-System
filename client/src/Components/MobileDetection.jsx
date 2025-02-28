import React, { useRef, useEffect, useState } from "react";
// eslint-disable-next-line
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const MobileDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Initializing mobile detection...");
  const [mobileDetected, setMobileDetected] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setMessage("Loading mobile detection model...");
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setMessage("Model loaded successfully.");
        setLoading(false);
        startVideo();
      } catch (error) {
        setMessage("Error loading model: " + error.message);
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        setMessage("Failed to access webcam: " + err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const detectMobile = async () => {
      if (model && videoRef.current) {
        if (videoRef.current.readyState === 4) {
          const video = videoRef.current;
          const predictions = await model.detect(video);
          const mobileDetected = predictions.some(
            (prediction) => prediction.class === "cell phone"
          );
          setMobileDetected(mobileDetected);

          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);

          predictions.forEach((prediction) => {
            if (prediction.class === "cell phone") {
              const [x, y, width, height] = prediction.bbox;
              context.beginPath();
              context.rect(x, y, width, height);
              context.lineWidth = 2;
              context.strokeStyle = "red";
              context.fillStyle = "red";
              context.stroke();
            }
          });
        }
      }
    };

    const interval = setInterval(detectMobile, 500);
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div style={{ textAlign: "center"}}>
      <div style={{ position: "relative", display: "inline-block", width: "0px", height: "0px" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="0"
          height="0"
          style={{
            border: "1px solid black",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <canvas
          ref={canvasRef}
          width="0"
          height="0"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
      <p>{loading ? "Loading model and video..." : message}</p>
      <p>{mobileDetected ? "Mobile device detected!" : "No mobile device detected."}</p>
    </div>
  );
};

export default MobileDetection;