import winston, { transports } from "winston";
import path from "path";
import fs from "fs";

const logDir = path.resolve("logs/app");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level}] ${message}`;
        })
    ),

    transports: [

        new transports.Console(),

        new winston.transports.File({
            filename: path.join(logDir, "combined.log")
        }),

        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error"
        })

    ]

});