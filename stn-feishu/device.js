/* Device authorization follows larksuite/cli; codes never leave the worker. */
const FEISHU_DEVICE_KEY = 'stnFeishuDevice';
let feishuDeviceFlight;
async function feishuDeviceFingerprint(config) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(config.appSecret));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
function feishuVerificationUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'accounts.feishu.cn' || url.username || url.password)
    throw new Error('飞书返回的授权地址不合法');
  return url.href;
}
async function feishuDeviceStart(config) {
  if (!config.appId || !config.appSecret) throw new Error('请先验证并保存应用设置');
  if (feishuDeviceFlight) throw new Error('正在处理设备授权，请稍后重试');
  feishuDeviceFlight = (async () => {
    const response = await fetch('https://accounts.feishu.cn/oauth/v1/device_authorization', {
      method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(config.appId + ':' + config.appSecret)},
      body: new URLSearchParams({client_id: config.appId, scope: FEISHU_SCOPES}).toString(),
      signal: AbortSignal.timeout(30000)
    });
    const result = await response.json();
    if (!response.ok || result.error || (result.code != null && result.code !== 0) || !result.device_code || !(result.expires_in > 0))
      throw new Error(`飞书设备授权请求失败（${result.code ?? response.status}），请检查应用设置和用户权限`);
    const verificationUrl = feishuVerificationUrl(result.verification_uri_complete || result.verification_uri);
    const fingerprint = await feishuDeviceFingerprint(config);
    const current = (await chrome.storage.local.get(FEISHU_CONFIG_KEY))[FEISHU_CONFIG_KEY];
    if (current?.appId !== config.appId || current?.appSecret !== config.appSecret) throw new Error('应用设置已变化，请重新连接');
    const interval = Math.max(5, Number(result.interval) || 5);
    await chrome.storage.local.set({[FEISHU_DEVICE_KEY]: {appId: config.appId, fingerprint,
      deviceCode: result.device_code, expiresAt: Date.now() + result.expires_in * 1000,
      interval, nextPollAt: Date.now() + interval * 1000}});
    await chrome.tabs.create({url: verificationUrl});
    return {pending: true, userCode: String(result.user_code || ''), retryAfter: interval};
  })();
  try { return await feishuDeviceFlight; } finally { feishuDeviceFlight = null; }
}
async function feishuDeviceCheck(config) {
  if (feishuDeviceFlight) return {pending: true, retryAfter: 5};
  feishuDeviceFlight = (async () => {
    const pending = (await chrome.storage.local.get(FEISHU_DEVICE_KEY))[FEISHU_DEVICE_KEY];
    if (!pending || pending.expiresAt <= Date.now()) {
      await chrome.storage.local.remove(FEISHU_DEVICE_KEY);
      throw new Error('设备授权已过期，请重新点击连接我的飞书');
    }
    if (pending.appId !== config.appId || pending.fingerprint !== await feishuDeviceFingerprint(config))
      throw new Error('应用设置已变化，请重新连接');
    if (pending.nextPollAt > Date.now()) return {pending: true, retryAfter: Math.ceil((pending.nextPollAt - Date.now()) / 1000)};
    pending.nextPollAt = Date.now() + pending.interval * 1000;
    await chrome.storage.local.set({[FEISHU_DEVICE_KEY]: pending});
    const response = await fetch('https://accounts.feishu.cn/oauth/v3/token', {
      method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({client_id: config.appId, client_secret: config.appSecret,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code', device_code: pending.deviceCode}).toString(),
      signal: AbortSignal.timeout(30000)
    });
    const result = await response.json();
    const active = (await chrome.storage.local.get(FEISHU_DEVICE_KEY))[FEISHU_DEVICE_KEY];
    const current = (await chrome.storage.local.get(FEISHU_CONFIG_KEY))[FEISHU_CONFIG_KEY];
    if (active?.deviceCode !== pending.deviceCode || current?.appId !== config.appId || current?.appSecret !== config.appSecret)
      throw new Error('个人连接或应用设置已变化，请重新连接');
    if (result.error === 'authorization_pending' || result.error === 'slow_down') {
      if (result.error === 'slow_down') {
        pending.interval += 5; pending.nextPollAt = Date.now() + pending.interval * 1000;
        await chrome.storage.local.set({[FEISHU_DEVICE_KEY]: pending});
      }
      return {pending: true, retryAfter: pending.interval};
    }
    if (!response.ok || result.error || (result.code != null && result.code !== 0) || !result.access_token || !(result.expires_in > 0)) {
      await chrome.storage.local.remove(FEISHU_DEVICE_KEY);
      throw new Error(result.error === 'access_denied' ? '你已取消飞书授权' : '飞书设备授权失败或已过期，请重新连接');
    }
    if (!result.refresh_token) throw new Error('未获得自动刷新授权，请开启 offline_access 后重新连接');
    const user = {appId: config.appId, accessToken: result.access_token, expiresAt: Date.now() + result.expires_in * 1000,
      refreshToken: result.refresh_token, refreshExpiresAt: Date.now() + (result.refresh_token_expires_in || 0) * 1000, scope: result.scope || ''};
    await chrome.storage.local.set({[FEISHU_USER_KEY]: user, [FEISHU_CONFIG_KEY]: {...current, identity: 'user', folderToken: ''}});
    await chrome.storage.local.remove(FEISHU_DEVICE_KEY);
    return {connected: true};
  })();
  try { return await feishuDeviceFlight; } finally { feishuDeviceFlight = null; }
}
