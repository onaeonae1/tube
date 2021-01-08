import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
//work in local : MONGO_URL
//for Productino : MONGO_URL_PROD
mongoose.connect(
  process.env.PRODUCTION ? process.env.MONGO_URL_PROD : process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;
const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => `❎error on db connection :${error}`;
db.once("open", handleOpen);
db.on("error", handleError);
