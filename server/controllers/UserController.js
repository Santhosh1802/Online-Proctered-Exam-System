const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Login = require("../models/LoginSchema");

const handleUserLogin = async (req, res) => {
  const response = {
    message: "",
    error: "",
    usertype: "",
  };
  const { email, password } = req.body;

  try {
    const user = await Login.findOne({ email_id: email });
    if (!user) {
      response.error = "User not found";
      return res.status(401).json(response);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      response.message = "Login Success";
      response.usertype = user.role;
      response.email_id = user.email_id;

      const token = jwt.sign(
        { email: email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );
      res.cookie("token", token, { httpOnly: false, maxAge: 10800000 });

      await Login.findOneAndUpdate(
        { email_id: email },
        { last_login: new Date() }
      );

      return res.status(202).json(response);
    } else {
      response.error = "Invalid Password";
      return res.status(400).json(response);
    }
  } catch (error) {
    console.log(error.message);
    response.error = "An error occurred during login";
    return res.status(500).json(response);
  }
};

const handleStudentRegister = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  const { email, password, confirmpassword, usertype, user_name } = req.body;

  if (!email || !password || !usertype || !confirmpassword || !user_name) {
    response.error = "All fields are required";
    return res.status(400).json(response);
  }
  if (password !== confirmpassword) {
    response.error = "Password do not match";
    return res.status(400).json(response);
  }
  try {
    const existingUser = await Login.findOne({ email_id: email });
    if (existingUser) {
      response.error = "Email is already registered";
      return res.status(500).json(response);
    }
    let saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new Login({
      email_id: email,
      password: hashedPassword,
      role: usertype,
      user_name: user_name,
    });
    await newUser.save();
    response.message = "User Successfully registered";
    return res.status(201).json(response);
  } catch (error) {
    console.log(error.message);
    response.error = "An error occurred while registering the user";
    return res.status(500).json(response);
  }
};

const handleForgotPassword = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };

  const { email } = req.body;
  const registered=await Login.findOne({email_id:email});
  console.log(registered);
  
  if(!registered){
    response.error="User Not Registerd";
    return res.status(200).json(response);
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.GMAIL_USER}`,
      pass: `${process.env.APP_PASS}`,
    },
  });
  if (!email) {
    response.error = "Email is required";
    return res.status(400).json(response);
  }
  try {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
    const resetLink = `${process.env.FRONTEND_URL}/resetpassword?token=${token}`;
    const mailOptions = {
      from: `${process.env.GMAIL_USER}`,
      to: email,
      subject: "Password Reset Mail",
      html: `
          <div style="text-align: center; font-family: Arial, sans-serif;">
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Please click the button below to reset your password:</p>
      <a 
        href="${resetLink}" 
        target="_blank" 
        style="
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          border-radius: 5px;
        ">
        Reset Password
      </a>
      <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
    </div>
  `,
    };
    await transporter.sendMail(mailOptions);
    response.message = "Password reset email sent Successfully";
    return res.status(200).json(response);
  } catch (error) {
    response.error = "Error sending password reset email.";
    return res.status(500).json(response);
  }
};

const handleResetPassword = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  const { token, password } = req.body;
  console.log(token);
  
  if(token===""||token===null){
    response.error="Invalid or expired token";
    return res.status(200).json(response);
  }
  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Login.updateOne({ email_id: email }, { password: hashedPassword });
    response.message = "Password reset successfully";
    return res.status(200).json(response);
  } catch (error) {
    response.error = "Invalid or expired token";
    return res.status(200).json(response);
  }
};

const handleLogout = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  try {
    res.clearCookie("token");
    response.message = "Logout Success";
    return res.status(200).json(response);
  } catch (error) {
    response.error = "An error occurred during logout";
    console.log(error.message);
    return res.status(500).json(response);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    console.log(req.body);

    const user = await Login.findOne({ email_id: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.json({ error: "", message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleUserLogin,
  handleStudentRegister,
  handleForgotPassword,
  handleResetPassword,
  handleLogout,
  resetPassword,
};
