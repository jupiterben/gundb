// On event emitter generic javascript utility.

interface OntoTag {
  tag: string;
  to: any;
  last?: any;
}

interface OntoHandler {
  next(arg: any): void;
  off?: () => boolean | void;
  to?: any;
  back?: any;
  the?: any;
  on?: any;
  as?: any;
}

interface OntoThis {
  tag?: { [key: string]: any };
}

interface OntoFunction {
  (this: OntoThis, tag?: string, arg?: any | ((arg: any) => void), as?: any): any;
  _: any;
  off: any;
}

function onto(this: OntoThis, tag?: string, arg?: any | ((arg: any) => void), as?: any): any {
  if (!tag) { return { to: onto, tag: '' }; }
  
  const u = undefined;
  const f = 'function' == typeof arg;
  const tagObj = (this.tag || (this.tag = {}))[tag] || (f && (
    this.tag[tag] = {
      tag: tag, 
      to: onto._ = { 
        next: function(arg: any) { 
          const tmp = this.to;
          if (tmp) { tmp.next(arg); }
        }
      }
    }
  ));
  
  if (f) {
    const be: any = {
      off: onto.off || 
      (onto.off = function(this: any) {
        if (this.next === onto._.next) { return true; }
        if (this === this.the.last) {
          this.the.last = this.back;
        }
        this.to.back = this.back;
        this.next = onto._.next;
        this.back.to = this.to;
        if (this.the.last === this.the && this.on && this.on.tag) {
          delete this.on.tag[this.the.tag];
        }
      }),
      to: onto._,
      next: arg as (arg: any) => void,
      the: tagObj,
      on: this,
      as: as,
    };
    
    (be.back = tagObj.last || tagObj as any).to = be;
    return tagObj.last = be;
  }
  
  const tagTo = tagObj.to;
  if (tagTo && u !== arg) { 
    tagTo.next(arg); 
  }
  return tagTo;
}

onto._ = {
  next: function(arg: any) {
    const tmp = this.to;
    if (tmp) { tmp.next(arg); }
  }
};

onto.off = function(this: any) {
  if (this.next === onto._.next) { return true; }
  if (this === this.the.last) {
    this.the.last = this.back;
  }
  this.to.back = this.back;
  this.next = onto._.next;
  this.back.to = this.to;
  if (this.the.last === this.the && this.on && this.on.tag) {
    delete this.on.tag[this.the.tag];
  }
};

export = onto as OntoFunction;
