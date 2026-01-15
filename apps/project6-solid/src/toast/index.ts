// components/Toast/index.ts
import ToastContainer from "./ToastContainer";
import type { ToastAPI } from "./ToastContainer";
import type { ToastOptions } from "./Toast";

export { ToastContainer };
export type { ToastAPI, ToastOptions };

// 导出一个可以直接使用的 toast 对象
export const toast: ToastAPI = {
  success: (message: string, duration?: number) => {
    if (typeof window !== "undefined" && window.toast) {
      window.toast.success(message, duration);
    }
  },
  error: (message: string, duration?: number) => {
    if (typeof window !== "undefined" && window.toast) {
      window.toast.error(message, duration);
    }
  },
  warning: (message: string, duration?: number) => {
    if (typeof window !== "undefined" && window.toast) {
      window.toast.warning(message, duration);
    }
  },
  info: (message: string, duration?: number) => {
    if (typeof window !== "undefined" && window.toast) {
      window.toast.info(message, duration);
    }
  },
  custom: (options: ToastOptions) => {
    if (typeof window !== "undefined" && window.toast) {
      window.toast.custom(options);
    }
  },
  clear: () => {
    if (typeof window !== "undefined" && window.toast) {
      window.toast.clear();
    }
  },
  setPosition: position => {
    if (typeof window !== "undefined" && window.toast) {
      window.toast.setPosition(position);
    }
  }
};
