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

interface Refuerzo {
  id: string;
  Materia: string;
  tema: string;
  nota: number;
  subtemasMal: string[];
}

const HomeScreen: React.FC = () => {
  const [refuerzos, setRefuerzos] = useState<Refuerzo[]>([
    {
      id: '1',
      Materia: 'Matrices ',
      tema: 'Matrices y Determinantes',
      nota: 2.5,
      subtemasMal: ['Matrices', 'Determinantes'],
    },
    {
      id: '2',
      Materia: 'Trigonometría',
      tema: 'Trigonometría',
      nota: 5.8,
      subtemasMal: ['Ángulos Notables'],
    },
    {
      id: '3',
      Materia: 'Cálculo Diferencial',
      tema: 'Cálculo Diferencial',
      nota: 8.2,
      subtemasMal: ['Límites', 'Derivadas'],
    },
  ]);

  const verRefuerzo = (tema: string) => {
    alert(`🔍 Ver detalles de: ${tema}`);
  };

  const marcarHecho = (tema: string) => {
    alert(`✅ Refuerzo "${tema}" marcado como hecho`);
  };

  const getHeaderColor = (nota: number) => {
    if (nota < 3) return styles.headerRojo;
    if (nota < 7) return styles.headerAmarillo;
    return styles.headerVerde;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={refuerzos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={[styles.cardHeader, getHeaderColor(item.nota)]}>
                <Text style={styles.headerText}>{item.Materia}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.infoText}><Text style={styles.bold}>Nota:</Text> {item.nota}</Text>
                <Text style={styles.infoText}><Text style={styles.bold}>Subtemas:</Text> {item.subtemasMal.join(', ')}</Text>
              </View>

              <View style={styles.cardButtons}>
                <TouchableOpacity style={styles.button} onPress={() => verRefuerzo(item.tema)}>
                  <Text style={styles.buttonText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => marcarHecho(item.tema)}>
                  <Text style={styles.buttonText}>Hecho</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6E6F2',
  },
  innerContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  cardHeader: {
    width: '100%',
    padding: 14,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  cardContent: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
  cardButtons: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerRojo: {
    backgroundColor: '#e53935',
  },
  headerAmarillo: {
    backgroundColor: '#fbc02d',
  },
  headerVerde: {
    backgroundColor: '#43a047',
  },
});
