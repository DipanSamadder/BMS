const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");
const  adminController = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");

admin_route.use(express.static('public'));


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


admin_route.get('/dashboard', adminController.dashboard);
admin_route.get('/blog-setup', adminController.blogSetup);
admin_route.post('/blog-setup', upload.single('blogfile'), adminController.blogSetupSave);

module.exports = admin_route;