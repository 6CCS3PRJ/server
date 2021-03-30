const mongoose = require("mongoose")

const featureSchema = new mongoose.Schema({
  features: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("feature", featureSchema)
