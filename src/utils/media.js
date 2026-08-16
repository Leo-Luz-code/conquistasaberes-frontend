/**
 * Utilitário para resolução de URLs de imagens e arquivos de mídia.
 * Utiliza as variáveis de ambiente configuradas no sistema.
 */

/**
 * Retorna a URL base do backend configurada via variáveis de ambiente
 */
export function getBackendBaseUrl() {
  const envUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  return envUrl.replace(/\/$/, '');
}

/**
 * Utilitário para resolução de URLs de imagens e arquivos de mídia.
 * Transforma caminhos relativos (/uploads/...) em URLs absolutas utilizando a URL base da API.
 */
export function getMediaUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();

  // Se o caminho contiver /uploads/, redireciona para o backend configurado
  if (trimmed.includes('/uploads/')) {
    const uploadPath = trimmed.substring(trimmed.indexOf('/uploads/'));
    return `${getBackendBaseUrl()}${uploadPath}`;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const base = getBackendBaseUrl();
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

/**
 * Retorna a URL base do frontend para QR Code e check-in.
 * Utiliza a variável de ambiente BASE_URL ou a origem atual da aplicação.
 */
export function getAppOrigin() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return 'http://localhost:8080';
}
