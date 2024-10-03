import mongoose, { Document, Schema } from "mongoose";
export interface UserInterface extends Document {
    userName: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
    isAdmin: boolean;
    isStatus:boolean;
  }

const userSchema: Schema<UserInterface> = new Schema({
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
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\d{10}$/.test(v); 
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
      set: (v: string) => v.replace(/\D/g, ""),
    },
    role: {
      type: String,  
      required: true,
      default:'buyer'
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
  
  const userModel = mongoose.model<UserInterface>('User', userSchema);
  
  export default userModel;
  