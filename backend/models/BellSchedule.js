const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Period', 'Break', 'Lunch', 'Student Support', 'Advisory', 'Passing'],
    required: true,
  },
  periodNumber: {
    type: Number,
    required: function() {
      return this.type === 'Period';
    },
  },
}, { _id: true });

const bellScheduleSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  scheduleType: {
    type: String,
    enum: ['Standard', 'Override'],
    required: true,
  },
  days: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: function() {
      return this.scheduleType === 'Standard';
    },
  }],
  dates: [{
    type: Date,
    required: function() {
      return this.scheduleType === 'Override';
    },
  }],
  grades: [{
    type: String,
    required: true,
  }],
  slots: [slotSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BellSchedule', bellScheduleSchema);
