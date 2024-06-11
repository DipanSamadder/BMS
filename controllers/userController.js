const User = require("../models/userModels");
const bcrypt  = require("bcrypt");


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
    profile
}