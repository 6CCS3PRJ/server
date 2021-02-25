const express = require("express");

function getDropRoutes() {
    const router = express.Router();
    return router;
}

module.exports = { getDropRoutes };
