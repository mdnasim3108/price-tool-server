let mongoose = require('mongoose')
let userSchema=new mongoose.Schema({
    userName:{type:String},
    email:{type:String}
});
module.exports=Users=mongoose.model("Users",userSchema);