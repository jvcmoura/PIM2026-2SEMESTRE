import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { getMatriculas } from '../services/api';
import { useLista } from '../hooks/useLista';
import { formatarData } from '../utils/format';
import AvisoOffline from '../components/AvisoOffline';

const corStatus = { Ativa: '#22c55e', Encerrada: '#94a3b8', Cancelada: '#f87171' };

export default function MatriculasScreen() {
  const { dados, erro, offline, atualizadoEm, carregando, atualizando, atualizar } =
  useLista(getMatriculas, 'matriculas');

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.conteudo}
      data={dados}
      keyExtractor={(item) => String(item.id)}
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor="#22c55e" />
      }
      ListHeaderComponent={
  <View>
    {offline ? <AvisoOffline atualizadoEm={atualizadoEm} /> : null}
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
  </View>
}
      ListEmptyComponent={
        !erro ? <Text style={styles.vazio}>Você ainda não tem matrículas.</Text> : null
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.plano}>{item.nomePlano}</Text>
          <Text style={styles.linha}>Início: {formatarData(item.dataInicio)}</Text>
          <Text style={styles.linha}>Fim: {formatarData(item.dataFim)}</Text>
          <Text style={[styles.status, { color: corStatus[item.status] || '#fff' }]}>
            {item.status}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  lista: { flex: 1, backgroundColor: '#0f172a' },
  conteudo: { padding: 20 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 18, marginBottom: 14 },
  plano: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  linha: { color: '#cbd5e1', fontSize: 15, marginBottom: 3 },
  status: { fontSize: 15, fontWeight: 'bold', marginTop: 8 },
  erro: { color: '#f87171', marginBottom: 14, textAlign: 'center' },
  vazio: { color: '#94a3b8', textAlign: 'center', marginTop: 40 },
});