// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  // 获取当前标签页ID
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ type: 'TAB_ID', tabId: tab.id });

  // 加载保存的脚本
  const { script } = await chrome.storage.local.get('script');
  document.getElementById('code').value = script || '';

  // 状态元素
  const statusElement = document.getElementById('status');

  // 执行按钮点击
  document.getElementById('execute').addEventListener('click', async () => {
    const code = document.getElementById('code').value;
    
    // 保存脚本到本地存储
    await chrome.storage.local.set({ script: code });
    
    if (!code.trim()) {
      statusElement.textContent = '请输入脚本内容';
      statusElement.style.color = '#f44336';
      setTimeout(() => { statusElement.textContent = ''; }, 3000);
      return;
    }
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 显示执行状态
    statusElement.textContent = '正在执行...';
    statusElement.style.color = '#ff9800';
    
    // 直接传递 tabId
    chrome.runtime.sendMessage({ 
      type: 'INJECT_SCRIPT',
      code: code,
      tabId: tab.id
    });
    
    // 显示成功状态
    setTimeout(() => {
      statusElement.textContent = '执行成功！';
      statusElement.style.color = '#4caf50';
      setTimeout(() => { statusElement.textContent = ''; }, 3000);
    }, 1000);
  });
  
  // 添加文本区域自动调整高度
  const codeArea = document.getElementById('code');
  codeArea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
});