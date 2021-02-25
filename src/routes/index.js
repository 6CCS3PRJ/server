const express = require("express");
const { getScanRoutes } = require("./scans");
const { getWifiRoutes } = require("./wifis");

function getRoutes() {
    const router = express.Router();
    router.use("/scans", getScanRoutes());
    router.use("/wifis", getWifiRoutes());
    return router;
}

/**
 * Swagger type definitions
 */
/**
 * @typedef Error
 * @property {[integer]} code.required
 */
/**
 * @typedef Response
 * @property {[integer]} code.required
 */
/**
 * @typedef BasicRow
 * @property {string} name.required
 * @property {integer} id.required
 */

module.exports = { getRoutes };
