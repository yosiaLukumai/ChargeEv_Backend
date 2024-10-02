const mongoose = require('mongoose');

// Define the schema for the paidAmount
const PaidAmountSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
});

const PaymentSchema = new mongoose.Schema({
    paymentReference: {
        type: String,
    },
    paidAmount: {
        type: PaidAmountSchema,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        required: true
    },
    phone: {
        type:String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref:"users",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('payment', PaymentSchema);