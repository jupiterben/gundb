import './shim';

interface DupOptions {
  max?: number;
  age?: number;
}

interface DupItem {
  was?: number;
  [key: string]: any;
}

interface DupInstance {
  s: { [id: string]: DupItem };
  now?: number;
  to?: any;
  check(id: string): DupItem | false;
  track(id: string): DupItem;
  drop(age?: number): void;
}

interface DupFunction {
  (opt?: DupOptions): DupInstance;
  ed?: (id: string) => void;
}

function Dup(opt?: DupOptions): DupInstance {
  const dup: DupInstance = { s: {} } as DupInstance;
  const s = dup.s;
  opt = opt || { max: 999, age: 1000 * 9 };
  
  dup.check = function(id: string): DupItem | false {
    if (!s[id]) { return false; }
    return dt(id);
  };
  
  const dt = dup.track = function(id: string): DupItem {
    const it = s[id] || (s[id] = {});
    it.was = dup.now = +new Date();
    if (!dup.to) { 
      dup.to = setTimeout(dup.drop, opt!.age! + 9); 
    }
    if ((dt as any).ed) { 
      (dt as any).ed(id); 
    }
    return it;
  };
  
  dup.drop = function(age?: number): void {
    dup.to = null;
    dup.now = +new Date();
    const l = Object.keys(s);
    (console as any).STAT && (console as any).STAT(dup.now, +new Date() - dup.now!, 'dup drop keys');
    
    (setTimeout as any).each(l, function(id: string) {
      const it = s[id];
      if (it && (age || opt!.age!) > (dup.now! - it.was!)) { return; }
      delete s[id];
    }, 0, 99);
  };
  
  return dup;
}

export = Dup as DupFunction;
