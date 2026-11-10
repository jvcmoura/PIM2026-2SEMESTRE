import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { getPerfil } from '../services/api';
import { useAuth } from '../AuthContext';

const corStatus = { Ativo: '#22c55e', Inadimplente: '#f87171', Inativo: '#94a3b8' };

export default function HomeScreen() {
  const { sessao, sair } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getPerfil(sessao.token)
      .then(setPerfil)
      .catch((e) => {
        if (e.status === 401) sair(); // token expirou: volta para o login
        else setErro(e.message);
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {perfil && (
        <View style={styles.card}>
          <Text style={styles.nome}>{perfil.nome}</Text>
          <Text style={styles.linha}>{perfil.email}</Text>
          {perfil.telefone ? <Text style={styles.linha}>{perfil.telefone}</Text> : null}
          <Text style={styles.linha}>
            Aluno desde {new Date(perfil.dataCadastro).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={[styles.status, { color: corStatus[perfil.status] || '#fff' }]}>
            {perfil.status}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.botao} onPress={sair}>
        <Text style={styles.botaoTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 20, marginBottom: 20 },
  nome: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  linha: { color: '#cbd5e1', fontSize: 15, marginBottom: 4 },
  status: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  erro: { color: '#f87171', marginBottom: 12 },
  botao: { backgroundColor: '#334155', borderRadius: 10, padding: 14, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});