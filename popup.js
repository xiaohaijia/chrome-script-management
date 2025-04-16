// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  // 获取当前标签页ID
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ type: 'TAB_ID', tabId: tab.id });

  // 加载保存的脚本
  const { script } = await chrome.storage.local.get('script');
  document.getElementById('code').value = script || '';

  // 执行按钮点击
  document.getElementById('execute').addEventListener('click', async () => {
    const code = document.getElementById('code').value;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 直接传递 tabId
    chrome.runtime.sendMessage({ 
      type: 'INJECT_SCRIPT',
      code: code,
      tabId: tab.id
    });
  });
});