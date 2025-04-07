/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

export default function TeacherDataView() {
  const [teacher, setTeacher] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
    name: { value: null, matchMode: "contains" },
    email: { value: null, matchMode: "contains" },
    department: { value: null, matchMode: "contains" },
  });

  useEffect(() => {
    const getTeachers = async () => {
      const res = await axios.get(process.env.REACT_APP_ADMIN_GET_TEACHERS, {
        withCredentials: true,
      });
      
      if(Array.isArray(res.data.data)){
      setTeacher(res.data.data);
      }
    };
    getTeachers();
  }, []);

  const serialNumberTemplate = (rowData, { rowIndex }) => {
    return <strong>{rowIndex + 1}</strong>;
  };

  const handleView = async (user) => {
    setVisible(true);
    setLoading(true);
    try {
      const res = await axios.get(process.env.REACT_APP_ADMIN_GET_ONE_TEACHER, {
        params: { email: user.email },
        withCredentials: true,
      });
      if(res.data.data!=="" && res.data.data.tests.length){
      setSelectedTeacher(res.data.data);
      }
    } catch (error) {
      setSelectedTeacher(null);
    }
    setLoading(false);
  };

  const confirmDelete = (user) => {
    setTeacherToDelete(user);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    try {
      await axios.delete(process.env.REACT_APP_ADMIN_DELETE_TEACHER, {
        params: { email: teacherToDelete.email },
        withCredentials: true,
      });

      setTeacher((prevTeachers) =>
        prevTeachers.filter((t) => t.email !== teacherToDelete.email)
      );
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
    setDeleteDialog(false);
    setTeacherToDelete(null);
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
      <h1>Teachers</h1>
      <DataTable
        value={teacher || []}
        paginator
        rows={10}
        rowsPerPageOptions={[5,10,20,30,50,100]}
        emptyMessage="No teachers found."
        filters={filters}
        globalFilterFields={["name", "email", "department"]}
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
          header="Actions"
          body={actionButtons}
          style={{ width: "20%" }}
        />
      </DataTable>
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Teacher Details"
      >
        {loading ? (
          <p>Loading...</p>
        ) : selectedTeacher ? (
          <div>
            <img
              src={`data:image/png;base64,${selectedTeacher.profile}`}
              alt="Teacher"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: ".5em",
                objectFit: "cover",
              }}
            />
            <p>
              <span className="font-bold mr-2">Name:</span>
              {selectedTeacher.name}
            </p>
            <p>
              <span className="font-bold mr-2">Department:</span>
              {selectedTeacher.department}
            </p>
            <p>
              <span className="font-bold mr-2">Phone:</span>
              {selectedTeacher.phone}
            </p>
            <p>
              <span className="font-bold mr-2">Test count:</span>
              {selectedTeacher.tests.length}
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
          <strong>{teacherToDelete?.name}</strong>?
        </p>
      </Dialog>
    </div>
  );
}
