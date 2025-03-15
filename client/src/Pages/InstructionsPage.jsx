import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Button } from "primereact/button";
import {
  setTestId,
  setTestDuration,
  setProctorSettings,
} from "../Store/testSlice";

export default function InstructionsPage({ toast }) {
  const { testId } = useParams();
  const [testDetails, setTestDetails] = useState({});
  const [acknowledged, setAcknowledged] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_STUDENT_GET_ONE_TEST}`, {
        params: { id: testId },
        withCredentials: true,
      })
      .then((response) => {
        setTestDetails(response.data.data);
      })
      .catch((error) => console.error("Error fetching test details:", error));
  }, [testId]);

  const handleStartTest = () => {
    dispatch(setTestId(testDetails._id));
    dispatch(setTestDuration(testDetails.duration * 60)); // Convert minutes to seconds
    dispatch(setProctorSettings(testDetails.proctor_settings));
    navigate(`/test/${testId}`, {
      state: { proctorSettings: testDetails.proctor_settings },
    });
  };

  return (
    <div style={{ margin: "2em" }}>
      <Button
        label="Back"
        onClick={() => {
          navigate("/studentdashboard");
        }}
      />
      <div
        style={{
          padding: "2em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
          border: "2px solid black",
          borderRadius: "2em",
          width: "50%",
          margin: "auto",
        }}
      >
        <h1
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Test Instructions
        </h1>
        <p>
          <strong>Test Name:</strong> {testDetails.testname}
        </p>
        <p>
          <strong>Description:</strong> {testDetails.description}
        </p>
        <p>
          <strong>Duration:</strong> {testDetails.duration} minutes
        </p>
        <p>
          <strong>Proctor Settings:</strong>{" "}
          {testDetails.proctor_settings?.join(", ") || "None"}
        </p>

        <h2>General Rules</h2>
        <ul>
          <li>No external help is allowed during the test.</li>
          <li>You must stay within the camera frame at all times.</li>
          <li>Do not navigate away from the test window.</li>
        </ul>

        <h2>Proctoring Guidelines</h2>
        <ul>
          <li>
            Face Detection will monitor your presence throughout the test.
          </li>
          <li>Noise Detection will ensure a quiet environment.</li>
          <li>Any suspicious activity may lead to disqualification.</li>
        </ul>

        <h2>Technical Requirements</h2>
        <ul>
          <li>Stable internet connection.</li>
          <li>Functional webcam and microphone.</li>
          <li>Latest version of Chrome or Firefox browser.</li>
        </ul>

        <h2>Test Navigation</h2>
        <ul>
          <li>
            You can navigate between questions using the navigation panel.
          </li>
          <li>The timer will be visible throughout the test.</li>
          <li>Click the "Submit" button when you finish the test.</li>
        </ul>

        <h2>Consequences of Violations</h2>
        <ul>
          <li>Any violation of the rules may result in test termination.</li>
          <li>Suspicious behavior flagged by proctoring will be reviewed.</li>
        </ul>

        <div style={{ marginTop: "1em" }}>
          <input
            type="checkbox"
            id="acknowledge"
            checked={acknowledged}
            onChange={() => setAcknowledged(!acknowledged)}
          />
          <label htmlFor="acknowledge">
            {" "}
            I have read and understood the instructions.
          </label>
        </div>

        <div
          style={{
            marginTop: "1em",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            label="Test Camera and Audio"
            onClick={() =>
              window.open(
                "https://www.onlinemictest.com/webcam-test/",
                "_blank"
              )
            }
          />
          <Button
            label="Start Test"
            onClick={handleStartTest}
            disabled={!acknowledged}
            className="p-button-success"
            style={{ marginLeft: "1em" }}
          />
        </div>
      </div>
    </div>
  );
}
