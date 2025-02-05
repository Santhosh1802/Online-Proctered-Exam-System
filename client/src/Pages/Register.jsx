import React, { useState} from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register({toast}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const roles = [{ usertype: "admin" }, { usertype: "student" }, { usertype: "teacher" }];
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password || !confirmpassword || !usertype){
      toast.current.show({severity:"warn",summary:"Warning",detail:"All fields are required"})
      return;
    }
    try {
      const res=await axios.post(process.env.REACT_APP_REGISTER_API, { email:email,password:password,confirmpassword:confirmpassword,usertype:usertype.usertype });
      if(res.data){
        if(res.data.message===""){
          toast.current.show({severity:"error",summary:"Error",detail:`${res.data.error}`});
        }
        else if(res.data.error===""){
          toast.current.show({severity:"success",summary:"Success",detail:`${res.data.message}`});
          navigate("/");
        }
      }
    } catch (error) {
      
    }

    
  };
  return (
    <div
      style={{
        width: "400px",
        height: "84vh",
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
      className="dashbox"
    >
      <div
        style={{
          fontSize: "2em",
          textAlign: "center",
          padding: "2em",
          fontWeight: "bold",
        }}
      >
        Register
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
        <label htmlFor="usertype" style={{ fontSize: "18px", fontWeight: "bold" }}>User type</label>
        <br />
        <Dropdown
          value={usertype}
          onChange={(e) => setUsertype(e.target.value)}
          options={roles}
          optionLabel="usertype"
          placeholder="Select your role"
          className="w-full md:w-14rem"
          style={{width:"275px"}}
          
        />
        <br />
        <br />
        <label
          htmlFor="password"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          Password
        </label>
        <br></br>
        <Password
          id="password"
          value={password}
          feedback={false}
          onChange={(e) => setPassword(e.target.value)}
          toggleMask
          placeholder="Enter Password"
        />
        <br></br>
        <br></br>
        <label
          htmlFor="confirmpassword"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          Confirm Password
        </label>
        <br></br>
        <Password
          id="confirmpassword"
          value={confirmpassword}
          onChange={(e) => setConfirmpassword(e.target.value)}
          toggleMask
          feedback={false}
          placeholder="Re-Enter Password"
        />
        <br></br>
        <br></br>
        <Button label="Register" type="submit" />
        <Button label="Login" type="button" link onClick={() => window.open("/", "_self")} />
      </form>
    </div>
  );
}

export default Register;
