/* Shared by the extension worker and the API regression tests. No credentials here. */
(function (root) {
  'use strict';
  const BASE = 'https://open.feishu.cn/open-apis';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  function batches(data) {
    const byId = new Map(data.blocks.map(block => [block.block_id, block]));
    const result = []; let ids = [], blocks = [];
    for (const id of data.first_level_block_ids) {
      const tree = [], seen = new Set();
      function visit(key) {
        if (seen.has(key)) throw new Error('飞书返回了循环的文档结构');
        seen.add(key);
        const original = byId.get(key);
        if (!original) throw new Error('飞书返回的文档结构不完整');
        const block = JSON.parse(JSON.stringify(original));
        delete block.parent_id;
        if (block.table?.property) delete block.table.property.merge_info;
        tree.push(block);
        for (const child of block.children || []) visit(child);
      }
      visit(id);
      if (tree.length > 1000) throw new Error('单个表格或嵌套段落超过飞书的 1000 块限制，请分段保存');
      if (blocks.length + tree.length > 1000 || ids.length >= 50) {
        result.push({ children_id: ids, descendants: blocks, index: -1 }); ids = []; blocks = [];
      }
      ids.push(id); blocks.push(...tree);
    }
    if (ids.length) result.push({ children_id: ids, descendants: blocks, index: -1 });
    return result;
  }
  class Client {
    constructor(config, fetcher = fetch) { this.config = config; this.fetcher = fetcher; }
    async request(path, body, token, method = 'POST') {
      const response = await this.fetcher(BASE + path, {
        method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body), signal: AbortSignal.timeout(60000)
      });
      const result = await response.json();
      if (!response.ok || result.code !== 0) {
        // Never include request bodies, tokens, or full API responses in errors.
        const message = String(result.msg || '请求失败').split(this.config.appSecret).join('[已隐藏]');
        throw new Error(`飞书错误 ${result.code ?? response.status}：${message}`);
      }
      return result.data || result;
    }
    async token() {
      const data = await this.request('/auth/v3/tenant_access_token/internal', { app_id: this.config.appId, app_secret: this.config.appSecret });
      if (!data.tenant_access_token) throw new Error('飞书没有返回应用访问凭证');
      return data.tenant_access_token;
    }
    async shareDocument(documentId, token) {
      return this.request(`/drive/v2/permissions/${encodeURIComponent(documentId)}/public?type=docx`, {
        external_access_entity: 'closed', link_share_entity: 'tenant_editable'
      }, token, 'PATCH');
    }
    async repairAccess(documentId) {
      const token = await this.token();
      await this.shareDocument(documentId, token);
      return { url: `https://feishu.cn/docx/${encodeURIComponent(documentId)}`, accessConfigured: true };
    }
    async save(article) {
      const token = await this.token();
      const converted = await this.request('/docx/v1/documents/blocks/convert', { content_type: article.contentType || 'html', content: article.content || article.html }, token);
      if (!converted.blocks?.length || !converted.first_level_block_ids?.length) throw new Error('没有可保存的正文');
      const groups = batches(converted); // Validate before creating a document.
      const created = await this.request('/docx/v1/documents', { title: article.title.slice(0, 800), ...(this.config.folderToken ? { folder_token: this.config.folderToken } : {}) }, token);
      const document = created.document;
      if (!document?.document_id) throw new Error('飞书没有返回文档 ID');
      const url = `https://feishu.cn/docx/${encodeURIComponent(document.document_id)}`;
      const result = { url, partial: false };
      try {
        for (let i = 0; i < groups.length; i++) {
          if (i) await sleep(400);
          // Do not automatically retry writes: a lost response could duplicate content.
          await this.request(`/docx/v1/documents/${document.document_id}/blocks/${document.document_id}/descendant?document_revision_id=-1`, groups[i], token);
        }
      } catch (error) { result.partial = true; result.error = error.message; }
      // Access is part of completion, including documents with partially written bodies.
      try { await this.shareDocument(document.document_id, token); result.accessConfigured = true; }
      catch (error) { result.accessConfigured = false; result.permissionError = `文档已创建，但企业内编辑权限设置失败：${error.message}`; }
      return result;
    }
  }
  root.StnFeishuApi = { Client, batches };
  if (typeof module !== 'undefined') module.exports = root.StnFeishuApi;
})(globalThis);
