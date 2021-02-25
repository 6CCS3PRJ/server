const express = require("express");
const Scan = require("../../models/scan");

function getGetRoutes() {
    const router = express.Router();
    router.get("/", scans);
    router.post("/matchBSSID", matchBSSID);
    return router;
}

/**
 * Get list of all scans
 * @route GET /scans/get/
 * @group scans - Operations about scans
 * @returns {Response.model} 200 - A stream of scans data
 * @security JWT
 */
async function scans(req, res, next) {
    try {
        const stream = Scan.find().lean().cursor({ transform: JSON.stringify });
        stream.on("data", (doc) => {
            res.write(doc);
        });
        stream.on("close", () => {
            res.end();
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get list of all scans that match the given array of BSSIDs
 * @route POST /scans/get/matchBSSID
 * @group scans - Operations about scans
 * @param {Array} BSSIDs - array of BSSID string to use to retrieve matches in the scans collection
 * @returns {Response.model} 200 - Success
 * @returns {Error.model} 403 - Unauthorized * @security JWT
 */
async function matchBSSID(req, res, next) {
    try {
        const scans = await Scan.find({ b: { $in: req.body.BSSIDs } });
        res.status(200).send(scans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getGetRoutes };
