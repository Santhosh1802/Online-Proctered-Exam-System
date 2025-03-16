//Module imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
//dotenv configuration
dotenv.config();

//Routes imports
const userRoutes = require("./routes/User");
const adminRoutes = require("./routes/Admin");
const teacherRoutes = require("./routes/Teacher");
const studentRoutes = require("./routes/Student");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//Mongodb connection
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Error Connecting to DB");
  });

app.use(userRoutes);
app.use(adminRoutes);
app.use(teacherRoutes);
app.use(studentRoutes);

const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
