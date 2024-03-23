const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Users = require("./models/user.model");
const Enquiries= require("./models/enquiry.model");
const { response, request } = require("express");
require("dotenv").config();
const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cors({ origin: true, credentials: true }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)
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


app.post("/createUser", async (req, res) => {
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

app.post("/verify",(req,res)=>{
    const { to,userName } = req.body;
    const OTP=Math.floor(Math.random()*1000000)
    const msg = {
      to,
      from: 'mohamednasim3108@gmail.com',
      subject:"Email verification",
      html:`
            <p>Hello <b>${userName}</b></p>
            <p>Let's complete your verification process.</p>
            <p>Please use the below OTP for Authentication</p>
            <h1>OTP : ${OTP}<h1/>
      `
    };
  
    sgMail.send(msg)  
      .then(() => {
        res.status(200).json({ otp:OTP });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error });
      });
})

app.post("/createEnquiry",async(req,res)=>{
    try {
        const {email,info,products}=req.body;
        const data = new Enquiries({ email,products,...info })
        const enquiry = await data.save()
        res.json(enquiry)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
})


app.post("/getEnquiries",async(req,res)=>{
    try{ 
        const {email}=req.body;

        const enquires=await Enquiries.find({email})
        if(enquires.length){
            const data=enquires.map(enquiry=>{
                const {oppurtunity,csp,region,products}=enquiry
                return {
                    oppurtunity,csp,region,products
                }  
            })
            return res.send(data)
        }
        res.send(enquires)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err });
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