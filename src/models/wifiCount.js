const mongoose = require("mongoose");

const wifiCountSchema = new mongoose.Schema({
    bssid: {
        type: String,
    },
    count: {
        type: Number,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("WifiCount", wifiCountSchema);
