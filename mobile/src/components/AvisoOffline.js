import { Text, StyleSheet } from 'react-native';
import { formatarDataHora } from '../utils/format';

export default function AvisoOffline({ atualizadoEm }) {
  return (
    <Text style={styles.aviso}>
      Sem conexão. Mostrando dados salvos em {formatarDataHora(atualizadoEm)}.
    </Text>
  );
}

const styles = StyleSheet.create({
  aviso: {
    backgroundColor: '#422006',
    color: '#fbbf24',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    textAlign: 'center',
    overflow: 'hidden',
  },
});