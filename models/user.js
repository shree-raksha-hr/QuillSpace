const {Schema,model} = require("mongoose");
const {createHmac, randomBytes}= require("crypto");
const {validateJWT,createJWT} = require("../services/authentication")

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profilePhoto:{
        type:String,
        default:"default.webp",
    },
    role:{
        type:String,
        default:"USER",
        enum:["ADMIN","USER"],
    },
},{ timestamps: true });

userSchema.pre("save",function (next){
    const user = this;

    if(!user.isModified('password')) return next();

    const salt = randomBytes(16).toString("hex");
    const hashedPw = createHmac("sha256",salt).update(user.password).digest("hex");

    user.salt = salt;
    user.password = hashedPw;

    next();
})

userSchema.static('matchPasswordandVerifyJWT', async function(email,password){
    const user=await this.findOne({email});
    console.log(user)
    const salt = user.salt;
    pw = user.password;
    const hashedPw = createHmac("sha256",salt).update(password).digest("hex");
    const token = createJWT(user)
    if(hashedPw !== pw) 
        throw new Error("Incorrect Passoword");
    return token;
})

const User = model("user",userSchema);

module.exports = User;