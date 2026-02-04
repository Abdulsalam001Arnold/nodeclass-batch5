import express from 'express'
import userRoutes from './routes/userRoutes.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log(`Database connected successfully`)
}).catch((err) => {
    console.error(err)
})

app.use(userRoutes)

app.listen(3000, () => {
    console.log(`Server is running on port 3000`)
})

