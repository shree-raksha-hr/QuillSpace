const { validateJWT } = require("../services/authentication");

function checkForValidUser(tokenName){
    return (req,res,next)=>{
        const userToken = req.cookies[tokenName];
        if(!userToken) return next();
        try {
            const payload = validateJWT(userToken);
            req.user = payload;
            console.log(req.user)
        } catch (error) {}
        return next();
    }
}

module.exports = {checkForValidUser};