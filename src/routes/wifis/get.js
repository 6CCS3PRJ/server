const express = require("express");
const Wifi = require("../../models/wifi");
const Scan = require("../../models/scan");
const Feature = require("../../models/feature");
const d3 = require("d3");
const axios = require("axios").default;
const { feature } = require("topojson-client");

function getGetRoutes() {
    const router = express.Router();
    router.get("/reloadFeatureCache", reloadFeatureCache);
    router.get("/features", features);
    return router;
}

/**
 * Reload the cached features by computing number of hotspots per GEOJson feature
 * @route GET /wifis/get/reloadFeatureCache
 * @group wifis - Operations about hotspots
 * @returns {Response.model} 200 - an array of the newly cached features
 */
async function reloadFeatureCache(req, res, next) {
    try {
        //todo: remove limit
        let accessPoints = await Wifi.find().limit(2000).lean(); //todo: remove limit
        accessPoints = accessPoints.map(ap => {
            ap.bssid = ap.bssid.toLowerCase().split('')
                .reduce((a, e, i) => a + e + (i % 2 === 1 && i !== ap.bssid.length - 1 ? ':' : ''), '')//make AABBCCDDEE in aa:bb:cc:dd:ee
            return ap;
        }
        )
        const bssids = accessPoints.map(ap => ap.bssid)
        const scanResult = await Scan.find({ b: { $in: bssids } }).lean()

        const scans = []

        for (let i = 0; i < scanResult.length; i++) {
            const scan = scanResult[i];
            const accessPointResult = accessPoints.filter(ap => ap.bssid === scan.b)
            if (accessPointResult.length !== 1) {
                continue;
            }
            let accessPoint = accessPointResult[0];
            if (accessPoint) {
                scan.lat = accessPoint.lat;
                scan.lng = accessPoint.lng;
                scans.push(scan);
            }
        }

        const geoJson = await axios.get(process.env.GEOJSON_URL);
        const features = getFeatures(geoJson.data);
        const cliProgress = require("cli-progress");
        const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar1.start(scans.length, 0);

        for (let i = 0; i < scans.length; i++) {
            let scan = scans[i];
            bar1.increment();
            if (!scan) {
                continue;
            }
            for (let j = features.length - 1; j >= 0; j--) { //running backwards in order to use push instead of unshift
                const county = features[j];
                if (d3.geoContains(county, [scan?.lng, scan?.lat])) {
                    if (features.indexOf(county) !== features.length - 1) {
                        //moving county at the end of the array. It's likely that the next feature will be the same one
                        features.push(features.splice(features.indexOf(county), 1)[0]);
                    }
                    county.positivesCount = county.positivesCount === undefined ? 1 : (county.positivesCount + 1) ?? 1;
                    break;
                }
            }
        }
        bar1.stop();
        bar1.start(accessPoints.length, 0);
        for (let i = 0; i < accessPoints.length; i++) {
            let ap = accessPoints[i];
            bar1.increment();
            if (!ap) {
                continue;
            }
            for (let j = features.length - 1; j >= 0; j--) { //running backwards in order to use push instead of unshift
                const county = features[j];
                if (d3.geoContains(county, [ap?.lng, ap?.lat])) {
                    //moving county at the end of the array. It's likely that the next feature will be the same one
                    features.push(features.splice(features.indexOf(county), 1)[0]);
                    county.accessPointsCount =
                        county.accessPointsCount === undefined ? 1 : county.accessPointsCount + 1 ?? 0;
                    break;
                }
            }
        }
        bar1.stop();

        let featureInsert = features.map((f) => ({
            feature: f,
            positivesCount: f.positivesCount ?? 0,
            accessPointsCount: f.accessPointsCount ?? 0
        }));
        try {
            await Feature.collection.drop();
        }
        catch (err) {
            if (err.codeName !== "NamespaceNotFound") {
                throw err;
            }
        }
        Feature.insertMany(featureInsert, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.status(200).json({ message: "success" });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get the cached array of GEOJson features with counts of hotspots per feature
 * @route GET /wifis/get/features
 * @group wifis - Operations about hotspots
 * @returns {Response.model} 200 - array of features
 */
async function features(req, res, next) {
    try {
        let features = await Feature.find().lean();
        features = features.map((f) => {
            f.feature.positivesCount = f.positivesCount;
            f.feature.accessPointsCount = f.accessPointsCount;
            return f.feature;
        });

        res.status(200).json(features);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get all features in a GEOJson geography object
 * @param {object} geographies the GEOJson geography object
 */
function getFeatures(geographies) {
    const isTopology = geographies.type === "Topology";
    if (!isTopology) {
        return geographies.features || geographies;
    }
    const feats = feature(geographies, geographies.objects[Object.keys(geographies.objects)[0]])
        .features;
    return feats;
}
module.exports = { getGetRoutes };
