const mongoose = require("mongoose")


const LocationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});


const ChargingStation = mongoose.Schema({
    stationUUID: {
        type: String,
        unique: true,
    },
    stationName: {
        type : String,
        required : true,
        unique: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'owner' 
    },
    location: {
        type: LocationSchema,
        required: true
    },
    meter: {
        type: mongoose.Types.ObjectId,
        ref: 'meter' 
    }

}, {
    timestamps: true
})


module.exports = mongoose.model("chargingStation", ChargingStation)
