const express = require("express")
const Scan = require("../../models/scan")

function getDeleteRoutes() {
  const router = express.Router()
  //todo: remove /all for production
  router.delete("/all", all)
  return router
}

/**
 * Remove all scans from scans collection.
 * Meant for development use only.
 * @route DELETE /scans/delete/all
 * @group scans - Operations about scans
 * @returns {Response.model} 200 - Success
 */
const all = async (req, res) => {
  try {
    Scan.deleteMany({}, (err) => {
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

module.exports = { getDeleteRoutes }
