const express = require("express");
const ejs = require("ejs");
const path = require("path");
const userRouter = require("./routes/user")
const blogRouter = require("./routes/blog")
const connectDb = require("./db")
const cookieParser = require("cookie-parser");
const { checkForValidUser } = require("./middlewares/authentication");
const Blog = require("./models/blog")
const removeMd = require('remove-markdown')

const PORT = 8000;

const app = express();
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.resolve('./public')));


app.use(cookieParser());
app.use(checkForValidUser("token"));


app.use("/user",userRouter);
app.use("/blog",blogRouter);

app.get("/", async (req,res)=>{
  const blogs = (await Blog.find({}).populate("createdBy")).reverse();
  blogs.forEach(blog=>{
    blog.body = removeMd(blog.body);
  })
  return res.render("home",{
    user:req.user,
    blogs:blogs,
  })
})

connectDb()
.then(data => {
  console.log("db connected");
  app.listen(PORT, ()=>{console.log("listening on port 8000")}); 
})
.catch(err=>console.log("error in connecting db",err))