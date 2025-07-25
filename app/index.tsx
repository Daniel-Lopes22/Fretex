import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

type LocationCoords = {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
};

export default function Index() {
  const [enderecoOrigem, setEnderecoOrigem] = useState<string>('');
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [markerCoords, setMarkerCoords] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar localização negada!');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);

      // Inicialmente o mapa centraliza na localização do usuário
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const buscarEndereco = async () => {
    if (!enderecoOrigem.trim()) return;

    setLoading(true);
    try {
      const resultados = await Location.geocodeAsync(enderecoOrigem);
      if (resultados.length > 0) {
        const { latitude, longitude } = resultados[0];

        // Atualiza a região do mapa para o endereço buscado
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Atualiza as coordenadas do marcador para o endereço buscado
        setMarkerCoords({ latitude, longitude });

        Keyboard.dismiss();
      } else {
        Alert.alert('Endereço não encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro ao buscar endereço.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TextInput
          placeholder="Digite o endereço de origem"
          style={styles.headerInput}
          value={enderecoOrigem}
          onChangeText={setEnderecoOrigem}
          onSubmitEditing={buscarEndereco}
          returnKeyType="search"
          editable={!loading}
        />
        <TouchableOpacity style={styles.buttonBuscar} onPress={buscarEndereco} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {errorMsg ? (
          <Text>{errorMsg}</Text>
        ) : mapRegion && userLocation ? (
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            followsUserLocation={false} // para não seguir usuário automaticamente
          >
            {markerCoords && <Marker coordinate={markerCoords} />}
          </MapView>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Botão 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={() => {}}>
          <Text style={styles.buttonText}>Botão 2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF5722' }]} onPress={() => {}}>
          <Text style={styles.buttonText}>Botão 3</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },

  headerInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    fontSize: 16,
    borderRadius: 20,
  },

  buttonBuscar: {
    marginLeft: 10,
    backgroundColor: '#2196F3',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },

  content: { flex: 1 },

  map: { flex: 1 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },

  button: {
    flex: 0.9,
    marginHorizontal: 5,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
