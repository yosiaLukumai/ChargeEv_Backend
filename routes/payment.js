const router = require("express").Router()
const PaymentController = require("../controllers/payment")

const paymentRoutes = (app) => {
    router.post("/save", PaymentController.SavePayment);
    router.get("/retrieve/:id", PaymentController.RetrievePayment)
    return app.use("/payment",router)
}

module.exports = {paymentRoutes}