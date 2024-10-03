import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || req.user.role !== requiredRole) {
            res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
            return;
        }
        next();
    };
};