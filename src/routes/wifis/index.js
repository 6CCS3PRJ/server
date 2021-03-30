const express = require("express")
const { getGetRoutes } = require("./get")

function getWifiRoutes() {
  const router = express.Router()
  router.use("/get/", getGetRoutes())
  return router
}

module.exports = { getWifiRoutes }
