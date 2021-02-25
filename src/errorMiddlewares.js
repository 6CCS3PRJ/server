const { logger } = require("./logger");

// Should be used last as the last resort.
const genericErrorMiddleware = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    logger.error(err);
    res.status(500).send("Oops... Internal server error.");
};

module.exports = {
    genericErrorMiddleware
}
