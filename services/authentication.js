const JWT = require("jsonwebtoken")

const secret = "1234567890"

function createJWT(user){
    const payload={
        _id : user._id,
        email:user.email,
        name:user.name,
        profilePhoto:user.profilePhoto,
        role:user.role
    };
    const token = JWT.sign(payload,secret);
    return token;
}

function validateJWT(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports = {createJWT, validateJWT}