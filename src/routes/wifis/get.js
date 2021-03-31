const express = require("express")
const Wifi = require("../../models/wifi")
const Scan = require("../../models/scan")
const WifiCount = require("../../models/wifiCount")
const Feature = require("../../models/feature")
const d3 = require("d3")
const axios = require("axios").default
const cliProgress = require("cli-progress")
const { feature } = require("topojson-client")

function getGetRoutes() {
  const router = express.Router()
  router.get("/reloadFeatureCache", reloadFeatureCache)
  router.get("/reloadHeatmapData", reloadHeatmapData)
  router.get("/scanCounts", scanCounts)
  router.get("/features", features)
  return router
}

/**
 * Reload the cached features by computing number of hotspots per GEOJson feature
 * @route GET /wifis/get/reloadFeatureCache
 * @group wifis - Operations about Wireless Access Points
 * @returns {Response.model} 200
 */
async function reloadFeatureCache(req, res) {
  try {
    let [accessPoints, scanResult] = await getScansWithAPs()

    const scans = []

    for (let i = 0; i < scanResult.length; i++) {
      const scan = scanResult[i]
      const accessPointResult = accessPoints.filter((ap) => ap.bssid === scan.b)
      if (accessPointResult.length !== 1) {
        continue
      }
      let accessPoint = accessPointResult[0]
      if (accessPoint) {
        scan.lat = accessPoint.lat
        scan.lng = accessPoint.lng
        scans.push(scan)
      }
    }

    const geoJson = await axios.get(process.env.GEOJSON_URL)
    const features = getFeatures(geoJson.data)
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )
    progressBar.start(scans.length, 0)

    for (let i = 0; i < scans.length; i++) {
      let scan = scans[i]
      progressBar.increment()
      if (!scan) {
        continue
      }
      for (let j = features.length - 1; j >= 0; j--) {
        //running backwards in order to use push instead of unshift
        const county = features[j]
        if (d3.geoContains(county, [scan?.lng, scan?.lat])) {
          if (features.indexOf(county) !== features.length - 1) {
            //moving county at the end of the array. It's likely that the next feature will be the same one
            features.push(features.splice(features.indexOf(county), 1)[0])
          }
          county.properties.positivesCount =
            county.properties.positivesCount === undefined
              ? 1
              : county.properties.positivesCount + 1 ?? 1
          break
        }
      }
    }
    progressBar.stop()
    progressBar.start(accessPoints.length, 0)
    for (let i = 0; i < accessPoints.length; i++) {
      let ap = accessPoints[i]
      progressBar.increment()
      if (!ap) {
        continue
      }
      for (let j = features.length - 1; j >= 0; j--) {
        //running backwards in order to use push instead of unshift
        const county = features[j]
        if (d3.geoContains(county, [ap?.lng, ap?.lat])) {
          //moving county at the end of the array. It's likely that the next feature will be the same one
          features.push(features.splice(features.indexOf(county), 1)[0])
          county.properties.accessPointsCount =
            county.properties.accessPointsCount === undefined
              ? 1
              : county.properties.accessPointsCount + 1 ?? 0
          break
        }
      }
    }
    progressBar.stop()

    try {
      await Feature.deleteMany()
    } catch (err) {
      if (err.codeName !== "NamespaceNotFound") {
        throw err
      }
    }
    Feature.insertMany(
      [
        {
          type: "FeatureCollection",
          features
        }
      ],
      (err) => {
        if (err) {
          throw err
        } else {
          res.status(200).json({ message: "success" })
        }
      }
    )
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Reload the cached heat-map data by computing number of times each Wireless Access Point is present on the Database
 * @route GET /wifis/get/reloadHeatmapData
 * @group wifis - Operations about Wireless Access Points
 * @returns {Response.model} 200
 */
const reloadHeatmapData = async (req, res) => {
  try {
    let [accessPoints, scanResult] = await getScansWithAPs()

    const result = []
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    )
    progressBar.start(accessPoints.length, 0)

    for (let i = 0; i < accessPoints.length; i++) {
      progressBar.increment()
      const ap = accessPoints[i]
      ap.count = scanResult.filter((s) => s.b === ap.bssid).length
      if (ap.count > 0) {
        //5 decimal places = accuracy of 1 meter
        ap.lat = parseFloat(ap.lat).toFixed(5)
        ap.lng = parseFloat(ap.lng).toFixed(5)
        result.push(ap)
      }
    }
    progressBar.stop()

    //delete existing data
    try {
      await WifiCount.deleteMany()
    } catch (err) {
      if (err.codeName !== "NamespaceNotFound") {
        throw err
      }
    }
    //insert new calculations
    WifiCount.insertMany(result, (err) => {
      if (err) {
        throw err
      } else {
        res.status(200).json({ message: "success" })
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get list of all wifis that have scans, and how many they have. Used for heat-maps
 * @route GET /wifis/get/scanCounts
 * @group wifis - Operations about Wireless Access Points
 * @returns {Response.model} 200 - Success
 */
async function scanCounts(req, res) {
  try {
    res.status(200).json(await WifiCount.find().lean())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get the cached array of GeoJSON features with counts of hotspots per feature
 * @route GET /wifis/get/features
 * @group wifis - Operations about Wireless Access Points
 * @returns {Response.model} 200 - array of features
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

/**
 * Convert a Topology into a FeatureCollection and return its features
 * @param {Object} geographies the GEOJson geography object
 */
function getFeatures(geographies) {
  const isTopology = geographies.type === "Topology"
  if (!isTopology) {
    return geographies.features || geographies
  }
  const feats = feature(
    geographies,
    geographies.objects[Object.keys(geographies.objects)[0]]
  ).features
  return feats
}

/**
 * Get an array containing the list of Access Points and the scans that belong to them.
 * @param {Number} apLimit the number of Wireless Access Points to retrieve from the database
 * @returns An array with two arrays of the form [APs, Scans]
 */
const getScansWithAPs = async (apLimit = 200000) => {
  let accessPoints = await Wifi.find().limit(apLimit).lean()
  accessPoints = accessPoints.map((ap) => {
    ap.bssid = ap.bssid
      .toString()
      .toLowerCase()
      .split("")
      //AABBCCDDEE to aa:bb:cc:dd:ee
      .reduce(
        (a, e, i) =>
          a + e + (i % 2 === 1 && i !== ap.bssid.length - 1 ? ":" : ""),
        ""
      )
    return ap
  })
  const bssids = accessPoints.map((ap) => ap.bssid)
  const scanResult = await Scan.find({ b: { $in: bssids } }).lean()
  return [accessPoints, scanResult]
}

module.exports = { getGetRoutes }
