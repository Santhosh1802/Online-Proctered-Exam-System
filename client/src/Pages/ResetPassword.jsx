import React,{useState} from 'react'
import {Password} from 'primereact/password'
import {Button} from 'primereact/button'
import axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPassword({toast}) {
    const [password,setPassword]=useState("");
    const [confirmpassword,setConfirmpassword]=useState("");
    const query=new URLSearchParams(useLocation().search);
    const token=query.get("token");
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(password!==confirmpassword){
          toast.current.show({severity:"error",summary:"Error",detail:"Passwords do not match"});
          return;
        }
        try {
          const res=await axios.post(process.env.REACT_APP_RESET_PASS_API,{
            token,
            password,
          })
          if(res.data.message===""){
            toast.current.show({severity:"error",summary:"Error",detail:res.data.error});
          }
          else if(res.data.error===""){
            toast.current.show({severity:"success",summary:"Success",detail:res.data.message});
            navigate("/");
          }
          
        } catch (error) {
          console.log(error);
          
        }
    }
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "10%",
      marginBottom: "2em",
    }}>
        <div style={{ boxShadow: "0px 2px 8px 0px", borderRadius: ".5em" }}>
            <h1 style={{ textAlign: "center", marginTop: "2em" }}>Reset Password</h1>
            <form onSubmit={handleSubmit} style={{ margin: "4em" }}>
            <label htmlFor='password' style={{fontSize:"18px",fontWeight:"bold"}}>Password</label>
            <br />
            <Password id='password' value={password} onChange={(e) => setPassword(e.target.value)} toggleMask placeholder='Enter Password'/>
            <br /><br />
            <label htmlFor='confirmpassword' style={{fontSize:"18px",fontWeight:"bold"}}>Confirm Password</label>
            <br />
            <Password id='confirmpassword' value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} toggleMask placeholder='Re-enter Password'/>
            <br /><br />
            <Button label="Submit" type='submit'/>
            <Button label="Login" link onClick={() =>  window.open('/', '_self')}/>
            </form>
    </div>
    </div>
  )
}

export default ResetPassword