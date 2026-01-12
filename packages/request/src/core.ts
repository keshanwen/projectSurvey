import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

export class HttpService {
  private instance: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加认证 token
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加时间戳防止缓存（可选）
        if (config.method?.toUpperCase() === "GET") {
          config.params = {
            ...config.params,
            _t: Date.now()
          };
        }

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        // 根据后端约定的状态码处理
        if (data.code === 200) {
          return response;
        } else {
          // 业务错误处理
          console.error(data.message);
          return Promise.reject(new Error(data.message));
        }
      },
      (error: any) => {
        // HTTP 状态码错误处理
        if (error.response) {
          const { status } = error.response;

          switch (status) {
            case 401:
              // 未授权，清除 token 并跳转登录
              localStorage.removeItem("access_token");
              window.location.href = "/login";
              break;
            case 403:
              console.error("权限不足");
              break;
            case 404:
              console.error("请求地址不存在");
              break;
            case 500:
              console.error("服务器内部错误");
              break;
            default:
              console.error(`连接错误 ${status}`);
          }
        } else if (error.request) {
          console.error("网络错误");
        }

        return Promise.reject(error);
      }
    );
  }

  // GET 请求
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ResponseData<T>>> {
    return this.instance.get(url, { ...config, params });
  }

  // POST 请求
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ResponseData<T>>> {
    return this.instance.post(url, data, config);
  }

  // PUT 请求
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ResponseData<T>>> {
    return this.instance.put(url, data, config);
  }

  // DELETE 请求
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ResponseData<T>>> {
    return this.instance.delete(url, config);
  }

  // PATCH 请求
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ResponseData<T>>> {
    return this.instance.patch(url, data, config);
  }
}

// 创建实例
// const http = new HttpService({
//   baseURL: process.env.BASE_API || 'http://localhost:3000/api',
//   timeout: 10000,
// });

export default HttpService;
