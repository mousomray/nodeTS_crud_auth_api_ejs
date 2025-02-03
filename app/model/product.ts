import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { ProductInterface } from "../interface/productInterface";

const ProductSchema = new Schema<ProductInterface>({
    name: {
        type: String,
        required: [true, "Product name is required"],  // fixed the required field
    },
    price: {
        type: Number,
        required: [true, "Price is required"],  // fixed the required field
    },
    description: {
        type: String,
        required: [true, "Description is required"],  // fixed the required field
        minlength: [3, "Description must be atleast 3 characters long"]
    },
    image: {
        type: String
    }
});

const ProductModel = mongoose.model<ProductInterface>("product", ProductSchema);
export { ProductModel }