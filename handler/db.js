const config = require('config');
const mongoose = require('mongoose');

require('dotenv').config();

const db = process.env.MONGOURI || config.get('mongoURI');
console.log(db);

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        // console.log("MongoDB Connected...");
        return true;
    } catch (err) {
        console.error(err.message);
        // exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
