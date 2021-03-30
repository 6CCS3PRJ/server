const express = require("express")
const { getScanRoutes } = require("./scans")
const { getWifiRoutes } = require("./wifis")
const { getTokenRoutes } = require("./token")

function getRoutes() {
  const router = express.Router()
  router.use("/scans", getScanRoutes())
  router.use("/wifis", getWifiRoutes())
  router.use("/token", getTokenRoutes())
  return router
}

/**
 * Swagger type definitions
 */
/**
 * @typedef Response
 * @property {[integer]} code.required
 */

module.exports = { getRoutes }
