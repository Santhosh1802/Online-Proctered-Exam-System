const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");

dotenv.config();
const app=express();
app.use(cors());



const port=5000 || process.env.PORT;
app.listen(port,()=>{
    console.log(`Server Started at ${port}`);
})
