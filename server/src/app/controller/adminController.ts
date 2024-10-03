import { Request, Response } from "express";
import AdminUseCase from "../use-case/adminUseCase";
import { StatusCode } from "../../interface/enum";

export default class AdminController{
    private adminUseCase : AdminUseCase;

    constructor(){
        this.adminUseCase = new AdminUseCase()
    }


    fetchUsers= async(req: Request, res:Response): Promise<void> =>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const Userdata = await this.adminUseCase.fetchUsers(page,limit);
            res.status(Userdata.status).json({message:Userdata.message, data:Userdata.data})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    fetchSellers = async(req: Request, res: Response): Promise<void> =>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const userData = await this.adminUseCase.fetchSellers(page, limit);
            res.status(userData.status).json({message: userData.message, data: userData.data})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    searchUser = async(req:Request, res:Response): Promise<void> =>{
        try {
            const search = req.query.search as string;
            const userData = await this.adminUseCase.searchUser(search)
            res.status(userData.status).json({message: userData.message, data: userData.data})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    searchSeller = async(req:Request, res:Response): Promise<void> =>{
        try {
            const search = req.query.search as string;
            const userData = await this.adminUseCase.searchSeller(search)
            res.status(userData.status).json({message: userData.message, data: userData.data})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    blockUser =async(req: Request, res:Response):Promise<void> =>{
        try {
            const { userId } = req.params;
            const data = await this.adminUseCase.blockUser(userId);
            res.status(data.status).json({message:data.message})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    blockSeller =async(req: Request, res:Response):Promise<void> =>{
        try {
            const { userId } = req.params;
            const data = await this.adminUseCase.blockSeller(userId);
            res.status(data.status).json({message:data.message})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    addCategory= async(req:Request, res:Response): Promise<void> =>{
        try {
            
            const categoryName = req.body.categoryName;
            console.log("sada",categoryName);
            
            if(!categoryName){
                res.status(StatusCode.NotFound).json({message:"Category name is required"})
                return
            }
            const data = await this.adminUseCase.createCategory(categoryName);
            res.status(data.status).json({message:data.message, data: data.data})
        } catch (error) {
            console.log("Error creating",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    getCategory= async(req:Request, res:Response): Promise<void> =>{
        try {
            const data = await this.adminUseCase.getCategory();
            res.status(data.status).json({message:data.message, data:data.data})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    blockCategory =async(req: Request, res:Response):Promise<void> =>{
        try {
            console.log(req.params);
            
            const { categoryId } = req.params;
            const data = await this.adminUseCase.blockCategory(categoryId);
            res.status(data.status).json({message:data.message})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    addOffer = async(req:Request, res:Response): Promise<void> =>{
        try {
            const data = req.body;
            const image = req.file?.buffer;
            console.log("Offerr",data,image);
            
            if (!image) {
                res.status(StatusCode.BadRequest).json({ message: "Image is required" });
                return
            }
            const result = await this.adminUseCase.addOffer(data,image)
            res.status(result.status).json({message:result.message, data:result.data})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    fetchOffer = async(req:Request, res:Response): Promise<void>=>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.adminUseCase.fetchOffer(page, limit)
            res.status(result.status).json({message:result.message, data:result.data})
        } catch (error) {
            console.log("Error fetching",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    blockOffer = async(req:Request, res:Response): Promise<void>=>{
        try {
            const offerId = req.params.offerId as string;
            const result = await this.adminUseCase.blockOffer(offerId);
            res.status(result.status).json({message:result.message})
        } catch (error) {
            console.log("Error blocking",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }
}