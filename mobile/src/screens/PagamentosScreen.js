import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { getPagamentos } from '../services/api';
import { useLista } from '../hooks/useLista';
import { formatarData, formatarValor } from '../utils/format';
import AvisoOffline from '../components/AvisoOffline';

const corStatus = { Pago: '#22c55e', Pendente: '#facc15', Atrasado: '#f87171' };

export default function PagamentosScreen() {
  const { dados, erro, offline, atualizadoEm, carregando, atualizando, atualizar } =
  useLista(getPagamentos, 'pagamentos');
  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  const emAberto = dados.filter((p) => p.status !== 'Pago');
  const totalEmAberto = emAberto.reduce((soma, p) => soma + p.valor, 0);

  const cabecalho = (
    <View>
      {offline ? <AvisoOffline atualizadoEm={atualizadoEm} /> : null}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      {dados.length > 0 && (
        <View style={styles.resumo}>
          <Text style={styles.resumoRotulo}>Em aberto</Text>
          <Text style={styles.resumoValor}>{formatarValor(totalEmAberto)}</Text>
          <Text style={styles.resumoRotulo}>
            {emAberto.length} {emAberto.length === 1 ? 'pagamento' : 'pagamentos'}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.conteudo}
      data={dados}
      keyExtractor={(item) => String(item.id)}
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor="#22c55e" />
      }
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={
        !erro ? <Text style={styles.vazio}>Você ainda não tem pagamentos.</Text> : null
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.valor}>{formatarValor(item.valor)}</Text>
          <Text style={styles.linha}>Vencimento: {formatarData(item.dataVencimento)}</Text>
          {item.dataPagamento ? (
            <Text style={styles.linha}>Pago em: {formatarData(item.dataPagamento)}</Text>
          ) : null}
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
  resumo: { backgroundColor: '#1e293b', borderRadius: 14, padding: 18, marginBottom: 18, alignItems: 'center' },
  resumoRotulo: { color: '#94a3b8', fontSize: 14 },
  resumoValor: { color: '#fff', fontSize: 30, fontWeight: 'bold', marginVertical: 4 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 18, marginBottom: 14 },
  valor: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  linha: { color: '#cbd5e1', fontSize: 15, marginBottom: 3 },
  status: { fontSize: 15, fontWeight: 'bold', marginTop: 8 },
  erro: { color: '#f87171', marginBottom: 14, textAlign: 'center' },
  vazio: { color: '#94a3b8', textAlign: 'center', marginTop: 40 },
});