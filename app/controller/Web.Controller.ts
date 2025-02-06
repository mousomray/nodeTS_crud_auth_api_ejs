import { ProductModel } from "../model/product";
import { Request, Response } from 'express'
import { AuthenticatedRequest } from "../interface/authInterface";
import mongoose from "mongoose"; // Import mongoose
import path from "path";
import fs from "fs";

class webController {

    // Show add Product form
    async addProductGet(req: AuthenticatedRequest, res: Response) {
        res.render('admin/addproduct', { user: req.user });
    }

    // Add data in product form
    async addproductPost(req: Request, res: Response): Promise<any> {
        try {
            const { name, price, description } = req.body;
            if (!name || !price || !description || !req.file) {
                req.flash('err', 'All fields are required')
                return res.redirect('/admin/addproduct');
            }
            const productData = {
                name: name.trim(),
                price: price.trim(),
                description: description.trim(),
                image: req.file.path, // Image path for handling image
            };
            const product = new ProductModel(productData);
            await product.save();
            req.flash('sucess', 'Product added sucessfully')
            return res.redirect('/admin/product');
        } catch (error) {
            console.error('Error saving product:', error);
            req.flash('err', 'Error posting product')
            return res.redirect('/admin/addproduct');
        }
    }

    // Product List
    async productList(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const products = await ProductModel.find();
            res.render('admin/product', { products, user: req.user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving blogs" });
        }
    }

    // Handle DELETE for delete product
    async deleteProduct(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id;
            const product = await ProductModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (product.image) {
                const imagePath = path.resolve(__dirname, "../../", product.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error("Error deleting image file:", err);
                        } else {
                            console.log("Image file deleted successfully:", product.image);
                        }
                    });
                } else {
                    console.log("File does not exist:", imagePath);
                }
            }
            await ProductModel.findByIdAndDelete(id);
            req.flash('sucess', "Product deleted sucessfully")
            return res.redirect('/admin/product'); // Redirect blog after deleting data
        } catch (error) {
            console.error('Error deleting professional:', error);
            return res.status(500).send('Error deleting professional');
        }
    }

    // Handle GET Search for filtering products by name
    async searchProduct(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const { name } = req.query;
            const filter: Record<string, any> = {};
            if (typeof name === 'string' && name.trim() !== '') {
                filter.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
            }
            const products = await ProductModel.find(filter);
            res.render('admin/product', { products, name, user: req.user });
        } catch (error) {
            console.error("Error retrieving search products:", error);
            res.status(500).send('Error retrieving products');
        }
    }

}

const WebController = new webController()
export { WebController }
