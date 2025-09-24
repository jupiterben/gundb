// request / response module, for asking and acking messages.
import './onto'; // depends upon onto!

interface AskOptions {
  lack?: number;
}

interface AskThis {
  on?: (id: string, cb?: any, as?: any) => any;
  tag?: { [key: string]: any };
  opt?: AskOptions;
}

interface AskCallback {
  (msg: any, event?: any): void;
  off?: () => void;
  next?: (msg: any) => void;
  err?: any;
}

interface AskMessage {
  '#'?: string;
  [key: string]: any;
}

function ask(this: AskThis, cb: AskCallback | AskMessage | string | null, as?: any): string | boolean | undefined {
  if (!this.on) { return; }
  
  const lack = (this.opt || {}).lack || 9000;
  
  if (!('function' == typeof cb)) {
    if (!cb) { return; }
    
    const id = (cb as AskMessage)['#'] || cb as string;
    const tmp = (this.tag || {})[id];
    
    if (!tmp) { return; }
    
    if (as) {
      const to = this.on(id, as);
      clearTimeout(to.err);
      to.err = setTimeout(function() { to.off(); }, lack);
    }
    return true;
  }
  
  const id = (as && as['#']) || random(9);
  if (!cb) { return id; }
  
  const to = this.on(id, cb, as);
  to.err = to.err || setTimeout(function() { 
    to.off();
    to.next && to.next({ err: "Error: No ACK yet.", lack: true });
  }, lack);
  
  return id;
}

const random = (String as any).random || function(): string { 
  return Math.random().toString(36).slice(2); 
};

export = ask;
