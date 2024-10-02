const mongoose = require("mongoose")

const Owner = mongoose.Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("owner", Owner)