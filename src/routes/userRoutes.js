
import { Router } from "express";
import { getHome, getAbout, postUser, Login, getAllUsers, getSingle, deleteSingle, logOut } from "../controllers/userController.js";
import { checkToken } from "../middlewares/authMiddleware.js";

const router = Router()

router.get('/', getHome).get('/about', checkToken, getAbout).post('/post-user', postUser).post('/login', Login).get('/users', checkToken, getAllUsers).get('/user/:id', getSingle).delete('/delete-user/:id', deleteSingle).get('/logout', checkToken, logOut)

export default router
