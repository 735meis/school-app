import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './CreateEventScreen.css';

const CreateEventScreen = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !startDateTime || !endDateTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/calendar', {
        eventName,
        startDateTime,
        endDateTime,
        additionalDetails,
      });

      alert('Event created successfully');
      navigate('/calendar');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to create event'));
    }
  };

  return (
    <div className="create-event-container">
      <div className="header">
        <button onClick={() => navigate('/calendar')} className="back-button">← Back to Calendar</button>
        <h2 className="page-title">Create Event</h2>
      </div>

      <div className="content">
        <form onSubmit={handleCreateEvent} className="form">
          <label className="label">Event Name *</label>
          <input
            className="input"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
          />

          <label className="label">Start Date and Time * (YYYY-MM-DDTHH:MM)</label>
          <input
            className="input"
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
          />

          <label className="label">End Date and Time * (YYYY-MM-DDTHH:MM)</label>
          <input
            className="input"
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
          />

          <label className="label">Additional Details</label>
          <textarea
            className="textarea"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Enter additional details"
            rows="4"
          />

          <button className="submit-button" type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventScreen;
