import ff, { app as Ue, ipcMain as ge, BrowserWindow as sr } from "electron";
import * as Tm from "path";
import Ae from "path";
import ya, { fileURLToPath as Pm } from "url";
import be from "node:process";
import fe from "node:path";
import { promisify as Te, isDeepStrictEqual as Go } from "node:util";
import ae from "node:fs";
import bt from "node:crypto";
import Ho from "node:assert";
import mf from "node:os";
import "node:events";
import "node:stream";
import Ko from "child_process";
import ua from "crypto";
import jt from "util";
import Ce, { Readable as Om } from "stream";
import go from "http";
import bo from "https";
import * as Wo from "fs";
import Nm from "fs";
import hf from "http2";
import km from "assert";
import vf from "tty";
import jm from "os";
import mt from "zlib";
import { EventEmitter as Am } from "events";
import Im from "better-sqlite3";
const Nt = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, yf = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), gf = 1e6, Cm = (e) => e >= "0" && e <= "9";
function bf(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= gf;
  }
  return !1;
}
function za(e, t) {
  return yf.has(e) ? !1 : (e && bf(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function qm(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let n = "", r = "start", s = !1, i = 0;
  for (const a of e) {
    if (i++, s) {
      n += a, s = !1;
      continue;
    }
    if (a === "\\") {
      if (r === "index")
        throw new Error(`Invalid character '${a}' in an index at position ${i}`);
      if (r === "indexEnd")
        throw new Error(`Invalid character '${a}' after an index at position ${i}`);
      s = !0, r = r === "start" ? "property" : r;
      continue;
    }
    switch (a) {
      case ".": {
        if (r === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${i}`);
        if (r === "indexEnd") {
          r = "property";
          break;
        }
        if (!za(n, t))
          return [];
        n = "", r = "property";
        break;
      }
      case "[": {
        if (r === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${i}`);
        if (r === "indexEnd") {
          r = "index";
          break;
        }
        if (r === "property" || r === "start") {
          if ((n || r === "property") && !za(n, t))
            return [];
          n = "";
        }
        r = "index";
        break;
      }
      case "]": {
        if (r === "index") {
          if (n === "")
            n = (t.pop() || "") + "[]", r = "property";
          else {
            const o = Number.parseInt(n, 10);
            !Number.isNaN(o) && Number.isFinite(o) && o >= 0 && o <= Number.MAX_SAFE_INTEGER && o <= gf && n === String(o) ? t.push(o) : t.push(n), n = "", r = "indexEnd";
          }
          break;
        }
        if (r === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${i}`);
        n += a;
        break;
      }
      default: {
        if (r === "index" && !Cm(a))
          throw new Error(`Invalid character '${a}' in an index at position ${i}`);
        if (r === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${i}`);
        r === "start" && (r = "property"), n += a;
      }
    }
  }
  switch (s && (n += "\\"), r) {
    case "property": {
      if (!za(n, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function ga(e) {
  if (typeof e == "string")
    return qm(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [n, r] of e.entries()) {
      if (typeof r != "string" && typeof r != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${n}, got ${typeof r}`);
      if (typeof r == "number" && !Number.isFinite(r))
        throw new TypeError(`Path segment at index ${n} must be a finite number, got ${r}`);
      if (yf.has(r))
        return [];
      typeof r == "string" && bf(r) ? t.push(Number.parseInt(r, 10)) : t.push(r);
    }
    return t;
  }
  return [];
}
function Jo(e, t, n) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return n === void 0 ? e : n;
  const r = ga(t);
  if (r.length === 0)
    return n;
  for (let s = 0; s < r.length; s++) {
    const i = r[s];
    if (e = e[i], e == null) {
      if (s !== r.length - 1)
        return n;
      break;
    }
  }
  return e === void 0 ? n : e;
}
function fr(e, t, n) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const r = e, s = ga(t);
  if (s.length === 0)
    return e;
  for (let i = 0; i < s.length; i++) {
    const a = s[i];
    if (i === s.length - 1)
      e[a] = n;
    else if (!Nt(e[a])) {
      const c = typeof s[i + 1] == "number";
      e[a] = c ? [] : {};
    }
    e = e[a];
  }
  return r;
}
function Lm(e, t) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = ga(t);
  if (n.length === 0)
    return !1;
  for (let r = 0; r < n.length; r++) {
    const s = n[r];
    if (r === n.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !Nt(e))
      return !1;
  }
}
function Va(e, t) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = ga(t);
  if (n.length === 0)
    return !1;
  for (const r of n) {
    if (!Nt(e) || !(r in e))
      return !1;
    e = e[r];
  }
  return !0;
}
const ft = mf.homedir(), _o = mf.tmpdir(), { env: Mt } = be, Dm = (e) => {
  const t = fe.join(ft, "Library");
  return {
    data: fe.join(t, "Application Support", e),
    config: fe.join(t, "Preferences", e),
    cache: fe.join(t, "Caches", e),
    log: fe.join(t, "Logs", e),
    temp: fe.join(_o, e)
  };
}, Fm = (e) => {
  const t = Mt.APPDATA || fe.join(ft, "AppData", "Roaming"), n = Mt.LOCALAPPDATA || fe.join(ft, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: fe.join(n, e, "Data"),
    config: fe.join(t, e, "Config"),
    cache: fe.join(n, e, "Cache"),
    log: fe.join(n, e, "Log"),
    temp: fe.join(_o, e)
  };
}, Mm = (e) => {
  const t = fe.basename(ft);
  return {
    data: fe.join(Mt.XDG_DATA_HOME || fe.join(ft, ".local", "share"), e),
    config: fe.join(Mt.XDG_CONFIG_HOME || fe.join(ft, ".config"), e),
    cache: fe.join(Mt.XDG_CACHE_HOME || fe.join(ft, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: fe.join(Mt.XDG_STATE_HOME || fe.join(ft, ".local", "state"), e),
    temp: fe.join(_o, t, e)
  };
};
function Um(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), be.platform === "darwin" ? Dm(e) : be.platform === "win32" ? Fm(e) : Mm(e);
}
const it = (e, t) => {
  const { onError: n } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(n);
  };
}, Qe = (e, t) => {
  const { onError: n } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (i) {
      return n(i);
    }
  };
}, zm = 250, ot = (e, t) => {
  const { isRetriable: n } = t;
  return function(s) {
    const { timeout: i } = s, a = s.interval ?? zm, o = Date.now() + i;
    return function c(...l) {
      return e.apply(void 0, l).catch((u) => {
        if (!n(u) || Date.now() >= o)
          throw u;
        const f = Math.round(a * Math.random());
        return f > 0 ? new Promise((b) => setTimeout(b, f)).then(() => c.apply(void 0, l)) : c.apply(void 0, l);
      });
    };
  };
}, ct = (e, t) => {
  const { isRetriable: n } = t;
  return function(s) {
    const { timeout: i } = s, a = Date.now() + i;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (l) {
          if (!n(l) || Date.now() >= a)
            throw l;
          continue;
        }
    };
  };
}, Ut = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Ut.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Vm && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Ut.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Ut.isNodeError(e))
      throw e;
    if (!Ut.isChangeErrorOk(e))
      throw e;
  }
}, mr = {
  onError: Ut.onChangeError
}, Le = {
  onError: () => {
  }
}, Vm = be.getuid ? !be.getuid() : !1, Pe = {
  isRetriable: Ut.isRetriableError
}, Oe = {
  attempt: {
    /* ASYNC */
    chmod: it(Te(ae.chmod), mr),
    chown: it(Te(ae.chown), mr),
    close: it(Te(ae.close), Le),
    fsync: it(Te(ae.fsync), Le),
    mkdir: it(Te(ae.mkdir), Le),
    realpath: it(Te(ae.realpath), Le),
    stat: it(Te(ae.stat), Le),
    unlink: it(Te(ae.unlink), Le),
    /* SYNC */
    chmodSync: Qe(ae.chmodSync, mr),
    chownSync: Qe(ae.chownSync, mr),
    closeSync: Qe(ae.closeSync, Le),
    existsSync: Qe(ae.existsSync, Le),
    fsyncSync: Qe(ae.fsync, Le),
    mkdirSync: Qe(ae.mkdirSync, Le),
    realpathSync: Qe(ae.realpathSync, Le),
    statSync: Qe(ae.statSync, Le),
    unlinkSync: Qe(ae.unlinkSync, Le)
  },
  retry: {
    /* ASYNC */
    close: ot(Te(ae.close), Pe),
    fsync: ot(Te(ae.fsync), Pe),
    open: ot(Te(ae.open), Pe),
    readFile: ot(Te(ae.readFile), Pe),
    rename: ot(Te(ae.rename), Pe),
    stat: ot(Te(ae.stat), Pe),
    write: ot(Te(ae.write), Pe),
    writeFile: ot(Te(ae.writeFile), Pe),
    /* SYNC */
    closeSync: ct(ae.closeSync, Pe),
    fsyncSync: ct(ae.fsyncSync, Pe),
    openSync: ct(ae.openSync, Pe),
    readFileSync: ct(ae.readFileSync, Pe),
    renameSync: ct(ae.renameSync, Pe),
    statSync: ct(ae.statSync, Pe),
    writeSync: ct(ae.writeSync, Pe),
    writeFileSync: ct(ae.writeFileSync, Pe)
  }
}, Bm = "utf8", Xo = 438, Gm = 511, Hm = {}, Km = be.geteuid ? be.geteuid() : -1, Wm = be.getegid ? be.getegid() : -1, Jm = 1e3, Xm = !!be.getuid;
be.getuid && be.getuid();
const Yo = 128, Ym = (e) => e instanceof Error && "code" in e, Qo = (e) => typeof e == "string", Ba = (e) => e === void 0, Qm = be.platform === "linux", _f = be.platform === "win32", xo = ["SIGHUP", "SIGINT", "SIGTERM"];
_f || xo.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Qm && xo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Zm {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const n of this.callbacks)
          n();
        t && (_f && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? be.kill(be.pid, "SIGTERM") : be.kill(be.pid, t));
      }
    }, this.hook = () => {
      be.once("exit", () => this.exit());
      for (const t of xo)
        try {
          be.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const eh = new Zm(), th = eh.register, Ne = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, n = !0) => {
    const r = Ne.truncate(t(e));
    return r in Ne.store ? Ne.get(e, t, n) : (Ne.store[r] = n, [r, () => delete Ne.store[r]]);
  },
  purge: (e) => {
    Ne.store[e] && (delete Ne.store[e], Oe.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Ne.store[e] && (delete Ne.store[e], Oe.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Ne.store)
      Ne.purgeSync(e);
  },
  truncate: (e) => {
    const t = fe.basename(e);
    if (t.length <= Yo)
      return e;
    const n = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!n)
      return e;
    const r = t.length - Yo;
    return `${e.slice(0, -t.length)}${n[1]}${n[2].slice(0, -r)}${n[3]}`;
  }
};
th(Ne.purgeSyncAll);
function xf(e, t, n = Hm) {
  if (Qo(n))
    return xf(e, t, { encoding: n });
  const s = { timeout: n.timeout ?? Jm };
  let i = null, a = null, o = null;
  try {
    const c = Oe.attempt.realpathSync(e), l = !!c;
    e = c || e, [a, i] = Ne.get(e, n.tmpCreate || Ne.create, n.tmpPurge !== !1);
    const u = Xm && Ba(n.chown), f = Ba(n.mode);
    if (l && (u || f)) {
      const d = Oe.attempt.statSync(e);
      d && (n = { ...n }, u && (n.chown = { uid: d.uid, gid: d.gid }), f && (n.mode = d.mode));
    }
    if (!l) {
      const d = fe.dirname(e);
      Oe.attempt.mkdirSync(d, {
        mode: Gm,
        recursive: !0
      });
    }
    o = Oe.retry.openSync(s)(a, "w", n.mode || Xo), n.tmpCreated && n.tmpCreated(a), Qo(t) ? Oe.retry.writeSync(s)(o, t, 0, n.encoding || Bm) : Ba(t) || Oe.retry.writeSync(s)(o, t, 0, t.length, 0), n.fsync !== !1 && (n.fsyncWait !== !1 ? Oe.retry.fsyncSync(s)(o) : Oe.attempt.fsync(o)), Oe.retry.closeSync(s)(o), o = null, n.chown && (n.chown.uid !== Km || n.chown.gid !== Wm) && Oe.attempt.chownSync(a, n.chown.uid, n.chown.gid), n.mode && n.mode !== Xo && Oe.attempt.chmodSync(a, n.mode);
    try {
      Oe.retry.renameSync(s)(a, e);
    } catch (d) {
      if (!Ym(d) || d.code !== "ENAMETOOLONG")
        throw d;
      Oe.retry.renameSync(s)(a, Ne.truncate(e));
    }
    i(), a = null;
  } finally {
    o && Oe.attempt.closeSync(o), a && Ne.purge(a);
  }
}
function ir(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var hr = { exports: {} }, Ga = {}, Ze = {}, _t = {}, Ha = {}, Ka = {}, Wa = {}, Zo;
function la() {
  return Zo || (Zo = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class n extends t {
      constructor(m) {
        if (super(), !e.IDENTIFIER.test(m))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = m;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = n;
    class r extends t {
      constructor(m) {
        super(), this._items = typeof m == "string" ? [m] : m;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const m = this._items[0];
        return m === "" || m === '""';
      }
      get str() {
        var m;
        return (m = this._str) !== null && m !== void 0 ? m : this._str = this._items.reduce((_, E) => `${_}${E}`, "");
      }
      get names() {
        var m;
        return (m = this._names) !== null && m !== void 0 ? m : this._names = this._items.reduce((_, E) => (E instanceof n && (_[E.str] = (_[E.str] || 0) + 1), _), {});
      }
    }
    e._Code = r, e.nil = new r("");
    function s(h, ...m) {
      const _ = [h[0]];
      let E = 0;
      for (; E < m.length; )
        o(_, m[E]), _.push(h[++E]);
      return new r(_);
    }
    e._ = s;
    const i = new r("+");
    function a(h, ...m) {
      const _ = [b(h[0])];
      let E = 0;
      for (; E < m.length; )
        _.push(i), o(_, m[E]), _.push(i, b(h[++E]));
      return c(_), new r(_);
    }
    e.str = a;
    function o(h, m) {
      m instanceof r ? h.push(...m._items) : m instanceof n ? h.push(m) : h.push(f(m));
    }
    e.addCodeArg = o;
    function c(h) {
      let m = 1;
      for (; m < h.length - 1; ) {
        if (h[m] === i) {
          const _ = l(h[m - 1], h[m + 1]);
          if (_ !== void 0) {
            h.splice(m - 1, 3, _);
            continue;
          }
          h[m++] = "+";
        }
        m++;
      }
    }
    function l(h, m) {
      if (m === '""')
        return h;
      if (h === '""')
        return m;
      if (typeof h == "string")
        return m instanceof n || h[h.length - 1] !== '"' ? void 0 : typeof m != "string" ? `${h.slice(0, -1)}${m}"` : m[0] === '"' ? h.slice(0, -1) + m.slice(1) : void 0;
      if (typeof m == "string" && m[0] === '"' && !(h instanceof n))
        return `"${h}${m.slice(1)}`;
    }
    function u(h, m) {
      return m.emptyStr() ? h : h.emptyStr() ? m : a`${h}${m}`;
    }
    e.strConcat = u;
    function f(h) {
      return typeof h == "number" || typeof h == "boolean" || h === null ? h : b(Array.isArray(h) ? h.join(",") : h);
    }
    function d(h) {
      return new r(b(h));
    }
    e.stringify = d;
    function b(h) {
      return JSON.stringify(h).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = b;
    function v(h) {
      return typeof h == "string" && e.IDENTIFIER.test(h) ? new r(`.${h}`) : s`[${h}]`;
    }
    e.getProperty = v;
    function y(h) {
      if (typeof h == "string" && e.IDENTIFIER.test(h))
        return new r(`${h}`);
      throw new Error(`CodeGen: invalid export name: ${h}, use explicit $id name mapping`);
    }
    e.getEsmExportName = y;
    function p(h) {
      return new r(h.toString());
    }
    e.regexpCode = p;
  })(Wa)), Wa;
}
var Ja = {}, ec;
function tc() {
  return ec || (ec = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = la();
    class n extends Error {
      constructor(l) {
        super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
      }
    }
    var r;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(r || (e.UsedValueState = r = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class s {
      constructor({ prefixes: l, parent: u } = {}) {
        this._names = {}, this._prefixes = l, this._parent = u;
      }
      toName(l) {
        return l instanceof t.Name ? l : this.name(l);
      }
      name(l) {
        return new t.Name(this._newName(l));
      }
      _newName(l) {
        const u = this._names[l] || this._nameGroup(l);
        return `${l}${u.index++}`;
      }
      _nameGroup(l) {
        var u, f;
        if (!((f = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || f === void 0) && f.has(l) || this._prefixes && !this._prefixes.has(l))
          throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
        return this._names[l] = { prefix: l, index: 0 };
      }
    }
    e.Scope = s;
    class i extends t.Name {
      constructor(l, u) {
        super(u), this.prefix = l;
      }
      setValue(l, { property: u, itemIndex: f }) {
        this.value = l, this.scopePath = (0, t._)`.${new t.Name(u)}[${f}]`;
      }
    }
    e.ValueScopeName = i;
    const a = (0, t._)`\n`;
    class o extends s {
      constructor(l) {
        super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? a : t.nil };
      }
      get() {
        return this._scope;
      }
      name(l) {
        return new i(l, this._newName(l));
      }
      value(l, u) {
        var f;
        if (u.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const d = this.toName(l), { prefix: b } = d, v = (f = u.key) !== null && f !== void 0 ? f : u.ref;
        let y = this._values[b];
        if (y) {
          const m = y.get(v);
          if (m)
            return m;
        } else
          y = this._values[b] = /* @__PURE__ */ new Map();
        y.set(v, d);
        const p = this._scope[b] || (this._scope[b] = []), h = p.length;
        return p[h] = u.ref, d.setValue(u, { property: b, itemIndex: h }), d;
      }
      getValue(l, u) {
        const f = this._values[l];
        if (f)
          return f.get(u);
      }
      scopeRefs(l, u = this._values) {
        return this._reduceValues(u, (f) => {
          if (f.scopePath === void 0)
            throw new Error(`CodeGen: name "${f}" has no value`);
          return (0, t._)`${l}${f.scopePath}`;
        });
      }
      scopeCode(l = this._values, u, f) {
        return this._reduceValues(l, (d) => {
          if (d.value === void 0)
            throw new Error(`CodeGen: name "${d}" has no value`);
          return d.value.code;
        }, u, f);
      }
      _reduceValues(l, u, f = {}, d) {
        let b = t.nil;
        for (const v in l) {
          const y = l[v];
          if (!y)
            continue;
          const p = f[v] = f[v] || /* @__PURE__ */ new Map();
          y.forEach((h) => {
            if (p.has(h))
              return;
            p.set(h, r.Started);
            let m = u(h);
            if (m) {
              const _ = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              b = (0, t._)`${b}${_} ${h} = ${m};${this.opts._n}`;
            } else if (m = d?.(h))
              b = (0, t._)`${b}${m}${this.opts._n}`;
            else
              throw new n(h);
            p.set(h, r.Completed);
          });
        }
        return b;
      }
    }
    e.ValueScope = o;
  })(Ja)), Ja;
}
var rc;
function se() {
  return rc || (rc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = la(), n = tc();
    var r = la();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return r.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return r.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return r.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } });
    var s = tc();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class i {
      optimizeNodes() {
        return this;
      }
      optimizeNames(g, $) {
        return this;
      }
    }
    class a extends i {
      constructor(g, $, k) {
        super(), this.varKind = g, this.name = $, this.rhs = k;
      }
      render({ es5: g, _n: $ }) {
        const k = g ? n.varKinds.var : this.varKind, B = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${k} ${this.name}${B};` + $;
      }
      optimizeNames(g, $) {
        if (g[this.name.str])
          return this.rhs && (this.rhs = F(this.rhs, g, $)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class o extends i {
      constructor(g, $, k) {
        super(), this.lhs = g, this.rhs = $, this.sideEffects = k;
      }
      render({ _n: g }) {
        return `${this.lhs} = ${this.rhs};` + g;
      }
      optimizeNames(g, $) {
        if (!(this.lhs instanceof t.Name && !g[this.lhs.str] && !this.sideEffects))
          return this.rhs = F(this.rhs, g, $), this;
      }
      get names() {
        const g = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return H(g, this.rhs);
      }
    }
    class c extends o {
      constructor(g, $, k, B) {
        super(g, k, B), this.op = $;
      }
      render({ _n: g }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + g;
      }
    }
    class l extends i {
      constructor(g) {
        super(), this.label = g, this.names = {};
      }
      render({ _n: g }) {
        return `${this.label}:` + g;
      }
    }
    class u extends i {
      constructor(g) {
        super(), this.label = g, this.names = {};
      }
      render({ _n: g }) {
        return `break${this.label ? ` ${this.label}` : ""};` + g;
      }
    }
    class f extends i {
      constructor(g) {
        super(), this.error = g;
      }
      render({ _n: g }) {
        return `throw ${this.error};` + g;
      }
      get names() {
        return this.error.names;
      }
    }
    class d extends i {
      constructor(g) {
        super(), this.code = g;
      }
      render({ _n: g }) {
        return `${this.code};` + g;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(g, $) {
        return this.code = F(this.code, g, $), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class b extends i {
      constructor(g = []) {
        super(), this.nodes = g;
      }
      render(g) {
        return this.nodes.reduce(($, k) => $ + k.render(g), "");
      }
      optimizeNodes() {
        const { nodes: g } = this;
        let $ = g.length;
        for (; $--; ) {
          const k = g[$].optimizeNodes();
          Array.isArray(k) ? g.splice($, 1, ...k) : k ? g[$] = k : g.splice($, 1);
        }
        return g.length > 0 ? this : void 0;
      }
      optimizeNames(g, $) {
        const { nodes: k } = this;
        let B = k.length;
        for (; B--; ) {
          const W = k[B];
          W.optimizeNames(g, $) || (K(g, W.names), k.splice(B, 1));
        }
        return k.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((g, $) => G(g, $.names), {});
      }
    }
    class v extends b {
      render(g) {
        return "{" + g._n + super.render(g) + "}" + g._n;
      }
    }
    class y extends b {
    }
    class p extends v {
    }
    p.kind = "else";
    class h extends v {
      constructor(g, $) {
        super($), this.condition = g;
      }
      render(g) {
        let $ = `if(${this.condition})` + super.render(g);
        return this.else && ($ += "else " + this.else.render(g)), $;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const g = this.condition;
        if (g === !0)
          return this.nodes;
        let $ = this.else;
        if ($) {
          const k = $.optimizeNodes();
          $ = this.else = Array.isArray(k) ? new p(k) : k;
        }
        if ($)
          return g === !1 ? $ instanceof h ? $ : $.nodes : this.nodes.length ? this : new h(q(g), $ instanceof h ? [$] : $.nodes);
        if (!(g === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(g, $) {
        var k;
        if (this.else = (k = this.else) === null || k === void 0 ? void 0 : k.optimizeNames(g, $), !!(super.optimizeNames(g, $) || this.else))
          return this.condition = F(this.condition, g, $), this;
      }
      get names() {
        const g = super.names;
        return H(g, this.condition), this.else && G(g, this.else.names), g;
      }
    }
    h.kind = "if";
    class m extends v {
    }
    m.kind = "for";
    class _ extends m {
      constructor(g) {
        super(), this.iteration = g;
      }
      render(g) {
        return `for(${this.iteration})` + super.render(g);
      }
      optimizeNames(g, $) {
        if (super.optimizeNames(g, $))
          return this.iteration = F(this.iteration, g, $), this;
      }
      get names() {
        return G(super.names, this.iteration.names);
      }
    }
    class E extends m {
      constructor(g, $, k, B) {
        super(), this.varKind = g, this.name = $, this.from = k, this.to = B;
      }
      render(g) {
        const $ = g.es5 ? n.varKinds.var : this.varKind, { name: k, from: B, to: W } = this;
        return `for(${$} ${k}=${B}; ${k}<${W}; ${k}++)` + super.render(g);
      }
      get names() {
        const g = H(super.names, this.from);
        return H(g, this.to);
      }
    }
    class x extends m {
      constructor(g, $, k, B) {
        super(), this.loop = g, this.varKind = $, this.name = k, this.iterable = B;
      }
      render(g) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(g);
      }
      optimizeNames(g, $) {
        if (super.optimizeNames(g, $))
          return this.iterable = F(this.iterable, g, $), this;
      }
      get names() {
        return G(super.names, this.iterable.names);
      }
    }
    class w extends v {
      constructor(g, $, k) {
        super(), this.name = g, this.args = $, this.async = k;
      }
      render(g) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(g);
      }
    }
    w.kind = "func";
    class S extends b {
      render(g) {
        return "return " + super.render(g);
      }
    }
    S.kind = "return";
    class P extends v {
      render(g) {
        let $ = "try" + super.render(g);
        return this.catch && ($ += this.catch.render(g)), this.finally && ($ += this.finally.render(g)), $;
      }
      optimizeNodes() {
        var g, $;
        return super.optimizeNodes(), (g = this.catch) === null || g === void 0 || g.optimizeNodes(), ($ = this.finally) === null || $ === void 0 || $.optimizeNodes(), this;
      }
      optimizeNames(g, $) {
        var k, B;
        return super.optimizeNames(g, $), (k = this.catch) === null || k === void 0 || k.optimizeNames(g, $), (B = this.finally) === null || B === void 0 || B.optimizeNames(g, $), this;
      }
      get names() {
        const g = super.names;
        return this.catch && G(g, this.catch.names), this.finally && G(g, this.finally.names), g;
      }
    }
    class C extends v {
      constructor(g) {
        super(), this.error = g;
      }
      render(g) {
        return `catch(${this.error})` + super.render(g);
      }
    }
    C.kind = "catch";
    class M extends v {
      render(g) {
        return "finally" + super.render(g);
      }
    }
    M.kind = "finally";
    class L {
      constructor(g, $ = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...$, _n: $.lines ? `
` : "" }, this._extScope = g, this._scope = new n.Scope({ parent: g }), this._nodes = [new y()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(g) {
        return this._scope.name(g);
      }
      // reserves unique name in the external scope
      scopeName(g) {
        return this._extScope.name(g);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(g, $) {
        const k = this._extScope.value(g, $);
        return (this._values[k.prefix] || (this._values[k.prefix] = /* @__PURE__ */ new Set())).add(k), k;
      }
      getScopeValue(g, $) {
        return this._extScope.getValue(g, $);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(g) {
        return this._extScope.scopeRefs(g, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(g, $, k, B) {
        const W = this._scope.toName($);
        return k !== void 0 && B && (this._constants[W.str] = k), this._leafNode(new a(g, W, k)), W;
      }
      // `const` declaration (`var` in es5 mode)
      const(g, $, k) {
        return this._def(n.varKinds.const, g, $, k);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(g, $, k) {
        return this._def(n.varKinds.let, g, $, k);
      }
      // `var` declaration with optional assignment
      var(g, $, k) {
        return this._def(n.varKinds.var, g, $, k);
      }
      // assignment code
      assign(g, $, k) {
        return this._leafNode(new o(g, $, k));
      }
      // `+=` code
      add(g, $) {
        return this._leafNode(new c(g, e.operators.ADD, $));
      }
      // appends passed SafeExpr to code or executes Block
      code(g) {
        return typeof g == "function" ? g() : g !== t.nil && this._leafNode(new d(g)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...g) {
        const $ = ["{"];
        for (const [k, B] of g)
          $.length > 1 && $.push(","), $.push(k), (k !== B || this.opts.es5) && ($.push(":"), (0, t.addCodeArg)($, B));
        return $.push("}"), new t._Code($);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(g, $, k) {
        if (this._blockNode(new h(g)), $ && k)
          this.code($).else().code(k).endIf();
        else if ($)
          this.code($).endIf();
        else if (k)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(g) {
        return this._elseNode(new h(g));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new p());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(h, p);
      }
      _for(g, $) {
        return this._blockNode(g), $ && this.code($).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(g, $) {
        return this._for(new _(g), $);
      }
      // `for` statement for a range of values
      forRange(g, $, k, B, W = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
        const Z = this._scope.toName(g);
        return this._for(new E(W, Z, $, k), () => B(Z));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(g, $, k, B = n.varKinds.const) {
        const W = this._scope.toName(g);
        if (this.opts.es5) {
          const Z = $ instanceof t.Name ? $ : this.var("_arr", $);
          return this.forRange("_i", 0, (0, t._)`${Z}.length`, (Y) => {
            this.var(W, (0, t._)`${Z}[${Y}]`), k(W);
          });
        }
        return this._for(new x("of", B, W, $), () => k(W));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(g, $, k, B = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(g, (0, t._)`Object.keys(${$})`, k);
        const W = this._scope.toName(g);
        return this._for(new x("in", B, W, $), () => k(W));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(m);
      }
      // `label` statement
      label(g) {
        return this._leafNode(new l(g));
      }
      // `break` statement
      break(g) {
        return this._leafNode(new u(g));
      }
      // `return` statement
      return(g) {
        const $ = new S();
        if (this._blockNode($), this.code(g), $.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(S);
      }
      // `try` statement
      try(g, $, k) {
        if (!$ && !k)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const B = new P();
        if (this._blockNode(B), this.code(g), $) {
          const W = this.name("e");
          this._currNode = B.catch = new C(W), $(W);
        }
        return k && (this._currNode = B.finally = new M(), this.code(k)), this._endBlockNode(C, M);
      }
      // `throw` statement
      throw(g) {
        return this._leafNode(new f(g));
      }
      // start self-balancing block
      block(g, $) {
        return this._blockStarts.push(this._nodes.length), g && this.code(g).endBlock($), this;
      }
      // end the current self-balancing block
      endBlock(g) {
        const $ = this._blockStarts.pop();
        if ($ === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const k = this._nodes.length - $;
        if (k < 0 || g !== void 0 && k !== g)
          throw new Error(`CodeGen: wrong number of nodes: ${k} vs ${g} expected`);
        return this._nodes.length = $, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(g, $ = t.nil, k, B) {
        return this._blockNode(new w(g, $, k)), B && this.code(B).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(w);
      }
      optimize(g = 1) {
        for (; g-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(g) {
        return this._currNode.nodes.push(g), this;
      }
      _blockNode(g) {
        this._currNode.nodes.push(g), this._nodes.push(g);
      }
      _endBlockNode(g, $) {
        const k = this._currNode;
        if (k instanceof g || $ && k instanceof $)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${$ ? `${g.kind}/${$.kind}` : g.kind}"`);
      }
      _elseNode(g) {
        const $ = this._currNode;
        if (!($ instanceof h))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = $.else = g, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const g = this._nodes;
        return g[g.length - 1];
      }
      set _currNode(g) {
        const $ = this._nodes;
        $[$.length - 1] = g;
      }
    }
    e.CodeGen = L;
    function G(O, g) {
      for (const $ in g)
        O[$] = (O[$] || 0) + (g[$] || 0);
      return O;
    }
    function H(O, g) {
      return g instanceof t._CodeOrName ? G(O, g.names) : O;
    }
    function F(O, g, $) {
      if (O instanceof t.Name)
        return k(O);
      if (!B(O))
        return O;
      return new t._Code(O._items.reduce((W, Z) => (Z instanceof t.Name && (Z = k(Z)), Z instanceof t._Code ? W.push(...Z._items) : W.push(Z), W), []));
      function k(W) {
        const Z = $[W.str];
        return Z === void 0 || g[W.str] !== 1 ? W : (delete g[W.str], Z);
      }
      function B(W) {
        return W instanceof t._Code && W._items.some((Z) => Z instanceof t.Name && g[Z.str] === 1 && $[Z.str] !== void 0);
      }
    }
    function K(O, g) {
      for (const $ in g)
        O[$] = (O[$] || 0) - (g[$] || 0);
    }
    function q(O) {
      return typeof O == "boolean" || typeof O == "number" || O === null ? !O : (0, t._)`!${j(O)}`;
    }
    e.not = q;
    const U = R(e.operators.AND);
    function D(...O) {
      return O.reduce(U);
    }
    e.and = D;
    const J = R(e.operators.OR);
    function A(...O) {
      return O.reduce(J);
    }
    e.or = A;
    function R(O) {
      return (g, $) => g === t.nil ? $ : $ === t.nil ? g : (0, t._)`${j(g)} ${O} ${j($)}`;
    }
    function j(O) {
      return O instanceof t.Name ? O : (0, t._)`(${O})`;
    }
  })(Ka)), Ka;
}
var ie = {}, nc;
function ue() {
  if (nc) return ie;
  nc = 1, Object.defineProperty(ie, "__esModule", { value: !0 }), ie.checkStrictMode = ie.getErrorPath = ie.Type = ie.useFunc = ie.setEvaluated = ie.evaluatedPropsToName = ie.mergeEvaluated = ie.eachItem = ie.unescapeJsonPointer = ie.escapeJsonPointer = ie.escapeFragment = ie.unescapeFragment = ie.schemaRefOrVal = ie.schemaHasRulesButRef = ie.schemaHasRules = ie.checkUnknownRules = ie.alwaysValidSchema = ie.toHash = void 0;
  const e = se(), t = la();
  function n(x) {
    const w = {};
    for (const S of x)
      w[S] = !0;
    return w;
  }
  ie.toHash = n;
  function r(x, w) {
    return typeof w == "boolean" ? w : Object.keys(w).length === 0 ? !0 : (s(x, w), !i(w, x.self.RULES.all));
  }
  ie.alwaysValidSchema = r;
  function s(x, w = x.schema) {
    const { opts: S, self: P } = x;
    if (!S.strictSchema || typeof w == "boolean")
      return;
    const C = P.RULES.keywords;
    for (const M in w)
      C[M] || E(x, `unknown keyword: "${M}"`);
  }
  ie.checkUnknownRules = s;
  function i(x, w) {
    if (typeof x == "boolean")
      return !x;
    for (const S in x)
      if (w[S])
        return !0;
    return !1;
  }
  ie.schemaHasRules = i;
  function a(x, w) {
    if (typeof x == "boolean")
      return !x;
    for (const S in x)
      if (S !== "$ref" && w.all[S])
        return !0;
    return !1;
  }
  ie.schemaHasRulesButRef = a;
  function o({ topSchemaRef: x, schemaPath: w }, S, P, C) {
    if (!C) {
      if (typeof S == "number" || typeof S == "boolean")
        return S;
      if (typeof S == "string")
        return (0, e._)`${S}`;
    }
    return (0, e._)`${x}${w}${(0, e.getProperty)(P)}`;
  }
  ie.schemaRefOrVal = o;
  function c(x) {
    return f(decodeURIComponent(x));
  }
  ie.unescapeFragment = c;
  function l(x) {
    return encodeURIComponent(u(x));
  }
  ie.escapeFragment = l;
  function u(x) {
    return typeof x == "number" ? `${x}` : x.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  ie.escapeJsonPointer = u;
  function f(x) {
    return x.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  ie.unescapeJsonPointer = f;
  function d(x, w) {
    if (Array.isArray(x))
      for (const S of x)
        w(S);
    else
      w(x);
  }
  ie.eachItem = d;
  function b({ mergeNames: x, mergeToName: w, mergeValues: S, resultToName: P }) {
    return (C, M, L, G) => {
      const H = L === void 0 ? M : L instanceof e.Name ? (M instanceof e.Name ? x(C, M, L) : w(C, M, L), L) : M instanceof e.Name ? (w(C, L, M), M) : S(M, L);
      return G === e.Name && !(H instanceof e.Name) ? P(C, H) : H;
    };
  }
  ie.mergeEvaluated = {
    props: b({
      mergeNames: (x, w, S) => x.if((0, e._)`${S} !== true && ${w} !== undefined`, () => {
        x.if((0, e._)`${w} === true`, () => x.assign(S, !0), () => x.assign(S, (0, e._)`${S} || {}`).code((0, e._)`Object.assign(${S}, ${w})`));
      }),
      mergeToName: (x, w, S) => x.if((0, e._)`${S} !== true`, () => {
        w === !0 ? x.assign(S, !0) : (x.assign(S, (0, e._)`${S} || {}`), y(x, S, w));
      }),
      mergeValues: (x, w) => x === !0 ? !0 : { ...x, ...w },
      resultToName: v
    }),
    items: b({
      mergeNames: (x, w, S) => x.if((0, e._)`${S} !== true && ${w} !== undefined`, () => x.assign(S, (0, e._)`${w} === true ? true : ${S} > ${w} ? ${S} : ${w}`)),
      mergeToName: (x, w, S) => x.if((0, e._)`${S} !== true`, () => x.assign(S, w === !0 ? !0 : (0, e._)`${S} > ${w} ? ${S} : ${w}`)),
      mergeValues: (x, w) => x === !0 ? !0 : Math.max(x, w),
      resultToName: (x, w) => x.var("items", w)
    })
  };
  function v(x, w) {
    if (w === !0)
      return x.var("props", !0);
    const S = x.var("props", (0, e._)`{}`);
    return w !== void 0 && y(x, S, w), S;
  }
  ie.evaluatedPropsToName = v;
  function y(x, w, S) {
    Object.keys(S).forEach((P) => x.assign((0, e._)`${w}${(0, e.getProperty)(P)}`, !0));
  }
  ie.setEvaluated = y;
  const p = {};
  function h(x, w) {
    return x.scopeValue("func", {
      ref: w,
      code: p[w.code] || (p[w.code] = new t._Code(w.code))
    });
  }
  ie.useFunc = h;
  var m;
  (function(x) {
    x[x.Num = 0] = "Num", x[x.Str = 1] = "Str";
  })(m || (ie.Type = m = {}));
  function _(x, w, S) {
    if (x instanceof e.Name) {
      const P = w === m.Num;
      return S ? P ? (0, e._)`"[" + ${x} + "]"` : (0, e._)`"['" + ${x} + "']"` : P ? (0, e._)`"/" + ${x}` : (0, e._)`"/" + ${x}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return S ? (0, e.getProperty)(x).toString() : "/" + u(x);
  }
  ie.getErrorPath = _;
  function E(x, w, S = x.opts.strictSchema) {
    if (S) {
      if (w = `strict mode: ${w}`, S === !0)
        throw new Error(w);
      x.self.logger.warn(w);
    }
  }
  return ie.checkStrictMode = E, ie;
}
var vr = {}, ac;
function Ge() {
  if (ac) return vr;
  ac = 1, Object.defineProperty(vr, "__esModule", { value: !0 });
  const e = se(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return vr.default = t, vr;
}
var sc;
function ba() {
  return sc || (sc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = se(), n = ue(), r = Ge();
    e.keywordError = {
      message: ({ keyword: p }) => (0, t.str)`must pass "${p}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: p, schemaType: h }) => h ? (0, t.str)`"${p}" keyword must be ${h} ($data)` : (0, t.str)`"${p}" keyword is invalid ($data)`
    };
    function s(p, h = e.keywordError, m, _) {
      const { it: E } = p, { gen: x, compositeRule: w, allErrors: S } = E, P = f(p, h, m);
      _ ?? (w || S) ? c(x, P) : l(E, (0, t._)`[${P}]`);
    }
    e.reportError = s;
    function i(p, h = e.keywordError, m) {
      const { it: _ } = p, { gen: E, compositeRule: x, allErrors: w } = _, S = f(p, h, m);
      c(E, S), x || w || l(_, r.default.vErrors);
    }
    e.reportExtraError = i;
    function a(p, h) {
      p.assign(r.default.errors, h), p.if((0, t._)`${r.default.vErrors} !== null`, () => p.if(h, () => p.assign((0, t._)`${r.default.vErrors}.length`, h), () => p.assign(r.default.vErrors, null)));
    }
    e.resetErrorsCount = a;
    function o({ gen: p, keyword: h, schemaValue: m, data: _, errsCount: E, it: x }) {
      if (E === void 0)
        throw new Error("ajv implementation error");
      const w = p.name("err");
      p.forRange("i", E, r.default.errors, (S) => {
        p.const(w, (0, t._)`${r.default.vErrors}[${S}]`), p.if((0, t._)`${w}.instancePath === undefined`, () => p.assign((0, t._)`${w}.instancePath`, (0, t.strConcat)(r.default.instancePath, x.errorPath))), p.assign((0, t._)`${w}.schemaPath`, (0, t.str)`${x.errSchemaPath}/${h}`), x.opts.verbose && (p.assign((0, t._)`${w}.schema`, m), p.assign((0, t._)`${w}.data`, _));
      });
    }
    e.extendErrors = o;
    function c(p, h) {
      const m = p.const("err", h);
      p.if((0, t._)`${r.default.vErrors} === null`, () => p.assign(r.default.vErrors, (0, t._)`[${m}]`), (0, t._)`${r.default.vErrors}.push(${m})`), p.code((0, t._)`${r.default.errors}++`);
    }
    function l(p, h) {
      const { gen: m, validateName: _, schemaEnv: E } = p;
      E.$async ? m.throw((0, t._)`new ${p.ValidationError}(${h})`) : (m.assign((0, t._)`${_}.errors`, h), m.return(!1));
    }
    const u = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function f(p, h, m) {
      const { createErrors: _ } = p.it;
      return _ === !1 ? (0, t._)`{}` : d(p, h, m);
    }
    function d(p, h, m = {}) {
      const { gen: _, it: E } = p, x = [
        b(E, m),
        v(p, m)
      ];
      return y(p, h, x), _.object(...x);
    }
    function b({ errorPath: p }, { instancePath: h }) {
      const m = h ? (0, t.str)`${p}${(0, n.getErrorPath)(h, n.Type.Str)}` : p;
      return [r.default.instancePath, (0, t.strConcat)(r.default.instancePath, m)];
    }
    function v({ keyword: p, it: { errSchemaPath: h } }, { schemaPath: m, parentSchema: _ }) {
      let E = _ ? h : (0, t.str)`${h}/${p}`;
      return m && (E = (0, t.str)`${E}${(0, n.getErrorPath)(m, n.Type.Str)}`), [u.schemaPath, E];
    }
    function y(p, { params: h, message: m }, _) {
      const { keyword: E, data: x, schemaValue: w, it: S } = p, { opts: P, propertyName: C, topSchemaRef: M, schemaPath: L } = S;
      _.push([u.keyword, E], [u.params, typeof h == "function" ? h(p) : h || (0, t._)`{}`]), P.messages && _.push([u.message, typeof m == "function" ? m(p) : m]), P.verbose && _.push([u.schema, w], [u.parentSchema, (0, t._)`${M}${L}`], [r.default.data, x]), C && _.push([u.propertyName, C]);
    }
  })(Ha)), Ha;
}
var ic;
function rh() {
  if (ic) return _t;
  ic = 1, Object.defineProperty(_t, "__esModule", { value: !0 }), _t.boolOrEmptySchema = _t.topBoolOrEmptySchema = void 0;
  const e = ba(), t = se(), n = Ge(), r = {
    message: "boolean schema is false"
  };
  function s(o) {
    const { gen: c, schema: l, validateName: u } = o;
    l === !1 ? a(o, !1) : typeof l == "object" && l.$async === !0 ? c.return(n.default.data) : (c.assign((0, t._)`${u}.errors`, null), c.return(!0));
  }
  _t.topBoolOrEmptySchema = s;
  function i(o, c) {
    const { gen: l, schema: u } = o;
    u === !1 ? (l.var(c, !1), a(o)) : l.var(c, !0);
  }
  _t.boolOrEmptySchema = i;
  function a(o, c) {
    const { gen: l, data: u } = o, f = {
      gen: l,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: o
    };
    (0, e.reportError)(f, r, void 0, c);
  }
  return _t;
}
var Ee = {}, xt = {}, oc;
function wf() {
  if (oc) return xt;
  oc = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.getRules = xt.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function n(s) {
    return typeof s == "string" && t.has(s);
  }
  xt.isJSONType = n;
  function r() {
    const s = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...s, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, s.number, s.string, s.array, s.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return xt.getRules = r, xt;
}
var et = {}, cc;
function Ef() {
  if (cc) return et;
  cc = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.shouldUseRule = et.shouldUseGroup = et.schemaHasRulesForType = void 0;
  function e({ schema: r, self: s }, i) {
    const a = s.RULES.types[i];
    return a && a !== !0 && t(r, a);
  }
  et.schemaHasRulesForType = e;
  function t(r, s) {
    return s.rules.some((i) => n(r, i));
  }
  et.shouldUseGroup = t;
  function n(r, s) {
    var i;
    return r[s.keyword] !== void 0 || ((i = s.definition.implements) === null || i === void 0 ? void 0 : i.some((a) => r[a] !== void 0));
  }
  return et.shouldUseRule = n, et;
}
var uc;
function pa() {
  if (uc) return Ee;
  uc = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.reportTypeError = Ee.checkDataTypes = Ee.checkDataType = Ee.coerceAndCheckDataType = Ee.getJSONTypes = Ee.getSchemaTypes = Ee.DataType = void 0;
  const e = wf(), t = Ef(), n = ba(), r = se(), s = ue();
  var i;
  (function(m) {
    m[m.Correct = 0] = "Correct", m[m.Wrong = 1] = "Wrong";
  })(i || (Ee.DataType = i = {}));
  function a(m) {
    const _ = o(m.type);
    if (_.includes("null")) {
      if (m.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!_.length && m.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      m.nullable === !0 && _.push("null");
    }
    return _;
  }
  Ee.getSchemaTypes = a;
  function o(m) {
    const _ = Array.isArray(m) ? m : m ? [m] : [];
    if (_.every(e.isJSONType))
      return _;
    throw new Error("type must be JSONType or JSONType[]: " + _.join(","));
  }
  Ee.getJSONTypes = o;
  function c(m, _) {
    const { gen: E, data: x, opts: w } = m, S = u(_, w.coerceTypes), P = _.length > 0 && !(S.length === 0 && _.length === 1 && (0, t.schemaHasRulesForType)(m, _[0]));
    if (P) {
      const C = v(_, x, w.strictNumbers, i.Wrong);
      E.if(C, () => {
        S.length ? f(m, _, S) : p(m);
      });
    }
    return P;
  }
  Ee.coerceAndCheckDataType = c;
  const l = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function u(m, _) {
    return _ ? m.filter((E) => l.has(E) || _ === "array" && E === "array") : [];
  }
  function f(m, _, E) {
    const { gen: x, data: w, opts: S } = m, P = x.let("dataType", (0, r._)`typeof ${w}`), C = x.let("coerced", (0, r._)`undefined`);
    S.coerceTypes === "array" && x.if((0, r._)`${P} == 'object' && Array.isArray(${w}) && ${w}.length == 1`, () => x.assign(w, (0, r._)`${w}[0]`).assign(P, (0, r._)`typeof ${w}`).if(v(_, w, S.strictNumbers), () => x.assign(C, w))), x.if((0, r._)`${C} !== undefined`);
    for (const L of E)
      (l.has(L) || L === "array" && S.coerceTypes === "array") && M(L);
    x.else(), p(m), x.endIf(), x.if((0, r._)`${C} !== undefined`, () => {
      x.assign(w, C), d(m, C);
    });
    function M(L) {
      switch (L) {
        case "string":
          x.elseIf((0, r._)`${P} == "number" || ${P} == "boolean"`).assign(C, (0, r._)`"" + ${w}`).elseIf((0, r._)`${w} === null`).assign(C, (0, r._)`""`);
          return;
        case "number":
          x.elseIf((0, r._)`${P} == "boolean" || ${w} === null
              || (${P} == "string" && ${w} && ${w} == +${w})`).assign(C, (0, r._)`+${w}`);
          return;
        case "integer":
          x.elseIf((0, r._)`${P} === "boolean" || ${w} === null
              || (${P} === "string" && ${w} && ${w} == +${w} && !(${w} % 1))`).assign(C, (0, r._)`+${w}`);
          return;
        case "boolean":
          x.elseIf((0, r._)`${w} === "false" || ${w} === 0 || ${w} === null`).assign(C, !1).elseIf((0, r._)`${w} === "true" || ${w} === 1`).assign(C, !0);
          return;
        case "null":
          x.elseIf((0, r._)`${w} === "" || ${w} === 0 || ${w} === false`), x.assign(C, null);
          return;
        case "array":
          x.elseIf((0, r._)`${P} === "string" || ${P} === "number"
              || ${P} === "boolean" || ${w} === null`).assign(C, (0, r._)`[${w}]`);
      }
    }
  }
  function d({ gen: m, parentData: _, parentDataProperty: E }, x) {
    m.if((0, r._)`${_} !== undefined`, () => m.assign((0, r._)`${_}[${E}]`, x));
  }
  function b(m, _, E, x = i.Correct) {
    const w = x === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let S;
    switch (m) {
      case "null":
        return (0, r._)`${_} ${w} null`;
      case "array":
        S = (0, r._)`Array.isArray(${_})`;
        break;
      case "object":
        S = (0, r._)`${_} && typeof ${_} == "object" && !Array.isArray(${_})`;
        break;
      case "integer":
        S = P((0, r._)`!(${_} % 1) && !isNaN(${_})`);
        break;
      case "number":
        S = P();
        break;
      default:
        return (0, r._)`typeof ${_} ${w} ${m}`;
    }
    return x === i.Correct ? S : (0, r.not)(S);
    function P(C = r.nil) {
      return (0, r.and)((0, r._)`typeof ${_} == "number"`, C, E ? (0, r._)`isFinite(${_})` : r.nil);
    }
  }
  Ee.checkDataType = b;
  function v(m, _, E, x) {
    if (m.length === 1)
      return b(m[0], _, E, x);
    let w;
    const S = (0, s.toHash)(m);
    if (S.array && S.object) {
      const P = (0, r._)`typeof ${_} != "object"`;
      w = S.null ? P : (0, r._)`!${_} || ${P}`, delete S.null, delete S.array, delete S.object;
    } else
      w = r.nil;
    S.number && delete S.integer;
    for (const P in S)
      w = (0, r.and)(w, b(P, _, E, x));
    return w;
  }
  Ee.checkDataTypes = v;
  const y = {
    message: ({ schema: m }) => `must be ${m}`,
    params: ({ schema: m, schemaValue: _ }) => typeof m == "string" ? (0, r._)`{type: ${m}}` : (0, r._)`{type: ${_}}`
  };
  function p(m) {
    const _ = h(m);
    (0, n.reportError)(_, y);
  }
  Ee.reportTypeError = p;
  function h(m) {
    const { gen: _, data: E, schema: x } = m, w = (0, s.schemaRefOrVal)(m, x, "type");
    return {
      gen: _,
      keyword: "type",
      data: E,
      schema: x.type,
      schemaCode: w,
      schemaValue: w,
      parentSchema: x,
      params: {},
      it: m
    };
  }
  return Ee;
}
var Yt = {}, lc;
function nh() {
  if (lc) return Yt;
  lc = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.assignDefaults = void 0;
  const e = se(), t = ue();
  function n(s, i) {
    const { properties: a, items: o } = s.schema;
    if (i === "object" && a)
      for (const c in a)
        r(s, c, a[c].default);
    else i === "array" && Array.isArray(o) && o.forEach((c, l) => r(s, l, c.default));
  }
  Yt.assignDefaults = n;
  function r(s, i, a) {
    const { gen: o, compositeRule: c, data: l, opts: u } = s;
    if (a === void 0)
      return;
    const f = (0, e._)`${l}${(0, e.getProperty)(i)}`;
    if (c) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${f}`);
      return;
    }
    let d = (0, e._)`${f} === undefined`;
    u.useDefaults === "empty" && (d = (0, e._)`${d} || ${f} === null || ${f} === ""`), o.if(d, (0, e._)`${f} = ${(0, e.stringify)(a)}`);
  }
  return Yt;
}
var Ve = {}, ve = {}, pc;
function He() {
  if (pc) return ve;
  pc = 1, Object.defineProperty(ve, "__esModule", { value: !0 }), ve.validateUnion = ve.validateArray = ve.usePattern = ve.callValidateCode = ve.schemaProperties = ve.allSchemaProperties = ve.noPropertyInData = ve.propertyInData = ve.isOwnProperty = ve.hasPropFunc = ve.reportMissingProp = ve.checkMissingProp = ve.checkReportMissingProp = void 0;
  const e = se(), t = ue(), n = Ge(), r = ue();
  function s(m, _) {
    const { gen: E, data: x, it: w } = m;
    E.if(u(E, x, _, w.opts.ownProperties), () => {
      m.setParams({ missingProperty: (0, e._)`${_}` }, !0), m.error();
    });
  }
  ve.checkReportMissingProp = s;
  function i({ gen: m, data: _, it: { opts: E } }, x, w) {
    return (0, e.or)(...x.map((S) => (0, e.and)(u(m, _, S, E.ownProperties), (0, e._)`${w} = ${S}`)));
  }
  ve.checkMissingProp = i;
  function a(m, _) {
    m.setParams({ missingProperty: _ }, !0), m.error();
  }
  ve.reportMissingProp = a;
  function o(m) {
    return m.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  ve.hasPropFunc = o;
  function c(m, _, E) {
    return (0, e._)`${o(m)}.call(${_}, ${E})`;
  }
  ve.isOwnProperty = c;
  function l(m, _, E, x) {
    const w = (0, e._)`${_}${(0, e.getProperty)(E)} !== undefined`;
    return x ? (0, e._)`${w} && ${c(m, _, E)}` : w;
  }
  ve.propertyInData = l;
  function u(m, _, E, x) {
    const w = (0, e._)`${_}${(0, e.getProperty)(E)} === undefined`;
    return x ? (0, e.or)(w, (0, e.not)(c(m, _, E))) : w;
  }
  ve.noPropertyInData = u;
  function f(m) {
    return m ? Object.keys(m).filter((_) => _ !== "__proto__") : [];
  }
  ve.allSchemaProperties = f;
  function d(m, _) {
    return f(_).filter((E) => !(0, t.alwaysValidSchema)(m, _[E]));
  }
  ve.schemaProperties = d;
  function b({ schemaCode: m, data: _, it: { gen: E, topSchemaRef: x, schemaPath: w, errorPath: S }, it: P }, C, M, L) {
    const G = L ? (0, e._)`${m}, ${_}, ${x}${w}` : _, H = [
      [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, S)],
      [n.default.parentData, P.parentData],
      [n.default.parentDataProperty, P.parentDataProperty],
      [n.default.rootData, n.default.rootData]
    ];
    P.opts.dynamicRef && H.push([n.default.dynamicAnchors, n.default.dynamicAnchors]);
    const F = (0, e._)`${G}, ${E.object(...H)}`;
    return M !== e.nil ? (0, e._)`${C}.call(${M}, ${F})` : (0, e._)`${C}(${F})`;
  }
  ve.callValidateCode = b;
  const v = (0, e._)`new RegExp`;
  function y({ gen: m, it: { opts: _ } }, E) {
    const x = _.unicodeRegExp ? "u" : "", { regExp: w } = _.code, S = w(E, x);
    return m.scopeValue("pattern", {
      key: S.toString(),
      ref: S,
      code: (0, e._)`${w.code === "new RegExp" ? v : (0, r.useFunc)(m, w)}(${E}, ${x})`
    });
  }
  ve.usePattern = y;
  function p(m) {
    const { gen: _, data: E, keyword: x, it: w } = m, S = _.name("valid");
    if (w.allErrors) {
      const C = _.let("valid", !0);
      return P(() => _.assign(C, !1)), C;
    }
    return _.var(S, !0), P(() => _.break()), S;
    function P(C) {
      const M = _.const("len", (0, e._)`${E}.length`);
      _.forRange("i", 0, M, (L) => {
        m.subschema({
          keyword: x,
          dataProp: L,
          dataPropType: t.Type.Num
        }, S), _.if((0, e.not)(S), C);
      });
    }
  }
  ve.validateArray = p;
  function h(m) {
    const { gen: _, schema: E, keyword: x, it: w } = m;
    if (!Array.isArray(E))
      throw new Error("ajv implementation error");
    if (E.some((M) => (0, t.alwaysValidSchema)(w, M)) && !w.opts.unevaluated)
      return;
    const P = _.let("valid", !1), C = _.name("_valid");
    _.block(() => E.forEach((M, L) => {
      const G = m.subschema({
        keyword: x,
        schemaProp: L,
        compositeRule: !0
      }, C);
      _.assign(P, (0, e._)`${P} || ${C}`), m.mergeValidEvaluated(G, C) || _.if((0, e.not)(P));
    })), m.result(P, () => m.reset(), () => m.error(!0));
  }
  return ve.validateUnion = h, ve;
}
var dc;
function ah() {
  if (dc) return Ve;
  dc = 1, Object.defineProperty(Ve, "__esModule", { value: !0 }), Ve.validateKeywordUsage = Ve.validSchemaType = Ve.funcKeywordCode = Ve.macroKeywordCode = void 0;
  const e = se(), t = Ge(), n = He(), r = ba();
  function s(d, b) {
    const { gen: v, keyword: y, schema: p, parentSchema: h, it: m } = d, _ = b.macro.call(m.self, p, h, m), E = l(v, y, _);
    m.opts.validateSchema !== !1 && m.self.validateSchema(_, !0);
    const x = v.name("valid");
    d.subschema({
      schema: _,
      schemaPath: e.nil,
      errSchemaPath: `${m.errSchemaPath}/${y}`,
      topSchemaRef: E,
      compositeRule: !0
    }, x), d.pass(x, () => d.error(!0));
  }
  Ve.macroKeywordCode = s;
  function i(d, b) {
    var v;
    const { gen: y, keyword: p, schema: h, parentSchema: m, $data: _, it: E } = d;
    c(E, b);
    const x = !_ && b.compile ? b.compile.call(E.self, h, m, E) : b.validate, w = l(y, p, x), S = y.let("valid");
    d.block$data(S, P), d.ok((v = b.valid) !== null && v !== void 0 ? v : S);
    function P() {
      if (b.errors === !1)
        L(), b.modifying && a(d), G(() => d.error());
      else {
        const H = b.async ? C() : M();
        b.modifying && a(d), G(() => o(d, H));
      }
    }
    function C() {
      const H = y.let("ruleErrs", null);
      return y.try(() => L((0, e._)`await `), (F) => y.assign(S, !1).if((0, e._)`${F} instanceof ${E.ValidationError}`, () => y.assign(H, (0, e._)`${F}.errors`), () => y.throw(F))), H;
    }
    function M() {
      const H = (0, e._)`${w}.errors`;
      return y.assign(H, null), L(e.nil), H;
    }
    function L(H = b.async ? (0, e._)`await ` : e.nil) {
      const F = E.opts.passContext ? t.default.this : t.default.self, K = !("compile" in b && !_ || b.schema === !1);
      y.assign(S, (0, e._)`${H}${(0, n.callValidateCode)(d, w, F, K)}`, b.modifying);
    }
    function G(H) {
      var F;
      y.if((0, e.not)((F = b.valid) !== null && F !== void 0 ? F : S), H);
    }
  }
  Ve.funcKeywordCode = i;
  function a(d) {
    const { gen: b, data: v, it: y } = d;
    b.if(y.parentData, () => b.assign(v, (0, e._)`${y.parentData}[${y.parentDataProperty}]`));
  }
  function o(d, b) {
    const { gen: v } = d;
    v.if((0, e._)`Array.isArray(${b})`, () => {
      v.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${b} : ${t.default.vErrors}.concat(${b})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, r.extendErrors)(d);
    }, () => d.error());
  }
  function c({ schemaEnv: d }, b) {
    if (b.async && !d.$async)
      throw new Error("async keyword in sync schema");
  }
  function l(d, b, v) {
    if (v === void 0)
      throw new Error(`keyword "${b}" failed to compile`);
    return d.scopeValue("keyword", typeof v == "function" ? { ref: v } : { ref: v, code: (0, e.stringify)(v) });
  }
  function u(d, b, v = !1) {
    return !b.length || b.some((y) => y === "array" ? Array.isArray(d) : y === "object" ? d && typeof d == "object" && !Array.isArray(d) : typeof d == y || v && typeof d > "u");
  }
  Ve.validSchemaType = u;
  function f({ schema: d, opts: b, self: v, errSchemaPath: y }, p, h) {
    if (Array.isArray(p.keyword) ? !p.keyword.includes(h) : p.keyword !== h)
      throw new Error("ajv implementation error");
    const m = p.dependencies;
    if (m?.some((_) => !Object.prototype.hasOwnProperty.call(d, _)))
      throw new Error(`parent schema must have dependencies of ${h}: ${m.join(",")}`);
    if (p.validateSchema && !p.validateSchema(d[h])) {
      const E = `keyword "${h}" value is invalid at path "${y}": ` + v.errorsText(p.validateSchema.errors);
      if (b.validateSchema === "log")
        v.logger.error(E);
      else
        throw new Error(E);
    }
  }
  return Ve.validateKeywordUsage = f, Ve;
}
var tt = {}, fc;
function sh() {
  if (fc) return tt;
  fc = 1, Object.defineProperty(tt, "__esModule", { value: !0 }), tt.extendSubschemaMode = tt.extendSubschemaData = tt.getSubschema = void 0;
  const e = se(), t = ue();
  function n(i, { keyword: a, schemaProp: o, schema: c, schemaPath: l, errSchemaPath: u, topSchemaRef: f }) {
    if (a !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (a !== void 0) {
      const d = i.schema[a];
      return o === void 0 ? {
        schema: d,
        schemaPath: (0, e._)`${i.schemaPath}${(0, e.getProperty)(a)}`,
        errSchemaPath: `${i.errSchemaPath}/${a}`
      } : {
        schema: d[o],
        schemaPath: (0, e._)`${i.schemaPath}${(0, e.getProperty)(a)}${(0, e.getProperty)(o)}`,
        errSchemaPath: `${i.errSchemaPath}/${a}/${(0, t.escapeFragment)(o)}`
      };
    }
    if (c !== void 0) {
      if (l === void 0 || u === void 0 || f === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: l,
        topSchemaRef: f,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  tt.getSubschema = n;
  function r(i, a, { dataProp: o, dataPropType: c, data: l, dataTypes: u, propertyName: f }) {
    if (l !== void 0 && o !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: d } = a;
    if (o !== void 0) {
      const { errorPath: v, dataPathArr: y, opts: p } = a, h = d.let("data", (0, e._)`${a.data}${(0, e.getProperty)(o)}`, !0);
      b(h), i.errorPath = (0, e.str)`${v}${(0, t.getErrorPath)(o, c, p.jsPropertySyntax)}`, i.parentDataProperty = (0, e._)`${o}`, i.dataPathArr = [...y, i.parentDataProperty];
    }
    if (l !== void 0) {
      const v = l instanceof e.Name ? l : d.let("data", l, !0);
      b(v), f !== void 0 && (i.propertyName = f);
    }
    u && (i.dataTypes = u);
    function b(v) {
      i.data = v, i.dataLevel = a.dataLevel + 1, i.dataTypes = [], a.definedProperties = /* @__PURE__ */ new Set(), i.parentData = a.data, i.dataNames = [...a.dataNames, v];
    }
  }
  tt.extendSubschemaData = r;
  function s(i, { jtdDiscriminator: a, jtdMetadata: o, compositeRule: c, createErrors: l, allErrors: u }) {
    c !== void 0 && (i.compositeRule = c), l !== void 0 && (i.createErrors = l), u !== void 0 && (i.allErrors = u), i.jtdDiscriminator = a, i.jtdMetadata = o;
  }
  return tt.extendSubschemaMode = s, tt;
}
var ke = {}, Xa, mc;
function _a() {
  return mc || (mc = 1, Xa = function e(t, n) {
    if (t === n) return !0;
    if (t && n && typeof t == "object" && typeof n == "object") {
      if (t.constructor !== n.constructor) return !1;
      var r, s, i;
      if (Array.isArray(t)) {
        if (r = t.length, r != n.length) return !1;
        for (s = r; s-- !== 0; )
          if (!e(t[s], n[s])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
      if (i = Object.keys(t), r = i.length, r !== Object.keys(n).length) return !1;
      for (s = r; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(n, i[s])) return !1;
      for (s = r; s-- !== 0; ) {
        var a = i[s];
        if (!e(t[a], n[a])) return !1;
      }
      return !0;
    }
    return t !== t && n !== n;
  }), Xa;
}
var Ya = { exports: {} }, hc;
function ih() {
  if (hc) return Ya.exports;
  hc = 1;
  var e = Ya.exports = function(r, s, i) {
    typeof s == "function" && (i = s, s = {}), i = s.cb || i;
    var a = typeof i == "function" ? i : i.pre || function() {
    }, o = i.post || function() {
    };
    t(s, a, o, r, "", r);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(r, s, i, a, o, c, l, u, f, d) {
    if (a && typeof a == "object" && !Array.isArray(a)) {
      s(a, o, c, l, u, f, d);
      for (var b in a) {
        var v = a[b];
        if (Array.isArray(v)) {
          if (b in e.arrayKeywords)
            for (var y = 0; y < v.length; y++)
              t(r, s, i, v[y], o + "/" + b + "/" + y, c, o, b, a, y);
        } else if (b in e.propsKeywords) {
          if (v && typeof v == "object")
            for (var p in v)
              t(r, s, i, v[p], o + "/" + b + "/" + n(p), c, o, b, a, p);
        } else (b in e.keywords || r.allKeys && !(b in e.skipKeywords)) && t(r, s, i, v, o + "/" + b, c, o, b, a);
      }
      i(a, o, c, l, u, f, d);
    }
  }
  function n(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Ya.exports;
}
var vc;
function xa() {
  if (vc) return ke;
  vc = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.getSchemaRefs = ke.resolveUrl = ke.normalizeId = ke._getFullPath = ke.getFullPath = ke.inlineRef = void 0;
  const e = ue(), t = _a(), n = ih(), r = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function s(y, p = !0) {
    return typeof y == "boolean" ? !0 : p === !0 ? !a(y) : p ? o(y) <= p : !1;
  }
  ke.inlineRef = s;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function a(y) {
    for (const p in y) {
      if (i.has(p))
        return !0;
      const h = y[p];
      if (Array.isArray(h) && h.some(a) || typeof h == "object" && a(h))
        return !0;
    }
    return !1;
  }
  function o(y) {
    let p = 0;
    for (const h in y) {
      if (h === "$ref")
        return 1 / 0;
      if (p++, !r.has(h) && (typeof y[h] == "object" && (0, e.eachItem)(y[h], (m) => p += o(m)), p === 1 / 0))
        return 1 / 0;
    }
    return p;
  }
  function c(y, p = "", h) {
    h !== !1 && (p = f(p));
    const m = y.parse(p);
    return l(y, m);
  }
  ke.getFullPath = c;
  function l(y, p) {
    return y.serialize(p).split("#")[0] + "#";
  }
  ke._getFullPath = l;
  const u = /#\/?$/;
  function f(y) {
    return y ? y.replace(u, "") : "";
  }
  ke.normalizeId = f;
  function d(y, p, h) {
    return h = f(h), y.resolve(p, h);
  }
  ke.resolveUrl = d;
  const b = /^[a-z_][-a-z0-9._]*$/i;
  function v(y, p) {
    if (typeof y == "boolean")
      return {};
    const { schemaId: h, uriResolver: m } = this.opts, _ = f(y[h] || p), E = { "": _ }, x = c(m, _, !1), w = {}, S = /* @__PURE__ */ new Set();
    return n(y, { allKeys: !0 }, (M, L, G, H) => {
      if (H === void 0)
        return;
      const F = x + L;
      let K = E[H];
      typeof M[h] == "string" && (K = q.call(this, M[h])), U.call(this, M.$anchor), U.call(this, M.$dynamicAnchor), E[L] = K;
      function q(D) {
        const J = this.opts.uriResolver.resolve;
        if (D = f(K ? J(K, D) : D), S.has(D))
          throw C(D);
        S.add(D);
        let A = this.refs[D];
        return typeof A == "string" && (A = this.refs[A]), typeof A == "object" ? P(M, A.schema, D) : D !== f(F) && (D[0] === "#" ? (P(M, w[D], D), w[D] = M) : this.refs[D] = F), D;
      }
      function U(D) {
        if (typeof D == "string") {
          if (!b.test(D))
            throw new Error(`invalid anchor "${D}"`);
          q.call(this, `#${D}`);
        }
      }
    }), w;
    function P(M, L, G) {
      if (L !== void 0 && !t(M, L))
        throw C(G);
    }
    function C(M) {
      return new Error(`reference "${M}" resolves to more than one schema`);
    }
  }
  return ke.getSchemaRefs = v, ke;
}
var yc;
function wa() {
  if (yc) return Ze;
  yc = 1, Object.defineProperty(Ze, "__esModule", { value: !0 }), Ze.getData = Ze.KeywordCxt = Ze.validateFunctionCode = void 0;
  const e = rh(), t = pa(), n = Ef(), r = pa(), s = nh(), i = ah(), a = sh(), o = se(), c = Ge(), l = xa(), u = ue(), f = ba();
  function d(T) {
    if (x(T) && (S(T), E(T))) {
      p(T);
      return;
    }
    b(T, () => (0, e.topBoolOrEmptySchema)(T));
  }
  Ze.validateFunctionCode = d;
  function b({ gen: T, validateName: N, schema: I, schemaEnv: z, opts: X }, Q) {
    X.code.es5 ? T.func(N, (0, o._)`${c.default.data}, ${c.default.valCxt}`, z.$async, () => {
      T.code((0, o._)`"use strict"; ${m(I, X)}`), y(T, X), T.code(Q);
    }) : T.func(N, (0, o._)`${c.default.data}, ${v(X)}`, z.$async, () => T.code(m(I, X)).code(Q));
  }
  function v(T) {
    return (0, o._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${T.dynamicRef ? (0, o._)`, ${c.default.dynamicAnchors}={}` : o.nil}}={}`;
  }
  function y(T, N) {
    T.if(c.default.valCxt, () => {
      T.var(c.default.instancePath, (0, o._)`${c.default.valCxt}.${c.default.instancePath}`), T.var(c.default.parentData, (0, o._)`${c.default.valCxt}.${c.default.parentData}`), T.var(c.default.parentDataProperty, (0, o._)`${c.default.valCxt}.${c.default.parentDataProperty}`), T.var(c.default.rootData, (0, o._)`${c.default.valCxt}.${c.default.rootData}`), N.dynamicRef && T.var(c.default.dynamicAnchors, (0, o._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      T.var(c.default.instancePath, (0, o._)`""`), T.var(c.default.parentData, (0, o._)`undefined`), T.var(c.default.parentDataProperty, (0, o._)`undefined`), T.var(c.default.rootData, c.default.data), N.dynamicRef && T.var(c.default.dynamicAnchors, (0, o._)`{}`);
    });
  }
  function p(T) {
    const { schema: N, opts: I, gen: z } = T;
    b(T, () => {
      I.$comment && N.$comment && H(T), M(T), z.let(c.default.vErrors, null), z.let(c.default.errors, 0), I.unevaluated && h(T), P(T), F(T);
    });
  }
  function h(T) {
    const { gen: N, validateName: I } = T;
    T.evaluated = N.const("evaluated", (0, o._)`${I}.evaluated`), N.if((0, o._)`${T.evaluated}.dynamicProps`, () => N.assign((0, o._)`${T.evaluated}.props`, (0, o._)`undefined`)), N.if((0, o._)`${T.evaluated}.dynamicItems`, () => N.assign((0, o._)`${T.evaluated}.items`, (0, o._)`undefined`));
  }
  function m(T, N) {
    const I = typeof T == "object" && T[N.schemaId];
    return I && (N.code.source || N.code.process) ? (0, o._)`/*# sourceURL=${I} */` : o.nil;
  }
  function _(T, N) {
    if (x(T) && (S(T), E(T))) {
      w(T, N);
      return;
    }
    (0, e.boolOrEmptySchema)(T, N);
  }
  function E({ schema: T, self: N }) {
    if (typeof T == "boolean")
      return !T;
    for (const I in T)
      if (N.RULES.all[I])
        return !0;
    return !1;
  }
  function x(T) {
    return typeof T.schema != "boolean";
  }
  function w(T, N) {
    const { schema: I, gen: z, opts: X } = T;
    X.$comment && I.$comment && H(T), L(T), G(T);
    const Q = z.const("_errs", c.default.errors);
    P(T, Q), z.var(N, (0, o._)`${Q} === ${c.default.errors}`);
  }
  function S(T) {
    (0, u.checkUnknownRules)(T), C(T);
  }
  function P(T, N) {
    if (T.opts.jtd)
      return q(T, [], !1, N);
    const I = (0, t.getSchemaTypes)(T.schema), z = (0, t.coerceAndCheckDataType)(T, I);
    q(T, I, !z, N);
  }
  function C(T) {
    const { schema: N, errSchemaPath: I, opts: z, self: X } = T;
    N.$ref && z.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(N, X.RULES) && X.logger.warn(`$ref: keywords ignored in schema at path "${I}"`);
  }
  function M(T) {
    const { schema: N, opts: I } = T;
    N.default !== void 0 && I.useDefaults && I.strictSchema && (0, u.checkStrictMode)(T, "default is ignored in the schema root");
  }
  function L(T) {
    const N = T.schema[T.opts.schemaId];
    N && (T.baseId = (0, l.resolveUrl)(T.opts.uriResolver, T.baseId, N));
  }
  function G(T) {
    if (T.schema.$async && !T.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function H({ gen: T, schemaEnv: N, schema: I, errSchemaPath: z, opts: X }) {
    const Q = I.$comment;
    if (X.$comment === !0)
      T.code((0, o._)`${c.default.self}.logger.log(${Q})`);
    else if (typeof X.$comment == "function") {
      const re = (0, o.str)`${z}/$comment`, he = T.scopeValue("root", { ref: N.root });
      T.code((0, o._)`${c.default.self}.opts.$comment(${Q}, ${re}, ${he}.schema)`);
    }
  }
  function F(T) {
    const { gen: N, schemaEnv: I, validateName: z, ValidationError: X, opts: Q } = T;
    I.$async ? N.if((0, o._)`${c.default.errors} === 0`, () => N.return(c.default.data), () => N.throw((0, o._)`new ${X}(${c.default.vErrors})`)) : (N.assign((0, o._)`${z}.errors`, c.default.vErrors), Q.unevaluated && K(T), N.return((0, o._)`${c.default.errors} === 0`));
  }
  function K({ gen: T, evaluated: N, props: I, items: z }) {
    I instanceof o.Name && T.assign((0, o._)`${N}.props`, I), z instanceof o.Name && T.assign((0, o._)`${N}.items`, z);
  }
  function q(T, N, I, z) {
    const { gen: X, schema: Q, data: re, allErrors: he, opts: pe, self: le } = T, { RULES: ne } = le;
    if (Q.$ref && (pe.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(Q, ne))) {
      X.block(() => B(T, "$ref", ne.all.$ref.definition));
      return;
    }
    pe.jtd || D(T, N), X.block(() => {
      for (const me of ne.rules)
        we(me);
      we(ne.post);
    });
    function we(me) {
      (0, n.shouldUseGroup)(Q, me) && (me.type ? (X.if((0, r.checkDataType)(me.type, re, pe.strictNumbers)), U(T, me), N.length === 1 && N[0] === me.type && I && (X.else(), (0, r.reportTypeError)(T)), X.endIf()) : U(T, me), he || X.if((0, o._)`${c.default.errors} === ${z || 0}`));
    }
  }
  function U(T, N) {
    const { gen: I, schema: z, opts: { useDefaults: X } } = T;
    X && (0, s.assignDefaults)(T, N.type), I.block(() => {
      for (const Q of N.rules)
        (0, n.shouldUseRule)(z, Q) && B(T, Q.keyword, Q.definition, N.type);
    });
  }
  function D(T, N) {
    T.schemaEnv.meta || !T.opts.strictTypes || (J(T, N), T.opts.allowUnionTypes || A(T, N), R(T, T.dataTypes));
  }
  function J(T, N) {
    if (N.length) {
      if (!T.dataTypes.length) {
        T.dataTypes = N;
        return;
      }
      N.forEach((I) => {
        O(T.dataTypes, I) || $(T, `type "${I}" not allowed by context "${T.dataTypes.join(",")}"`);
      }), g(T, N);
    }
  }
  function A(T, N) {
    N.length > 1 && !(N.length === 2 && N.includes("null")) && $(T, "use allowUnionTypes to allow union type keyword");
  }
  function R(T, N) {
    const I = T.self.RULES.all;
    for (const z in I) {
      const X = I[z];
      if (typeof X == "object" && (0, n.shouldUseRule)(T.schema, X)) {
        const { type: Q } = X.definition;
        Q.length && !Q.some((re) => j(N, re)) && $(T, `missing type "${Q.join(",")}" for keyword "${z}"`);
      }
    }
  }
  function j(T, N) {
    return T.includes(N) || N === "number" && T.includes("integer");
  }
  function O(T, N) {
    return T.includes(N) || N === "integer" && T.includes("number");
  }
  function g(T, N) {
    const I = [];
    for (const z of T.dataTypes)
      O(N, z) ? I.push(z) : N.includes("integer") && z === "number" && I.push("integer");
    T.dataTypes = I;
  }
  function $(T, N) {
    const I = T.schemaEnv.baseId + T.errSchemaPath;
    N += ` at "${I}" (strictTypes)`, (0, u.checkStrictMode)(T, N, T.opts.strictTypes);
  }
  class k {
    constructor(N, I, z) {
      if ((0, i.validateKeywordUsage)(N, I, z), this.gen = N.gen, this.allErrors = N.allErrors, this.keyword = z, this.data = N.data, this.schema = N.schema[z], this.$data = I.$data && N.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(N, this.schema, z, this.$data), this.schemaType = I.schemaType, this.parentSchema = N.schema, this.params = {}, this.it = N, this.def = I, this.$data)
        this.schemaCode = N.gen.const("vSchema", Y(this.$data, N));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, I.schemaType, I.allowUndefined))
        throw new Error(`${z} value must be ${JSON.stringify(I.schemaType)}`);
      ("code" in I ? I.trackErrors : I.errors !== !1) && (this.errsCount = N.gen.const("_errs", c.default.errors));
    }
    result(N, I, z) {
      this.failResult((0, o.not)(N), I, z);
    }
    failResult(N, I, z) {
      this.gen.if(N), z ? z() : this.error(), I ? (this.gen.else(), I(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(N, I) {
      this.failResult((0, o.not)(N), void 0, I);
    }
    fail(N) {
      if (N === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(N), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(N) {
      if (!this.$data)
        return this.fail(N);
      const { schemaCode: I } = this;
      this.fail((0, o._)`${I} !== undefined && (${(0, o.or)(this.invalid$data(), N)})`);
    }
    error(N, I, z) {
      if (I) {
        this.setParams(I), this._error(N, z), this.setParams({});
        return;
      }
      this._error(N, z);
    }
    _error(N, I) {
      (N ? f.reportExtraError : f.reportError)(this, this.def.error, I);
    }
    $dataError() {
      (0, f.reportError)(this, this.def.$dataError || f.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, f.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(N) {
      this.allErrors || this.gen.if(N);
    }
    setParams(N, I) {
      I ? Object.assign(this.params, N) : this.params = N;
    }
    block$data(N, I, z = o.nil) {
      this.gen.block(() => {
        this.check$data(N, z), I();
      });
    }
    check$data(N = o.nil, I = o.nil) {
      if (!this.$data)
        return;
      const { gen: z, schemaCode: X, schemaType: Q, def: re } = this;
      z.if((0, o.or)((0, o._)`${X} === undefined`, I)), N !== o.nil && z.assign(N, !0), (Q.length || re.validateSchema) && (z.elseIf(this.invalid$data()), this.$dataError(), N !== o.nil && z.assign(N, !1)), z.else();
    }
    invalid$data() {
      const { gen: N, schemaCode: I, schemaType: z, def: X, it: Q } = this;
      return (0, o.or)(re(), he());
      function re() {
        if (z.length) {
          if (!(I instanceof o.Name))
            throw new Error("ajv implementation error");
          const pe = Array.isArray(z) ? z : [z];
          return (0, o._)`${(0, r.checkDataTypes)(pe, I, Q.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return o.nil;
      }
      function he() {
        if (X.validateSchema) {
          const pe = N.scopeValue("validate$data", { ref: X.validateSchema });
          return (0, o._)`!${pe}(${I})`;
        }
        return o.nil;
      }
    }
    subschema(N, I) {
      const z = (0, a.getSubschema)(this.it, N);
      (0, a.extendSubschemaData)(z, this.it, N), (0, a.extendSubschemaMode)(z, N);
      const X = { ...this.it, ...z, items: void 0, props: void 0 };
      return _(X, I), X;
    }
    mergeEvaluated(N, I) {
      const { it: z, gen: X } = this;
      z.opts.unevaluated && (z.props !== !0 && N.props !== void 0 && (z.props = u.mergeEvaluated.props(X, N.props, z.props, I)), z.items !== !0 && N.items !== void 0 && (z.items = u.mergeEvaluated.items(X, N.items, z.items, I)));
    }
    mergeValidEvaluated(N, I) {
      const { it: z, gen: X } = this;
      if (z.opts.unevaluated && (z.props !== !0 || z.items !== !0))
        return X.if(I, () => this.mergeEvaluated(N, o.Name)), !0;
    }
  }
  Ze.KeywordCxt = k;
  function B(T, N, I, z) {
    const X = new k(T, I, N);
    "code" in I ? I.code(X, z) : X.$data && I.validate ? (0, i.funcKeywordCode)(X, I) : "macro" in I ? (0, i.macroKeywordCode)(X, I) : (I.compile || I.validate) && (0, i.funcKeywordCode)(X, I);
  }
  const W = /^\/(?:[^~]|~0|~1)*$/, Z = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function Y(T, { dataLevel: N, dataNames: I, dataPathArr: z }) {
    let X, Q;
    if (T === "")
      return c.default.rootData;
    if (T[0] === "/") {
      if (!W.test(T))
        throw new Error(`Invalid JSON-pointer: ${T}`);
      X = T, Q = c.default.rootData;
    } else {
      const le = Z.exec(T);
      if (!le)
        throw new Error(`Invalid JSON-pointer: ${T}`);
      const ne = +le[1];
      if (X = le[2], X === "#") {
        if (ne >= N)
          throw new Error(pe("property/index", ne));
        return z[N - ne];
      }
      if (ne > N)
        throw new Error(pe("data", ne));
      if (Q = I[N - ne], !X)
        return Q;
    }
    let re = Q;
    const he = X.split("/");
    for (const le of he)
      le && (Q = (0, o._)`${Q}${(0, o.getProperty)((0, u.unescapeJsonPointer)(le))}`, re = (0, o._)`${re} && ${Q}`);
    return re;
    function pe(le, ne) {
      return `Cannot access ${le} ${ne} levels up, current level is ${N}`;
    }
  }
  return Ze.getData = Y, Ze;
}
var yr = {}, gc;
function wo() {
  if (gc) return yr;
  gc = 1, Object.defineProperty(yr, "__esModule", { value: !0 });
  class e extends Error {
    constructor(n) {
      super("validation failed"), this.errors = n, this.ajv = this.validation = !0;
    }
  }
  return yr.default = e, yr;
}
var gr = {}, bc;
function Ea() {
  if (bc) return gr;
  bc = 1, Object.defineProperty(gr, "__esModule", { value: !0 });
  const e = xa();
  class t extends Error {
    constructor(r, s, i, a) {
      super(a || `can't resolve reference ${i} from id ${s}`), this.missingRef = (0, e.resolveUrl)(r, s, i), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(r, this.missingRef));
    }
  }
  return gr.default = t, gr;
}
var De = {}, _c;
function $a() {
  if (_c) return De;
  _c = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.resolveSchema = De.getCompilingSchema = De.resolveRef = De.compileSchema = De.SchemaEnv = void 0;
  const e = se(), t = wo(), n = Ge(), r = xa(), s = ue(), i = wa();
  class a {
    constructor(h) {
      var m;
      this.refs = {}, this.dynamicAnchors = {};
      let _;
      typeof h.schema == "object" && (_ = h.schema), this.schema = h.schema, this.schemaId = h.schemaId, this.root = h.root || this, this.baseId = (m = h.baseId) !== null && m !== void 0 ? m : (0, r.normalizeId)(_?.[h.schemaId || "$id"]), this.schemaPath = h.schemaPath, this.localRefs = h.localRefs, this.meta = h.meta, this.$async = _?.$async, this.refs = {};
    }
  }
  De.SchemaEnv = a;
  function o(p) {
    const h = u.call(this, p);
    if (h)
      return h;
    const m = (0, r.getFullPath)(this.opts.uriResolver, p.root.baseId), { es5: _, lines: E } = this.opts.code, { ownProperties: x } = this.opts, w = new e.CodeGen(this.scope, { es5: _, lines: E, ownProperties: x });
    let S;
    p.$async && (S = w.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const P = w.scopeName("validate");
    p.validateName = P;
    const C = {
      gen: w,
      allErrors: this.opts.allErrors,
      data: n.default.data,
      parentData: n.default.parentData,
      parentDataProperty: n.default.parentDataProperty,
      dataNames: [n.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: w.scopeValue("schema", this.opts.code.source === !0 ? { ref: p.schema, code: (0, e.stringify)(p.schema) } : { ref: p.schema }),
      validateName: P,
      ValidationError: S,
      schema: p.schema,
      schemaEnv: p,
      rootId: m,
      baseId: p.baseId || m,
      schemaPath: e.nil,
      errSchemaPath: p.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let M;
    try {
      this._compilations.add(p), (0, i.validateFunctionCode)(C), w.optimize(this.opts.code.optimize);
      const L = w.toString();
      M = `${w.scopeRefs(n.default.scope)}return ${L}`, this.opts.code.process && (M = this.opts.code.process(M, p));
      const H = new Function(`${n.default.self}`, `${n.default.scope}`, M)(this, this.scope.get());
      if (this.scope.value(P, { ref: H }), H.errors = null, H.schema = p.schema, H.schemaEnv = p, p.$async && (H.$async = !0), this.opts.code.source === !0 && (H.source = { validateName: P, validateCode: L, scopeValues: w._values }), this.opts.unevaluated) {
        const { props: F, items: K } = C;
        H.evaluated = {
          props: F instanceof e.Name ? void 0 : F,
          items: K instanceof e.Name ? void 0 : K,
          dynamicProps: F instanceof e.Name,
          dynamicItems: K instanceof e.Name
        }, H.source && (H.source.evaluated = (0, e.stringify)(H.evaluated));
      }
      return p.validate = H, p;
    } catch (L) {
      throw delete p.validate, delete p.validateName, M && this.logger.error("Error compiling schema, function code:", M), L;
    } finally {
      this._compilations.delete(p);
    }
  }
  De.compileSchema = o;
  function c(p, h, m) {
    var _;
    m = (0, r.resolveUrl)(this.opts.uriResolver, h, m);
    const E = p.refs[m];
    if (E)
      return E;
    let x = d.call(this, p, m);
    if (x === void 0) {
      const w = (_ = p.localRefs) === null || _ === void 0 ? void 0 : _[m], { schemaId: S } = this.opts;
      w && (x = new a({ schema: w, schemaId: S, root: p, baseId: h }));
    }
    if (x !== void 0)
      return p.refs[m] = l.call(this, x);
  }
  De.resolveRef = c;
  function l(p) {
    return (0, r.inlineRef)(p.schema, this.opts.inlineRefs) ? p.schema : p.validate ? p : o.call(this, p);
  }
  function u(p) {
    for (const h of this._compilations)
      if (f(h, p))
        return h;
  }
  De.getCompilingSchema = u;
  function f(p, h) {
    return p.schema === h.schema && p.root === h.root && p.baseId === h.baseId;
  }
  function d(p, h) {
    let m;
    for (; typeof (m = this.refs[h]) == "string"; )
      h = m;
    return m || this.schemas[h] || b.call(this, p, h);
  }
  function b(p, h) {
    const m = this.opts.uriResolver.parse(h), _ = (0, r._getFullPath)(this.opts.uriResolver, m);
    let E = (0, r.getFullPath)(this.opts.uriResolver, p.baseId, void 0);
    if (Object.keys(p.schema).length > 0 && _ === E)
      return y.call(this, m, p);
    const x = (0, r.normalizeId)(_), w = this.refs[x] || this.schemas[x];
    if (typeof w == "string") {
      const S = b.call(this, p, w);
      return typeof S?.schema != "object" ? void 0 : y.call(this, m, S);
    }
    if (typeof w?.schema == "object") {
      if (w.validate || o.call(this, w), x === (0, r.normalizeId)(h)) {
        const { schema: S } = w, { schemaId: P } = this.opts, C = S[P];
        return C && (E = (0, r.resolveUrl)(this.opts.uriResolver, E, C)), new a({ schema: S, schemaId: P, root: p, baseId: E });
      }
      return y.call(this, m, w);
    }
  }
  De.resolveSchema = b;
  const v = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function y(p, { baseId: h, schema: m, root: _ }) {
    var E;
    if (((E = p.fragment) === null || E === void 0 ? void 0 : E[0]) !== "/")
      return;
    for (const S of p.fragment.slice(1).split("/")) {
      if (typeof m == "boolean")
        return;
      const P = m[(0, s.unescapeFragment)(S)];
      if (P === void 0)
        return;
      m = P;
      const C = typeof m == "object" && m[this.opts.schemaId];
      !v.has(S) && C && (h = (0, r.resolveUrl)(this.opts.uriResolver, h, C));
    }
    let x;
    if (typeof m != "boolean" && m.$ref && !(0, s.schemaHasRulesButRef)(m, this.RULES)) {
      const S = (0, r.resolveUrl)(this.opts.uriResolver, h, m.$ref);
      x = b.call(this, _, S);
    }
    const { schemaId: w } = this.opts;
    if (x = x || new a({ schema: m, schemaId: w, root: _, baseId: h }), x.schema !== x.root.schema)
      return x;
  }
  return De;
}
const oh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ch = "Meta-schema for $data reference (JSON AnySchema extension proposal)", uh = "object", lh = ["$data"], ph = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, dh = !1, fh = {
  $id: oh,
  description: ch,
  type: uh,
  required: lh,
  properties: ph,
  additionalProperties: dh
};
var br = {}, Qt = { exports: {} }, Qa, xc;
function $f() {
  if (xc) return Qa;
  xc = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), t = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  function n(d) {
    let b = "", v = 0, y = 0;
    for (y = 0; y < d.length; y++)
      if (v = d[y].charCodeAt(0), v !== 48) {
        if (!(v >= 48 && v <= 57 || v >= 65 && v <= 70 || v >= 97 && v <= 102))
          return "";
        b += d[y];
        break;
      }
    for (y += 1; y < d.length; y++) {
      if (v = d[y].charCodeAt(0), !(v >= 48 && v <= 57 || v >= 65 && v <= 70 || v >= 97 && v <= 102))
        return "";
      b += d[y];
    }
    return b;
  }
  const r = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function s(d) {
    return d.length = 0, !0;
  }
  function i(d, b, v) {
    if (d.length) {
      const y = n(d);
      if (y !== "")
        b.push(y);
      else
        return v.error = !0, !1;
      d.length = 0;
    }
    return !0;
  }
  function a(d) {
    let b = 0;
    const v = { error: !1, address: "", zone: "" }, y = [], p = [];
    let h = !1, m = !1, _ = i;
    for (let E = 0; E < d.length; E++) {
      const x = d[E];
      if (!(x === "[" || x === "]"))
        if (x === ":") {
          if (h === !0 && (m = !0), !_(p, y, v))
            break;
          if (++b > 7) {
            v.error = !0;
            break;
          }
          E > 0 && d[E - 1] === ":" && (h = !0), y.push(":");
          continue;
        } else if (x === "%") {
          if (!_(p, y, v))
            break;
          _ = s;
        } else {
          p.push(x);
          continue;
        }
    }
    return p.length && (_ === s ? v.zone = p.join("") : m ? y.push(p.join("")) : y.push(n(p))), v.address = y.join(""), v;
  }
  function o(d) {
    if (c(d, ":") < 2)
      return { host: d, isIPV6: !1 };
    const b = a(d);
    if (b.error)
      return { host: d, isIPV6: !1 };
    {
      let v = b.address, y = b.address;
      return b.zone && (v += "%" + b.zone, y += "%25" + b.zone), { host: v, isIPV6: !0, escapedHost: y };
    }
  }
  function c(d, b) {
    let v = 0;
    for (let y = 0; y < d.length; y++)
      d[y] === b && v++;
    return v;
  }
  function l(d) {
    let b = d;
    const v = [];
    let y = -1, p = 0;
    for (; p = b.length; ) {
      if (p === 1) {
        if (b === ".")
          break;
        if (b === "/") {
          v.push("/");
          break;
        } else {
          v.push(b);
          break;
        }
      } else if (p === 2) {
        if (b[0] === ".") {
          if (b[1] === ".")
            break;
          if (b[1] === "/") {
            b = b.slice(2);
            continue;
          }
        } else if (b[0] === "/" && (b[1] === "." || b[1] === "/")) {
          v.push("/");
          break;
        }
      } else if (p === 3 && b === "/..") {
        v.length !== 0 && v.pop(), v.push("/");
        break;
      }
      if (b[0] === ".") {
        if (b[1] === ".") {
          if (b[2] === "/") {
            b = b.slice(3);
            continue;
          }
        } else if (b[1] === "/") {
          b = b.slice(2);
          continue;
        }
      } else if (b[0] === "/" && b[1] === ".") {
        if (b[2] === "/") {
          b = b.slice(2);
          continue;
        } else if (b[2] === "." && b[3] === "/") {
          b = b.slice(3), v.length !== 0 && v.pop();
          continue;
        }
      }
      if ((y = b.indexOf("/", 1)) === -1) {
        v.push(b);
        break;
      } else
        v.push(b.slice(0, y)), b = b.slice(y);
    }
    return v.join("");
  }
  function u(d, b) {
    const v = b !== !0 ? escape : unescape;
    return d.scheme !== void 0 && (d.scheme = v(d.scheme)), d.userinfo !== void 0 && (d.userinfo = v(d.userinfo)), d.host !== void 0 && (d.host = v(d.host)), d.path !== void 0 && (d.path = v(d.path)), d.query !== void 0 && (d.query = v(d.query)), d.fragment !== void 0 && (d.fragment = v(d.fragment)), d;
  }
  function f(d) {
    const b = [];
    if (d.userinfo !== void 0 && (b.push(d.userinfo), b.push("@")), d.host !== void 0) {
      let v = unescape(d.host);
      if (!t(v)) {
        const y = o(v);
        y.isIPV6 === !0 ? v = `[${y.escapedHost}]` : v = d.host;
      }
      b.push(v);
    }
    return (typeof d.port == "number" || typeof d.port == "string") && (b.push(":"), b.push(String(d.port))), b.length ? b.join("") : void 0;
  }
  return Qa = {
    nonSimpleDomain: r,
    recomposeAuthority: f,
    normalizeComponentEncoding: u,
    removeDotSegments: l,
    isIPv4: t,
    isUUID: e,
    normalizeIPv6: o,
    stringArrayToHexStripped: n
  }, Qa;
}
var Za, wc;
function mh() {
  if (wc) return Za;
  wc = 1;
  const { isUUID: e } = $f(), t = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, n = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function r(x) {
    return n.indexOf(
      /** @type {*} */
      x
    ) !== -1;
  }
  function s(x) {
    return x.secure === !0 ? !0 : x.secure === !1 ? !1 : x.scheme ? x.scheme.length === 3 && (x.scheme[0] === "w" || x.scheme[0] === "W") && (x.scheme[1] === "s" || x.scheme[1] === "S") && (x.scheme[2] === "s" || x.scheme[2] === "S") : !1;
  }
  function i(x) {
    return x.host || (x.error = x.error || "HTTP URIs must have a host."), x;
  }
  function a(x) {
    const w = String(x.scheme).toLowerCase() === "https";
    return (x.port === (w ? 443 : 80) || x.port === "") && (x.port = void 0), x.path || (x.path = "/"), x;
  }
  function o(x) {
    return x.secure = s(x), x.resourceName = (x.path || "/") + (x.query ? "?" + x.query : ""), x.path = void 0, x.query = void 0, x;
  }
  function c(x) {
    if ((x.port === (s(x) ? 443 : 80) || x.port === "") && (x.port = void 0), typeof x.secure == "boolean" && (x.scheme = x.secure ? "wss" : "ws", x.secure = void 0), x.resourceName) {
      const [w, S] = x.resourceName.split("?");
      x.path = w && w !== "/" ? w : void 0, x.query = S, x.resourceName = void 0;
    }
    return x.fragment = void 0, x;
  }
  function l(x, w) {
    if (!x.path)
      return x.error = "URN can not be parsed", x;
    const S = x.path.match(t);
    if (S) {
      const P = w.scheme || x.scheme || "urn";
      x.nid = S[1].toLowerCase(), x.nss = S[2];
      const C = `${P}:${w.nid || x.nid}`, M = E(C);
      x.path = void 0, M && (x = M.parse(x, w));
    } else
      x.error = x.error || "URN can not be parsed.";
    return x;
  }
  function u(x, w) {
    if (x.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const S = w.scheme || x.scheme || "urn", P = x.nid.toLowerCase(), C = `${S}:${w.nid || P}`, M = E(C);
    M && (x = M.serialize(x, w));
    const L = x, G = x.nss;
    return L.path = `${P || w.nid}:${G}`, w.skipEscape = !0, L;
  }
  function f(x, w) {
    const S = x;
    return S.uuid = S.nss, S.nss = void 0, !w.tolerant && (!S.uuid || !e(S.uuid)) && (S.error = S.error || "UUID is not valid."), S;
  }
  function d(x) {
    const w = x;
    return w.nss = (x.uuid || "").toLowerCase(), w;
  }
  const b = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: i,
      serialize: a
    }
  ), v = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: b.domainHost,
      parse: i,
      serialize: a
    }
  ), y = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: o,
      serialize: c
    }
  ), p = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: y.domainHost,
      parse: y.parse,
      serialize: y.serialize
    }
  ), _ = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: b,
      https: v,
      ws: y,
      wss: p,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: l,
          serialize: u,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: f,
          serialize: d,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(_, null);
  function E(x) {
    return x && (_[
      /** @type {SchemeName} */
      x
    ] || _[
      /** @type {SchemeName} */
      x.toLowerCase()
    ]) || void 0;
  }
  return Za = {
    wsIsSecure: s,
    SCHEMES: _,
    isValidSchemeName: r,
    getSchemeHandler: E
  }, Za;
}
var Ec;
function Sf() {
  if (Ec) return Qt.exports;
  Ec = 1;
  const { normalizeIPv6: e, removeDotSegments: t, recomposeAuthority: n, normalizeComponentEncoding: r, isIPv4: s, nonSimpleDomain: i } = $f(), { SCHEMES: a, getSchemeHandler: o } = mh();
  function c(p, h) {
    return typeof p == "string" ? p = /** @type {T} */
    d(v(p, h), h) : typeof p == "object" && (p = /** @type {T} */
    v(d(p, h), h)), p;
  }
  function l(p, h, m) {
    const _ = m ? Object.assign({ scheme: "null" }, m) : { scheme: "null" }, E = u(v(p, _), v(h, _), _, !0);
    return _.skipEscape = !0, d(E, _);
  }
  function u(p, h, m, _) {
    const E = {};
    return _ || (p = v(d(p, m), m), h = v(d(h, m), m)), m = m || {}, !m.tolerant && h.scheme ? (E.scheme = h.scheme, E.userinfo = h.userinfo, E.host = h.host, E.port = h.port, E.path = t(h.path || ""), E.query = h.query) : (h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0 ? (E.userinfo = h.userinfo, E.host = h.host, E.port = h.port, E.path = t(h.path || ""), E.query = h.query) : (h.path ? (h.path[0] === "/" ? E.path = t(h.path) : ((p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0) && !p.path ? E.path = "/" + h.path : p.path ? E.path = p.path.slice(0, p.path.lastIndexOf("/") + 1) + h.path : E.path = h.path, E.path = t(E.path)), E.query = h.query) : (E.path = p.path, h.query !== void 0 ? E.query = h.query : E.query = p.query), E.userinfo = p.userinfo, E.host = p.host, E.port = p.port), E.scheme = p.scheme), E.fragment = h.fragment, E;
  }
  function f(p, h, m) {
    return typeof p == "string" ? (p = unescape(p), p = d(r(v(p, m), !0), { ...m, skipEscape: !0 })) : typeof p == "object" && (p = d(r(p, !0), { ...m, skipEscape: !0 })), typeof h == "string" ? (h = unescape(h), h = d(r(v(h, m), !0), { ...m, skipEscape: !0 })) : typeof h == "object" && (h = d(r(h, !0), { ...m, skipEscape: !0 })), p.toLowerCase() === h.toLowerCase();
  }
  function d(p, h) {
    const m = {
      host: p.host,
      scheme: p.scheme,
      userinfo: p.userinfo,
      port: p.port,
      path: p.path,
      query: p.query,
      nid: p.nid,
      nss: p.nss,
      uuid: p.uuid,
      fragment: p.fragment,
      reference: p.reference,
      resourceName: p.resourceName,
      secure: p.secure,
      error: ""
    }, _ = Object.assign({}, h), E = [], x = o(_.scheme || m.scheme);
    x && x.serialize && x.serialize(m, _), m.path !== void 0 && (_.skipEscape ? m.path = unescape(m.path) : (m.path = escape(m.path), m.scheme !== void 0 && (m.path = m.path.split("%3A").join(":")))), _.reference !== "suffix" && m.scheme && E.push(m.scheme, ":");
    const w = n(m);
    if (w !== void 0 && (_.reference !== "suffix" && E.push("//"), E.push(w), m.path && m.path[0] !== "/" && E.push("/")), m.path !== void 0) {
      let S = m.path;
      !_.absolutePath && (!x || !x.absolutePath) && (S = t(S)), w === void 0 && S[0] === "/" && S[1] === "/" && (S = "/%2F" + S.slice(2)), E.push(S);
    }
    return m.query !== void 0 && E.push("?", m.query), m.fragment !== void 0 && E.push("#", m.fragment), E.join("");
  }
  const b = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function v(p, h) {
    const m = Object.assign({}, h), _ = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let E = !1;
    m.reference === "suffix" && (m.scheme ? p = m.scheme + ":" + p : p = "//" + p);
    const x = p.match(b);
    if (x) {
      if (_.scheme = x[1], _.userinfo = x[3], _.host = x[4], _.port = parseInt(x[5], 10), _.path = x[6] || "", _.query = x[7], _.fragment = x[8], isNaN(_.port) && (_.port = x[5]), _.host)
        if (s(_.host) === !1) {
          const P = e(_.host);
          _.host = P.host.toLowerCase(), E = P.isIPV6;
        } else
          E = !0;
      _.scheme === void 0 && _.userinfo === void 0 && _.host === void 0 && _.port === void 0 && _.query === void 0 && !_.path ? _.reference = "same-document" : _.scheme === void 0 ? _.reference = "relative" : _.fragment === void 0 ? _.reference = "absolute" : _.reference = "uri", m.reference && m.reference !== "suffix" && m.reference !== _.reference && (_.error = _.error || "URI is not a " + m.reference + " reference.");
      const w = o(m.scheme || _.scheme);
      if (!m.unicodeSupport && (!w || !w.unicodeSupport) && _.host && (m.domainHost || w && w.domainHost) && E === !1 && i(_.host))
        try {
          _.host = URL.domainToASCII(_.host.toLowerCase());
        } catch (S) {
          _.error = _.error || "Host's domain name can not be converted to ASCII: " + S;
        }
      (!w || w && !w.skipNormalize) && (p.indexOf("%") !== -1 && (_.scheme !== void 0 && (_.scheme = unescape(_.scheme)), _.host !== void 0 && (_.host = unescape(_.host))), _.path && (_.path = escape(unescape(_.path))), _.fragment && (_.fragment = encodeURI(decodeURIComponent(_.fragment)))), w && w.parse && w.parse(_, m);
    } else
      _.error = _.error || "URI can not be parsed.";
    return _;
  }
  const y = {
    SCHEMES: a,
    normalize: c,
    resolve: l,
    resolveComponent: u,
    equal: f,
    serialize: d,
    parse: v
  };
  return Qt.exports = y, Qt.exports.default = y, Qt.exports.fastUri = y, Qt.exports;
}
var $c;
function hh() {
  if ($c) return br;
  $c = 1, Object.defineProperty(br, "__esModule", { value: !0 });
  const e = Sf();
  return e.code = 'require("ajv/dist/runtime/uri").default', br.default = e, br;
}
var Sc;
function vh() {
  return Sc || (Sc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = wa();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var n = se();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return n.CodeGen;
    } });
    const r = wo(), s = Ea(), i = wf(), a = $a(), o = se(), c = xa(), l = pa(), u = ue(), f = fh, d = hh(), b = (A, R) => new RegExp(A, R);
    b.code = "new RegExp";
    const v = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), p = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, h = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, m = 200;
    function _(A) {
      var R, j, O, g, $, k, B, W, Z, Y, T, N, I, z, X, Q, re, he, pe, le, ne, we, me, Me, yt;
      const ze = A.strict, gt = (R = A.code) === null || R === void 0 ? void 0 : R.optimize, Jt = gt === !0 || gt === void 0 ? 1 : gt || 0, Xt = (O = (j = A.code) === null || j === void 0 ? void 0 : j.regExp) !== null && O !== void 0 ? O : b, Ua = (g = A.uriResolver) !== null && g !== void 0 ? g : d.default;
      return {
        strictSchema: (k = ($ = A.strictSchema) !== null && $ !== void 0 ? $ : ze) !== null && k !== void 0 ? k : !0,
        strictNumbers: (W = (B = A.strictNumbers) !== null && B !== void 0 ? B : ze) !== null && W !== void 0 ? W : !0,
        strictTypes: (Y = (Z = A.strictTypes) !== null && Z !== void 0 ? Z : ze) !== null && Y !== void 0 ? Y : "log",
        strictTuples: (N = (T = A.strictTuples) !== null && T !== void 0 ? T : ze) !== null && N !== void 0 ? N : "log",
        strictRequired: (z = (I = A.strictRequired) !== null && I !== void 0 ? I : ze) !== null && z !== void 0 ? z : !1,
        code: A.code ? { ...A.code, optimize: Jt, regExp: Xt } : { optimize: Jt, regExp: Xt },
        loopRequired: (X = A.loopRequired) !== null && X !== void 0 ? X : m,
        loopEnum: (Q = A.loopEnum) !== null && Q !== void 0 ? Q : m,
        meta: (re = A.meta) !== null && re !== void 0 ? re : !0,
        messages: (he = A.messages) !== null && he !== void 0 ? he : !0,
        inlineRefs: (pe = A.inlineRefs) !== null && pe !== void 0 ? pe : !0,
        schemaId: (le = A.schemaId) !== null && le !== void 0 ? le : "$id",
        addUsedSchema: (ne = A.addUsedSchema) !== null && ne !== void 0 ? ne : !0,
        validateSchema: (we = A.validateSchema) !== null && we !== void 0 ? we : !0,
        validateFormats: (me = A.validateFormats) !== null && me !== void 0 ? me : !0,
        unicodeRegExp: (Me = A.unicodeRegExp) !== null && Me !== void 0 ? Me : !0,
        int32range: (yt = A.int32range) !== null && yt !== void 0 ? yt : !0,
        uriResolver: Ua
      };
    }
    class E {
      constructor(R = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), R = this.opts = { ...R, ..._(R) };
        const { es5: j, lines: O } = this.opts.code;
        this.scope = new o.ValueScope({ scope: {}, prefixes: y, es5: j, lines: O }), this.logger = G(R.logger);
        const g = R.validateFormats;
        R.validateFormats = !1, this.RULES = (0, i.getRules)(), x.call(this, p, R, "NOT SUPPORTED"), x.call(this, h, R, "DEPRECATED", "warn"), this._metaOpts = M.call(this), R.formats && P.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), R.keywords && C.call(this, R.keywords), typeof R.meta == "object" && this.addMetaSchema(R.meta), S.call(this), R.validateFormats = g;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: R, meta: j, schemaId: O } = this.opts;
        let g = f;
        O === "id" && (g = { ...f }, g.id = g.$id, delete g.$id), j && R && this.addMetaSchema(g, g[O], !1);
      }
      defaultMeta() {
        const { meta: R, schemaId: j } = this.opts;
        return this.opts.defaultMeta = typeof R == "object" ? R[j] || R : void 0;
      }
      validate(R, j) {
        let O;
        if (typeof R == "string") {
          if (O = this.getSchema(R), !O)
            throw new Error(`no schema with key or ref "${R}"`);
        } else
          O = this.compile(R);
        const g = O(j);
        return "$async" in O || (this.errors = O.errors), g;
      }
      compile(R, j) {
        const O = this._addSchema(R, j);
        return O.validate || this._compileSchemaEnv(O);
      }
      compileAsync(R, j) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: O } = this.opts;
        return g.call(this, R, j);
        async function g(Y, T) {
          await $.call(this, Y.$schema);
          const N = this._addSchema(Y, T);
          return N.validate || k.call(this, N);
        }
        async function $(Y) {
          Y && !this.getSchema(Y) && await g.call(this, { $ref: Y }, !0);
        }
        async function k(Y) {
          try {
            return this._compileSchemaEnv(Y);
          } catch (T) {
            if (!(T instanceof s.default))
              throw T;
            return B.call(this, T), await W.call(this, T.missingSchema), k.call(this, Y);
          }
        }
        function B({ missingSchema: Y, missingRef: T }) {
          if (this.refs[Y])
            throw new Error(`AnySchema ${Y} is loaded but ${T} cannot be resolved`);
        }
        async function W(Y) {
          const T = await Z.call(this, Y);
          this.refs[Y] || await $.call(this, T.$schema), this.refs[Y] || this.addSchema(T, Y, j);
        }
        async function Z(Y) {
          const T = this._loading[Y];
          if (T)
            return T;
          try {
            return await (this._loading[Y] = O(Y));
          } finally {
            delete this._loading[Y];
          }
        }
      }
      // Adds schema to the instance
      addSchema(R, j, O, g = this.opts.validateSchema) {
        if (Array.isArray(R)) {
          for (const k of R)
            this.addSchema(k, void 0, O, g);
          return this;
        }
        let $;
        if (typeof R == "object") {
          const { schemaId: k } = this.opts;
          if ($ = R[k], $ !== void 0 && typeof $ != "string")
            throw new Error(`schema ${k} must be string`);
        }
        return j = (0, c.normalizeId)(j || $), this._checkUnique(j), this.schemas[j] = this._addSchema(R, O, j, g, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(R, j, O = this.opts.validateSchema) {
        return this.addSchema(R, j, !0, O), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(R, j) {
        if (typeof R == "boolean")
          return !0;
        let O;
        if (O = R.$schema, O !== void 0 && typeof O != "string")
          throw new Error("$schema must be a string");
        if (O = O || this.opts.defaultMeta || this.defaultMeta(), !O)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const g = this.validate(O, R);
        if (!g && j) {
          const $ = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error($);
          else
            throw new Error($);
        }
        return g;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(R) {
        let j;
        for (; typeof (j = w.call(this, R)) == "string"; )
          R = j;
        if (j === void 0) {
          const { schemaId: O } = this.opts, g = new a.SchemaEnv({ schema: {}, schemaId: O });
          if (j = a.resolveSchema.call(this, g, R), !j)
            return;
          this.refs[R] = j;
        }
        return j.validate || this._compileSchemaEnv(j);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(R) {
        if (R instanceof RegExp)
          return this._removeAllSchemas(this.schemas, R), this._removeAllSchemas(this.refs, R), this;
        switch (typeof R) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const j = w.call(this, R);
            return typeof j == "object" && this._cache.delete(j.schema), delete this.schemas[R], delete this.refs[R], this;
          }
          case "object": {
            const j = R;
            this._cache.delete(j);
            let O = R[this.opts.schemaId];
            return O && (O = (0, c.normalizeId)(O), delete this.schemas[O], delete this.refs[O]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(R) {
        for (const j of R)
          this.addKeyword(j);
        return this;
      }
      addKeyword(R, j) {
        let O;
        if (typeof R == "string")
          O = R, typeof j == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), j.keyword = O);
        else if (typeof R == "object" && j === void 0) {
          if (j = R, O = j.keyword, Array.isArray(O) && !O.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (F.call(this, O, j), !j)
          return (0, u.eachItem)(O, ($) => K.call(this, $)), this;
        U.call(this, j);
        const g = {
          ...j,
          type: (0, l.getJSONTypes)(j.type),
          schemaType: (0, l.getJSONTypes)(j.schemaType)
        };
        return (0, u.eachItem)(O, g.type.length === 0 ? ($) => K.call(this, $, g) : ($) => g.type.forEach((k) => K.call(this, $, g, k))), this;
      }
      getKeyword(R) {
        const j = this.RULES.all[R];
        return typeof j == "object" ? j.definition : !!j;
      }
      // Remove keyword
      removeKeyword(R) {
        const { RULES: j } = this;
        delete j.keywords[R], delete j.all[R];
        for (const O of j.rules) {
          const g = O.rules.findIndex(($) => $.keyword === R);
          g >= 0 && O.rules.splice(g, 1);
        }
        return this;
      }
      // Add format
      addFormat(R, j) {
        return typeof j == "string" && (j = new RegExp(j)), this.formats[R] = j, this;
      }
      errorsText(R = this.errors, { separator: j = ", ", dataVar: O = "data" } = {}) {
        return !R || R.length === 0 ? "No errors" : R.map((g) => `${O}${g.instancePath} ${g.message}`).reduce((g, $) => g + j + $);
      }
      $dataMetaSchema(R, j) {
        const O = this.RULES.all;
        R = JSON.parse(JSON.stringify(R));
        for (const g of j) {
          const $ = g.split("/").slice(1);
          let k = R;
          for (const B of $)
            k = k[B];
          for (const B in O) {
            const W = O[B];
            if (typeof W != "object")
              continue;
            const { $data: Z } = W.definition, Y = k[B];
            Z && Y && (k[B] = J(Y));
          }
        }
        return R;
      }
      _removeAllSchemas(R, j) {
        for (const O in R) {
          const g = R[O];
          (!j || j.test(O)) && (typeof g == "string" ? delete R[O] : g && !g.meta && (this._cache.delete(g.schema), delete R[O]));
        }
      }
      _addSchema(R, j, O, g = this.opts.validateSchema, $ = this.opts.addUsedSchema) {
        let k;
        const { schemaId: B } = this.opts;
        if (typeof R == "object")
          k = R[B];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof R != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let W = this._cache.get(R);
        if (W !== void 0)
          return W;
        O = (0, c.normalizeId)(k || O);
        const Z = c.getSchemaRefs.call(this, R, O);
        return W = new a.SchemaEnv({ schema: R, schemaId: B, meta: j, baseId: O, localRefs: Z }), this._cache.set(W.schema, W), $ && !O.startsWith("#") && (O && this._checkUnique(O), this.refs[O] = W), g && this.validateSchema(R, !0), W;
      }
      _checkUnique(R) {
        if (this.schemas[R] || this.refs[R])
          throw new Error(`schema with key or id "${R}" already exists`);
      }
      _compileSchemaEnv(R) {
        if (R.meta ? this._compileMetaSchema(R) : a.compileSchema.call(this, R), !R.validate)
          throw new Error("ajv implementation error");
        return R.validate;
      }
      _compileMetaSchema(R) {
        const j = this.opts;
        this.opts = this._metaOpts;
        try {
          a.compileSchema.call(this, R);
        } finally {
          this.opts = j;
        }
      }
    }
    E.ValidationError = r.default, E.MissingRefError = s.default, e.default = E;
    function x(A, R, j, O = "error") {
      for (const g in A) {
        const $ = g;
        $ in R && this.logger[O](`${j}: option ${g}. ${A[$]}`);
      }
    }
    function w(A) {
      return A = (0, c.normalizeId)(A), this.schemas[A] || this.refs[A];
    }
    function S() {
      const A = this.opts.schemas;
      if (A)
        if (Array.isArray(A))
          this.addSchema(A);
        else
          for (const R in A)
            this.addSchema(A[R], R);
    }
    function P() {
      for (const A in this.opts.formats) {
        const R = this.opts.formats[A];
        R && this.addFormat(A, R);
      }
    }
    function C(A) {
      if (Array.isArray(A)) {
        this.addVocabulary(A);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const R in A) {
        const j = A[R];
        j.keyword || (j.keyword = R), this.addKeyword(j);
      }
    }
    function M() {
      const A = { ...this.opts };
      for (const R of v)
        delete A[R];
      return A;
    }
    const L = { log() {
    }, warn() {
    }, error() {
    } };
    function G(A) {
      if (A === !1)
        return L;
      if (A === void 0)
        return console;
      if (A.log && A.warn && A.error)
        return A;
      throw new Error("logger must implement log, warn and error methods");
    }
    const H = /^[a-z_$][a-z0-9_$:-]*$/i;
    function F(A, R) {
      const { RULES: j } = this;
      if ((0, u.eachItem)(A, (O) => {
        if (j.keywords[O])
          throw new Error(`Keyword ${O} is already defined`);
        if (!H.test(O))
          throw new Error(`Keyword ${O} has invalid name`);
      }), !!R && R.$data && !("code" in R || "validate" in R))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function K(A, R, j) {
      var O;
      const g = R?.post;
      if (j && g)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: $ } = this;
      let k = g ? $.post : $.rules.find(({ type: W }) => W === j);
      if (k || (k = { type: j, rules: [] }, $.rules.push(k)), $.keywords[A] = !0, !R)
        return;
      const B = {
        keyword: A,
        definition: {
          ...R,
          type: (0, l.getJSONTypes)(R.type),
          schemaType: (0, l.getJSONTypes)(R.schemaType)
        }
      };
      R.before ? q.call(this, k, B, R.before) : k.rules.push(B), $.all[A] = B, (O = R.implements) === null || O === void 0 || O.forEach((W) => this.addKeyword(W));
    }
    function q(A, R, j) {
      const O = A.rules.findIndex((g) => g.keyword === j);
      O >= 0 ? A.rules.splice(O, 0, R) : (A.rules.push(R), this.logger.warn(`rule ${j} is not defined`));
    }
    function U(A) {
      let { metaSchema: R } = A;
      R !== void 0 && (A.$data && this.opts.$data && (R = J(R)), A.validateSchema = this.compile(R, !0));
    }
    const D = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function J(A) {
      return { anyOf: [A, D] };
    }
  })(Ga)), Ga;
}
var _r = {}, xr = {}, wr = {}, Rc;
function yh() {
  if (Rc) return wr;
  Rc = 1, Object.defineProperty(wr, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return wr.default = e, wr;
}
var ut = {}, Tc;
function Eo() {
  if (Tc) return ut;
  Tc = 1, Object.defineProperty(ut, "__esModule", { value: !0 }), ut.callRef = ut.getValidate = void 0;
  const e = Ea(), t = He(), n = se(), r = Ge(), s = $a(), i = ue(), a = {
    keyword: "$ref",
    schemaType: "string",
    code(l) {
      const { gen: u, schema: f, it: d } = l, { baseId: b, schemaEnv: v, validateName: y, opts: p, self: h } = d, { root: m } = v;
      if ((f === "#" || f === "#/") && b === m.baseId)
        return E();
      const _ = s.resolveRef.call(h, m, b, f);
      if (_ === void 0)
        throw new e.default(d.opts.uriResolver, b, f);
      if (_ instanceof s.SchemaEnv)
        return x(_);
      return w(_);
      function E() {
        if (v === m)
          return c(l, y, v, v.$async);
        const S = u.scopeValue("root", { ref: m });
        return c(l, (0, n._)`${S}.validate`, m, m.$async);
      }
      function x(S) {
        const P = o(l, S);
        c(l, P, S, S.$async);
      }
      function w(S) {
        const P = u.scopeValue("schema", p.code.source === !0 ? { ref: S, code: (0, n.stringify)(S) } : { ref: S }), C = u.name("valid"), M = l.subschema({
          schema: S,
          dataTypes: [],
          schemaPath: n.nil,
          topSchemaRef: P,
          errSchemaPath: f
        }, C);
        l.mergeEvaluated(M), l.ok(C);
      }
    }
  };
  function o(l, u) {
    const { gen: f } = l;
    return u.validate ? f.scopeValue("validate", { ref: u.validate }) : (0, n._)`${f.scopeValue("wrapper", { ref: u })}.validate`;
  }
  ut.getValidate = o;
  function c(l, u, f, d) {
    const { gen: b, it: v } = l, { allErrors: y, schemaEnv: p, opts: h } = v, m = h.passContext ? r.default.this : n.nil;
    d ? _() : E();
    function _() {
      if (!p.$async)
        throw new Error("async schema referenced by sync schema");
      const S = b.let("valid");
      b.try(() => {
        b.code((0, n._)`await ${(0, t.callValidateCode)(l, u, m)}`), w(u), y || b.assign(S, !0);
      }, (P) => {
        b.if((0, n._)`!(${P} instanceof ${v.ValidationError})`, () => b.throw(P)), x(P), y || b.assign(S, !1);
      }), l.ok(S);
    }
    function E() {
      l.result((0, t.callValidateCode)(l, u, m), () => w(u), () => x(u));
    }
    function x(S) {
      const P = (0, n._)`${S}.errors`;
      b.assign(r.default.vErrors, (0, n._)`${r.default.vErrors} === null ? ${P} : ${r.default.vErrors}.concat(${P})`), b.assign(r.default.errors, (0, n._)`${r.default.vErrors}.length`);
    }
    function w(S) {
      var P;
      if (!v.opts.unevaluated)
        return;
      const C = (P = f?.validate) === null || P === void 0 ? void 0 : P.evaluated;
      if (v.props !== !0)
        if (C && !C.dynamicProps)
          C.props !== void 0 && (v.props = i.mergeEvaluated.props(b, C.props, v.props));
        else {
          const M = b.var("props", (0, n._)`${S}.evaluated.props`);
          v.props = i.mergeEvaluated.props(b, M, v.props, n.Name);
        }
      if (v.items !== !0)
        if (C && !C.dynamicItems)
          C.items !== void 0 && (v.items = i.mergeEvaluated.items(b, C.items, v.items));
        else {
          const M = b.var("items", (0, n._)`${S}.evaluated.items`);
          v.items = i.mergeEvaluated.items(b, M, v.items, n.Name);
        }
    }
  }
  return ut.callRef = c, ut.default = a, ut;
}
var Pc;
function gh() {
  if (Pc) return xr;
  Pc = 1, Object.defineProperty(xr, "__esModule", { value: !0 });
  const e = yh(), t = Eo(), n = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return xr.default = n, xr;
}
var Er = {}, $r = {}, Oc;
function bh() {
  if (Oc) return $r;
  Oc = 1, Object.defineProperty($r, "__esModule", { value: !0 });
  const e = se(), t = e.operators, n = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, r = {
    message: ({ keyword: i, schemaCode: a }) => (0, e.str)`must be ${n[i].okStr} ${a}`,
    params: ({ keyword: i, schemaCode: a }) => (0, e._)`{comparison: ${n[i].okStr}, limit: ${a}}`
  }, s = {
    keyword: Object.keys(n),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: r,
    code(i) {
      const { keyword: a, data: o, schemaCode: c } = i;
      i.fail$data((0, e._)`${o} ${n[a].fail} ${c} || isNaN(${o})`);
    }
  };
  return $r.default = s, $r;
}
var Sr = {}, Nc;
function _h() {
  if (Nc) return Sr;
  Nc = 1, Object.defineProperty(Sr, "__esModule", { value: !0 });
  const e = se(), n = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, e.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, e._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: s, data: i, schemaCode: a, it: o } = r, c = o.opts.multipleOfPrecision, l = s.let("res"), u = c ? (0, e._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${c}` : (0, e._)`${l} !== parseInt(${l})`;
      r.fail$data((0, e._)`(${a} === 0 || (${l} = ${i}/${a}, ${u}))`);
    }
  };
  return Sr.default = n, Sr;
}
var Rr = {}, Tr = {}, kc;
function xh() {
  if (kc) return Tr;
  kc = 1, Object.defineProperty(Tr, "__esModule", { value: !0 });
  function e(t) {
    const n = t.length;
    let r = 0, s = 0, i;
    for (; s < n; )
      r++, i = t.charCodeAt(s++), i >= 55296 && i <= 56319 && s < n && (i = t.charCodeAt(s), (i & 64512) === 56320 && s++);
    return r;
  }
  return Tr.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Tr;
}
var jc;
function wh() {
  if (jc) return Rr;
  jc = 1, Object.defineProperty(Rr, "__esModule", { value: !0 });
  const e = se(), t = ue(), n = xh(), s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: i, schemaCode: a }) {
        const o = i === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${a} characters`;
      },
      params: ({ schemaCode: i }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { keyword: a, data: o, schemaCode: c, it: l } = i, u = a === "maxLength" ? e.operators.GT : e.operators.LT, f = l.opts.unicode === !1 ? (0, e._)`${o}.length` : (0, e._)`${(0, t.useFunc)(i.gen, n.default)}(${o})`;
      i.fail$data((0, e._)`${f} ${u} ${c}`);
    }
  };
  return Rr.default = s, Rr;
}
var Pr = {}, Ac;
function Eh() {
  if (Ac) return Pr;
  Ac = 1, Object.defineProperty(Pr, "__esModule", { value: !0 });
  const e = He(), t = se(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, t.str)`must match pattern "${s}"`,
      params: ({ schemaCode: s }) => (0, t._)`{pattern: ${s}}`
    },
    code(s) {
      const { data: i, $data: a, schema: o, schemaCode: c, it: l } = s, u = l.opts.unicodeRegExp ? "u" : "", f = a ? (0, t._)`(new RegExp(${c}, ${u}))` : (0, e.usePattern)(s, o);
      s.fail$data((0, t._)`!${f}.test(${i})`);
    }
  };
  return Pr.default = r, Pr;
}
var Or = {}, Ic;
function $h() {
  if (Ic) return Or;
  Ic = 1, Object.defineProperty(Or, "__esModule", { value: !0 });
  const e = se(), n = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: s }) {
        const i = r === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${i} than ${s} properties`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: s, data: i, schemaCode: a } = r, o = s === "maxProperties" ? e.operators.GT : e.operators.LT;
      r.fail$data((0, e._)`Object.keys(${i}).length ${o} ${a}`);
    }
  };
  return Or.default = n, Or;
}
var Nr = {}, Cc;
function Sh() {
  if (Cc) return Nr;
  Cc = 1, Object.defineProperty(Nr, "__esModule", { value: !0 });
  const e = He(), t = se(), n = ue(), s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, t.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, t._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: a, schema: o, schemaCode: c, data: l, $data: u, it: f } = i, { opts: d } = f;
      if (!u && o.length === 0)
        return;
      const b = o.length >= d.loopRequired;
      if (f.allErrors ? v() : y(), d.strictRequired) {
        const m = i.parentSchema.properties, { definedProperties: _ } = i.it;
        for (const E of o)
          if (m?.[E] === void 0 && !_.has(E)) {
            const x = f.schemaEnv.baseId + f.errSchemaPath, w = `required property "${E}" is not defined at "${x}" (strictRequired)`;
            (0, n.checkStrictMode)(f, w, f.opts.strictRequired);
          }
      }
      function v() {
        if (b || u)
          i.block$data(t.nil, p);
        else
          for (const m of o)
            (0, e.checkReportMissingProp)(i, m);
      }
      function y() {
        const m = a.let("missing");
        if (b || u) {
          const _ = a.let("valid", !0);
          i.block$data(_, () => h(m, _)), i.ok(_);
        } else
          a.if((0, e.checkMissingProp)(i, o, m)), (0, e.reportMissingProp)(i, m), a.else();
      }
      function p() {
        a.forOf("prop", c, (m) => {
          i.setParams({ missingProperty: m }), a.if((0, e.noPropertyInData)(a, l, m, d.ownProperties), () => i.error());
        });
      }
      function h(m, _) {
        i.setParams({ missingProperty: m }), a.forOf(m, c, () => {
          a.assign(_, (0, e.propertyInData)(a, l, m, d.ownProperties)), a.if((0, t.not)(_), () => {
            i.error(), a.break();
          });
        }, t.nil);
      }
    }
  };
  return Nr.default = s, Nr;
}
var kr = {}, qc;
function Rh() {
  if (qc) return kr;
  qc = 1, Object.defineProperty(kr, "__esModule", { value: !0 });
  const e = se(), n = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: s }) {
        const i = r === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${i} than ${s} items`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: s, data: i, schemaCode: a } = r, o = s === "maxItems" ? e.operators.GT : e.operators.LT;
      r.fail$data((0, e._)`${i}.length ${o} ${a}`);
    }
  };
  return kr.default = n, kr;
}
var jr = {}, Ar = {}, Lc;
function $o() {
  if (Lc) return Ar;
  Lc = 1, Object.defineProperty(Ar, "__esModule", { value: !0 });
  const e = _a();
  return e.code = 'require("ajv/dist/runtime/equal").default', Ar.default = e, Ar;
}
var Dc;
function Th() {
  if (Dc) return jr;
  Dc = 1, Object.defineProperty(jr, "__esModule", { value: !0 });
  const e = pa(), t = se(), n = ue(), r = $o(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: a, j: o } }) => (0, t.str)`must NOT have duplicate items (items ## ${o} and ${a} are identical)`,
      params: ({ params: { i: a, j: o } }) => (0, t._)`{i: ${a}, j: ${o}}`
    },
    code(a) {
      const { gen: o, data: c, $data: l, schema: u, parentSchema: f, schemaCode: d, it: b } = a;
      if (!l && !u)
        return;
      const v = o.let("valid"), y = f.items ? (0, e.getSchemaTypes)(f.items) : [];
      a.block$data(v, p, (0, t._)`${d} === false`), a.ok(v);
      function p() {
        const E = o.let("i", (0, t._)`${c}.length`), x = o.let("j");
        a.setParams({ i: E, j: x }), o.assign(v, !0), o.if((0, t._)`${E} > 1`, () => (h() ? m : _)(E, x));
      }
      function h() {
        return y.length > 0 && !y.some((E) => E === "object" || E === "array");
      }
      function m(E, x) {
        const w = o.name("item"), S = (0, e.checkDataTypes)(y, w, b.opts.strictNumbers, e.DataType.Wrong), P = o.const("indices", (0, t._)`{}`);
        o.for((0, t._)`;${E}--;`, () => {
          o.let(w, (0, t._)`${c}[${E}]`), o.if(S, (0, t._)`continue`), y.length > 1 && o.if((0, t._)`typeof ${w} == "string"`, (0, t._)`${w} += "_"`), o.if((0, t._)`typeof ${P}[${w}] == "number"`, () => {
            o.assign(x, (0, t._)`${P}[${w}]`), a.error(), o.assign(v, !1).break();
          }).code((0, t._)`${P}[${w}] = ${E}`);
        });
      }
      function _(E, x) {
        const w = (0, n.useFunc)(o, r.default), S = o.name("outer");
        o.label(S).for((0, t._)`;${E}--;`, () => o.for((0, t._)`${x} = ${E}; ${x}--;`, () => o.if((0, t._)`${w}(${c}[${E}], ${c}[${x}])`, () => {
          a.error(), o.assign(v, !1).break(S);
        })));
      }
    }
  };
  return jr.default = i, jr;
}
var Ir = {}, Fc;
function Ph() {
  if (Fc) return Ir;
  Fc = 1, Object.defineProperty(Ir, "__esModule", { value: !0 });
  const e = se(), t = ue(), n = $o(), s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, e._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: a, data: o, $data: c, schemaCode: l, schema: u } = i;
      c || u && typeof u == "object" ? i.fail$data((0, e._)`!${(0, t.useFunc)(a, n.default)}(${o}, ${l})`) : i.fail((0, e._)`${u} !== ${o}`);
    }
  };
  return Ir.default = s, Ir;
}
var Cr = {}, Mc;
function Oh() {
  if (Mc) return Cr;
  Mc = 1, Object.defineProperty(Cr, "__esModule", { value: !0 });
  const e = se(), t = ue(), n = $o(), s = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, e._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: a, data: o, $data: c, schema: l, schemaCode: u, it: f } = i;
      if (!c && l.length === 0)
        throw new Error("enum must have non-empty array");
      const d = l.length >= f.opts.loopEnum;
      let b;
      const v = () => b ?? (b = (0, t.useFunc)(a, n.default));
      let y;
      if (d || c)
        y = a.let("valid"), i.block$data(y, p);
      else {
        if (!Array.isArray(l))
          throw new Error("ajv implementation error");
        const m = a.const("vSchema", u);
        y = (0, e.or)(...l.map((_, E) => h(m, E)));
      }
      i.pass(y);
      function p() {
        a.assign(y, !1), a.forOf("v", u, (m) => a.if((0, e._)`${v()}(${o}, ${m})`, () => a.assign(y, !0).break()));
      }
      function h(m, _) {
        const E = l[_];
        return typeof E == "object" && E !== null ? (0, e._)`${v()}(${o}, ${m}[${_}])` : (0, e._)`${o} === ${E}`;
      }
    }
  };
  return Cr.default = s, Cr;
}
var Uc;
function Nh() {
  if (Uc) return Er;
  Uc = 1, Object.defineProperty(Er, "__esModule", { value: !0 });
  const e = bh(), t = _h(), n = wh(), r = Eh(), s = $h(), i = Sh(), a = Rh(), o = Th(), c = Ph(), l = Oh(), u = [
    // number
    e.default,
    t.default,
    // string
    n.default,
    r.default,
    // object
    s.default,
    i.default,
    // array
    a.default,
    o.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    l.default
  ];
  return Er.default = u, Er;
}
var qr = {}, At = {}, zc;
function Rf() {
  if (zc) return At;
  zc = 1, Object.defineProperty(At, "__esModule", { value: !0 }), At.validateAdditionalItems = void 0;
  const e = se(), t = ue(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, e.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: a, it: o } = i, { items: c } = a;
      if (!Array.isArray(c)) {
        (0, t.checkStrictMode)(o, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      s(i, c);
    }
  };
  function s(i, a) {
    const { gen: o, schema: c, data: l, keyword: u, it: f } = i;
    f.items = !0;
    const d = o.const("len", (0, e._)`${l}.length`);
    if (c === !1)
      i.setParams({ len: a.length }), i.pass((0, e._)`${d} <= ${a.length}`);
    else if (typeof c == "object" && !(0, t.alwaysValidSchema)(f, c)) {
      const v = o.var("valid", (0, e._)`${d} <= ${a.length}`);
      o.if((0, e.not)(v), () => b(v)), i.ok(v);
    }
    function b(v) {
      o.forRange("i", a.length, d, (y) => {
        i.subschema({ keyword: u, dataProp: y, dataPropType: t.Type.Num }, v), f.allErrors || o.if((0, e.not)(v), () => o.break());
      });
    }
  }
  return At.validateAdditionalItems = s, At.default = r, At;
}
var Lr = {}, It = {}, Vc;
function Tf() {
  if (Vc) return It;
  Vc = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.validateTuple = void 0;
  const e = se(), t = ue(), n = He(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(i) {
      const { schema: a, it: o } = i;
      if (Array.isArray(a))
        return s(i, "additionalItems", a);
      o.items = !0, !(0, t.alwaysValidSchema)(o, a) && i.ok((0, n.validateArray)(i));
    }
  };
  function s(i, a, o = i.schema) {
    const { gen: c, parentSchema: l, data: u, keyword: f, it: d } = i;
    y(l), d.opts.unevaluated && o.length && d.items !== !0 && (d.items = t.mergeEvaluated.items(c, o.length, d.items));
    const b = c.name("valid"), v = c.const("len", (0, e._)`${u}.length`);
    o.forEach((p, h) => {
      (0, t.alwaysValidSchema)(d, p) || (c.if((0, e._)`${v} > ${h}`, () => i.subschema({
        keyword: f,
        schemaProp: h,
        dataProp: h
      }, b)), i.ok(b));
    });
    function y(p) {
      const { opts: h, errSchemaPath: m } = d, _ = o.length, E = _ === p.minItems && (_ === p.maxItems || p[a] === !1);
      if (h.strictTuples && !E) {
        const x = `"${f}" is ${_}-tuple, but minItems or maxItems/${a} are not specified or different at path "${m}"`;
        (0, t.checkStrictMode)(d, x, h.strictTuples);
      }
    }
  }
  return It.validateTuple = s, It.default = r, It;
}
var Bc;
function kh() {
  if (Bc) return Lr;
  Bc = 1, Object.defineProperty(Lr, "__esModule", { value: !0 });
  const e = Tf(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (n) => (0, e.validateTuple)(n, "items")
  };
  return Lr.default = t, Lr;
}
var Dr = {}, Gc;
function jh() {
  if (Gc) return Dr;
  Gc = 1, Object.defineProperty(Dr, "__esModule", { value: !0 });
  const e = se(), t = ue(), n = He(), r = Rf(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: a } }) => (0, e.str)`must NOT have more than ${a} items`,
      params: ({ params: { len: a } }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { schema: o, parentSchema: c, it: l } = a, { prefixItems: u } = c;
      l.items = !0, !(0, t.alwaysValidSchema)(l, o) && (u ? (0, r.validateAdditionalItems)(a, u) : a.ok((0, n.validateArray)(a)));
    }
  };
  return Dr.default = i, Dr;
}
var Fr = {}, Hc;
function Ah() {
  if (Hc) return Fr;
  Hc = 1, Object.defineProperty(Fr, "__esModule", { value: !0 });
  const e = se(), t = ue(), r = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: s, max: i } }) => i === void 0 ? (0, e.str)`must contain at least ${s} valid item(s)` : (0, e.str)`must contain at least ${s} and no more than ${i} valid item(s)`,
      params: ({ params: { min: s, max: i } }) => i === void 0 ? (0, e._)`{minContains: ${s}}` : (0, e._)`{minContains: ${s}, maxContains: ${i}}`
    },
    code(s) {
      const { gen: i, schema: a, parentSchema: o, data: c, it: l } = s;
      let u, f;
      const { minContains: d, maxContains: b } = o;
      l.opts.next ? (u = d === void 0 ? 1 : d, f = b) : u = 1;
      const v = i.const("len", (0, e._)`${c}.length`);
      if (s.setParams({ min: u, max: f }), f === void 0 && u === 0) {
        (0, t.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (f !== void 0 && u > f) {
        (0, t.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), s.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(l, a)) {
        let _ = (0, e._)`${v} >= ${u}`;
        f !== void 0 && (_ = (0, e._)`${_} && ${v} <= ${f}`), s.pass(_);
        return;
      }
      l.items = !0;
      const y = i.name("valid");
      f === void 0 && u === 1 ? h(y, () => i.if(y, () => i.break())) : u === 0 ? (i.let(y, !0), f !== void 0 && i.if((0, e._)`${c}.length > 0`, p)) : (i.let(y, !1), p()), s.result(y, () => s.reset());
      function p() {
        const _ = i.name("_valid"), E = i.let("count", 0);
        h(_, () => i.if(_, () => m(E)));
      }
      function h(_, E) {
        i.forRange("i", 0, v, (x) => {
          s.subschema({
            keyword: "contains",
            dataProp: x,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, _), E();
        });
      }
      function m(_) {
        i.code((0, e._)`${_}++`), f === void 0 ? i.if((0, e._)`${_} >= ${u}`, () => i.assign(y, !0).break()) : (i.if((0, e._)`${_} > ${f}`, () => i.assign(y, !1).break()), u === 1 ? i.assign(y, !0) : i.if((0, e._)`${_} >= ${u}`, () => i.assign(y, !0)));
      }
    }
  };
  return Fr.default = r, Fr;
}
var es = {}, Kc;
function So() {
  return Kc || (Kc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = se(), n = ue(), r = He();
    e.error = {
      message: ({ params: { property: c, depsCount: l, deps: u } }) => {
        const f = l === 1 ? "property" : "properties";
        return (0, t.str)`must have ${f} ${u} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: l, deps: u, missingProperty: f } }) => (0, t._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${l},
    deps: ${u}}`
      // TODO change to reference
    };
    const s = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(c) {
        const [l, u] = i(c);
        a(c, l), o(c, u);
      }
    };
    function i({ schema: c }) {
      const l = {}, u = {};
      for (const f in c) {
        if (f === "__proto__")
          continue;
        const d = Array.isArray(c[f]) ? l : u;
        d[f] = c[f];
      }
      return [l, u];
    }
    function a(c, l = c.schema) {
      const { gen: u, data: f, it: d } = c;
      if (Object.keys(l).length === 0)
        return;
      const b = u.let("missing");
      for (const v in l) {
        const y = l[v];
        if (y.length === 0)
          continue;
        const p = (0, r.propertyInData)(u, f, v, d.opts.ownProperties);
        c.setParams({
          property: v,
          depsCount: y.length,
          deps: y.join(", ")
        }), d.allErrors ? u.if(p, () => {
          for (const h of y)
            (0, r.checkReportMissingProp)(c, h);
        }) : (u.if((0, t._)`${p} && (${(0, r.checkMissingProp)(c, y, b)})`), (0, r.reportMissingProp)(c, b), u.else());
      }
    }
    e.validatePropertyDeps = a;
    function o(c, l = c.schema) {
      const { gen: u, data: f, keyword: d, it: b } = c, v = u.name("valid");
      for (const y in l)
        (0, n.alwaysValidSchema)(b, l[y]) || (u.if(
          (0, r.propertyInData)(u, f, y, b.opts.ownProperties),
          () => {
            const p = c.subschema({ keyword: d, schemaProp: y }, v);
            c.mergeValidEvaluated(p, v);
          },
          () => u.var(v, !0)
          // TODO var
        ), c.ok(v));
    }
    e.validateSchemaDeps = o, e.default = s;
  })(es)), es;
}
var Mr = {}, Wc;
function Ih() {
  if (Wc) return Mr;
  Wc = 1, Object.defineProperty(Mr, "__esModule", { value: !0 });
  const e = se(), t = ue(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: s }) => (0, e._)`{propertyName: ${s.propertyName}}`
    },
    code(s) {
      const { gen: i, schema: a, data: o, it: c } = s;
      if ((0, t.alwaysValidSchema)(c, a))
        return;
      const l = i.name("valid");
      i.forIn("key", o, (u) => {
        s.setParams({ propertyName: u }), s.subschema({
          keyword: "propertyNames",
          data: u,
          dataTypes: ["string"],
          propertyName: u,
          compositeRule: !0
        }, l), i.if((0, e.not)(l), () => {
          s.error(!0), c.allErrors || i.break();
        });
      }), s.ok(l);
    }
  };
  return Mr.default = r, Mr;
}
var Ur = {}, Jc;
function Pf() {
  if (Jc) return Ur;
  Jc = 1, Object.defineProperty(Ur, "__esModule", { value: !0 });
  const e = He(), t = se(), n = Ge(), r = ue(), i = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: a }) => (0, t._)`{additionalProperty: ${a.additionalProperty}}`
    },
    code(a) {
      const { gen: o, schema: c, parentSchema: l, data: u, errsCount: f, it: d } = a;
      if (!f)
        throw new Error("ajv implementation error");
      const { allErrors: b, opts: v } = d;
      if (d.props = !0, v.removeAdditional !== "all" && (0, r.alwaysValidSchema)(d, c))
        return;
      const y = (0, e.allSchemaProperties)(l.properties), p = (0, e.allSchemaProperties)(l.patternProperties);
      h(), a.ok((0, t._)`${f} === ${n.default.errors}`);
      function h() {
        o.forIn("key", u, (w) => {
          !y.length && !p.length ? E(w) : o.if(m(w), () => E(w));
        });
      }
      function m(w) {
        let S;
        if (y.length > 8) {
          const P = (0, r.schemaRefOrVal)(d, l.properties, "properties");
          S = (0, e.isOwnProperty)(o, P, w);
        } else y.length ? S = (0, t.or)(...y.map((P) => (0, t._)`${w} === ${P}`)) : S = t.nil;
        return p.length && (S = (0, t.or)(S, ...p.map((P) => (0, t._)`${(0, e.usePattern)(a, P)}.test(${w})`))), (0, t.not)(S);
      }
      function _(w) {
        o.code((0, t._)`delete ${u}[${w}]`);
      }
      function E(w) {
        if (v.removeAdditional === "all" || v.removeAdditional && c === !1) {
          _(w);
          return;
        }
        if (c === !1) {
          a.setParams({ additionalProperty: w }), a.error(), b || o.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(d, c)) {
          const S = o.name("valid");
          v.removeAdditional === "failing" ? (x(w, S, !1), o.if((0, t.not)(S), () => {
            a.reset(), _(w);
          })) : (x(w, S), b || o.if((0, t.not)(S), () => o.break()));
        }
      }
      function x(w, S, P) {
        const C = {
          keyword: "additionalProperties",
          dataProp: w,
          dataPropType: r.Type.Str
        };
        P === !1 && Object.assign(C, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), a.subschema(C, S);
      }
    }
  };
  return Ur.default = i, Ur;
}
var zr = {}, Xc;
function Ch() {
  if (Xc) return zr;
  Xc = 1, Object.defineProperty(zr, "__esModule", { value: !0 });
  const e = wa(), t = He(), n = ue(), r = Pf(), s = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: a, schema: o, parentSchema: c, data: l, it: u } = i;
      u.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new e.KeywordCxt(u, r.default, "additionalProperties"));
      const f = (0, t.allSchemaProperties)(o);
      for (const p of f)
        u.definedProperties.add(p);
      u.opts.unevaluated && f.length && u.props !== !0 && (u.props = n.mergeEvaluated.props(a, (0, n.toHash)(f), u.props));
      const d = f.filter((p) => !(0, n.alwaysValidSchema)(u, o[p]));
      if (d.length === 0)
        return;
      const b = a.name("valid");
      for (const p of d)
        v(p) ? y(p) : (a.if((0, t.propertyInData)(a, l, p, u.opts.ownProperties)), y(p), u.allErrors || a.else().var(b, !0), a.endIf()), i.it.definedProperties.add(p), i.ok(b);
      function v(p) {
        return u.opts.useDefaults && !u.compositeRule && o[p].default !== void 0;
      }
      function y(p) {
        i.subschema({
          keyword: "properties",
          schemaProp: p,
          dataProp: p
        }, b);
      }
    }
  };
  return zr.default = s, zr;
}
var Vr = {}, Yc;
function qh() {
  if (Yc) return Vr;
  Yc = 1, Object.defineProperty(Vr, "__esModule", { value: !0 });
  const e = He(), t = se(), n = ue(), r = ue(), s = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: a, schema: o, data: c, parentSchema: l, it: u } = i, { opts: f } = u, d = (0, e.allSchemaProperties)(o), b = d.filter((E) => (0, n.alwaysValidSchema)(u, o[E]));
      if (d.length === 0 || b.length === d.length && (!u.opts.unevaluated || u.props === !0))
        return;
      const v = f.strictSchema && !f.allowMatchingProperties && l.properties, y = a.name("valid");
      u.props !== !0 && !(u.props instanceof t.Name) && (u.props = (0, r.evaluatedPropsToName)(a, u.props));
      const { props: p } = u;
      h();
      function h() {
        for (const E of d)
          v && m(E), u.allErrors ? _(E) : (a.var(y, !0), _(E), a.if(y));
      }
      function m(E) {
        for (const x in v)
          new RegExp(E).test(x) && (0, n.checkStrictMode)(u, `property ${x} matches pattern ${E} (use allowMatchingProperties)`);
      }
      function _(E) {
        a.forIn("key", c, (x) => {
          a.if((0, t._)`${(0, e.usePattern)(i, E)}.test(${x})`, () => {
            const w = b.includes(E);
            w || i.subschema({
              keyword: "patternProperties",
              schemaProp: E,
              dataProp: x,
              dataPropType: r.Type.Str
            }, y), u.opts.unevaluated && p !== !0 ? a.assign((0, t._)`${p}[${x}]`, !0) : !w && !u.allErrors && a.if((0, t.not)(y), () => a.break());
          });
        });
      }
    }
  };
  return Vr.default = s, Vr;
}
var Br = {}, Qc;
function Lh() {
  if (Qc) return Br;
  Qc = 1, Object.defineProperty(Br, "__esModule", { value: !0 });
  const e = ue(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(n) {
      const { gen: r, schema: s, it: i } = n;
      if ((0, e.alwaysValidSchema)(i, s)) {
        n.fail();
        return;
      }
      const a = r.name("valid");
      n.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, a), n.failResult(a, () => n.reset(), () => n.error());
    },
    error: { message: "must NOT be valid" }
  };
  return Br.default = t, Br;
}
var Gr = {}, Zc;
function Dh() {
  if (Zc) return Gr;
  Zc = 1, Object.defineProperty(Gr, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: He().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return Gr.default = t, Gr;
}
var Hr = {}, eu;
function Fh() {
  if (eu) return Hr;
  eu = 1, Object.defineProperty(Hr, "__esModule", { value: !0 });
  const e = se(), t = ue(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: s }) => (0, e._)`{passingSchemas: ${s.passing}}`
    },
    code(s) {
      const { gen: i, schema: a, parentSchema: o, it: c } = s;
      if (!Array.isArray(a))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && o.discriminator)
        return;
      const l = a, u = i.let("valid", !1), f = i.let("passing", null), d = i.name("_valid");
      s.setParams({ passing: f }), i.block(b), s.result(u, () => s.reset(), () => s.error(!0));
      function b() {
        l.forEach((v, y) => {
          let p;
          (0, t.alwaysValidSchema)(c, v) ? i.var(d, !0) : p = s.subschema({
            keyword: "oneOf",
            schemaProp: y,
            compositeRule: !0
          }, d), y > 0 && i.if((0, e._)`${d} && ${u}`).assign(u, !1).assign(f, (0, e._)`[${f}, ${y}]`).else(), i.if(d, () => {
            i.assign(u, !0), i.assign(f, y), p && s.mergeEvaluated(p, e.Name);
          });
        });
      }
    }
  };
  return Hr.default = r, Hr;
}
var Kr = {}, tu;
function Mh() {
  if (tu) return Kr;
  tu = 1, Object.defineProperty(Kr, "__esModule", { value: !0 });
  const e = ue(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(n) {
      const { gen: r, schema: s, it: i } = n;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const a = r.name("valid");
      s.forEach((o, c) => {
        if ((0, e.alwaysValidSchema)(i, o))
          return;
        const l = n.subschema({ keyword: "allOf", schemaProp: c }, a);
        n.ok(a), n.mergeEvaluated(l);
      });
    }
  };
  return Kr.default = t, Kr;
}
var Wr = {}, ru;
function Uh() {
  if (ru) return Wr;
  ru = 1, Object.defineProperty(Wr, "__esModule", { value: !0 });
  const e = se(), t = ue(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, e.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, e._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: a, parentSchema: o, it: c } = i;
      o.then === void 0 && o.else === void 0 && (0, t.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const l = s(c, "then"), u = s(c, "else");
      if (!l && !u)
        return;
      const f = a.let("valid", !0), d = a.name("_valid");
      if (b(), i.reset(), l && u) {
        const y = a.let("ifClause");
        i.setParams({ ifClause: y }), a.if(d, v("then", y), v("else", y));
      } else l ? a.if(d, v("then")) : a.if((0, e.not)(d), v("else"));
      i.pass(f, () => i.error(!0));
      function b() {
        const y = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, d);
        i.mergeEvaluated(y);
      }
      function v(y, p) {
        return () => {
          const h = i.subschema({ keyword: y }, d);
          a.assign(f, d), i.mergeValidEvaluated(h, f), p ? a.assign(p, (0, e._)`${y}`) : i.setParams({ ifClause: y });
        };
      }
    }
  };
  function s(i, a) {
    const o = i.schema[a];
    return o !== void 0 && !(0, t.alwaysValidSchema)(i, o);
  }
  return Wr.default = r, Wr;
}
var Jr = {}, nu;
function zh() {
  if (nu) return Jr;
  nu = 1, Object.defineProperty(Jr, "__esModule", { value: !0 });
  const e = ue(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: n, parentSchema: r, it: s }) {
      r.if === void 0 && (0, e.checkStrictMode)(s, `"${n}" without "if" is ignored`);
    }
  };
  return Jr.default = t, Jr;
}
var au;
function Vh() {
  if (au) return qr;
  au = 1, Object.defineProperty(qr, "__esModule", { value: !0 });
  const e = Rf(), t = kh(), n = Tf(), r = jh(), s = Ah(), i = So(), a = Ih(), o = Pf(), c = Ch(), l = qh(), u = Lh(), f = Dh(), d = Fh(), b = Mh(), v = Uh(), y = zh();
  function p(h = !1) {
    const m = [
      // any
      u.default,
      f.default,
      d.default,
      b.default,
      v.default,
      y.default,
      // object
      a.default,
      o.default,
      i.default,
      c.default,
      l.default
    ];
    return h ? m.push(t.default, r.default) : m.push(e.default, n.default), m.push(s.default), m;
  }
  return qr.default = p, qr;
}
var Xr = {}, Ct = {}, su;
function Of() {
  if (su) return Ct;
  su = 1, Object.defineProperty(Ct, "__esModule", { value: !0 }), Ct.dynamicAnchor = void 0;
  const e = se(), t = Ge(), n = $a(), r = Eo(), s = {
    keyword: "$dynamicAnchor",
    schemaType: "string",
    code: (o) => i(o, o.schema)
  };
  function i(o, c) {
    const { gen: l, it: u } = o;
    u.schemaEnv.root.dynamicAnchors[c] = !0;
    const f = (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(c)}`, d = u.errSchemaPath === "#" ? u.validateName : a(o);
    l.if((0, e._)`!${f}`, () => l.assign(f, d));
  }
  Ct.dynamicAnchor = i;
  function a(o) {
    const { schemaEnv: c, schema: l, self: u } = o.it, { root: f, baseId: d, localRefs: b, meta: v } = c.root, { schemaId: y } = u.opts, p = new n.SchemaEnv({ schema: l, schemaId: y, root: f, baseId: d, localRefs: b, meta: v });
    return n.compileSchema.call(u, p), (0, r.getValidate)(o, p);
  }
  return Ct.default = s, Ct;
}
var qt = {}, iu;
function Nf() {
  if (iu) return qt;
  iu = 1, Object.defineProperty(qt, "__esModule", { value: !0 }), qt.dynamicRef = void 0;
  const e = se(), t = Ge(), n = Eo(), r = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (i) => s(i, i.schema)
  };
  function s(i, a) {
    const { gen: o, keyword: c, it: l } = i;
    if (a[0] !== "#")
      throw new Error(`"${c}" only supports hash fragment reference`);
    const u = a.slice(1);
    if (l.allErrors)
      f();
    else {
      const b = o.let("valid", !1);
      f(b), i.ok(b);
    }
    function f(b) {
      if (l.schemaEnv.root.dynamicAnchors[u]) {
        const v = o.let("_v", (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(u)}`);
        o.if(v, d(v, b), d(l.validateName, b));
      } else
        d(l.validateName, b)();
    }
    function d(b, v) {
      return v ? () => o.block(() => {
        (0, n.callRef)(i, b), o.let(v, !0);
      }) : () => (0, n.callRef)(i, b);
    }
  }
  return qt.dynamicRef = s, qt.default = r, qt;
}
var Yr = {}, ou;
function Bh() {
  if (ou) return Yr;
  ou = 1, Object.defineProperty(Yr, "__esModule", { value: !0 });
  const e = Of(), t = ue(), n = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(r) {
      r.schema ? (0, e.dynamicAnchor)(r, "") : (0, t.checkStrictMode)(r.it, "$recursiveAnchor: false is ignored");
    }
  };
  return Yr.default = n, Yr;
}
var Qr = {}, cu;
function Gh() {
  if (cu) return Qr;
  cu = 1, Object.defineProperty(Qr, "__esModule", { value: !0 });
  const e = Nf(), t = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (n) => (0, e.dynamicRef)(n, n.schema)
  };
  return Qr.default = t, Qr;
}
var uu;
function Hh() {
  if (uu) return Xr;
  uu = 1, Object.defineProperty(Xr, "__esModule", { value: !0 });
  const e = Of(), t = Nf(), n = Bh(), r = Gh(), s = [e.default, t.default, n.default, r.default];
  return Xr.default = s, Xr;
}
var Zr = {}, en = {}, lu;
function Kh() {
  if (lu) return en;
  lu = 1, Object.defineProperty(en, "__esModule", { value: !0 });
  const e = So(), t = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: e.error,
    code: (n) => (0, e.validatePropertyDeps)(n)
  };
  return en.default = t, en;
}
var tn = {}, pu;
function Wh() {
  if (pu) return tn;
  pu = 1, Object.defineProperty(tn, "__esModule", { value: !0 });
  const e = So(), t = {
    keyword: "dependentSchemas",
    type: "object",
    schemaType: "object",
    code: (n) => (0, e.validateSchemaDeps)(n)
  };
  return tn.default = t, tn;
}
var rn = {}, du;
function Jh() {
  if (du) return rn;
  du = 1, Object.defineProperty(rn, "__esModule", { value: !0 });
  const e = ue(), t = {
    keyword: ["maxContains", "minContains"],
    type: "array",
    schemaType: "number",
    code({ keyword: n, parentSchema: r, it: s }) {
      r.contains === void 0 && (0, e.checkStrictMode)(s, `"${n}" without "contains" is ignored`);
    }
  };
  return rn.default = t, rn;
}
var fu;
function Xh() {
  if (fu) return Zr;
  fu = 1, Object.defineProperty(Zr, "__esModule", { value: !0 });
  const e = Kh(), t = Wh(), n = Jh(), r = [e.default, t.default, n.default];
  return Zr.default = r, Zr;
}
var nn = {}, an = {}, mu;
function Yh() {
  if (mu) return an;
  mu = 1, Object.defineProperty(an, "__esModule", { value: !0 });
  const e = se(), t = ue(), n = Ge(), s = {
    keyword: "unevaluatedProperties",
    type: "object",
    schemaType: ["boolean", "object"],
    trackErrors: !0,
    error: {
      message: "must NOT have unevaluated properties",
      params: ({ params: i }) => (0, e._)`{unevaluatedProperty: ${i.unevaluatedProperty}}`
    },
    code(i) {
      const { gen: a, schema: o, data: c, errsCount: l, it: u } = i;
      if (!l)
        throw new Error("ajv implementation error");
      const { allErrors: f, props: d } = u;
      d instanceof e.Name ? a.if((0, e._)`${d} !== true`, () => a.forIn("key", c, (p) => a.if(v(d, p), () => b(p)))) : d !== !0 && a.forIn("key", c, (p) => d === void 0 ? b(p) : a.if(y(d, p), () => b(p))), u.props = !0, i.ok((0, e._)`${l} === ${n.default.errors}`);
      function b(p) {
        if (o === !1) {
          i.setParams({ unevaluatedProperty: p }), i.error(), f || a.break();
          return;
        }
        if (!(0, t.alwaysValidSchema)(u, o)) {
          const h = a.name("valid");
          i.subschema({
            keyword: "unevaluatedProperties",
            dataProp: p,
            dataPropType: t.Type.Str
          }, h), f || a.if((0, e.not)(h), () => a.break());
        }
      }
      function v(p, h) {
        return (0, e._)`!${p} || !${p}[${h}]`;
      }
      function y(p, h) {
        const m = [];
        for (const _ in p)
          p[_] === !0 && m.push((0, e._)`${h} !== ${_}`);
        return (0, e.and)(...m);
      }
    }
  };
  return an.default = s, an;
}
var sn = {}, hu;
function Qh() {
  if (hu) return sn;
  hu = 1, Object.defineProperty(sn, "__esModule", { value: !0 });
  const e = se(), t = ue(), r = {
    keyword: "unevaluatedItems",
    type: "array",
    schemaType: ["boolean", "object"],
    error: {
      message: ({ params: { len: s } }) => (0, e.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, e._)`{limit: ${s}}`
    },
    code(s) {
      const { gen: i, schema: a, data: o, it: c } = s, l = c.items || 0;
      if (l === !0)
        return;
      const u = i.const("len", (0, e._)`${o}.length`);
      if (a === !1)
        s.setParams({ len: l }), s.fail((0, e._)`${u} > ${l}`);
      else if (typeof a == "object" && !(0, t.alwaysValidSchema)(c, a)) {
        const d = i.var("valid", (0, e._)`${u} <= ${l}`);
        i.if((0, e.not)(d), () => f(d, l)), s.ok(d);
      }
      c.items = !0;
      function f(d, b) {
        i.forRange("i", b, u, (v) => {
          s.subschema({ keyword: "unevaluatedItems", dataProp: v, dataPropType: t.Type.Num }, d), c.allErrors || i.if((0, e.not)(d), () => i.break());
        });
      }
    }
  };
  return sn.default = r, sn;
}
var vu;
function Zh() {
  if (vu) return nn;
  vu = 1, Object.defineProperty(nn, "__esModule", { value: !0 });
  const e = Yh(), t = Qh(), n = [e.default, t.default];
  return nn.default = n, nn;
}
var on = {}, cn = {}, yu;
function ev() {
  if (yu) return cn;
  yu = 1, Object.defineProperty(cn, "__esModule", { value: !0 });
  const e = se(), n = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, e.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, e._)`{format: ${r}}`
    },
    code(r, s) {
      const { gen: i, data: a, $data: o, schema: c, schemaCode: l, it: u } = r, { opts: f, errSchemaPath: d, schemaEnv: b, self: v } = u;
      if (!f.validateFormats)
        return;
      o ? y() : p();
      function y() {
        const h = i.scopeValue("formats", {
          ref: v.formats,
          code: f.code.formats
        }), m = i.const("fDef", (0, e._)`${h}[${l}]`), _ = i.let("fType"), E = i.let("format");
        i.if((0, e._)`typeof ${m} == "object" && !(${m} instanceof RegExp)`, () => i.assign(_, (0, e._)`${m}.type || "string"`).assign(E, (0, e._)`${m}.validate`), () => i.assign(_, (0, e._)`"string"`).assign(E, m)), r.fail$data((0, e.or)(x(), w()));
        function x() {
          return f.strictSchema === !1 ? e.nil : (0, e._)`${l} && !${E}`;
        }
        function w() {
          const S = b.$async ? (0, e._)`(${m}.async ? await ${E}(${a}) : ${E}(${a}))` : (0, e._)`${E}(${a})`, P = (0, e._)`(typeof ${E} == "function" ? ${S} : ${E}.test(${a}))`;
          return (0, e._)`${E} && ${E} !== true && ${_} === ${s} && !${P}`;
        }
      }
      function p() {
        const h = v.formats[c];
        if (!h) {
          x();
          return;
        }
        if (h === !0)
          return;
        const [m, _, E] = w(h);
        m === s && r.pass(S());
        function x() {
          if (f.strictSchema === !1) {
            v.logger.warn(P());
            return;
          }
          throw new Error(P());
          function P() {
            return `unknown format "${c}" ignored in schema at path "${d}"`;
          }
        }
        function w(P) {
          const C = P instanceof RegExp ? (0, e.regexpCode)(P) : f.code.formats ? (0, e._)`${f.code.formats}${(0, e.getProperty)(c)}` : void 0, M = i.scopeValue("formats", { key: c, ref: P, code: C });
          return typeof P == "object" && !(P instanceof RegExp) ? [P.type || "string", P.validate, (0, e._)`${M}.validate`] : ["string", P, M];
        }
        function S() {
          if (typeof h == "object" && !(h instanceof RegExp) && h.async) {
            if (!b.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${E}(${a})`;
          }
          return typeof _ == "function" ? (0, e._)`${E}(${a})` : (0, e._)`${E}.test(${a})`;
        }
      }
    }
  };
  return cn.default = n, cn;
}
var gu;
function tv() {
  if (gu) return on;
  gu = 1, Object.defineProperty(on, "__esModule", { value: !0 });
  const t = [ev().default];
  return on.default = t, on;
}
var wt = {}, bu;
function rv() {
  return bu || (bu = 1, Object.defineProperty(wt, "__esModule", { value: !0 }), wt.contentVocabulary = wt.metadataVocabulary = void 0, wt.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], wt.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), wt;
}
var _u;
function nv() {
  if (_u) return _r;
  _u = 1, Object.defineProperty(_r, "__esModule", { value: !0 });
  const e = gh(), t = Nh(), n = Vh(), r = Hh(), s = Xh(), i = Zh(), a = tv(), o = rv(), c = [
    r.default,
    e.default,
    t.default,
    (0, n.default)(!0),
    a.default,
    o.metadataVocabulary,
    o.contentVocabulary,
    s.default,
    i.default
  ];
  return _r.default = c, _r;
}
var un = {}, Zt = {}, xu;
function av() {
  if (xu) return Zt;
  xu = 1, Object.defineProperty(Zt, "__esModule", { value: !0 }), Zt.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (Zt.DiscrError = e = {})), Zt;
}
var wu;
function sv() {
  if (wu) return un;
  wu = 1, Object.defineProperty(un, "__esModule", { value: !0 });
  const e = se(), t = av(), n = $a(), r = Ea(), s = ue(), a = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: o, tagName: c } }) => o === t.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: o, tag: c, tagName: l } }) => (0, e._)`{error: ${o}, tag: ${l}, tagValue: ${c}}`
    },
    code(o) {
      const { gen: c, data: l, schema: u, parentSchema: f, it: d } = o, { oneOf: b } = f;
      if (!d.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const v = u.propertyName;
      if (typeof v != "string")
        throw new Error("discriminator: requires propertyName");
      if (u.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!b)
        throw new Error("discriminator: requires oneOf keyword");
      const y = c.let("valid", !1), p = c.const("tag", (0, e._)`${l}${(0, e.getProperty)(v)}`);
      c.if((0, e._)`typeof ${p} == "string"`, () => h(), () => o.error(!1, { discrError: t.DiscrError.Tag, tag: p, tagName: v })), o.ok(y);
      function h() {
        const E = _();
        c.if(!1);
        for (const x in E)
          c.elseIf((0, e._)`${p} === ${x}`), c.assign(y, m(E[x]));
        c.else(), o.error(!1, { discrError: t.DiscrError.Mapping, tag: p, tagName: v }), c.endIf();
      }
      function m(E) {
        const x = c.name("valid"), w = o.subschema({ keyword: "oneOf", schemaProp: E }, x);
        return o.mergeEvaluated(w, e.Name), x;
      }
      function _() {
        var E;
        const x = {}, w = P(f);
        let S = !0;
        for (let L = 0; L < b.length; L++) {
          let G = b[L];
          if (G?.$ref && !(0, s.schemaHasRulesButRef)(G, d.self.RULES)) {
            const F = G.$ref;
            if (G = n.resolveRef.call(d.self, d.schemaEnv.root, d.baseId, F), G instanceof n.SchemaEnv && (G = G.schema), G === void 0)
              throw new r.default(d.opts.uriResolver, d.baseId, F);
          }
          const H = (E = G?.properties) === null || E === void 0 ? void 0 : E[v];
          if (typeof H != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${v}"`);
          S = S && (w || P(G)), C(H, L);
        }
        if (!S)
          throw new Error(`discriminator: "${v}" must be required`);
        return x;
        function P({ required: L }) {
          return Array.isArray(L) && L.includes(v);
        }
        function C(L, G) {
          if (L.const)
            M(L.const, G);
          else if (L.enum)
            for (const H of L.enum)
              M(H, G);
          else
            throw new Error(`discriminator: "properties/${v}" must have "const" or "enum"`);
        }
        function M(L, G) {
          if (typeof L != "string" || L in x)
            throw new Error(`discriminator: "${v}" values must be unique strings`);
          x[L] = G;
        }
      }
    }
  };
  return un.default = a, un;
}
var ln = {};
const iv = "https://json-schema.org/draft/2020-12/schema", ov = "https://json-schema.org/draft/2020-12/schema", cv = { "https://json-schema.org/draft/2020-12/vocab/core": !0, "https://json-schema.org/draft/2020-12/vocab/applicator": !0, "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0, "https://json-schema.org/draft/2020-12/vocab/validation": !0, "https://json-schema.org/draft/2020-12/vocab/meta-data": !0, "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0, "https://json-schema.org/draft/2020-12/vocab/content": !0 }, uv = "meta", lv = "Core and Validation specifications meta-schema", pv = [{ $ref: "meta/core" }, { $ref: "meta/applicator" }, { $ref: "meta/unevaluated" }, { $ref: "meta/validation" }, { $ref: "meta/meta-data" }, { $ref: "meta/format-annotation" }, { $ref: "meta/content" }], dv = ["object", "boolean"], fv = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", mv = { definitions: { $comment: '"definitions" has been replaced by "$defs".', type: "object", additionalProperties: { $dynamicRef: "#meta" }, deprecated: !0, default: {} }, dependencies: { $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.', type: "object", additionalProperties: { anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }] }, deprecated: !0, default: {} }, $recursiveAnchor: { $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".', $ref: "meta/core#/$defs/anchorString", deprecated: !0 }, $recursiveRef: { $comment: '"$recursiveRef" has been replaced by "$dynamicRef".', $ref: "meta/core#/$defs/uriReferenceString", deprecated: !0 } }, hv = {
  $schema: iv,
  $id: ov,
  $vocabulary: cv,
  $dynamicAnchor: uv,
  title: lv,
  allOf: pv,
  type: dv,
  $comment: fv,
  properties: mv
}, vv = "https://json-schema.org/draft/2020-12/schema", yv = "https://json-schema.org/draft/2020-12/meta/applicator", gv = { "https://json-schema.org/draft/2020-12/vocab/applicator": !0 }, bv = "meta", _v = "Applicator vocabulary meta-schema", xv = ["object", "boolean"], wv = { prefixItems: { $ref: "#/$defs/schemaArray" }, items: { $dynamicRef: "#meta" }, contains: { $dynamicRef: "#meta" }, additionalProperties: { $dynamicRef: "#meta" }, properties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, propertyNames: { format: "regex" }, default: {} }, dependentSchemas: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, propertyNames: { $dynamicRef: "#meta" }, if: { $dynamicRef: "#meta" }, then: { $dynamicRef: "#meta" }, else: { $dynamicRef: "#meta" }, allOf: { $ref: "#/$defs/schemaArray" }, anyOf: { $ref: "#/$defs/schemaArray" }, oneOf: { $ref: "#/$defs/schemaArray" }, not: { $dynamicRef: "#meta" } }, Ev = { schemaArray: { type: "array", minItems: 1, items: { $dynamicRef: "#meta" } } }, $v = {
  $schema: vv,
  $id: yv,
  $vocabulary: gv,
  $dynamicAnchor: bv,
  title: _v,
  type: xv,
  properties: wv,
  $defs: Ev
}, Sv = "https://json-schema.org/draft/2020-12/schema", Rv = "https://json-schema.org/draft/2020-12/meta/unevaluated", Tv = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0 }, Pv = "meta", Ov = "Unevaluated applicator vocabulary meta-schema", Nv = ["object", "boolean"], kv = { unevaluatedItems: { $dynamicRef: "#meta" }, unevaluatedProperties: { $dynamicRef: "#meta" } }, jv = {
  $schema: Sv,
  $id: Rv,
  $vocabulary: Tv,
  $dynamicAnchor: Pv,
  title: Ov,
  type: Nv,
  properties: kv
}, Av = "https://json-schema.org/draft/2020-12/schema", Iv = "https://json-schema.org/draft/2020-12/meta/content", Cv = { "https://json-schema.org/draft/2020-12/vocab/content": !0 }, qv = "meta", Lv = "Content vocabulary meta-schema", Dv = ["object", "boolean"], Fv = { contentEncoding: { type: "string" }, contentMediaType: { type: "string" }, contentSchema: { $dynamicRef: "#meta" } }, Mv = {
  $schema: Av,
  $id: Iv,
  $vocabulary: Cv,
  $dynamicAnchor: qv,
  title: Lv,
  type: Dv,
  properties: Fv
}, Uv = "https://json-schema.org/draft/2020-12/schema", zv = "https://json-schema.org/draft/2020-12/meta/core", Vv = { "https://json-schema.org/draft/2020-12/vocab/core": !0 }, Bv = "meta", Gv = "Core vocabulary meta-schema", Hv = ["object", "boolean"], Kv = { $id: { $ref: "#/$defs/uriReferenceString", $comment: "Non-empty fragments not allowed.", pattern: "^[^#]*#?$" }, $schema: { $ref: "#/$defs/uriString" }, $ref: { $ref: "#/$defs/uriReferenceString" }, $anchor: { $ref: "#/$defs/anchorString" }, $dynamicRef: { $ref: "#/$defs/uriReferenceString" }, $dynamicAnchor: { $ref: "#/$defs/anchorString" }, $vocabulary: { type: "object", propertyNames: { $ref: "#/$defs/uriString" }, additionalProperties: { type: "boolean" } }, $comment: { type: "string" }, $defs: { type: "object", additionalProperties: { $dynamicRef: "#meta" } } }, Wv = { anchorString: { type: "string", pattern: "^[A-Za-z_][-A-Za-z0-9._]*$" }, uriString: { type: "string", format: "uri" }, uriReferenceString: { type: "string", format: "uri-reference" } }, Jv = {
  $schema: Uv,
  $id: zv,
  $vocabulary: Vv,
  $dynamicAnchor: Bv,
  title: Gv,
  type: Hv,
  properties: Kv,
  $defs: Wv
}, Xv = "https://json-schema.org/draft/2020-12/schema", Yv = "https://json-schema.org/draft/2020-12/meta/format-annotation", Qv = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0 }, Zv = "meta", ey = "Format vocabulary meta-schema for annotation results", ty = ["object", "boolean"], ry = { format: { type: "string" } }, ny = {
  $schema: Xv,
  $id: Yv,
  $vocabulary: Qv,
  $dynamicAnchor: Zv,
  title: ey,
  type: ty,
  properties: ry
}, ay = "https://json-schema.org/draft/2020-12/schema", sy = "https://json-schema.org/draft/2020-12/meta/meta-data", iy = { "https://json-schema.org/draft/2020-12/vocab/meta-data": !0 }, oy = "meta", cy = "Meta-data vocabulary meta-schema", uy = ["object", "boolean"], ly = { title: { type: "string" }, description: { type: "string" }, default: !0, deprecated: { type: "boolean", default: !1 }, readOnly: { type: "boolean", default: !1 }, writeOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 } }, py = {
  $schema: ay,
  $id: sy,
  $vocabulary: iy,
  $dynamicAnchor: oy,
  title: cy,
  type: uy,
  properties: ly
}, dy = "https://json-schema.org/draft/2020-12/schema", fy = "https://json-schema.org/draft/2020-12/meta/validation", my = { "https://json-schema.org/draft/2020-12/vocab/validation": !0 }, hy = "meta", vy = "Validation vocabulary meta-schema", yy = ["object", "boolean"], gy = { type: { anyOf: [{ $ref: "#/$defs/simpleTypes" }, { type: "array", items: { $ref: "#/$defs/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, const: !0, enum: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/$defs/nonNegativeInteger" }, minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, maxItems: { $ref: "#/$defs/nonNegativeInteger" }, minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, maxContains: { $ref: "#/$defs/nonNegativeInteger" }, minContains: { $ref: "#/$defs/nonNegativeInteger", default: 1 }, maxProperties: { $ref: "#/$defs/nonNegativeInteger" }, minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, required: { $ref: "#/$defs/stringArray" }, dependentRequired: { type: "object", additionalProperties: { $ref: "#/$defs/stringArray" } } }, by = { nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { $ref: "#/$defs/nonNegativeInteger", default: 0 }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, _y = {
  $schema: dy,
  $id: fy,
  $vocabulary: my,
  $dynamicAnchor: hy,
  title: vy,
  type: yy,
  properties: gy,
  $defs: by
};
var Eu;
function xy() {
  if (Eu) return ln;
  Eu = 1, Object.defineProperty(ln, "__esModule", { value: !0 });
  const e = hv, t = $v, n = jv, r = Mv, s = Jv, i = ny, a = py, o = _y, c = ["/properties"];
  function l(u) {
    return [
      e,
      t,
      n,
      r,
      s,
      f(this, i),
      a,
      f(this, o)
    ].forEach((d) => this.addMetaSchema(d, void 0, !1)), this;
    function f(d, b) {
      return u ? d.$dataMetaSchema(b, c) : b;
    }
  }
  return ln.default = l, ln;
}
var $u;
function wy() {
  return $u || ($u = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
    const n = vh(), r = nv(), s = sv(), i = xy(), a = "https://json-schema.org/draft/2020-12/schema";
    class o extends n.default {
      constructor(b = {}) {
        super({
          ...b,
          dynamicRef: !0,
          next: !0,
          unevaluated: !0
        });
      }
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((b) => this.addVocabulary(b)), this.opts.discriminator && this.addKeyword(s.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data: b, meta: v } = this.opts;
        v && (i.default.call(this, b), this.refs["http://json-schema.org/schema"] = a);
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    t.Ajv2020 = o, e.exports = t = o, e.exports.Ajv2020 = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
    var c = wa();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return c.KeywordCxt;
    } });
    var l = se();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return l._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return l.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return l.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return l.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return l.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return l.CodeGen;
    } });
    var u = wo();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return u.default;
    } });
    var f = Ea();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return f.default;
    } });
  })(hr, hr.exports)), hr.exports;
}
var Ey = wy(), pn = { exports: {} }, ts = {}, Su;
function $y() {
  return Su || (Su = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function t(L, G) {
      return { validate: L, compare: G };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: t(i, a),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: t(c(!0), l),
      "date-time": t(d(!0), b),
      "iso-time": t(c(), u),
      "iso-date-time": t(d(), v),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: h,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex: M,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte: _,
      // signed 32 bit integer
      int32: { type: "number", validate: w },
      // signed 64 bit integer
      int64: { type: "number", validate: S },
      // C-type float
      float: { type: "number", validate: P },
      // C-type double
      double: { type: "number", validate: P },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
      time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, l),
      "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, b),
      "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
      "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, v),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, e.formatNames = Object.keys(e.fullFormats);
    function n(L) {
      return L % 4 === 0 && (L % 100 !== 0 || L % 400 === 0);
    }
    const r = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function i(L) {
      const G = r.exec(L);
      if (!G)
        return !1;
      const H = +G[1], F = +G[2], K = +G[3];
      return F >= 1 && F <= 12 && K >= 1 && K <= (F === 2 && n(H) ? 29 : s[F]);
    }
    function a(L, G) {
      if (L && G)
        return L > G ? 1 : L < G ? -1 : 0;
    }
    const o = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function c(L) {
      return function(H) {
        const F = o.exec(H);
        if (!F)
          return !1;
        const K = +F[1], q = +F[2], U = +F[3], D = F[4], J = F[5] === "-" ? -1 : 1, A = +(F[6] || 0), R = +(F[7] || 0);
        if (A > 23 || R > 59 || L && !D)
          return !1;
        if (K <= 23 && q <= 59 && U < 60)
          return !0;
        const j = q - R * J, O = K - A * J - (j < 0 ? 1 : 0);
        return (O === 23 || O === -1) && (j === 59 || j === -1) && U < 61;
      };
    }
    function l(L, G) {
      if (!(L && G))
        return;
      const H = (/* @__PURE__ */ new Date("2020-01-01T" + L)).valueOf(), F = (/* @__PURE__ */ new Date("2020-01-01T" + G)).valueOf();
      if (H && F)
        return H - F;
    }
    function u(L, G) {
      if (!(L && G))
        return;
      const H = o.exec(L), F = o.exec(G);
      if (H && F)
        return L = H[1] + H[2] + H[3], G = F[1] + F[2] + F[3], L > G ? 1 : L < G ? -1 : 0;
    }
    const f = /t|\s/i;
    function d(L) {
      const G = c(L);
      return function(F) {
        const K = F.split(f);
        return K.length === 2 && i(K[0]) && G(K[1]);
      };
    }
    function b(L, G) {
      if (!(L && G))
        return;
      const H = new Date(L).valueOf(), F = new Date(G).valueOf();
      if (H && F)
        return H - F;
    }
    function v(L, G) {
      if (!(L && G))
        return;
      const [H, F] = L.split(f), [K, q] = G.split(f), U = a(H, K);
      if (U !== void 0)
        return U || l(F, q);
    }
    const y = /\/|:/, p = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function h(L) {
      return y.test(L) && p.test(L);
    }
    const m = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function _(L) {
      return m.lastIndex = 0, m.test(L);
    }
    const E = -2147483648, x = 2 ** 31 - 1;
    function w(L) {
      return Number.isInteger(L) && L <= x && L >= E;
    }
    function S(L) {
      return Number.isInteger(L);
    }
    function P() {
      return !0;
    }
    const C = /[^\\]\\Z/;
    function M(L) {
      if (C.test(L))
        return !1;
      try {
        return new RegExp(L), !0;
      } catch {
        return !1;
      }
    }
  })(ts)), ts;
}
var rs = {}, dn = { exports: {} }, ns = {}, rt = {}, Et = {}, as = {}, ss = {}, is = {}, Ru;
function da() {
  return Ru || (Ru = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class n extends t {
      constructor(m) {
        if (super(), !e.IDENTIFIER.test(m))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = m;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = n;
    class r extends t {
      constructor(m) {
        super(), this._items = typeof m == "string" ? [m] : m;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const m = this._items[0];
        return m === "" || m === '""';
      }
      get str() {
        var m;
        return (m = this._str) !== null && m !== void 0 ? m : this._str = this._items.reduce((_, E) => `${_}${E}`, "");
      }
      get names() {
        var m;
        return (m = this._names) !== null && m !== void 0 ? m : this._names = this._items.reduce((_, E) => (E instanceof n && (_[E.str] = (_[E.str] || 0) + 1), _), {});
      }
    }
    e._Code = r, e.nil = new r("");
    function s(h, ...m) {
      const _ = [h[0]];
      let E = 0;
      for (; E < m.length; )
        o(_, m[E]), _.push(h[++E]);
      return new r(_);
    }
    e._ = s;
    const i = new r("+");
    function a(h, ...m) {
      const _ = [b(h[0])];
      let E = 0;
      for (; E < m.length; )
        _.push(i), o(_, m[E]), _.push(i, b(h[++E]));
      return c(_), new r(_);
    }
    e.str = a;
    function o(h, m) {
      m instanceof r ? h.push(...m._items) : m instanceof n ? h.push(m) : h.push(f(m));
    }
    e.addCodeArg = o;
    function c(h) {
      let m = 1;
      for (; m < h.length - 1; ) {
        if (h[m] === i) {
          const _ = l(h[m - 1], h[m + 1]);
          if (_ !== void 0) {
            h.splice(m - 1, 3, _);
            continue;
          }
          h[m++] = "+";
        }
        m++;
      }
    }
    function l(h, m) {
      if (m === '""')
        return h;
      if (h === '""')
        return m;
      if (typeof h == "string")
        return m instanceof n || h[h.length - 1] !== '"' ? void 0 : typeof m != "string" ? `${h.slice(0, -1)}${m}"` : m[0] === '"' ? h.slice(0, -1) + m.slice(1) : void 0;
      if (typeof m == "string" && m[0] === '"' && !(h instanceof n))
        return `"${h}${m.slice(1)}`;
    }
    function u(h, m) {
      return m.emptyStr() ? h : h.emptyStr() ? m : a`${h}${m}`;
    }
    e.strConcat = u;
    function f(h) {
      return typeof h == "number" || typeof h == "boolean" || h === null ? h : b(Array.isArray(h) ? h.join(",") : h);
    }
    function d(h) {
      return new r(b(h));
    }
    e.stringify = d;
    function b(h) {
      return JSON.stringify(h).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = b;
    function v(h) {
      return typeof h == "string" && e.IDENTIFIER.test(h) ? new r(`.${h}`) : s`[${h}]`;
    }
    e.getProperty = v;
    function y(h) {
      if (typeof h == "string" && e.IDENTIFIER.test(h))
        return new r(`${h}`);
      throw new Error(`CodeGen: invalid export name: ${h}, use explicit $id name mapping`);
    }
    e.getEsmExportName = y;
    function p(h) {
      return new r(h.toString());
    }
    e.regexpCode = p;
  })(is)), is;
}
var os = {}, Tu;
function Pu() {
  return Tu || (Tu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = da();
    class n extends Error {
      constructor(l) {
        super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
      }
    }
    var r;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(r || (e.UsedValueState = r = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class s {
      constructor({ prefixes: l, parent: u } = {}) {
        this._names = {}, this._prefixes = l, this._parent = u;
      }
      toName(l) {
        return l instanceof t.Name ? l : this.name(l);
      }
      name(l) {
        return new t.Name(this._newName(l));
      }
      _newName(l) {
        const u = this._names[l] || this._nameGroup(l);
        return `${l}${u.index++}`;
      }
      _nameGroup(l) {
        var u, f;
        if (!((f = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || f === void 0) && f.has(l) || this._prefixes && !this._prefixes.has(l))
          throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
        return this._names[l] = { prefix: l, index: 0 };
      }
    }
    e.Scope = s;
    class i extends t.Name {
      constructor(l, u) {
        super(u), this.prefix = l;
      }
      setValue(l, { property: u, itemIndex: f }) {
        this.value = l, this.scopePath = (0, t._)`.${new t.Name(u)}[${f}]`;
      }
    }
    e.ValueScopeName = i;
    const a = (0, t._)`\n`;
    class o extends s {
      constructor(l) {
        super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? a : t.nil };
      }
      get() {
        return this._scope;
      }
      name(l) {
        return new i(l, this._newName(l));
      }
      value(l, u) {
        var f;
        if (u.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const d = this.toName(l), { prefix: b } = d, v = (f = u.key) !== null && f !== void 0 ? f : u.ref;
        let y = this._values[b];
        if (y) {
          const m = y.get(v);
          if (m)
            return m;
        } else
          y = this._values[b] = /* @__PURE__ */ new Map();
        y.set(v, d);
        const p = this._scope[b] || (this._scope[b] = []), h = p.length;
        return p[h] = u.ref, d.setValue(u, { property: b, itemIndex: h }), d;
      }
      getValue(l, u) {
        const f = this._values[l];
        if (f)
          return f.get(u);
      }
      scopeRefs(l, u = this._values) {
        return this._reduceValues(u, (f) => {
          if (f.scopePath === void 0)
            throw new Error(`CodeGen: name "${f}" has no value`);
          return (0, t._)`${l}${f.scopePath}`;
        });
      }
      scopeCode(l = this._values, u, f) {
        return this._reduceValues(l, (d) => {
          if (d.value === void 0)
            throw new Error(`CodeGen: name "${d}" has no value`);
          return d.value.code;
        }, u, f);
      }
      _reduceValues(l, u, f = {}, d) {
        let b = t.nil;
        for (const v in l) {
          const y = l[v];
          if (!y)
            continue;
          const p = f[v] = f[v] || /* @__PURE__ */ new Map();
          y.forEach((h) => {
            if (p.has(h))
              return;
            p.set(h, r.Started);
            let m = u(h);
            if (m) {
              const _ = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              b = (0, t._)`${b}${_} ${h} = ${m};${this.opts._n}`;
            } else if (m = d?.(h))
              b = (0, t._)`${b}${m}${this.opts._n}`;
            else
              throw new n(h);
            p.set(h, r.Completed);
          });
        }
        return b;
      }
    }
    e.ValueScope = o;
  })(os)), os;
}
var Ou;
function ce() {
  return Ou || (Ou = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = da(), n = Pu();
    var r = da();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return r.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return r.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return r.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } });
    var s = Pu();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class i {
      optimizeNodes() {
        return this;
      }
      optimizeNames(g, $) {
        return this;
      }
    }
    class a extends i {
      constructor(g, $, k) {
        super(), this.varKind = g, this.name = $, this.rhs = k;
      }
      render({ es5: g, _n: $ }) {
        const k = g ? n.varKinds.var : this.varKind, B = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${k} ${this.name}${B};` + $;
      }
      optimizeNames(g, $) {
        if (g[this.name.str])
          return this.rhs && (this.rhs = F(this.rhs, g, $)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class o extends i {
      constructor(g, $, k) {
        super(), this.lhs = g, this.rhs = $, this.sideEffects = k;
      }
      render({ _n: g }) {
        return `${this.lhs} = ${this.rhs};` + g;
      }
      optimizeNames(g, $) {
        if (!(this.lhs instanceof t.Name && !g[this.lhs.str] && !this.sideEffects))
          return this.rhs = F(this.rhs, g, $), this;
      }
      get names() {
        const g = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return H(g, this.rhs);
      }
    }
    class c extends o {
      constructor(g, $, k, B) {
        super(g, k, B), this.op = $;
      }
      render({ _n: g }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + g;
      }
    }
    class l extends i {
      constructor(g) {
        super(), this.label = g, this.names = {};
      }
      render({ _n: g }) {
        return `${this.label}:` + g;
      }
    }
    class u extends i {
      constructor(g) {
        super(), this.label = g, this.names = {};
      }
      render({ _n: g }) {
        return `break${this.label ? ` ${this.label}` : ""};` + g;
      }
    }
    class f extends i {
      constructor(g) {
        super(), this.error = g;
      }
      render({ _n: g }) {
        return `throw ${this.error};` + g;
      }
      get names() {
        return this.error.names;
      }
    }
    class d extends i {
      constructor(g) {
        super(), this.code = g;
      }
      render({ _n: g }) {
        return `${this.code};` + g;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(g, $) {
        return this.code = F(this.code, g, $), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class b extends i {
      constructor(g = []) {
        super(), this.nodes = g;
      }
      render(g) {
        return this.nodes.reduce(($, k) => $ + k.render(g), "");
      }
      optimizeNodes() {
        const { nodes: g } = this;
        let $ = g.length;
        for (; $--; ) {
          const k = g[$].optimizeNodes();
          Array.isArray(k) ? g.splice($, 1, ...k) : k ? g[$] = k : g.splice($, 1);
        }
        return g.length > 0 ? this : void 0;
      }
      optimizeNames(g, $) {
        const { nodes: k } = this;
        let B = k.length;
        for (; B--; ) {
          const W = k[B];
          W.optimizeNames(g, $) || (K(g, W.names), k.splice(B, 1));
        }
        return k.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((g, $) => G(g, $.names), {});
      }
    }
    class v extends b {
      render(g) {
        return "{" + g._n + super.render(g) + "}" + g._n;
      }
    }
    class y extends b {
    }
    class p extends v {
    }
    p.kind = "else";
    class h extends v {
      constructor(g, $) {
        super($), this.condition = g;
      }
      render(g) {
        let $ = `if(${this.condition})` + super.render(g);
        return this.else && ($ += "else " + this.else.render(g)), $;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const g = this.condition;
        if (g === !0)
          return this.nodes;
        let $ = this.else;
        if ($) {
          const k = $.optimizeNodes();
          $ = this.else = Array.isArray(k) ? new p(k) : k;
        }
        if ($)
          return g === !1 ? $ instanceof h ? $ : $.nodes : this.nodes.length ? this : new h(q(g), $ instanceof h ? [$] : $.nodes);
        if (!(g === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(g, $) {
        var k;
        if (this.else = (k = this.else) === null || k === void 0 ? void 0 : k.optimizeNames(g, $), !!(super.optimizeNames(g, $) || this.else))
          return this.condition = F(this.condition, g, $), this;
      }
      get names() {
        const g = super.names;
        return H(g, this.condition), this.else && G(g, this.else.names), g;
      }
    }
    h.kind = "if";
    class m extends v {
    }
    m.kind = "for";
    class _ extends m {
      constructor(g) {
        super(), this.iteration = g;
      }
      render(g) {
        return `for(${this.iteration})` + super.render(g);
      }
      optimizeNames(g, $) {
        if (super.optimizeNames(g, $))
          return this.iteration = F(this.iteration, g, $), this;
      }
      get names() {
        return G(super.names, this.iteration.names);
      }
    }
    class E extends m {
      constructor(g, $, k, B) {
        super(), this.varKind = g, this.name = $, this.from = k, this.to = B;
      }
      render(g) {
        const $ = g.es5 ? n.varKinds.var : this.varKind, { name: k, from: B, to: W } = this;
        return `for(${$} ${k}=${B}; ${k}<${W}; ${k}++)` + super.render(g);
      }
      get names() {
        const g = H(super.names, this.from);
        return H(g, this.to);
      }
    }
    class x extends m {
      constructor(g, $, k, B) {
        super(), this.loop = g, this.varKind = $, this.name = k, this.iterable = B;
      }
      render(g) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(g);
      }
      optimizeNames(g, $) {
        if (super.optimizeNames(g, $))
          return this.iterable = F(this.iterable, g, $), this;
      }
      get names() {
        return G(super.names, this.iterable.names);
      }
    }
    class w extends v {
      constructor(g, $, k) {
        super(), this.name = g, this.args = $, this.async = k;
      }
      render(g) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(g);
      }
    }
    w.kind = "func";
    class S extends b {
      render(g) {
        return "return " + super.render(g);
      }
    }
    S.kind = "return";
    class P extends v {
      render(g) {
        let $ = "try" + super.render(g);
        return this.catch && ($ += this.catch.render(g)), this.finally && ($ += this.finally.render(g)), $;
      }
      optimizeNodes() {
        var g, $;
        return super.optimizeNodes(), (g = this.catch) === null || g === void 0 || g.optimizeNodes(), ($ = this.finally) === null || $ === void 0 || $.optimizeNodes(), this;
      }
      optimizeNames(g, $) {
        var k, B;
        return super.optimizeNames(g, $), (k = this.catch) === null || k === void 0 || k.optimizeNames(g, $), (B = this.finally) === null || B === void 0 || B.optimizeNames(g, $), this;
      }
      get names() {
        const g = super.names;
        return this.catch && G(g, this.catch.names), this.finally && G(g, this.finally.names), g;
      }
    }
    class C extends v {
      constructor(g) {
        super(), this.error = g;
      }
      render(g) {
        return `catch(${this.error})` + super.render(g);
      }
    }
    C.kind = "catch";
    class M extends v {
      render(g) {
        return "finally" + super.render(g);
      }
    }
    M.kind = "finally";
    class L {
      constructor(g, $ = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...$, _n: $.lines ? `
` : "" }, this._extScope = g, this._scope = new n.Scope({ parent: g }), this._nodes = [new y()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(g) {
        return this._scope.name(g);
      }
      // reserves unique name in the external scope
      scopeName(g) {
        return this._extScope.name(g);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(g, $) {
        const k = this._extScope.value(g, $);
        return (this._values[k.prefix] || (this._values[k.prefix] = /* @__PURE__ */ new Set())).add(k), k;
      }
      getScopeValue(g, $) {
        return this._extScope.getValue(g, $);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(g) {
        return this._extScope.scopeRefs(g, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(g, $, k, B) {
        const W = this._scope.toName($);
        return k !== void 0 && B && (this._constants[W.str] = k), this._leafNode(new a(g, W, k)), W;
      }
      // `const` declaration (`var` in es5 mode)
      const(g, $, k) {
        return this._def(n.varKinds.const, g, $, k);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(g, $, k) {
        return this._def(n.varKinds.let, g, $, k);
      }
      // `var` declaration with optional assignment
      var(g, $, k) {
        return this._def(n.varKinds.var, g, $, k);
      }
      // assignment code
      assign(g, $, k) {
        return this._leafNode(new o(g, $, k));
      }
      // `+=` code
      add(g, $) {
        return this._leafNode(new c(g, e.operators.ADD, $));
      }
      // appends passed SafeExpr to code or executes Block
      code(g) {
        return typeof g == "function" ? g() : g !== t.nil && this._leafNode(new d(g)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...g) {
        const $ = ["{"];
        for (const [k, B] of g)
          $.length > 1 && $.push(","), $.push(k), (k !== B || this.opts.es5) && ($.push(":"), (0, t.addCodeArg)($, B));
        return $.push("}"), new t._Code($);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(g, $, k) {
        if (this._blockNode(new h(g)), $ && k)
          this.code($).else().code(k).endIf();
        else if ($)
          this.code($).endIf();
        else if (k)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(g) {
        return this._elseNode(new h(g));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new p());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(h, p);
      }
      _for(g, $) {
        return this._blockNode(g), $ && this.code($).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(g, $) {
        return this._for(new _(g), $);
      }
      // `for` statement for a range of values
      forRange(g, $, k, B, W = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
        const Z = this._scope.toName(g);
        return this._for(new E(W, Z, $, k), () => B(Z));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(g, $, k, B = n.varKinds.const) {
        const W = this._scope.toName(g);
        if (this.opts.es5) {
          const Z = $ instanceof t.Name ? $ : this.var("_arr", $);
          return this.forRange("_i", 0, (0, t._)`${Z}.length`, (Y) => {
            this.var(W, (0, t._)`${Z}[${Y}]`), k(W);
          });
        }
        return this._for(new x("of", B, W, $), () => k(W));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(g, $, k, B = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(g, (0, t._)`Object.keys(${$})`, k);
        const W = this._scope.toName(g);
        return this._for(new x("in", B, W, $), () => k(W));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(m);
      }
      // `label` statement
      label(g) {
        return this._leafNode(new l(g));
      }
      // `break` statement
      break(g) {
        return this._leafNode(new u(g));
      }
      // `return` statement
      return(g) {
        const $ = new S();
        if (this._blockNode($), this.code(g), $.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(S);
      }
      // `try` statement
      try(g, $, k) {
        if (!$ && !k)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const B = new P();
        if (this._blockNode(B), this.code(g), $) {
          const W = this.name("e");
          this._currNode = B.catch = new C(W), $(W);
        }
        return k && (this._currNode = B.finally = new M(), this.code(k)), this._endBlockNode(C, M);
      }
      // `throw` statement
      throw(g) {
        return this._leafNode(new f(g));
      }
      // start self-balancing block
      block(g, $) {
        return this._blockStarts.push(this._nodes.length), g && this.code(g).endBlock($), this;
      }
      // end the current self-balancing block
      endBlock(g) {
        const $ = this._blockStarts.pop();
        if ($ === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const k = this._nodes.length - $;
        if (k < 0 || g !== void 0 && k !== g)
          throw new Error(`CodeGen: wrong number of nodes: ${k} vs ${g} expected`);
        return this._nodes.length = $, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(g, $ = t.nil, k, B) {
        return this._blockNode(new w(g, $, k)), B && this.code(B).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(w);
      }
      optimize(g = 1) {
        for (; g-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(g) {
        return this._currNode.nodes.push(g), this;
      }
      _blockNode(g) {
        this._currNode.nodes.push(g), this._nodes.push(g);
      }
      _endBlockNode(g, $) {
        const k = this._currNode;
        if (k instanceof g || $ && k instanceof $)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${$ ? `${g.kind}/${$.kind}` : g.kind}"`);
      }
      _elseNode(g) {
        const $ = this._currNode;
        if (!($ instanceof h))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = $.else = g, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const g = this._nodes;
        return g[g.length - 1];
      }
      set _currNode(g) {
        const $ = this._nodes;
        $[$.length - 1] = g;
      }
    }
    e.CodeGen = L;
    function G(O, g) {
      for (const $ in g)
        O[$] = (O[$] || 0) + (g[$] || 0);
      return O;
    }
    function H(O, g) {
      return g instanceof t._CodeOrName ? G(O, g.names) : O;
    }
    function F(O, g, $) {
      if (O instanceof t.Name)
        return k(O);
      if (!B(O))
        return O;
      return new t._Code(O._items.reduce((W, Z) => (Z instanceof t.Name && (Z = k(Z)), Z instanceof t._Code ? W.push(...Z._items) : W.push(Z), W), []));
      function k(W) {
        const Z = $[W.str];
        return Z === void 0 || g[W.str] !== 1 ? W : (delete g[W.str], Z);
      }
      function B(W) {
        return W instanceof t._Code && W._items.some((Z) => Z instanceof t.Name && g[Z.str] === 1 && $[Z.str] !== void 0);
      }
    }
    function K(O, g) {
      for (const $ in g)
        O[$] = (O[$] || 0) - (g[$] || 0);
    }
    function q(O) {
      return typeof O == "boolean" || typeof O == "number" || O === null ? !O : (0, t._)`!${j(O)}`;
    }
    e.not = q;
    const U = R(e.operators.AND);
    function D(...O) {
      return O.reduce(U);
    }
    e.and = D;
    const J = R(e.operators.OR);
    function A(...O) {
      return O.reduce(J);
    }
    e.or = A;
    function R(O) {
      return (g, $) => g === t.nil ? $ : $ === t.nil ? g : (0, t._)`${j(g)} ${O} ${j($)}`;
    }
    function j(O) {
      return O instanceof t.Name ? O : (0, t._)`(${O})`;
    }
  })(ss)), ss;
}
var oe = {}, Nu;
function de() {
  if (Nu) return oe;
  Nu = 1, Object.defineProperty(oe, "__esModule", { value: !0 }), oe.checkStrictMode = oe.getErrorPath = oe.Type = oe.useFunc = oe.setEvaluated = oe.evaluatedPropsToName = oe.mergeEvaluated = oe.eachItem = oe.unescapeJsonPointer = oe.escapeJsonPointer = oe.escapeFragment = oe.unescapeFragment = oe.schemaRefOrVal = oe.schemaHasRulesButRef = oe.schemaHasRules = oe.checkUnknownRules = oe.alwaysValidSchema = oe.toHash = void 0;
  const e = ce(), t = da();
  function n(x) {
    const w = {};
    for (const S of x)
      w[S] = !0;
    return w;
  }
  oe.toHash = n;
  function r(x, w) {
    return typeof w == "boolean" ? w : Object.keys(w).length === 0 ? !0 : (s(x, w), !i(w, x.self.RULES.all));
  }
  oe.alwaysValidSchema = r;
  function s(x, w = x.schema) {
    const { opts: S, self: P } = x;
    if (!S.strictSchema || typeof w == "boolean")
      return;
    const C = P.RULES.keywords;
    for (const M in w)
      C[M] || E(x, `unknown keyword: "${M}"`);
  }
  oe.checkUnknownRules = s;
  function i(x, w) {
    if (typeof x == "boolean")
      return !x;
    for (const S in x)
      if (w[S])
        return !0;
    return !1;
  }
  oe.schemaHasRules = i;
  function a(x, w) {
    if (typeof x == "boolean")
      return !x;
    for (const S in x)
      if (S !== "$ref" && w.all[S])
        return !0;
    return !1;
  }
  oe.schemaHasRulesButRef = a;
  function o({ topSchemaRef: x, schemaPath: w }, S, P, C) {
    if (!C) {
      if (typeof S == "number" || typeof S == "boolean")
        return S;
      if (typeof S == "string")
        return (0, e._)`${S}`;
    }
    return (0, e._)`${x}${w}${(0, e.getProperty)(P)}`;
  }
  oe.schemaRefOrVal = o;
  function c(x) {
    return f(decodeURIComponent(x));
  }
  oe.unescapeFragment = c;
  function l(x) {
    return encodeURIComponent(u(x));
  }
  oe.escapeFragment = l;
  function u(x) {
    return typeof x == "number" ? `${x}` : x.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  oe.escapeJsonPointer = u;
  function f(x) {
    return x.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  oe.unescapeJsonPointer = f;
  function d(x, w) {
    if (Array.isArray(x))
      for (const S of x)
        w(S);
    else
      w(x);
  }
  oe.eachItem = d;
  function b({ mergeNames: x, mergeToName: w, mergeValues: S, resultToName: P }) {
    return (C, M, L, G) => {
      const H = L === void 0 ? M : L instanceof e.Name ? (M instanceof e.Name ? x(C, M, L) : w(C, M, L), L) : M instanceof e.Name ? (w(C, L, M), M) : S(M, L);
      return G === e.Name && !(H instanceof e.Name) ? P(C, H) : H;
    };
  }
  oe.mergeEvaluated = {
    props: b({
      mergeNames: (x, w, S) => x.if((0, e._)`${S} !== true && ${w} !== undefined`, () => {
        x.if((0, e._)`${w} === true`, () => x.assign(S, !0), () => x.assign(S, (0, e._)`${S} || {}`).code((0, e._)`Object.assign(${S}, ${w})`));
      }),
      mergeToName: (x, w, S) => x.if((0, e._)`${S} !== true`, () => {
        w === !0 ? x.assign(S, !0) : (x.assign(S, (0, e._)`${S} || {}`), y(x, S, w));
      }),
      mergeValues: (x, w) => x === !0 ? !0 : { ...x, ...w },
      resultToName: v
    }),
    items: b({
      mergeNames: (x, w, S) => x.if((0, e._)`${S} !== true && ${w} !== undefined`, () => x.assign(S, (0, e._)`${w} === true ? true : ${S} > ${w} ? ${S} : ${w}`)),
      mergeToName: (x, w, S) => x.if((0, e._)`${S} !== true`, () => x.assign(S, w === !0 ? !0 : (0, e._)`${S} > ${w} ? ${S} : ${w}`)),
      mergeValues: (x, w) => x === !0 ? !0 : Math.max(x, w),
      resultToName: (x, w) => x.var("items", w)
    })
  };
  function v(x, w) {
    if (w === !0)
      return x.var("props", !0);
    const S = x.var("props", (0, e._)`{}`);
    return w !== void 0 && y(x, S, w), S;
  }
  oe.evaluatedPropsToName = v;
  function y(x, w, S) {
    Object.keys(S).forEach((P) => x.assign((0, e._)`${w}${(0, e.getProperty)(P)}`, !0));
  }
  oe.setEvaluated = y;
  const p = {};
  function h(x, w) {
    return x.scopeValue("func", {
      ref: w,
      code: p[w.code] || (p[w.code] = new t._Code(w.code))
    });
  }
  oe.useFunc = h;
  var m;
  (function(x) {
    x[x.Num = 0] = "Num", x[x.Str = 1] = "Str";
  })(m || (oe.Type = m = {}));
  function _(x, w, S) {
    if (x instanceof e.Name) {
      const P = w === m.Num;
      return S ? P ? (0, e._)`"[" + ${x} + "]"` : (0, e._)`"['" + ${x} + "']"` : P ? (0, e._)`"/" + ${x}` : (0, e._)`"/" + ${x}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return S ? (0, e.getProperty)(x).toString() : "/" + u(x);
  }
  oe.getErrorPath = _;
  function E(x, w, S = x.opts.strictSchema) {
    if (S) {
      if (w = `strict mode: ${w}`, S === !0)
        throw new Error(w);
      x.self.logger.warn(w);
    }
  }
  return oe.checkStrictMode = E, oe;
}
var fn = {}, ku;
function vt() {
  if (ku) return fn;
  ku = 1, Object.defineProperty(fn, "__esModule", { value: !0 });
  const e = ce(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return fn.default = t, fn;
}
var ju;
function Sa() {
  return ju || (ju = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = ce(), n = de(), r = vt();
    e.keywordError = {
      message: ({ keyword: p }) => (0, t.str)`must pass "${p}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: p, schemaType: h }) => h ? (0, t.str)`"${p}" keyword must be ${h} ($data)` : (0, t.str)`"${p}" keyword is invalid ($data)`
    };
    function s(p, h = e.keywordError, m, _) {
      const { it: E } = p, { gen: x, compositeRule: w, allErrors: S } = E, P = f(p, h, m);
      _ ?? (w || S) ? c(x, P) : l(E, (0, t._)`[${P}]`);
    }
    e.reportError = s;
    function i(p, h = e.keywordError, m) {
      const { it: _ } = p, { gen: E, compositeRule: x, allErrors: w } = _, S = f(p, h, m);
      c(E, S), x || w || l(_, r.default.vErrors);
    }
    e.reportExtraError = i;
    function a(p, h) {
      p.assign(r.default.errors, h), p.if((0, t._)`${r.default.vErrors} !== null`, () => p.if(h, () => p.assign((0, t._)`${r.default.vErrors}.length`, h), () => p.assign(r.default.vErrors, null)));
    }
    e.resetErrorsCount = a;
    function o({ gen: p, keyword: h, schemaValue: m, data: _, errsCount: E, it: x }) {
      if (E === void 0)
        throw new Error("ajv implementation error");
      const w = p.name("err");
      p.forRange("i", E, r.default.errors, (S) => {
        p.const(w, (0, t._)`${r.default.vErrors}[${S}]`), p.if((0, t._)`${w}.instancePath === undefined`, () => p.assign((0, t._)`${w}.instancePath`, (0, t.strConcat)(r.default.instancePath, x.errorPath))), p.assign((0, t._)`${w}.schemaPath`, (0, t.str)`${x.errSchemaPath}/${h}`), x.opts.verbose && (p.assign((0, t._)`${w}.schema`, m), p.assign((0, t._)`${w}.data`, _));
      });
    }
    e.extendErrors = o;
    function c(p, h) {
      const m = p.const("err", h);
      p.if((0, t._)`${r.default.vErrors} === null`, () => p.assign(r.default.vErrors, (0, t._)`[${m}]`), (0, t._)`${r.default.vErrors}.push(${m})`), p.code((0, t._)`${r.default.errors}++`);
    }
    function l(p, h) {
      const { gen: m, validateName: _, schemaEnv: E } = p;
      E.$async ? m.throw((0, t._)`new ${p.ValidationError}(${h})`) : (m.assign((0, t._)`${_}.errors`, h), m.return(!1));
    }
    const u = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function f(p, h, m) {
      const { createErrors: _ } = p.it;
      return _ === !1 ? (0, t._)`{}` : d(p, h, m);
    }
    function d(p, h, m = {}) {
      const { gen: _, it: E } = p, x = [
        b(E, m),
        v(p, m)
      ];
      return y(p, h, x), _.object(...x);
    }
    function b({ errorPath: p }, { instancePath: h }) {
      const m = h ? (0, t.str)`${p}${(0, n.getErrorPath)(h, n.Type.Str)}` : p;
      return [r.default.instancePath, (0, t.strConcat)(r.default.instancePath, m)];
    }
    function v({ keyword: p, it: { errSchemaPath: h } }, { schemaPath: m, parentSchema: _ }) {
      let E = _ ? h : (0, t.str)`${h}/${p}`;
      return m && (E = (0, t.str)`${E}${(0, n.getErrorPath)(m, n.Type.Str)}`), [u.schemaPath, E];
    }
    function y(p, { params: h, message: m }, _) {
      const { keyword: E, data: x, schemaValue: w, it: S } = p, { opts: P, propertyName: C, topSchemaRef: M, schemaPath: L } = S;
      _.push([u.keyword, E], [u.params, typeof h == "function" ? h(p) : h || (0, t._)`{}`]), P.messages && _.push([u.message, typeof m == "function" ? m(p) : m]), P.verbose && _.push([u.schema, w], [u.parentSchema, (0, t._)`${M}${L}`], [r.default.data, x]), C && _.push([u.propertyName, C]);
    }
  })(as)), as;
}
var Au;
function Sy() {
  if (Au) return Et;
  Au = 1, Object.defineProperty(Et, "__esModule", { value: !0 }), Et.boolOrEmptySchema = Et.topBoolOrEmptySchema = void 0;
  const e = Sa(), t = ce(), n = vt(), r = {
    message: "boolean schema is false"
  };
  function s(o) {
    const { gen: c, schema: l, validateName: u } = o;
    l === !1 ? a(o, !1) : typeof l == "object" && l.$async === !0 ? c.return(n.default.data) : (c.assign((0, t._)`${u}.errors`, null), c.return(!0));
  }
  Et.topBoolOrEmptySchema = s;
  function i(o, c) {
    const { gen: l, schema: u } = o;
    u === !1 ? (l.var(c, !1), a(o)) : l.var(c, !0);
  }
  Et.boolOrEmptySchema = i;
  function a(o, c) {
    const { gen: l, data: u } = o, f = {
      gen: l,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: o
    };
    (0, e.reportError)(f, r, void 0, c);
  }
  return Et;
}
var $e = {}, $t = {}, Iu;
function kf() {
  if (Iu) return $t;
  Iu = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.getRules = $t.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function n(s) {
    return typeof s == "string" && t.has(s);
  }
  $t.isJSONType = n;
  function r() {
    const s = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...s, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, s.number, s.string, s.array, s.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return $t.getRules = r, $t;
}
var nt = {}, Cu;
function jf() {
  if (Cu) return nt;
  Cu = 1, Object.defineProperty(nt, "__esModule", { value: !0 }), nt.shouldUseRule = nt.shouldUseGroup = nt.schemaHasRulesForType = void 0;
  function e({ schema: r, self: s }, i) {
    const a = s.RULES.types[i];
    return a && a !== !0 && t(r, a);
  }
  nt.schemaHasRulesForType = e;
  function t(r, s) {
    return s.rules.some((i) => n(r, i));
  }
  nt.shouldUseGroup = t;
  function n(r, s) {
    var i;
    return r[s.keyword] !== void 0 || ((i = s.definition.implements) === null || i === void 0 ? void 0 : i.some((a) => r[a] !== void 0));
  }
  return nt.shouldUseRule = n, nt;
}
var qu;
function fa() {
  if (qu) return $e;
  qu = 1, Object.defineProperty($e, "__esModule", { value: !0 }), $e.reportTypeError = $e.checkDataTypes = $e.checkDataType = $e.coerceAndCheckDataType = $e.getJSONTypes = $e.getSchemaTypes = $e.DataType = void 0;
  const e = kf(), t = jf(), n = Sa(), r = ce(), s = de();
  var i;
  (function(m) {
    m[m.Correct = 0] = "Correct", m[m.Wrong = 1] = "Wrong";
  })(i || ($e.DataType = i = {}));
  function a(m) {
    const _ = o(m.type);
    if (_.includes("null")) {
      if (m.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!_.length && m.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      m.nullable === !0 && _.push("null");
    }
    return _;
  }
  $e.getSchemaTypes = a;
  function o(m) {
    const _ = Array.isArray(m) ? m : m ? [m] : [];
    if (_.every(e.isJSONType))
      return _;
    throw new Error("type must be JSONType or JSONType[]: " + _.join(","));
  }
  $e.getJSONTypes = o;
  function c(m, _) {
    const { gen: E, data: x, opts: w } = m, S = u(_, w.coerceTypes), P = _.length > 0 && !(S.length === 0 && _.length === 1 && (0, t.schemaHasRulesForType)(m, _[0]));
    if (P) {
      const C = v(_, x, w.strictNumbers, i.Wrong);
      E.if(C, () => {
        S.length ? f(m, _, S) : p(m);
      });
    }
    return P;
  }
  $e.coerceAndCheckDataType = c;
  const l = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function u(m, _) {
    return _ ? m.filter((E) => l.has(E) || _ === "array" && E === "array") : [];
  }
  function f(m, _, E) {
    const { gen: x, data: w, opts: S } = m, P = x.let("dataType", (0, r._)`typeof ${w}`), C = x.let("coerced", (0, r._)`undefined`);
    S.coerceTypes === "array" && x.if((0, r._)`${P} == 'object' && Array.isArray(${w}) && ${w}.length == 1`, () => x.assign(w, (0, r._)`${w}[0]`).assign(P, (0, r._)`typeof ${w}`).if(v(_, w, S.strictNumbers), () => x.assign(C, w))), x.if((0, r._)`${C} !== undefined`);
    for (const L of E)
      (l.has(L) || L === "array" && S.coerceTypes === "array") && M(L);
    x.else(), p(m), x.endIf(), x.if((0, r._)`${C} !== undefined`, () => {
      x.assign(w, C), d(m, C);
    });
    function M(L) {
      switch (L) {
        case "string":
          x.elseIf((0, r._)`${P} == "number" || ${P} == "boolean"`).assign(C, (0, r._)`"" + ${w}`).elseIf((0, r._)`${w} === null`).assign(C, (0, r._)`""`);
          return;
        case "number":
          x.elseIf((0, r._)`${P} == "boolean" || ${w} === null
              || (${P} == "string" && ${w} && ${w} == +${w})`).assign(C, (0, r._)`+${w}`);
          return;
        case "integer":
          x.elseIf((0, r._)`${P} === "boolean" || ${w} === null
              || (${P} === "string" && ${w} && ${w} == +${w} && !(${w} % 1))`).assign(C, (0, r._)`+${w}`);
          return;
        case "boolean":
          x.elseIf((0, r._)`${w} === "false" || ${w} === 0 || ${w} === null`).assign(C, !1).elseIf((0, r._)`${w} === "true" || ${w} === 1`).assign(C, !0);
          return;
        case "null":
          x.elseIf((0, r._)`${w} === "" || ${w} === 0 || ${w} === false`), x.assign(C, null);
          return;
        case "array":
          x.elseIf((0, r._)`${P} === "string" || ${P} === "number"
              || ${P} === "boolean" || ${w} === null`).assign(C, (0, r._)`[${w}]`);
      }
    }
  }
  function d({ gen: m, parentData: _, parentDataProperty: E }, x) {
    m.if((0, r._)`${_} !== undefined`, () => m.assign((0, r._)`${_}[${E}]`, x));
  }
  function b(m, _, E, x = i.Correct) {
    const w = x === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let S;
    switch (m) {
      case "null":
        return (0, r._)`${_} ${w} null`;
      case "array":
        S = (0, r._)`Array.isArray(${_})`;
        break;
      case "object":
        S = (0, r._)`${_} && typeof ${_} == "object" && !Array.isArray(${_})`;
        break;
      case "integer":
        S = P((0, r._)`!(${_} % 1) && !isNaN(${_})`);
        break;
      case "number":
        S = P();
        break;
      default:
        return (0, r._)`typeof ${_} ${w} ${m}`;
    }
    return x === i.Correct ? S : (0, r.not)(S);
    function P(C = r.nil) {
      return (0, r.and)((0, r._)`typeof ${_} == "number"`, C, E ? (0, r._)`isFinite(${_})` : r.nil);
    }
  }
  $e.checkDataType = b;
  function v(m, _, E, x) {
    if (m.length === 1)
      return b(m[0], _, E, x);
    let w;
    const S = (0, s.toHash)(m);
    if (S.array && S.object) {
      const P = (0, r._)`typeof ${_} != "object"`;
      w = S.null ? P : (0, r._)`!${_} || ${P}`, delete S.null, delete S.array, delete S.object;
    } else
      w = r.nil;
    S.number && delete S.integer;
    for (const P in S)
      w = (0, r.and)(w, b(P, _, E, x));
    return w;
  }
  $e.checkDataTypes = v;
  const y = {
    message: ({ schema: m }) => `must be ${m}`,
    params: ({ schema: m, schemaValue: _ }) => typeof m == "string" ? (0, r._)`{type: ${m}}` : (0, r._)`{type: ${_}}`
  };
  function p(m) {
    const _ = h(m);
    (0, n.reportError)(_, y);
  }
  $e.reportTypeError = p;
  function h(m) {
    const { gen: _, data: E, schema: x } = m, w = (0, s.schemaRefOrVal)(m, x, "type");
    return {
      gen: _,
      keyword: "type",
      data: E,
      schema: x.type,
      schemaCode: w,
      schemaValue: w,
      parentSchema: x,
      params: {},
      it: m
    };
  }
  return $e;
}
var er = {}, Lu;
function Ry() {
  if (Lu) return er;
  Lu = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.assignDefaults = void 0;
  const e = ce(), t = de();
  function n(s, i) {
    const { properties: a, items: o } = s.schema;
    if (i === "object" && a)
      for (const c in a)
        r(s, c, a[c].default);
    else i === "array" && Array.isArray(o) && o.forEach((c, l) => r(s, l, c.default));
  }
  er.assignDefaults = n;
  function r(s, i, a) {
    const { gen: o, compositeRule: c, data: l, opts: u } = s;
    if (a === void 0)
      return;
    const f = (0, e._)`${l}${(0, e.getProperty)(i)}`;
    if (c) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${f}`);
      return;
    }
    let d = (0, e._)`${f} === undefined`;
    u.useDefaults === "empty" && (d = (0, e._)`${d} || ${f} === null || ${f} === ""`), o.if(d, (0, e._)`${f} = ${(0, e.stringify)(a)}`);
  }
  return er;
}
var Be = {}, ye = {}, Du;
function Ke() {
  if (Du) return ye;
  Du = 1, Object.defineProperty(ye, "__esModule", { value: !0 }), ye.validateUnion = ye.validateArray = ye.usePattern = ye.callValidateCode = ye.schemaProperties = ye.allSchemaProperties = ye.noPropertyInData = ye.propertyInData = ye.isOwnProperty = ye.hasPropFunc = ye.reportMissingProp = ye.checkMissingProp = ye.checkReportMissingProp = void 0;
  const e = ce(), t = de(), n = vt(), r = de();
  function s(m, _) {
    const { gen: E, data: x, it: w } = m;
    E.if(u(E, x, _, w.opts.ownProperties), () => {
      m.setParams({ missingProperty: (0, e._)`${_}` }, !0), m.error();
    });
  }
  ye.checkReportMissingProp = s;
  function i({ gen: m, data: _, it: { opts: E } }, x, w) {
    return (0, e.or)(...x.map((S) => (0, e.and)(u(m, _, S, E.ownProperties), (0, e._)`${w} = ${S}`)));
  }
  ye.checkMissingProp = i;
  function a(m, _) {
    m.setParams({ missingProperty: _ }, !0), m.error();
  }
  ye.reportMissingProp = a;
  function o(m) {
    return m.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  ye.hasPropFunc = o;
  function c(m, _, E) {
    return (0, e._)`${o(m)}.call(${_}, ${E})`;
  }
  ye.isOwnProperty = c;
  function l(m, _, E, x) {
    const w = (0, e._)`${_}${(0, e.getProperty)(E)} !== undefined`;
    return x ? (0, e._)`${w} && ${c(m, _, E)}` : w;
  }
  ye.propertyInData = l;
  function u(m, _, E, x) {
    const w = (0, e._)`${_}${(0, e.getProperty)(E)} === undefined`;
    return x ? (0, e.or)(w, (0, e.not)(c(m, _, E))) : w;
  }
  ye.noPropertyInData = u;
  function f(m) {
    return m ? Object.keys(m).filter((_) => _ !== "__proto__") : [];
  }
  ye.allSchemaProperties = f;
  function d(m, _) {
    return f(_).filter((E) => !(0, t.alwaysValidSchema)(m, _[E]));
  }
  ye.schemaProperties = d;
  function b({ schemaCode: m, data: _, it: { gen: E, topSchemaRef: x, schemaPath: w, errorPath: S }, it: P }, C, M, L) {
    const G = L ? (0, e._)`${m}, ${_}, ${x}${w}` : _, H = [
      [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, S)],
      [n.default.parentData, P.parentData],
      [n.default.parentDataProperty, P.parentDataProperty],
      [n.default.rootData, n.default.rootData]
    ];
    P.opts.dynamicRef && H.push([n.default.dynamicAnchors, n.default.dynamicAnchors]);
    const F = (0, e._)`${G}, ${E.object(...H)}`;
    return M !== e.nil ? (0, e._)`${C}.call(${M}, ${F})` : (0, e._)`${C}(${F})`;
  }
  ye.callValidateCode = b;
  const v = (0, e._)`new RegExp`;
  function y({ gen: m, it: { opts: _ } }, E) {
    const x = _.unicodeRegExp ? "u" : "", { regExp: w } = _.code, S = w(E, x);
    return m.scopeValue("pattern", {
      key: S.toString(),
      ref: S,
      code: (0, e._)`${w.code === "new RegExp" ? v : (0, r.useFunc)(m, w)}(${E}, ${x})`
    });
  }
  ye.usePattern = y;
  function p(m) {
    const { gen: _, data: E, keyword: x, it: w } = m, S = _.name("valid");
    if (w.allErrors) {
      const C = _.let("valid", !0);
      return P(() => _.assign(C, !1)), C;
    }
    return _.var(S, !0), P(() => _.break()), S;
    function P(C) {
      const M = _.const("len", (0, e._)`${E}.length`);
      _.forRange("i", 0, M, (L) => {
        m.subschema({
          keyword: x,
          dataProp: L,
          dataPropType: t.Type.Num
        }, S), _.if((0, e.not)(S), C);
      });
    }
  }
  ye.validateArray = p;
  function h(m) {
    const { gen: _, schema: E, keyword: x, it: w } = m;
    if (!Array.isArray(E))
      throw new Error("ajv implementation error");
    if (E.some((M) => (0, t.alwaysValidSchema)(w, M)) && !w.opts.unevaluated)
      return;
    const P = _.let("valid", !1), C = _.name("_valid");
    _.block(() => E.forEach((M, L) => {
      const G = m.subschema({
        keyword: x,
        schemaProp: L,
        compositeRule: !0
      }, C);
      _.assign(P, (0, e._)`${P} || ${C}`), m.mergeValidEvaluated(G, C) || _.if((0, e.not)(P));
    })), m.result(P, () => m.reset(), () => m.error(!0));
  }
  return ye.validateUnion = h, ye;
}
var Fu;
function Ty() {
  if (Fu) return Be;
  Fu = 1, Object.defineProperty(Be, "__esModule", { value: !0 }), Be.validateKeywordUsage = Be.validSchemaType = Be.funcKeywordCode = Be.macroKeywordCode = void 0;
  const e = ce(), t = vt(), n = Ke(), r = Sa();
  function s(d, b) {
    const { gen: v, keyword: y, schema: p, parentSchema: h, it: m } = d, _ = b.macro.call(m.self, p, h, m), E = l(v, y, _);
    m.opts.validateSchema !== !1 && m.self.validateSchema(_, !0);
    const x = v.name("valid");
    d.subschema({
      schema: _,
      schemaPath: e.nil,
      errSchemaPath: `${m.errSchemaPath}/${y}`,
      topSchemaRef: E,
      compositeRule: !0
    }, x), d.pass(x, () => d.error(!0));
  }
  Be.macroKeywordCode = s;
  function i(d, b) {
    var v;
    const { gen: y, keyword: p, schema: h, parentSchema: m, $data: _, it: E } = d;
    c(E, b);
    const x = !_ && b.compile ? b.compile.call(E.self, h, m, E) : b.validate, w = l(y, p, x), S = y.let("valid");
    d.block$data(S, P), d.ok((v = b.valid) !== null && v !== void 0 ? v : S);
    function P() {
      if (b.errors === !1)
        L(), b.modifying && a(d), G(() => d.error());
      else {
        const H = b.async ? C() : M();
        b.modifying && a(d), G(() => o(d, H));
      }
    }
    function C() {
      const H = y.let("ruleErrs", null);
      return y.try(() => L((0, e._)`await `), (F) => y.assign(S, !1).if((0, e._)`${F} instanceof ${E.ValidationError}`, () => y.assign(H, (0, e._)`${F}.errors`), () => y.throw(F))), H;
    }
    function M() {
      const H = (0, e._)`${w}.errors`;
      return y.assign(H, null), L(e.nil), H;
    }
    function L(H = b.async ? (0, e._)`await ` : e.nil) {
      const F = E.opts.passContext ? t.default.this : t.default.self, K = !("compile" in b && !_ || b.schema === !1);
      y.assign(S, (0, e._)`${H}${(0, n.callValidateCode)(d, w, F, K)}`, b.modifying);
    }
    function G(H) {
      var F;
      y.if((0, e.not)((F = b.valid) !== null && F !== void 0 ? F : S), H);
    }
  }
  Be.funcKeywordCode = i;
  function a(d) {
    const { gen: b, data: v, it: y } = d;
    b.if(y.parentData, () => b.assign(v, (0, e._)`${y.parentData}[${y.parentDataProperty}]`));
  }
  function o(d, b) {
    const { gen: v } = d;
    v.if((0, e._)`Array.isArray(${b})`, () => {
      v.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${b} : ${t.default.vErrors}.concat(${b})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, r.extendErrors)(d);
    }, () => d.error());
  }
  function c({ schemaEnv: d }, b) {
    if (b.async && !d.$async)
      throw new Error("async keyword in sync schema");
  }
  function l(d, b, v) {
    if (v === void 0)
      throw new Error(`keyword "${b}" failed to compile`);
    return d.scopeValue("keyword", typeof v == "function" ? { ref: v } : { ref: v, code: (0, e.stringify)(v) });
  }
  function u(d, b, v = !1) {
    return !b.length || b.some((y) => y === "array" ? Array.isArray(d) : y === "object" ? d && typeof d == "object" && !Array.isArray(d) : typeof d == y || v && typeof d > "u");
  }
  Be.validSchemaType = u;
  function f({ schema: d, opts: b, self: v, errSchemaPath: y }, p, h) {
    if (Array.isArray(p.keyword) ? !p.keyword.includes(h) : p.keyword !== h)
      throw new Error("ajv implementation error");
    const m = p.dependencies;
    if (m?.some((_) => !Object.prototype.hasOwnProperty.call(d, _)))
      throw new Error(`parent schema must have dependencies of ${h}: ${m.join(",")}`);
    if (p.validateSchema && !p.validateSchema(d[h])) {
      const E = `keyword "${h}" value is invalid at path "${y}": ` + v.errorsText(p.validateSchema.errors);
      if (b.validateSchema === "log")
        v.logger.error(E);
      else
        throw new Error(E);
    }
  }
  return Be.validateKeywordUsage = f, Be;
}
var at = {}, Mu;
function Py() {
  if (Mu) return at;
  Mu = 1, Object.defineProperty(at, "__esModule", { value: !0 }), at.extendSubschemaMode = at.extendSubschemaData = at.getSubschema = void 0;
  const e = ce(), t = de();
  function n(i, { keyword: a, schemaProp: o, schema: c, schemaPath: l, errSchemaPath: u, topSchemaRef: f }) {
    if (a !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (a !== void 0) {
      const d = i.schema[a];
      return o === void 0 ? {
        schema: d,
        schemaPath: (0, e._)`${i.schemaPath}${(0, e.getProperty)(a)}`,
        errSchemaPath: `${i.errSchemaPath}/${a}`
      } : {
        schema: d[o],
        schemaPath: (0, e._)`${i.schemaPath}${(0, e.getProperty)(a)}${(0, e.getProperty)(o)}`,
        errSchemaPath: `${i.errSchemaPath}/${a}/${(0, t.escapeFragment)(o)}`
      };
    }
    if (c !== void 0) {
      if (l === void 0 || u === void 0 || f === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: l,
        topSchemaRef: f,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  at.getSubschema = n;
  function r(i, a, { dataProp: o, dataPropType: c, data: l, dataTypes: u, propertyName: f }) {
    if (l !== void 0 && o !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: d } = a;
    if (o !== void 0) {
      const { errorPath: v, dataPathArr: y, opts: p } = a, h = d.let("data", (0, e._)`${a.data}${(0, e.getProperty)(o)}`, !0);
      b(h), i.errorPath = (0, e.str)`${v}${(0, t.getErrorPath)(o, c, p.jsPropertySyntax)}`, i.parentDataProperty = (0, e._)`${o}`, i.dataPathArr = [...y, i.parentDataProperty];
    }
    if (l !== void 0) {
      const v = l instanceof e.Name ? l : d.let("data", l, !0);
      b(v), f !== void 0 && (i.propertyName = f);
    }
    u && (i.dataTypes = u);
    function b(v) {
      i.data = v, i.dataLevel = a.dataLevel + 1, i.dataTypes = [], a.definedProperties = /* @__PURE__ */ new Set(), i.parentData = a.data, i.dataNames = [...a.dataNames, v];
    }
  }
  at.extendSubschemaData = r;
  function s(i, { jtdDiscriminator: a, jtdMetadata: o, compositeRule: c, createErrors: l, allErrors: u }) {
    c !== void 0 && (i.compositeRule = c), l !== void 0 && (i.createErrors = l), u !== void 0 && (i.allErrors = u), i.jtdDiscriminator = a, i.jtdMetadata = o;
  }
  return at.extendSubschemaMode = s, at;
}
var je = {}, cs = { exports: {} }, Uu;
function Oy() {
  if (Uu) return cs.exports;
  Uu = 1;
  var e = cs.exports = function(r, s, i) {
    typeof s == "function" && (i = s, s = {}), i = s.cb || i;
    var a = typeof i == "function" ? i : i.pre || function() {
    }, o = i.post || function() {
    };
    t(s, a, o, r, "", r);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(r, s, i, a, o, c, l, u, f, d) {
    if (a && typeof a == "object" && !Array.isArray(a)) {
      s(a, o, c, l, u, f, d);
      for (var b in a) {
        var v = a[b];
        if (Array.isArray(v)) {
          if (b in e.arrayKeywords)
            for (var y = 0; y < v.length; y++)
              t(r, s, i, v[y], o + "/" + b + "/" + y, c, o, b, a, y);
        } else if (b in e.propsKeywords) {
          if (v && typeof v == "object")
            for (var p in v)
              t(r, s, i, v[p], o + "/" + b + "/" + n(p), c, o, b, a, p);
        } else (b in e.keywords || r.allKeys && !(b in e.skipKeywords)) && t(r, s, i, v, o + "/" + b, c, o, b, a);
      }
      i(a, o, c, l, u, f, d);
    }
  }
  function n(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return cs.exports;
}
var zu;
function Ra() {
  if (zu) return je;
  zu = 1, Object.defineProperty(je, "__esModule", { value: !0 }), je.getSchemaRefs = je.resolveUrl = je.normalizeId = je._getFullPath = je.getFullPath = je.inlineRef = void 0;
  const e = de(), t = _a(), n = Oy(), r = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function s(y, p = !0) {
    return typeof y == "boolean" ? !0 : p === !0 ? !a(y) : p ? o(y) <= p : !1;
  }
  je.inlineRef = s;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function a(y) {
    for (const p in y) {
      if (i.has(p))
        return !0;
      const h = y[p];
      if (Array.isArray(h) && h.some(a) || typeof h == "object" && a(h))
        return !0;
    }
    return !1;
  }
  function o(y) {
    let p = 0;
    for (const h in y) {
      if (h === "$ref")
        return 1 / 0;
      if (p++, !r.has(h) && (typeof y[h] == "object" && (0, e.eachItem)(y[h], (m) => p += o(m)), p === 1 / 0))
        return 1 / 0;
    }
    return p;
  }
  function c(y, p = "", h) {
    h !== !1 && (p = f(p));
    const m = y.parse(p);
    return l(y, m);
  }
  je.getFullPath = c;
  function l(y, p) {
    return y.serialize(p).split("#")[0] + "#";
  }
  je._getFullPath = l;
  const u = /#\/?$/;
  function f(y) {
    return y ? y.replace(u, "") : "";
  }
  je.normalizeId = f;
  function d(y, p, h) {
    return h = f(h), y.resolve(p, h);
  }
  je.resolveUrl = d;
  const b = /^[a-z_][-a-z0-9._]*$/i;
  function v(y, p) {
    if (typeof y == "boolean")
      return {};
    const { schemaId: h, uriResolver: m } = this.opts, _ = f(y[h] || p), E = { "": _ }, x = c(m, _, !1), w = {}, S = /* @__PURE__ */ new Set();
    return n(y, { allKeys: !0 }, (M, L, G, H) => {
      if (H === void 0)
        return;
      const F = x + L;
      let K = E[H];
      typeof M[h] == "string" && (K = q.call(this, M[h])), U.call(this, M.$anchor), U.call(this, M.$dynamicAnchor), E[L] = K;
      function q(D) {
        const J = this.opts.uriResolver.resolve;
        if (D = f(K ? J(K, D) : D), S.has(D))
          throw C(D);
        S.add(D);
        let A = this.refs[D];
        return typeof A == "string" && (A = this.refs[A]), typeof A == "object" ? P(M, A.schema, D) : D !== f(F) && (D[0] === "#" ? (P(M, w[D], D), w[D] = M) : this.refs[D] = F), D;
      }
      function U(D) {
        if (typeof D == "string") {
          if (!b.test(D))
            throw new Error(`invalid anchor "${D}"`);
          q.call(this, `#${D}`);
        }
      }
    }), w;
    function P(M, L, G) {
      if (L !== void 0 && !t(M, L))
        throw C(G);
    }
    function C(M) {
      return new Error(`reference "${M}" resolves to more than one schema`);
    }
  }
  return je.getSchemaRefs = v, je;
}
var Vu;
function Ta() {
  if (Vu) return rt;
  Vu = 1, Object.defineProperty(rt, "__esModule", { value: !0 }), rt.getData = rt.KeywordCxt = rt.validateFunctionCode = void 0;
  const e = Sy(), t = fa(), n = jf(), r = fa(), s = Ry(), i = Ty(), a = Py(), o = ce(), c = vt(), l = Ra(), u = de(), f = Sa();
  function d(T) {
    if (x(T) && (S(T), E(T))) {
      p(T);
      return;
    }
    b(T, () => (0, e.topBoolOrEmptySchema)(T));
  }
  rt.validateFunctionCode = d;
  function b({ gen: T, validateName: N, schema: I, schemaEnv: z, opts: X }, Q) {
    X.code.es5 ? T.func(N, (0, o._)`${c.default.data}, ${c.default.valCxt}`, z.$async, () => {
      T.code((0, o._)`"use strict"; ${m(I, X)}`), y(T, X), T.code(Q);
    }) : T.func(N, (0, o._)`${c.default.data}, ${v(X)}`, z.$async, () => T.code(m(I, X)).code(Q));
  }
  function v(T) {
    return (0, o._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${T.dynamicRef ? (0, o._)`, ${c.default.dynamicAnchors}={}` : o.nil}}={}`;
  }
  function y(T, N) {
    T.if(c.default.valCxt, () => {
      T.var(c.default.instancePath, (0, o._)`${c.default.valCxt}.${c.default.instancePath}`), T.var(c.default.parentData, (0, o._)`${c.default.valCxt}.${c.default.parentData}`), T.var(c.default.parentDataProperty, (0, o._)`${c.default.valCxt}.${c.default.parentDataProperty}`), T.var(c.default.rootData, (0, o._)`${c.default.valCxt}.${c.default.rootData}`), N.dynamicRef && T.var(c.default.dynamicAnchors, (0, o._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      T.var(c.default.instancePath, (0, o._)`""`), T.var(c.default.parentData, (0, o._)`undefined`), T.var(c.default.parentDataProperty, (0, o._)`undefined`), T.var(c.default.rootData, c.default.data), N.dynamicRef && T.var(c.default.dynamicAnchors, (0, o._)`{}`);
    });
  }
  function p(T) {
    const { schema: N, opts: I, gen: z } = T;
    b(T, () => {
      I.$comment && N.$comment && H(T), M(T), z.let(c.default.vErrors, null), z.let(c.default.errors, 0), I.unevaluated && h(T), P(T), F(T);
    });
  }
  function h(T) {
    const { gen: N, validateName: I } = T;
    T.evaluated = N.const("evaluated", (0, o._)`${I}.evaluated`), N.if((0, o._)`${T.evaluated}.dynamicProps`, () => N.assign((0, o._)`${T.evaluated}.props`, (0, o._)`undefined`)), N.if((0, o._)`${T.evaluated}.dynamicItems`, () => N.assign((0, o._)`${T.evaluated}.items`, (0, o._)`undefined`));
  }
  function m(T, N) {
    const I = typeof T == "object" && T[N.schemaId];
    return I && (N.code.source || N.code.process) ? (0, o._)`/*# sourceURL=${I} */` : o.nil;
  }
  function _(T, N) {
    if (x(T) && (S(T), E(T))) {
      w(T, N);
      return;
    }
    (0, e.boolOrEmptySchema)(T, N);
  }
  function E({ schema: T, self: N }) {
    if (typeof T == "boolean")
      return !T;
    for (const I in T)
      if (N.RULES.all[I])
        return !0;
    return !1;
  }
  function x(T) {
    return typeof T.schema != "boolean";
  }
  function w(T, N) {
    const { schema: I, gen: z, opts: X } = T;
    X.$comment && I.$comment && H(T), L(T), G(T);
    const Q = z.const("_errs", c.default.errors);
    P(T, Q), z.var(N, (0, o._)`${Q} === ${c.default.errors}`);
  }
  function S(T) {
    (0, u.checkUnknownRules)(T), C(T);
  }
  function P(T, N) {
    if (T.opts.jtd)
      return q(T, [], !1, N);
    const I = (0, t.getSchemaTypes)(T.schema), z = (0, t.coerceAndCheckDataType)(T, I);
    q(T, I, !z, N);
  }
  function C(T) {
    const { schema: N, errSchemaPath: I, opts: z, self: X } = T;
    N.$ref && z.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(N, X.RULES) && X.logger.warn(`$ref: keywords ignored in schema at path "${I}"`);
  }
  function M(T) {
    const { schema: N, opts: I } = T;
    N.default !== void 0 && I.useDefaults && I.strictSchema && (0, u.checkStrictMode)(T, "default is ignored in the schema root");
  }
  function L(T) {
    const N = T.schema[T.opts.schemaId];
    N && (T.baseId = (0, l.resolveUrl)(T.opts.uriResolver, T.baseId, N));
  }
  function G(T) {
    if (T.schema.$async && !T.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function H({ gen: T, schemaEnv: N, schema: I, errSchemaPath: z, opts: X }) {
    const Q = I.$comment;
    if (X.$comment === !0)
      T.code((0, o._)`${c.default.self}.logger.log(${Q})`);
    else if (typeof X.$comment == "function") {
      const re = (0, o.str)`${z}/$comment`, he = T.scopeValue("root", { ref: N.root });
      T.code((0, o._)`${c.default.self}.opts.$comment(${Q}, ${re}, ${he}.schema)`);
    }
  }
  function F(T) {
    const { gen: N, schemaEnv: I, validateName: z, ValidationError: X, opts: Q } = T;
    I.$async ? N.if((0, o._)`${c.default.errors} === 0`, () => N.return(c.default.data), () => N.throw((0, o._)`new ${X}(${c.default.vErrors})`)) : (N.assign((0, o._)`${z}.errors`, c.default.vErrors), Q.unevaluated && K(T), N.return((0, o._)`${c.default.errors} === 0`));
  }
  function K({ gen: T, evaluated: N, props: I, items: z }) {
    I instanceof o.Name && T.assign((0, o._)`${N}.props`, I), z instanceof o.Name && T.assign((0, o._)`${N}.items`, z);
  }
  function q(T, N, I, z) {
    const { gen: X, schema: Q, data: re, allErrors: he, opts: pe, self: le } = T, { RULES: ne } = le;
    if (Q.$ref && (pe.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(Q, ne))) {
      X.block(() => B(T, "$ref", ne.all.$ref.definition));
      return;
    }
    pe.jtd || D(T, N), X.block(() => {
      for (const me of ne.rules)
        we(me);
      we(ne.post);
    });
    function we(me) {
      (0, n.shouldUseGroup)(Q, me) && (me.type ? (X.if((0, r.checkDataType)(me.type, re, pe.strictNumbers)), U(T, me), N.length === 1 && N[0] === me.type && I && (X.else(), (0, r.reportTypeError)(T)), X.endIf()) : U(T, me), he || X.if((0, o._)`${c.default.errors} === ${z || 0}`));
    }
  }
  function U(T, N) {
    const { gen: I, schema: z, opts: { useDefaults: X } } = T;
    X && (0, s.assignDefaults)(T, N.type), I.block(() => {
      for (const Q of N.rules)
        (0, n.shouldUseRule)(z, Q) && B(T, Q.keyword, Q.definition, N.type);
    });
  }
  function D(T, N) {
    T.schemaEnv.meta || !T.opts.strictTypes || (J(T, N), T.opts.allowUnionTypes || A(T, N), R(T, T.dataTypes));
  }
  function J(T, N) {
    if (N.length) {
      if (!T.dataTypes.length) {
        T.dataTypes = N;
        return;
      }
      N.forEach((I) => {
        O(T.dataTypes, I) || $(T, `type "${I}" not allowed by context "${T.dataTypes.join(",")}"`);
      }), g(T, N);
    }
  }
  function A(T, N) {
    N.length > 1 && !(N.length === 2 && N.includes("null")) && $(T, "use allowUnionTypes to allow union type keyword");
  }
  function R(T, N) {
    const I = T.self.RULES.all;
    for (const z in I) {
      const X = I[z];
      if (typeof X == "object" && (0, n.shouldUseRule)(T.schema, X)) {
        const { type: Q } = X.definition;
        Q.length && !Q.some((re) => j(N, re)) && $(T, `missing type "${Q.join(",")}" for keyword "${z}"`);
      }
    }
  }
  function j(T, N) {
    return T.includes(N) || N === "number" && T.includes("integer");
  }
  function O(T, N) {
    return T.includes(N) || N === "integer" && T.includes("number");
  }
  function g(T, N) {
    const I = [];
    for (const z of T.dataTypes)
      O(N, z) ? I.push(z) : N.includes("integer") && z === "number" && I.push("integer");
    T.dataTypes = I;
  }
  function $(T, N) {
    const I = T.schemaEnv.baseId + T.errSchemaPath;
    N += ` at "${I}" (strictTypes)`, (0, u.checkStrictMode)(T, N, T.opts.strictTypes);
  }
  class k {
    constructor(N, I, z) {
      if ((0, i.validateKeywordUsage)(N, I, z), this.gen = N.gen, this.allErrors = N.allErrors, this.keyword = z, this.data = N.data, this.schema = N.schema[z], this.$data = I.$data && N.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(N, this.schema, z, this.$data), this.schemaType = I.schemaType, this.parentSchema = N.schema, this.params = {}, this.it = N, this.def = I, this.$data)
        this.schemaCode = N.gen.const("vSchema", Y(this.$data, N));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, I.schemaType, I.allowUndefined))
        throw new Error(`${z} value must be ${JSON.stringify(I.schemaType)}`);
      ("code" in I ? I.trackErrors : I.errors !== !1) && (this.errsCount = N.gen.const("_errs", c.default.errors));
    }
    result(N, I, z) {
      this.failResult((0, o.not)(N), I, z);
    }
    failResult(N, I, z) {
      this.gen.if(N), z ? z() : this.error(), I ? (this.gen.else(), I(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(N, I) {
      this.failResult((0, o.not)(N), void 0, I);
    }
    fail(N) {
      if (N === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(N), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(N) {
      if (!this.$data)
        return this.fail(N);
      const { schemaCode: I } = this;
      this.fail((0, o._)`${I} !== undefined && (${(0, o.or)(this.invalid$data(), N)})`);
    }
    error(N, I, z) {
      if (I) {
        this.setParams(I), this._error(N, z), this.setParams({});
        return;
      }
      this._error(N, z);
    }
    _error(N, I) {
      (N ? f.reportExtraError : f.reportError)(this, this.def.error, I);
    }
    $dataError() {
      (0, f.reportError)(this, this.def.$dataError || f.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, f.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(N) {
      this.allErrors || this.gen.if(N);
    }
    setParams(N, I) {
      I ? Object.assign(this.params, N) : this.params = N;
    }
    block$data(N, I, z = o.nil) {
      this.gen.block(() => {
        this.check$data(N, z), I();
      });
    }
    check$data(N = o.nil, I = o.nil) {
      if (!this.$data)
        return;
      const { gen: z, schemaCode: X, schemaType: Q, def: re } = this;
      z.if((0, o.or)((0, o._)`${X} === undefined`, I)), N !== o.nil && z.assign(N, !0), (Q.length || re.validateSchema) && (z.elseIf(this.invalid$data()), this.$dataError(), N !== o.nil && z.assign(N, !1)), z.else();
    }
    invalid$data() {
      const { gen: N, schemaCode: I, schemaType: z, def: X, it: Q } = this;
      return (0, o.or)(re(), he());
      function re() {
        if (z.length) {
          if (!(I instanceof o.Name))
            throw new Error("ajv implementation error");
          const pe = Array.isArray(z) ? z : [z];
          return (0, o._)`${(0, r.checkDataTypes)(pe, I, Q.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return o.nil;
      }
      function he() {
        if (X.validateSchema) {
          const pe = N.scopeValue("validate$data", { ref: X.validateSchema });
          return (0, o._)`!${pe}(${I})`;
        }
        return o.nil;
      }
    }
    subschema(N, I) {
      const z = (0, a.getSubschema)(this.it, N);
      (0, a.extendSubschemaData)(z, this.it, N), (0, a.extendSubschemaMode)(z, N);
      const X = { ...this.it, ...z, items: void 0, props: void 0 };
      return _(X, I), X;
    }
    mergeEvaluated(N, I) {
      const { it: z, gen: X } = this;
      z.opts.unevaluated && (z.props !== !0 && N.props !== void 0 && (z.props = u.mergeEvaluated.props(X, N.props, z.props, I)), z.items !== !0 && N.items !== void 0 && (z.items = u.mergeEvaluated.items(X, N.items, z.items, I)));
    }
    mergeValidEvaluated(N, I) {
      const { it: z, gen: X } = this;
      if (z.opts.unevaluated && (z.props !== !0 || z.items !== !0))
        return X.if(I, () => this.mergeEvaluated(N, o.Name)), !0;
    }
  }
  rt.KeywordCxt = k;
  function B(T, N, I, z) {
    const X = new k(T, I, N);
    "code" in I ? I.code(X, z) : X.$data && I.validate ? (0, i.funcKeywordCode)(X, I) : "macro" in I ? (0, i.macroKeywordCode)(X, I) : (I.compile || I.validate) && (0, i.funcKeywordCode)(X, I);
  }
  const W = /^\/(?:[^~]|~0|~1)*$/, Z = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function Y(T, { dataLevel: N, dataNames: I, dataPathArr: z }) {
    let X, Q;
    if (T === "")
      return c.default.rootData;
    if (T[0] === "/") {
      if (!W.test(T))
        throw new Error(`Invalid JSON-pointer: ${T}`);
      X = T, Q = c.default.rootData;
    } else {
      const le = Z.exec(T);
      if (!le)
        throw new Error(`Invalid JSON-pointer: ${T}`);
      const ne = +le[1];
      if (X = le[2], X === "#") {
        if (ne >= N)
          throw new Error(pe("property/index", ne));
        return z[N - ne];
      }
      if (ne > N)
        throw new Error(pe("data", ne));
      if (Q = I[N - ne], !X)
        return Q;
    }
    let re = Q;
    const he = X.split("/");
    for (const le of he)
      le && (Q = (0, o._)`${Q}${(0, o.getProperty)((0, u.unescapeJsonPointer)(le))}`, re = (0, o._)`${re} && ${Q}`);
    return re;
    function pe(le, ne) {
      return `Cannot access ${le} ${ne} levels up, current level is ${N}`;
    }
  }
  return rt.getData = Y, rt;
}
var mn = {}, Bu;
function Ro() {
  if (Bu) return mn;
  Bu = 1, Object.defineProperty(mn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(n) {
      super("validation failed"), this.errors = n, this.ajv = this.validation = !0;
    }
  }
  return mn.default = e, mn;
}
var hn = {}, Gu;
function Pa() {
  if (Gu) return hn;
  Gu = 1, Object.defineProperty(hn, "__esModule", { value: !0 });
  const e = Ra();
  class t extends Error {
    constructor(r, s, i, a) {
      super(a || `can't resolve reference ${i} from id ${s}`), this.missingRef = (0, e.resolveUrl)(r, s, i), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(r, this.missingRef));
    }
  }
  return hn.default = t, hn;
}
var Fe = {}, Hu;
function To() {
  if (Hu) return Fe;
  Hu = 1, Object.defineProperty(Fe, "__esModule", { value: !0 }), Fe.resolveSchema = Fe.getCompilingSchema = Fe.resolveRef = Fe.compileSchema = Fe.SchemaEnv = void 0;
  const e = ce(), t = Ro(), n = vt(), r = Ra(), s = de(), i = Ta();
  class a {
    constructor(h) {
      var m;
      this.refs = {}, this.dynamicAnchors = {};
      let _;
      typeof h.schema == "object" && (_ = h.schema), this.schema = h.schema, this.schemaId = h.schemaId, this.root = h.root || this, this.baseId = (m = h.baseId) !== null && m !== void 0 ? m : (0, r.normalizeId)(_?.[h.schemaId || "$id"]), this.schemaPath = h.schemaPath, this.localRefs = h.localRefs, this.meta = h.meta, this.$async = _?.$async, this.refs = {};
    }
  }
  Fe.SchemaEnv = a;
  function o(p) {
    const h = u.call(this, p);
    if (h)
      return h;
    const m = (0, r.getFullPath)(this.opts.uriResolver, p.root.baseId), { es5: _, lines: E } = this.opts.code, { ownProperties: x } = this.opts, w = new e.CodeGen(this.scope, { es5: _, lines: E, ownProperties: x });
    let S;
    p.$async && (S = w.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const P = w.scopeName("validate");
    p.validateName = P;
    const C = {
      gen: w,
      allErrors: this.opts.allErrors,
      data: n.default.data,
      parentData: n.default.parentData,
      parentDataProperty: n.default.parentDataProperty,
      dataNames: [n.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: w.scopeValue("schema", this.opts.code.source === !0 ? { ref: p.schema, code: (0, e.stringify)(p.schema) } : { ref: p.schema }),
      validateName: P,
      ValidationError: S,
      schema: p.schema,
      schemaEnv: p,
      rootId: m,
      baseId: p.baseId || m,
      schemaPath: e.nil,
      errSchemaPath: p.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let M;
    try {
      this._compilations.add(p), (0, i.validateFunctionCode)(C), w.optimize(this.opts.code.optimize);
      const L = w.toString();
      M = `${w.scopeRefs(n.default.scope)}return ${L}`, this.opts.code.process && (M = this.opts.code.process(M, p));
      const H = new Function(`${n.default.self}`, `${n.default.scope}`, M)(this, this.scope.get());
      if (this.scope.value(P, { ref: H }), H.errors = null, H.schema = p.schema, H.schemaEnv = p, p.$async && (H.$async = !0), this.opts.code.source === !0 && (H.source = { validateName: P, validateCode: L, scopeValues: w._values }), this.opts.unevaluated) {
        const { props: F, items: K } = C;
        H.evaluated = {
          props: F instanceof e.Name ? void 0 : F,
          items: K instanceof e.Name ? void 0 : K,
          dynamicProps: F instanceof e.Name,
          dynamicItems: K instanceof e.Name
        }, H.source && (H.source.evaluated = (0, e.stringify)(H.evaluated));
      }
      return p.validate = H, p;
    } catch (L) {
      throw delete p.validate, delete p.validateName, M && this.logger.error("Error compiling schema, function code:", M), L;
    } finally {
      this._compilations.delete(p);
    }
  }
  Fe.compileSchema = o;
  function c(p, h, m) {
    var _;
    m = (0, r.resolveUrl)(this.opts.uriResolver, h, m);
    const E = p.refs[m];
    if (E)
      return E;
    let x = d.call(this, p, m);
    if (x === void 0) {
      const w = (_ = p.localRefs) === null || _ === void 0 ? void 0 : _[m], { schemaId: S } = this.opts;
      w && (x = new a({ schema: w, schemaId: S, root: p, baseId: h }));
    }
    if (x !== void 0)
      return p.refs[m] = l.call(this, x);
  }
  Fe.resolveRef = c;
  function l(p) {
    return (0, r.inlineRef)(p.schema, this.opts.inlineRefs) ? p.schema : p.validate ? p : o.call(this, p);
  }
  function u(p) {
    for (const h of this._compilations)
      if (f(h, p))
        return h;
  }
  Fe.getCompilingSchema = u;
  function f(p, h) {
    return p.schema === h.schema && p.root === h.root && p.baseId === h.baseId;
  }
  function d(p, h) {
    let m;
    for (; typeof (m = this.refs[h]) == "string"; )
      h = m;
    return m || this.schemas[h] || b.call(this, p, h);
  }
  function b(p, h) {
    const m = this.opts.uriResolver.parse(h), _ = (0, r._getFullPath)(this.opts.uriResolver, m);
    let E = (0, r.getFullPath)(this.opts.uriResolver, p.baseId, void 0);
    if (Object.keys(p.schema).length > 0 && _ === E)
      return y.call(this, m, p);
    const x = (0, r.normalizeId)(_), w = this.refs[x] || this.schemas[x];
    if (typeof w == "string") {
      const S = b.call(this, p, w);
      return typeof S?.schema != "object" ? void 0 : y.call(this, m, S);
    }
    if (typeof w?.schema == "object") {
      if (w.validate || o.call(this, w), x === (0, r.normalizeId)(h)) {
        const { schema: S } = w, { schemaId: P } = this.opts, C = S[P];
        return C && (E = (0, r.resolveUrl)(this.opts.uriResolver, E, C)), new a({ schema: S, schemaId: P, root: p, baseId: E });
      }
      return y.call(this, m, w);
    }
  }
  Fe.resolveSchema = b;
  const v = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function y(p, { baseId: h, schema: m, root: _ }) {
    var E;
    if (((E = p.fragment) === null || E === void 0 ? void 0 : E[0]) !== "/")
      return;
    for (const S of p.fragment.slice(1).split("/")) {
      if (typeof m == "boolean")
        return;
      const P = m[(0, s.unescapeFragment)(S)];
      if (P === void 0)
        return;
      m = P;
      const C = typeof m == "object" && m[this.opts.schemaId];
      !v.has(S) && C && (h = (0, r.resolveUrl)(this.opts.uriResolver, h, C));
    }
    let x;
    if (typeof m != "boolean" && m.$ref && !(0, s.schemaHasRulesButRef)(m, this.RULES)) {
      const S = (0, r.resolveUrl)(this.opts.uriResolver, h, m.$ref);
      x = b.call(this, _, S);
    }
    const { schemaId: w } = this.opts;
    if (x = x || new a({ schema: m, schemaId: w, root: _, baseId: h }), x.schema !== x.root.schema)
      return x;
  }
  return Fe;
}
const Ny = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ky = "Meta-schema for $data reference (JSON AnySchema extension proposal)", jy = "object", Ay = ["$data"], Iy = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Cy = !1, qy = {
  $id: Ny,
  description: ky,
  type: jy,
  required: Ay,
  properties: Iy,
  additionalProperties: Cy
};
var vn = {}, Ku;
function Ly() {
  if (Ku) return vn;
  Ku = 1, Object.defineProperty(vn, "__esModule", { value: !0 });
  const e = Sf();
  return e.code = 'require("ajv/dist/runtime/uri").default', vn.default = e, vn;
}
var Wu;
function Dy() {
  return Wu || (Wu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = Ta();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var n = ce();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return n.CodeGen;
    } });
    const r = Ro(), s = Pa(), i = kf(), a = To(), o = ce(), c = Ra(), l = fa(), u = de(), f = qy, d = Ly(), b = (A, R) => new RegExp(A, R);
    b.code = "new RegExp";
    const v = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), p = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, h = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, m = 200;
    function _(A) {
      var R, j, O, g, $, k, B, W, Z, Y, T, N, I, z, X, Q, re, he, pe, le, ne, we, me, Me, yt;
      const ze = A.strict, gt = (R = A.code) === null || R === void 0 ? void 0 : R.optimize, Jt = gt === !0 || gt === void 0 ? 1 : gt || 0, Xt = (O = (j = A.code) === null || j === void 0 ? void 0 : j.regExp) !== null && O !== void 0 ? O : b, Ua = (g = A.uriResolver) !== null && g !== void 0 ? g : d.default;
      return {
        strictSchema: (k = ($ = A.strictSchema) !== null && $ !== void 0 ? $ : ze) !== null && k !== void 0 ? k : !0,
        strictNumbers: (W = (B = A.strictNumbers) !== null && B !== void 0 ? B : ze) !== null && W !== void 0 ? W : !0,
        strictTypes: (Y = (Z = A.strictTypes) !== null && Z !== void 0 ? Z : ze) !== null && Y !== void 0 ? Y : "log",
        strictTuples: (N = (T = A.strictTuples) !== null && T !== void 0 ? T : ze) !== null && N !== void 0 ? N : "log",
        strictRequired: (z = (I = A.strictRequired) !== null && I !== void 0 ? I : ze) !== null && z !== void 0 ? z : !1,
        code: A.code ? { ...A.code, optimize: Jt, regExp: Xt } : { optimize: Jt, regExp: Xt },
        loopRequired: (X = A.loopRequired) !== null && X !== void 0 ? X : m,
        loopEnum: (Q = A.loopEnum) !== null && Q !== void 0 ? Q : m,
        meta: (re = A.meta) !== null && re !== void 0 ? re : !0,
        messages: (he = A.messages) !== null && he !== void 0 ? he : !0,
        inlineRefs: (pe = A.inlineRefs) !== null && pe !== void 0 ? pe : !0,
        schemaId: (le = A.schemaId) !== null && le !== void 0 ? le : "$id",
        addUsedSchema: (ne = A.addUsedSchema) !== null && ne !== void 0 ? ne : !0,
        validateSchema: (we = A.validateSchema) !== null && we !== void 0 ? we : !0,
        validateFormats: (me = A.validateFormats) !== null && me !== void 0 ? me : !0,
        unicodeRegExp: (Me = A.unicodeRegExp) !== null && Me !== void 0 ? Me : !0,
        int32range: (yt = A.int32range) !== null && yt !== void 0 ? yt : !0,
        uriResolver: Ua
      };
    }
    class E {
      constructor(R = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), R = this.opts = { ...R, ..._(R) };
        const { es5: j, lines: O } = this.opts.code;
        this.scope = new o.ValueScope({ scope: {}, prefixes: y, es5: j, lines: O }), this.logger = G(R.logger);
        const g = R.validateFormats;
        R.validateFormats = !1, this.RULES = (0, i.getRules)(), x.call(this, p, R, "NOT SUPPORTED"), x.call(this, h, R, "DEPRECATED", "warn"), this._metaOpts = M.call(this), R.formats && P.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), R.keywords && C.call(this, R.keywords), typeof R.meta == "object" && this.addMetaSchema(R.meta), S.call(this), R.validateFormats = g;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: R, meta: j, schemaId: O } = this.opts;
        let g = f;
        O === "id" && (g = { ...f }, g.id = g.$id, delete g.$id), j && R && this.addMetaSchema(g, g[O], !1);
      }
      defaultMeta() {
        const { meta: R, schemaId: j } = this.opts;
        return this.opts.defaultMeta = typeof R == "object" ? R[j] || R : void 0;
      }
      validate(R, j) {
        let O;
        if (typeof R == "string") {
          if (O = this.getSchema(R), !O)
            throw new Error(`no schema with key or ref "${R}"`);
        } else
          O = this.compile(R);
        const g = O(j);
        return "$async" in O || (this.errors = O.errors), g;
      }
      compile(R, j) {
        const O = this._addSchema(R, j);
        return O.validate || this._compileSchemaEnv(O);
      }
      compileAsync(R, j) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: O } = this.opts;
        return g.call(this, R, j);
        async function g(Y, T) {
          await $.call(this, Y.$schema);
          const N = this._addSchema(Y, T);
          return N.validate || k.call(this, N);
        }
        async function $(Y) {
          Y && !this.getSchema(Y) && await g.call(this, { $ref: Y }, !0);
        }
        async function k(Y) {
          try {
            return this._compileSchemaEnv(Y);
          } catch (T) {
            if (!(T instanceof s.default))
              throw T;
            return B.call(this, T), await W.call(this, T.missingSchema), k.call(this, Y);
          }
        }
        function B({ missingSchema: Y, missingRef: T }) {
          if (this.refs[Y])
            throw new Error(`AnySchema ${Y} is loaded but ${T} cannot be resolved`);
        }
        async function W(Y) {
          const T = await Z.call(this, Y);
          this.refs[Y] || await $.call(this, T.$schema), this.refs[Y] || this.addSchema(T, Y, j);
        }
        async function Z(Y) {
          const T = this._loading[Y];
          if (T)
            return T;
          try {
            return await (this._loading[Y] = O(Y));
          } finally {
            delete this._loading[Y];
          }
        }
      }
      // Adds schema to the instance
      addSchema(R, j, O, g = this.opts.validateSchema) {
        if (Array.isArray(R)) {
          for (const k of R)
            this.addSchema(k, void 0, O, g);
          return this;
        }
        let $;
        if (typeof R == "object") {
          const { schemaId: k } = this.opts;
          if ($ = R[k], $ !== void 0 && typeof $ != "string")
            throw new Error(`schema ${k} must be string`);
        }
        return j = (0, c.normalizeId)(j || $), this._checkUnique(j), this.schemas[j] = this._addSchema(R, O, j, g, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(R, j, O = this.opts.validateSchema) {
        return this.addSchema(R, j, !0, O), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(R, j) {
        if (typeof R == "boolean")
          return !0;
        let O;
        if (O = R.$schema, O !== void 0 && typeof O != "string")
          throw new Error("$schema must be a string");
        if (O = O || this.opts.defaultMeta || this.defaultMeta(), !O)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const g = this.validate(O, R);
        if (!g && j) {
          const $ = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error($);
          else
            throw new Error($);
        }
        return g;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(R) {
        let j;
        for (; typeof (j = w.call(this, R)) == "string"; )
          R = j;
        if (j === void 0) {
          const { schemaId: O } = this.opts, g = new a.SchemaEnv({ schema: {}, schemaId: O });
          if (j = a.resolveSchema.call(this, g, R), !j)
            return;
          this.refs[R] = j;
        }
        return j.validate || this._compileSchemaEnv(j);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(R) {
        if (R instanceof RegExp)
          return this._removeAllSchemas(this.schemas, R), this._removeAllSchemas(this.refs, R), this;
        switch (typeof R) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const j = w.call(this, R);
            return typeof j == "object" && this._cache.delete(j.schema), delete this.schemas[R], delete this.refs[R], this;
          }
          case "object": {
            const j = R;
            this._cache.delete(j);
            let O = R[this.opts.schemaId];
            return O && (O = (0, c.normalizeId)(O), delete this.schemas[O], delete this.refs[O]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(R) {
        for (const j of R)
          this.addKeyword(j);
        return this;
      }
      addKeyword(R, j) {
        let O;
        if (typeof R == "string")
          O = R, typeof j == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), j.keyword = O);
        else if (typeof R == "object" && j === void 0) {
          if (j = R, O = j.keyword, Array.isArray(O) && !O.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (F.call(this, O, j), !j)
          return (0, u.eachItem)(O, ($) => K.call(this, $)), this;
        U.call(this, j);
        const g = {
          ...j,
          type: (0, l.getJSONTypes)(j.type),
          schemaType: (0, l.getJSONTypes)(j.schemaType)
        };
        return (0, u.eachItem)(O, g.type.length === 0 ? ($) => K.call(this, $, g) : ($) => g.type.forEach((k) => K.call(this, $, g, k))), this;
      }
      getKeyword(R) {
        const j = this.RULES.all[R];
        return typeof j == "object" ? j.definition : !!j;
      }
      // Remove keyword
      removeKeyword(R) {
        const { RULES: j } = this;
        delete j.keywords[R], delete j.all[R];
        for (const O of j.rules) {
          const g = O.rules.findIndex(($) => $.keyword === R);
          g >= 0 && O.rules.splice(g, 1);
        }
        return this;
      }
      // Add format
      addFormat(R, j) {
        return typeof j == "string" && (j = new RegExp(j)), this.formats[R] = j, this;
      }
      errorsText(R = this.errors, { separator: j = ", ", dataVar: O = "data" } = {}) {
        return !R || R.length === 0 ? "No errors" : R.map((g) => `${O}${g.instancePath} ${g.message}`).reduce((g, $) => g + j + $);
      }
      $dataMetaSchema(R, j) {
        const O = this.RULES.all;
        R = JSON.parse(JSON.stringify(R));
        for (const g of j) {
          const $ = g.split("/").slice(1);
          let k = R;
          for (const B of $)
            k = k[B];
          for (const B in O) {
            const W = O[B];
            if (typeof W != "object")
              continue;
            const { $data: Z } = W.definition, Y = k[B];
            Z && Y && (k[B] = J(Y));
          }
        }
        return R;
      }
      _removeAllSchemas(R, j) {
        for (const O in R) {
          const g = R[O];
          (!j || j.test(O)) && (typeof g == "string" ? delete R[O] : g && !g.meta && (this._cache.delete(g.schema), delete R[O]));
        }
      }
      _addSchema(R, j, O, g = this.opts.validateSchema, $ = this.opts.addUsedSchema) {
        let k;
        const { schemaId: B } = this.opts;
        if (typeof R == "object")
          k = R[B];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof R != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let W = this._cache.get(R);
        if (W !== void 0)
          return W;
        O = (0, c.normalizeId)(k || O);
        const Z = c.getSchemaRefs.call(this, R, O);
        return W = new a.SchemaEnv({ schema: R, schemaId: B, meta: j, baseId: O, localRefs: Z }), this._cache.set(W.schema, W), $ && !O.startsWith("#") && (O && this._checkUnique(O), this.refs[O] = W), g && this.validateSchema(R, !0), W;
      }
      _checkUnique(R) {
        if (this.schemas[R] || this.refs[R])
          throw new Error(`schema with key or id "${R}" already exists`);
      }
      _compileSchemaEnv(R) {
        if (R.meta ? this._compileMetaSchema(R) : a.compileSchema.call(this, R), !R.validate)
          throw new Error("ajv implementation error");
        return R.validate;
      }
      _compileMetaSchema(R) {
        const j = this.opts;
        this.opts = this._metaOpts;
        try {
          a.compileSchema.call(this, R);
        } finally {
          this.opts = j;
        }
      }
    }
    E.ValidationError = r.default, E.MissingRefError = s.default, e.default = E;
    function x(A, R, j, O = "error") {
      for (const g in A) {
        const $ = g;
        $ in R && this.logger[O](`${j}: option ${g}. ${A[$]}`);
      }
    }
    function w(A) {
      return A = (0, c.normalizeId)(A), this.schemas[A] || this.refs[A];
    }
    function S() {
      const A = this.opts.schemas;
      if (A)
        if (Array.isArray(A))
          this.addSchema(A);
        else
          for (const R in A)
            this.addSchema(A[R], R);
    }
    function P() {
      for (const A in this.opts.formats) {
        const R = this.opts.formats[A];
        R && this.addFormat(A, R);
      }
    }
    function C(A) {
      if (Array.isArray(A)) {
        this.addVocabulary(A);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const R in A) {
        const j = A[R];
        j.keyword || (j.keyword = R), this.addKeyword(j);
      }
    }
    function M() {
      const A = { ...this.opts };
      for (const R of v)
        delete A[R];
      return A;
    }
    const L = { log() {
    }, warn() {
    }, error() {
    } };
    function G(A) {
      if (A === !1)
        return L;
      if (A === void 0)
        return console;
      if (A.log && A.warn && A.error)
        return A;
      throw new Error("logger must implement log, warn and error methods");
    }
    const H = /^[a-z_$][a-z0-9_$:-]*$/i;
    function F(A, R) {
      const { RULES: j } = this;
      if ((0, u.eachItem)(A, (O) => {
        if (j.keywords[O])
          throw new Error(`Keyword ${O} is already defined`);
        if (!H.test(O))
          throw new Error(`Keyword ${O} has invalid name`);
      }), !!R && R.$data && !("code" in R || "validate" in R))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function K(A, R, j) {
      var O;
      const g = R?.post;
      if (j && g)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: $ } = this;
      let k = g ? $.post : $.rules.find(({ type: W }) => W === j);
      if (k || (k = { type: j, rules: [] }, $.rules.push(k)), $.keywords[A] = !0, !R)
        return;
      const B = {
        keyword: A,
        definition: {
          ...R,
          type: (0, l.getJSONTypes)(R.type),
          schemaType: (0, l.getJSONTypes)(R.schemaType)
        }
      };
      R.before ? q.call(this, k, B, R.before) : k.rules.push(B), $.all[A] = B, (O = R.implements) === null || O === void 0 || O.forEach((W) => this.addKeyword(W));
    }
    function q(A, R, j) {
      const O = A.rules.findIndex((g) => g.keyword === j);
      O >= 0 ? A.rules.splice(O, 0, R) : (A.rules.push(R), this.logger.warn(`rule ${j} is not defined`));
    }
    function U(A) {
      let { metaSchema: R } = A;
      R !== void 0 && (A.$data && this.opts.$data && (R = J(R)), A.validateSchema = this.compile(R, !0));
    }
    const D = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function J(A) {
      return { anyOf: [A, D] };
    }
  })(ns)), ns;
}
var yn = {}, gn = {}, bn = {}, Ju;
function Fy() {
  if (Ju) return bn;
  Ju = 1, Object.defineProperty(bn, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return bn.default = e, bn;
}
var lt = {}, Xu;
function My() {
  if (Xu) return lt;
  Xu = 1, Object.defineProperty(lt, "__esModule", { value: !0 }), lt.callRef = lt.getValidate = void 0;
  const e = Pa(), t = Ke(), n = ce(), r = vt(), s = To(), i = de(), a = {
    keyword: "$ref",
    schemaType: "string",
    code(l) {
      const { gen: u, schema: f, it: d } = l, { baseId: b, schemaEnv: v, validateName: y, opts: p, self: h } = d, { root: m } = v;
      if ((f === "#" || f === "#/") && b === m.baseId)
        return E();
      const _ = s.resolveRef.call(h, m, b, f);
      if (_ === void 0)
        throw new e.default(d.opts.uriResolver, b, f);
      if (_ instanceof s.SchemaEnv)
        return x(_);
      return w(_);
      function E() {
        if (v === m)
          return c(l, y, v, v.$async);
        const S = u.scopeValue("root", { ref: m });
        return c(l, (0, n._)`${S}.validate`, m, m.$async);
      }
      function x(S) {
        const P = o(l, S);
        c(l, P, S, S.$async);
      }
      function w(S) {
        const P = u.scopeValue("schema", p.code.source === !0 ? { ref: S, code: (0, n.stringify)(S) } : { ref: S }), C = u.name("valid"), M = l.subschema({
          schema: S,
          dataTypes: [],
          schemaPath: n.nil,
          topSchemaRef: P,
          errSchemaPath: f
        }, C);
        l.mergeEvaluated(M), l.ok(C);
      }
    }
  };
  function o(l, u) {
    const { gen: f } = l;
    return u.validate ? f.scopeValue("validate", { ref: u.validate }) : (0, n._)`${f.scopeValue("wrapper", { ref: u })}.validate`;
  }
  lt.getValidate = o;
  function c(l, u, f, d) {
    const { gen: b, it: v } = l, { allErrors: y, schemaEnv: p, opts: h } = v, m = h.passContext ? r.default.this : n.nil;
    d ? _() : E();
    function _() {
      if (!p.$async)
        throw new Error("async schema referenced by sync schema");
      const S = b.let("valid");
      b.try(() => {
        b.code((0, n._)`await ${(0, t.callValidateCode)(l, u, m)}`), w(u), y || b.assign(S, !0);
      }, (P) => {
        b.if((0, n._)`!(${P} instanceof ${v.ValidationError})`, () => b.throw(P)), x(P), y || b.assign(S, !1);
      }), l.ok(S);
    }
    function E() {
      l.result((0, t.callValidateCode)(l, u, m), () => w(u), () => x(u));
    }
    function x(S) {
      const P = (0, n._)`${S}.errors`;
      b.assign(r.default.vErrors, (0, n._)`${r.default.vErrors} === null ? ${P} : ${r.default.vErrors}.concat(${P})`), b.assign(r.default.errors, (0, n._)`${r.default.vErrors}.length`);
    }
    function w(S) {
      var P;
      if (!v.opts.unevaluated)
        return;
      const C = (P = f?.validate) === null || P === void 0 ? void 0 : P.evaluated;
      if (v.props !== !0)
        if (C && !C.dynamicProps)
          C.props !== void 0 && (v.props = i.mergeEvaluated.props(b, C.props, v.props));
        else {
          const M = b.var("props", (0, n._)`${S}.evaluated.props`);
          v.props = i.mergeEvaluated.props(b, M, v.props, n.Name);
        }
      if (v.items !== !0)
        if (C && !C.dynamicItems)
          C.items !== void 0 && (v.items = i.mergeEvaluated.items(b, C.items, v.items));
        else {
          const M = b.var("items", (0, n._)`${S}.evaluated.items`);
          v.items = i.mergeEvaluated.items(b, M, v.items, n.Name);
        }
    }
  }
  return lt.callRef = c, lt.default = a, lt;
}
var Yu;
function Uy() {
  if (Yu) return gn;
  Yu = 1, Object.defineProperty(gn, "__esModule", { value: !0 });
  const e = Fy(), t = My(), n = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return gn.default = n, gn;
}
var _n = {}, xn = {}, Qu;
function zy() {
  if (Qu) return xn;
  Qu = 1, Object.defineProperty(xn, "__esModule", { value: !0 });
  const e = ce(), t = e.operators, n = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, r = {
    message: ({ keyword: i, schemaCode: a }) => (0, e.str)`must be ${n[i].okStr} ${a}`,
    params: ({ keyword: i, schemaCode: a }) => (0, e._)`{comparison: ${n[i].okStr}, limit: ${a}}`
  }, s = {
    keyword: Object.keys(n),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: r,
    code(i) {
      const { keyword: a, data: o, schemaCode: c } = i;
      i.fail$data((0, e._)`${o} ${n[a].fail} ${c} || isNaN(${o})`);
    }
  };
  return xn.default = s, xn;
}
var wn = {}, Zu;
function Vy() {
  if (Zu) return wn;
  Zu = 1, Object.defineProperty(wn, "__esModule", { value: !0 });
  const e = ce(), n = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, e.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, e._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: s, data: i, schemaCode: a, it: o } = r, c = o.opts.multipleOfPrecision, l = s.let("res"), u = c ? (0, e._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${c}` : (0, e._)`${l} !== parseInt(${l})`;
      r.fail$data((0, e._)`(${a} === 0 || (${l} = ${i}/${a}, ${u}))`);
    }
  };
  return wn.default = n, wn;
}
var En = {}, $n = {}, el;
function By() {
  if (el) return $n;
  el = 1, Object.defineProperty($n, "__esModule", { value: !0 });
  function e(t) {
    const n = t.length;
    let r = 0, s = 0, i;
    for (; s < n; )
      r++, i = t.charCodeAt(s++), i >= 55296 && i <= 56319 && s < n && (i = t.charCodeAt(s), (i & 64512) === 56320 && s++);
    return r;
  }
  return $n.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', $n;
}
var tl;
function Gy() {
  if (tl) return En;
  tl = 1, Object.defineProperty(En, "__esModule", { value: !0 });
  const e = ce(), t = de(), n = By(), s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: i, schemaCode: a }) {
        const o = i === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${a} characters`;
      },
      params: ({ schemaCode: i }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { keyword: a, data: o, schemaCode: c, it: l } = i, u = a === "maxLength" ? e.operators.GT : e.operators.LT, f = l.opts.unicode === !1 ? (0, e._)`${o}.length` : (0, e._)`${(0, t.useFunc)(i.gen, n.default)}(${o})`;
      i.fail$data((0, e._)`${f} ${u} ${c}`);
    }
  };
  return En.default = s, En;
}
var Sn = {}, rl;
function Hy() {
  if (rl) return Sn;
  rl = 1, Object.defineProperty(Sn, "__esModule", { value: !0 });
  const e = Ke(), t = ce(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, t.str)`must match pattern "${s}"`,
      params: ({ schemaCode: s }) => (0, t._)`{pattern: ${s}}`
    },
    code(s) {
      const { data: i, $data: a, schema: o, schemaCode: c, it: l } = s, u = l.opts.unicodeRegExp ? "u" : "", f = a ? (0, t._)`(new RegExp(${c}, ${u}))` : (0, e.usePattern)(s, o);
      s.fail$data((0, t._)`!${f}.test(${i})`);
    }
  };
  return Sn.default = r, Sn;
}
var Rn = {}, nl;
function Ky() {
  if (nl) return Rn;
  nl = 1, Object.defineProperty(Rn, "__esModule", { value: !0 });
  const e = ce(), n = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: s }) {
        const i = r === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${i} than ${s} properties`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: s, data: i, schemaCode: a } = r, o = s === "maxProperties" ? e.operators.GT : e.operators.LT;
      r.fail$data((0, e._)`Object.keys(${i}).length ${o} ${a}`);
    }
  };
  return Rn.default = n, Rn;
}
var Tn = {}, al;
function Wy() {
  if (al) return Tn;
  al = 1, Object.defineProperty(Tn, "__esModule", { value: !0 });
  const e = Ke(), t = ce(), n = de(), s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, t.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, t._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: a, schema: o, schemaCode: c, data: l, $data: u, it: f } = i, { opts: d } = f;
      if (!u && o.length === 0)
        return;
      const b = o.length >= d.loopRequired;
      if (f.allErrors ? v() : y(), d.strictRequired) {
        const m = i.parentSchema.properties, { definedProperties: _ } = i.it;
        for (const E of o)
          if (m?.[E] === void 0 && !_.has(E)) {
            const x = f.schemaEnv.baseId + f.errSchemaPath, w = `required property "${E}" is not defined at "${x}" (strictRequired)`;
            (0, n.checkStrictMode)(f, w, f.opts.strictRequired);
          }
      }
      function v() {
        if (b || u)
          i.block$data(t.nil, p);
        else
          for (const m of o)
            (0, e.checkReportMissingProp)(i, m);
      }
      function y() {
        const m = a.let("missing");
        if (b || u) {
          const _ = a.let("valid", !0);
          i.block$data(_, () => h(m, _)), i.ok(_);
        } else
          a.if((0, e.checkMissingProp)(i, o, m)), (0, e.reportMissingProp)(i, m), a.else();
      }
      function p() {
        a.forOf("prop", c, (m) => {
          i.setParams({ missingProperty: m }), a.if((0, e.noPropertyInData)(a, l, m, d.ownProperties), () => i.error());
        });
      }
      function h(m, _) {
        i.setParams({ missingProperty: m }), a.forOf(m, c, () => {
          a.assign(_, (0, e.propertyInData)(a, l, m, d.ownProperties)), a.if((0, t.not)(_), () => {
            i.error(), a.break();
          });
        }, t.nil);
      }
    }
  };
  return Tn.default = s, Tn;
}
var Pn = {}, sl;
function Jy() {
  if (sl) return Pn;
  sl = 1, Object.defineProperty(Pn, "__esModule", { value: !0 });
  const e = ce(), n = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: s }) {
        const i = r === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${i} than ${s} items`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: s, data: i, schemaCode: a } = r, o = s === "maxItems" ? e.operators.GT : e.operators.LT;
      r.fail$data((0, e._)`${i}.length ${o} ${a}`);
    }
  };
  return Pn.default = n, Pn;
}
var On = {}, Nn = {}, il;
function Po() {
  if (il) return Nn;
  il = 1, Object.defineProperty(Nn, "__esModule", { value: !0 });
  const e = _a();
  return e.code = 'require("ajv/dist/runtime/equal").default', Nn.default = e, Nn;
}
var ol;
function Xy() {
  if (ol) return On;
  ol = 1, Object.defineProperty(On, "__esModule", { value: !0 });
  const e = fa(), t = ce(), n = de(), r = Po(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: a, j: o } }) => (0, t.str)`must NOT have duplicate items (items ## ${o} and ${a} are identical)`,
      params: ({ params: { i: a, j: o } }) => (0, t._)`{i: ${a}, j: ${o}}`
    },
    code(a) {
      const { gen: o, data: c, $data: l, schema: u, parentSchema: f, schemaCode: d, it: b } = a;
      if (!l && !u)
        return;
      const v = o.let("valid"), y = f.items ? (0, e.getSchemaTypes)(f.items) : [];
      a.block$data(v, p, (0, t._)`${d} === false`), a.ok(v);
      function p() {
        const E = o.let("i", (0, t._)`${c}.length`), x = o.let("j");
        a.setParams({ i: E, j: x }), o.assign(v, !0), o.if((0, t._)`${E} > 1`, () => (h() ? m : _)(E, x));
      }
      function h() {
        return y.length > 0 && !y.some((E) => E === "object" || E === "array");
      }
      function m(E, x) {
        const w = o.name("item"), S = (0, e.checkDataTypes)(y, w, b.opts.strictNumbers, e.DataType.Wrong), P = o.const("indices", (0, t._)`{}`);
        o.for((0, t._)`;${E}--;`, () => {
          o.let(w, (0, t._)`${c}[${E}]`), o.if(S, (0, t._)`continue`), y.length > 1 && o.if((0, t._)`typeof ${w} == "string"`, (0, t._)`${w} += "_"`), o.if((0, t._)`typeof ${P}[${w}] == "number"`, () => {
            o.assign(x, (0, t._)`${P}[${w}]`), a.error(), o.assign(v, !1).break();
          }).code((0, t._)`${P}[${w}] = ${E}`);
        });
      }
      function _(E, x) {
        const w = (0, n.useFunc)(o, r.default), S = o.name("outer");
        o.label(S).for((0, t._)`;${E}--;`, () => o.for((0, t._)`${x} = ${E}; ${x}--;`, () => o.if((0, t._)`${w}(${c}[${E}], ${c}[${x}])`, () => {
          a.error(), o.assign(v, !1).break(S);
        })));
      }
    }
  };
  return On.default = i, On;
}
var kn = {}, cl;
function Yy() {
  if (cl) return kn;
  cl = 1, Object.defineProperty(kn, "__esModule", { value: !0 });
  const e = ce(), t = de(), n = Po(), s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, e._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: a, data: o, $data: c, schemaCode: l, schema: u } = i;
      c || u && typeof u == "object" ? i.fail$data((0, e._)`!${(0, t.useFunc)(a, n.default)}(${o}, ${l})`) : i.fail((0, e._)`${u} !== ${o}`);
    }
  };
  return kn.default = s, kn;
}
var jn = {}, ul;
function Qy() {
  if (ul) return jn;
  ul = 1, Object.defineProperty(jn, "__esModule", { value: !0 });
  const e = ce(), t = de(), n = Po(), s = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, e._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: a, data: o, $data: c, schema: l, schemaCode: u, it: f } = i;
      if (!c && l.length === 0)
        throw new Error("enum must have non-empty array");
      const d = l.length >= f.opts.loopEnum;
      let b;
      const v = () => b ?? (b = (0, t.useFunc)(a, n.default));
      let y;
      if (d || c)
        y = a.let("valid"), i.block$data(y, p);
      else {
        if (!Array.isArray(l))
          throw new Error("ajv implementation error");
        const m = a.const("vSchema", u);
        y = (0, e.or)(...l.map((_, E) => h(m, E)));
      }
      i.pass(y);
      function p() {
        a.assign(y, !1), a.forOf("v", u, (m) => a.if((0, e._)`${v()}(${o}, ${m})`, () => a.assign(y, !0).break()));
      }
      function h(m, _) {
        const E = l[_];
        return typeof E == "object" && E !== null ? (0, e._)`${v()}(${o}, ${m}[${_}])` : (0, e._)`${o} === ${E}`;
      }
    }
  };
  return jn.default = s, jn;
}
var ll;
function Zy() {
  if (ll) return _n;
  ll = 1, Object.defineProperty(_n, "__esModule", { value: !0 });
  const e = zy(), t = Vy(), n = Gy(), r = Hy(), s = Ky(), i = Wy(), a = Jy(), o = Xy(), c = Yy(), l = Qy(), u = [
    // number
    e.default,
    t.default,
    // string
    n.default,
    r.default,
    // object
    s.default,
    i.default,
    // array
    a.default,
    o.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    l.default
  ];
  return _n.default = u, _n;
}
var An = {}, Lt = {}, pl;
function Af() {
  if (pl) return Lt;
  pl = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.validateAdditionalItems = void 0;
  const e = ce(), t = de(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, e.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: a, it: o } = i, { items: c } = a;
      if (!Array.isArray(c)) {
        (0, t.checkStrictMode)(o, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      s(i, c);
    }
  };
  function s(i, a) {
    const { gen: o, schema: c, data: l, keyword: u, it: f } = i;
    f.items = !0;
    const d = o.const("len", (0, e._)`${l}.length`);
    if (c === !1)
      i.setParams({ len: a.length }), i.pass((0, e._)`${d} <= ${a.length}`);
    else if (typeof c == "object" && !(0, t.alwaysValidSchema)(f, c)) {
      const v = o.var("valid", (0, e._)`${d} <= ${a.length}`);
      o.if((0, e.not)(v), () => b(v)), i.ok(v);
    }
    function b(v) {
      o.forRange("i", a.length, d, (y) => {
        i.subschema({ keyword: u, dataProp: y, dataPropType: t.Type.Num }, v), f.allErrors || o.if((0, e.not)(v), () => o.break());
      });
    }
  }
  return Lt.validateAdditionalItems = s, Lt.default = r, Lt;
}
var In = {}, Dt = {}, dl;
function If() {
  if (dl) return Dt;
  dl = 1, Object.defineProperty(Dt, "__esModule", { value: !0 }), Dt.validateTuple = void 0;
  const e = ce(), t = de(), n = Ke(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(i) {
      const { schema: a, it: o } = i;
      if (Array.isArray(a))
        return s(i, "additionalItems", a);
      o.items = !0, !(0, t.alwaysValidSchema)(o, a) && i.ok((0, n.validateArray)(i));
    }
  };
  function s(i, a, o = i.schema) {
    const { gen: c, parentSchema: l, data: u, keyword: f, it: d } = i;
    y(l), d.opts.unevaluated && o.length && d.items !== !0 && (d.items = t.mergeEvaluated.items(c, o.length, d.items));
    const b = c.name("valid"), v = c.const("len", (0, e._)`${u}.length`);
    o.forEach((p, h) => {
      (0, t.alwaysValidSchema)(d, p) || (c.if((0, e._)`${v} > ${h}`, () => i.subschema({
        keyword: f,
        schemaProp: h,
        dataProp: h
      }, b)), i.ok(b));
    });
    function y(p) {
      const { opts: h, errSchemaPath: m } = d, _ = o.length, E = _ === p.minItems && (_ === p.maxItems || p[a] === !1);
      if (h.strictTuples && !E) {
        const x = `"${f}" is ${_}-tuple, but minItems or maxItems/${a} are not specified or different at path "${m}"`;
        (0, t.checkStrictMode)(d, x, h.strictTuples);
      }
    }
  }
  return Dt.validateTuple = s, Dt.default = r, Dt;
}
var fl;
function eg() {
  if (fl) return In;
  fl = 1, Object.defineProperty(In, "__esModule", { value: !0 });
  const e = If(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (n) => (0, e.validateTuple)(n, "items")
  };
  return In.default = t, In;
}
var Cn = {}, ml;
function tg() {
  if (ml) return Cn;
  ml = 1, Object.defineProperty(Cn, "__esModule", { value: !0 });
  const e = ce(), t = de(), n = Ke(), r = Af(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: a } }) => (0, e.str)`must NOT have more than ${a} items`,
      params: ({ params: { len: a } }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { schema: o, parentSchema: c, it: l } = a, { prefixItems: u } = c;
      l.items = !0, !(0, t.alwaysValidSchema)(l, o) && (u ? (0, r.validateAdditionalItems)(a, u) : a.ok((0, n.validateArray)(a)));
    }
  };
  return Cn.default = i, Cn;
}
var qn = {}, hl;
function rg() {
  if (hl) return qn;
  hl = 1, Object.defineProperty(qn, "__esModule", { value: !0 });
  const e = ce(), t = de(), r = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: s, max: i } }) => i === void 0 ? (0, e.str)`must contain at least ${s} valid item(s)` : (0, e.str)`must contain at least ${s} and no more than ${i} valid item(s)`,
      params: ({ params: { min: s, max: i } }) => i === void 0 ? (0, e._)`{minContains: ${s}}` : (0, e._)`{minContains: ${s}, maxContains: ${i}}`
    },
    code(s) {
      const { gen: i, schema: a, parentSchema: o, data: c, it: l } = s;
      let u, f;
      const { minContains: d, maxContains: b } = o;
      l.opts.next ? (u = d === void 0 ? 1 : d, f = b) : u = 1;
      const v = i.const("len", (0, e._)`${c}.length`);
      if (s.setParams({ min: u, max: f }), f === void 0 && u === 0) {
        (0, t.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (f !== void 0 && u > f) {
        (0, t.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), s.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(l, a)) {
        let _ = (0, e._)`${v} >= ${u}`;
        f !== void 0 && (_ = (0, e._)`${_} && ${v} <= ${f}`), s.pass(_);
        return;
      }
      l.items = !0;
      const y = i.name("valid");
      f === void 0 && u === 1 ? h(y, () => i.if(y, () => i.break())) : u === 0 ? (i.let(y, !0), f !== void 0 && i.if((0, e._)`${c}.length > 0`, p)) : (i.let(y, !1), p()), s.result(y, () => s.reset());
      function p() {
        const _ = i.name("_valid"), E = i.let("count", 0);
        h(_, () => i.if(_, () => m(E)));
      }
      function h(_, E) {
        i.forRange("i", 0, v, (x) => {
          s.subschema({
            keyword: "contains",
            dataProp: x,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, _), E();
        });
      }
      function m(_) {
        i.code((0, e._)`${_}++`), f === void 0 ? i.if((0, e._)`${_} >= ${u}`, () => i.assign(y, !0).break()) : (i.if((0, e._)`${_} > ${f}`, () => i.assign(y, !1).break()), u === 1 ? i.assign(y, !0) : i.if((0, e._)`${_} >= ${u}`, () => i.assign(y, !0)));
      }
    }
  };
  return qn.default = r, qn;
}
var us = {}, vl;
function ng() {
  return vl || (vl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = ce(), n = de(), r = Ke();
    e.error = {
      message: ({ params: { property: c, depsCount: l, deps: u } }) => {
        const f = l === 1 ? "property" : "properties";
        return (0, t.str)`must have ${f} ${u} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: l, deps: u, missingProperty: f } }) => (0, t._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${l},
    deps: ${u}}`
      // TODO change to reference
    };
    const s = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(c) {
        const [l, u] = i(c);
        a(c, l), o(c, u);
      }
    };
    function i({ schema: c }) {
      const l = {}, u = {};
      for (const f in c) {
        if (f === "__proto__")
          continue;
        const d = Array.isArray(c[f]) ? l : u;
        d[f] = c[f];
      }
      return [l, u];
    }
    function a(c, l = c.schema) {
      const { gen: u, data: f, it: d } = c;
      if (Object.keys(l).length === 0)
        return;
      const b = u.let("missing");
      for (const v in l) {
        const y = l[v];
        if (y.length === 0)
          continue;
        const p = (0, r.propertyInData)(u, f, v, d.opts.ownProperties);
        c.setParams({
          property: v,
          depsCount: y.length,
          deps: y.join(", ")
        }), d.allErrors ? u.if(p, () => {
          for (const h of y)
            (0, r.checkReportMissingProp)(c, h);
        }) : (u.if((0, t._)`${p} && (${(0, r.checkMissingProp)(c, y, b)})`), (0, r.reportMissingProp)(c, b), u.else());
      }
    }
    e.validatePropertyDeps = a;
    function o(c, l = c.schema) {
      const { gen: u, data: f, keyword: d, it: b } = c, v = u.name("valid");
      for (const y in l)
        (0, n.alwaysValidSchema)(b, l[y]) || (u.if(
          (0, r.propertyInData)(u, f, y, b.opts.ownProperties),
          () => {
            const p = c.subschema({ keyword: d, schemaProp: y }, v);
            c.mergeValidEvaluated(p, v);
          },
          () => u.var(v, !0)
          // TODO var
        ), c.ok(v));
    }
    e.validateSchemaDeps = o, e.default = s;
  })(us)), us;
}
var Ln = {}, yl;
function ag() {
  if (yl) return Ln;
  yl = 1, Object.defineProperty(Ln, "__esModule", { value: !0 });
  const e = ce(), t = de(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: s }) => (0, e._)`{propertyName: ${s.propertyName}}`
    },
    code(s) {
      const { gen: i, schema: a, data: o, it: c } = s;
      if ((0, t.alwaysValidSchema)(c, a))
        return;
      const l = i.name("valid");
      i.forIn("key", o, (u) => {
        s.setParams({ propertyName: u }), s.subschema({
          keyword: "propertyNames",
          data: u,
          dataTypes: ["string"],
          propertyName: u,
          compositeRule: !0
        }, l), i.if((0, e.not)(l), () => {
          s.error(!0), c.allErrors || i.break();
        });
      }), s.ok(l);
    }
  };
  return Ln.default = r, Ln;
}
var Dn = {}, gl;
function Cf() {
  if (gl) return Dn;
  gl = 1, Object.defineProperty(Dn, "__esModule", { value: !0 });
  const e = Ke(), t = ce(), n = vt(), r = de(), i = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: a }) => (0, t._)`{additionalProperty: ${a.additionalProperty}}`
    },
    code(a) {
      const { gen: o, schema: c, parentSchema: l, data: u, errsCount: f, it: d } = a;
      if (!f)
        throw new Error("ajv implementation error");
      const { allErrors: b, opts: v } = d;
      if (d.props = !0, v.removeAdditional !== "all" && (0, r.alwaysValidSchema)(d, c))
        return;
      const y = (0, e.allSchemaProperties)(l.properties), p = (0, e.allSchemaProperties)(l.patternProperties);
      h(), a.ok((0, t._)`${f} === ${n.default.errors}`);
      function h() {
        o.forIn("key", u, (w) => {
          !y.length && !p.length ? E(w) : o.if(m(w), () => E(w));
        });
      }
      function m(w) {
        let S;
        if (y.length > 8) {
          const P = (0, r.schemaRefOrVal)(d, l.properties, "properties");
          S = (0, e.isOwnProperty)(o, P, w);
        } else y.length ? S = (0, t.or)(...y.map((P) => (0, t._)`${w} === ${P}`)) : S = t.nil;
        return p.length && (S = (0, t.or)(S, ...p.map((P) => (0, t._)`${(0, e.usePattern)(a, P)}.test(${w})`))), (0, t.not)(S);
      }
      function _(w) {
        o.code((0, t._)`delete ${u}[${w}]`);
      }
      function E(w) {
        if (v.removeAdditional === "all" || v.removeAdditional && c === !1) {
          _(w);
          return;
        }
        if (c === !1) {
          a.setParams({ additionalProperty: w }), a.error(), b || o.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(d, c)) {
          const S = o.name("valid");
          v.removeAdditional === "failing" ? (x(w, S, !1), o.if((0, t.not)(S), () => {
            a.reset(), _(w);
          })) : (x(w, S), b || o.if((0, t.not)(S), () => o.break()));
        }
      }
      function x(w, S, P) {
        const C = {
          keyword: "additionalProperties",
          dataProp: w,
          dataPropType: r.Type.Str
        };
        P === !1 && Object.assign(C, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), a.subschema(C, S);
      }
    }
  };
  return Dn.default = i, Dn;
}
var Fn = {}, bl;
function sg() {
  if (bl) return Fn;
  bl = 1, Object.defineProperty(Fn, "__esModule", { value: !0 });
  const e = Ta(), t = Ke(), n = de(), r = Cf(), s = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: a, schema: o, parentSchema: c, data: l, it: u } = i;
      u.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new e.KeywordCxt(u, r.default, "additionalProperties"));
      const f = (0, t.allSchemaProperties)(o);
      for (const p of f)
        u.definedProperties.add(p);
      u.opts.unevaluated && f.length && u.props !== !0 && (u.props = n.mergeEvaluated.props(a, (0, n.toHash)(f), u.props));
      const d = f.filter((p) => !(0, n.alwaysValidSchema)(u, o[p]));
      if (d.length === 0)
        return;
      const b = a.name("valid");
      for (const p of d)
        v(p) ? y(p) : (a.if((0, t.propertyInData)(a, l, p, u.opts.ownProperties)), y(p), u.allErrors || a.else().var(b, !0), a.endIf()), i.it.definedProperties.add(p), i.ok(b);
      function v(p) {
        return u.opts.useDefaults && !u.compositeRule && o[p].default !== void 0;
      }
      function y(p) {
        i.subschema({
          keyword: "properties",
          schemaProp: p,
          dataProp: p
        }, b);
      }
    }
  };
  return Fn.default = s, Fn;
}
var Mn = {}, _l;
function ig() {
  if (_l) return Mn;
  _l = 1, Object.defineProperty(Mn, "__esModule", { value: !0 });
  const e = Ke(), t = ce(), n = de(), r = de(), s = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: a, schema: o, data: c, parentSchema: l, it: u } = i, { opts: f } = u, d = (0, e.allSchemaProperties)(o), b = d.filter((E) => (0, n.alwaysValidSchema)(u, o[E]));
      if (d.length === 0 || b.length === d.length && (!u.opts.unevaluated || u.props === !0))
        return;
      const v = f.strictSchema && !f.allowMatchingProperties && l.properties, y = a.name("valid");
      u.props !== !0 && !(u.props instanceof t.Name) && (u.props = (0, r.evaluatedPropsToName)(a, u.props));
      const { props: p } = u;
      h();
      function h() {
        for (const E of d)
          v && m(E), u.allErrors ? _(E) : (a.var(y, !0), _(E), a.if(y));
      }
      function m(E) {
        for (const x in v)
          new RegExp(E).test(x) && (0, n.checkStrictMode)(u, `property ${x} matches pattern ${E} (use allowMatchingProperties)`);
      }
      function _(E) {
        a.forIn("key", c, (x) => {
          a.if((0, t._)`${(0, e.usePattern)(i, E)}.test(${x})`, () => {
            const w = b.includes(E);
            w || i.subschema({
              keyword: "patternProperties",
              schemaProp: E,
              dataProp: x,
              dataPropType: r.Type.Str
            }, y), u.opts.unevaluated && p !== !0 ? a.assign((0, t._)`${p}[${x}]`, !0) : !w && !u.allErrors && a.if((0, t.not)(y), () => a.break());
          });
        });
      }
    }
  };
  return Mn.default = s, Mn;
}
var Un = {}, xl;
function og() {
  if (xl) return Un;
  xl = 1, Object.defineProperty(Un, "__esModule", { value: !0 });
  const e = de(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(n) {
      const { gen: r, schema: s, it: i } = n;
      if ((0, e.alwaysValidSchema)(i, s)) {
        n.fail();
        return;
      }
      const a = r.name("valid");
      n.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, a), n.failResult(a, () => n.reset(), () => n.error());
    },
    error: { message: "must NOT be valid" }
  };
  return Un.default = t, Un;
}
var zn = {}, wl;
function cg() {
  if (wl) return zn;
  wl = 1, Object.defineProperty(zn, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: Ke().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return zn.default = t, zn;
}
var Vn = {}, El;
function ug() {
  if (El) return Vn;
  El = 1, Object.defineProperty(Vn, "__esModule", { value: !0 });
  const e = ce(), t = de(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: s }) => (0, e._)`{passingSchemas: ${s.passing}}`
    },
    code(s) {
      const { gen: i, schema: a, parentSchema: o, it: c } = s;
      if (!Array.isArray(a))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && o.discriminator)
        return;
      const l = a, u = i.let("valid", !1), f = i.let("passing", null), d = i.name("_valid");
      s.setParams({ passing: f }), i.block(b), s.result(u, () => s.reset(), () => s.error(!0));
      function b() {
        l.forEach((v, y) => {
          let p;
          (0, t.alwaysValidSchema)(c, v) ? i.var(d, !0) : p = s.subschema({
            keyword: "oneOf",
            schemaProp: y,
            compositeRule: !0
          }, d), y > 0 && i.if((0, e._)`${d} && ${u}`).assign(u, !1).assign(f, (0, e._)`[${f}, ${y}]`).else(), i.if(d, () => {
            i.assign(u, !0), i.assign(f, y), p && s.mergeEvaluated(p, e.Name);
          });
        });
      }
    }
  };
  return Vn.default = r, Vn;
}
var Bn = {}, $l;
function lg() {
  if ($l) return Bn;
  $l = 1, Object.defineProperty(Bn, "__esModule", { value: !0 });
  const e = de(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(n) {
      const { gen: r, schema: s, it: i } = n;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const a = r.name("valid");
      s.forEach((o, c) => {
        if ((0, e.alwaysValidSchema)(i, o))
          return;
        const l = n.subschema({ keyword: "allOf", schemaProp: c }, a);
        n.ok(a), n.mergeEvaluated(l);
      });
    }
  };
  return Bn.default = t, Bn;
}
var Gn = {}, Sl;
function pg() {
  if (Sl) return Gn;
  Sl = 1, Object.defineProperty(Gn, "__esModule", { value: !0 });
  const e = ce(), t = de(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, e.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, e._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: a, parentSchema: o, it: c } = i;
      o.then === void 0 && o.else === void 0 && (0, t.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const l = s(c, "then"), u = s(c, "else");
      if (!l && !u)
        return;
      const f = a.let("valid", !0), d = a.name("_valid");
      if (b(), i.reset(), l && u) {
        const y = a.let("ifClause");
        i.setParams({ ifClause: y }), a.if(d, v("then", y), v("else", y));
      } else l ? a.if(d, v("then")) : a.if((0, e.not)(d), v("else"));
      i.pass(f, () => i.error(!0));
      function b() {
        const y = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, d);
        i.mergeEvaluated(y);
      }
      function v(y, p) {
        return () => {
          const h = i.subschema({ keyword: y }, d);
          a.assign(f, d), i.mergeValidEvaluated(h, f), p ? a.assign(p, (0, e._)`${y}`) : i.setParams({ ifClause: y });
        };
      }
    }
  };
  function s(i, a) {
    const o = i.schema[a];
    return o !== void 0 && !(0, t.alwaysValidSchema)(i, o);
  }
  return Gn.default = r, Gn;
}
var Hn = {}, Rl;
function dg() {
  if (Rl) return Hn;
  Rl = 1, Object.defineProperty(Hn, "__esModule", { value: !0 });
  const e = de(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: n, parentSchema: r, it: s }) {
      r.if === void 0 && (0, e.checkStrictMode)(s, `"${n}" without "if" is ignored`);
    }
  };
  return Hn.default = t, Hn;
}
var Tl;
function fg() {
  if (Tl) return An;
  Tl = 1, Object.defineProperty(An, "__esModule", { value: !0 });
  const e = Af(), t = eg(), n = If(), r = tg(), s = rg(), i = ng(), a = ag(), o = Cf(), c = sg(), l = ig(), u = og(), f = cg(), d = ug(), b = lg(), v = pg(), y = dg();
  function p(h = !1) {
    const m = [
      // any
      u.default,
      f.default,
      d.default,
      b.default,
      v.default,
      y.default,
      // object
      a.default,
      o.default,
      i.default,
      c.default,
      l.default
    ];
    return h ? m.push(t.default, r.default) : m.push(e.default, n.default), m.push(s.default), m;
  }
  return An.default = p, An;
}
var Kn = {}, Wn = {}, Pl;
function mg() {
  if (Pl) return Wn;
  Pl = 1, Object.defineProperty(Wn, "__esModule", { value: !0 });
  const e = ce(), n = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, e.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, e._)`{format: ${r}}`
    },
    code(r, s) {
      const { gen: i, data: a, $data: o, schema: c, schemaCode: l, it: u } = r, { opts: f, errSchemaPath: d, schemaEnv: b, self: v } = u;
      if (!f.validateFormats)
        return;
      o ? y() : p();
      function y() {
        const h = i.scopeValue("formats", {
          ref: v.formats,
          code: f.code.formats
        }), m = i.const("fDef", (0, e._)`${h}[${l}]`), _ = i.let("fType"), E = i.let("format");
        i.if((0, e._)`typeof ${m} == "object" && !(${m} instanceof RegExp)`, () => i.assign(_, (0, e._)`${m}.type || "string"`).assign(E, (0, e._)`${m}.validate`), () => i.assign(_, (0, e._)`"string"`).assign(E, m)), r.fail$data((0, e.or)(x(), w()));
        function x() {
          return f.strictSchema === !1 ? e.nil : (0, e._)`${l} && !${E}`;
        }
        function w() {
          const S = b.$async ? (0, e._)`(${m}.async ? await ${E}(${a}) : ${E}(${a}))` : (0, e._)`${E}(${a})`, P = (0, e._)`(typeof ${E} == "function" ? ${S} : ${E}.test(${a}))`;
          return (0, e._)`${E} && ${E} !== true && ${_} === ${s} && !${P}`;
        }
      }
      function p() {
        const h = v.formats[c];
        if (!h) {
          x();
          return;
        }
        if (h === !0)
          return;
        const [m, _, E] = w(h);
        m === s && r.pass(S());
        function x() {
          if (f.strictSchema === !1) {
            v.logger.warn(P());
            return;
          }
          throw new Error(P());
          function P() {
            return `unknown format "${c}" ignored in schema at path "${d}"`;
          }
        }
        function w(P) {
          const C = P instanceof RegExp ? (0, e.regexpCode)(P) : f.code.formats ? (0, e._)`${f.code.formats}${(0, e.getProperty)(c)}` : void 0, M = i.scopeValue("formats", { key: c, ref: P, code: C });
          return typeof P == "object" && !(P instanceof RegExp) ? [P.type || "string", P.validate, (0, e._)`${M}.validate`] : ["string", P, M];
        }
        function S() {
          if (typeof h == "object" && !(h instanceof RegExp) && h.async) {
            if (!b.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${E}(${a})`;
          }
          return typeof _ == "function" ? (0, e._)`${E}(${a})` : (0, e._)`${E}.test(${a})`;
        }
      }
    }
  };
  return Wn.default = n, Wn;
}
var Ol;
function hg() {
  if (Ol) return Kn;
  Ol = 1, Object.defineProperty(Kn, "__esModule", { value: !0 });
  const t = [mg().default];
  return Kn.default = t, Kn;
}
var St = {}, Nl;
function vg() {
  return Nl || (Nl = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.contentVocabulary = St.metadataVocabulary = void 0, St.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], St.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), St;
}
var kl;
function yg() {
  if (kl) return yn;
  kl = 1, Object.defineProperty(yn, "__esModule", { value: !0 });
  const e = Uy(), t = Zy(), n = fg(), r = hg(), s = vg(), i = [
    e.default,
    t.default,
    (0, n.default)(),
    r.default,
    s.metadataVocabulary,
    s.contentVocabulary
  ];
  return yn.default = i, yn;
}
var Jn = {}, tr = {}, jl;
function gg() {
  if (jl) return tr;
  jl = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (tr.DiscrError = e = {})), tr;
}
var Al;
function bg() {
  if (Al) return Jn;
  Al = 1, Object.defineProperty(Jn, "__esModule", { value: !0 });
  const e = ce(), t = gg(), n = To(), r = Pa(), s = de(), a = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: o, tagName: c } }) => o === t.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: o, tag: c, tagName: l } }) => (0, e._)`{error: ${o}, tag: ${l}, tagValue: ${c}}`
    },
    code(o) {
      const { gen: c, data: l, schema: u, parentSchema: f, it: d } = o, { oneOf: b } = f;
      if (!d.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const v = u.propertyName;
      if (typeof v != "string")
        throw new Error("discriminator: requires propertyName");
      if (u.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!b)
        throw new Error("discriminator: requires oneOf keyword");
      const y = c.let("valid", !1), p = c.const("tag", (0, e._)`${l}${(0, e.getProperty)(v)}`);
      c.if((0, e._)`typeof ${p} == "string"`, () => h(), () => o.error(!1, { discrError: t.DiscrError.Tag, tag: p, tagName: v })), o.ok(y);
      function h() {
        const E = _();
        c.if(!1);
        for (const x in E)
          c.elseIf((0, e._)`${p} === ${x}`), c.assign(y, m(E[x]));
        c.else(), o.error(!1, { discrError: t.DiscrError.Mapping, tag: p, tagName: v }), c.endIf();
      }
      function m(E) {
        const x = c.name("valid"), w = o.subschema({ keyword: "oneOf", schemaProp: E }, x);
        return o.mergeEvaluated(w, e.Name), x;
      }
      function _() {
        var E;
        const x = {}, w = P(f);
        let S = !0;
        for (let L = 0; L < b.length; L++) {
          let G = b[L];
          if (G?.$ref && !(0, s.schemaHasRulesButRef)(G, d.self.RULES)) {
            const F = G.$ref;
            if (G = n.resolveRef.call(d.self, d.schemaEnv.root, d.baseId, F), G instanceof n.SchemaEnv && (G = G.schema), G === void 0)
              throw new r.default(d.opts.uriResolver, d.baseId, F);
          }
          const H = (E = G?.properties) === null || E === void 0 ? void 0 : E[v];
          if (typeof H != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${v}"`);
          S = S && (w || P(G)), C(H, L);
        }
        if (!S)
          throw new Error(`discriminator: "${v}" must be required`);
        return x;
        function P({ required: L }) {
          return Array.isArray(L) && L.includes(v);
        }
        function C(L, G) {
          if (L.const)
            M(L.const, G);
          else if (L.enum)
            for (const H of L.enum)
              M(H, G);
          else
            throw new Error(`discriminator: "properties/${v}" must have "const" or "enum"`);
        }
        function M(L, G) {
          if (typeof L != "string" || L in x)
            throw new Error(`discriminator: "${v}" values must be unique strings`);
          x[L] = G;
        }
      }
    }
  };
  return Jn.default = a, Jn;
}
const _g = "http://json-schema.org/draft-07/schema#", xg = "http://json-schema.org/draft-07/schema#", wg = "Core schema meta-schema", Eg = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, $g = ["object", "boolean"], Sg = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Rg = {
  $schema: _g,
  $id: xg,
  title: wg,
  definitions: Eg,
  type: $g,
  properties: Sg,
  default: !0
};
var Il;
function Tg() {
  return Il || (Il = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
    const n = Dy(), r = yg(), s = bg(), i = Rg, a = ["/properties"], o = "http://json-schema.org/draft-07/schema";
    class c extends n.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const v = this.opts.$data ? this.$dataMetaSchema(i, a) : i;
        this.addMetaSchema(v, o, !1), this.refs["http://json-schema.org/schema"] = o;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
      }
    }
    t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
    var l = Ta();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return l.KeywordCxt;
    } });
    var u = ce();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return u._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return u.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return u.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return u.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return u.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return u.CodeGen;
    } });
    var f = Ro();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return f.default;
    } });
    var d = Pa();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return d.default;
    } });
  })(dn, dn.exports)), dn.exports;
}
var Cl;
function Pg() {
  return Cl || (Cl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const t = Tg(), n = ce(), r = n.operators, s = {
      formatMaximum: { okStr: "<=", ok: r.LTE, fail: r.GT },
      formatMinimum: { okStr: ">=", ok: r.GTE, fail: r.LT },
      formatExclusiveMaximum: { okStr: "<", ok: r.LT, fail: r.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: r.GT, fail: r.LTE }
    }, i = {
      message: ({ keyword: o, schemaCode: c }) => (0, n.str)`should be ${s[o].okStr} ${c}`,
      params: ({ keyword: o, schemaCode: c }) => (0, n._)`{comparison: ${s[o].okStr}, limit: ${c}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(s),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: i,
      code(o) {
        const { gen: c, data: l, schemaCode: u, keyword: f, it: d } = o, { opts: b, self: v } = d;
        if (!b.validateFormats)
          return;
        const y = new t.KeywordCxt(d, v.RULES.all.format.definition, "format");
        y.$data ? p() : h();
        function p() {
          const _ = c.scopeValue("formats", {
            ref: v.formats,
            code: b.code.formats
          }), E = c.const("fmt", (0, n._)`${_}[${y.schemaCode}]`);
          o.fail$data((0, n.or)((0, n._)`typeof ${E} != "object"`, (0, n._)`${E} instanceof RegExp`, (0, n._)`typeof ${E}.compare != "function"`, m(E)));
        }
        function h() {
          const _ = y.schema, E = v.formats[_];
          if (!E || E === !0)
            return;
          if (typeof E != "object" || E instanceof RegExp || typeof E.compare != "function")
            throw new Error(`"${f}": format "${_}" does not define "compare" function`);
          const x = c.scopeValue("formats", {
            key: _,
            ref: E,
            code: b.code.formats ? (0, n._)`${b.code.formats}${(0, n.getProperty)(_)}` : void 0
          });
          o.fail$data(m(x));
        }
        function m(_) {
          return (0, n._)`${_}.compare(${l}, ${u}) ${s[f].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const a = (o) => (o.addKeyword(e.formatLimitDefinition), o);
    e.default = a;
  })(rs)), rs;
}
var ql;
function Og() {
  return ql || (ql = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 });
    const n = $y(), r = Pg(), s = ce(), i = new s.Name("fullFormats"), a = new s.Name("fastFormats"), o = (l, u = { keywords: !0 }) => {
      if (Array.isArray(u))
        return c(l, u, n.fullFormats, i), l;
      const [f, d] = u.mode === "fast" ? [n.fastFormats, a] : [n.fullFormats, i], b = u.formats || n.formatNames;
      return c(l, b, f, d), u.keywords && (0, r.default)(l), l;
    };
    o.get = (l, u = "full") => {
      const d = (u === "fast" ? n.fastFormats : n.fullFormats)[l];
      if (!d)
        throw new Error(`Unknown format "${l}"`);
      return d;
    };
    function c(l, u, f, d) {
      var b, v;
      (b = (v = l.opts.code).formats) !== null && b !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${d}`);
      for (const y of u)
        l.addFormat(y, f[y]);
    }
    e.exports = t = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
  })(pn, pn.exports)), pn.exports;
}
var Ng = Og();
const kg = /* @__PURE__ */ ir(Ng), jg = (e, t, n, r) => {
  if (n === "length" || n === "prototype" || n === "arguments" || n === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, n), i = Object.getOwnPropertyDescriptor(t, n);
  !Ag(s, i) && r || Object.defineProperty(e, n, i);
}, Ag = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Ig = (e, t) => {
  const n = Object.getPrototypeOf(t);
  n !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, n);
}, Cg = (e, t) => `/* Wrapped ${e}*/
${t}`, qg = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Lg = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Dg = (e, t, n) => {
  const r = n === "" ? "" : `with ${n.trim()}() `, s = Cg.bind(null, r, t.toString());
  Object.defineProperty(s, "name", Lg);
  const { writable: i, enumerable: a, configurable: o } = qg;
  Object.defineProperty(e, "toString", { value: s, writable: i, enumerable: a, configurable: o });
};
function Fg(e, t, { ignoreNonConfigurable: n = !1 } = {}) {
  const { name: r } = e;
  for (const s of Reflect.ownKeys(t))
    jg(e, t, s, n);
  return Ig(e, t), Dg(e, t, r), e;
}
const Ll = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: n = 0,
    maxWait: r = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: i = !0
  } = t;
  if (n < 0 || r < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !i)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, o, c;
  const l = function(...u) {
    const f = this, d = () => {
      a = void 0, o && (clearTimeout(o), o = void 0), i && (c = e.apply(f, u));
    }, b = () => {
      o = void 0, a && (clearTimeout(a), a = void 0), i && (c = e.apply(f, u));
    }, v = s && !a;
    return clearTimeout(a), a = setTimeout(d, n), r > 0 && r !== Number.POSITIVE_INFINITY && !o && (o = setTimeout(b, r)), v && (c = e.apply(f, u)), c;
  };
  return Fg(l, e), l.cancel = () => {
    a && (clearTimeout(a), a = void 0), o && (clearTimeout(o), o = void 0);
  }, l;
};
var Xn = { exports: {} }, ls, Dl;
function Oa() {
  if (Dl) return ls;
  Dl = 1;
  const e = "2.0.0", t = 256, n = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, r = 16, s = t - 6;
  return ls = {
    MAX_LENGTH: t,
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: s,
    MAX_SAFE_INTEGER: n,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, ls;
}
var ps, Fl;
function Na() {
  return Fl || (Fl = 1, ps = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
  }), ps;
}
var Ml;
function or() {
  return Ml || (Ml = 1, (function(e, t) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: n,
      MAX_SAFE_BUILD_LENGTH: r,
      MAX_LENGTH: s
    } = Oa(), i = Na();
    t = e.exports = {};
    const a = t.re = [], o = t.safeRe = [], c = t.src = [], l = t.safeSrc = [], u = t.t = {};
    let f = 0;
    const d = "[a-zA-Z0-9-]", b = [
      ["\\s", 1],
      ["\\d", s],
      [d, r]
    ], v = (p) => {
      for (const [h, m] of b)
        p = p.split(`${h}*`).join(`${h}{0,${m}}`).split(`${h}+`).join(`${h}{1,${m}}`);
      return p;
    }, y = (p, h, m) => {
      const _ = v(h), E = f++;
      i(p, E, h), u[p] = E, c[E] = h, l[E] = _, a[E] = new RegExp(h, m ? "g" : void 0), o[E] = new RegExp(_, m ? "g" : void 0);
    };
    y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), y("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${d}+`), y("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), y("FULL", `^${c[u.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), y("LOOSE", `^${c[u.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), y("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), y("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", c[u.COERCE], !0), y("COERCERTLFULL", c[u.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Xn, Xn.exports)), Xn.exports;
}
var ds, Ul;
function Oo() {
  if (Ul) return ds;
  Ul = 1;
  const e = Object.freeze({ loose: !0 }), t = Object.freeze({});
  return ds = (r) => r ? typeof r != "object" ? e : r : t, ds;
}
var fs, zl;
function qf() {
  if (zl) return fs;
  zl = 1;
  const e = /^[0-9]+$/, t = (r, s) => {
    if (typeof r == "number" && typeof s == "number")
      return r === s ? 0 : r < s ? -1 : 1;
    const i = e.test(r), a = e.test(s);
    return i && a && (r = +r, s = +s), r === s ? 0 : i && !a ? -1 : a && !i ? 1 : r < s ? -1 : 1;
  };
  return fs = {
    compareIdentifiers: t,
    rcompareIdentifiers: (r, s) => t(s, r)
  }, fs;
}
var ms, Vl;
function Ie() {
  if (Vl) return ms;
  Vl = 1;
  const e = Na(), { MAX_LENGTH: t, MAX_SAFE_INTEGER: n } = Oa(), { safeRe: r, t: s } = or(), i = Oo(), { compareIdentifiers: a } = qf();
  class o {
    constructor(l, u) {
      if (u = i(u), l instanceof o) {
        if (l.loose === !!u.loose && l.includePrerelease === !!u.includePrerelease)
          return l;
        l = l.version;
      } else if (typeof l != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof l}".`);
      if (l.length > t)
        throw new TypeError(
          `version is longer than ${t} characters`
        );
      e("SemVer", l, u), this.options = u, this.loose = !!u.loose, this.includePrerelease = !!u.includePrerelease;
      const f = l.trim().match(u.loose ? r[s.LOOSE] : r[s.FULL]);
      if (!f)
        throw new TypeError(`Invalid Version: ${l}`);
      if (this.raw = l, this.major = +f[1], this.minor = +f[2], this.patch = +f[3], this.major > n || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > n || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > n || this.patch < 0)
        throw new TypeError("Invalid patch version");
      f[4] ? this.prerelease = f[4].split(".").map((d) => {
        if (/^[0-9]+$/.test(d)) {
          const b = +d;
          if (b >= 0 && b < n)
            return b;
        }
        return d;
      }) : this.prerelease = [], this.build = f[5] ? f[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(l) {
      if (e("SemVer.compare", this.version, this.options, l), !(l instanceof o)) {
        if (typeof l == "string" && l === this.version)
          return 0;
        l = new o(l, this.options);
      }
      return l.version === this.version ? 0 : this.compareMain(l) || this.comparePre(l);
    }
    compareMain(l) {
      return l instanceof o || (l = new o(l, this.options)), this.major < l.major ? -1 : this.major > l.major ? 1 : this.minor < l.minor ? -1 : this.minor > l.minor ? 1 : this.patch < l.patch ? -1 : this.patch > l.patch ? 1 : 0;
    }
    comparePre(l) {
      if (l instanceof o || (l = new o(l, this.options)), this.prerelease.length && !l.prerelease.length)
        return -1;
      if (!this.prerelease.length && l.prerelease.length)
        return 1;
      if (!this.prerelease.length && !l.prerelease.length)
        return 0;
      let u = 0;
      do {
        const f = this.prerelease[u], d = l.prerelease[u];
        if (e("prerelease compare", u, f, d), f === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (f === void 0)
          return -1;
        if (f === d)
          continue;
        return a(f, d);
      } while (++u);
    }
    compareBuild(l) {
      l instanceof o || (l = new o(l, this.options));
      let u = 0;
      do {
        const f = this.build[u], d = l.build[u];
        if (e("build compare", u, f, d), f === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (f === void 0)
          return -1;
        if (f === d)
          continue;
        return a(f, d);
      } while (++u);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(l, u, f) {
      if (l.startsWith("pre")) {
        if (!u && f === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (u) {
          const d = `-${u}`.match(this.options.loose ? r[s.PRERELEASELOOSE] : r[s.PRERELEASE]);
          if (!d || d[1] !== u)
            throw new Error(`invalid identifier: ${u}`);
        }
      }
      switch (l) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", u, f);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", u, f);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", u, f), this.inc("pre", u, f);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", u, f), this.inc("pre", u, f);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const d = Number(f) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [d];
          else {
            let b = this.prerelease.length;
            for (; --b >= 0; )
              typeof this.prerelease[b] == "number" && (this.prerelease[b]++, b = -2);
            if (b === -1) {
              if (u === this.prerelease.join(".") && f === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(d);
            }
          }
          if (u) {
            let b = [u, d];
            f === !1 && (b = [u]), a(this.prerelease[0], u) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = b) : this.prerelease = b;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${l}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return ms = o, ms;
}
var hs, Bl;
function Kt() {
  if (Bl) return hs;
  Bl = 1;
  const e = Ie();
  return hs = (n, r, s = !1) => {
    if (n instanceof e)
      return n;
    try {
      return new e(n, r);
    } catch (i) {
      if (!s)
        return null;
      throw i;
    }
  }, hs;
}
var vs, Gl;
function Mg() {
  if (Gl) return vs;
  Gl = 1;
  const e = Kt();
  return vs = (n, r) => {
    const s = e(n, r);
    return s ? s.version : null;
  }, vs;
}
var ys, Hl;
function Ug() {
  if (Hl) return ys;
  Hl = 1;
  const e = Kt();
  return ys = (n, r) => {
    const s = e(n.trim().replace(/^[=v]+/, ""), r);
    return s ? s.version : null;
  }, ys;
}
var gs, Kl;
function zg() {
  if (Kl) return gs;
  Kl = 1;
  const e = Ie();
  return gs = (n, r, s, i, a) => {
    typeof s == "string" && (a = i, i = s, s = void 0);
    try {
      return new e(
        n instanceof e ? n.version : n,
        s
      ).inc(r, i, a).version;
    } catch {
      return null;
    }
  }, gs;
}
var bs, Wl;
function Vg() {
  if (Wl) return bs;
  Wl = 1;
  const e = Kt();
  return bs = (n, r) => {
    const s = e(n, null, !0), i = e(r, null, !0), a = s.compare(i);
    if (a === 0)
      return null;
    const o = a > 0, c = o ? s : i, l = o ? i : s, u = !!c.prerelease.length;
    if (!!l.prerelease.length && !u) {
      if (!l.patch && !l.minor)
        return "major";
      if (l.compareMain(c) === 0)
        return l.minor && !l.patch ? "minor" : "patch";
    }
    const d = u ? "pre" : "";
    return s.major !== i.major ? d + "major" : s.minor !== i.minor ? d + "minor" : s.patch !== i.patch ? d + "patch" : "prerelease";
  }, bs;
}
var _s, Jl;
function Bg() {
  if (Jl) return _s;
  Jl = 1;
  const e = Ie();
  return _s = (n, r) => new e(n, r).major, _s;
}
var xs, Xl;
function Gg() {
  if (Xl) return xs;
  Xl = 1;
  const e = Ie();
  return xs = (n, r) => new e(n, r).minor, xs;
}
var ws, Yl;
function Hg() {
  if (Yl) return ws;
  Yl = 1;
  const e = Ie();
  return ws = (n, r) => new e(n, r).patch, ws;
}
var Es, Ql;
function Kg() {
  if (Ql) return Es;
  Ql = 1;
  const e = Kt();
  return Es = (n, r) => {
    const s = e(n, r);
    return s && s.prerelease.length ? s.prerelease : null;
  }, Es;
}
var $s, Zl;
function We() {
  if (Zl) return $s;
  Zl = 1;
  const e = Ie();
  return $s = (n, r, s) => new e(n, s).compare(new e(r, s)), $s;
}
var Ss, ep;
function Wg() {
  if (ep) return Ss;
  ep = 1;
  const e = We();
  return Ss = (n, r, s) => e(r, n, s), Ss;
}
var Rs, tp;
function Jg() {
  if (tp) return Rs;
  tp = 1;
  const e = We();
  return Rs = (n, r) => e(n, r, !0), Rs;
}
var Ts, rp;
function No() {
  if (rp) return Ts;
  rp = 1;
  const e = Ie();
  return Ts = (n, r, s) => {
    const i = new e(n, s), a = new e(r, s);
    return i.compare(a) || i.compareBuild(a);
  }, Ts;
}
var Ps, np;
function Xg() {
  if (np) return Ps;
  np = 1;
  const e = No();
  return Ps = (n, r) => n.sort((s, i) => e(s, i, r)), Ps;
}
var Os, ap;
function Yg() {
  if (ap) return Os;
  ap = 1;
  const e = No();
  return Os = (n, r) => n.sort((s, i) => e(i, s, r)), Os;
}
var Ns, sp;
function ka() {
  if (sp) return Ns;
  sp = 1;
  const e = We();
  return Ns = (n, r, s) => e(n, r, s) > 0, Ns;
}
var ks, ip;
function ko() {
  if (ip) return ks;
  ip = 1;
  const e = We();
  return ks = (n, r, s) => e(n, r, s) < 0, ks;
}
var js, op;
function Lf() {
  if (op) return js;
  op = 1;
  const e = We();
  return js = (n, r, s) => e(n, r, s) === 0, js;
}
var As, cp;
function Df() {
  if (cp) return As;
  cp = 1;
  const e = We();
  return As = (n, r, s) => e(n, r, s) !== 0, As;
}
var Is, up;
function jo() {
  if (up) return Is;
  up = 1;
  const e = We();
  return Is = (n, r, s) => e(n, r, s) >= 0, Is;
}
var Cs, lp;
function Ao() {
  if (lp) return Cs;
  lp = 1;
  const e = We();
  return Cs = (n, r, s) => e(n, r, s) <= 0, Cs;
}
var qs, pp;
function Ff() {
  if (pp) return qs;
  pp = 1;
  const e = Lf(), t = Df(), n = ka(), r = jo(), s = ko(), i = Ao();
  return qs = (o, c, l, u) => {
    switch (c) {
      case "===":
        return typeof o == "object" && (o = o.version), typeof l == "object" && (l = l.version), o === l;
      case "!==":
        return typeof o == "object" && (o = o.version), typeof l == "object" && (l = l.version), o !== l;
      case "":
      case "=":
      case "==":
        return e(o, l, u);
      case "!=":
        return t(o, l, u);
      case ">":
        return n(o, l, u);
      case ">=":
        return r(o, l, u);
      case "<":
        return s(o, l, u);
      case "<=":
        return i(o, l, u);
      default:
        throw new TypeError(`Invalid operator: ${c}`);
    }
  }, qs;
}
var Ls, dp;
function Qg() {
  if (dp) return Ls;
  dp = 1;
  const e = Ie(), t = Kt(), { safeRe: n, t: r } = or();
  return Ls = (i, a) => {
    if (i instanceof e)
      return i;
    if (typeof i == "number" && (i = String(i)), typeof i != "string")
      return null;
    a = a || {};
    let o = null;
    if (!a.rtl)
      o = i.match(a.includePrerelease ? n[r.COERCEFULL] : n[r.COERCE]);
    else {
      const b = a.includePrerelease ? n[r.COERCERTLFULL] : n[r.COERCERTL];
      let v;
      for (; (v = b.exec(i)) && (!o || o.index + o[0].length !== i.length); )
        (!o || v.index + v[0].length !== o.index + o[0].length) && (o = v), b.lastIndex = v.index + v[1].length + v[2].length;
      b.lastIndex = -1;
    }
    if (o === null)
      return null;
    const c = o[2], l = o[3] || "0", u = o[4] || "0", f = a.includePrerelease && o[5] ? `-${o[5]}` : "", d = a.includePrerelease && o[6] ? `+${o[6]}` : "";
    return t(`${c}.${l}.${u}${f}${d}`, a);
  }, Ls;
}
var Ds, fp;
function Zg() {
  if (fp) return Ds;
  fp = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(n) {
      const r = this.map.get(n);
      if (r !== void 0)
        return this.map.delete(n), this.map.set(n, r), r;
    }
    delete(n) {
      return this.map.delete(n);
    }
    set(n, r) {
      if (!this.delete(n) && r !== void 0) {
        if (this.map.size >= this.max) {
          const i = this.map.keys().next().value;
          this.delete(i);
        }
        this.map.set(n, r);
      }
      return this;
    }
  }
  return Ds = e, Ds;
}
var Fs, mp;
function Je() {
  if (mp) return Fs;
  mp = 1;
  const e = /\s+/g;
  class t {
    constructor(K, q) {
      if (q = s(q), K instanceof t)
        return K.loose === !!q.loose && K.includePrerelease === !!q.includePrerelease ? K : new t(K.raw, q);
      if (K instanceof i)
        return this.raw = K.value, this.set = [[K]], this.formatted = void 0, this;
      if (this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease, this.raw = K.trim().replace(e, " "), this.set = this.raw.split("||").map((U) => this.parseRange(U.trim())).filter((U) => U.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const U = this.set[0];
        if (this.set = this.set.filter((D) => !y(D[0])), this.set.length === 0)
          this.set = [U];
        else if (this.set.length > 1) {
          for (const D of this.set)
            if (D.length === 1 && p(D[0])) {
              this.set = [D];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let K = 0; K < this.set.length; K++) {
          K > 0 && (this.formatted += "||");
          const q = this.set[K];
          for (let U = 0; U < q.length; U++)
            U > 0 && (this.formatted += " "), this.formatted += q[U].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(K) {
      const U = ((this.options.includePrerelease && b) | (this.options.loose && v)) + ":" + K, D = r.get(U);
      if (D)
        return D;
      const J = this.options.loose, A = J ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      K = K.replace(A, G(this.options.includePrerelease)), a("hyphen replace", K), K = K.replace(c[l.COMPARATORTRIM], u), a("comparator trim", K), K = K.replace(c[l.TILDETRIM], f), a("tilde trim", K), K = K.replace(c[l.CARETTRIM], d), a("caret trim", K);
      let R = K.split(" ").map(($) => m($, this.options)).join(" ").split(/\s+/).map(($) => L($, this.options));
      J && (R = R.filter(($) => (a("loose invalid filter", $, this.options), !!$.match(c[l.COMPARATORLOOSE])))), a("range list", R);
      const j = /* @__PURE__ */ new Map(), O = R.map(($) => new i($, this.options));
      for (const $ of O) {
        if (y($))
          return [$];
        j.set($.value, $);
      }
      j.size > 1 && j.has("") && j.delete("");
      const g = [...j.values()];
      return r.set(U, g), g;
    }
    intersects(K, q) {
      if (!(K instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((U) => h(U, q) && K.set.some((D) => h(D, q) && U.every((J) => D.every((A) => J.intersects(A, q)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(K) {
      if (!K)
        return !1;
      if (typeof K == "string")
        try {
          K = new o(K, this.options);
        } catch {
          return !1;
        }
      for (let q = 0; q < this.set.length; q++)
        if (H(this.set[q], K, this.options))
          return !0;
      return !1;
    }
  }
  Fs = t;
  const n = Zg(), r = new n(), s = Oo(), i = ja(), a = Na(), o = Ie(), {
    safeRe: c,
    t: l,
    comparatorTrimReplace: u,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = or(), { FLAG_INCLUDE_PRERELEASE: b, FLAG_LOOSE: v } = Oa(), y = (F) => F.value === "<0.0.0-0", p = (F) => F.value === "", h = (F, K) => {
    let q = !0;
    const U = F.slice();
    let D = U.pop();
    for (; q && U.length; )
      q = U.every((J) => D.intersects(J, K)), D = U.pop();
    return q;
  }, m = (F, K) => (F = F.replace(c[l.BUILD], ""), a("comp", F, K), F = w(F, K), a("caret", F), F = E(F, K), a("tildes", F), F = P(F, K), a("xrange", F), F = M(F, K), a("stars", F), F), _ = (F) => !F || F.toLowerCase() === "x" || F === "*", E = (F, K) => F.trim().split(/\s+/).map((q) => x(q, K)).join(" "), x = (F, K) => {
    const q = K.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return F.replace(q, (U, D, J, A, R) => {
      a("tilde", F, U, D, J, A, R);
      let j;
      return _(D) ? j = "" : _(J) ? j = `>=${D}.0.0 <${+D + 1}.0.0-0` : _(A) ? j = `>=${D}.${J}.0 <${D}.${+J + 1}.0-0` : R ? (a("replaceTilde pr", R), j = `>=${D}.${J}.${A}-${R} <${D}.${+J + 1}.0-0`) : j = `>=${D}.${J}.${A} <${D}.${+J + 1}.0-0`, a("tilde return", j), j;
    });
  }, w = (F, K) => F.trim().split(/\s+/).map((q) => S(q, K)).join(" "), S = (F, K) => {
    a("caret", F, K);
    const q = K.loose ? c[l.CARETLOOSE] : c[l.CARET], U = K.includePrerelease ? "-0" : "";
    return F.replace(q, (D, J, A, R, j) => {
      a("caret", F, D, J, A, R, j);
      let O;
      return _(J) ? O = "" : _(A) ? O = `>=${J}.0.0${U} <${+J + 1}.0.0-0` : _(R) ? J === "0" ? O = `>=${J}.${A}.0${U} <${J}.${+A + 1}.0-0` : O = `>=${J}.${A}.0${U} <${+J + 1}.0.0-0` : j ? (a("replaceCaret pr", j), J === "0" ? A === "0" ? O = `>=${J}.${A}.${R}-${j} <${J}.${A}.${+R + 1}-0` : O = `>=${J}.${A}.${R}-${j} <${J}.${+A + 1}.0-0` : O = `>=${J}.${A}.${R}-${j} <${+J + 1}.0.0-0`) : (a("no pr"), J === "0" ? A === "0" ? O = `>=${J}.${A}.${R}${U} <${J}.${A}.${+R + 1}-0` : O = `>=${J}.${A}.${R}${U} <${J}.${+A + 1}.0-0` : O = `>=${J}.${A}.${R} <${+J + 1}.0.0-0`), a("caret return", O), O;
    });
  }, P = (F, K) => (a("replaceXRanges", F, K), F.split(/\s+/).map((q) => C(q, K)).join(" ")), C = (F, K) => {
    F = F.trim();
    const q = K.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return F.replace(q, (U, D, J, A, R, j) => {
      a("xRange", F, U, D, J, A, R, j);
      const O = _(J), g = O || _(A), $ = g || _(R), k = $;
      return D === "=" && k && (D = ""), j = K.includePrerelease ? "-0" : "", O ? D === ">" || D === "<" ? U = "<0.0.0-0" : U = "*" : D && k ? (g && (A = 0), R = 0, D === ">" ? (D = ">=", g ? (J = +J + 1, A = 0, R = 0) : (A = +A + 1, R = 0)) : D === "<=" && (D = "<", g ? J = +J + 1 : A = +A + 1), D === "<" && (j = "-0"), U = `${D + J}.${A}.${R}${j}`) : g ? U = `>=${J}.0.0${j} <${+J + 1}.0.0-0` : $ && (U = `>=${J}.${A}.0${j} <${J}.${+A + 1}.0-0`), a("xRange return", U), U;
    });
  }, M = (F, K) => (a("replaceStars", F, K), F.trim().replace(c[l.STAR], "")), L = (F, K) => (a("replaceGTE0", F, K), F.trim().replace(c[K.includePrerelease ? l.GTE0PRE : l.GTE0], "")), G = (F) => (K, q, U, D, J, A, R, j, O, g, $, k) => (_(U) ? q = "" : _(D) ? q = `>=${U}.0.0${F ? "-0" : ""}` : _(J) ? q = `>=${U}.${D}.0${F ? "-0" : ""}` : A ? q = `>=${q}` : q = `>=${q}${F ? "-0" : ""}`, _(O) ? j = "" : _(g) ? j = `<${+O + 1}.0.0-0` : _($) ? j = `<${O}.${+g + 1}.0-0` : k ? j = `<=${O}.${g}.${$}-${k}` : F ? j = `<${O}.${g}.${+$ + 1}-0` : j = `<=${j}`, `${q} ${j}`.trim()), H = (F, K, q) => {
    for (let U = 0; U < F.length; U++)
      if (!F[U].test(K))
        return !1;
    if (K.prerelease.length && !q.includePrerelease) {
      for (let U = 0; U < F.length; U++)
        if (a(F[U].semver), F[U].semver !== i.ANY && F[U].semver.prerelease.length > 0) {
          const D = F[U].semver;
          if (D.major === K.major && D.minor === K.minor && D.patch === K.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Fs;
}
var Ms, hp;
function ja() {
  if (hp) return Ms;
  hp = 1;
  const e = /* @__PURE__ */ Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, f) {
      if (f = n(f), u instanceof t) {
        if (u.loose === !!f.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), a("comparator", u, f), this.options = f, this.loose = !!f.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(u) {
      const f = this.options.loose ? r[s.COMPARATORLOOSE] : r[s.COMPARATOR], d = u.match(f);
      if (!d)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new o(d[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (a("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new o(u, this.options);
        } catch {
          return !1;
        }
      return i(u, this.operator, this.semver, this.options);
    }
    intersects(u, f) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, f).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, f).test(u.semver) : (f = n(f), f.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || i(this.semver, "<", u.semver, f) && this.operator.startsWith(">") && u.operator.startsWith("<") || i(this.semver, ">", u.semver, f) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  Ms = t;
  const n = Oo(), { safeRe: r, t: s } = or(), i = Ff(), a = Na(), o = Ie(), c = Je();
  return Ms;
}
var Us, vp;
function Aa() {
  if (vp) return Us;
  vp = 1;
  const e = Je();
  return Us = (n, r, s) => {
    try {
      r = new e(r, s);
    } catch {
      return !1;
    }
    return r.test(n);
  }, Us;
}
var zs, yp;
function eb() {
  if (yp) return zs;
  yp = 1;
  const e = Je();
  return zs = (n, r) => new e(n, r).set.map((s) => s.map((i) => i.value).join(" ").trim().split(" ")), zs;
}
var Vs, gp;
function tb() {
  if (gp) return Vs;
  gp = 1;
  const e = Ie(), t = Je();
  return Vs = (r, s, i) => {
    let a = null, o = null, c = null;
    try {
      c = new t(s, i);
    } catch {
      return null;
    }
    return r.forEach((l) => {
      c.test(l) && (!a || o.compare(l) === -1) && (a = l, o = new e(a, i));
    }), a;
  }, Vs;
}
var Bs, bp;
function rb() {
  if (bp) return Bs;
  bp = 1;
  const e = Ie(), t = Je();
  return Bs = (r, s, i) => {
    let a = null, o = null, c = null;
    try {
      c = new t(s, i);
    } catch {
      return null;
    }
    return r.forEach((l) => {
      c.test(l) && (!a || o.compare(l) === 1) && (a = l, o = new e(a, i));
    }), a;
  }, Bs;
}
var Gs, _p;
function nb() {
  if (_p) return Gs;
  _p = 1;
  const e = Ie(), t = Je(), n = ka();
  return Gs = (s, i) => {
    s = new t(s, i);
    let a = new e("0.0.0");
    if (s.test(a) || (a = new e("0.0.0-0"), s.test(a)))
      return a;
    a = null;
    for (let o = 0; o < s.set.length; ++o) {
      const c = s.set[o];
      let l = null;
      c.forEach((u) => {
        const f = new e(u.semver.version);
        switch (u.operator) {
          case ">":
            f.prerelease.length === 0 ? f.patch++ : f.prerelease.push(0), f.raw = f.format();
          /* fallthrough */
          case "":
          case ">=":
            (!l || n(f, l)) && (l = f);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${u.operator}`);
        }
      }), l && (!a || n(a, l)) && (a = l);
    }
    return a && s.test(a) ? a : null;
  }, Gs;
}
var Hs, xp;
function ab() {
  if (xp) return Hs;
  xp = 1;
  const e = Je();
  return Hs = (n, r) => {
    try {
      return new e(n, r).range || "*";
    } catch {
      return null;
    }
  }, Hs;
}
var Ks, wp;
function Io() {
  if (wp) return Ks;
  wp = 1;
  const e = Ie(), t = ja(), { ANY: n } = t, r = Je(), s = Aa(), i = ka(), a = ko(), o = Ao(), c = jo();
  return Ks = (u, f, d, b) => {
    u = new e(u, b), f = new r(f, b);
    let v, y, p, h, m;
    switch (d) {
      case ">":
        v = i, y = o, p = a, h = ">", m = ">=";
        break;
      case "<":
        v = a, y = c, p = i, h = "<", m = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (s(u, f, b))
      return !1;
    for (let _ = 0; _ < f.set.length; ++_) {
      const E = f.set[_];
      let x = null, w = null;
      if (E.forEach((S) => {
        S.semver === n && (S = new t(">=0.0.0")), x = x || S, w = w || S, v(S.semver, x.semver, b) ? x = S : p(S.semver, w.semver, b) && (w = S);
      }), x.operator === h || x.operator === m || (!w.operator || w.operator === h) && y(u, w.semver))
        return !1;
      if (w.operator === m && p(u, w.semver))
        return !1;
    }
    return !0;
  }, Ks;
}
var Ws, Ep;
function sb() {
  if (Ep) return Ws;
  Ep = 1;
  const e = Io();
  return Ws = (n, r, s) => e(n, r, ">", s), Ws;
}
var Js, $p;
function ib() {
  if ($p) return Js;
  $p = 1;
  const e = Io();
  return Js = (n, r, s) => e(n, r, "<", s), Js;
}
var Xs, Sp;
function ob() {
  if (Sp) return Xs;
  Sp = 1;
  const e = Je();
  return Xs = (n, r, s) => (n = new e(n, s), r = new e(r, s), n.intersects(r, s)), Xs;
}
var Ys, Rp;
function cb() {
  if (Rp) return Ys;
  Rp = 1;
  const e = Aa(), t = We();
  return Ys = (n, r, s) => {
    const i = [];
    let a = null, o = null;
    const c = n.sort((d, b) => t(d, b, s));
    for (const d of c)
      e(d, r, s) ? (o = d, a || (a = d)) : (o && i.push([a, o]), o = null, a = null);
    a && i.push([a, null]);
    const l = [];
    for (const [d, b] of i)
      d === b ? l.push(d) : !b && d === c[0] ? l.push("*") : b ? d === c[0] ? l.push(`<=${b}`) : l.push(`${d} - ${b}`) : l.push(`>=${d}`);
    const u = l.join(" || "), f = typeof r.raw == "string" ? r.raw : String(r);
    return u.length < f.length ? u : r;
  }, Ys;
}
var Qs, Tp;
function ub() {
  if (Tp) return Qs;
  Tp = 1;
  const e = Je(), t = ja(), { ANY: n } = t, r = Aa(), s = We(), i = (f, d, b = {}) => {
    if (f === d)
      return !0;
    f = new e(f, b), d = new e(d, b);
    let v = !1;
    e: for (const y of f.set) {
      for (const p of d.set) {
        const h = c(y, p, b);
        if (v = v || h !== null, h)
          continue e;
      }
      if (v)
        return !1;
    }
    return !0;
  }, a = [new t(">=0.0.0-0")], o = [new t(">=0.0.0")], c = (f, d, b) => {
    if (f === d)
      return !0;
    if (f.length === 1 && f[0].semver === n) {
      if (d.length === 1 && d[0].semver === n)
        return !0;
      b.includePrerelease ? f = a : f = o;
    }
    if (d.length === 1 && d[0].semver === n) {
      if (b.includePrerelease)
        return !0;
      d = o;
    }
    const v = /* @__PURE__ */ new Set();
    let y, p;
    for (const P of f)
      P.operator === ">" || P.operator === ">=" ? y = l(y, P, b) : P.operator === "<" || P.operator === "<=" ? p = u(p, P, b) : v.add(P.semver);
    if (v.size > 1)
      return null;
    let h;
    if (y && p) {
      if (h = s(y.semver, p.semver, b), h > 0)
        return null;
      if (h === 0 && (y.operator !== ">=" || p.operator !== "<="))
        return null;
    }
    for (const P of v) {
      if (y && !r(P, String(y), b) || p && !r(P, String(p), b))
        return null;
      for (const C of d)
        if (!r(P, String(C), b))
          return !1;
      return !0;
    }
    let m, _, E, x, w = p && !b.includePrerelease && p.semver.prerelease.length ? p.semver : !1, S = y && !b.includePrerelease && y.semver.prerelease.length ? y.semver : !1;
    w && w.prerelease.length === 1 && p.operator === "<" && w.prerelease[0] === 0 && (w = !1);
    for (const P of d) {
      if (x = x || P.operator === ">" || P.operator === ">=", E = E || P.operator === "<" || P.operator === "<=", y) {
        if (S && P.semver.prerelease && P.semver.prerelease.length && P.semver.major === S.major && P.semver.minor === S.minor && P.semver.patch === S.patch && (S = !1), P.operator === ">" || P.operator === ">=") {
          if (m = l(y, P, b), m === P && m !== y)
            return !1;
        } else if (y.operator === ">=" && !r(y.semver, String(P), b))
          return !1;
      }
      if (p) {
        if (w && P.semver.prerelease && P.semver.prerelease.length && P.semver.major === w.major && P.semver.minor === w.minor && P.semver.patch === w.patch && (w = !1), P.operator === "<" || P.operator === "<=") {
          if (_ = u(p, P, b), _ === P && _ !== p)
            return !1;
        } else if (p.operator === "<=" && !r(p.semver, String(P), b))
          return !1;
      }
      if (!P.operator && (p || y) && h !== 0)
        return !1;
    }
    return !(y && E && !p && h !== 0 || p && x && !y && h !== 0 || S || w);
  }, l = (f, d, b) => {
    if (!f)
      return d;
    const v = s(f.semver, d.semver, b);
    return v > 0 ? f : v < 0 || d.operator === ">" && f.operator === ">=" ? d : f;
  }, u = (f, d, b) => {
    if (!f)
      return d;
    const v = s(f.semver, d.semver, b);
    return v < 0 ? f : v > 0 || d.operator === "<" && f.operator === "<=" ? d : f;
  };
  return Qs = i, Qs;
}
var Zs, Pp;
function lb() {
  if (Pp) return Zs;
  Pp = 1;
  const e = or(), t = Oa(), n = Ie(), r = qf(), s = Kt(), i = Mg(), a = Ug(), o = zg(), c = Vg(), l = Bg(), u = Gg(), f = Hg(), d = Kg(), b = We(), v = Wg(), y = Jg(), p = No(), h = Xg(), m = Yg(), _ = ka(), E = ko(), x = Lf(), w = Df(), S = jo(), P = Ao(), C = Ff(), M = Qg(), L = ja(), G = Je(), H = Aa(), F = eb(), K = tb(), q = rb(), U = nb(), D = ab(), J = Io(), A = sb(), R = ib(), j = ob(), O = cb(), g = ub();
  return Zs = {
    parse: s,
    valid: i,
    clean: a,
    inc: o,
    diff: c,
    major: l,
    minor: u,
    patch: f,
    prerelease: d,
    compare: b,
    rcompare: v,
    compareLoose: y,
    compareBuild: p,
    sort: h,
    rsort: m,
    gt: _,
    lt: E,
    eq: x,
    neq: w,
    gte: S,
    lte: P,
    cmp: C,
    coerce: M,
    Comparator: L,
    Range: G,
    satisfies: H,
    toComparators: F,
    maxSatisfying: K,
    minSatisfying: q,
    minVersion: U,
    validRange: D,
    outside: J,
    gtr: A,
    ltr: R,
    intersects: j,
    simplifyRange: O,
    subset: g,
    SemVer: n,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: t.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: t.RELEASE_TYPES,
    compareIdentifiers: r.compareIdentifiers,
    rcompareIdentifiers: r.rcompareIdentifiers
  }, Zs;
}
var pb = lb();
const Ft = /* @__PURE__ */ ir(pb), db = Object.prototype.toString, fb = "[object Uint8Array]", mb = "[object ArrayBuffer]";
function Mf(e, t, n) {
  return e ? e.constructor === t ? !0 : db.call(e) === n : !1;
}
function Uf(e) {
  return Mf(e, Uint8Array, fb);
}
function hb(e) {
  return Mf(e, ArrayBuffer, mb);
}
function vb(e) {
  return Uf(e) || hb(e);
}
function yb(e) {
  if (!Uf(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function gb(e) {
  if (!vb(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function ei(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ??= e.reduce((s, i) => s + i.length, 0);
  const n = new Uint8Array(t);
  let r = 0;
  for (const s of e)
    yb(s), n.set(s, r), r += s.length;
  return n;
}
const Op = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Yn(e, t = "utf8") {
  return gb(e), Op[t] ??= new globalThis.TextDecoder(t), Op[t].decode(e);
}
function bb(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const _b = new globalThis.TextEncoder();
function Qn(e) {
  return bb(e), _b.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const ti = "aes-256-cbc", pt = () => /* @__PURE__ */ Object.create(null), Np = (e) => e !== void 0, ri = (e, t) => {
  const n = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), r = typeof t;
  if (n.has(r))
    throw new TypeError(`Setting a value of type \`${r}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, dt = "__internal__", ni = `${dt}.migrations.version`;
class xb {
  path;
  events;
  #a;
  #r;
  #e;
  #t = {};
  #s = !1;
  #i;
  #o;
  #n;
  constructor(t = {}) {
    const n = this.#c(t);
    this.#e = n, this.#u(n), this.#p(n), this.#d(n), this.events = new EventTarget(), this.#r = n.encryptionKey, this.path = this.#f(n), this.#m(n), n.watch && this._watch();
  }
  get(t, n) {
    if (this.#e.accessPropertiesByDotNotation)
      return this._get(t, n);
    const { store: r } = this;
    return t in r ? r[t] : n;
  }
  set(t, n) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && n === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${dt} key, as it's used to manage this module internal operations.`);
    const { store: r } = this, s = (i, a) => {
      if (ri(i, a), this.#e.accessPropertiesByDotNotation)
        fr(r, i, a);
      else {
        if (i === "__proto__" || i === "constructor" || i === "prototype")
          return;
        r[i] = a;
      }
    };
    if (typeof t == "object") {
      const i = t;
      for (const [a, o] of Object.entries(i))
        s(a, o);
    } else
      s(t, n);
    this.store = r;
  }
  has(t) {
    return this.#e.accessPropertiesByDotNotation ? Va(this.store, t) : t in this.store;
  }
  appendToArray(t, n) {
    ri(t, n);
    const r = this.#e.accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(r))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...r, n]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const n of t)
      Np(this.#t[n]) && this.set(n, this.#t[n]);
  }
  delete(t) {
    const { store: n } = this;
    this.#e.accessPropertiesByDotNotation ? Lm(n, t) : delete n[t], this.store = n;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = pt();
    for (const n of Object.keys(this.#t))
      Np(this.#t[n]) && (ri(n, this.#t[n]), this.#e.accessPropertiesByDotNotation ? fr(t, n, this.#t[n]) : t[n] = this.#t[n]);
    this.store = t;
  }
  onDidChange(t, n) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof n != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof n}`);
    return this._handleValueChange(() => this.get(t), n);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((n) => !this._isReservedKeyPath(n)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    try {
      const t = ae.readFileSync(this.path, this.#r ? null : "utf8"), n = this._decryptData(t), r = this._deserialize(n);
      return this.#s || this._validate(r), Object.assign(pt(), r);
    } catch (t) {
      if (t?.code === "ENOENT")
        return this._ensureDirectory(), pt();
      if (this.#e.clearInvalidConfig) {
        const n = t;
        if (n.name === "SyntaxError" || n.message?.startsWith("Config schema violation:"))
          return pt();
      }
      throw t;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Va(t, dt))
      try {
        const n = ae.readFileSync(this.path, this.#r ? null : "utf8"), r = this._decryptData(n), s = this._deserialize(r);
        Va(s, dt) && fr(t, dt, Jo(s, dt));
      } catch {
      }
    this.#s || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, n] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, n]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    this.#i && (this.#i.close(), this.#i = void 0), this.#o && (ae.unwatchFile(this.path), this.#o = !1), this.#n = void 0;
  }
  _decryptData(t) {
    if (!this.#r)
      return typeof t == "string" ? t : Yn(t);
    try {
      const n = t.slice(0, 16), r = bt.pbkdf2Sync(this.#r, n, 1e4, 32, "sha512"), s = bt.createDecipheriv(ti, r, n), i = t.slice(17), a = typeof i == "string" ? Qn(i) : i;
      return Yn(ei([s.update(a), s.final()]));
    } catch {
      try {
        const n = t.slice(0, 16), r = bt.pbkdf2Sync(this.#r, n.toString(), 1e4, 32, "sha512"), s = bt.createDecipheriv(ti, r, n), i = t.slice(17), a = typeof i == "string" ? Qn(i) : i;
        return Yn(ei([s.update(a), s.final()]));
      } catch {
      }
    }
    return typeof t == "string" ? t : Yn(t);
  }
  _handleStoreChange(t) {
    let n = this.store;
    const r = () => {
      const s = n, i = this.store;
      Go(i, s) || (n = i, t.call(this, i, s));
    };
    return this.events.addEventListener("change", r), () => {
      this.events.removeEventListener("change", r);
    };
  }
  _handleValueChange(t, n) {
    let r = t();
    const s = () => {
      const i = r, a = t();
      Go(a, i) || (r = a, n.call(this, a, i));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _deserialize = (t) => JSON.parse(t);
  _serialize = (t) => JSON.stringify(t, void 0, "	");
  _validate(t) {
    if (!this.#a || this.#a(t) || !this.#a.errors)
      return;
    const r = this.#a.errors.map(({ instancePath: s, message: i = "" }) => `\`${s.slice(1)}\` ${i}`);
    throw new Error("Config schema violation: " + r.join("; "));
  }
  _ensureDirectory() {
    ae.mkdirSync(fe.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let n = this._serialize(t);
    if (this.#r) {
      const r = bt.randomBytes(16), s = bt.pbkdf2Sync(this.#r, r, 1e4, 32, "sha512"), i = bt.createCipheriv(ti, s, r);
      n = ei([r, Qn(":"), i.update(Qn(n)), i.final()]);
    }
    if (be.env.SNAP)
      ae.writeFileSync(this.path, n, { mode: this.#e.configFileMode });
    else
      try {
        xf(this.path, n, { mode: this.#e.configFileMode });
      } catch (r) {
        if (r?.code === "EXDEV") {
          ae.writeFileSync(this.path, n, { mode: this.#e.configFileMode });
          return;
        }
        throw r;
      }
  }
  _watch() {
    if (this._ensureDirectory(), ae.existsSync(this.path) || this._write(pt()), be.platform === "win32" || be.platform === "darwin") {
      this.#n ??= Ll(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 });
      const t = fe.dirname(this.path), n = fe.basename(this.path);
      this.#i = ae.watch(t, { persistent: !1, encoding: "utf8" }, (r, s) => {
        s && s !== n || typeof this.#n == "function" && this.#n();
      });
    } else
      this.#n ??= Ll(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 }), ae.watchFile(this.path, { persistent: !1 }, (t, n) => {
        typeof this.#n == "function" && this.#n();
      }), this.#o = !0;
  }
  _migrate(t, n, r) {
    let s = this._get(ni, "0.0.0");
    const i = Object.keys(t).filter((o) => this._shouldPerformMigration(o, s, n));
    let a = structuredClone(this.store);
    for (const o of i)
      try {
        r && r(this, {
          fromVersion: s,
          toVersion: o,
          finalVersion: n,
          versions: i
        });
        const c = t[o];
        c?.(this), this._set(ni, o), s = o, a = structuredClone(this.store);
      } catch (c) {
        this.store = a;
        try {
          this._write(a);
        } catch {
        }
        const l = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${l}`);
      }
    (this._isVersionInRangeFormat(s) || !Ft.eq(s, n)) && this._set(ni, n);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [n, r] of Object.entries(t))
      if (this._isReservedKeyPath(n) || this._objectContainsReservedKey(r))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === dt || t.startsWith(`${dt}.`);
  }
  _isVersionInRangeFormat(t) {
    return Ft.clean(t) === null;
  }
  _shouldPerformMigration(t, n, r) {
    return this._isVersionInRangeFormat(t) ? n !== "0.0.0" && Ft.satisfies(n, t) ? !1 : Ft.satisfies(r, t) : !(Ft.lte(t, n) || Ft.gt(t, r));
  }
  _get(t, n) {
    return Jo(this.store, t, n);
  }
  _set(t, n) {
    const { store: r } = this;
    fr(r, t, n), this.store = r;
  }
  #c(t) {
    const n = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...t
    };
    if (!n.cwd) {
      if (!n.projectName)
        throw new Error("Please specify the `projectName` option.");
      n.cwd = Um(n.projectName, { suffix: n.projectSuffix }).config;
    }
    return typeof n.fileExtension == "string" && (n.fileExtension = n.fileExtension.replace(/^\.+/, "")), n;
  }
  #u(t) {
    if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
      return;
    if (t.schema && typeof t.schema != "object")
      throw new TypeError("The `schema` option must be an object.");
    const n = kg.default, r = new Ey.Ajv2020({
      allErrors: !0,
      useDefaults: !0,
      ...t.ajvOptions
    });
    n(r);
    const s = {
      ...t.rootSchema,
      type: "object",
      properties: t.schema
    };
    this.#a = r.compile(s), this.#l(t.schema);
  }
  #l(t) {
    const n = Object.entries(t ?? {});
    for (const [r, s] of n) {
      if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
        continue;
      const { default: i } = s;
      i !== void 0 && (this.#t[r] = i);
    }
  }
  #p(t) {
    t.defaults && Object.assign(this.#t, t.defaults);
  }
  #d(t) {
    t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
  }
  #f(t) {
    const n = typeof t.fileExtension == "string" ? t.fileExtension : void 0, r = n ? `.${n}` : "";
    return fe.resolve(t.cwd, `${t.configName ?? "config"}${r}`);
  }
  #m(t) {
    if (t.migrations) {
      this.#h(t), this._validate(this.store);
      return;
    }
    const n = this.store, r = Object.assign(pt(), t.defaults ?? {}, n);
    this._validate(r);
    try {
      Ho.deepEqual(n, r);
    } catch {
      this.store = r;
    }
  }
  #h(t) {
    const { migrations: n, projectVersion: r } = t;
    if (n) {
      if (!r)
        throw new Error("Please specify the `projectVersion` option.");
      this.#s = !0;
      try {
        const s = this.store, i = Object.assign(pt(), t.defaults ?? {}, s);
        try {
          Ho.deepEqual(s, i);
        } catch {
          this._write(i);
        }
        this._migrate(n, r, t.beforeEachMigration);
      } finally {
        this.#s = !1;
      }
    }
  }
}
const { app: aa, ipcMain: fo, shell: wb } = ff;
let kp = !1;
const jp = () => {
  if (!fo || !aa)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: aa.getPath("userData"),
    appVersion: aa.getVersion()
  };
  return kp || (fo.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), kp = !0), e;
};
class Eb extends xb {
  constructor(t) {
    let n, r;
    if (be.type === "renderer") {
      const s = ff.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: n, appVersion: r } = s);
    } else fo && aa && ({ defaultCwd: n, appVersion: r } = jp());
    t = {
      name: "config",
      ...t
    }, t.projectVersion ||= r, t.cwd ? t.cwd = fe.isAbsolute(t.cwd) ? t.cwd : fe.join(n, t.cwd) : t.cwd = n, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    jp();
  }
  async openInEditor() {
    const t = await wb.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
var sa = { exports: {} }, $b = sa.exports, Ap;
function Sb() {
  return Ap || (Ap = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r(Ko, ua);
    })($b, function(n, r) {
      return (function(s) {
        function i(o) {
          if (a[o]) return a[o].exports;
          var c = a[o] = { exports: {}, id: o, loaded: !1 };
          return s[o].call(c.exports, c, c.exports, i), c.loaded = !0, c.exports;
        }
        var a = {};
        return i.m = s, i.c = a, i.p = "", i(0);
      })([function(s, i, a) {
        s.exports = a(34);
      }, function(s, i, a) {
        var o = a(29)("wks"), c = a(33), l = a(2).Symbol, u = typeof l == "function", f = s.exports = function(d) {
          return o[d] || (o[d] = u && l[d] || (u ? l : c)("Symbol." + d));
        };
        f.store = o;
      }, function(s, i) {
        var a = s.exports = typeof window < "u" && window.Math == Math ? window : typeof self < "u" && self.Math == Math ? self : Function("return this")();
        typeof __g == "number" && (__g = a);
      }, function(s, i, a) {
        var o = a(9);
        s.exports = function(c) {
          if (!o(c)) throw TypeError(c + " is not an object!");
          return c;
        };
      }, function(s, i, a) {
        s.exports = !a(24)(function() {
          return Object.defineProperty({}, "a", { get: function() {
            return 7;
          } }).a != 7;
        });
      }, function(s, i, a) {
        var o = a(12), c = a(17);
        s.exports = a(4) ? function(l, u, f) {
          return o.f(l, u, c(1, f));
        } : function(l, u, f) {
          return l[u] = f, l;
        };
      }, function(s, i) {
        var a = s.exports = { version: "2.4.0" };
        typeof __e == "number" && (__e = a);
      }, function(s, i, a) {
        var o = a(14);
        s.exports = function(c, l, u) {
          if (o(c), l === void 0) return c;
          switch (u) {
            case 1:
              return function(f) {
                return c.call(l, f);
              };
            case 2:
              return function(f, d) {
                return c.call(l, f, d);
              };
            case 3:
              return function(f, d, b) {
                return c.call(l, f, d, b);
              };
          }
          return function() {
            return c.apply(l, arguments);
          };
        };
      }, function(s, i) {
        var a = {}.hasOwnProperty;
        s.exports = function(o, c) {
          return a.call(o, c);
        };
      }, function(s, i) {
        s.exports = function(a) {
          return typeof a == "object" ? a !== null : typeof a == "function";
        };
      }, function(s, i) {
        s.exports = {};
      }, function(s, i) {
        var a = {}.toString;
        s.exports = function(o) {
          return a.call(o).slice(8, -1);
        };
      }, function(s, i, a) {
        var o = a(3), c = a(26), l = a(32), u = Object.defineProperty;
        i.f = a(4) ? Object.defineProperty : function(f, d, b) {
          if (o(f), d = l(d, !0), o(b), c) try {
            return u(f, d, b);
          } catch {
          }
          if ("get" in b || "set" in b) throw TypeError("Accessors not supported!");
          return "value" in b && (f[d] = b.value), f;
        };
      }, function(s, i, a) {
        var o = a(42), c = a(15);
        s.exports = function(l) {
          return o(c(l));
        };
      }, function(s, i) {
        s.exports = function(a) {
          if (typeof a != "function") throw TypeError(a + " is not a function!");
          return a;
        };
      }, function(s, i) {
        s.exports = function(a) {
          if (a == null) throw TypeError("Can't call method on  " + a);
          return a;
        };
      }, function(s, i, a) {
        var o = a(9), c = a(2).document, l = o(c) && o(c.createElement);
        s.exports = function(u) {
          return l ? c.createElement(u) : {};
        };
      }, function(s, i) {
        s.exports = function(a, o) {
          return { enumerable: !(1 & a), configurable: !(2 & a), writable: !(4 & a), value: o };
        };
      }, function(s, i, a) {
        var o = a(12).f, c = a(8), l = a(1)("toStringTag");
        s.exports = function(u, f, d) {
          u && !c(u = d ? u : u.prototype, l) && o(u, l, { configurable: !0, value: f });
        };
      }, function(s, i, a) {
        var o = a(29)("keys"), c = a(33);
        s.exports = function(l) {
          return o[l] || (o[l] = c(l));
        };
      }, function(s, i) {
        var a = Math.ceil, o = Math.floor;
        s.exports = function(c) {
          return isNaN(c = +c) ? 0 : (c > 0 ? o : a)(c);
        };
      }, function(s, i, a) {
        var o = a(11), c = a(1)("toStringTag"), l = o(/* @__PURE__ */ (function() {
          return arguments;
        })()) == "Arguments", u = function(f, d) {
          try {
            return f[d];
          } catch {
          }
        };
        s.exports = function(f) {
          var d, b, v;
          return f === void 0 ? "Undefined" : f === null ? "Null" : typeof (b = u(d = Object(f), c)) == "string" ? b : l ? o(d) : (v = o(d)) == "Object" && typeof d.callee == "function" ? "Arguments" : v;
        };
      }, function(s, i) {
        s.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
      }, function(s, i, a) {
        var o = a(2), c = a(6), l = a(7), u = a(5), f = "prototype", d = function(b, v, y) {
          var p, h, m, _ = b & d.F, E = b & d.G, x = b & d.S, w = b & d.P, S = b & d.B, P = b & d.W, C = E ? c : c[v] || (c[v] = {}), M = C[f], L = E ? o : x ? o[v] : (o[v] || {})[f];
          E && (y = v);
          for (p in y) h = !_ && L && L[p] !== void 0, h && p in C || (m = h ? L[p] : y[p], C[p] = E && typeof L[p] != "function" ? y[p] : S && h ? l(m, o) : P && L[p] == m ? (function(G) {
            var H = function(F, K, q) {
              if (this instanceof G) {
                switch (arguments.length) {
                  case 0:
                    return new G();
                  case 1:
                    return new G(F);
                  case 2:
                    return new G(F, K);
                }
                return new G(F, K, q);
              }
              return G.apply(this, arguments);
            };
            return H[f] = G[f], H;
          })(m) : w && typeof m == "function" ? l(Function.call, m) : m, w && ((C.virtual || (C.virtual = {}))[p] = m, b & d.R && M && !M[p] && u(M, p, m)));
        };
        d.F = 1, d.G = 2, d.S = 4, d.P = 8, d.B = 16, d.W = 32, d.U = 64, d.R = 128, s.exports = d;
      }, function(s, i) {
        s.exports = function(a) {
          try {
            return !!a();
          } catch {
            return !0;
          }
        };
      }, function(s, i, a) {
        s.exports = a(2).document && document.documentElement;
      }, function(s, i, a) {
        s.exports = !a(4) && !a(24)(function() {
          return Object.defineProperty(a(16)("div"), "a", { get: function() {
            return 7;
          } }).a != 7;
        });
      }, function(s, i, a) {
        var o = a(28), c = a(23), l = a(57), u = a(5), f = a(8), d = a(10), b = a(45), v = a(18), y = a(52), p = a(1)("iterator"), h = !([].keys && "next" in [].keys()), m = "@@iterator", _ = "keys", E = "values", x = function() {
          return this;
        };
        s.exports = function(w, S, P, C, M, L, G) {
          b(P, S, C);
          var H, F, K, q = function($) {
            if (!h && $ in A) return A[$];
            switch ($) {
              case _:
                return function() {
                  return new P(this, $);
                };
              case E:
                return function() {
                  return new P(this, $);
                };
            }
            return function() {
              return new P(this, $);
            };
          }, U = S + " Iterator", D = M == E, J = !1, A = w.prototype, R = A[p] || A[m] || M && A[M], j = R || q(M), O = M ? D ? q("entries") : j : void 0, g = S == "Array" && A.entries || R;
          if (g && (K = y(g.call(new w())), K !== Object.prototype && (v(K, U, !0), o || f(K, p) || u(K, p, x))), D && R && R.name !== E && (J = !0, j = function() {
            return R.call(this);
          }), o && !G || !h && !J && A[p] || u(A, p, j), d[S] = j, d[U] = x, M) if (H = { values: D ? j : q(E), keys: L ? j : q(_), entries: O }, G) for (F in H) F in A || l(A, F, H[F]);
          else c(c.P + c.F * (h || J), S, H);
          return H;
        };
      }, function(s, i) {
        s.exports = !0;
      }, function(s, i, a) {
        var o = a(2), c = "__core-js_shared__", l = o[c] || (o[c] = {});
        s.exports = function(u) {
          return l[u] || (l[u] = {});
        };
      }, function(s, i, a) {
        var o, c, l, u = a(7), f = a(41), d = a(25), b = a(16), v = a(2), y = v.process, p = v.setImmediate, h = v.clearImmediate, m = v.MessageChannel, _ = 0, E = {}, x = "onreadystatechange", w = function() {
          var P = +this;
          if (E.hasOwnProperty(P)) {
            var C = E[P];
            delete E[P], C();
          }
        }, S = function(P) {
          w.call(P.data);
        };
        p && h || (p = function(P) {
          for (var C = [], M = 1; arguments.length > M; ) C.push(arguments[M++]);
          return E[++_] = function() {
            f(typeof P == "function" ? P : Function(P), C);
          }, o(_), _;
        }, h = function(P) {
          delete E[P];
        }, a(11)(y) == "process" ? o = function(P) {
          y.nextTick(u(w, P, 1));
        } : m ? (c = new m(), l = c.port2, c.port1.onmessage = S, o = u(l.postMessage, l, 1)) : v.addEventListener && typeof postMessage == "function" && !v.importScripts ? (o = function(P) {
          v.postMessage(P + "", "*");
        }, v.addEventListener("message", S, !1)) : o = x in b("script") ? function(P) {
          d.appendChild(b("script"))[x] = function() {
            d.removeChild(this), w.call(P);
          };
        } : function(P) {
          setTimeout(u(w, P, 1), 0);
        }), s.exports = { set: p, clear: h };
      }, function(s, i, a) {
        var o = a(20), c = Math.min;
        s.exports = function(l) {
          return l > 0 ? c(o(l), 9007199254740991) : 0;
        };
      }, function(s, i, a) {
        var o = a(9);
        s.exports = function(c, l) {
          if (!o(c)) return c;
          var u, f;
          if (l && typeof (u = c.toString) == "function" && !o(f = u.call(c)) || typeof (u = c.valueOf) == "function" && !o(f = u.call(c)) || !l && typeof (u = c.toString) == "function" && !o(f = u.call(c))) return f;
          throw TypeError("Can't convert object to primitive value");
        };
      }, function(s, i) {
        var a = 0, o = Math.random();
        s.exports = function(c) {
          return "Symbol(".concat(c === void 0 ? "" : c, ")_", (++a + o).toString(36));
        };
      }, function(s, i, a) {
        function o(x) {
          return x && x.__esModule ? x : { default: x };
        }
        function c() {
          return process.platform !== "win32" ? "" : process.arch === "ia32" && process.env.hasOwnProperty("PROCESSOR_ARCHITEW6432") ? "mixed" : "native";
        }
        function l(x) {
          return (0, p.createHash)("sha256").update(x).digest("hex");
        }
        function u(x) {
          switch (m) {
            case "darwin":
              return x.split("IOPlatformUUID")[1].split(`
`)[0].replace(/\=|\s+|\"/gi, "").toLowerCase();
            case "win32":
              return x.toString().split("REG_SZ")[1].replace(/\r+|\n+|\s+/gi, "").toLowerCase();
            case "linux":
              return x.toString().replace(/\r+|\n+|\s+/gi, "").toLowerCase();
            case "freebsd":
              return x.toString().replace(/\r+|\n+|\s+/gi, "").toLowerCase();
            default:
              throw new Error("Unsupported platform: " + process.platform);
          }
        }
        function f(x) {
          var w = u((0, y.execSync)(E[m]).toString());
          return x ? w : l(w);
        }
        function d(x) {
          return new v.default(function(w, S) {
            return (0, y.exec)(E[m], {}, function(P, C, M) {
              if (P) return S(new Error("Error while obtaining machine id: " + P.stack));
              var L = u(C.toString());
              return w(x ? L : l(L));
            });
          });
        }
        Object.defineProperty(i, "__esModule", { value: !0 });
        var b = a(35), v = o(b);
        i.machineIdSync = f, i.machineId = d;
        var y = a(70), p = a(71), h = process, m = h.platform, _ = { native: "%windir%\\System32", mixed: "%windir%\\sysnative\\cmd.exe /c %windir%\\System32" }, E = { darwin: "ioreg -rd1 -c IOPlatformExpertDevice", win32: _[c()] + "\\REG.exe QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid", linux: "( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :", freebsd: "kenv -q smbios.system.uuid || sysctl -n kern.hostuuid" };
      }, function(s, i, a) {
        s.exports = { default: a(36), __esModule: !0 };
      }, function(s, i, a) {
        a(66), a(68), a(69), a(67), s.exports = a(6).Promise;
      }, function(s, i) {
        s.exports = function() {
        };
      }, function(s, i) {
        s.exports = function(a, o, c, l) {
          if (!(a instanceof o) || l !== void 0 && l in a) throw TypeError(c + ": incorrect invocation!");
          return a;
        };
      }, function(s, i, a) {
        var o = a(13), c = a(31), l = a(62);
        s.exports = function(u) {
          return function(f, d, b) {
            var v, y = o(f), p = c(y.length), h = l(b, p);
            if (u && d != d) {
              for (; p > h; ) if (v = y[h++], v != v) return !0;
            } else for (; p > h; h++) if ((u || h in y) && y[h] === d) return u || h || 0;
            return !u && -1;
          };
        };
      }, function(s, y, a) {
        var o = a(7), c = a(44), l = a(43), u = a(3), f = a(31), d = a(64), b = {}, v = {}, y = s.exports = function(p, h, m, _, E) {
          var x, w, S, P, C = E ? function() {
            return p;
          } : d(p), M = o(m, _, h ? 2 : 1), L = 0;
          if (typeof C != "function") throw TypeError(p + " is not iterable!");
          if (l(C)) {
            for (x = f(p.length); x > L; L++) if (P = h ? M(u(w = p[L])[0], w[1]) : M(p[L]), P === b || P === v) return P;
          } else for (S = C.call(p); !(w = S.next()).done; ) if (P = c(S, M, w.value, h), P === b || P === v) return P;
        };
        y.BREAK = b, y.RETURN = v;
      }, function(s, i) {
        s.exports = function(a, o, c) {
          var l = c === void 0;
          switch (o.length) {
            case 0:
              return l ? a() : a.call(c);
            case 1:
              return l ? a(o[0]) : a.call(c, o[0]);
            case 2:
              return l ? a(o[0], o[1]) : a.call(c, o[0], o[1]);
            case 3:
              return l ? a(o[0], o[1], o[2]) : a.call(c, o[0], o[1], o[2]);
            case 4:
              return l ? a(o[0], o[1], o[2], o[3]) : a.call(c, o[0], o[1], o[2], o[3]);
          }
          return a.apply(c, o);
        };
      }, function(s, i, a) {
        var o = a(11);
        s.exports = Object("z").propertyIsEnumerable(0) ? Object : function(c) {
          return o(c) == "String" ? c.split("") : Object(c);
        };
      }, function(s, i, a) {
        var o = a(10), c = a(1)("iterator"), l = Array.prototype;
        s.exports = function(u) {
          return u !== void 0 && (o.Array === u || l[c] === u);
        };
      }, function(s, i, a) {
        var o = a(3);
        s.exports = function(c, l, u, f) {
          try {
            return f ? l(o(u)[0], u[1]) : l(u);
          } catch (b) {
            var d = c.return;
            throw d !== void 0 && o(d.call(c)), b;
          }
        };
      }, function(s, i, a) {
        var o = a(49), c = a(17), l = a(18), u = {};
        a(5)(u, a(1)("iterator"), function() {
          return this;
        }), s.exports = function(f, d, b) {
          f.prototype = o(u, { next: c(1, b) }), l(f, d + " Iterator");
        };
      }, function(s, i, a) {
        var o = a(1)("iterator"), c = !1;
        try {
          var l = [7][o]();
          l.return = function() {
            c = !0;
          }, Array.from(l, function() {
            throw 2;
          });
        } catch {
        }
        s.exports = function(u, f) {
          if (!f && !c) return !1;
          var d = !1;
          try {
            var b = [7], v = b[o]();
            v.next = function() {
              return { done: d = !0 };
            }, b[o] = function() {
              return v;
            }, u(b);
          } catch {
          }
          return d;
        };
      }, function(s, i) {
        s.exports = function(a, o) {
          return { value: o, done: !!a };
        };
      }, function(s, i, a) {
        var o = a(2), c = a(30).set, l = o.MutationObserver || o.WebKitMutationObserver, u = o.process, f = o.Promise, d = a(11)(u) == "process";
        s.exports = function() {
          var b, v, y, p = function() {
            var E, x;
            for (d && (E = u.domain) && E.exit(); b; ) {
              x = b.fn, b = b.next;
              try {
                x();
              } catch (w) {
                throw b ? y() : v = void 0, w;
              }
            }
            v = void 0, E && E.enter();
          };
          if (d) y = function() {
            u.nextTick(p);
          };
          else if (l) {
            var h = !0, m = document.createTextNode("");
            new l(p).observe(m, { characterData: !0 }), y = function() {
              m.data = h = !h;
            };
          } else if (f && f.resolve) {
            var _ = f.resolve();
            y = function() {
              _.then(p);
            };
          } else y = function() {
            c.call(o, p);
          };
          return function(E) {
            var x = { fn: E, next: void 0 };
            v && (v.next = x), b || (b = x, y()), v = x;
          };
        };
      }, function(s, i, a) {
        var o = a(3), c = a(50), l = a(22), u = a(19)("IE_PROTO"), f = function() {
        }, d = "prototype", b = function() {
          var v, y = a(16)("iframe"), p = l.length, h = ">";
          for (y.style.display = "none", a(25).appendChild(y), y.src = "javascript:", v = y.contentWindow.document, v.open(), v.write("<script>document.F=Object<\/script" + h), v.close(), b = v.F; p--; ) delete b[d][l[p]];
          return b();
        };
        s.exports = Object.create || function(v, y) {
          var p;
          return v !== null ? (f[d] = o(v), p = new f(), f[d] = null, p[u] = v) : p = b(), y === void 0 ? p : c(p, y);
        };
      }, function(s, i, a) {
        var o = a(12), c = a(3), l = a(54);
        s.exports = a(4) ? Object.defineProperties : function(u, f) {
          c(u);
          for (var d, b = l(f), v = b.length, y = 0; v > y; ) o.f(u, d = b[y++], f[d]);
          return u;
        };
      }, function(s, i, a) {
        var o = a(55), c = a(17), l = a(13), u = a(32), f = a(8), d = a(26), b = Object.getOwnPropertyDescriptor;
        i.f = a(4) ? b : function(v, y) {
          if (v = l(v), y = u(y, !0), d) try {
            return b(v, y);
          } catch {
          }
          if (f(v, y)) return c(!o.f.call(v, y), v[y]);
        };
      }, function(s, i, a) {
        var o = a(8), c = a(63), l = a(19)("IE_PROTO"), u = Object.prototype;
        s.exports = Object.getPrototypeOf || function(f) {
          return f = c(f), o(f, l) ? f[l] : typeof f.constructor == "function" && f instanceof f.constructor ? f.constructor.prototype : f instanceof Object ? u : null;
        };
      }, function(s, i, a) {
        var o = a(8), c = a(13), l = a(39)(!1), u = a(19)("IE_PROTO");
        s.exports = function(f, d) {
          var b, v = c(f), y = 0, p = [];
          for (b in v) b != u && o(v, b) && p.push(b);
          for (; d.length > y; ) o(v, b = d[y++]) && (~l(p, b) || p.push(b));
          return p;
        };
      }, function(s, i, a) {
        var o = a(53), c = a(22);
        s.exports = Object.keys || function(l) {
          return o(l, c);
        };
      }, function(s, i) {
        i.f = {}.propertyIsEnumerable;
      }, function(s, i, a) {
        var o = a(5);
        s.exports = function(c, l, u) {
          for (var f in l) u && c[f] ? c[f] = l[f] : o(c, f, l[f]);
          return c;
        };
      }, function(s, i, a) {
        s.exports = a(5);
      }, function(s, i, a) {
        var o = a(9), c = a(3), l = function(u, f) {
          if (c(u), !o(f) && f !== null) throw TypeError(f + ": can't set as prototype!");
        };
        s.exports = { set: Object.setPrototypeOf || ("__proto__" in {} ? (function(u, f, d) {
          try {
            d = a(7)(Function.call, a(51).f(Object.prototype, "__proto__").set, 2), d(u, []), f = !(u instanceof Array);
          } catch {
            f = !0;
          }
          return function(b, v) {
            return l(b, v), f ? b.__proto__ = v : d(b, v), b;
          };
        })({}, !1) : void 0), check: l };
      }, function(s, i, a) {
        var o = a(2), c = a(6), l = a(12), u = a(4), f = a(1)("species");
        s.exports = function(d) {
          var b = typeof c[d] == "function" ? c[d] : o[d];
          u && b && !b[f] && l.f(b, f, { configurable: !0, get: function() {
            return this;
          } });
        };
      }, function(s, i, a) {
        var o = a(3), c = a(14), l = a(1)("species");
        s.exports = function(u, f) {
          var d, b = o(u).constructor;
          return b === void 0 || (d = o(b)[l]) == null ? f : c(d);
        };
      }, function(s, i, a) {
        var o = a(20), c = a(15);
        s.exports = function(l) {
          return function(u, f) {
            var d, b, v = String(c(u)), y = o(f), p = v.length;
            return y < 0 || y >= p ? l ? "" : void 0 : (d = v.charCodeAt(y), d < 55296 || d > 56319 || y + 1 === p || (b = v.charCodeAt(y + 1)) < 56320 || b > 57343 ? l ? v.charAt(y) : d : l ? v.slice(y, y + 2) : (d - 55296 << 10) + (b - 56320) + 65536);
          };
        };
      }, function(s, i, a) {
        var o = a(20), c = Math.max, l = Math.min;
        s.exports = function(u, f) {
          return u = o(u), u < 0 ? c(u + f, 0) : l(u, f);
        };
      }, function(s, i, a) {
        var o = a(15);
        s.exports = function(c) {
          return Object(o(c));
        };
      }, function(s, i, a) {
        var o = a(21), c = a(1)("iterator"), l = a(10);
        s.exports = a(6).getIteratorMethod = function(u) {
          if (u != null) return u[c] || u["@@iterator"] || l[o(u)];
        };
      }, function(s, i, a) {
        var o = a(37), c = a(47), l = a(10), u = a(13);
        s.exports = a(27)(Array, "Array", function(f, d) {
          this._t = u(f), this._i = 0, this._k = d;
        }, function() {
          var f = this._t, d = this._k, b = this._i++;
          return !f || b >= f.length ? (this._t = void 0, c(1)) : d == "keys" ? c(0, b) : d == "values" ? c(0, f[b]) : c(0, [b, f[b]]);
        }, "values"), l.Arguments = l.Array, o("keys"), o("values"), o("entries");
      }, function(s, i) {
      }, function(s, i, a) {
        var o, c, l, u = a(28), f = a(2), d = a(7), b = a(21), v = a(23), y = a(9), p = (a(3), a(14)), h = a(38), m = a(40), _ = (a(58).set, a(60)), E = a(30).set, x = a(48)(), w = "Promise", S = f.TypeError, C = f.process, P = f[w], C = f.process, M = b(C) == "process", L = function() {
        }, G = !!(function() {
          try {
            var g = P.resolve(1), $ = (g.constructor = {})[a(1)("species")] = function(k) {
              k(L, L);
            };
            return (M || typeof PromiseRejectionEvent == "function") && g.then(L) instanceof $;
          } catch {
          }
        })(), H = function(g, $) {
          return g === $ || g === P && $ === l;
        }, F = function(g) {
          var $;
          return !(!y(g) || typeof ($ = g.then) != "function") && $;
        }, K = function(g) {
          return H(P, g) ? new q(g) : new c(g);
        }, q = c = function(g) {
          var $, k;
          this.promise = new g(function(B, W) {
            if ($ !== void 0 || k !== void 0) throw S("Bad Promise constructor");
            $ = B, k = W;
          }), this.resolve = p($), this.reject = p(k);
        }, U = function(g) {
          try {
            g();
          } catch ($) {
            return { error: $ };
          }
        }, D = function(g, $) {
          if (!g._n) {
            g._n = !0;
            var k = g._c;
            x(function() {
              for (var B = g._v, W = g._s == 1, Z = 0, Y = function(T) {
                var N, I, z = W ? T.ok : T.fail, X = T.resolve, Q = T.reject, re = T.domain;
                try {
                  z ? (W || (g._h == 2 && R(g), g._h = 1), z === !0 ? N = B : (re && re.enter(), N = z(B), re && re.exit()), N === T.promise ? Q(S("Promise-chain cycle")) : (I = F(N)) ? I.call(N, X, Q) : X(N)) : Q(B);
                } catch (he) {
                  Q(he);
                }
              }; k.length > Z; ) Y(k[Z++]);
              g._c = [], g._n = !1, $ && !g._h && J(g);
            });
          }
        }, J = function(g) {
          E.call(f, function() {
            var $, k, B, W = g._v;
            if (A(g) && ($ = U(function() {
              M ? C.emit("unhandledRejection", W, g) : (k = f.onunhandledrejection) ? k({ promise: g, reason: W }) : (B = f.console) && B.error && B.error("Unhandled promise rejection", W);
            }), g._h = M || A(g) ? 2 : 1), g._a = void 0, $) throw $.error;
          });
        }, A = function(g) {
          if (g._h == 1) return !1;
          for (var $, k = g._a || g._c, B = 0; k.length > B; ) if ($ = k[B++], $.fail || !A($.promise)) return !1;
          return !0;
        }, R = function(g) {
          E.call(f, function() {
            var $;
            M ? C.emit("rejectionHandled", g) : ($ = f.onrejectionhandled) && $({ promise: g, reason: g._v });
          });
        }, j = function(g) {
          var $ = this;
          $._d || ($._d = !0, $ = $._w || $, $._v = g, $._s = 2, $._a || ($._a = $._c.slice()), D($, !0));
        }, O = function(g) {
          var $, k = this;
          if (!k._d) {
            k._d = !0, k = k._w || k;
            try {
              if (k === g) throw S("Promise can't be resolved itself");
              ($ = F(g)) ? x(function() {
                var B = { _w: k, _d: !1 };
                try {
                  $.call(g, d(O, B, 1), d(j, B, 1));
                } catch (W) {
                  j.call(B, W);
                }
              }) : (k._v = g, k._s = 1, D(k, !1));
            } catch (B) {
              j.call({ _w: k, _d: !1 }, B);
            }
          }
        };
        G || (P = function(g) {
          h(this, P, w, "_h"), p(g), o.call(this);
          try {
            g(d(O, this, 1), d(j, this, 1));
          } catch ($) {
            j.call(this, $);
          }
        }, o = function(g) {
          this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, this._n = !1;
        }, o.prototype = a(56)(P.prototype, { then: function(g, $) {
          var k = K(_(this, P));
          return k.ok = typeof g != "function" || g, k.fail = typeof $ == "function" && $, k.domain = M ? C.domain : void 0, this._c.push(k), this._a && this._a.push(k), this._s && D(this, !1), k.promise;
        }, catch: function(g) {
          return this.then(void 0, g);
        } }), q = function() {
          var g = new o();
          this.promise = g, this.resolve = d(O, g, 1), this.reject = d(j, g, 1);
        }), v(v.G + v.W + v.F * !G, { Promise: P }), a(18)(P, w), a(59)(w), l = a(6)[w], v(v.S + v.F * !G, w, { reject: function(g) {
          var $ = K(this), k = $.reject;
          return k(g), $.promise;
        } }), v(v.S + v.F * (u || !G), w, { resolve: function(g) {
          if (g instanceof P && H(g.constructor, this)) return g;
          var $ = K(this), k = $.resolve;
          return k(g), $.promise;
        } }), v(v.S + v.F * !(G && a(46)(function(g) {
          P.all(g).catch(L);
        })), w, { all: function(g) {
          var $ = this, k = K($), B = k.resolve, W = k.reject, Z = U(function() {
            var Y = [], T = 0, N = 1;
            m(g, !1, function(I) {
              var z = T++, X = !1;
              Y.push(void 0), N++, $.resolve(I).then(function(Q) {
                X || (X = !0, Y[z] = Q, --N || B(Y));
              }, W);
            }), --N || B(Y);
          });
          return Z && W(Z.error), k.promise;
        }, race: function(g) {
          var $ = this, k = K($), B = k.reject, W = U(function() {
            m(g, !1, function(Z) {
              $.resolve(Z).then(k.resolve, B);
            });
          });
          return W && B(W.error), k.promise;
        } });
      }, function(s, i, a) {
        var o = a(61)(!0);
        a(27)(String, "String", function(c) {
          this._t = String(c), this._i = 0;
        }, function() {
          var c, l = this._t, u = this._i;
          return u >= l.length ? { value: void 0, done: !0 } : (c = o(l, u), this._i += c.length, { value: c, done: !1 });
        });
      }, function(s, i, a) {
        a(65);
        for (var o = a(2), c = a(5), l = a(10), u = a(1)("toStringTag"), f = ["NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList"], d = 0; d < 5; d++) {
          var b = f[d], v = o[b], y = v && v.prototype;
          y && !y[u] && c(y, u, b), l[b] = l.Array;
        }
      }, function(s, i) {
        s.exports = Ko;
      }, function(s, i) {
        s.exports = ua;
      }]);
    });
  })(sa)), sa.exports;
}
var Rb = Sb();
function zf(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: Tb } = Object.prototype, { getPrototypeOf: Co } = Object, { iterator: Ia, toStringTag: Vf } = Symbol, Ca = /* @__PURE__ */ ((e) => (t) => {
  const n = Tb.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), Xe = (e) => (e = e.toLowerCase(), (t) => Ca(t) === e), qa = (e) => (t) => typeof t === e, { isArray: Wt } = Array, Bt = qa("undefined");
function cr(e) {
  return e !== null && !Bt(e) && e.constructor !== null && !Bt(e.constructor) && qe(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Bf = Xe("ArrayBuffer");
function Pb(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Bf(e.buffer), t;
}
const Ob = qa("string"), qe = qa("function"), Gf = qa("number"), ur = (e) => e !== null && typeof e == "object", Nb = (e) => e === !0 || e === !1, ia = (e) => {
  if (Ca(e) !== "object")
    return !1;
  const t = Co(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Vf in e) && !(Ia in e);
}, kb = (e) => {
  if (!ur(e) || cr(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, jb = Xe("Date"), Ab = Xe("File"), Ib = Xe("Blob"), Cb = Xe("FileList"), qb = (e) => ur(e) && qe(e.pipe), Lb = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || qe(e.append) && ((t = Ca(e)) === "formdata" || // detect form-data instance
  t === "object" && qe(e.toString) && e.toString() === "[object FormData]"));
}, Db = Xe("URLSearchParams"), [Fb, Mb, Ub, zb] = ["ReadableStream", "Request", "Response", "Headers"].map(Xe), Vb = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function lr(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let r, s;
  if (typeof e != "object" && (e = [e]), Wt(e))
    for (r = 0, s = e.length; r < s; r++)
      t.call(null, e[r], r, e);
  else {
    if (cr(e))
      return;
    const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), a = i.length;
    let o;
    for (r = 0; r < a; r++)
      o = i[r], t.call(null, e[o], o, e);
  }
}
function Hf(e, t) {
  if (cr(e))
    return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length, s;
  for (; r-- > 0; )
    if (s = n[r], t === s.toLowerCase())
      return s;
  return null;
}
const Rt = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Kf = (e) => !Bt(e) && e !== Rt;
function mo() {
  const { caseless: e, skipUndefined: t } = Kf(this) && this || {}, n = {}, r = (s, i) => {
    const a = e && Hf(n, i) || i;
    ia(n[a]) && ia(s) ? n[a] = mo(n[a], s) : ia(s) ? n[a] = mo({}, s) : Wt(s) ? n[a] = s.slice() : (!t || !Bt(s)) && (n[a] = s);
  };
  for (let s = 0, i = arguments.length; s < i; s++)
    arguments[s] && lr(arguments[s], r);
  return n;
}
const Bb = (e, t, n, { allOwnKeys: r } = {}) => (lr(t, (s, i) => {
  n && qe(s) ? e[i] = zf(s, n) : e[i] = s;
}, { allOwnKeys: r }), e), Gb = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Hb = (e, t, n, r) => {
  e.prototype = Object.create(t.prototype, r), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, Kb = (e, t, n, r) => {
  let s, i, a;
  const o = {};
  if (t = t || {}, e == null) return t;
  do {
    for (s = Object.getOwnPropertyNames(e), i = s.length; i-- > 0; )
      a = s[i], (!r || r(a, e, t)) && !o[a] && (t[a] = e[a], o[a] = !0);
    e = n !== !1 && Co(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, Wb = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const r = e.indexOf(t, n);
  return r !== -1 && r === n;
}, Jb = (e) => {
  if (!e) return null;
  if (Wt(e)) return e;
  let t = e.length;
  if (!Gf(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, Xb = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && Co(Uint8Array)), Yb = (e, t) => {
  const r = (e && e[Ia]).call(e);
  let s;
  for (; (s = r.next()) && !s.done; ) {
    const i = s.value;
    t.call(e, i[0], i[1]);
  }
}, Qb = (e, t) => {
  let n;
  const r = [];
  for (; (n = e.exec(t)) !== null; )
    r.push(n);
  return r;
}, Zb = Xe("HTMLFormElement"), e_ = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, r, s) {
    return r.toUpperCase() + s;
  }
), Ip = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), t_ = Xe("RegExp"), Wf = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {};
  lr(n, (s, i) => {
    let a;
    (a = t(s, i, e)) !== !1 && (r[i] = a || s);
  }), Object.defineProperties(e, r);
}, r_ = (e) => {
  Wf(e, (t, n) => {
    if (qe(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const r = e[n];
    if (qe(r)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, n_ = (e, t) => {
  const n = {}, r = (s) => {
    s.forEach((i) => {
      n[i] = !0;
    });
  };
  return Wt(e) ? r(e) : r(String(e).split(t)), n;
}, a_ = () => {
}, s_ = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function i_(e) {
  return !!(e && qe(e.append) && e[Vf] === "FormData" && e[Ia]);
}
const o_ = (e) => {
  const t = new Array(10), n = (r, s) => {
    if (ur(r)) {
      if (t.indexOf(r) >= 0)
        return;
      if (cr(r))
        return r;
      if (!("toJSON" in r)) {
        t[s] = r;
        const i = Wt(r) ? [] : {};
        return lr(r, (a, o) => {
          const c = n(a, s + 1);
          !Bt(c) && (i[o] = c);
        }), t[s] = void 0, i;
      }
    }
    return r;
  };
  return n(e, 0);
}, c_ = Xe("AsyncFunction"), u_ = (e) => e && (ur(e) || qe(e)) && qe(e.then) && qe(e.catch), Jf = ((e, t) => e ? setImmediate : t ? ((n, r) => (Rt.addEventListener("message", ({ source: s, data: i }) => {
  s === Rt && i === n && r.length && r.shift()();
}, !1), (s) => {
  r.push(s), Rt.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  qe(Rt.postMessage)
), l_ = typeof queueMicrotask < "u" ? queueMicrotask.bind(Rt) : typeof process < "u" && process.nextTick || Jf, p_ = (e) => e != null && qe(e[Ia]), V = {
  isArray: Wt,
  isArrayBuffer: Bf,
  isBuffer: cr,
  isFormData: Lb,
  isArrayBufferView: Pb,
  isString: Ob,
  isNumber: Gf,
  isBoolean: Nb,
  isObject: ur,
  isPlainObject: ia,
  isEmptyObject: kb,
  isReadableStream: Fb,
  isRequest: Mb,
  isResponse: Ub,
  isHeaders: zb,
  isUndefined: Bt,
  isDate: jb,
  isFile: Ab,
  isBlob: Ib,
  isRegExp: t_,
  isFunction: qe,
  isStream: qb,
  isURLSearchParams: Db,
  isTypedArray: Xb,
  isFileList: Cb,
  forEach: lr,
  merge: mo,
  extend: Bb,
  trim: Vb,
  stripBOM: Gb,
  inherits: Hb,
  toFlatObject: Kb,
  kindOf: Ca,
  kindOfTest: Xe,
  endsWith: Wb,
  toArray: Jb,
  forEachEntry: Yb,
  matchAll: Qb,
  isHTMLForm: Zb,
  hasOwnProperty: Ip,
  hasOwnProp: Ip,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Wf,
  freezeMethods: r_,
  toObjectSet: n_,
  toCamelCase: e_,
  noop: a_,
  toFiniteNumber: s_,
  findKey: Hf,
  global: Rt,
  isContextDefined: Kf,
  isSpecCompliantForm: i_,
  toJSONObject: o_,
  isAsyncFn: c_,
  isThenable: u_,
  setImmediate: Jf,
  asap: l_,
  isIterable: p_
};
function te(e, t, n, r, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), r && (this.request = r), s && (this.response = s, this.status = s.status ? s.status : null);
}
V.inherits(te, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: V.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const Xf = te.prototype, Yf = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  Yf[e] = { value: e };
});
Object.defineProperties(te, Yf);
Object.defineProperty(Xf, "isAxiosError", { value: !0 });
te.from = (e, t, n, r, s, i) => {
  const a = Object.create(Xf);
  V.toFlatObject(e, a, function(u) {
    return u !== Error.prototype;
  }, (l) => l !== "isAxiosError");
  const o = e && e.message ? e.message : "Error", c = t == null && e ? e.code : t;
  return te.call(a, o, c, n, r, s), e && a.cause == null && Object.defineProperty(a, "cause", { value: e, configurable: !0 }), a.name = e && e.name || "Error", i && Object.assign(a, i), a;
};
var ai, Cp;
function d_() {
  if (Cp) return ai;
  Cp = 1;
  var e = Ce.Stream, t = jt;
  ai = n;
  function n() {
    this.source = null, this.dataSize = 0, this.maxDataSize = 1024 * 1024, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = [];
  }
  return t.inherits(n, e), n.create = function(r, s) {
    var i = new this();
    s = s || {};
    for (var a in s)
      i[a] = s[a];
    i.source = r;
    var o = r.emit;
    return r.emit = function() {
      return i._handleEmit(arguments), o.apply(r, arguments);
    }, r.on("error", function() {
    }), i.pauseStream && r.pause(), i;
  }, Object.defineProperty(n.prototype, "readable", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.source.readable;
    }
  }), n.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
  }, n.prototype.resume = function() {
    this._released || this.release(), this.source.resume();
  }, n.prototype.pause = function() {
    this.source.pause();
  }, n.prototype.release = function() {
    this._released = !0, this._bufferedEvents.forEach((function(r) {
      this.emit.apply(this, r);
    }).bind(this)), this._bufferedEvents = [];
  }, n.prototype.pipe = function() {
    var r = e.prototype.pipe.apply(this, arguments);
    return this.resume(), r;
  }, n.prototype._handleEmit = function(r) {
    if (this._released) {
      this.emit.apply(this, r);
      return;
    }
    r[0] === "data" && (this.dataSize += r[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(r);
  }, n.prototype._checkIfMaxDataSizeExceeded = function() {
    if (!this._maxDataSizeExceeded && !(this.dataSize <= this.maxDataSize)) {
      this._maxDataSizeExceeded = !0;
      var r = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(r));
    }
  }, ai;
}
var si, qp;
function f_() {
  if (qp) return si;
  qp = 1;
  var e = jt, t = Ce.Stream, n = d_();
  si = r;
  function r() {
    this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2 * 1024 * 1024, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
  }
  return e.inherits(r, t), r.create = function(s) {
    var i = new this();
    s = s || {};
    for (var a in s)
      i[a] = s[a];
    return i;
  }, r.isStreamLike = function(s) {
    return typeof s != "function" && typeof s != "string" && typeof s != "boolean" && typeof s != "number" && !Buffer.isBuffer(s);
  }, r.prototype.append = function(s) {
    var i = r.isStreamLike(s);
    if (i) {
      if (!(s instanceof n)) {
        var a = n.create(s, {
          maxDataSize: 1 / 0,
          pauseStream: this.pauseStreams
        });
        s.on("data", this._checkDataSize.bind(this)), s = a;
      }
      this._handleErrors(s), this.pauseStreams && s.pause();
    }
    return this._streams.push(s), this;
  }, r.prototype.pipe = function(s, i) {
    return t.prototype.pipe.call(this, s, i), this.resume(), s;
  }, r.prototype._getNext = function() {
    if (this._currentStream = null, this._insideLoop) {
      this._pendingNext = !0;
      return;
    }
    this._insideLoop = !0;
    try {
      do
        this._pendingNext = !1, this._realGetNext();
      while (this._pendingNext);
    } finally {
      this._insideLoop = !1;
    }
  }, r.prototype._realGetNext = function() {
    var s = this._streams.shift();
    if (typeof s > "u") {
      this.end();
      return;
    }
    if (typeof s != "function") {
      this._pipeNext(s);
      return;
    }
    var i = s;
    i((function(a) {
      var o = r.isStreamLike(a);
      o && (a.on("data", this._checkDataSize.bind(this)), this._handleErrors(a)), this._pipeNext(a);
    }).bind(this));
  }, r.prototype._pipeNext = function(s) {
    this._currentStream = s;
    var i = r.isStreamLike(s);
    if (i) {
      s.on("end", this._getNext.bind(this)), s.pipe(this, { end: !1 });
      return;
    }
    var a = s;
    this.write(a), this._getNext();
  }, r.prototype._handleErrors = function(s) {
    var i = this;
    s.on("error", function(a) {
      i._emitError(a);
    });
  }, r.prototype.write = function(s) {
    this.emit("data", s);
  }, r.prototype.pause = function() {
    this.pauseStreams && (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function" && this._currentStream.pause(), this.emit("pause"));
  }, r.prototype.resume = function() {
    this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function" && this._currentStream.resume(), this.emit("resume");
  }, r.prototype.end = function() {
    this._reset(), this.emit("end");
  }, r.prototype.destroy = function() {
    this._reset(), this.emit("close");
  }, r.prototype._reset = function() {
    this.writable = !1, this._streams = [], this._currentStream = null;
  }, r.prototype._checkDataSize = function() {
    if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
      var s = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(s));
    }
  }, r.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var s = this;
    this._streams.forEach(function(i) {
      i.dataSize && (s.dataSize += i.dataSize);
    }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize);
  }, r.prototype._emitError = function(s) {
    this._reset(), this.emit("error", s);
  }, si;
}
var ii = {};
const m_ = {
  "application/1d-interleaved-parityfec": { source: "iana" },
  "application/3gpdash-qoe-report+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/3gpp-ims+xml": { source: "iana", compressible: !0 },
  "application/3gpphal+json": { source: "iana", compressible: !0 },
  "application/3gpphalforms+json": { source: "iana", compressible: !0 },
  "application/a2l": { source: "iana" },
  "application/ace+cbor": { source: "iana" },
  "application/activemessage": { source: "iana" },
  "application/activity+json": { source: "iana", compressible: !0 },
  "application/alto-costmap+json": { source: "iana", compressible: !0 },
  "application/alto-costmapfilter+json": { source: "iana", compressible: !0 },
  "application/alto-directory+json": { source: "iana", compressible: !0 },
  "application/alto-endpointcost+json": { source: "iana", compressible: !0 },
  "application/alto-endpointcostparams+json": { source: "iana", compressible: !0 },
  "application/alto-endpointprop+json": { source: "iana", compressible: !0 },
  "application/alto-endpointpropparams+json": { source: "iana", compressible: !0 },
  "application/alto-error+json": { source: "iana", compressible: !0 },
  "application/alto-networkmap+json": { source: "iana", compressible: !0 },
  "application/alto-networkmapfilter+json": { source: "iana", compressible: !0 },
  "application/alto-updatestreamcontrol+json": { source: "iana", compressible: !0 },
  "application/alto-updatestreamparams+json": { source: "iana", compressible: !0 },
  "application/aml": { source: "iana" },
  "application/andrew-inset": { source: "iana", extensions: ["ez"] },
  "application/applefile": { source: "iana" },
  "application/applixware": { source: "apache", extensions: ["aw"] },
  "application/at+jwt": { source: "iana" },
  "application/atf": { source: "iana" },
  "application/atfx": { source: "iana" },
  "application/atom+xml": { source: "iana", compressible: !0, extensions: ["atom"] },
  "application/atomcat+xml": { source: "iana", compressible: !0, extensions: ["atomcat"] },
  "application/atomdeleted+xml": { source: "iana", compressible: !0, extensions: ["atomdeleted"] },
  "application/atomicmail": { source: "iana" },
  "application/atomsvc+xml": { source: "iana", compressible: !0, extensions: ["atomsvc"] },
  "application/atsc-dwd+xml": { source: "iana", compressible: !0, extensions: ["dwd"] },
  "application/atsc-dynamic-event-message": { source: "iana" },
  "application/atsc-held+xml": { source: "iana", compressible: !0, extensions: ["held"] },
  "application/atsc-rdt+json": { source: "iana", compressible: !0 },
  "application/atsc-rsat+xml": { source: "iana", compressible: !0, extensions: ["rsat"] },
  "application/atxml": { source: "iana" },
  "application/auth-policy+xml": { source: "iana", compressible: !0 },
  "application/bacnet-xdd+zip": { source: "iana", compressible: !1 },
  "application/batch-smtp": { source: "iana" },
  "application/bdoc": { compressible: !1, extensions: ["bdoc"] },
  "application/beep+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/calendar+json": { source: "iana", compressible: !0 },
  "application/calendar+xml": { source: "iana", compressible: !0, extensions: ["xcs"] },
  "application/call-completion": { source: "iana" },
  "application/cals-1840": { source: "iana" },
  "application/captive+json": { source: "iana", compressible: !0 },
  "application/cbor": { source: "iana" },
  "application/cbor-seq": { source: "iana" },
  "application/cccex": { source: "iana" },
  "application/ccmp+xml": { source: "iana", compressible: !0 },
  "application/ccxml+xml": { source: "iana", compressible: !0, extensions: ["ccxml"] },
  "application/cdfx+xml": { source: "iana", compressible: !0, extensions: ["cdfx"] },
  "application/cdmi-capability": { source: "iana", extensions: ["cdmia"] },
  "application/cdmi-container": { source: "iana", extensions: ["cdmic"] },
  "application/cdmi-domain": { source: "iana", extensions: ["cdmid"] },
  "application/cdmi-object": { source: "iana", extensions: ["cdmio"] },
  "application/cdmi-queue": { source: "iana", extensions: ["cdmiq"] },
  "application/cdni": { source: "iana" },
  "application/cea": { source: "iana" },
  "application/cea-2018+xml": { source: "iana", compressible: !0 },
  "application/cellml+xml": { source: "iana", compressible: !0 },
  "application/cfw": { source: "iana" },
  "application/city+json": { source: "iana", compressible: !0 },
  "application/clr": { source: "iana" },
  "application/clue+xml": { source: "iana", compressible: !0 },
  "application/clue_info+xml": { source: "iana", compressible: !0 },
  "application/cms": { source: "iana" },
  "application/cnrp+xml": { source: "iana", compressible: !0 },
  "application/coap-group+json": { source: "iana", compressible: !0 },
  "application/coap-payload": { source: "iana" },
  "application/commonground": { source: "iana" },
  "application/conference-info+xml": { source: "iana", compressible: !0 },
  "application/cose": { source: "iana" },
  "application/cose-key": { source: "iana" },
  "application/cose-key-set": { source: "iana" },
  "application/cpl+xml": { source: "iana", compressible: !0, extensions: ["cpl"] },
  "application/csrattrs": { source: "iana" },
  "application/csta+xml": { source: "iana", compressible: !0 },
  "application/cstadata+xml": { source: "iana", compressible: !0 },
  "application/csvm+json": { source: "iana", compressible: !0 },
  "application/cu-seeme": { source: "apache", extensions: ["cu"] },
  "application/cwt": { source: "iana" },
  "application/cybercash": { source: "iana" },
  "application/dart": { compressible: !0 },
  "application/dash+xml": { source: "iana", compressible: !0, extensions: ["mpd"] },
  "application/dash-patch+xml": { source: "iana", compressible: !0, extensions: ["mpp"] },
  "application/dashdelta": { source: "iana" },
  "application/davmount+xml": { source: "iana", compressible: !0, extensions: ["davmount"] },
  "application/dca-rft": { source: "iana" },
  "application/dcd": { source: "iana" },
  "application/dec-dx": { source: "iana" },
  "application/dialog-info+xml": { source: "iana", compressible: !0 },
  "application/dicom": { source: "iana" },
  "application/dicom+json": { source: "iana", compressible: !0 },
  "application/dicom+xml": { source: "iana", compressible: !0 },
  "application/dii": { source: "iana" },
  "application/dit": { source: "iana" },
  "application/dns": { source: "iana" },
  "application/dns+json": { source: "iana", compressible: !0 },
  "application/dns-message": { source: "iana" },
  "application/docbook+xml": { source: "apache", compressible: !0, extensions: ["dbk"] },
  "application/dots+cbor": { source: "iana" },
  "application/dskpp+xml": { source: "iana", compressible: !0 },
  "application/dssc+der": { source: "iana", extensions: ["dssc"] },
  "application/dssc+xml": { source: "iana", compressible: !0, extensions: ["xdssc"] },
  "application/dvcs": { source: "iana" },
  "application/ecmascript": { source: "iana", compressible: !0, extensions: ["es", "ecma"] },
  "application/edi-consent": { source: "iana" },
  "application/edi-x12": { source: "iana", compressible: !1 },
  "application/edifact": { source: "iana", compressible: !1 },
  "application/efi": { source: "iana" },
  "application/elm+json": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/elm+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.cap+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/emergencycalldata.comment+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.control+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.deviceinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.ecall.msd": { source: "iana" },
  "application/emergencycalldata.providerinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.serviceinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.subscriberinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.veds+xml": { source: "iana", compressible: !0 },
  "application/emma+xml": { source: "iana", compressible: !0, extensions: ["emma"] },
  "application/emotionml+xml": { source: "iana", compressible: !0, extensions: ["emotionml"] },
  "application/encaprtp": { source: "iana" },
  "application/epp+xml": { source: "iana", compressible: !0 },
  "application/epub+zip": { source: "iana", compressible: !1, extensions: ["epub"] },
  "application/eshop": { source: "iana" },
  "application/exi": { source: "iana", extensions: ["exi"] },
  "application/expect-ct-report+json": { source: "iana", compressible: !0 },
  "application/express": { source: "iana", extensions: ["exp"] },
  "application/fastinfoset": { source: "iana" },
  "application/fastsoap": { source: "iana" },
  "application/fdt+xml": { source: "iana", compressible: !0, extensions: ["fdt"] },
  "application/fhir+json": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/fhir+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/fido.trusted-apps+json": { compressible: !0 },
  "application/fits": { source: "iana" },
  "application/flexfec": { source: "iana" },
  "application/font-sfnt": { source: "iana" },
  "application/font-tdpfr": { source: "iana", extensions: ["pfr"] },
  "application/font-woff": { source: "iana", compressible: !1 },
  "application/framework-attributes+xml": { source: "iana", compressible: !0 },
  "application/geo+json": { source: "iana", compressible: !0, extensions: ["geojson"] },
  "application/geo+json-seq": { source: "iana" },
  "application/geopackage+sqlite3": { source: "iana" },
  "application/geoxacml+xml": { source: "iana", compressible: !0 },
  "application/gltf-buffer": { source: "iana" },
  "application/gml+xml": { source: "iana", compressible: !0, extensions: ["gml"] },
  "application/gpx+xml": { source: "apache", compressible: !0, extensions: ["gpx"] },
  "application/gxf": { source: "apache", extensions: ["gxf"] },
  "application/gzip": { source: "iana", compressible: !1, extensions: ["gz"] },
  "application/h224": { source: "iana" },
  "application/held+xml": { source: "iana", compressible: !0 },
  "application/hjson": { extensions: ["hjson"] },
  "application/http": { source: "iana" },
  "application/hyperstudio": { source: "iana", extensions: ["stk"] },
  "application/ibe-key-request+xml": { source: "iana", compressible: !0 },
  "application/ibe-pkg-reply+xml": { source: "iana", compressible: !0 },
  "application/ibe-pp-data": { source: "iana" },
  "application/iges": { source: "iana" },
  "application/im-iscomposing+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/index": { source: "iana" },
  "application/index.cmd": { source: "iana" },
  "application/index.obj": { source: "iana" },
  "application/index.response": { source: "iana" },
  "application/index.vnd": { source: "iana" },
  "application/inkml+xml": { source: "iana", compressible: !0, extensions: ["ink", "inkml"] },
  "application/iotp": { source: "iana" },
  "application/ipfix": { source: "iana", extensions: ["ipfix"] },
  "application/ipp": { source: "iana" },
  "application/isup": { source: "iana" },
  "application/its+xml": { source: "iana", compressible: !0, extensions: ["its"] },
  "application/java-archive": { source: "apache", compressible: !1, extensions: ["jar", "war", "ear"] },
  "application/java-serialized-object": { source: "apache", compressible: !1, extensions: ["ser"] },
  "application/java-vm": { source: "apache", compressible: !1, extensions: ["class"] },
  "application/javascript": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["js", "mjs"] },
  "application/jf2feed+json": { source: "iana", compressible: !0 },
  "application/jose": { source: "iana" },
  "application/jose+json": { source: "iana", compressible: !0 },
  "application/jrd+json": { source: "iana", compressible: !0 },
  "application/jscalendar+json": { source: "iana", compressible: !0 },
  "application/json": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["json", "map"] },
  "application/json-patch+json": { source: "iana", compressible: !0 },
  "application/json-seq": { source: "iana" },
  "application/json5": { extensions: ["json5"] },
  "application/jsonml+json": { source: "apache", compressible: !0, extensions: ["jsonml"] },
  "application/jwk+json": { source: "iana", compressible: !0 },
  "application/jwk-set+json": { source: "iana", compressible: !0 },
  "application/jwt": { source: "iana" },
  "application/kpml-request+xml": { source: "iana", compressible: !0 },
  "application/kpml-response+xml": { source: "iana", compressible: !0 },
  "application/ld+json": { source: "iana", compressible: !0, extensions: ["jsonld"] },
  "application/lgr+xml": { source: "iana", compressible: !0, extensions: ["lgr"] },
  "application/link-format": { source: "iana" },
  "application/load-control+xml": { source: "iana", compressible: !0 },
  "application/lost+xml": { source: "iana", compressible: !0, extensions: ["lostxml"] },
  "application/lostsync+xml": { source: "iana", compressible: !0 },
  "application/lpf+zip": { source: "iana", compressible: !1 },
  "application/lxf": { source: "iana" },
  "application/mac-binhex40": { source: "iana", extensions: ["hqx"] },
  "application/mac-compactpro": { source: "apache", extensions: ["cpt"] },
  "application/macwriteii": { source: "iana" },
  "application/mads+xml": { source: "iana", compressible: !0, extensions: ["mads"] },
  "application/manifest+json": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["webmanifest"] },
  "application/marc": { source: "iana", extensions: ["mrc"] },
  "application/marcxml+xml": { source: "iana", compressible: !0, extensions: ["mrcx"] },
  "application/mathematica": { source: "iana", extensions: ["ma", "nb", "mb"] },
  "application/mathml+xml": { source: "iana", compressible: !0, extensions: ["mathml"] },
  "application/mathml-content+xml": { source: "iana", compressible: !0 },
  "application/mathml-presentation+xml": { source: "iana", compressible: !0 },
  "application/mbms-associated-procedure-description+xml": { source: "iana", compressible: !0 },
  "application/mbms-deregister+xml": { source: "iana", compressible: !0 },
  "application/mbms-envelope+xml": { source: "iana", compressible: !0 },
  "application/mbms-msk+xml": { source: "iana", compressible: !0 },
  "application/mbms-msk-response+xml": { source: "iana", compressible: !0 },
  "application/mbms-protection-description+xml": { source: "iana", compressible: !0 },
  "application/mbms-reception-report+xml": { source: "iana", compressible: !0 },
  "application/mbms-register+xml": { source: "iana", compressible: !0 },
  "application/mbms-register-response+xml": { source: "iana", compressible: !0 },
  "application/mbms-schedule+xml": { source: "iana", compressible: !0 },
  "application/mbms-user-service-description+xml": { source: "iana", compressible: !0 },
  "application/mbox": { source: "iana", extensions: ["mbox"] },
  "application/media-policy-dataset+xml": { source: "iana", compressible: !0, extensions: ["mpf"] },
  "application/media_control+xml": { source: "iana", compressible: !0 },
  "application/mediaservercontrol+xml": { source: "iana", compressible: !0, extensions: ["mscml"] },
  "application/merge-patch+json": { source: "iana", compressible: !0 },
  "application/metalink+xml": { source: "apache", compressible: !0, extensions: ["metalink"] },
  "application/metalink4+xml": { source: "iana", compressible: !0, extensions: ["meta4"] },
  "application/mets+xml": { source: "iana", compressible: !0, extensions: ["mets"] },
  "application/mf4": { source: "iana" },
  "application/mikey": { source: "iana" },
  "application/mipc": { source: "iana" },
  "application/missing-blocks+cbor-seq": { source: "iana" },
  "application/mmt-aei+xml": { source: "iana", compressible: !0, extensions: ["maei"] },
  "application/mmt-usd+xml": { source: "iana", compressible: !0, extensions: ["musd"] },
  "application/mods+xml": { source: "iana", compressible: !0, extensions: ["mods"] },
  "application/moss-keys": { source: "iana" },
  "application/moss-signature": { source: "iana" },
  "application/mosskey-data": { source: "iana" },
  "application/mosskey-request": { source: "iana" },
  "application/mp21": { source: "iana", extensions: ["m21", "mp21"] },
  "application/mp4": { source: "iana", extensions: ["mp4s", "m4p"] },
  "application/mpeg4-generic": { source: "iana" },
  "application/mpeg4-iod": { source: "iana" },
  "application/mpeg4-iod-xmt": { source: "iana" },
  "application/mrb-consumer+xml": { source: "iana", compressible: !0 },
  "application/mrb-publish+xml": { source: "iana", compressible: !0 },
  "application/msc-ivr+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/msc-mixer+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/msword": { source: "iana", compressible: !1, extensions: ["doc", "dot"] },
  "application/mud+json": { source: "iana", compressible: !0 },
  "application/multipart-core": { source: "iana" },
  "application/mxf": { source: "iana", extensions: ["mxf"] },
  "application/n-quads": { source: "iana", extensions: ["nq"] },
  "application/n-triples": { source: "iana", extensions: ["nt"] },
  "application/nasdata": { source: "iana" },
  "application/news-checkgroups": { source: "iana", charset: "US-ASCII" },
  "application/news-groupinfo": { source: "iana", charset: "US-ASCII" },
  "application/news-transmission": { source: "iana" },
  "application/nlsml+xml": { source: "iana", compressible: !0 },
  "application/node": { source: "iana", extensions: ["cjs"] },
  "application/nss": { source: "iana" },
  "application/oauth-authz-req+jwt": { source: "iana" },
  "application/oblivious-dns-message": { source: "iana" },
  "application/ocsp-request": { source: "iana" },
  "application/ocsp-response": { source: "iana" },
  "application/octet-stream": { source: "iana", compressible: !1, extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"] },
  "application/oda": { source: "iana", extensions: ["oda"] },
  "application/odm+xml": { source: "iana", compressible: !0 },
  "application/odx": { source: "iana" },
  "application/oebps-package+xml": { source: "iana", compressible: !0, extensions: ["opf"] },
  "application/ogg": { source: "iana", compressible: !1, extensions: ["ogx"] },
  "application/omdoc+xml": { source: "apache", compressible: !0, extensions: ["omdoc"] },
  "application/onenote": { source: "apache", extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"] },
  "application/opc-nodeset+xml": { source: "iana", compressible: !0 },
  "application/oscore": { source: "iana" },
  "application/oxps": { source: "iana", extensions: ["oxps"] },
  "application/p21": { source: "iana" },
  "application/p21+zip": { source: "iana", compressible: !1 },
  "application/p2p-overlay+xml": { source: "iana", compressible: !0, extensions: ["relo"] },
  "application/parityfec": { source: "iana" },
  "application/passport": { source: "iana" },
  "application/patch-ops-error+xml": { source: "iana", compressible: !0, extensions: ["xer"] },
  "application/pdf": { source: "iana", compressible: !1, extensions: ["pdf"] },
  "application/pdx": { source: "iana" },
  "application/pem-certificate-chain": { source: "iana" },
  "application/pgp-encrypted": { source: "iana", compressible: !1, extensions: ["pgp"] },
  "application/pgp-keys": { source: "iana", extensions: ["asc"] },
  "application/pgp-signature": { source: "iana", extensions: ["asc", "sig"] },
  "application/pics-rules": { source: "apache", extensions: ["prf"] },
  "application/pidf+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/pidf-diff+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/pkcs10": { source: "iana", extensions: ["p10"] },
  "application/pkcs12": { source: "iana" },
  "application/pkcs7-mime": { source: "iana", extensions: ["p7m", "p7c"] },
  "application/pkcs7-signature": { source: "iana", extensions: ["p7s"] },
  "application/pkcs8": { source: "iana", extensions: ["p8"] },
  "application/pkcs8-encrypted": { source: "iana" },
  "application/pkix-attr-cert": { source: "iana", extensions: ["ac"] },
  "application/pkix-cert": { source: "iana", extensions: ["cer"] },
  "application/pkix-crl": { source: "iana", extensions: ["crl"] },
  "application/pkix-pkipath": { source: "iana", extensions: ["pkipath"] },
  "application/pkixcmp": { source: "iana", extensions: ["pki"] },
  "application/pls+xml": { source: "iana", compressible: !0, extensions: ["pls"] },
  "application/poc-settings+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/postscript": { source: "iana", compressible: !0, extensions: ["ai", "eps", "ps"] },
  "application/ppsp-tracker+json": { source: "iana", compressible: !0 },
  "application/problem+json": { source: "iana", compressible: !0 },
  "application/problem+xml": { source: "iana", compressible: !0 },
  "application/provenance+xml": { source: "iana", compressible: !0, extensions: ["provx"] },
  "application/prs.alvestrand.titrax-sheet": { source: "iana" },
  "application/prs.cww": { source: "iana", extensions: ["cww"] },
  "application/prs.cyn": { source: "iana", charset: "7-BIT" },
  "application/prs.hpub+zip": { source: "iana", compressible: !1 },
  "application/prs.nprend": { source: "iana" },
  "application/prs.plucker": { source: "iana" },
  "application/prs.rdf-xml-crypt": { source: "iana" },
  "application/prs.xsf+xml": { source: "iana", compressible: !0 },
  "application/pskc+xml": { source: "iana", compressible: !0, extensions: ["pskcxml"] },
  "application/pvd+json": { source: "iana", compressible: !0 },
  "application/qsig": { source: "iana" },
  "application/raml+yaml": { compressible: !0, extensions: ["raml"] },
  "application/raptorfec": { source: "iana" },
  "application/rdap+json": { source: "iana", compressible: !0 },
  "application/rdf+xml": { source: "iana", compressible: !0, extensions: ["rdf", "owl"] },
  "application/reginfo+xml": { source: "iana", compressible: !0, extensions: ["rif"] },
  "application/relax-ng-compact-syntax": { source: "iana", extensions: ["rnc"] },
  "application/remote-printing": { source: "iana" },
  "application/reputon+json": { source: "iana", compressible: !0 },
  "application/resource-lists+xml": { source: "iana", compressible: !0, extensions: ["rl"] },
  "application/resource-lists-diff+xml": { source: "iana", compressible: !0, extensions: ["rld"] },
  "application/rfc+xml": { source: "iana", compressible: !0 },
  "application/riscos": { source: "iana" },
  "application/rlmi+xml": { source: "iana", compressible: !0 },
  "application/rls-services+xml": { source: "iana", compressible: !0, extensions: ["rs"] },
  "application/route-apd+xml": { source: "iana", compressible: !0, extensions: ["rapd"] },
  "application/route-s-tsid+xml": { source: "iana", compressible: !0, extensions: ["sls"] },
  "application/route-usd+xml": { source: "iana", compressible: !0, extensions: ["rusd"] },
  "application/rpki-ghostbusters": { source: "iana", extensions: ["gbr"] },
  "application/rpki-manifest": { source: "iana", extensions: ["mft"] },
  "application/rpki-publication": { source: "iana" },
  "application/rpki-roa": { source: "iana", extensions: ["roa"] },
  "application/rpki-updown": { source: "iana" },
  "application/rsd+xml": { source: "apache", compressible: !0, extensions: ["rsd"] },
  "application/rss+xml": { source: "apache", compressible: !0, extensions: ["rss"] },
  "application/rtf": { source: "iana", compressible: !0, extensions: ["rtf"] },
  "application/rtploopback": { source: "iana" },
  "application/rtx": { source: "iana" },
  "application/samlassertion+xml": { source: "iana", compressible: !0 },
  "application/samlmetadata+xml": { source: "iana", compressible: !0 },
  "application/sarif+json": { source: "iana", compressible: !0 },
  "application/sarif-external-properties+json": { source: "iana", compressible: !0 },
  "application/sbe": { source: "iana" },
  "application/sbml+xml": { source: "iana", compressible: !0, extensions: ["sbml"] },
  "application/scaip+xml": { source: "iana", compressible: !0 },
  "application/scim+json": { source: "iana", compressible: !0 },
  "application/scvp-cv-request": { source: "iana", extensions: ["scq"] },
  "application/scvp-cv-response": { source: "iana", extensions: ["scs"] },
  "application/scvp-vp-request": { source: "iana", extensions: ["spq"] },
  "application/scvp-vp-response": { source: "iana", extensions: ["spp"] },
  "application/sdp": { source: "iana", extensions: ["sdp"] },
  "application/secevent+jwt": { source: "iana" },
  "application/senml+cbor": { source: "iana" },
  "application/senml+json": { source: "iana", compressible: !0 },
  "application/senml+xml": { source: "iana", compressible: !0, extensions: ["senmlx"] },
  "application/senml-etch+cbor": { source: "iana" },
  "application/senml-etch+json": { source: "iana", compressible: !0 },
  "application/senml-exi": { source: "iana" },
  "application/sensml+cbor": { source: "iana" },
  "application/sensml+json": { source: "iana", compressible: !0 },
  "application/sensml+xml": { source: "iana", compressible: !0, extensions: ["sensmlx"] },
  "application/sensml-exi": { source: "iana" },
  "application/sep+xml": { source: "iana", compressible: !0 },
  "application/sep-exi": { source: "iana" },
  "application/session-info": { source: "iana" },
  "application/set-payment": { source: "iana" },
  "application/set-payment-initiation": { source: "iana", extensions: ["setpay"] },
  "application/set-registration": { source: "iana" },
  "application/set-registration-initiation": { source: "iana", extensions: ["setreg"] },
  "application/sgml": { source: "iana" },
  "application/sgml-open-catalog": { source: "iana" },
  "application/shf+xml": { source: "iana", compressible: !0, extensions: ["shf"] },
  "application/sieve": { source: "iana", extensions: ["siv", "sieve"] },
  "application/simple-filter+xml": { source: "iana", compressible: !0 },
  "application/simple-message-summary": { source: "iana" },
  "application/simplesymbolcontainer": { source: "iana" },
  "application/sipc": { source: "iana" },
  "application/slate": { source: "iana" },
  "application/smil": { source: "iana" },
  "application/smil+xml": { source: "iana", compressible: !0, extensions: ["smi", "smil"] },
  "application/smpte336m": { source: "iana" },
  "application/soap+fastinfoset": { source: "iana" },
  "application/soap+xml": { source: "iana", compressible: !0 },
  "application/sparql-query": { source: "iana", extensions: ["rq"] },
  "application/sparql-results+xml": { source: "iana", compressible: !0, extensions: ["srx"] },
  "application/spdx+json": { source: "iana", compressible: !0 },
  "application/spirits-event+xml": { source: "iana", compressible: !0 },
  "application/sql": { source: "iana" },
  "application/srgs": { source: "iana", extensions: ["gram"] },
  "application/srgs+xml": { source: "iana", compressible: !0, extensions: ["grxml"] },
  "application/sru+xml": { source: "iana", compressible: !0, extensions: ["sru"] },
  "application/ssdl+xml": { source: "apache", compressible: !0, extensions: ["ssdl"] },
  "application/ssml+xml": { source: "iana", compressible: !0, extensions: ["ssml"] },
  "application/stix+json": { source: "iana", compressible: !0 },
  "application/swid+xml": { source: "iana", compressible: !0, extensions: ["swidtag"] },
  "application/tamp-apex-update": { source: "iana" },
  "application/tamp-apex-update-confirm": { source: "iana" },
  "application/tamp-community-update": { source: "iana" },
  "application/tamp-community-update-confirm": { source: "iana" },
  "application/tamp-error": { source: "iana" },
  "application/tamp-sequence-adjust": { source: "iana" },
  "application/tamp-sequence-adjust-confirm": { source: "iana" },
  "application/tamp-status-query": { source: "iana" },
  "application/tamp-status-response": { source: "iana" },
  "application/tamp-update": { source: "iana" },
  "application/tamp-update-confirm": { source: "iana" },
  "application/tar": { compressible: !0 },
  "application/taxii+json": { source: "iana", compressible: !0 },
  "application/td+json": { source: "iana", compressible: !0 },
  "application/tei+xml": { source: "iana", compressible: !0, extensions: ["tei", "teicorpus"] },
  "application/tetra_isi": { source: "iana" },
  "application/thraud+xml": { source: "iana", compressible: !0, extensions: ["tfi"] },
  "application/timestamp-query": { source: "iana" },
  "application/timestamp-reply": { source: "iana" },
  "application/timestamped-data": { source: "iana", extensions: ["tsd"] },
  "application/tlsrpt+gzip": { source: "iana" },
  "application/tlsrpt+json": { source: "iana", compressible: !0 },
  "application/tnauthlist": { source: "iana" },
  "application/token-introspection+jwt": { source: "iana" },
  "application/toml": { compressible: !0, extensions: ["toml"] },
  "application/trickle-ice-sdpfrag": { source: "iana" },
  "application/trig": { source: "iana", extensions: ["trig"] },
  "application/ttml+xml": { source: "iana", compressible: !0, extensions: ["ttml"] },
  "application/tve-trigger": { source: "iana" },
  "application/tzif": { source: "iana" },
  "application/tzif-leap": { source: "iana" },
  "application/ubjson": { compressible: !1, extensions: ["ubj"] },
  "application/ulpfec": { source: "iana" },
  "application/urc-grpsheet+xml": { source: "iana", compressible: !0 },
  "application/urc-ressheet+xml": { source: "iana", compressible: !0, extensions: ["rsheet"] },
  "application/urc-targetdesc+xml": { source: "iana", compressible: !0, extensions: ["td"] },
  "application/urc-uisocketdesc+xml": { source: "iana", compressible: !0 },
  "application/vcard+json": { source: "iana", compressible: !0 },
  "application/vcard+xml": { source: "iana", compressible: !0 },
  "application/vemmi": { source: "iana" },
  "application/vividence.scriptfile": { source: "apache" },
  "application/vnd.1000minds.decision-model+xml": { source: "iana", compressible: !0, extensions: ["1km"] },
  "application/vnd.3gpp-prose+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp-prose-pc3ch+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp-v2x-local-service-information": { source: "iana" },
  "application/vnd.3gpp.5gnas": { source: "iana" },
  "application/vnd.3gpp.access-transfer-events+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.bsf+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.gmop+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.gtpc": { source: "iana" },
  "application/vnd.3gpp.interworking-data": { source: "iana" },
  "application/vnd.3gpp.lpp": { source: "iana" },
  "application/vnd.3gpp.mc-signalling-ear": { source: "iana" },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-payload": { source: "iana" },
  "application/vnd.3gpp.mcdata-service-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-signalling": { source: "iana" },
  "application/vnd.3gpp.mcdata-ue-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-user-profile+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-floor-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-location-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-service-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-signed+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-ue-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-user-profile+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-location-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-service-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-ue-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-user-profile+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mid-call+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.ngap": { source: "iana" },
  "application/vnd.3gpp.pfcp": { source: "iana" },
  "application/vnd.3gpp.pic-bw-large": { source: "iana", extensions: ["plb"] },
  "application/vnd.3gpp.pic-bw-small": { source: "iana", extensions: ["psb"] },
  "application/vnd.3gpp.pic-bw-var": { source: "iana", extensions: ["pvb"] },
  "application/vnd.3gpp.s1ap": { source: "iana" },
  "application/vnd.3gpp.sms": { source: "iana" },
  "application/vnd.3gpp.sms+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.srvcc-ext+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.srvcc-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.state-and-event-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.ussd+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp2.bcmcsinfo+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp2.sms": { source: "iana" },
  "application/vnd.3gpp2.tcap": { source: "iana", extensions: ["tcap"] },
  "application/vnd.3lightssoftware.imagescal": { source: "iana" },
  "application/vnd.3m.post-it-notes": { source: "iana", extensions: ["pwn"] },
  "application/vnd.accpac.simply.aso": { source: "iana", extensions: ["aso"] },
  "application/vnd.accpac.simply.imp": { source: "iana", extensions: ["imp"] },
  "application/vnd.acucobol": { source: "iana", extensions: ["acu"] },
  "application/vnd.acucorp": { source: "iana", extensions: ["atc", "acutc"] },
  "application/vnd.adobe.air-application-installer-package+zip": { source: "apache", compressible: !1, extensions: ["air"] },
  "application/vnd.adobe.flash.movie": { source: "iana" },
  "application/vnd.adobe.formscentral.fcdt": { source: "iana", extensions: ["fcdt"] },
  "application/vnd.adobe.fxp": { source: "iana", extensions: ["fxp", "fxpl"] },
  "application/vnd.adobe.partial-upload": { source: "iana" },
  "application/vnd.adobe.xdp+xml": { source: "iana", compressible: !0, extensions: ["xdp"] },
  "application/vnd.adobe.xfdf": { source: "iana", extensions: ["xfdf"] },
  "application/vnd.aether.imp": { source: "iana" },
  "application/vnd.afpc.afplinedata": { source: "iana" },
  "application/vnd.afpc.afplinedata-pagedef": { source: "iana" },
  "application/vnd.afpc.cmoca-cmresource": { source: "iana" },
  "application/vnd.afpc.foca-charset": { source: "iana" },
  "application/vnd.afpc.foca-codedfont": { source: "iana" },
  "application/vnd.afpc.foca-codepage": { source: "iana" },
  "application/vnd.afpc.modca": { source: "iana" },
  "application/vnd.afpc.modca-cmtable": { source: "iana" },
  "application/vnd.afpc.modca-formdef": { source: "iana" },
  "application/vnd.afpc.modca-mediummap": { source: "iana" },
  "application/vnd.afpc.modca-objectcontainer": { source: "iana" },
  "application/vnd.afpc.modca-overlay": { source: "iana" },
  "application/vnd.afpc.modca-pagesegment": { source: "iana" },
  "application/vnd.age": { source: "iana", extensions: ["age"] },
  "application/vnd.ah-barcode": { source: "iana" },
  "application/vnd.ahead.space": { source: "iana", extensions: ["ahead"] },
  "application/vnd.airzip.filesecure.azf": { source: "iana", extensions: ["azf"] },
  "application/vnd.airzip.filesecure.azs": { source: "iana", extensions: ["azs"] },
  "application/vnd.amadeus+json": { source: "iana", compressible: !0 },
  "application/vnd.amazon.ebook": { source: "apache", extensions: ["azw"] },
  "application/vnd.amazon.mobi8-ebook": { source: "iana" },
  "application/vnd.americandynamics.acc": { source: "iana", extensions: ["acc"] },
  "application/vnd.amiga.ami": { source: "iana", extensions: ["ami"] },
  "application/vnd.amundsen.maze+xml": { source: "iana", compressible: !0 },
  "application/vnd.android.ota": { source: "iana" },
  "application/vnd.android.package-archive": { source: "apache", compressible: !1, extensions: ["apk"] },
  "application/vnd.anki": { source: "iana" },
  "application/vnd.anser-web-certificate-issue-initiation": { source: "iana", extensions: ["cii"] },
  "application/vnd.anser-web-funds-transfer-initiation": { source: "apache", extensions: ["fti"] },
  "application/vnd.antix.game-component": { source: "iana", extensions: ["atx"] },
  "application/vnd.apache.arrow.file": { source: "iana" },
  "application/vnd.apache.arrow.stream": { source: "iana" },
  "application/vnd.apache.thrift.binary": { source: "iana" },
  "application/vnd.apache.thrift.compact": { source: "iana" },
  "application/vnd.apache.thrift.json": { source: "iana" },
  "application/vnd.api+json": { source: "iana", compressible: !0 },
  "application/vnd.aplextor.warrp+json": { source: "iana", compressible: !0 },
  "application/vnd.apothekende.reservation+json": { source: "iana", compressible: !0 },
  "application/vnd.apple.installer+xml": { source: "iana", compressible: !0, extensions: ["mpkg"] },
  "application/vnd.apple.keynote": { source: "iana", extensions: ["key"] },
  "application/vnd.apple.mpegurl": { source: "iana", extensions: ["m3u8"] },
  "application/vnd.apple.numbers": { source: "iana", extensions: ["numbers"] },
  "application/vnd.apple.pages": { source: "iana", extensions: ["pages"] },
  "application/vnd.apple.pkpass": { compressible: !1, extensions: ["pkpass"] },
  "application/vnd.arastra.swi": { source: "iana" },
  "application/vnd.aristanetworks.swi": { source: "iana", extensions: ["swi"] },
  "application/vnd.artisan+json": { source: "iana", compressible: !0 },
  "application/vnd.artsquare": { source: "iana" },
  "application/vnd.astraea-software.iota": { source: "iana", extensions: ["iota"] },
  "application/vnd.audiograph": { source: "iana", extensions: ["aep"] },
  "application/vnd.autopackage": { source: "iana" },
  "application/vnd.avalon+json": { source: "iana", compressible: !0 },
  "application/vnd.avistar+xml": { source: "iana", compressible: !0 },
  "application/vnd.balsamiq.bmml+xml": { source: "iana", compressible: !0, extensions: ["bmml"] },
  "application/vnd.balsamiq.bmpr": { source: "iana" },
  "application/vnd.banana-accounting": { source: "iana" },
  "application/vnd.bbf.usp.error": { source: "iana" },
  "application/vnd.bbf.usp.msg": { source: "iana" },
  "application/vnd.bbf.usp.msg+json": { source: "iana", compressible: !0 },
  "application/vnd.bekitzur-stech+json": { source: "iana", compressible: !0 },
  "application/vnd.bint.med-content": { source: "iana" },
  "application/vnd.biopax.rdf+xml": { source: "iana", compressible: !0 },
  "application/vnd.blink-idb-value-wrapper": { source: "iana" },
  "application/vnd.blueice.multipass": { source: "iana", extensions: ["mpm"] },
  "application/vnd.bluetooth.ep.oob": { source: "iana" },
  "application/vnd.bluetooth.le.oob": { source: "iana" },
  "application/vnd.bmi": { source: "iana", extensions: ["bmi"] },
  "application/vnd.bpf": { source: "iana" },
  "application/vnd.bpf3": { source: "iana" },
  "application/vnd.businessobjects": { source: "iana", extensions: ["rep"] },
  "application/vnd.byu.uapi+json": { source: "iana", compressible: !0 },
  "application/vnd.cab-jscript": { source: "iana" },
  "application/vnd.canon-cpdl": { source: "iana" },
  "application/vnd.canon-lips": { source: "iana" },
  "application/vnd.capasystems-pg+json": { source: "iana", compressible: !0 },
  "application/vnd.cendio.thinlinc.clientconf": { source: "iana" },
  "application/vnd.century-systems.tcp_stream": { source: "iana" },
  "application/vnd.chemdraw+xml": { source: "iana", compressible: !0, extensions: ["cdxml"] },
  "application/vnd.chess-pgn": { source: "iana" },
  "application/vnd.chipnuts.karaoke-mmd": { source: "iana", extensions: ["mmd"] },
  "application/vnd.ciedi": { source: "iana" },
  "application/vnd.cinderella": { source: "iana", extensions: ["cdy"] },
  "application/vnd.cirpack.isdn-ext": { source: "iana" },
  "application/vnd.citationstyles.style+xml": { source: "iana", compressible: !0, extensions: ["csl"] },
  "application/vnd.claymore": { source: "iana", extensions: ["cla"] },
  "application/vnd.cloanto.rp9": { source: "iana", extensions: ["rp9"] },
  "application/vnd.clonk.c4group": { source: "iana", extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"] },
  "application/vnd.cluetrust.cartomobile-config": { source: "iana", extensions: ["c11amc"] },
  "application/vnd.cluetrust.cartomobile-config-pkg": { source: "iana", extensions: ["c11amz"] },
  "application/vnd.coffeescript": { source: "iana" },
  "application/vnd.collabio.xodocuments.document": { source: "iana" },
  "application/vnd.collabio.xodocuments.document-template": { source: "iana" },
  "application/vnd.collabio.xodocuments.presentation": { source: "iana" },
  "application/vnd.collabio.xodocuments.presentation-template": { source: "iana" },
  "application/vnd.collabio.xodocuments.spreadsheet": { source: "iana" },
  "application/vnd.collabio.xodocuments.spreadsheet-template": { source: "iana" },
  "application/vnd.collection+json": { source: "iana", compressible: !0 },
  "application/vnd.collection.doc+json": { source: "iana", compressible: !0 },
  "application/vnd.collection.next+json": { source: "iana", compressible: !0 },
  "application/vnd.comicbook+zip": { source: "iana", compressible: !1 },
  "application/vnd.comicbook-rar": { source: "iana" },
  "application/vnd.commerce-battelle": { source: "iana" },
  "application/vnd.commonspace": { source: "iana", extensions: ["csp"] },
  "application/vnd.contact.cmsg": { source: "iana", extensions: ["cdbcmsg"] },
  "application/vnd.coreos.ignition+json": { source: "iana", compressible: !0 },
  "application/vnd.cosmocaller": { source: "iana", extensions: ["cmc"] },
  "application/vnd.crick.clicker": { source: "iana", extensions: ["clkx"] },
  "application/vnd.crick.clicker.keyboard": { source: "iana", extensions: ["clkk"] },
  "application/vnd.crick.clicker.palette": { source: "iana", extensions: ["clkp"] },
  "application/vnd.crick.clicker.template": { source: "iana", extensions: ["clkt"] },
  "application/vnd.crick.clicker.wordbank": { source: "iana", extensions: ["clkw"] },
  "application/vnd.criticaltools.wbs+xml": { source: "iana", compressible: !0, extensions: ["wbs"] },
  "application/vnd.cryptii.pipe+json": { source: "iana", compressible: !0 },
  "application/vnd.crypto-shade-file": { source: "iana" },
  "application/vnd.cryptomator.encrypted": { source: "iana" },
  "application/vnd.cryptomator.vault": { source: "iana" },
  "application/vnd.ctc-posml": { source: "iana", extensions: ["pml"] },
  "application/vnd.ctct.ws+xml": { source: "iana", compressible: !0 },
  "application/vnd.cups-pdf": { source: "iana" },
  "application/vnd.cups-postscript": { source: "iana" },
  "application/vnd.cups-ppd": { source: "iana", extensions: ["ppd"] },
  "application/vnd.cups-raster": { source: "iana" },
  "application/vnd.cups-raw": { source: "iana" },
  "application/vnd.curl": { source: "iana" },
  "application/vnd.curl.car": { source: "apache", extensions: ["car"] },
  "application/vnd.curl.pcurl": { source: "apache", extensions: ["pcurl"] },
  "application/vnd.cyan.dean.root+xml": { source: "iana", compressible: !0 },
  "application/vnd.cybank": { source: "iana" },
  "application/vnd.cyclonedx+json": { source: "iana", compressible: !0 },
  "application/vnd.cyclonedx+xml": { source: "iana", compressible: !0 },
  "application/vnd.d2l.coursepackage1p0+zip": { source: "iana", compressible: !1 },
  "application/vnd.d3m-dataset": { source: "iana" },
  "application/vnd.d3m-problem": { source: "iana" },
  "application/vnd.dart": { source: "iana", compressible: !0, extensions: ["dart"] },
  "application/vnd.data-vision.rdz": { source: "iana", extensions: ["rdz"] },
  "application/vnd.datapackage+json": { source: "iana", compressible: !0 },
  "application/vnd.dataresource+json": { source: "iana", compressible: !0 },
  "application/vnd.dbf": { source: "iana", extensions: ["dbf"] },
  "application/vnd.debian.binary-package": { source: "iana" },
  "application/vnd.dece.data": { source: "iana", extensions: ["uvf", "uvvf", "uvd", "uvvd"] },
  "application/vnd.dece.ttml+xml": { source: "iana", compressible: !0, extensions: ["uvt", "uvvt"] },
  "application/vnd.dece.unspecified": { source: "iana", extensions: ["uvx", "uvvx"] },
  "application/vnd.dece.zip": { source: "iana", extensions: ["uvz", "uvvz"] },
  "application/vnd.denovo.fcselayout-link": { source: "iana", extensions: ["fe_launch"] },
  "application/vnd.desmume.movie": { source: "iana" },
  "application/vnd.dir-bi.plate-dl-nosuffix": { source: "iana" },
  "application/vnd.dm.delegation+xml": { source: "iana", compressible: !0 },
  "application/vnd.dna": { source: "iana", extensions: ["dna"] },
  "application/vnd.document+json": { source: "iana", compressible: !0 },
  "application/vnd.dolby.mlp": { source: "apache", extensions: ["mlp"] },
  "application/vnd.dolby.mobile.1": { source: "iana" },
  "application/vnd.dolby.mobile.2": { source: "iana" },
  "application/vnd.doremir.scorecloud-binary-document": { source: "iana" },
  "application/vnd.dpgraph": { source: "iana", extensions: ["dpg"] },
  "application/vnd.dreamfactory": { source: "iana", extensions: ["dfac"] },
  "application/vnd.drive+json": { source: "iana", compressible: !0 },
  "application/vnd.ds-keypoint": { source: "apache", extensions: ["kpxx"] },
  "application/vnd.dtg.local": { source: "iana" },
  "application/vnd.dtg.local.flash": { source: "iana" },
  "application/vnd.dtg.local.html": { source: "iana" },
  "application/vnd.dvb.ait": { source: "iana", extensions: ["ait"] },
  "application/vnd.dvb.dvbisl+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.dvbj": { source: "iana" },
  "application/vnd.dvb.esgcontainer": { source: "iana" },
  "application/vnd.dvb.ipdcdftnotifaccess": { source: "iana" },
  "application/vnd.dvb.ipdcesgaccess": { source: "iana" },
  "application/vnd.dvb.ipdcesgaccess2": { source: "iana" },
  "application/vnd.dvb.ipdcesgpdd": { source: "iana" },
  "application/vnd.dvb.ipdcroaming": { source: "iana" },
  "application/vnd.dvb.iptv.alfec-base": { source: "iana" },
  "application/vnd.dvb.iptv.alfec-enhancement": { source: "iana" },
  "application/vnd.dvb.notif-aggregate-root+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-container+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-generic+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-ia-msglist+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-ia-registration-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-ia-registration-response+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-init+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.pfr": { source: "iana" },
  "application/vnd.dvb.service": { source: "iana", extensions: ["svc"] },
  "application/vnd.dxr": { source: "iana" },
  "application/vnd.dynageo": { source: "iana", extensions: ["geo"] },
  "application/vnd.dzr": { source: "iana" },
  "application/vnd.easykaraoke.cdgdownload": { source: "iana" },
  "application/vnd.ecdis-update": { source: "iana" },
  "application/vnd.ecip.rlp": { source: "iana" },
  "application/vnd.eclipse.ditto+json": { source: "iana", compressible: !0 },
  "application/vnd.ecowin.chart": { source: "iana", extensions: ["mag"] },
  "application/vnd.ecowin.filerequest": { source: "iana" },
  "application/vnd.ecowin.fileupdate": { source: "iana" },
  "application/vnd.ecowin.series": { source: "iana" },
  "application/vnd.ecowin.seriesrequest": { source: "iana" },
  "application/vnd.ecowin.seriesupdate": { source: "iana" },
  "application/vnd.efi.img": { source: "iana" },
  "application/vnd.efi.iso": { source: "iana" },
  "application/vnd.emclient.accessrequest+xml": { source: "iana", compressible: !0 },
  "application/vnd.enliven": { source: "iana", extensions: ["nml"] },
  "application/vnd.enphase.envoy": { source: "iana" },
  "application/vnd.eprints.data+xml": { source: "iana", compressible: !0 },
  "application/vnd.epson.esf": { source: "iana", extensions: ["esf"] },
  "application/vnd.epson.msf": { source: "iana", extensions: ["msf"] },
  "application/vnd.epson.quickanime": { source: "iana", extensions: ["qam"] },
  "application/vnd.epson.salt": { source: "iana", extensions: ["slt"] },
  "application/vnd.epson.ssf": { source: "iana", extensions: ["ssf"] },
  "application/vnd.ericsson.quickcall": { source: "iana" },
  "application/vnd.espass-espass+zip": { source: "iana", compressible: !1 },
  "application/vnd.eszigno3+xml": { source: "iana", compressible: !0, extensions: ["es3", "et3"] },
  "application/vnd.etsi.aoc+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.asic-e+zip": { source: "iana", compressible: !1 },
  "application/vnd.etsi.asic-s+zip": { source: "iana", compressible: !1 },
  "application/vnd.etsi.cug+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvcommand+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvdiscovery+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsad-bc+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsad-cod+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsad-npvr+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvservice+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsync+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvueprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.mcid+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.mheg5": { source: "iana" },
  "application/vnd.etsi.overload-control-policy-dataset+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.pstn+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.sci+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.simservs+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.timestamp-token": { source: "iana" },
  "application/vnd.etsi.tsl+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.tsl.der": { source: "iana" },
  "application/vnd.eu.kasparian.car+json": { source: "iana", compressible: !0 },
  "application/vnd.eudora.data": { source: "iana" },
  "application/vnd.evolv.ecig.profile": { source: "iana" },
  "application/vnd.evolv.ecig.settings": { source: "iana" },
  "application/vnd.evolv.ecig.theme": { source: "iana" },
  "application/vnd.exstream-empower+zip": { source: "iana", compressible: !1 },
  "application/vnd.exstream-package": { source: "iana" },
  "application/vnd.ezpix-album": { source: "iana", extensions: ["ez2"] },
  "application/vnd.ezpix-package": { source: "iana", extensions: ["ez3"] },
  "application/vnd.f-secure.mobile": { source: "iana" },
  "application/vnd.familysearch.gedcom+zip": { source: "iana", compressible: !1 },
  "application/vnd.fastcopy-disk-image": { source: "iana" },
  "application/vnd.fdf": { source: "iana", extensions: ["fdf"] },
  "application/vnd.fdsn.mseed": { source: "iana", extensions: ["mseed"] },
  "application/vnd.fdsn.seed": { source: "iana", extensions: ["seed", "dataless"] },
  "application/vnd.ffsns": { source: "iana" },
  "application/vnd.ficlab.flb+zip": { source: "iana", compressible: !1 },
  "application/vnd.filmit.zfc": { source: "iana" },
  "application/vnd.fints": { source: "iana" },
  "application/vnd.firemonkeys.cloudcell": { source: "iana" },
  "application/vnd.flographit": { source: "iana", extensions: ["gph"] },
  "application/vnd.fluxtime.clip": { source: "iana", extensions: ["ftc"] },
  "application/vnd.font-fontforge-sfd": { source: "iana" },
  "application/vnd.framemaker": { source: "iana", extensions: ["fm", "frame", "maker", "book"] },
  "application/vnd.frogans.fnc": { source: "iana", extensions: ["fnc"] },
  "application/vnd.frogans.ltf": { source: "iana", extensions: ["ltf"] },
  "application/vnd.fsc.weblaunch": { source: "iana", extensions: ["fsc"] },
  "application/vnd.fujifilm.fb.docuworks": { source: "iana" },
  "application/vnd.fujifilm.fb.docuworks.binder": { source: "iana" },
  "application/vnd.fujifilm.fb.docuworks.container": { source: "iana" },
  "application/vnd.fujifilm.fb.jfi+xml": { source: "iana", compressible: !0 },
  "application/vnd.fujitsu.oasys": { source: "iana", extensions: ["oas"] },
  "application/vnd.fujitsu.oasys2": { source: "iana", extensions: ["oa2"] },
  "application/vnd.fujitsu.oasys3": { source: "iana", extensions: ["oa3"] },
  "application/vnd.fujitsu.oasysgp": { source: "iana", extensions: ["fg5"] },
  "application/vnd.fujitsu.oasysprs": { source: "iana", extensions: ["bh2"] },
  "application/vnd.fujixerox.art-ex": { source: "iana" },
  "application/vnd.fujixerox.art4": { source: "iana" },
  "application/vnd.fujixerox.ddd": { source: "iana", extensions: ["ddd"] },
  "application/vnd.fujixerox.docuworks": { source: "iana", extensions: ["xdw"] },
  "application/vnd.fujixerox.docuworks.binder": { source: "iana", extensions: ["xbd"] },
  "application/vnd.fujixerox.docuworks.container": { source: "iana" },
  "application/vnd.fujixerox.hbpl": { source: "iana" },
  "application/vnd.fut-misnet": { source: "iana" },
  "application/vnd.futoin+cbor": { source: "iana" },
  "application/vnd.futoin+json": { source: "iana", compressible: !0 },
  "application/vnd.fuzzysheet": { source: "iana", extensions: ["fzs"] },
  "application/vnd.genomatix.tuxedo": { source: "iana", extensions: ["txd"] },
  "application/vnd.gentics.grd+json": { source: "iana", compressible: !0 },
  "application/vnd.geo+json": { source: "iana", compressible: !0 },
  "application/vnd.geocube+xml": { source: "iana", compressible: !0 },
  "application/vnd.geogebra.file": { source: "iana", extensions: ["ggb"] },
  "application/vnd.geogebra.slides": { source: "iana" },
  "application/vnd.geogebra.tool": { source: "iana", extensions: ["ggt"] },
  "application/vnd.geometry-explorer": { source: "iana", extensions: ["gex", "gre"] },
  "application/vnd.geonext": { source: "iana", extensions: ["gxt"] },
  "application/vnd.geoplan": { source: "iana", extensions: ["g2w"] },
  "application/vnd.geospace": { source: "iana", extensions: ["g3w"] },
  "application/vnd.gerber": { source: "iana" },
  "application/vnd.globalplatform.card-content-mgt": { source: "iana" },
  "application/vnd.globalplatform.card-content-mgt-response": { source: "iana" },
  "application/vnd.gmx": { source: "iana", extensions: ["gmx"] },
  "application/vnd.google-apps.document": { compressible: !1, extensions: ["gdoc"] },
  "application/vnd.google-apps.presentation": { compressible: !1, extensions: ["gslides"] },
  "application/vnd.google-apps.spreadsheet": { compressible: !1, extensions: ["gsheet"] },
  "application/vnd.google-earth.kml+xml": { source: "iana", compressible: !0, extensions: ["kml"] },
  "application/vnd.google-earth.kmz": { source: "iana", compressible: !1, extensions: ["kmz"] },
  "application/vnd.gov.sk.e-form+xml": { source: "iana", compressible: !0 },
  "application/vnd.gov.sk.e-form+zip": { source: "iana", compressible: !1 },
  "application/vnd.gov.sk.xmldatacontainer+xml": { source: "iana", compressible: !0 },
  "application/vnd.grafeq": { source: "iana", extensions: ["gqf", "gqs"] },
  "application/vnd.gridmp": { source: "iana" },
  "application/vnd.groove-account": { source: "iana", extensions: ["gac"] },
  "application/vnd.groove-help": { source: "iana", extensions: ["ghf"] },
  "application/vnd.groove-identity-message": { source: "iana", extensions: ["gim"] },
  "application/vnd.groove-injector": { source: "iana", extensions: ["grv"] },
  "application/vnd.groove-tool-message": { source: "iana", extensions: ["gtm"] },
  "application/vnd.groove-tool-template": { source: "iana", extensions: ["tpl"] },
  "application/vnd.groove-vcard": { source: "iana", extensions: ["vcg"] },
  "application/vnd.hal+json": { source: "iana", compressible: !0 },
  "application/vnd.hal+xml": { source: "iana", compressible: !0, extensions: ["hal"] },
  "application/vnd.handheld-entertainment+xml": { source: "iana", compressible: !0, extensions: ["zmm"] },
  "application/vnd.hbci": { source: "iana", extensions: ["hbci"] },
  "application/vnd.hc+json": { source: "iana", compressible: !0 },
  "application/vnd.hcl-bireports": { source: "iana" },
  "application/vnd.hdt": { source: "iana" },
  "application/vnd.heroku+json": { source: "iana", compressible: !0 },
  "application/vnd.hhe.lesson-player": { source: "iana", extensions: ["les"] },
  "application/vnd.hl7cda+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.hl7v2+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.hp-hpgl": { source: "iana", extensions: ["hpgl"] },
  "application/vnd.hp-hpid": { source: "iana", extensions: ["hpid"] },
  "application/vnd.hp-hps": { source: "iana", extensions: ["hps"] },
  "application/vnd.hp-jlyt": { source: "iana", extensions: ["jlt"] },
  "application/vnd.hp-pcl": { source: "iana", extensions: ["pcl"] },
  "application/vnd.hp-pclxl": { source: "iana", extensions: ["pclxl"] },
  "application/vnd.httphone": { source: "iana" },
  "application/vnd.hydrostatix.sof-data": { source: "iana", extensions: ["sfd-hdstx"] },
  "application/vnd.hyper+json": { source: "iana", compressible: !0 },
  "application/vnd.hyper-item+json": { source: "iana", compressible: !0 },
  "application/vnd.hyperdrive+json": { source: "iana", compressible: !0 },
  "application/vnd.hzn-3d-crossword": { source: "iana" },
  "application/vnd.ibm.afplinedata": { source: "iana" },
  "application/vnd.ibm.electronic-media": { source: "iana" },
  "application/vnd.ibm.minipay": { source: "iana", extensions: ["mpy"] },
  "application/vnd.ibm.modcap": { source: "iana", extensions: ["afp", "listafp", "list3820"] },
  "application/vnd.ibm.rights-management": { source: "iana", extensions: ["irm"] },
  "application/vnd.ibm.secure-container": { source: "iana", extensions: ["sc"] },
  "application/vnd.iccprofile": { source: "iana", extensions: ["icc", "icm"] },
  "application/vnd.ieee.1905": { source: "iana" },
  "application/vnd.igloader": { source: "iana", extensions: ["igl"] },
  "application/vnd.imagemeter.folder+zip": { source: "iana", compressible: !1 },
  "application/vnd.imagemeter.image+zip": { source: "iana", compressible: !1 },
  "application/vnd.immervision-ivp": { source: "iana", extensions: ["ivp"] },
  "application/vnd.immervision-ivu": { source: "iana", extensions: ["ivu"] },
  "application/vnd.ims.imsccv1p1": { source: "iana" },
  "application/vnd.ims.imsccv1p2": { source: "iana" },
  "application/vnd.ims.imsccv1p3": { source: "iana" },
  "application/vnd.ims.lis.v2.result+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolproxy+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolproxy.id+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolsettings+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": { source: "iana", compressible: !0 },
  "application/vnd.informedcontrol.rms+xml": { source: "iana", compressible: !0 },
  "application/vnd.informix-visionary": { source: "iana" },
  "application/vnd.infotech.project": { source: "iana" },
  "application/vnd.infotech.project+xml": { source: "iana", compressible: !0 },
  "application/vnd.innopath.wamp.notification": { source: "iana" },
  "application/vnd.insors.igm": { source: "iana", extensions: ["igm"] },
  "application/vnd.intercon.formnet": { source: "iana", extensions: ["xpw", "xpx"] },
  "application/vnd.intergeo": { source: "iana", extensions: ["i2g"] },
  "application/vnd.intertrust.digibox": { source: "iana" },
  "application/vnd.intertrust.nncp": { source: "iana" },
  "application/vnd.intu.qbo": { source: "iana", extensions: ["qbo"] },
  "application/vnd.intu.qfx": { source: "iana", extensions: ["qfx"] },
  "application/vnd.iptc.g2.catalogitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.conceptitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.knowledgeitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.newsitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.newsmessage+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.packageitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.planningitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.ipunplugged.rcprofile": { source: "iana", extensions: ["rcprofile"] },
  "application/vnd.irepository.package+xml": { source: "iana", compressible: !0, extensions: ["irp"] },
  "application/vnd.is-xpr": { source: "iana", extensions: ["xpr"] },
  "application/vnd.isac.fcs": { source: "iana", extensions: ["fcs"] },
  "application/vnd.iso11783-10+zip": { source: "iana", compressible: !1 },
  "application/vnd.jam": { source: "iana", extensions: ["jam"] },
  "application/vnd.japannet-directory-service": { source: "iana" },
  "application/vnd.japannet-jpnstore-wakeup": { source: "iana" },
  "application/vnd.japannet-payment-wakeup": { source: "iana" },
  "application/vnd.japannet-registration": { source: "iana" },
  "application/vnd.japannet-registration-wakeup": { source: "iana" },
  "application/vnd.japannet-setstore-wakeup": { source: "iana" },
  "application/vnd.japannet-verification": { source: "iana" },
  "application/vnd.japannet-verification-wakeup": { source: "iana" },
  "application/vnd.jcp.javame.midlet-rms": { source: "iana", extensions: ["rms"] },
  "application/vnd.jisp": { source: "iana", extensions: ["jisp"] },
  "application/vnd.joost.joda-archive": { source: "iana", extensions: ["joda"] },
  "application/vnd.jsk.isdn-ngn": { source: "iana" },
  "application/vnd.kahootz": { source: "iana", extensions: ["ktz", "ktr"] },
  "application/vnd.kde.karbon": { source: "iana", extensions: ["karbon"] },
  "application/vnd.kde.kchart": { source: "iana", extensions: ["chrt"] },
  "application/vnd.kde.kformula": { source: "iana", extensions: ["kfo"] },
  "application/vnd.kde.kivio": { source: "iana", extensions: ["flw"] },
  "application/vnd.kde.kontour": { source: "iana", extensions: ["kon"] },
  "application/vnd.kde.kpresenter": { source: "iana", extensions: ["kpr", "kpt"] },
  "application/vnd.kde.kspread": { source: "iana", extensions: ["ksp"] },
  "application/vnd.kde.kword": { source: "iana", extensions: ["kwd", "kwt"] },
  "application/vnd.kenameaapp": { source: "iana", extensions: ["htke"] },
  "application/vnd.kidspiration": { source: "iana", extensions: ["kia"] },
  "application/vnd.kinar": { source: "iana", extensions: ["kne", "knp"] },
  "application/vnd.koan": { source: "iana", extensions: ["skp", "skd", "skt", "skm"] },
  "application/vnd.kodak-descriptor": { source: "iana", extensions: ["sse"] },
  "application/vnd.las": { source: "iana" },
  "application/vnd.las.las+json": { source: "iana", compressible: !0 },
  "application/vnd.las.las+xml": { source: "iana", compressible: !0, extensions: ["lasxml"] },
  "application/vnd.laszip": { source: "iana" },
  "application/vnd.leap+json": { source: "iana", compressible: !0 },
  "application/vnd.liberty-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.llamagraphics.life-balance.desktop": { source: "iana", extensions: ["lbd"] },
  "application/vnd.llamagraphics.life-balance.exchange+xml": { source: "iana", compressible: !0, extensions: ["lbe"] },
  "application/vnd.logipipe.circuit+zip": { source: "iana", compressible: !1 },
  "application/vnd.loom": { source: "iana" },
  "application/vnd.lotus-1-2-3": { source: "iana", extensions: ["123"] },
  "application/vnd.lotus-approach": { source: "iana", extensions: ["apr"] },
  "application/vnd.lotus-freelance": { source: "iana", extensions: ["pre"] },
  "application/vnd.lotus-notes": { source: "iana", extensions: ["nsf"] },
  "application/vnd.lotus-organizer": { source: "iana", extensions: ["org"] },
  "application/vnd.lotus-screencam": { source: "iana", extensions: ["scm"] },
  "application/vnd.lotus-wordpro": { source: "iana", extensions: ["lwp"] },
  "application/vnd.macports.portpkg": { source: "iana", extensions: ["portpkg"] },
  "application/vnd.mapbox-vector-tile": { source: "iana", extensions: ["mvt"] },
  "application/vnd.marlin.drm.actiontoken+xml": { source: "iana", compressible: !0 },
  "application/vnd.marlin.drm.conftoken+xml": { source: "iana", compressible: !0 },
  "application/vnd.marlin.drm.license+xml": { source: "iana", compressible: !0 },
  "application/vnd.marlin.drm.mdcf": { source: "iana" },
  "application/vnd.mason+json": { source: "iana", compressible: !0 },
  "application/vnd.maxar.archive.3tz+zip": { source: "iana", compressible: !1 },
  "application/vnd.maxmind.maxmind-db": { source: "iana" },
  "application/vnd.mcd": { source: "iana", extensions: ["mcd"] },
  "application/vnd.medcalcdata": { source: "iana", extensions: ["mc1"] },
  "application/vnd.mediastation.cdkey": { source: "iana", extensions: ["cdkey"] },
  "application/vnd.meridian-slingshot": { source: "iana" },
  "application/vnd.mfer": { source: "iana", extensions: ["mwf"] },
  "application/vnd.mfmp": { source: "iana", extensions: ["mfm"] },
  "application/vnd.micro+json": { source: "iana", compressible: !0 },
  "application/vnd.micrografx.flo": { source: "iana", extensions: ["flo"] },
  "application/vnd.micrografx.igx": { source: "iana", extensions: ["igx"] },
  "application/vnd.microsoft.portable-executable": { source: "iana" },
  "application/vnd.microsoft.windows.thumbnail-cache": { source: "iana" },
  "application/vnd.miele+json": { source: "iana", compressible: !0 },
  "application/vnd.mif": { source: "iana", extensions: ["mif"] },
  "application/vnd.minisoft-hp3000-save": { source: "iana" },
  "application/vnd.mitsubishi.misty-guard.trustweb": { source: "iana" },
  "application/vnd.mobius.daf": { source: "iana", extensions: ["daf"] },
  "application/vnd.mobius.dis": { source: "iana", extensions: ["dis"] },
  "application/vnd.mobius.mbk": { source: "iana", extensions: ["mbk"] },
  "application/vnd.mobius.mqy": { source: "iana", extensions: ["mqy"] },
  "application/vnd.mobius.msl": { source: "iana", extensions: ["msl"] },
  "application/vnd.mobius.plc": { source: "iana", extensions: ["plc"] },
  "application/vnd.mobius.txf": { source: "iana", extensions: ["txf"] },
  "application/vnd.mophun.application": { source: "iana", extensions: ["mpn"] },
  "application/vnd.mophun.certificate": { source: "iana", extensions: ["mpc"] },
  "application/vnd.motorola.flexsuite": { source: "iana" },
  "application/vnd.motorola.flexsuite.adsi": { source: "iana" },
  "application/vnd.motorola.flexsuite.fis": { source: "iana" },
  "application/vnd.motorola.flexsuite.gotap": { source: "iana" },
  "application/vnd.motorola.flexsuite.kmr": { source: "iana" },
  "application/vnd.motorola.flexsuite.ttc": { source: "iana" },
  "application/vnd.motorola.flexsuite.wem": { source: "iana" },
  "application/vnd.motorola.iprm": { source: "iana" },
  "application/vnd.mozilla.xul+xml": { source: "iana", compressible: !0, extensions: ["xul"] },
  "application/vnd.ms-3mfdocument": { source: "iana" },
  "application/vnd.ms-artgalry": { source: "iana", extensions: ["cil"] },
  "application/vnd.ms-asf": { source: "iana" },
  "application/vnd.ms-cab-compressed": { source: "iana", extensions: ["cab"] },
  "application/vnd.ms-color.iccprofile": { source: "apache" },
  "application/vnd.ms-excel": { source: "iana", compressible: !1, extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"] },
  "application/vnd.ms-excel.addin.macroenabled.12": { source: "iana", extensions: ["xlam"] },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": { source: "iana", extensions: ["xlsb"] },
  "application/vnd.ms-excel.sheet.macroenabled.12": { source: "iana", extensions: ["xlsm"] },
  "application/vnd.ms-excel.template.macroenabled.12": { source: "iana", extensions: ["xltm"] },
  "application/vnd.ms-fontobject": { source: "iana", compressible: !0, extensions: ["eot"] },
  "application/vnd.ms-htmlhelp": { source: "iana", extensions: ["chm"] },
  "application/vnd.ms-ims": { source: "iana", extensions: ["ims"] },
  "application/vnd.ms-lrm": { source: "iana", extensions: ["lrm"] },
  "application/vnd.ms-office.activex+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-officetheme": { source: "iana", extensions: ["thmx"] },
  "application/vnd.ms-opentype": { source: "apache", compressible: !0 },
  "application/vnd.ms-outlook": { compressible: !1, extensions: ["msg"] },
  "application/vnd.ms-package.obfuscated-opentype": { source: "apache" },
  "application/vnd.ms-pki.seccat": { source: "apache", extensions: ["cat"] },
  "application/vnd.ms-pki.stl": { source: "apache", extensions: ["stl"] },
  "application/vnd.ms-playready.initiator+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-powerpoint": { source: "iana", compressible: !1, extensions: ["ppt", "pps", "pot"] },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": { source: "iana", extensions: ["ppam"] },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": { source: "iana", extensions: ["pptm"] },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": { source: "iana", extensions: ["sldm"] },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": { source: "iana", extensions: ["ppsm"] },
  "application/vnd.ms-powerpoint.template.macroenabled.12": { source: "iana", extensions: ["potm"] },
  "application/vnd.ms-printdevicecapabilities+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-printing.printticket+xml": { source: "apache", compressible: !0 },
  "application/vnd.ms-printschematicket+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-project": { source: "iana", extensions: ["mpp", "mpt"] },
  "application/vnd.ms-tnef": { source: "iana" },
  "application/vnd.ms-windows.devicepairing": { source: "iana" },
  "application/vnd.ms-windows.nwprinting.oob": { source: "iana" },
  "application/vnd.ms-windows.printerpairing": { source: "iana" },
  "application/vnd.ms-windows.wsd.oob": { source: "iana" },
  "application/vnd.ms-wmdrm.lic-chlg-req": { source: "iana" },
  "application/vnd.ms-wmdrm.lic-resp": { source: "iana" },
  "application/vnd.ms-wmdrm.meter-chlg-req": { source: "iana" },
  "application/vnd.ms-wmdrm.meter-resp": { source: "iana" },
  "application/vnd.ms-word.document.macroenabled.12": { source: "iana", extensions: ["docm"] },
  "application/vnd.ms-word.template.macroenabled.12": { source: "iana", extensions: ["dotm"] },
  "application/vnd.ms-works": { source: "iana", extensions: ["wps", "wks", "wcm", "wdb"] },
  "application/vnd.ms-wpl": { source: "iana", extensions: ["wpl"] },
  "application/vnd.ms-xpsdocument": { source: "iana", compressible: !1, extensions: ["xps"] },
  "application/vnd.msa-disk-image": { source: "iana" },
  "application/vnd.mseq": { source: "iana", extensions: ["mseq"] },
  "application/vnd.msign": { source: "iana" },
  "application/vnd.multiad.creator": { source: "iana" },
  "application/vnd.multiad.creator.cif": { source: "iana" },
  "application/vnd.music-niff": { source: "iana" },
  "application/vnd.musician": { source: "iana", extensions: ["mus"] },
  "application/vnd.muvee.style": { source: "iana", extensions: ["msty"] },
  "application/vnd.mynfc": { source: "iana", extensions: ["taglet"] },
  "application/vnd.nacamar.ybrid+json": { source: "iana", compressible: !0 },
  "application/vnd.ncd.control": { source: "iana" },
  "application/vnd.ncd.reference": { source: "iana" },
  "application/vnd.nearst.inv+json": { source: "iana", compressible: !0 },
  "application/vnd.nebumind.line": { source: "iana" },
  "application/vnd.nervana": { source: "iana" },
  "application/vnd.netfpx": { source: "iana" },
  "application/vnd.neurolanguage.nlu": { source: "iana", extensions: ["nlu"] },
  "application/vnd.nimn": { source: "iana" },
  "application/vnd.nintendo.nitro.rom": { source: "iana" },
  "application/vnd.nintendo.snes.rom": { source: "iana" },
  "application/vnd.nitf": { source: "iana", extensions: ["ntf", "nitf"] },
  "application/vnd.noblenet-directory": { source: "iana", extensions: ["nnd"] },
  "application/vnd.noblenet-sealer": { source: "iana", extensions: ["nns"] },
  "application/vnd.noblenet-web": { source: "iana", extensions: ["nnw"] },
  "application/vnd.nokia.catalogs": { source: "iana" },
  "application/vnd.nokia.conml+wbxml": { source: "iana" },
  "application/vnd.nokia.conml+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.iptv.config+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.isds-radio-presets": { source: "iana" },
  "application/vnd.nokia.landmark+wbxml": { source: "iana" },
  "application/vnd.nokia.landmark+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.landmarkcollection+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.n-gage.ac+xml": { source: "iana", compressible: !0, extensions: ["ac"] },
  "application/vnd.nokia.n-gage.data": { source: "iana", extensions: ["ngdat"] },
  "application/vnd.nokia.n-gage.symbian.install": { source: "iana", extensions: ["n-gage"] },
  "application/vnd.nokia.ncd": { source: "iana" },
  "application/vnd.nokia.pcd+wbxml": { source: "iana" },
  "application/vnd.nokia.pcd+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.radio-preset": { source: "iana", extensions: ["rpst"] },
  "application/vnd.nokia.radio-presets": { source: "iana", extensions: ["rpss"] },
  "application/vnd.novadigm.edm": { source: "iana", extensions: ["edm"] },
  "application/vnd.novadigm.edx": { source: "iana", extensions: ["edx"] },
  "application/vnd.novadigm.ext": { source: "iana", extensions: ["ext"] },
  "application/vnd.ntt-local.content-share": { source: "iana" },
  "application/vnd.ntt-local.file-transfer": { source: "iana" },
  "application/vnd.ntt-local.ogw_remote-access": { source: "iana" },
  "application/vnd.ntt-local.sip-ta_remote": { source: "iana" },
  "application/vnd.ntt-local.sip-ta_tcp_stream": { source: "iana" },
  "application/vnd.oasis.opendocument.chart": { source: "iana", extensions: ["odc"] },
  "application/vnd.oasis.opendocument.chart-template": { source: "iana", extensions: ["otc"] },
  "application/vnd.oasis.opendocument.database": { source: "iana", extensions: ["odb"] },
  "application/vnd.oasis.opendocument.formula": { source: "iana", extensions: ["odf"] },
  "application/vnd.oasis.opendocument.formula-template": { source: "iana", extensions: ["odft"] },
  "application/vnd.oasis.opendocument.graphics": { source: "iana", compressible: !1, extensions: ["odg"] },
  "application/vnd.oasis.opendocument.graphics-template": { source: "iana", extensions: ["otg"] },
  "application/vnd.oasis.opendocument.image": { source: "iana", extensions: ["odi"] },
  "application/vnd.oasis.opendocument.image-template": { source: "iana", extensions: ["oti"] },
  "application/vnd.oasis.opendocument.presentation": { source: "iana", compressible: !1, extensions: ["odp"] },
  "application/vnd.oasis.opendocument.presentation-template": { source: "iana", extensions: ["otp"] },
  "application/vnd.oasis.opendocument.spreadsheet": { source: "iana", compressible: !1, extensions: ["ods"] },
  "application/vnd.oasis.opendocument.spreadsheet-template": { source: "iana", extensions: ["ots"] },
  "application/vnd.oasis.opendocument.text": { source: "iana", compressible: !1, extensions: ["odt"] },
  "application/vnd.oasis.opendocument.text-master": { source: "iana", extensions: ["odm"] },
  "application/vnd.oasis.opendocument.text-template": { source: "iana", extensions: ["ott"] },
  "application/vnd.oasis.opendocument.text-web": { source: "iana", extensions: ["oth"] },
  "application/vnd.obn": { source: "iana" },
  "application/vnd.ocf+cbor": { source: "iana" },
  "application/vnd.oci.image.manifest.v1+json": { source: "iana", compressible: !0 },
  "application/vnd.oftn.l10n+json": { source: "iana", compressible: !0 },
  "application/vnd.oipf.contentaccessdownload+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.contentaccessstreaming+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.cspg-hexbinary": { source: "iana" },
  "application/vnd.oipf.dae.svg+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.dae.xhtml+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.mippvcontrolmessage+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.pae.gem": { source: "iana" },
  "application/vnd.oipf.spdiscovery+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.spdlist+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.ueprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.userprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.olpc-sugar": { source: "iana", extensions: ["xo"] },
  "application/vnd.oma-scws-config": { source: "iana" },
  "application/vnd.oma-scws-http-request": { source: "iana" },
  "application/vnd.oma-scws-http-response": { source: "iana" },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.drm-trigger+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.imd+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.ltkm": { source: "iana" },
  "application/vnd.oma.bcast.notification+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.provisioningtrigger": { source: "iana" },
  "application/vnd.oma.bcast.sgboot": { source: "iana" },
  "application/vnd.oma.bcast.sgdd+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.sgdu": { source: "iana" },
  "application/vnd.oma.bcast.simple-symbol-container": { source: "iana" },
  "application/vnd.oma.bcast.smartcard-trigger+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.sprov+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.stkm": { source: "iana" },
  "application/vnd.oma.cab-address-book+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-feature-handler+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-pcc+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-subs-invite+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-user-prefs+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.dcd": { source: "iana" },
  "application/vnd.oma.dcdc": { source: "iana" },
  "application/vnd.oma.dd2+xml": { source: "iana", compressible: !0, extensions: ["dd2"] },
  "application/vnd.oma.drm.risd+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.group-usage-list+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.lwm2m+cbor": { source: "iana" },
  "application/vnd.oma.lwm2m+json": { source: "iana", compressible: !0 },
  "application/vnd.oma.lwm2m+tlv": { source: "iana" },
  "application/vnd.oma.pal+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.detailed-progress-report+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.final-report+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.groups+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.invocation-descriptor+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.optimized-progress-report+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.push": { source: "iana" },
  "application/vnd.oma.scidm.messages+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.xcap-directory+xml": { source: "iana", compressible: !0 },
  "application/vnd.omads-email+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.omads-file+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.omads-folder+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.omaloc-supl-init": { source: "iana" },
  "application/vnd.onepager": { source: "iana" },
  "application/vnd.onepagertamp": { source: "iana" },
  "application/vnd.onepagertamx": { source: "iana" },
  "application/vnd.onepagertat": { source: "iana" },
  "application/vnd.onepagertatp": { source: "iana" },
  "application/vnd.onepagertatx": { source: "iana" },
  "application/vnd.openblox.game+xml": { source: "iana", compressible: !0, extensions: ["obgx"] },
  "application/vnd.openblox.game-binary": { source: "iana" },
  "application/vnd.openeye.oeb": { source: "iana" },
  "application/vnd.openofficeorg.extension": { source: "apache", extensions: ["oxt"] },
  "application/vnd.openstreetmap.data+xml": { source: "iana", compressible: !0, extensions: ["osm"] },
  "application/vnd.opentimestamps.ots": { source: "iana" },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawing+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { source: "iana", compressible: !1, extensions: ["pptx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": { source: "iana", extensions: ["sldx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": { source: "iana", extensions: ["ppsx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.template": { source: "iana", extensions: ["potx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { source: "iana", compressible: !1, extensions: ["xlsx"] },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": { source: "iana", extensions: ["xltx"] },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.theme+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.vmldrawing": { source: "iana" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { source: "iana", compressible: !1, extensions: ["docx"] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": { source: "iana", extensions: ["dotx"] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-package.core-properties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-package.relationships+xml": { source: "iana", compressible: !0 },
  "application/vnd.oracle.resource+json": { source: "iana", compressible: !0 },
  "application/vnd.orange.indata": { source: "iana" },
  "application/vnd.osa.netdeploy": { source: "iana" },
  "application/vnd.osgeo.mapguide.package": { source: "iana", extensions: ["mgp"] },
  "application/vnd.osgi.bundle": { source: "iana" },
  "application/vnd.osgi.dp": { source: "iana", extensions: ["dp"] },
  "application/vnd.osgi.subsystem": { source: "iana", extensions: ["esa"] },
  "application/vnd.otps.ct-kip+xml": { source: "iana", compressible: !0 },
  "application/vnd.oxli.countgraph": { source: "iana" },
  "application/vnd.pagerduty+json": { source: "iana", compressible: !0 },
  "application/vnd.palm": { source: "iana", extensions: ["pdb", "pqa", "oprc"] },
  "application/vnd.panoply": { source: "iana" },
  "application/vnd.paos.xml": { source: "iana" },
  "application/vnd.patentdive": { source: "iana" },
  "application/vnd.patientecommsdoc": { source: "iana" },
  "application/vnd.pawaafile": { source: "iana", extensions: ["paw"] },
  "application/vnd.pcos": { source: "iana" },
  "application/vnd.pg.format": { source: "iana", extensions: ["str"] },
  "application/vnd.pg.osasli": { source: "iana", extensions: ["ei6"] },
  "application/vnd.piaccess.application-licence": { source: "iana" },
  "application/vnd.picsel": { source: "iana", extensions: ["efif"] },
  "application/vnd.pmi.widget": { source: "iana", extensions: ["wg"] },
  "application/vnd.poc.group-advertisement+xml": { source: "iana", compressible: !0 },
  "application/vnd.pocketlearn": { source: "iana", extensions: ["plf"] },
  "application/vnd.powerbuilder6": { source: "iana", extensions: ["pbd"] },
  "application/vnd.powerbuilder6-s": { source: "iana" },
  "application/vnd.powerbuilder7": { source: "iana" },
  "application/vnd.powerbuilder7-s": { source: "iana" },
  "application/vnd.powerbuilder75": { source: "iana" },
  "application/vnd.powerbuilder75-s": { source: "iana" },
  "application/vnd.preminet": { source: "iana" },
  "application/vnd.previewsystems.box": { source: "iana", extensions: ["box"] },
  "application/vnd.proteus.magazine": { source: "iana", extensions: ["mgz"] },
  "application/vnd.psfs": { source: "iana" },
  "application/vnd.publishare-delta-tree": { source: "iana", extensions: ["qps"] },
  "application/vnd.pvi.ptid1": { source: "iana", extensions: ["ptid"] },
  "application/vnd.pwg-multiplexed": { source: "iana" },
  "application/vnd.pwg-xhtml-print+xml": { source: "iana", compressible: !0 },
  "application/vnd.qualcomm.brew-app-res": { source: "iana" },
  "application/vnd.quarantainenet": { source: "iana" },
  "application/vnd.quark.quarkxpress": { source: "iana", extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"] },
  "application/vnd.quobject-quoxdocument": { source: "iana" },
  "application/vnd.radisys.moml+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-conf+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-conn+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-dialog+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-stream+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-conf+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-base+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-group+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-speech+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-transform+xml": { source: "iana", compressible: !0 },
  "application/vnd.rainstor.data": { source: "iana" },
  "application/vnd.rapid": { source: "iana" },
  "application/vnd.rar": { source: "iana", extensions: ["rar"] },
  "application/vnd.realvnc.bed": { source: "iana", extensions: ["bed"] },
  "application/vnd.recordare.musicxml": { source: "iana", extensions: ["mxl"] },
  "application/vnd.recordare.musicxml+xml": { source: "iana", compressible: !0, extensions: ["musicxml"] },
  "application/vnd.renlearn.rlprint": { source: "iana" },
  "application/vnd.resilient.logic": { source: "iana" },
  "application/vnd.restful+json": { source: "iana", compressible: !0 },
  "application/vnd.rig.cryptonote": { source: "iana", extensions: ["cryptonote"] },
  "application/vnd.rim.cod": { source: "apache", extensions: ["cod"] },
  "application/vnd.rn-realmedia": { source: "apache", extensions: ["rm"] },
  "application/vnd.rn-realmedia-vbr": { source: "apache", extensions: ["rmvb"] },
  "application/vnd.route66.link66+xml": { source: "iana", compressible: !0, extensions: ["link66"] },
  "application/vnd.rs-274x": { source: "iana" },
  "application/vnd.ruckus.download": { source: "iana" },
  "application/vnd.s3sms": { source: "iana" },
  "application/vnd.sailingtracker.track": { source: "iana", extensions: ["st"] },
  "application/vnd.sar": { source: "iana" },
  "application/vnd.sbm.cid": { source: "iana" },
  "application/vnd.sbm.mid2": { source: "iana" },
  "application/vnd.scribus": { source: "iana" },
  "application/vnd.sealed.3df": { source: "iana" },
  "application/vnd.sealed.csf": { source: "iana" },
  "application/vnd.sealed.doc": { source: "iana" },
  "application/vnd.sealed.eml": { source: "iana" },
  "application/vnd.sealed.mht": { source: "iana" },
  "application/vnd.sealed.net": { source: "iana" },
  "application/vnd.sealed.ppt": { source: "iana" },
  "application/vnd.sealed.tiff": { source: "iana" },
  "application/vnd.sealed.xls": { source: "iana" },
  "application/vnd.sealedmedia.softseal.html": { source: "iana" },
  "application/vnd.sealedmedia.softseal.pdf": { source: "iana" },
  "application/vnd.seemail": { source: "iana", extensions: ["see"] },
  "application/vnd.seis+json": { source: "iana", compressible: !0 },
  "application/vnd.sema": { source: "iana", extensions: ["sema"] },
  "application/vnd.semd": { source: "iana", extensions: ["semd"] },
  "application/vnd.semf": { source: "iana", extensions: ["semf"] },
  "application/vnd.shade-save-file": { source: "iana" },
  "application/vnd.shana.informed.formdata": { source: "iana", extensions: ["ifm"] },
  "application/vnd.shana.informed.formtemplate": { source: "iana", extensions: ["itp"] },
  "application/vnd.shana.informed.interchange": { source: "iana", extensions: ["iif"] },
  "application/vnd.shana.informed.package": { source: "iana", extensions: ["ipk"] },
  "application/vnd.shootproof+json": { source: "iana", compressible: !0 },
  "application/vnd.shopkick+json": { source: "iana", compressible: !0 },
  "application/vnd.shp": { source: "iana" },
  "application/vnd.shx": { source: "iana" },
  "application/vnd.sigrok.session": { source: "iana" },
  "application/vnd.simtech-mindmapper": { source: "iana", extensions: ["twd", "twds"] },
  "application/vnd.siren+json": { source: "iana", compressible: !0 },
  "application/vnd.smaf": { source: "iana", extensions: ["mmf"] },
  "application/vnd.smart.notebook": { source: "iana" },
  "application/vnd.smart.teacher": { source: "iana", extensions: ["teacher"] },
  "application/vnd.snesdev-page-table": { source: "iana" },
  "application/vnd.software602.filler.form+xml": { source: "iana", compressible: !0, extensions: ["fo"] },
  "application/vnd.software602.filler.form-xml-zip": { source: "iana" },
  "application/vnd.solent.sdkm+xml": { source: "iana", compressible: !0, extensions: ["sdkm", "sdkd"] },
  "application/vnd.spotfire.dxp": { source: "iana", extensions: ["dxp"] },
  "application/vnd.spotfire.sfs": { source: "iana", extensions: ["sfs"] },
  "application/vnd.sqlite3": { source: "iana" },
  "application/vnd.sss-cod": { source: "iana" },
  "application/vnd.sss-dtf": { source: "iana" },
  "application/vnd.sss-ntf": { source: "iana" },
  "application/vnd.stardivision.calc": { source: "apache", extensions: ["sdc"] },
  "application/vnd.stardivision.draw": { source: "apache", extensions: ["sda"] },
  "application/vnd.stardivision.impress": { source: "apache", extensions: ["sdd"] },
  "application/vnd.stardivision.math": { source: "apache", extensions: ["smf"] },
  "application/vnd.stardivision.writer": { source: "apache", extensions: ["sdw", "vor"] },
  "application/vnd.stardivision.writer-global": { source: "apache", extensions: ["sgl"] },
  "application/vnd.stepmania.package": { source: "iana", extensions: ["smzip"] },
  "application/vnd.stepmania.stepchart": { source: "iana", extensions: ["sm"] },
  "application/vnd.street-stream": { source: "iana" },
  "application/vnd.sun.wadl+xml": { source: "iana", compressible: !0, extensions: ["wadl"] },
  "application/vnd.sun.xml.calc": { source: "apache", extensions: ["sxc"] },
  "application/vnd.sun.xml.calc.template": { source: "apache", extensions: ["stc"] },
  "application/vnd.sun.xml.draw": { source: "apache", extensions: ["sxd"] },
  "application/vnd.sun.xml.draw.template": { source: "apache", extensions: ["std"] },
  "application/vnd.sun.xml.impress": { source: "apache", extensions: ["sxi"] },
  "application/vnd.sun.xml.impress.template": { source: "apache", extensions: ["sti"] },
  "application/vnd.sun.xml.math": { source: "apache", extensions: ["sxm"] },
  "application/vnd.sun.xml.writer": { source: "apache", extensions: ["sxw"] },
  "application/vnd.sun.xml.writer.global": { source: "apache", extensions: ["sxg"] },
  "application/vnd.sun.xml.writer.template": { source: "apache", extensions: ["stw"] },
  "application/vnd.sus-calendar": { source: "iana", extensions: ["sus", "susp"] },
  "application/vnd.svd": { source: "iana", extensions: ["svd"] },
  "application/vnd.swiftview-ics": { source: "iana" },
  "application/vnd.sycle+xml": { source: "iana", compressible: !0 },
  "application/vnd.syft+json": { source: "iana", compressible: !0 },
  "application/vnd.symbian.install": { source: "apache", extensions: ["sis", "sisx"] },
  "application/vnd.syncml+xml": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["xsm"] },
  "application/vnd.syncml.dm+wbxml": { source: "iana", charset: "UTF-8", extensions: ["bdm"] },
  "application/vnd.syncml.dm+xml": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["xdm"] },
  "application/vnd.syncml.dm.notification": { source: "iana" },
  "application/vnd.syncml.dmddf+wbxml": { source: "iana" },
  "application/vnd.syncml.dmddf+xml": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["ddf"] },
  "application/vnd.syncml.dmtnds+wbxml": { source: "iana" },
  "application/vnd.syncml.dmtnds+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.syncml.ds.notification": { source: "iana" },
  "application/vnd.tableschema+json": { source: "iana", compressible: !0 },
  "application/vnd.tao.intent-module-archive": { source: "iana", extensions: ["tao"] },
  "application/vnd.tcpdump.pcap": { source: "iana", extensions: ["pcap", "cap", "dmp"] },
  "application/vnd.think-cell.ppttc+json": { source: "iana", compressible: !0 },
  "application/vnd.tmd.mediaflex.api+xml": { source: "iana", compressible: !0 },
  "application/vnd.tml": { source: "iana" },
  "application/vnd.tmobile-livetv": { source: "iana", extensions: ["tmo"] },
  "application/vnd.tri.onesource": { source: "iana" },
  "application/vnd.trid.tpt": { source: "iana", extensions: ["tpt"] },
  "application/vnd.triscape.mxs": { source: "iana", extensions: ["mxs"] },
  "application/vnd.trueapp": { source: "iana", extensions: ["tra"] },
  "application/vnd.truedoc": { source: "iana" },
  "application/vnd.ubisoft.webplayer": { source: "iana" },
  "application/vnd.ufdl": { source: "iana", extensions: ["ufd", "ufdl"] },
  "application/vnd.uiq.theme": { source: "iana", extensions: ["utz"] },
  "application/vnd.umajin": { source: "iana", extensions: ["umj"] },
  "application/vnd.unity": { source: "iana", extensions: ["unityweb"] },
  "application/vnd.uoml+xml": { source: "iana", compressible: !0, extensions: ["uoml"] },
  "application/vnd.uplanet.alert": { source: "iana" },
  "application/vnd.uplanet.alert-wbxml": { source: "iana" },
  "application/vnd.uplanet.bearer-choice": { source: "iana" },
  "application/vnd.uplanet.bearer-choice-wbxml": { source: "iana" },
  "application/vnd.uplanet.cacheop": { source: "iana" },
  "application/vnd.uplanet.cacheop-wbxml": { source: "iana" },
  "application/vnd.uplanet.channel": { source: "iana" },
  "application/vnd.uplanet.channel-wbxml": { source: "iana" },
  "application/vnd.uplanet.list": { source: "iana" },
  "application/vnd.uplanet.list-wbxml": { source: "iana" },
  "application/vnd.uplanet.listcmd": { source: "iana" },
  "application/vnd.uplanet.listcmd-wbxml": { source: "iana" },
  "application/vnd.uplanet.signal": { source: "iana" },
  "application/vnd.uri-map": { source: "iana" },
  "application/vnd.valve.source.material": { source: "iana" },
  "application/vnd.vcx": { source: "iana", extensions: ["vcx"] },
  "application/vnd.vd-study": { source: "iana" },
  "application/vnd.vectorworks": { source: "iana" },
  "application/vnd.vel+json": { source: "iana", compressible: !0 },
  "application/vnd.verimatrix.vcas": { source: "iana" },
  "application/vnd.veritone.aion+json": { source: "iana", compressible: !0 },
  "application/vnd.veryant.thin": { source: "iana" },
  "application/vnd.ves.encrypted": { source: "iana" },
  "application/vnd.vidsoft.vidconference": { source: "iana" },
  "application/vnd.visio": { source: "iana", extensions: ["vsd", "vst", "vss", "vsw"] },
  "application/vnd.visionary": { source: "iana", extensions: ["vis"] },
  "application/vnd.vividence.scriptfile": { source: "iana" },
  "application/vnd.vsf": { source: "iana", extensions: ["vsf"] },
  "application/vnd.wap.sic": { source: "iana" },
  "application/vnd.wap.slc": { source: "iana" },
  "application/vnd.wap.wbxml": { source: "iana", charset: "UTF-8", extensions: ["wbxml"] },
  "application/vnd.wap.wmlc": { source: "iana", extensions: ["wmlc"] },
  "application/vnd.wap.wmlscriptc": { source: "iana", extensions: ["wmlsc"] },
  "application/vnd.webturbo": { source: "iana", extensions: ["wtb"] },
  "application/vnd.wfa.dpp": { source: "iana" },
  "application/vnd.wfa.p2p": { source: "iana" },
  "application/vnd.wfa.wsc": { source: "iana" },
  "application/vnd.windows.devicepairing": { source: "iana" },
  "application/vnd.wmc": { source: "iana" },
  "application/vnd.wmf.bootstrap": { source: "iana" },
  "application/vnd.wolfram.mathematica": { source: "iana" },
  "application/vnd.wolfram.mathematica.package": { source: "iana" },
  "application/vnd.wolfram.player": { source: "iana", extensions: ["nbp"] },
  "application/vnd.wordperfect": { source: "iana", extensions: ["wpd"] },
  "application/vnd.wqd": { source: "iana", extensions: ["wqd"] },
  "application/vnd.wrq-hp3000-labelled": { source: "iana" },
  "application/vnd.wt.stf": { source: "iana", extensions: ["stf"] },
  "application/vnd.wv.csp+wbxml": { source: "iana" },
  "application/vnd.wv.csp+xml": { source: "iana", compressible: !0 },
  "application/vnd.wv.ssp+xml": { source: "iana", compressible: !0 },
  "application/vnd.xacml+json": { source: "iana", compressible: !0 },
  "application/vnd.xara": { source: "iana", extensions: ["xar"] },
  "application/vnd.xfdl": { source: "iana", extensions: ["xfdl"] },
  "application/vnd.xfdl.webform": { source: "iana" },
  "application/vnd.xmi+xml": { source: "iana", compressible: !0 },
  "application/vnd.xmpie.cpkg": { source: "iana" },
  "application/vnd.xmpie.dpkg": { source: "iana" },
  "application/vnd.xmpie.plan": { source: "iana" },
  "application/vnd.xmpie.ppkg": { source: "iana" },
  "application/vnd.xmpie.xlim": { source: "iana" },
  "application/vnd.yamaha.hv-dic": { source: "iana", extensions: ["hvd"] },
  "application/vnd.yamaha.hv-script": { source: "iana", extensions: ["hvs"] },
  "application/vnd.yamaha.hv-voice": { source: "iana", extensions: ["hvp"] },
  "application/vnd.yamaha.openscoreformat": { source: "iana", extensions: ["osf"] },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": { source: "iana", compressible: !0, extensions: ["osfpvg"] },
  "application/vnd.yamaha.remote-setup": { source: "iana" },
  "application/vnd.yamaha.smaf-audio": { source: "iana", extensions: ["saf"] },
  "application/vnd.yamaha.smaf-phrase": { source: "iana", extensions: ["spf"] },
  "application/vnd.yamaha.through-ngn": { source: "iana" },
  "application/vnd.yamaha.tunnel-udpencap": { source: "iana" },
  "application/vnd.yaoweme": { source: "iana" },
  "application/vnd.yellowriver-custom-menu": { source: "iana", extensions: ["cmp"] },
  "application/vnd.youtube.yt": { source: "iana" },
  "application/vnd.zul": { source: "iana", extensions: ["zir", "zirz"] },
  "application/vnd.zzazz.deck+xml": { source: "iana", compressible: !0, extensions: ["zaz"] },
  "application/voicexml+xml": { source: "iana", compressible: !0, extensions: ["vxml"] },
  "application/voucher-cms+json": { source: "iana", compressible: !0 },
  "application/vq-rtcpxr": { source: "iana" },
  "application/wasm": { source: "iana", compressible: !0, extensions: ["wasm"] },
  "application/watcherinfo+xml": { source: "iana", compressible: !0, extensions: ["wif"] },
  "application/webpush-options+json": { source: "iana", compressible: !0 },
  "application/whoispp-query": { source: "iana" },
  "application/whoispp-response": { source: "iana" },
  "application/widget": { source: "iana", extensions: ["wgt"] },
  "application/winhlp": { source: "apache", extensions: ["hlp"] },
  "application/wita": { source: "iana" },
  "application/wordperfect5.1": { source: "iana" },
  "application/wsdl+xml": { source: "iana", compressible: !0, extensions: ["wsdl"] },
  "application/wspolicy+xml": { source: "iana", compressible: !0, extensions: ["wspolicy"] },
  "application/x-7z-compressed": { source: "apache", compressible: !1, extensions: ["7z"] },
  "application/x-abiword": { source: "apache", extensions: ["abw"] },
  "application/x-ace-compressed": { source: "apache", extensions: ["ace"] },
  "application/x-amf": { source: "apache" },
  "application/x-apple-diskimage": { source: "apache", extensions: ["dmg"] },
  "application/x-arj": { compressible: !1, extensions: ["arj"] },
  "application/x-authorware-bin": { source: "apache", extensions: ["aab", "x32", "u32", "vox"] },
  "application/x-authorware-map": { source: "apache", extensions: ["aam"] },
  "application/x-authorware-seg": { source: "apache", extensions: ["aas"] },
  "application/x-bcpio": { source: "apache", extensions: ["bcpio"] },
  "application/x-bdoc": { compressible: !1, extensions: ["bdoc"] },
  "application/x-bittorrent": { source: "apache", extensions: ["torrent"] },
  "application/x-blorb": { source: "apache", extensions: ["blb", "blorb"] },
  "application/x-bzip": { source: "apache", compressible: !1, extensions: ["bz"] },
  "application/x-bzip2": { source: "apache", compressible: !1, extensions: ["bz2", "boz"] },
  "application/x-cbr": { source: "apache", extensions: ["cbr", "cba", "cbt", "cbz", "cb7"] },
  "application/x-cdlink": { source: "apache", extensions: ["vcd"] },
  "application/x-cfs-compressed": { source: "apache", extensions: ["cfs"] },
  "application/x-chat": { source: "apache", extensions: ["chat"] },
  "application/x-chess-pgn": { source: "apache", extensions: ["pgn"] },
  "application/x-chrome-extension": { extensions: ["crx"] },
  "application/x-cocoa": { source: "nginx", extensions: ["cco"] },
  "application/x-compress": { source: "apache" },
  "application/x-conference": { source: "apache", extensions: ["nsc"] },
  "application/x-cpio": { source: "apache", extensions: ["cpio"] },
  "application/x-csh": { source: "apache", extensions: ["csh"] },
  "application/x-deb": { compressible: !1 },
  "application/x-debian-package": { source: "apache", extensions: ["deb", "udeb"] },
  "application/x-dgc-compressed": { source: "apache", extensions: ["dgc"] },
  "application/x-director": { source: "apache", extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"] },
  "application/x-doom": { source: "apache", extensions: ["wad"] },
  "application/x-dtbncx+xml": { source: "apache", compressible: !0, extensions: ["ncx"] },
  "application/x-dtbook+xml": { source: "apache", compressible: !0, extensions: ["dtb"] },
  "application/x-dtbresource+xml": { source: "apache", compressible: !0, extensions: ["res"] },
  "application/x-dvi": { source: "apache", compressible: !1, extensions: ["dvi"] },
  "application/x-envoy": { source: "apache", extensions: ["evy"] },
  "application/x-eva": { source: "apache", extensions: ["eva"] },
  "application/x-font-bdf": { source: "apache", extensions: ["bdf"] },
  "application/x-font-dos": { source: "apache" },
  "application/x-font-framemaker": { source: "apache" },
  "application/x-font-ghostscript": { source: "apache", extensions: ["gsf"] },
  "application/x-font-libgrx": { source: "apache" },
  "application/x-font-linux-psf": { source: "apache", extensions: ["psf"] },
  "application/x-font-pcf": { source: "apache", extensions: ["pcf"] },
  "application/x-font-snf": { source: "apache", extensions: ["snf"] },
  "application/x-font-speedo": { source: "apache" },
  "application/x-font-sunos-news": { source: "apache" },
  "application/x-font-type1": { source: "apache", extensions: ["pfa", "pfb", "pfm", "afm"] },
  "application/x-font-vfont": { source: "apache" },
  "application/x-freearc": { source: "apache", extensions: ["arc"] },
  "application/x-futuresplash": { source: "apache", extensions: ["spl"] },
  "application/x-gca-compressed": { source: "apache", extensions: ["gca"] },
  "application/x-glulx": { source: "apache", extensions: ["ulx"] },
  "application/x-gnumeric": { source: "apache", extensions: ["gnumeric"] },
  "application/x-gramps-xml": { source: "apache", extensions: ["gramps"] },
  "application/x-gtar": { source: "apache", extensions: ["gtar"] },
  "application/x-gzip": { source: "apache" },
  "application/x-hdf": { source: "apache", extensions: ["hdf"] },
  "application/x-httpd-php": { compressible: !0, extensions: ["php"] },
  "application/x-install-instructions": { source: "apache", extensions: ["install"] },
  "application/x-iso9660-image": { source: "apache", extensions: ["iso"] },
  "application/x-iwork-keynote-sffkey": { extensions: ["key"] },
  "application/x-iwork-numbers-sffnumbers": { extensions: ["numbers"] },
  "application/x-iwork-pages-sffpages": { extensions: ["pages"] },
  "application/x-java-archive-diff": { source: "nginx", extensions: ["jardiff"] },
  "application/x-java-jnlp-file": { source: "apache", compressible: !1, extensions: ["jnlp"] },
  "application/x-javascript": { compressible: !0 },
  "application/x-keepass2": { extensions: ["kdbx"] },
  "application/x-latex": { source: "apache", compressible: !1, extensions: ["latex"] },
  "application/x-lua-bytecode": { extensions: ["luac"] },
  "application/x-lzh-compressed": { source: "apache", extensions: ["lzh", "lha"] },
  "application/x-makeself": { source: "nginx", extensions: ["run"] },
  "application/x-mie": { source: "apache", extensions: ["mie"] },
  "application/x-mobipocket-ebook": { source: "apache", extensions: ["prc", "mobi"] },
  "application/x-mpegurl": { compressible: !1 },
  "application/x-ms-application": { source: "apache", extensions: ["application"] },
  "application/x-ms-shortcut": { source: "apache", extensions: ["lnk"] },
  "application/x-ms-wmd": { source: "apache", extensions: ["wmd"] },
  "application/x-ms-wmz": { source: "apache", extensions: ["wmz"] },
  "application/x-ms-xbap": { source: "apache", extensions: ["xbap"] },
  "application/x-msaccess": { source: "apache", extensions: ["mdb"] },
  "application/x-msbinder": { source: "apache", extensions: ["obd"] },
  "application/x-mscardfile": { source: "apache", extensions: ["crd"] },
  "application/x-msclip": { source: "apache", extensions: ["clp"] },
  "application/x-msdos-program": { extensions: ["exe"] },
  "application/x-msdownload": { source: "apache", extensions: ["exe", "dll", "com", "bat", "msi"] },
  "application/x-msmediaview": { source: "apache", extensions: ["mvb", "m13", "m14"] },
  "application/x-msmetafile": { source: "apache", extensions: ["wmf", "wmz", "emf", "emz"] },
  "application/x-msmoney": { source: "apache", extensions: ["mny"] },
  "application/x-mspublisher": { source: "apache", extensions: ["pub"] },
  "application/x-msschedule": { source: "apache", extensions: ["scd"] },
  "application/x-msterminal": { source: "apache", extensions: ["trm"] },
  "application/x-mswrite": { source: "apache", extensions: ["wri"] },
  "application/x-netcdf": { source: "apache", extensions: ["nc", "cdf"] },
  "application/x-ns-proxy-autoconfig": { compressible: !0, extensions: ["pac"] },
  "application/x-nzb": { source: "apache", extensions: ["nzb"] },
  "application/x-perl": { source: "nginx", extensions: ["pl", "pm"] },
  "application/x-pilot": { source: "nginx", extensions: ["prc", "pdb"] },
  "application/x-pkcs12": { source: "apache", compressible: !1, extensions: ["p12", "pfx"] },
  "application/x-pkcs7-certificates": { source: "apache", extensions: ["p7b", "spc"] },
  "application/x-pkcs7-certreqresp": { source: "apache", extensions: ["p7r"] },
  "application/x-pki-message": { source: "iana" },
  "application/x-rar-compressed": { source: "apache", compressible: !1, extensions: ["rar"] },
  "application/x-redhat-package-manager": { source: "nginx", extensions: ["rpm"] },
  "application/x-research-info-systems": { source: "apache", extensions: ["ris"] },
  "application/x-sea": { source: "nginx", extensions: ["sea"] },
  "application/x-sh": { source: "apache", compressible: !0, extensions: ["sh"] },
  "application/x-shar": { source: "apache", extensions: ["shar"] },
  "application/x-shockwave-flash": { source: "apache", compressible: !1, extensions: ["swf"] },
  "application/x-silverlight-app": { source: "apache", extensions: ["xap"] },
  "application/x-sql": { source: "apache", extensions: ["sql"] },
  "application/x-stuffit": { source: "apache", compressible: !1, extensions: ["sit"] },
  "application/x-stuffitx": { source: "apache", extensions: ["sitx"] },
  "application/x-subrip": { source: "apache", extensions: ["srt"] },
  "application/x-sv4cpio": { source: "apache", extensions: ["sv4cpio"] },
  "application/x-sv4crc": { source: "apache", extensions: ["sv4crc"] },
  "application/x-t3vm-image": { source: "apache", extensions: ["t3"] },
  "application/x-tads": { source: "apache", extensions: ["gam"] },
  "application/x-tar": { source: "apache", compressible: !0, extensions: ["tar"] },
  "application/x-tcl": { source: "apache", extensions: ["tcl", "tk"] },
  "application/x-tex": { source: "apache", extensions: ["tex"] },
  "application/x-tex-tfm": { source: "apache", extensions: ["tfm"] },
  "application/x-texinfo": { source: "apache", extensions: ["texinfo", "texi"] },
  "application/x-tgif": { source: "apache", extensions: ["obj"] },
  "application/x-ustar": { source: "apache", extensions: ["ustar"] },
  "application/x-virtualbox-hdd": { compressible: !0, extensions: ["hdd"] },
  "application/x-virtualbox-ova": { compressible: !0, extensions: ["ova"] },
  "application/x-virtualbox-ovf": { compressible: !0, extensions: ["ovf"] },
  "application/x-virtualbox-vbox": { compressible: !0, extensions: ["vbox"] },
  "application/x-virtualbox-vbox-extpack": { compressible: !1, extensions: ["vbox-extpack"] },
  "application/x-virtualbox-vdi": { compressible: !0, extensions: ["vdi"] },
  "application/x-virtualbox-vhd": { compressible: !0, extensions: ["vhd"] },
  "application/x-virtualbox-vmdk": { compressible: !0, extensions: ["vmdk"] },
  "application/x-wais-source": { source: "apache", extensions: ["src"] },
  "application/x-web-app-manifest+json": { compressible: !0, extensions: ["webapp"] },
  "application/x-www-form-urlencoded": { source: "iana", compressible: !0 },
  "application/x-x509-ca-cert": { source: "iana", extensions: ["der", "crt", "pem"] },
  "application/x-x509-ca-ra-cert": { source: "iana" },
  "application/x-x509-next-ca-cert": { source: "iana" },
  "application/x-xfig": { source: "apache", extensions: ["fig"] },
  "application/x-xliff+xml": { source: "apache", compressible: !0, extensions: ["xlf"] },
  "application/x-xpinstall": { source: "apache", compressible: !1, extensions: ["xpi"] },
  "application/x-xz": { source: "apache", extensions: ["xz"] },
  "application/x-zmachine": { source: "apache", extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"] },
  "application/x400-bp": { source: "iana" },
  "application/xacml+xml": { source: "iana", compressible: !0 },
  "application/xaml+xml": { source: "apache", compressible: !0, extensions: ["xaml"] },
  "application/xcap-att+xml": { source: "iana", compressible: !0, extensions: ["xav"] },
  "application/xcap-caps+xml": { source: "iana", compressible: !0, extensions: ["xca"] },
  "application/xcap-diff+xml": { source: "iana", compressible: !0, extensions: ["xdf"] },
  "application/xcap-el+xml": { source: "iana", compressible: !0, extensions: ["xel"] },
  "application/xcap-error+xml": { source: "iana", compressible: !0 },
  "application/xcap-ns+xml": { source: "iana", compressible: !0, extensions: ["xns"] },
  "application/xcon-conference-info+xml": { source: "iana", compressible: !0 },
  "application/xcon-conference-info-diff+xml": { source: "iana", compressible: !0 },
  "application/xenc+xml": { source: "iana", compressible: !0, extensions: ["xenc"] },
  "application/xhtml+xml": { source: "iana", compressible: !0, extensions: ["xhtml", "xht"] },
  "application/xhtml-voice+xml": { source: "apache", compressible: !0 },
  "application/xliff+xml": { source: "iana", compressible: !0, extensions: ["xlf"] },
  "application/xml": { source: "iana", compressible: !0, extensions: ["xml", "xsl", "xsd", "rng"] },
  "application/xml-dtd": { source: "iana", compressible: !0, extensions: ["dtd"] },
  "application/xml-external-parsed-entity": { source: "iana" },
  "application/xml-patch+xml": { source: "iana", compressible: !0 },
  "application/xmpp+xml": { source: "iana", compressible: !0 },
  "application/xop+xml": { source: "iana", compressible: !0, extensions: ["xop"] },
  "application/xproc+xml": { source: "apache", compressible: !0, extensions: ["xpl"] },
  "application/xslt+xml": { source: "iana", compressible: !0, extensions: ["xsl", "xslt"] },
  "application/xspf+xml": { source: "apache", compressible: !0, extensions: ["xspf"] },
  "application/xv+xml": { source: "iana", compressible: !0, extensions: ["mxml", "xhvml", "xvml", "xvm"] },
  "application/yang": { source: "iana", extensions: ["yang"] },
  "application/yang-data+json": { source: "iana", compressible: !0 },
  "application/yang-data+xml": { source: "iana", compressible: !0 },
  "application/yang-patch+json": { source: "iana", compressible: !0 },
  "application/yang-patch+xml": { source: "iana", compressible: !0 },
  "application/yin+xml": { source: "iana", compressible: !0, extensions: ["yin"] },
  "application/zip": { source: "iana", compressible: !1, extensions: ["zip"] },
  "application/zlib": { source: "iana" },
  "application/zstd": { source: "iana" },
  "audio/1d-interleaved-parityfec": { source: "iana" },
  "audio/32kadpcm": { source: "iana" },
  "audio/3gpp": { source: "iana", compressible: !1, extensions: ["3gpp"] },
  "audio/3gpp2": { source: "iana" },
  "audio/aac": { source: "iana" },
  "audio/ac3": { source: "iana" },
  "audio/adpcm": { source: "apache", extensions: ["adp"] },
  "audio/amr": { source: "iana", extensions: ["amr"] },
  "audio/amr-wb": { source: "iana" },
  "audio/amr-wb+": { source: "iana" },
  "audio/aptx": { source: "iana" },
  "audio/asc": { source: "iana" },
  "audio/atrac-advanced-lossless": { source: "iana" },
  "audio/atrac-x": { source: "iana" },
  "audio/atrac3": { source: "iana" },
  "audio/basic": { source: "iana", compressible: !1, extensions: ["au", "snd"] },
  "audio/bv16": { source: "iana" },
  "audio/bv32": { source: "iana" },
  "audio/clearmode": { source: "iana" },
  "audio/cn": { source: "iana" },
  "audio/dat12": { source: "iana" },
  "audio/dls": { source: "iana" },
  "audio/dsr-es201108": { source: "iana" },
  "audio/dsr-es202050": { source: "iana" },
  "audio/dsr-es202211": { source: "iana" },
  "audio/dsr-es202212": { source: "iana" },
  "audio/dv": { source: "iana" },
  "audio/dvi4": { source: "iana" },
  "audio/eac3": { source: "iana" },
  "audio/encaprtp": { source: "iana" },
  "audio/evrc": { source: "iana" },
  "audio/evrc-qcp": { source: "iana" },
  "audio/evrc0": { source: "iana" },
  "audio/evrc1": { source: "iana" },
  "audio/evrcb": { source: "iana" },
  "audio/evrcb0": { source: "iana" },
  "audio/evrcb1": { source: "iana" },
  "audio/evrcnw": { source: "iana" },
  "audio/evrcnw0": { source: "iana" },
  "audio/evrcnw1": { source: "iana" },
  "audio/evrcwb": { source: "iana" },
  "audio/evrcwb0": { source: "iana" },
  "audio/evrcwb1": { source: "iana" },
  "audio/evs": { source: "iana" },
  "audio/flexfec": { source: "iana" },
  "audio/fwdred": { source: "iana" },
  "audio/g711-0": { source: "iana" },
  "audio/g719": { source: "iana" },
  "audio/g722": { source: "iana" },
  "audio/g7221": { source: "iana" },
  "audio/g723": { source: "iana" },
  "audio/g726-16": { source: "iana" },
  "audio/g726-24": { source: "iana" },
  "audio/g726-32": { source: "iana" },
  "audio/g726-40": { source: "iana" },
  "audio/g728": { source: "iana" },
  "audio/g729": { source: "iana" },
  "audio/g7291": { source: "iana" },
  "audio/g729d": { source: "iana" },
  "audio/g729e": { source: "iana" },
  "audio/gsm": { source: "iana" },
  "audio/gsm-efr": { source: "iana" },
  "audio/gsm-hr-08": { source: "iana" },
  "audio/ilbc": { source: "iana" },
  "audio/ip-mr_v2.5": { source: "iana" },
  "audio/isac": { source: "apache" },
  "audio/l16": { source: "iana" },
  "audio/l20": { source: "iana" },
  "audio/l24": { source: "iana", compressible: !1 },
  "audio/l8": { source: "iana" },
  "audio/lpc": { source: "iana" },
  "audio/melp": { source: "iana" },
  "audio/melp1200": { source: "iana" },
  "audio/melp2400": { source: "iana" },
  "audio/melp600": { source: "iana" },
  "audio/mhas": { source: "iana" },
  "audio/midi": { source: "apache", extensions: ["mid", "midi", "kar", "rmi"] },
  "audio/mobile-xmf": { source: "iana", extensions: ["mxmf"] },
  "audio/mp3": { compressible: !1, extensions: ["mp3"] },
  "audio/mp4": { source: "iana", compressible: !1, extensions: ["m4a", "mp4a"] },
  "audio/mp4a-latm": { source: "iana" },
  "audio/mpa": { source: "iana" },
  "audio/mpa-robust": { source: "iana" },
  "audio/mpeg": { source: "iana", compressible: !1, extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"] },
  "audio/mpeg4-generic": { source: "iana" },
  "audio/musepack": { source: "apache" },
  "audio/ogg": { source: "iana", compressible: !1, extensions: ["oga", "ogg", "spx", "opus"] },
  "audio/opus": { source: "iana" },
  "audio/parityfec": { source: "iana" },
  "audio/pcma": { source: "iana" },
  "audio/pcma-wb": { source: "iana" },
  "audio/pcmu": { source: "iana" },
  "audio/pcmu-wb": { source: "iana" },
  "audio/prs.sid": { source: "iana" },
  "audio/qcelp": { source: "iana" },
  "audio/raptorfec": { source: "iana" },
  "audio/red": { source: "iana" },
  "audio/rtp-enc-aescm128": { source: "iana" },
  "audio/rtp-midi": { source: "iana" },
  "audio/rtploopback": { source: "iana" },
  "audio/rtx": { source: "iana" },
  "audio/s3m": { source: "apache", extensions: ["s3m"] },
  "audio/scip": { source: "iana" },
  "audio/silk": { source: "apache", extensions: ["sil"] },
  "audio/smv": { source: "iana" },
  "audio/smv-qcp": { source: "iana" },
  "audio/smv0": { source: "iana" },
  "audio/sofa": { source: "iana" },
  "audio/sp-midi": { source: "iana" },
  "audio/speex": { source: "iana" },
  "audio/t140c": { source: "iana" },
  "audio/t38": { source: "iana" },
  "audio/telephone-event": { source: "iana" },
  "audio/tetra_acelp": { source: "iana" },
  "audio/tetra_acelp_bb": { source: "iana" },
  "audio/tone": { source: "iana" },
  "audio/tsvcis": { source: "iana" },
  "audio/uemclip": { source: "iana" },
  "audio/ulpfec": { source: "iana" },
  "audio/usac": { source: "iana" },
  "audio/vdvi": { source: "iana" },
  "audio/vmr-wb": { source: "iana" },
  "audio/vnd.3gpp.iufp": { source: "iana" },
  "audio/vnd.4sb": { source: "iana" },
  "audio/vnd.audiokoz": { source: "iana" },
  "audio/vnd.celp": { source: "iana" },
  "audio/vnd.cisco.nse": { source: "iana" },
  "audio/vnd.cmles.radio-events": { source: "iana" },
  "audio/vnd.cns.anp1": { source: "iana" },
  "audio/vnd.cns.inf1": { source: "iana" },
  "audio/vnd.dece.audio": { source: "iana", extensions: ["uva", "uvva"] },
  "audio/vnd.digital-winds": { source: "iana", extensions: ["eol"] },
  "audio/vnd.dlna.adts": { source: "iana" },
  "audio/vnd.dolby.heaac.1": { source: "iana" },
  "audio/vnd.dolby.heaac.2": { source: "iana" },
  "audio/vnd.dolby.mlp": { source: "iana" },
  "audio/vnd.dolby.mps": { source: "iana" },
  "audio/vnd.dolby.pl2": { source: "iana" },
  "audio/vnd.dolby.pl2x": { source: "iana" },
  "audio/vnd.dolby.pl2z": { source: "iana" },
  "audio/vnd.dolby.pulse.1": { source: "iana" },
  "audio/vnd.dra": { source: "iana", extensions: ["dra"] },
  "audio/vnd.dts": { source: "iana", extensions: ["dts"] },
  "audio/vnd.dts.hd": { source: "iana", extensions: ["dtshd"] },
  "audio/vnd.dts.uhd": { source: "iana" },
  "audio/vnd.dvb.file": { source: "iana" },
  "audio/vnd.everad.plj": { source: "iana" },
  "audio/vnd.hns.audio": { source: "iana" },
  "audio/vnd.lucent.voice": { source: "iana", extensions: ["lvp"] },
  "audio/vnd.ms-playready.media.pya": { source: "iana", extensions: ["pya"] },
  "audio/vnd.nokia.mobile-xmf": { source: "iana" },
  "audio/vnd.nortel.vbk": { source: "iana" },
  "audio/vnd.nuera.ecelp4800": { source: "iana", extensions: ["ecelp4800"] },
  "audio/vnd.nuera.ecelp7470": { source: "iana", extensions: ["ecelp7470"] },
  "audio/vnd.nuera.ecelp9600": { source: "iana", extensions: ["ecelp9600"] },
  "audio/vnd.octel.sbc": { source: "iana" },
  "audio/vnd.presonus.multitrack": { source: "iana" },
  "audio/vnd.qcelp": { source: "iana" },
  "audio/vnd.rhetorex.32kadpcm": { source: "iana" },
  "audio/vnd.rip": { source: "iana", extensions: ["rip"] },
  "audio/vnd.rn-realaudio": { compressible: !1 },
  "audio/vnd.sealedmedia.softseal.mpeg": { source: "iana" },
  "audio/vnd.vmx.cvsd": { source: "iana" },
  "audio/vnd.wave": { compressible: !1 },
  "audio/vorbis": { source: "iana", compressible: !1 },
  "audio/vorbis-config": { source: "iana" },
  "audio/wav": { compressible: !1, extensions: ["wav"] },
  "audio/wave": { compressible: !1, extensions: ["wav"] },
  "audio/webm": { source: "apache", compressible: !1, extensions: ["weba"] },
  "audio/x-aac": { source: "apache", compressible: !1, extensions: ["aac"] },
  "audio/x-aiff": { source: "apache", extensions: ["aif", "aiff", "aifc"] },
  "audio/x-caf": { source: "apache", compressible: !1, extensions: ["caf"] },
  "audio/x-flac": { source: "apache", extensions: ["flac"] },
  "audio/x-m4a": { source: "nginx", extensions: ["m4a"] },
  "audio/x-matroska": { source: "apache", extensions: ["mka"] },
  "audio/x-mpegurl": { source: "apache", extensions: ["m3u"] },
  "audio/x-ms-wax": { source: "apache", extensions: ["wax"] },
  "audio/x-ms-wma": { source: "apache", extensions: ["wma"] },
  "audio/x-pn-realaudio": { source: "apache", extensions: ["ram", "ra"] },
  "audio/x-pn-realaudio-plugin": { source: "apache", extensions: ["rmp"] },
  "audio/x-realaudio": { source: "nginx", extensions: ["ra"] },
  "audio/x-tta": { source: "apache" },
  "audio/x-wav": { source: "apache", extensions: ["wav"] },
  "audio/xm": { source: "apache", extensions: ["xm"] },
  "chemical/x-cdx": { source: "apache", extensions: ["cdx"] },
  "chemical/x-cif": { source: "apache", extensions: ["cif"] },
  "chemical/x-cmdf": { source: "apache", extensions: ["cmdf"] },
  "chemical/x-cml": { source: "apache", extensions: ["cml"] },
  "chemical/x-csml": { source: "apache", extensions: ["csml"] },
  "chemical/x-pdb": { source: "apache" },
  "chemical/x-xyz": { source: "apache", extensions: ["xyz"] },
  "font/collection": { source: "iana", extensions: ["ttc"] },
  "font/otf": { source: "iana", compressible: !0, extensions: ["otf"] },
  "font/sfnt": { source: "iana" },
  "font/ttf": { source: "iana", compressible: !0, extensions: ["ttf"] },
  "font/woff": { source: "iana", extensions: ["woff"] },
  "font/woff2": { source: "iana", extensions: ["woff2"] },
  "image/aces": { source: "iana", extensions: ["exr"] },
  "image/apng": { compressible: !1, extensions: ["apng"] },
  "image/avci": { source: "iana", extensions: ["avci"] },
  "image/avcs": { source: "iana", extensions: ["avcs"] },
  "image/avif": { source: "iana", compressible: !1, extensions: ["avif"] },
  "image/bmp": { source: "iana", compressible: !0, extensions: ["bmp"] },
  "image/cgm": { source: "iana", extensions: ["cgm"] },
  "image/dicom-rle": { source: "iana", extensions: ["drle"] },
  "image/emf": { source: "iana", extensions: ["emf"] },
  "image/fits": { source: "iana", extensions: ["fits"] },
  "image/g3fax": { source: "iana", extensions: ["g3"] },
  "image/gif": { source: "iana", compressible: !1, extensions: ["gif"] },
  "image/heic": { source: "iana", extensions: ["heic"] },
  "image/heic-sequence": { source: "iana", extensions: ["heics"] },
  "image/heif": { source: "iana", extensions: ["heif"] },
  "image/heif-sequence": { source: "iana", extensions: ["heifs"] },
  "image/hej2k": { source: "iana", extensions: ["hej2"] },
  "image/hsj2": { source: "iana", extensions: ["hsj2"] },
  "image/ief": { source: "iana", extensions: ["ief"] },
  "image/jls": { source: "iana", extensions: ["jls"] },
  "image/jp2": { source: "iana", compressible: !1, extensions: ["jp2", "jpg2"] },
  "image/jpeg": { source: "iana", compressible: !1, extensions: ["jpeg", "jpg", "jpe"] },
  "image/jph": { source: "iana", extensions: ["jph"] },
  "image/jphc": { source: "iana", extensions: ["jhc"] },
  "image/jpm": { source: "iana", compressible: !1, extensions: ["jpm"] },
  "image/jpx": { source: "iana", compressible: !1, extensions: ["jpx", "jpf"] },
  "image/jxr": { source: "iana", extensions: ["jxr"] },
  "image/jxra": { source: "iana", extensions: ["jxra"] },
  "image/jxrs": { source: "iana", extensions: ["jxrs"] },
  "image/jxs": { source: "iana", extensions: ["jxs"] },
  "image/jxsc": { source: "iana", extensions: ["jxsc"] },
  "image/jxsi": { source: "iana", extensions: ["jxsi"] },
  "image/jxss": { source: "iana", extensions: ["jxss"] },
  "image/ktx": { source: "iana", extensions: ["ktx"] },
  "image/ktx2": { source: "iana", extensions: ["ktx2"] },
  "image/naplps": { source: "iana" },
  "image/pjpeg": { compressible: !1 },
  "image/png": { source: "iana", compressible: !1, extensions: ["png"] },
  "image/prs.btif": { source: "iana", extensions: ["btif"] },
  "image/prs.pti": { source: "iana", extensions: ["pti"] },
  "image/pwg-raster": { source: "iana" },
  "image/sgi": { source: "apache", extensions: ["sgi"] },
  "image/svg+xml": { source: "iana", compressible: !0, extensions: ["svg", "svgz"] },
  "image/t38": { source: "iana", extensions: ["t38"] },
  "image/tiff": { source: "iana", compressible: !1, extensions: ["tif", "tiff"] },
  "image/tiff-fx": { source: "iana", extensions: ["tfx"] },
  "image/vnd.adobe.photoshop": { source: "iana", compressible: !0, extensions: ["psd"] },
  "image/vnd.airzip.accelerator.azv": { source: "iana", extensions: ["azv"] },
  "image/vnd.cns.inf2": { source: "iana" },
  "image/vnd.dece.graphic": { source: "iana", extensions: ["uvi", "uvvi", "uvg", "uvvg"] },
  "image/vnd.djvu": { source: "iana", extensions: ["djvu", "djv"] },
  "image/vnd.dvb.subtitle": { source: "iana", extensions: ["sub"] },
  "image/vnd.dwg": { source: "iana", extensions: ["dwg"] },
  "image/vnd.dxf": { source: "iana", extensions: ["dxf"] },
  "image/vnd.fastbidsheet": { source: "iana", extensions: ["fbs"] },
  "image/vnd.fpx": { source: "iana", extensions: ["fpx"] },
  "image/vnd.fst": { source: "iana", extensions: ["fst"] },
  "image/vnd.fujixerox.edmics-mmr": { source: "iana", extensions: ["mmr"] },
  "image/vnd.fujixerox.edmics-rlc": { source: "iana", extensions: ["rlc"] },
  "image/vnd.globalgraphics.pgb": { source: "iana" },
  "image/vnd.microsoft.icon": { source: "iana", compressible: !0, extensions: ["ico"] },
  "image/vnd.mix": { source: "iana" },
  "image/vnd.mozilla.apng": { source: "iana" },
  "image/vnd.ms-dds": { compressible: !0, extensions: ["dds"] },
  "image/vnd.ms-modi": { source: "iana", extensions: ["mdi"] },
  "image/vnd.ms-photo": { source: "apache", extensions: ["wdp"] },
  "image/vnd.net-fpx": { source: "iana", extensions: ["npx"] },
  "image/vnd.pco.b16": { source: "iana", extensions: ["b16"] },
  "image/vnd.radiance": { source: "iana" },
  "image/vnd.sealed.png": { source: "iana" },
  "image/vnd.sealedmedia.softseal.gif": { source: "iana" },
  "image/vnd.sealedmedia.softseal.jpg": { source: "iana" },
  "image/vnd.svf": { source: "iana" },
  "image/vnd.tencent.tap": { source: "iana", extensions: ["tap"] },
  "image/vnd.valve.source.texture": { source: "iana", extensions: ["vtf"] },
  "image/vnd.wap.wbmp": { source: "iana", extensions: ["wbmp"] },
  "image/vnd.xiff": { source: "iana", extensions: ["xif"] },
  "image/vnd.zbrush.pcx": { source: "iana", extensions: ["pcx"] },
  "image/webp": { source: "apache", extensions: ["webp"] },
  "image/wmf": { source: "iana", extensions: ["wmf"] },
  "image/x-3ds": { source: "apache", extensions: ["3ds"] },
  "image/x-cmu-raster": { source: "apache", extensions: ["ras"] },
  "image/x-cmx": { source: "apache", extensions: ["cmx"] },
  "image/x-freehand": { source: "apache", extensions: ["fh", "fhc", "fh4", "fh5", "fh7"] },
  "image/x-icon": { source: "apache", compressible: !0, extensions: ["ico"] },
  "image/x-jng": { source: "nginx", extensions: ["jng"] },
  "image/x-mrsid-image": { source: "apache", extensions: ["sid"] },
  "image/x-ms-bmp": { source: "nginx", compressible: !0, extensions: ["bmp"] },
  "image/x-pcx": { source: "apache", extensions: ["pcx"] },
  "image/x-pict": { source: "apache", extensions: ["pic", "pct"] },
  "image/x-portable-anymap": { source: "apache", extensions: ["pnm"] },
  "image/x-portable-bitmap": { source: "apache", extensions: ["pbm"] },
  "image/x-portable-graymap": { source: "apache", extensions: ["pgm"] },
  "image/x-portable-pixmap": { source: "apache", extensions: ["ppm"] },
  "image/x-rgb": { source: "apache", extensions: ["rgb"] },
  "image/x-tga": { source: "apache", extensions: ["tga"] },
  "image/x-xbitmap": { source: "apache", extensions: ["xbm"] },
  "image/x-xcf": { compressible: !1 },
  "image/x-xpixmap": { source: "apache", extensions: ["xpm"] },
  "image/x-xwindowdump": { source: "apache", extensions: ["xwd"] },
  "message/cpim": { source: "iana" },
  "message/delivery-status": { source: "iana" },
  "message/disposition-notification": { source: "iana", extensions: ["disposition-notification"] },
  "message/external-body": { source: "iana" },
  "message/feedback-report": { source: "iana" },
  "message/global": { source: "iana", extensions: ["u8msg"] },
  "message/global-delivery-status": { source: "iana", extensions: ["u8dsn"] },
  "message/global-disposition-notification": { source: "iana", extensions: ["u8mdn"] },
  "message/global-headers": { source: "iana", extensions: ["u8hdr"] },
  "message/http": { source: "iana", compressible: !1 },
  "message/imdn+xml": { source: "iana", compressible: !0 },
  "message/news": { source: "iana" },
  "message/partial": { source: "iana", compressible: !1 },
  "message/rfc822": { source: "iana", compressible: !0, extensions: ["eml", "mime"] },
  "message/s-http": { source: "iana" },
  "message/sip": { source: "iana" },
  "message/sipfrag": { source: "iana" },
  "message/tracking-status": { source: "iana" },
  "message/vnd.si.simp": { source: "iana" },
  "message/vnd.wfa.wsc": { source: "iana", extensions: ["wsc"] },
  "model/3mf": { source: "iana", extensions: ["3mf"] },
  "model/e57": { source: "iana" },
  "model/gltf+json": { source: "iana", compressible: !0, extensions: ["gltf"] },
  "model/gltf-binary": { source: "iana", compressible: !0, extensions: ["glb"] },
  "model/iges": { source: "iana", compressible: !1, extensions: ["igs", "iges"] },
  "model/mesh": { source: "iana", compressible: !1, extensions: ["msh", "mesh", "silo"] },
  "model/mtl": { source: "iana", extensions: ["mtl"] },
  "model/obj": { source: "iana", extensions: ["obj"] },
  "model/step": { source: "iana" },
  "model/step+xml": { source: "iana", compressible: !0, extensions: ["stpx"] },
  "model/step+zip": { source: "iana", compressible: !1, extensions: ["stpz"] },
  "model/step-xml+zip": { source: "iana", compressible: !1, extensions: ["stpxz"] },
  "model/stl": { source: "iana", extensions: ["stl"] },
  "model/vnd.collada+xml": { source: "iana", compressible: !0, extensions: ["dae"] },
  "model/vnd.dwf": { source: "iana", extensions: ["dwf"] },
  "model/vnd.flatland.3dml": { source: "iana" },
  "model/vnd.gdl": { source: "iana", extensions: ["gdl"] },
  "model/vnd.gs-gdl": { source: "apache" },
  "model/vnd.gs.gdl": { source: "iana" },
  "model/vnd.gtw": { source: "iana", extensions: ["gtw"] },
  "model/vnd.moml+xml": { source: "iana", compressible: !0 },
  "model/vnd.mts": { source: "iana", extensions: ["mts"] },
  "model/vnd.opengex": { source: "iana", extensions: ["ogex"] },
  "model/vnd.parasolid.transmit.binary": { source: "iana", extensions: ["x_b"] },
  "model/vnd.parasolid.transmit.text": { source: "iana", extensions: ["x_t"] },
  "model/vnd.pytha.pyox": { source: "iana" },
  "model/vnd.rosette.annotated-data-model": { source: "iana" },
  "model/vnd.sap.vds": { source: "iana", extensions: ["vds"] },
  "model/vnd.usdz+zip": { source: "iana", compressible: !1, extensions: ["usdz"] },
  "model/vnd.valve.source.compiled-map": { source: "iana", extensions: ["bsp"] },
  "model/vnd.vtu": { source: "iana", extensions: ["vtu"] },
  "model/vrml": { source: "iana", compressible: !1, extensions: ["wrl", "vrml"] },
  "model/x3d+binary": { source: "apache", compressible: !1, extensions: ["x3db", "x3dbz"] },
  "model/x3d+fastinfoset": { source: "iana", extensions: ["x3db"] },
  "model/x3d+vrml": { source: "apache", compressible: !1, extensions: ["x3dv", "x3dvz"] },
  "model/x3d+xml": { source: "iana", compressible: !0, extensions: ["x3d", "x3dz"] },
  "model/x3d-vrml": { source: "iana", extensions: ["x3dv"] },
  "multipart/alternative": { source: "iana", compressible: !1 },
  "multipart/appledouble": { source: "iana" },
  "multipart/byteranges": { source: "iana" },
  "multipart/digest": { source: "iana" },
  "multipart/encrypted": { source: "iana", compressible: !1 },
  "multipart/form-data": { source: "iana", compressible: !1 },
  "multipart/header-set": { source: "iana" },
  "multipart/mixed": { source: "iana" },
  "multipart/multilingual": { source: "iana" },
  "multipart/parallel": { source: "iana" },
  "multipart/related": { source: "iana", compressible: !1 },
  "multipart/report": { source: "iana" },
  "multipart/signed": { source: "iana", compressible: !1 },
  "multipart/vnd.bint.med-plus": { source: "iana" },
  "multipart/voice-message": { source: "iana" },
  "multipart/x-mixed-replace": { source: "iana" },
  "text/1d-interleaved-parityfec": { source: "iana" },
  "text/cache-manifest": { source: "iana", compressible: !0, extensions: ["appcache", "manifest"] },
  "text/calendar": { source: "iana", extensions: ["ics", "ifb"] },
  "text/calender": { compressible: !0 },
  "text/cmd": { compressible: !0 },
  "text/coffeescript": { extensions: ["coffee", "litcoffee"] },
  "text/cql": { source: "iana" },
  "text/cql-expression": { source: "iana" },
  "text/cql-identifier": { source: "iana" },
  "text/css": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["css"] },
  "text/csv": { source: "iana", compressible: !0, extensions: ["csv"] },
  "text/csv-schema": { source: "iana" },
  "text/directory": { source: "iana" },
  "text/dns": { source: "iana" },
  "text/ecmascript": { source: "iana" },
  "text/encaprtp": { source: "iana" },
  "text/enriched": { source: "iana" },
  "text/fhirpath": { source: "iana" },
  "text/flexfec": { source: "iana" },
  "text/fwdred": { source: "iana" },
  "text/gff3": { source: "iana" },
  "text/grammar-ref-list": { source: "iana" },
  "text/html": { source: "iana", compressible: !0, extensions: ["html", "htm", "shtml"] },
  "text/jade": { extensions: ["jade"] },
  "text/javascript": { source: "iana", compressible: !0 },
  "text/jcr-cnd": { source: "iana" },
  "text/jsx": { compressible: !0, extensions: ["jsx"] },
  "text/less": { compressible: !0, extensions: ["less"] },
  "text/markdown": { source: "iana", compressible: !0, extensions: ["markdown", "md"] },
  "text/mathml": { source: "nginx", extensions: ["mml"] },
  "text/mdx": { compressible: !0, extensions: ["mdx"] },
  "text/mizar": { source: "iana" },
  "text/n3": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["n3"] },
  "text/parameters": { source: "iana", charset: "UTF-8" },
  "text/parityfec": { source: "iana" },
  "text/plain": { source: "iana", compressible: !0, extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"] },
  "text/provenance-notation": { source: "iana", charset: "UTF-8" },
  "text/prs.fallenstein.rst": { source: "iana" },
  "text/prs.lines.tag": { source: "iana", extensions: ["dsc"] },
  "text/prs.prop.logic": { source: "iana" },
  "text/raptorfec": { source: "iana" },
  "text/red": { source: "iana" },
  "text/rfc822-headers": { source: "iana" },
  "text/richtext": { source: "iana", compressible: !0, extensions: ["rtx"] },
  "text/rtf": { source: "iana", compressible: !0, extensions: ["rtf"] },
  "text/rtp-enc-aescm128": { source: "iana" },
  "text/rtploopback": { source: "iana" },
  "text/rtx": { source: "iana" },
  "text/sgml": { source: "iana", extensions: ["sgml", "sgm"] },
  "text/shaclc": { source: "iana" },
  "text/shex": { source: "iana", extensions: ["shex"] },
  "text/slim": { extensions: ["slim", "slm"] },
  "text/spdx": { source: "iana", extensions: ["spdx"] },
  "text/strings": { source: "iana" },
  "text/stylus": { extensions: ["stylus", "styl"] },
  "text/t140": { source: "iana" },
  "text/tab-separated-values": { source: "iana", compressible: !0, extensions: ["tsv"] },
  "text/troff": { source: "iana", extensions: ["t", "tr", "roff", "man", "me", "ms"] },
  "text/turtle": { source: "iana", charset: "UTF-8", extensions: ["ttl"] },
  "text/ulpfec": { source: "iana" },
  "text/uri-list": { source: "iana", compressible: !0, extensions: ["uri", "uris", "urls"] },
  "text/vcard": { source: "iana", compressible: !0, extensions: ["vcard"] },
  "text/vnd.a": { source: "iana" },
  "text/vnd.abc": { source: "iana" },
  "text/vnd.ascii-art": { source: "iana" },
  "text/vnd.curl": { source: "iana", extensions: ["curl"] },
  "text/vnd.curl.dcurl": { source: "apache", extensions: ["dcurl"] },
  "text/vnd.curl.mcurl": { source: "apache", extensions: ["mcurl"] },
  "text/vnd.curl.scurl": { source: "apache", extensions: ["scurl"] },
  "text/vnd.debian.copyright": { source: "iana", charset: "UTF-8" },
  "text/vnd.dmclientscript": { source: "iana" },
  "text/vnd.dvb.subtitle": { source: "iana", extensions: ["sub"] },
  "text/vnd.esmertec.theme-descriptor": { source: "iana", charset: "UTF-8" },
  "text/vnd.familysearch.gedcom": { source: "iana", extensions: ["ged"] },
  "text/vnd.ficlab.flt": { source: "iana" },
  "text/vnd.fly": { source: "iana", extensions: ["fly"] },
  "text/vnd.fmi.flexstor": { source: "iana", extensions: ["flx"] },
  "text/vnd.gml": { source: "iana" },
  "text/vnd.graphviz": { source: "iana", extensions: ["gv"] },
  "text/vnd.hans": { source: "iana" },
  "text/vnd.hgl": { source: "iana" },
  "text/vnd.in3d.3dml": { source: "iana", extensions: ["3dml"] },
  "text/vnd.in3d.spot": { source: "iana", extensions: ["spot"] },
  "text/vnd.iptc.newsml": { source: "iana" },
  "text/vnd.iptc.nitf": { source: "iana" },
  "text/vnd.latex-z": { source: "iana" },
  "text/vnd.motorola.reflex": { source: "iana" },
  "text/vnd.ms-mediapackage": { source: "iana" },
  "text/vnd.net2phone.commcenter.command": { source: "iana" },
  "text/vnd.radisys.msml-basic-layout": { source: "iana" },
  "text/vnd.senx.warpscript": { source: "iana" },
  "text/vnd.si.uricatalogue": { source: "iana" },
  "text/vnd.sosi": { source: "iana" },
  "text/vnd.sun.j2me.app-descriptor": { source: "iana", charset: "UTF-8", extensions: ["jad"] },
  "text/vnd.trolltech.linguist": { source: "iana", charset: "UTF-8" },
  "text/vnd.wap.si": { source: "iana" },
  "text/vnd.wap.sl": { source: "iana" },
  "text/vnd.wap.wml": { source: "iana", extensions: ["wml"] },
  "text/vnd.wap.wmlscript": { source: "iana", extensions: ["wmls"] },
  "text/vtt": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["vtt"] },
  "text/x-asm": { source: "apache", extensions: ["s", "asm"] },
  "text/x-c": { source: "apache", extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"] },
  "text/x-component": { source: "nginx", extensions: ["htc"] },
  "text/x-fortran": { source: "apache", extensions: ["f", "for", "f77", "f90"] },
  "text/x-gwt-rpc": { compressible: !0 },
  "text/x-handlebars-template": { extensions: ["hbs"] },
  "text/x-java-source": { source: "apache", extensions: ["java"] },
  "text/x-jquery-tmpl": { compressible: !0 },
  "text/x-lua": { extensions: ["lua"] },
  "text/x-markdown": { compressible: !0, extensions: ["mkd"] },
  "text/x-nfo": { source: "apache", extensions: ["nfo"] },
  "text/x-opml": { source: "apache", extensions: ["opml"] },
  "text/x-org": { compressible: !0, extensions: ["org"] },
  "text/x-pascal": { source: "apache", extensions: ["p", "pas"] },
  "text/x-processing": { compressible: !0, extensions: ["pde"] },
  "text/x-sass": { extensions: ["sass"] },
  "text/x-scss": { extensions: ["scss"] },
  "text/x-setext": { source: "apache", extensions: ["etx"] },
  "text/x-sfv": { source: "apache", extensions: ["sfv"] },
  "text/x-suse-ymp": { compressible: !0, extensions: ["ymp"] },
  "text/x-uuencode": { source: "apache", extensions: ["uu"] },
  "text/x-vcalendar": { source: "apache", extensions: ["vcs"] },
  "text/x-vcard": { source: "apache", extensions: ["vcf"] },
  "text/xml": { source: "iana", compressible: !0, extensions: ["xml"] },
  "text/xml-external-parsed-entity": { source: "iana" },
  "text/yaml": { compressible: !0, extensions: ["yaml", "yml"] },
  "video/1d-interleaved-parityfec": { source: "iana" },
  "video/3gpp": { source: "iana", extensions: ["3gp", "3gpp"] },
  "video/3gpp-tt": { source: "iana" },
  "video/3gpp2": { source: "iana", extensions: ["3g2"] },
  "video/av1": { source: "iana" },
  "video/bmpeg": { source: "iana" },
  "video/bt656": { source: "iana" },
  "video/celb": { source: "iana" },
  "video/dv": { source: "iana" },
  "video/encaprtp": { source: "iana" },
  "video/ffv1": { source: "iana" },
  "video/flexfec": { source: "iana" },
  "video/h261": { source: "iana", extensions: ["h261"] },
  "video/h263": { source: "iana", extensions: ["h263"] },
  "video/h263-1998": { source: "iana" },
  "video/h263-2000": { source: "iana" },
  "video/h264": { source: "iana", extensions: ["h264"] },
  "video/h264-rcdo": { source: "iana" },
  "video/h264-svc": { source: "iana" },
  "video/h265": { source: "iana" },
  "video/iso.segment": { source: "iana", extensions: ["m4s"] },
  "video/jpeg": { source: "iana", extensions: ["jpgv"] },
  "video/jpeg2000": { source: "iana" },
  "video/jpm": { source: "apache", extensions: ["jpm", "jpgm"] },
  "video/jxsv": { source: "iana" },
  "video/mj2": { source: "iana", extensions: ["mj2", "mjp2"] },
  "video/mp1s": { source: "iana" },
  "video/mp2p": { source: "iana" },
  "video/mp2t": { source: "iana", extensions: ["ts"] },
  "video/mp4": { source: "iana", compressible: !1, extensions: ["mp4", "mp4v", "mpg4"] },
  "video/mp4v-es": { source: "iana" },
  "video/mpeg": { source: "iana", compressible: !1, extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"] },
  "video/mpeg4-generic": { source: "iana" },
  "video/mpv": { source: "iana" },
  "video/nv": { source: "iana" },
  "video/ogg": { source: "iana", compressible: !1, extensions: ["ogv"] },
  "video/parityfec": { source: "iana" },
  "video/pointer": { source: "iana" },
  "video/quicktime": { source: "iana", compressible: !1, extensions: ["qt", "mov"] },
  "video/raptorfec": { source: "iana" },
  "video/raw": { source: "iana" },
  "video/rtp-enc-aescm128": { source: "iana" },
  "video/rtploopback": { source: "iana" },
  "video/rtx": { source: "iana" },
  "video/scip": { source: "iana" },
  "video/smpte291": { source: "iana" },
  "video/smpte292m": { source: "iana" },
  "video/ulpfec": { source: "iana" },
  "video/vc1": { source: "iana" },
  "video/vc2": { source: "iana" },
  "video/vnd.cctv": { source: "iana" },
  "video/vnd.dece.hd": { source: "iana", extensions: ["uvh", "uvvh"] },
  "video/vnd.dece.mobile": { source: "iana", extensions: ["uvm", "uvvm"] },
  "video/vnd.dece.mp4": { source: "iana" },
  "video/vnd.dece.pd": { source: "iana", extensions: ["uvp", "uvvp"] },
  "video/vnd.dece.sd": { source: "iana", extensions: ["uvs", "uvvs"] },
  "video/vnd.dece.video": { source: "iana", extensions: ["uvv", "uvvv"] },
  "video/vnd.directv.mpeg": { source: "iana" },
  "video/vnd.directv.mpeg-tts": { source: "iana" },
  "video/vnd.dlna.mpeg-tts": { source: "iana" },
  "video/vnd.dvb.file": { source: "iana", extensions: ["dvb"] },
  "video/vnd.fvt": { source: "iana", extensions: ["fvt"] },
  "video/vnd.hns.video": { source: "iana" },
  "video/vnd.iptvforum.1dparityfec-1010": { source: "iana" },
  "video/vnd.iptvforum.1dparityfec-2005": { source: "iana" },
  "video/vnd.iptvforum.2dparityfec-1010": { source: "iana" },
  "video/vnd.iptvforum.2dparityfec-2005": { source: "iana" },
  "video/vnd.iptvforum.ttsavc": { source: "iana" },
  "video/vnd.iptvforum.ttsmpeg2": { source: "iana" },
  "video/vnd.motorola.video": { source: "iana" },
  "video/vnd.motorola.videop": { source: "iana" },
  "video/vnd.mpegurl": { source: "iana", extensions: ["mxu", "m4u"] },
  "video/vnd.ms-playready.media.pyv": { source: "iana", extensions: ["pyv"] },
  "video/vnd.nokia.interleaved-multimedia": { source: "iana" },
  "video/vnd.nokia.mp4vr": { source: "iana" },
  "video/vnd.nokia.videovoip": { source: "iana" },
  "video/vnd.objectvideo": { source: "iana" },
  "video/vnd.radgamettools.bink": { source: "iana" },
  "video/vnd.radgamettools.smacker": { source: "iana" },
  "video/vnd.sealed.mpeg1": { source: "iana" },
  "video/vnd.sealed.mpeg4": { source: "iana" },
  "video/vnd.sealed.swf": { source: "iana" },
  "video/vnd.sealedmedia.softseal.mov": { source: "iana" },
  "video/vnd.uvvu.mp4": { source: "iana", extensions: ["uvu", "uvvu"] },
  "video/vnd.vivo": { source: "iana", extensions: ["viv"] },
  "video/vnd.youtube.yt": { source: "iana" },
  "video/vp8": { source: "iana" },
  "video/vp9": { source: "iana" },
  "video/webm": { source: "apache", compressible: !1, extensions: ["webm"] },
  "video/x-f4v": { source: "apache", extensions: ["f4v"] },
  "video/x-fli": { source: "apache", extensions: ["fli"] },
  "video/x-flv": { source: "apache", compressible: !1, extensions: ["flv"] },
  "video/x-m4v": { source: "apache", extensions: ["m4v"] },
  "video/x-matroska": { source: "apache", compressible: !1, extensions: ["mkv", "mk3d", "mks"] },
  "video/x-mng": { source: "apache", extensions: ["mng"] },
  "video/x-ms-asf": { source: "apache", extensions: ["asf", "asx"] },
  "video/x-ms-vob": { source: "apache", extensions: ["vob"] },
  "video/x-ms-wm": { source: "apache", extensions: ["wm"] },
  "video/x-ms-wmv": { source: "apache", compressible: !1, extensions: ["wmv"] },
  "video/x-ms-wmx": { source: "apache", extensions: ["wmx"] },
  "video/x-ms-wvx": { source: "apache", extensions: ["wvx"] },
  "video/x-msvideo": { source: "apache", extensions: ["avi"] },
  "video/x-sgi-movie": { source: "apache", extensions: ["movie"] },
  "video/x-smv": { source: "apache", extensions: ["smv"] },
  "x-conference/x-cooltalk": { source: "apache", extensions: ["ice"] },
  "x-shader/x-fragment": { compressible: !0 },
  "x-shader/x-vertex": { compressible: !0 }
};
var oi, Lp;
function h_() {
  return Lp || (Lp = 1, oi = m_), oi;
}
var Dp;
function v_() {
  return Dp || (Dp = 1, (function(e) {
    var t = h_(), n = Ae.extname, r = /^\s*([^;\s]*)(?:;|\s|$)/, s = /^text\//i;
    e.charset = i, e.charsets = { lookup: i }, e.contentType = a, e.extension = o, e.extensions = /* @__PURE__ */ Object.create(null), e.lookup = c, e.types = /* @__PURE__ */ Object.create(null), l(e.extensions, e.types);
    function i(u) {
      if (!u || typeof u != "string")
        return !1;
      var f = r.exec(u), d = f && t[f[1].toLowerCase()];
      return d && d.charset ? d.charset : f && s.test(f[1]) ? "UTF-8" : !1;
    }
    function a(u) {
      if (!u || typeof u != "string")
        return !1;
      var f = u.indexOf("/") === -1 ? e.lookup(u) : u;
      if (!f)
        return !1;
      if (f.indexOf("charset") === -1) {
        var d = e.charset(f);
        d && (f += "; charset=" + d.toLowerCase());
      }
      return f;
    }
    function o(u) {
      if (!u || typeof u != "string")
        return !1;
      var f = r.exec(u), d = f && e.extensions[f[1].toLowerCase()];
      return !d || !d.length ? !1 : d[0];
    }
    function c(u) {
      if (!u || typeof u != "string")
        return !1;
      var f = n("x." + u).toLowerCase().substr(1);
      return f && e.types[f] || !1;
    }
    function l(u, f) {
      var d = ["nginx", "apache", void 0, "iana"];
      Object.keys(t).forEach(function(v) {
        var y = t[v], p = y.extensions;
        if (!(!p || !p.length)) {
          u[v] = p;
          for (var h = 0; h < p.length; h++) {
            var m = p[h];
            if (f[m]) {
              var _ = d.indexOf(t[f[m]].source), E = d.indexOf(y.source);
              if (f[m] !== "application/octet-stream" && (_ > E || _ === E && f[m].substr(0, 12) === "application/"))
                continue;
            }
            f[m] = v;
          }
        }
      });
    }
  })(ii)), ii;
}
var ci, Fp;
function y_() {
  if (Fp) return ci;
  Fp = 1, ci = e;
  function e(t) {
    var n = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
    n ? n(t) : setTimeout(t, 0);
  }
  return ci;
}
var ui, Mp;
function Qf() {
  if (Mp) return ui;
  Mp = 1;
  var e = y_();
  ui = t;
  function t(n) {
    var r = !1;
    return e(function() {
      r = !0;
    }), function(i, a) {
      r ? n(i, a) : e(function() {
        n(i, a);
      });
    };
  }
  return ui;
}
var li, Up;
function Zf() {
  if (Up) return li;
  Up = 1, li = e;
  function e(n) {
    Object.keys(n.jobs).forEach(t.bind(n)), n.jobs = {};
  }
  function t(n) {
    typeof this.jobs[n] == "function" && this.jobs[n]();
  }
  return li;
}
var pi, zp;
function em() {
  if (zp) return pi;
  zp = 1;
  var e = Qf(), t = Zf();
  pi = n;
  function n(s, i, a, o) {
    var c = a.keyedList ? a.keyedList[a.index] : a.index;
    a.jobs[c] = r(i, c, s[c], function(l, u) {
      c in a.jobs && (delete a.jobs[c], l ? t(a) : a.results[c] = u, o(l, a.results));
    });
  }
  function r(s, i, a, o) {
    var c;
    return s.length == 2 ? c = s(a, e(o)) : c = s(a, i, e(o)), c;
  }
  return pi;
}
var di, Vp;
function tm() {
  if (Vp) return di;
  Vp = 1, di = e;
  function e(t, n) {
    var r = !Array.isArray(t), s = {
      index: 0,
      keyedList: r || n ? Object.keys(t) : null,
      jobs: {},
      results: r ? {} : [],
      size: r ? Object.keys(t).length : t.length
    };
    return n && s.keyedList.sort(r ? n : function(i, a) {
      return n(t[i], t[a]);
    }), s;
  }
  return di;
}
var fi, Bp;
function rm() {
  if (Bp) return fi;
  Bp = 1;
  var e = Zf(), t = Qf();
  fi = n;
  function n(r) {
    Object.keys(this.jobs).length && (this.index = this.size, e(this), t(r)(null, this.results));
  }
  return fi;
}
var mi, Gp;
function g_() {
  if (Gp) return mi;
  Gp = 1;
  var e = em(), t = tm(), n = rm();
  mi = r;
  function r(s, i, a) {
    for (var o = t(s); o.index < (o.keyedList || s).length; )
      e(s, i, o, function(c, l) {
        if (c) {
          a(c, l);
          return;
        }
        if (Object.keys(o.jobs).length === 0) {
          a(null, o.results);
          return;
        }
      }), o.index++;
    return n.bind(o, a);
  }
  return mi;
}
var rr = { exports: {} }, Hp;
function nm() {
  if (Hp) return rr.exports;
  Hp = 1;
  var e = em(), t = tm(), n = rm();
  rr.exports = r, rr.exports.ascending = s, rr.exports.descending = i;
  function r(a, o, c, l) {
    var u = t(a, c);
    return e(a, o, u, function f(d, b) {
      if (d) {
        l(d, b);
        return;
      }
      if (u.index++, u.index < (u.keyedList || a).length) {
        e(a, o, u, f);
        return;
      }
      l(null, u.results);
    }), n.bind(u, l);
  }
  function s(a, o) {
    return a < o ? -1 : a > o ? 1 : 0;
  }
  function i(a, o) {
    return -1 * s(a, o);
  }
  return rr.exports;
}
var hi, Kp;
function b_() {
  if (Kp) return hi;
  Kp = 1;
  var e = nm();
  hi = t;
  function t(n, r, s) {
    return e(n, r, null, s);
  }
  return hi;
}
var vi, Wp;
function __() {
  return Wp || (Wp = 1, vi = {
    parallel: g_(),
    serial: b_(),
    serialOrdered: nm()
  }), vi;
}
var yi, Jp;
function am() {
  return Jp || (Jp = 1, yi = Object), yi;
}
var gi, Xp;
function x_() {
  return Xp || (Xp = 1, gi = Error), gi;
}
var bi, Yp;
function w_() {
  return Yp || (Yp = 1, bi = EvalError), bi;
}
var _i, Qp;
function E_() {
  return Qp || (Qp = 1, _i = RangeError), _i;
}
var xi, Zp;
function $_() {
  return Zp || (Zp = 1, xi = ReferenceError), xi;
}
var wi, ed;
function S_() {
  return ed || (ed = 1, wi = SyntaxError), wi;
}
var Ei, td;
function qo() {
  return td || (td = 1, Ei = TypeError), Ei;
}
var $i, rd;
function R_() {
  return rd || (rd = 1, $i = URIError), $i;
}
var Si, nd;
function T_() {
  return nd || (nd = 1, Si = Math.abs), Si;
}
var Ri, ad;
function P_() {
  return ad || (ad = 1, Ri = Math.floor), Ri;
}
var Ti, sd;
function O_() {
  return sd || (sd = 1, Ti = Math.max), Ti;
}
var Pi, id;
function N_() {
  return id || (id = 1, Pi = Math.min), Pi;
}
var Oi, od;
function k_() {
  return od || (od = 1, Oi = Math.pow), Oi;
}
var Ni, cd;
function j_() {
  return cd || (cd = 1, Ni = Math.round), Ni;
}
var ki, ud;
function A_() {
  return ud || (ud = 1, ki = Number.isNaN || function(t) {
    return t !== t;
  }), ki;
}
var ji, ld;
function I_() {
  if (ld) return ji;
  ld = 1;
  var e = /* @__PURE__ */ A_();
  return ji = function(n) {
    return e(n) || n === 0 ? n : n < 0 ? -1 : 1;
  }, ji;
}
var Ai, pd;
function C_() {
  return pd || (pd = 1, Ai = Object.getOwnPropertyDescriptor), Ai;
}
var Ii, dd;
function sm() {
  if (dd) return Ii;
  dd = 1;
  var e = /* @__PURE__ */ C_();
  if (e)
    try {
      e([], "length");
    } catch {
      e = null;
    }
  return Ii = e, Ii;
}
var Ci, fd;
function q_() {
  if (fd) return Ci;
  fd = 1;
  var e = Object.defineProperty || !1;
  if (e)
    try {
      e({}, "a", { value: 1 });
    } catch {
      e = !1;
    }
  return Ci = e, Ci;
}
var qi, md;
function im() {
  return md || (md = 1, qi = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var t = {}, n = /* @__PURE__ */ Symbol("test"), r = Object(n);
    if (typeof n == "string" || Object.prototype.toString.call(n) !== "[object Symbol]" || Object.prototype.toString.call(r) !== "[object Symbol]")
      return !1;
    var s = 42;
    t[n] = s;
    for (var i in t)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(t).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(t).length !== 0)
      return !1;
    var a = Object.getOwnPropertySymbols(t);
    if (a.length !== 1 || a[0] !== n || !Object.prototype.propertyIsEnumerable.call(t, n))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var o = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(t, n)
      );
      if (o.value !== s || o.enumerable !== !0)
        return !1;
    }
    return !0;
  }), qi;
}
var Li, hd;
function L_() {
  if (hd) return Li;
  hd = 1;
  var e = typeof Symbol < "u" && Symbol, t = im();
  return Li = function() {
    return typeof e != "function" || typeof Symbol != "function" || typeof e("foo") != "symbol" || typeof /* @__PURE__ */ Symbol("bar") != "symbol" ? !1 : t();
  }, Li;
}
var Di, vd;
function om() {
  return vd || (vd = 1, Di = typeof Reflect < "u" && Reflect.getPrototypeOf || null), Di;
}
var Fi, yd;
function cm() {
  if (yd) return Fi;
  yd = 1;
  var e = /* @__PURE__ */ am();
  return Fi = e.getPrototypeOf || null, Fi;
}
var Mi, gd;
function D_() {
  if (gd) return Mi;
  gd = 1;
  var e = "Function.prototype.bind called on incompatible ", t = Object.prototype.toString, n = Math.max, r = "[object Function]", s = function(c, l) {
    for (var u = [], f = 0; f < c.length; f += 1)
      u[f] = c[f];
    for (var d = 0; d < l.length; d += 1)
      u[d + c.length] = l[d];
    return u;
  }, i = function(c, l) {
    for (var u = [], f = l, d = 0; f < c.length; f += 1, d += 1)
      u[d] = c[f];
    return u;
  }, a = function(o, c) {
    for (var l = "", u = 0; u < o.length; u += 1)
      l += o[u], u + 1 < o.length && (l += c);
    return l;
  };
  return Mi = function(c) {
    var l = this;
    if (typeof l != "function" || t.apply(l) !== r)
      throw new TypeError(e + l);
    for (var u = i(arguments, 1), f, d = function() {
      if (this instanceof f) {
        var h = l.apply(
          this,
          s(u, arguments)
        );
        return Object(h) === h ? h : this;
      }
      return l.apply(
        c,
        s(u, arguments)
      );
    }, b = n(0, l.length - u.length), v = [], y = 0; y < b; y++)
      v[y] = "$" + y;
    if (f = Function("binder", "return function (" + a(v, ",") + "){ return binder.apply(this,arguments); }")(d), l.prototype) {
      var p = function() {
      };
      p.prototype = l.prototype, f.prototype = new p(), p.prototype = null;
    }
    return f;
  }, Mi;
}
var Ui, bd;
function La() {
  if (bd) return Ui;
  bd = 1;
  var e = D_();
  return Ui = Function.prototype.bind || e, Ui;
}
var zi, _d;
function Lo() {
  return _d || (_d = 1, zi = Function.prototype.call), zi;
}
var Vi, xd;
function um() {
  return xd || (xd = 1, Vi = Function.prototype.apply), Vi;
}
var Bi, wd;
function F_() {
  return wd || (wd = 1, Bi = typeof Reflect < "u" && Reflect && Reflect.apply), Bi;
}
var Gi, Ed;
function M_() {
  if (Ed) return Gi;
  Ed = 1;
  var e = La(), t = um(), n = Lo(), r = F_();
  return Gi = r || e.call(n, t), Gi;
}
var Hi, $d;
function U_() {
  if ($d) return Hi;
  $d = 1;
  var e = La(), t = /* @__PURE__ */ qo(), n = Lo(), r = M_();
  return Hi = function(i) {
    if (i.length < 1 || typeof i[0] != "function")
      throw new t("a function is required");
    return r(e, n, i);
  }, Hi;
}
var Ki, Sd;
function z_() {
  if (Sd) return Ki;
  Sd = 1;
  var e = U_(), t = /* @__PURE__ */ sm(), n;
  try {
    n = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (a) {
    if (!a || typeof a != "object" || !("code" in a) || a.code !== "ERR_PROTO_ACCESS")
      throw a;
  }
  var r = !!n && t && t(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), s = Object, i = s.getPrototypeOf;
  return Ki = r && typeof r.get == "function" ? e([r.get]) : typeof i == "function" ? (
    /** @type {import('./get')} */
    function(o) {
      return i(o == null ? o : s(o));
    }
  ) : !1, Ki;
}
var Wi, Rd;
function V_() {
  if (Rd) return Wi;
  Rd = 1;
  var e = om(), t = cm(), n = /* @__PURE__ */ z_();
  return Wi = e ? function(s) {
    return e(s);
  } : t ? function(s) {
    if (!s || typeof s != "object" && typeof s != "function")
      throw new TypeError("getProto: not an object");
    return t(s);
  } : n ? function(s) {
    return n(s);
  } : null, Wi;
}
var Ji, Td;
function Do() {
  if (Td) return Ji;
  Td = 1;
  var e = Function.prototype.call, t = Object.prototype.hasOwnProperty, n = La();
  return Ji = n.call(e, t), Ji;
}
var Xi, Pd;
function B_() {
  if (Pd) return Xi;
  Pd = 1;
  var e, t = /* @__PURE__ */ am(), n = /* @__PURE__ */ x_(), r = /* @__PURE__ */ w_(), s = /* @__PURE__ */ E_(), i = /* @__PURE__ */ $_(), a = /* @__PURE__ */ S_(), o = /* @__PURE__ */ qo(), c = /* @__PURE__ */ R_(), l = /* @__PURE__ */ T_(), u = /* @__PURE__ */ P_(), f = /* @__PURE__ */ O_(), d = /* @__PURE__ */ N_(), b = /* @__PURE__ */ k_(), v = /* @__PURE__ */ j_(), y = /* @__PURE__ */ I_(), p = Function, h = function(Z) {
    try {
      return p('"use strict"; return (' + Z + ").constructor;")();
    } catch {
    }
  }, m = /* @__PURE__ */ sm(), _ = /* @__PURE__ */ q_(), E = function() {
    throw new o();
  }, x = m ? (function() {
    try {
      return arguments.callee, E;
    } catch {
      try {
        return m(arguments, "callee").get;
      } catch {
        return E;
      }
    }
  })() : E, w = L_()(), S = V_(), P = cm(), C = om(), M = um(), L = Lo(), G = {}, H = typeof Uint8Array > "u" || !S ? e : S(Uint8Array), F = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? e : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? e : ArrayBuffer,
    "%ArrayIteratorPrototype%": w && S ? S([][Symbol.iterator]()) : e,
    "%AsyncFromSyncIteratorPrototype%": e,
    "%AsyncFunction%": G,
    "%AsyncGenerator%": G,
    "%AsyncGeneratorFunction%": G,
    "%AsyncIteratorPrototype%": G,
    "%Atomics%": typeof Atomics > "u" ? e : Atomics,
    "%BigInt%": typeof BigInt > "u" ? e : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? e : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? e : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? e : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": n,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": r,
    "%Float16Array%": typeof Float16Array > "u" ? e : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? e : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? e : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? e : FinalizationRegistry,
    "%Function%": p,
    "%GeneratorFunction%": G,
    "%Int8Array%": typeof Int8Array > "u" ? e : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? e : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? e : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": w && S ? S(S([][Symbol.iterator]())) : e,
    "%JSON%": typeof JSON == "object" ? JSON : e,
    "%Map%": typeof Map > "u" ? e : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !w || !S ? e : S((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": t,
    "%Object.getOwnPropertyDescriptor%": m,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? e : Promise,
    "%Proxy%": typeof Proxy > "u" ? e : Proxy,
    "%RangeError%": s,
    "%ReferenceError%": i,
    "%Reflect%": typeof Reflect > "u" ? e : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? e : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !w || !S ? e : S((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? e : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": w && S ? S(""[Symbol.iterator]()) : e,
    "%Symbol%": w ? Symbol : e,
    "%SyntaxError%": a,
    "%ThrowTypeError%": x,
    "%TypedArray%": H,
    "%TypeError%": o,
    "%Uint8Array%": typeof Uint8Array > "u" ? e : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? e : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? e : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? e : Uint32Array,
    "%URIError%": c,
    "%WeakMap%": typeof WeakMap > "u" ? e : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? e : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? e : WeakSet,
    "%Function.prototype.call%": L,
    "%Function.prototype.apply%": M,
    "%Object.defineProperty%": _,
    "%Object.getPrototypeOf%": P,
    "%Math.abs%": l,
    "%Math.floor%": u,
    "%Math.max%": f,
    "%Math.min%": d,
    "%Math.pow%": b,
    "%Math.round%": v,
    "%Math.sign%": y,
    "%Reflect.getPrototypeOf%": C
  };
  if (S)
    try {
      null.error;
    } catch (Z) {
      var K = S(S(Z));
      F["%Error.prototype%"] = K;
    }
  var q = function Z(Y) {
    var T;
    if (Y === "%AsyncFunction%")
      T = h("async function () {}");
    else if (Y === "%GeneratorFunction%")
      T = h("function* () {}");
    else if (Y === "%AsyncGeneratorFunction%")
      T = h("async function* () {}");
    else if (Y === "%AsyncGenerator%") {
      var N = Z("%AsyncGeneratorFunction%");
      N && (T = N.prototype);
    } else if (Y === "%AsyncIteratorPrototype%") {
      var I = Z("%AsyncGenerator%");
      I && S && (T = S(I.prototype));
    }
    return F[Y] = T, T;
  }, U = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, D = La(), J = /* @__PURE__ */ Do(), A = D.call(L, Array.prototype.concat), R = D.call(M, Array.prototype.splice), j = D.call(L, String.prototype.replace), O = D.call(L, String.prototype.slice), g = D.call(L, RegExp.prototype.exec), $ = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, k = /\\(\\)?/g, B = function(Y) {
    var T = O(Y, 0, 1), N = O(Y, -1);
    if (T === "%" && N !== "%")
      throw new a("invalid intrinsic syntax, expected closing `%`");
    if (N === "%" && T !== "%")
      throw new a("invalid intrinsic syntax, expected opening `%`");
    var I = [];
    return j(Y, $, function(z, X, Q, re) {
      I[I.length] = Q ? j(re, k, "$1") : X || z;
    }), I;
  }, W = function(Y, T) {
    var N = Y, I;
    if (J(U, N) && (I = U[N], N = "%" + I[0] + "%"), J(F, N)) {
      var z = F[N];
      if (z === G && (z = q(N)), typeof z > "u" && !T)
        throw new o("intrinsic " + Y + " exists, but is not available. Please file an issue!");
      return {
        alias: I,
        name: N,
        value: z
      };
    }
    throw new a("intrinsic " + Y + " does not exist!");
  };
  return Xi = function(Y, T) {
    if (typeof Y != "string" || Y.length === 0)
      throw new o("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof T != "boolean")
      throw new o('"allowMissing" argument must be a boolean');
    if (g(/^%?[^%]*%?$/, Y) === null)
      throw new a("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var N = B(Y), I = N.length > 0 ? N[0] : "", z = W("%" + I + "%", T), X = z.name, Q = z.value, re = !1, he = z.alias;
    he && (I = he[0], R(N, A([0, 1], he)));
    for (var pe = 1, le = !0; pe < N.length; pe += 1) {
      var ne = N[pe], we = O(ne, 0, 1), me = O(ne, -1);
      if ((we === '"' || we === "'" || we === "`" || me === '"' || me === "'" || me === "`") && we !== me)
        throw new a("property names with quotes must have matching quotes");
      if ((ne === "constructor" || !le) && (re = !0), I += "." + ne, X = "%" + I + "%", J(F, X))
        Q = F[X];
      else if (Q != null) {
        if (!(ne in Q)) {
          if (!T)
            throw new o("base intrinsic for " + Y + " exists, but the property is not available.");
          return;
        }
        if (m && pe + 1 >= N.length) {
          var Me = m(Q, ne);
          le = !!Me, le && "get" in Me && !("originalValue" in Me.get) ? Q = Me.get : Q = Q[ne];
        } else
          le = J(Q, ne), Q = Q[ne];
        le && !re && (F[X] = Q);
      }
    }
    return Q;
  }, Xi;
}
var Yi, Od;
function G_() {
  if (Od) return Yi;
  Od = 1;
  var e = im();
  return Yi = function() {
    return e() && !!Symbol.toStringTag;
  }, Yi;
}
var Qi, Nd;
function H_() {
  if (Nd) return Qi;
  Nd = 1;
  var e = /* @__PURE__ */ B_(), t = e("%Object.defineProperty%", !0), n = G_()(), r = /* @__PURE__ */ Do(), s = /* @__PURE__ */ qo(), i = n ? Symbol.toStringTag : null;
  return Qi = function(o, c) {
    var l = arguments.length > 2 && !!arguments[2] && arguments[2].force, u = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
    if (typeof l < "u" && typeof l != "boolean" || typeof u < "u" && typeof u != "boolean")
      throw new s("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
    i && (l || !r(o, i)) && (t ? t(o, i, {
      configurable: !u,
      enumerable: !1,
      value: c,
      writable: !1
    }) : o[i] = c);
  }, Qi;
}
var Zi, kd;
function K_() {
  return kd || (kd = 1, Zi = function(e, t) {
    return Object.keys(t).forEach(function(n) {
      e[n] = e[n] || t[n];
    }), e;
  }), Zi;
}
var eo, jd;
function W_() {
  if (jd) return eo;
  jd = 1;
  var e = f_(), t = jt, n = Ae, r = go, s = bo, i = ya.parse, a = Nm, o = Ce.Stream, c = ua, l = v_(), u = __(), f = /* @__PURE__ */ H_(), d = /* @__PURE__ */ Do(), b = K_();
  function v(y) {
    if (!(this instanceof v))
      return new v(y);
    this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], e.call(this), y = y || {};
    for (var p in y)
      this[p] = y[p];
  }
  return t.inherits(v, e), v.LINE_BREAK = `\r
`, v.DEFAULT_CONTENT_TYPE = "application/octet-stream", v.prototype.append = function(y, p, h) {
    h = h || {}, typeof h == "string" && (h = { filename: h });
    var m = e.prototype.append.bind(this);
    if ((typeof p == "number" || p == null) && (p = String(p)), Array.isArray(p)) {
      this._error(new Error("Arrays are not supported."));
      return;
    }
    var _ = this._multiPartHeader(y, p, h), E = this._multiPartFooter();
    m(_), m(p), m(E), this._trackLength(_, p, h);
  }, v.prototype._trackLength = function(y, p, h) {
    var m = 0;
    h.knownLength != null ? m += Number(h.knownLength) : Buffer.isBuffer(p) ? m = p.length : typeof p == "string" && (m = Buffer.byteLength(p)), this._valueLength += m, this._overheadLength += Buffer.byteLength(y) + v.LINE_BREAK.length, !(!p || !p.path && !(p.readable && d(p, "httpVersion")) && !(p instanceof o)) && (h.knownLength || this._valuesToMeasure.push(p));
  }, v.prototype._lengthRetriever = function(y, p) {
    d(y, "fd") ? y.end != null && y.end != 1 / 0 && y.start != null ? p(null, y.end + 1 - (y.start ? y.start : 0)) : a.stat(y.path, function(h, m) {
      if (h) {
        p(h);
        return;
      }
      var _ = m.size - (y.start ? y.start : 0);
      p(null, _);
    }) : d(y, "httpVersion") ? p(null, Number(y.headers["content-length"])) : d(y, "httpModule") ? (y.on("response", function(h) {
      y.pause(), p(null, Number(h.headers["content-length"]));
    }), y.resume()) : p("Unknown stream");
  }, v.prototype._multiPartHeader = function(y, p, h) {
    if (typeof h.header == "string")
      return h.header;
    var m = this._getContentDisposition(p, h), _ = this._getContentType(p, h), E = "", x = {
      // add custom disposition as third element or keep it two elements if not
      "Content-Disposition": ["form-data", 'name="' + y + '"'].concat(m || []),
      // if no content type. allow it to be empty array
      "Content-Type": [].concat(_ || [])
    };
    typeof h.header == "object" && b(x, h.header);
    var w;
    for (var S in x)
      if (d(x, S)) {
        if (w = x[S], w == null)
          continue;
        Array.isArray(w) || (w = [w]), w.length && (E += S + ": " + w.join("; ") + v.LINE_BREAK);
      }
    return "--" + this.getBoundary() + v.LINE_BREAK + E + v.LINE_BREAK;
  }, v.prototype._getContentDisposition = function(y, p) {
    var h;
    if (typeof p.filepath == "string" ? h = n.normalize(p.filepath).replace(/\\/g, "/") : p.filename || y && (y.name || y.path) ? h = n.basename(p.filename || y && (y.name || y.path)) : y && y.readable && d(y, "httpVersion") && (h = n.basename(y.client._httpMessage.path || "")), h)
      return 'filename="' + h + '"';
  }, v.prototype._getContentType = function(y, p) {
    var h = p.contentType;
    return !h && y && y.name && (h = l.lookup(y.name)), !h && y && y.path && (h = l.lookup(y.path)), !h && y && y.readable && d(y, "httpVersion") && (h = y.headers["content-type"]), !h && (p.filepath || p.filename) && (h = l.lookup(p.filepath || p.filename)), !h && y && typeof y == "object" && (h = v.DEFAULT_CONTENT_TYPE), h;
  }, v.prototype._multiPartFooter = function() {
    return (function(y) {
      var p = v.LINE_BREAK, h = this._streams.length === 0;
      h && (p += this._lastBoundary()), y(p);
    }).bind(this);
  }, v.prototype._lastBoundary = function() {
    return "--" + this.getBoundary() + "--" + v.LINE_BREAK;
  }, v.prototype.getHeaders = function(y) {
    var p, h = {
      "content-type": "multipart/form-data; boundary=" + this.getBoundary()
    };
    for (p in y)
      d(y, p) && (h[p.toLowerCase()] = y[p]);
    return h;
  }, v.prototype.setBoundary = function(y) {
    if (typeof y != "string")
      throw new TypeError("FormData boundary must be a string");
    this._boundary = y;
  }, v.prototype.getBoundary = function() {
    return this._boundary || this._generateBoundary(), this._boundary;
  }, v.prototype.getBuffer = function() {
    for (var y = new Buffer.alloc(0), p = this.getBoundary(), h = 0, m = this._streams.length; h < m; h++)
      typeof this._streams[h] != "function" && (Buffer.isBuffer(this._streams[h]) ? y = Buffer.concat([y, this._streams[h]]) : y = Buffer.concat([y, Buffer.from(this._streams[h])]), (typeof this._streams[h] != "string" || this._streams[h].substring(2, p.length + 2) !== p) && (y = Buffer.concat([y, Buffer.from(v.LINE_BREAK)])));
    return Buffer.concat([y, Buffer.from(this._lastBoundary())]);
  }, v.prototype._generateBoundary = function() {
    this._boundary = "--------------------------" + c.randomBytes(12).toString("hex");
  }, v.prototype.getLengthSync = function() {
    var y = this._overheadLength + this._valueLength;
    return this._streams.length && (y += this._lastBoundary().length), this.hasKnownLength() || this._error(new Error("Cannot calculate proper length in synchronous way.")), y;
  }, v.prototype.hasKnownLength = function() {
    var y = !0;
    return this._valuesToMeasure.length && (y = !1), y;
  }, v.prototype.getLength = function(y) {
    var p = this._overheadLength + this._valueLength;
    if (this._streams.length && (p += this._lastBoundary().length), !this._valuesToMeasure.length) {
      process.nextTick(y.bind(this, null, p));
      return;
    }
    u.parallel(this._valuesToMeasure, this._lengthRetriever, function(h, m) {
      if (h) {
        y(h);
        return;
      }
      m.forEach(function(_) {
        p += _;
      }), y(null, p);
    });
  }, v.prototype.submit = function(y, p) {
    var h, m, _ = { method: "post" };
    return typeof y == "string" ? (y = i(y), m = b({
      port: y.port,
      path: y.pathname,
      host: y.hostname,
      protocol: y.protocol
    }, _)) : (m = b(y, _), m.port || (m.port = m.protocol === "https:" ? 443 : 80)), m.headers = this.getHeaders(y.headers), m.protocol === "https:" ? h = s.request(m) : h = r.request(m), this.getLength((function(E, x) {
      if (E && E !== "Unknown stream") {
        this._error(E);
        return;
      }
      if (x && h.setHeader("Content-Length", x), this.pipe(h), p) {
        var w, S = function(P, C) {
          return h.removeListener("error", S), h.removeListener("response", w), p.call(this, P, C);
        };
        w = S.bind(this, null), h.on("error", S), h.on("response", w);
      }
    }).bind(this)), h;
  }, v.prototype._error = function(y) {
    this.error || (this.error = y, this.pause(), this.emit("error", y));
  }, v.prototype.toString = function() {
    return "[object FormData]";
  }, f(v.prototype, "FormData"), eo = v, eo;
}
var J_ = W_();
const lm = /* @__PURE__ */ ir(J_);
function ho(e) {
  return V.isPlainObject(e) || V.isArray(e);
}
function pm(e) {
  return V.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Ad(e, t, n) {
  return e ? e.concat(t).map(function(s, i) {
    return s = pm(s), !n && i ? "[" + s + "]" : s;
  }).join(n ? "." : "") : t;
}
function X_(e) {
  return V.isArray(e) && !e.some(ho);
}
const Y_ = V.toFlatObject(V, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function Da(e, t, n) {
  if (!V.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new (lm || FormData)(), n = V.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(y, p) {
    return !V.isUndefined(p[y]);
  });
  const r = n.metaTokens, s = n.visitor || u, i = n.dots, a = n.indexes, c = (n.Blob || typeof Blob < "u" && Blob) && V.isSpecCompliantForm(t);
  if (!V.isFunction(s))
    throw new TypeError("visitor must be a function");
  function l(v) {
    if (v === null) return "";
    if (V.isDate(v))
      return v.toISOString();
    if (V.isBoolean(v))
      return v.toString();
    if (!c && V.isBlob(v))
      throw new te("Blob is not supported. Use a Buffer instead.");
    return V.isArrayBuffer(v) || V.isTypedArray(v) ? c && typeof Blob == "function" ? new Blob([v]) : Buffer.from(v) : v;
  }
  function u(v, y, p) {
    let h = v;
    if (v && !p && typeof v == "object") {
      if (V.endsWith(y, "{}"))
        y = r ? y : y.slice(0, -2), v = JSON.stringify(v);
      else if (V.isArray(v) && X_(v) || (V.isFileList(v) || V.endsWith(y, "[]")) && (h = V.toArray(v)))
        return y = pm(y), h.forEach(function(_, E) {
          !(V.isUndefined(_) || _ === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            a === !0 ? Ad([y], E, i) : a === null ? y : y + "[]",
            l(_)
          );
        }), !1;
    }
    return ho(v) ? !0 : (t.append(Ad(p, y, i), l(v)), !1);
  }
  const f = [], d = Object.assign(Y_, {
    defaultVisitor: u,
    convertValue: l,
    isVisitable: ho
  });
  function b(v, y) {
    if (!V.isUndefined(v)) {
      if (f.indexOf(v) !== -1)
        throw Error("Circular reference detected in " + y.join("."));
      f.push(v), V.forEach(v, function(h, m) {
        (!(V.isUndefined(h) || h === null) && s.call(
          t,
          h,
          V.isString(m) ? m.trim() : m,
          y,
          d
        )) === !0 && b(h, y ? y.concat(m) : [m]);
      }), f.pop();
    }
  }
  if (!V.isObject(e))
    throw new TypeError("data must be an object");
  return b(e), t;
}
function Id(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(r) {
    return t[r];
  });
}
function dm(e, t) {
  this._pairs = [], e && Da(e, this, t);
}
const fm = dm.prototype;
fm.append = function(t, n) {
  this._pairs.push([t, n]);
};
fm.toString = function(t) {
  const n = t ? function(r) {
    return t.call(this, r, Id);
  } : Id;
  return this._pairs.map(function(s) {
    return n(s[0]) + "=" + n(s[1]);
  }, "").join("&");
};
function Q_(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function Fo(e, t, n) {
  if (!t)
    return e;
  const r = n && n.encode || Q_;
  V.isFunction(n) && (n = {
    serialize: n
  });
  const s = n && n.serialize;
  let i;
  if (s ? i = s(t, n) : i = V.isURLSearchParams(t) ? t.toString() : new dm(t, n).toString(r), i) {
    const a = e.indexOf("#");
    a !== -1 && (e = e.slice(0, a)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class Cd {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, r) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: r ? r.synchronous : !1,
      runWhen: r ? r.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    V.forEach(this.handlers, function(r) {
      r !== null && t(r);
    });
  }
}
const Mo = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Z_ = ya.URLSearchParams, to = "abcdefghijklmnopqrstuvwxyz", qd = "0123456789", mm = {
  DIGIT: qd,
  ALPHA: to,
  ALPHA_DIGIT: to + to.toUpperCase() + qd
}, ex = (e = 16, t = mm.ALPHA_DIGIT) => {
  let n = "";
  const { length: r } = t, s = new Uint32Array(e);
  ua.randomFillSync(s);
  for (let i = 0; i < e; i++)
    n += t[s[i] % r];
  return n;
}, tx = {
  isNode: !0,
  classes: {
    URLSearchParams: Z_,
    FormData: lm,
    Blob: typeof Blob < "u" && Blob || null
  },
  ALPHABET: mm,
  generateString: ex,
  protocols: ["http", "https", "file", "data"]
}, Uo = typeof window < "u" && typeof document < "u", vo = typeof navigator == "object" && navigator || void 0, rx = Uo && (!vo || ["ReactNative", "NativeScript", "NS"].indexOf(vo.product) < 0), nx = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", ax = Uo && window.location.href || "http://localhost", sx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Uo,
  hasStandardBrowserEnv: rx,
  hasStandardBrowserWebWorkerEnv: nx,
  navigator: vo,
  origin: ax
}, Symbol.toStringTag, { value: "Module" })), xe = {
  ...sx,
  ...tx
};
function ix(e, t) {
  return Da(e, new xe.classes.URLSearchParams(), {
    visitor: function(n, r, s, i) {
      return xe.isNode && V.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...t
  });
}
function ox(e) {
  return V.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function cx(e) {
  const t = {}, n = Object.keys(e);
  let r;
  const s = n.length;
  let i;
  for (r = 0; r < s; r++)
    i = n[r], t[i] = e[i];
  return t;
}
function hm(e) {
  function t(n, r, s, i) {
    let a = n[i++];
    if (a === "__proto__") return !0;
    const o = Number.isFinite(+a), c = i >= n.length;
    return a = !a && V.isArray(s) ? s.length : a, c ? (V.hasOwnProp(s, a) ? s[a] = [s[a], r] : s[a] = r, !o) : ((!s[a] || !V.isObject(s[a])) && (s[a] = []), t(n, r, s[a], i) && V.isArray(s[a]) && (s[a] = cx(s[a])), !o);
  }
  if (V.isFormData(e) && V.isFunction(e.entries)) {
    const n = {};
    return V.forEachEntry(e, (r, s) => {
      t(ox(r), s, n, 0);
    }), n;
  }
  return null;
}
function ux(e, t, n) {
  if (V.isString(e))
    try {
      return (t || JSON.parse)(e), V.trim(e);
    } catch (r) {
      if (r.name !== "SyntaxError")
        throw r;
    }
  return (n || JSON.stringify)(e);
}
const pr = {
  transitional: Mo,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const r = n.getContentType() || "", s = r.indexOf("application/json") > -1, i = V.isObject(t);
    if (i && V.isHTMLForm(t) && (t = new FormData(t)), V.isFormData(t))
      return s ? JSON.stringify(hm(t)) : t;
    if (V.isArrayBuffer(t) || V.isBuffer(t) || V.isStream(t) || V.isFile(t) || V.isBlob(t) || V.isReadableStream(t))
      return t;
    if (V.isArrayBufferView(t))
      return t.buffer;
    if (V.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let o;
    if (i) {
      if (r.indexOf("application/x-www-form-urlencoded") > -1)
        return ix(t, this.formSerializer).toString();
      if ((o = V.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
        const c = this.env && this.env.FormData;
        return Da(
          o ? { "files[]": t } : t,
          c && new c(),
          this.formSerializer
        );
      }
    }
    return i || s ? (n.setContentType("application/json", !1), ux(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || pr.transitional, r = n && n.forcedJSONParsing, s = this.responseType === "json";
    if (V.isResponse(t) || V.isReadableStream(t))
      return t;
    if (t && V.isString(t) && (r && !this.responseType || s)) {
      const a = !(n && n.silentJSONParsing) && s;
      try {
        return JSON.parse(t, this.parseReviver);
      } catch (o) {
        if (a)
          throw o.name === "SyntaxError" ? te.from(o, te.ERR_BAD_RESPONSE, this, null, this.response) : o;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: xe.classes.FormData,
    Blob: xe.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
V.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  pr.headers[e] = {};
});
const lx = V.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), px = (e) => {
  const t = {};
  let n, r, s;
  return e && e.split(`
`).forEach(function(a) {
    s = a.indexOf(":"), n = a.substring(0, s).trim().toLowerCase(), r = a.substring(s + 1).trim(), !(!n || t[n] && lx[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
  }), t;
}, Ld = /* @__PURE__ */ Symbol("internals");
function nr(e) {
  return e && String(e).trim().toLowerCase();
}
function oa(e) {
  return e === !1 || e == null ? e : V.isArray(e) ? e.map(oa) : String(e);
}
function dx(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = n.exec(e); )
    t[r[1]] = r[2];
  return t;
}
const fx = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function ro(e, t, n, r, s) {
  if (V.isFunction(r))
    return r.call(this, t, n);
  if (s && (t = n), !!V.isString(t)) {
    if (V.isString(r))
      return t.indexOf(r) !== -1;
    if (V.isRegExp(r))
      return r.test(t);
  }
}
function mx(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function hx(e, t) {
  const n = V.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function(s, i, a) {
        return this[r].call(this, t, s, i, a);
      },
      configurable: !0
    });
  });
}
let Re = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function i(o, c, l) {
      const u = nr(c);
      if (!u)
        throw new Error("header name must be a non-empty string");
      const f = V.findKey(s, u);
      (!f || s[f] === void 0 || l === !0 || l === void 0 && s[f] !== !1) && (s[f || c] = oa(o));
    }
    const a = (o, c) => V.forEach(o, (l, u) => i(l, u, c));
    if (V.isPlainObject(t) || t instanceof this.constructor)
      a(t, n);
    else if (V.isString(t) && (t = t.trim()) && !fx(t))
      a(px(t), n);
    else if (V.isObject(t) && V.isIterable(t)) {
      let o = {}, c, l;
      for (const u of t) {
        if (!V.isArray(u))
          throw TypeError("Object iterator must return a key-value pair");
        o[l = u[0]] = (c = o[l]) ? V.isArray(c) ? [...c, u[1]] : [c, u[1]] : u[1];
      }
      a(o, n);
    } else
      t != null && i(n, t, r);
    return this;
  }
  get(t, n) {
    if (t = nr(t), t) {
      const r = V.findKey(this, t);
      if (r) {
        const s = this[r];
        if (!n)
          return s;
        if (n === !0)
          return dx(s);
        if (V.isFunction(n))
          return n.call(this, s, r);
        if (V.isRegExp(n))
          return n.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = nr(t), t) {
      const r = V.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || ro(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function i(a) {
      if (a = nr(a), a) {
        const o = V.findKey(r, a);
        o && (!n || ro(r, r[o], o, n)) && (delete r[o], s = !0);
      }
    }
    return V.isArray(t) ? t.forEach(i) : i(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length, s = !1;
    for (; r--; ) {
      const i = n[r];
      (!t || ro(this, this[i], i, t, !0)) && (delete this[i], s = !0);
    }
    return s;
  }
  normalize(t) {
    const n = this, r = {};
    return V.forEach(this, (s, i) => {
      const a = V.findKey(r, i);
      if (a) {
        n[a] = oa(s), delete n[i];
        return;
      }
      const o = t ? mx(i) : String(i).trim();
      o !== i && delete n[i], n[o] = oa(s), r[o] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return V.forEach(this, (r, s) => {
      r != null && r !== !1 && (n[s] = t && V.isArray(r) ? r.join(", ") : r);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const r = new this(t);
    return n.forEach((s) => r.set(s)), r;
  }
  static accessor(t) {
    const r = (this[Ld] = this[Ld] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function i(a) {
      const o = nr(a);
      r[o] || (hx(s, a), r[o] = !0);
    }
    return V.isArray(t) ? t.forEach(i) : i(t), this;
  }
};
Re.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
V.reduceDescriptors(Re.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    }
  };
});
V.freezeMethods(Re);
function no(e, t) {
  const n = this || pr, r = t || n, s = Re.from(r.headers);
  let i = r.data;
  return V.forEach(e, function(o) {
    i = o.call(n, i, s.normalize(), t ? t.status : void 0);
  }), s.normalize(), i;
}
function vm(e) {
  return !!(e && e.__CANCEL__);
}
function ht(e, t, n) {
  te.call(this, e ?? "canceled", te.ERR_CANCELED, t, n), this.name = "CanceledError";
}
V.inherits(ht, te, {
  __CANCEL__: !0
});
function zt(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status) ? e(n) : t(new te(
    "Request failed with status code " + n.status,
    [te.ERR_BAD_REQUEST, te.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
function vx(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function yx(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function zo(e, t, n) {
  let r = !vx(t);
  return e && (r || n == !1) ? yx(e, t) : t;
}
var ao = {}, Dd;
function gx() {
  if (Dd) return ao;
  Dd = 1;
  var e = ya.parse, t = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  }, n = String.prototype.endsWith || function(a) {
    return a.length <= this.length && this.indexOf(a, this.length - a.length) !== -1;
  };
  function r(a) {
    var o = typeof a == "string" ? e(a) : a || {}, c = o.protocol, l = o.host, u = o.port;
    if (typeof l != "string" || !l || typeof c != "string" || (c = c.split(":", 1)[0], l = l.replace(/:\d*$/, ""), u = parseInt(u) || t[c] || 0, !s(l, u)))
      return "";
    var f = i("npm_config_" + c + "_proxy") || i(c + "_proxy") || i("npm_config_proxy") || i("all_proxy");
    return f && f.indexOf("://") === -1 && (f = c + "://" + f), f;
  }
  function s(a, o) {
    var c = (i("npm_config_no_proxy") || i("no_proxy")).toLowerCase();
    return c ? c === "*" ? !1 : c.split(/[,\s]/).every(function(l) {
      if (!l)
        return !0;
      var u = l.match(/^(.+):(\d+)$/), f = u ? u[1] : l, d = u ? parseInt(u[2]) : 0;
      return d && d !== o ? !0 : /^[.*]/.test(f) ? (f.charAt(0) === "*" && (f = f.slice(1)), !n.call(a, f)) : a !== f;
    }) : !0;
  }
  function i(a) {
    return process.env[a.toLowerCase()] || process.env[a.toUpperCase()] || "";
  }
  return ao.getProxyForUrl = r, ao;
}
var bx = gx();
const _x = /* @__PURE__ */ ir(bx);
var Zn = { exports: {} }, ea = { exports: {} }, ta = { exports: {} }, so, Fd;
function xx() {
  if (Fd) return so;
  Fd = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, s = r * 7, i = r * 365.25;
  so = function(u, f) {
    f = f || {};
    var d = typeof u;
    if (d === "string" && u.length > 0)
      return a(u);
    if (d === "number" && isFinite(u))
      return f.long ? c(u) : o(u);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(u)
    );
  };
  function a(u) {
    if (u = String(u), !(u.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        u
      );
      if (f) {
        var d = parseFloat(f[1]), b = (f[2] || "ms").toLowerCase();
        switch (b) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * i;
          case "weeks":
          case "week":
          case "w":
            return d * s;
          case "days":
          case "day":
          case "d":
            return d * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function o(u) {
    var f = Math.abs(u);
    return f >= r ? Math.round(u / r) + "d" : f >= n ? Math.round(u / n) + "h" : f >= t ? Math.round(u / t) + "m" : f >= e ? Math.round(u / e) + "s" : u + "ms";
  }
  function c(u) {
    var f = Math.abs(u);
    return f >= r ? l(u, f, r, "day") : f >= n ? l(u, f, n, "hour") : f >= t ? l(u, f, t, "minute") : f >= e ? l(u, f, e, "second") : u + " ms";
  }
  function l(u, f, d, b) {
    var v = f >= d * 1.5;
    return Math.round(u / d) + " " + b + (v ? "s" : "");
  }
  return so;
}
var io, Md;
function ym() {
  if (Md) return io;
  Md = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = l, r.disable = o, r.enable = i, r.enabled = c, r.humanize = xx(), r.destroy = u, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let d = 0;
      for (let b = 0; b < f.length; b++)
        d = (d << 5) - d + f.charCodeAt(b), d |= 0;
      return r.colors[Math.abs(d) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let d, b = null, v, y;
      function p(...h) {
        if (!p.enabled)
          return;
        const m = p, _ = Number(/* @__PURE__ */ new Date()), E = _ - (d || _);
        m.diff = E, m.prev = d, m.curr = _, d = _, h[0] = r.coerce(h[0]), typeof h[0] != "string" && h.unshift("%O");
        let x = 0;
        h[0] = h[0].replace(/%([a-zA-Z%])/g, (S, P) => {
          if (S === "%%")
            return "%";
          x++;
          const C = r.formatters[P];
          if (typeof C == "function") {
            const M = h[x];
            S = C.call(m, M), h.splice(x, 1), x--;
          }
          return S;
        }), r.formatArgs.call(m, h), (m.log || r.log).apply(m, h);
      }
      return p.namespace = f, p.useColors = r.useColors(), p.color = r.selectColor(f), p.extend = s, p.destroy = r.destroy, Object.defineProperty(p, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => b !== null ? b : (v !== r.namespaces && (v = r.namespaces, y = r.enabled(f)), y),
        set: (h) => {
          b = h;
        }
      }), typeof r.init == "function" && r.init(p), p;
    }
    function s(f, d) {
      const b = r(this.namespace + (typeof d > "u" ? ":" : d) + f);
      return b.log = this.log, b;
    }
    function i(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const d = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const b of d)
        b[0] === "-" ? r.skips.push(b.slice(1)) : r.names.push(b);
    }
    function a(f, d) {
      let b = 0, v = 0, y = -1, p = 0;
      for (; b < f.length; )
        if (v < d.length && (d[v] === f[b] || d[v] === "*"))
          d[v] === "*" ? (y = v, p = b, v++) : (b++, v++);
        else if (y !== -1)
          v = y + 1, p++, b = p;
        else
          return !1;
      for (; v < d.length && d[v] === "*"; )
        v++;
      return v === d.length;
    }
    function o() {
      const f = [
        ...r.names,
        ...r.skips.map((d) => "-" + d)
      ].join(",");
      return r.enable(""), f;
    }
    function c(f) {
      for (const d of r.skips)
        if (a(f, d))
          return !1;
      for (const d of r.names)
        if (a(f, d))
          return !0;
      return !1;
    }
    function l(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function u() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return io = e, io;
}
var Ud;
function wx() {
  return Ud || (Ud = 1, (function(e, t) {
    t.formatArgs = r, t.save = s, t.load = i, t.useColors = n, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const l = "color: " + this.color;
      c.splice(1, 0, l, "color: inherit");
      let u = 0, f = 0;
      c[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (u++, d === "%c" && (f = u));
      }), c.splice(f, 0, l);
    }
    t.log = console.debug || console.log || (() => {
    });
    function s(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function i() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = ym()(t);
    const { formatters: o } = e.exports;
    o.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (l) {
        return "[UnexpectedJSONParseError]: " + l.message;
      }
    };
  })(ta, ta.exports)), ta.exports;
}
var ra = { exports: {} }, oo, zd;
function Ex() {
  return zd || (zd = 1, oo = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), s = t.indexOf("--");
    return r !== -1 && (s === -1 || r < s);
  }), oo;
}
var co, Vd;
function $x() {
  if (Vd) return co;
  Vd = 1;
  const e = jm, t = vf, n = Ex(), { env: r } = process;
  let s;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? s = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (s = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? s = 1 : r.FORCE_COLOR === "false" ? s = 0 : s = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function i(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function a(c, l) {
    if (s === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (c && !l && s === void 0)
      return 0;
    const u = s || 0;
    if (r.TERM === "dumb")
      return u;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in r) || r.CI_NAME === "codeship" ? 1 : u;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const f = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : u;
  }
  function o(c) {
    const l = a(c, c && c.isTTY);
    return i(l);
  }
  return co = {
    supportsColor: o,
    stdout: i(a(!0, t.isatty(1))),
    stderr: i(a(!0, t.isatty(2)))
  }, co;
}
var Bd;
function Sx() {
  return Bd || (Bd = 1, (function(e, t) {
    const n = vf, r = jt;
    t.init = u, t.log = o, t.formatArgs = i, t.save = c, t.load = l, t.useColors = s, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = $x();
      d && (d.stderr || d).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, b) => {
      const v = b.substring(6).toLowerCase().replace(/_([a-z])/g, (p, h) => h.toUpperCase());
      let y = process.env[b];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), d[v] = y, d;
    }, {});
    function s() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function i(d) {
      const { namespace: b, useColors: v } = this;
      if (v) {
        const y = this.color, p = "\x1B[3" + (y < 8 ? y : "8;5;" + y), h = `  ${p};1m${b} \x1B[0m`;
        d[0] = h + d[0].split(`
`).join(`
` + h), d.push(p + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = a() + b + " " + d[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function o(...d) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function c(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function l() {
      return process.env.DEBUG;
    }
    function u(d) {
      d.inspectOpts = {};
      const b = Object.keys(t.inspectOpts);
      for (let v = 0; v < b.length; v++)
        d.inspectOpts[b[v]] = t.inspectOpts[b[v]];
    }
    e.exports = ym()(t);
    const { formatters: f } = e.exports;
    f.o = function(d) {
      return this.inspectOpts.colors = this.useColors, r.inspect(d, this.inspectOpts).split(`
`).map((b) => b.trim()).join(" ");
    }, f.O = function(d) {
      return this.inspectOpts.colors = this.useColors, r.inspect(d, this.inspectOpts);
    };
  })(ra, ra.exports)), ra.exports;
}
var Gd;
function Rx() {
  return Gd || (Gd = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? ea.exports = wx() : ea.exports = Sx()), ea.exports;
}
var uo, Hd;
function Tx() {
  if (Hd) return uo;
  Hd = 1;
  var e;
  return uo = function() {
    if (!e) {
      try {
        e = Rx()("follow-redirects");
      } catch {
      }
      typeof e != "function" && (e = function() {
      });
    }
    e.apply(null, arguments);
  }, uo;
}
var Kd;
function Px() {
  if (Kd) return Zn.exports;
  Kd = 1;
  var e = ya, t = e.URL, n = go, r = bo, s = Ce.Writable, i = km, a = Tx();
  (function() {
    var U = typeof process < "u", D = typeof window < "u" && typeof document < "u", J = H(Error.captureStackTrace);
    !U && (D || !J) && console.warn("The follow-redirects package should be excluded from browser builds.");
  })();
  var o = !1;
  try {
    i(new t(""));
  } catch (q) {
    o = q.code === "ERR_INVALID_URL";
  }
  var c = [
    "auth",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "hash"
  ], l = ["abort", "aborted", "connect", "error", "socket", "timeout"], u = /* @__PURE__ */ Object.create(null);
  l.forEach(function(q) {
    u[q] = function(U, D, J) {
      this._redirectable.emit(q, U, D, J);
    };
  });
  var f = C(
    "ERR_INVALID_URL",
    "Invalid URL",
    TypeError
  ), d = C(
    "ERR_FR_REDIRECTION_FAILURE",
    "Redirected request failed"
  ), b = C(
    "ERR_FR_TOO_MANY_REDIRECTS",
    "Maximum number of redirects exceeded",
    d
  ), v = C(
    "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
    "Request body larger than maxBodyLength limit"
  ), y = C(
    "ERR_STREAM_WRITE_AFTER_END",
    "write after end"
  ), p = s.prototype.destroy || _;
  function h(q, U) {
    s.call(this), this._sanitizeOptions(q), this._options = q, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], U && this.on("response", U);
    var D = this;
    this._onNativeResponse = function(J) {
      try {
        D._processResponse(J);
      } catch (A) {
        D.emit("error", A instanceof d ? A : new d({ cause: A }));
      }
    }, this._performRequest();
  }
  h.prototype = Object.create(s.prototype), h.prototype.abort = function() {
    M(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
  }, h.prototype.destroy = function(q) {
    return M(this._currentRequest, q), p.call(this, q), this;
  }, h.prototype.write = function(q, U, D) {
    if (this._ending)
      throw new y();
    if (!G(q) && !F(q))
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    if (H(U) && (D = U, U = null), q.length === 0) {
      D && D();
      return;
    }
    this._requestBodyLength + q.length <= this._options.maxBodyLength ? (this._requestBodyLength += q.length, this._requestBodyBuffers.push({ data: q, encoding: U }), this._currentRequest.write(q, U, D)) : (this.emit("error", new v()), this.abort());
  }, h.prototype.end = function(q, U, D) {
    if (H(q) ? (D = q, q = U = null) : H(U) && (D = U, U = null), !q)
      this._ended = this._ending = !0, this._currentRequest.end(null, null, D);
    else {
      var J = this, A = this._currentRequest;
      this.write(q, U, function() {
        J._ended = !0, A.end(null, null, D);
      }), this._ending = !0;
    }
  }, h.prototype.setHeader = function(q, U) {
    this._options.headers[q] = U, this._currentRequest.setHeader(q, U);
  }, h.prototype.removeHeader = function(q) {
    delete this._options.headers[q], this._currentRequest.removeHeader(q);
  }, h.prototype.setTimeout = function(q, U) {
    var D = this;
    function J(j) {
      j.setTimeout(q), j.removeListener("timeout", j.destroy), j.addListener("timeout", j.destroy);
    }
    function A(j) {
      D._timeout && clearTimeout(D._timeout), D._timeout = setTimeout(function() {
        D.emit("timeout"), R();
      }, q), J(j);
    }
    function R() {
      D._timeout && (clearTimeout(D._timeout), D._timeout = null), D.removeListener("abort", R), D.removeListener("error", R), D.removeListener("response", R), D.removeListener("close", R), U && D.removeListener("timeout", U), D.socket || D._currentRequest.removeListener("socket", A);
    }
    return U && this.on("timeout", U), this.socket ? A(this.socket) : this._currentRequest.once("socket", A), this.on("socket", J), this.on("abort", R), this.on("error", R), this.on("response", R), this.on("close", R), this;
  }, [
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
  ].forEach(function(q) {
    h.prototype[q] = function(U, D) {
      return this._currentRequest[q](U, D);
    };
  }), ["aborted", "connection", "socket"].forEach(function(q) {
    Object.defineProperty(h.prototype, q, {
      get: function() {
        return this._currentRequest[q];
      }
    });
  }), h.prototype._sanitizeOptions = function(q) {
    if (q.headers || (q.headers = {}), q.host && (q.hostname || (q.hostname = q.host), delete q.host), !q.pathname && q.path) {
      var U = q.path.indexOf("?");
      U < 0 ? q.pathname = q.path : (q.pathname = q.path.substring(0, U), q.search = q.path.substring(U));
    }
  }, h.prototype._performRequest = function() {
    var q = this._options.protocol, U = this._options.nativeProtocols[q];
    if (!U)
      throw new TypeError("Unsupported protocol " + q);
    if (this._options.agents) {
      var D = q.slice(0, -1);
      this._options.agent = this._options.agents[D];
    }
    var J = this._currentRequest = U.request(this._options, this._onNativeResponse);
    J._redirectable = this;
    for (var A of l)
      J.on(A, u[A]);
    if (this._currentUrl = /^\//.test(this._options.path) ? e.format(this._options) : (
      // When making a request to a proxy, […]
      // a client MUST send the target URI in absolute-form […].
      this._options.path
    ), this._isRedirect) {
      var R = 0, j = this, O = this._requestBodyBuffers;
      (function g($) {
        if (J === j._currentRequest)
          if ($)
            j.emit("error", $);
          else if (R < O.length) {
            var k = O[R++];
            J.finished || J.write(k.data, k.encoding, g);
          } else j._ended && J.end();
      })();
    }
  }, h.prototype._processResponse = function(q) {
    var U = q.statusCode;
    this._options.trackRedirects && this._redirects.push({
      url: this._currentUrl,
      headers: q.headers,
      statusCode: U
    });
    var D = q.headers.location;
    if (!D || this._options.followRedirects === !1 || U < 300 || U >= 400) {
      q.responseUrl = this._currentUrl, q.redirects = this._redirects, this.emit("response", q), this._requestBodyBuffers = [];
      return;
    }
    if (M(this._currentRequest), q.destroy(), ++this._redirectCount > this._options.maxRedirects)
      throw new b();
    var J, A = this._options.beforeRedirect;
    A && (J = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: q.req.getHeader("host")
    }, this._options.headers));
    var R = this._options.method;
    ((U === 301 || U === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    U === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], P(/^content-/i, this._options.headers));
    var j = P(/^host$/i, this._options.headers), O = E(this._currentUrl), g = j || O.host, $ = /^\w+:/.test(D) ? this._currentUrl : e.format(Object.assign(O, { host: g })), k = x(D, $);
    if (a("redirecting to", k.href), this._isRedirect = !0, S(k, this._options), (k.protocol !== O.protocol && k.protocol !== "https:" || k.host !== g && !L(k.host, g)) && P(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers), H(A)) {
      var B = {
        headers: q.headers,
        statusCode: U
      }, W = {
        url: $,
        method: R,
        headers: J
      };
      A(this._options, B, W), this._sanitizeOptions(this._options);
    }
    this._performRequest();
  };
  function m(q) {
    var U = {
      maxRedirects: 21,
      maxBodyLength: 10485760
    }, D = {};
    return Object.keys(q).forEach(function(J) {
      var A = J + ":", R = D[A] = q[J], j = U[J] = Object.create(R);
      function O($, k, B) {
        return K($) ? $ = S($) : G($) ? $ = S(E($)) : (B = k, k = w($), $ = { protocol: A }), H(k) && (B = k, k = null), k = Object.assign({
          maxRedirects: U.maxRedirects,
          maxBodyLength: U.maxBodyLength
        }, $, k), k.nativeProtocols = D, !G(k.host) && !G(k.hostname) && (k.hostname = "::1"), i.equal(k.protocol, A, "protocol mismatch"), a("options", k), new h(k, B);
      }
      function g($, k, B) {
        var W = j.request($, k, B);
        return W.end(), W;
      }
      Object.defineProperties(j, {
        request: { value: O, configurable: !0, enumerable: !0, writable: !0 },
        get: { value: g, configurable: !0, enumerable: !0, writable: !0 }
      });
    }), U;
  }
  function _() {
  }
  function E(q) {
    var U;
    if (o)
      U = new t(q);
    else if (U = w(e.parse(q)), !G(U.protocol))
      throw new f({ input: q });
    return U;
  }
  function x(q, U) {
    return o ? new t(q, U) : E(e.resolve(U, q));
  }
  function w(q) {
    if (/^\[/.test(q.hostname) && !/^\[[:0-9a-f]+\]$/i.test(q.hostname))
      throw new f({ input: q.href || q });
    if (/^\[/.test(q.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(q.host))
      throw new f({ input: q.href || q });
    return q;
  }
  function S(q, U) {
    var D = U || {};
    for (var J of c)
      D[J] = q[J];
    return D.hostname.startsWith("[") && (D.hostname = D.hostname.slice(1, -1)), D.port !== "" && (D.port = Number(D.port)), D.path = D.search ? D.pathname + D.search : D.pathname, D;
  }
  function P(q, U) {
    var D;
    for (var J in U)
      q.test(J) && (D = U[J], delete U[J]);
    return D === null || typeof D > "u" ? void 0 : String(D).trim();
  }
  function C(q, U, D) {
    function J(A) {
      H(Error.captureStackTrace) && Error.captureStackTrace(this, this.constructor), Object.assign(this, A || {}), this.code = q, this.message = this.cause ? U + ": " + this.cause.message : U;
    }
    return J.prototype = new (D || Error)(), Object.defineProperties(J.prototype, {
      constructor: {
        value: J,
        enumerable: !1
      },
      name: {
        value: "Error [" + q + "]",
        enumerable: !1
      }
    }), J;
  }
  function M(q, U) {
    for (var D of l)
      q.removeListener(D, u[D]);
    q.on("error", _), q.destroy(U);
  }
  function L(q, U) {
    i(G(q) && G(U));
    var D = q.length - U.length - 1;
    return D > 0 && q[D] === "." && q.endsWith(U);
  }
  function G(q) {
    return typeof q == "string" || q instanceof String;
  }
  function H(q) {
    return typeof q == "function";
  }
  function F(q) {
    return typeof q == "object" && "length" in q;
  }
  function K(q) {
    return t && q instanceof t;
  }
  return Zn.exports = m({ http: n, https: r }), Zn.exports.wrap = m, Zn.exports;
}
var Ox = Px();
const Nx = /* @__PURE__ */ ir(Ox), ma = "1.13.2";
function gm(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
const kx = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function jx(e, t, n) {
  const r = n && n.Blob || xe.classes.Blob, s = gm(e);
  if (t === void 0 && r && (t = !0), s === "data") {
    e = s.length ? e.slice(s.length + 1) : e;
    const i = kx.exec(e);
    if (!i)
      throw new te("Invalid URL", te.ERR_INVALID_URL);
    const a = i[1], o = i[2], c = i[3], l = Buffer.from(decodeURIComponent(c), o ? "base64" : "utf8");
    if (t) {
      if (!r)
        throw new te("Blob is not supported", te.ERR_NOT_SUPPORT);
      return new r([l], { type: a });
    }
    return l;
  }
  throw new te("Unsupported protocol " + s, te.ERR_NOT_SUPPORT);
}
const lo = /* @__PURE__ */ Symbol("internals");
class Wd extends Ce.Transform {
  constructor(t) {
    t = V.toFlatObject(t, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (r, s) => !V.isUndefined(s[r])), super({
      readableHighWaterMark: t.chunkSize
    });
    const n = this[lo] = {
      timeWindow: t.timeWindow,
      chunkSize: t.chunkSize,
      maxRate: t.maxRate,
      minChunkSize: t.minChunkSize,
      bytesSeen: 0,
      isCaptured: !1,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (r) => {
      r === "progress" && (n.isCaptured || (n.isCaptured = !0));
    });
  }
  _read(t) {
    const n = this[lo];
    return n.onReadCallback && n.onReadCallback(), super._read(t);
  }
  _transform(t, n, r) {
    const s = this[lo], i = s.maxRate, a = this.readableHighWaterMark, o = s.timeWindow, c = 1e3 / o, l = i / c, u = s.minChunkSize !== !1 ? Math.max(s.minChunkSize, l * 0.01) : 0, f = (b, v) => {
      const y = Buffer.byteLength(b);
      s.bytesSeen += y, s.bytes += y, s.isCaptured && this.emit("progress", s.bytesSeen), this.push(b) ? process.nextTick(v) : s.onReadCallback = () => {
        s.onReadCallback = null, process.nextTick(v);
      };
    }, d = (b, v) => {
      const y = Buffer.byteLength(b);
      let p = null, h = a, m, _ = 0;
      if (i) {
        const E = Date.now();
        (!s.ts || (_ = E - s.ts) >= o) && (s.ts = E, m = l - s.bytes, s.bytes = m < 0 ? -m : 0, _ = 0), m = l - s.bytes;
      }
      if (i) {
        if (m <= 0)
          return setTimeout(() => {
            v(null, b);
          }, o - _);
        m < h && (h = m);
      }
      h && y > h && y - h > u && (p = b.subarray(h), b = b.subarray(0, h)), f(b, p ? () => {
        process.nextTick(v, null, p);
      } : v);
    };
    d(t, function b(v, y) {
      if (v)
        return r(v);
      y ? d(y, b) : r(null);
    });
  }
}
const { asyncIterator: Jd } = Symbol, bm = async function* (e) {
  e.stream ? yield* e.stream() : e.arrayBuffer ? yield await e.arrayBuffer() : e[Jd] ? yield* e[Jd]() : yield e;
}, Ax = xe.ALPHABET.ALPHA_DIGIT + "-_", ar = typeof TextEncoder == "function" ? new TextEncoder() : new jt.TextEncoder(), Tt = `\r
`, Ix = ar.encode(Tt), Cx = 2;
class qx {
  constructor(t, n) {
    const { escapeName: r } = this.constructor, s = V.isString(n);
    let i = `Content-Disposition: form-data; name="${r(t)}"${!s && n.name ? `; filename="${r(n.name)}"` : ""}${Tt}`;
    s ? n = ar.encode(String(n).replace(/\r?\n|\r\n?/g, Tt)) : i += `Content-Type: ${n.type || "application/octet-stream"}${Tt}`, this.headers = ar.encode(i + Tt), this.contentLength = s ? n.byteLength : n.size, this.size = this.headers.byteLength + this.contentLength + Cx, this.name = t, this.value = n;
  }
  async *encode() {
    yield this.headers;
    const { value: t } = this;
    V.isTypedArray(t) ? yield t : yield* bm(t), yield Ix;
  }
  static escapeName(t) {
    return String(t).replace(/[\r\n"]/g, (n) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[n]);
  }
}
const Lx = (e, t, n) => {
  const {
    tag: r = "form-data-boundary",
    size: s = 25,
    boundary: i = r + "-" + xe.generateString(s, Ax)
  } = n || {};
  if (!V.isFormData(e))
    throw TypeError("FormData instance required");
  if (i.length < 1 || i.length > 70)
    throw Error("boundary must be 10-70 characters long");
  const a = ar.encode("--" + i + Tt), o = ar.encode("--" + i + "--" + Tt);
  let c = o.byteLength;
  const l = Array.from(e.entries()).map(([f, d]) => {
    const b = new qx(f, d);
    return c += b.size, b;
  });
  c += a.byteLength * l.length, c = V.toFiniteNumber(c);
  const u = {
    "Content-Type": `multipart/form-data; boundary=${i}`
  };
  return Number.isFinite(c) && (u["Content-Length"] = c), t && t(u), Om.from((async function* () {
    for (const f of l)
      yield a, yield* f.encode();
    yield o;
  })());
};
class Dx extends Ce.Transform {
  __transform(t, n, r) {
    this.push(t), r();
  }
  _transform(t, n, r) {
    if (t.length !== 0 && (this._transform = this.__transform, t[0] !== 120)) {
      const s = Buffer.alloc(2);
      s[0] = 120, s[1] = 156, this.push(s, n);
    }
    this.__transform(t, n, r);
  }
}
const Fx = (e, t) => V.isAsyncFn(e) ? function(...n) {
  const r = n.pop();
  e.apply(this, n).then((s) => {
    try {
      t ? r(null, ...t(s)) : r(null, s);
    } catch (i) {
      r(i);
    }
  }, r);
} : e;
function Mx(e, t) {
  e = e || 10;
  const n = new Array(e), r = new Array(e);
  let s = 0, i = 0, a;
  return t = t !== void 0 ? t : 1e3, function(c) {
    const l = Date.now(), u = r[i];
    a || (a = l), n[s] = c, r[s] = l;
    let f = i, d = 0;
    for (; f !== s; )
      d += n[f++], f = f % e;
    if (s = (s + 1) % e, s === i && (i = (i + 1) % e), l - a < t)
      return;
    const b = u && l - u;
    return b ? Math.round(d * 1e3 / b) : void 0;
  };
}
function Ux(e, t) {
  let n = 0, r = 1e3 / t, s, i;
  const a = (l, u = Date.now()) => {
    n = u, s = null, i && (clearTimeout(i), i = null), e(...l);
  };
  return [(...l) => {
    const u = Date.now(), f = u - n;
    f >= r ? a(l, u) : (s = l, i || (i = setTimeout(() => {
      i = null, a(s);
    }, r - f)));
  }, () => s && a(s)];
}
const Gt = (e, t, n = 3) => {
  let r = 0;
  const s = Mx(50, 250);
  return Ux((i) => {
    const a = i.loaded, o = i.lengthComputable ? i.total : void 0, c = a - r, l = s(c), u = a <= o;
    r = a;
    const f = {
      loaded: a,
      total: o,
      progress: o ? a / o : void 0,
      bytes: c,
      rate: l || void 0,
      estimated: l && o && u ? (o - a) / l : void 0,
      event: i,
      lengthComputable: o != null,
      [t ? "download" : "upload"]: !0
    };
    e(f);
  }, n);
}, ha = (e, t) => {
  const n = e != null;
  return [(r) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: r
  }), t[1]];
}, va = (e) => (...t) => V.asap(() => e(...t));
function zx(e) {
  if (!e || typeof e != "string" || !e.startsWith("data:")) return 0;
  const t = e.indexOf(",");
  if (t < 0) return 0;
  const n = e.slice(5, t), r = e.slice(t + 1);
  if (/;base64/i.test(n)) {
    let i = r.length;
    const a = r.length;
    for (let d = 0; d < a; d++)
      if (r.charCodeAt(d) === 37 && d + 2 < a) {
        const b = r.charCodeAt(d + 1), v = r.charCodeAt(d + 2);
        (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102) && (v >= 48 && v <= 57 || v >= 65 && v <= 70 || v >= 97 && v <= 102) && (i -= 2, d += 2);
      }
    let o = 0, c = a - 1;
    const l = (d) => d >= 2 && r.charCodeAt(d - 2) === 37 && // '%'
    r.charCodeAt(d - 1) === 51 && // '3'
    (r.charCodeAt(d) === 68 || r.charCodeAt(d) === 100);
    c >= 0 && (r.charCodeAt(c) === 61 ? (o++, c--) : l(c) && (o++, c -= 3)), o === 1 && c >= 0 && (r.charCodeAt(c) === 61 || l(c)) && o++;
    const f = Math.floor(i / 4) * 3 - (o || 0);
    return f > 0 ? f : 0;
  }
  return Buffer.byteLength(r, "utf8");
}
const Xd = {
  flush: mt.constants.Z_SYNC_FLUSH,
  finishFlush: mt.constants.Z_SYNC_FLUSH
}, Vx = {
  flush: mt.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: mt.constants.BROTLI_OPERATION_FLUSH
}, Yd = V.isFunction(mt.createBrotliDecompress), { http: Bx, https: Gx } = Nx, Hx = /https:?/, Qd = xe.protocols.map((e) => e + ":"), Zd = (e, [t, n]) => (e.on("end", n).on("error", n), t);
class Kx {
  constructor() {
    this.sessions = /* @__PURE__ */ Object.create(null);
  }
  getSession(t, n) {
    n = Object.assign({
      sessionTimeout: 1e3
    }, n);
    let r = this.sessions[t];
    if (r) {
      let u = r.length;
      for (let f = 0; f < u; f++) {
        const [d, b] = r[f];
        if (!d.destroyed && !d.closed && jt.isDeepStrictEqual(b, n))
          return d;
      }
    }
    const s = hf.connect(t, n);
    let i;
    const a = () => {
      if (i)
        return;
      i = !0;
      let u = r, f = u.length, d = f;
      for (; d--; )
        if (u[d][0] === s) {
          f === 1 ? delete this.sessions[t] : u.splice(d, 1);
          return;
        }
    }, o = s.request, { sessionTimeout: c } = n;
    if (c != null) {
      let u, f = 0;
      s.request = function() {
        const d = o.apply(this, arguments);
        return f++, u && (clearTimeout(u), u = null), d.once("close", () => {
          --f || (u = setTimeout(() => {
            u = null, a();
          }, c));
        }), d;
      };
    }
    s.once("close", a);
    let l = [
      s,
      n
    ];
    return r ? r.push(l) : r = this.sessions[t] = [l], s;
  }
}
const Wx = new Kx();
function Jx(e, t) {
  e.beforeRedirects.proxy && e.beforeRedirects.proxy(e), e.beforeRedirects.config && e.beforeRedirects.config(e, t);
}
function _m(e, t, n) {
  let r = t;
  if (!r && r !== !1) {
    const s = _x.getProxyForUrl(n);
    s && (r = new URL(s));
  }
  if (r) {
    if (r.username && (r.auth = (r.username || "") + ":" + (r.password || "")), r.auth) {
      (r.auth.username || r.auth.password) && (r.auth = (r.auth.username || "") + ":" + (r.auth.password || ""));
      const i = Buffer.from(r.auth, "utf8").toString("base64");
      e.headers["Proxy-Authorization"] = "Basic " + i;
    }
    e.headers.host = e.hostname + (e.port ? ":" + e.port : "");
    const s = r.hostname || r.host;
    e.hostname = s, e.host = s, e.port = r.port, e.path = n, r.protocol && (e.protocol = r.protocol.includes(":") ? r.protocol : `${r.protocol}:`);
  }
  e.beforeRedirects.proxy = function(i) {
    _m(i, t, i.href);
  };
}
const Xx = typeof process < "u" && V.kindOf(process) === "process", Yx = (e) => new Promise((t, n) => {
  let r, s;
  const i = (c, l) => {
    s || (s = !0, r && r(c, l));
  }, a = (c) => {
    i(c), t(c);
  }, o = (c) => {
    i(c, !0), n(c);
  };
  e(a, o, (c) => r = c).catch(o);
}), Qx = ({ address: e, family: t }) => {
  if (!V.isString(e))
    throw TypeError("address must be a string");
  return {
    address: e,
    family: t || (e.indexOf(".") < 0 ? 6 : 4)
  };
}, ef = (e, t) => Qx(V.isObject(e) ? e : { address: e, family: t }), Zx = {
  request(e, t) {
    const n = e.protocol + "//" + e.hostname + ":" + (e.port || 80), { http2Options: r, headers: s } = e, i = Wx.getSession(n, r), {
      HTTP2_HEADER_SCHEME: a,
      HTTP2_HEADER_METHOD: o,
      HTTP2_HEADER_PATH: c,
      HTTP2_HEADER_STATUS: l
    } = hf.constants, u = {
      [a]: e.protocol.replace(":", ""),
      [o]: e.method,
      [c]: e.path
    };
    V.forEach(s, (d, b) => {
      b.charAt(0) !== ":" && (u[b] = d);
    });
    const f = i.request(u);
    return f.once("response", (d) => {
      const b = f;
      d = Object.assign({}, d);
      const v = d[l];
      delete d[l], b.headers = d, b.statusCode = +v, t(b);
    }), f;
  }
}, e0 = Xx && function(t) {
  return Yx(async function(r, s, i) {
    let { data: a, lookup: o, family: c, httpVersion: l = 1, http2Options: u } = t;
    const { responseType: f, responseEncoding: d } = t, b = t.method.toUpperCase();
    let v, y = !1, p;
    if (l = +l, Number.isNaN(l))
      throw TypeError(`Invalid protocol version: '${t.httpVersion}' is not a number`);
    if (l !== 1 && l !== 2)
      throw TypeError(`Unsupported protocol version '${l}'`);
    const h = l === 2;
    if (o) {
      const A = Fx(o, (R) => V.isArray(R) ? R : [R]);
      o = (R, j, O) => {
        A(R, j, (g, $, k) => {
          if (g)
            return O(g);
          const B = V.isArray($) ? $.map((W) => ef(W)) : [ef($, k)];
          j.all ? O(g, B) : O(g, B[0].address, B[0].family);
        });
      };
    }
    const m = new Am();
    function _(A) {
      try {
        m.emit("abort", !A || A.type ? new ht(null, t, p) : A);
      } catch (R) {
        console.warn("emit error", R);
      }
    }
    m.once("abort", s);
    const E = () => {
      t.cancelToken && t.cancelToken.unsubscribe(_), t.signal && t.signal.removeEventListener("abort", _), m.removeAllListeners();
    };
    (t.cancelToken || t.signal) && (t.cancelToken && t.cancelToken.subscribe(_), t.signal && (t.signal.aborted ? _() : t.signal.addEventListener("abort", _))), i((A, R) => {
      if (v = !0, R) {
        y = !0, E();
        return;
      }
      const { data: j } = A;
      if (j instanceof Ce.Readable || j instanceof Ce.Duplex) {
        const O = Ce.finished(j, () => {
          O(), E();
        });
      } else
        E();
    });
    const x = zo(t.baseURL, t.url, t.allowAbsoluteUrls), w = new URL(x, xe.hasBrowserEnv ? xe.origin : void 0), S = w.protocol || Qd[0];
    if (S === "data:") {
      if (t.maxContentLength > -1) {
        const R = String(t.url || x || "");
        if (zx(R) > t.maxContentLength)
          return s(new te(
            "maxContentLength size of " + t.maxContentLength + " exceeded",
            te.ERR_BAD_RESPONSE,
            t
          ));
      }
      let A;
      if (b !== "GET")
        return zt(r, s, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: t
        });
      try {
        A = jx(t.url, f === "blob", {
          Blob: t.env && t.env.Blob
        });
      } catch (R) {
        throw te.from(R, te.ERR_BAD_REQUEST, t);
      }
      return f === "text" ? (A = A.toString(d), (!d || d === "utf8") && (A = V.stripBOM(A))) : f === "stream" && (A = Ce.Readable.from(A)), zt(r, s, {
        data: A,
        status: 200,
        statusText: "OK",
        headers: new Re(),
        config: t
      });
    }
    if (Qd.indexOf(S) === -1)
      return s(new te(
        "Unsupported protocol " + S,
        te.ERR_BAD_REQUEST,
        t
      ));
    const P = Re.from(t.headers).normalize();
    P.set("User-Agent", "axios/" + ma, !1);
    const { onUploadProgress: C, onDownloadProgress: M } = t, L = t.maxRate;
    let G, H;
    if (V.isSpecCompliantForm(a)) {
      const A = P.getContentType(/boundary=([-_\w\d]{10,70})/i);
      a = Lx(a, (R) => {
        P.set(R);
      }, {
        tag: `axios-${ma}-boundary`,
        boundary: A && A[1] || void 0
      });
    } else if (V.isFormData(a) && V.isFunction(a.getHeaders)) {
      if (P.set(a.getHeaders()), !P.hasContentLength())
        try {
          const A = await jt.promisify(a.getLength).call(a);
          Number.isFinite(A) && A >= 0 && P.setContentLength(A);
        } catch {
        }
    } else if (V.isBlob(a) || V.isFile(a))
      a.size && P.setContentType(a.type || "application/octet-stream"), P.setContentLength(a.size || 0), a = Ce.Readable.from(bm(a));
    else if (a && !V.isStream(a)) {
      if (!Buffer.isBuffer(a)) if (V.isArrayBuffer(a))
        a = Buffer.from(new Uint8Array(a));
      else if (V.isString(a))
        a = Buffer.from(a, "utf-8");
      else
        return s(new te(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          te.ERR_BAD_REQUEST,
          t
        ));
      if (P.setContentLength(a.length, !1), t.maxBodyLength > -1 && a.length > t.maxBodyLength)
        return s(new te(
          "Request body larger than maxBodyLength limit",
          te.ERR_BAD_REQUEST,
          t
        ));
    }
    const F = V.toFiniteNumber(P.getContentLength());
    V.isArray(L) ? (G = L[0], H = L[1]) : G = H = L, a && (C || G) && (V.isStream(a) || (a = Ce.Readable.from(a, { objectMode: !1 })), a = Ce.pipeline([a, new Wd({
      maxRate: V.toFiniteNumber(G)
    })], V.noop), C && a.on("progress", Zd(
      a,
      ha(
        F,
        Gt(va(C), !1, 3)
      )
    )));
    let K;
    if (t.auth) {
      const A = t.auth.username || "", R = t.auth.password || "";
      K = A + ":" + R;
    }
    if (!K && w.username) {
      const A = w.username, R = w.password;
      K = A + ":" + R;
    }
    K && P.delete("authorization");
    let q;
    try {
      q = Fo(
        w.pathname + w.search,
        t.params,
        t.paramsSerializer
      ).replace(/^\?/, "");
    } catch (A) {
      const R = new Error(A.message);
      return R.config = t, R.url = t.url, R.exists = !0, s(R);
    }
    P.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (Yd ? ", br" : ""),
      !1
    );
    const U = {
      path: q,
      method: b,
      headers: P.toJSON(),
      agents: { http: t.httpAgent, https: t.httpsAgent },
      auth: K,
      protocol: S,
      family: c,
      beforeRedirect: Jx,
      beforeRedirects: {},
      http2Options: u
    };
    !V.isUndefined(o) && (U.lookup = o), t.socketPath ? U.socketPath = t.socketPath : (U.hostname = w.hostname.startsWith("[") ? w.hostname.slice(1, -1) : w.hostname, U.port = w.port, _m(U, t.proxy, S + "//" + w.hostname + (w.port ? ":" + w.port : "") + U.path));
    let D;
    const J = Hx.test(U.protocol);
    if (U.agent = J ? t.httpsAgent : t.httpAgent, h ? D = Zx : t.transport ? D = t.transport : t.maxRedirects === 0 ? D = J ? bo : go : (t.maxRedirects && (U.maxRedirects = t.maxRedirects), t.beforeRedirect && (U.beforeRedirects.config = t.beforeRedirect), D = J ? Gx : Bx), t.maxBodyLength > -1 ? U.maxBodyLength = t.maxBodyLength : U.maxBodyLength = 1 / 0, t.insecureHTTPParser && (U.insecureHTTPParser = t.insecureHTTPParser), p = D.request(U, function(R) {
      if (p.destroyed) return;
      const j = [R], O = V.toFiniteNumber(R.headers["content-length"]);
      if (M || H) {
        const B = new Wd({
          maxRate: V.toFiniteNumber(H)
        });
        M && B.on("progress", Zd(
          B,
          ha(
            O,
            Gt(va(M), !0, 3)
          )
        )), j.push(B);
      }
      let g = R;
      const $ = R.req || p;
      if (t.decompress !== !1 && R.headers["content-encoding"])
        switch ((b === "HEAD" || R.statusCode === 204) && delete R.headers["content-encoding"], (R.headers["content-encoding"] || "").toLowerCase()) {
          /*eslint default-case:0*/
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            j.push(mt.createUnzip(Xd)), delete R.headers["content-encoding"];
            break;
          case "deflate":
            j.push(new Dx()), j.push(mt.createUnzip(Xd)), delete R.headers["content-encoding"];
            break;
          case "br":
            Yd && (j.push(mt.createBrotliDecompress(Vx)), delete R.headers["content-encoding"]);
        }
      g = j.length > 1 ? Ce.pipeline(j, V.noop) : j[0];
      const k = {
        status: R.statusCode,
        statusText: R.statusMessage,
        headers: new Re(R.headers),
        config: t,
        request: $
      };
      if (f === "stream")
        k.data = g, zt(r, s, k);
      else {
        const B = [];
        let W = 0;
        g.on("data", function(Y) {
          B.push(Y), W += Y.length, t.maxContentLength > -1 && W > t.maxContentLength && (y = !0, g.destroy(), _(new te(
            "maxContentLength size of " + t.maxContentLength + " exceeded",
            te.ERR_BAD_RESPONSE,
            t,
            $
          )));
        }), g.on("aborted", function() {
          if (y)
            return;
          const Y = new te(
            "stream has been aborted",
            te.ERR_BAD_RESPONSE,
            t,
            $
          );
          g.destroy(Y), s(Y);
        }), g.on("error", function(Y) {
          p.destroyed || s(te.from(Y, null, t, $));
        }), g.on("end", function() {
          try {
            let Y = B.length === 1 ? B[0] : Buffer.concat(B);
            f !== "arraybuffer" && (Y = Y.toString(d), (!d || d === "utf8") && (Y = V.stripBOM(Y))), k.data = Y;
          } catch (Y) {
            return s(te.from(Y, null, t, k.request, k));
          }
          zt(r, s, k);
        });
      }
      m.once("abort", (B) => {
        g.destroyed || (g.emit("error", B), g.destroy());
      });
    }), m.once("abort", (A) => {
      p.close ? p.close() : p.destroy(A);
    }), p.on("error", function(R) {
      s(te.from(R, null, t, p));
    }), p.on("socket", function(R) {
      R.setKeepAlive(!0, 1e3 * 60);
    }), t.timeout) {
      const A = parseInt(t.timeout, 10);
      if (Number.isNaN(A)) {
        _(new te(
          "error trying to parse `config.timeout` to int",
          te.ERR_BAD_OPTION_VALUE,
          t,
          p
        ));
        return;
      }
      p.setTimeout(A, function() {
        if (v) return;
        let j = t.timeout ? "timeout of " + t.timeout + "ms exceeded" : "timeout exceeded";
        const O = t.transitional || Mo;
        t.timeoutErrorMessage && (j = t.timeoutErrorMessage), _(new te(
          j,
          O.clarifyTimeoutError ? te.ETIMEDOUT : te.ECONNABORTED,
          t,
          p
        ));
      });
    } else
      p.setTimeout(0);
    if (V.isStream(a)) {
      let A = !1, R = !1;
      a.on("end", () => {
        A = !0;
      }), a.once("error", (j) => {
        R = !0, p.destroy(j);
      }), a.on("close", () => {
        !A && !R && _(new ht("Request stream has been aborted", t, p));
      }), a.pipe(p);
    } else
      a && p.write(a), p.end();
  });
}, t0 = xe.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (n) => (n = new URL(n, xe.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
  new URL(xe.origin),
  xe.navigator && /(msie|trident)/i.test(xe.navigator.userAgent)
) : () => !0, r0 = xe.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, r, s, i, a) {
      if (typeof document > "u") return;
      const o = [`${e}=${encodeURIComponent(t)}`];
      V.isNumber(n) && o.push(`expires=${new Date(n).toUTCString()}`), V.isString(r) && o.push(`path=${r}`), V.isString(s) && o.push(`domain=${s}`), i === !0 && o.push("secure"), V.isString(a) && o.push(`SameSite=${a}`), document.cookie = o.join("; ");
    },
    read(e) {
      if (typeof document > "u") return null;
      const t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
      return t ? decodeURIComponent(t[1]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
), tf = (e) => e instanceof Re ? { ...e } : e;
function kt(e, t) {
  t = t || {};
  const n = {};
  function r(l, u, f, d) {
    return V.isPlainObject(l) && V.isPlainObject(u) ? V.merge.call({ caseless: d }, l, u) : V.isPlainObject(u) ? V.merge({}, u) : V.isArray(u) ? u.slice() : u;
  }
  function s(l, u, f, d) {
    if (V.isUndefined(u)) {
      if (!V.isUndefined(l))
        return r(void 0, l, f, d);
    } else return r(l, u, f, d);
  }
  function i(l, u) {
    if (!V.isUndefined(u))
      return r(void 0, u);
  }
  function a(l, u) {
    if (V.isUndefined(u)) {
      if (!V.isUndefined(l))
        return r(void 0, l);
    } else return r(void 0, u);
  }
  function o(l, u, f) {
    if (f in t)
      return r(l, u);
    if (f in e)
      return r(void 0, l);
  }
  const c = {
    url: i,
    method: i,
    data: i,
    baseURL: a,
    transformRequest: a,
    transformResponse: a,
    paramsSerializer: a,
    timeout: a,
    timeoutMessage: a,
    withCredentials: a,
    withXSRFToken: a,
    adapter: a,
    responseType: a,
    xsrfCookieName: a,
    xsrfHeaderName: a,
    onUploadProgress: a,
    onDownloadProgress: a,
    decompress: a,
    maxContentLength: a,
    maxBodyLength: a,
    beforeRedirect: a,
    transport: a,
    httpAgent: a,
    httpsAgent: a,
    cancelToken: a,
    socketPath: a,
    responseEncoding: a,
    validateStatus: o,
    headers: (l, u, f) => s(tf(l), tf(u), f, !0)
  };
  return V.forEach(Object.keys({ ...e, ...t }), function(u) {
    const f = c[u] || s, d = f(e[u], t[u], u);
    V.isUndefined(d) && f !== o || (n[u] = d);
  }), n;
}
const xm = (e) => {
  const t = kt({}, e);
  let { data: n, withXSRFToken: r, xsrfHeaderName: s, xsrfCookieName: i, headers: a, auth: o } = t;
  if (t.headers = a = Re.from(a), t.url = Fo(zo(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), o && a.set(
    "Authorization",
    "Basic " + btoa((o.username || "") + ":" + (o.password ? unescape(encodeURIComponent(o.password)) : ""))
  ), V.isFormData(n)) {
    if (xe.hasStandardBrowserEnv || xe.hasStandardBrowserWebWorkerEnv)
      a.setContentType(void 0);
    else if (V.isFunction(n.getHeaders)) {
      const c = n.getHeaders(), l = ["content-type", "content-length"];
      Object.entries(c).forEach(([u, f]) => {
        l.includes(u.toLowerCase()) && a.set(u, f);
      });
    }
  }
  if (xe.hasStandardBrowserEnv && (r && V.isFunction(r) && (r = r(t)), r || r !== !1 && t0(t.url))) {
    const c = s && i && r0.read(i);
    c && a.set(s, c);
  }
  return t;
}, n0 = typeof XMLHttpRequest < "u", a0 = n0 && function(e) {
  return new Promise(function(n, r) {
    const s = xm(e);
    let i = s.data;
    const a = Re.from(s.headers).normalize();
    let { responseType: o, onUploadProgress: c, onDownloadProgress: l } = s, u, f, d, b, v;
    function y() {
      b && b(), v && v(), s.cancelToken && s.cancelToken.unsubscribe(u), s.signal && s.signal.removeEventListener("abort", u);
    }
    let p = new XMLHttpRequest();
    p.open(s.method.toUpperCase(), s.url, !0), p.timeout = s.timeout;
    function h() {
      if (!p)
        return;
      const _ = Re.from(
        "getAllResponseHeaders" in p && p.getAllResponseHeaders()
      ), x = {
        data: !o || o === "text" || o === "json" ? p.responseText : p.response,
        status: p.status,
        statusText: p.statusText,
        headers: _,
        config: e,
        request: p
      };
      zt(function(S) {
        n(S), y();
      }, function(S) {
        r(S), y();
      }, x), p = null;
    }
    "onloadend" in p ? p.onloadend = h : p.onreadystatechange = function() {
      !p || p.readyState !== 4 || p.status === 0 && !(p.responseURL && p.responseURL.indexOf("file:") === 0) || setTimeout(h);
    }, p.onabort = function() {
      p && (r(new te("Request aborted", te.ECONNABORTED, e, p)), p = null);
    }, p.onerror = function(E) {
      const x = E && E.message ? E.message : "Network Error", w = new te(x, te.ERR_NETWORK, e, p);
      w.event = E || null, r(w), p = null;
    }, p.ontimeout = function() {
      let E = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
      const x = s.transitional || Mo;
      s.timeoutErrorMessage && (E = s.timeoutErrorMessage), r(new te(
        E,
        x.clarifyTimeoutError ? te.ETIMEDOUT : te.ECONNABORTED,
        e,
        p
      )), p = null;
    }, i === void 0 && a.setContentType(null), "setRequestHeader" in p && V.forEach(a.toJSON(), function(E, x) {
      p.setRequestHeader(x, E);
    }), V.isUndefined(s.withCredentials) || (p.withCredentials = !!s.withCredentials), o && o !== "json" && (p.responseType = s.responseType), l && ([d, v] = Gt(l, !0), p.addEventListener("progress", d)), c && p.upload && ([f, b] = Gt(c), p.upload.addEventListener("progress", f), p.upload.addEventListener("loadend", b)), (s.cancelToken || s.signal) && (u = (_) => {
      p && (r(!_ || _.type ? new ht(null, e, p) : _), p.abort(), p = null);
    }, s.cancelToken && s.cancelToken.subscribe(u), s.signal && (s.signal.aborted ? u() : s.signal.addEventListener("abort", u)));
    const m = gm(s.url);
    if (m && xe.protocols.indexOf(m) === -1) {
      r(new te("Unsupported protocol " + m + ":", te.ERR_BAD_REQUEST, e));
      return;
    }
    p.send(i || null);
  });
}, s0 = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let r = new AbortController(), s;
    const i = function(l) {
      if (!s) {
        s = !0, o();
        const u = l instanceof Error ? l : this.reason;
        r.abort(u instanceof te ? u : new ht(u instanceof Error ? u.message : u));
      }
    };
    let a = t && setTimeout(() => {
      a = null, i(new te(`timeout ${t} of ms exceeded`, te.ETIMEDOUT));
    }, t);
    const o = () => {
      e && (a && clearTimeout(a), a = null, e.forEach((l) => {
        l.unsubscribe ? l.unsubscribe(i) : l.removeEventListener("abort", i);
      }), e = null);
    };
    e.forEach((l) => l.addEventListener("abort", i));
    const { signal: c } = r;
    return c.unsubscribe = () => V.asap(o), c;
  }
}, i0 = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let r = 0, s;
  for (; r < n; )
    s = r + t, yield e.slice(r, s), r = s;
}, o0 = async function* (e, t) {
  for await (const n of c0(e))
    yield* i0(n, t);
}, c0 = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: n, value: r } = await t.read();
      if (n)
        break;
      yield r;
    }
  } finally {
    await t.cancel();
  }
}, rf = (e, t, n, r) => {
  const s = o0(e, t);
  let i = 0, a, o = (c) => {
    a || (a = !0, r && r(c));
  };
  return new ReadableStream({
    async pull(c) {
      try {
        const { done: l, value: u } = await s.next();
        if (l) {
          o(), c.close();
          return;
        }
        let f = u.byteLength;
        if (n) {
          let d = i += f;
          n(d);
        }
        c.enqueue(new Uint8Array(u));
      } catch (l) {
        throw o(l), l;
      }
    },
    cancel(c) {
      return o(c), s.return();
    }
  }, {
    highWaterMark: 2
  });
}, nf = 64 * 1024, { isFunction: na } = V, u0 = (({ Request: e, Response: t }) => ({
  Request: e,
  Response: t
}))(V.global), {
  ReadableStream: af,
  TextEncoder: sf
} = V.global, of = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, l0 = (e) => {
  e = V.merge.call({
    skipUndefined: !0
  }, u0, e);
  const { fetch: t, Request: n, Response: r } = e, s = t ? na(t) : typeof fetch == "function", i = na(n), a = na(r);
  if (!s)
    return !1;
  const o = s && na(af), c = s && (typeof sf == "function" ? /* @__PURE__ */ ((v) => (y) => v.encode(y))(new sf()) : async (v) => new Uint8Array(await new n(v).arrayBuffer())), l = i && o && of(() => {
    let v = !1;
    const y = new n(xe.origin, {
      body: new af(),
      method: "POST",
      get duplex() {
        return v = !0, "half";
      }
    }).headers.has("Content-Type");
    return v && !y;
  }), u = a && o && of(() => V.isReadableStream(new r("").body)), f = {
    stream: u && ((v) => v.body)
  };
  s && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((v) => {
    !f[v] && (f[v] = (y, p) => {
      let h = y && y[v];
      if (h)
        return h.call(y);
      throw new te(`Response type '${v}' is not supported`, te.ERR_NOT_SUPPORT, p);
    });
  });
  const d = async (v) => {
    if (v == null)
      return 0;
    if (V.isBlob(v))
      return v.size;
    if (V.isSpecCompliantForm(v))
      return (await new n(xe.origin, {
        method: "POST",
        body: v
      }).arrayBuffer()).byteLength;
    if (V.isArrayBufferView(v) || V.isArrayBuffer(v))
      return v.byteLength;
    if (V.isURLSearchParams(v) && (v = v + ""), V.isString(v))
      return (await c(v)).byteLength;
  }, b = async (v, y) => {
    const p = V.toFiniteNumber(v.getContentLength());
    return p ?? d(y);
  };
  return async (v) => {
    let {
      url: y,
      method: p,
      data: h,
      signal: m,
      cancelToken: _,
      timeout: E,
      onDownloadProgress: x,
      onUploadProgress: w,
      responseType: S,
      headers: P,
      withCredentials: C = "same-origin",
      fetchOptions: M
    } = xm(v), L = t || fetch;
    S = S ? (S + "").toLowerCase() : "text";
    let G = s0([m, _ && _.toAbortSignal()], E), H = null;
    const F = G && G.unsubscribe && (() => {
      G.unsubscribe();
    });
    let K;
    try {
      if (w && l && p !== "get" && p !== "head" && (K = await b(P, h)) !== 0) {
        let R = new n(y, {
          method: "POST",
          body: h,
          duplex: "half"
        }), j;
        if (V.isFormData(h) && (j = R.headers.get("content-type")) && P.setContentType(j), R.body) {
          const [O, g] = ha(
            K,
            Gt(va(w))
          );
          h = rf(R.body, nf, O, g);
        }
      }
      V.isString(C) || (C = C ? "include" : "omit");
      const q = i && "credentials" in n.prototype, U = {
        ...M,
        signal: G,
        method: p.toUpperCase(),
        headers: P.normalize().toJSON(),
        body: h,
        duplex: "half",
        credentials: q ? C : void 0
      };
      H = i && new n(y, U);
      let D = await (i ? L(H, M) : L(y, U));
      const J = u && (S === "stream" || S === "response");
      if (u && (x || J && F)) {
        const R = {};
        ["status", "statusText", "headers"].forEach(($) => {
          R[$] = D[$];
        });
        const j = V.toFiniteNumber(D.headers.get("content-length")), [O, g] = x && ha(
          j,
          Gt(va(x), !0)
        ) || [];
        D = new r(
          rf(D.body, nf, O, () => {
            g && g(), F && F();
          }),
          R
        );
      }
      S = S || "text";
      let A = await f[V.findKey(f, S) || "text"](D, v);
      return !J && F && F(), await new Promise((R, j) => {
        zt(R, j, {
          data: A,
          headers: Re.from(D.headers),
          status: D.status,
          statusText: D.statusText,
          config: v,
          request: H
        });
      });
    } catch (q) {
      throw F && F(), q && q.name === "TypeError" && /Load failed|fetch/i.test(q.message) ? Object.assign(
        new te("Network Error", te.ERR_NETWORK, v, H),
        {
          cause: q.cause || q
        }
      ) : te.from(q, q && q.code, v, H);
    }
  };
}, p0 = /* @__PURE__ */ new Map(), wm = (e) => {
  let t = e && e.env || {};
  const { fetch: n, Request: r, Response: s } = t, i = [
    r,
    s,
    n
  ];
  let a = i.length, o = a, c, l, u = p0;
  for (; o--; )
    c = i[o], l = u.get(c), l === void 0 && u.set(c, l = o ? /* @__PURE__ */ new Map() : l0(t)), u = l;
  return l;
};
wm();
const Vo = {
  http: e0,
  xhr: a0,
  fetch: {
    get: wm
  }
};
V.forEach(Vo, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const cf = (e) => `- ${e}`, d0 = (e) => V.isFunction(e) || e === null || e === !1;
function f0(e, t) {
  e = V.isArray(e) ? e : [e];
  const { length: n } = e;
  let r, s;
  const i = {};
  for (let a = 0; a < n; a++) {
    r = e[a];
    let o;
    if (s = r, !d0(r) && (s = Vo[(o = String(r)).toLowerCase()], s === void 0))
      throw new te(`Unknown adapter '${o}'`);
    if (s && (V.isFunction(s) || (s = s.get(t))))
      break;
    i[o || "#" + a] = s;
  }
  if (!s) {
    const a = Object.entries(i).map(
      ([c, l]) => `adapter ${c} ` + (l === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let o = n ? a.length > 1 ? `since :
` + a.map(cf).join(`
`) : " " + cf(a[0]) : "as no adapter specified";
    throw new te(
      "There is no suitable adapter to dispatch the request " + o,
      "ERR_NOT_SUPPORT"
    );
  }
  return s;
}
const Em = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: f0,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: Vo
};
function po(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new ht(null, e);
}
function uf(e) {
  return po(e), e.headers = Re.from(e.headers), e.data = no.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), Em.getAdapter(e.adapter || pr.adapter, e)(e).then(function(r) {
    return po(e), r.data = no.call(
      e,
      e.transformResponse,
      r
    ), r.headers = Re.from(r.headers), r;
  }, function(r) {
    return vm(r) || (po(e), r && r.response && (r.response.data = no.call(
      e,
      e.transformResponse,
      r.response
    ), r.response.headers = Re.from(r.response.headers))), Promise.reject(r);
  });
}
const Fa = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  Fa[e] = function(r) {
    return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const lf = {};
Fa.transitional = function(t, n, r) {
  function s(i, a) {
    return "[Axios v" + ma + "] Transitional option '" + i + "'" + a + (r ? ". " + r : "");
  }
  return (i, a, o) => {
    if (t === !1)
      throw new te(
        s(a, " has been removed" + (n ? " in " + n : "")),
        te.ERR_DEPRECATED
      );
    return n && !lf[a] && (lf[a] = !0, console.warn(
      s(
        a,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(i, a, o) : !0;
  };
};
Fa.spelling = function(t) {
  return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0);
};
function m0(e, t, n) {
  if (typeof e != "object")
    throw new te("options must be an object", te.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const i = r[s], a = t[i];
    if (a) {
      const o = e[i], c = o === void 0 || a(o, i, e);
      if (c !== !0)
        throw new te("option " + i + " must be " + c, te.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new te("Unknown option " + i, te.ERR_BAD_OPTION);
  }
}
const ca = {
  assertOptions: m0,
  validators: Fa
}, Ye = ca.validators;
let Pt = class {
  constructor(t) {
    this.defaults = t || {}, this.interceptors = {
      request: new Cd(),
      response: new Cd()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (r) {
      if (r instanceof Error) {
        let s = {};
        Error.captureStackTrace ? Error.captureStackTrace(s) : s = new Error();
        const i = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        try {
          r.stack ? i && !String(r.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (r.stack += `
` + i) : r.stack = i;
        } catch {
        }
      }
      throw r;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = kt(this.defaults, n);
    const { transitional: r, paramsSerializer: s, headers: i } = n;
    r !== void 0 && ca.assertOptions(r, {
      silentJSONParsing: Ye.transitional(Ye.boolean),
      forcedJSONParsing: Ye.transitional(Ye.boolean),
      clarifyTimeoutError: Ye.transitional(Ye.boolean)
    }, !1), s != null && (V.isFunction(s) ? n.paramsSerializer = {
      serialize: s
    } : ca.assertOptions(s, {
      encode: Ye.function,
      serialize: Ye.function
    }, !0)), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), ca.assertOptions(n, {
      baseUrl: Ye.spelling("baseURL"),
      withXsrfToken: Ye.spelling("withXSRFToken")
    }, !0), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let a = i && V.merge(
      i.common,
      i[n.method]
    );
    i && V.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (v) => {
        delete i[v];
      }
    ), n.headers = Re.concat(a, i);
    const o = [];
    let c = !0;
    this.interceptors.request.forEach(function(y) {
      typeof y.runWhen == "function" && y.runWhen(n) === !1 || (c = c && y.synchronous, o.unshift(y.fulfilled, y.rejected));
    });
    const l = [];
    this.interceptors.response.forEach(function(y) {
      l.push(y.fulfilled, y.rejected);
    });
    let u, f = 0, d;
    if (!c) {
      const v = [uf.bind(this), void 0];
      for (v.unshift(...o), v.push(...l), d = v.length, u = Promise.resolve(n); f < d; )
        u = u.then(v[f++], v[f++]);
      return u;
    }
    d = o.length;
    let b = n;
    for (; f < d; ) {
      const v = o[f++], y = o[f++];
      try {
        b = v(b);
      } catch (p) {
        y.call(this, p);
        break;
      }
    }
    try {
      u = uf.call(this, b);
    } catch (v) {
      return Promise.reject(v);
    }
    for (f = 0, d = l.length; f < d; )
      u = u.then(l[f++], l[f++]);
    return u;
  }
  getUri(t) {
    t = kt(this.defaults, t);
    const n = zo(t.baseURL, t.url, t.allowAbsoluteUrls);
    return Fo(n, t.params, t.paramsSerializer);
  }
};
V.forEach(["delete", "get", "head", "options"], function(t) {
  Pt.prototype[t] = function(n, r) {
    return this.request(kt(r || {}, {
      method: t,
      url: n,
      data: (r || {}).data
    }));
  };
});
V.forEach(["post", "put", "patch"], function(t) {
  function n(r) {
    return function(i, a, o) {
      return this.request(kt(o || {}, {
        method: t,
        headers: r ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: a
      }));
    };
  }
  Pt.prototype[t] = n(), Pt.prototype[t + "Form"] = n(!0);
});
let h0 = class $m {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(i) {
      n = i;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let i = r._listeners.length;
      for (; i-- > 0; )
        r._listeners[i](s);
      r._listeners = null;
    }), this.promise.then = (s) => {
      let i;
      const a = new Promise((o) => {
        r.subscribe(o), i = o;
      }).then(s);
      return a.cancel = function() {
        r.unsubscribe(i);
      }, a;
    }, t(function(i, a, o) {
      r.reason || (r.reason = new ht(i, a, o), n(r.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (r) => {
      t.abort(r);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new $m(function(s) {
        t = s;
      }),
      cancel: t
    };
  }
};
function v0(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function y0(e) {
  return V.isObject(e) && e.isAxiosError === !0;
}
const yo = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(yo).forEach(([e, t]) => {
  yo[t] = e;
});
function Sm(e) {
  const t = new Pt(e), n = zf(Pt.prototype.request, t);
  return V.extend(n, Pt.prototype, t, { allOwnKeys: !0 }), V.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(s) {
    return Sm(kt(e, s));
  }, n;
}
const _e = Sm(pr);
_e.Axios = Pt;
_e.CanceledError = ht;
_e.CancelToken = h0;
_e.isCancel = vm;
_e.VERSION = ma;
_e.toFormData = Da;
_e.AxiosError = te;
_e.Cancel = _e.CanceledError;
_e.all = function(t) {
  return Promise.all(t);
};
_e.spread = v0;
_e.isAxiosError = y0;
_e.mergeConfig = kt;
_e.AxiosHeaders = Re;
_e.formToJSON = (e) => hm(V.isHTMLForm(e) ? new FormData(e) : e);
_e.getAdapter = Em.getAdapter;
_e.HttpStatusCode = yo;
_e.default = _e;
const {
  Axios: Ow,
  AxiosError: Nw,
  CanceledError: kw,
  isCancel: jw,
  CancelToken: Aw,
  VERSION: Iw,
  all: Cw,
  Cancel: qw,
  isAxiosError: Lw,
  spread: Dw,
  toFormData: Fw,
  AxiosHeaders: Mw,
  HttpStatusCode: Uw,
  formToJSON: zw,
  getAdapter: Vw,
  mergeConfig: Bw
} = _e, pf = "https://electron-licensing-server.vercel.app/api/verify", df = "UrbanBill", g0 = {
  key: null,
  status: "invalid",
  lastCheck: 0,
  expiry: null,
  lastKnownDate: 0
};
class b0 {
  constructor() {
    this.machineId = "";
    try {
      this.store = this.createStore(), this.store.get("status");
    } catch (t) {
      console.error("LicenseManager: Store corrupted, attempting to reset...", t), this.deleteCorruptedStore(), this.store = this.createStore();
    }
  }
  createStore() {
    return new Eb({
      name: "license-data",
      defaults: g0,
      encryptionKey: "urbanbill-secure-rec-key"
      // Obfuscated storage
    });
  }
  deleteCorruptedStore() {
    try {
      const t = Ue.getPath("userData"), n = Tm.join(t, "license-data.json");
      Wo.existsSync(n) && (Wo.unlinkSync(n), console.log("LicenseManager: Deleted corrupted store file:", n));
    } catch (t) {
      console.error("LicenseManager: Failed to delete corrupted store:", t);
    }
  }
  async initialize() {
    try {
      this.machineId = await Rb.machineId(), console.log("LicenseManager: Initialized with Machine ID:", this.machineId), this.checkTampering();
    } catch (t) {
      console.error("LicenseManager: Failed to get Machine ID", t);
    }
  }
  /**
   * Checks for system clock tampering (Time Bomb).
   * If the current system time is significantly before the last known execution time,
   * we assume the user wound back the clock.
   */
  checkTampering() {
    const t = Date.now(), n = this.store.get("lastKnownDate");
    return t < n - 3600 * 1e3 ? (console.error("LicenseManager: TAINTED! System time matches past. Potential tampering."), this.invalidateLicense("System time tampering detected."), !0) : (t > n && this.store.set("lastKnownDate", t), !1);
  }
  invalidateLicense(t) {
    this.store.set("status", "invalid"), console.warn(`LicenseManager: License invalidated. Reason: ${t}`);
  }
  getLicenseStatus() {
    return {
      status: this.store.get("status"),
      expiry: this.store.get("expiry"),
      key: this.store.get("key")
    };
  }
  async activate(t) {
    try {
      const n = await _e.post(pf, {
        licenseKey: t,
        machineId: this.machineId,
        softwareType: df
      }, { timeout: 5e3 });
      if (n.data.valid) {
        const r = n.data.expiry ? new Date(n.data.expiry).getTime() : null;
        return this.store.set({
          key: t,
          status: "active",
          lastCheck: Date.now(),
          expiry: r,
          lastKnownDate: Date.now()
          // Reset/Sync tamper clock
        }), { success: !0, message: "Activation successful." };
      } else
        return this.store.set("status", "invalid"), { success: !1, message: n.data.message || "Invalid activation key." };
    } catch (n) {
      if (_e.isAxiosError(n) && n.response) {
        const r = n.response.data?.error || n.response.data?.message || "Activation rejected by server.";
        return console.error(`LicenseManager: Server rejected (Status ${n.response.status}): ${r}`), { success: !1, message: r };
      }
      return console.error("LicenseManager: Activation network error", n), { success: !1, message: "Could not reach licensing server (Network detected)." };
    }
  }
  /**
   * Main validation routine to be called on App Startup.
   */
  async checkLicense() {
    if (this.checkTampering())
      return !1;
    const t = this.store.get("key");
    if (!t) return !1;
    try {
      const n = await _e.post(pf, {
        licenseKey: t,
        machineId: this.machineId,
        softwareType: df
      }, { timeout: 3e3 });
      if (n.data.valid) {
        const r = n.data.expiry ? new Date(n.data.expiry).getTime() : null;
        return this.store.set({
          key: t,
          status: "active",
          lastCheck: Date.now(),
          expiry: r,
          lastKnownDate: Date.now()
        }), !0;
      } else
        return this.store.set("status", "invalid"), !1;
    } catch (n) {
      if (_e.isAxiosError(n) && n.response) {
        const r = n.response.status;
        if (r === 400 || r === 401 || r === 403 || r === 404)
          return console.error(`LicenseManager: Server rejected license (Status ${r}). Invalidating.`), this.store.set("status", "invalid"), !1;
      }
      return console.error("LicenseManager: Server unreachable. Internet required.", n), !1;
    }
  }
}
function _0(e) {
  const t = e.items.map((s) => `
        <tr>
            <td style="text-align: left;">${s.name}</td>
            <td style="text-align: center;">${s.quantity}</td>
            <td style="text-align: right;">₹${s.price.toFixed(2)}</td>
            <td style="text-align: right;">₹${s.total.toFixed(2)}</td>
        </tr>
    `).join(""), n = e.subtotal + e.tax, r = e.extraDiscount || 0;
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            width: 72mm;
            padding: 2mm;
            background: white;
            color: black;
        }
        .header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 6px;
            margin-bottom: 6px;
        }
        .logo {
            max-width: 40%;
            height: auto;
            margin-bottom: 6px;
        }
        .store-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        .store-details {
            font-size: 9px;
            margin-bottom: 3px;
        }
        .transaction-info {
            font-size: 9px;
            margin-bottom: 6px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }
        th {
            border-bottom: 1px solid #000;
            padding: 3px 0;
            font-size: 9px;
        }
        td {
            padding: 2px 0;
            font-size: 10px;
        }
        .totals {
            border-top: 1px dashed #000;
            padding-top: 6px;
            margin-top: 6px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 2px 0;
            font-size: 10px;
        }
        .grand-total {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 5px 0;
            margin-top: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px dashed #000;
            font-size: 9px;
        }
        .payment-method {
            margin-top: 6px;
            text-align: center;
            font-weight: bold;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        ${e.logo ? `<img src="${e.logo}" class="logo" />` : ""}
        <div class="store-name">${e.storeName}</div>
        ${e.storeAddress ? `<div class="store-details">${e.storeAddress}</div>` : ""}
        ${e.storePhone ? `<div class="store-details">Tel: ${e.storePhone}</div>` : ""}
        <div class="transaction-info">
            Receipt #${e.transactionId}<br>
            ${e.date}${e.customerName ? `<br><strong>Customer: ${e.customerName}</strong>` : ""}
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th style="text-align: left;">Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            ${t}
        </tbody>
    </table>
    
    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${e.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
            <span>Tax (${e.taxRate}%):</span>
            <span>₹${e.tax.toFixed(2)}</span>
        </div>
        ${r > 0 ? `
        <div class="total-row">
            <span>Gross Total:</span>
            <span>₹${n.toFixed(2)}</span>
        </div>
        <div class="total-row" style="color: black;">
            <span>Discount:</span>
            <span>-₹${r.toFixed(2)}</span>
        </div>
        ` : ""}
        <div class="total-row grand-total">
            <span>NET TOTAL:</span>
            <span>₹${e.total.toFixed(2)}</span>
        </div>
    </div>
    
    <div class="payment-method">
        Paid via: ${e.paymentMethod}
    </div>
    
    <div class="footer">
        ${e.footerMessage || "Thank you for your purchase!"}<br>
        Visit again soon.
    </div>
</body>
</html>
    `;
}
function x0(e, t, n) {
  return new Promise((r) => {
    const s = _0(t), i = new sr({
      width: 300,
      height: 600,
      show: !1,
      webPreferences: {
        nodeIntegration: !1,
        contextIsolation: !0
      }
    });
    i.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(s)}`), i.webContents.on("did-finish-load", () => {
      i.webContents.print({
        silent: !0,
        // Don't show print dialog
        printBackground: !0,
        margins: {
          marginType: "none"
        },
        deviceName: n
        // Use specific printer if provided
      }, (a, o) => {
        i.close(), r(a);
      });
    });
  });
}
async function w0(e) {
  return e.webContents.getPrintersAsync();
}
function Bo(e) {
  ge.handle("print-receipt", async (t, n, r) => {
    try {
      return { success: await x0(e, n, r) };
    } catch (s) {
      return { success: !1, error: s.message };
    }
  }), ge.handle("get-printers", async () => {
    try {
      return { success: !0, printers: await w0(e) };
    } catch (t) {
      return { success: !1, error: t.message };
    }
  });
}
function rxEscapeHtml(e = "") {
  return String(e).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function rxBuildReceiptHtml(e, t = {}) {
  const n = t.paperSize === "4-inch" ? "4in" : "3in", r = e.items.map((o) => `
        <tr>
            <td><div class="item-name">${rxEscapeHtml(o.name)}</div></td>
            <td>${o.quantity}</td>
            <td>Rs. ${o.price.toFixed(2)}</td>
            <td>Rs. ${o.total.toFixed(2)}</td>
        </tr>
    `).join(""), s = e.subtotal + e.tax, i = e.extraDiscount || 0;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 0; size: ${n} auto; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: "Segoe UI", Arial, sans-serif; background: white; color: #111827; }
    .page { width: ${n}; margin: 0 auto; padding: 10px; }
    .receipt { border: 1px solid #d8dee8; border-radius: 14px; overflow: hidden; background: white; }
    .header { text-align: center; padding: 14px 14px 10px; border-bottom: 1px dashed #cbd5e1; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); }
    .logo { max-width: 72px; max-height: 48px; object-fit: contain; margin-bottom: 8px; }
    .store-name { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; margin: 0; }
    .store-line, .footer-copy { margin: 3px 0 0; font-size: 11px; color: #475569; }
    .section { padding: 10px 14px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; }
    .meta-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; background: #f8fafc; }
    .meta-label { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 3px; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 1px dashed #cbd5e1; padding: 0 0 6px; }
    td { padding: 7px 0; font-size: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    th:first-child, td:first-child { text-align: left; }
    th:nth-child(2), td:nth-child(2) { text-align: center; width: 42px; }
    th:nth-child(3), th:nth-child(4), td:nth-child(3), td:nth-child(4) { text-align: right; width: 68px; }
    .item-name { font-weight: 600; color: #0f172a; line-height: 1.3; }
    .totals { display: grid; gap: 6px; padding-top: 8px; }
    .total-row { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: #334155; }
    .grand-total { margin-top: 4px; padding: 10px 12px; border-radius: 12px; background: #0f172a; color: white; font-size: 15px; font-weight: 800; }
    .payment-pill { margin-top: 10px; display: inline-flex; padding: 6px 12px; border-radius: 999px; background: #e2e8f0; color: #0f172a; font-size: 11px; font-weight: 700; }
    .footer { padding: 0 14px 14px; text-align: center; }
  </style>
</head>
<body>
  <div class="page">
    <div class="receipt">
      <div class="header">
        ${e.logo ? `<img src="${e.logo}" class="logo" />` : ""}
        <h1 class="store-name">${rxEscapeHtml(e.storeName)}</h1>
        ${e.storeAddress ? `<p class="store-line">${rxEscapeHtml(e.storeAddress)}</p>` : ""}
        ${e.storePhone ? `<p class="store-line">Phone: ${rxEscapeHtml(e.storePhone)}</p>` : ""}
      </div>
      <div class="section">
        <div class="meta-grid">
          <div class="meta-card"><span class="meta-label">Receipt</span><strong>#${rxEscapeHtml(e.transactionId)}</strong></div>
          <div class="meta-card"><span class="meta-label">Payment</span><strong>${rxEscapeHtml(e.paymentMethod)}</strong></div>
          <div class="meta-card"><span class="meta-label">Date</span><span>${rxEscapeHtml(e.date)}</span></div>
          <div class="meta-card"><span class="meta-label">Customer</span><span>${rxEscapeHtml(e.customerName || "Walk-in")}</span></div>
        </div>
      </div>
      <div class="section">
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead>
          <tbody>${r}</tbody>
        </table>
        <div class="totals">
          <div class="total-row"><span>Subtotal</span><span>Rs. ${e.subtotal.toFixed(2)}</span></div>
          ${e.tax > 0 ? `<div class="total-row"><span>Tax (${e.taxRate}%)</span><span>Rs. ${e.tax.toFixed(2)}</span></div>` : ""}
          ${i > 0 ? `<div class="total-row"><span>Gross total</span><span>Rs. ${s.toFixed(2)}</span></div><div class="total-row"><span>Discount</span><span>- Rs. ${i.toFixed(2)}</span></div>` : ""}
          <div class="total-row grand-total"><span>Net total</span><span>Rs. ${e.total.toFixed(2)}</span></div>
        </div>
        <div class="payment-pill">Paid via ${rxEscapeHtml(e.paymentMethod)}</div>
      </div>
      <div class="footer">
        <p class="footer-copy">${rxEscapeHtml(e.footerMessage || "Thank you for your purchase!")}</p>
        ${e.customerPhone ? `<p class="footer-copy">Customer Phone: ${rxEscapeHtml(e.customerPhone)}</p>` : ""}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
function rxPrintHtml(e, t, n = {}) {
  return new Promise((r) => {
    const s = new sr({
      width: n.paperSize === "4-inch" ? 520 : 420,
      height: n.height || 760,
      show: !!n.preview,
      autoHideMenuBar: !0,
      webPreferences: {
        nodeIntegration: !1,
        contextIsolation: !0
      }
    });
    s.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(e)}`), s.webContents.on("did-finish-load", () => {
      if (n.preview) {
        s.focus(), r(!0);
        return;
      }
      s.webContents.print({
        silent: !0,
        printBackground: !0,
        margins: {
          marginType: "none"
        },
        deviceName: t
      }, (i) => {
        s.close(), r(i);
      });
    });
  });
}
Bo = function(e) {
  ge.removeHandler("print-receipt");
  ge.removeHandler("print-barcode");
  ge.removeHandler("get-printers");
  ge.handle("print-receipt", async (t, n, r, s) => {
    try {
      return { success: await rxPrintHtml(rxBuildReceiptHtml(n, s || {}), r, { paperSize: (s == null ? void 0 : s.paperSize) || "3-inch", preview: !!(s == null ? void 0 : s.preview), height: 760 }) };
    } catch (i) {
      return { success: !1, error: i.message };
    }
  });
  ge.handle("print-barcode", async (t, n, r) => {
    try {
      return { success: await rxPrintHtml(n, r, { height: 360 }) };
    } catch (s) {
      return { success: !1, error: s.message };
    }
  });
  ge.handle("get-printers", async () => {
    try {
      return { success: !0, printers: await w0(e) };
    } catch (t) {
      return { success: !1, error: t.message };
    }
  });
};
const E0 = process.env.NODE_ENV === "development" ? "./urbanbill.db" : Ae.join(Ue.getPath("userData"), "urbanbill.db"), ee = new Im(E0);
ee.pragma("journal_mode = WAL");
function $0() {
  const e = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        category TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`, t = `
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        customer_name TEXT,
        customer_phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`, n = `
    CREATE TABLE IF NOT EXISTS transaction_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price_at_sale REAL NOT NULL,
        FOREIGN KEY(transaction_id) REFERENCES transactions(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    );`;
  ee.exec(e), ee.exec(t), ee.exec(n), U0();
  try {
    ee.exec("ALTER TABLE transactions ADD COLUMN customer_name TEXT");
  } catch {
  }
  try {
    ee.exec("ALTER TABLE transactions ADD COLUMN customer_phone TEXT");
  } catch {
  }
  try {
    ee.exec("ALTER TABLE transactions ADD COLUMN customer_dob TEXT");
  } catch {
  }
  try {
    ee.exec("ALTER TABLE products ADD COLUMN cost_price REAL DEFAULT 0");
  } catch {
  }
  try {
    ee.exec("ALTER TABLE transactions ADD COLUMN extra_discount REAL DEFAULT 0");
  } catch {
  }
  if (ee.exec("CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)"), ee.exec("CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)"), ee.exec("CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)"), ee.prepare("SELECT count(*) as count FROM products").get().count === 0) {
    const i = ee.prepare("INSERT INTO products (sku, name, price, stock, category) VALUES (?, ?, ?, ?, ?)");
    i.run("123456", "Luxury Silk Shirt", 1200, 50, "Apparel"), i.run("654321", "Cotton Chino", 850, 40, "Apparel"), i.run("112233", "Leather Belt", 450, 100, "Accessories"), i.run("445566", "Designer Sunglasses", 2500, 15, "Accessories");
  }
}
function S0(e = 1, t = 50, n = "", r = "all") {
  const s = (e - 1) * t;
  let i = "SELECT * FROM products";
  const a = [], o = [];
  return n && (o.push("(name LIKE ? OR sku LIKE ?)"), a.push(`%${n}%`, `%${n}%`)), r !== "all" && (o.push("category = ?"), a.push(r)), o.length > 0 && (i += " WHERE " + o.join(" AND ")), i += " ORDER BY created_at DESC LIMIT ? OFFSET ?", a.push(t, s), ee.prepare(i).all(...a);
}
function R0(e = "", t = "all") {
  let n = "SELECT count(*) as count FROM products";
  const r = [], s = [];
  return e && (s.push("(name LIKE ? OR sku LIKE ?)"), r.push(`%${e}%`, `%${e}%`)), t !== "all" && (s.push("category = ?"), r.push(t)), s.length > 0 && (n += " WHERE " + s.join(" AND ")), ee.prepare(n).get(...r).count;
}
function T0(e) {
  return ee.prepare("SELECT * FROM products WHERE sku = ?").get(e);
}
function P0(e) {
  return ee.prepare("INSERT INTO products (sku, name, price, cost_price, stock, category) VALUES (@sku, @name, @price, @cost_price, @stock, @category)").run({ ...e, cost_price: e.cost_price || 0 });
}
function O0(e) {
  return ee.prepare("UPDATE products SET sku = @sku, name = @name, price = @price, cost_price = @cost_price, stock = @stock, category = @category WHERE id = @id").run({ ...e, cost_price: e.cost_price || 0 });
}
function N0(e) {
  return ee.prepare("DELETE FROM products WHERE id = ?").run(e);
}
function k0(e) {
  const t = ee.prepare("INSERT INTO transactions (total_amount, extra_discount, payment_method, customer_name, customer_phone, customer_dob) VALUES (@total_amount, @extra_discount, @payment_method, @customer_name, @customer_phone, @customer_dob)"), n = ee.prepare("INSERT INTO transaction_items (transaction_id, product_id, quantity, price_at_sale) VALUES (@transaction_id, @product_id, @quantity, @price_at_sale)"), r = ee.prepare("UPDATE products SET stock = stock - @quantity WHERE id = @id");
  return ee.transaction((i) => {
    const o = t.run({
      total_amount: i.total_amount,
      extra_discount: i.extra_discount || 0,
      payment_method: i.payment_method,
      customer_name: i.customer_name || null,
      customer_phone: i.customer_phone || null,
      customer_dob: i.customer_dob || null
    }).lastInsertRowid;
    for (const c of i.items)
      n.run({
        transaction_id: o,
        product_id: c.product_id,
        quantity: c.quantity,
        price_at_sale: c.price_at_sale
      }), r.run({ quantity: c.quantity, id: c.product_id });
    return o;
  })(e);
}
function j0(e = 7) {
  return ee.prepare(`
        SELECT date(created_at) as date, SUM(total_amount) as total 
        FROM transactions 
        GROUP BY date(created_at) 
        ORDER BY date(created_at) DESC 
        LIMIT ?
    `).all(e);
}
function A0() {
  const e = ee.prepare("SELECT SUM(total_amount) as total FROM transactions WHERE date(created_at) = date('now', 'localtime')").get(), t = ee.prepare("SELECT SUM(total_amount) as total FROM transactions").get(), n = ee.prepare("SELECT count(*) as count FROM transactions").get(), r = ee.prepare("SELECT count(*) as count FROM products WHERE stock < 10").get(), s = ee.prepare(`
        SELECT SUM((ti.price_at_sale - COALESCE(p.cost_price, 0)) * ti.quantity) as gross_profit
        FROM transaction_items ti
        LEFT JOIN products p ON ti.product_id = p.id
    `).get(), i = ee.prepare("SELECT SUM(extra_discount) as total FROM transactions").get(), a = (s.gross_profit || 0) - (i.total || 0), o = ee.prepare(`
        SELECT SUM((ti.price_at_sale - COALESCE(p.cost_price, 0)) * ti.quantity) as gross_profit
        FROM transaction_items ti
        LEFT JOIN products p ON ti.product_id = p.id
        JOIN transactions t ON ti.transaction_id = t.id
        WHERE date(t.created_at) = date('now', 'localtime')
    `).get(), c = ee.prepare("SELECT SUM(extra_discount) as total FROM transactions WHERE date(created_at) = date('now', 'localtime')").get(), l = (o.gross_profit || 0) - (c.total || 0);
  return {
    todaySales: e.total || 0,
    totalSales: t.total || 0,
    lowStockItems: r.count || 0,
    totalTransactions: n.count || 0,
    todayProfit: l,
    totalProfit: a
  };
}
function I0(e = 1, t = 50, n = "", r = "all", s = "all") {
  const i = (e - 1) * t;
  let a = `
        SELECT id, total_amount, extra_discount, payment_method, customer_name, customer_phone, customer_dob, created_at 
        FROM transactions 
    `;
  const o = [], c = [];
  return n && (c.push("(id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)"), o.push(`%${n}%`, `%${n}%`, `%${n}%`)), r !== "all" && (c.push("payment_method = ?"), o.push(r)), s !== "all" && (s === "today" ? c.push("date(created_at) = date('now', 'localtime')") : s === "week" ? c.push("created_at >= date('now', 'localtime', '-7 days')") : s === "month" && c.push("created_at >= date('now', 'localtime', '-1 month')")), c.length > 0 && (a += " WHERE " + c.join(" AND ")), a += " ORDER BY created_at DESC LIMIT ? OFFSET ?", o.push(t, i), ee.prepare(a).all(...o);
}
function C0(e = "", t = "all", n = "all") {
  let r = "SELECT count(*) as count FROM transactions";
  const s = [], i = [];
  return e && (i.push("(id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)"), s.push(`%${e}%`, `%${e}%`, `%${e}%`)), t !== "all" && (i.push("payment_method = ?"), s.push(t)), n !== "all" && (n === "today" ? i.push("date(created_at) = date('now', 'localtime')") : n === "week" ? i.push("created_at >= date('now', 'localtime', '-7 days')") : n === "month" && i.push("created_at >= date('now', 'localtime', '-1 month')")), i.length > 0 && (r += " WHERE " + i.join(" AND ")), ee.prepare(r).get(...s).count;
}
function q0(e) {
  const t = ee.prepare("SELECT * FROM transactions WHERE id = ?").get(e);
  if (!t) return null;
  const n = ee.prepare(`
        SELECT ti.*, p.name, p.sku 
        FROM transaction_items ti 
        JOIN products p ON ti.product_id = p.id 
        WHERE ti.transaction_id = ?
    `).all(e);
  return { ...t, items: n };
}
function L0() {
  return ee.prepare("SELECT sku, name, price, cost_price, stock, category FROM products").all();
}
function D0(e) {
  const t = ee.prepare(`
        INSERT OR REPLACE INTO products (sku, name, price, cost_price, stock, category) 
        VALUES (@sku, @name, @price, @cost_price, @stock, @category)
    `);
  return ee.transaction((r) => {
    let s = 0;
    for (const i of r)
      try {
        t.run({
          sku: i.sku,
          name: i.name,
          price: Number(i.price),
          cost_price: Number(i.cost_price) || 0,
          stock: Number(i.stock),
          category: i.category || "Uncategorized"
        }), s++;
      } catch {
      }
    return s;
  })(e);
}
function F0() {
  return ee.prepare(`
        SELECT t.id, t.total_amount, t.payment_method, t.created_at,
               ti.product_id, ti.quantity, ti.price_at_sale,
               p.sku, p.name
        FROM transactions t
        JOIN transaction_items ti ON t.id = ti.transaction_id
        JOIN products p ON ti.product_id = p.id
        ORDER BY t.created_at DESC
    `).all();
}
function M0() {
  const e = ee.prepare("DELETE FROM transaction_items"), t = ee.prepare("DELETE FROM transactions");
  return ee.transaction(() => {
    e.run(), t.run();
  })(), { success: !0 };
}
function U0() {
  const e = `
    CREATE TABLE IF NOT EXISTS vendors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER, -- FK to vendor_profiles
        vendor_name TEXT,
        date TEXT NOT NULL,
        purchase_bill_image TEXT,
        purchase_amount REAL DEFAULT 0,
        payment_bill_image TEXT,
        payment_amount REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        pending_amount REAL DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`, t = `
    CREATE TABLE IF NOT EXISTS vendor_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;
  ee.exec(e), ee.exec(t), ee.exec("CREATE INDEX IF NOT EXISTS idx_vendors_date ON vendors(date)"), ee.exec("CREATE INDEX IF NOT EXISTS idx_vendors_vendor_name ON vendors(vendor_name)");
  try {
    ee.exec("ALTER TABLE vendors ADD COLUMN vendor_id INTEGER");
  } catch {
  }
  try {
    ee.exec("CREATE INDEX IF NOT EXISTS idx_vendors_vendor_id ON vendors(vendor_id)");
  } catch {
  }
  if (ee.prepare("SELECT count(*) as count FROM vendor_profiles").get().count === 0) {
    const r = ee.prepare("SELECT DISTINCT vendor_name FROM vendors WHERE vendor_name IS NOT NULL AND vendor_name != ''").all(), s = ee.prepare("INSERT OR IGNORE INTO vendor_profiles (name) VALUES (?)"), i = ee.prepare("UPDATE vendors SET vendor_id = ? WHERE vendor_name = ?");
    ee.transaction(() => {
      for (const o of r) {
        s.run(o.vendor_name);
        const c = ee.prepare("SELECT id FROM vendor_profiles WHERE name = ?").get(o.vendor_name);
        c && i.run(c.id, o.vendor_name);
      }
    })();
  }
}
function z0() {
  return ee.prepare("SELECT * FROM vendor_profiles ORDER BY name ASC").all();
}
function V0(e, t, n) {
  return ee.prepare("INSERT INTO vendor_profiles (name, phone, address) VALUES (?, ?, ?)").run(e, t, n);
}
function B0(e = 1, t = 50, n = "", r = "all", s) {
  const i = (e - 1) * t;
  let a = "SELECT * FROM vendors";
  const o = [], c = [];
  return s && (c.push("vendor_id = ?"), o.push(s)), n && (c.push("(vendor_name LIKE ? OR notes LIKE ?)"), o.push(`%${n}%`, `%${n}%`)), r !== "all" && (r === "today" ? c.push("date(date) = date('now', 'localtime')") : r === "week" ? c.push("date >= date('now', 'localtime', '-7 days')") : r === "month" && c.push("date >= date('now', 'localtime', '-1 month')")), c.length > 0 && (a += " WHERE " + c.join(" AND ")), a += " ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?", o.push(t, i), ee.prepare(a).all(...o);
}
function G0(e = "", t = "all", n) {
  let r = "SELECT count(*) as count FROM vendors";
  const s = [], i = [];
  return n && (i.push("vendor_id = ?"), s.push(n)), e && (i.push("(vendor_name LIKE ? OR notes LIKE ?)"), s.push(`%${e}%`, `%${e}%`)), t !== "all" && (t === "today" ? i.push("date(date) = date('now', 'localtime')") : t === "week" ? i.push("date >= date('now', 'localtime', '-7 days')") : t === "month" && i.push("date >= date('now', 'localtime', '-1 month')")), i.length > 0 && (r += " WHERE " + i.join(" AND ")), ee.prepare(r).get(...s).count;
}
function H0(e) {
  return ee.prepare("SELECT * FROM vendors WHERE id = ?").get(e);
}
function K0(e) {
  const t = ee.prepare(`
        INSERT INTO vendors (vendor_id, vendor_name, date, purchase_bill_image, purchase_amount, payment_bill_image, payment_amount, total_amount, paid_amount, pending_amount, notes)
        VALUES (@vendor_id, @vendor_name, @date, @purchase_bill_image, @purchase_amount, @payment_bill_image, @payment_amount, @total_amount, @paid_amount, @pending_amount, @notes)
    `);
  let n = e.vendor_id;
  if (!n && e.vendor_name) {
    const r = ee.prepare("SELECT id FROM vendor_profiles WHERE name = ?").get(e.vendor_name);
    if (r) n = r.id;
    else {
      const s = ee.prepare("INSERT INTO vendor_profiles (name) VALUES (?)").run(e.vendor_name);
      n = Number(s.lastInsertRowid);
    }
  }
  return t.run({
    vendor_id: n || null,
    vendor_name: e.vendor_name || null,
    date: e.date,
    purchase_bill_image: e.purchase_bill_image || null,
    purchase_amount: e.purchase_amount || 0,
    payment_bill_image: e.payment_bill_image || null,
    payment_amount: e.payment_amount || 0,
    total_amount: e.total_amount || 0,
    paid_amount: e.paid_amount || 0,
    pending_amount: e.pending_amount || 0,
    notes: e.notes || null
  });
}
function W0(e) {
  return ee.prepare(`
        UPDATE vendors SET 
            vendor_id = @vendor_id,
            vendor_name = @vendor_name,
            date = @date,
            purchase_bill_image = @purchase_bill_image,
            purchase_amount = @purchase_amount,
            payment_bill_image = @payment_bill_image,
            payment_amount = @payment_amount,
            total_amount = @total_amount,
            paid_amount = @paid_amount,
            pending_amount = @pending_amount,
            notes = @notes,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
    `).run({
    id: e.id,
    vendor_id: e.vendor_id || null,
    vendor_name: e.vendor_name || null,
    date: e.date,
    purchase_bill_image: e.purchase_bill_image || null,
    purchase_amount: e.purchase_amount || 0,
    payment_bill_image: e.payment_bill_image || null,
    payment_amount: e.payment_amount || 0,
    total_amount: e.total_amount || 0,
    paid_amount: e.paid_amount || 0,
    pending_amount: e.pending_amount || 0,
    notes: e.notes || null
  });
}
function J0(e) {
  return ee.prepare("DELETE FROM vendors WHERE id = ?").run(e);
}
function X0(e) {
  let t = "SELECT COALESCE(SUM(purchase_amount), 0) as total FROM vendors", n = "SELECT COALESCE(SUM(paid_amount), 0) as total FROM vendors", r = "SELECT COALESCE(SUM(pending_amount), 0) as total FROM vendors", s = "SELECT count(*) as count FROM vendors";
  const i = [];
  if (e) {
    const u = " WHERE vendor_id = ?";
    t += u, n += u, r += u, s += u, i.push(e);
  }
  const a = ee.prepare(t).get(...i), o = ee.prepare(n).get(...i), c = ee.prepare(r).get(...i), l = ee.prepare(s).get(...i);
  return {
    totalPurchase: a.total || 0,
    totalPaid: o.total || 0,
    totalPending: c.total || 0,
    vendorCount: l.count || 0
  };
}
function Y0(e = "") {
  let t = `
        SELECT 
            customer_phone,
            customer_name,
            customer_dob,
            COUNT(*) as visit_count,
            SUM(total_amount) as total_spent,
            MAX(created_at) as last_visit,
            MIN(created_at) as first_visit
        FROM transactions
        WHERE customer_phone IS NOT NULL AND customer_phone != ''
    `;
  const n = [];
  return e && (t += " AND (customer_phone LIKE ? OR customer_name LIKE ?)", n.push(`%${e}%`, `%${e}%`)), t += " GROUP BY customer_phone ORDER BY visit_count DESC, last_visit DESC", ee.prepare(t).all(...n);
}
function Q0(e) {
  return ee.prepare(`
        SELECT id, total_amount, extra_discount, payment_method, customer_name, customer_phone, customer_dob, created_at
        FROM transactions
        WHERE customer_phone = ?
        ORDER BY created_at DESC
    `).all(e);
}
const Z0 = Pm(import.meta.url), dr = Ae.dirname(Z0);
process.env.DIST = Ae.join(dr, "../dist");
process.env.VITE_PUBLIC = Ue.isPackaged ? process.env.DIST : Ae.join(dr, "../public");
let Se, st = null;
const Ht = new b0(), Ot = process.env.VITE_DEV_SERVER_URL;
function Ma() {
  Se = new sr({
    width: 1200,
    height: 800,
    icon: Ae.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    webPreferences: {
      preload: Ae.join(dr, "preload.cjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: Ue.isPackaged,
      // Enable sandbox in production for extra security
      devTools: !Ue.isPackaged,
      // Disable DevTools in production
      webSecurity: !0,
      // Enforce same-origin policy
      allowRunningInsecureContent: !1
      // Block mixed content
    }
  }), Ue.isPackaged && Se.webContents.on("before-input-event", (e, t) => {
    (t.key === "F12" || t.control && t.shift && ["I", "i", "J", "j", "C", "c"].includes(t.key)) && e.preventDefault();
  }), Se.webContents.on("will-navigate", (e, t) => {
    Se?.webContents.getURL(), !t.startsWith("file://") && !t.startsWith(Ot || "") && (e.preventDefault(), console.warn("Security: Blocked navigation to:", t));
  }), Se.webContents.setWindowOpenHandler(() => ({ action: "deny" })), Se.webContents.on("did-finish-load", () => {
    Se?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Ot ? Se.loadURL(Ot) : Se.loadFile(Ae.join(process.env.DIST || "", "index.html"));
}
function Rm() {
  st = new sr({
    width: 600,
    height: 600,
    resizable: !1,
    minimizable: !1,
    maximizable: !1,
    icon: Ae.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    webPreferences: {
      preload: Ae.join(dr, "preload.cjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: Ue.isPackaged,
      webSecurity: !0,
      allowRunningInsecureContent: !1
    }
  }), Ot ? st.loadURL(`${Ot}?window=activation`) : st.loadFile(Ae.join(process.env.DIST || "", "index.html"), { query: { window: "activation" } }), st.on("closed", () => {
    st = null;
  });
}
let Vt = null;
function ew() {
  Vt = new sr({
    width: 500,
    height: 350,
    transparent: !0,
    frame: !1,
    alwaysOnTop: !0,
    resizable: !1,
    icon: Ae.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    webPreferences: {
      preload: Ae.join(dr, "preload.cjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: Ue.isPackaged,
      webSecurity: !0,
      allowRunningInsecureContent: !1
    }
  }), Ot ? Vt.loadURL(`${Ot}?window=splash`) : Vt.loadFile(Ae.join(process.env.DIST || "", "index.html"), { query: { window: "splash" } });
}
Ue.whenReady().then(async () => {
  ew(), await Ht.initialize(), await new Promise((t) => setTimeout(t, 2e3));
  const e = await Ht.checkLicense();
  Vt && (Vt.close(), Vt = null), e ? (Ma(), Se && Bo(Se)) : Rm();
});
Ue.on("window-all-closed", () => {
  process.platform !== "darwin" && Ue.quit();
});
Ue.on("activate", async () => {
  sr.getAllWindows().length === 0 && (Ht.getLicenseStatus().status === "active" ? Ma() : Rm());
});
$0();
ge.handle("get-suggested-printer", async () => {
  if (!Se) return null;
  try {
    const e = await Se.webContents.getPrintersAsync(), t = ["thermal", "pos", "receipt", "epson", "star", "bixolon", "58mm", "80mm", "xprinter"], n = e.find(
      (s) => t.some((i) => s.name.toLowerCase().includes(i))
    );
    return n ? n.name : e.find((s) => s.isDefault)?.name || null;
  } catch {
    return null;
  }
});
ge.handle("get-products", (e, t) => {
  const { page: n, pageSize: r, search: s, category: i } = t || {};
  return {
    products: S0(n, r, s, i),
    total: R0(s, i)
  };
});
ge.handle("get-product-by-sku", (e, t) => T0(t));
ge.handle("add-product", (e, t) => {
  try {
    return { success: !0, data: P0(t) };
  } catch (n) {
    return { success: !1, error: n.message };
  }
});
ge.handle("update-product", (e, t) => O0(t));
ge.handle("delete-product", (e, t) => N0(t));
ge.handle("create-transaction", (e, t) => {
  try {
    return { success: !0, id: k0(t) };
  } catch (n) {
    return { success: !1, error: n.message };
  }
});
ge.handle("get-dashboard-stats", () => ({
  stats: A0(),
  chart: j0()
}));
ge.handle("get-transaction-history", (e, t) => {
  const { page: n, pageSize: r, search: s, paymentFilter: i, dateFilter: a } = t || {};
  return {
    transactions: I0(n, r, s, i, a),
    total: C0(s, i, a)
  };
});
ge.handle("get-transaction-by-id", (e, t) => q0(t));
ge.handle("export-products", () => ({ success: !0, data: L0() }));
ge.handle("import-products", (e, t) => {
  try {
    return { success: !0, imported: D0(t) };
  } catch (n) {
    return { success: !1, error: n.message };
  }
});
ge.handle("export-transactions", () => ({ success: !0, data: F0() }));
ge.handle("clear-transaction-history", () => {
  try {
    return M0(), { success: !0 };
  } catch (e) {
    return { success: !1, error: e.message };
  }
});
ge.handle("get-license-status", () => Ht.getLicenseStatus());
ge.handle("activate-license", async (e, t) => {
  const n = await Ht.activate(t);
  return n.success && (st && st.close(), Ma(), Se && Bo(Se)), n;
});
ge.handle("retry-license-check", async () => await Ht.checkLicense() ? (st && st.close(), Ma(), Se && Bo(Se), { success: !0 }) : { success: !1, message: "Still unable to validate. Check internet connection." });
ge.handle("get-customers-list", (e, t) => Y0(t));
ge.handle("get-customer-history", (e, t) => Q0(t));
ge.handle("get-vendor-profiles", () => z0());
ge.handle("add-vendor-profile", (e, t) => {
  try {
    return { success: !0, data: V0(t.name, t.phone, t.address) };
  } catch (n) {
    return { success: !1, error: n.message };
  }
});
ge.handle("get-vendors", (e, t) => {
  const { page: n, pageSize: r, search: s, dateFilter: i, vendorId: a } = t || {};
  return {
    vendors: B0(n, r, s, i, a),
    total: G0(s, i, a)
  };
});
ge.handle("get-vendor-by-id", (e, t) => H0(t));
ge.handle("add-vendor", (e, t) => {
  try {
    return { success: !0, data: K0(t) };
  } catch (n) {
    return { success: !1, error: n.message };
  }
});
ge.handle("update-vendor", (e, t) => {
  try {
    return { success: !0, data: W0(t) };
  } catch (n) {
    return { success: !1, error: n.message };
  }
});
ge.handle("delete-vendor", (e, t) => {
  try {
    return J0(t), { success: !0 };
  } catch (n) {
    return { success: !1, error: n.message };
  }
});
ge.handle("get-vendor-stats", (e, t) => X0(t));
