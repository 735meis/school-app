const BellSchedule = require('../models/BellSchedule');

const createSchedule = async (req, res) => {
  try {
    const { scheduleType, days, dates, grades, slots } = req.body;
    const school = req.user.school;

    const schedule = await BellSchedule.create({
      school,
      scheduleType,
      days: scheduleType === 'Standard' ? days : undefined,
      dates: scheduleType === 'Override' ? dates : undefined,
      grades,
      slots,
      createdBy: req.user._id,
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchedules = async (req, res) => {
  try {
    const school = req.user.school;
    const { date, grade } = req.query;

    let schedules = await BellSchedule.find({ school, grades: grade }).sort({ createdAt: -1 });

    if (date) {
      const targetDate = new Date(date);
      const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

      const overrideSchedule = schedules.find(s =>
        s.scheduleType === 'Override' &&
        s.dates.some(d => d.toDateString() === targetDate.toDateString())
      );

      if (overrideSchedule) {
        return res.json(overrideSchedule);
      }

      const standardSchedule = schedules.find(s =>
        s.scheduleType === 'Standard' &&
        s.days.includes(dayName)
      );

      if (standardSchedule) {
        return res.json(standardSchedule);
      }

      return res.json(null);
    }

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const schedule = await BellSchedule.findById(req.params.id);

    if (schedule) {
      if (schedule.school.toString() !== req.user.school.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this schedule' });
      }

      schedule.scheduleType = req.body.scheduleType || schedule.scheduleType;
      schedule.days = req.body.days || schedule.days;
      schedule.dates = req.body.dates || schedule.dates;
      schedule.grades = req.body.grades || schedule.grades;
      schedule.slots = req.body.slots || schedule.slots;

      const updatedSchedule = await schedule.save();
      res.json(updatedSchedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await BellSchedule.findById(req.params.id);

    if (schedule) {
      if (schedule.school.toString() !== req.user.school.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this schedule' });
      }

      await schedule.deleteOne();
      res.json({ message: 'Schedule removed' });
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSchedule, getSchedules, updateSchedule, deleteSchedule };
