import './shim';

interface GunNode {
  _?: {
    '#'?: string;
    '>'?: { [key: string]: number };
  };
  [key: string]: any;
}

interface StateFunction {
  (): number;
  drift: number;
  is(n?: GunNode, k?: string, o?: { [key: string]: number }): number;
  ify(n?: GunNode, k?: string, s?: number, v?: any, soul?: string): GunNode;
}

function State(): number {
  const t = +new Date();
  if (last < t) {
    N = 0;
    last = t + State.drift;
    return last;
  }
  return last = t + ((N += 1) / D) + State.drift;
}

State.drift = 0;

const NI = -Infinity;
let N = 0;
const D = 999;
let last = NI;
const u = undefined;

// WARNING! In the future, on machines that are D times faster than 2016AD machines, 
// you will want to increase D by another several orders of magnitude so the processing 
// speed never out paces the decimal resolution (increasing an integer effects the state accuracy).

State.is = function(n?: GunNode, k?: string, o?: { [key: string]: number }): number {
  // convenience function to get the state on a key on a node and return it.
  const tmp = (k && n && n._ && n._['>']) || o;
  if (!tmp) { return NI; }
  return ('number' == typeof (tmp as any)[k!]) ? (tmp as any)[k!] : NI;
};

State.ify = function(n?: GunNode, k?: string, s?: number, v?: any, soul?: string): GunNode {
  // put a key's state on a node.
  n = n || {}; // safety check or init.
  n._ = n._ || {};
  if (soul) { n._['#'] = soul; } // set a soul if specified.
  const tmp = n._['>'] || (n._['>'] = {}); // grab the states data.
  if (u !== k && k !== '_') {
    if ('number' == typeof s) { tmp[k] = s; } // add the valid state.
    if (u !== v) { n[k] = v; } // Note: Not its job to check for valid values!
  }
  return n;
};

export = State as StateFunction;
