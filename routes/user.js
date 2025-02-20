const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utills/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup",(req,res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username,email,password} = req.body;
const newUser = new User({email, username});
const registerUser = await User.register(newUser, password);
console.log(registerUser);
req.login(registerUser, (error)=>{
    if(error){
        return next(error);
    }
    
        req.flash("success", "Welcome to Wonderlust!");
return res.redirect("/listings");
    
});
 } catch(error){
        req.flash("error", "User Already Exixts");
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res) =>{
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async(req,res)=>{
        req.flash("success","Welcome back to Wonderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logout now!");
        res.redirect("/listings");
    })
});

module.exports = router;
