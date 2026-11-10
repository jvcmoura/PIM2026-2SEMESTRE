import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { cadastrarAluno, login } from '../services/api';
import { useAuth } from '../AuthContext';

export default function CadastroScreen() {
  const { entrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function validar() {
    if (!nome.trim()) return 'Informe seu nome.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Informe um e-mail válido.';
    if (senha.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (senha !== confirmacao) return 'As senhas não conferem.';
    return '';
  }

  async function criarConta() {
    const problema = validar();
    if (problema) {
      setErro(problema);
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await cadastrarAluno({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        telefone: telefone.trim() || null,
      });
    } catch (e) {
      setErro(e.message);
      setCarregando(false);
      return;
    }

    // Conta criada: já entra no app
    try {
      const sessao = await login(email.trim(), senha);
      await entrar(sessao);
    } catch (e) {
      setErro('Conta criada! Volte para a tela anterior e faça o login.');
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#94a3b8"
          autoCapitalize="words"
          maxLength={150}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          maxLength={150}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone (opcional)"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          maxLength={20}
          value={telefone}
          onChangeText={setTelefone}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha (mínimo 6 caracteres)"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={confirmacao}
          onChangeText={setConfirmacao}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.botao} onPress={criarConta} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Criar conta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  conteudo: { padding: 24 },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  erro: { color: '#f87171', marginBottom: 12, textAlign: 'center' },
  botao: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
