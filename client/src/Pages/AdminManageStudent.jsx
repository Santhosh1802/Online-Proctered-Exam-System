import React, { useState } from "react";
import AdminNavBar from "../Components/AdminNavBar";
import StudentDataView from "../Components/StudentDataView";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import ExcelToJson from "../Components/ExcelToJson";

export default function AdminManageStudent({ toast }) {
  const [visible, setVisible] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    registerNumber: "",
    batch: "",
    section: "",
    password: "",
  });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (
        studentData.name === "" ||
        studentData.email === "" ||
        studentData.phone === "" ||
        studentData.department === "" ||
        studentData.registerNumber === "" ||
        studentData.batch === "" ||
        studentData.section === "" ||
        studentData.password === ""
      ) {
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Fill all details to create student",
        });
      } else {
        await axios.post(
          process.env.REACT_APP_ADMIN_CREATE_STUDENT,
          studentData,{withCredentials:true}
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Student Created",
        });
        setVisible(false);
        setStudentData({
          name: "",
          email: "",
          phone: "",
          department: "",
          registerNumber: "",
          section: "",
          batch: "",
          password: "",
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to create student",
      });
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <AdminNavBar />
      <div
        style={{
          marginTop: "7em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
        }}
      >
        <ExcelToJson />
        <Button
          label="Create One Student"
          onClick={() => setVisible(true)}
          style={{ marginTop: "2em", alignSelf: "flex-start" }}
        />
      </div>
      <div style={{ width: "80%" }}>
        <StudentDataView />
      </div>
      <Dialog
        header="Create Student"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            padding: "2em",
          }}
        >
          <InputText
            name="name"
            placeholder="Name"
            value={studentData.name}
            onChange={handleChange}
            required
            tooltip="Enter Student Name" tooltipOptions={{ event: 'focus' }}
            title="Student Name"
          />
          <InputText
            name="email"
            placeholder="Email"
            type="email"
            value={studentData.email}
            onChange={handleChange}
            required
            tooltip="Enter Student Email" tooltipOptions={{ event: 'focus' }}
            title="Student Email"
          />
          <InputText
            name="phone"
            placeholder="Phone"
            value={studentData.phone}
            onChange={handleChange}
            required
            tooltip="Enter Student Phone Number" tooltipOptions={{ event: 'focus' }}
            title="Student Phone Number"
          />
          <InputText
            name="department"
            placeholder="Department"
            value={studentData.department}
            onChange={handleChange}
            required
            tooltip="Enter Student Department" tooltipOptions={{ event: 'focus' }}
            title="Student Department"
          />
          <InputText
            name="registerNumber"
            placeholder="Register Number"
            value={studentData.registerNumber}
            onChange={handleChange}
            required
            tooltip="Enter Student Register Number" tooltipOptions={{ event: 'focus' }}
            title="Student Register Number"
          />
          <InputText
            name="batch"
            placeholder="Batch"
            value={studentData.batch}
            onChange={handleChange}
            required
            tooltip="Enter Student Batch" tooltipOptions={{ event: 'focus' }}
            title="Student Batch"
          />
          <InputText
            name="section"
            placeholder="Section"
            value={studentData.section}
            onChange={handleChange}
            required
            tooltip="Enter Student Section" tooltipOptions={{ event: 'focus' }}
            title="Student Section"
          />
          <InputText
            name="password"
            placeholder="Password"
            value={studentData.password}
            onChange={handleChange}
            required
            tooltip="Enter Student Password" tooltipOptions={{ event: 'focus' }}
            title="Student Password"
          />
          <Button label="Create" onClick={handleSubmit} title="Create Student"/>
        </div>
      </Dialog>
    </div>
  );
}
