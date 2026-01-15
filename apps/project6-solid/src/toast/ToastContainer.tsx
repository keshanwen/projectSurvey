// components/Toast/ToastContainer.tsx
import { createSignal, createUniqueId, For, onCleanup } from 'solid-js';
import Toast from './Toast';
import styles from './Toast.module.css';
import type { ToastOptions } from './Toast'

export interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

const ToastContainer = () => {
  const [toasts, setToasts] = createSignal<ToastItem[]>([]);
  const [position, setPosition] = createSignal<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');

  // 添加 Toast
  const addToast = (options: ToastOptions) => {
    const id = createUniqueId();
    const toast: ToastItem = {
      ...options,
      id,
      createdAt: Date.now(),
    };
    
    setToasts(prev => {
      const newToasts = [...prev, toast];
      // 限制最大显示数量
      if (newToasts.length > 5) {
        return newToasts.slice(1);
      }
      return newToasts;
    });
  };

  // 移除 Toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 清空所有 Toast
  const clearToasts = () => {
    setToasts([]);
  };

  // 设置位置
  const setToastPosition = (pos: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => {
    setPosition(pos);
  };

  // 暴露 API 给全局使用
  if (typeof window !== 'undefined') {
    (window as any).toast = {
      success: (message: string, duration?: number) => 
        addToast({ message, type: 'success', duration }),
      error: (message: string, duration?: number) => 
        addToast({ message, type: 'error', duration }),
      warning: (message: string, duration?: number) => 
        addToast({ message, type: 'warning', duration }),
      info: (message: string, duration?: number) => 
        addToast({ message, type: 'info', duration }),
      custom: (options: ToastOptions) => addToast(options),
      clear: clearToasts,
      setPosition: setToastPosition,
    };
  }

  onCleanup(() => {
    if (typeof window !== 'undefined') {
      delete (window as any).toast;
    }
  });

  return (
    <div 
      class={styles.container}
      classList={{
        [styles['top-right']]: position() === 'top-right',
        [styles['top-left']]: position() === 'top-left',
        [styles['bottom-right']]: position() === 'bottom-right',
        [styles['bottom-left']]: position() === 'bottom-left',
      }}
    >
      <For each={toasts()}>
        {(toast) => (
          <Toast
            {...toast}
            onClose={removeToast}
          />
        )}
      </For>
    </div>
  );
};

export default ToastContainer;

// 导出 TypeScript 类型声明
export type ToastAPI = {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  custom: (options: ToastOptions) => void;
  clear: () => void;
  setPosition: (position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => void;
};

declare global {
  interface Window {
    toast?: ToastAPI;
  }
}