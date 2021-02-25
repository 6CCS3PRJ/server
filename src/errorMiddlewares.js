const { logger } = require("./logger");

// Should be used last as the last resort.
const genericErrorMiddleware = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    logger.error(err);
    res.status(500).send("Oops... Internal server error.");
};

const authErrorMiddleware = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err.name === "UnauthorizedError" || err.message === "UnauthorizedError") {
        res.status(401).send("Invalid or missing authentication token.");
    } else {
        next(err);
    }
};

module.exports = {
    genericErrorMiddleware,
    authErrorMiddleware,
};
