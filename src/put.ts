import Gun = require('./root');

interface PutOptions {
  ack?: any;
  via?: any;
  data?: any;
  soul?: string;
  state?: number;
  run?: number;
  root?: any;
  $?: any;
  todo?: any[];
  turn?: any;
  ran?: any;
  out?: any;
  graph?: any;
  seen?: any[];
  wait?: any;
  end?: boolean;
  err?: any;
  stun?: any;
  opt?: any;
  ok?: any;
  acks?: number;
  [key: string]: any;
}

interface PutMessage {
  '#'?: string;
  '@'?: string;
  put?: any;
  ok?: any;
  err?: any;
  $?: any;
  _?: any;
  DBG?: any;
  [key: string]: any;
}

(Gun.chain as any).put = function(this: any, data: any, cb?: any, as?: PutOptions): any { // I rewrote it :)
  const gun = this;
  const at = gun._;
  const root = at.root;
  
  as = as || {};
  as.root = at.root;
  as.run || (as.run = root.once);
  stun(as, at.id); // set a flag for reads to check if this chain is writing.
  as.ack = as.ack || cb;
  as.via = as.via || gun;
  as.data = as.data || data;
  as.soul || (as.soul = at.soul || ('string' == typeof cb && cb));
  const s = as.state = as.state || Gun.state();
  
  if ('function' == typeof data) { 
    data(function(d: any) { as.data = d; gun.put(u, u, as); }); 
    return gun; 
  }
  
  if (!as.soul) { return get(as), gun; }
  
  as.$ = root.$.get(as.soul); // TODO: This may not allow user chaining and similar?
  as.todo = [{ it: as.data, ref: as.$ }];
  as.turn = as.turn || turn;
  as.ran = as.ran || ran;
  //var path = []; as.via.back(at => { at.get && path.push(at.get.slice(0,9)) }); path = path.reverse().join('.');
  // TODO: Perf! We only need to stun chains that are being modified, not necessarily written to.
  
  (function walk() {
    const to = as.todo as any;
    const at = to.pop();
    let d = at.it;
    const cid = at.ref && at.ref._.id;
    let v: any, k: any, cat: any, tmp: any, g: any;
    
    stun(as, at.ref);
    
    if (tmp = at.todo) {
      k = tmp.pop(); 
      d = d[k];
      if (tmp.length) { to.push(at); }
    }
    
    k && (to.path || (to.path = [])).push(k);
    
    if (!(v = valid(d)) && !(g = Gun.is(d))) {
      if (!Object.plain(d)) { 
        ran.err(as, "Invalid data: " + check(d) + " at " + (as.via.back(function(at: any) { 
          at.get && tmp.push(at.get); 
        }, tmp = []) || tmp.join('.')) + '.' + (to.path || []).join('.')); 
        return; 
      }
      const seen = as.seen || (as.seen = []);
      let i = seen.length;
      while (i--) { 
        if (d === (tmp = seen[i]).it) { 
          v = d = tmp.link; 
          break; 
        } 
      }
    }
    
    if (k && v) { 
      at.node = state_ify(at.node, k, s, d); // handle soul later.
    } else {
      if (!as.seen) { 
        ran.err(as, "Data at root of graph must be a node (an object)."); 
        return; 
      }
      as.seen.push(cat = { 
        it: d, 
        link: {}, 
        todo: g ? [] : Object.keys(d).sort().reverse(), 
        path: (to.path || []).slice(), 
        up: at 
      }); // Any perf reasons to CPU schedule this .keys( ?
      
      at.node = state_ify(at.node, k, s, cat.link);
      !g && cat.todo.length && to.push(cat);
      
      // ---------------
      const id = as.seen.length;
      (as.wait || (as.wait = {}))[id] = '';
      tmp = (cat.ref = (g ? d : k ? at.ref.get(k) : at.ref))['_'];
      (tmp = (d && (d['_'] || '')['#']) || tmp.soul || tmp.link) ? resolve({ soul: tmp }) : 
        cat.ref.get(resolve, { 
          run: as.run, 
          /*hatch: 0,*/ 
          v2020: 1, 
          out: { get: { '.': ' ' } } 
        }); // TODO: BUG! This should be resolve ONLY soul to prevent full data from being loaded. // Fixed now?
      
      //setTimeout(function(){ if(F){ return } console.log("I HAVE NOT BEEN CALLED!", path, id, cat.ref._.id, k) }, 9000); var F; // MAKE SURE TO ADD F = 1 below!
      
      function resolve(msg: any, eve?: any) {
        const end = cat.link['#'];
        if (eve) { eve.off(); eve.rid(msg); } // TODO: Too early! Check all peers ack not found.
        // TODO: BUG maybe? Make sure this does not pick up a link change wipe, that it uses the changign link instead.
        let soul = end || msg.soul || (tmp = (msg.$$ || msg.$)['_'] || '').soul || tmp.link || 
          ((tmp = tmp.put || '')['_'] || '')['#'] || tmp['#'] || 
          (((tmp = msg.put || '') && msg.$$) ? tmp['#'] : (tmp['='] || tmp[':'] || '')['#']);
        
        !end && stun(as, msg.$);
        
        if (!soul && !at.link['#']) { // check soul link above us
          (at.wait || (at.wait = [])).push(function() { resolve(msg, eve); }); // wait
          return;
        }
        
        if (!soul) {
          const soulArray: string[] = [];
          (msg.$$ || msg.$).back(function(at: any) {
            if (tmp = at.soul || at.link) { return soulArray.push(tmp); }
            soulArray.push(at.get);
          });
          soul = soulArray.reverse().join('/');
        }
        
        cat.link['#'] = soul;
        !g && (((as.graph || (as.graph = {}))[soul] = (cat.node || (cat.node = { _: {} })))['_']['#'] = soul);
        delete as.wait[id];
        cat.wait && (setTimeout as any).each(cat.wait, function(cb: any) { cb && cb(); });
        as.ran(as);
      }
      // ---------------
    }
    
    if (!to.length) { return as.ran(as); }
    as.turn(walk);
  })();
  
  return gun;
};

function stun(as: PutOptions, id: any): void {
  if (!id) { return; } 
  id = (id['_'] || '').id || id;
  const run = as.root!.stun || (as.root!.stun = { on: Gun.on });
  const test: any = {};
  let tmp: any;
  
  as.stun || (as.stun = run.on('stun', function() { }));
  
  if (tmp = run.on('' + id)) { 
    tmp.the.last.next(test); 
  }
  
  if (test.run >= as.run!) { return; }
  
  run.on('' + id, function(this: any, test: any) {
    if (as.stun!.end) {
      this.off();
      this.to.next(test);
      return;
    }
    test.run = test.run || as.run;
    test.stun = test.stun || as.stun; 
    return;
    
    if (this.to.to) {
      this.the.last.next(test);
      return;
    }
    test.stun = as.stun;
  });
}

function ran(as: PutOptions): void {
  if (as.err) { ran.end(as.stun, as.root); return; } // move log handle here.
  if (as.todo!.length || as.end || !Object.empty(as.wait)) { return; } 
  as.end = true;
  //(as.retry = function(){ as.acks = 0;
  
  const cat = (as.$!.back(-1)['_']);
  const root = cat.root;
  const ask = cat.ask(function(ack: any) {
    root.on('ack', ack);
    if (ack.err && !ack.lack) { Gun.log(ack); }
    if (++acks > (as.acks || 0)) { this.off(); } // Adjustable ACKs! Only 1 by default.
    if (!as.ack) { return; }
    as.ack(ack, this);
  }, as.opt);
  
  let acks = 0;
  let stun = as.stun;
  let tmp: any;
  
  (tmp = function() { // this is not official yet, but quick solution to hack in for now.
    if (!stun) { return; }
    ran.end(stun, root);
    (setTimeout as any).each(Object.keys(stun = stun.add || ''), function(cb: any) { 
      if (cb = stun[cb]) { cb(); } 
    }); // resume the stunned reads // Any perf reasons to CPU schedule this .keys( ?
  }); (tmp as any).hatch = tmp; // this is not official yet ^
  
  //console.log(1, "PUT", as.run, as.graph);
  if (as.ack && !as.ok) { as.ok = as.acks || 9; } // TODO: In future! Remove this! This is just old API support.
  
  (as.via!['_']).on('out', { 
    put: as.out = as.graph, 
    ok: as.ok && { '@': as.ok + 1 }, 
    opt: as.opt, 
    '#': ask, 
    '_': tmp 
  });
  //})();
}

ran.end = function(stun: any, root: any): void {
  stun.end = noop; // like with the earlier id, cheaper to make this flag a function so below callbacks do not have to do an extra type check.
  if (stun.the.to === stun && stun === stun.the.last) { delete root.stun; }
  stun.off();
};

ran.err = function(as: PutOptions, err: string): void {
  (as.ack || noop).call(as, as.out = { err: as.err = Gun.log(err) });
  as.ran!(as);
};

function get(as: PutOptions): void {
  const at = as.via!['_'];
  let tmp: any;
  
  as.via = as.via!.back(function(at: any) {
    if (at.soul || !at.get) { return at.$; }
    tmp = as.data; 
    (as.data = {})[at.get] = tmp;
  });
  
  if (!as.via || !as.via['_'].soul) {
    as.via = at.root.$.get(((as.data || '')['_'] || '')['#'] || at.$.back('opt.uuid')());
  }
  
  as.via.put(as.data, as.ack, as);

  return;
  
  if (at.get && at.back.soul) {
    tmp = as.data;
    as.via = at.back.$;
    (as.data = {})[at.get] = tmp;
    as.via.put(as.data, as.ack, as);
    return;
  }
}

function check(d: any, tmp?: any): string { 
  return ((d && (tmp = d.constructor) && tmp.name) || typeof d); 
}

const u = undefined;
const empty = {};
const noop = function() {};
const turn = (setTimeout as any).turn;
const valid = Gun.valid;
const state_ify = Gun.state.ify;
const iife = function(fn: any, as?: any) { fn.call(as || empty); };

export {};
