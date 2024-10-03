import { Types } from "mongoose";

export interface IUserinterface {
    email: string; 
    password: string; 
    userName: string;
    phone?: string;
    role:string;
    isAdmin?:boolean;
    isStatus?:boolean;
    createdAt?: Date; 
    updatedAt?: Date; 
}

export interface UserData{
    _id:Types.ObjectId
    userName: string;
    email: string;
    phone:string;
    role:string;
    password:string;
    isAdmin:boolean;
    isStatus:boolean;
}

export interface AuthResponse {
    user: UserData;
    token: string;
}