import express from 'express';
import AuthController from '../controller/authController';
import SellerController from '../controller/sellerController';
import { upload } from '../../utils/multer';
import AdminController from '../controller/adminController';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { authorizeRole } from '../../middlewares/authirizeRole';

const sellerRouter = express.Router()
const authController = new AuthController()
const sellerController = new SellerController()
const adminController = new AdminController()


sellerRouter.post('/register', authController.registerSeller)
sellerRouter.post('/otp', authController.verifySellerOtp)
sellerRouter.post('/login', authController.loginSeller)
sellerRouter.post('/logout', authController.logout)

sellerRouter.get('/getCategory',authenticateToken,authorizeRole('seller') ,adminController.getCategory)
sellerRouter.post('/addproduct',authenticateToken,authorizeRole('seller'), upload, sellerController.addProduct )
sellerRouter.get('/getProducts',authenticateToken, authorizeRole('seller'), sellerController.getProduct)
sellerRouter.put('/blockProduct/:productId', authenticateToken, authorizeRole('seller'), sellerController.blockProduct)
sellerRouter.put('/editProduct/:productId', authenticateToken, authorizeRole('seller'),upload, sellerController.editProduct);

export {sellerRouter}