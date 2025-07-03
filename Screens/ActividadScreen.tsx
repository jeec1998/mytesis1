import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Rect } from 'react-native-svg';
import PdfIcons from '../components/material-icon-theme--pdf';
import WordIcons from '../components/vscode-icons--file-type-word';
import ExcelIcons from '../components/vscode-icons--file-type-excel';
import YoutubeIcons from '../components/logos--youtube-icon';
import ImageIcons from '../components/fluent-color--image-16';
import AudioIcons from '../components/icon-park--audio-file';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';

interface Recurso {
  titulo: string;
  tipo: string;
  descripcion: string;
  dropbox_url?: string;
}

interface ActividadDeRefuerzo {
  descripcion_general: string;
  pasos: string[];
  tipo_documento_entregable: string;
  objetivo: string;
}

interface Generated {
  recursos_recomendados?: Recurso[];
  actividad_de_refuerzo?: ActividadDeRefuerzo;
}

const DefaultIcon = (props: { size?: number }) => (
  <Svg width={props.size || 70} height={props.size || 70} viewBox="0 0 24 24" fill="none">
    <Rect width="24" height="24" fill="#999" rx="3" />
    <Path fill="#666" d="M8 8h8v8H8z" />
  </Svg>
);

type ActividadScreenRouteProp = RouteProp<RootStackParamList, 'ActividadScreen'>;

const screenWidth = Dimensions.get('window').width;
const carouselWidth = screenWidth * 0.9;

const ActividadScreen: React.FC = () => {
  const route = useRoute<ActividadScreenRouteProp>();
  const { topicId } = route.params;

  const [generated, setGenerated] = useState<Generated | null>(null);
  const [loading, setLoading] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const getUserDataFromToken = (token: string | null) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      const obj = JSON.parse(decoded);
      return {
        userId: obj._id || obj.id || null,
        nombre: obj.nombre || obj.name || '',
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'No se encontró token de acceso');
          setLoading(false);
          return;
        }
        const userData = getUserDataFromToken(token);
        if (!userData?.userId) {
          Alert.alert('Error', 'Usuario no identificado');
          setLoading(false);
          return;
        }
        setNombreUsuario(userData.nombre);
        const res = await fetch(
          `http://localhost:3000/academic-support/user/${userData.userId}/topic/${topicId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error('Error al obtener datos');

        const data = await res.json();

        if (data.generated) {
          try {
            const parsed = JSON.parse(data.generated);
            setGenerated(parsed);
          } catch (e) {
            console.error('Error parseando generated:', e);
            setGenerated(null);
          }
        } else {
          setGenerated(null);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const openUrl = async (url: string | undefined) => {
    if (!url) return;

    let modifiedUrl = url.trim();
    if (!modifiedUrl.startsWith('http://') && !modifiedUrl.startsWith('https://')) {
      modifiedUrl = 'https://' + modifiedUrl;
    }

    if (modifiedUrl.includes('dropbox.com')) {
      if (modifiedUrl.includes('dl=1')) {
        modifiedUrl = modifiedUrl.replace('dl=1', 'dl=0');
      } else if (!modifiedUrl.includes('dl=0')) {
        modifiedUrl += modifiedUrl.includes('?') ? '&dl=0' : '?dl=0';
      }
    }

    try {
      const supported = await Linking.canOpenURL(modifiedUrl);
      if (!supported) {
        Alert.alert('Error', 'No se pudo abrir el enlace');
        return;
      }
      await Linking.openURL(modifiedUrl);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el enlace');
    }
  };

  const getIconByTipo = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes('pdf')) return PdfIcons;
    if (t.includes('word') || t.includes('doc')) return WordIcons;
    if (t.includes('excel')) return ExcelIcons;
    if (t.includes('video') || t.includes('mp4') || t.includes('youtube')) return YoutubeIcons;
    if (
      t.includes('imagen') ||
      t.includes('image') ||
      t.includes('jpeg') ||
      t.includes('jpg') ||
      t.includes('png')
    )
      return ImageIcons;
    if (t.includes('audio')) return AudioIcons;
    return DefaultIcon;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / carouselWidth);
    setActiveIndex(newIndex);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        {generated?.recursos_recomendados && generated.recursos_recomendados.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📘 Recursos Recomendados</Text>
            {generated.recursos_recomendados.map((recurso, idx) => {
              const IconComponent = getIconByTipo(recurso.tipo);
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.resourceRow}
                  onPress={() => openUrl(recurso.dropbox_url)}
                >
                  <IconComponent size={baseIconSize} />
                  <View style={styles.resourceTextContainer}>
                    <Text style={styles.resourceTitle}>{recurso.titulo}</Text>
                    <Text style={styles.resourceLink}>Abrir recurso</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {generated?.actividad_de_refuerzo && (
          <View style={[styles.section, { marginTop: 10 }]}>
            <Text style={styles.sectionTitle}>📗 Actividad de Refuerzo</Text>

            <Text style={styles.normalText}>{generated.actividad_de_refuerzo.descripcion_general}</Text>
            <View style={{ marginTop: 12, width: carouselWidth, alignSelf: 'center' }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                contentContainerStyle={styles.carouselContainer}
                onMomentumScrollEnd={handleScroll}
              >
                {generated.actividad_de_refuerzo.pasos.map((paso, i) => (
                  <View key={i} style={[styles.carouselItem, { width: carouselWidth }]}>
                    <Text style={styles.carouselStepNumber}>Paso {i + 1}</Text>
                    <Text style={styles.carouselStepText}>{paso}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.pagination}>
                {generated.actividad_de_refuerzo.pasos.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === activeIndex ? styles.activeDot : null]}
                  />
                ))}
              </View>
            </View>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const baseIconSize = 70;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  containerCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D6E6F2' },

  mainContent: {
    paddingTop: 30,
    paddingBottom: 60,
  },

  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    boxShadow: Platform.OS === 'ios' ? '0 0 10px rgba(0,0,0,0.1)' : undefined,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  sectionTitle: {
    color: '#2F80ED',
    fontSize: 22,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  icon: {
    width: baseIconSize,
    height: baseIconSize,
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  resourceLink: {
    fontSize: 12,
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },

  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    alignContent: 'center',
    textAlign: 'justify',
  },
  normalText: {
    fontWeight: 'normal',
    marginTop: 10,
    fontSize: 14,
    marginVertical: 3,
    textAlign: 'justify',
  },

  carouselContainer: {
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  carouselItem: {
    backgroundColor: '#E8F0FE',
    borderRadius: 20,
    padding: 10,
    paddingLeft: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    shadowColor: '#000',
    elevation: 3,
  },
  carouselStepNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#2F80ED',
  },
  carouselStepText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify',
    marginRight: 10,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#2F80ED',
    width: 10,
    height: 10,
  },
});

export default ActividadScreen;
