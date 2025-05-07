import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { API } = process.env;
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

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('Error', 'Token no disponible');
      return;
    }

    const updatedUser = {
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
    };

    try {
      const res = await fetch(
        `https://7c77-2800-bf0-240f-1059-2592-546e-3894-94dc.ngrok-free.app/users/actualizar`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        getProfile(); 
        setIsEditing(false); 
      } else {
        Alert.alert('Error', data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    onLogout();
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Token no disponible');

      const res = await fetch(
        `https://7c77-2800-bf0-240f-1059-2592-546e-3894-94dc.ngrok-free.app/users/perfil`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={user.nombre}
            onChangeText={(text) => setUser({ ...user, nombre: text })}
          />
        ) : (
          <Text style={styles.value}>{user.nombre}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Correo electrónico</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={user.correo}
            onChangeText={(text) => setUser({ ...user, correo: text })}
          />
        ) : (
          <Text style={styles.value}>📧 {user.correo}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Teléfono</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={user.telefono}
            onChangeText={(text) => setUser({ ...user, telefono: text })}
          />
        ) : (
          <Text style={styles.value}>📱 {user.telefono}</Text>
        )}
      </View>

      {isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: '#E94E4E', marginTop: 15 }]}
        onPress={handleLogout}
      >
        <Text style={styles.editButtonText}>🔒 Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginTop: 5,
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

export default ProfileScreen;
