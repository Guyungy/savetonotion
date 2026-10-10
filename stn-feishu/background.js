importScripts('stn-feishu/api.js', 'stn-feishu/oauth.js');
const FEISHU_CONFIG_KEY = 'stnFeishuConfig';
const FEISHU_STATUS_KEY = 'stnFeishuStatus';
function openFeishu() { chrome.tabs.create({ url: chrome.runtime.getURL('stn-feishu/index.html') }); }
async function feishuMessage(message, sender) {
  if (sender.id !== chrome.runtime.id) throw new Error('不允许访问飞书设置');
  const stored = (await chrome.storage.local.get(FEISHU_CONFIG_KEY))[FEISHU_CONFIG_KEY] || {};
  // Public popup exposes only hook state; credentials stay in the private settings page.
  if (message.action === 'open') { openFeishu(); return {}; }
  if (message.action === 'state') return { enabled: stored.enabled === true, configured: !!(stored.appId && stored.appSecret), lastResult: (await chrome.storage.local.get(FEISHU_STATUS_KEY))[FEISHU_STATUS_KEY] || null };
  if (message.action === 'toggle') {
    if (message.enabled === true && (!stored.appId || !stored.appSecret)) throw new Error('请先配置飞书应用');
    await chrome.storage.local.set({ [FEISHU_CONFIG_KEY]: { ...stored, enabled: message.enabled === true } });
    return { enabled: message.enabled === true };
  }
  if (sender.url?.split(/[?#]/)[0] !== chrome.runtime.getURL('stn-feishu/index.html') || sender.tab?.url?.startsWith('http')) throw new Error('请在扩展的飞书设置页面中操作');
  if (message.action === 'connect') return feishuConnect(stored);
  if (message.action === 'disconnect') { await chrome.storage.local.remove(FEISHU_USER_KEY); await chrome.storage.local.set({[FEISHU_CONFIG_KEY]:{...stored,identity:'user',enabled:false}}); return {}; }
  if (message.action === 'config') return { identity:stored.identity||'app', connected:!!(await chrome.storage.local.get(FEISHU_USER_KEY))[FEISHU_USER_KEY], redirectUrl:feishuRedirect(), scopes:FEISHU_SCOPES, appId: stored.appId || '', folderToken: stored.folderToken || '', hasSecret: !!stored.appSecret, enabled: stored.enabled === true };
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
    const config = { appId, appSecret, folderToken, identity:message.config?.identity==='user'?'user':'app', enabled: message.config?.enabled === true };
    await new StnFeishuApi.Client(config).token();
    if(appId!==stored.appId||appSecret!==stored.appSecret)await chrome.storage.local.remove(FEISHU_USER_KEY);
    await chrome.storage.local.set({ [FEISHU_CONFIG_KEY]: config });
    return { ok: true };
  }
  if (message.action === 'repairAccess') {
    if (!stored.appId || !stored.appSecret) throw new Error('请先配置飞书应用');
    const previous = (await chrome.storage.local.get(FEISHU_STATUS_KEY))[FEISHU_STATUS_KEY];
    const target = String(message.url || previous?.url || '').trim();
    let id;
    try {
      const url = new URL(target);
      if (url.protocol === 'https:' && /(^|\.)feishu\.cn$/.test(url.hostname)) id = url.pathname.match(/^\/docx\/([a-zA-Z0-9]+)\/?$/)?.[1];
    } catch (_) {}
    if (!id) throw new Error('没有可修复的文档，请填写 Claw 应用创建的飞书文档链接（/docx/…）');
    const result = await new StnFeishuApi.Client(stored).repairAccess(id);
    if (previous?.url?.split(/[?#]/)[0] === result.url) {
      const updated = { ...previous, accessConfigured: true, at: Date.now() };delete updated.permissionError;
      updated.state = updated.partial || updated.error ? 'error' : 'success';
      await chrome.storage.local.set({ [FEISHU_STATUS_KEY]: updated });
    }
    return result;
  }
  if (message.action === 'forget') { await chrome.storage.local.remove([FEISHU_CONFIG_KEY, FEISHU_STATUS_KEY, FEISHU_USER_KEY]); return {}; }
  throw new Error('未知的飞书操作');
}
function feishuDispatch(message, sender, reply) {
  feishuMessage(message, sender).then(data => reply({ ok: true, data }), error => reply({ ok: false, error: error.message }));
  return true;
}
function feishuPlainText(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(item => Array.isArray(item) ? String(item[0] || '') : String(item || '')).join('');
  return '';
}
function feishuArticleFromCapture(capture, notionResult) {
  const payload = capture.payload;
  const parts = [];
  // Use only the exact submitted content, including selected ranges and list entries.
  for (const property of Object.values(payload.properties || {})) {
    const content = property?.content;
    if (!content) continue;
    for (const item of content.type === 'list' ? content.items || [] : [content]) {
      if (item.markdown) parts.push(item.markdown);
      else if (item.text) parts.push(feishuPlainText(item.text));
    }
  }
  let title = feishuPlainText(payload.note) || feishuPlainText(notionResult.title) || '网页收藏';
  if (Array.isArray(payload.note) && payload.note[0]?.[0] === '[🔗 link]' && payload.note[0]?.[1]?.[0]?.[0] === 'a') title = feishuPlainText(payload.note.slice(1)).replace(/^\s*—\s*/, '') || title;
  let content = parts.join('\n\n') || title;
  // Save original image links without Save.to's proprietary image-size annotation.
  content = content.replace(/<<width[^>]*>>/g, '').replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g, '[图片：$1]($2)');
  const url = capture.context?.url;
  if (url && /^https?:\/\//.test(url)) content += `\n\n原文：<${url.replace(/[<>\r\n]/g, '')}>`;
  return { title, content, contentType: 'markdown' };
}
async function feishuAfterNotion(capture, notionResult) {
  // Only successful immediate Notion note/page writes reach this hook.
  if (capture.payload?.type !== 'note' || capture.context?.executeDirectly !== true) return;
  let article;
  try {
    const config = (await chrome.storage.local.get(FEISHU_CONFIG_KEY))[FEISHU_CONFIG_KEY];
    if (config?.enabled !== true) return; // Existing settings migrate with the hook OFF.
    article = feishuArticleFromCapture(capture, notionResult);
    article.notionBlockId = notionResult.notionBlockId || '';
    article.sourceUrl = capture.context?.url || '';
    await chrome.storage.local.set({ [FEISHU_STATUS_KEY]: { state: 'saving', title: article.title, notionBlockId: article.notionBlockId, sourceUrl: article.sourceUrl, at: Date.now() } });
    const result = await new StnFeishuApi.Client(config, fetch, config.identity==='user'?()=>feishuUserToken(config):null).save(article);
    await chrome.storage.local.set({ [FEISHU_STATUS_KEY]: { state: result.partial || result.permissionError ? 'error' : 'success', ...result, title: article.title, notionBlockId: article.notionBlockId, sourceUrl: article.sourceUrl, at: Date.now() } });
  } catch (error) {
    // A Feishu failure must never be reported as a failed Notion save.
    await chrome.storage.local.set({ [FEISHU_STATUS_KEY]: { state: 'error', error: error.message, title: article?.title || '', notionBlockId: article?.notionBlockId || '', sourceUrl: article?.sourceUrl || '', at: Date.now() } }).catch(() => {});
  }
}
// Remove the former independent entry on upgrade as well as on worker startup.
chrome.contextMenus.remove('stn-save-feishu', () => void chrome.runtime.lastError);
