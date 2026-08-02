import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function query<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    return pool.query<T>(text, params);
}


export interface UrlRow {
    id: number;
    slug: string;
    original_url: string;
    clicks: number;
    expires_at: Date | null;
    created_at: Date;
}