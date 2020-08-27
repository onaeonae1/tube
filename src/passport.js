import passport from "passport";
import GithubStrategy from "passport-github";
import User from "./models/User";
import { githubLoginCallback } from "./controllers/userController";
import routes from "./routes";
let github_id, github_secret, github_callbackURL;
if (process.env.PRODUCTION) {
  console.log("GITHUB ID AND KEY : PROD");
  github_id = process.env.GH_ID;
  github_secret = process.env.GH_SECRET;
  github_callbackURL = `https://powerful-mountain-41200.herokuapp.com${routes.githubCallback}`;
} else {
  console.log("GITHUB ID AND KEY : DEV");
  github_id = process.env.GH_DEV_ID;
  github_secret = process.env.GH_DEV_SECRET;
  github_callbackURL = `http://localhost:4000${routes.githubCallback}`;
}
passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: github_id,
      clientSecret: github_secret,
      callbackURL: github_callbackURL,
    },
    githubLoginCallback
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
