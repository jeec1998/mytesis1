import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificacionesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notificaciones</Text>
      <Text style={styles.text}>
        Aquí verás tus notificaciones importantes.
      </Text>
    </View>
  );
};

export default NotificacionesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D6E6F2',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F80ED',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
});
