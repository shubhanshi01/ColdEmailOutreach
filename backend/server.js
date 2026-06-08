const express=require("express");
const cors=require("cors");
const {connectDB}=require("./config/db");
require("dotenv").config();


const app=express();

app.use(cors());
app.use(express.json());

connectDB();
app.get("/",(req,res)=>{
    res.json({
        status:"Backend is running"
    });

})

app.use("/api/pipeline",require("./routes/pipeline.routes"));


const Port=process.env.PORT ||5000;

app.listen(Port,()=>{
    console.log(`Server running on port ${Port} `)
})