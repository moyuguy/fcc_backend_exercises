const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
    user_id:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        get: v => v.toDateString()
    }
},{
    timestamps:true,
    toJSON: { 
        getters: true,
        virtuals: false
    }
});

const Exercise = mongoose.model('Exercise',exerciseSchema);

module.exports = Exercise;