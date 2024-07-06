const { render } = require('ejs');
// model.js file import
const User = require("../models/user");
const Blog = require("../models/blog");

const fs = require('fs');
const path = require('path');

module.exports.blog = function (req, res) {
    let online = req.user && req.user.id ? true : false;
    User.findById(req.params.id, function (err, user) {
        // console.log(user,"user")
        return res.render('blogAdd', {
            title: "Add Blog",
            profile_user: user,
            online: online
        })
    })
}


module.exports.blogAdd = async function (req, res) {
    try {
        // Handle file upload with multer
        await new Promise((resolve, reject) => {
            Blog.uploadedBlogImage(req, res, function (err) {
                if (err) {
                    console.log('**** Multer Error', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Create a new blog entry
        let blogData = {
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId
        };

        // Check if req.file exists (file uploaded)
        if (req.file) {
            blogData.blogImage = Blog.blogImagePath + '/' + req.file.filename; // Saving image path
        }

        const blog = await Blog.create(blogData);

        return res.redirect('/');
    } catch (err) {
        console.log('Error blogAdd -> ', err);
        return res.redirect('back');
    }
};


module.exports.blogUpdate = async function (req, res) {
    try {
    let online = req.user && req.user.id ? true : false;
        
        let blog = await Blog.findById(req.params.id);
        return res.render('blogUpdate', {
            title: "Blog Update",
            blog: blog,
            online: online
        })

    } catch (err) {
        console.log('Error: blogUpdate-> ', err);
        return;
    }
}

module.exports.blogUpdated = async function (req, res) {
    try {
        let blog = await Blog.findByIdAndUpdate(req.params.id, req.body);
        Blog.uploadedBlogImage(req, res, function (err) {
            if (err) { console.log('****Multer Error', err) }
            blog.title = req.body.title;
            blog.description = req.body.description;
            if (req.file) {
                // console.log(req.file.filename);
                if (blog.blogImage) {
                    // console.log(user.avatar)
                    fs.unlinkSync(path.join(__dirname, "..", blog.blogImage));
                }
                // this is saving the path of the uploaded file into the avatar field in
                blog.blogImage = Blog.blogImagePath + '/' + req.file.filename;
            }
            blog.save();
        })
        return res.redirect('/');
    } catch (err) {
        console.log('error in home controller', err);
        return;
    }
}


module.exports.blogDeleted = async function (req, res) {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        await Blog.deleteOne({ _id: req.params.id });
        
        return res.redirect('back');
    } catch (err) {
        console.log('Error in blogDeleted controller ->', err);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports.blogShow = async function (req, res) {
    try {

    let online = req.user && req.user.id ? true : false;
        
        let blog = await Blog.findById(req.params.id);
        let user = await User.findById(blog.userId);
        return res.render('blogShow', {
            title: "Blog Page",
            blog: blog,
            name: user.name,
            online: online,
        })


    } catch (err) {
        console.log('Error blogShow->', err);
        return;
    }
}
