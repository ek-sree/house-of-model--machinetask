// src/types/express/index.d.ts

import { Types } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: Types.ObjectId;
                role: string;
            };
        }
    }
}
