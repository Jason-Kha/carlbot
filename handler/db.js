const mongoose = require('mongoose');
const config = require('config');
const db = config.util.getEnv('MONGO_URI');

const connectDB = async () => {
    try {
        await mongoose.connect(config.util.getEnv('MONGO_URI'), {
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
