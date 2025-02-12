import express from "express";
import { getAllUsers, signIn, signUp, updateUser, deleteUser} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";


const router = express.Router();

router.get('/', [auth] ,getAllUsers); 

router.post('/signup', signUp);

router.post('/signin', signIn);

router.patch('/', [auth] , updateUser);

router.delete('/', [auth] , deleteUser);



export default router;