// Shim for generic javascript utilities.
interface StringConstructor {
  random(l?: number, c?: string): string;
  match(t: string, o: any): boolean;
  hash(s: string, c?: number): number | undefined;
}

interface ObjectConstructor {
  plain(o: any): boolean;
  empty(o: any, n?: string[]): boolean;
  keys(o: any): string[];
}

declare global {
  interface StringConstructor {
    random(l?: number, c?: string): string;
    match(t: string, o: any): boolean;
    hash(s: string, c?: number): number | undefined;
  }
  
  interface ObjectConstructor {
    plain(o: any): boolean;
    empty(o: any, n?: string[]): boolean;
  }
  
  namespace NodeJS {
    interface Timeout {
      hold?: number;
      poll?: ((f: () => void) => void) & { check?: any };
      turn?: ((f: () => void) => void) & { s?: Array<() => void> };
      each?: (l: any[], f: (item: any) => any, e?: (result?: any) => void, S?: number) => void;
      check?: any;
    }
  }
}

(() => {
  // String extensions
  String.random = function(l?: number, c?: string): string {
    let s = '';
    l = l || 24; // you are not going to make a 0 length random number, so no need to check type
    c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
    while(l-- > 0) { 
      s += c.charAt(Math.floor(Math.random() * c.length));
    }
    return s;
  };

  String.match = function(t: string, o: any): boolean {
    let tmp: any, u: undefined;
    if('string' !== typeof t) { return false; }
    if('string' == typeof o) { o = {'=': o}; }
    o = o || {};
    tmp = (o['='] || o['*'] || o['>'] || o['<']);
    if(t === tmp) { return true; }
    if(u !== o['=']) { return false; }
    tmp = (o['*'] || o['>']);
    if(t.slice(0, (tmp||'').length) === tmp) { return true; }
    if(u !== o['*']) { return false; }
    if(u !== o['>'] && u !== o['<']) {
      return (t >= o['>'] && t <= o['<']) ? true : false;
    }
    if(u !== o['>'] && t >= o['>']) { return true; }
    if(u !== o['<'] && t <= o['<']) { return true; }
    return false;
  };

  String.hash = function(s: string, c?: number): number | undefined {
    if(typeof s !== 'string') { return; }
    c = c || 0; // CPU schedule hashing by
    if(!s.length) { return c; }
    for(let i = 0, l = s.length, n: number; i < l; ++i) {
      n = s.charCodeAt(i);
      c = ((c << 5) - c) + n;
      c |= 0;
    }
    return c;
  };

  // Object extensions
  const has = Object.prototype.hasOwnProperty;
  
  Object.plain = function(o: any): boolean {
    return o ? (o instanceof Object && o.constructor === Object) || 
      Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)?.[1] === 'Object' : false;
  };

  Object.empty = function(o: any, n?: string[]): boolean {
    for(const k in o) { 
      if(has.call(o, k) && (!n || -1 === n.indexOf(k))) { 
        return false; 
      } 
    }
    return true;
  };

  Object.keys = Object.keys || function(o: any): string[] {
    const l: string[] = [];
    for(const k in o) { 
      if(has.call(o, k)) { 
        l.push(k); 
      } 
    }
    return l;
  };

  // setTimeout enhancements
  (() => {
    const u = undefined;
    let sT = setTimeout as any, l = 0, c = 0;
    const sI = (typeof setImmediate !== '' + u && setImmediate) || (function() {
      let c: any, f: any;
      if(typeof MessageChannel == '' + u) { return sT; }
      (c = new MessageChannel()).port1.onmessage = function(e: any) { 
        '' == e.data && f(); 
      };
      return function(q: any) { 
        f = q; 
        c.port2.postMessage(''); 
      };
    }());
    
    const check = sT.check = sT.check || (typeof performance !== '' + u && performance)
      || { now: function() { return +new Date(); } };
    
    sT.hold = sT.hold || 9; // half a frame benchmarks faster than < 1ms?
    sT.poll = sT.poll || function(f: () => void) {
      if((sT.hold >= (check.now() - l)) && c++ < 3333) { 
        f(); 
        return; 
      }
      sI(function() { l = check.now(); f(); }, c = 0);
    };
  })();

  // setTimeout.turn - threading
  (() => {
    const sT = setTimeout as any;
    const t = sT.turn = sT.turn || function(f: () => void) { 
      1 == s.push(f) && p(T); 
    };
    const s = t.s = [] as Array<() => void>;
    const p = sT.poll;
    let i = 0, f: (() => void) | undefined;
    
    const T = function() {
      if(f = s[i++]) { f(); }
      if(i == s.length || 99 == i) {
        t.s = s.slice(i);
        i = 0;
      }
      if(s.length) { p(T); }
    };
  })();

  // setTimeout.each
  (() => {
    const u = undefined;
    const sT = setTimeout as any;
    const T = sT.turn;
    
    sT.each = sT.each || function(l: any[], f: (item: any) => any, e?: (result?: any) => void, S?: number) {
      S = S || 9;
      (function t() {
        const s = (l || []).splice(0, S);
        const L = s.length;
        if(L) {
          let r: any;
          for(let i = 0; i < L; i++) {
            if(u !== (r = f(s[i]))) { break; }
          }
          if(u === r) { T(t); return; }
          e && e(r);
        }
      })();
    };
  })();
})();

export {};
