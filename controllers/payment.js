const PaymentModel = require("../models/Payment")
const UserModel = require("../models/users")
const io = require("./../index");
const createOutput = require("../utils").createOutput;
const { uuid } = require('uuidv4');

const SavePayment = async (req, res) => {
    try {
        const { paidAmount, user, phone } = req.body;
        const userFound = await UserModel.findById(user)
        if (userFound) {
            const saved = await PaymentModel.create({
                paymentStatus: "pending",
                paidAmount: {
                    amount: paidAmount,
                    currency: "TSH"
                },
                user,
                phone,
                paymentReference: uuid()
            });
            if (saved) {
                // let update this user
                const updated = await UserModel.updateOne(
                    { _id: user },
                    { $inc: { balance: paidAmount } }
                );

                if (updated) {
                    io.Socket.emit("newpayment", { user, paidAmount })
                    return res.json(createOutput(true, saved));
                } else {
                    return res.json(createOutput(false, "Failed to add balance to user"));
                }



            } else {
                return res.json(createOutput(false, saved));
            }
        }
        else {
            return res.json(createOutput(false, "No such user"));
        }

    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
};

const RetrievePayment = async (req, res) => {
    try {
        const user = req.params.id;
        const userFound = await UserModel.findById(user)
        if (userFound) {
            const saved = await PaymentModel.find({ user }, "createdAt paymentReference paymentStatus paidAmount phone", { sort: { createdAt: -1 } }).limit(10).exec();;
            if (saved) {
                return res.json(createOutput(true, saved));
            } else {
                return res.json(createOutput(false, saved));
            }
        }
        else {
            return res.json(createOutput(false, "No such payment"));
        }

    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}


module.exports = {
    SavePayment,
    RetrievePayment
}