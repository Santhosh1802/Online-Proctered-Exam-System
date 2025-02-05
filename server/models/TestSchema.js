const mongoose=require("mongoose");
const Report = require("./ReportSchema");

const TestSchema=new mongoose.Schema({
    testname:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    teacher_id:{
        type:String,
        require:true,
    },
    start_date:{
        type:Date,
        require:true,
    },
    end_date:{
        type:Date,
        require:true,
    },
    duration:{
        type:Timestamp,
        require:true,
    },
    status:{
        type:String,
    },
    proctor_settings:{
        type:[],
    },
    report:{
        type:[]
    }

})
const Test=mongoose.model("Test",TestSchema);
module.exports=Test;