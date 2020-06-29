import express, { Router } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; 

import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter"; 
import globalRouter from "./routers/globalRouter";
import routes from "./routes.js";
import { localsMiddleware } from "./middlewares";

const app = express();

app.set("view engine","pug");


//middlewares
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("dev"));

//////routes 
app.use(localsMiddleware);



app.use(routes.videos,videoRouter);
app.use(routes.home,globalRouter);
app.use(routes.users,userRouter);

///

export default app;