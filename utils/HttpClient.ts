import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Logger } from './Logger';

export interface AuthConfig {
  type: 'bearer' | 'apiKey' | 'basic' | 'none';
  token?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  headerName?: string;
}

/**
 * HTTP client wrapper around axios with built-in authentication and logging
 */
export class HttpClient {
  private client: AxiosInstance;
  private authConfig: AuthConfig;

  /**
   * Create a new HttpClient instance
   * @param baseURL - Base URL for all requests
   * @param authConfig - Authentication configuration
   * @param config - Additional axios configuration options
   */
  constructor(baseURL: string, authConfig: AuthConfig = { type: 'none' }, config?: AxiosRequestConfig) {
    this.authConfig = authConfig;
    
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });

    this.setupInterceptors();
    this.setupAuth();
  }

  private setupAuth(): void {
    switch (this.authConfig.type) {
      case 'bearer':
        if (this.authConfig.token) {
          this.client.defaults.headers.common['Authorization'] = `Bearer ${this.authConfig.token}`;
        }
        break;
      case 'apiKey':
        if (this.authConfig.apiKey && this.authConfig.headerName) {
          this.client.defaults.headers.common[this.authConfig.headerName] = this.authConfig.apiKey;
        }
        break;
      case 'basic':
        if (this.authConfig.username && this.authConfig.password) {
          const credentials = btoa(`${this.authConfig.username}:${this.authConfig.password}`);
          this.client.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
        }
        break;
    }
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        Logger.debug(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        Logger.debug(`Response: ${response.status}`);
        Logger.debugObject('Response Data:', response.data);
        return response;
      },
      (error: AxiosError) => {
        Logger.debug(`Error: ${error.response?.status}`);
        Logger.debugObject('Error Data:', error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Perform a GET request
   * @param url - Request URL
   * @param config - Request configuration options
   * @returns Promise resolving to the response
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.client.get<T>(url, config);
    } catch (error: any) {
      return error.response || error;
    }
  }

  /**
   * Perform a POST request
   * @param url - Request URL
   * @param data - Request body data
   * @param config - Request configuration options
   * @returns Promise resolving to the response
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.client.post<T>(url, data, config);
    } catch (error: any) {
      return error.response || error;
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  /**
   * Update the authentication configuration
   * @param authConfig - New authentication configuration
   */
  updateAuth(authConfig: AuthConfig): void {
    this.authConfig = authConfig;
    this.setupAuth();
  }

  /**
   * Set a default header for all requests
   * @param key - Header name
   * @param value - Header value
   */
  setDefaultHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }
}