import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config';

interface DecodedToken {
    userId: string;
    role: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided, please login' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.SECRET_KEY) as DecodedToken;

        req.user = {
            userId: new Types.ObjectId(decoded.userId),
            role: decoded.role,
        };

        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};