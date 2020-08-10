const assert = require('chai').assert;
const { formatDate, formatTime } = require('../functions');

const date = new Date('2020-07-12T18:00:00');

describe('Functions', function () {
    describe('Date and Time', function () {
        it('function should format date', function () {
            assert.equal(formatDate(date), '7/12/2020');
        });

        it('function should format time', function () {
            assert.equal(formatTime(date), '6:00 PM');
        });
    });
});
