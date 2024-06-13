const express = require("express");
const userController = require("../controllers/userController");
const adminLoginAuth = require('../middlewares/adminLoginAuth');
const user_route = express();


const session = require("express-session");
const config = require("../config/config");
user_route.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized: true,
}));

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.set('view engine', 'ejs');
user_route.set('views', './views');

user_route.get('/',function(req, res){
    res.render("index");
});


user_route.get('/profile', adminLoginAuth.isLogin, userController.profile);
user_route.get('/login', adminLoginAuth.isLogout,  userController.Loadlogin);
user_route.post('/login', userController.verifyLogin);
user_route.get('/logout', adminLoginAuth.isLogin, userController.logout)
module.exports = user_route;