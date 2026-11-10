import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { salvarCache, lerCache } from '../services/cache';

export function useLista(buscar, chave) {
  const { sessao, sair } = useAuth();
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState('');
  const [offline, setOffline] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const novos = await buscar(sessao.token);
      setDados(novos);
      setErro('');
      setOffline(false);
      setAtualizadoEm(new Date().toISOString());
      await salvarCache(chave, novos);
    } catch (e) {
      if (e.status === 401) {
        sair(); // token expirou: volta para o login
        return;
      }
      if (e.semConexao) {
        // Sem conexão: usa o que ficou salvo no aparelho
        const salvo = await lerCache(chave);
        if (salvo) {
          setDados(salvo.dados);
          setAtualizadoEm(salvo.atualizadoEm);
          setErro('');
          setOffline(true);
          return;
        }
      }
      setErro(e.message);
    }
  }, [sessao.token]);

  useEffect(() => {
    let ativo = true;
    (async () => {
      // Mostra na hora o que está salvo e atualiza em seguida
      const salvo = await lerCache(chave);
      if (salvo && ativo) {
        setDados(salvo.dados);
        setAtualizadoEm(salvo.atualizadoEm);
        setCarregando(false);
      }
      await carregar();
      if (ativo) setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, [carregar]);

  async function atualizar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  return { dados, erro, offline, atualizadoEm, carregando, atualizando, atualizar };
}