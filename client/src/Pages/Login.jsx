import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStoreEmail, setUserType } from "../Store/userSlice";
function Login({toast}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setStoreEmail(email));
    if(!email || !password){
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter both email and password",
      });
      return;
    }
    try {
        const res = await axios.post(process.env.REACT_APP_LOGIN_API, {
          email:email,
          password:password,
        });
        if(res.data.error===""){
          toast.current.show({severity:"success",summary:"Success",detail:`${res.data.message}`});
          dispatch(setUserType(res.data.usertype));
          switch(res.data.usertype){
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
        }
        else{
          toast.current.show({severity:"error",summary:"Error",detail:`${res.data.error}`});
        }
    } catch (err) {
      toast.current.show({severity:"error",summary:"Server Error",detail:"Check Your Internet Connection"})
    }
  };
  return (
    <div
      style={{
        width: "400px",
        height: "70vh",
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
      className="box"
    >
      <div
        style={{
          fontSize: "2em",
          textAlign: "center",
          padding: "2em",
          fontWeight: "bold",
        }}
      >
        Login
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
          autoComplete="none"
          style={{ width: "275px" }}
          placeholder="Enter Email"
        />
        <br></br>
        <br></br>
        <label htmlFor="email" style={{ fontSize: "18px", fontWeight: "bold" }}>
          Password
        </label>
        <br></br>
        <Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          toggleMask
          feedback={false}
          placeholder="Enter Password"
        />
        <br></br>
        <br></br>
        <Button label="Login" type="submit" />
        <Button
          label="Forgot password"
          link
          type="button"
          onClick={() => window.open("/forgotpassword", "_self")}
          className="linkmove"
        />
      </form>
      <br></br>
      <Button
        label="Doesn't have account ? Register"
        link
        type="button"
        onClick={() => window.open("/register", "_self")}
      />
    </div>
  );
}

export default Login;
