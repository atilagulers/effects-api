require('dotenv').config();
const cors = require('cors');

// express
const express = require('express');
const app = express();

// database
const connectDB = require('./db/connect');

// routers
const effectsRouter = require('./routes/effects');
const tagsRouter = require('./routes/tags');
const brandsRouter = require('./routes/brands');
const notFound = require('./errors/notFound');
const errorHandler = require('./middleware/errorHandler');

//middlewares
app.use(express.json());
app.use(cors());
//app.use(express.static('public'));

app.use('/api/v1/effects', effectsRouter);
app.use('/api/v1/tags', tagsRouter);

app.use('/api/v1/brands', brandsRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(
      process.env.PORT,
      console.log(`Server is listening on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
