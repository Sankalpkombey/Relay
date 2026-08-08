import { Request, Response, NextFunction  } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET!;

interface MyJwtPayload  {
    userId: string;
    role: string;
}

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        next(new UnauthorizedError());
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        next(new UnauthorizedError());
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as unknown as MyJwtPayload;
        req.user = payload;
        next();
    } catch (error) {
        next(new UnauthorizedError());
    }
}