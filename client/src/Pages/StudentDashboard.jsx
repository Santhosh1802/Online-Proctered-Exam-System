import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentNavBar from "../Components/StudentNavBar";
import { useSelector } from "react-redux";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [name, setName] = useState("");
  const [assignedTests, setAssignedTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const userEmail = useSelector((state) => state.user.email);
  const [id, setId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      axios
        .get(process.env.REACT_APP_GET_STUDENT_DATA, {
          params: { email: userEmail },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setId(res.data.data.id);
          setName(res.data.data.name);
        });
    } else {
      console.log("Error Call");
    }
  }, [userEmail]);

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_GET_ASSIGNED_TESTS}`, {
          params: { studentId: id },
          withCredentials: true,
        })
        .then((response) => {
          setAssignedTests(response.data.data.ongoingTests || []);
          setCompletedTests(response.data.data.completedTests || []);
        })
        .catch((error) => console.error("Error fetching assigned tests:", error));
    }
  }, [id]);

  const handleStartTest = (testId) => {
    navigate(`/instructions/${testId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <StudentNavBar />
      <div style={{ marginTop: "5em", width: "70%" }}>
        <h1>Welcome {name} 👋</h1>
        <Card style={{ marginBottom: "2em", textAlign: "center", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <h2>Ongoing Test</h2>
              <h2>{assignedTests.length}</h2>
            </div>
            <div>
              <h2>Completed Test</h2>
              <h2>{completedTests.length}</h2>
            </div>
          </div>
        </Card>
        <div className="p-grid">
          {assignedTests.map((test) => (
            <div key={test.testId} className="p-col-12 p-md-6 p-lg-4" style={{ margin: "2em", borderRadius: "2em" }}>
              <Card title={test.testname} subTitle={`Duration: ${test.duration} minutes`}>
                <p>{test.description}</p>
                <p>Start Date: {new Date(test.startedAt).toLocaleString()}</p>
                <Button label="Start Test" icon="pi pi-play" className="p-button-success" onClick={() => handleStartTest(test.testId)} />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}