const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/newRegistraion", {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Database Connected");
}).catch((e)=>{
    console.log("Database Not Conn.");
});