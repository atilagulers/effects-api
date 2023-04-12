const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const {createCustomError} = require('../errors/customError');

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const storage = multerS3({
  s3: s3,
  bucket: process.env.BUCKET_NAME,
  key: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error('Only image(jpg, jpeg, png) files are allowed!'),
        false
      );
    }

    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({storage});

module.exports = upload;
