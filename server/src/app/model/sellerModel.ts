import mongoose, { Document, Schema } from "mongoose";
export interface SellerInterface extends Document {
    userName: string;
    email: string;
    password: string;
    role: string;
    isAdmin: boolean;
    isStatus:boolean;
  }

const userSchema: Schema<SellerInterface> = new Schema({
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,  
      required: true,
      default:'seller'
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isStatus:{
      type: Boolean,
      reqired:true,
      default:true
    }
  }, {
    timestamps: true,
  });
  
  const sellerModel = mongoose.model<SellerInterface>('Seller', userSchema);
  
  export default sellerModel;
  