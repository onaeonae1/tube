import routes from "../routes";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "getJoin" });
};

export const postJoin = (req,res) =>{
  const {
    body:{name,email,password, password2}
  } = req;
  if(password !== password2){ //같지 않음
    res.status(400); //bad request
    res.render("join", {pageTitle:"postJoin"});
  }
  else{
    //Register User
    //Log User in
    console.log("succssfully logged in");
    res.redirect(routes.home)
  }
};

export const getLogin = (req, res) => {
  console.log("getLogin");
  res.render("login", { pageTitle: "Log In" });
};

export const postLogin = (req,res) => {
  console.log("postLogin");
  res.redirect(routes.home);
};

export const logout = (req, res) =>{
  //process log out
  res.redirect(routes.home);
}
export const userDetail = (req, res) =>{
  res.render("userDetail", { pageTitle: "User Detail" });
}
export const editProfile = (req, res) =>{
  res.render("editProfile", { pageTitle: "Edit Profile" });
}
export const changePassword = (req, res) =>{
  res.render("changePassword", { pageTitle: "Change Password" });
}