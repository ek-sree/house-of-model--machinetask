import { StatusCode } from "../../interface/enum";
import { IProduct } from "../../interface/productInterface";
import productModel from "../model/productModel";

export default class sellerRepository{
    createProduct = async(data: IProduct, imageUrls:string[]):Promise<{data:IProduct}| null> =>{
        try {
            const newProduct = new productModel({
                ...data,
                image: imageUrls ,
                companyLogo: data.companyLogo,
            });

            const savedProduct = await newProduct.save();

            return { data: savedProduct };  
        } catch (error) {
            console.log("Error uploading product",error);
            return null
        }
    }


    getProductById = async (productId: string): Promise<IProduct | null> => {
        try {
          return await productModel.findById(productId);
        } catch (error) {
          console.log("Error fetching product", error);
          return null;
        }
      };

      updateProduct = async (productId: string, data: Partial<IProduct>): Promise<{ data: IProduct } | null> => {
        try {
          const updatedProduct = await productModel.findByIdAndUpdate(productId, data, { new: true });
          console.log("sss",updatedProduct);
          
          return updatedProduct ? { data: updatedProduct } : null;
        } catch (error) {
          console.log("Error updating product", error);
          return null;
        }
      };

    findProduct = async(sellerId:string): Promise<{data?:IProduct[]}| null> =>{
        try {
            const products = await productModel.find({sellerId});
            
            return {data: products}
        } catch (error) {
            console.log("Error fetching product",error);
            return null
        }
    }

    updateProductStatus = async(productId:string): Promise<{status:number, message:string} | null> =>{
        try {
            const product = await productModel.findById(productId)
            if(!product){
                return{status:StatusCode.NotFound as number, message:"No product found"}
            }
            product.isStatus = !product.isStatus;
            await product.save()
            const message = product.isStatus ? 'Product is now unblocked' : 'Product is now blocked';
            return{status:StatusCode.OK as number, message}
        } catch (error) {
            console.log("Error update product",error);
            return null
        }
    }
}