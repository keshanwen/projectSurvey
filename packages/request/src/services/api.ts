// services/api.ts
import http from "../core";
import { User, LoginParams, LoginResponse } from "../types/api";

export const authApi = {
  // 登录
  login: (params: LoginParams) => http.post<LoginResponse>("/auth/login", params),

  // 刷新 token
  refreshToken: () => http.post("/auth/refresh"),

  // 登出
  logout: () => http.post("/auth/logout")
};

export const userApi = {
  // 获取用户列表
  getUsers: (params?: { page: number; size: number }) => http.get<User[]>("/users", params),

  // 获取用户详情
  getUserById: (id: number) => http.get<User>(`/users/${id}`),

  // 创建用户
  createUser: (data: Omit<User, "id">) => http.post<User>("/users", data),

  // 更新用户
  updateUser: (id: number, data: Partial<User>) => http.put<User>(`/users/${id}`, data),

  // 删除用户
  deleteUser: (id: number) => http.delete(`/users/${id}`)
};

export const fileApi = {
  // 文件上传
  uploadFile: (formData: FormData) => {
    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};
