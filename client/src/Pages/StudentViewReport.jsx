import React from "react";
import StudentNavBar from '../Components/StudentNavBar'
export default function StudentViewReport() {
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
        <h1>View Report</h1>
      </div>
    </div>
  );
}
