import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const CalendarScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/calendar');
      setEvents(response.data);
      markEventDates(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const markEventDates = (eventsList) => {
    const marked = {};
    eventsList.forEach((event) => {
      const date = event.startDateTime.split('T')[0];
      marked[date] = {
        marked: true,
        dotColor: '#2196F3',
      };
    });
    setMarkedDates(marked);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    if (user.role === 'staff') {
      navigation.navigate('CreateEvent', { date: day.dateString });
    }
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => event.startDateTime.startsWith(date));
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          todayTextColor: '#2196F3',
          selectedDayBackgroundColor: '#2196F3',
          dotColor: '#2196F3',
        }}
      />

      <ScrollView style={styles.eventsList}>
        <Text style={styles.sectionTitle}>
          {selectedDate ? `Events for ${selectedDate}` : 'All Events'}
        </Text>

        {selectedDate ? (
          getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map((event) => (
              <View key={event._id} style={styles.eventCard}>
                <Text style={styles.eventName}>{event.eventName}</Text>
                <Text style={styles.eventTime}>
                  {formatDateTime(event.startDateTime)} - {formatDateTime(event.endDateTime)}
                </Text>
                <Text style={styles.eventDetails}>{event.additionalDetails}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>No events on this date</Text>
          )
        ) : (
          events.map((event) => (
            <View key={event._id} style={styles.eventCard}>
              <Text style={styles.eventName}>{event.eventName}</Text>
              <Text style={styles.eventTime}>
                {formatDateTime(event.startDateTime)} - {formatDateTime(event.endDateTime)}
              </Text>
              <Text style={styles.eventDetails}>{event.additionalDetails}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {user.role === 'staff' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  eventsList: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
  noEventsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
