var  express =require ("express");
const connectDb = require("./db");
var app =express();
const cors =require ("cors");

app.use(express.json())
const port =4000;
connectDb ();

var signupRouter=require("./routes/signup");
var loginRouter=require("./routes/login");
var homeRouter=require("./routes/home");

app.use (cors({origin:"*"}));

app.get("/",(req,res)=> {
    res.send("hello world... ")
});

app.use("/signup",signupRouter);
app.use("/login",loginRouter);
app.use("/home",homeRouter)
app.listen(port,()=>{
    console.log(`example app listen on port ${port}`);
});
             