const CalendarEvent = require('../models/CalendarEvent');

const createEvent = async (req, res) => {
  try {
    const { eventName, startDateTime, endDateTime, additionalDetails } = req.body;
    const school = req.user.school;

    const event = await CalendarEvent.create({
      school,
      eventName,
      startDateTime,
      endDateTime,
      additionalDetails,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const school = req.user.school;

    let query = { school };

    if (startDate && endDate) {
      query.startDateTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const events = await CalendarEvent.find(query).sort({ startDateTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (event) {
      if (event.school.toString() !== req.user.school.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }

      event.eventName = req.body.eventName || event.eventName;
      event.startDateTime = req.body.startDateTime || event.startDateTime;
      event.endDateTime = req.body.endDateTime || event.endDateTime;
      event.additionalDetails = req.body.additionalDetails !== undefined ? req.body.additionalDetails : event.additionalDetails;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (event) {
      if (event.school.toString() !== req.user.school.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }

      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getEvents, updateEvent, deleteEvent };
