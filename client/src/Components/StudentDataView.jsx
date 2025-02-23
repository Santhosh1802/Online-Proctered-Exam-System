import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
export default function StudentDataView() {
  const [student, setStudent] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
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
  const handleView = async (user) => {
    setVisible(true);
    setLoading(true);
    try {
      const res = await axios.get(process.env.REACT_APP_ADMIN_GET_ONE_STUDENT, {
        params: { email: user.email_id },
        withCredentials: true,
      });
      setSelectedStudent(res.data.data);
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
        params: { email: studentToDelete.email_id },
        withCredentials: true,
      });

      setStudent((prevStudents) =>
        prevStudents.filter((t) => t.email_id !== studentToDelete.email_id)
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

  return (
    <div className="card">
      <h1>Students</h1>
      <DataTable value={student} paginator rows={10} style={{ marginBottom:"1em"}}>
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
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Student Details"
        style={{ width: "20vw" }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : selectedStudent ? (
          <div>
            <img
              src={`data:image/png;base64,${selectedStudent.profile}`}
              alt="Student"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: ".5em",
                objectFit: "cover",
              }}
            />
            <p>
              <span className="font-bold mr-2">Name:</span>
              {selectedStudent.name}
            </p>
            <p>
              <span className="font-bold mr-2">Department:</span>
              {selectedStudent.department}
            </p>
            <p>
              <span className="font-bold mr-2">Phone:</span>
              {selectedStudent.phone}
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
        style={{ width: "25vw" }}
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
          <strong>{studentToDelete?.user_name}</strong>?
        </p>
      </Dialog>
    </div>
  );
}
