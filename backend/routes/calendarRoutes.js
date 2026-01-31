const express = require('express');
const router = express.Router();
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/calendarController');
const { protect, staff } = require('../middleware/auth');

router.route('/')
  .post(protect, staff, createEvent)
  .get(protect, getEvents);

router.route('/:id')
  .put(protect, staff, updateEvent)
  .delete(protect, staff, deleteEvent);

module.exports = router;
