const router = require("express").Router()
const dataController = require("../controllers/data")

const dataRoutes = (app) => {
    router.post("/collect", dataController.serveData);
    router.get("/retrieve/:id", dataController.FindLastData)
    router.get("/specific/:parameter/:id/:phase", dataController.fetchDataLogs)
    router.get("/graphdata/:deviceId", dataController.serveGraphData)
    router.get("/graphdata/sizes/:deviceId", dataController.FindSizes)
    return app.use("/data",router)
}

module.exports = {dataRoutes}