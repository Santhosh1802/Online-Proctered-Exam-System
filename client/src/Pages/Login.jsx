import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setStoreEmail, setUserType } from "../Store/userSlice";
function Login({ toast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = localStorage.getItem("theme") || "light";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter both email and password",
      });
      return;
    }
    try {
      const res = await axios.post(
        process.env.REACT_APP_LOGIN_API,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      if (res.data.error === "") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `${res.data.message}`,
        });
        dispatch(setUserType(res.data.usertype));
        dispatch(setLogin(true));
        dispatch(setStoreEmail(res.data.email_id));
        switch (res.data.usertype) {
          case "student":
            navigate("/studentdashboard");
            break;
          case "admin":
            navigate("/admindashboard");
            break;
          case "teacher":
            navigate("/teacherdashboard");
            break;
          default:
            navigate("/");
        }
      } else if (res.status === 400) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${res.data.error}`,
        });
      }
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `${err.response.data.error}`,
      });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "right",
        alignItems: "right",
        height: "100vh",
        backgroundImage: 'url("/Background.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingRight: "8em",
        filter:theme==="dark"?"brightness(0.7)":"none",
      }}
    >
      <div
        style={{
          boxShadow: theme==="dark"
      ? "0px 2px 8px 0px rgba(0,0,0,0.8)" 
      : "0px 2px 8px 0px rgba(0,0,0,0.2)",
          borderRadius: ".5em",
          height: "500px",
          marginTop: "8em",
          backgroundColor: theme==="dark" ? "#34455d" : "white",
          color: theme==="dark" ? "white":"black",
        }}
      >
        <h1 style={{ textAlign: "center", marginTop: "2em" }}>Login</h1>
        <form onSubmit={handleSubmit} style={{ margin: "4em" }}>
          <label
            htmlFor="email"
            style={{ fontSize: "18px", fontWeight: "bold" }}
          >
            Email
          </label>
          <br />
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
            placeholder="Enter Email"
            title="User Email"
          />
          <br />
          <br />
          <label
            htmlFor="email"
            style={{ fontSize: "18px", fontWeight: "bold" }}
          >
            Password
          </label>
          <br />
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            autoComplete="true"
            placeholder="Enter Password"
            title="User Password"
          />
          <br />
          <br />
          <Button label="Login" type="submit" />
          <Button
            label="Forgot password"
            link
            type="button"
            onClick={() => window.open("/forgotpassword", "_self")}
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
