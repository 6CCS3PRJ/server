const express = require("express")
const Scan = require("../../models/scan")
const Upload = require("../../models/upload")
const Wifi = require("../../models/wifi")

const jwt = require("jsonwebtoken")

function getInsertRoutes() {
  const router = express.Router()
  router.post("/new", newScans)
  return router
}

/**
 * Insert an array of scans into the scans collection
 * @route POST /scans/insert/new
 * @group scans - Operations about scans
 * @param {boolean} d - true if the upload is a dummy
 * @param {string} token - signed JWT for authentication
 * @param {Array} scans - array of scan objects to be inserted directly into scans collection
 * @param {Array} wifis - array of wifi objects to be used to update wifi locations
 * @returns {Response.model} 200 - Success
 */
const newScans = async (req, res, next) => {
  try {
    if (req.body.d && req.body.d == true) {
      //dummy upload and dummy response
      res.status(201).send([
        {
          message: "completed"
        }
      ])
    } else {
      //todo remove this for release
      if (req.body.token === process.env.DEV_UPLOAD_TOKEN) {
        await Scan.insertMany(
          req.body.scans.map((s) => {
            delete s.d //remove dummy value
            return s
          })
        )
        if (req.body.wifis?.length > 0) {
          updateWifiLocations(req.body.wifis)
        }
        await Upload.create({})
        res.status(200).json({ message: "completed" })
        return
      }

      jwt.verify(req.body?.token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
          res.status(401).json({ message: "completed" })
          return
        }

        await Scan.insertMany(
          req.body.scans.map((s) => {
            delete s.d
            return s
          })
        )
        if (req.body.wifis?.length > 0) {
          updateWifiLocations(req.body.wifis)
        }
        await Upload.create({})
        res.status(200).json({ message: "completed" })
      })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

/**
 * Use array of Access Points to update the accuracy of their coordinates on the database.
 * @param {Array} aps - array of Access Point objects to be used to update wifi locations
 */
const updateWifiLocations = async (aps) => {
  const bssids = aps.map((wifi) => wifi.bssid)

  const matches = await Wifi.find({ bssid: { $in: bssids } }).lean()
  const matchesBssids = matches.map((match) => match.bssid)
  const newWifis = aps.filter((wifi) => !matchesBssids.includes(wifi.bssid))
  const updatedWifis = newWifis
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const original = aps.find((wifi) => wifi.bssid === match.bssid)
    if (original) {
      const averageCoords = averageGeolocation([match, original])
      match.lat = averageCoords.lat
      match.lng = averageCoords.lng
      updatedWifis.push(match)
    }
  }

  //only update APs that have received changes
  await Wifi.bulkWrite(
    updatedWifis.map((wifi) => {
      return {
        updateOne: {
          filter: { bssid: wifi.bssid },
          update: { $set: { lat: wifi.lat, lng: wifi.lng } },
          upsert: true
        }
      }
    })
  )
}

/**
 * Return the average lat and lng of an array of Access Points. Uses Haversine formula.
 * Taken from https://gist.github.com/tlhunter/0ea604b77775b3e7d7d25ea0f70a23eb
 * @param {Array} aps Access Point array input. objects with lat and lng
 * @returns {Object} an Object with lat and lng properties of the average location
 */
function averageGeolocation(aps) {
  if (aps.length === 1) {
    return aps[0]
  }

  let x = 0.0
  let y = 0.0
  let z = 0.0

  for (let coord of aps) {
    let latitude = (coord.lat * Math.PI) / 180
    let longitude = (coord.lng * Math.PI) / 180

    x += Math.cos(latitude) * Math.cos(longitude)
    y += Math.cos(latitude) * Math.sin(longitude)
    z += Math.sin(latitude)
  }

  let total = aps.length

  x = x / total
  y = y / total
  z = z / total

  let centralLongitude = Math.atan2(y, x)
  let centralSquareRoot = Math.sqrt(x * x + y * y)
  let centralLatitude = Math.atan2(z, centralSquareRoot)

  return {
    lat: (centralLatitude * 180) / Math.PI,
    lng: (centralLongitude * 180) / Math.PI
  }
}

module.exports = { getInsertRoutes }
