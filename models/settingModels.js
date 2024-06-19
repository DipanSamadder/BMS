const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
    page_limit:{
        type:Number,
        require:true
    }
});

module.exports = mongoose.model('Setting', settingSchema);