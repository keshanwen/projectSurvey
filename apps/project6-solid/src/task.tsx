import { createSignal } from "solid-js";
import "./task.css";

const App = () => {
  const [selectedMonth, setSelectedMonth] = createSignal("October");
  const [isModalOpen, setIsModalOpen] = createSignal(true);

  const handleSendNow = () => {
    // 模拟发送逻辑
    console.log("Sending statement for", selectedMonth());
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div class="container">
      {/* 月份选择列表 */}
      <div class="month-list">
        <div class="month-item">2022.11.30</div>
        <div class="month-item">2022.11.30</div>
        <div class="month-item">2022.11.30</div>
        <div class="month-item selected" onClick={() => setSelectedMonth("October")}>
          October
        </div>
        <div class="month-item">2022.10.30</div>
      </div>

      {/* 弹窗 */}
      {isModalOpen() && (
        <div class="modal-overlay">
          <div class="modal-content" onClick={e => e.stopPropagation()}>
            <p class="modal-text">The statement will be sent to your email ***abcd@gmail.com</p>
            <div>
              <button class="send-button" onClick={handleSendNow}>
                Send now
              </button>
            </div>
            <div>
              <div class="cancel-button" onClick={handleCancel}>
                Cancel
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 触发弹窗按钮 */}
      <div class="trigger-button" onClick={() => setIsModalOpen(true)}>
        Open Modal
      </div>
    </div>
  );
};

export default App;
