const express = require("express");
const userController = require("../controllers/userController");
const session = require("express-session");
const config = require("../config/config");
const user_route = express();
const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.set('view engine', 'ejs');
user_route.set('views', './views');
user_route.use(session({secret:config.sessionSecret}));


user_route.get('/profile', userController.profile);
user_route.get('/login', userController.Loadlogin);
user_route.post('/login', userController.verifyLogin);

module.exports = user_route;