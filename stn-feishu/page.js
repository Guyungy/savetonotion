'use strict';
const $ = id => document.getElementById(id);
const tabId = Number(new URL(location.href).searchParams.get('tabId'));
let article = null;
async function ask(action, props = {}) {
  const response = await chrome.runtime.sendMessage({ type: 'stn-feishu', action, ...props });
  if (!response?.ok) throw new Error(response?.error || '扩展后台没有响应');
  return response.data;
}
function status(message) { $('status').textContent = message; }
async function run(button, operation) {
  const buttons = [...document.querySelectorAll('button')];
  buttons.forEach(b => b.disabled = true);
  try { await operation(); } catch (error) { status(error.message); }
  finally { buttons.forEach(b => b.disabled = false); $('save').disabled = !article; }
}
function prepare(captured) {
  const doc = new DOMParser().parseFromString(captured.content, 'text/html');
  for (const node of doc.querySelectorAll('script,style,iframe,object,embed,form,input,button')) node.remove();
  for (const node of doc.querySelectorAll('*')) for (const attr of [...node.attributes]) {
    if (attr.name.startsWith('on') || attr.name === 'srcdoc') node.removeAttribute(attr.name);
  }
  for (const image of doc.querySelectorAll('img')) {
    const source = image.getAttribute('src') || image.getAttribute('data-src');
    const link = doc.createElement('a');
    try {
      const url = new URL(source, captured.url);
      if (!source || !/^https?:$/.test(url.protocol)) { image.remove(); continue; }
      link.href = url.href; link.textContent = `[图片] ${image.alt || '查看原图'}`;
      if (image.parentElement?.tagName === 'A') image.parentElement.replaceWith(link); else image.replaceWith(link);
    } catch (_) { image.remove(); }
  }
  for (const link of doc.querySelectorAll('a')) {
    try { const url = new URL(link.getAttribute('href'), captured.url); if (!/^https?:$/.test(url.protocol)) link.removeAttribute('href'); else link.href = url.href; }
    catch (_) { link.removeAttribute('href'); }
  }
  const source = doc.createElement('p'), link = doc.createElement('a');
  link.href = captured.url; link.textContent = `原文：${captured.url}`; source.append(link); doc.body.prepend(source);
  return { title: captured.title || '网页收藏', html: doc.body.innerHTML };
}
async function capture(selection = false) {
  if (!tabId) throw new Error('请在要收藏的网页右键选择「保存到飞书」');
  status('正在提取网页…');
  article = null; $('result').hidden = true;
  const captured = await ask('capture', { tabId, selection });
  article = prepare(captured); $('title').value = article.title;
  $('preview').srcdoc = '<!doctype html><meta charset="utf-8"><style>body{font:15px/1.7 system-ui;padding:16px;overflow-wrap:anywhere}pre{white-space:pre-wrap}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px}</style>' + article.html;
  status('正文已提取，请检查预览后保存。');
}
$('config').addEventListener('submit', event => {
  event.preventDefault(); run(event.submitter, async () => {
    status('正在验证飞书应用…');
    await ask('configure', { config: { appId: $('appId').value, appSecret: $('appSecret').value, folderToken: $('folderToken').value } });
    $('appSecret').value = ''; $('appSecret').placeholder = '已保存密钥；留空保留现有密钥';
    $('settings').open = false; status('应用凭证已验证。保存文档还需要应用开通相应云文档权限。');
  });
});
$('forget').onclick = () => run($('forget'), async () => { await ask('forget'); $('appId').value = ''; $('appSecret').value = ''; $('folderToken').value = ''; $('settings').open = true; status('已清除本地应用设置。'); });
$('capture').onclick = () => run($('capture'), () => capture());
$('selection').onclick = () => run($('selection'), () => capture(true));
$('save').onclick = () => run($('save'), async () => {
  if (!article) return;
  status('正在创建飞书文档…'); $('result').hidden = true;
  const result = await ask('save', { article: { ...article, title: $('title').value.trim() || article.title } });
  $('result').href = result.url; $('result').hidden = false;
  status(result.partial ? `文档已创建，但正文未完全写入：${result.error}\n请打开文档检查；重试会创建新文档。` : '已保存到飞书。若无法打开，请检查目标文件夹对应用及你的账号的权限。');
});
(async () => {
  try {
    const config = await ask('config'); $('appId').value = config.appId; $('folderToken').value = config.folderToken;
    if (config.hasSecret) { $('settings').open = false; $('appSecret').placeholder = '已保存密钥；留空保留现有密钥'; }
    if (tabId) await run($('capture'), () => capture());
  } catch (error) { status(error.message); }
})();
