const BlogSetting = require('../models/blogSettingModels');
const Post = require('../models/PostModels');
const settingModels = require('../models/settingModels');
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
        const postData = await Post.find({});

        res.render('admin/dashboard', {posts: postData});
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
    const { title, content, image } = req.body;
    
    if (!title || !content) {
        res.render('admin/pages/create-post', { error:'Title and content are required.' });
    }
    try{
        var imagePath = '';
        if(image !== undefined){
            imagePath = image;
        }
        const newPost = new Post({ title, content, image});
        const postData  = await newPost.save();
        res.send({ success:true, msg:"Post add successfully", _id:postData._id});
        //res.render('admin/pages/create-post', { message:'Post add succesfully.' });

    }catch(error){  
        res.send({ success:false, msg:error.message});
        //console.log(error.message);
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

const uploadPostImage = async(req, res) =>{
    try{
        var imagePath = '/images';
        imagePath = imagePath+'/'+req.file.filename;
        res.status(200).send({success:true, msg:"Post image uploaded", path:imagePath});
    }catch(error){
        res.status(200).send({success:false, msg:error.message});
    }
}

const deletePost =  async(req, res) =>{
    try {
        await Post.deleteOne({_id:req.body.id});
        res.status(200).send({success:true, msg:'Post delete sucessfull.'});
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

const updatePost =  async(req, res) =>{
    try {
        await Post.findByIdAndUpdate(
            {_id:req.body.id},{
                
                $set:{
                    title: req.body.title,
                    content: req.body.content,
                    image: req.body.image
                }
            }
        );
        res.status(200).send({success:true, msg:'Post delete sucessfull.'});
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

const updateSetting =  async(req, res) =>{
    try {
       
          await settingModels.updateOne(
            {},
            { page_limit: req.body.page_limit },
            { upsert: true }
          );
        res.status(200).send({success:true, msg:'setting update sucessfull.'});
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}


const loadEditPost = async(req, res)=>{
    try {
        const postDate  = await Post.findOne({_id:req.params.id});
        res.render("admin/pages/edit-post", {post:postDate});
    } catch (error) {
        console.log(error.message);
    }
}

const loadSetting = async(req, res)=>{
    try {
        var pageLimit = 0; 
        var setting  = await settingModels.findOne({});
        if(setting != null){
            pageLimit = setting.page_limit;
        }
        res.render("admin/pages/setting", {limit:pageLimit});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostCreate,
    addPost,
    securePassword,
    uploadPostImage,
    deletePost,
    loadEditPost,
    updatePost,
    loadSetting,
    updateSetting
}