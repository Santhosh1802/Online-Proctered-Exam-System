import React from 'react'
import AdminNavBar from '../Components/AdminNavBar'
import TeacherDataView from '../Components/TeacherDataView'

export default function AdminManageTeacher({toast}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <AdminNavBar/>
      <div style={{marginTop:"5em"}}>
        <h1>Manage Teacher</h1>
        <TeacherDataView/>
      </div>
    </div>
  )
}
