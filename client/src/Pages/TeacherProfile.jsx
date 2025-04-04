import React, { useEffect, useState } from "react";
import TeacherNavBar from "../Components/TeacherNavBar";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { profileString } from "../Utils/profileString";

export default function TeacherProfile({ toast }) {
  const [profile, setProfile] = useState(profileString);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userEmail = useSelector((state) => state.user.email);

  useEffect(() => {
    if (userEmail) {
      axios
        .get(process.env.REACT_APP_GET_TEACHER_DATA, {
          params: { email: userEmail },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.error === "") {
            setName(res.data.data.name);
            setPhone(res.data.data.phone);
            setProfile(res.data.data.profile);
            setDepartment(res.data.data.department);
          }
        })
        .catch((err) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `${err.response.data.error} Fill details to continue`,
          });
        });
    }
  }, [userEmail, toast]);

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
        process.env.REACT_APP_UPDATE_TEACHER_DATA,
        {
          email: userEmail,
          name,
          phone,
          department,
          profile,
        },
        { withCredentials: true }
      );

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

  const handlePasswordReset = async () => {
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
          detail: "Password Updated Successfully",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsDialogVisible(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: res.data.error,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update password",
      });
      console.error(error);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <TeacherNavBar />
      <div style={{ marginTop: "10vh" }}>
        <h1 style={{ marginLeft: "1.2em" }}>Teacher Profile</h1>
        <form onSubmit={handleSubmit}>
          <Image
            src={`data:image/jpeg;base64,${profile}`}
            alt="Profile"
            preview
            style={{ border: "1px solid black", marginLeft: "3em",width:"200px",height:"200px" }}
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
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
          <br />

          <label htmlFor="department">Department</label>
          <br />
          <InputText
            id="department"
            value={department}
            placeholder="Enter your department"
            onChange={(e) => setDepartment(e.target.value)}
            style={{ width: "20em" }}
          />
          <br />
          <br />

          <Button
            label="Update Profile"
            type="submit"
            style={{ width: "20em" }}
          />
        </form>
        <Button
          label="Reset Password"
          severity="secondary"
          type="button"
          style={{ width: "20em", marginTop: "1em", marginBottom: "2em" }}
          onClick={() => setIsDialogVisible(true)}
        />
      </div>
      <Dialog
        header="Reset Password"
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
      >
        <label htmlFor="oldPassword">Old Password</label>
        <InputText
          id="oldPassword"
          type="password"
          value={oldPassword}
          placeholder="Enter old password"
          onChange={(e) => setOldPassword(e.target.value)}
          style={{ width: "100%" }}
        />
        <br />
        <br />

        <label htmlFor="newPassword">New Password</label>
        <InputText
          id="newPassword"
          type="password"
          value={newPassword}
          placeholder="Enter new password"
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "100%" }}
        />
        <br />
        <br />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <InputText
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          placeholder="Confirm new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%" }}
        />
        <br />
        <br />

        <Button
          label="Update Password"
          className="p-button-success"
          onClick={handlePasswordReset}
          style={{ width: "100%" }}
        />
      </Dialog>
    </div>
  );
}
