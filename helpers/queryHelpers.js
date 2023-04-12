const effectQueryHelper = async (Model, query) => {
  const {
    brand,
    name,
    team,
    category,
    tags,
    lensType,
    startDate,
    endDate,
    sort,
    fields,
  } = query;
  let queryObj = {};

  //if (name) {
  //  queryObj.name = {$regex: name, $options: 'i'};
  //}

  if (name) {
    const regex = new RegExp(
      name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
      'i'
    );
    queryObj.$or = [{name: {$regex: regex}}, {tags: {$regex: regex}}];
  }

  if (brand) {
    const brands = brand.split(',');
    queryObj.brand = {$in: brands};
  }

  if (team) {
    queryObj.team = {$regex: team, $options: 'i'};
  }

  if (category) {
    queryObj.category = {$regex: category, $options: 'i'};
  }

  if (tags) {
    queryObj.tags = {$all: tags.split(',')};
  }

  if (lensType) {
    queryObj.lensType = {$regex: lensType, $options: 'i'};
  }

  // range between start and end dates

  if (startDate || endDate) queryObj.liveDate = {};

  if (startDate) {
    const start = new Date(startDate);

    queryObj.liveDate.$gte = start;
  }
  if (endDate) {
    const end = new Date(endDate);

    queryObj.liveDate.$lt = end;
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  let result = Model.find(queryObj);

  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt _id');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  result = result.skip(skip).limit(limit);

  const effects = await result;
  console.log(effects);
  return effects;
};

module.exports = {effectQueryHelper};
