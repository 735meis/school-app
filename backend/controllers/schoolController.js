const School = require('../models/School');

const createSchool = async (req, res) => {
  try {
    const { name, address, type, gradesOffered } = req.body;

    const school = await School.create({
      name,
      address,
      type,
      gradesOffered,
    });

    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchools = async (req, res) => {
  try {
    const schools = await School.find({});
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (school) {
      res.json(school);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSchool, getSchools, getSchoolById };
