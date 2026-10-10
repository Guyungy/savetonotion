'use strict';
const feishuButton = document.createElement('button');
feishuButton.textContent = '保存到飞书';
feishuButton.style.cssText = 'position:fixed;right:14px;bottom:12px;z-index:2147483647;border:0;border-radius:8px;padding:9px 14px;background:#1769e0;color:white;cursor:pointer;font:14px system-ui';
feishuButton.onclick = () => chrome.runtime.sendMessage({ type: 'stn-feishu', action: 'open' });
document.body.append(feishuButton);
