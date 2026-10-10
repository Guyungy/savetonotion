'use strict';
(function () {
  const row = document.createElement('div');
  row.id = 'stn-feishu-hook';
  row.style.cssText = 'display:block;width:100%;padding:8px 10px;margin-bottom:8px;border:1px solid #dbe4f0;border-radius:8px;font:13px/1.5 system-ui;color:#374151;background:#f7f9fc;box-sizing:border-box;flex-shrink:0';
  const label = document.createElement('label'), checkbox = document.createElement('input');
  checkbox.type = 'checkbox'; checkbox.id = 'stn-feishu-enabled'; checkbox.style.cssText='appearance:auto;width:16px;height:16px;vertical-align:middle;margin-right:4px;cursor:pointer'; label.style.cssText='display:inline-flex;align-items:center;cursor:pointer;gap:4px'; label.append(checkbox, ' 同步到飞书');
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
      status.textContent = last.state === 'saving' ? '正在同步到飞书…' : last.state === 'success' ? '最近一次同步已完成' : `Notion 已保存，飞书同步失败：${last.permissionError || last.error || '正文未完全写入'}`;
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
    const slot = document.querySelector('[data-stn-feishu-hook-slot]');
    if (slot && row.parentElement !== slot) slot.append(row);
    // The login/loading view has no save controls yet; keep settings above its content.
    else if (!slot && !row.isConnected) document.getElementById('root')?.prepend(row);
  }
  new MutationObserver(mount).observe(document.getElementById('root'),{childList:true,subtree:true});
  chrome.storage.onChanged.addListener((changes, area) => { if(area === 'local' && (changes.stnFeishuConfig || changes.stnFeishuStatus)) refresh(); });
  mount();refresh();
})();
