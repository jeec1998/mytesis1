// screens/NotificacionesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificacionesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notificaciones</Text>
      <Text style={styles.text}>Aquí verás tus notificaciones importantes.</Text>
    </View>
  );
};

export default NotificacionesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});
