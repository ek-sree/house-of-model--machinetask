import { Types } from "mongoose";

export interface ISellerinterface {
    email: string; 
    password: string; 
    userName: string;
    role:string;
    isAdmin?:boolean
    createdAt?: Date; 
    updatedAt?: Date; 
}

export interface SellerData{
    _id:Types.ObjectId
    userName: string;
    email: string;
    isStatus:boolean;
    role:string;
    password:string;
    isAdmin:boolean;
}

export interface AuthSellerResponse {
    user: SellerData;
    token: string;
}