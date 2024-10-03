import mongoose, { Document, Schema } from "mongoose";
export interface ProductInterface extends Document {
    productName:string;
    productShorts:string;
    productPrice:number;
    productDescription:string;
    productSpecifications:string;
    image?:string[]
    companyLogo:string;
    category: mongoose.Types.ObjectId;
    sellerId: string;
    productStock:number;
    isStatus:boolean;
  }

const ProductSchema: Schema<ProductInterface> = new Schema({
    productName: {
      type: String,
      required: true,
    },
    productShorts: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productStock:{
        type: Number,
        required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productSpecifications: {
      type: String,  
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    companyLogo:{
        type:String,
        required:true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true, 
    },
    sellerId: {
        type: String,
        required: true,
    },
    isStatus:{
        type:Boolean,
        default:true
    }
  }, {
    timestamps: true,
  });
  
  const productModel = mongoose.model<ProductInterface>('Product', ProductSchema);
  
  export default productModel;
  