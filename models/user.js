const mongoose=require('mongoose');
const multer = require('multer');
const path= require('path');
const PROFILEIMAGE_PATH = path.join('/uploads/profile/profileImages')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
    }
},{
    timestamps:true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'..', PROFILEIMAGE_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });


// static methods
userSchema.statics.uploadedProfileImage = multer({storage: storage}).single('profileImage');
userSchema.statics.profileImagePath=PROFILEIMAGE_PATH;

const User=mongoose.model('User',userSchema);
module.exports=User;