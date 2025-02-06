import express from "express"
import { ApiController } from "../controller/Api.Controller"
import uploadImage from "../helper/imagehandler"
import { Auth } from "../middleware/auth"
const ApiRouter = express.Router()

ApiRouter.post('/addproduct', uploadImage.single('image'),Auth, ApiController.addProduct)
ApiRouter.get('/product',Auth, ApiController.productList)
ApiRouter.get('/product/:id',Auth, ApiController.singleproduct)
ApiRouter.put('/updateproduct/:id',Auth,uploadImage.single('image'), ApiController.productUpdate)
ApiRouter.delete('/deleteproduct/:id',Auth, ApiController.productdelete)

export default ApiRouter   