import React, { useState } from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword({ toast }) {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const theme = localStorage.getItem("theme") || "light";
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password==="" || confirmpassword===""){
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please fill both password and confirm password",
      });
      return;
    }
    if (password !== confirmpassword) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Passwords do not match",
      });
      return;
    }
    try {
      const res = await axios.post(process.env.REACT_APP_RESET_PASS_API, {
        token,
        password,
      });
      if (res.data.message === "") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: res.data.error,
        });
      } else if (res.data.error === "") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: res.data.message,
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
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
          marginTop: "8em",
          marginBottom: "8em",
          backgroundColor: theme==="dark" ? "#34455d" : "white",
          color: theme==="dark" ? "white":"black",
        }}
      >
        <h1 style={{ textAlign: "center", marginTop: "2em" }}>
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} style={{ margin: "4em" }}>
          <label
            htmlFor="password"
            style={{ fontSize: "18px", fontWeight: "bold" }}
          >
            Password
          </label>
          <br />
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            placeholder="Enter Password"
          />
          <br />
          <br />
          <label
            htmlFor="confirmpassword"
            style={{ fontSize: "18px", fontWeight: "bold" }}
          >
            Confirm Password
          </label>
          <br />
          <Password
            id="confirmpassword"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            toggleMask
            placeholder="Re-enter Password"
          />
          <br />
          <br />
          <Button label="Submit" type="submit" />
          <Button
            label="Login"
            link
            onClick={() => window.open("/", "_self")}
          />
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
