const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/AuthRoutes");
const cookieParser = require("cookie-parser");

app.listen(4000, ()=>{
    console.log("server started on PORT 4000");
});


mongoose.connect("mongodb://127.0.0.1:27017/jwt", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => {
    console.log("DB Connection Successful");
})
.catch((err) =>{
    console.error("DB Connection Error:", err.message);
});


app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
)

app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes);