import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

interface Subtopic {
  _id: string;
  titulo: string;
  nota?: number;
  notaMaxima?: number;
}

interface TopicData {
  topic: {
    _id: string;
    titulo: string;
  };
  subtopics: Subtopic[];
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Actividades'>;
}

const ActividadesScreen: React.FC<Props> = ({ navigation }) => {
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = (token: string | null): string | null => {
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

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('Token no disponible');
          setLoading(false);
          return;
        }
        const userId = getUserIdFromToken(token);
        if (!userId) {
          console.warn('No se encontró userId en el token');
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://mentoria-api-cyffg2cdemdyfdbt.eastus2-01.azurewebsites.net/academic-support/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (!res.ok) throw new Error('Error al obtener actividades');

        const data = await res.json();

        if (data && data.topic && Array.isArray(data.subtopics)) {
          setTopicData({
            topic: {
              _id: data.topic.id || '', // revisa cuál es el campo correcto
              titulo: data.topic.titulo || data.topic.name || 'Sin título',
            },
            subtopics: data.subtopics.map((s: any) => ({
              _id: s._id,
              titulo: s.titulo || s.name || 'Sin título',
              nota: s.nota,
              notaMaxima: s.notaMaxima,
            })),
          });
        } else {
          setTopicData(null);
        }
      } catch (error) {
        console.error('Error cargando actividades:', error);
        Alert.alert('Error', 'No se pudieron cargar las actividades');
      } finally {
        setLoading(false);
      }

    };

    fetchActividades();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </SafeAreaView>
    );
  }

  if (!topicData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No hay actividades disponibles.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={[styles.cardHeader, styles.headerVerde]}>
              <Text style={styles.headerText}>{topicData.topic.titulo}</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.cellTitle]}>Subtema</Text>
                <Text style={[styles.tableCell, styles.cellCenter]}>Calificación</Text>
                <Text style={[styles.tableCell, styles.cellCenter]}>Calificación máxima</Text>
              </View>

              {topicData.subtopics.map((sub) => (
                <View key={sub._id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.cellTitle]}>{sub.titulo}</Text>
                  <Text style={[styles.tableCell, styles.cellCenter]}>{sub.nota ?? 'N/A'}</Text>
                  <Text style={[styles.tableCell, styles.cellCenter]}>{sub.notaMaxima ?? 'N/A'}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.btnVer}
              onPress={() => {
                console.log('Navegando a ActividadScreen con topicId:', topicData.topic._id);
                navigation.navigate('ActividadScreen', { topicId: topicData.topic._id });
              }}
            >
              <Text style={styles.btnVerText}>Ver Refuerzo</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: {
    padding: 30,
    alignItems: 'center',
  },
  card: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 14,
  },
  headerVerde: {
    backgroundColor: '#4caf50',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  cardContent: {
    padding: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#4caf50',
    paddingBottom: 6,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    textAlign: 'center',

  },
  cellTitle: {
    flex: 2,
    textAlign: 'left',
  },
  cellCenter: {

  },
  btnVer: {
    margin: 10,
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnVerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ActividadesScreen;
