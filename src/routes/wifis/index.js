const express = require("express")
const { getGetRoutes } = require("./get")
const { getPatchRoutes } = require("./patch")

function getWifiRoutes() {
  const router = express.Router()
  router.use("/get/", getGetRoutes())
  router.use("/patch/", getPatchRoutes())
  return router
}

module.exports = { getWifiRoutes }
