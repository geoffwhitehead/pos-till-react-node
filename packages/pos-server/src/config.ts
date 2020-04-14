import mongoose from 'mongoose';
const APP_NAME = 'Boilerplate API';
const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

// database configs

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb/boilerplate';
// if (ENV === "test") {
//   MONGODB_URI = global.__MONGO_URI__;
// }

mongoose.Promise = Promise;
if (ENV === 'development' || ENV === 'test') {
    mongoose.set('debug', true);
}

/**
 * Connect to mongoose asynchronously or bail out if it fails
 */
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            autoIndex: false,
            useNewUrlParser: true,
        });
        console.log(`${APP_NAME} successfully connected to database.`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export { APP_NAME, ENV, MONGODB_URI, PORT, connectToDatabase };
