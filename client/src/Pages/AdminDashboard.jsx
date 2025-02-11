/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../Components/AdminNavBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ toast }) {
  const [name, setName] = useState("");
  const email = useSelector((store) => store.user.email);
  const navigate = useNavigate();
  useEffect(() => {
    if (email) {
      axios
        .get(process.env.REACT_APP_GET_ADMIN_DATA, {
          params: { email },withCredentials:true
        },)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "") {
            navigate("/adminprofile");
          } else {
            setName(res.data.data.name);
          }
        })
        .catch((error)=>{
          console.log(error);
        })
    } else {
      console.log("Error Call");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AdminNavBar />
      <div style={{marginTop:"5em"}}>
        <h1>Welcome {name}</h1>
      </div>
    </div>
  );
}
