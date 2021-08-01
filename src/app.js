require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3300;

require("./db/conn");
const Register = require("./models/registers");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partial_path = path.join(__dirname, "../template/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res)=>{
    res.render("index")
});

app.get("/register", (req, res)=>{
    res.render("register")
})

app.get("/login", (req, res)=>{
    res.render("login");
})

// Registration Database
app.post("/register", async (req, res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            const registerEmp = new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                age:req.body.age,
                password:password,
                confirmpassword:cpassword,
            })

            // console.log("Sucess part " + registerEmp);

            const token = await registerEmp.generateAuthToken();
            // console.log("token is " + token);

            const RegisteredEmp = await registerEmp.save();
            // console.log("page part " + RegisteredEmp);

            res.status(201).render("index");
        }else{
            res.send("Password not matching")
        }

    } catch (error) {
        res.status(400).send(error);
        console.log("error");
    }
})

// Login with matched database
app.post("/login", async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({email:email})

        // bcrypt password matching
        const bcryPassMatch = await bcrypt.compare(password, userEmail.password)

        
        const token = await userEmail.generateAuthToken();
        // console.log("token is " + token);
        
        if(bcryPassMatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid Email or Password")
        }
    } catch (error) {
        res.status(400).send("Invalid Email or Password");       
    }
})

// Secure email & pass using bcrypt
// const bcrypt = require("bcryptjs")
// const securePassword = async (password) => {
//     try {
//         const passwordHash = await bcrypt.hash(password, 10);
//         console.log(passwordHash);

//         const passwordMatch = await bcrypt.compare(password, passwordHash);
//         console.log(passwordMatch);
//     } catch (error) {
//         res.send(error)
//     }
// }
// securePassword("Saurabh@18");



// JWT Json web Token

const createToken = async() => {
    const token = await jwt.sign({_id:"6105527aea9bfd2198cb142b"}, "mysaurabhmeharkarfnamesiddhiremmeharkar",{
        expiresIn : '2 seconds'
    });
    // console.log(token);

    const userVerify = await jwt.verify(token, "mysaurabhmeharkarfnamesiddhiremmeharkar");
    // console.log(userVerify);
}

createToken();


app.listen(port, ()=>{
    console.log(`Running at ${port}`);
})