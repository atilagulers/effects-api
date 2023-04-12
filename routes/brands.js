const express = require('express');
const router = express.Router();

const upload = require('../helpers/upload');

const {
  getAllBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brands');

router.route('/').get(getAllBrands).post(upload.single('icon'), createBrand);
router.route('/:id').get(getBrand).patch(updateBrand).delete(deleteBrand);

module.exports = router;
