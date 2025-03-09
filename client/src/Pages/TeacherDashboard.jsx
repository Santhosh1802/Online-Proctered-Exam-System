/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import TeacherNavBar from "../Components/TeacherNavBar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setId } from "../Store/userSlice";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { useSpring, animated } from "@react-spring/web";

export default function TeacherDashboard({ toast }) {
  const userEmail = useSelector((state) => state.user.email);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [testCount, setTestCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [completedTestCount, setCompletedTestCount] = useState(0);

  useEffect(() => {
    if (userEmail) {
      axios
        .get(process.env.REACT_APP_GET_TEACHER_DATA, {
          params: { email: userEmail },
          withCredentials: true,
        })
        .then((res) => {
          const id = res.data.data.id;
          console.log(id);
          dispatch(setId(id));
        })
        .catch((err) => {
          navigate("/teacherprofile");
        });

      axios
        .get(process.env.REACT_APP_GET_TEACHER_DASHBOARD_DATA, {
          params: { email: userEmail },
          withCredentials: true,
        })
        .then((res) => {
          setName(res.data.data.name);
          setTestCount(res.data.data.testCount);
          setStudentCount(res.data.data.studentCount);
          setCompletedTestCount(res.data.data.completedTestCount);
        })
        .catch((err) => console.error("Error fetching teacher dashboard data:", err));
    } else {
      console.log("Error Call");
    }
  }, [userEmail]);

  const AnimatedNumber = ({ value }) => {
    const props = useSpring({ number: value, from: 0, config: { duration: 1000 } });
    return <animated.span className="text-3xl font-bold text-white">{props.number.to((n) => Math.floor(n))}</animated.span>;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TeacherNavBar />
      <div style={{ marginTop: "5em", width: "70%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <Card className="w-7 text-center" style={{ marginTop: "3em" }}>
          <Avatar label={name[0]} size="xlarge" shape="circle" className="mb-3" />
          <h2 className="text-2xl font-bold">Welcome, {name} 👋</h2>
          <p className="text-gray-500">{userEmail}</p>
        </Card>
        <Divider className="w-7" />
        <div className="grid mt-4 w-12 flex justify-content-center gap-4">
          <div className="col-12 md:col-2">
            <Card className="shadow-2 text-center p-4" style={{ backgroundColor: "#007bff", borderRadius: "0" }}>
              <h4 className="text-white">Total Tests count</h4>
              <AnimatedNumber value={testCount} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card className="shadow-2 text-center p-4" style={{ backgroundColor: "#28a745", borderRadius: "0" }}>
              <h4 className="text-white">Total Students</h4>
              <AnimatedNumber value={studentCount} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card className="shadow-2 text-center p-4" style={{ backgroundColor: "#ffc107", borderRadius: "0" }}>
              <h4 className="text-white">Completed Tests</h4>
              <AnimatedNumber value={completedTestCount} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}