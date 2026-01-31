import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import BellScheduleScreen from '../screens/BellScheduleScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import CreateScheduleScreen from '../screens/CreateScheduleScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Timely' }}
            />
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{ title: 'Calendar' }}
            />
            <Stack.Screen
              name="BellSchedule"
              component={BellScheduleScreen}
              options={{ title: 'Bell Schedule' }}
            />
            {user.role === 'admin' && (
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Register' }}
              />
            )}
            {user.role === 'staff' && (
              <>
                <Stack.Screen
                  name="CreateEvent"
                  component={CreateEventScreen}
                  options={{ title: 'Create Event' }}
                />
                <Stack.Screen
                  name="CreateSchedule"
                  component={CreateScheduleScreen}
                  options={{ title: 'Create Schedule' }}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
