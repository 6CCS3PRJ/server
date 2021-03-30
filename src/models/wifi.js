const mongoose = require("mongoose")

const wifiSchema = new mongoose.Schema({
  bssid: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model("Wifi", wifiSchema)
