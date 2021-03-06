const express = require("express");
const Scan = require("../../models/scan");
const Upload = require("../../models/upload");
const Wifi = require("../../models/wifi");

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

            if (req.body.token === "Jt(I9}SFd~|.}c^ZN?(4y8m?aI0~-b") { //todo remove this for release
                await Scan.collection.insertMany(req.body.scans)
                if (req.body.wifis?.length > 0) {

                    updateWifiLocations(req.body.wifis);

                }
                await Upload.collection.insertOne({ timestamp: new Date() });
                res.status(200).send({
                    message: "success",
                });
                return;
            }

            jwt.verify(req.body?.token, process.env.TOKEN_KEY, async (err, data) => {
                if (err)
                    throw err

                await Scan.collection.insertMany(req.body.scans)
                if (req.body.wifis?.length > 0) {

                    updateWifiLocations(req.body.wifis);

                }
                await Upload.collection.insertOne({ timestamp: new Date() });
                res.status(200).send({
                    message: "success",
                });
            })


        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateWifiLocations = async (wifis) => {
    const bssids = wifis.map(wifi => wifi.bssid);

    const matches = await Wifi.find({ bssid: { $in: bssids } }).lean();
    const matchesBssids = matches.map(match => match.bssid);
    const newWifis = wifis.filter(wifi => !matchesBssids.includes(wifi.bssid))
    const updatedWifis = newWifis;
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const original = wifis.find(wifi => wifi.bssid === match.bssid);
        if (original) {
            const averageCoords = averageGeolocation([match, original]);
            match.lat = averageCoords.lat;
            match.lng = averageCoords.lng;
            updatedWifis.push(match)
        }
    }

    await Wifi.bulkWrite(
        updatedWifis.map((wifi) => {
            return {
                updateOne: {
                    filter: { bssid: wifi.bssid },
                    update: { $set: { lat: wifi.lat, lng: wifi.lng } },
                    upsert: true
                }
            }
        }

        )
    )
}
// https://gist.github.com/tlhunter/0ea604b77775b3e7d7d25ea0f70a23eb
function averageGeolocation(wifis) {
    if (wifis.length === 1) {
        return wifis[0];
    }

    let x = 0.0;
    let y = 0.0;
    let z = 0.0;

    for (let coord of wifis) {
        let latitude = coord.lat * Math.PI / 180;
        let longitude = coord.lng * Math.PI / 180;

        x += Math.cos(latitude) * Math.cos(longitude);
        y += Math.cos(latitude) * Math.sin(longitude);
        z += Math.sin(latitude);
    }

    let total = wifis.length;

    x = x / total;
    y = y / total;
    z = z / total;

    let centralLongitude = Math.atan2(y, x);
    let centralSquareRoot = Math.sqrt(x * x + y * y);
    let centralLatitude = Math.atan2(z, centralSquareRoot);

    return {
        lat: centralLatitude * 180 / Math.PI,
        lng: centralLongitude * 180 / Math.PI
    };
}

module.exports = { getInsertRoutes };
