const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Users = require("./models/user.model");
const Enquiries= require("./models/enquiry.model");
require("dotenv").config();
const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cors({ origin: true, credentials: true }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
const sgMail = require('@sendgrid/mail');
const { fetchPrice } = require("./utils/fetchPrice");
const {fetchRegions}=require("./utils/fetchRegions");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)
const axios=require("axios")

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

app.get("/fetchRegions",async(req,res)=>{
    const regions=await fetchRegions()
    res.send(regions)
})


  

const productInfo={
    product:"product 1",serviceName:"Virtual Machines",region:"southafricanorth",serviceFamily:"Compute"
}

const vmInfo=[
    {productId:1,productName:"Virtual Machines Dv3 Series",skuName:"D8 v3"},
    {productId:2,productName:"Virtual Machines DSv3 Series",skuName:"D4s v3"},
    {productId:3,productName:"Virtual Machines DSv3 Series",skuName:"D4s v3"},
    {productId:4,productName:"Virtual Machines DSv3 Series",skuName:"D8s v3"},
]
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

app.post("/verifyUser",(req,res)=>{
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
        const {email,info,products,time}=req.body;
        var price;
        for(let i=0;i<products.length;i++){
            price=0
            for(let j=0;j<vmInfo.length;j++){
                const priceOfOneSku=await fetchPrice(productInfo,vmInfo[j].productName,vmInfo[j].skuName,products[i].term)
                price+=(products[i].term=="PAYG"?priceOfOneSku*720:priceOfOneSku)
            }
            products[i]={...products[i],price}
        }
        const totalPrice=products.reduce((acc,curr)=>acc+curr.price,0)
        const data = new Enquiries({ email,products,totalPrice,...info,time })
        const enquiry = await data.save()  
        res.json(enquiry)
    }
    catch (err) {   
        console.error(err);
        res.status(500).json({ err });
    }
})
   

app.post("/isUserExist",async(req,res)=>{
    const {email}=req.body;
    const users =await Users.find()
    const usersEmail=users.map(user=>user.email)
    if(usersEmail.includes(email)){
        res.send(true)
    }
    else{
        res.send(false)
    }
})

app.post("/getEnquiries",async(req,res)=>{
    try{ 
        
        const {email}=req.body;

        const enquires=await Enquiries.find({email})
        if(enquires.length){
            const data=enquires.map(enquiry=>{  
                const {oppurtunity,csp,region,products,totalPrice,time}=enquiry
                return {
                    oppurtunity,csp,region,products,totalPrice,time
                }  
            })
            return res.send(data)
        }
        res.send(enquires)
        res.send()
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
})

