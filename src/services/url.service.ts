import { randomBytes } from "crypto";
import { query, UrlRow } from "../db/pool";
import { CreateUrlInput } from "../schemas/url.schema";
import { SlugTakenError, UrlNotFoundError, UrlExpiredError } from "../errors/AppError";

// Slug generation helper
function generateSlug(): string {
    return randomBytes(4).toString("hex");
}

//  createShortUrl
export async function createShortUrl(input: CreateUrlInput): Promise<UrlRow> {
    const slug = input.customSlug ?? generateSlug();

    const existing = await query<UrlRow>("SELECT id FROM urls WHERE slug = $1", [slug]);
    if (existing.rows.length > 0) {
        throw new SlugTakenError(slug);
    }

    const result = await query<UrlRow>(
        "INSERT INTO urls (slug, original_url, expires_at) VALUES ($1, $2, $3) RETURNING *",
        [slug, input.originalUrl, input.expiresAt ?? null]
    );

    const row = result.rows[0];
    if (!row) {
        throw new Error("Insert failed unexpectedly");
    }

    return row;
}


// getUrlBySlug
export async function getUrlBySlug(slug: string): Promise<UrlRow> {
    const result = await query<UrlRow>("Select * FROM urls WHERE slug = $1", [slug]);
    const row = result.rows[0];

    if (!row) {
        throw new UrlNotFoundError(slug);
    }

    if (row.expires_at && row.expires_at < new Date()) {
        throw new UrlExpiredError(slug);
    }

    return row
}


// incrementClickCount
export async function incrementClicks(slug: string): Promise<void> {
    await query("UPDATE urls SET clicks = clicks + 1 WHERE slug = $1", [slug]);
}