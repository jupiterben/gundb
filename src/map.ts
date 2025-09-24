import Gun = require('./root');

declare global {
  interface String {
    match(t: string, o: any): boolean;
  }
}

interface MapOptions {
  [key: string]: any;
}

interface LexOptions {
  '#'?: any;
  '.'?: any;
  [key: string]: any;
}

// Extend Gun chain with map functionality
const next = (Gun.chain as any).get.next;

(Gun.chain as any).get.next = function(gun: any, lex: any): any {
  let tmp: any;
  if (!Object.plain(lex)) { 
    return (next || noop)(gun, lex); 
  }
  if (tmp = ((tmp = lex['#']) || '')['='] || tmp) { 
    return gun.get(tmp); 
  }
  (tmp = gun.chain()._).lex = lex; // LEX!
  gun.on('in', function(this: any, eve: any) {
    if ((String as any).match(eve.get || (eve.put || '')['.'], lex['.'] || lex['#'] || lex)) {
      tmp.on('in', eve);
    }
    this.to.next(eve);
  });
  return tmp.$;
};

(Gun.chain as any).map = function(this: any, cb?: any, opt?: MapOptions, t?: any): any {
  const gun = this;
  const cat = gun._;
  let lex: LexOptions | undefined, chain: any;
  
  if (Object.plain(cb)) { 
    lex = cb['.'] ? cb : { '.': cb }; 
    cb = u; 
  }
  
  if (!cb) {
    if (chain = cat.each) { return chain; }
    (cat.each = chain = gun.chain())._.lex = lex || chain._.lex || cat.lex;
    chain._.nix = gun.back('nix');
    gun.on('in', map, chain._);
    return chain;
  }
  
  Gun.log.once("mapfn", "Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
  
  chain = gun.chain();
  gun.map().on(function(this: any, data: any, key: any, msg: any, eve: any) {
    const next = (cb || noop).call(this, data, key, msg, eve);
    if (u === next) { return; }
    if (data === next) { return chain._.on('in', msg); }
    if (Gun.is(next)) { return chain._.on('in', next._); }
    const tmp: any = {};
    Object.keys(msg.put).forEach(function(k) { tmp[k] = msg.put[k]; }, tmp);
    tmp['='] = next;
    chain._.on('in', { get: key, put: tmp });
  });
  
  return chain;
};

function map(this: any, msg: any): void {
  this.to.next(msg);
  
  const cat = this.as;
  const gun = msg.$;
  const at = gun._;
  const put = msg.put;
  let tmp: any;
  
  if (!at.soul && !msg.$$) { return; } // this line took hundreds of tries to figure out. It only works if core checks to filter out above chains during link tho. This says "only bother to map on a node" for this layer of the chain. If something is not a node, map should not work.
  if ((tmp = cat.lex) && !(String as any).match(msg.get || (put || '')['.'], tmp['.'] || tmp['#'] || tmp)) { return; }
  Gun.on.link(msg, cat);
}

const noop = function() {};
const event = { stun: noop, off: noop };
const u = undefined;

export {};
