/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import TeacherNavBar from "../Components/TeacherNavBar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function TeacherManageTest({ toast}) {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const id=useSelector((state)=>state.user.id);
  console.log(id);
  
  useEffect(() => {
    const fetchTests = async () => {
      try {
        console.log(id);
        
        const res = await axios.get(process.env.REACT_APP_TEACHER_GET_TESTS, {
          params:{teacher_id:id},
          withCredentials: true,
        });
        console.log(res.data.data);
        
        setTests(res.data.data||[]);
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load tests",
        });
      }
    };

    fetchTests();
  }, [id]);
  const handleCreateTest = () => {
    navigate("/createtest");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TeacherNavBar />
      <div style={{ marginTop: "5em", width: "80%" }}>
        <h1>Manage Tests</h1>
        <Button onClick={handleCreateTest}>Create Test</Button>

        {/* List of Tests */}
        <div style={{ marginTop: "2em", width: "100%" }}>
          {tests.length === 0 ? (
            <p>No tests available.</p>
          ) : (
            tests.map((test, index) => (
              <Card key={test._id || index} title={test.testname} style={{ marginBottom: "1em" }}>
                <p><strong>Description:</strong> {test.description}</p>
                <p><strong>Duration:</strong> {new Date(test.createdAt).toLocaleDateString()}</p>
                <Button label="Edit" onClick={() => navigate(`/edittest/${test._id}`)} />
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
