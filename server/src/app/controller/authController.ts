import { Request, Response } from "express";
import { StatusCode } from "../../interface/enum";
import AuthUseCase from "../use-case/authUseCase";

export default class AuthController {
    private authUseCase: AuthUseCase;

    constructor() {
        this.authUseCase = new AuthUseCase();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData = req.body;
            console.log("Data", userData);
            
            const registerResponse = await this.authUseCase.register(userData);
            if (registerResponse.status === StatusCode.OK) {
                res.cookie('userEmail', registerResponse.data?.email, { 
                    httpOnly: true, 
                    secure: true,
                    maxAge: 3600000
                });
                res.cookie('role', registerResponse.data?.role, { 
                    httpOnly: false, 
                    secure: true,
                    maxAge: 3600000 
                });
            }
            res.status(registerResponse.status).json({ message: registerResponse.message });
        } catch (error) {
            console.log("Error in register", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
        }
    }

    verifyOtp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { otp } = req.body;
            const email = req.cookies.userEmail;
            if (!email) {
                res.status(StatusCode.NotFound).json({ message: "Email not found" });
                return;
            }
            const verifyOtpResponse = await this.authUseCase.verifyOtp(email, otp);
            res.cookie('token',verifyOtpResponse.data?.token,{httpOnly:true,secure:true,maxAge:3600000})
            res.cookie('role', verifyOtpResponse.data?.user.role,{httpOnly:true, secure:true, maxAge:3600000})
            res.status(verifyOtpResponse.status).json({ verifyOtpResponse });
        } catch (error) {
            console.log("Error in otp verifying", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
        }
    }

    login = async(req:Request, res:Response): Promise<void> =>{
        try {
            const {email, password } = req.body
            const userData = await this.authUseCase.login(email,password)
            res.cookie('token', userData.data?.token,{httpOnly:true, secure:true, maxAge:3600000})
            res.cookie('role', userData.data?.user.role,{httpOnly:true, secure:true, maxAge:3600000})
            res.status(userData.status).json({message:userData.message, data:userData.data})
        } catch (error) {
            console.log("Error occured while login",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }

    logout = async(req:Request, res:Response): Promise<void> =>{
        try {
            res.clearCookie('token', { httpOnly: true, secure: true });
            res.clearCookie('role', { httpOnly: true, secure: true });
            res.status(StatusCode.OK).json({message:"Logout successfull"})
        } catch (error) {
            console.log("Error occured while logout",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }


    // Seller part---->

    registerSeller = async(req:Request, res:Response): Promise<void> =>{
        try {
            const sellerData = req.body;
            console.log("Seller data",sellerData);
            const registerResponse = await this.authUseCase.regesterSeller(sellerData);
            if (registerResponse.status === StatusCode.OK) {
                res.cookie('sellerEmail', registerResponse.data?.email, { 
                    httpOnly: true, 
                    secure: true,
                    maxAge: 3600000
                });
                res.cookie('role', registerResponse.data?.role, { 
                    httpOnly: false, 
                    secure: true,
                    maxAge: 3600000 
                });
            }
            res.status(registerResponse.status).json({ message: registerResponse.message });
            
        } catch (error) {
            console.log("Error in register seller", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
        }
    }

    verifySellerOtp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { otp } = req.body;
            const email = req.cookies.sellerEmail;
            console.log("contrrrr",email);
            
            if (!email) {
                res.status(StatusCode.NotFound).json({ message: "Email not found" });
                return;
            }
            const verifyOtpResponse = await this.authUseCase.verifySellerOtp(email, otp);
            res.status(verifyOtpResponse.status).json({ verifyOtpResponse });
        } catch (error) {
            console.log("Error in otp verifying", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
        }
    }

    loginSeller = async(req:Request, res:Response): Promise<void> =>{
        try {
            const {email, password } = req.body
            const userData = await this.authUseCase.loginSeller(email,password)
            res.status(userData.status).json({message:userData.message, data:userData.data})
        } catch (error) {
            console.log("Error occured while login",error);
            res.status(StatusCode.InternalServerError).json({message:"Internal server error"})
        }
    }
}