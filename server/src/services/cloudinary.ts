import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "./cloudinaryConfig";

export const uploadImageToCloudinary = async (fileBuffer: Buffer): Promise<UploadApiResponse> => {
  try {
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'houseOfModel',
          resource_type: "image"
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error); 
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Unknown error occurred while uploading to Cloudinary')); 
          }
        }
      );
      stream.end(fileBuffer); 
    });

    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
    try {
      const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  };