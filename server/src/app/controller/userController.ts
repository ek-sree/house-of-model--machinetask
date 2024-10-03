import { Request, Response } from "express";
import { StatusCode } from "../../interface/enum";
import UserUseCase from "../use-case/userUseCase";

export default class UserController {
    private userUseCase : UserUseCase;

    constructor(){
        this.userUseCase = new UserUseCase()
    }

    fetchProducts = async(req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const sort = req.query.sort as string || 'recommended';
            const search = req.query.search as string || '';
            const result = await this.userUseCase.fetchAllProducts(page, limit, sort, search);
            res.status(result.status).json({message: result.message, data: result.data});
        } catch (error) {
            console.log('Error in fetching product', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal server error' });
        }
    }

    fetchSingleProduct = async(req:Request, res:Response): Promise<void> =>{
        try {
            const productId = req.params.productId;
            console.log(productId);
            
            const result = await this.userUseCase.fetchSingleProduct(productId);
            res.status(result.status).json({message: result.message, data:result.data})
        } catch (error) {
            console.log('Error in fetching single product', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal server error' });
          }
    }

    fetchOffer = async(req:Request, res:Response): Promise<void>=>{
        try {
            const result = await this.userUseCase.getOffer();
            res.status(result.status).json({message:result.message, data:result.data})
        } catch (error) {
            console.log('Error in fetching offer', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal server error' });
          }
    }
}