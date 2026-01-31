import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import './HomeScreen.css';

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [schedule, setSchedule] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      if (user.role === 'student') {
        const [scheduleRes, eventsRes] = await Promise.all([
          api.get(`/bell-schedules?date=${today}&grade=${user.grade}`),
          api.get(`/calendar?startDate=${today}&endDate=${today}`),
        ]);

        setSchedule(scheduleRes.data);
        setEvents(eventsRes.data);
      } else {
        const eventsRes = await api.get(`/calendar?startDate=${today}&endDate=${today}`);
        setEvents(eventsRes.data);
      }
    } catch (error) {
      console.error('Error fetching today data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <div className="header-buttons">
          <Link to="/" className="nav-button">Home</Link>
          <Link to="/calendar" className="nav-button">Calendar</Link>
          <Link to="/bell-schedule" className="nav-button">Bell Schedule</Link>
          {user.role === 'admin' && (
            <Link to="/register" className="nav-button">Register</Link>
          )}
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="content">
        <div className="welcome-card">
          <h2 className="welcome-text">Welcome, {user.name}!</h2>
          <p className="role-text">Role: {user.role.toUpperCase()}</p>
          {user.school && (
            <p className="school-text">School: {user.school.name}</p>
          )}
        </div>

        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <>
            {schedule && schedule.slots && (
              <div className="section">
                <h3 className="section-title">Today's Schedule</h3>
                {schedule.slots.map((slot, index) => (
                  <div key={index} className="slot-card">
                    <p className="slot-time">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="slot-type">
                      {slot.type}
                      {slot.periodNumber && ` ${slot.periodNumber}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="section">
              <h3 className="section-title">Today's Events</h3>
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event._id} className="event-card">
                    <h4 className="event-name">{event.eventName}</h4>
                    <p className="event-details">{event.additionalDetails}</p>
                  </div>
                ))
              ) : (
                <p className="no-data-text">No events today</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
