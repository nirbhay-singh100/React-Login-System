const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/user")

const auth = async(req, res, next) => {
    try{
        console.log(req.cookies);
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        //console.log(verifyUser);

        const user = await User.findOne({_id: verifyUser._id});
        //console.log(user);

        if(!user){
            throw new Error("User not found")
        }

        req.token = token;
        req.user = user;
        req.userID = user._id;

        next();

    } catch(error){
        res.status(401).send("Unauthorized: No token provided");
        console.log(error);
    }
}

module.exports = auth;