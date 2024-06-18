const mongoose = require("mongoose");
const express = require("express");
const adminRoute = require("./routes/admniRoute");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const isBlog  = require("./middlewares/isBlog");
mongoose.connect("mongodb://localhost:27017/BMS");

const app = express();
app.use(isBlog.isBlog);
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');


app.use("/", adminRoute);
app.use("/", userRoute);
app.use("/", blogRoute);

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(3000, function(){
    console.log("Server is running");
});