import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Logger } from './Logger';

/**
 * HTTP client wrapper around axios with built-in logging
 * Designed for Jupiter Lite API which doesn't require authentication
 */
export class HttpClient {
  private client: AxiosInstance;

  /**
   * Create a new HttpClient instance
   * @param baseURL - Base URL for all requests
   * @param config - Additional axios configuration options
   */
  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });

    this.setupInterceptors();
  }

  /**
   * Setup interceptors for the axios client to log requests and responses
   */
  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      config => {
        Logger.debug(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      response => {
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
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.post<T>(url, data, config);
    } catch (error: any) {
      return error.response || error;
    }
  }
}
