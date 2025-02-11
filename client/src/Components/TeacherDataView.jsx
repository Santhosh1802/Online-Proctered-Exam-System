import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
export default function TeacherDataView() {
  const [teacher, setTeacher] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  useEffect(() => {
    const getTeachers = async () => {
      const res = await axios.get(process.env.REACT_APP_ADMIN_GET_TEACHERS, {
        withCredentials: true,
      });
      setTeacher(res.data.data);
    };
    getTeachers();
  }, []);
  const serialNumberTemplate = (rowData, { rowIndex }) => {
    return <strong>{rowIndex + 1}</strong>;
  };
  const handleView = async(user) => {
    setVisible(true);
    setLoading(true);
    try {
      const res=await axios.get(process.env.REACT_APP_ADMIN_GET_ONE_TEACHER,{params:{email:user.email_id},withCredentials:true});
      setSelectedTeacher(res.data.data);
    } catch (error) {
      setSelectedTeacher(null);
      console.error(error);
    }
    setLoading(false);
  };
  const confirmDelete = (user) => {
    setTeacherToDelete(user);
    setDeleteDialog(true);
  };
  const handleDelete = async() => {
    if (!teacherToDelete) return;
    try {
      await axios.delete(process.env.REACT_APP_ADMIN_DELETE_TEACHER, {
        params: { email: teacherToDelete.email_id },
        withCredentials: true,
      });

      setTeacher((prevTeachers) =>
        prevTeachers.filter((t) => t.email_id !== teacherToDelete.email_id)
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

  return (
    <div className="card">
      <h1>Teachers</h1>
      <DataTable value={teacher} paginator rows={10}>
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
        header="Teacher Details"
        style={{ width: "20vw" }}
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
            <p><span className="font-bold mr-2">Name:</span>{selectedTeacher.name}</p>
            <p><span className="font-bold mr-2">Department:</span>{selectedTeacher.department}</p>
            <p><span className="font-bold mr-2">Phone:</span>{selectedTeacher.phone}</p>
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
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteDialog(false)} />
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />
          </div>
        }
      >
        <p>Are you sure you want to delete <strong>{teacherToDelete?.user_name}</strong>?</p>
      </Dialog>
    </div>
  );
}
