import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentNavBar from "../Components/StudentNavBar";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { setId } from "../Store/userSlice";

export default function StudentDashboard() {
  const [name, setName] = useState("");
  const [assignedTests, setAssignedTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [expiredTests, setExpiredTests] = useState([]);
  const [filter, setFilter] = useState("all");
  const userEmail = useSelector((state) => state.user.email);
  const [id, setid] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userEmail) {
      axios
        .get(process.env.REACT_APP_GET_STUDENT_DATA, {
          params: { email: userEmail },
          withCredentials: true,
        })
        .then((res) => {
          setid(res.data.data.id);
          setName(res.data.data.name);
          dispatch(setId(res.data.data.id));
        });
    } else {
      console.log("Error Call");
    }
  }, [userEmail, dispatch]);

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_GET_ASSIGNED_TESTS}`, {
          params: { studentId: id },
          withCredentials: true,
        })
        .then((response) => {
          const ongoingTests = response.data.data.ongoingTests || [];
          const completedTests = response.data.data.completedTests || [];
          const currentDate = new Date();

          const expiredTests = ongoingTests.filter(
            (test) => new Date(test.end_date) < currentDate
          );

          setAssignedTests(ongoingTests);
          setCompletedTests(completedTests);
          setExpiredTests(expiredTests);
        })
        .catch((error) =>
          console.error("Error fetching assigned tests:", error)
        );
    }
  }, [id]);

  const handleStartTest = (testId) => {
    navigate(`/instructions/${testId}`);
  };

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Expired", value: "expired" },
    { label: "Completed", value: "completed" },
  ];

  const filteredTests = () => {
    switch (filter) {
      case "ongoing":
        return assignedTests.filter(
          (test) =>
            !expiredTests.some((expired) => expired.testId === test.testId)
        );
      case "expired":
        return expiredTests;
      case "completed":
        return completedTests;
      default:
        return assignedTests;
    }
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
        <Card
          style={{
            marginBottom: "2em",
            textAlign: "center",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <h2>Ongoing Test</h2>
              <h2>{assignedTests.length - expiredTests.length}</h2>
            </div>
            <div>
              <h2>Completed Test</h2>
              <h2>{completedTests.length}</h2>
            </div>
            <div>
              <h2>Expired Test</h2>
              <h2>{expiredTests.length}</h2>
            </div>
          </div>
        </Card>
        <Dropdown
          value={filter}
          options={filterOptions}
          onChange={(e) => setFilter(e.value)}
          placeholder="Select a Filter"
          style={{ marginBottom: "2em" }}
        />
        <div className="p-grid" style={{ width: "100%" }}>
          {filteredTests().map((test) => {
            const isExpired = expiredTests.some(
              (expired) => expired.testId === test.testId
            );
            // const isCompleted = completedTests.some(
            //   (completed) => completed.testId === test.testId
            // );

            return (
              <div
                key={test.testId}
                className="p-col-12 p-md-6 p-lg-4"
                style={{ marginBottom: "2em", borderRadius: "2em" }}
              >
                <Card
                  title={test.testname}
                  subTitle={`Duration: ${test.duration} minutes`}
                >
                  <p>{test.description}</p>
                  {!isExpired  && (
                    <>
                      <p>
                        Start Date: {new Date(test.start_date).toLocaleString()}
                      </p>
                      <p>
                        End Date: {new Date(test.end_date).toLocaleString()}
                      </p>
                    </>
                  )}
                  {!isExpired && (
                    <Button
                      label="Start Test"
                      icon="pi pi-play"
                      className="p-button-success"
                      onClick={() => handleStartTest(test.testId)}
                    />
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
