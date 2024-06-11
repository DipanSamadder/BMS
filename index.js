const mongoose = require("mongoose");
const express = require("express");
const adminRoute = require("./routes/admniRoute");
const userRoute = require("./routes/userRoute");
const isBlog  = require("./middlewares/isBlog");
mongoose.connect("mongodb://localhost:27017/BMS");

const app = express();
app.use(isBlog.isBlog);


app.use("/", adminRoute);
app.use("/", userRoute);

app.listen(3000, function(){
    console.log("Server is running");
});