import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../Components/AdminNavBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useSpring, animated } from "@react-spring/web";
import Chart from "react-apexcharts";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [ongoingQuizzes, setOngoingQuizzes] = useState(0);
  const [loginTrends, setLoginTrends] = useState([]);
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
          setTotalUsers(res.data.data.activeUsers);
          setOngoingQuizzes(res.data.data.ongoingQuizzes);
        })
        .catch((error) => console.log(error));

      axios
        .get(process.env.REACT_APP_GET_LOGIN_TRENDS, { withCredentials: true })
        .then((res) => {
          setLoginTrends(res.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [email, navigate]);

  const theme = localStorage.getItem("theme");

  const loginChartOptions = {
    chart: { type: "line", height: 250, toolbar: { show: false } },
    xaxis: {
      categories: loginTrends.map((entry) => entry.day),
      labels: {
        style: {
          colors: theme === "dark" ? "white" : "black",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "white" : "black",
          fontSize: "12px",
        },
      },
    },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    colors: ["#007bff"],
    title: {
      text: "Logins per Day",
      style: { color: theme === "dark" ? "white" : "black", fontSize: "16px" },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      style: { fontSize: "12px", color: theme === "dark" ? "white" : "black" },
    },
  };

  const loginChartSeries = [
    { name: "Logins per Day", data: loginTrends.map((entry) => entry.count) },
  ];

  const AnimatedNumber = ({ value }) => {
    const props = useSpring({
      number: value || 0,
      from: 0,
      config: { duration: 1000 },
    });

    return (
      <animated.span className="text-3xl font-bold" style={{ color: "white" }}>
        {props.number.to ? props.number.to((n) => Math.floor(n)) : 0}
      </animated.span>
    );
  };

  return (
    <div className="flex flex-column align-items-center">
      <AdminNavBar />
      <div
        className="flex flex-column align-items-center"
        style={{ width: "100%", marginTop: "4em" }}
      >
        <Card className="w-7 text-center" style={{ marginTop: "3em" }}>
          <Avatar
            label={name[0]}
            size="xlarge"
            shape="circle"
            className="mb-3"
          />
          <h2 className="text-2xl font-bold">Welcome, {name} 👋</h2>
          <p className="text-gray-500">{email}</p>
        </Card>
        <Divider className="w-7" />
        <div className="grid mt-4 w-10 flex justify-content-center gap-4">
          <div className="col-12 md:col-2">
            <Card
              className="shadow-2 text-center p-4"
              style={{ backgroundColor: "#007bff", borderRadius: "0" }}
            >
              <h4 className="text-white">Total Teachers</h4>
              <AnimatedNumber value={totalTeachers} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card
              className="shadow-2 text-center p-4"
              style={{ backgroundColor: "#28a745", borderRadius: "0" }}
            >
              <h4 className="text-white">Total Students</h4>
              <AnimatedNumber value={totalStudents} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card
              className="shadow-2 text-center p-4"
              style={{ backgroundColor: "#ffc107", borderRadius: "0" }}
            >
              <h4 className="text-white">Total Users</h4>
              <AnimatedNumber value={totalUsers} />
            </Card>
          </div>
          <div className="col-12 md:col-2">
            <Card
              className="shadow-2 text-center p-4"
              style={{ backgroundColor: "#dc3545", borderRadius: "0" }}
            >
              <h4 className="text-white">Ongoing Tests</h4>
              <AnimatedNumber value={ongoingQuizzes} />
            </Card>
          </div>
        </div>
        <div className="w-8 mt-4">
          <Card
            className="shadow-2 text-center p-4"
            style={{ borderRadius: "0" }}
          >
            <h4>All User Login Trends (Last 7 days)</h4>
            <Chart
              options={loginChartOptions}
              series={loginChartSeries}
              type="line"
              height={250}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
