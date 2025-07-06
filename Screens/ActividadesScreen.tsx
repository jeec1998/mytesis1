import React, { useEffect, useState, useMemo } from 'react';
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

  // Function to decode JWT token and extract user ID
  const getUserIdFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
      // Split the token into its parts (header, payload, signature)
      const payload = token.split('.')[1];
      // Decode the base64-encoded payload
      const decoded = atob(payload);
      // Parse the JSON string to an object
      const obj = JSON.parse(decoded);
      // Return the user ID, checking for common field names
      return obj._id || obj.id || null;
    } catch (error) {
      // Log any errors during decoding or parsing
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Effect hook to fetch activities data when the component mounts
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('Token no disponible');
          setLoading(false);
          return;
        }

        // Extract userId from the token
        const userId = getUserIdFromToken(token);
        if (!userId) {
          console.warn('No se encontró userId en el token');
          setLoading(false);
          return;
        }

        // Make the API call to fetch academic support data
        const res = await fetch(
          `https://mentoria-api-cyffg2cdemdyfdbt.eastus2-01.azurewebsites.net/academic-support/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        // Check if the response was successful
        if (!res.ok) {
          // If not, throw an error with the status
          const errorText = await res.text();
          throw new Error(`Error al obtener actividades: ${res.status} - ${errorText}`);
        }

        // Parse the JSON response
        const data = await res.json();

        // Validate the structure of the fetched data
        if (data && data.topic && Array.isArray(data.subtopics)) {
          // Set the topic data, mapping subtopics to the correct structure
          setTopicData({
            topic: {
              _id: data.topic.id || '', // Use 'id' or '_id' as appropriate
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
          // If data structure is unexpected, set topicData to null
          setTopicData(null);
          console.warn('La estructura de datos de la API no es la esperada:', data);
        }
      } catch (error) {
        // Catch and log any errors during the fetch process
        console.error('Error cargando actividades:', error);
        // Display an alert to the user
        Alert.alert('Error', 'No se pudieron cargar las actividades');
      } finally {
        // Ensure loading state is set to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchActividades(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once after the initial render

  // Calculate the total score and determine the header color dynamically
  const { totalScore, headerColor } = useMemo(() => {
    let sumNotas = 0;
    if (topicData && topicData.subtopics) {
      // Sum all 'nota' values from subtopics, treating undefined/null as 0
      sumNotas = topicData.subtopics.reduce((acc, sub) => acc + (sub.nota || 0), 0);
    }

    let color = '#4caf50'; // Default green
    if (sumNotas < 5) {
      color = '#f44336'; // Red
    } else if (sumNotas >= 5 && sumNotas < 7) {
      color = '#ffeb3b'; // Yellow
    }
    return { totalScore: sumNotas, headerColor: color };
  }, [topicData]); // Recalculate if topicData changes

  // Display a loading indicator while data is being fetched
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </SafeAreaView>
    );
  }

  // Display a message if no activities are available after loading
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
            {/* Dynamic header background color based on totalScore */}
            <View style={[styles.cardHeader, { backgroundColor: headerColor }]}>
              <Text style={styles.headerText}>
                {topicData.topic.titulo} (Total: {totalScore.toFixed(2)}) {/* Display total score */}
              </Text>
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
  // headerVerde is no longer needed as color is dynamic
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
    // No specific styles needed here, flex: 1 is applied by tableCell
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
