const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
    feature: {
        type: Object,
        required: true,
    },
    positivesCount: {
        type: Number,
        required: false,
    },
    accessPointsCount: {
        type: Number,
        required: false,
    },
});

module.exports = mongoose.model("feature", featureSchema);
