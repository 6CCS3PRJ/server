const express = require("express");
const Scan = require("../../models/scan");
const Upload = require("../../models/upload");

function getGetRoutes() {
    const router = express.Router();
    router.get("/", scans);
    router.get("/uploadStats", uploadStats);
    router.post("/matchBSSID", matchBSSID);
    return router;
}

/**
 * Get stats about uploaded scans
 * @route GET /scans/get/uploadStats
 * @group uploads - Operations about uploads
 * @security JWT
 */
async function uploadStats(req, res, next) {
    const DAYS_FILTER = 14;
    try {
        const uploads = await Upload.find({
            timestamp: {
                $gte: new Date(new Date().getTime() - DAYS_FILTER * 24 * 60 * 60 * 1000),
            },
        }).lean();

        const dateMap = {};

        for (let i = 0; i < uploads.length; i++) {
            const scan = uploads[i];
            const timestamp = new Date(scan.timestamp);
            timestamp.setHours(0, 0, 0, 0);
            if (dateMap[timestamp]) {
                dateMap[timestamp]++;
            } else {
                dateMap[timestamp] = 1;
            }
        }

        const result = [];

        Object.keys(dateMap).forEach((timestamp) => {
            const amount = dateMap[timestamp];
            const date = new Date(timestamp);
            result.push({ date, amount });
        });

        result.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
