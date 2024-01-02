import express from "express";
import { createUser,getAllUsers,loginUser,logoutUser,getUserProfile,updateCurrUserProfile, deleteUserById, getUserById , updateUserById} from "../controllers/UserController.js";
import { authentication, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/').post(createUser)
.get(authentication,authorizeAdmin,getAllUsers);


router.route('/auth').post(loginUser);
router.route('/logout').post(logoutUser);

router.route('/profile')
.get(authentication,getUserProfile)
.put(authentication,updateCurrUserProfile)//.delete(authentication,deleteUserProfile).get(authentication,authorizeAdmin,getUserById).put(authentication,authorizeAdmin,updateUserById).delete(authentication,authorizeAdmin,deleteUserById);

router.route('/:id').delete(authentication,authorizeAdmin,deleteUserById)
.get(authentication,authorizeAdmin,getUserById)
.put(authentication,authorizeAdmin,updateUserById)

export default router;