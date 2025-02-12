import React from "react";
import TeacherNavBar from "../Components/TeacherNavBar";
import TestForm from "../Components/TestForm";
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
        <TestForm/>
      </div>
    </div>
  );
}
