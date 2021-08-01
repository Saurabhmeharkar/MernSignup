const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const empSchema = mongoose.Schema({
    firstname:{
        type: String,
        require:true
    },
    lastname:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true,
        unique:true
    },
    gender:{
        type: String,
        require:true
    },
    phone:{
        type: Number,
        require:true
    },
    age:{
        type: Number,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    confirmpassword:{
        type: String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
});

// Genarating token 

empSchema.methods.generateAuthToken = async function(){
    try {
        // console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECTET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
        
    } catch (error) {
        res.send(error);
        // console.log(error);
    }
}


// Converting password to bcrypt (Hash) password
empSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})


const Register = new mongoose.model("Register", empSchema);

module.exports = Register;