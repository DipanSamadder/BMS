const Post = require('../models/PostModels');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendRepyMail = async(name, email, post_id) => {
    try{
        const transport = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            requireTLs:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPass
            }

           
        });
        const mailOption = {
            from:"BMS",
            to:email,
            subject:"New Reply",
            html:'<p>'+name+' has reply on this post. <a href="http://localhost:3000/post/'+post_id+'"> View Post </a></p>',
        }
        transport.sendMail(mailOption, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log("Email send",  info.response);
            }
        })
    }catch(error){

    }
}

const loadBlog = async(req, res)=>{
    try{
        const posts = await Post.find({});
        res.render("index", {posts:posts});
    }catch(error){
        console.log(error.message);
    }
}

const loadPost = async(req, res)=>{
    try{
        const post = await Post.findById({"_id":req.params.id});
        res.render("pages/postDetails", {post:post});
    }catch(error){
        console.log(error.message);
    }
}
const addComment = async(req, res) => {
    try{
        var post_id = req.body.id;
        var name = req.body.name;
        var email = req.body.email;
        var comment = req.body.comment;
        var comment_id = new mongoose.Types.ObjectId();
        console.log(comment_id);
        const postModel = await Post.findByIdAndUpdate({_id:post_id}, {
            $push:{
                "comments":{_id: comment_id, username: name,email:email, comment:comment}
            }
        });
        res.status(200).send({success:true, msg:'Comment Added!'})
    }catch(error){
        res.status(200).send({success:false, msg:error.message})
    }
}
const addReply = async (req, res) => {
    try {
        const { post_id, comment_id, name, comment, comment_email } = req.body;
        const reply_id = new mongoose.Types.ObjectId();

        const updateResult = await Post.updateOne(
            { "_id": post_id, "comments._id": comment_id },
            {
                $push: {
                    "comments.$.replies": {
                        _id: reply_id,
                        name: name,
                        reply: comment,
                        createdAt: new Date(),
                    }
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(200).send({ success: false, msg: 'Reply not added!' });
        }
        sendRepyMail(name, comment_email, post_id);
        res.status(200).send({ success: true, msg: 'Reply Added!' });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};


module.exports = {
    loadBlog,
    loadPost,
    addComment,
    addReply
}