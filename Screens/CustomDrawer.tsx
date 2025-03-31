// components/CustomDrawer.tsx
import React, { useEffect } from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface Props {
  visible: boolean;
  onClose: () => void;
  navigation: NavigationProp<any>;
}

const CustomDrawer: React.FC<Props> = ({ visible, onClose, navigation }) => {
  const translateX = new Animated.Value(-screenWidth);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const goToProfile = () => {
    onClose(); // Cierra el menú
    navigation.navigate('Perfil');
   
  };
  const goToNotificaciones = () => {
    onClose(); ;
    navigation.navigate('Notificaciones');
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.menuContent}>
          <View>
            <TouchableOpacity onPress={goToProfile}>
              <Text style={styles.drawerItem}>👤 Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNotificaciones}>
    <Text style={styles.drawerItem}>🔔 Notificaciones</Text>
  </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.drawerItem}>📤 Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: screenWidth * 0.6,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    elevation: 5,
    zIndex: 10,
  },
  menuContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  drawerItem: {
    fontSize: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: screenWidth * 0.6,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
