const mongoose = require("mongoose")

const uploadSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: "14d"
  }
})

module.exports = mongoose.model("Upload", uploadSchema)
