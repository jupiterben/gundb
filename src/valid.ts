// Valid values are a subset of JSON: null, binary, number (!Infinity), text,
// or a soul relation. Arrays need special algorithms to handle concurrency,
// so they are not supported directly. Use an extension that supports them if
// needed but research their problems first.

interface SoulReference {
  '#': string;
}

type ValidValue = null | string | boolean | number | SoulReference;

function valid(v: any): ValidValue | false {
  // "deletes", nulling out keys.
  return v === null ||
    "string" === typeof v ||
    "boolean" === typeof v ||
    // we want +/- Infinity to be, but JSON does not support it, sad face.
    // can you guess what v === v checks for? ;)
    ("number" === typeof v && v != Infinity && v != -Infinity && v === v) ||
    (!!v && "string" == typeof v["#"] && Object.keys(v).length === 1 && v["#"]) || false;
}

export = valid;
