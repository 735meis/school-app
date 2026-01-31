const express = require('express');
const router = express.Router();
const { createSchedule, getSchedules, updateSchedule, deleteSchedule } = require('../controllers/bellScheduleController');
const { protect, staff } = require('../middleware/auth');

router.route('/')
  .post(protect, staff, createSchedule)
  .get(protect, getSchedules);

router.route('/:id')
  .put(protect, staff, updateSchedule)
  .delete(protect, staff, deleteSchedule);

module.exports = router;
