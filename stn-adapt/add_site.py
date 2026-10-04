#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
add_site.py —— Save.to 网站适配补丁工具（路径 A）

作用：安全地往 serviceWorker.js 的两张适配表里插入新站点。
      不改任何逻辑，只往数据表加 key。

  oa 表：元数据覆写（title / icon）
  nc 表：按域名删除的 URL 查询参数

用法：
  # 加一个只清 URL 参数的站点
  python add_site.py --host www.bilibili.com --params spm_id_from,vd_source

  # 加一个同时改 title 后缀的站点
  python add_site.py --host medium.com --params source,gi --title-suffix "Medium"

  # 查看当前已适配的站点
  python add_site.py --list

  # 撤销（从备份恢复）
  python add_site.py --restore

设计约束（重要）：
  - oa 表 key 去掉 www（查表代码是 hostname.replace(/^www\\./,"")）
  - nc 表 key 保留 www（查表代码直接用 t.hostname）
  → 脚本按传参原样写入 nc；oa 只在指定 --title-suffix 时才写。

安全：
  - 每次写入前自动备份 serviceWorker.js.bak
  - 幂等：同 host 重复执行只更新，不重复插入
  - 失败不做任何修改（先全量校验锚点，再落盘）
"""

import argparse
import io
import os
import re
import shutil
import sys

def _find_target():
    """在脚本目录及所有上级目录里找 serviceWorker.js"""
    d = os.path.dirname(os.path.abspath(__file__))
    for _ in range(5):
        cand = os.path.join(d, "serviceWorker.js")
        if os.path.isfile(cand):
            return cand
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    # 兜底：假设在扩展根目录
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "serviceWorker.js")


TARGET = os.path.abspath(_find_target())
BACKUP = TARGET + ".bak"

# nc 表的插入锚点：把新 key 插在 reddit 之前
NC_ANCHOR = '"www.reddit.com":{ref:!0}'
# oa 表的插入锚点：插在 x.com 条目之前
OA_ANCHOR = '"x.com":{title:'


def die(msg):
    print("ERROR: " + msg, file=sys.stderr)
    sys.exit(1)


def read_target():
    if not os.path.isfile(TARGET):
        die("找不到 serviceWorker.js，请在扩展根目录运行本脚本")
    return io.open(TARGET, encoding="utf-8", errors="surrogateescape").read()


def backup(src):
    shutil.copyfile(TARGET, BACKUP)
    print("已备份 -> " + os.path.basename(BACKUP))


def js_string_array(items):
    """把参数字符串列表转成 JS 对象字面量片段： a:!0,b:!0 """
    parts = []
    for p in items:
        p = p.strip()
        if not p:
            continue
        if not re.match(r"^[A-Za-z0-9_\-]+$", p):
            die("参数名不合法（只允许字母数字下划线连字符）: " + p)
        parts.append('%s:!0' % p)
    return ",".join(parts)


def escape_js(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')


def upsert_nc(content, host, params):
    """往 nc 表插入/更新一个 host 的参数字典"""
    body = js_string_array(params)
    if not body:
        return content, False

    # 已存在同 host 条目？整体替换
    existing = re.search(r'"%s":\{[^}]*\}' % re.escape(host), content)
    if existing:
        new_entry = '"%s":{%s}' % (host, body)
        if existing.group(0) == new_entry:
            print("  nc: %s 已是最新，跳过" % host)
            return content, False
        content = content[:existing.start()] + new_entry + content[existing.end():]
        print("  nc: 已更新 %s -> {%s}" % (host, body))
        return content, True

    if NC_ANCHOR not in content:
        die("找不到 nc 表锚点，serviceWorker.js 可能已改版。锚点: " + NC_ANCHOR)

    # 在 reddit 条目之前插入，避免破坏结尾的 }}
    entry = '"%s":{%s},' % (host, body)
    content = content.replace(NC_ANCHOR, entry + NC_ANCHOR, 1)
    print("  nc: 已新增 %s -> {%s}" % (host, body))
    return content, True


def upsert_oa(content, host_no_www, title_suffix=None, icon=None):
    """往 oa 表插入/更新一个 host 的元数据覆写"""
    if not title_suffix and not icon:
        return content, False

    fields = []
    if title_suffix:
        # 用 n(t.title||"").replace(/后缀$/,"").trim() 的形式
        sfx = escape_js(title_suffix)
        fields.append(
            'title:(e,t)=>{const n=(t.title||"").replace(/\\s*[|\\u2013-]\\s*%s\\s*$/i,"").trim();'
            'return n}' % re.escape(sfx)
        )
    if icon:
        fields.append('icon:"%s"' % escape_js(icon))
    body = ",".join(fields)

    existing = re.search(r'"%s":\{title:' % re.escape(host_no_www), content)
    if not existing:
        existing = re.search(r'"%s":\{icon:' % re.escape(host_no_www), content)

    entry = '"%s":{%s}' % (host_no_www, body)
    if existing:
        # 找到该条目的结束（简单括号配平）
        start = existing.start()
        depth = 0
        i = content.index("{", start)
        j = i
        while j < len(content):
            if content[j] == "{":
                depth += 1
            elif content[j] == "}":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        old = content[start:j + 1]
        if old == entry:
            print("  oa: %s 已是最新，跳过" % host_no_www)
            return content, False
        content = content[:start] + entry + content[j + 1:]
        print("  oa: 已更新 %s" % host_no_www)
        return content, True

    if OA_ANCHOR not in content:
        die("找不到 oa 表锚点，serviceWorker.js 可能已改版。锚点: " + OA_ANCHOR)

    content = content.replace(OA_ANCHOR, entry + "," + OA_ANCHOR, 1)
    print("  oa: 已新增 %s" % host_no_www)
    return content, True


def do_list(content):
    print("=== nc 表（按域名删 URL 参数）===")
    # nc 的值里嵌套了 {}，不能用 [^}]* ；改为截取 nc={ ... }},ac= 区段
    start = content.find("nc={")
    end = content.find("},ac=", start)
    if start >= 0 and end > start:
        seg = content[start + 4:end + 1]
        for hit in re.finditer(r'"([^"]+)":\{([^{}]*)\}', seg):
            keys = [k.split(":")[0] for k in hit.group(2).split(",") if k.strip()]
            print("  %-26s %s" % (hit.group(1), ", ".join(keys)))
    print()
    print("=== oa 表（元数据覆写）===")
    i = content.find("oa={")
    if i >= 0:
        seg = content[i:i + 1500]
        for hit in re.finditer(r'"([a-z0-9.\-]+)":\{(title|icon):', seg):
            print("  " + hit.group(1))


def main():
    ap = argparse.ArgumentParser(description="Save.to 网站适配补丁工具")
    ap.add_argument("--host", help="站点 hostname，如 www.bilibili.com")
    ap.add_argument("--params", help="要删除的 URL 参数，逗号分隔")
    ap.add_argument("--title-suffix", help="要剥掉的标题后缀（文本，非正则）")
    ap.add_argument("--icon", help="强制图标 URL")
    ap.add_argument("--list", action="store_true", help="列出当前已适配站点")
    ap.add_argument("--restore", action="store_true", help="从备份恢复")
    args = ap.parse_args()

    if args.restore:
        if not os.path.isfile(BACKUP):
            die("没有备份文件 " + BACKUP)
        shutil.copyfile(BACKUP, TARGET)
        print("已从备份恢复 serviceWorker.js")
        return

    content = read_target()

    if args.list or (not args.host):
        do_list(content)
        if not args.list:
            print()
            print("用法：python add_site.py --host <域名> --params a,b,c [--title-suffix 文本]")
        return

    host = args.host.strip().lower()
    params = (args.params or "").split(",")
    changed = False

    print("目标站点: %s" % host)

    # nc 用完整 host（含 www，与原表规范一致）
    if params and any(p.strip() for p in params):
        content, c1 = upsert_nc(content, host, params)
        changed = changed or c1

    # oa 用去 www 的 host
    host_nowww = re.sub(r"^www\.", "", host)
    if args.title_suffix or args.icon:
        content, c2 = upsert_oa(content, host_nowww, args.title_suffix, args.icon)
        changed = changed or c2

    if not changed:
        print("无需改动。")
        return

    backup(content)
    with io.open(TARGET, "w", encoding="utf-8", errors="surrogateescape", newline="") as f:
        f.write(content)
    print("已写入 serviceWorker.js")
    print()
    print("下一步：用 --load-extension 真加载验证（见 README）")


if __name__ == "__main__":
    main()
