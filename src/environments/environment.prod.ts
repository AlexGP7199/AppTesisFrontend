const runtimeApiUrl = (window as Window & { __env?: { apiUrl?: string } }).__env?.apiUrl;

export const environment = {
  production: true,
  apiUrl: runtimeApiUrl || 'http://localhost:5273/api'
};
