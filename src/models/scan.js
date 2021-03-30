const mongoose = require("mongoose")

/**
 * Return today's date set to midnight to avoid grouping scans.
 * @returns {Date} today's date set to midnight
 */
const getMidnightDate = () => {
  var d = new Date()
  return d.setHours(0, 0, 0, 0)
}

const scanSchema = new mongoose.Schema({
  t: {
    type: Date,
    required: true
  },
  b: {
    type: String,
    required: true
  },
  l: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: getMidnightDate,
    required: true,
    expires: "14d"
  }
})

module.exports = mongoose.model("Scan", scanSchema)
