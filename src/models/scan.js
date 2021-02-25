const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    BSSID: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Scan", scanSchema);
