let mongoose = require('mongoose')
let userSchema=new mongoose.Schema({
    id:{type:String},
    Name:{type:String},
    email:{type:String},
    password:{type:String},
    expenses:{type:Array}
});
module.exports=User=mongoose.model("expenseTrackerUsers",userSchema);