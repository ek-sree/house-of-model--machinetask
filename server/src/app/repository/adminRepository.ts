import { StatusCode } from "../../interface/enum";
import { ICategory, IOffer } from "../../interface/productInterface";
import { UserData } from "../../interface/userInterface";
import categoryModel from "../model/categoryModel";
import offerModel from "../model/offerModel";
import sellerModel from "../model/sellerModel";
import userModel from "../model/userModel";

export default class AdminRepository {
    findUsers = async (page: number, limit: number): Promise<{ users: UserData[], totalCount: number } | null> => {
        try {
            const skip = (page - 1) * limit;
            const users = await userModel.find({ isAdmin: false })
                .skip(skip)
                .limit(limit)
                .select('-password')
                .lean();

            const totalCount = await userModel.countDocuments({ isAdmin: false });

            const typedUsers = users as unknown as UserData[];

            return { users:typedUsers, totalCount };
        } catch (error) {
            console.log("Error finding users", error);
            return null;
        }
    }

    findSellers = async(page:number, limit: number): Promise<{users: UserData[], totalCount:number} | null> =>{
        try {
            const skip = (page -1) * limit;
            const users = await sellerModel.find().skip(skip).limit(limit).select('-password').lean()

            const totalCount = await sellerModel.countDocuments();

            const typedUsers = users as unknown as UserData[];

            return {users:typedUsers, totalCount}
        } catch (error) {
            console.log("Error finding users", error);
            return null; 
        }
    }

    searchUser = async (search: string): Promise<{ users: UserData[] } | null> => {
        try {
            const users = await userModel.find({
                isAdmin: false,
                userName: { $regex: search, $options: "i" } 
            }).select('-password').lean();
    
            const typedUsers = users as unknown as UserData[];
    
            return { users: typedUsers };
        } catch (error) {
            console.log("Error finding users", error);
            return null; 
        }
    }


    searchSeller = async (search: string): Promise<{ users: UserData[] } | null> => {
        try {
            const users = await sellerModel.find({
                isAdmin: false,
                userName: { $regex: search, $options: "i" } 
            }).select('-password').lean();
    
            const typedUsers = users as unknown as UserData[];
    
            return { users: typedUsers };
        } catch (error) {
            console.log("Error finding users", error);
            return null; 
        }
    }

    updateUser = async(userId:string): Promise<{status:number, message:string} | null> =>{
        try {
            const user = await userModel.findById(userId)
            if(!user){
                return{status:StatusCode.NotFound, message:"No user found"}
            }
            user.isStatus = !user.isStatus
            await user.save()
            const message = user.isStatus ? 'User is now unblocked' : 'User is now blocked';
            return{status:StatusCode.OK, message}
        } catch (error) {
            console.log("Error finding users", error);
            return null; 
        }
    }


    updateSeller = async(userId:string): Promise<{status:number, message:string} | null> =>{
        try {
            const user = await sellerModel.findById(userId)
            if(!user){
                return{status:StatusCode.NotFound, message:"No user found"}
            }
            user.isStatus = !user.isStatus
            await user.save()
            const message = user.isStatus ? 'seller is now unblocked' : 'seller is now blocked';
            return{status:StatusCode.OK, message}
        } catch (error) {
            console.log("Error finding users", error);
            return null; 
        }
    }


    createCategory = async (categoryName: string): Promise<ICategory | null> => {
        try {
            console.log(categoryName);
            
            const categoryUpperCase = categoryName.toUpperCase();
    
            const existingCategory = await categoryModel.findOne({ categoryName: categoryUpperCase });
            
            if (existingCategory) {
                return null;
            }
    
            const newCategory = new categoryModel({ categoryName: categoryUpperCase });
            await newCategory.save();
    
            return newCategory;
        } catch (error) {
            console.log("Error creating category", error);
            return null;
        }
    };

    findCategory= async():Promise<ICategory[] | null> =>{
        try {
            const category = await categoryModel.find();
            return category
        } catch (error) {
            console.log("Error fetching category", error);
            return null;
        }
    }
    
    updateCategoryStatus = async(categoryId:string): Promise<{status:number, message:string} | null> =>{
        try {
            console.log(categoryId);
            
            const category = await categoryModel.findById(categoryId)
            console.log("adsa",category);
            
            if(!category){
                return{status:StatusCode.NotFound, message:"No category found"}
            }
            category.isStatus = !category.isStatus
            await category.save()
            const message = category.isStatus ? 'Category is now unblocked' : 'Category is now blocked';
            return{status:StatusCode.OK, message}
        } catch (error) {
            console.log("Error finding users", error);
            return null; 
        }
    }


    createOffer = async(data:IOffer,imageUrl:string):Promise<{data:IOffer }| null> =>{
        try {
            console.log("Offerrr addinf");
            
            const newOffer = new offerModel({
                ...data,
                image:imageUrl
            })
            const savedOffer = await newOffer.save()
            return {data:savedOffer}
        } catch (error) {
            console.log("Error creating offer", error);
            return null; 
        }
    }


    findOffer = async(page:number, limit: number):Promise<{data:IOffer[], totalCount:number }| null>=>{
        try {
            const skip = (page -1) * limit;
            const offer = await offerModel.find().skip(skip).limit(limit)
            const totalCount = await offerModel.countDocuments()
            return {data:offer, totalCount}
        } catch (error) {
            console.log("Error fetching offer", error);
            return null; 
        }
    }

    updateOfferStatus = async(offerId: string):Promise<{status:number, message:string}|null>=>{
        try {
            const offer = await offerModel.findById(offerId);
            if(!offer){
                return{status:StatusCode.NotFound as number  , message:"No offer found"}
            }
            offer.isStatus = !offer.isStatus
            await offer.save()
            const message = offer.isStatus ? 'Offer is now unblocked' : 'Offer is now blocked';
            return{status:StatusCode.OK as number, message}
        } catch (error) {
            console.log("Error blocking offer", error);
            return null; 
        }
    }
    
}