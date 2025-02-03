import express from "express"
import { AuthController } from "../controller/Auth.Controller"
import uploadImage from "../helper/imagehandler"
import { Auth } from "../middleware/auth"
const AuthRouter = express.Router()

AuthRouter.post('/register', uploadImage.single('image'), AuthController.register)
AuthRouter.post('/verifyotp', AuthController.verifyOtp)
AuthRouter.post('/login', AuthController.login)
AuthRouter.get('/dashboard', Auth, AuthController.dashboard)

export default AuthRouter   