import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import api from '../config/api';

const CreateEventScreen = ({ navigation, route }) => {
  const [eventName, setEventName] = useState('');
  const [startDateTime, setStartDateTime] = useState(route.params?.date || '');
  const [endDateTime, setEndDateTime] = useState(route.params?.date || '');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const handleCreateEvent = async () => {
    if (!eventName || !startDateTime || !endDateTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await api.post('/calendar', {
        eventName,
        startDateTime,
        endDateTime,
        additionalDetails,
      });

      Alert.alert('Success', 'Event created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Event Name *</Text>
        <TextInput
          style={styles.input}
          value={eventName}
          onChangeText={setEventName}
          placeholder="Enter event name"
        />

        <Text style={styles.label}>Start Date and Time * (YYYY-MM-DD HH:MM)</Text>
        <TextInput
          style={styles.input}
          value={startDateTime}
          onChangeText={setStartDateTime}
          placeholder="2024-01-01 09:00"
        />

        <Text style={styles.label}>End Date and Time * (YYYY-MM-DD HH:MM)</Text>
        <TextInput
          style={styles.input}
          value={endDateTime}
          onChangeText={setEndDateTime}
          placeholder="2024-01-01 15:00"
        />

        <Text style={styles.label}>Additional Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
          placeholder="Enter additional details"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;
