/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../Components/AdminNavBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useSpring, animated } from "@react-spring/web";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [ongoingQuizzes, setOngoingQuizzes] = useState(0);
  const email = useSelector((store) => store.user.email);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      axios
        .get(process.env.REACT_APP_GET_ADMIN_DATA, {
          params: { email },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.message === "") {
            navigate("/adminprofile");
          } else {
            setName(res.data.data.name);
          }
        })
        .catch((error) => console.log(error));

      axios
        .get(process.env.REACT_APP_ADMIN_GET_STATS, { withCredentials: true })
        .then((res) => {
          setTotalTeachers(res.data.data.totalTeachers);
          setTotalStudents(res.data.data.totalStudents);
          setActiveUsers(res.data.data.activeUsers);
          setOngoingQuizzes(res.data.data.ongoingQuizzes);
        })
        .catch((error) => console.log(error));
    }
  }, [navigate]);

  const AnimatedNumber = ({ value }) => {
    const props = useSpring({ number: value, from: 0, config: { duration: 1000 } });
    return <animated.span className="text-3xl font-bold text-white">{props.number.to((n) => Math.floor(n))}</animated.span>;
  };

  return (
    <div className="flex flex-column align-items-center">
      <AdminNavBar />
      <div className="flex flex-column align-items-center" style={{width:"100%",marginTop:"4em"}}>
        <Card className="w-7 text-center" style={{marginTop:"3em"}}>
          <Avatar label={name[0]} size="xlarge" shape="circle" className="mb-3" />
          <h2 className="text-2xl font-bold">Welcome, {name} 👋</h2>
          <p className="text-gray-500">{email}</p>
        </Card>
        <Divider className="w-7"/>
        <div className="grid mt-4 w-10 flex justify-content-center gap-4">
          <div className="col-12 md:col-2">
            <Card className="shadow-2 text-center p-4" style={{ backgroundColor: "#007bff", borderRadius: "0" }}>
              <h4 className="text-white">Total Teachers</h4>
              <AnimatedNumber value={totalTeachers} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card className="shadow-2 text-center p-4" style={{ backgroundColor: "#28a745", borderRadius: "0" }}>
              <h4 className="text-white">Total Students</h4>
              <AnimatedNumber value={totalStudents} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card className="shadow-2 text-center p-4" style={{ backgroundColor: "#ffc107", borderRadius: "0" }}>
              <h4 className="text-white">Total Users</h4>
              <AnimatedNumber value={activeUsers} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card className="shadow-2 text-center p-4" style={{ backgroundColor: "#dc3545", borderRadius: "0" }}>
              <h4 className="text-white">Ongoing Tests</h4>
              <AnimatedNumber value={ongoingQuizzes} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
