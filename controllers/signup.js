const  dotenv  = require("dotenv");
const User =require ("../models/User");
const VerifyUser =require ("../models/verifyUser");
const sendMail =require ("./sendMail");
const bcrypt= require("bcrypt");
const mongoose= require("mongoose");
const jwt=require("jsonwebtoken");
dotenv.config();

async function InsertVerifyUser(name,email,password){
    try 
    {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);
        const token =generateToken(email);
        
        const newUser = new VerifyUser({
            name:name,
            email:email,
            password:hashedPassword,
            token:token 
        })

        const activationLink=`https://auth-back-6p2k.onrender.com/signup/${token}`
        const content = `<h4>hi there</h4>
        <h5>Welcome</h5>
        <p>thank you for signing up</p>
        <a href="${activationLink}">click here</a>
        <p>Regards</p>
        <p>Team</p>`

        await newUser.save()
        sendMail(email,"VerifyUser",content)

    } 
    catch (error) {
    console.log(error)    
    }
}

function generateToken(email)
{
    const token =jwt.sign(email,process.env.signup_secretkey)
    return token;
}

async function InsertSignUpUser(token)
{
try {
    const userVerify = await VerifyUser.findOne({token:token })
        if (userVerify)
        {   const newUser=new User({
            name:userVerify.name,
            email:userVerify.email,
            password:userVerify.password,
            forgotPassword:{}
            });
        await newUser.save();
        await userVerify.deleteOne({token:token});
        const content = `<h4>Registration successful...</h4>
        <h5>Welcome</h5>
        <p>thank you for signing up</p>
        <p>Regards</p>
        <p>Team</p>`;
        sendMail(newUser.email,"Registration success",content);

        return`<h4>Registration successfull...</h4>
        <h5>Welcome</h5>
        <p>to home page</p>
        <p></p>
        <p></p>`
        }
        else{  
        return `<h4>Registration failed</h4>
        <h5>link expired....</h5>
        <p>Regards</p>
        <p>Team</p>`};

} catch (error) {
    console.log(error);
    return `<html>
    <body>
    <h4>Registration failed</h4>
    <h5>unexpected error happened</h5>
    <p>Regards</p>
    <p>Team</p>
    </body>
    </html>`;
}
    
    
   
}

module.exports={InsertVerifyUser,InsertSignUpUser}