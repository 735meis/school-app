import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const CreateScheduleScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
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

  const handleCreateSchedule = async () => {
    if (scheduleType === 'Standard' && selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    if (scheduleType === 'Override' && !dates) {
      Alert.alert('Error', 'Please enter dates');
      return;
    }

    if (!selectedGrades) {
      Alert.alert('Error', 'Please enter grades');
      return;
    }

    const validSlots = slots.filter(
      slot => slot.startTime && slot.endTime && slot.type
    );

    if (validSlots.length === 0) {
      Alert.alert('Error', 'Please add at least one valid slot');
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

      Alert.alert('Success', 'Schedule created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create schedule');
    }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Schedule Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={scheduleType}
            onValueChange={setScheduleType}
          >
            <Picker.Item label="Standard" value="Standard" />
            <Picker.Item label="Override" value="Override" />
          </Picker>
        </View>

        {scheduleType === 'Standard' && (
          <>
            <Text style={styles.label}>Days (select multiple)</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.selectedDayButton,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.selectedDayButtonText,
                    ]}
                  >
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {scheduleType === 'Override' && (
          <>
            <Text style={styles.label}>Dates (comma-separated, YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={dates}
              onChangeText={setDates}
              placeholder="2024-01-15, 2024-01-16"
            />
          </>
        )}

        <Text style={styles.label}>Grades (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={selectedGrades}
          onChangeText={setSelectedGrades}
          placeholder="9, 10, 11, 12"
        />

        <Text style={styles.sectionTitle}>Schedule Slots</Text>

        {slots.map((slot, index) => (
          <View key={index} style={styles.slotContainer}>
            <Text style={styles.slotLabel}>Slot {index + 1}</Text>

            <Text style={styles.label}>Start Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              value={slot.startTime}
              onChangeText={(value) => updateSlot(index, 'startTime', value)}
              placeholder="08:00"
            />

            <Text style={styles.label}>End Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              value={slot.endTime}
              onChangeText={(value) => updateSlot(index, 'endTime', value)}
              placeholder="09:00"
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={slot.type}
                onValueChange={(value) => updateSlot(index, 'type', value)}
              >
                <Picker.Item label="Period" value="Period" />
                <Picker.Item label="Break" value="Break" />
                <Picker.Item label="Lunch" value="Lunch" />
                <Picker.Item label="Student Support" value="Student Support" />
                <Picker.Item label="Advisory" value="Advisory" />
                <Picker.Item label="Passing" value="Passing" />
              </Picker>
            </View>

            {slot.type === 'Period' && (
              <>
                <Text style={styles.label}>Period Number</Text>
                <TextInput
                  style={styles.input}
                  value={slot.periodNumber}
                  onChangeText={(value) => updateSlot(index, 'periodNumber', value)}
                  placeholder="1"
                  keyboardType="numeric"
                />
              </>
            )}

            {slots.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeSlot(index)}
              >
                <Text style={styles.removeButtonText}>Remove Slot</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addSlotButton} onPress={addSlot}>
          <Text style={styles.addSlotButtonText}>+ Add Slot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCreateSchedule}>
          <Text style={styles.buttonText}>Create Schedule</Text>
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
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    minWidth: 60,
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  slotContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  slotLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addSlotButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addSlotButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateScheduleScreen;
