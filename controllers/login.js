const { json } = require("express");
const User =require("../models/User");
const dotenv=require ("dotenv");
dotenv.config();
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const client = require("../redis");


async function CheckUser(email){
    try{
        const user =await User.findOne({email:email});
        if (user)
        {return true;
        } 
        return false;
    }
    catch(e){
    return "server controller busy";
}
}

async function AunthenticateUser(email,password){
    try     
    {
        const userCheck=await User.findOne({email:email});
        
        const validPassword=await bcrypt.compare(password,userCheck.password);

        if (validPassword)
        {
            const token=jwt.sign({email},process.env.login_secret)
            const response={
                id :userCheck._id,
                name:userCheck.name,
                email:userCheck.email,
                token:token,
                status:true
                };
            await client.set(`key-${email}`,JSON.stringify(response))
            await User.findOneAndUpdate(
            {email:userCheck.email},
            {$set:{token:token}},
            {new:true});
            return response;
        }
        return "Invalid user name and password"
    } 

    catch (error) 
    {
   console.log(error); 
   return "server catch busy"
    }    
}

async function AuthorizeUser(token){
    try {
    const decodedToken=jwt.verify(token,process.env.login_secret);
    if (decodedToken){
        const email=decodedToken.email;
        const auth=await client.get(`key-${email}`)
        if (auth){
            const data =JSON.parse(auth);
            return data;
        }
        else{
            const data =await User.findOne({email:email});
            return data;
        }
    }
    else {return false;}    
    } catch (error) {
        console.log(error);
    }
}

module.exports={CheckUser,AunthenticateUser,AuthorizeUser}