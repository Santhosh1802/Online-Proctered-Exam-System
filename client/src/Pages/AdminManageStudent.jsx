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
  });

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(process.env.REACT_APP_ADMIN_CREATE_STUDENT, studentData);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Student Created",
      });
      setVisible(false);
      setStudentData({ name: "", email: "", phone: "", department: "" });
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
        <Button label="Create One Student" onClick={() => setVisible(true)} style={{marginTop:"2em",alignSelf:"flex-start"}}/>
      </div>
      <div style={{width:"80%"}}>
      <StudentDataView />
      </div>
      <Dialog
        header="Create Student"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1em",padding:"2em" }}>
          <InputText
            name="name"
            placeholder="Name"
            value={studentData.name}
            onChange={handleChange}
            required
          />
          <InputText
            name="email"
            placeholder="Email"
            type="email"
            value={studentData.email}
            onChange={handleChange}
            required
          />
          <InputText
            name="phone"
            placeholder="Phone"
            value={studentData.phone}
            onChange={handleChange}
            required
          />
          <InputText
            name="department"
            placeholder="Department"
            value={studentData.department}
            onChange={handleChange}
            required
          />
          <InputText
            name="registerNumber"
            placeholder="Register Number"
            value={studentData.registerNumber}
            onChange={handleChange}
            required
          />
          <InputText
            name="batch"
            placeholder="Batch"
            value={studentData.batch}
            onChange={handleChange}
            required
          />
          <InputText
            name="section"
            placeholder="Section"
            value={studentData.section}
            onChange={handleChange}
            required
          />
          <InputText
            name="password"
            placeholder="Password"
            value={studentData.password}
            onChange={handleChange}
            required
          />
          <Button label="Create" onClick={handleSubmit} />
        </div>
      </Dialog>
    </div>
  );
}
