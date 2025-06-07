const mongoose = require("mongoose");

const uri = "mongodb+srv://raksha:raksha@cluster0.6djwex5.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"

module.exports = () => mongoose.connect(uri)