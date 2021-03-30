/**
 * Most of the content of this file and the middleware files that are imported
 * have been built for another project. They are the mutual product of my work and
 * Luka Kralj's.
 */

const express = require("express")
require("express-async-errors")
const mongoose = require("mongoose")
const fetch = require("fetch").fetchUrl
const { logger, expressLogger } = require("./logger")
logger.info("===== STARTING MAIN SERVER =====")
const { getRoutes } = require("./routes")
const app = express()
const cli = require("./cli")
const compression = require("compression")
let expressSwagger
if (process.env.NODE_ENV !== "production") {
  expressSwagger = require("express-swagger-generator")(app)
}
// Middleware-s
const cors = require("cors")
const helmet = require("helmet")
const { genericErrorMiddleware } = require("./errorMiddlewares")
const rateLimiter = require("express-rate-limit")({
  windowMs: 1000,
  max: 5
})

function startServer({ port = process.env.PORT || 5000 } = {}) {
  if (process.env.NODE_ENV !== "production") {
    initialiseSwagger()
  }
  app.use(rateLimiter)
  app.use(helmet())
  app.use(cors())

  //can be used by load balance to check status of the instance
  app.get("/alive", (req, res, next) => {
    res.status(200).send("OK")
  })

  app.use(expressLogger)

  app.use(
    compression({
      //compress all payloads unless specified
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false
        }
        return compression.filter(req, res)
      }
    })
  )

  app.use(express.json({ limit: "100mb" }))
  app.use(express.urlencoded({ extended: true, limit: "100mb" }))

  // Prevents 304 responses / disables cache control
  app.disable("etag")

  app.use(process.env.API_PREFIX || "/api/v1/", getRoutes())

  app.use("*", (req, res, next) => {
    res.status(404).send("404 - Not Found")
  })

  // Connect to database
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection

  db.on("open", () => {
    logger.info("Connected database")

    //load first cache for data
    fetch(
      `http://localhost:${process.env.PORT}${process.env.API_PREFIX}wifis/get/reloadFeatureCache`,
      (err, data) => {
        if (err) {
          console.log(err)
        }
      }
    )
    fetch(
      `http://localhost:${process.env.PORT}${process.env.API_PREFIX}wifis/get/reloadHeatmapData`,
      (err, data) => {
        if (err) {
          console.log(err)
        }
      }
    )
  })

  // Must be last
  app.use(genericErrorMiddleware)

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`)

      // this block of code turns `server.close` into a promise API
      const originalClose = server.close.bind(server)
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose)
        })
      }

      // this ensures that we properly close the server when the program exists
      cli.registerCommand("stop", async () => {
        logger.info("Stopping server...")
        await server.close()
        logger.info("Server stopped.")
      })

      // resolve the whole promise with the express server
      resolve(server)
    })
  })
}

function initialiseSwagger() {
  let options = require("./swagger").options
  expressSwagger(options)
}

process.on("uncaughtException", (err, origin) => {
  logger.error(
    `Uncaught Exception: origin:${origin}, error: ${err}, trace: ${err.stack}`
  )
  logger.warn(
    `Server may be unstable after an uncaught exception. Please restart server ` +
      `by typing: 'stop', 'exit', and then 'npm start'.`
  )
})

process.on("exit", (code) => {
  logger.info(`Exiting with code ${code}...`)
  console.log("\nPress Ctrl+C if using nodemon.")
})

module.exports = { startServer }
