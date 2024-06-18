const express = require("express");
const route = express();
const blogController = require("../controllers/blogController");

route.set('view engine', 'ejs');
route.set('views', './views');


route.get('/', blogController.loadBlog);
route.get('/post/:id', blogController.loadPost);
route.post('/add-comment', blogController.addComment)
route.post('/add-reply', blogController.addReply)
module.exports = route;