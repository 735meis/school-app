const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  periodNumber: {
    type: Number,
    required: true,
  },
  teacher: {
    type: String,
    default: '',
  },
  room: {
    type: String,
    default: '',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
