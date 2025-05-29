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

const ActividadScreen: React.FC = () => {
  const route = useRoute<ActividadScreenRouteProp>();
  const { topicId } = route.params;
  console.log('topicId:', topicId);

  const [generated, setGenerated] = useState<Generated | null>(null);
  const [loading, setLoading] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState('');

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
      console.log('user',userData.userId);
        const res = await fetch(
          `https://mentoria-api-cyffg2cdemdyfdbt.eastus2-01.azurewebsites.net/academic-support/user/${userData.userId}/topic/${topicId}`,
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

    // Para Dropbox, no forzar descarga sino vista previa (dl=0)
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
          <View style={[styles.section, { marginTop: 30 }]}>
            <Text style={styles.sectionTitle}>📗 Actividad de Refuerzo</Text>
            <Text style={styles.boldText}>
              Descripción general:{' '}
              <Text style={styles.normalText}>{generated.actividad_de_refuerzo.descripcion_general}</Text>
            </Text>
            <Text style={styles.boldText}>Pasos:</Text>
            {generated.actividad_de_refuerzo.pasos.map((paso, i) => (
              <Text key={i} style={styles.normalText}>
                {paso}
              </Text>
            ))}
            <Text style={styles.boldText}>
              Tipo de documento entregable:{' '}
              <Text style={styles.normalText}>{generated.actividad_de_refuerzo.tipo_documento_entregable}</Text>
            </Text>
            <Text style={styles.boldText}>
              Objetivo:{' '}
              <Text style={styles.normalText}>{generated.actividad_de_refuerzo.objetivo}</Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const baseIconSize = 70;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'withe' },
  containerCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D6E6F2' },

  mainContent: {
    padding: 30,
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
    marginBottom: 15,
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
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 14,
    marginVertical: 3,
  },
});

export default ActividadScreen;
