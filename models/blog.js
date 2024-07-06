const mongoose=require('mongoose');
const multer = require('multer');
const path= require('path');
const BLOGIMAGE_PATH = path.join('/uploads/blog/blogImages')


const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required:true
    },
    blogImage: {
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
},{
    timestamps:true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'..',BLOGIMAGE_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });



// static methods
blogSchema.statics.uploadedBlogImage = multer({storage: storage}).single('blogImage');
blogSchema.statics.blogImagePath=BLOGIMAGE_PATH;

const Blog=mongoose.model('Blog',blogSchema);
module.exports=Blog;