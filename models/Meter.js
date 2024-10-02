const mongoose = require("mongoose")

const meter = mongoose.Schema({
    deviceID: {
        type: String,
        unique: true
    },
    password: {
        type : String,
        required : true
    },
    station: {
        type: mongoose.Types.ObjectId,
        ref: 'chargingStation' 
    }
}, {
    timestamps: true
})



module.exports = mongoose.model("meter", meter)
