import { Request, Response, NextFunction } from "express";

export class Logger {
    // class-based middleware
    public log = (req: Request, res: Response, next: NextFunction) => {
        const now = new Date().toLocaleString();
        console.log(`[${now}] ${req.method} ${req.path}`);
        next();
    };
}
