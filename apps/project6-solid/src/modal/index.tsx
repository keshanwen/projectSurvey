import { createSignal, onCleanup } from "solid-js";
import "./index.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string | JSX.Element;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal(props: ModalProps) {
  const [isVisible, setIsVisible] = createSignal(props.isOpen);

  // 同步 isOpen 状态
  if (props.isOpen !== isVisible()) {
    setIsVisible(props.isOpen);
  }

  // 键盘事件监听：ESC 关闭
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  // 添加全局事件监听
  if (props.isOpen) {
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  }

  return (
    <>
      {props.isOpen && (
        <div class="modal-overlay" onClick={props.onClose}>
          <div class="modal-content" onClick={e => e.stopPropagation()}>
            {props.title && <h3 class="modal-title">{props.title}</h3>}
            <div class="modal-body">{props.content}</div>
            <div class="modal-footer">
              <button class="cancel-button" onClick={props.onClose}>
                {props.cancelText || "Cancel"}
              </button>
              <button
                class="confirm-button"
                onClick={() => {
                  props.onConfirm?.();
                  props.onClose();
                }}
              >
                {props.confirmText || "Send now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
