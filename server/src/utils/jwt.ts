import jwt from 'jsonwebtoken';
import config from '../config';
import { Types } from 'mongoose';

export const createToken = (userId:Types.ObjectId, role:string) => { 
    const token = jwt.sign(
      { userId: userId.toString(), role }, 
      config.SECRET_KEY, 
      { expiresIn: '1h' }
    );
    return token;
  };

