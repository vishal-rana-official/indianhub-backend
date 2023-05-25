const mongoose = require('mongoose')

const VideoSchema = mongoose.Schema({
    imageUrl: String,
    videoTitle: String,
    videoUrl: String,
    category:String,
    views:Number,
    latest:Number,    
})

module.exports = mongoose.model('Video',VideoSchema)

