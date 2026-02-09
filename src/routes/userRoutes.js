
import { Router } from "express";
import { getHome, getAbout, postUser, Login } from "../controllers/userController.js";

const router = Router()

router.get('/', getHome).get('/about', getAbout).post('/post-user', postUser).post('/login', Login)
// router.get('/about', getAbout)

export default router
