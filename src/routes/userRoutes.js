
import { Router } from "express";
import { getHome, getAbout, postUser } from "../controllers/userController.js";

const router = Router()

router.get('/', getHome).get('/about', getAbout).post('/post-user', postUser)
// router.get('/about', getAbout)

export default router
