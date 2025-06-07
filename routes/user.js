const {Router} = require("express");
const User = require("../models/user");
const multer  = require('multer');
const path=require("path");

const router = new Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/images`))
    },
    filename: function (req, file, cb) {
        const filename =`${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})
const upload = multer({ storage: storage })

router.get("/signup",(req,res)=>{return res.render('signup')});
router.get("/signin",(req,res)=>{return res.render('signin')});

router.post("/signup",upload.single('profilePhoto'), async (req,res)=>{
    const {name,email,password,username,bio} = req.body;
    await User.create({
        name,
        email,
        username,
        bio,
        profilePhoto:req.file.filename,
        password
    });
    return res.redirect("/");
});

router.post("/signin", async (req,res)=>{
    const {email,password} = req.body;
    try {
        const token = await User.matchPasswordandVerifyJWT(email,password);
        return res.cookie("token",token).redirect("/")
    } catch (error) {
        return res.render("signin",{
            error:"Incorrect email or password"
        })
    }
});

router.get("/logout", (req,res)=>{
    res.clearCookie('token').redirect("/")
})

router.get("/profile/:id", async (req,res)=>{
    const profile = await User.findById(req.params.id);
    if(!profile) return res.redirect("/")
    return res.render("userProfile",{user:req.user,profile})
})

module.exports = router;