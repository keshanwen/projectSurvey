// src/task.tsx
import { createSignal } from 'solid-js';
import Modal from './modal/index';
import { ToastContainer } from './toast/index';
import { toast } from './toast';

export default function Task() {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedMonth, setSelectedMonth] = createSignal('October');

  const handleSendNow = () => {
    console.log('Sending statement for:', selectedMonth());
    // setIsModalOpen(false);
  };

  const hande = () => { 
      // toast.success('操作成功！');
      // toast.error('发生错误！');
      // toast.warning('警告信息！');
      // toast.info('提示信息！');
      toast.custom({
        message: '自定义消息',
        type: 'success',
        duration: 5000,
        position: 'bottom-right'
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 触发弹窗 */}
      <button onClick={() => hande()}>
        Open Modal
      </button>
      <ToastContainer></ToastContainer>

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