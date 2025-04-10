import React, { useState } from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

// Solo para Android/iOS:
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import NotificacionesScreen from './NotificacionesScreen';
import CustomDrawer from './CustomDrawer';
import LoginScreen from './LoginScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 👉 Si es Web: mostrar pantalla personalizada
  if (Platform.OS === 'web') {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLoginWeb = () => {
      window.location.href = '/home.html';
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión (Web)</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Ingresar" onPress={handleLoginWeb} />
      </View>
    );
  }
  

  // 👉 Si es Android/iOS: usar navegación nativa
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              options={{
                title: 'Inicio',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ paddingLeft: 15 }}>
                    <Text style={{ fontSize: 30 }}>☰</Text>
                  </TouchableOpacity>
                ),
              }}
            >
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
            <Stack.Screen name="Perfil" component={ProfileScreen} />
            <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default App;
