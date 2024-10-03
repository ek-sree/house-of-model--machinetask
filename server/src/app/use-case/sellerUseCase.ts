import { StatusCode } from "../../interface/enum";
import { IProduct } from "../../interface/productInterface";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../../services/cloudinary";
import sellerRepository from "../repository/sellerRepository";


const sellerRepo = new sellerRepository()

export default class SellerUseCase {
    createProduct = async (data: IProduct,images: Buffer[],companyLogo: Buffer): Promise<{ status: number; message: string; data?: IProduct }> => {
        try {
          const imageUrls = await Promise.all(
            images.map(async (imageBuffer) => {
              const uploadResponse = await uploadImageToCloudinary(imageBuffer);
              return uploadResponse.secure_url;
            })
          );
      
          const logoUploadResponse = await uploadImageToCloudinary(companyLogo);
          const companyLogoUrl = logoUploadResponse.secure_url;

          if(!imageUrls || !companyLogoUrl){
            return{status:StatusCode.NotAcceptable, message:"Cant store image right now error occured"}
          }
      
          const result = await sellerRepo.createProduct({ ...data, companyLogo: companyLogoUrl }, imageUrls);

          if (!result) {
            return { status: StatusCode.Conflict as number, message: 'Product not uploaded' };
          }
      
          return { status: StatusCode.Created as number, message: 'Product uploaded successfully', data: result.data };
        } catch (error) {
          console.log('Internal server Error product upload', error);
          return { status: StatusCode.InternalServerError as number, message: 'Internal server error' };
        }
      };
      

      editProduct= async(productId: string,data: Partial<IProduct>,files?: {images?: Express.Multer.File[];companyLogo?: Express.Multer.File[]}):Promise<{status:number, message:string, data?:IProduct}>=>{
        try {
            const existingProduct = await sellerRepo.getProductById(productId);
      if (!existingProduct) {
        return { status: StatusCode.NotFound, message: "Product not found" };
      }
      let updatedImageUrls = existingProduct.image || [];
      if (files && files.images) {
        const imagesToDelete = data.imagesToDelete ? JSON.parse(data.imagesToDelete as string) : [];
        const imagesToKeep = updatedImageUrls.filter((url: string) => !imagesToDelete.includes(url));
        
        await Promise.all(imagesToDelete.map((url:string) => deleteImageFromCloudinary(url)));

        const newImageUrls = await Promise.all(
          files.images.map(file => uploadImageToCloudinary(file.buffer))
        );

        updatedImageUrls = [...imagesToKeep, ...newImageUrls.map(response => response.secure_url)];
      }

      let updatedCompanyLogo = existingProduct.companyLogo;
      if (files && files.companyLogo && files.companyLogo.length > 0) {
        if (existingProduct.companyLogo) {
          await deleteImageFromCloudinary(existingProduct.companyLogo);
        }
        const logoUploadResponse = await uploadImageToCloudinary(files.companyLogo[0].buffer);
        updatedCompanyLogo = logoUploadResponse.secure_url;
      }

      const updatedProductData:  Partial<IProduct> = {
        ...data,
        image: updatedImageUrls,
        companyLogo: updatedCompanyLogo,
      };

      const result = await sellerRepo.updateProduct(productId, updatedProductData);

      if (!result) {
        return { status: StatusCode.Conflict, message: 'Product not updated' };
      }

      return { status: StatusCode.OK, message: 'Product updated successfully', data: result.data };
        } catch (error) {
            console.log('Internal server Error product upload', error);
            return { status: StatusCode.InternalServerError as number, message: 'Internal server error' };
          }
      }


      getProducts = async(sellerId: string) : Promise<{status:number, message:string, data?:IProduct[]}> =>{
        try {
            const result = await sellerRepo.findProduct(sellerId);
            if(!result){
                return{status:StatusCode.NotFound as number, message:"No product found"}
            }
            return{status:StatusCode.OK as number, message:"Products found", data:result.data}
        } catch (error) {
          console.log('Internal server Error product upload', error);
          return { status: StatusCode.InternalServerError as number, message: 'Internal server error' };
        }
      }

      blockProduct = async(productId:string): Promise<{status:number, message:string}> =>{
        try {
            const result = await sellerRepo.updateProductStatus(productId);
            return{status:result?.status as number, message:result?.message as string}
        } catch (error) {
            console.log('Internal server Error product upload', error);
          return { status: StatusCode.InternalServerError as number, message: 'Internal server error' };
        }
      }
}
