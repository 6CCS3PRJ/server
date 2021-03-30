const express = require("express")
const jwt = require("jsonwebtoken")

function getGetRoutes() {
  const router = express.Router()
  router.get("/new", newToken)
  router.get("/check", checkToken)
  return router
}

/**
 * Sign and return a JWT with a validity of 30 seconds
 * @route GET /token/get/new
 * @group token - operations about tokens
 * @returns {Response.model} 200 - the JWT token in the form of a string
 */
async function newToken(req, res) {
  const token = jwt.sign({ type: "uploadToken" }, process.env.TOKEN_KEY, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME
  })
  res.status(200).send(token)
}

/**
 * Sign and return a token with a validity of 30 seconds
 * @route GET /token/get/new
 * @group token - operations about tokens
 * @returns {Response.model} 200 - the JWT token in the form of a string
 */
async function checkToken(req, res) {
  jwt.verify(req.query.token, process.env.TOKEN_KEY, function (err, decoded) {
    if (err) {
      res.status(401).send(err)
      return
    }
    res.status(200).send(decoded)
  })
}

module.exports = { getGetRoutes }
