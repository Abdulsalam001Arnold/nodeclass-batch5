
import { userValidation } from "../../validator/userValidator.js"
import { userModel } from "../models/userSchema.js"

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
               const newUser = await userModel.create({
                    username,
                    email,
                    password
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