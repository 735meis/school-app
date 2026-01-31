import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import './CreateScheduleScreen.css';

const CreateScheduleScreen = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scheduleType, setScheduleType] = useState('Standard');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dates, setDates] = useState('');
  const [selectedGrades, setSelectedGrades] = useState('');
  const [slots, setSlots] = useState([
    { startTime: '', endTime: '', type: 'Period', periodNumber: '' },
  ]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addSlot = () => {
    setSlots([...slots, { startTime: '', endTime: '', type: 'Period', periodNumber: '' }]);
  };

  const removeSlot = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (scheduleType === 'Standard' && selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    if (scheduleType === 'Override' && !dates) {
      alert('Please enter dates');
      return;
    }

    if (!selectedGrades) {
      alert('Please enter grades');
      return;
    }

    const validSlots = slots.filter(
      slot => slot.startTime && slot.endTime && slot.type
    );

    if (validSlots.length === 0) {
      alert('Please add at least one valid slot');
      return;
    }

    try {
      const payload = {
        scheduleType,
        grades: selectedGrades.split(',').map(g => g.trim()),
        slots: validSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          type: slot.type,
          periodNumber: slot.type === 'Period' ? parseInt(slot.periodNumber) : undefined,
        })),
      };

      if (scheduleType === 'Standard') {
        payload.days = selectedDays;
      } else {
        payload.dates = dates.split(',').map(d => d.trim());
      }

      await api.post('/bell-schedules', payload);

      alert('Schedule created successfully');
      navigate('/bell-schedule');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to create schedule'));
    }
  };

  return (
    <div className="create-schedule-container">
      <div className="header">
        <button onClick={() => navigate('/bell-schedule')} className="back-button">← Back to Bell Schedule</button>
        <h2 className="page-title">Create Schedule</h2>
      </div>

      <div className="content">
        <form onSubmit={handleCreateSchedule} className="form">
          <label className="label">Schedule Type</label>
          <select className="input" value={scheduleType} onChange={(e) => setScheduleType(e.target.value)}>
            <option value="Standard">Standard</option>
            <option value="Override">Override</option>
          </select>

          {scheduleType === 'Standard' && (
            <>
              <label className="label">Days (select multiple)</label>
              <div className="days-container">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${selectedDays.includes(day) ? 'selected' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}

          {scheduleType === 'Override' && (
            <>
              <label className="label">Dates (comma-separated, YYYY-MM-DD)</label>
              <input
                className="input"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="2024-01-15, 2024-01-16"
              />
            </>
          )}

          <label className="label">Grades (comma-separated)</label>
          <input
            className="input"
            value={selectedGrades}
            onChange={(e) => setSelectedGrades(e.target.value)}
            placeholder="9, 10, 11, 12"
          />

          <h3 className="section-title">Schedule Slots</h3>

          {slots.map((slot, index) => (
            <div key={index} className="slot-container">
              <p className="slot-label">Slot {index + 1}</p>

              <label className="label">Start Time (HH:MM)</label>
              <input
                className="input"
                value={slot.startTime}
                onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                placeholder="08:00"
              />

              <label className="label">End Time (HH:MM)</label>
              <input
                className="input"
                value={slot.endTime}
                onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                placeholder="09:00"
              />

              <label className="label">Type</label>
              <select className="input" value={slot.type} onChange={(e) => updateSlot(index, 'type', e.target.value)}>
                <option value="Period">Period</option>
                <option value="Break">Break</option>
                <option value="Lunch">Lunch</option>
                <option value="Student Support">Student Support</option>
                <option value="Advisory">Advisory</option>
                <option value="Passing">Passing</option>
              </select>

              {slot.type === 'Period' && (
                <>
                  <label className="label">Period Number</label>
                  <input
                    className="input"
                    type="number"
                    value={slot.periodNumber}
                    onChange={(e) => updateSlot(index, 'periodNumber', e.target.value)}
                    placeholder="1"
                  />
                </>
              )}

              {slots.length > 1 && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeSlot(index)}
                >
                  Remove Slot
                </button>
              )}
            </div>
          ))}

          <button type="button" className="add-slot-button" onClick={addSlot}>
            + Add Slot
          </button>

          <button className="submit-button" type="submit">Create Schedule</button>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleScreen;
