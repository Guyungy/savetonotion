'use strict';
(function () {
  const row = document.createElement('div');
  row.id = 'stn-feishu-hook';
  row.style.cssText = 'padding:10px 12px;border-top:1px solid #e6e6e6;font:13px/1.5 system-ui;color:#555;background:transparent';
  const label = document.createElement('label'), checkbox = document.createElement('input');
  checkbox.type = 'checkbox'; label.append(checkbox, ' 同步到飞书');
  const settings = document.createElement('button'); settings.type = 'button'; settings.textContent = '设置';
  settings.style.cssText = 'border:0;background:transparent;color:#1769e0;cursor:pointer;margin-left:8px;font:inherit';
  const status = document.createElement('div');status.style.cssText = 'font-size:12px;margin-top:4px';status.setAttribute('role','status');
  row.append(label, settings, status);
  const ask = async (action, props = {}) => {
    const result = await chrome.runtime.sendMessage({type:'stn-feishu',action,...props});
    if (!result?.ok) throw new Error(result?.error || '扩展后台没有响应');
    return result.data;
  };
  async function refresh() {
    try {
      const state = await ask('state'); checkbox.checked = state.enabled;
      status.replaceChildren();
      const last = state.lastResult;
      if (!last) return;
      status.textContent = last.state === 'saving' ? '正在同步到飞书…' : last.state === 'success' ? '最近一次同步已完成' : `Notion 已保存，飞书同步失败：${last.error || '正文未完全写入'}`;
      if (last.url && /^https:\/\/feishu\.cn\/docx\//.test(last.url)) {
        const link = document.createElement('a');link.href=last.url;link.target='_blank';link.rel='noopener';link.textContent=' 打开飞书文档';status.append(link);
      }
    } catch (error) { status.textContent = error.message; }
  }
  checkbox.onchange = async () => {
    checkbox.disabled = true;
    try { await ask('toggle',{enabled:checkbox.checked}); }
    catch (error) { status.textContent=error.message;checkbox.checked=false;await ask('open'); }
    finally { checkbox.disabled=false; }
  };
  settings.onclick = () => ask('open');
  function mount() {
    // Place the optional hook immediately after the existing Notion save controls.
    const save = [...document.querySelectorAll('button,[role="button"]')].find(node => /Save to Notion|保存到\s*Notion/i.test(node.textContent || ''));
    const anchor = save?.closest('.w-full') || save;
    if (anchor && row.previousElementSibling !== anchor && !row.contains(anchor)) anchor.insertAdjacentElement('afterend',row);
    else if (!anchor && !row.isConnected) document.getElementById('root')?.append(row);
  }
  new MutationObserver(mount).observe(document.getElementById('root'),{childList:true,subtree:true});
  chrome.storage.onChanged.addListener((changes, area) => { if(area === 'local' && (changes.stnFeishuConfig || changes.stnFeishuStatus)) refresh(); });
  mount();refresh();
})();
