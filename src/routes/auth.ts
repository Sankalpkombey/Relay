import { Router, Request, Response, NextFunction } from 'express';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema';
import { loginUser, registerUser } from '../services/user.service';
import { authenticate } from '../middleware/auth';

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerUserSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
            return;
        }

        const user = await registerUser(parsed.data);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

authRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginUserSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
            return;
        }

        const { token, user } = await loginUser(parsed.data);
        res.json({ token, user });
    } catch (error) {
        next(error);
    }
});

authRouter.get("/me", authenticate, (req: Request, res: Response) => {
    res.json({ user: req.user });
});