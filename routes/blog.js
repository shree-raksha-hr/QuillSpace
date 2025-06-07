const {Router} = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/commment");
const multer  = require('multer');
const path=require("path");
const marked = require('marked');
const removeMd = require('remove-markdown');
const Like = require("../models/like");

const router = new Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const filename =`${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})


const upload = multer({ storage: storage })


router.get("/addBlog",(req,res)=>{
    if(!req.user) return res.redirect("/user/signin")
    return res.render("addBlog",{user:req.user})
})


router.post("/",upload.single('coverImage'),async (req,res)=>{
    const {title,body,category} = req.body;
    const blog= await Blog.create({
        title,
        body,
        category,
        createdBy:req.user._id,
        coverImage:req.file.filename
    })
    console.log(blog);
    return res.redirect(`/blog/${blog._id}`)
})


router.get("/myBlogs",async (req,res)=>{
    if(!req.user) return res.redirect("/user/signin")
    const blogs=(await Blog.find({createdBy:req.user._id}).populate("createdBy")).reverse();
    blogs.forEach(blog=>{
        blog.body = removeMd(blog.body);
    })
    return res.render("myBlogs",{
        blogs,
        user:req.user,
    })
})


router.get("/:id", async (req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
        const like = await Like.find({blogId:req.params.id, userId:req.user._id})
        console.log(like)
        if (like.length>0) imgUrl="/images/final.png";
        else imgUrl="/images/default.png";
        const allLikes = await Like.find({blogId:req.params.id});
        console.log(allLikes)
        return res.render("blog",{
            user:req.user,
            blog,
            comments,
            marked,
            imgUrl,
            allLikes
        })
    } catch (error) {
        return res.redirect("/")
    }
})


router.post("/comment/:blogId", async (req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user,
    })
    res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/like/:blogId", async(req,res)=>{
    const liked = await Like.find({blogId:req.params.blogId, userId:req.user._id})
    if(liked.length===1){
        await Like.deleteOne({blogId:req.params.blogId,userId:req.user._id})
    }else{
        await Like.create({
            blogId : req.params.blogId,
            userId : req.user._id,
        })
    }
    res.redirect(`/blog/${req.params.blogId}`);
})


router.get("/delete/:id", async (req,res)=>{
    if(!req.user) return res.redirect("/")
    const postId = req.params.id;
    const blog = await Blog.findById(postId).populate("createdBy");
    if(blog.createdBy._id==req.user._id){
        await Blog.deleteOne({_id:postId});
        res.redirect("/blog/myBlogs");
    }
    else{
        res.redirect("/");
    }
})


router.get("/edit/:id", async (req,res)=>{
    const postId = req.params.id;
    const blog = await Blog.findById(postId).populate("createdBy");
    if(req.user && blog.createdBy._id==req.user._id){
        return res.render("editBlog",{blog,user:req.user});
    }
    else{
        res.redirect("/");
    }
    
})

router.post("/edit/:id",upload.single('coverImage'),async (req,res)=>{
    const postId = req.params.id;
    const blog = await Blog.findById(postId);
    if(!blog) return res.redirect("/")
    blog.title = req.body.title;
    blog.body = req.body.body;
    blog.category = req.body.category

    if (req.file) {
        blog.coverImage = req.file.filename;
    }
    await blog.save();
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;