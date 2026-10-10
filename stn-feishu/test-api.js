const assert = require('node:assert/strict');
const { Client, batches } = require('./api.js');
const converted = { first_level_block_ids: ['table', 'p'], blocks: [
  { block_id: 'p', block_type: 2, text: { elements: [{ text_run: { content: '内容' } }] } },
  { block_id: 'table', block_type: 31, children: ['cell'], table: { property: { row_size: 1, column_size: 1, merge_info: [] } } },
  { block_id: 'cell', block_type: 32, children: ['inside'] },
  { block_id: 'inside', block_type: 2, parent_id: 'cell', text: { elements: [] } }
] };
(async () => {
  const groups = batches(converted);
  assert.deepEqual(groups[0].children_id, ['table','p']);
  assert.deepEqual(groups[0].descendants.map(b => b.block_id), ['table','cell','inside','p']);
  assert.equal(groups[0].descendants[0].table.property.merge_info, undefined);
  assert.equal(groups[0].descendants[2].parent_id, undefined);
  assert.deepEqual(converted.blocks[1].table.property.merge_info, []);
  assert.throws(() => batches({first_level_block_ids:['missing'],blocks:[]}), /不完整/);
  const big = { first_level_block_ids: Array.from({length: 1001}, (_,i) => String(i)), blocks: Array.from({length:1001}, (_,i) => ({block_id:String(i),block_type:2})) };
  const chunks = batches(big); assert.equal(chunks.flatMap(b=>b.children_id).length,1001); assert(chunks.every(b=>b.children_id.length<=50));
  const calls = [];
  const client = new Client({ appId: 'cli_test', appSecret: 'secret', folderToken: 'folder' }, async (url, options) => {
    calls.push({url,...options,body:JSON.parse(options.body)});
    const data = url.includes('/internal') ? { tenant_access_token: 'token' } : url.endsWith('/convert') ? converted : url.endsWith('/documents') ? { document: { document_id: 'doc' } } : {};
    return {ok:true,json:async()=>({code:0,...(url.includes('/internal')?data:{data})})};
  });
  assert.equal((await client.save({title:'测试',html:'<p>内容</p>'})).partial,false);
  assert.equal(calls[0].headers.Authorization,undefined);
  assert.equal(calls[1].headers.Authorization,'Bearer token');
  assert.equal(calls[2].body.folder_token,'folder');
  assert.equal(calls[3].body.index,-1);
  assert.equal(calls[4].method,'PATCH');
  assert.deepEqual(calls[4].body,{external_access_entity:'closed',link_share_entity:'tenant_editable'});
  assert.match(calls[4].url,/drive\/v2\/permissions\/doc\/public\?type=docx$/);
  client.fetcher = async (url) => ({ok: true, json: async () => url.includes('/descendant') ? {code:1770001,msg:'write failed'} : url.includes('/internal') ? {code:0,tenant_access_token:'token'} : {code:0,data:url.endsWith('/convert')?converted:{document:{document_id:'partial'}}}});
  const partial = await client.save({title:'失败测试',html:'<p>内容</p>'}); assert.equal(partial.partial,true); assert.match(partial.url,/partial/);
  client.fetcher = async (url) => ({ok:true,json:async()=>url.includes('/permissions/')?{code:999,msg:'permission denied'}:url.includes('/internal')?{code:0,tenant_access_token:'token'}:{code:0,data:url.endsWith('/convert')?converted:{document:{document_id:'restricted'}}}});
  const restricted=await client.save({title:'权限失败',html:'<p>内容</p>'});
  assert.equal(restricted.partial,false);assert.equal(restricted.accessConfigured,false);assert.match(restricted.permissionError,/权限设置失败/);assert.match(restricted.url,/restricted/);
  client.fetcher = async () => ({ok:false,json:async()=>({code:999,msg:'secret denied'})});
  await assert.rejects(client.token(),error => !error.message.includes('secret') && error.message.includes('999'));
  console.log('PASS Feishu API: tree order, tables, batching, auth, folder, partial writes, tenant-only editing, sharing failures and secret redaction');
})().catch(error => {console.error(error);process.exitCode=1});
