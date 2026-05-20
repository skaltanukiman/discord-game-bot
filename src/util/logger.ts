import winston, { transports } from "winston";
import path from "path";
import fs from "fs";
import { formatInTimeZone } from "date-fns-tz";

const logDir = path.resolve("logs/app");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(
        winston.format.errors({ stack: true }),

        winston.format.timestamp({
            format: () =>
                formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd HH:mm:ss")
        }),

        winston.format.printf(({ timestamp, level, message, stack }) => {
            return stack ?
                    `[${timestamp}] [${level}] ${message}\n${stack}` :
                    `[${timestamp}] [${level}] ${message}`;
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