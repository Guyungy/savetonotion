/* Personal OAuth credentials stay in extension-local storage, never in messages. */
const FEISHU_USER_KEY = 'stnFeishuUser';
const FEISHU_SCOPES = 'docx:document offline_access';
let feishuLoginFlight, feishuRefreshFlight;
const feishuRedirect = () => chrome.identity.getRedirectURL('feishu');
function feishuRandom() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2,'0')).join('');
}
async function feishuOAuthToken(config, fields) {
  const response = await fetch('https://accounts.feishu.cn/oauth/v3/token', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({client_id:config.appId,client_secret:config.appSecret,...fields}),signal:AbortSignal.timeout(30000)
  });
  const result = await response.json();
  if (!response.ok || result.code !== 0 || !result.access_token || !(result.expires_in > 0))
    throw new Error(`飞书个人授权失败（${result.code ?? response.status}），请重新连接或检查应用 OAuth 配置`);
  return {appId:config.appId,accessToken:result.access_token,expiresAt:Date.now()+result.expires_in*1000,
    refreshToken:result.refresh_token || '',refreshExpiresAt:Date.now()+(result.refresh_token_expires_in||0)*1000,scope:result.scope||''};
}
async function feishuConnect(config) {
  if (feishuLoginFlight) throw new Error('飞书授权窗口已打开，请完成或关闭后重试');
  feishuLoginFlight = (async()=>{
    if(!config.appId||!config.appSecret)throw new Error('请先验证并保存应用设置');
    const state=feishuRandom(),verifier=feishuRandom();
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier));
    const challenge=btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    const url=new URL('https://accounts.feishu.cn/open-apis/authen/v1/authorize');
    url.search=new URLSearchParams({client_id:config.appId,response_type:'code',redirect_uri:feishuRedirect(),scope:FEISHU_SCOPES,state,code_challenge:challenge,code_challenge_method:'S256',prompt:'consent'}).toString();
    let callback;
    try {callback=await chrome.identity.launchWebAuthFlow({url:url.href,interactive:true});}
    catch (_) {throw new Error('授权未完成。请检查飞书安全设置中的重定向 URL，或重新点击连接');}
    const returned=new URL(callback),expected=new URL(feishuRedirect());
    if(returned.origin!==expected.origin||returned.pathname!==expected.pathname||returned.searchParams.get('state')!==state)throw new Error('授权回调校验失败，请重新连接');
    if(returned.searchParams.get('error')||!returned.searchParams.get('code'))throw new Error('你已取消飞书授权');
    const user=await feishuOAuthToken(config,{grant_type:'authorization_code',code:returned.searchParams.get('code'),redirect_uri:feishuRedirect(),code_verifier:verifier});
    if(!user.refreshToken)throw new Error('未获得自动刷新授权，请在飞书后台开启 offline_access 后重新连接');
    const current=(await chrome.storage.local.get(FEISHU_CONFIG_KEY))[FEISHU_CONFIG_KEY];
    if(current?.appId!==config.appId||current?.appSecret!==config.appSecret)throw new Error('应用设置已变化，请重新连接');
    await chrome.storage.local.set({[FEISHU_USER_KEY]:user,[FEISHU_CONFIG_KEY]:{...current,identity:'user',folderToken:''}});
    return {connected:true};
  })();
  try{return await feishuLoginFlight;}finally{feishuLoginFlight=null;}
}
async function feishuUserToken(config) {
  if(feishuRefreshFlight)return feishuRefreshFlight;
  feishuRefreshFlight=(async()=>{
    const user=(await chrome.storage.local.get(FEISHU_USER_KEY))[FEISHU_USER_KEY];
    if(user?.appId!==config.appId)throw new Error('请先连接我的飞书，个人模式不会改用应用身份保存');
    if(user.expiresAt>Date.now()+60000)return user.accessToken;
    if(!user.refreshToken||user.refreshExpiresAt<=Date.now())throw new Error('飞书个人授权已过期，请重新连接我的飞书');
    const next=await feishuOAuthToken(config,{grant_type:'refresh_token',refresh_token:user.refreshToken});
    if(!next.refreshToken)throw new Error('飞书没有返回新的刷新凭证，请重新连接');
    const current=(await chrome.storage.local.get(FEISHU_USER_KEY))[FEISHU_USER_KEY];
    if(current?.refreshToken!==user.refreshToken)throw new Error('个人连接已变化，请重试保存');
    await chrome.storage.local.set({[FEISHU_USER_KEY]:next});return next.accessToken;
  })();
  try{return await feishuRefreshFlight;}finally{feishuRefreshFlight=null;}
}
