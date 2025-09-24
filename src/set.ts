import Gun = require('./root');

interface SetOptions {
  item?: any;
  [key: string]: any;
}

(Gun.chain as any).set = function(this: any, item: any, cb?: any, opt?: SetOptions): any {
  const gun = this;
  const root = gun.back(-1);
  let soul: any, tmp: any;
  
  cb = cb || function() {};
  opt = opt || {};
  opt.item = opt.item || item;
  
  if (soul = ((item || '')['_'] || '')['#']) { 
    (item = {})['#'] = soul; // check if node, make link.
  }
  
  if ('string' == typeof (tmp = Gun.valid(item))) { 
    return gun.get(soul = tmp).put(item, cb, opt); // check if link
  }
  
  if (!Gun.is(item)) {
    if (Object.plain(item)) {
      item = root.get(soul = gun.back('opt.uuid')()).put(item);
    }
    return gun.get(soul || root.back('opt.uuid')(7)).put(item, cb, opt);
  }
  
  gun.put(function(go: any) {
    item.get(function(soul: any, o: any, msg: any) { // TODO: BUG! We no longer have this option? & go error not handled?
      if (!soul) { 
        return cb.call(gun, { err: Gun.log('Only a node can be linked! Not "' + msg.put + '"!') }); 
      }
      (tmp = {})[soul] = { '#': soul };
      go(tmp);
    }, true);
  });
  
  return item;
};

export {};
