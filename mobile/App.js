import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import AppTabs from './src/navigation/AppTabs';
import { AuthContext } from './src/AuthContext';
import { saveSession, loadSession, clearSession } from './src/services/session';
import { limparCache } from './src/services/cache';

const tema = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#0f172a', card: '#0f172a' },
};

export default function App() {
  const [sessao, setSessao] = useState(null);
  const [iniciando, setIniciando] = useState(true);

  // Ao abrir o app, recupera o login salvo (se existir)
  useEffect(() => {
    loadSession()
      .then(setSessao)
      .catch(() => setSessao(null))
      .finally(() => setIniciando(false));
  }, []);

  async function entrar(nova) {
  await limparCache();
  await saveSession(nova);
  setSessao(nova);
}

async function sair() {
  await clearSession();
  await limparCache();
  setSessao(null);
}

  if (iniciando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ sessao, entrar, sair }}>
      <StatusBar style="light" />
      <NavigationContainer theme={tema}>
        {sessao ? <AppTabs /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
});