/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useDispatch } from "react-redux";
import { updateProctoring, addFlag } from "../Store/testSlice";
import { convertToISTWithTime } from "../Utils/time";

const MobileDetection = ({ toast }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [mobileDetected, setMobileDetected] = useState(false);
  const [model, setModel] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
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

 // Replace your current useEffect for detection with this version:
useEffect(() => {
  let isMounted = true;

  const detectMobile = async () => {
    if (!isMounted) return;
    if (model && videoRef.current && videoRef.current.readyState === 4) {
      try {
        const video = videoRef.current;
        const predictions = await model.detect(video);
        const mobileFound = predictions.some(
          (prediction) => prediction.class === "cell phone"
        );
        setMobileDetected(mobileFound);

        if (mobileFound) {
          toast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Mobile device detected!",
            life: 3000,
          });
          dispatch(updateProctoring({ mobile_score: 1 }));
          dispatch(
            addFlag("Mobile Phone detected at " + convertToISTWithTime(new Date()))
          );
        }

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
      } catch (err) {
        console.error(err);
      }
    }
    setTimeout(detectMobile, 1500);
  };

  detectMobile();

  return () => {
    isMounted = false;
  };
}, [model,dispatch]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          width: "0px",
          height: "0px",
        }}
      >
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
    </div>
  );
};

export default MobileDetection;
