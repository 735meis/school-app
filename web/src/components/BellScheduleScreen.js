import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import './BellScheduleScreen.css';

const BellScheduleScreen = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const grade = user.role === 'student' ? user.grade : user.school?.gradesOffered?.[0];

      const response = await api.get(`/bell-schedules?date=${today}&grade=${grade}`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bell-schedule-container">
      <div className="header">
        <button onClick={() => navigate('/')} className="back-button">← Back to Home</button>
        <h2 className="page-title">Bell Schedule</h2>
      </div>

      <div className="content">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : schedule && schedule.slots ? (
          <>
            <div className="info-card">
              <p className="info-text">Schedule Type: {schedule.scheduleType}</p>
              {schedule.days && schedule.days.length > 0 && (
                <p className="info-text">Days: {schedule.days.join(', ')}</p>
              )}
            </div>

            <h3 className="section-title">Today's Schedule</h3>

            {schedule.slots.map((slot, index) => (
              <div key={index} className="slot-card">
                <div className="slot-header">
                  <span className="slot-type">
                    {slot.type}
                    {slot.periodNumber && ` ${slot.periodNumber}`}
                  </span>
                </div>
                <p className="slot-time">
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>
            ))}
          </>
        ) : (
          <p className="no-schedule-text">No schedule available for today</p>
        )}

        {user.role === 'staff' && (
          <button className="add-button" onClick={() => navigate('/create-schedule')}>
            + Create Schedule
          </button>
        )}
      </div>
    </div>
  );
};

export default BellScheduleScreen;
