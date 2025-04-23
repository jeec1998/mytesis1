import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// 🔑 Función para decodificar JWT
interface JwtPayload {
  _id: string;
  email: string;
  role: 'admin' | 'docente' | 'alumno';
  iat?: number;
  exp?: number;
}

const decodeToken = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (err) {
    console.error('Error decodificando el token:', err);
    return null;
  }
};


const App = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginWeb = async () => {
    try {
      const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('accessToken', data.accessToken);

        // Decodifica el token y extrae los datos
        const payload = decodeToken(data.accessToken);
        if (!payload) {
          setError('Token inválido');
          return;
        }

        // Guarda datos útiles
        localStorage.setItem('userId', payload._id);
        localStorage.setItem('userEmail', payload.email);
        localStorage.setItem('userRole', payload.role);

        // Redirige según el rol
        if (payload.role === 'admin') {
          window.location.href = '/admin.html';
        } else if (payload.role === 'docente') {
          window.location.href = '/home.html';
        } else if (payload.role === 'alumno') {
          window.location.href = '/home-alumno.html';
        } else {
          setError('Rol desconocido');
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLoginWeb}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 14,
    textAlign: 'center',
  },
});

export default App;
