import express from "express"
import { WebController } from "../controller/Web.Controller"
import uploadImage from "../helper/imagehandler"
const WebRouter = express.Router()
import { uiAuth } from "../middleware/uiauth"

WebRouter.get('/addproduct', uiAuth, WebController.addProductGet)
WebRouter.post('/addproductCreate', uiAuth, uploadImage.single("image"), WebController.addproductPost)
WebRouter.get('/product', uiAuth, WebController.productList)
WebRouter.get('/deleteproduct/:id', uiAuth, WebController.deleteProduct)
WebRouter.get('/searchproduct', uiAuth, WebController.searchProduct)

export default WebRouter   