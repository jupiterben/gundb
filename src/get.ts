import Gun = require('./root');

interface GetOptions {
  not?: any;
  stun?: any;
  on?: boolean;
  v2020?: boolean;
  as?: any;
  out?: any;
  run?: number;
  hatch?: any;
  wait?: number;
  [key: string]: any;
}

interface GetMessage {
  $?: any;
  $$?: any;
  put?: any;
  get?: any;
  '#'?: string;
  '@'?: string;
  _?: any;
  [key: string]: any;
}

interface ChainContext {
  _: any;
  soul?: any;
  has?: any;
  get?: any;
  put?: any;
  lex?: any;
  err?: any;
  each?: any;
  ask?: any;
  root?: any;
  id?: any;
  any?: any;
  [key: string]: any;
}

(Gun.chain as any).get = function(this: any, key: any, cb?: any, as?: any): any {
  let gun: any, tmp: any;
  
  if (typeof key === 'string') {
    if (key.length == 0) {
      (gun = this.chain())._.err = { err: Gun.log('0 length key!', key) };
      if (cb) { cb.call(gun, gun._.err); }
      return gun;
    }
    
    const back = this;
    const cat = back._;
    const next = cat.next || empty;
    
    if (!(gun = next[key])) {
      gun = key && cache(key, back);
    }
    gun = gun && gun.$;
  } else if ('function' == typeof key) {
    if (true === cb) { 
      return soul(this, key, cb, as), this; 
    }
    
    gun = this;
    const cat = gun._;
    const opt: GetOptions = cb || {};
    const root = cat.root;
    let id: string;
    
    opt.at = cat;
    opt.ok = key;
    let wait: any = {}; // can we assign this to the at instead, like in once?
    //var path = []; cat.$.back(at => { at.get && path.push(at.get.slice(0,9))}); path = path.reverse().join('.');
    
    function any(this: any, msg: GetMessage, eve?: any, f?: any): void {
      if ((any as any).stun) { return; }
      if ((tmp = root.pass) && !tmp[id]) { return; }
      
      const at = msg.$['_'];
      const sat = (msg.$$ || '')['_'];
      let data = (sat || at).put;
      const odd = (!at.has && !at.soul);
      let test: any = {};
      let link: any;
      
      if (odd || u === data) { // handles non-core
        data = (u === ((tmp = msg.put) || '')['=']) ? 
          (u === (tmp || '')[':']) ? tmp : tmp[':'] : tmp['='];
      }
      
      if (link = ('string' == typeof (tmp = Gun.valid(data)))) {
        data = (u === (tmp = root.$.get(tmp)['_'].put)) ? opt.not ? u : data : tmp;
      }
      
      if (opt.not && u === data) { return; }
      
      if (u === opt.stun) {
        if ((tmp = root.stun) && tmp.on) {
          cat.$.back(function(a: any) { // our chain stunned?
            tmp.on('' + a.id, test = {});
            if ((test.run || 0) < any.id) { return test; } // if there is an earlier stun on gapless parents/self.
          });
          !test.run && tmp.on('' + at.id, test = {}); // this node stunned?
          !test.run && sat && tmp.on('' + sat.id, test = {}); // linked node stunned?
          
          if (any.id > test.run) {
            if (!test.stun || test.stun.end) {
              test.stun = tmp.on('stun');
              test.stun = test.stun && test.stun.last;
            }
            if (test.stun && !test.stun.end) {
              //if(odd && u === data){ return }
              //if(u === msg.put){ return } // "not found" acks will be found if there is stun, so ignore these.
              (test.stun.add || (test.stun.add = {}))[id] = function() { any(msg, eve, 1); }; // add ourself to the stun callback list that is called at end of the write.
              return;
            }
          }
        }
        if (/*odd &&*/ u === data) { f = 0; } // if data not found, keep waiting/trying.
        /*if(f && u === data){
          cat.on('out', opt.out);
          return;
        }*/
        if ((tmp = root.hatch) && !tmp.end && u === opt.hatch && !f) { // quick hack! // What's going on here? Because data is streamed, we get things one by one, but a lot of developers would rather get a callback after each batch instead, so this does that by creating a wait list per chain id that is then called at the end of the batch by the hatch code in the root put listener.
          if (wait[at.$._.id]) { return; }
          wait[at.$._.id] = 1;
          tmp.push(function() { any(msg, eve, 1); });
          return;
        }
        wait = {}; // end quick hack.
      }
      
      // call:
      if (root.pass) { 
        if (root.pass[id + at.id]) { return; } 
        root.pass[id + at.id] = 1; 
      }
      
      if (opt.on) { 
        opt.ok.call(at.$, data, at.get, msg, eve || any); 
        return; 
      } // TODO: Also consider breaking `this` since a lot of people do `=>` these days and `.call(` has slower performance.
      
      if (opt.v2020) { 
        opt.ok(msg, eve || any); 
        return; 
      }
      
      Object.keys(msg).forEach(function(k) { tmp[k] = msg[k]; }, tmp = {}); 
      msg = tmp; 
      msg.put = data; // 2019 COMPATIBILITY! TODO: GET RID OF THIS!
      opt.ok.call(opt.as, msg, eve || any); // is this the right
    }
    
    any.at = cat;
    //(cat.any||(cat.any=function(msg){ setTimeout.each(Object.keys(cat.any||''), function(act){ (act = cat.any[act]) && act(msg) },0,99) }))[id = String.random(7)] = any; // maybe switch to this in future?
    (cat.any || (cat.any = {}))[id = (String as any).random(7)] = any;
    any.off = function() { 
      (any as any).stun = 1; 
      if (!cat.any) { return; } 
      delete cat.any[id]; 
    };
    any.rid = rid; // logic from old version, can we clean it up now?
    any.id = opt.run || ++root.once; // used in callback to check if we are earlier than a write. // will this ever cause an integer overflow?
    tmp = root.pass; 
    (root.pass = {})[id] = 1; // Explanation: test trade-offs want to prevent recursion so we add/remove pass flag as it gets fulfilled to not repeat, however map map needs many pass flags - how do we reconcile?
    opt.out = opt.out || { get: {} };
    cat.on('out', opt.out);
    root.pass = tmp;
    return gun;
  } else if ('number' == typeof key) {
    return this.get('' + key, cb, as);
  } else if ('string' == typeof (tmp = valid(key))) {
    return this.get(tmp, cb, as);
  } else if (tmp = (this.get as any).next) {
    gun = tmp(this, key);
  }
  
  if (!gun) {
    (gun = this.chain())._.err = { err: Gun.log('Invalid get request!', key) }; // CLEAN UP
    if (cb) { cb.call(gun, gun._.err); }
    return gun;
  }
  
  if (cb && 'function' == typeof cb) {
    gun.get(cb, as);
  }
  
  return gun;
};

function cache(key: string, back: any): any {
  const cat = back._;
  let next = cat.next;
  const gun = back.chain();
  const at = gun._;
  
  if (!next) { next = cat.next = {}; }
  next[at.get = key] = at;
  
  if (back === cat.root.$) {
    at.soul = key;
    //at.put = {};
  } else if (cat.soul || cat.has) {
    at.has = key;
    //if(obj_has(cat.put, key)){
    //at.put = cat.put[key];
    //}
  }
  return at;
}

function soul(gun: any, cb: any, opt: any, as: any): void {
  const cat = gun._;
  let acks = 0;
  let tmp: any;
  
  if (tmp = cat.soul || cat.link) { 
    return cb(tmp, as, cat); 
  }
  
  if (cat.jam) { 
    return cat.jam.push([cb, as]); 
  }
  
  cat.jam = [[cb, as]];
  gun.get(function go(this: any, msg: any, eve: any) {
    if (u === msg.put && !cat.root.opt.super && (tmp = Object.keys(cat.root.opt.peers).length) && ++acks <= tmp) { // TODO: super should not be in core code, bring AXE up into core instead to fix? // TODO: .keys( is slow
      return;
    }
    eve.rid(msg);
    const at = ((msg.$) && msg.$['_']) || {};
    let i = 0;
    let as: any;
    tmp = cat.jam; 
    delete cat.jam; // tmp = cat.jam.splice(0, 100);
    //if(tmp.length){ process.nextTick(function(){ go(msg, eve) }) }
    while (as = tmp[i++]) { //Gun.obj.map(tmp, function(as, cb){
      const cb = as[0];
      let id: any;
      as = as[1];
      cb && cb(id = at.link || at.soul || Gun.valid(msg.put) || ((msg.put || {})['_'] || {})['#'], as, msg, eve);
    } //);
  }, { out: { get: { '.': true } } });
  return gun;
}

function rid(this: any, at: any): any {
  const cat = this.at || this.on;
  if (!at || cat.soul || cat.has) { return this.off(); }
  if (!(at = (at = (at = at.$ || at)['_'] || at).id)) { return; }
  const map = cat.map;
  let tmp: any, seen: any;
  //if(!map || !(tmp = map[at]) || !(tmp = tmp.at)){ return }
  if (tmp = (seen = this.seen || (this.seen = {}))[at]) { return true; }
  seen[at] = true;
  return;
  //tmp.echo[cat.id] = {}; // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
  //obj.del(map, at); // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
  return;
}

const empty = {};
const valid = Gun.valid;
const u = undefined;

export {};
