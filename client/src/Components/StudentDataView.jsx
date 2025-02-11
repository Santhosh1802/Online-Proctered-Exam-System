import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
export default function StudentDataView() {
  const [student, setStudent] = useState([]);
  useEffect(() => {
    const getStudents = async () => {
      const res = await axios.get(process.env.REACT_APP_ADMIN_GET_STUDENTS, {
        withCredentials: true,
      });
      setStudent(res.data.data);
    };
    getStudents();
  }, []);
  const serialNumberTemplate = (rowData, { rowIndex }) => {
    return <strong>{rowIndex + 1}</strong>;
  };
  const handleView = (user) => {
    alert(`Viewing details of ${user.user_name}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.user_name}?`)) {
      setStudent(student.filter((u) => u.user_name !== user.user_name));
    }
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
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <h1>Teachers</h1>
      <DataTable value={student} paginator rows={10}>
        <Column
          field="serialNumber"
          header="S.No."
          body={serialNumberTemplate}
        ></Column>
        <Column field="user_name" header="Name"></Column>
        <Column field="email_id" header="Email"></Column>
        <Column
          header="Actions"
          body={actionButtons}
          style={{ width: "20%" }}
        />
      </DataTable>
    </div>
  );
}
