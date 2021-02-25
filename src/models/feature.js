const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
    feature: {
        type: Object,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("feature", featureSchema);
