import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export default function Login() {
  const [selecionado, setSelecionado] = useState('Login');
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [placa, setPlaca] = useState('');
  const [imagemCNHFrente, setImagemCNHFrente] = useState(null);
  const [imagemCNHVerso, setImagemCNHVerso] = useState(null);
  const [imagemDocumentoVeiculo, setImagemDocumentoVeiculo] = useState(null);



  const tirarFoto = async (setImagem) => {
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };
   
  return (
    <SafeAreaView style={estilos.container} edges={['bottom', 'top', 'left', 'right']}>
      <View style={estilos.containertoggle}>
        <TouchableOpacity style={[estilos.togglebotao, selecionado === 'Login' && estilos.toggleselecionado]} onPress={() => setSelecionado('Login')}>
          <Text style={selecionado === 'Login' ? estilos.textoselecionado : estilos.textonormal}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[estilos.togglebotao, selecionado === 'Entra' && estilos.toggleselecionado]} onPress={() => setSelecionado('Entra')}>
          <Text style={selecionado === 'Entra' ? estilos.textoselecionado : estilos.textonormal}>Entra</Text>
        </TouchableOpacity>
      </View>
    {selecionado === 'Login' && (
      <ScrollView
        contentContainerStyle={estilos.conteinerformulario}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.formulariotitulo}>{selecionado === 'Login' ? 'Login' : 'Entrar'}</Text>

        <View style={{ height: 10 }} />

        {/* Picker de tipo de usuário */}
        <Text style={{ fontWeight: 'bold' }}>Entrar como</Text>
        <View style={estilos.formularioinput}>
          <Picker
            selectedValue={tipoUsuario}
            onValueChange={(itemValue) => setTipoUsuario(itemValue)}
          >
            <Picker.Item label="Cliente" value="cliente" />
            <Picker.Item label="Entregador" value="entregador" />
          </Picker>
        </View>

        <View style={{ height: 10 }} />
        <Text style={{ fontWeight: 'bold' }}>Email</Text>
        <TextInput
          style={estilos.formularioinput}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
        />

        <View style={{ height: 10 }} />
        <Text style={{ fontWeight: 'bold' }}>Senha</Text>
        <TextInput
          style={estilos.formularioinput}
          placeholder="Digite sua senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {tipoUsuario === 'entregador' && (
          <>
            <View style={{ height: 10 }} />
            <Text style={{ fontWeight: 'bold' }}>CPF</Text>
            <TextInput
              style={estilos.formularioinput}
              placeholder="Digite seu CPF"
              value={cpf}
              onChangeText={setCpf}
            />

            <View style={{ height: 10 }} />
            <Text style={{ fontWeight: 'bold' }}>Placa do Veículo</Text>
            <TextInput
              style={estilos.formularioinput}
              placeholder="Ex: ABC1D23"
              value={placa}
              onChangeText={setPlaca}
            />

            <View style={{ height: 10 }} />
            <Text style={{ fontWeight: 'bold' }}>Fotos da CNH</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10, justifyContent: 'space-between' }}>
              {imagemCNHFrente && (
                <TouchableOpacity onPress={() => tirarFoto(setImagemCNHFrente)}>
                  <Image source={{ uri: imagemCNHFrente }} style={estilos.imagemCNH} />
                  <Text style={estilos.substituirTexto}>Frente</Text>
                </TouchableOpacity>
              )}
              {imagemCNHVerso && (
                <TouchableOpacity onPress={() => tirarFoto(setImagemCNHVerso)}>
                  <Image source={{ uri: imagemCNHVerso }} style={estilos.imagemCNH} />
                  <Text style={estilos.substituirTexto}>Verso</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              {!imagemCNHFrente && (
                <TouchableOpacity style={estilos.botaoFoto} onPress={() => tirarFoto(setImagemCNHFrente)}>
                  <Text style={estilos.textoBotaoFoto}>Foto CNH Frente</Text>
                </TouchableOpacity>
              )}
              {!imagemCNHVerso && (
                <TouchableOpacity style={estilos.botaoFoto} onPress={() => tirarFoto(setImagemCNHVerso)}>
                  <Text style={estilos.textoBotaoFoto}>Foto CNH Verso</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={{ height: 10 }} />
                <Text style={{ fontWeight: 'bold' }}>Foto do Documento do Veículo</Text>

                <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10, justifyContent: 'flex-start' }}>
                {imagemDocumentoVeiculo && (
                    <TouchableOpacity onPress={() => tirarFoto(setImagemDocumentoVeiculo)}>
                    <Image source={{ uri: imagemDocumentoVeiculo }} style={estilos.imagemCNH} />
                    <Text style={estilos.substituirTexto}>Toque para substituir</Text>
                    </TouchableOpacity>
                )}
                </View>

                {!imagemDocumentoVeiculo && (
                <TouchableOpacity style={estilos.botaoFoto} onPress={() => tirarFoto(setImagemDocumentoVeiculo)}>
                    <Text style={estilos.textoBotaoFoto}>Tirar Foto do Documento</Text>
                </TouchableOpacity>
                )}


          </>
        )}

        <TouchableOpacity
          style={estilos.botaoEnviar}
          onPress={() => {
            console.log('Enviado!');
            console.log('Tipo:', tipoUsuario);
            console.log('Email:', email);
            console.log('Senha:', senha);
            if (tipoUsuario === 'entregador') {
              console.log('CPF:', cpf);
              console.log('Placa:', placa);
              console.log('Frente CNH:', imagemCNHFrente);
              console.log('Verso CNH:', imagemCNHVerso);
            }
          }}
        >
          <Text style={estilos.textoBotao}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>)}
        {selecionado === 'Entra' &&(
            <View style={estilos.conteinerformulario}>
                <Text style={estilos.formulariotitulo}>Entrar</Text>

                <View style={{ height: 10 }} />

                <Text style={{ fontWeight: 'bold' }}>Email</Text>
                <TextInput
                    style={estilos.formularioinput}
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={{ height: 10 }} />

                <Text style={{ fontWeight: 'bold' }}>Senha</Text>
                <TextInput
                    style={estilos.formularioinput}
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity
                style={estilos.botaoEnviar} onPress={() => {console.log('Email:', email); console.log('Senha:', senha);}}>
                    <Text style={estilos.textoBotao}>Enviar</Text>
                 </TouchableOpacity>


            </View>
            
            
        )}

    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  containertoggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 25,
    padding: 4,
    alignSelf: 'center',
    marginBottom: 30,
  },
  togglebotao: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  toggleselecionado: {
    backgroundColor: '#FF6B00',
  },
  textonormal: {
    color: '#111827',
  },
  textoselecionado: {
    fontWeight: 'bold',
    color: '#fff',
  },
  conteinerformulario: {
    padding: 20,
    flexGrow: 1,
  },
  formulariotitulo: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  formularioinput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    fontWeight: 'bold',
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  botaoEnviar: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoFoto: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6B00',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    flex: 1,
  },
  textoBotaoFoto: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagemCNH: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  substituirTexto: {
    color: '#FF6B00',
    fontSize: 14,
    textAlign: 'center',
  },
});
