const {Schema, model} = require("mongoose");

likeSchema = new Schema({
    blogId:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
},{ timestamps: true })

const Like=model('like',likeSchema)

module.exports=Like