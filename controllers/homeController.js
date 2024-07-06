const { render } = require('ejs');
// model.js file import
const User = require("../models/user");
const Blog = require("../models/blog");

const fs = require('fs');
const path = require('path');


module.exports.home=async function(req,res){
    try{
        let user=await User.find({});
        let blog=await Blog.find({});
        let online = req.user && req.user.id ? true : false;
           
        return res.render("home",{
            title:"Home",
            all_users:user,
            all_blogs:blog,
            online: online
        })
    }catch(err){
        console.log('error in home controller',err);
        return;
    }

}


module.exports.signUp=function(req,res){
    let online = req.user && req.user.id ? true : false;

    if(req.isAuthenticated()){
        return res.redirect('/users/about');
    }

    return res.render("user_sign_up",{
        title:"Sign Up",
        online:online
    })
}

module.exports.signIn=function(req,res){
    let online = req.user && req.user.id ? true : false;

    if(req.isAuthenticated()){
        return res.redirect('/users/about');
    }
    return res.render("user_sign_in",{
        title:"Sign In",
        online: online
    })
}

module.exports.about=function(req,res){
    let online = req.user && req.user.id ? true : false;
    
    User.findById(req.params.id,function(err,user){
       
        return res.render('about',{
            title:"About",
            profile_user:user,
            online:online
        })
    })
    
}


module.exports.update=function(req,res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');

        })
    }else{
        return res.status(401).send('Unauthorized')
    }
}


module.exports.create = async function (req, res) {
    try {
        // Check if passwords match
        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        // Find if a user with the same email already exists
        let user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            // Handle file upload with multer
            await new Promise((resolve, reject) => {
                User.uploadedProfileImage(req, res, function (err) {
                    if (err) {
                        console.log('**** Multer Error', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            // Create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                profileImage: req.file ? User.profileImagePath + '/' + req.file.filename : ''
            });

            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in create function ->', err);
        return res.redirect('back');
    }
};



// for passport
module.exports.createSession = function(req, res){
    return res.redirect('/')
}

module.exports.destroySession=function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
}

