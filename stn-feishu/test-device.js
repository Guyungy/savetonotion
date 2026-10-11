const assert=require('node:assert/strict'), vm=require('node:vm'), fs=require('node:fs');
const {webcrypto}=require('node:crypto');
(async()=>{
  const config={appId:'cli_test',appSecret:'fake-secret',enabled:true,folderToken:'old-folder'};
  const store={stnFeishuConfig:config}, tabs=[], requests=[];
  let result, now=1000000, unsafe=false, tokenGate, tokenEntered;
  const ctx=vm.createContext({URL,URLSearchParams,TextEncoder,crypto:webcrypto,btoa:s=>Buffer.from(s).toString('base64'),AbortSignal,
    Date:{now:()=>now},FEISHU_CONFIG_KEY:'stnFeishuConfig',FEISHU_USER_KEY:'stnFeishuUser',FEISHU_SCOPES:'docx:document offline_access',
    chrome:{tabs:{create:async tab=>tabs.push(tab)},storage:{local:{get:async key=>({[key]:store[key]}),set:async value=>Object.assign(store,value),remove:async key=>{for(const k of Array.isArray(key)?key:[key])delete store[k];}}}},
    fetch:async(url,opts)=>{
      requests.push({url,opts});
      if(url.endsWith('/device_authorization')) {
        assert.equal(opts.headers.Authorization,'Basic '+Buffer.from('cli_test:fake-secret').toString('base64'));
        assert.equal(new URLSearchParams(opts.body).get('scope'),'docx:document offline_access');
        return {ok:true,json:async()=>({device_code:'private-device-code',user_code:'ABCD',expires_in:240,interval:5,
          verification_uri_complete:unsafe?'https://evil.example/steal':'https://accounts.feishu.cn/oauth/v1/device/verify?user_code=ABCD'})};
      }
      assert.equal(url,'https://accounts.feishu.cn/oauth/v3/token');
      const fields=new URLSearchParams(opts.body);assert.equal(fields.get('grant_type'),'urn:ietf:params:oauth:grant-type:device_code');
      assert.equal(fields.get('device_code'),'private-device-code');
      if(tokenGate){tokenEntered();await tokenGate;}
      return {ok:!result.error,json:async()=>result};
    }});
  vm.runInContext(fs.readFileSync(__dirname+'/device.js','utf8'),ctx);ctx.config=config;
  unsafe=true;await assert.rejects(vm.runInContext('feishuDeviceStart(config)',ctx),/地址不合法/);assert.equal(tabs.length,0);
  unsafe=false;const start=await vm.runInContext('feishuDeviceStart(config)',ctx);assert.equal(start.userCode,'ABCD');assert.equal(start.deviceCode,undefined);assert.equal(tabs.length,1);
  const before=requests.length;await vm.runInContext('feishuDeviceCheck(config)',ctx);assert.equal(requests.length,before);
  now+=5000;result={error:'authorization_pending'};assert.equal((await vm.runInContext('feishuDeviceCheck(config)',ctx)).pending,true);
  now+=5000;result={error:'slow_down'};assert.equal((await vm.runInContext('feishuDeviceCheck(config)',ctx)).retryAfter,10);
  now+=10000;result={access_token:'private-access',expires_in:3600,refresh_token:'private-refresh',refresh_token_expires_in:86400,scope:'docx:document offline_access'};
  const success=await vm.runInContext('feishuDeviceCheck(config)',ctx);assert.equal(success.connected,true);assert.equal(success.accessToken,undefined);
  assert.equal(store.stnFeishuConfig.identity,'user');assert.equal(store.stnFeishuConfig.folderToken,'');assert.equal(store.stnFeishuConfig.enabled,true);assert.equal(store.stnFeishuUser.refreshToken,'private-refresh');assert.equal(store.stnFeishuDevice,undefined);
  await vm.runInContext('feishuDeviceStart(config)',ctx);now+=5000;
  let release;tokenGate=new Promise(resolve=>{release=resolve;});const entered=new Promise(resolve=>{tokenEntered=resolve;});const check=vm.runInContext('feishuDeviceCheck(config)',ctx);
  await entered;delete store.stnFeishuDevice;delete store.stnFeishuUser;release();
  await assert.rejects(check,/连接或应用设置已变化/);assert.equal(store.stnFeishuUser,undefined);tokenGate=null;
  await vm.runInContext('feishuDeviceStart(config)',ctx);now+=250000;
  await assert.rejects(vm.runInContext('feishuDeviceCheck(config)',ctx),/过期/);assert.equal(store.stnFeishuDevice,undefined);
  console.log('PASS device OAuth: safe destination, private codes, poll throttling/backoff, personal storage, cancellation race, expiry');
})().catch(error=>{console.error(error);process.exitCode=1;});
