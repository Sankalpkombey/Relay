export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = "AppError";
    }
}

export class SlugTakenError extends AppError {
    constructor(public slug: string) {
        super(409, `Slug '${slug}' is already taken`);
        this.name = "SlugTakenError";
    }
}

export class UrlNotFoundError extends AppError {
    constructor(public slug: string) {
        super(404, `No URL found for slug '${slug}'`);
        this.name = "UrlNotFoundError";
    }
}

export class UrlExpiredError extends AppError {
    constructor(public slug: string) {
        super(410, `URL for slug'${slug}' has expired`);
        this.name = "UrlExpiredError";
    }
}

export class EmailTakenError extends AppError {
    constructor(public email: string) {
        super(409, `Email '${email}' is already taken`);
        this.name = "EmailTakenError";
    }
}

export class InvalidCredentialsError extends AppError {
    constructor() {
        super(401, "Invalid email or password");
        this.name = "InvalidCredentialsError";
    }
}