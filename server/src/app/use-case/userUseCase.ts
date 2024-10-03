import { StatusCode } from "../../interface/enum";
import { IOffer, IProduct } from "../../interface/productInterface";
import UserRepository from "../repository/userRepository";

const userRepo = new UserRepository()

export default class UserUseCase{
    fetchAllProducts = async(page: number, limit: number, sort: string, search:string): Promise<{status: number, message: string, data?: IProduct[]}> => {
        try {
            const result = await userRepo.findAllProduct(page, limit, sort,search);
            if (!result) {
                return {status: StatusCode.NotFound as number, message: "No Product found"};
            }
            return {status: StatusCode.OK as number, message: "Products found", data: result.data};
        } catch (error) {
            console.log('Internal server Error product fetching', error);
            return { status: StatusCode.InternalServerError as number, message: 'Internal server error' };
        }
    }

    fetchSingleProduct = async(productId:string): Promise<{status:number, message:string, data?:IProduct}> =>{
        try {
            const result = await userRepo.findSingleProduct(productId);
            if(!result){
                return{status:StatusCode.NotFound as number, message:"No data found"}
            }
            return{status:StatusCode.OK as number, message:"Product found", data:result.data}
        } catch (error) {
          console.log('Internal server Error while single product fetching', error);
          return { status: StatusCode.InternalServerError as number, message: 'Internal server error' };
        }
    }

    getOffer = async(): Promise<{status:number, message:string, data?:IOffer[]}>=>{
        try {
            const result = await userRepo.findOffer();
            if(!result){
                return{status:StatusCode.NotFound as number, message:"No offer available"};
            }
            return{status:StatusCode.OK as number, message:"Offer found", data:result.data}
        } catch (error) {
            console.log('Internal server Error while fetching offer', error);
            return { status: StatusCode.InternalServerError as number, message: 'Internal server error' };
          }
    }
}