import winston from "winston";

const { combine, timestamp, json, colorize, printf } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
    }),
  ],
});

export const apiLogger = (req: Request, res: Response, duration: number) => {
  logger.info("API Request", {
    method: req.method,
    url: req.url,
    duration: `${duration}ms`,
  });
};
