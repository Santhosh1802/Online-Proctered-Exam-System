import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";

function ForgotPassword({ toast }) {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email==="") {
      toast.current.show({
        severity: "error",
        summary: "Error",
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
        width: "400px",
        height: "50vh",
        border: "px solid black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        margin: "auto",
        marginTop: "10vh",
        borderRadius: "1em",
        boxShadow: "0px 5px 10px grey",
        
      }}
    >
      <div
        style={{
          fontSize: "2em",
          textAlign: "center",
          padding: "2em",
          fontWeight: "bold",
        }}
      >
        Forgot Password
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" style={{ fontSize: "18px", fontWeight: "bold" }}>
          Email
        </label>
        <br></br>
        <InputText
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          style={{ width: "275px" }}
        />
        <br></br>
        <br></br>
        <Button label="Submit" type="submit" />
        <Button
          label="Back to login"
          type="button"
          link
          onClick={() => window.open("/", "_self")}
        />
      </form>
    </div>
  );
}

export default ForgotPassword;
