import { NextFunction, Request, Response } from 'express';

class ApiError extends Error {
    constructor(public statusCode: number, public message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

const apiErrorMiddleware = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.name === "CastError") err.message = "Invalid ID";

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}

export { ApiError, apiErrorMiddleware }