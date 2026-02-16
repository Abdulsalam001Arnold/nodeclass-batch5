
import { userValidation, userValidationForLogin } from "../validator/userValidator.js"
import { userModel } from "../models/userSchema.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"


export const getHome = (req, res) => {
     res.send(`<h1>This is the first route</h1>`)
}

export const getAbout = (req, res) => {
     res.send(`<h1>This is the About page.</h1>`)
}

export const postUser = async (req, res) => {
     const { username, email, password } = req.body
     try {
          if (email !== "" && password !== "") {
               const {error} = userValidation.validate({
                    username,
                    email,
                    password
               })

               if(error) {
                    return res.status(400).json({
                         message: error.details[0].message
                    })
               }

               const existingUser = await userModel.findOne({email})

               if(existingUser) {
                    return res.status(400).json({
                         message: `User with email ${email} already exists, please login instead or create a new account`
                    })
               }

               const newUser = await userModel.create({
                    username,
                    email,
                    password
               })

               const token = await generateToken(newUser._id)

               res.cookie('genToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 60 * 24 * 7
               })
               return res.status(201).json({
                    message: "User created successfully",
                    data: newUser
               })
          }

          res.status(400).json({
               message: "Provide email and password"
          })
     } catch (err) {
          console.error(err)
     }
}

export const Login = async (req, res) => {
     const {email, password} = req.body
     try {
          const {error} = userValidationForLogin.validate({
               email,
               password
          })

          if(error) {
               return res.status(400).json({
                    message: error.details[0].message
               })
          }

          const existingUser = await userModel.findOne({email})

          if(!existingUser) {
               return res.status(404).json({
                    message: `User with email ${email} not found`
               })
          }

          const isPasswordValid = await
          bcrypt.compare(password,
               existingUser.password
          )

          if(!isPasswordValid) {
               return res.status(401).json({
                    message: "Invalid credentials"
               })
          }

          const token = await generateToken(existingUser._id)

          res.cookie('genToken', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               maxAge: 1000 * 60 * 60 * 24 * 7
          })

          return res.status(200).json({
               message: "Login successful",
               data: existingUser
          })
     } catch (err) {
          console.error(err)
     }
}

export const getAllUsers = async (req, res) => {
     try {
          const users = await userModel.find().select("-password")

          if(!users) {
               return res.status(404).json({
                    message: "No users found"
               })
          }

          return res.status(200).json({
               message: "Users retrieved successfully",
               data: users
          })
     } catch (err) {
          if(err instanceof Error) {
               console.error(err)
               throw new Error(err.message)
          }
     }
}


export const getSingle = async (req, res) => {

     const { id } = req.params
    try {
     const user = await userModel.findById(id).select("-password")

     if(!user) {
          return res.status(404).json({
               message: `User with id: ${id} not found`
          })
     }

     return res.status(200).json({
          message: "User retrieved successfully",
          data: user
     })
    } catch (err) {
          if(err instanceof Error) {
               console.error(err)
               throw new Error(err.message)
          }
    }
}

export const deleteSingle = async (req, res) => {
     const { id } = req.params
     try {
        
          const user = await userModel.findByIdAndDelete(id)

          if(!user) {
               return res.status(404).json({
                    message: `User with id: ${id} not found`
               })
          }

          return res.status(200).json({
               message: "User deleted successfully",
               data: user
          })
     }catch(err) {
          if(err instanceof Error) {
               console.error(err)
               throw new Error(err.message)
          }
     }
}

export const logOut = (req, res) => {
     try {
       res.clearCookie("genToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
       })

       return res.status(200).json({
          message: "Logout successful"
       })
     }catch(err) {
          console.error(err)
     }
}