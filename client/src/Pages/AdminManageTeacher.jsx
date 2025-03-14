import React, { useState } from 'react';
import AdminNavBar from '../Components/AdminNavBar';
import TeacherDataView from '../Components/TeacherDataView';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

export default function AdminManageTeacher({ toast }) {
  const [visible, setVisible] = useState(false);
  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    password:"",
  });

  const handleChange = (e) => {
    setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if(teacherData.name===""||teacherData.email===""||teacherData.department===""||teacherData.phone===""||teacherData.password===""){
        toast.current.show({ severity: 'warn', summary: 'Warning', detail:'Fill all details and create teacher' });
      }
      else{
      await axios.post(process.env.REACT_APP_ADMIN_CREATE_TEACHER, teacherData);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Teacher Created' });
      setVisible(false);
      setTeacherData({ name: '', email: '', phone: '', department: '' }); 
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Failed to create teacher' });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <AdminNavBar />
      <div style={{ marginTop: "7em",width:"80%" }}>
        <Button label="Create Teacher" onClick={() => setVisible(true)} />
        <TeacherDataView />
      </div>

      <Dialog header="Create Teacher" visible={visible} onHide={() => setVisible(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em",padding:"2em" }}>
          <InputText name="name" placeholder="Name" value={teacherData.name} onChange={handleChange} required />
          <InputText name="email" placeholder="Email" type="email" value={teacherData.email} onChange={handleChange} required />
          <InputText name="phone" placeholder="Phone" value={teacherData.phone} onChange={handleChange} required />
          <InputText name="department" placeholder="Department" value={teacherData.department} onChange={handleChange} required />
          <InputText name="password" placeholder="Password" value={teacherData.password} onChange={handleChange} required />
          <Button label="Create" onClick={handleSubmit} />
        </div>
      </Dialog>
    </div>
  );
}
