const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {webcrypto}=require('node:crypto');
const {Client}=require('./api.js');
(async()=>{
 const config={appId:'cli_test',appSecret:'fake-secret',enabled:true,folderToken:'old-folder'};
 const store={stnFeishuConfig:config};let requests=[],badState=false;
 const ctx=vm.createContext({URL,URLSearchParams,TextEncoder,crypto:webcrypto,btoa:s=>Buffer.from(s,'binary').toString('base64'),AbortSignal,Date,FEISHU_CONFIG_KEY:'stnFeishuConfig',
 chrome:{storage:{local:{get:async k=>({[k]:store[k]}),set:async value=>Object.assign(store,value)}},identity:{getRedirectURL:()=> 'https://id.chromiumapp.org/feishu',launchWebAuthFlow:async({url})=>{let parsed=new URL(url);assert.equal(parsed.searchParams.get('scope'),'docx:document offline_access');assert.equal(parsed.searchParams.get('code_challenge_method'),'S256');assert(parsed.searchParams.get('code_challenge'));return `https://id.chromiumapp.org/feishu?code=test&state=${badState?'wrong':parsed.searchParams.get('state')}`;}}},
 fetch:async(url,opts)=>{assert.equal(url,'https://accounts.feishu.cn/oauth/v3/token');requests.push(JSON.parse(opts.body));return{ok:true,json:async()=>({code:0,access_token:'fake-access',expires_in:3600,refresh_token:'fake-refresh-'+requests.length,refresh_token_expires_in:86400,scope:'docx:document offline_access'})};}});
 vm.runInContext(fs.readFileSync(__dirname+'/oauth.js','utf8'),ctx);ctx.config=config;
 badState=true;await assert.rejects(vm.runInContext('feishuConnect(config)',ctx),/回调校验/);assert.equal(requests.length,0);
 badState=false;await vm.runInContext('feishuConnect(config)',ctx);assert.equal(store.stnFeishuConfig.identity,'user');assert.equal(store.stnFeishuConfig.folderToken,'');assert.equal(requests[0].grant_type,'authorization_code');assert.equal(requests[0].code_verifier.length,64);
 store.stnFeishuUser.expiresAt=0;await vm.runInContext('Promise.all([feishuUserToken(config),feishuUserToken(config)])',ctx);assert.equal(requests.length,2);assert.equal(requests[1].grant_type,'refresh_token');assert.equal(store.stnFeishuUser.refreshToken,'fake-refresh-2');
 delete store.stnFeishuUser;await assert.rejects(vm.runInContext('feishuUserToken(config)',ctx),/不会改用应用身份/);
 const paths=[];let tokenCalls=0;
 const client=new Client({...config,identity:'user',folderToken:''},async(url,options)=>{paths.push(url);assert.equal(options.headers.Authorization,'Bearer personal-token');return{ok:true,json:async()=>url.endsWith('/convert')?{code:0,data:{first_level_block_ids:['p'],blocks:[{block_id:'p',block_type:2,text:{elements:[]}}]}}:url.endsWith('/documents')?{code:0,data:{document:{document_id:'personal-doc'}}}:{code:0,data:{}}};},async()=>{tokenCalls++;return'personal-token';});
 const result=await client.save({title:'个人收藏',content:'正文',contentType:'markdown'});assert.equal(result.identity,'user');assert.equal(tokenCalls,1);assert(!paths.some(p=>p.includes('/permissions/')||p.includes('/internal')));
 console.log('PASS personal OAuth: state rejection, PKCE, user mode, rotating refresh single-flight, no app fallback, personal writes without public sharing');
})().catch(e=>{console.error(e);process.exitCode=1;});
