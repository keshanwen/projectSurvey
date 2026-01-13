import { createSignal, createEffect  } from "solid-js";
import "./index.css";
import type { JSX } from "solid-js";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string | JSX.Element;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  cickOverlayClose?: boolean;
}

export default function Modal(props: ModalProps) {
  const [isVisible, setIsVisible] = createSignal(props.isOpen);

    // 创建一个 effect 来监听 props.isOpen 的变化
  createEffect(() => {
    setIsVisible(props.isOpen);
  });

  return (
    <>
      {isVisible() && (
        <div class="modal-overlay" onClick={() => props.cickOverlayClose && props.onClose() }>
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
