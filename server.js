const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Users = require("./models/user.model");
const { response, request } = require("express");
require("dotenv").config();
const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cors({ origin: true, credentials: true }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("MongoDB connection established");
    }
);
app.get("/",(req,res)=>{
    res.send("hello world");
})


app.post("/create", async (req, res) => {
    try {
        let { userName,email } = req.body;
        const data = new Users({ userName,email })
        const updatedUsers = await data.save()
        res.json(updatedUsers)
    }
    catch (err) {
        console.log(err)
    }
})
// app.post('/signUp', async (req, res) => {
//     try {
//         let { Name, email, password } = req.body
//         const id=email+password
//         const data = new Users({ Name, email, password,id })
//         const updatedUsers = await data.save()
//         res.json(updatedUsers)
//     }
//     catch (err) {
//         console.log(err)
//     }
// })
// app.post("/getExpense",async (req, res) => {
//     const {Name}=req.body;
//     const userExpense=await Users.findOne({Name})
//     res.send(userExpense)
// })
// app.post('/addExpense',async(req,res)=>{
//         let {item,Name}=req.body;
//         let userDet=await Users.findOne({Name})
//         let prev=userDet.expenses
//         let newArr=[...prev,item]
//         let updatedArr=await Users.updateOne({Name},{$set:{expenses:newArr}})
//         res.send(updatedArr)
// })