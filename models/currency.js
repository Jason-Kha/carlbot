const mongoose = require('mongoose');

// currency object
const currencySchema = mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    redemptionDate: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Currency', currencySchema);
