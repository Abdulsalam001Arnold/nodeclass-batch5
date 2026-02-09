
import { userValidation, userValidationForLogin } from "../../validator/userValidator.js"
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

               res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    strict: "lax",
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

          return res.status(200).json({
               message: "Login successful",
               data: existingUser
          })
     } catch (err) {
          console.error(err)
     }
}