import express from "express"
import { ApiController } from "../controller/Api.Controller"
import uploadImage from "../helper/imagehandler"
const ApiRouter = express.Router()

ApiRouter.post('/addproduct', uploadImage.single('image'), ApiController.addProduct)
ApiRouter.get('/product', ApiController.productList)
ApiRouter.get('/product/:id', ApiController.singleproduct)
ApiRouter.put('/updateproduct/:id',uploadImage.single('image'), ApiController.productUpdate)
ApiRouter.delete('/deleteproduct/:id', ApiController.productdelete)

export default ApiRouter   