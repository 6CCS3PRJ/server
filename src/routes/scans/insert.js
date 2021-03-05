const express = require("express");
const Scan = require("../../models/scan");
const util = require("util");
const jwt = require("jsonwebtoken");
function getInsertRoutes() {
    const router = express.Router();
    router.post("/new", newScans);
    return router;
}

/**
 * Insert an array of scans into the scans collection
 * @route POST /scans/new
 * @group scans - Operations about scans
 * @param {boolean} d - true if the upload is a dummy
 * @param {array} scans - array of scan objects to be inserted directly into scans collection
 * @returns {Response.model} 200 - Success
 * @returns {Error.model} 403 - Unauthorized
 * @security JWT
 */
const newScans = async (req, res, next) => {
    try {
        if (req.body.d && req.body.d == true) {
            //dummy upload and dummy response
            res.status(201).send([
                {
                    message: "success",
                },
            ]);
        } else {
            jwt.verify(req.body.token, process.env.TOKEN_KEY, function (err) {
                if (err) {
                    res.status(401).send({ message: "error" });
                    return;
                }
                try {
                    //todo: remove dummy value from inserted data
                    Scan.collection.insertMany(req.body.scans, (err, data) => {
                        if (err) {
                            throw err;
                        } else {
                            res.status(200).send({
                                message: "success",
                            });
                        }
                    });
                } catch (error) {
                    res.status(500).send({ error: error.message });
                }
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getInsertRoutes };
