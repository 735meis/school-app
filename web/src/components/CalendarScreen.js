import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import './CalendarScreen.css';

const CalendarScreen = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/calendar');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <button onClick={() => navigate('/')} className="back-button">← Back to Home</button>
        <h2 className="page-title">Calendar</h2>
      </div>

      <div className="content">
        <h3 className="section-title">All Events</h3>

        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h4 className="event-name">{event.eventName}</h4>
              <p className="event-time">
                {formatDateTime(event.startDateTime)} - {formatDateTime(event.endDateTime)}
              </p>
              <p className="event-details">{event.additionalDetails}</p>
            </div>
          ))
        ) : (
          <p className="no-events-text">No events scheduled</p>
        )}

        {user.role === 'staff' && (
          <button className="add-button" onClick={handleCreateEvent}>
            + Add Event
          </button>
        )}
      </div>
    </div>
  );
};

export default CalendarScreen;
