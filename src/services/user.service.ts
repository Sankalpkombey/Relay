import { query, UserRow } from "../db/pool";
import { RegisterUserInput, LoginUserInput } from "../schemas/user.schema";
import { EmailTakenError, InvalidCredentialsError } from "../errors/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;


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

export async function loginUser(input: LoginUserInput): Promise<{ token: string; user: Omit<UserRow, "password_hash"> }> {
    const result = await query<UserRow>("SELECT * FROM users WHERE email = $1", [input.email]);
    const user = result.rows[0];
    if (!user) {
        throw new InvalidCredentialsError();
    }

    const isMatch = await bcrypt.compare(input.password, user.password_hash);
    if (!isMatch) {
        throw new InvalidCredentialsError();
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET!,
        { expiresIn: "15m" }
    )

    const { password_hash, ...safeUser } = user;
    return { token, user: safeUser };
}
