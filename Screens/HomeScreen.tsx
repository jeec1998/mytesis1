import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Refuerzo {
  id: string;
  Materia: string;
  descripcion: string;
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
}

const { API } = process.env;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [refuerzos, setRefuerzos] = useState<Refuerzo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('Token no disponible');
          setLoading(false);
          return;
        }

        const getUserIdFromToken = (token: string | null) => {
          if (!token) return null;
          try {
            const payload = token.split('.')[1];
            const decoded = atob(payload);
            const obj = JSON.parse(decoded);
            return obj._id || obj.id || null;
          } catch {
            return null;
          }
        };

        const userId = getUserIdFromToken(token);
        if (!userId) {
          console.warn('No se encontró userId en el token');
          setLoading(false);
          return;
        }

        const res = await fetch(`https://mentoria-api-cyffg2cdemdyfdbt.eastus2-01.azurewebsites.net/users/${userId}/materia`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener materias');
        }

        const data = await res.json();
        console.log('Materias obtenidas:', data);

        const materias: Refuerzo[] = data.map((item: any) => ({
          id: item._id,
          Materia: item.name || 'Sin nombre',
          descripcion: 'Sin descripción',
        }));

        setRefuerzos(materias);
      } catch (error) {
        console.error('Error cargando materias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterias();
  }, []);

  // Función para obtener color según nombre de la materia
  const getHeaderColor = (materia: string) => {
    const name = materia.toLowerCase();
    if (name.includes('matemáticas') || name.includes('matematicas')) return '#4caf50'; // verde
    if (name.includes('lengua y literatura')) return '#ff9800'; // naranja
    if (name.includes('sociales')) return '#9c27b0'; // morado
    if (name.includes('naturales')) return '#f44336'; // rojo
    if (name.includes('inglés') || name.includes('ingles')) return '#ffeb3b'; // amarillo
    return '#2F80ED'; // azul por defecto
  };

const abrirActividades = (refuerzo: Refuerzo) => {
  setRefuerzos((prev) => {
    const nuevos = prev.filter((r) => r.id !== refuerzo.id);
    return [refuerzo, ...nuevos];
  });
  navigation.navigate('Actividades', { refuerzo });
};

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={refuerzos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => abrirActividades(item)}>
              <View style={[styles.cardHeader, { backgroundColor: getHeaderColor(item.Materia) }]}>
                <Text style={[styles.headerText, styles.uppercaseText]}>{item.Materia}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.descriptionText}>{item.descripcion}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
              <Text>No tienes materias asignadas</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D6E6F2' },
  innerContainer: { flex: 1 },
  listContent: { padding: 5, justifyContent: 'center' },
  row: {
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
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
    marginHorizontal: 8,
  },
  cardHeader: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
});
