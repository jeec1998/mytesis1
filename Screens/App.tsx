import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import NotificacionesScreen from './NotificacionesScreen';
import CustomDrawer from './CustomDrawer';
import LoginScreen from './LoginScreen';

export type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined; 
  Perfil: undefined;
  Notificaciones: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="HomeScreen" options={{
              title: 'Inicio',
              headerStyle: {
                backgroundColor: '#2F80ED', 
              },
              headerTintColor: 'white', 
              headerTitleStyle: {
               
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={{ paddingLeft: 15 }}
                >
                  <Text style={{ fontSize: 30 }}>☰</Text>
                </TouchableOpacity>
              ),
            }}>
              {(props) => (
                <>
                  <CustomDrawer
                    visible={menuVisible}
                    onClose={() => setMenuVisible(false)}
                    navigation={props.navigation}
                  />
                  <HomeScreen {...props} />
                </>
              )}
            </Stack.Screen>

            <Stack.Screen name="Perfil">
              {(props) => (
                <ProfileScreen {...props} onLogout={() => setIsLoggedIn(false)} />
              )}
            </Stack.Screen>

            <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
