const BlogSetting = require('../models/blogSettingModels');
const Post = require('../models/PostModels');
const User = require("../models/userModels");
const bcrypt = require("bcrypt");

const securePassword = async(password) => {
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }catch(error){
        console.log(error.message);
    }
}

const dashboard = async(req, res) => {
    try{
        res.render('admin/dashboard');
    }catch(error){
        console.log(error.message);
    }
}

const loadPostCreate = async(req, res) => {
    try{
        res.render('admin/pages/create-post');
    }catch(error){
        console.log(error.message);
    }
}


const blogSetup = async(req, res) => {
   try{
        var blogSetting = await BlogSetting.find({});
        if(blogSetting.length > 0 ){
            res.redirect('/login');
        }else{
            res.render("./pages/blogSetup");
        }
   }catch(error){
    console.log(error.message);
   }
}


const addPost =  async(req, res) =>{
    const { title, content } = req.body;

    if (!title || !content) {
        res.render('admin/pages/create-post', { error:'Title and content are required.' });
    }
    try{

        const newPost = new Post({ title, content });
        await newPost.save();
        res.render('admin/pages/create-post', { message:'Post add succesfully.' });

    }catch(error){  
        console.log(error.message);
    }
}


const blogSetupSave = async(req, res) => {
    try{
        const title = req.body.title;
        const description = req.body.description;
        const blogfile = req.file.filename;
        const name = req.body.name;
        const email = req.body.email;
        const password =  await securePassword(req.body.password);

        const blogSetting = new BlogSetting({
            blog_title:title,
            blog_logo:blogfile,
            blog_description:description,
        });

        await blogSetting.save();

        const user  = new User({
            name:name,
            email:email,
            password:password,
            is_admin:1
        });
        const  userData = await user.save();
        if(userData){
            res.redirect('login');
        }else{
            res.render("pages/blogSetup", { message: 'Please set up your blog.' });
        }
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostCreate,
    addPost
}