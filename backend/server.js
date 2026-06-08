const express=require("express");
const cors=require("cors");
const {connectDB}=require("./config/db");
const emailRoutes = require("./routes/email.routes");

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
app.use("/api/email", emailRoutes);
app.use("/api", require("./routes/log.routes"));

const Port=process.env.PORT ||5000;

app.listen(Port,()=>{
    console.log(`Server running on port ${Port} `)
})