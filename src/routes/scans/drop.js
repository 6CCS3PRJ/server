const express = require("express")
const Scan = require("../../models/scan")

function getDropRoutes() {
  const router = express.Router()
  //todo: remove /all for production
  router.post("/all", all)
  return router
}

/**
 * Remove all scans from scans collection.
 * Meant for development use.
 * Used for development
 * @route GET /scans/drop/all
 * @group scans - Operations about scans
 * @returns {Response.model} 200 - Success
 */
const all = async (req, res, next) => {
  try {
    Scan.deleteMany({}, (err, data) => {
      if (err) {
        throw err
      } else {
        res.status(200).json({
          message: "success"
        })
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getDropRoutes }
