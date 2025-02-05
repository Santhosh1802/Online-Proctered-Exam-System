const mongoose=require("mongoose");

const ReportSchema=new mongoose.Schema({

})

const Report=mongoose.model("Report",ReportSchema);
module.exports=Report;