import express from "express"
import { WebAuthController } from "../controller/WebAuth.Controller"
import uploadImage from "../helper/imagehandler"
import { uiAuth } from "../middleware/uiauth"
const WebAuthRouter = express.Router()

WebAuthRouter.get('/login', WebAuthController.loginGet)
WebAuthRouter.post('/logincreate', WebAuthController.loginPost)
WebAuthRouter.get('/logout', WebAuthController.logout)

export default WebAuthRouter   