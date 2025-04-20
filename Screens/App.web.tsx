import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

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
        window.location.href = '/home.html';
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
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Ingresar" onPress={handleLoginWeb} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: '100%', height: 45, borderWidth: 1, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#fff' },
  error: { color: 'red', marginTop: 10 },
});

export default App;
