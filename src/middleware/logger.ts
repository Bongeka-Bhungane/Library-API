import { log } from "console";
import {Request, Response, NextFunction} from "express";

export const loggerMiddleware = (req: Request, res:Response, next: NextFunction) => {
    console.log(`[${new Date().toString()}] ${req.method} ${req.url}`)
    next()
}