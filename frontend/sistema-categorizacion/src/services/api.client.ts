/**
 * Cliente HTTP base para comunicación con la API
 */

import { API_CONFIG, APIError, APIResponse } from './api.config';

/**
 * Opciones para requests HTTP
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  timeout?: number;
}

/**
 * Cliente HTTP base
 */
class APIClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.defaultHeaders = API_CONFIG.headers;
    this.defaultTimeout = API_CONFIG.timeout;
  }

  /**
   * Construye la URL completa con query params
   */
  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Maneja la respuesta de la API
   */
  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType?.includes('application/json');

    let data: any;

    if (isJSON) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new APIError(
        data?.error || data?.message || 'Error en la petición',
        response.status,
        data
      );
    }

    return {
      success: true,
      data,
      statusCode: response.status,
    };
  }

  /**
   * Maneja errores de la API
   */
  private handleError(error: any): APIResponse {
    console.error('API Error:', error);

    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'La petición ha excedido el tiempo límite',
      };
    }

    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    try {
      const { params, timeout = this.defaultTimeout, ...fetchOptions } = options;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const url = this.buildURL(endpoint, params);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    try {
      const { timeout = this.defaultTimeout, ...fetchOptions } = options;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    try {
      const { timeout = this.defaultTimeout, ...fetchOptions } = options;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    try {
      const { timeout = this.defaultTimeout, ...fetchOptions } = options;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Exportar instancia única (singleton)
export const apiClient = new APIClient();
