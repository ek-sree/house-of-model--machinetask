import express from 'express';
import AuthController from '../controller/authController';
import UserController from '../controller/userController';


const userRouter = express.Router()
const authController = new AuthController()
const userController = new UserController()

userRouter.post('/register', authController.register)
userRouter.post('/otp', authController.verifyOtp)
userRouter.post('/login', authController.login)
userRouter.post('/logout', authController.logout)

userRouter.get('/getAllProducts', userController.fetchProducts);
userRouter.get('/getSingleProduct/:productId', userController.fetchSingleProduct);
userRouter.get('/getOfferUser', userController.fetchOffer);

export {userRouter}