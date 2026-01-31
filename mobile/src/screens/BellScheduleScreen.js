import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const BellScheduleScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {schedule && schedule.slots ? (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Schedule Type: {schedule.scheduleType}
              </Text>
              {schedule.days && schedule.days.length > 0 && (
                <Text style={styles.infoText}>
                  Days: {schedule.days.join(', ')}
                </Text>
              )}
            </View>

            <Text style={styles.sectionTitle}>Today's Schedule</Text>

            {schedule.slots.map((slot, index) => (
              <View key={index} style={styles.slotCard}>
                <View style={styles.slotHeader}>
                  <Text style={styles.slotType}>
                    {slot.type}
                    {slot.periodNumber && ` ${slot.periodNumber}`}
                  </Text>
                </View>
                <Text style={styles.slotTime}>
                  {slot.startTime} - {slot.endTime}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.noScheduleText}>
              No schedule available for today
            </Text>
          </View>
        )}
      </ScrollView>

      {user.role === 'staff' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateSchedule')}
        >
          <Text style={styles.addButtonText}>+ Create Schedule</Text>
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
  content: {
    flex: 1,
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  slotType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  slotTime: {
    fontSize: 14,
    color: '#666',
  },
  noScheduleText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
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

export default BellScheduleScreen;
