import React from "react";
import TeacherNavBar from "../Components/TeacherNavBar";
export default function TeacherViewStudent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TeacherNavBar />
      <div style={{ marginTop: "5em" }}>
        <h1>View Students</h1>
      </div>
    </div>
  );
}
