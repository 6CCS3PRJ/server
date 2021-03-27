const express = require("express");
const { getGetRoutes } = require("./get");
const { getInsertRoutes } = require("./insert");
const { getDropRoutes } = require("./drop");

function getScanRoutes() {
    const router = express.Router();
    router.use("/get/", getGetRoutes());
    router.use("/insert/", getInsertRoutes());
    router.use("/drop/", getDropRoutes());
    return router;
}

module.exports = { getScanRoutes };
