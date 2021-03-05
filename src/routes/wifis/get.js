const express = require("express");
const Wifi = require("../../models/wifi");
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
        const result = await Wifi.find().limit(100000).lean(); //todo: remove limit
        const geoJson = await axios.get(process.env.ENGLAND_GEOJSON_URL);
        const features = getFeatures(geoJson.data);
        const cliProgress = require("cli-progress");
        const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar1.start(result.length, 0);

        for (let i = 0; i < result.length; i++) {
            let hotspot = result[i];
            bar1.increment();
            if (!hotspot) {
                continue;
            }
            for (let j = 0; j < features.length; j++) {
                const county = features[j];
                if (d3.geoContains(county, [hotspot?.lng, hotspot?.lat])) {
                    county.hotspotCount =
                        county.hotspotCount === undefined ? 1 : county.hotspotCount + 1;
                    break;
                }
            }
        }
        bar1.stop();

        let featureInsert = features.map((f) => ({ feature: f, hotspotCount: f.hotspotCount }));
        await Feature.collection.drop();
        Feature.collection.insertMany(featureInsert, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.status(200).json(features);
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
            f.feature.hotspotCount = f.hotspotCount;
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
