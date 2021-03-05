const express = require("express");

function getUpdateRoutes() {
    const router = express.Router();
    return router;
}

module.exports = { getUpdateRoutes };
