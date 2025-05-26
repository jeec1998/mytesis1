import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInputMask } from 'react-native-masked-text';

const { API } = process.env;

type Props = {
  navigation: NativeStackNavigationProp<any>;
  onLogout: () => void;
};

const ProfileScreen: React.FC<Props> = ({ navigation, onLogout }) => {
  const [user, setUser] = useState({
    nombre: '',
    correo: '',
    nombreUsuario: '',
    telefono: '',
  });

  const [originalUser, setOriginalUser] = useState(user); // Para guardar datos originales
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const mostrarAlerta = (mensaje: string) => {
    setAlertMessage(mensaje);
    setShowModal(true);
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Token no disponible');

      const res = await fetch(`https://mentoria-api-cyffg2cdemdyfdbt.eastus2-01.azurewebsites.net/users/perfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const perfil = {
        nombre: data.usuario.nombre || '',
        nombreUsuario: data.usuario.nombreUsuario || '',
        correo: data.usuario.correo || '',
        telefono: data.usuario.telefono || '',
      };
      setUser(perfil);
      setOriginalUser(perfil); // Guarda el perfil original
    } catch (error) {
      console.error('❌ Error al obtener perfil:', error);
      mostrarAlerta('No se pudo obtener el perfil');
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleEdit = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      mostrarAlerta('Token no disponible');
      return;
    }

    const telefonoValido = /^\+593 \d{2} \d{3} \d{4}$/.test(user.telefono.trim());

    if (!telefonoValido) {
      mostrarAlerta('El número debe estar en el formato +593 99 999 9999');
      return;
    }

    const updatedUser = {
      nombre: user.nombre,
      nombreUsuario: user.nombreUsuario,
      telefono: user.telefono,
    };

    setIsLoading(true);

    try {
      const res = await fetch(`https://mentoria-api-cyffg2cdemdyfdbt.eastus2-01.azurewebsites.net/users/actualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();
      if (res.ok) {
        mostrarAlerta('Perfil actualizado correctamente');
        getProfile();
        setIsEditing(false);
      } else {
        mostrarAlerta(data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      mostrarAlerta('No se pudo actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUser(originalUser); // Restaura los datos originales
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    onLogout();
  };

  const handleChangePassword = () => {
    navigation.navigate('NewPasswordScreen');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={[styles.name, styles.uppercaseText]}>{user.nombre}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Usuario</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={user.nombreUsuario}
              onChangeText={(text) => setUser({ ...user, nombreUsuario: text })}
            />
          ) : (
            <Text style={[styles.value]}>👤 {user.nombreUsuario}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.value}>📧 {user.correo}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Teléfono</Text>
          {isEditing ? (
            <TextInputMask
              type={'custom'}
              options={{
                mask: '+593 99 999 9999',
              }}
              style={styles.input}
              value={user.telefono}
              onChangeText={(text) => setUser({ ...user, telefono: text })}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={[styles.value, styles.uppercaseText]}>📱 {user.telefono}</Text>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2F80ED" />
        ) : isEditing ? (
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.editButton, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.editButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.editButton, { backgroundColor: '#E0A800' }]} onPress={handleChangePassword}>
          <Text style={styles.editButtonText}>🔑 Cambiar Contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: '#E94E4E', marginTop: 15 }]}
          onPress={handleLogout}
        >
          <Text style={styles.editButtonText}>🔒 Cerrar sesión</Text>
        </TouchableOpacity>

        {/* MODAL DE ALERTA */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>⚠ Atención</Text>
              <Text style={styles.modalMessage}>{alertMessage}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E6F2',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2F4F6E',
    alignItems: 'center',
    textAlign: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#EDF4FB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
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
    color: '#000',
  },
  editButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#A0A0A0',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
