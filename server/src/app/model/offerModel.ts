import mongoose, { Document, Schema } from "mongoose";
export interface OfferInterface extends Document {
    name:string;
    image:string
    searchQuery:string;
    category: string;
    isStatus:boolean;
  }

const OfferSchema: Schema<OfferInterface> = new Schema({
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
    },
    category: { 
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
  
  const offerModel = mongoose.model<OfferInterface>('Offer', OfferSchema);
  
  export default offerModel;
  