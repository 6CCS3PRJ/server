const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");

const { logger, expressLogger } = require("./logger");
logger.info("===== STARTING MAIN SERVER =====");

const { getRoutes } = require("./routes");
const app = express();
const cli = require("./cli");
const compression = require("compression");

let expressSwagger;
if (process.env.NODE_ENV !== "production") {
    expressSwagger = require("express-swagger-generator")(app);
}

// Middleware-s
const cors = require("cors");
const helmet = require("helmet");
const { genericErrorMiddleware } = require("./errorMiddlewares");
const rateLimiter = require("express-rate-limit")({
    windowMs: 1000,
    max: 50,
});

function startServer({ port = process.env.PORT || 5000 } = {}) {

    if (process.env.NODE_ENV !== "production") {
        initialiseSwagger();
    }
    
    app.use(rateLimiter);

    app.use(helmet());

    const clientOrigin =
        process.env.NODE_ENV === "production"
            ? process.env.CLIENT_ORIGIN_URL_PRODUCTION
            : process.env.CLIENT_ORIGIN_URL;

    app.use(cors()); // Enable cors for all origins, adds the necessary cors headers
    // Apply stricter cors rules for non-extension endpoints
    app.use(
        /(^(?!(\/api\/extension))|\/api\/extension\/get\/extensionToken).*/,
        cors({
            credentials: true, // This is important. Is it?
            origin: [clientOrigin],
        })
    );

    // Used by Load Balancer to check if the instance is up and running (will be unauthenticated HTTP request)
    app.get("/healthELB", (req, res, next) => {
        res.status(200).send("OK");
    });

    app.use(expressLogger);

    app.use(
        compression({
            //compress all payloads unless specified
            filter: (req, res) => {
                if (req.headers["x-no-compression"]) {
                    return false;
                }
                return compression.filter(req, res);
            },
        })
    );

    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ extended: true, limit: "100mb" }));



    // Prevents 304 responses / disables cache control
    app.disable("etag");

    app.use("/api/v1/", getRoutes());

    app.use("*", (req, res, next) => {
        res.status(404).send("404 - Nothing to see here. Go away.");
    });

    // Connect to database
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on("open", () => logger.info("Connected database"));

    // Must be last
    app.use(genericErrorMiddleware);

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            if (process.env.NODE_ENV === "production") {
                // don't send in dev because server does not have a parent process
                process.send("ready"); // notify pm2
            }
            logger.info(`Listening on port ${server.address().port}`);

            // this block of code turns `server.close` into a promise API
            const originalClose = server.close.bind(server);
            server.close = () => {
                return new Promise((resolveClose) => {
                    originalClose(resolveClose);
                });
            };

            // this ensures that we properly close the server when the program exists
            cli.registerCommand("stop", async () => {
                logger.info("Stopping server...");
                await server.close();
                logger.info("Server stopped.");
            });

            // resolve the whole promise with the express server
            resolve(server);
        });
    });
}

function initialiseSwagger() {
    let options = require("./swagger").options;
    expressSwagger(options);
}

process.on("uncaughtException", (err, origin) => {
    logger.error(`Uncaught Exception: origin:${origin}, error: ${err}, trace: ${err.stack}`);
    logger.warn(
        `Server may be unstable after an uncaught exception. Please restart server ` +
        `by typing: 'stop', 'exit', and then 'npm start'.`
    );
});

process.on("exit", (code) => {
    logger.info(`Exiting with code ${code}...`);
    console.log("\nPress Ctrl+C if using nodemon.");
});

module.exports = { startServer };
