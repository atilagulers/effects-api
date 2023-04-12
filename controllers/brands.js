const Brand = require('../models/brand');
const tryCatch = require('../helpers/tryCatch');
const {createCustomError} = require('../errors/customError');
const {StatusCodes} = require('http-status-codes');
const {
  capitalizeFirstLetter,
  formatString,
} = require('../helpers/commonHelpers');
const mongoose = require('mongoose');

const {getPresignedUrl} = require('../helpers/aws');

const getAllBrands = tryCatch(async (req, res) => {
  const {name, sort} = req.query;
  let queryObj = {};

  if (name) {
    queryObj.name = {$regex: name, $options: 'i'};
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let result = Brand.find(queryObj);

  if (sort) {
    const sortList = sort.split(',').join(' ');

    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt _id');
  }

  result = result.skip(skip).limit(limit);

  const brands = await result;

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: brands.length,
    data: {
      data: brands,
    },
  });
});

const getBrand = tryCatch(async (req, res, next) => {
  const {id: brandId} = req.params;

  const brand = await Brand.findById(brandId);

  if (!brand) {
    return next(
      createCustomError(`No brand with id : ${brandId}`, StatusCodes.NOT_FOUND)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: brand,
  });
});

const createBrand = tryCatch(async (req, res) => {
  const {name: brandName} = req.body;
  const {iconExt} = req.query;

  const createdBrand = await Brand.create({
    name: formatString(brandName),
  });

  const brandId = createdBrand._id.toString();
  const preSignedUrl = await getPresignedUrl('icon', brandId, iconExt);
  const formattedPreSignedUrl = new URL(preSignedUrl);

  const update = {
    icon: [formattedPreSignedUrl.origin, formattedPreSignedUrl.pathname].join(
      ''
    ),
  };

  const updatedBrand = await Brand.findByIdAndUpdate(brandId, update, {
    new: true,
  });

  res.status(StatusCodes.CREATED).json({
    preSignedUrl: formattedPreSignedUrl,
    data: updatedBrand,
  });
});

const updateBrand = tryCatch(async (req, res) => {
  const {id: brandId} = req.params;
  const update = {};
  let formattedPreSignedUrl;

  // capitilize only first letters
  if (req.body.name) {
    update.name = formatString(req.body.name);
  }

  if (req.body.extent) {
    const preSignedUrl = await getPresignedUrl(brandId, req.body.extent);
    formattedPreSignedUrl = new URL(preSignedUrl);

    update.icon = [
      formattedPreSignedUrl.origin,
      formattedPreSignedUrl.pathname,
    ].join('');
  }

  const updatedBrand = await Brand.findByIdAndUpdate(brandId, update, {
    new: true,
  });

  res.status(StatusCodes.CREATED).json({
    preSignedUrl: formattedPreSignedUrl,
    data: updatedBrand,
  });
});

const deleteBrand = tryCatch(async (req, res) => {
  const {id: brandId} = req.params;

  const brand = await Brand.findOneAndDelete({_id: brandId});

  res.status(StatusCodes.OK).json({
    data: brand,
  });
});

module.exports = {
  getAllBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};
