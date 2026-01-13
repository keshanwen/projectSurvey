// src/task.tsx
import { createSignal } from 'solid-js';
import Modal from './modal/index';

export default function Task() {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedMonth, setSelectedMonth] = createSignal('October');

  const handleSendNow = () => {
    console.log('Sending statement for:', selectedMonth());
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 触发弹窗 */}
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      {/* 弹窗 */}
      <Modal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        title="Send Statement"
        content={
          <p>
            The statement will be sent to your email <strong>***abcd@gmail.com</strong>
          </p>
        }
        onConfirm={handleSendNow}
        confirmText="Send now"
        cancelText="Cancel"
      />
    </div>
  );
}