const express = require('express');
const router = express.Router();

const {
  getAllEffects,
  getEffect,
  createEffect,
  updateEffect,
  deleteEffect,
} = require('../controllers/effects');

router.route('/').get(getAllEffects).post(createEffect);
router.route('/:id').get(getEffect).patch(updateEffect).delete(deleteEffect);

module.exports = router;
