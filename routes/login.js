var express= require("express");
const  {AunthenticateUser}  = require("../controllers/login");
var router=express.Router();
const client=require("../redis");

client.connect().then(()=>{
    console.log("connected to reddis");
})
.catch((e)=>{
console.log(e)
});



router.post("/",async(req,res)=>{ 
try
{
    const {email,password}=await req.body;
    var loginCredentials=await AunthenticateUser(email,password);
    //console.log(loginCredentials);
    if (loginCredentials==="Invalid user name and password"){
        res.status(200).send("invalid user name or password")
    }
    else if (loginCredentials==="server catch busy"){
        res.status(200).send("server  routes busy")
    }
    else{
        res.status(200).json({loginCredentials})
    }
}

catch(e){
console.log(e);
res.status(500).send("server routes busy")
    
} 

});

module.exports=router;