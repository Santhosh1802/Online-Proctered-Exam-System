import React from "react";
import TeacherNavBar from "../Components/TeacherNavBar";
export default function TeacherManageTest() {
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
        <h1>Manage Test</h1>
      </div>
    </div>
  );
}
