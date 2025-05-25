import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

const { API } = process.env;

type Props = NativeStackScreenProps<RootStackParamList, 'Login'> & {
  onLogin: () => void;
};

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario, password }),
      });

      if (res.ok) {
        const data = await res.json();
        await AsyncStorage.setItem('accessToken', data.accessToken);
        if (Platform.OS === 'web') {
          window.location.href = '/home.html';
        } else {
          onLogin();
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error(err);
      setError('Error de red: no se pudo conectar al servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: '#4A9EE9' }]}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#777b7f"
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
        autoCapitalize="none"
      />

      {/* Contenedor input + icono */}
      <View style={styles.inputPasswordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Contraseña"
          placeholderTextColor="#777b7f"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 24 }}>{showPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Cargando...' : 'Ingresar'}
        </Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 30, fontWeight: 'bold' },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 6,
    width: '100%',
  },
 
  inputPasswordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
   
  },
  inputPassword: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingRight: 40, 
    color: 'black',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 7,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginTop: 10, textAlign: 'center' },
});

export default LoginScreen;
