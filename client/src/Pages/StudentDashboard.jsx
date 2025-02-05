import React from "react";
import StudentNavBar from "../Components/StudentNavBar";

export default function StudentDashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <StudentNavBar />
      <div style={{ marginTop: "5em" }}>
        <h1>Welcome Student</h1>
      </div>
    </div>
  );
}
