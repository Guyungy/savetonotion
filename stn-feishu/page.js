'use strict';
const $ = id => document.getElementById(id);
async function ask(action, props = {}) {
  const response = await chrome.runtime.sendMessage({ type: 'stn-feishu', action, ...props });
  if (!response?.ok) throw new Error(response?.error || '扩展后台没有响应');
  return response.data;
}
function status(message) { $('status').textContent = message; }
async function run(operation) {
  const buttons = [...document.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);
  try { await operation(); } catch (error) { status(error.message); }
  finally { buttons.forEach(b=>b.disabled=false); }
}
$('config').addEventListener('submit', event => {
  event.preventDefault();run(async()=>{
    status('正在验证飞书应用…');
    await ask('configure',{config:{appId:$('appId').value,appSecret:$('appSecret').value,folderToken:$('folderToken').value,enabled:$('enabled').checked}});
    $('appSecret').value='';$('appSecret').placeholder='已保存密钥；留空保留现有密钥';
    status($('enabled').checked?'已启用。下次保存到 Notion 成功后会同步到飞书。':'设置已保存，飞书同步保持关闭。');
  });
});
$('forget').onclick=()=>run(async()=>{await ask('forget');$('appId').value='';$('appSecret').value='';$('folderToken').value='';$('enabled').checked=false;$('result').hidden=true;status('已清除应用设置，飞书同步已关闭。');});
$('repairAccess').onclick=()=>run(async()=>{
  status('正在设置企业内编辑权限…');
  const result=await ask('repairAccess',{url:$('repairUrl').value});
  $('result').href=result.url;$('result').hidden=false;
  status('已设置为企业内获得链接的人可编辑，重新打开文档即可。');
});
(async()=>{
  try {
    const config=await ask('config');$('appId').value=config.appId;$('folderToken').value=config.folderToken;$('enabled').checked=config.enabled;
    if(config.hasSecret)$('appSecret').placeholder='已保存密钥；留空保留现有密钥';
    const {lastResult}=await ask('state');
    if(lastResult?.url && /^https:\/\/feishu\.cn\/docx\//.test(lastResult.url)){$('result').href=lastResult.url;$('result').hidden=false;}
    if(lastResult?.state==='error')status(`最近一次飞书同步失败：${lastResult.permissionError || lastResult.error || '正文未完全写入'}。Notion 已保存。`);
  } catch(error){status(error.message);}
})();
