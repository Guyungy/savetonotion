importScripts('stn-feishu/api.js');
const FEISHU_CONFIG_KEY = 'stnFeishuConfig';
function openFeishu(tabId) {
  chrome.tabs.create({ url: chrome.runtime.getURL('stn-feishu/index.html') + (Number.isInteger(tabId) ? `?tabId=${tabId}` : '') });
}
async function feishuMessage(message, sender) {
  if (sender.id !== chrome.runtime.id) throw new Error('不允许访问飞书设置');
  // The public popup can only open the private settings page; it cannot read secrets or save.
  if (message.action === 'open') { openFeishu(sender.tab?.id); return {}; }
  if (sender.url?.split(/[?#]/)[0] !== chrome.runtime.getURL('stn-feishu/index.html') || sender.tab?.url?.startsWith('http')) throw new Error('请在扩展的飞书保存页面中操作');
  const stored = (await chrome.storage.local.get(FEISHU_CONFIG_KEY))[FEISHU_CONFIG_KEY] || {};
  if (message.action === 'config') return { appId: stored.appId || '', folderToken: stored.folderToken || '', hasSecret: !!stored.appSecret };
  if (message.action === 'configure') {
    const appId = String(message.config?.appId || '').trim();
    const appSecret = String(message.config?.appSecret || (appId === stored.appId ? stored.appSecret : '') || '').trim();
    let folderToken = String(message.config?.folderToken || '').trim();
    if (folderToken.includes('://')) {
      const url = new URL(folderToken);
      folderToken = url.pathname.match(/\/folder\/([\w-]+)/)?.[1] || '';
      if (!folderToken) throw new Error('请输入云空间文件夹链接（/folder/…），不是文档或知识库链接');
    }
    if (!/^cli_[a-zA-Z0-9]+$/.test(appId) || !appSecret) throw new Error('请填写有效的 App ID 和 App Secret');
    if (folderToken && !/^[\w-]+$/.test(folderToken)) throw new Error('文件夹 token 格式不正确');
    const config = { appId, appSecret, folderToken };
    await new StnFeishuApi.Client(config).token();
    await chrome.storage.local.set({ [FEISHU_CONFIG_KEY]: config });
    return { ok: true };
  }
  if (message.action === 'forget') { await chrome.storage.local.remove(FEISHU_CONFIG_KEY); return {}; }
  if (message.action === 'capture') {
    const tabId = Number(message.tabId);
    const tab = await chrome.tabs.get(tabId);
    if (!/^https?:\/\//.test(tab.url || '')) throw new Error('请从普通网页右键菜单打开保存到飞书');
    if (message.selection) {
      const [result] = await chrome.scripting.executeScript({ target: { tabId }, func: () => {
        const selection = window.getSelection();
        if (!selection?.rangeCount || selection.isCollapsed) return null;
        const holder = document.createElement('div');
        for (let i = 0; i < selection.rangeCount; i++) holder.append(selection.getRangeAt(i).cloneContents());
        for (const node of holder.querySelectorAll('script,style,iframe,button,input')) node.remove();
        for (const node of holder.querySelectorAll('[src],[href]')) for (const attr of ['src','href']) if (node.hasAttribute(attr)) {
          try { node.setAttribute(attr, new URL(node.getAttribute(attr), location.href).href); } catch (_) {}
        }
        return { content: holder.innerHTML, title: document.title, url: location.href };
      } });
      if (!result?.result) throw new Error('请先在原网页选中文字或跨楼层内容，再重新提取选区');
      return result.result;
    }
    const captured = await Promise.race([Wc(tabId, { v2: false }), new Promise((_, reject) => setTimeout(() => reject(new Error('网页提取超时，请刷新网页后重试')), 60000))]);
    if (!captured?.content) throw new Error(captured?.error || '未提取到正文');
    return { content: captured.content, title: captured.title || tab.title || '网页收藏', url: tab.url };
  }
  if (message.action === 'save') {
    if (!stored.appId || !stored.appSecret) throw new Error('请先验证并保存应用设置');
    const article = message.article;
    if (!article?.html || !article.title || article.html.length > 10485760) throw new Error('正文为空或超过飞书长度限制');
    return new StnFeishuApi.Client(stored).save(article);
  }
  throw new Error('未知的飞书操作');
}
function feishuDispatch(message, sender, reply) {
  feishuMessage(message, sender).then(data => reply({ ok: true, data }), error => reply({ ok: false, error: error.message }));
  return true;
}
function installFeishuMenu() {
  chrome.contextMenus.create({ id: 'stn-save-feishu', title: '保存到飞书', contexts: ['page', 'selection', 'link', 'image'] }, () => void chrome.runtime.lastError);
}
installFeishuMenu();
chrome.runtime.onInstalled.addListener(installFeishuMenu);
chrome.contextMenus.onClicked.addListener((info, tab) => { if (info.menuItemId === 'stn-save-feishu') openFeishu(tab?.id); });
