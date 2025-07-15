import express from 'express';
import { UserController } from '../controllers/user.controller';
import { feature_controller } from '../controllers/feature.controller';
import { uploadAvatar, uploadPost } from '../utils/file';
import { getImage, uploadImage } from '../controllers/image.controller';

export const router = express.Router();
const userController = new UserController();
const featurecontroller = new feature_controller();
//user

router.post('/update', userController.update_user);
router.get('/', userController.get_users);

//friends
router.get('/friend', userController.get_friends);
//khi user A ket ban voi user B -> user A = waitting va user B = pending
router.post('/friend/add', userController.add_friend);
//dong y ket ban khi user B (la user co status = pending) moi co quyen chap nhan va dung endpoint nay
router.post('/friend/accept', userController.accept_friend);
router.delete('/friend', userController.unfriend);


//feature
// gui tin nhan
router.post('/message/send', userController.sendMessage);
router.post('/message', userController.getMessage);

//post
router.post('/post/add', featurecontroller.insert_post);
router.get('/post', featurecontroller.get_list_post);
router.post('/post/delete', featurecontroller.delete_post);
//them post moi nhung co anh
router.post('/post/add-img', uploadPost.single('image'), featurecontroller.insert_post_img);

//comment

router.get('/post/comment', featurecontroller.get_cmt_father);
router.post('/post/comment', featurecontroller.insert_cmt);
router.post('/post/comment/reply', featurecontroller.insert_Replycmt);
router.get('/post/comment/reply', featurecontroller.get_cmt_reply);

//like
router.post('/post/like', featurecontroller.add_like_post);
router.post('/post/comment/like', featurecontroller.add_like_cmt);
router.get('/post/like/:post_id', featurecontroller.get_post_like);
router.get('/post/comment/like/:comment_id', featurecontroller.get_cmt_like);
//update like
router.post('/post/like-update', featurecontroller.update_like);
router.post('/post/comment/like-update', featurecontroller.update_like);



// Upload ảnh (field name là 'image')

// Trả ảnh
router.get('/post/:filename', getImage);