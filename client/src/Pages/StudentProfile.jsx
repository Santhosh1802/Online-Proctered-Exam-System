import React, { useState, useEffect } from "react";
import StudentNavBar from "../Components/StudentNavBar";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { profileString } from "../Utils/profileString";
export default function StudentProfile({ toast }) {
  const [profile, setProfile] = useState(profileString);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [batch, setBatch] = useState("");
  const [section, setSection] = useState("");

  const userEmail = useSelector((state) => state.user.email);

  const [showDialog, setShowDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    if (userEmail) {
      axios
        .get(process.env.REACT_APP_GET_STUDENT_DATA, {
          params: { email: userEmail },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.error === "") {
            setName(res.data.data.name);
            setPhone(res.data.data.phone);
            setProfile(res.data.data.profile);
            setDepartment(res.data.data.department);
            setRegisterNumber(res.data.data.registerNumber);
            setBatch(res.data.data.batch);
            setSection(res.data.data.section);
          }
        });
    } else {
      console.log("Error Call");
    }
  }, [userEmail]);
  const handleFileUpload = (e) => {
    const file = e.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile(`${reader.result.split(",")[1]}`);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "" || phone === "" || userEmail === "" || department === "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "All Fields are required",
      });
      return;
    }
    try {
      const res = await axios.post(
        process.env.REACT_APP_UPDATE_STUDENT_DATA,
        {
          profile: profile,
          email: userEmail,
          name: name,
          phone: phone,
          department: department,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.error === "") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Profile Updated",
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: res.data.error,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "All fields are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "New passwords do not match",
      });
      return;
    }

    try {
      const res = await axios.post(
        process.env.REACT_APP_RESET_PASSWORD,
        {
          email: userEmail,
          oldPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      if (res.data.error === "") {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Password reset successfully",
        });
        setShowDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: res.data.error,
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
      });
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <StudentNavBar />
      <div style={{ marginTop: "10vh" }}>
        <h1 style={{ marginLeft: "1.2em" }}>Student Profile</h1>
        <form onSubmit={handleSubmit}>
          <Image
            src={`data:image/jpeg;base64,${profile}`}
            alt=""
            preview
            style={{
              border: "px solid black",
              marginLeft: "3em",
              zIndex: "0",
            }}
            width="200px"
            height="200px"
          />

          <FileUpload
            accept="image/*"
            mode="basic"
            chooseLabel="Upload Profile Image"
            onSelect={handleFileUpload}
            style={{ width: "200px", marginLeft: "3em" }}
          />
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
          <label htmlFor="department">Department</label>
          <br />
          <InputText
            id="department"
            keyfilter={"alphanum"}
            value={department}
            placeholder="Enter your department"
            onChange={(e) => setDepartment(e.target.value)}
            style={{ width: "20em" }}
          />
          <br />
          <br />
          <label htmlFor="registerNumber">Register Number</label>
          <br />
          <InputText
            id="registerNumber"
            keyfilter={"alphanum"}
            value={registerNumber}
            placeholder="Enter your Register Number"
            onChange={(e) => setRegisterNumber(e.target.value)}
            style={{ width: "20em" }}
          />
          <br />
          <br />
          <label htmlFor="batch">Batch</label>
          <br />
          <InputText
            id="batch"
            keyfilter={"alphanum"}
            value={batch}
            placeholder="Enter your Batch"
            onChange={(e) => setBatch(e.target.value)}
            style={{ width: "20em" }}
          />
          <br />
          <br />
          <label htmlFor="section">Section</label>
          <br />
          <InputText
            id="section"
            keyfilter={"alphanum"}
            value={section}
            placeholder="Enter your Section"
            onChange={(e) => setSection(e.target.value)}
            style={{ width: "20em" }}
          />
          <br />
          <br />
          <Button
            label="Update Profile"
            type="submit"
            style={{ width: "20em", marginBottom: "2em" }}
          />
          <br />
          <Button
            label="Reset Password"
            severity="secondary"
            type="button"
            onClick={() => setShowDialog(true)}
            style={{ width: "20em", marginBottom: "10vh" }}
          />
        </form>
      </div>
      <Dialog
        header="Reset Password"
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: "25vw", textAlign: "center" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        modal
      >
        <form
          onSubmit={handleResetPassword}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label htmlFor="oldPassword">Current Password</label>
          <InputText
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{ width: "100%" }}
            placeholder="Enter current password"
          />
          <br />

          <label htmlFor="newPassword">New Password</label>
          <InputText
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%" }}
            placeholder="Enter new password"
          />
          <br />

          <label htmlFor="confirmPassword">Confirm New Password</label>
          <InputText
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%" }}
            placeholder="Confirm new password"
          />
          <br />

          <Button
            label="Reset Password"
            type="submit"
            style={{ width: "100%" }}
          />
        </form>
      </Dialog>
    </div>
  );
}
