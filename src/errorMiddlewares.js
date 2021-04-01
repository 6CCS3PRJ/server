/**
 * Middleware to handle errors thrown by endpoints. Set to catch everything and
 * respond with status code 500.
 *
 * This module was initially written for a separate project by Luka Kralj and I
 * and has been modified for the purposes of this project.
 * @author Danilo Del Busso <danilo.delbusso1@gmail.com>
 * @author Luka Kralj <luka.kralj.cs@gmail.com>
 */
const { logger } = require("./logger")

// Should be used last as the last resort.
const genericErrorMiddleware = async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  logger.error(err)
  res.status(500).send("Oops... Internal server error.")
}

module.exports = {
  genericErrorMiddleware
}
