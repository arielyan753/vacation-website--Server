import { Request, Response, NextFunction } from "express";
import stripTags from "striptags";

function sanitize(request: Request, response: Response, next: NextFunction): void {
    for(const prop in request.body) {
        if(typeof request.body[prop] === "string") {

            // Prevent XSS Attack:
            request.body[prop] = stripTags(request.body[prop]);
        }
    }
}

export default sanitize;
