
import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import bootStrap from './src/app.controller.js'
import userModel from './src/DataBase/models/user.model.js'
import messageModel from './src/DataBase/models/message.model.js'
import reveokTokenModel from './src/DataBase/models/revokeToken.model.js'
dotenv.config({path:path.resolve('src/config/.env')})
const app = express()
const port = process.env.PORT||3000
userModel
messageModel
reveokTokenModel

bootStrap(app,express)



app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// postMan
// https://web.postman.co/workspace/My-Workspace~69f72193-6664-459b-8290-b0d5e007073c/collection/40499397-cce61b91-c36c-4507-8815-961a7570ba3b?action=share&source=copy-link&creator=40499397
