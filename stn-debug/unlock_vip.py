#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
unlock_vip.py —— 解锁 Save.to 全部 VIP 功能（调试用）

原理：把「会员状态」的判定改为恒真，共 4 个源头：

  A. main.js    loadProStatus  : i = po||...isPro||!1        -> i = !0
  B. main.js    Pe (checkUserUpgraded): return po||f.current -> return !0
  C. main.js    D  (proSource 分发)   : d(e.isPro)           -> d(!0)
  D. options.js loadProStatus  : o = Sm||...isPro||!1        -> o = !0

其中 A/C 决定 UI 上的 isPro 状态（表单数量限制 / 升级按钮显隐），
B 是所有额度检查（推文线程/邮件/AI 查询等）的统一开关，
D 是 options 页自己的副本。

所有替换都是「精确唯一串」，改前断言命中次数，不符预期直接放弃不落盘。

用法：
  python unlock_vip.py            # 解锁
  python unlock_vip.py --revert   # 还原（从 .orig 备份）
  python unlock_vip.py --status   # 查看当前状态
"""

import io
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
# 脚本在 stn-debug/ 下，扩展根在上一级
for _ in range(4):
    if os.path.isfile(os.path.join(ROOT, "manifest.json")):
        break
    ROOT = os.path.dirname(ROOT)

MAIN = os.path.join(ROOT, "popup", "static", "js", "main.js")
OPTS = os.path.join(ROOT, "options.js")

# (文件, 说明, 原始串, 替换串, 期望命中次数)
PATCHES = [
    (
        MAIN,
        "A. loadProStatus (UI isPro 状态源)",
        'i=po||(null===(n=o.auth)||void 0===n||null===(r=n.user)||void 0===r?void 0:r.isPro)||!1,e({isPro:i})',
        'i=!0,e({isPro:i})',
        1,
    ),
    (
        MAIN,
        "B. Pe / checkUserUpgraded (全部额度开关)",
        'case 0:return e.abrupt("return",po||f.current);case 1:',
        'case 0:return e.abrupt("return",!0);case 1:',
        1,
    ),
    (
        MAIN,
        "C. D / proSource 分发 (isPro setter)",
        'function D(e){if("proSource"in e)d(e.isPro),m(e.proSource);else{var t="paid"===e.plan;d(t),m(t?"personal":"none")}}',
        'function D(e){d(!0),m("personal")}',
        1,
    ),
    (
        OPTS,
        "D. options.js loadProStatus",
        'o=Sm||(null==(n=null==(t=r.auth)?void 0:t.user)?void 0:n.isPro)||!1;return e({isPro:o}),o}',
        'o=!0;return e({isPro:o}),o}',
        1,
    ),
]

MARK = "__UNLOCKED__"


def read(p):
    return io.open(p, encoding="utf-8", errors="surrogateescape").read()


def write(p, s):
    with io.open(p, "w", encoding="utf-8", errors="surrogateescape", newline="") as f:
        f.write(s)


def status():
    for path, label, orig, new, _ in PATCHES:
        s = read(path)
        name = os.path.relpath(path, ROOT)
        # 唯一可靠判据：原始串是否还在。
        # 不用 new in s —— !0 这类短串在压缩文件里到处都是，会误报。
        if orig in s:
            print("  [原始值] %-44s (%s)" % (label, name))
        else:
            print("  [已解锁] %-44s (%s)" % (label, name))


def backup(path):
    bak = path + ".orig"
    if not os.path.isfile(bak):
        shutil.copyfile(path, bak)
        print("  备份 -> %s" % os.path.relpath(bak, ROOT))


def do_unlock():
    # 第一轮：全部校验（不允许中途落盘）
    plan = []
    for path, label, orig, new, times in PATCHES:
        s = read(path)
        if orig not in s:
            print("  [跳过] %s（原始串已不存在，视为已解锁）" % label)
            continue
        cnt = s.count(orig)
        if cnt != times:
            print("  [失败] %s —— 命中 %d 次，期望 %d 次，放弃" % (label, cnt, times))
            print("         目标文件: %s" % os.path.relpath(path, ROOT))
            return False
        plan.append((path, label, orig, new))

    if not plan:
        print("无需改动。")
        return True

    # 第二轮：按文件分组，在内存里累积所有替换，每个文件只写一次
    # （踩过的坑：同一文件有多个 patch 时，若各自 write 会互相覆盖，
    #   导致只有最后一个 patch 生效）
    by_file = {}
    for path, label, orig, new in plan:
        by_file.setdefault(path, []).append((label, orig, new))

    for path, items in by_file.items():
        backup(path)
        s = read(path)
        for label, orig, new in items:
            if orig not in s:
                print("  [异常] %s —— 累积替换时原始串消失" % label)
                return False
            s = s.replace(orig, new, 1)
            print("  [已改] %s" % label)
        write(path, s)

    # 第三轮：复验 —— 原始串必须已消失
    ok = True
    for path, label, orig, new, _ in PATCHES:
        if orig in read(path):
            print("  [复验失败] %s —— 原始串仍在" % label)
            ok = False
    return ok


def do_revert():
    for path, label, orig, new, _ in PATCHES:
        bak = path + ".orig"
        if not os.path.isfile(bak):
            print("  [跳过] %s —— 无备份 %s" % (label, os.path.relpath(bak, ROOT)))
            continue
        if read(bak) == read(path):
            print("  [已是原始] %s" % label)
            continue
        shutil.copyfile(bak, path)
        print("  [已还原] %s" % label)
    return True

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    print("扩展根目录: %s" % ROOT)
    print()
    if cmd == "--revert":
        print("还原中...")
        ok = do_revert()
    elif cmd == "--status":
        print("当前状态：")
        status()
        sys.exit(0)
    else:
        print("解锁中...")
        ok = do_unlock()

    print()
    print("最终状态：")
    status()
    print()
    if ok:
        print("完成。请用 --load-extension 真机验证。")
    else:
        print("有项目未成功，请检查上面的输出。")
        sys.exit(1)
