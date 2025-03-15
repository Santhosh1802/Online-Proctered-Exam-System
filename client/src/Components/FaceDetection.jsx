/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs";
import MobileDetection from "./MobileDetection";
import { useDispatch } from "react-redux";
import { updateProctoring, addFlag } from "../Store/testSlice";
import { convertToISTWithTime } from "../Utils/time";

const FaceDetection = ({ toast }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [faceCount, setFaceCount] = useState(0);
  const [detector, setDetector] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadModel = async () => {
      try {
        setMessage("");

        const modelConfig = {
          runtime: "tfjs",
        };

        const model = await faceDetection.createDetector(
          faceDetection.SupportedModels.MediaPipeFaceDetector,
          modelConfig
        );

        setDetector(model);
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
    const detectFaces = async () => {
      if (detector && videoRef.current) {
        if (videoRef.current.readyState === 4) {
          const video = videoRef.current;
          const detections = await detector.estimateFaces(video);
          console.log("Detections:", detections);
          const newFaceCount = detections.length;
          setFaceCount(newFaceCount);
          if (newFaceCount === 0) {
            setMessage("No face detected. Please stay in front of the camera.");
            toast.current.show({
              severity: "warn",
              summary: "Warning",
              detail: "No face detected. Please stay in front of the camera.",
              life: 3000,
            });
            dispatch(updateProctoring({ face_score: 1 }));
            dispatch(
              addFlag("No Face Detected at " + convertToISTWithTime(new Date()))
            );
          } else if (newFaceCount > 1) {
            setMessage(`${newFaceCount} faces detected!`);
          } else {
            setMessage("Face detected");
          }

          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);

          detections.forEach((detection, index) => {
            console.log(`Detection ${index + 1}:`, detection);
            if (detection.boundingBox) {
              const { topLeft, bottomRight } = detection.boundingBox;
              const width = bottomRight[0] - topLeft[0];
              const height = bottomRight[1] - topLeft[1];

              context.beginPath();
              context.rect(topLeft[0], topLeft[1], width, height);
              context.lineWidth = 2;
              context.strokeStyle = "red";
              context.fillStyle = "red";
              context.stroke();
            } else {
              console.error("Bounding box not found for face:", detection);
            }
          });
        }
      }
    };

    const interval = setInterval(detectFaces, 500);
    return () => clearInterval(interval);
  }, [detector, dispatch, toast]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          width: "260px",
          height: "240px",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          width="260"
          height="240"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <canvas
          ref={canvasRef}
          width="260"
          height="240"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
      <MobileDetection toast={toast} />
    </div>
  );
};

export default FaceDetection;
