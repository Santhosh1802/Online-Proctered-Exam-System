/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

export default function StudentDataView() {
  const [student, setStudent] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
    name: { value: null, matchMode: "contains" },
    email: { value: null, matchMode: "contains" },
    department: { value: null, matchMode: "contains" },
    batch: { value: null, matchMode: "contains" },
    section: { value: null, matchMode: "contains" },
    registerNumber: { value: null, matchMode: "contains" },
  });

  useEffect(() => {
    const getStudents = async () => {
      const res = await axios.get(process.env.REACT_APP_ADMIN_GET_STUDENTS, {
        withCredentials: true,
      });
      if(Array.isArray(res.data.data)){
      setStudent(res.data.data);
      }
    };
    getStudents();
  }, []);

  const serialNumberTemplate = (rowData, { rowIndex }) => {
    return <strong>{rowIndex + 1}</strong>;
  };

  const handleView = async (user) => {
    setVisible(true);
    setLoading(true);
    try {
      const res = await axios.get(process.env.REACT_APP_ADMIN_GET_ONE_STUDENT, {
        params: { email: user.email },
        withCredentials: true,
      });
      if(res.data.data){
      setSelectedStudent(res.data.data);
      }
    } catch (error) {
      setSelectedStudent(null);
      console.error(error);
    }
    setLoading(false);
  };

  const confirmDelete = (user) => {
    setStudentToDelete(user);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await axios.delete(process.env.REACT_APP_ADMIN_DELETE_STUDENT, {
        params: { email: studentToDelete.email },withCredentials:true
      });

      setStudent((prevStudents) =>
        prevStudents.filter((t) => t.email !== studentToDelete.email)
      );
    } catch (error) {
      console.error("Error deleting student:", error);
    }
    setDeleteDialog(false);
    setStudentToDelete(null);
  };

  const actionButtons = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          label="View"
          icon="pi pi-eye"
          className="p-button-sm p-button-info"
          onClick={() => handleView(rowData)}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-sm p-button-danger"
          onClick={() => confirmDelete(rowData)}
        />
      </div>
    );
  };

  const onFilter = (e) => {
    const { value, field } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: { value, matchMode: "contains" },
    }));
  };

  return (
    <div className="card" style={{ marginBottom: "1em" }}>
      <h1>Students</h1>
      <DataTable
        value={student || []}
        paginator
        rows={10}
        filters={filters}
        globalFilterFields={[
          "name",
          "email",
          "department",
          "batch",
          "section",
          "registerNumber",
        ]}
        header={
          <div className="table-header">
            <span className="p-input-icon-left">
              <i className="pi pi-search" style={{ marginLeft: "1em" }} />
              <InputText
                type="search"
                onInput={(e) => setGlobalFilter(e.target.value)}
                placeholder="Global Search"
                style={{ paddingLeft: "2.5em" }}
              />
            </span>
          </div>
        }
      >
        <Column
          field="serialNumber"
          header="S.No."
          body={serialNumberTemplate}
        ></Column>
        <Column
          field="name"
          header="Name"
          filter
          filterElement={
            <InputText
              value={filters.name?.value || ""}
              onChange={(e) =>
                onFilter({ target: { value: e.target.value, field: "name" } })
              }
              placeholder="Search by Name"
            />
          }
        ></Column>
        <Column
          field="email"
          header="Email"
          filter
          filterElement={
            <InputText
              value={filters.email?.value || ""}
              onChange={(e) =>
                onFilter({ target: { value: e.target.value, field: "email" } })
              }
              placeholder="Search by Email"
            />
          }
        ></Column>
        <Column
          field="department"
          header="Department"
          filter
          filterElement={
            <InputText
              value={filters.department?.value || ""}
              onChange={(e) =>
                onFilter({
                  target: { value: e.target.value, field: "department" },
                })
              }
              placeholder="Search by Department"
            />
          }
        ></Column>
        <Column
          field="batch"
          header="Batch"
          filter
          filterElement={
            <InputText
              value={filters.batch?.value || ""}
              onChange={(e) =>
                onFilter({ target: { value: e.target.value, field: "batch" } })
              }
              placeholder="Search by Batch"
            />
          }
        ></Column>
        <Column
          field="section"
          header="Section"
          filter
          filterElement={
            <InputText
              value={filters.section?.value || ""}
              onChange={(e) =>
                onFilter({
                  target: { value: e.target.value, field: "section" },
                })
              }
              placeholder="Search by Section"
            />
          }
        ></Column>
        <Column
          field="registerNumber"
          header="Reg.no"
          filter
          filterElement={
            <InputText
              value={filters.registerNumber?.value || ""}
              onChange={(e) =>
                onFilter({
                  target: { value: e.target.value, field: "registerNumber" },
                })
              }
              placeholder="Search by Reg.no"
            />
          }
        ></Column>
        <Column
          header="Actions"
          body={actionButtons}
          style={{ width: "20%" }}
        />
      </DataTable>
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Student Details"
      >
        {loading ? (
          <p>Loading...</p>
        ) : selectedStudent ? (
          <div>
            <img
              src={`data:image/png;base64,${selectedStudent.profile}`}
              alt="Student"
              style={{
                width: "130px",
                height: "165px",
                borderRadius: ".5em",
                objectFit: "cover",
              }}
            />
            <p>
              <span className="font-bold mr-2">Name:</span>
              {selectedStudent.name}
            </p>
            <p>
              <span className="font-bold mr-2">Register Number:</span>
              {selectedStudent.registerNumber}
            </p>
            <p>
              <span className="font-bold mr-2">Email:</span>
              {selectedStudent.email}
            </p>
            <p>
              <span className="font-bold mr-2">Department:</span>
              {selectedStudent.department}
            </p>
            <p>
              <span className="font-bold mr-2">Phone:</span>
              {selectedStudent.phone}
            </p>
            <p>
              <span className="font-bold mr-2">Batch:</span>
              {selectedStudent.batch}
            </p>
            <p>
              <span className="font-bold mr-2">Section:</span>
              {selectedStudent.section}
            </p>
          </div>
        ) : (
          <p>No details available</p>
        )}
      </Dialog>
      <Dialog
        visible={deleteDialog}
        onHide={() => setDeleteDialog(false)}
        header="Confirm Deletion"
        footer={
          <div className="flex justify-content-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setDeleteDialog(false)}
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={handleDelete}
            />
          </div>
        }
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{studentToDelete?.name}</strong>?
        </p>
      </Dialog>
    </div>
  );
}
