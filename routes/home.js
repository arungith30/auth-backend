const express=require("express");
const router =express.Router();
const {AuthorizeUser}=require("../controllers/login");
const { RedisSearchLanguages } = require("redis");


router.get("/",async(req,res)=>{
    try {
        const auth_token=await req.headers.authorization
        const loginCredentials=AuthorizeUser(auth_token)
        if(loginCredentials===false){
            res.status(200).send("invalid token");
        }
        else{
            res.json(loginCredentials);
            console.log(loginCredentials);
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).send("Server Busy")
    }
    })

module.exports=router