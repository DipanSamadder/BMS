const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");
const  adminController = require("../controllers/adminController");
const adminLoginAuth = require('../middlewares/adminLoginAuth');
const multer = require("multer");
const path = require("path");




const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized: true,
}));

const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/images');
        
        // Check if directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        const name = Date.now() + "-" + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views');


admin_route.get('/dashboard', adminLoginAuth.isLogin, adminController.dashboard);
admin_route.get('/blog-setup', adminController.blogSetup);
admin_route.post('/blog-setup', upload.single('blogfile'), adminController.blogSetupSave);

admin_route.get('/create-post', adminLoginAuth.isLogin, adminController.loadPostCreate);
admin_route.post('/create-post', adminLoginAuth.isLogin, adminController.addPost);
admin_route.post('/upload-post-image', upload.single('postImage'), adminLoginAuth.isLogin, adminController.uploadPostImage);
module.exports = admin_route;