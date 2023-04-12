const aws = require('aws-sdk');

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3({
  //apiVersion: '2006-03-01',
  signatureVersion: 'v4',
});

const formatFileName = (fileName) => {
  return fileName.split(' ').join('-').split('.')[0];
};

const getPresignedUrl = async (fileType, fileName, fileExtent) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${fileType}${fileName}.${fileExtent}`,
    Expires: 60 * 60,
    ContentType: `image/${fileExtent}`,
    ACL: 'public-read',
  };

  return s3.getSignedUrl('putObject', params);
};

module.exports = {s3, getPresignedUrl};
