import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const handleEdit = () => {
    Alert.alert('Editar perfil', 'Funcionalidad aún no implementada.');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Juan Pérez</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre completo</Text>
        <Text style={styles.value}>Juan Antonio Pérez Andrade</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={styles.value}>📧 juan.perez@email.com</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>📱 +593 987654321</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#2F80ED',
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
    marginTop: 30,
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
