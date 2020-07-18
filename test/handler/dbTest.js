const assert = require('chai').assert;
const connectDB = require('../../handler/db.js');
const Currency = require('../../models/currency.js');
const mongoose = require('mongoose');

describe('MongoDB', function() {
    describe('CRUD', function() {
        this.timeout(10000);
        before ((done) => {
            connectDB();
            done();
        });
        
        after ((done) => {
            mongoose.connection.close();
            done();
        });

        it ('should be able to create new user', (done) => {
            const user = new Currency({
                userID: 'UserIDTest',
                balance: 50,
                redemptionDate: Date.now()
            });

            user.save()
                .then(() => {
                    assert(!user.isNew);
                    done();
                });
        });

        it ('should be able to read user', (done) => {
            Currency.findOne({ userID: 'UserIDTest' })
                .then((user) => {
                    assert(user.userID === 'UserIDTest');
                    done();
                });
        });

        it ('should be able to update user properties', (done) => {
            Currency.findOne({ userID: 'UserIDTest' })
                .then((user) => {
                    user.balance = user.balance + 50;
                    user.save();
                    assert(user.balance == 100);
                    done();
                });
        });

        it ('should be able to delete a user', (done) => {
            Currency.findOneAndDelete({ userID: 'UserIDTest' })
                .then(() => Currency.findOne({ userID: 'UserIDTest' }))
                .then((user) => {
                    assert(user === null);
                    done();
                });
        });
    });
});