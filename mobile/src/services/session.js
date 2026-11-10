import * as SecureStore from 'expo-secure-store';

const KEY = 'ultrafit_session';

export async function saveSession(session) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(session));
}

export async function loadSession() {
  const value = await SecureStore.getItemAsync(KEY);
  return value ? JSON.parse(value) : null;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(KEY);
}