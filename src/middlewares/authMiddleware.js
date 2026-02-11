
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
import { userModel } from '../models/userSchema.js'


const secret = process.env.JWT_SECRET


export const checkToken = async (req, res, next) => {
    try {
        const token = req.cookies.genToken
    
        if(!token) {
            return res.status(404).json({
                message: "No access token found."
            })
        }
    
        const decoded = jwt.verify(token, secret)
    
        req.user = await userModel.findById(decoded.id).select("-password")
    
        if(!req.user) {
            return res.status(404).json({
                message: "User does not exist"
            })
        }
    
        next()
        
    } catch (err) {
        if(err instanceof Error) {
            console.error(err)
            throw new Error(err.message)
        }
    }
}