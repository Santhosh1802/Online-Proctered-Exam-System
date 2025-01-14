const mongoose=require("mongoose");
const TeacherSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
        match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
        unique:[true,"Mobile number must be unique"]
    },
    department:{
        type:String,
        require:true,
    },
    test:{
        type:[],
    }
})

const Teacher=mongoose.model("Teacher",TeacherSchema);
module.exports=Teacher;