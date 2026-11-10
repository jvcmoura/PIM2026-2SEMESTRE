// "2026-10-15T00:00:00" -> "15/10/2026"
export function formatarData(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

// 99.9 -> "R$ 99,90"
export function formatarValor(valor) {
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}
// "2026-10-15T22:40:00.000Z" -> "15/10/2026 19:40" (horário do aparelho)
export function formatarDataHora(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const dois = (n) => String(n).padStart(2, '0');
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()} ${dois(d.getHours())}:${dois(d.getMinutes())}`;
}