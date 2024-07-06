const express=require('express');
const router=express.Router();
const passport=require('passport');
const blogController=require('../controllers/blogController')


router.get('/add',blogController.blog);
router.post('/add',blogController.blogAdd);
router.get('/update/:id',blogController.blogUpdate);
router.post('/update/:id',blogController.blogUpdated);
router.get('/delete/:id',blogController.blogDeleted);
router.get('/show/:id',blogController.blogShow);

module.exports=router;