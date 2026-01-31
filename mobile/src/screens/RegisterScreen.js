import React, { useState, useEffect } from 'react';
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
import api from '../config/api';

const RegisterScreen = ({ navigation }) => {
  const [registrationType, setRegistrationType] = useState('school');
  const [schools, setSchools] = useState([]);

  const [schoolName, setSchoolName] = useState('');
  const [address, setAddress] = useState('');
  const [schoolType, setSchoolType] = useState('Elementary');
  const [gradesOffered, setGradesOffered] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools');
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleRegisterSchool = async () => {
    if (!schoolName || !address || !gradesOffered) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await api.post('/schools', {
        name: schoolName,
        address,
        type: schoolType,
        gradesOffered: gradesOffered.split(',').map(g => g.trim()),
      });

      Alert.alert('Success', 'School registered successfully');
      fetchSchools();
      setSchoolName('');
      setAddress('');
      setGradesOffered('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to register school');
    }
  };

  const handleRegisterStaff = async () => {
    if (!email || !password || !name || !selectedSchool) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await api.post('/users', {
        email,
        password,
        name,
        role: 'staff',
        school: selectedSchool,
      });

      Alert.alert('Success', 'Staff registered successfully');
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to register staff');
    }
  };

  const handleRegisterStudent = async () => {
    if (!email || !password || !name || !selectedSchool || !grade) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await api.post('/users', {
        email,
        password,
        name,
        role: 'student',
        school: selectedSchool,
        grade,
      });

      Alert.alert('Success', 'Student registered successfully');
      setEmail('');
      setPassword('');
      setName('');
      setGrade('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to register student');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, registrationType === 'school' && styles.activeTypeButton]}
          onPress={() => setRegistrationType('school')}
        >
          <Text style={[styles.typeButtonText, registrationType === 'school' && styles.activeTypeButtonText]}>
            New School
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, registrationType === 'staff' && styles.activeTypeButton]}
          onPress={() => setRegistrationType('staff')}
        >
          <Text style={[styles.typeButtonText, registrationType === 'staff' && styles.activeTypeButtonText]}>
            New Staff
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, registrationType === 'student' && styles.activeTypeButton]}
          onPress={() => setRegistrationType('student')}
        >
          <Text style={[styles.typeButtonText, registrationType === 'student' && styles.activeTypeButtonText]}>
            New Student
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {registrationType === 'school' && (
          <>
            <Text style={styles.label}>School Name</Text>
            <TextInput
              style={styles.input}
              value={schoolName}
              onChangeText={setSchoolName}
              placeholder="Enter school name"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={schoolType}
                onValueChange={setSchoolType}
              >
                <Picker.Item label="Elementary" value="Elementary" />
                <Picker.Item label="Middle" value="Middle" />
                <Picker.Item label="High" value="High" />
              </Picker>
            </View>

            <Text style={styles.label}>Grades Offered (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={gradesOffered}
              onChangeText={setGradesOffered}
              placeholder="e.g., K, 1, 2, 3, 4, 5"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegisterSchool}>
              <Text style={styles.buttonText}>Register School</Text>
            </TouchableOpacity>
          </>
        )}

        {registrationType === 'staff' && (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
            />

            <Text style={styles.label}>School</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSchool}
                onValueChange={setSelectedSchool}
              >
                <Picker.Item label="Select a school" value="" />
                {schools.map((school) => (
                  <Picker.Item key={school._id} label={school.name} value={school._id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegisterStaff}>
              <Text style={styles.buttonText}>Register Staff</Text>
            </TouchableOpacity>
          </>
        )}

        {registrationType === 'student' && (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
            />

            <Text style={styles.label}>School</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSchool}
                onValueChange={setSelectedSchool}
              >
                <Picker.Item label="Select a school" value="" />
                {schools.map((school) => (
                  <Picker.Item key={school._id} label={school.name} value={school._id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Grade</Text>
            <TextInput
              style={styles.input}
              value={grade}
              onChangeText={setGrade}
              placeholder="Enter grade"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegisterStudent}>
              <Text style={styles.buttonText}>Register Student</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  typeSelector: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  activeTypeButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTypeButtonText: {
    color: '#fff',
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
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

export default RegisterScreen;
