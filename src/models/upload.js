const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model("Upload", uploadSchema);
