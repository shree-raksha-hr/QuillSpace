const {Schema,model} = require("mongoose");

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
        default:"general"
    },
    coverImage:{
        type:String,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    }
},{timestamps:true});

const Blog = model("blog",blogSchema);

module.exports = Blog;