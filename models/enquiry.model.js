let mongoose = require('mongoose')
let enquirySchema=new mongoose.Schema({
    email:{type:String},
    oppurtunity:{type:String},
    csp:{type:String},
    region:{type:String},
    products:{type:Array},
    totalPrice:{type:Number},
},{ timestamps: true });
module.exports=Users=mongoose.model("Enquiries",enquirySchema);  