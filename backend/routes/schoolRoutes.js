const express = require('express');
const router = express.Router();
const { createSchool, getSchools, getSchoolById } = require('../controllers/schoolController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, admin, createSchool)
  .get(protect, getSchools);

router.route('/:id')
  .get(protect, getSchoolById);

module.exports = router;
