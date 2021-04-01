const express = require("express")
const { getGetRoutes } = require("./get")
const { getPostRoutes } = require("./post")
const { getDeleteRoutes } = require("./delete")

function getScanRoutes() {
  const router = express.Router()
  router.use("/get/", getGetRoutes())
  router.use("/post/", getPostRoutes())
  router.use("/delete/", getDeleteRoutes())
  return router
}

module.exports = { getScanRoutes }
