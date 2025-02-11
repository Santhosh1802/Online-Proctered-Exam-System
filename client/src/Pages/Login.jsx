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
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setStoreEmail(email));
    if (!email || !password) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter both email and password",
      });
      return;
    }
    try {
      const res = await axios.post(process.env.REACT_APP_LOGIN_API, {
        email: email,
        password: password,
      },{withCredentials:true});
      if (res.data.error === "") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `${res.data.message}`,
        });
        dispatch(setUserType(res.data.usertype));
        dispatch(setLogin(true));
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
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${res.data.error}`,
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Server Error",
        detail: "Check Your Internet Connection",
      });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10%",
      }}
    >
      <div style={{ boxShadow: "0px 2px 8px 0px", borderRadius: ".5em" }}>
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
            placeholder="Enter Password"
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
