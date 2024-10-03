import mongoose from "mongoose";

export interface ICategory{
    categoryName:string;
    isStatus:boolean;
}

export interface IProduct{
    productName:string;
    productShorts:string;
    productPrice:number;
    productDescription:string;
    productSpecifications:string;
    image?:string[]
    companyLogo?:string;
    sellerId?:string;
    productStock:number;
    isStatus:boolean;
    imagesToDelete?: string; 
}


export interface IOffer{
    name:string;
    image:string;
    searchQuery:string;
    category: string; 
}