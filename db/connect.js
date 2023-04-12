const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = (url) => {
  console.log('Connected to DB!');
  return mongoose.connect(url);
};

module.exports = connectDB;
