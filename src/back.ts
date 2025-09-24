import Gun = require('./root');

interface BackContext {
  back?: BackContext;
  root?: BackContext;
  $?: any;
  [key: string]: any;
}

// Add back method to Gun chain
interface GunChain {
  back(n?: number | string | string[] | ((ctx: BackContext, opt?: any) => any), opt?: any): any;
}

Gun.chain.back = function(this: any, n?: number | string | string[] | ((ctx: BackContext, opt?: any) => any), opt?: any): any {
  let tmp: any;
  n = n || 1;
  
  if (-1 === n || Infinity === n) {
    return this._.root.$;
  } else if (1 === n) {
    return (this._.back || this._).$;
  }
  
  const gun = this;
  const at = gun._;
  
  if (typeof n === 'string') {
    n = n.split('.');
  }
  
  if (n instanceof Array) {
    let i = 0;
    const l = n.length;
    tmp = at;
    for (i; i < l; i++) {
      tmp = (tmp || empty)[n[i]];
    }
    if (u !== tmp) {
      return opt ? gun : tmp;
    } else if ((tmp = at.back)) {
      return tmp.$.back(n, opt);
    }
    return;
  }
  
  if ('function' == typeof n) {
    let yes: any;
    tmp = { back: at };
    while ((tmp = tmp.back) && u === (yes = n(tmp, opt))) {}
    return yes;
  }
  
  if ('number' == typeof n) {
    return (at.back || at).$.back(n - 1);
  }
  
  return this;
};

const empty = {};
const u = undefined;

export {};
