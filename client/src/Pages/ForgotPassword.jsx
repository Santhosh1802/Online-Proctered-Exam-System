import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";

function ForgotPassword({ toast }) {
  const [email, setEmail] = useState("");
  const theme = localStorage.getItem("theme") || "light";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Email Required",
      });
      return;
    }
    try {
      const res = await axios.post(process.env.REACT_APP_FORGOT_PASS_API, {
        email,
      });
      if (res.data.message === "") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${res.data.error}`,
        });
        return;
      }
      if (res.data.error === "") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `${res.data.message}`,
        });
        return;
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
          backgroundColor: theme==="dark" ? "#34455d" : "white",
          color: theme==="dark" ? "white":"black",
          marginBottom:"12em",
        }}
      >
        <h1 style={{ textAlign: "center", marginTop: "2em" }}>
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} style={{ margin: "4em" }}>
          <label
            htmlFor="email"
            style={{ fontSize: "18px", fontWeight: "bold" }}
          >
            Email
          </label>
          <br></br>
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            style={{ width: "100%" }}
          />
          <br></br>
          <br></br>
          <Button label="Send mail" type="submit" />
          <Button
            label="Back to login"
            type="button"
            link
            onClick={() => window.open("/", "_self")}
          />
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
