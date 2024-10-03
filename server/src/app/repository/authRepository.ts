import { ISellerinterface, SellerData } from "../../interface/sellerInterface";
import { IUserinterface, UserData } from "../../interface/userInterface";
import { hashPassword } from "../../utils/hashPassword";
import sellerModel from "../model/sellerModel";
import userModel from "../model/userModel";

export default class AuthRepository{
    findByEmail = async(email:string): Promise<UserData | null> =>{
        try {
            const user = await userModel.findOne({email}).exec()
            console.log("login",user);
            
            return user as UserData | null
        } catch (error) {
            console.log("Error finding user in repo",error);
            return null
        }
    }

    saveUser= async(data:IUserinterface): Promise<UserData | null> =>{
        try {
            const userData = data
            const hashedPassword = await hashPassword(userData.password);
            userData.password = hashedPassword
            const newUser =  new userModel(userData)
            const savedUser = await newUser.save()

            return savedUser as UserData;
        } catch (error) {
            console.log("Error saving user data",error);
            return null
        }
    }


    // seller

    sellerFindByEmail = async(email:string): Promise<SellerData | null> =>{
        try {
            const user = await sellerModel.findOne({email}).exec()
            return user as SellerData | null
        } catch (error) {
            console.log("Error finding seller in repo",error);
            return null
        }
    }


    saveSeller = async(data:ISellerinterface): Promise<SellerData | null> =>{
        try {
            const userData = data
            const hashedPassword = await hashPassword(userData.password);
            userData.password = hashedPassword;
            const newUser = new sellerModel(userData)
            const savedUser = await newUser.save()
            return savedUser as SellerData;
        } catch (error) {
            console.log("Error saving seller data",error);
            return null
        }
    }
}