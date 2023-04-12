const Effect = require('../models/Effect');
const tryCatch = require('../helpers/tryCatch');
const {createCustomError} = require('../errors/customError');
const {effectQueryHelper} = require('../helpers/queryHelpers');
const {StatusCodes} = require('http-status-codes');
const {formatString} = require('../helpers/commonHelpers');
const {getPresignedUrl} = require('../helpers/aws');

const getAllEffects = tryCatch(async (req, res) => {
  const effects = await effectQueryHelper(Effect, req.query);

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: effects.length,
    data: effects,
  });
});

const getEffect = tryCatch(async (req, res, next) => {
  const {id: effectId} = req.params;
  const effect = await Effect.findById(effectId);

  if (!effect) {
    return next(
      createCustomError(
        `No effect with id : ${effectId}`,
        StatusCodes.NOT_FOUND
      )
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: effect,
  });
});

const createEffect = tryCatch(async (req, res) => {
  const {iconExt, previewExt} = req.query;

  const createdEffect = await Effect.create(req.body);
  const effectId = createdEffect._id.toString();

  const update = {};
  let iconFormattedPreSignedUrl = null;
  let previewFormattedPreSignedUrl = null;

  if (iconExt) {
    const iconPreSignedUrl = await getPresignedUrl('icon', effectId, iconExt);
    iconFormattedPreSignedUrl = new URL(iconPreSignedUrl);

    update.icon = [
      iconFormattedPreSignedUrl.origin,
      iconFormattedPreSignedUrl.pathname,
    ].join('');
  }

  if (previewExt) {
    const previewPreSignedUrl = await getPresignedUrl(
      'preview',
      effectId,
      previewExt
    );
    previewFormattedPreSignedUrl = new URL(previewPreSignedUrl);

    update.preview = [
      previewFormattedPreSignedUrl.origin,
      previewFormattedPreSignedUrl.pathname,
    ].join('');
  }

  const updatedEffect = await Effect.findByIdAndUpdate(effectId, update, {
    new: true,
  });

  res.status(StatusCodes.CREATED).json({
    iconPreSignedUrl: iconFormattedPreSignedUrl,
    previewPreSignedUrl: previewFormattedPreSignedUrl,
    data: updatedEffect,
  });
});

const updateEffect = tryCatch(async (req, res) => {
  const {id: effectId} = req.params;
  let iconFormattedPreSignedUrl = null;
  let previewFormattedPreSignedUrl = null;

  // capitilize only first letters
  if (req.body.category) {
    req.body.category = formatString(req.body.category);
  }
  if (req.body.team) {
    req.body.team = formatString(req.body.team);
  }

  if (req.body.lensType) {
    if (req.body.lensType.length > 2)
      req.body.lensType = formatString(req.body.lensType);
    else req.body.lensType = formatString(req.body.lensType).toUpperCase();
  }

  if (req.body.icon) {
    const iconPreSignedUrl = await getPresignedUrl(
      'icon',
      effectId,
      req.body.icon
    );
    iconFormattedPreSignedUrl = new URL(iconPreSignedUrl);

    req.body.icon = [
      iconFormattedPreSignedUrl.origin,
      iconFormattedPreSignedUrl.pathname,
    ].join('');
  }

  if (req.body.preview) {
    const previewPreSignedUrl = await getPresignedUrl(
      'preview',
      effectId,
      req.body.preview
    );
    previewFormattedPreSignedUrl = new URL(previewPreSignedUrl);

    req.body.preview = [
      previewFormattedPreSignedUrl.origin,
      previewFormattedPreSignedUrl.pathname,
    ].join('');
  }

  const effect = await Effect.findOneAndUpdate(
    {_id: effectId},
    {$set: req.body},
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({
    previewPreSignedUrl: previewFormattedPreSignedUrl,
    iconPreSignedUrl: iconFormattedPreSignedUrl,
    data: effect,
  });
});

const deleteEffect = tryCatch(async (req, res) => {
  const {id: effectId} = req.params;

  const effect = await Effect.findOneAndDelete({_id: effectId});

  res.status(StatusCodes.OK).json({
    data: effect,
  });
});

module.exports = {
  getAllEffects,
  getEffect,
  createEffect,
  updateEffect,
  deleteEffect,
};

/*


const updateEffect = tryCatch(async (req, res) => {
  const {id: effectId} = req.params;

  // capitilize only first letters
  if (req.body.category) {
    req.body.category = formatString(req.body.category);
  }
  if (req.body.team) {
    req.body.team = formatString(req.body.team);
  }

  if (req.body.lensType) {
    req.body.lensType = formatString(req.body.lensType);
  }

  const effect = await Effect.findOneAndUpdate(
    {_id: effectId},
    {$set: req.body},
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({
    data: effect,
  });
});

*/
