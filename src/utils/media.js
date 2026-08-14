/**
 * Utilitário para resolução de URLs de imagens e arquivos de mídia.
 * Transforma caminhos relativos (/uploads/...) em URLs absolutas utilizando o host do backend.
 */
export function getMediaUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const apiBase = process.env.API_BASE_URL || 'http://localhost:3001/';
  const base = apiBase.replace(/\/+$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}
