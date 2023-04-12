const Tag = require('../models/Tag');
const tryCatch = require('../helpers/tryCatch');
const {createCustomError} = require('../errors/customError');
const {StatusCodes} = require('http-status-codes');

const getAllTags = tryCatch(async (req, res) => {
  const tags = await Tag.find({});

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: tags,
  });
});

const getTag = tryCatch(async (req, res) => {
  const {id: tagId} = req.params;
  const tag = await Tag.find({_id: tagId});

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: tag,
  });
});

const createTag = tryCatch(async (req, res) => {
  const tag = await Tag.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: tag,
  });
});

const updateTag = tryCatch(async (req, res) => {
  const {id: tagId} = req.params;
  const tag = await Tag.findOneAndUpdate({_id: tagId}, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: tag,
  });
});

const deleteTag = tryCatch(async (req, res) => {
  const {id: tagId} = req.params;

  const tag = await Tag.findOneAndDelete({_id: tagId});

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: tag,
  });
});

module.exports = {getAllTags, getTag, createTag, updateTag, deleteTag};
