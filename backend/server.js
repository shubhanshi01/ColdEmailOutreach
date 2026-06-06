const express=require("express");
const cors=require("cors");
require("dotenv").config();


const app=express();

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("Backend is running");

})

app.use("/api/chat",require("./routes/ChatRoutes"));

const Port=process.env.PORT ||5000;

app.listen(Port,()=>{
    console.log(`Server running on port ${Port} `)
})