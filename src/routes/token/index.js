const express = require("express")
const { getGetRoutes } = require("./get")

function getTokenRoutes() {
  const router = express.Router()
  router.use("/get/", getGetRoutes())
  return router
}

module.exports = { getTokenRoutes }
