export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

interface RequestOptions {
  token?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const createHeaders = (
  token?: string,
  customHeaders?: Record<string, string>
) => {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };
};

const request = async <TResponse>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
): Promise<TResponse> => {
  const url = API_URL + endpoint;
  const token = localStorage.getItem("token") || options?.token;
  const headers = createHeaders(token, options?.headers);

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Something went wrong");
  }

  if (json?.data !== undefined) return json.data as TResponse;

  return json as TResponse;
};

export const GET = <T>(
  url: string,
  options?: RequestOptions & { params?: Record<string, string> }
): Promise<T> => {
  const fullUrl =
    options?.params && Object.keys(options.params).length > 0
      ? `${url}?${new URLSearchParams(options.params).toString()}`
      : url;

  return request<T>(HttpMethod.GET, fullUrl, undefined, options);
};

export const POST = <T, B>(url: string, body?: B, options?: RequestOptions) =>
  request<T>(HttpMethod.POST, url, body, options);

export const PUT = <T, B>(url: string, body: B, options?: RequestOptions) =>
  request<T>(HttpMethod.PUT, url, body, options);

export const PATCH = <T, B>(url: string, body: B, options?: RequestOptions) =>
  request<T>(HttpMethod.PATCH, url, body, options);

export const DEL = <T>(url: string, options?: RequestOptions) =>
  request<T>(HttpMethod.DELETE, url, undefined, options);
