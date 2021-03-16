const basicPino = require("pino");
const dateFormat = require("dateformat");
const fs = require("fs");

const expressDir = __dirname + `/expressLogs`;

const basicPinoConfig = {
    name: "Server logger",
    level: require("../config.json").pinoLogLevel || "info",
};

const isProduction = process.env.NODE_ENV === "production";

const expressPinoConfig = {
    name: "Express logger",
    level: require("../config.json").expressPinoLevel || "info",
    serializers: {
        req: (req) => {
            // Use original req object
            req = req.raw;

            if (req.url === "/api/misc/get/heartbeat") {
                // reduces clutter
                return undefined;
            }

            if (!isProduction) {
                // irrelevant in development
                return {
                    url: req.url,
                };
            }

            const data = {
                reqId: req.id,
                method: req.method,
                url: req.url,
                description: undefined,
                fromIP: req.ip,
                remotePort: undefined,
                remoteIPFamily: undefined,
                fromIPs: req.ips,
                body: req.body,
                params: req.params,
                hostname: req.hostname,
                xhr: req.xhr,

                host: req.headers["host"],
                userAgent: req.headers["user-agent"],
                origin: req.headers["origin"],
                acceptEncoding: req.headers["accept-encoding"],
                acceptLanguages: req.headers["accept-language"],
                referer: req.headers["referer"],
                authorisation: req.headers["authorization"],
            };

            // If authorisation header starts with "Bearer" than it's likely a valid
            // authorisation, truncate the token for security.
            // If authorisation is something else, it's likely that someone has tried to
            // hack us by guessing the authorisation format.
            if (
                data.authorisation &&
                data.authorisation.startsWith("Bearer") &&
                data.authorisation.length > 15
            ) {
                data.authorisation = `${data.authorisation.substring(
                    0,
                    15
                )}...<truncated for security>`;
            }

            data.remotePort =
                req.connection.remotePort ||
                req.socket.remotePort ||
                (req.connection.socket ? req.connection.socket.remotePort : undefined);

            data.remoteIPFamily =
                req.connection.remoteFamily ||
                req.socket.remoteFamily ||
                (req.connection.socket ? req.connection.socket.remoteFamily : undefined);

            if (!data.fromIP) {
                data.fromIP =
                    req.headers["x-forwarded-for"] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    (req.connection.socket ? req.connection.socket.remoteAddress : undefined);
            }

            if (req.method === "OPTIONS") {
                data.description = `CORS preflight request`;
            }

            return data;
        },

        res: (res) => {
            const req = res.raw.req;
            const data = {
                code: res.statusCode,
                statusMessage: res.raw?.statusMessage,
                message: res.raw?.message,
            };
            return data;
        },
    },
};

let logger, expressLogger;

logger = basicPino(basicPinoConfig);

if (isProduction) {
    if (!fs.existsSync(expressDir)) {
        fs.mkdirSync(expressDir);
    }

    const expressLogFile =
        expressDir + `/pino_express_${dateFormat(Date.now(), "yyyymmdd_HHMMss_l")}.log`;

    expressLogger = require("express-pino-logger")(
        expressPinoConfig,
        basicPino.destination(expressLogFile)
    );

    logger.info(`Corresponding express logger is outputting in: ${expressLogFile}.`);
} else {
    expressLogger = require("express-pino-logger")(expressPinoConfig);
}

module.exports = {
    logger,
    expressLogger,
};
