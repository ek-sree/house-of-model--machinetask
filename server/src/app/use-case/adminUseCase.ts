import { StatusCode } from "../../interface/enum";
import AdminRepository from "../repository/adminRepository";
import { UserData } from "../../interface/userInterface";
import { ICategory, IOffer } from "../../interface/productInterface";
import { uploadImageToCloudinary } from "../../services/cloudinary";

const adminRepo = new AdminRepository()

export default class AdminUseCase {
    fetchUsers = async (page: number, limit: number): Promise<{ status: number, message: string, data?: { users: UserData[], totalPages: number } }> => {
        try {
            const result = await adminRepo.findUsers(page, limit);
            if (!result) {
                return { status: StatusCode.NotFound, message: "No users found" }
            }
            const { users, totalCount } = result;
            if (users.length === 0) {
                return { status: StatusCode.NotFound, message: "No users found" }
            }
            const totalPages = Math.ceil(totalCount / limit);
            return { status: StatusCode.OK, message: "Users found", data: { users, totalPages } }
        } catch (error) {
            console.log("Error fetching user data", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    fetchSellers = async(page: number, limit: number):Promise<{status: number, message: string, data?:{users: UserData[], totalPages: number}}> =>{
        try {
            const result = await adminRepo.findSellers(page, limit);
            if (!result) {
                return { status: StatusCode.NotFound, message: "No users found" }
            }
            const { users, totalCount } = result;
            if (users.length === 0) {
                return { status: StatusCode.NotFound, message: "No users found" }
            }
            const totalPages = Math.ceil(totalCount / limit);
            return { status: StatusCode.OK, message: "Sellers found", data: { users, totalPages } }
        } catch (error) {
            console.log("Error fetching user data", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    searchUser = async(search:string): Promise<{status:number, message:string, data?:UserData[]}> =>{
        try {
            const result = await adminRepo.searchUser(search);
            if(!result){
                return{status:StatusCode.NotFound as number, message:"No user found"}
            }
            if(result.users.length==0){
                return{status:StatusCode.NotFound as number, message:"No user found"}
            }
            return{status:StatusCode.OK as number, message:"User found", data:result.users}
        } catch (error) {
            console.log("Error search user data", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }


    searchSeller = async(search:string): Promise<{status:number, message:string, data?:UserData[]}> =>{
        try {
            const result = await adminRepo.searchSeller(search);
            if(!result){
                return{status:StatusCode.NotFound as number, message:"No user found"}
            }
            if(result.users.length==0){
                return{status:StatusCode.NotFound as number, message:"No user found"}
            }
            return{status:StatusCode.OK as number, message:"User found", data:result.users}
        } catch (error) {
            console.log("Error search user data", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    blockUser = async(userId:string): Promise<{status:number, message:string}> =>{
        try {
            const result = await adminRepo.updateUser(userId)
            return{status:result?.status as number, message:result?.message as string}
        } catch (error) {
            console.log("Error updating user data", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    blockSeller = async(userId:string): Promise<{status:number, message:string}> =>{
        try {
            const result = await adminRepo.updateSeller(userId)
            return{status:result?.status as number, message:result?.message as string}
        } catch (error) {
            console.log("Error updating user data", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    createCategory = async(category: { categoryName: string }): Promise<{status:number, message:string, data?:ICategory}> =>{
        try {
            const categoryName = category.categoryName
            const result = await adminRepo.createCategory(categoryName);
            if(!result){
                return{status:StatusCode.Conflict as number, message:"Category already exist"}
            }
            return{status:StatusCode.Created as number, message:"Category created", data:result}
        } catch (error) {
            console.log("Error creating category", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    getCategory= async(): Promise<{status:number, message:string, data?:ICategory[]}> =>{
        try {
            const result = await adminRepo.findCategory();
            if(!result){
                return{status:StatusCode.NotFound, message:"No category found"}
            }
            return{status:StatusCode.OK, message:"Category fetched", data:result}
        } catch (error) {
            console.log("Error getting category", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    blockCategory = async(categoryId:string): Promise<{status:number, message:string}> =>{
        try {
            const result = await adminRepo.updateCategoryStatus(categoryId)
            return{status:result?.status as number, message:result?.message as string}
        } catch (error) {
            console.log("Error updating data", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }

    addOffer = async(data:IOffer, image:Buffer): Promise<{status: number, message:string, data?:IOffer}> =>{
        try {
            const logoUploadResponse = await uploadImageToCloudinary(image);
            const imageUrl = logoUploadResponse.secure_url;

            if (!imageUrl) {
                return { status: StatusCode.BadRequest as number, message: "Image upload failed" };
            }

            const result = await adminRepo.createOffer(data,imageUrl)
            if(!result){
                return{status:StatusCode.Conflict as number, message:"Cant add offer right now, try later"}
            }
            return{status:StatusCode.Created as number, message:"Offer created", data:result.data}
        } catch (error) {
            console.log("Error creating offer", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" }
        }
    }


    fetchOffer = async (page: number, limit: number): Promise<{ status: number; message: string; data?: IOffer[]; totalPage?: number }> => {
        try {
            const result = await adminRepo.findOffer(page, limit);
            if (!result) {
                return { status: StatusCode.NotFound as number, message: "No data found" };
            }
            const { data, totalCount } = result;
            const totalPage = Math.ceil(totalCount / limit); 
            return { status: StatusCode.OK as number, message: "Offer data found", data, totalPage }; 
        } catch (error) {
            console.log("Error fetching offer", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" };
        }
    }
    
    blockOffer = async(offerId:string): Promise<{status:number, message:string}>=>{
        try {
            const result = await adminRepo.updateOfferStatus(offerId)
            return{status:result?.status as number, message:result?.message as string}
        } catch (error) {
            console.log("Error blocking offer", error);
            return { status: StatusCode.InternalServerError as number, message: "Internal server error" };
        }
    }

}