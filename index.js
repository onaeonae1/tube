import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; 

const app = express();

const handleListening = () => console.log("4000 working");
const handleHome = (req, res) => res.send("handle home");
const handleProfile = (req,res) => res.send("you are on my profile");

//middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(helmet());
app.use(morgan("dev"));

//////routes 
app.get('/',  handleHome);
app.get('/profile',handleProfile);

///
app.listen(4000,handleListening);
