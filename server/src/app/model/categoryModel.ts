import mongoose, { Document, Schema } from "mongoose";

export interface SellerInterface extends Document {
    categoryName:string;
    isStatus:boolean;
  }

const categorySchema: Schema<SellerInterface> = new Schema({
    categoryName: {
      type: String,
      required: true,
      trim: true,
      set: (name: string) => name.toUpperCase(),
    },
    isStatus:{
        type:Boolean,
        required: true,
        default:true
    }
  }, {
    timestamps: true,
  });
  
  const categoryModel = mongoose.model<SellerInterface>('Category', categorySchema);
  
  export default categoryModel;
  