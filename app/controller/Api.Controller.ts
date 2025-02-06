import { ProductModel } from "../model/product";
import { Request, Response } from 'express'
import mongoose from "mongoose"; // Import mongoose
import path from "path";
import fs from "fs";

class apiController {

    // Add product 
    async addProduct(req: Request, res: Response): Promise<any> {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter image it is required"]
                });
            }
            const productData = new ProductModel({ ...req.body, image: req.file.path });
            const data = await productData.save();
            res.status(201).json({ message: "Product added successfully", data });
        } catch (error) {
            console.error(error);
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(400).json({
                    message: "Validation error",
                    errors: Object.values(error.errors).map((err) => err.message),
                });
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }

    // Fetched product list
    async productList(req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductModel.find();
            res.status(200).json({ message: "Product data fetched", data })
        } catch (error) {
            console.log("Error fetching product data...", error);

        }
    }

    // Fetched single product
    async singleproduct(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id
            const data = await ProductModel.findById(id);
            res.status(200).json({ message: "Single product fetched", data })
        } catch (error) {
            console.log("Error fetching single product...", error);

        }
    }

    // Update Data
    async productUpdate(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id;
            const product = await ProductModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (req.file && product.image) {
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
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (req.file) {
                updatedProduct.image = req.file.path;
                await updatedProduct.save(); 
            }
            res.status(200).json({
                message: "Product updated successfully",
                data: updatedProduct
            });

        } catch (error) {
            console.error("Error updating product:", error);
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(400).json({
                    message: "Validation error",
                    errors: Object.values(error.errors).map((err) => err.message),
                });
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }

    // Delete Product
    async productdelete(req: Request, res: Response): Promise<any> {
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
            const deletedproduct = await ProductModel.findByIdAndDelete(id);
            res.status(deletedproduct ? 200 : 404).json(
                deletedproduct ? { message: "Product deleted successfully" } : { message: "Product not found" }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting product" });
        }
    }

}

const ApiController = new apiController()
export { ApiController }
