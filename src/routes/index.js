/**
 * Intialise main routing groups.
 *
 * This module and the ones it imports were initially written for a
 * separate project by Luka Kralj and I and have been modified for
 * the purposes of this project.
 * @author Danilo Del Busso <danilo.delbusso1@gmail.com>
 * @author Luka Kralj <luka.kralj.cs@gmail.com>
 */

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
 * @property {string} message.required - the success or error message
 */

module.exports = { getRoutes }
