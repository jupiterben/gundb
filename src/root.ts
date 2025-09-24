import './shim';

interface GunOptions {
  [key: string]: any;
}

interface GunContext {
  $: Gun;
  opt?: GunOptions;
  root?: GunContext;
  graph?: { [soul: string]: any };
  on?: any;
  ask?: any;
  dup?: any;
  once?: number;
  [key: string]: any;
}

interface GunConstructor {
  new (o?: GunOptions): Gun;
  (o?: GunOptions): Gun;
  is(obj: any): boolean;
  version: number;
  chain: any;
  valid: any;
  state: any;
  on: any;
  dup: any;
  ask: any;
  create(at: GunContext): Gun;
  log: any;
  window?: Window;
}

class Gun {
  _: GunContext;

  constructor(o?: GunOptions) {
    if (o instanceof Gun) { 
      return ((this._ = { $: this }) as any).$; 
    }
    if (!(this instanceof Gun)) { 
      return new Gun(o); 
    }
    return Gun.create(this._ = { $: this, opt: o });
  }

  static is(obj: any): boolean {
    return (obj instanceof Gun) || (obj && obj._ && (obj === obj._.$)) || false;
  }

  static version = 0.2020;
  static chain = Gun.prototype;
  static valid: any;
  static state: any;
  static on: any;
  static dup: any;
  static ask: any;

  static create(at: GunContext): Gun {
    at.root = at.root || at;
    at.graph = at.graph || {};
    at.on = at.on || Gun.on;
    at.ask = at.ask || Gun.ask;
    at.dup = at.dup || Gun.dup();
    
    const gun = at.$.opt(at.opt);
    if (!at.once) {
      at.on('in', universe, at);
      at.on('out', universe, at);
      at.on('put', map, at);
      Gun.on('create', at);
      at.on('create', at);
    }
    at.once = 1;
    return gun;
  }

  static log: any;
  static window?: Window;

  // Chain method stub - will be extended by other modules
  toJSON(): void {}
  
  // Opt method stub - will be implemented in chain.js  
  opt(opt?: GunOptions): Gun {
    return this; // placeholder
  }
}

// These will be overridden by the actual implementations
Gun.chain.toJSON = function() {};

// Import dependencies
Gun.valid = require('./valid');
Gun.state = require('./state');
Gun.on = require('./onto');
Gun.dup = require('./dup');
Gun.ask = require('./ask');

// Core universe and map functions (simplified for now)
function universe(this: any, msg: any): any {
  // Implementation will be added later when converting core.js
  if (!msg) { return; }
  // Placeholder implementation
  this.to && this.to.next && this.to.next(msg);
}

function map(this: any, msg: any): any {
  // Implementation will be added later
  this.to && this.to.next && this.to.next(msg);
}

// Global setup
if (typeof window !== "undefined") { 
  (window as any).GUN = (window as any).Gun = Gun;
  Gun.window = window;
}

try { 
  if (typeof module !== "undefined" && module.exports) { 
    module.exports = Gun; 
  } 
} catch(e) {}

// Console setup
(Gun.window || {} as any).console = (Gun.window || {} as any).console || { log: function() {} };
const C = console as any;
C.only = function(i: any, s: any) { 
  return (C.only.i && i === C.only.i && C.only.i++) && (C.log.apply(C, arguments) || s); 
};

Gun.log = function() { 
  return (!Gun.log.off && C.log.apply(C, arguments)), [].slice.call(arguments).join(' '); 
};

Gun.log.once = function(w: string, s: string, o?: any) { 
  return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s); 
};

// Welcome message
Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, please ask for help on http://chat.gun.eco if anything takes you longer than 5min to figure out!");

export = Gun as GunConstructor;
