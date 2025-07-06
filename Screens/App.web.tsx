import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Simple JWT decode function (does not verify signature)
function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

const App = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEdge, setIsEdge] = useState(false);

  // Detectar si el navegador es Microsoft Edge
  useEffect(() => {
    const userAgent = window.navigator.userAgent;

    // Verifica si el navegador es Edge
    if (userAgent.includes('Edge') || userAgent.includes('Edg')) {
      setIsEdge(true);  // Si es Edge, actualizar el estado
    }
  }, []);

  const handleLoginWeb = async () => {
    try {
      const res = await fetch('https://mentoria-api-cyffg2cdemdyfdbt.eastus2-01.azurewebsites.net/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('accessToken', data.accessToken);

        const payload = decodeToken(data.accessToken);
        if (!payload) {
          setError('Token inválido');
          return;
        }

        localStorage.setItem('userId', payload._id);
        localStorage.setItem('userEmail', payload.email);
        localStorage.setItem('userRole', payload.role);

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
        placeholderTextColor="#777b7f"
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
        autoCapitalize="none"
      />
      <View style={styles.inputPasswordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Contraseña"
          placeholderTextColor="#777b7f"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        {/* Mostrar ícono solo si no es Edge */}
        {!isEdge && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <FontAwesomeIcon 
              icon={showPassword ? faEye : faEyeSlash} 
              
            />
          </TouchableOpacity>
        )}
      </View>

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
    color: '#07376C',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingRight: 40, 
    color: 'black',
  },
  button: {
    backgroundColor: '#07376C',
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
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 7,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  inputPasswordContainer: {
    width: '100%',
    position: 'relative',
    marginTop: 15,
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
});

export default App;
