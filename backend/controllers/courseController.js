const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const { name, grade, periodNumber, teacher, room } = req.body;
    const school = req.user.school;

    const course = await Course.create({
      school,
      name,
      grade,
      periodNumber,
      teacher,
      room,
      student: req.user.role === 'student' ? req.user._id : undefined,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else {
      query.school = req.user.school;
      if (req.query.grade) {
        query.grade = req.query.grade;
      }
    }

    const courses = await Course.find(query).sort({ periodNumber: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      if (req.user.role === 'student' && course.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this course' });
      }

      course.name = req.body.name || course.name;
      course.periodNumber = req.body.periodNumber || course.periodNumber;
      course.teacher = req.body.teacher !== undefined ? req.body.teacher : course.teacher;
      course.room = req.body.room !== undefined ? req.body.room : course.room;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      if (req.user.role === 'student' && course.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this course' });
      }

      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };
