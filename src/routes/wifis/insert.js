const express = require("express");

function getInsertRoutes() {
    const router = express.Router();
    return router;
}

module.exports = { getInsertRoutes };
