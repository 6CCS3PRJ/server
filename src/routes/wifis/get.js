const express = require("express")
const WifiCount = require("../../models/wifiCount")
const Feature = require("../../models/feature")

function getGetRoutes() {
  const router = express.Router()
  router.get("/scanCounts", scanCounts)
  router.get("/features", features)
  return router
}

/**
 * Get list of all wifis that have scans, and how many they have. Used for heat-maps
 * @route GET /wifis/get/scanCounts
 * @group wifis - Operations about Wireless Access Points
 * @returns {Response.model} 200 - Array of wifi documents with values for scan counts.
 */
async function scanCounts(req, res) {
  try {
    res.status(200).json(await WifiCount.find().lean())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get the cached array of GeoJSON features with counts of hotspots per feature. It is unlikely to be run on Swagger, as the response payload is fairly large. Please try to call the endpoint directly.
 * @route GET /wifis/get/features
 * @group wifis - Operations about Wireless Access Points
 * @returns {Response.model} 200 - Array with one FeatureCollection object.
 */
async function features(req, res) {
  try {
    let features = await Feature.find().lean()
    features = features.map((f) => {
      f.positivesCount = f.positivesCount ?? 0
      f.accessPointsCount = f.accessPointsCount ?? 0
      return f
    })

    res.status(200).json(features[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getGetRoutes }
