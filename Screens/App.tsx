// App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import CustomDrawer from './CustomDrawer';
import NotificacionesScreen from './NotificacionesScreen';
const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ paddingLeft: 15 }}>
              <Text style={{ fontSize: 24 }}>☰</Text>
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen name="Home" options={{ title: 'Inicio' }}>
          {(props) => (
            <>
              <CustomDrawer
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                navigation={props.navigation}
              />
              <HomeScreen {...props} />
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="Perfil" component={ProfileScreen} />
        <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
