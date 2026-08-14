/**
 * Utilitário para resolução dinâmica de URLs de imagens e arquivos de mídia.
 * Resolve automaticamente o host e IP da máquina de execução em qualquer rede.
 */

let serverDetectedIp = null;

export function setServerDetectedIp(ip) {
  if (ip && ip !== '127.0.0.1' && ip !== 'localhost') {
    serverDetectedIp = ip;
  }
}

export function getServerDetectedIp() {
  return serverDetectedIp;
}

/**
 * Retorna a URL base do backend de forma dinâmica
 */
export function getBackendBaseUrl() {
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname || 'localhost';
    return `${protocol}//${hostname}:3001`;
  }
  return 'http://localhost:3001';
}

/**
 * Utilitário para resolução de URLs de imagens e arquivos de mídia.
 * Transforma caminhos relativos (/uploads/...) em URLs absolutas utilizando o host dinâmico do backend.
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

  const base = getBackendBaseUrl();
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

/**
 * Retorna a URL base do frontend para QR Code e check-in.
 * Se o usuário estiver acessando via localhost no computador host,
 * utiliza o IP dinâmico da máquina na rede local para que qualquer celular consiga ler o QR Code.
 */
export function getAppOrigin() {
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const protocol = window.location.protocol || 'http:';

    // Se estiver em localhost e detectamos o IP real da máquina na rede
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && serverDetectedIp) {
      return `${protocol}//${serverDetectedIp}${port || ':8080'}`;
    }

    return `${protocol}//${hostname}${port}`;
  }
  return 'http://localhost:8080';
}
