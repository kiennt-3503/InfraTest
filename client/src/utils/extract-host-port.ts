// src/utils/extract-host-port.ts

export const extractHostPort = (url: string) => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : 'http://' + url);
    return parsed.port ? `${parsed.hostname}:${parsed.port}` : parsed.hostname;
  } catch (e) {
    console.error("Invalid URL:", url, e);
    return null;
  }
};
