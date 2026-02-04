

import { userModel } from "../models/userSchema.js"

export const getHome = (req, res) => {
     res.send(`<h1>This is the first route</h1>`)
}

export const getAbout = (req, res) => {
     res.send(`<h1>This is the About page.</h1>`)
}

export const postUser = async (req, res) => {
     const {username, email, password} = req.body
     try{
          if(email !== "" && password !== ""){
               const newUser = await userModel.create({
                    username,
                    email,
                    password
               })
               res.status(201).json({
                    message: "User created successfully",
                    data: newUser
               })
          }

          res.status(400).json({
               message: "Provide email and password"
          })
     }catch(err){
          console.error(err)
     }


}