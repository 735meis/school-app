import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const HomeScreen = ({ navigation }) => {
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

  const formatTime = (time) => {
    return time;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={styles.navButtonText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('BellSchedule')}
          >
            <Text style={styles.navButtonText}>Bell Schedule</Text>
          </TouchableOpacity>
          {user.role === 'admin' && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.navButtonText}>Register</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <Text style={styles.roleText}>Role: {user.role.toUpperCase()}</Text>
          {user.school && (
            <Text style={styles.schoolText}>School: {user.school.name}</Text>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
        ) : (
          <>
            {schedule && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Schedule</Text>
                {schedule.slots && schedule.slots.map((slot, index) => (
                  <View key={index} style={styles.slotCard}>
                    <Text style={styles.slotTime}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </Text>
                    <Text style={styles.slotType}>
                      {slot.type}
                      {slot.periodNumber && ` ${slot.periodNumber}`}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Events</Text>
              {events.length > 0 ? (
                events.map((event) => (
                  <View key={event._id} style={styles.eventCard}>
                    <Text style={styles.eventName}>{event.eventName}</Text>
                    <Text style={styles.eventDetails}>{event.additionalDetails}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No events today</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  navButton: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  schoolText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  slotCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  slotTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  slotType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  loader: {
    marginTop: 50,
  },
});

export default HomeScreen;
