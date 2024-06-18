const User = require("../models/userModels");
const bcrypt  = require("bcrypt");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');
const adminController = require('../controllers/adminController');
const sendRestPasswordMail = async (name, email, token) =>{
    try{
        const sendSMTP = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPass
            }
        });

        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:"Reset Password",
            html:'<p>Hi '+name +', please click this link for forget <a href="http://localhost:3000/reset?token='+token+'">Reset your password</a>'
        }
        sendSMTP.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log("Email has been sent: - ", info.response);
            }
        });
    }catch(error){
        console.log(error.message);
    }   
}
const Loadlogin = async(req, res) => {
    try{
        res.render('pages/login');
    }catch(error){
        console.log(error.message);
    }
}

const profile = async(req, res) => {
    try{
        res.send('pages/profile');
    }catch(error){
        console.log(error.message);
    }
}

const logout = async(req, res) => {
    try{
        req.session.destroy();
        res.redirect('/login');
    }catch(error){
        console.log(error.message);
    }
}

const reset = async(req, res) => {
    try{
        
        const token = req.query.token;
       const tokenData= await User.findOne({ token:token });
       if(tokenData){
        res.render('pages/reset', {user_id: tokenData._id});
       }
    }catch(error){
        console.log(error.message);
    }
}
const resetPassword = async(req, res) => {
    try{
        
        const password = req.body.password;
        const user_id = req.body._id;
        const newPass  = await adminController.securePassword(password);
        await User.findByIdAndUpdate({_id: user_id}, {$set:{password: newPass, token:''}});
        res.redirect('/login');
    }catch(error){
        console.log(error.message);
    }
}

const forget = async(req, res) => {
    try{
        
        res.render('pages/forget');
    }catch(error){
        console.log(error.message);
    }
}

const forgetVerify = async(req, res) => {
    try{
        const email = req.body.email;

        const userData = await User.findOne({email:email});
        if(userData){
            const randomString = randomstring.generate();
            await User.updateOne({email:email}, {$set:{token:randomString }});
            sendRestPasswordMail(userData.name, userData.email, randomString);

            res.render('pages/forget', {message:"Send forget Link on you email"});
        }else{
            res.render('pages/forget', {message:"Try again"});
        }
    }catch(error){
        console.log(error.message);
    }
}
const verifyLogin = async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userData  = await User.findOne({email:email});
    
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
        
            if(passwordMatch){
                req.session.user_id = userData._id;
                req.session.is_admin = userData.is_admin;
                if(userData.is_admin ==1){
                   res.redirect("/dashboard");
                }else{
                    res.redirect("/profile");
                }
            }else{
                res.render('pages/login', {message: "Email and Password is incorrect!"}) 
            }
            //res.redirect("/login");
        }else{
            res.render('pages/login', {message: "Email and Password is incorrect!"}) 
        }
    }catch(error){
        console.log(error.message);
    }
}


module.exports = {
    Loadlogin,
    verifyLogin,
    profile,
    logout,
    forget,
    forgetVerify,
    reset,
    resetPassword
}