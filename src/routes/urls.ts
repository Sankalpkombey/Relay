import { Router, Request, Response, NextFunction } from 'express';
import { createUrlSchema, redirectParamsSchema } from '../schemas/url.schema';
import { createShortUrl, getUrlBySlug, incrementClicks } from '../services/url.service';

export const urlRouter = Router();

urlRouter.post("/urls", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = createUrlSchema.safeParse(req.body);

        if(!parsed.success){
            res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
            return;
        }

        const url = await createShortUrl(parsed.data);
        res.status(201).json(url);
    } catch (error) {
        next(error);
    }
});


urlRouter.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = redirectParamsSchema.safeParse(req.params);

        if (!parsed.success) {
            res.status(400).json({error: "Invalid slug"});
            return;
        }

        const url = await getUrlBySlug(parsed.data.slug);
        await incrementClicks(parsed.data.slug);
        res.redirect(url.original_url);
    } catch (error) {
        next(error);
    }
});