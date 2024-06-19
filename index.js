const mongoose = require("mongoose");
const express = require("express");
const adminRoute = require("./routes/admniRoute");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const isBlog  = require("./middlewares/isBlog");
mongoose.connect("mongodb://localhost:27017/BMS");

const app = express();

var http = require('http').createServer(app);

var { Server } = require('socket.io');
var io = new Server(http, {});

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

io.on("connection", function(socket){
    //console.log(socket);
    socket.on("new_post_by_admin", function(formData){
        //console.log(formData);
        socket.broadcast.emit("new_post_by_admin", formData);
    });

    socket.on("comment_new", function(CommentData){
        io.emit("comment_new", CommentData);
    });

    socket.on("add_reply", function(formData){
    
        io.emit("add_reply", formData);
    });

    socket.on('delete_post', function(data){
        socket.broadcast.emit('delete_post', data);
    })
});

http.listen(3000, function(){
    console.log("Server is running");
});


// app.listen(3000, function(){
//     console.log("Server is running");
// });