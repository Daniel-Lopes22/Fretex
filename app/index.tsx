import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const CHAVE_API = "pk.5a5c1619abd2908dcdf0dbff0d13c267";

export default function TelaInicial() {
  const [consulta, setConsulta] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [regiao, setRegiao] = useState(null);
  const [localPesquisa, setLocalPesquisa] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enderecoDestino, setEnderecoDestino] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão para localização negada');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegiao({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const buscarSugestoes = async (texto) => {
    setConsulta(texto);
    if (texto.length < 3) {
      setSugestoes([]);
      return;
    }

    try {
      const resposta = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${CHAVE_API}&q=${encodeURIComponent(texto)}&limit=5&format=json`
      );
      const dados = await resposta.json();
      setSugestoes(dados);
    } catch (erro) {
      console.log("Erro ao buscar endereço:", erro);
    }
  };

  const selecionarSugestao = (item) => {
    setConsulta(item.display_name);
    setSugestoes([]);
    setEnderecoDestino(item);
    setMostrarFormulario(true);

    if (item.lat && item.lon) {
      const novaRegiao = {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegiao(novaRegiao);
      setLocalPesquisa({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) });
    }
  };

  const Formulario = () => {
    const [enderecoOrigem, setEnderecoOrigem] = useState("Sua localização atual");
    const [pesoCarga, setPesoCarga] = useState('');
    const [dimensoesCarga, setDimensoesCarga] = useState('');

    return (
      <View style={estilos.formulario}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Formulário de Envio</Text>

        <Text>Endereço de Partida:</Text>
        <TextInput style={estilos.inputFormulario} value={enderecoOrigem} onChangeText={setEnderecoOrigem} />

        <Text>Endereço de Destino:</Text>
        <TextInput
          style={estilos.inputFormulario}
          value={enderecoDestino?.display_name || ''}
          editable={false}
        />

        <Text>Peso da carga:</Text>
        <TextInput
          style={estilos.inputFormulario}
          value={pesoCarga}
          onChangeText={setPesoCarga}
          keyboardType="numeric"
        />

        <Text>Dimensões da carga:</Text>
        <TextInput
          style={estilos.inputFormulario}
          value={dimensoesCarga}
          onChangeText={setDimensoesCarga}
        />

        <View style={{ height: 100, backgroundColor: '#ddd', marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Aqui poderá ser a área para foto</Text>
        </View>

        <Button title="Fechar Formulário" onPress={() => setMostrarFormulario(false)} />
      </View>
    );
  };

  return (
    <SafeAreaView style={estilos.container} edges={['top', 'left', 'right', 'bottom']}>
  {!mostrarFormulario && (
    <View style={{ flex: 1 }}>
      {/* Área do input */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <TextInput
          placeholder="Digite o endereço"
          value={consulta}
          onChangeText={buscarSugestoes}
          placeholderTextColor="#6B7280"
          style={estilos.input}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* FlatList só aparece se tiver sugestões */}
      {sugestoes.length > 0 && (
        <FlatList
          data={sugestoes}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={estilos.itemSugestao} onPress={() => selecionarSugestao(item)}>
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
          style={{ maxHeight: 150, marginHorizontal: 16 }}
        />
      )}

      {/* Mapa ocupando o resto */}
      <View style={{ flex: 1 }}>
        {regiao && (
          <MapView
            style={{ flex: 1 }}
            region={regiao}
            showsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
          >
            {localPesquisa && (
              <Marker
                coordinate={localPesquisa}
                title="Destino selecionado"
                pinColor="red"
              />
            )}
          </MapView>
        )}
      </View>
    </View>
  )}

  {mostrarFormulario && <Formulario />}

  {!mostrarFormulario && (
    <SafeAreaView edges={['bottom']} style={estilos.containerbotao}>
      <TouchableOpacity style={estilos.botao}>
        <Text style={estilos.textoBotao}>Teste</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.botao}>
        <Text style={estilos.textoBotao}>Teste</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.botao}>
        <Text style={estilos.textoBotao}>Teste</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )}
</SafeAreaView>


  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  areaInput: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
    elevation: 2,
  },
  itemSugestao: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    elevation: 1,
  },
  mapa: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  containerbotao: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FDBA74',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  botao: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FE923C',
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formulario: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputFormulario: {
    backgroundColor: '#eee',
    marginVertical: 8,
    padding: 10,
    borderRadius: 6,
  },
});
