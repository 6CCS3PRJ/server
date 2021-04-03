const express = require("express")
const Scan = require("../../models/scan")
const Upload = require("../../models/upload")

function getGetRoutes() {
  const router = express.Router()
  router.get("/uploadStats", uploadStats)
  router.post("/matchBSSID", matchBSSID)
  return router
}

/**
 * Get stats about uploaded scans of the last 14 days
 * @route GET /scans/get/uploadStats
 * @group scans - Operations about scans
 * @returns {Response.model} 200 - Success
 */
async function uploadStats(req, res) {
  const DAYS_FILTER = 14
  try {
    const d = new Date(new Date().getTime() - DAYS_FILTER * 24 * 60 * 60 * 1000)
    //only get last 14 days
    const uploads = await Upload.find({
      createdAt: {
        $gte: new Date(new Date().getTime() - DAYS_FILTER * 24 * 60 * 60 * 1000)
      }
    }).lean()

    const dateMap = {}

    for (let i = 0; i < uploads.length; i++) {
      const scan = uploads[i]
      const timestamp = new Date(scan.createdAt)
      timestamp.setHours(0, 0, 0, 0)
      if (dateMap[timestamp]) {
        dateMap[timestamp]++
      } else {
        dateMap[timestamp] = 1
      }
    }

    const result = []

    Object.keys(dateMap).forEach((timestamp) => {
      const amount = dateMap[timestamp]
      const date = new Date(timestamp)
      result.push({ date, amount })
    })

    result.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date)
    })

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get list of all scans that match the given array of BSSIDs
 * @route POST /scans/get/matchBSSID
 * @group scans - Operations about scans
 * @param {Array} BSSIDs - array of BSSID string to use to retrieve matches in the scans collection
 * @returns {Response.model} 200 - Success
 */
async function matchBSSID(req, res) {
  try {
    const scans = await Scan.find({ b: { $in: req.body.BSSIDs } })
    res.status(200).send(scans)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getGetRoutes }
