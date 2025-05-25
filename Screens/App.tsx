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
import ActividadesScreen from './ActividadesScreen';
import NewPasswordScreen from './NewPasswordScreen';
import ActividadScreen from './ActividadScreen';
export type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  Perfil: undefined;
  Notificaciones: undefined;
  Actividades: { refuerzo: { id: string; Materia: string; descripcion: string } };
  NewPasswordScreen: undefined;
  ActividadScreen: undefined;
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
            <Stack.Screen
              name="HomeScreen"
              options={{
                title: 'INICIO',
                headerStyle: {
                  backgroundColor: '#2F80ED', 
                },
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    style={{ paddingLeft: 10, width: 40, justifyContent: 'center', paddingRight: -50 }}
                  >
                    <Text style={{ fontSize: 30, color: 'white' }}>☰</Text>
                  </TouchableOpacity>
                ),
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: 'white',
                },
              }}
            >
              {(props) => (
                <>
                  <CustomDrawer
                    visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  navigation={props.navigation}
  onLogout={() => setIsLoggedIn(false)}  // <--- pasa la función aquí
                    
                  />
                  <HomeScreen {...props} />
                </>
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Perfil"
              options={{
                title: 'PERFIL',
                headerStyle: {
                  backgroundColor: '#2F80ED',
                },
                headerTintColor: 'white',
              }}
            >
              {(props) => (
                <ProfileScreen {...props} onLogout={() => setIsLoggedIn(false)} />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="NewPasswordScreen"
              component={NewPasswordScreen}
              options={{
                title: 'CONTRSEÑA',
                headerStyle: {
                  backgroundColor: '#2F80ED',
                },
                headerTintColor: 'white',
              }}
            />
             <Stack.Screen
              name="ActividadScreen"
              component={ActividadScreen}
              options={{
                title: 'Actividad',
                headerStyle: {
                  backgroundColor: '#2F80ED',
                },
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen
              name="Actividades"
              component={ActividadesScreen}
              options={{
                title: 'Refuerzo',
                headerStyle: {
                  backgroundColor: '#2F80ED',
                },
                headerTintColor: 'white',
              }}
            />

            <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
