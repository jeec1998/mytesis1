import React, { useEffect, useRef } from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { useNavigationState, NavigationProp } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface Props {
  visible: boolean;
  onClose: () => void;
  navigation: NavigationProp<any>;
}

const CustomDrawer: React.FC<Props> = ({ visible, onClose, navigation }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  const state = useNavigationState((state) => state);
  const currentRouteName = state.routes[state.index].name;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const goToScreen = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.menuContent}>
          <View>
            {currentRouteName !== 'Home' && (
              <TouchableOpacity onPress={() => goToScreen('Home')}>
                <Text style={styles.drawerItem}>🏠 Materias</Text>
              </TouchableOpacity>
            )}
            {currentRouteName !== 'Perfil' && (
              <TouchableOpacity onPress={() => goToScreen('Perfil')}>
                <Text style={styles.drawerItem}>👤 Perfil</Text>
              </TouchableOpacity>
            )}
          
          </View>
          <TouchableOpacity>
            <Text style={[styles.drawerItem, styles.logout]}>📤 Cerrar sesión</Text>
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
    width: screenWidth * 0.65,
    backgroundColor: '#D6E6F2',
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
    borderBottomColor: '#A7C7E7',
    color: '#2F4F6E',
    fontWeight: '500',
  },
  logout: {
    color: '#C62828',
    borderBottomColor: '#C62828',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: screenWidth * 0.65,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
