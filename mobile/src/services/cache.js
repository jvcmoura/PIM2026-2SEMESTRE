import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIXO = 'ultrafit_cache_';

export async function salvarCache(chave, dados) {
  try {
    await AsyncStorage.setItem(
      PREFIXO + chave,
      JSON.stringify({ dados, atualizadoEm: new Date().toISOString() })
    );
  } catch (e) {}
}

export async function lerCache(chave) {
  try {
    const valor = await AsyncStorage.getItem(PREFIXO + chave);
    return valor ? JSON.parse(valor) : null;
  } catch (e) {
    return null;
  }
}

export async function limparCache() {
  try {
    const chaves = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(chaves.filter((c) => c.startsWith(PREFIXO)));
  } catch (e) {}
}