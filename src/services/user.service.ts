import { query, UserRow } from "../db/pool";
import { RegisterUserInput } from "../schemas/user.schema";
import { EmailTakenError } from "../errors/AppError";
import bcrypt from "bcrypt";


export async function registerUser(input: RegisterUserInput): Promise<Omit<UserRow, "password_hash">> {
    const existing = await query<UserRow>("SELECT id FROM users WHERE email = $1", [input.email]);
    if (existing.rows.length > 0) {
        throw new EmailTakenError(input.email);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const result = await query<UserRow>(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
        [input.email, hashedPassword]
    );

    const row = result.rows[0];
    if (!row) {
        throw new Error("Insert failed unexpectedly");
    }

    const { password_hash, ...safeUser } = row;
    return safeUser;
}
