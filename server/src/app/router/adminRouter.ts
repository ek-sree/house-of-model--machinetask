import express from 'express';
import AuthController from '../controller/authController';
import AdminController from '../controller/adminController';
import { authenticateToken } from '../../middlewares/authMiddleware';
import { authorizeRole } from '../../middlewares/authirizeRole';
import { uploadSingle } from '../../utils/multer';

const adminRouter = express.Router()

const authController = new AuthController()
const adminController = new AdminController()


adminRouter.post('/login', authController.login)
adminRouter.post('/logout', authController.logout)


adminRouter.get('/fetchusers',authenticateToken,authorizeRole('admin'), adminController.fetchUsers)
adminRouter.get('/fetchsellers',authenticateToken,authorizeRole('admin'), adminController.fetchSellers)
adminRouter.get('/searchuser',authenticateToken,authorizeRole('admin'), adminController.searchUser);
adminRouter.get('/searchseller',authenticateToken,authorizeRole('admin'), adminController.searchSeller)
adminRouter.put('/blockuser/:userId',authenticateToken,authorizeRole('admin'), adminController.blockUser);
adminRouter.put('/blockseller/:userId',authenticateToken,authorizeRole('admin'), adminController.blockSeller);

adminRouter.post('/addcategory',authenticateToken,authorizeRole('admin'), adminController.addCategory);
adminRouter.get('/fetchcategory',authenticateToken,authorizeRole('admin'), adminController.getCategory)
adminRouter.put('/blockcategory/:categoryId',authenticateToken,authorizeRole('admin'), adminController.blockCategory)
adminRouter.post('/addOffer', authenticateToken, authorizeRole('admin'),uploadSingle, adminController.addOffer)
adminRouter.get('/getOffer', authenticateToken, authorizeRole('admin'), adminController.fetchOffer)
adminRouter.put('/blockOffer/:offerId', authenticateToken, authorizeRole('admin'), adminController.blockOffer)


export {adminRouter}