import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CalendarScreen from './components/CalendarScreen';
import BellScheduleScreen from './components/BellScheduleScreen';
import RegisterScreen from './components/RegisterScreen';
import CreateEventScreen from './components/CreateEventScreen';
import CreateScheduleScreen from './components/CreateScheduleScreen';
import './App.css';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#2196F3'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/calendar" element={<CalendarScreen />} />
      <Route path="/bell-schedule" element={<BellScheduleScreen />} />

      {user.role === 'admin' && (
        <Route path="/register" element={<RegisterScreen />} />
      )}

      {user.role === 'staff' && (
        <>
          <Route path="/create-event" element={<CreateEventScreen />} />
          <Route path="/create-schedule" element={<CreateScheduleScreen />} />
        </>
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
