import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
const { API } = process.env; // Asegúrate de que la variable de entorno esté configurada correctamente
type Props = {
  navigation: NativeStackNavigationProp<any>;
  onLogout: () => void;
};

const ProfileScreen: React.FC<Props> = ({ navigation, onLogout }) => {
  const [user, setUser] = useState({
    nombre: '',
    correo: '',
    telefono: '',
  });

  const handleEdit = () => {
    Alert.alert('Editar perfil', 'Funcionalidad aún no implementada.');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    onLogout();
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Token no disponible');

      const res = await fetch(`${API}/users/perfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      

      const data = await res.json();
      setUser({
        nombre: data.usuario.nombre || '',
        correo: data.usuario.correo || '',
        telefono: data.usuario.telefono || '',
      });
    } catch (error) {
      console.error('❌ Error al obtener perfil:', error);
      Alert.alert('Error', 'No se pudo obtener el perfil');
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.nombre}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre completo</Text>
        <Text style={styles.value}>{user.nombre}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={styles.value}>📧 {user.correo}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>📱 {user.telefono}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.editButton, { backgroundColor: '#E94E4E', marginTop: 15 }]} onPress={handleLogout}>
        <Text style={styles.editButtonText}>🔒 Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#D6E6F2',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2F4F6E',
  },
  card: {
    width: '85%',
    backgroundColor: '#EDF4FB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
