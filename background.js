// background.js
let currentTabId = null;

// 保存标签页ID
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TAB_ID') {
    currentTabId = message.tabId;
  }
});

// 执行脚本
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'INJECT_SCRIPT') {
      try {
        // 方法一：使用 Blob URL 绕过 CSP
        await chrome.scripting.executeScript({
          target: { tabId: message.tabId },
          func: (code) => {
            const blob = new Blob([code], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const script = document.createElement('script');
            script.src = url;
            (document.head || document.documentElement).appendChild(script);
            script.onload = () => URL.revokeObjectURL(url);
          },
          args: [message.code],
          world: 'MAIN' // 强制在主页上下文执行
        });
  
        // 方法二：直接执行代码（需目标网站允许 eval）
        /* await chrome.scripting.executeScript({
          target: { tabId: message.tabId },
          func: (code) => Function(code)(), // 使用 Function 构造函数
          args: [message.code],
          world: 'MAIN'
        }); */
        
        console.log('脚本注入成功');
      } catch (err) {
        console.error('注入失败:', err);
      }
    }
  });
  