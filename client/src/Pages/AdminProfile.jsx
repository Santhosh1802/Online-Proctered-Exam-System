import React, { useEffect, useState } from "react";
import AdminNavBar from "../Components/AdminNavBar";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import axios from "axios";

export default function AdminProfile({toast}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const userEmail = useSelector((state) => state.user.email);
  useEffect(()=>{
    if(userEmail){
    axios.get(process.env.REACT_APP_GET_ADMIN_DATA,{
      params:{email:userEmail}
    })
    .then((res)=>{
      console.log(res.data);
      if(res.data.error===""){
        setName(res.data.data.name);
        setPhone(res.data.data.phone);
      }
    })}
    else{
      console.log("Error Call");
    }
},[userEmail]);
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(name==="" || phone==="" || userEmail===""){
      toast.current.show({severity:"error",summary:"Error",detail:"All Fields are required"});
      return;
    }
    try {
      const res=await axios.post(process.env.REACT_APP_UPDATE_ADMIN_DATA,{
        email:userEmail,
        name:name,
        phone:phone,
      })
      console.log(res.data);
      if(res.data.error===""){
        toast.current.show({severity:"success",summary:"Success",detail:"Profile Updated"})
      }
      else{
        toast.current.show({severity:"error",summary:"Error",detail:res.data.error});
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <AdminNavBar />
      <div style={{ marginTop: "20vh" }}>
        <h1>Admin Profile</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <br />
          <InputText
            id="name"
            value={name}
            placeholder="Enter your name"
            keyfilter={"alpha"}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "20em" }}
          />
          <br />
          <br />
          <label htmlFor="email">Email</label>
          <br />
          <InputText
            id="email"
            value={userEmail}
            required
            style={{ width: "20em" }}
            readOnly
            title="Auto filled email id"
          />
          <br />
          <br />
          <label htmlFor="phone">Phone</label>
          <br />
          <InputText
            id="phone"
            value={phone}
            required
            style={{ width: "20em" }}
            placeholder="Enter your phone number"
            keyfilter={"pnum"}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
          <br />
          <Button
            label="Update Profile"
            type="submit"
            style={{ width: "20em" }}
          />
        </form>
      </div>
    </div>
  );
}
