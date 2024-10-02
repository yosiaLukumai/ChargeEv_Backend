const dataModel = require("./../models/data");
const userModel = require("./../models/users");
const createOutput = require("../utils").createOutput;
const BoxModel = require("../models/Boxs")
const io = require("./../index");
const serveData = async (req, res) => {
    try {
        // let { temp, hum, size, deviceId } = req.body;
        let { temp, hum, size } = req.body;
        // query the device id to get userId
        // check the type of the size of the plant
        temp = String(temp);
        hum = String(hum);
        size = String(size);



        // const found = await userModel.findOne({ deviceId: String(deviceId) });
        const found = await userModel.findOne({ deviceId: 1000 });
        if (found) {
            // save the data to the database
            const saved = await dataModel.create({ userId: found?._id, temp, hum, size });
            if (saved) {
                // fire a socket to notify there is new data...
                io.Socket.emit("newData", saved)
                return res.json({ status: 1, message: "Data saved sucessfully" })
            } else {
                return res.json({ status: 0, message: "Failed to save the data" })
            }
        } else {
            return res.json({ status: 0, message: "Device not registered..." })
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}


const serveGraphData = async (req, res) => {
    try {
        const deviceId = req.params.deviceId
        const found = await userModel.findOne({ deviceId: String(deviceId) });
        if (found) {
            const fiveLastData = await dataModel.find({ userId: found?._id }, "temp hum size createdAt", { createdAt: -1 }).limit(6).exec();
            return res.json(createOutput(true, fiveLastData))
        } else {
            return res.json({ status: 0, message: "Device not registered..." })
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

const fetchDataLogs = async (req, res) => {
    try {
        let parameter = req.params.parameter
        let userId = req.params.id
        let phase = req.params.phase
        // console.log(phase, phase=="1", phase=="2", phase=="3")
        let user = await userModel.findById(userId)
        let dateFilter = new Date("May 10, 2024 06:36:12")
        let dateFilterMid = new Date("July 15,2024 08:30:00")
        if (user) {
            // checking if the parameter is of what type
            if (parameter == "Temperature") {
                let data;
                if (phase == "1") {
                    data = await dataModel.find({ userId, createdAt: { $lte: dateFilter } }, "temp createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else if(phase == "2") {
                    data = await dataModel.find({ userId, createdAt: { $gte: dateFilter, $lte: dateFilterMid } }, "temp createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else {
                    data = await dataModel.find({ userId, createdAt: { $gte: dateFilterMid } }, "temp createdAt", { sort: { createdAt: -1 } }).exec();
                }
                return res.json(createOutput(true, data))
            }
            if (parameter == "Humidity") {
                let data;
                if (phase == "1") {
                    data = await dataModel.find({ userId, createdAt: {$lte: dateFilter} }, "hum createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else if(phase == "2") {
                    // $gte: dateFilter, $lte: dateFilterMid
                    data = await dataModel.find({ userId, createdAt: {  $gte: dateFilter, $lte: dateFilterMid } }, "hum createdAt", { sort: { createdAt: -1 } }).exec();

                }
                else {
                    data = await dataModel.find({ userId, createdAt: { $gte: dateFilterMid } }, "hum createdAt", { sort: { createdAt: -1 } }).exec();
                }
                return res.json(createOutput(true, data))
            }
            if (parameter == "size") {
                let data;
                if (phase == "1") {
                    data = await BoxModel.find(null, "average rectangles createdAt", { sort: { createdAt: -1 } }).exec();
                }else if(phase == "2") {
                    data = await BoxModel.find(null, "average rectangles createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else {
                    data = await BoxModel.find(null, "average rectangles createdAt", { sort: { createdAt: -1 } }).exec();
                }
                return res.json(createOutput(true, data))
            }
        } else {
            return res.json(createOutput(true, "No such user", true));
        }




    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}


const FindLastData = async (req, res) => {
    try {

        const id = req.params.id;
        const user = await userModel.findById(id);
        if (user) {
            // tries to retrieve the data
            let retrievedData = await dataModel.findOne({ userId: user._id }, null, { sort: { createdAt: -1 }, limit: 1 }).exec();;
            if (retrievedData) {
                return res.json(createOutput(true, retrievedData))
            } else {
                return res.json(createOutput(true, "Can't retrieve the data"))
            }

        } else {
            return res.json(createOutput(false, "No such user Data", true));
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

const SaveImages = async (req, res) => {
    try {

        const deviceId = req.params.deviceId;
        const found = await userModel.findOne({ deviceId: String(deviceId) });
        if (found) {
            // 
        } else {
            return res.json(createOutput(false, "No such device Id", true));
        }


    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

const FindSizes = async (req, res) => {
    try {
        const deviceId = req.params.deviceId
        const found = await userModel.findOne({ deviceId: String(deviceId) });
        if (found) {
            // let compute for the day and find the last five days
            // Given date
            const givenDate = new Date();
            const sixDaysAgo = new Date(givenDate.getTime() - (6 * 24 * 60 * 60 * 1000));

            // const fiveLastData = await BoxModel.find(null, "average createdAt", { createdAt: -1 }).limit(6).exec();
            let aggregationPipeline = null
            const fiveLastData = await BoxModel.aggregate(aggregationPipeline).exec()
            // const fiveLastData = await BoxModel.find(null, "average createdAt", { createdAt: -1 }).limit(6).exec();
            return res.json(createOutput(true, fiveLastData))
        } else {
            return res.json({ status: 0, message: "Device not registered..." })
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

module.exports = {
    serveData,
    FindLastData,
    fetchDataLogs,
    serveGraphData,
    SaveImages,
    FindSizes
}
