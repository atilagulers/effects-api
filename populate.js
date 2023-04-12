require('dotenv').config();

const connectDB = require('./db/connect');
const Schema = require('./models/category');

const json = require('./categories-data.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Schema.deleteMany();
    await Schema.create(json);

    console.log('Success!!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
