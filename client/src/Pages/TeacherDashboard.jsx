/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TeacherNavBar from "../Components/TeacherNavBar";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setId } from "../Store/userSlice";
export default function TeacherDashboard({toast}) {
  const userEmail = useSelector((state) => state.user.email);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  useEffect(() => {
    if (userEmail) {
      axios
        .get(process.env.REACT_APP_GET_TEACHER_DATA, {
          params: { email: userEmail },withCredentials:true,
        })
        .then((res) => {
          const id=res.data.data.id;
          console.log(id);
          
          dispatch(setId(id));
        })
        .catch((err) => {
          navigate("/teacherprofile");
        });
    } else {
      console.log("Error Call");
    }
  }, [userEmail]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TeacherNavBar />
      <div style={{ marginTop: "5em" }}>
        <h1>Welcome Teacher</h1>
      </div>
    </div>
  );
}
