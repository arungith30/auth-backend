const express =require("express");
var router = express.Router();

const {CheckUser}= require("../controllers/login"); 

const {InsertVerifyUser,InsertSignUpUser}=require("../controllers/signup");

router.get("/:token",async(req,res)=>{
    try {
    const response=await InsertSignUpUser(req.params.token);
        res.status(200).send(response)
    } catch (error) {
        console.log(error);
        res.status(500).send( `<html>
        <body>
        <h4>Registration failed</h4>
        <h5>link expired sorry</h5>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`);
    }
    
});

//verifying user and inserting one

router.post("/verify",async(req,res)=>{
    try 
    {
    
        const {name,email,password}=await req.body;

        console.log(name,password);

        const registerCredentials = await CheckUser(email);
        console.log(registerCredentials);

        if (registerCredentials===false)
        {
            await InsertVerifyUser(name,email,password);
            res.status(200).send(true);
        }

        else if (registerCredentials===true)
        {
            res.status(200).send(false);
        }

        else if(registerCredentials==="Server busy")
        {
            res.status(500).send("Server Busy");
        }  
    }
    catch (error) 
    {
        console.log(error);
    }
})

module.exports =router;
