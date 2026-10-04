var n, l$1, u$2, i$1, o$1, r$1, f$2, e$1, c$1, s$1, a$1, h$1 = {}, p$1 = [], v$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, y$1 = Array.isArray;
function d$1(n2, l2) {
  for (var u2 in l2) n2[u2] = l2[u2];
  return n2;
}
function w$2(n2) {
  var l2 = n2.parentNode;
  l2 && l2.removeChild(n2);
}
function _$1(l2, u2, t2) {
  var i2, o2, r2, f2 = {};
  for (r2 in u2) "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
  if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (r2 in l2.defaultProps) void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
  return g$2(l2, f2, i2, o2, null);
}
function g$2(n2, t2, i2, o2, r2) {
  var f2 = { type: n2, props: t2, key: i2, ref: o2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r2 ? ++u$2 : r2, __i: -1, __u: 0 };
  return null == r2 && null != l$1.vnode && l$1.vnode(f2), f2;
}
function m$1() {
  return { current: null };
}
function k$2(n2) {
  return n2.children;
}
function b(n2, l2) {
  this.props = n2, this.context = l2;
}
function x$2(n2, l2) {
  if (null == l2) return n2.__ ? x$2(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? x$2(n2) : null;
}
function C$2(n2) {
  var l2, u2;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
      n2.__e = n2.__c.base = u2.__e;
      break;
    }
    return C$2(n2);
  }
}
function M$1(n2) {
  (!n2.__d && (n2.__d = true) && i$1.push(n2) && !P$2.__r++ || o$1 !== l$1.debounceRendering) && ((o$1 = l$1.debounceRendering) || r$1)(P$2);
}
function P$2() {
  var n2, u2, t2, o2, r2, e2, c2, s2;
  for (i$1.sort(f$2); n2 = i$1.shift(); ) n2.__d && (u2 = i$1.length, o2 = void 0, e2 = (r2 = (t2 = n2).__v).__e, c2 = [], s2 = [], t2.__P && ((o2 = d$1({}, r2)).__v = r2.__v + 1, l$1.vnode && l$1.vnode(o2), O$1(t2.__P, o2, r2, t2.__n, t2.__P.namespaceURI, 32 & r2.__u ? [e2] : null, c2, null == e2 ? x$2(r2) : e2, !!(32 & r2.__u), s2), o2.__v = r2.__v, o2.__.__k[o2.__i] = o2, j$2(c2, o2, s2), o2.__e != e2 && C$2(o2)), i$1.length > u2 && i$1.sort(f$2));
  P$2.__r = 0;
}
function S(n2, l2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, v2, y2, d2, w2, _2 = t2 && t2.__k || p$1, g2 = l2.length;
  for (u2.__d = e2, $$1(u2, l2, _2), e2 = u2.__d, a2 = 0; a2 < g2; a2++) null != (y2 = u2.__k[a2]) && "boolean" != typeof y2 && "function" != typeof y2 && (v2 = -1 === y2.__i ? h$1 : _2[y2.__i] || h$1, y2.__i = a2, O$1(n2, y2, v2, i2, o2, r2, f2, e2, c2, s2), d2 = y2.__e, y2.ref && v2.ref != y2.ref && (v2.ref && N$1(v2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), null == w2 && null != d2 && (w2 = d2), 65536 & y2.__u || v2.__k === y2.__k ? e2 = I$1(y2, e2, n2) : "function" == typeof y2.type && void 0 !== y2.__d ? e2 = y2.__d : d2 && (e2 = d2.nextSibling), y2.__d = void 0, y2.__u &= -196609);
  u2.__d = e2, u2.__e = w2;
}
function $$1(n2, l2, u2) {
  var t2, i2, o2, r2, f2, e2 = l2.length, c2 = u2.length, s2 = c2, a2 = 0;
  for (n2.__k = [], t2 = 0; t2 < e2; t2++) r2 = t2 + a2, null != (i2 = n2.__k[t2] = null == (i2 = l2[t2]) || "boolean" == typeof i2 || "function" == typeof i2 ? null : "string" == typeof i2 || "number" == typeof i2 || "bigint" == typeof i2 || i2.constructor == String ? g$2(null, i2, null, null, null) : y$1(i2) ? g$2(k$2, { children: i2 }, null, null, null) : void 0 === i2.constructor && i2.__b > 0 ? g$2(i2.type, i2.props, i2.key, i2.ref ? i2.ref : null, i2.__v) : i2) ? (i2.__ = n2, i2.__b = n2.__b + 1, f2 = L$1(i2, u2, r2, s2), i2.__i = f2, o2 = null, -1 !== f2 && (s2--, (o2 = u2[f2]) && (o2.__u |= 131072)), null == o2 || null === o2.__v ? (-1 == f2 && a2--, "function" != typeof i2.type && (i2.__u |= 65536)) : f2 !== r2 && (f2 == r2 - 1 ? a2-- : f2 == r2 + 1 ? a2++ : f2 > r2 ? s2 > e2 - r2 ? a2 += f2 - r2 : a2-- : f2 < r2 && (f2 == r2 - a2 ? a2 -= f2 - r2 : a2++), f2 !== t2 + a2 && (i2.__u |= 65536))) : (o2 = u2[r2]) && null == o2.key && o2.__e && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x$2(o2)), V$1(o2, o2, false), u2[r2] = null, s2--);
  if (s2) for (t2 = 0; t2 < c2; t2++) null != (o2 = u2[t2]) && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x$2(o2)), V$1(o2, o2));
}
function I$1(n2, l2, u2) {
  var t2, i2;
  if ("function" == typeof n2.type) {
    for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = I$1(t2[i2], l2, u2));
    return l2;
  }
  n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = x$2(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 === l2.nodeType);
  return l2;
}
function H$1(n2, l2) {
  return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (y$1(n2) ? n2.some(function(n3) {
    H$1(n3, l2);
  }) : l2.push(n2)), l2;
}
function L$1(n2, l2, u2, t2) {
  var i2 = n2.key, o2 = n2.type, r2 = u2 - 1, f2 = u2 + 1, e2 = l2[u2];
  if (null === e2 || e2 && i2 == e2.key && o2 === e2.type && 0 == (131072 & e2.__u)) return u2;
  if (t2 > (null != e2 && 0 == (131072 & e2.__u) ? 1 : 0)) for (; r2 >= 0 || f2 < l2.length; ) {
    if (r2 >= 0) {
      if ((e2 = l2[r2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return r2;
      r2--;
    }
    if (f2 < l2.length) {
      if ((e2 = l2[f2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return f2;
      f2++;
    }
  }
  return -1;
}
function T$2(n2, l2, u2) {
  "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || v$1.test(l2) ? u2 : u2 + "px";
}
function A$2(n2, l2, u2, t2, i2) {
  var o2;
  n: if ("style" === l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$2(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] === t2[l2] || T$2(n2.style, l2, u2[l2]);
  }
  else if ("o" === l2[0] && "n" === l2[1]) o2 = l2 !== (l2 = l2.replace(/(PointerCapture)$|Capture$/i, "$1")), l2 = l2.toLowerCase() in n2 || "onFocusOut" === l2 || "onFocusIn" === l2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = e$1, n2.addEventListener(l2, o2 ? s$1 : c$1, o2)) : n2.removeEventListener(l2, o2 ? s$1 : c$1, o2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" !== l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function F$2(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (null == u2.t) u2.t = e$1++;
      else if (u2.t < t2.u) return;
      return t2(l$1.event ? l$1.event(u2) : u2);
    }
  };
}
function O$1(n2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, h2, p2, v2, w2, _2, g2, m2, x2, C2, M2, P2, $2, I2, H2, L2, T2 = u2.type;
  if (void 0 !== u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), r2 = [e2 = u2.__e = t2.__e]), (a2 = l$1.__b) && a2(u2);
  n: if ("function" == typeof T2) try {
    if (m2 = u2.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a2 = T2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? g2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (x2 ? u2.__c = h2 = new T2(m2, M2) : (u2.__c = h2 = new b(m2, M2), h2.constructor = T2, h2.render = q$2), C2 && C2.sub(h2), h2.props = m2, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), x2 && null == h2.__s && (h2.__s = h2.state), x2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$1({}, h2.__s)), d$1(h2.__s, T2.getDerivedStateFromProps(m2, h2.__s))), v2 = h2.props, w2 = h2.state, h2.__v = u2, p2) x2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), x2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
    else {
      if (x2 && null == T2.getDerivedStateFromProps && m2 !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(m2, M2), !h2.__e && (null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(m2, h2.__s, M2) || u2.__v === t2.__v)) {
        for (u2.__v !== t2.__v && (h2.props = m2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.forEach(function(n3) {
          n3 && (n3.__ = u2);
        }), P2 = 0; P2 < h2._sb.length; P2++) h2.__h.push(h2._sb[P2]);
        h2._sb = [], h2.__h.length && f2.push(h2);
        break n;
      }
      null != h2.componentWillUpdate && h2.componentWillUpdate(m2, h2.__s, M2), x2 && null != h2.componentDidUpdate && h2.__h.push(function() {
        h2.componentDidUpdate(v2, w2, _2);
      });
    }
    if (h2.context = M2, h2.props = m2, h2.__P = n2, h2.__e = false, $2 = l$1.__r, I2 = 0, x2) {
      for (h2.state = h2.__s, h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++) h2.__h.push(h2._sb[H2]);
      h2._sb = [];
    } else do {
      h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
    } while (h2.__d && ++I2 < 25);
    h2.state = h2.__s, null != h2.getChildContext && (i2 = d$1(d$1({}, i2), h2.getChildContext())), x2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(v2, w2)), S(n2, y$1(L2 = null != a2 && a2.type === k$2 && null == a2.key ? a2.props.children : a2) ? L2 : [L2], u2, t2, i2, o2, r2, f2, e2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && f2.push(h2), g2 && (h2.__E = h2.__ = null);
  } catch (n3) {
    if (u2.__v = null, c2 || null != r2) {
      for (u2.__u |= c2 ? 160 : 32; e2 && 8 === e2.nodeType && e2.nextSibling; ) e2 = e2.nextSibling;
      r2[r2.indexOf(e2)] = null, u2.__e = e2;
    } else u2.__e = t2.__e, u2.__k = t2.__k;
    l$1.__e(n3, u2, t2);
  }
  else null == r2 && u2.__v === t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : u2.__e = z$2(t2.__e, u2, t2, i2, o2, r2, f2, c2, s2);
  (a2 = l$1.diffed) && a2(u2);
}
function j$2(n2, u2, t2) {
  u2.__d = void 0;
  for (var i2 = 0; i2 < t2.length; i2++) N$1(t2[i2], t2[++i2], t2[++i2]);
  l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$1.__e(n3, u3.__v);
    }
  });
}
function z$2(l2, u2, t2, i2, o2, r2, f2, e2, c2) {
  var s2, a2, p2, v2, d2, _2, g2, m2 = t2.props, k2 = u2.props, b2 = u2.type;
  if ("svg" === b2 ? o2 = "http://www.w3.org/2000/svg" : "math" === b2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != r2) {
    for (s2 = 0; s2 < r2.length; s2++) if ((d2 = r2[s2]) && "setAttribute" in d2 == !!b2 && (b2 ? d2.localName === b2 : 3 === d2.nodeType)) {
      l2 = d2, r2[s2] = null;
      break;
    }
  }
  if (null == l2) {
    if (null === b2) return document.createTextNode(k2);
    l2 = document.createElementNS(o2, b2, k2.is && k2), r2 = null, e2 = false;
  }
  if (null === b2) m2 === k2 || e2 && l2.data === k2 || (l2.data = k2);
  else {
    if (r2 = r2 && n.call(l2.childNodes), m2 = t2.props || h$1, !e2 && null != r2) for (m2 = {}, s2 = 0; s2 < l2.attributes.length; s2++) m2[(d2 = l2.attributes[s2]).name] = d2.value;
    for (s2 in m2) if (d2 = m2[s2], "children" == s2) ;
    else if ("dangerouslySetInnerHTML" == s2) p2 = d2;
    else if ("key" !== s2 && !(s2 in k2)) {
      if ("value" == s2 && "defaultValue" in k2 || "checked" == s2 && "defaultChecked" in k2) continue;
      A$2(l2, s2, null, d2, o2);
    }
    for (s2 in k2) d2 = k2[s2], "children" == s2 ? v2 = d2 : "dangerouslySetInnerHTML" == s2 ? a2 = d2 : "value" == s2 ? _2 = d2 : "checked" == s2 ? g2 = d2 : "key" === s2 || e2 && "function" != typeof d2 || m2[s2] === d2 || A$2(l2, s2, d2, m2[s2], o2);
    if (a2) e2 || p2 && (a2.__html === p2.__html || a2.__html === l2.innerHTML) || (l2.innerHTML = a2.__html), u2.__k = [];
    else if (p2 && (l2.innerHTML = ""), S(l2, y$1(v2) ? v2 : [v2], u2, t2, i2, "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : o2, r2, f2, r2 ? r2[0] : t2.__k && x$2(t2, 0), e2, c2), null != r2) for (s2 = r2.length; s2--; ) null != r2[s2] && w$2(r2[s2]);
    e2 || (s2 = "value", void 0 !== _2 && (_2 !== l2[s2] || "progress" === b2 && !_2 || "option" === b2 && _2 !== m2[s2]) && A$2(l2, s2, _2, m2[s2], o2), s2 = "checked", void 0 !== g2 && g2 !== l2[s2] && A$2(l2, s2, g2, m2[s2], o2));
  }
  return l2;
}
function N$1(n2, u2, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
    } else n2.current = u2;
  } catch (n3) {
    l$1.__e(n3, t2);
  }
}
function V$1(n2, u2, t2) {
  var i2, o2;
  if (l$1.unmount && l$1.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current !== n2.__e || N$1(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l$1.__e(n3, u2);
    }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k) for (o2 = 0; o2 < i2.length; o2++) i2[o2] && V$1(i2[o2], u2, t2 || "function" != typeof n2.type);
  t2 || null == n2.__e || w$2(n2.__e), n2.__c = n2.__ = n2.__e = n2.__d = void 0;
}
function q$2(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function B$2(u2, t2, i2) {
  var o2, r2, f2, e2;
  l$1.__ && l$1.__(u2, t2), r2 = (o2 = "function" == typeof i2) ? null : i2 && i2.__k || t2.__k, f2 = [], e2 = [], O$1(t2, u2 = (!o2 && i2 || t2).__k = _$1(k$2, null, [u2]), r2 || h$1, h$1, t2.namespaceURI, !o2 && i2 ? [i2] : r2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, f2, !o2 && i2 ? i2 : r2 ? r2.__e : t2.firstChild, o2, e2), j$2(f2, u2, e2);
}
function D$2(n2, l2) {
  B$2(n2, l2, D$2);
}
function E$1(l2, u2, t2) {
  var i2, o2, r2, f2, e2 = d$1({}, l2.props);
  for (r2 in l2.type && l2.type.defaultProps && (f2 = l2.type.defaultProps), u2) "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : e2[r2] = void 0 === u2[r2] && void 0 !== f2 ? f2[r2] : u2[r2];
  return arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), g$2(l2.type, e2, i2 || l2.key, o2 || l2.ref, null);
}
function G$1(n2, l2) {
  var u2 = { __c: l2 = "__cC" + a$1++, __: n2, Consumer: function(n3, l3) {
    return n3.children(l3);
  }, Provider: function(n3) {
    var u3, t2;
    return this.getChildContext || (u3 = [], (t2 = {})[l2] = this, this.getChildContext = function() {
      return t2;
    }, this.componentWillUnmount = function() {
      u3 = null;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value !== n4.value && u3.some(function(n5) {
        n5.__e = true, M$1(n5);
      });
    }, this.sub = function(n4) {
      u3.push(n4);
      var l3 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u3 && u3.splice(u3.indexOf(n4), 1), l3 && l3.call(n4);
      };
    }), n3.children;
  } };
  return u2.Provider.__ = u2.Consumer.contextType = u2;
}
n = p$1.slice, l$1 = { __e: function(n2, l2, u2, t2) {
  for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u$2 = 0, b.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = d$1({}, this.state), "function" == typeof n2 && (n2 = n2(d$1({}, u2), this.props)), n2 && d$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M$1(this));
}, b.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M$1(this));
}, b.prototype.render = k$2, i$1 = [], r$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$2 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, P$2.__r = 0, e$1 = 0, c$1 = F$2(false), s$1 = F$2(true), a$1 = 0;
var t, r, u$1, i, o = 0, f$1 = [], c = l$1, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, s = c.__;
function d(n2, t2) {
  c.__h && c.__h(r, n2, o || t2), o = 0;
  var u2 = r.__H || (r.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function h(n2) {
  return o = 1, p(D$1, n2);
}
function p(n2, u2, i2) {
  var o2 = d(t++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : D$1(void 0, u2), function(n3) {
    var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
    t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = r, !r.u)) {
    var f2 = function(n3, t2, r2) {
      if (!o2.__c.__H) return true;
      var u3 = o2.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      })) return !c2 || c2.call(this, n3, t2, r2);
      var i3 = false;
      return u3.forEach(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
        }
      }), !(!i3 && o2.__c.props === n3) && (!c2 || c2.call(this, n3, t2, r2));
    };
    r.u = true;
    var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
    r.componentWillUpdate = function(n3, t2, r2) {
      if (this.__e) {
        var u3 = c2;
        c2 = void 0, f2(n3, t2, r2), c2 = u3;
      }
      e2 && e2.call(this, n3, t2, r2);
    }, r.shouldComponentUpdate = f2;
  }
  return o2.__N || o2.__;
}
function y(n2, u2) {
  var i2 = d(t++, 3);
  !c.__s && C$1(i2.__H, u2) && (i2.__ = n2, i2.i = u2, r.__H.__h.push(i2));
}
function _(n2, u2) {
  var i2 = d(t++, 4);
  !c.__s && C$1(i2.__H, u2) && (i2.__ = n2, i2.i = u2, r.__h.push(i2));
}
function A$1(n2) {
  return o = 5, T$1(function() {
    return { current: n2 };
  }, []);
}
function F$1(n2, t2, r2) {
  o = 6, _(function() {
    return "function" == typeof n2 ? (n2(t2()), function() {
      return n2(null);
    }) : n2 ? (n2.current = t2(), function() {
      return n2.current = null;
    }) : void 0;
  }, null == r2 ? r2 : r2.concat(n2));
}
function T$1(n2, r2) {
  var u2 = d(t++, 7);
  return C$1(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function q$1(n2, t2) {
  return o = 8, T$1(function() {
    return n2;
  }, t2);
}
function x$1(n2) {
  var u2 = r.context[n2.__c], i2 = d(t++, 9);
  return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n2.__;
}
function P$1(n2, t2) {
  c.useDebugValue && c.useDebugValue(t2 ? t2(n2) : n2);
}
function g$1() {
  var n2 = d(t++, 11);
  if (!n2.__) {
    for (var u2 = r.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
    var i2 = u2.__m || (u2.__m = [0, 0]);
    n2.__ = "P" + i2[0] + "-" + i2[1]++;
  }
  return n2.__;
}
function j$1() {
  for (var n2; n2 = f$1.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z$1), n2.__H.__h.forEach(B$1), n2.__H.__h = [];
  } catch (t2) {
    n2.__H.__h = [], c.__e(t2, n2.__v);
  }
}
c.__b = function(n2) {
  r = null, e && e(n2);
}, c.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s && s(n2, t2);
}, c.__r = function(n2) {
  a && a(n2), t = 0;
  var i2 = (r = n2.__c).__H;
  i2 && (u$1 === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = void 0;
  })) : (i2.__h.forEach(z$1), i2.__h.forEach(B$1), i2.__h = [], t = 0)), u$1 = r;
}, c.diffed = function(n2) {
  v && v(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w$1)(j$1)), t2.__H.__.forEach(function(n3) {
    n3.i && (n3.__H = n3.i), n3.i = void 0;
  })), u$1 = r = null;
}, c.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.forEach(z$1), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B$1(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c.__e(r2, n3.__v);
    }
  }), l && l(n2, t2);
}, c.unmount = function(n2) {
  m && m(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
    try {
      z$1(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
};
var k$1 = "function" == typeof requestAnimationFrame;
function w$1(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k$1 && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 100);
  k$1 && (t2 = requestAnimationFrame(r2));
}
function z$1(n2) {
  var t2 = r, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
}
function B$1(n2) {
  var t2 = r;
  n2.__c = n2.__(), r = t2;
}
function C$1(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function D$1(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}
function g(n2, t2) {
  for (var e2 in t2) n2[e2] = t2[e2];
  return n2;
}
function E(n2, t2) {
  for (var e2 in n2) if ("__source" !== e2 && !(e2 in t2)) return true;
  for (var r2 in t2) if ("__source" !== r2 && n2[r2] !== t2[r2]) return true;
  return false;
}
function C(n2, t2) {
  this.props = n2, this.context = t2;
}
function x(n2, e2) {
  function r2(n3) {
    var t2 = this.props.ref, r3 = t2 == n3.ref;
    return !r3 && t2 && (t2.call ? t2(null) : t2.current = null), e2 ? !e2(this.props, n3) || !r3 : E(this.props, n3);
  }
  function u2(e3) {
    return this.shouldComponentUpdate = r2, _$1(n2, e3);
  }
  return u2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u2.prototype.isReactComponent = true, u2.__f = true, u2;
}
(C.prototype = new b()).isPureReactComponent = true, C.prototype.shouldComponentUpdate = function(n2, t2) {
  return E(this.props, n2) || E(this.state, t2);
};
var R = l$1.__b;
l$1.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), R && R(n2);
};
var w = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
function k(n2) {
  function t2(t3) {
    var e2 = g({}, t3);
    return delete e2.ref, n2(e2, t3.ref || null);
  }
  return t2.$$typeof = w, t2.render = t2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
}
var I = function(n2, t2) {
  return null == n2 ? null : H$1(H$1(n2).map(t2));
}, N = { map: I, forEach: I, count: function(n2) {
  return n2 ? H$1(n2).length : 0;
}, only: function(n2) {
  var t2 = H$1(n2);
  if (1 !== t2.length) throw "Children.only";
  return t2[0];
}, toArray: H$1 }, M = l$1.__e;
l$1.__e = function(n2, t2, e2, r2) {
  if (n2.then) {
    for (var u2, o2 = t2; o2 = o2.__; ) if ((u2 = o2.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
  }
  M(n2, t2, e2, r2);
};
var T = l$1.unmount;
function A(n2, t2, e2) {
  return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
    "function" == typeof n3.__c && n3.__c();
  }), n2.__c.__H = null), null != (n2 = g({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
    return A(n3, t2, e2);
  })), n2;
}
function D(n2, t2, e2) {
  return n2 && e2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
    return D(n3, t2, e2);
  }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e2)), n2;
}
function L() {
  this.__u = 0, this.t = null, this.__b = null;
}
function O(n2) {
  var t2 = n2.__.__c;
  return t2 && t2.__a && t2.__a(n2);
}
function F(n2) {
  var e2, r2, u2;
  function o2(o3) {
    if (e2 || (e2 = n2()).then(function(n3) {
      r2 = n3.default || n3;
    }, function(n3) {
      u2 = n3;
    }), u2) throw u2;
    if (!r2) throw e2;
    return _$1(r2, o3);
  }
  return o2.displayName = "Lazy", o2.__f = true, o2;
}
function U() {
  this.u = null, this.o = null;
}
l$1.unmount = function(n2) {
  var t2 = n2.__c;
  t2 && t2.__R && t2.__R(), t2 && 32 & n2.__u && (n2.type = null), T && T(n2);
}, (L.prototype = new b()).__c = function(n2, t2) {
  var e2 = t2.__c, r2 = this;
  null == r2.t && (r2.t = []), r2.t.push(e2);
  var u2 = O(r2.__v), o2 = false, i2 = function() {
    o2 || (o2 = true, e2.__R = null, u2 ? u2(c2) : c2());
  };
  e2.__R = i2;
  var c2 = function() {
    if (!--r2.__u) {
      if (r2.state.__a) {
        var n3 = r2.state.__a;
        r2.__v.__k[0] = D(n3, n3.__c.__P, n3.__c.__O);
      }
      var t3;
      for (r2.setState({ __a: r2.__b = null }); t3 = r2.t.pop(); ) t3.forceUpdate();
    }
  };
  r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
}, L.prototype.componentWillUnmount = function() {
  this.t = [];
}, L.prototype.render = function(n2, e2) {
  if (this.__b) {
    if (this.__v.__k) {
      var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
      this.__v.__k[0] = A(this.__b, r2, o2.__O = o2.__P);
    }
    this.__b = null;
  }
  var i2 = e2.__a && _$1(k$2, null, n2.fallback);
  return i2 && (i2.__u &= -33), [_$1(k$2, null, e2.__a ? null : n2.children), i2];
};
var V = function(n2, t2, e2) {
  if (++e2[1] === e2[0] && n2.o.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size)) for (e2 = n2.u; e2; ) {
    for (; e2.length > 3; ) e2.pop()();
    if (e2[1] < e2[0]) break;
    n2.u = e2 = e2[2];
  }
};
function W(n2) {
  return this.getChildContext = function() {
    return n2.context;
  }, n2.children;
}
function P(n2) {
  var e2 = this, r2 = n2.i;
  e2.componentWillUnmount = function() {
    B$2(null, e2.l), e2.l = null, e2.i = null;
  }, e2.i && e2.i !== r2 && e2.componentWillUnmount(), e2.l || (e2.i = r2, e2.l = { nodeType: 1, parentNode: r2, childNodes: [], contains: function() {
    return true;
  }, appendChild: function(n3) {
    this.childNodes.push(n3), e2.i.appendChild(n3);
  }, insertBefore: function(n3, t2) {
    this.childNodes.push(n3), e2.i.appendChild(n3);
  }, removeChild: function(n3) {
    this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.i.removeChild(n3);
  } }), B$2(_$1(W, { context: e2.context }, n2.__v), e2.l);
}
function j(n2, e2) {
  var r2 = _$1(P, { __v: n2, i: e2 });
  return r2.containerInfo = e2, r2;
}
(U.prototype = new b()).__a = function(n2) {
  var t2 = this, e2 = O(t2.__v), r2 = t2.o.get(n2);
  return r2[0]++, function(u2) {
    var o2 = function() {
      t2.props.revealOrder ? (r2.push(u2), V(t2, n2, r2)) : u2();
    };
    e2 ? e2(o2) : o2();
  };
}, U.prototype.render = function(n2) {
  this.u = null, this.o = /* @__PURE__ */ new Map();
  var t2 = H$1(n2.children);
  n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
  for (var e2 = t2.length; e2--; ) this.o.set(t2[e2], this.u = [1, 0, this.u]);
  return n2.children;
}, U.prototype.componentDidUpdate = U.prototype.componentDidMount = function() {
  var n2 = this;
  this.o.forEach(function(t2, e2) {
    V(n2, e2, t2);
  });
};
var z = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, B = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, H = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Z = /[A-Z0-9]/g, Y = "undefined" != typeof document, $ = function(n2) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
};
function q(n2, t2, e2) {
  return null == t2.__k && (t2.textContent = ""), B$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
}
function G(n2, t2, e2) {
  return D$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
}
b.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
  Object.defineProperty(b.prototype, t2, { configurable: true, get: function() {
    return this["UNSAFE_" + t2];
  }, set: function(n2) {
    Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
  } });
});
var J = l$1.event;
function K() {
}
function Q() {
  return this.cancelBubble;
}
function X$1() {
  return this.defaultPrevented;
}
l$1.event = function(n2) {
  return J && (n2 = J(n2)), n2.persist = K, n2.isPropagationStopped = Q, n2.isDefaultPrevented = X$1, n2.nativeEvent = n2;
};
var nn, tn = { enumerable: false, configurable: true, get: function() {
  return this.class;
} }, en = l$1.vnode;
l$1.vnode = function(n2) {
  "string" == typeof n2.type && function(n3) {
    var t2 = n3.props, e2 = n3.type, u2 = {}, o2 = -1 === e2.indexOf("-");
    for (var i2 in t2) {
      var c2 = t2[i2];
      if (!("value" === i2 && "defaultValue" in t2 && null == c2 || Y && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
        var l2 = i2.toLowerCase();
        "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === c2 ? c2 = "" : "translate" === l2 && "no" === c2 ? c2 = false : "o" === l2[0] && "n" === l2[1] ? "ondoubleclick" === l2 ? i2 = "ondblclick" : "onchange" !== l2 || "input" !== e2 && "textarea" !== e2 || $(t2.type) ? "onfocus" === l2 ? i2 = "onfocusin" : "onblur" === l2 ? i2 = "onfocusout" : H.test(i2) && (i2 = l2) : l2 = i2 = "oninput" : o2 && B.test(i2) ? i2 = i2.replace(Z, "-$&").toLowerCase() : null === c2 && (c2 = void 0), "oninput" === l2 && u2[i2 = l2] && (i2 = "oninputCapture"), u2[i2] = c2;
      }
    }
    "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = H$1(t2.children).forEach(function(n4) {
      n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
    })), "select" == e2 && null != u2.defaultValue && (u2.value = H$1(t2.children).forEach(function(n4) {
      n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
    })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", tn)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
  }(n2), n2.$$typeof = z, en && en(n2);
};
var rn = l$1.__r;
l$1.__r = function(n2) {
  rn && rn(n2), nn = n2.__c;
};
var un = l$1.diffed;
l$1.diffed = function(n2) {
  un && un(n2);
  var t2 = n2.props, e2 = n2.__e;
  null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), nn = null;
};
var on = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
  return nn.__n[n2.__c].props.value;
}, useCallback: q$1, useContext: x$1, useDebugValue: P$1, useDeferredValue: bn, useEffect: y, useId: g$1, useImperativeHandle: F$1, useInsertionEffect: gn, useLayoutEffect: _, useMemo: T$1, useReducer: p, useRef: A$1, useState: h, useSyncExternalStore: Cn, useTransition: Sn } } };
function ln(n2) {
  return _$1.bind(null, n2);
}
function fn(n2) {
  return !!n2 && n2.$$typeof === z;
}
function an(n2) {
  return fn(n2) && n2.type === k$2;
}
function sn(n2) {
  return !!n2 && !!n2.displayName && ("string" == typeof n2.displayName || n2.displayName instanceof String) && n2.displayName.startsWith("Memo(");
}
function hn(n2) {
  return fn(n2) ? E$1.apply(null, arguments) : n2;
}
function vn(n2) {
  return !!n2.__k && (B$2(null, n2), true);
}
function dn(n2) {
  return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
}
var pn = function(n2, t2) {
  return n2(t2);
}, mn = function(n2, t2) {
  return n2(t2);
}, yn = k$2;
function _n(n2) {
  n2();
}
function bn(n2) {
  return n2;
}
function Sn() {
  return [false, _n];
}
var gn = _, En = fn;
function Cn(n2, t2) {
  var e2 = t2(), r2 = h({ h: { __: e2, v: t2 } }), u2 = r2[0].h, o2 = r2[1];
  return _(function() {
    u2.__ = e2, u2.v = t2, xn(u2) && o2({ h: u2 });
  }, [n2, e2, t2]), y(function() {
    return xn(u2) && o2({ h: u2 }), n2(function() {
      xn(u2) && o2({ h: u2 });
    });
  }, [n2]), e2;
}
function xn(n2) {
  var t2, e2, r2 = n2.v, u2 = n2.__;
  try {
    var o2 = r2();
    return !((t2 = u2) === (e2 = o2) && (0 !== t2 || 1 / t2 == 1 / e2) || t2 != t2 && e2 != e2);
  } catch (n3) {
    return true;
  }
}
var Rn = { useState: h, useId: g$1, useReducer: p, useEffect: y, useLayoutEffect: _, useInsertionEffect: gn, useTransition: Sn, useDeferredValue: bn, useSyncExternalStore: Cn, startTransition: _n, useRef: A$1, useImperativeHandle: F$1, useMemo: T$1, useCallback: q$1, useContext: x$1, useDebugValue: P$1, version: "17.0.2", Children: N, render: q, hydrate: G, unmountComponentAtNode: vn, createPortal: j, createElement: _$1, createContext: G$1, createFactory: ln, cloneElement: hn, createRef: m$1, Fragment: k$2, isValidElement: fn, isElement: En, isFragment: an, isMemo: sn, findDOMNode: dn, Component: b, PureComponent: C, memo: x, forwardRef: k, flushSync: mn, unstable_batchedUpdates: pn, StrictMode: yn, Suspense: L, SuspenseList: U, lazy: F, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: on };
const index = "";
const initElement = (elem) => {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }
  B$2(elem, appContainer);
};
function bgAsk(ev, props, opts) {
  const x2 = new Promise((accept, reject) => {
    const r2 = [...(opts == null ? void 0 : opts.extensionId) ? [opts == null ? void 0 : opts.extensionId] : [], {
      event: ev,
      props,
      destination: "background",
      v2: true
    }, (resp) => {
      if (typeof resp === "object" && resp !== null && "__bgAskSuccess" in resp && !resp.__bgAskSuccess) {
        reject(new Error(resp.__bgAskError));
      } else {
        accept(resp);
      }
    }];
    chrome.runtime.sendMessage(...r2);
  });
  if (opts == null ? void 0 : opts.debug) {
    x2.then((resp) => {
    });
  }
  return x2;
}
function classNames(...args) {
  var classes = [];
  for (var i2 = 0; i2 < arguments.length; i2++) {
    var arg = arguments[i2];
    if (!arg) continue;
    var argType = typeof arg;
    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        var inner = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      if (arg.toString === Object.prototype.toString) {
        for (var key in arg) {
          if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }
  return classes.join(" ");
}
const isEmptyString = (value) => typeof value === "string" && value.length === 0;
const isNullOrEmptyString = (value) => value == null || isEmptyString(value);
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source) && !isReactObject(source)) {
    for (const key in source) {
      if (isObject(source[key]) && !isReactObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }
  return mergeDeep(target, ...sources);
}
function isReactObject(source) {
  return source.$$typeof != null;
}
function combine(...arr) {
  return arr.reduce((res, cur) => mergeDeep(res, cur), {});
}
const ComponentPropsToStylePropsMap = {
  alignContent: "alignContent",
  alignItems: "alignItems",
  alignSelf: "alignSelf",
  area: "gridArea",
  autoColumns: "gridAutoColumns",
  autoFlow: "gridAutoFlow",
  autoRows: "gridAutoRows",
  backgroundColor: "backgroundColor",
  backgroundImage: "backgroundImage",
  basis: "flexBasis",
  textOverflow: "textOverflow",
  border: "border",
  ...{
    borderTop: "borderTop",
    borderBottom: "borderBottom",
    borderLeft: "borderLeft",
    borderRight: "borderRight"
  },
  borderRadius: "borderRadius",
  bottom: "bottom",
  boxShadow: "boxShadow",
  color: "color",
  column: "gridColumn",
  columnEnd: "gridColumnEnd",
  columnGap: "columnGap",
  columnSpan: "gridColumn",
  // Will set gridColumn if no `row` prop given
  columnStart: "gridColumnStart",
  direction: "flexDirection",
  display: "display",
  flex: "flex",
  fontFamily: "fontFamily",
  fontSize: "fontSize",
  fontStyle: "fontStyle",
  fontWeight: "fontWeight",
  gap: "gap",
  grow: "flexGrow",
  height: "height",
  justifyContent: "justifyContent",
  left: "left",
  letterSpacing: "letterSpacing",
  lineHeight: "lineHeight",
  margin: "margin",
  marginBlock: "marginBlock",
  marginBlockEnd: "marginBlockEnd",
  marginBlockStart: "marginBlockStart",
  marginBottom: "marginBlockEnd",
  marginInline: "marginInline",
  marginInlineEnd: "marginInlineEnd",
  marginInlineStart: "marginInlineStart",
  marginLeft: "marginInlineStart",
  marginRight: "marginInlineEnd",
  marginTop: "marginBlockStart",
  maxHeight: "maxHeight",
  maxWidth: "maxWidth",
  minHeight: "minHeight",
  minWidth: "minWidth",
  objectFit: "objectFit",
  objectPosition: "objectPosition",
  opacity: "opacity",
  order: "order",
  overflow: "overflow",
  padding: "padding",
  paddingBlock: "paddingBlock",
  paddingBlockEnd: "paddingBlockEnd",
  paddingBlockStart: "paddingBlockStart",
  paddingBottom: "paddingBlockEnd",
  paddingInline: "paddingInline",
  paddingInlineEnd: "paddingInlineEnd",
  paddingInlineStart: "paddingInlineStart",
  paddingLeft: "paddingInlineStart",
  paddingRight: "paddingInlineEnd",
  paddingTop: "paddingBlockStart",
  position: "position",
  resize: "resize",
  right: "right",
  row: "gridRow",
  rowEnd: "gridRowEnd",
  rowGap: "rowGap",
  rowSpan: "gridRow",
  // Will set gridRow if no `row` prop given
  rowStart: "gridRowStart",
  shrink: "flexShrink",
  templateAreas: "gridTemplateAreas",
  templateColumns: "gridTemplateColumns",
  templateRows: "gridTemplateRows",
  textAlign: "textAlign",
  textDecoration: "textDecoration",
  textTransform: "textTransform",
  top: "top",
  transform: "transform",
  transformOrigin: "transformOrigin",
  width: "width",
  whiteSpace: "whiteSpace",
  wrap: "flexWrap"
};
const getMediaQueries = ({
  breakpoints: breakpoints2
}) => {
  const sortedBreakpoints = Object.keys(breakpoints2).sort((a2, b2) => breakpoints2[b2] - breakpoints2[a2]);
  return sortedBreakpoints.map((breakpoint, index2) => {
    let query = "";
    let minWidth = breakpoints2[breakpoint];
    const nextBreakpoint = sortedBreakpoints[index2 - 1];
    const maxWidth = nextBreakpoint ? breakpoints2[nextBreakpoint] - 1 : null;
    if (minWidth >= 0) {
      query = `(min-width: ${minWidth}px)`;
    }
    if (maxWidth !== null) {
      if (query) {
        query += " and ";
      }
      query += `(max-width: ${maxWidth}px)`;
    }
    return {
      breakpoint,
      query,
      maxWidth,
      minWidth
    };
  });
};
const useBreakpoint = ({
  breakpoints: breakpoints2,
  defaultBreakpoint
}) => {
  const supportMatchMedia = typeof window !== "undefined" && typeof window.matchMedia !== "undefined";
  const matchMedia = supportMatchMedia ? window.matchMedia : null;
  const mediaQueries = Rn.useMemo(() => getMediaQueries({
    breakpoints: breakpoints2
  }), [breakpoints2]);
  const [breakpoint, setBreakpoint] = Rn.useState(defaultBreakpoint);
  const updateBreakpoint = Rn.useCallback((matches, breakpoint2) => {
    if (matches) {
      setBreakpoint(breakpoint2);
    }
  }, [setBreakpoint]);
  useIsomorphicEffect(() => {
    if (!matchMedia) return;
    const unsubscribeList = mediaQueries.map(({
      query,
      breakpoint: breakpoint2
    }) => {
      const queryList = matchMedia(query);
      updateBreakpoint(queryList.matches, breakpoint2);
      const handleMediaChange = (event) => {
        if (event.matches) {
          setBreakpoint(breakpoint2);
        }
      };
      queryList.addEventListener("change", handleMediaChange);
      return () => queryList.removeEventListener("change", handleMediaChange);
    });
    return () => {
      unsubscribeList.forEach((unsubscribe) => unsubscribe());
    };
  }, [breakpoints2, setBreakpoint, matchMedia, mediaQueries]);
  Rn.useDebugValue(breakpoint, (breakpoint2) => breakpoint2);
  return breakpoint;
};
const useIsomorphicEffect = typeof window === "undefined" ? Rn.useEffect : Rn.useLayoutEffect;
const useTransformStyleProps = (props) => {
  const {
    rowSpan,
    columnSpan,
    row,
    column,
    ...rest
  } = props;
  const {
    rowFromSpanValue,
    columnFromSpanValue
  } = Rn.useMemo(() => {
    return {
      rowFromSpanValue: convertGridSpan(rowSpan),
      columnFromSpanValue: convertGridSpan(columnSpan)
    };
  }, [rowSpan, columnSpan]);
  return {
    row: !isNullOrEmptyString(row) ? row : rowFromSpanValue,
    column: !isNullOrEmptyString(column) ? column : columnFromSpanValue,
    ...rest
  };
};
const useStyles = (props, style) => {
  const {
    breakpoints: {
      values: breakpoints2,
      defaultBreakpoint
    }
  } = defaultTheme;
  const breakpoint = useBreakpoint({
    breakpoints: breakpoints2,
    defaultBreakpoint
  });
  const propStyles = useTransformStyleProps(props);
  return Rn.useMemo(() => convertStylePropsToStyleObj({
    props: propStyles,
    style,
    breakpoint,
    // @ts-ignore
    breakpoints: breakpoints2
  }), [propStyles, style, breakpoints2, breakpoint]);
};
const isSpanPrimitiveValue = (spanValue) => {
  return spanValue === "auto" || typeof spanValue === "number" && !isNaN(spanValue) || typeof spanValue === "string" && !isNaN(parseFloat(spanValue));
};
const convertGridSpan = (spanValue) => {
  if (isSpanPrimitiveValue(spanValue)) {
    return getGridSpan(spanValue);
  }
  if (Array.isArray(spanValue)) {
    return spanValue.map((value) => getGridSpan(value));
  }
  if (typeof spanValue === "object" && spanValue != null) {
    const newObj = {};
    Object.entries(spanValue).forEach(([key, value]) => {
      newObj[key] = getGridSpan(value);
    });
    return newObj;
  }
  return null;
};
const getGridSpan = (spanValue) => {
  return spanValue === "auto" ? "auto" : `span ${spanValue}`;
};
const convertStylePropsToStyleObj = ({
  props = {},
  style = {},
  breakpoint,
  breakpoints: breakpoints2
}) => {
  const nonStyleProps = {};
  Object.keys(props).filter((propKey) => props[propKey] != null).forEach((propKey) => {
    if (!(propKey in ComponentPropsToStylePropsMap)) {
      nonStyleProps[propKey] = props[propKey];
    } else if (!isEmptyString(props[propKey])) {
      let value = props[propKey];
      value = getValueAtCurrentBreakpoint(value, breakpoint, breakpoints2, propKey);
      const reactStyleProp = ComponentPropsToStylePropsMap[propKey];
      style = {
        ...style,
        [reactStyleProp]: value
      };
    }
  });
  return {
    propStyles: style,
    nonStyleProps
  };
};
function isDesignToken(arg) {
  if (typeof arg === "object" && arg !== null) {
    return arg.hasOwnProperty("value");
  } else {
    return false;
  }
}
function getValueAtCurrentBreakpoint(values, breakpoint, breakpoints2, propKey) {
  if (isDesignToken(values)) {
    return values.toString();
  }
  if (typeof values !== "object") {
    return getCSSVariableIfValueIsThemeKey(propKey, values);
  }
  let breakpointCompatValues = {};
  const breakpointsAscending = Object.keys(breakpoints2).sort((a2, b2) => breakpoints2[a2] - breakpoints2[b2]);
  if (Array.isArray(values)) {
    values.map((value, index2) => {
      breakpointCompatValues[breakpointsAscending[index2]] = value;
    });
  } else {
    breakpointCompatValues = values;
  }
  return getClosestValueByBreakpoint(
    // @ts-ignore
    propKey,
    breakpointCompatValues,
    breakpoint,
    breakpoints2
  );
}
function getClosestValueByBreakpoint(propKey, values, breakpoint, breakpoints2) {
  if (values.hasOwnProperty(breakpoint)) {
    const value = values[breakpoint];
    return isDesignToken(value) ? value.toString() : getCSSVariableIfValueIsThemeKey(propKey, value);
  }
  const breakpointsDesc = Object.keys(breakpoints2).sort((a2, b2) => breakpoints2[b2] - breakpoints2[a2]);
  const lowerBreakpoints = breakpointsDesc.slice(breakpointsDesc.indexOf(breakpoint));
  for (const breakpoint2 of lowerBreakpoints) {
    if (values.hasOwnProperty(breakpoint2)) {
      const value = values[breakpoint2];
      return isDesignToken(value) ? value.toString() : getCSSVariableIfValueIsThemeKey(propKey, value);
    }
  }
  return null;
}
const kebabCase = (string) => string.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
const CSS_VARIABLE_PREFIX = "amplify";
function cssNameTransform({
  path = []
}) {
  return `${kebabCase([CSS_VARIABLE_PREFIX, ...path].join(" "))}`;
}
function getCSSVariableIfValueIsThemeKey(propKey, value) {
  if (typeof value !== "string") {
    return value;
  }
  if (value.includes(" ")) {
    return value.split(" ").map((val) => getCSSVariableIfValueIsThemeKey(propKey, val)).join(" ");
  }
  const path = value.split(".");
  let {
    tokens
  } = defaultTheme;
  tokens = tokens[stylePropsToThemeKeys[propKey]];
  for (let i2 = 0; i2 < path.length; i2++) {
    if (tokens) {
      tokens = tokens[path[i2]];
      continue;
    }
    break;
  }
  return isDesignToken(tokens) ? `var(--${cssNameTransform({
    path: [stylePropsToThemeKeys[propKey], ...path]
  })})` : value;
}
const breakpoints = {
  values: {
    base: 0,
    small: 480,
    // breakpoint unit is px
    medium: 768,
    large: 992,
    xl: 1280,
    xxl: 1536
  },
  defaultBreakpoint: "base"
};
const defaultTheme = {
  tokens: {},
  breakpoints,
  name: "default-theme"
};
const stylePropsToThemeKeys = {
  backgroundColor: "colors",
  color: "colors",
  borderRadius: "radii",
  fontSize: "fontSizes",
  fontWeight: "fontWeights",
  fontFamily: "fonts",
  lineHeight: "lineHeights",
  opacity: "opacities",
  boxShadow: "shadows",
  transform: "transforms",
  left: "space",
  right: "space",
  top: "space",
  bottom: "space",
  height: "space",
  width: "space",
  letterSpacing: "space",
  margin: "space",
  marginBlock: "space",
  marginBlockEnd: "space",
  marginBlockStart: "space",
  marginInline: "space",
  marginInlineEnd: "space",
  marginInlineStart: "space",
  marginLeft: "space",
  marginRight: "space",
  marginTop: "space",
  marginBottom: "space",
  maxHeight: "space",
  maxWidth: "space",
  minHeight: "space",
  minWidth: "space",
  padding: "space",
  paddingBlock: "space",
  paddingBlockEnd: "space",
  paddingBlockStart: "space",
  paddingInline: "space",
  paddingInlineEnd: "space",
  paddingInlineStart: "space",
  paddingLeft: "space",
  paddingRight: "space",
  paddingTop: "space",
  paddingBottom: "space",
  gap: "space",
  columnGap: "space",
  rowGap: "space"
};
const classNameModifier = (base, modifier) => {
  return modifier ? `${base}--${modifier}` : null;
};
const classNameModifierByFlag = (base, modifier, flag) => {
  return flag ? `${base}--${modifier}` : null;
};
var f = 0;
function u(e2, t2, n2, o2, i2, u2) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f, __i: -1, __u: 0, __source: i2, __self: u2 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l$1.vnode && l$1.vnode(l2), l2;
}
const ViewPrimitive = ({
  as = "div",
  // @ts-ignore
  children,
  testId,
  ariaLabel,
  isDisabled,
  style,
  ...rest
}, ref) => {
  const {
    propStyles,
    nonStyleProps
  } = useStyles(rest, style);
  if (nonStyleProps.show === false) {
    return u(k$2, {});
  }
  return _$1(as, {
    "aria-label": ariaLabel,
    "data-testid": testId,
    disabled: isDisabled,
    ref,
    style: propStyles,
    ...nonStyleProps,
    show: void 0
  }, children);
};
const View = k(ViewPrimitive);
View.displayName = "View";
const FlexPrimitive = ({
  className,
  children,
  ...rest
}, ref) => u(View, {
  className: classNames("flex", className),
  ref,
  ...rest,
  children
});
const BaseFlex = k(FlexPrimitive);
Flex.displayName = "Flex";
function Flex(props) {
  const {
    wrap,
    render,
    ...restProps
  } = props;
  if (wrap) {
    return u(k$2, {
      children: wrap({
        ...restProps,
        children: u(BaseFlex, {
          ...restProps,
          children: render || props.children
        })
      })
    });
  }
  return u(BaseFlex, {
    ...restProps,
    children: render || props.children
  });
}
const defaultViewBox = {
  minX: 0,
  minY: 0,
  width: 24,
  height: 24
};
const IconPrimitive = ({
  className,
  // as can be used to render other icon react components too
  as = "svg",
  fill = "currentColor",
  pathData,
  viewBox = defaultViewBox,
  children,
  paths,
  ...rest
}, ref) => {
  const minX = viewBox.minX ? viewBox.minX : defaultViewBox.minX;
  const minY = viewBox.minY ? viewBox.minY : defaultViewBox.minY;
  const width = viewBox.width ? viewBox.width : defaultViewBox.width;
  const height = viewBox.height ? viewBox.height : defaultViewBox.height;
  let _children;
  if (children) {
    _children = children;
  }
  if (paths) {
    _children = paths.map((path, index2) => _$1("path", {
      ...path,
      key: index2
    }));
  }
  if (pathData) {
    _children = u("path", {
      d: pathData,
      fill
    });
  }
  return u(View, {
    as,
    className: classNames("icon", className),
    ref,
    width,
    height,
    viewBox: `${minX} ${minY} ${width} ${height}`,
    ...rest,
    children: _children
  });
};
const Icon = k(IconPrimitive);
Icon.displayName = "Icon";
const TextPrimitive = ({
  as = "p",
  className,
  children,
  label,
  modifiers,
  isTruncated,
  variation,
  display,
  ...rest
}, ref) => {
  const hasModifiers = modifiers == null ? void 0 : modifiers.length;
  const componentClasses = classNames("text", classNameModifier("text", variation), classNameModifierByFlag("text", "truncated", isTruncated), className);
  return u(View, {
    as,
    className: componentClasses,
    "data-truncate": isTruncated,
    "data-variation": variation,
    ref,
    ...!hasModifiers && {
      display
    },
    ...rest,
    children: hasModifiers ? u(LabelWithModifiers, {
      label,
      modifiers
    }) : label ?? children
  });
};
function LabelWithModifiers(props) {
  const arr = T$1(() => buildLabelArray(props.label, props.modifiers), [props.label, props.modifiers]);
  return u(k$2, {
    children: arr.map((item, i2) => {
      const text = props.label.substring(item.range[0], item.range[1] + 1);
      return item.modifier ? u(View, {
        as: "span",
        ...item.modifier.overrides,
        children: text
      }, i2) : u(k$2, {
        children: text
      }, i2);
    })
  });
}
const Text = k(TextPrimitive);
Text.displayName = "Text";
function buildLabelArray(label, modifiers) {
  const arr = [{
    modifier: null,
    range: [0, label.length - 1]
  }];
  for (let modifier of modifiers) {
    for (let i2 = 0; i2 < arr.length; i2++) {
      if (arr[i2].modifier == null && isModifierInRange(modifier, arr[i2].range)) {
        const notModifiedLeftItem = {
          modifier: null,
          range: [arr[i2].range[0], modifier.range[0] - 1]
        };
        const modifiedItem = {
          modifier,
          range: [modifier.range[0], modifier.range[1]]
        };
        const notModifiedEndItem = {
          modifier: null,
          range: [modifier.range[1] + 1, arr[i2].range[1]]
        };
        arr.splice(i2, 1, notModifiedLeftItem, modifiedItem, notModifiedEndItem);
      }
    }
  }
  return arr;
}
function isModifierInRange(modifier, range) {
  return modifier.range[0] >= range[0] && modifier.range[1] <= range[1];
}
function InstanceSwap(props) {
  const {
    swap,
    overrides,
    ...restProps
  } = props;
  return u(k$2, {
    children: swap(restProps)
  });
}
const ImagePrimitive = ({
  className,
  ...rest
}, ref) => u(View, {
  as: "img",
  ref,
  className: classNames("image", className),
  ...rest
});
const Image = k(ImagePrimitive);
Image.displayName = "Image";
const getOverrideProps = (overrides, elementHierarchy) => {
  if (!overrides) {
    return null;
  }
  const componentOverrides = Object.entries(overrides).filter(([key]) => key === elementHierarchy).flatMap(([, value]) => Object.entries(value)).filter((m2) => m2 == null ? void 0 : m2[0]);
  return Object.fromEntries(componentOverrides);
};
function LoadingIconV2$1(props) {
  const {
    overrides,
    swap,
    ...rootProps
  } = props;
  if (swap) {
    return u(InstanceSwap, {
      ...props
    });
  }
  return u(Flex, {
    gap: 0,
    direction: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    position: "relative",
    padding: "0px 0px 0px 0px",
    ...rootProps,
    ...getOverrideProps(overrides, "loadingIconV2"),
    children: u(View, {
      width: "30px",
      height: "30px",
      shrink: 0,
      overflow: "hidden",
      position: "relative",
      padding: "0px 0px 0px 0px",
      ...getOverrideProps(overrides, "content"),
      children: u(Icon, {
        width: "12.5px",
        height: "12.5px",
        viewBox: {
          "minX": 0,
          "minY": 0,
          "width": 12.5,
          "height": 12.5
        },
        paths: [{
          "d": "M12.5 2.5L12.5 0C10.8585 -8.32667e-16 9.23303 0.323322 7.71646 0.951506C6.19989 1.57969 4.8219 2.50043 3.66117 3.66117C1.31696 6.00537 2.22045e-15 9.18479 0 12.5L2.5 12.5C2.5 9.84783 3.55357 7.3043 5.42893 5.42893C7.3043 3.55357 9.84783 2.5 12.5 2.5Z",
          "fill": "currentColor",
          "fillRule": "nonzero"
        }],
        position: "absolute",
        top: "8.33%",
        bottom: "50%",
        left: "8.33%",
        right: "50%",
        color: "rgba(168,162,158,1)",
        ...getOverrideProps(overrides, "vector")
      })
    })
  });
}
function LoadingIconV2(props) {
  return u(LoadingIconV2$1, {
    ...props,
    overrides: combine(props.overrides, {
      content: {
        className: "animate-spin",
        ...props.size ? {
          width: props.size,
          height: props.size
        } : {}
      },
      ...props.size ? {
        vector: {
          width: 12.5 * getScaleMult(props.size, 30),
          height: 12.5 * getScaleMult(props.size, 30)
        }
      } : {}
    })
  });
}
function getScaleMult(a2, b2) {
  return a2 / b2;
}
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function CheckmarkV2Icon(props) {
  const {
    overrides,
    swap,
    ...rootProps
  } = props;
  if (swap) {
    return u(InstanceSwap, {
      ...props
    });
  }
  return u(Icon, {
    width: "26px",
    height: "26px",
    overflow: "hidden",
    position: "relative",
    padding: "0px 0px 0px 0px",
    viewBox: {
      "minX": 0,
      "minY": 0,
      "width": 26,
      "height": 26
    },
    paths: [{
      "d": "M10.8333 0C4.85333 0 0 4.85333 0 10.8333C0 16.8133 4.85333 21.6667 10.8333 21.6667C16.8133 21.6667 21.6667 16.8133 21.6667 10.8333C21.6667 4.85333 16.8133 0 10.8333 0ZM10.8333 19.5C6.05583 19.5 2.16667 15.6108 2.16667 10.8333C2.16667 6.05583 6.05583 2.16667 10.8333 2.16667C15.6108 2.16667 19.5 6.05583 19.5 10.8333C19.5 15.6108 15.6108 19.5 10.8333 19.5ZM15.0367 6.81417L8.66667 13.1842L6.63 11.1475C6.42744 10.9449 6.15271 10.8311 5.86625 10.8311C5.57979 10.8311 5.30506 10.9449 5.1025 11.1475C4.89994 11.3501 4.78614 11.6248 4.78614 11.9112C4.78614 12.1977 4.89994 12.4724 5.1025 12.675L7.90833 15.4808C8.33083 15.9033 9.01333 15.9033 9.43583 15.4808L16.575 8.34167C16.6754 8.24144 16.7551 8.1224 16.8095 7.99134C16.8638 7.86029 16.8918 7.7198 16.8918 7.57792C16.8918 7.43603 16.8638 7.29554 16.8095 7.16449C16.7551 7.03344 16.6754 6.91439 16.575 6.81417C16.1525 6.39167 15.4592 6.39167 15.0367 6.81417L15.0367 6.81417Z",
      "fill": "currentColor",
      "fillRule": "nonzero",
      "style": {
        "transform": "translate(8.33%, 8.33%)"
      }
    }],
    color: "rgba(120,113,108,1)",
    ...rootProps,
    ...getOverrideProps(overrides, "checkmarkV2Icon")
  });
}
function X(props) {
  const {
    overrides,
    swap,
    ...rootProps
  } = props;
  if (swap) {
    return u(InstanceSwap, {
      ...props
    });
  }
  return u(Icon, {
    width: "20px",
    height: "20px",
    overflow: "hidden",
    position: "relative",
    padding: "0px 0px 0px 0px",
    viewBox: {
      "minX": 0,
      "minY": 0,
      "width": 20,
      "height": 20
    },
    paths: [{
      "d": "M0.292787 0.305288C0.480314 0.117817 0.734622 0.0125018 0.999786 0.0125018C1.26495 0.0125018 1.51926 0.117817 1.70679 0.305288L5.99979 4.59829L10.2928 0.305288C10.385 0.209778 10.4954 0.133596 10.6174 0.0811869C10.7394 0.0287779 10.8706 0.00119157 11.0034 3.77571e-05C11.1362 -0.00111606 11.2678 0.0241854 11.3907 0.0744663C11.5136 0.124747 11.6253 0.199 11.7192 0.292893C11.8131 0.386786 11.8873 0.498438 11.9376 0.621334C11.9879 0.744231 12.0132 0.87591 12.012 1.00869C12.0109 1.14147 11.9833 1.27269 11.9309 1.39469C11.8785 1.5167 11.8023 1.62704 11.7068 1.71929L7.41379 6.01229L11.7068 10.3053C11.8889 10.4939 11.9897 10.7465 11.9875 11.0087C11.9852 11.2709 11.88 11.5217 11.6946 11.7071C11.5092 11.8925 11.2584 11.9977 10.9962 12C10.734 12.0022 10.4814 11.9014 10.2928 11.7193L5.99979 7.42629L1.70679 11.7193C1.51818 11.9014 1.26558 12.0022 1.00339 12C0.741188 11.9977 0.490376 11.8925 0.304968 11.7071C0.11956 11.5217 0.0143906 11.2709 0.0121121 11.0087C0.00983372 10.7465 0.110629 10.4939 0.292787 10.3053L4.58579 6.01229L0.292787 1.71929C0.105316 1.53176 0 1.27745 0 1.01229C0 0.747124 0.105316 0.492816 0.292787 0.305288L0.292787 0.305288Z",
      "fill": "currentColor",
      "fillRule": "evenodd",
      "style": {
        "transform": "translate(20%, 19.94%)"
      }
    }],
    color: "rgba(168,162,158,1)",
    ...rootProps,
    ...getOverrideProps(overrides, "x")
  });
}
function ToastV2(props) {
  const {
    event,
    onOpenPage,
    onBgAction
  } = props;
  const [hover, setHover] = Rn.useState(false);
  const timeoutRef = Rn.useRef(void 0);
  Rn.useEffect(() => {
    if (!event.timeout) {
      return;
    }
    if (hover) {
      clearTimeout(timeoutRef.current);
    } else {
      timeoutRef.current = setTimeout(() => {
        onBgAction("closeToast", {
          id: event.id
        });
      }, event.timeout);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [hover, event.timeout, event.id, onBgAction]);
  const handleMouseEnter = Rn.useCallback(() => {
    setHover(true);
  }, []);
  const handleMouseLeave = Rn.useCallback(() => {
    setHover(false);
  }, []);
  const handleActionClick = Rn.useCallback(async (ev) => {
    ev.preventDefault();
    if (event.action) {
      if ("url" in event.action) {
        onOpenPage(event.action.url);
      } else if ("bgAction" in event.action) {
        onBgAction(event.action.bgAction, event.action.bgActionProps);
        await sleep(50);
        onBgAction("closeToast", {
          id: event.id
        });
      }
    }
  }, [event, onOpenPage, onBgAction]);
  const handleClose = Rn.useCallback((ev) => {
    ev.preventDefault();
    onBgAction("closeToast", {
      id: event.id
    });
  }, [event.id, onBgAction]);
  const toastBgColor = event.type === "error" ? "bg-red-700" : "bg-[rgba(26,26,26,0.9)]";
  const textColor = event.type === "error" ? "text-white" : "text-gray-50";
  return u("div", {
    className: "w-full flex flex-col",
    onMouseEnter: event.timeout ? handleMouseEnter : void 0,
    onMouseLeave: event.timeout ? handleMouseLeave : void 0,
    children: u("div", {
      className: `w-full flex flex-row items-center rounded-lg shadow-custom-xs ${toastBgColor} opacity-90`,
      children: [u("div", {
        className: "flex-1 flex flex-row items-center gap-1.5 p-2 pl-4 text-gray-300",
        children: [event.type === "progress" ? u(LoadingIconV2, {
          size: 18
        }) : event.type !== "error" ? u(CheckmarkV2Icon, {
          width: "18px",
          height: "18px",
          className: "shrink-0"
        }) : null, u("span", {
          className: `paragraph-xs ${textColor} flex-1`,
          children: event.message
        })]
      }), event.action && u(k$2, {
        children: [u("div", {
          className: `w-[1px] h-5 ${event.type === "error" ? "bg-red-500" : "bg-gray-500"} shrink-0`
        }), u("button", {
          className: "group shrink-0 px-3 h-full flex items-center",
          onClick: handleActionClick,
          "data-navigable": "true",
          children: u("span", {
            className: `paragraph-xs font-medium ${textColor} group-hover:text-white`,
            children: event.action.message
          })
        })]
      }), u("div", {
        className: `w-[1px] h-5 ${event.type === "error" ? "bg-red-500" : "bg-gray-500"} shrink-0`
      }), u("button", {
        className: "group shrink-0 px-3 h-full flex items-center text-white",
        onClick: handleClose,
        "data-navigable": "true",
        children: u(X, {
          width: "16px",
          height: "16px",
          className: `${event.type === "error" ? "text-white" : "text-gray-400"} group-hover:text-white`
        })
      })]
    })
  });
}
function promisifyResponse(sendResponse, fn2) {
  new Promise(async (ok) => {
    sendResponse(await fn2());
  });
  return true;
}
function useReceiveMessage({
  destination,
  actionsMap
}) {
  Rn.useEffect(() => {
    var _a, _b;
    function handleMessage(request, sender, sendResponse) {
      console.log(`[${destination}] useReceiveMessage`, request);
      if (request.destination == destination) {
        return promisifyResponse(sendResponse, () => {
          var _a2;
          return (_a2 = actionsMap[request.event]) == null ? void 0 : _a2.call(actionsMap, request.props);
        });
      }
    }
    (_b = (_a = chrome == null ? void 0 : chrome.runtime) == null ? void 0 : _a.onMessage) == null ? void 0 : _b.addListener(handleMessage);
    return () => {
      var _a2, _b2;
      (_b2 = (_a2 = chrome == null ? void 0 : chrome.runtime) == null ? void 0 : _a2.onMessage) == null ? void 0 : _b2.removeListener(handleMessage);
    };
  }, []);
}
function Providers(props) {
  return u(k$2, {
    children: props.children
  });
}
function Tooltip() {
  const [session, setSession] = Rn.useState(null);
  const [isRemoving, setIsRemoving] = Rn.useState(false);
  function loadToastSession() {
    console.log("loadToastSession", session);
    return bgAsk("loadToastSession", void 0).then(setSession);
  }
  Rn.useEffect(() => {
    loadToastSession();
  }, []);
  useReceiveMessage({
    destination: "toast",
    actionsMap: {
      "updateToastEvent": async (ev) => {
        setIsRemoving(false);
        loadToastSession();
      },
      "removeToastEvent": async (ev) => {
        loadToastSession().then((x2) => {
        });
      }
    }
  });
  function removeToast() {
    setIsRemoving(true);
    setTimeout(() => {
      bgAsk("closeToast", void 0);
    }, 80);
  }
  if (!session) return u(k$2, {});
  if (!session.event) return u(Removing, {});
  const fadeStyle = {
    opacity: isRemoving ? 0 : 1,
    transition: "opacity 0.08s ease-out"
  };
  return u(Flex, {
    width: "324px",
    style: fadeStyle,
    children: u(ToastV2, {
      event: session.event,
      onOpenPage: (url) => {
        bgAsk("openPage", {
          url
        });
        removeToast();
      },
      onBgAction: (action, props) => {
        if (action === "closeToast") {
          removeToast();
          return;
        }
        bgAsk(action, props);
      }
    })
  });
}
function Removing() {
  Rn.useEffect(() => {
    bgAsk("closeToast", void 0);
  }, []);
  return u(k$2, {});
}
initElement(u(Providers, {
  children: u(Tooltip, {})
}));
