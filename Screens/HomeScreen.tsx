import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

interface Refuerzo {
  id: string;
  Materia: string;
  descripcion: string;
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [refuerzos] = useState<Refuerzo[]>([
    { id: '1', Materia: 'Álgebra Lineal', descripcion: 'Matrices y Determinantes' },
    { id: '2', Materia: 'Trigonometría', descripcion: 'Ángulos Notables' },
    { id: '3', Materia: 'Cálculo Diferencial', descripcion: 'Límites y Derivadas' },
  ]);

  const abrirActividades = (refuerzo: Refuerzo) => {
    navigation.navigate('Actividades', { refuerzo });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.innerContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={refuerzos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => abrirActividades(item)}>
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>{item.Materia}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.descriptionText}>{item.descripcion}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D6E6F2' },
  innerContainer: { flex: 1 },
  listContent: { padding: 20, gap: 20, justifyContent: 'center' },
  row: { justifyContent: 'space-evenly', marginBottom: 20 },
  card: {
    backgroundColor: 'white',
    width: 160,
    height: 230,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardHeader: {
    width: '100%',
    padding: 12,
    backgroundColor: '#2F80ED',
    alignItems: 'center',
  },
  headerText: { fontWeight: 'bold', color: 'white', fontSize: 15, textAlign: 'center' },
  cardContent: { flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' },
  descriptionText: { fontSize: 13, color: '#444', textAlign: 'center' },
});
