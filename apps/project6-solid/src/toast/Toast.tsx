// components/Toast/Toast.tsx
import { createSignal, onCleanup, Show } from 'solid-js';
import styles from './Toast.module.css';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: (id: string) => void;
}

export interface ToastOptions {
  message: string;
  type?: ToastProps['type'];
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Toast = (props: ToastProps) => {
  const [isVisible, setIsVisible] = createSignal(true);
  const [isExiting, setIsExiting] = createSignal(false);
  
  // 自动关闭定时器
  let timeoutId: any;
  
  if (props.duration && props.duration > 0) {
    timeoutId = setTimeout(() => {
      handleClose();
    }, props.duration);
  }
  
  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      props.onClose?.(props.id);
    }, 300); // 动画持续时间
  };
  
  const getIcon = () => {
    switch (props.type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  };
  
  return (
    <Show when={isVisible()}>
      <div
        class={styles.toast}
        classList={{
          [styles[props.type || 'info']]: true,
          [styles.exiting]: isExiting(),
        }}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class={styles.content}>
          <span class={styles.icon}>{getIcon()}</span>
          <span class={styles.message}>{props.message}</span>
          <button
            class={styles.closeButton}
            onClick={handleClose}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </Show>
  );
};

export default Toast;