require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const User = require("./models/user")
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')

const auth = require("./middleware/auth");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;



app.use(cors({credentials: true, origin: true}));
app.set('view engine', 'ejs');

//    middlewares

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(require("./router/userAuth"));
app.use(express.static("public"));




// app.post("/", async (req, res) => {
//     try{

//         if(req.body.password===req.body.cpassword){

//             const hashedPassword = await bcrypt.hash(req.body.password, 10);

//             const newUser = new Register({
//                 firstName: req.body.fname,
//                 lastName: req.body.lname,
//                 email: req.body.email,
//                 password: hashedPassword
//             });

//             const token = await newUser.generateAuthToken();

//             res.cookie("jwt", token, {
//                 expires: new Date(Date.now()+50000000000),
//                 httpOnly: true
//             });

//             await newUser.save();
//             res.redirect("login");
//         }else{
//             res.render(register);
//         }

//     } catch(error){
//         console.log(error);
//     }
// })

// app.get("/login", async (req, res) => {
//     res.render("login");
// })

app.listen(port, (req, res) => {
    console.log("server is running ");
})