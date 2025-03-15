import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import TeacherNavBar from "../Components/TeacherNavBar";
import { useSelector } from "react-redux";

export default function TeacherAssignTest({ toast }) {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [section, setSection] = useState("");

  const id = useSelector((state) => state.user.id);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_GET_UNIQUE_DEPARTMENTS}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.departments);

        setDepartments(response.data.departments || []);
      })
      .catch((error) => console.error("Error fetching departments:", error));
    axios
      .get(`${process.env.REACT_APP_TEACHER_GET_TESTS}`, {
        params: { teacher_id: id },
        withCredentials: true,
      })
      .then((response) => {
        setTests(response.data.data || []);
      })
      .catch((error) => console.error("Error fetching tests:", error));
  }, [id]);

  useEffect(() => {
    if (department) {
      axios
        .get(`${process.env.REACT_APP_GET_UNIQUE_BATCHES}`, {
          params: { department },
          withCredentials: true,
        })
        .then((response) => {
          setBatches(response.data.batches || []);
        })
        .catch((error) => console.error("Error fetching batches:", error));
    }
  }, [department]);

  useEffect(() => {
    if (batch) {
      axios
        .get(`${process.env.REACT_APP_GET_UNIQUE_SECTIONS}`, {
          params: { department, batch },
          withCredentials: true,
        })
        .then((response) => {
          setSections(response.data.sections || []);
        })
        .catch((error) => console.error("Error fetching sections:", error));
    }
  }, [batch, department]);

  const handleAssignTest = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ASSIGN_TEST_TO_STUDENTS}`,
        {
          department,
          batch,
          section,
          testId: selectedTest,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Test assigned successfully",
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to assign test",
        });
      }
    } catch (error) {
      console.error("Error assigning test:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to assign test",
      });
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
      <TeacherNavBar />
      <div style={{ marginTop: "5em", width: "40%" }}>
        <h1>Assign Test to Students</h1>
        <div className="p-fluid grid">
          <div className="col-12">
            <label>Department</label>
            <Dropdown
              className="w-full"
              value={department}
              options={departments.map((dept) => ({
                label: dept,
                value: dept,
              }))}
              onChange={(e) => setDepartment(e.value)}
              placeholder="Select a Department"
              required
            />
          </div>
          <div className="col-12">
            <label>Batch</label>
            <Dropdown
              className="w-full"
              value={batch}
              options={batches.map((batch) => ({
                label: batch,
                value: batch,
              }))}
              onChange={(e) => setBatch(e.value)}
              placeholder="Select a Batch"
              required
            />
          </div>
          <div className="col-12">
            <label>Section</label>
            <Dropdown
              className="w-full"
              value={section}
              options={sections.map((section) => ({
                label: section,
                value: section,
              }))}
              onChange={(e) => setSection(e.value)}
              placeholder="Select a Section"
              required
            />
          </div>
          <div className="col-12">
            <label>Select Test</label>
            <Dropdown
              className="w-full"
              value={selectedTest}
              options={tests.map((test) => ({
                label: test.testname,
                value: test._id,
              }))}
              onChange={(e) => setSelectedTest(e.value)}
              placeholder="Select a Test"
              required
            />
          </div>
          <div className="col-12">
            <Button
              label="Assign Test"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleAssignTest}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
