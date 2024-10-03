import { Request, Response } from "express";
import { StatusCode } from "../../interface/enum";
import SellerUseCase from "../use-case/sellerUseCase";

export default class SellerController{

    private sellerUseCase : SellerUseCase;

    constructor() {
        this.sellerUseCase = new SellerUseCase();
    }

    addProduct = async (req: Request, res: Response): Promise<void> => {
        try {
          console.log(req.body);
          const data = req.body;
          data.sellerId = req.query.sellerId;
          const files = req.files as {
            images?: Express.Multer.File[];
            companyLogo?: Express.Multer.File[];
          };
          
          if(!data.sellerId){
            res.status(StatusCode.NotFound).json({message:"Id is missing"})
            return
          }

          if (!files || !files.images || files.images.length === 0) {
            res.status(StatusCode.NotFound).json({ message: 'No images uploaded.' });
            return;
          }
      
          if (!files.companyLogo || files.companyLogo.length === 0) {
            res.status(StatusCode.NotFound).json({ message: 'No company logo uploaded.' });
            return;
          }
      
          const imageBuffers = files.images.map((file) => file.buffer);
          const companyLogoBuffer = files.companyLogo[0].buffer;
      
          const result = await this.sellerUseCase.createProduct(data, imageBuffers, companyLogoBuffer);
          res.status(result.status).json({ message: result.message, data: result.data });
        } catch (error) {
          console.log('Error in adding product', error);
          res.status(StatusCode.InternalServerError).json({ message: 'Internal server error' });
        }
      };


      editProduct = async(req:Request, res:Response): Promise<void>=>{
        try {
            console.log("hereeeeeeeee1111----",req.body);
            
            const productId = req.params.productId;
            const data = req.body;
            const files = req.files as {
              images?: Express.Multer.File[];
              companyLogo?: Express.Multer.File[];
            };
            
            if (!productId) {
              res.status(StatusCode.NotFound).json({ message: "Product ID is missing" });
              return;
            }
            const result = await this.sellerUseCase.editProduct(productId, data, files);
            res.status(result.status).json({message:result.message, data:result.data})
        } catch (error) {
            console.log('Error in editing product', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal server error' });
          }
      }
      

      getProduct = async(req:Request, res:Response): Promise<void> =>{
        try {
            
            const sellerId = req.query.sellerId as string;
            const result = await this.sellerUseCase.getProducts(sellerId)
            console.log(result);
            
            res.status(result.status).json({message:result.message, data:result.data})
        } catch (error) {
            console.log('Error in fetching product', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal server error' });
          }
      }

      blockProduct = async(req:Request, res:Response): Promise<void> =>{
        try {
            const productId = req.params.productId;
            const result = await this.sellerUseCase.blockProduct(productId)
            res.status(result.status).json({message:result.message})
        } catch (error) {
            console.log('Error in updating product', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal server error' });
          }
      }
}