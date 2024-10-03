import { StatusCode } from "../../interface/enum";
import { AuthSellerResponse, ISellerinterface } from "../../interface/sellerInterface";
import { AuthResponse, IUserinterface, UserData } from "../../interface/userInterface";
import { getOtp, getSellerData, getUserData, otpSetData, otpSetSellerData } from "../../services/redis";
import { sendOtpEmail } from "../../services/sendEmail";
import { generateOtp } from "../../utils/generateOtp";
import { comparePassword } from "../../utils/hashPassword";
import { createToken } from "../../utils/jwt";
import AuthRepository from "../repository/authRepository";


const authRepo=new AuthRepository()

export default class AuthUseCase{
    register = async(data:IUserinterface) :Promise<{status:number, message:string, data?:{email:string, role:string}}> =>{
        try {
            const emailExist = await authRepo.findByEmail(data.email);
            console.log("email exist",emailExist);
            
            if(emailExist){
                return {status :StatusCode.Conflict as number, message:"Email already exist"}
            }
            const otp = await generateOtp()
            console.log("ooooootppp",otp);
            
            const sendMail = await sendOtpEmail(data.email, otp)
            if(sendMail){
                await otpSetData(data, otp)
                return {status: StatusCode.OK as number, message:"Otp send successfully",data:{email:data.email, role:data.role}}
            } else {
                return { status: StatusCode.InternalServerError as number, message: "Failed to send OTP email" };
            }
        } catch (error) {
            console.log("Error registring in use-case",error);
            return{status :StatusCode.InternalServerError as number, message:'Internal server error'}
        }
    }

    verifyOtp = async(email:string, otp:string) :Promise<{status:number, message:string, data?:AuthResponse }> => {
        try {
            console.log("email user",email);
            
            const storedOtp = await getOtp(email)
            console.log("11111",storedOtp);
            
            if(!storedOtp){
                return{status:StatusCode.NotFound as number, message:"Otp not found"}
            }
            
            if(storedOtp==otp){
                const userData = await getUserData(email);
            if(!userData){
                return{status:StatusCode.NotFound as number, message:"No data found"}
            }
            const saveUser = await authRepo.saveUser(userData);
            if(!saveUser){
                return{status:StatusCode.InternalServerError as number, message:"User data not saved, server error"}
            }else{
                const token = await createToken(saveUser._id, saveUser.role);
                return{status:StatusCode.Created as number, message:"User created", data:{user:saveUser,token}}
            }
            }else{
                return{status:StatusCode.Forbidden as number, message:"Entered otp is wrong"}
            }
            
        } catch (error) {
            console.log("Error verifying otp",error);
            return{status: StatusCode.InternalServerError as number, message:"Internal server error"}
        }
    }

    login = async(email:string, password:string): Promise<{status:number, message:string, data?:AuthResponse}> =>{
        try {
            const user = await authRepo.findByEmail(email)
            if(!user){
                return{status:StatusCode.NotFound as number, message:"User not found"}
            }
            if(user.isStatus==false){
                return{status:StatusCode.OK as number, message:"This accound is blocked"}
            }
            const isPasswordMatch = await comparePassword(password, user.password)
            if(isPasswordMatch){
                const token = await createToken(user._id, user.role)
                return{status:StatusCode.OK as number, message:"User logined", data:{user:user, token}}
            }
            return{status:StatusCode.Forbidden as number, message:"Email or Password not match"}
        } catch (error) {
            console.log("Error while logging in useCase",error);
            return{status:StatusCode.InternalServerError as number, message:"Error login, Internal server error"}
        }
    }


    /// seller

    regesterSeller= async(data:ISellerinterface): Promise<{status:number, message:string, data?:{email:string, role:string}}> =>{
        try {
            const emailExist = await authRepo.sellerFindByEmail(data.email);
            if(emailExist){
                return {status :StatusCode.Conflict as number, message:"Email already exist"}
            }
            const otp = await generateOtp()
            const sendMail = await sendOtpEmail(data.email, otp)

            if(sendMail){
                await otpSetSellerData(data, otp)
                return {status: StatusCode.OK as number, message:"Otp send successfully",data:{email:data.email, role:data.role}}
            } else {
                return { status: StatusCode.InternalServerError as number, message: "Failed to send OTP email" };
            }
        } catch (error) {
            console.log("Error registring seller in use-case",error);
            return{status :StatusCode.InternalServerError as number, message:'Internal server error'}
        }
    }


      verifySellerOtp = async(email:string, otp:string) :Promise<{status:number, message:string, data?:AuthSellerResponse }> => {
        try {
            console.log("ds",email);
            
            const storedOtp = await getOtp(email)
            console.log("seller otpp",storedOtp);
            
            if(!storedOtp){
                return{status:StatusCode.NotFound as number, message:"Otp not found"}
            }
            
            if(storedOtp==otp){
                const userData = await getSellerData(email);
            if(!userData){
                return{status:StatusCode.NotFound as number, message:"No data found"}
            }
            const saveUser = await authRepo.saveSeller(userData);
            if(!saveUser){
                return{status:StatusCode.InternalServerError as number, message:"Seller data not saved, server error"}
            }else{
                const token = await createToken(saveUser._id, saveUser.role);
                return{status:StatusCode.Created as number, message:"Seller created", data:{user:saveUser,token}}
            }
            }else{
                return{status:StatusCode.Forbidden as number, message:"Entered otp is wrong"}
            }
            
        } catch (error) {
            console.log("Error verifying otp",error);
            return{status: StatusCode.InternalServerError as number, message:"Internal server error"}
        }
    }


    loginSeller = async(email:string, password:string): Promise<{status:number, message:string, data?:AuthSellerResponse}> =>{
        try {
            const user = await authRepo.sellerFindByEmail(email)
            if(!user){
                return{status:StatusCode.NotFound as number, message:"Seller not found"}
            }
            if(user.isStatus==false){
                return{status:StatusCode.OK as number, message:"This accound is blocked"}
            }
            const isPasswordMatch = await comparePassword(password, user.password)
            if(isPasswordMatch){
                const token = await createToken(user._id, user.role)
                return{status:StatusCode.OK as number, message:"Seller logined", data:{user:user, token}}
            }
            return{status:StatusCode.Forbidden as number, message:"Password not match"}
        } catch (error) {
            console.log("Error while logging in useCase",error);
            return{status:StatusCode.InternalServerError as number, message:"Error login, Internal server error"}
        }
    }
}