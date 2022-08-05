import fileUpload from "express-fileupload"
import dotenv from "dotenv";
import authController from "./06-controllers/user-controller"
dotenv.config(); // Read .env file into process.env
import socketLogic from "./05-logic/socket-logic";


import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./01-utils/config";
import errorsHandler from "./02-middleware/errors-handler";
import ErrorModel from "./03-models/error-model";
import controller from "./06-controllers/controllers";
import expressRateLimit from "express-rate-limit";
import sanitize from "./02-middleware/sanitize";
import path from "path";


const server = express();
server.use("/api/", expressRateLimit({ // Note: without the "/api/", the css and js won't work, probably because of base url change.
    windowMs: 1000, // 1 second.
    max: 10, // limit each IP to 1 request per windowMs.
	message: "Are You a Hacker?" // Custom message instead of default one.
}));
server.use(fileUpload());


if (config.isDevelopment) server.use(cors());
server.use(express.json());
const frontendDir = path.join(__dirname, "07-frontend");
server.use(express.static(frontendDir));
server.use("/api", controller);
server.use("/api",authController);
server.use(sanitize);

server.use("*", (request: Request, response: Response, next: NextFunction) => {
    if(config.isDevelopment) {
    next(new ErrorModel(404, "Route not found."));
    }
    else {
        const indexHtmlFile = path.join(__dirname, "07-frontend", "index.html");
        response.sendFile(indexHtmlFile);
    }
});

server.use(errorsHandler);

const httpServer =  server.listen(process.env.PORT, () => console.log("Listening..."));

socketLogic(httpServer);
