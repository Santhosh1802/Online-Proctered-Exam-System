import React from 'react'
import AdminNavBar from '../Components/AdminNavBar'
import StudentDataView from '../Components/StudentDataView'

export default function AdminManageStudent({toast}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <AdminNavBar/>
      <div style={{marginTop:"5em"}}>
        <h1>Manage Student</h1>
        <StudentDataView/>
      </div>
    </div>
  )
}
