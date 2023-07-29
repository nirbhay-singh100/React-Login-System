const express = require("express");

const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");

router.use(cookieParser());

router.post("/register", async (req, res)=> {
    
    try{
        
        const {fname, lname, email, password, cpassword} = req.body;

        if(!fname || !lname || !email || !password || !cpassword){
            res.status(422).json({error: "all fiels are not filled"});
        } 
        
        const userExist = await User.findOne({email: email})

        if(userExist){
            res.status(422).json({error: "Email already exist"});
        }
        else if(password!==cpassword){
            res.status(422).json({error: "Passwords are not matching"});
        } 
        else{
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                firstName: fname,
                lastName: lname,
                email: email,
                password: hashedPassword
            });

            const token = await newUser.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now()+5000000000),
                httpOnly: true
            });
            console.log(res.cookie);
            await newUser.save();
            
            res.status(201).json({message : "user registered successfully"}); 
        }
        
        
    } catch(error){
        console.log(error);
    }
    
})

//////////             LOGIN  


router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
    
        if(!email || !password){
            res.status(422).json({error: "Please fill all the fields"});
        }

        const userExist = await User.findOne({email: email});
        if(!userExist) {
            res.status(401).json({error: "Invalid email"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);

        if(!isPasswordCorrect){
            res.status(401).json({error:"password is inccorect"});
        } else{
            const token = await userExist.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now()+5000000000),
                httpOnly: true
            });

            

            res.status(201).json(userExist);
        }   

    } catch(error){
        
        console.log(error);
    }
})

router.get("/about", auth, async (req, res) => {
    //console.log(req.user);
    res.json(req.user);
    
})

router.get("/getUserData", auth, async (req,res) => {
    res.json(req.user);
})

router.post("/logout", auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter((currToken) => {
        return currToken.token != req.token
    });

    res.clearCookie("jwt");
    console.log("Logout succesfull");

    await req.user.save();

    res.json({message: "Logout succesful"})
})

module.exports = router;