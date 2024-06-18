
const mongoose = require('mongoose');

// Schema for replies
const replySchema = mongoose.Schema({
    _id: { 
        type: mongoose.Types.ObjectId, 
        default: () => new mongoose.Types.ObjectId() 
    },
    name: { 
        type: String,
         required: true 
    },
    reply: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Schema for comments
const commentSchema = mongoose.Schema({
    _id: { 
        type: mongoose.Types.ObjectId, 
        default: () => new mongoose.Types.ObjectId() 
    },
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    replies: [replySchema],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const PostSchema  = mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    content:{
        type: String,
        required: true
    },
    image:{
        type:String,
        default:''
    },
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Post', PostSchema);
