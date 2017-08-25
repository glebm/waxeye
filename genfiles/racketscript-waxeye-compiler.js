var $__runtime_47_third_45_party_47_math_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/third-party/math.js";
  var imul = typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ? Math.imul : function imul(a, b) {
    a = a | 0;
    b = b | 0;
    var c = a & 0xffff;
    var d = b & 0xffff;
    return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0;
  };
  function smi(i32) {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
  }
  return {
    get imul() {
      return imul;
    },
    get smi() {
      return smi;
    }
  };
})();
var $__runtime_47_third_45_party_47_hash_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/third-party/hash.js";
  var smi = ($__runtime_47_third_45_party_47_math_46_js__).smi;
  function hashMix(hashes) {
    var result = 0;
    var $__4 = true;
    var $__5 = false;
    var $__6 = undefined;
    try {
      for (var $__2 = void 0,
          $__1 = (hashes)[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
        var h = $__2.value;
        {
          result += h;
          result += (result << 10);
          result ^= (result >> 6);
        }
      }
    } catch ($__7) {
      $__5 = true;
      $__6 = $__7;
    } finally {
      try {
        if (!$__4 && $__1.return != null) {
          $__1.return();
        }
      } finally {
        if ($__5) {
          throw $__6;
        }
      }
    }
    return result;
  }
  function hash(o, getValue, callHashCode) {
    if (o === false || o === null || o === undefined) {
      return 0;
    }
    if (getValue === true && typeof o.valueOf === 'function') {
      o = o.valueOf();
      if (o === false || o === null || o === undefined) {
        return 0;
      }
    }
    if (o === true) {
      return 1;
    }
    var type = (typeof o === 'undefined' ? 'undefined' : $traceurRuntime.typeof(o));
    if (type === 'number') {
      if (o !== o || o === Infinity) {
        return 0;
      }
      var h = o | 0;
      if (h !== o) {
        h ^= o * 0xFFFFFFFF;
      }
      while (o > 0xFFFFFFFF) {
        o /= 0xFFFFFFFF;
        h ^= o;
      }
      return smi(h);
    }
    if (type === 'string') {
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
    }
    if (callHashCode === true && typeof o.hashCode === 'function') {
      return o.hashCode();
    }
    if (type === 'object') {
      return hashJSObj(o);
    }
    if (typeof o.toString === 'function') {
      return hashString(o.toString());
    }
    throw new Error('Value type ' + type + ' cannot be hashed.');
  }
  function cachedHashString(string) {
    var hash = stringHashCache[string];
    if (hash === undefined) {
      hash = hashString(string);
      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0;
        stringHashCache = {};
      }
      STRING_HASH_CACHE_SIZE++;
      stringHashCache[string] = hash;
    }
    return hash;
  }
  function hashString(string) {
    var hash = 0;
    for (var ii = 0; ii < string.length; ii++) {
      hash = 31 * hash + string.charCodeAt(ii) | 0;
    }
    return smi(hash);
  }
  function hashJSObj(obj) {
    var hash;
    if (usingWeakMap) {
      hash = weakMap.get(obj);
      if (hash !== undefined) {
        return hash;
      }
    }
    hash = obj[UID_HASH_KEY];
    if (hash !== undefined) {
      return hash;
    }
    if (!canDefineProperty) {
      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
      if (hash !== undefined) {
        return hash;
      }
      hash = getIENodeHash(obj);
      if (hash !== undefined) {
        return hash;
      }
    }
    hash = ++objHashUID;
    if (objHashUID & 0x40000000) {
      objHashUID = 0;
    }
    if (usingWeakMap) {
      weakMap.set(obj, hash);
    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
      throw new Error('Non-extensible objects are not allowed as keys.');
    } else if (canDefineProperty) {
      Object.defineProperty(obj, UID_HASH_KEY, {
        'enumerable': false,
        'configurable': false,
        'writable': false,
        'value': hash
      });
    } else if (obj.propertyIsEnumerable !== undefined && obj.propertyIsEnumerable === (obj.constructor.prototype.propertyIsEnumerable)) {
      obj.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
      };
      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
    } else if (obj.nodeType !== undefined) {
      obj[UID_HASH_KEY] = hash;
    } else {
      throw new Error('Unable to set a non-enumerable property on object.');
    }
    return hash;
  }
  var isExtensible = Object.isExtensible;
  var canDefineProperty = (function() {
    try {
      Object.defineProperty({}, '@', {});
      return true;
    } catch (e) {
      return false;
    }
  }());
  function getIENodeHash(node) {
    if (node && node.nodeType > 0) {
      switch (node.nodeType) {
        case 1:
          return node.uniqueID;
        case 9:
          return node.documentElement && node.documentElement.uniqueID;
      }
    }
  }
  var usingWeakMap = typeof WeakMap === 'function';
  var weakMap;
  if (usingWeakMap) {
    weakMap = new WeakMap();
  }
  var objHashUID = 0;
  var UID_HASH_KEY = '__immutablehash__';
  if (typeof Symbol === 'function') {
    UID_HASH_KEY = Symbol(UID_HASH_KEY);
  }
  var STRING_HASH_CACHE_MIN_STRLEN = 16;
  var STRING_HASH_CACHE_MAX_SIZE = 255;
  var STRING_HASH_CACHE_SIZE = 0;
  var stringHashCache = {};
  return {
    get hashMix() {
      return hashMix;
    },
    get hash() {
      return hash;
    },
    get hashString() {
      return hashString;
    },
    get hashJSObj() {
      return hashJSObj;
    }
  };
})();
var $__runtime_47_third_45_party_47_hamt_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/third-party/hamt.js";
  var _typeof = typeof Symbol === "function" && $traceurRuntime.typeof(Symbol.iterator) === "symbol" ? function(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : $traceurRuntime.typeof(obj));
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : (typeof obj === 'undefined' ? 'undefined' : $traceurRuntime.typeof(obj));
  };
  var hamt = {};
  var SIZE = 5;
  var BUCKET_SIZE = Math.pow(2, SIZE);
  var MASK = BUCKET_SIZE - 1;
  var MAX_INDEX_NODE = BUCKET_SIZE / 2;
  var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
  var nothing = {};
  var constant = function constant(x) {
    return function() {
      return x;
    };
  };
  var hash = hamt.hash = function(str) {
    var type = typeof str === 'undefined' ? 'undefined' : _typeof(str);
    if (type === 'number')
      return str;
    if (type !== 'string')
      str += '';
    var hash = 0;
    for (var i = 0,
        len = str.length; i < len; ++i) {
      var c = str.charCodeAt(i);
      hash = (hash << 5) - hash + c | 0;
    }
    return hash;
  };
  var popcount = function popcount(x) {
    x -= x >> 1 & 0x55555555;
    x = (x & 0x33333333) + (x >> 2 & 0x33333333);
    x = x + (x >> 4) & 0x0f0f0f0f;
    x += x >> 8;
    x += x >> 16;
    return x & 0x7f;
  };
  var hashFragment = function hashFragment(shift, h) {
    return h >>> shift & MASK;
  };
  var toBitmap = function toBitmap(x) {
    return 1 << x;
  };
  var fromBitmap = function fromBitmap(bitmap, bit) {
    return popcount(bitmap & bit - 1);
  };
  var arrayUpdate = function arrayUpdate(mutate, at, v, arr) {
    var out = arr;
    if (!mutate) {
      var len = arr.length;
      out = new Array(len);
      for (var i = 0; i < len; ++i) {
        out[i] = arr[i];
      }
    }
    out[at] = v;
    return out;
  };
  var arraySpliceOut = function arraySpliceOut(mutate, at, arr) {
    var newLen = arr.length - 1;
    var i = 0;
    var g = 0;
    var out = arr;
    if (mutate) {
      i = g = at;
    } else {
      out = new Array(newLen);
      while (i < at) {
        out[g++] = arr[i++];
      }
    }
    ++i;
    while (i <= newLen) {
      out[g++] = arr[i++];
    }
    if (mutate) {
      out.length = newLen;
    }
    return out;
  };
  var arraySpliceIn = function arraySpliceIn(mutate, at, v, arr) {
    var len = arr.length;
    if (mutate) {
      var _i = len;
      while (_i >= at) {
        arr[_i--] = arr[_i];
      }
      arr[at] = v;
      return arr;
    }
    var i = 0,
        g = 0;
    var out = new Array(len + 1);
    while (i < at) {
      out[g++] = arr[i++];
    }
    out[at] = v;
    while (i < len) {
      out[++g] = arr[i++];
    }
    return out;
  };
  var LEAF = 1;
  var COLLISION = 2;
  var INDEX = 3;
  var ARRAY = 4;
  var empty = {__hamt_isEmpty: true};
  var isEmptyNode = function isEmptyNode(x) {
    return x === empty || x && x.__hamt_isEmpty;
  };
  var Leaf = function Leaf(edit, hash, key, value) {
    return {
      type: LEAF,
      edit: edit,
      hash: hash,
      key: key,
      value: value,
      _modify: Leaf__modify
    };
  };
  var Collision = function Collision(edit, hash, children) {
    return {
      type: COLLISION,
      edit: edit,
      hash: hash,
      children: children,
      _modify: Collision__modify
    };
  };
  var IndexedNode = function IndexedNode(edit, mask, children) {
    return {
      type: INDEX,
      edit: edit,
      mask: mask,
      children: children,
      _modify: IndexedNode__modify
    };
  };
  var ArrayNode = function ArrayNode(edit, size, children) {
    return {
      type: ARRAY,
      edit: edit,
      size: size,
      children: children,
      _modify: ArrayNode__modify
    };
  };
  var isLeaf = function isLeaf(node) {
    return node === empty || node.type === LEAF || node.type === COLLISION;
  };
  var expand = function expand(edit, frag, child, bitmap, subNodes) {
    var arr = [];
    var bit = bitmap;
    var count = 0;
    for (var i = 0; bit; ++i) {
      if (bit & 1)
        arr[i] = subNodes[count++];
      bit >>>= 1;
    }
    arr[frag] = child;
    return ArrayNode(edit, count + 1, arr);
  };
  var pack = function pack(edit, count, removed, elements) {
    var children = new Array(count - 1);
    var g = 0;
    var bitmap = 0;
    for (var i = 0,
        len = elements.length; i < len; ++i) {
      if (i !== removed) {
        var elem = elements[i];
        if (elem && !isEmptyNode(elem)) {
          children[g++] = elem;
          bitmap |= 1 << i;
        }
      }
    }
    return IndexedNode(edit, bitmap, children);
  };
  var mergeLeaves = function mergeLeaves(edit, shift, h1, n1, h2, n2) {
    if (h1 === h2)
      return Collision(edit, h1, [n2, n1]);
    var subH1 = hashFragment(shift, h1);
    var subH2 = hashFragment(shift, h2);
    return IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), subH1 === subH2 ? [mergeLeaves(edit, shift + SIZE, h1, n1, h2, n2)] : subH1 < subH2 ? [n1, n2] : [n2, n1]);
  };
  var updateCollisionList = function updateCollisionList(mutate, edit, keyEq, h, list, f, k, size) {
    var len = list.length;
    for (var i = 0; i < len; ++i) {
      var child = list[i];
      if (keyEq(k, child.key)) {
        var value = child.value;
        var _newValue = f(value);
        if (_newValue === value)
          return list;
        if (_newValue === nothing) {
          --size.value;
          return arraySpliceOut(mutate, i, list);
        }
        return arrayUpdate(mutate, i, Leaf(edit, h, k, _newValue), list);
      }
    }
    var newValue = f();
    if (newValue === nothing)
      return list;
    ++size.value;
    return arrayUpdate(mutate, len, Leaf(edit, h, k, newValue), list);
  };
  var canEditNode = function canEditNode(edit, node) {
    return edit === node.edit;
  };
  var Leaf__modify = function Leaf__modify(edit, keyEq, shift, f, h, k, size) {
    if (keyEq(k, this.key)) {
      var _v = f(this.value);
      if (_v === this.value)
        return this;
      else if (_v === nothing) {
        --size.value;
        return empty;
      }
      if (canEditNode(edit, this)) {
        this.value = _v;
        return this;
      }
      return Leaf(edit, h, k, _v);
    }
    var v = f();
    if (v === nothing)
      return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
  };
  var Collision__modify = function Collision__modify(edit, keyEq, shift, f, h, k, size) {
    if (h === this.hash) {
      var canEdit = canEditNode(edit, this);
      var list = updateCollisionList(canEdit, edit, keyEq, this.hash, this.children, f, k, size);
      if (list === this.children)
        return this;
      return list.length > 1 ? Collision(edit, this.hash, list) : list[0];
    }
    var v = f();
    if (v === nothing)
      return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
  };
  var IndexedNode__modify = function IndexedNode__modify(edit, keyEq, shift, f, h, k, size) {
    var mask = this.mask;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var bit = toBitmap(frag);
    var indx = fromBitmap(mask, bit);
    var exists = mask & bit;
    var current = exists ? children[indx] : empty;
    var child = current._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (current === child)
      return this;
    var canEdit = canEditNode(edit, this);
    var bitmap = mask;
    var newChildren = void 0;
    if (exists && isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap)
        return empty;
      if (children.length <= 2 && isLeaf(children[indx ^ 1]))
        return children[indx ^ 1];
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else if (!exists && !isEmptyNode(child)) {
      if (children.length >= MAX_INDEX_NODE)
        return expand(edit, frag, child, mask, children);
      bitmap |= bit;
      newChildren = arraySpliceIn(canEdit, indx, child, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return IndexedNode(edit, bitmap, newChildren);
  };
  var ArrayNode__modify = function ArrayNode__modify(edit, keyEq, shift, f, h, k, size) {
    var count = this.size;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var child = children[frag];
    var newChild = (child || empty)._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (child === newChild)
      return this;
    var canEdit = canEditNode(edit, this);
    var newChildren = void 0;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ++count;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      --count;
      if (count <= MIN_ARRAY_NODE)
        return pack(edit, count, frag, children);
      newChildren = arrayUpdate(canEdit, frag, empty, children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return ArrayNode(edit, count, newChildren);
  };
  empty._modify = function(edit, keyEq, shift, f, h, k, size) {
    var v = f();
    if (v === nothing)
      return empty;
    ++size.value;
    return Leaf(edit, h, k, v);
  };
  function Map(editable, edit, config, root, size) {
    this._editable = editable;
    this._edit = edit;
    this._config = config;
    this._root = root;
    this._size = size;
  }
  ;
  Map.prototype.setTree = function(newRoot, newSize) {
    if (this._editable) {
      this._root = newRoot;
      this._size = newSize;
      return this;
    }
    return newRoot === this._root ? this : new Map(this._editable, this._edit, this._config, newRoot, newSize);
  };
  var tryGetHash = hamt.tryGetHash = function(alt, hash, key, map) {
    var node = map._root;
    var shift = 0;
    var keyEq = map._config.keyEq;
    while (true) {
      switch (node.type) {
        case LEAF:
          {
            return keyEq(key, node.key) ? node.value : alt;
          }
        case COLLISION:
          {
            if (hash === node.hash) {
              var children = node.children;
              for (var i = 0,
                  len = children.length; i < len; ++i) {
                var child = children[i];
                if (keyEq(key, child.key))
                  return child.value;
              }
            }
            return alt;
          }
        case INDEX:
          {
            var frag = hashFragment(shift, hash);
            var bit = toBitmap(frag);
            if (node.mask & bit) {
              node = node.children[fromBitmap(node.mask, bit)];
              shift += SIZE;
              break;
            }
            return alt;
          }
        case ARRAY:
          {
            node = node.children[hashFragment(shift, hash)];
            if (node) {
              shift += SIZE;
              break;
            }
            return alt;
          }
        default:
          return alt;
      }
    }
  };
  Map.prototype.tryGetHash = function(alt, hash, key) {
    return tryGetHash(alt, hash, key, this);
  };
  var tryGet = hamt.tryGet = function(alt, key, map) {
    return tryGetHash(alt, map._config.hash(key), key, map);
  };
  Map.prototype.tryGet = function(alt, key) {
    return tryGet(alt, key, this);
  };
  var getHash = hamt.getHash = function(hash, key, map) {
    return tryGetHash(undefined, hash, key, map);
  };
  Map.prototype.getHash = function(hash, key) {
    return getHash(hash, key, this);
  };
  var get = hamt.get = function(key, map) {
    return tryGetHash(undefined, map._config.hash(key), key, map);
  };
  Map.prototype.get = function(key, alt) {
    return tryGet(alt, key, this);
  };
  var hasHash = hamt.has = function(hash, key, map) {
    return tryGetHash(nothing, hash, key, map) !== nothing;
  };
  Map.prototype.hasHash = function(hash, key) {
    return hasHash(hash, key, this);
  };
  var has = hamt.has = function(key, map) {
    return hasHash(map._config.hash(key), key, map);
  };
  Map.prototype.has = function(key) {
    return has(key, this);
  };
  var defKeyCompare = function defKeyCompare(x, y) {
    return x === y;
  };
  hamt.make = function(config) {
    return new Map(0, 0, {
      keyEq: config && config.keyEq || defKeyCompare,
      hash: config && config.hash || hash
    }, empty, 0);
  };
  hamt.empty = hamt.make();
  var isEmpty = hamt.isEmpty = function(map) {
    return map && !!isEmptyNode(map._root);
  };
  Map.prototype.isEmpty = function() {
    return isEmpty(this);
  };
  var modifyHash = hamt.modifyHash = function(f, hash, key, map) {
    var size = {value: map._size};
    var newRoot = map._root._modify(map._editable ? map._edit : NaN, map._config.keyEq, 0, f, hash, key, size);
    return map.setTree(newRoot, size.value);
  };
  Map.prototype.modifyHash = function(hash, key, f) {
    return modifyHash(f, hash, key, this);
  };
  var modify = hamt.modify = function(f, key, map) {
    return modifyHash(f, map._config.hash(key), key, map);
  };
  Map.prototype.modify = function(key, f) {
    return modify(f, key, this);
  };
  var setHash = hamt.setHash = function(hash, key, value, map) {
    return modifyHash(constant(value), hash, key, map);
  };
  Map.prototype.setHash = function(hash, key, value) {
    return setHash(hash, key, value, this);
  };
  var set = hamt.set = function(key, value, map) {
    return setHash(map._config.hash(key), key, value, map);
  };
  Map.prototype.set = function(key, value) {
    return set(key, value, this);
  };
  var del = constant(nothing);
  var removeHash = hamt.removeHash = function(hash, key, map) {
    return modifyHash(del, hash, key, map);
  };
  Map.prototype.removeHash = Map.prototype.deleteHash = function(hash, key) {
    return removeHash(hash, key, this);
  };
  var remove = hamt.remove = function(key, map) {
    return removeHash(map._config.hash(key), key, map);
  };
  Map.prototype.remove = Map.prototype.delete = function(key) {
    return remove(key, this);
  };
  var beginMutation = hamt.beginMutation = function(map) {
    return new Map(map._editable + 1, map._edit + 1, map._config, map._root, map._size);
  };
  Map.prototype.beginMutation = function() {
    return beginMutation(this);
  };
  var endMutation = hamt.endMutation = function(map) {
    map._editable = map._editable && map._editable - 1;
    return map;
  };
  Map.prototype.endMutation = function() {
    return endMutation(this);
  };
  var mutate = hamt.mutate = function(f, map) {
    var transient = beginMutation(map);
    f(transient);
    return endMutation(transient);
  };
  Map.prototype.mutate = function(f) {
    return mutate(f, this);
  };
  var appk = function appk(k) {
    return k && lazyVisitChildren(k[0], k[1], k[2], k[3], k[4]);
  };
  var lazyVisitChildren = function lazyVisitChildren(len, children, i, f, k) {
    while (i < len) {
      var child = children[i++];
      if (child && !isEmptyNode(child))
        return lazyVisit(child, f, [len, children, i, f, k]);
    }
    return appk(k);
  };
  var lazyVisit = function lazyVisit(node, f, k) {
    switch (node.type) {
      case LEAF:
        return {
          value: f(node),
          rest: k
        };
      case COLLISION:
      case ARRAY:
      case INDEX:
        var children = node.children;
        return lazyVisitChildren(children.length, children, 0, f, k);
      default:
        return appk(k);
    }
  };
  var DONE = {done: true};
  function MapIterator(v) {
    this.v = v;
  }
  ;
  MapIterator.prototype.next = function() {
    if (!this.v)
      return DONE;
    var v0 = this.v;
    this.v = appk(v0.rest);
    return v0;
  };
  MapIterator.prototype[Symbol.iterator] = function() {
    return this;
  };
  var visit = function visit(map, f) {
    return new MapIterator(lazyVisit(map._root, f));
  };
  var buildPairs = function buildPairs(x) {
    return [x.key, x.value];
  };
  var entries = hamt.entries = function(map) {
    return visit(map, buildPairs);
  };
  Map.prototype.entries = Map.prototype[Symbol.iterator] = function() {
    return entries(this);
  };
  var buildKeys = function buildKeys(x) {
    return x.key;
  };
  var keys = hamt.keys = function(map) {
    return visit(map, buildKeys);
  };
  Map.prototype.keys = function() {
    return keys(this);
  };
  var buildValues = function buildValues(x) {
    return x.value;
  };
  var values = hamt.values = Map.prototype.values = function(map) {
    return visit(map, buildValues);
  };
  Map.prototype.values = function() {
    return values(this);
  };
  var fold = hamt.fold = function(f, z, m) {
    var root = m._root;
    if (root.type === LEAF)
      return f(z, root.value, root.key);
    var toVisit = [root.children];
    var children = void 0;
    while (children = toVisit.pop()) {
      for (var i = 0,
          len = children.length; i < len; ) {
        var child = children[i++];
        if (child && child.type) {
          if (child.type === LEAF)
            z = f(z, child.value, child.key);
          else
            toVisit.push(child.children);
        }
      }
    }
    return z;
  };
  Map.prototype.fold = function(f, z) {
    return fold(f, z, this);
  };
  var forEach = hamt.forEach = function(f, map) {
    return fold(function(_, value, key) {
      return f(value, key, map);
    }, null, map);
  };
  Map.prototype.forEach = function(f) {
    return forEach(f, this);
  };
  var count = hamt.count = function(map) {
    return map._size;
  };
  Map.prototype.count = function() {
    return count(this);
  };
  Object.defineProperty(Map.prototype, 'size', {get: Map.prototype.count});
  ;
  return {get hamt() {
      return hamt;
    }};
})();
var $__runtime_47_core_47_lib_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/lib.js";
  var hash = ($__runtime_47_third_45_party_47_hash_46_js__).hash;
  ;
  ;
  function isEqual(v1, v2) {
    if (isEqv(v1, v2)) {
      return true;
    } else if ((typeof v1 === 'undefined' ? 'undefined' : $traceurRuntime.typeof(v1)) === 'object' && (typeof v2 === 'undefined' ? 'undefined' : $traceurRuntime.typeof(v2)) === 'object' && v1.constructor !== v2.constructor) {
      return false;
    } else if (v1 instanceof Uint8Array && v2 instanceof Uint8Array && v1.length === v2.length) {
      for (var i = 0; i < v1.length; i++) {
        if (v1[i] !== v2[i])
          return false;
      }
      return true;
    } else if (typeof v1.equals === 'function') {
      return v1.equals(v2) || false;
    } else {
      return false;
    }
  }
  function isEqv(v1, v2) {
    return v1 === v2 || (typeof v1.valueOf === 'function' && typeof v2.valueOf === 'function' && v1.valueOf() === v2.valueOf());
  }
  function isEq(v1, v2) {
    return v1 === v2;
  }
  function hashEq(o) {
    return hash(o, false, false);
  }
  function hashEqv(o) {
    return hash(o, true, false);
  }
  function hashEqual(o) {
    return hash(o, true, true);
  }
  function toString(v) {
    return (v === undefined) ? "#<void>" : v.toString();
  }
  function format1(pattern, args) {
    return pattern.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }
  function format(pattern) {
    for (var args = [],
        $__2 = 1; $__2 < arguments.length; $__2++)
      args[$__2 - 1] = arguments[$__2];
    return format1(pattern, args);
  }
  function attachProcedureArity(fn, arity) {
    if (arity === undefined || typeof arity === 'number' && arity >= 0) {
      fn.__rjs_lambdaType = 'variadic';
      fn.__rjs_arityValue = arity || fn.length;
    } else if (Array.isArray(arity)) {
      fn.__rjs_lambdaType = 'case-lambda';
      fn.__rjs_arityValue = arity;
    } else {
      throw racketCoreError("invalid arity provided");
    }
    return fn;
  }
  function makeError(name) {
    var $__1 = this;
    var e = function(pattern) {
      for (var args = [],
          $__3 = 1; $__3 < arguments.length; $__3++)
        args[$__3 - 1] = arguments[$__3];
      this.name = name;
      this.message = format1(pattern, args);
      this.stack = (new Error()).stack;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = (new Error()).stack;
      }
    };
    e.prototype = Object.create(Error.prototype);
    e.prototype.constructor = e;
    return function() {
      for (var args = [],
          $__4 = 0; $__4 < arguments.length; $__4++)
        args[$__4] = arguments[$__4];
      return new (Function.prototype.bind.apply(e, [$__1].concat(args)));
    };
  }
  var racketCoreError = makeError("RacketCoreError");
  var racketContractError = makeError("RacketContractError");
  function argumentsToArray(args) {
    return Array.prototype.slice.call(args, 0);
  }
  function argumentsSlice(a, i) {
    return [].slice.call(a, i);
  }
  function attachReadOnlyProperty(o, k, v) {
    return Object.defineProperty(o, k, {
      value: v,
      writable: false,
      configurable: false
    });
  }
  function internedMake(f) {
    var cache = {};
    return function(v) {
      if (v in cache) {
        return cache[v];
      }
      var result = f(v);
      cache[v] = result;
      return result;
    };
  }
  return {
    get hashString() {
      return $__runtime_47_third_45_party_47_hash_46_js__.hashString;
    },
    get hamt() {
      return $__runtime_47_third_45_party_47_hamt_46_js__.hamt;
    },
    get isEqual() {
      return isEqual;
    },
    get isEqv() {
      return isEqv;
    },
    get isEq() {
      return isEq;
    },
    get hashEq() {
      return hashEq;
    },
    get hashEqv() {
      return hashEqv;
    },
    get hashEqual() {
      return hashEqual;
    },
    get toString() {
      return toString;
    },
    get format1() {
      return format1;
    },
    get format() {
      return format;
    },
    get attachProcedureArity() {
      return attachProcedureArity;
    },
    get racketCoreError() {
      return racketCoreError;
    },
    get racketContractError() {
      return racketContractError;
    },
    get argumentsToArray() {
      return argumentsToArray;
    },
    get argumentsSlice() {
      return argumentsSlice;
    },
    get attachReadOnlyProperty() {
      return attachReadOnlyProperty;
    },
    get internedMake() {
      return internedMake;
    }
  };
})();
var $__runtime_47_core_47_primitive_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/primitive.js";
  var $ = $__runtime_47_core_47_lib_46_js__;
  var Primitive = function() {
    function Primitive() {
      this.__cachedHashCode = undefined;
    }
    return ($traceurRuntime.createClass)(Primitive, {
      toString: function() {
        throw $.racketCoreError("Not Implemented");
      },
      toRawString: function() {
        return this.toString();
      },
      mutable: function() {
        throw $.racketCoreError("Not Implemented");
      },
      equals: function(v) {
        throw $.racketCoreError("Not Implemented {0}", v);
      },
      eqv: function(v) {
        return this === v;
      },
      valueOf: function() {
        return this;
      },
      hashEqual: function() {
        return $.hashString(this.toRawString());
      },
      hashCode: function() {
        if (this.__cachedHashCode === undefined) {
          this.__cachedHashCode = this.hashEqual();
        }
        return this.__cachedHashCode;
      }
    }, {});
  }();
  function check(v) {
    return (v instanceof Primitive);
  }
  return {
    get Primitive() {
      return Primitive;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_box_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/box.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var $ = $__runtime_47_core_47_lib_46_js__;
  var Box = function($__super) {
    function Box(v) {
      $traceurRuntime.superConstructor(Box).call(this);
      this.value = v;
    }
    return ($traceurRuntime.createClass)(Box, {
      toString: function() {
        return this.value;
      },
      toRawString: function() {
        return this.toString();
      },
      equals: function(v) {
        return $.isEqual(v.value, this.value);
      },
      set: function(v) {
        this.value = v;
      },
      get: function() {
        return this.value;
      }
    }, {}, $__super);
  }(Primitive);
  function make(v) {
    return new Box(v);
  }
  function check(v) {
    return (v instanceof Box);
  }
  return {
    get make() {
      return make;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_pair_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/pair.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var $ = $__runtime_47_core_47_lib_46_js__;
  var Empty = [];
  function isEmpty(v) {
    return (v instanceof Array) && v.length === 0;
  }
  var Pair = function($__super) {
    function Pair(hd, tl) {
      $traceurRuntime.superConstructor(Pair).call(this);
      this.hd = hd;
      this.tl = tl;
      this._listLength = (tl === Empty) ? 1 : isList(tl) && tl._listLength + 1;
    }
    return ($traceurRuntime.createClass)(Pair, {
      toString: function() {
        var result = "(";
        var rest = this;
        while (true) {
          if (check(rest)) {
            var hd = rest.hd;
            result += $.toString(hd);
          } else {
            result += ". " + $.toString(rest);
            break;
          }
          rest = rest.tl;
          if (isEmpty(rest)) {
            break;
          } else {
            result += " ";
          }
        }
        result += ")";
        return result;
      },
      toRawString: function() {
        return "'" + this.toString();
      },
      equals: function(v) {
        if (!check(v)) {
          return false;
        } else if (this._listLength !== v._listLength) {
          return false;
        }
        var hd1 = this.hd;
        var tl1 = this.tl;
        var hd2 = v.hd;
        var tl2 = v.tl;
        while (true) {
          if ($.isEqual(hd1, hd2)) {
            return $.isEqual(tl1, tl2);
          } else {
            return false;
          }
        }
        return true;
      },
      car: function() {
        return this.hd;
      },
      cdr: function() {
        return this.tl;
      }
    }, {}, $__super);
  }(Primitive);
  function check(v) {
    return (v instanceof Pair);
  }
  function make(hd, tl) {
    return new Pair(hd, tl);
  }
  function makeList() {
    for (var items = [],
        $__1 = 0; $__1 < arguments.length; $__1++)
      items[$__1] = arguments[$__1];
    var len = items.length - 1;
    var result = Empty;
    while (len >= 0) {
      result = make(items[len--], result);
    }
    return result;
  }
  function listToArray(lst) {
    var r = [];
    listForEach(lst, function(x) {
      return r.push(x);
    });
    return r;
  }
  function listToString(lst) {
    return listToArray(lst).join('');
  }
  function listFromArray(lst) {
    return makeList.apply(null, lst);
  }
  function listForEach(lst, fn) {
    while (!isEmpty(lst)) {
      fn(lst.hd);
      lst = lst.tl;
    }
  }
  function listFind(lst, fn) {
    while (!isEmpty(lst)) {
      var result = fn(lst.hd);
      if (result) {
        return result;
      }
      lst = lst.tl;
    }
    return false;
  }
  function listMap(lst, fn) {
    var result = [];
    var mapper = function(x) {
      return result.push(result, fn(x));
    };
    listForEach(lst, mapper);
    return listFromArray(result);
  }
  function _listLength(lst) {
    var len = 0;
    while (true) {
      if (isEmpty(lst)) {
        return len;
      }
      len += 1;
      lst = lst.cdr();
    }
    return len;
  }
  function listLength(lst) {
    return (lst === Empty) ? 0 : lst._listLength;
  }
  function isList(v) {
    return v === Empty || (check(v) && v._listLength !== false);
  }
  return {
    get Empty() {
      return Empty;
    },
    get isEmpty() {
      return isEmpty;
    },
    get check() {
      return check;
    },
    get make() {
      return make;
    },
    get makeList() {
      return makeList;
    },
    get listToArray() {
      return listToArray;
    },
    get listToString() {
      return listToString;
    },
    get listFromArray() {
      return listFromArray;
    },
    get listForEach() {
      return listForEach;
    },
    get listFind() {
      return listFind;
    },
    get listMap() {
      return listMap;
    },
    get _listLength() {
      return _listLength;
    },
    get listLength() {
      return listLength;
    },
    get isList() {
      return isList;
    }
  };
})();
var $__runtime_47_core_47_hash_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/hash.js";
  var $ = $__runtime_47_core_47_lib_46_js__;
  var Pair = $__runtime_47_core_47_pair_46_js__;
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var hashConfigs = {
    eq: {
      hash: $.hashEq,
      keyEq: $.isEq
    },
    eqv: {
      hash: $.hashEqv,
      keyEq: $.isEqv
    },
    equal: {
      hash: $.hashEqual,
      keyEq: $.isEqual
    }
  };
  var Hash = function($__super) {
    function Hash(hash, type, mutable) {
      $traceurRuntime.superConstructor(Hash).call(this);
      this._h = hash;
      this._mutable = mutable;
      this._type = type;
    }
    return ($traceurRuntime.createClass)(Hash, {
      toString: function() {
        var $__10,
            $__11;
        var items = "";
        var i = 0;
        var $__5 = true;
        var $__6 = false;
        var $__7 = undefined;
        try {
          for (var $__3 = void 0,
              $__2 = (this._h)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
            var $__9 = $__3.value,
                k = ($__10 = $__9[Symbol.iterator](), ($__11 = $__10.next()).done ? void 0 : $__11.value),
                v = ($__11 = $__10.next()).done ? void 0 : $__11.value;
            {
              items += "(";
              items += $.toString(k);
              items += " . ";
              items += $.toString(v);
              items += ")";
              if (++i != this._h.size) {
                items += " ";
              }
            }
          }
        } catch ($__8) {
          $__6 = true;
          $__7 = $__8;
        } finally {
          try {
            if (!$__5 && $__2.return != null) {
              $__2.return();
            }
          } finally {
            if ($__6) {
              throw $__7;
            }
          }
        }
        var typeSuffix = "";
        if (this._type === "eq" || this._type === "eqv") {
          typeSuffix = this._type;
        }
        return "#hash" + typeSuffix + "(" + items + ")";
      },
      toRawString: function() {
        return "'" + this.toString();
      },
      mutable: function() {
        return this._mutable;
      },
      ref: function(k, fail) {
        var result = this._h.get(k);
        if (result !== undefined) {
          return result;
        } else if (fail !== undefined) {
          return fail;
        } else {
          throw $.racketCoreError("hash-ref", "key not found");
        }
      },
      set: function(k, v) {
        var newH = this._h.set(k, v);
        if (this._mutable) {
          this._h = newH;
        } else {
          return new Hash(newH, this._type, false);
        }
      },
      size: function() {
        return this._h.size;
      },
      equals: function(v) {
        var $__10,
            $__11;
        if (!check(v)) {
          return false;
        }
        if (this._h.size !== v._h.size || this._type !== v._type || this._mutable !== v._mutable) {
          return false;
        }
        var $__5 = true;
        var $__6 = false;
        var $__7 = undefined;
        try {
          for (var $__3 = void 0,
              $__2 = (this._h)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
            var $__9 = $__3.value,
                key = ($__10 = $__9[Symbol.iterator](), ($__11 = $__10.next()).done ? void 0 : $__11.value),
                val = ($__11 = $__10.next()).done ? void 0 : $__11.value;
            {
              var vv = v._h.get(key);
              if (vv === undefined || !$.isEqual(val, vv)) {
                return false;
              }
            }
          }
        } catch ($__8) {
          $__6 = true;
          $__7 = $__8;
        } finally {
          try {
            if (!$__5 && $__2.return != null) {
              $__2.return();
            }
          } finally {
            if ($__6) {
              throw $__7;
            }
          }
        }
        return true;
      },
      type: function() {
        return this._type;
      }
    }, {}, $__super);
  }(Primitive);
  function make(items, type, mutable) {
    var h = items.reduce(function(acc, item) {
      var $__10,
          $__11;
      var $__9 = item,
          k = ($__10 = $__9[Symbol.iterator](), ($__11 = $__10.next()).done ? void 0 : $__11.value),
          v = ($__11 = $__10.next()).done ? void 0 : $__11.value;
      return acc.set(k, v);
    }, $.hamt.make(hashConfigs[type]));
    return new Hash(h, type, mutable);
  }
  function makeEq(items, mutable) {
    return make(items, "eq", mutable);
  }
  function makeEqv(items, mutable) {
    return make(items, "eqv", mutable);
  }
  function makeEqual(items, mutable) {
    return make(items, "equal", mutable);
  }
  function makeFromAssocs(assocs, type, mutable) {
    var items = [];
    Pair.listForEach(assocs, function(item) {
      items.push([item.hd, item.tl]);
    });
    return make(items, type, mutable);
  }
  function map(hash, proc) {
    var result = Pair.Empty;
    hash._h.forEach(function(value, key) {
      result = Pair.make(proc(key, value), result);
    });
    return result;
  }
  function check(v1) {
    return (v1 instanceof Hash);
  }
  return {
    get make() {
      return make;
    },
    get makeEq() {
      return makeEq;
    },
    get makeEqv() {
      return makeEqv;
    },
    get makeEqual() {
      return makeEqual;
    },
    get makeFromAssocs() {
      return makeFromAssocs;
    },
    get map() {
      return map;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_keyword_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/keyword.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var internedMake = ($__runtime_47_core_47_lib_46_js__).internedMake;
  var Keyword = function($__super) {
    function Keyword(v) {
      $traceurRuntime.superConstructor(Keyword).call(this);
      this.v = v;
    }
    return ($traceurRuntime.createClass)(Keyword, {
      toString: function() {
        return this.v;
      },
      toRawString: function() {
        return "'" + this.v;
      },
      equals: function(v) {
        return check(v) && this.v === v.v;
      }
    }, {}, $__super);
  }(Primitive);
  var make = internedMake(function(v) {
    return new Keyword(v);
  });
  function check(v) {
    return (v instanceof Keyword);
  }
  return {
    get make() {
      return make;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_numbers_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/numbers.js";
  var $ = $__runtime_47_core_47_lib_46_js__;
  function add() {
    for (var operands = [],
        $__0 = 0; $__0 < arguments.length; $__0++)
      operands[$__0] = arguments[$__0];
    return [].reduce.call(operands, function(a, b) {
      return a + b;
    }, 0);
  }
  function sub() {
    for (var operands = [],
        $__1 = 0; $__1 < arguments.length; $__1++)
      operands[$__1] = arguments[$__1];
    if (operands.length === 1) {
      return -operands[0];
    } else {
      var result = operands[0];
      for (var i = 1; i < operands.length; ++i) {
        result -= operands[i];
      }
      return result;
    }
  }
  function mul() {
    for (var operands = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      operands[$__2] = arguments[$__2];
    return [].reduce.call(operands, function(a, b) {
      return a * b;
    }, 1);
  }
  function div() {
    for (var operands = [],
        $__3 = 0; $__3 < arguments.length; $__3++)
      operands[$__3] = arguments[$__3];
    if (operands.length === 1) {
      return 1 / operands[0];
    } else {
      var result = operands[0];
      for (var i = 1; i < operands.length; ++i) {
        result /= operands[i];
      }
      return result;
    }
  }
  function compare(cmp, operands) {
    if (operands.length < 2) {
      throw $.racketCoreError("compare {0}", "atleast 2 arguments required");
    }
    for (var i = 1; i < operands.length; i++) {
      if (!cmp(operands[i - 1], operands[i])) {
        return false;
      }
    }
    return true;
  }
  function lt() {
    for (var operands = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      operands[$__4] = arguments[$__4];
    return compare(function(a, b) {
      return a < b;
    }, operands);
  }
  function lte() {
    for (var operands = [],
        $__5 = 0; $__5 < arguments.length; $__5++)
      operands[$__5] = arguments[$__5];
    return compare(function(a, b) {
      return a <= b;
    }, operands);
  }
  function gt() {
    for (var operands = [],
        $__6 = 0; $__6 < arguments.length; $__6++)
      operands[$__6] = arguments[$__6];
    return compare(function(a, b) {
      return a > b;
    }, operands);
  }
  function gte() {
    for (var operands = [],
        $__7 = 0; $__7 < arguments.length; $__7++)
      operands[$__7] = arguments[$__7];
    return compare(function(a, b) {
      return a >= b;
    }, operands);
  }
  function equals() {
    for (var operands = [],
        $__8 = 0; $__8 < arguments.length; $__8++)
      operands[$__8] = arguments[$__8];
    return compare(function(a, b) {
      return a === b;
    }, operands);
  }
  function check(v) {
    return typeof v === 'number';
  }
  return {
    get add() {
      return add;
    },
    get sub() {
      return sub;
    },
    get mul() {
      return mul;
    },
    get div() {
      return div;
    },
    get compare() {
      return compare;
    },
    get lt() {
      return lt;
    },
    get lte() {
      return lte;
    },
    get gt() {
      return gt;
    },
    get gte() {
      return gte;
    },
    get equals() {
      return equals;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_ports_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/ports.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var $ = $__runtime_47_core_47_lib_46_js__;
  var Port = function($__super) {
    function Port(read, write) {
      $traceurRuntime.superConstructor(Port).call(this);
      this.__state = {buffer: []};
      this.__read = read;
      this.__write = write;
    }
    return ($traceurRuntime.createClass)(Port, {
      read: function(n_char) {
        if (this.__read === undefined) {
          throw $.racketCoreError("Not Implemented");
        } else {
          return this.__read(this.__state, n_char);
        }
      },
      write: function(chars) {
        if (this.__write === undefined) {
          throw $.racketCoreError("Not Implemented");
        } else {
          return this.__write(this.__state, chars);
        }
      },
      isOutputPort: function() {
        return this.__write && true;
      },
      isInputPort: function() {
        return this.__read && true;
      }
    }, {}, $__super);
  }(Primitive);
  function makeOutputPort(write) {
    return new Port(undefined, write);
  }
  function makeInputPort(read) {
    return new Port(read);
  }
  function check(v) {
    return (v instanceof Port);
  }
  function checkInputPort(v) {
    return check(v) && v.isInputPort();
  }
  function checkOutputPort(v) {
    return check(v) && v.isOutputPort();
  }
  var OutputStringPort = function() {
    function OutputStringPort() {
      this.__buffer = [];
      this.__cachedString = null;
    }
    return ($traceurRuntime.createClass)(OutputStringPort, {
      write: function(chars) {
        this.__buffer.push(chars);
        this.__cachedString = null;
      },
      getOutputString: function() {
        if (this.__buffer.length > 1) {
          this.__buffer = [this.__buffer.join('')];
        }
        return this.__buffer[0];
      }
    }, {});
  }();
  function openOutputString() {
    return new OutputStringPort();
  }
  function getOutputString(outputStringPort) {
    return outputStringPort.getOutputString();
  }
  var standardOutputPort = makeOutputPort(function(state, chars) {
    var nl_index = chars.lastIndexOf("\n");
    if (nl_index >= 0) {
      var flushchars = state.buffer.join("") + chars.slice(0, nl_index);
      var rest_chars = chars.slice(nl_index + 1);
      state.buffer = [];
      if (rest_chars !== "") {
        state.buffer.push(rest_chars);
      }
      console.log(flushchars);
    } else {
      state.buffer.push(chars);
    }
  });
  return {
    get makeOutputPort() {
      return makeOutputPort;
    },
    get makeInputPort() {
      return makeInputPort;
    },
    get check() {
      return check;
    },
    get checkInputPort() {
      return checkInputPort;
    },
    get checkOutputPort() {
      return checkOutputPort;
    },
    get openOutputString() {
      return openOutputString;
    },
    get getOutputString() {
      return getOutputString;
    },
    get standardOutputPort() {
      return standardOutputPort;
    }
  };
})();
var $__runtime_47_core_47_check_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/check.js";
  function raise(exp) {
    for (var args = [],
        $__0 = 1; $__0 < arguments.length; $__0++)
      args[$__0 - 1] = arguments[$__0];
    throw exp.apply(this, args);
  }
  function truthy(val, exp) {
    var msg = arguments[2] !== (void 0) ? arguments[2] : "";
    if (val !== true) {
      raise(exp, msg);
    }
    return true;
  }
  function falsy(val, exp) {
    var msg = arguments[2] !== (void 0) ? arguments[2] : "";
    return truthy(val === false, exp, msg);
  }
  function type(val, type) {
    var msg = arguments[2] !== (void 0) ? arguments[2] : "";
    if (val instanceof type) {
      return true;
    }
    raise(TypeError, msg + "(" + val + " : " + $traceurRuntime.typeof((val)) + " != " + type.name + ")");
  }
  function eq(val1, val2, exp, msg) {
    if (val1 !== val2) {
      raise(exp, msg);
    }
    return true;
  }
  return {
    get raise() {
      return raise;
    },
    get truthy() {
      return truthy;
    },
    get falsy() {
      return falsy;
    },
    get type() {
      return type;
    },
    get eq() {
      return eq;
    }
  };
})();
var $__runtime_47_core_47_values_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/values.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var racketCoreError = ($__runtime_47_core_47_lib_46_js__).racketCoreError;
  var Values = function($__super) {
    function Values(vals) {
      $traceurRuntime.superConstructor(Values).call(this);
      this.v = vals;
    }
    return ($traceurRuntime.createClass)(Values, {
      toString: function() {
        throw racketCoreError("Not Implemented");
      },
      toRawString: function() {
        return this.toString();
      },
      getAt: function(i) {
        return this.v[i];
      },
      getAll: function() {
        return this.v;
      }
    }, {}, $__super);
  }(Primitive);
  function make(vals) {
    return new Values(vals);
  }
  function check(v) {
    return (v instanceof Values);
  }
  return {
    get make() {
      return make;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_struct_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/struct.js";
  var C = $__runtime_47_core_47_check_46_js__;
  var $ = $__runtime_47_core_47_lib_46_js__;
  var Pair = $__runtime_47_core_47_pair_46_js__;
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var Values = $__runtime_47_core_47_values_46_js__;
  var Struct = function($__super) {
    function Struct(desc, fields) {
      var callerName = arguments[2] !== (void 0) ? arguments[2] : false;
      $traceurRuntime.superConstructor(Struct).call(this);
      this._desc = desc;
      C.eq(fields.length, this._desc._totalInitFields, $.racketCoreError, "arity mismatch");
      var guardLambda = this._desc._options.guard;
      var finalCallerName = callerName || this._desc._options.constructorName || this._desc._options.name;
      if (guardLambda) {
        var guardFields = fields.concat(finalCallerName);
        fields = guardLambda.apply(null, guardFields).getAll();
      }
      this._superStructInstance = false;
      var superType = this._desc.getSuperType();
      if (superType !== false) {
        var superInitFields = fields.slice(0, superType._totalInitFields);
        this._fields = fields.slice(superType._totalInitFields);
        this._superStructInstance = superType.getStructConstructor(finalCallerName).apply(null, superInitFields);
      } else {
        this._fields = fields;
      }
      var autoV = this._desc._options.autoV;
      for (var i = 0; i < this._desc._options.autoFieldCount; i++) {
        this._fields.push(autoV);
      }
    }
    return ($traceurRuntime.createClass)(Struct, {
      toString: function() {
        var fields = "";
        for (var i = 0; i < this._fields.length; i++) {
          fields += this._fields[i].toString();
          if (i !== this._fields.length - 1) {
            fields += " ";
          }
        }
        return "#(struct:" + this._desc.getName() + " " + fields + ")";
      },
      toRawString: function() {
        return this.toString();
      },
      equals: function(v) {
        if (!check(v, this._desc)) {
          return false;
        }
        if (this._desc._options.inspector) {
          return this === v;
        }
        for (var i = 0; i < this._fields.length; i++) {
          if (!$.isEqual(this._fields[i], v._fields[i])) {
            return false;
          }
        }
        return true;
      },
      getField: function(n) {
        if (n >= this._fields.length) {
          throw new Error("TypeError: invalid field at position " + n);
        }
        return this._fields[n];
      },
      setField: function(n, v) {
        C.truthy(n < this._fields.length, $.racketCoreError, "invalid field at position");
        C.falsy(this._desc.isFieldImmutable(n), $.racketCoreError, "field is immutable");
        this._fields[n] = v;
      },
      _maybeFindSuperInstance: function(targetDesc) {
        for (var s = this; s !== false; s = s._superStructInstance) {
          if (s._desc === targetDesc) {
            return s;
          }
        }
        return false;
      }
    }, {}, $__super);
  }(Primitive);
  var StructTypeDescriptor = function($__super) {
    function StructTypeDescriptor(options) {
      $traceurRuntime.superConstructor(StructTypeDescriptor).call(this);
      this._options = options;
      var props = options.props && Pair.listToArray(options.props);
      this._options.props = new Map();
      if (props) {
        var $__8 = true;
        var $__9 = false;
        var $__10 = undefined;
        try {
          for (var $__6 = void 0,
              $__5 = (props)[Symbol.iterator](); !($__8 = ($__6 = $__5.next()).done); $__8 = true) {
            var prop = $__6.value;
            {
              prop.hd.attachToStructTypeDescriptor(this, prop.tl);
            }
          }
        } catch ($__11) {
          $__9 = true;
          $__10 = $__11;
        } finally {
          try {
            if (!$__8 && $__5.return != null) {
              $__5.return();
            }
          } finally {
            if ($__9) {
              throw $__10;
            }
          }
        }
      }
      this._propProcedure = this._findProperty(propProcedure);
      this._options.autoV = this._options.autoV || false;
      this._totalInitFields = options.initFieldCount;
      if (options.superType) {
        this._totalInitFields += options.superType._totalInitFields;
      }
      var immutables = options.immutables || [];
      this._options.immutables = new Set(Pair.listToArray(immutables));
      this._options.immutables.forEach(function(e) {
        if (e < 0 || e >= options.initFieldCount) {
          C.raise("invalid index in immutables provided");
        }
      });
    }
    return ($traceurRuntime.createClass)(StructTypeDescriptor, {
      toString: function() {
        return "#<struct-type:" + this._options.name + ">";
      },
      toRawString: function() {
        return this.toString();
      },
      getName: function() {
        return this._options.name;
      },
      getSuperType: function() {
        return this._options.superType;
      },
      getApplicableStructObject: function(structObject, procSpec) {
        var structfn = function() {
          for (var args = [],
              $__12 = 0; $__12 < arguments.length; $__12++)
            args[$__12] = arguments[$__12];
          var proc;
          if (typeof(procSpec) === 'function') {
            proc = procSpec;
            args.unshift(structObject);
          } else if (Number.isInteger(procSpec)) {
            proc = structObject.getField(procSpec);
          } else {
            throw new Error("ValueError: invalid field at position " + procSpec);
          }
          return proc.apply(null, args);
        };
        structfn.__rjs_struct_object = structObject;
        return structfn;
      },
      maybeStructObject: function(s) {
        var structObject;
        if (s instanceof Struct) {
          return s;
        } else if (s instanceof Function && (s.__rjs_struct_object instanceof Struct)) {
          return s.__rjs_struct_object;
        } else {
          return false;
        }
      },
      getStructConstructor: function() {
        var subtype = arguments[0] !== (void 0) ? arguments[0] : false;
        var $__4 = this;
        return $.attachReadOnlyProperty(function() {
          for (var args = [],
              $__12 = 0; $__12 < arguments.length; $__12++)
            args[$__12] = arguments[$__12];
          var structObject = new Struct($__4, args, subtype);
          var hasPropProc = $__4._propProcedure !== undefined && $__4._propProcedure !== false;
          var hasProcSpec = $__4._options.procSpec !== undefined && $__4._options.procSpec !== false;
          if (!hasPropProc && !hasProcSpec) {
            return structObject;
          } else if (hasPropProc) {
            return $__4.getApplicableStructObject(structObject, $__4._propProcedure);
          } else {
            return $__4.getApplicableStructObject(structObject, $__4._options.procSpec);
          }
        }, "racketProcedureType", "struct-constructor");
      },
      getStructPredicate: function() {
        var $__4 = this;
        return $.attachReadOnlyProperty(function(s) {
          var structObject = $__4.maybeStructObject(s);
          return structObject && structObject._maybeFindSuperInstance($__4) && true;
        }, "racketProcedureType", "struct-predicate");
      },
      getStructAccessor: function() {
        var $__4 = this;
        return $.attachReadOnlyProperty(function(s, pos) {
          var structObject = $__4.maybeStructObject(s);
          if (!structObject) {
            C.raise(TypeError, "(" + s + " : " + $traceurRuntime.typeof((s)) + " != " + $__4._options.name + " object)");
          }
          var sobj = structObject._maybeFindSuperInstance($__4);
          if (sobj === false) {
            C.raise($.racketCoreError, "accessor applied to invalid type");
          }
          return sobj.getField(pos);
        }, "racketProcedureType", "struct-accessor");
      },
      getStructMutator: function() {
        var $__4 = this;
        return $.attachReadOnlyProperty(function(s, pos, v) {
          var structObject = $__4.maybeStructObject(s);
          if (!structObject) {
            C.raise(TypeError, "(" + s + " : " + $traceurRuntime.typeof((s)) + " != " + $__4._options.name + " object)");
          }
          var sobj = structObject._maybeFindSuperInstance($__4);
          if (sobj === false) {
            C.raise($.racketCoreError, "mutator applied to invalid type");
          }
          return sobj.setField(pos, v);
        }, "racketProcedureType", "struct-mutator");
      },
      _findProperty: function(prop) {
        for (var desc = this; desc; desc = desc.getSuperType()) {
          var val = desc._options.props.get(prop);
          if (val !== undefined) {
            return val;
          }
        }
        return undefined;
      },
      isFieldImmutable: function(n) {
        return this._options.immutables.has(n);
      }
    }, {make: function(options) {
        return Object.freeze(new StructTypeDescriptor(options));
      }}, $__super);
  }(Primitive);
  var StructTypeProperty = function($__super) {
    function StructTypeProperty(args) {
      $traceurRuntime.superConstructor(StructTypeProperty).call(this);
      this._name = args.name.toString();
      this._guard = args.guard || false;
      this._canImpersonate = args.canImpersonate || false;
      this._supers = (args.supers && Pair.listToArray(args.supers)) || [];
    }
    return ($traceurRuntime.createClass)(StructTypeProperty, {
      toString: function() {
        return "#<struct-type-property:" + this._name + ">";
      },
      toRawString: function() {
        return this.toString();
      },
      getPropertyPredicate: function() {
        var $__4 = this;
        return function(v) {
          if (v instanceof StructTypeDescriptor) {
            var desc = v;
          } else if (v instanceof Struct) {
            var desc = v._desc;
          } else {
            return false;
          }
          return desc._findProperty($__4) !== undefined;
        };
      },
      getPropertyAccessor: function() {
        var $__4 = this;
        return function(v) {
          if (v instanceof StructTypeDescriptor) {
            var desc = v;
          } else if (v instanceof Struct) {
            var desc = v._desc;
          } else {
            C.raise($.racketCoreError, "invalid argument to accessor");
          }
          return desc._findProperty($__4) || C.raise($.racketCoreError, "property not in struct");
        };
      },
      attachToStructTypeDescriptor: function(desc, v) {
        var newV = v;
        if (this._guard) {
          newV = this._guard(v, Pair.listFromArray(structTypeInfo(desc)));
        }
        desc._options.props.set(this, newV);
        this._supers.forEach(function(superEntry) {
          var prop = superEntry.hd;
          var proc = superEntry.tl;
          prop.attachToStructTypeDescriptor(desc, proc(newV));
        });
      }
    }, {make: function(args) {
        return Object.freeze(new StructTypeProperty(args));
      }}, $__super);
  }(Primitive);
  function makeStructTypeProperty(options) {
    var stProp = StructTypeProperty.make(options);
    return Values.make([stProp, stProp.getPropertyPredicate(), stProp.getPropertyAccessor()]);
  }
  function makeStructType(options) {
    var descriptor = new StructTypeDescriptor(options);
    return Values.make([descriptor, descriptor.getStructConstructor(), descriptor.getStructPredicate(), descriptor.getStructAccessor(), descriptor.getStructMutator()]);
  }
  function isStructType(v) {
    return v instanceof StructTypeDescriptor;
  }
  function structTypeInfo(desc) {
    return [desc._options.name, desc._options.initFieldCount, desc._options.autoFieldCount, desc.getStructAccessor(), desc.getStructMutator(), desc._options.immutables, desc._options.superType || false, false];
  }
  function isStructInstance(v) {
    return (v instanceof Struct) || (v instanceof Function) && (v.__rjs_struct_object instanceof Struct);
  }
  function check(v, desc) {
    return isStructInstance(v) && v._desc == desc;
  }
  var propProcedure = makeStructTypeProperty({name: "prop:procedure"}).getAt(0);
  return {
    get makeStructTypeProperty() {
      return makeStructTypeProperty;
    },
    get makeStructType() {
      return makeStructType;
    },
    get isStructType() {
      return isStructType;
    },
    get structTypeInfo() {
      return structTypeInfo;
    },
    get isStructInstance() {
      return isStructInstance;
    },
    get check() {
      return check;
    },
    get propProcedure() {
      return propProcedure;
    }
  };
})();
var $__runtime_47_core_47_symbol_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/symbol.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var internedMake = ($__runtime_47_core_47_lib_46_js__).internedMake;
  var Symbol = function($__super) {
    function Symbol(v) {
      $traceurRuntime.superConstructor(Symbol).call(this);
      this.v = v;
    }
    return ($traceurRuntime.createClass)(Symbol, {
      toString: function() {
        return this.v;
      },
      toRawString: function() {
        return "'" + this.v;
      },
      equals: function(v) {
        return v === this;
      }
    }, {}, $__super);
  }(Primitive);
  var make = internedMake(function(v) {
    return new Symbol(v);
  });
  var makeUninterned = function(v) {
    return new Symbol(v);
  };
  function check(v) {
    return (v instanceof Symbol);
  }
  return {
    get make() {
      return make;
    },
    get makeUninterned() {
      return makeUninterned;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_vector_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/vector.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var $ = $__runtime_47_core_47_lib_46_js__;
  var Vector = function($__super) {
    function Vector(items, mutable) {
      $traceurRuntime.superConstructor(Vector).call(this);
      this.mutable = mutable;
      this.items = items;
    }
    return ($traceurRuntime.createClass)(Vector, {
      toString: function() {
        var items = "";
        for (var i = 0; i < this.items.length; i++) {
          items += this.items[i].toString();
          if (i != this.items.length - 1) {
            items += " ";
          }
        }
        return "#(" + items + ")";
      },
      toRawString: function() {
        return "'" + this.toString();
      },
      mutable: function() {
        return this.mutable;
      },
      ref: function(n) {
        if (n < 0 || n > this.items.length) {
          throw $.racketCoreError("vector-ref", "index out of range");
        }
        return this.items[n];
      },
      set: function(n, v) {
        if (n < 0 || n > this.items.length) {
          throw $.racketCoreError("vector-set", "index out of range");
        } else if (!this.mutable) {
          throw $.racketCoreError("vector-set", "immutable vector");
        }
        this.items[n] = v;
      },
      length: function() {
        return this.items.length;
      },
      equals: function(v) {
        if (!check(v)) {
          return false;
        }
        var items1 = this.items;
        var items2 = v.items;
        if (items1.length != items2.length) {
          return false;
        }
        for (var i = 0; i < items1.length; i++) {
          if (!$.isEqual(items1[i], items2[i])) {
            return false;
          }
        }
        return true;
      }
    }, {}, $__super);
  }(Primitive);
  function make(items, mutable) {
    return new Vector(items, mutable);
  }
  function copy(vec, mutable) {
    return new Vector(vec.items, mutable);
  }
  function makeInit(size, init) {
    var r = new Array(size);
    r.fill(init);
    return new Vector(r, true);
  }
  function check(v1) {
    return (v1 instanceof Vector);
  }
  return {
    get make() {
      return make;
    },
    get copy() {
      return copy;
    },
    get makeInit() {
      return makeInit;
    },
    get check() {
      return check;
    }
  };
})();
var $__runtime_47_core_47_marks_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/marks.js";
  var Pair = $__runtime_47_core_47_pair_46_js__;
  var Symbol = $__runtime_47_core_47_symbol_46_js__;
  var $ = $__runtime_47_core_47_lib_46_js__;
  var __frames = false;
  var __prompts = new Map();
  var __async_callback_wrappers = [];
  var __defaultContinuationPromptTag = makeContinuationPromptTag(Symbol.make("default"));
  var HASH = $.hashEq;
  function init() {
    __frames = Pair.Empty;
    savePrompt(__defaultContinuationPromptTag);
    enterFrame();
  }
  function registerAsynCallbackWrapper(w) {
    __async_callback_wrappers.push(w);
  }
  function defaultContinuationPromptTag() {
    return __defaultContinuationPromptTag;
  }
  init();
  function ContinuationPromptTag(tag) {
    this.tag = tag;
    return this;
  }
  function AbortCurrentContinuation(promptTag, handlerArgs) {
    this.name = "abort-current-continuation";
    this.promptTag = promptTag;
    this.handlerArgs = handlerArgs;
    this.stack = (new Error()).stack;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }
  }
  AbortCurrentContinuation.prototype = Object.create(Error.prototype);
  AbortCurrentContinuation.prototype.constructor = AbortCurrentContinuation;
  function savePrompt(promptTag) {
    var promptVal = __prompts.get(promptTag);
    if (promptVal === undefined) {
      promptVal = [];
      __prompts.set(promptTag, promptVal);
    }
    promptVal.push(__frames.hd);
  }
  function deleteCurrentPrompt(promptTag) {
    var promptVal = __prompts.get(promptTag);
    if (promptVal === undefined) {
      throw $.racketCoreError("No corresponding tag in continuation!");
    }
    promptVal.pop();
    if (promptVal.length === 0) {
      __prompts.delete(promptTag);
    }
  }
  function getPromptFrame(promptTag) {
    if (promptTag === undefined) {
      return promptTag;
    } else {
      var result = __prompts.get(promptTag);
      return (result && result[result.length - 1]) || undefined;
    }
  }
  function makeContinuationPromptTag(sym) {
    return new ContinuationPromptTag(sym);
  }
  function isContinuationPromptTag(tag) {
    return tag instanceof ContinuationPromptTag;
  }
  function callWithContinuationPrompt(proc, promptTag, handler) {
    for (var args = [],
        $__1 = 3; $__1 < arguments.length; $__1++)
      args[$__1 - 3] = arguments[$__1];
    promptTag = promptTag || __defaultContinuationPromptTag;
    try {
      savePrompt(promptTag);
      return proc.apply(null, args);
    } catch (e) {
      if (e instanceof AbortCurrentContinuation && e.promptTag === promptTag) {
        return handler.apply(null, e.handlerArgs);
      } else {
        throw e;
      }
    } finally {
      deleteCurrentPrompt(promptTag);
    }
  }
  function getFrames() {
    return __frames;
  }
  function updateFrame(newFrames, oldFrames) {
    if (__frames !== oldFrames) {
      throw new Error("current frame doesn't match with old frame");
    }
    return __frames = newFrames;
  }
  function enterFrame() {
    __frames = Pair.make({}, __frames);
    return __frames;
  }
  function setMark(key, value) {
    var frame = __frames.hd;
    frame[HASH(key)] = value;
  }
  function getContinuationMarks(promptTag) {
    promptTag = promptTag || __defaultContinuationPromptTag;
    var frames = __frames;
    var promptFrame = getPromptFrame(promptTag);
    if (promptFrame === undefined && promptTag !== __defaultContinuationPromptTag) {
      throw $.racketCoreError("No corresponding tag in continuation!");
    }
    var result = [];
    while (!Pair.isEmpty(frames)) {
      if (frames.hd === promptFrame) {
        break;
      }
      result.push(frames.hd);
      frames = frames.tl;
    }
    return result;
  }
  function getMarks(framesArr, key, promptTag) {
    promptTag = promptTag || __defaultContinuationPromptTag;
    var keyHash = HASH(key);
    var promptFrame = getPromptFrame(promptTag);
    var result = [];
    for (var ii = 0; ii < framesArr.length; ++ii) {
      var fr = framesArr[ii];
      if (keyHash in fr) {
        if (fr === promptFrame) {
          break;
        }
        result.push(fr[keyHash]);
      }
    }
    return Pair.listFromArray(result);
  }
  function getFirstMark(frames, key, noneV) {
    var keyHash = HASH(key);
    return Pair.listFind(frames, function(fr) {
      if (keyHash in fr) {
        return fr[keyHash];
      }
    }) || noneV;
  }
  function wrapWithContext(fn) {
    return (function(currentFrames) {
      var state = {};
      __async_callback_wrappers.forEach(function(w) {
        return w.onCreate(state);
      });
      return function() {
        for (var args = [],
            $__2 = 0; $__2 < arguments.length; $__2++)
          args[$__2] = arguments[$__2];
        init();
        __async_callback_wrappers.forEach(function(w) {
          return w.onInvoke(state);
        });
        try {
          return fn.apply(null, args);
        } finally {
          __frames = undefined;
        }
      };
    })(__frames);
  }
  return {
    get init() {
      return init;
    },
    get registerAsynCallbackWrapper() {
      return registerAsynCallbackWrapper;
    },
    get defaultContinuationPromptTag() {
      return defaultContinuationPromptTag;
    },
    get AbortCurrentContinuation() {
      return AbortCurrentContinuation;
    },
    get makeContinuationPromptTag() {
      return makeContinuationPromptTag;
    },
    get isContinuationPromptTag() {
      return isContinuationPromptTag;
    },
    get callWithContinuationPrompt() {
      return callWithContinuationPrompt;
    },
    get getFrames() {
      return getFrames;
    },
    get updateFrame() {
      return updateFrame;
    },
    get enterFrame() {
      return enterFrame;
    },
    get setMark() {
      return setMark;
    },
    get getContinuationMarks() {
      return getContinuationMarks;
    },
    get getMarks() {
      return getMarks;
    },
    get getFirstMark() {
      return getFirstMark;
    },
    get wrapWithContext() {
      return wrapWithContext;
    }
  };
})();
var $__runtime_47_core_47_mpair_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core/mpair.js";
  var Primitive = ($__runtime_47_core_47_primitive_46_js__).Primitive;
  var $ = $__runtime_47_core_47_lib_46_js__;
  var MPair = function($__super) {
    function MPair(hd, tl) {
      $traceurRuntime.superConstructor(MPair).call(this);
      this.hd = hd;
      this.tl = tl;
      this._listLength = (tl === Empty) ? 1 : isList(tl) && tl._listLength + 1;
    }
    return ($traceurRuntime.createClass)(MPair, {
      toString: function() {
        var result = "(";
        var rest = this;
        while (true) {
          if (check(rest)) {
            var hd = rest.hd;
            result += $.toString(hd);
          } else {
            result += ". " + $.toString(rest);
            break;
          }
          rest = rest.tl;
          if (isEmpty(rest)) {
            break;
          } else {
            result += " ";
          }
        }
        result += ")";
        return result;
      },
      toRawString: function() {
        return "'" + this.toString();
      },
      equals: function(v) {
        if (!check(v)) {
          return false;
        } else if (this._listLength !== v._listLength) {
          return false;
        }
        var hd1 = this.hd;
        var tl1 = this.tl;
        var hd2 = v.hd;
        var tl2 = v.tl;
        while (true) {
          if ($.isEqual(hd1, hd2)) {
            return $.isEqual(tl1, tl2);
          } else {
            return false;
          }
        }
        return true;
      },
      car: function() {
        return this.hd;
      },
      cdr: function() {
        return this.tl;
      },
      setCar: function(v) {
        this.hd = v;
      },
      setCdr: function(v) {
        this.tl = v;
      }
    }, {}, $__super);
  }(Primitive);
  function check(v) {
    return (v instanceof MPair);
  }
  function make(hd, tl) {
    return new MPair(hd, tl);
  }
  return {
    get check() {
      return check;
    },
    get make() {
      return make;
    }
  };
})();
var $__runtime_47_core_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/core.js";
  var Box = $__runtime_47_core_47_box_46_js__;
  var Hash = $__runtime_47_core_47_hash_46_js__;
  var Keyword = $__runtime_47_core_47_keyword_46_js__;
  var Number = $__runtime_47_core_47_numbers_46_js__;
  var Pair = $__runtime_47_core_47_pair_46_js__;
  var Ports = $__runtime_47_core_47_ports_46_js__;
  var Primitive = $__runtime_47_core_47_primitive_46_js__;
  var Struct = $__runtime_47_core_47_struct_46_js__;
  var Symbol = $__runtime_47_core_47_symbol_46_js__;
  var Values = $__runtime_47_core_47_values_46_js__;
  var Vector = $__runtime_47_core_47_vector_46_js__;
  var Marks = $__runtime_47_core_47_marks_46_js__;
  var MPair = $__runtime_47_core_47_mpair_46_js__;
  ;
  ;
  function bitwiseNot(a) {
    return ~a;
  }
  return {
    get Number() {
      return Number;
    },
    get Pair() {
      return Pair;
    },
    get Primitive() {
      return Primitive;
    },
    get Struct() {
      return Struct;
    },
    get Symbol() {
      return Symbol;
    },
    get Keyword() {
      return Keyword;
    },
    get Values() {
      return Values;
    },
    get Vector() {
      return Vector;
    },
    get Hash() {
      return Hash;
    },
    get Box() {
      return Box;
    },
    get Marks() {
      return Marks;
    },
    get Ports() {
      return Ports;
    },
    get MPair() {
      return MPair;
    },
    get toString() {
      return $__runtime_47_core_47_lib_46_js__.toString;
    },
    get format() {
      return $__runtime_47_core_47_lib_46_js__.format;
    },
    get isEq() {
      return $__runtime_47_core_47_lib_46_js__.isEq;
    },
    get isEqv() {
      return $__runtime_47_core_47_lib_46_js__.isEqv;
    },
    get isEqual() {
      return $__runtime_47_core_47_lib_46_js__.isEqual;
    },
    get hashEqual() {
      return $__runtime_47_core_47_lib_46_js__.hashEqual;
    },
    get hashEq() {
      return $__runtime_47_core_47_lib_46_js__.hashEq;
    },
    get hashEqv() {
      return $__runtime_47_core_47_lib_46_js__.hashEqv;
    },
    get argumentsToArray() {
      return $__runtime_47_core_47_lib_46_js__.argumentsToArray;
    },
    get argumentsSlice() {
      return $__runtime_47_core_47_lib_46_js__.argumentsSlice;
    },
    get attachProcedureArity() {
      return $__runtime_47_core_47_lib_46_js__.attachProcedureArity;
    },
    get racketCoreError() {
      return $__runtime_47_core_47_lib_46_js__.racketCoreError;
    },
    get racketContractError() {
      return $__runtime_47_core_47_lib_46_js__.racketContractError;
    },
    get bitwiseNot() {
      return bitwiseNot;
    }
  };
})();
var $__runtime_47_paramz_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/paramz.js";
  var Core = $__runtime_47_core_46_js__;
  var hamt = ($__runtime_47_core_47_lib_46_js__).hamt;
  var Marks = Core.Marks;
  var Box = Core.Box;
  var ParameterizationKey = {};
  var ExceptionHandlerKey = {};
  var __top = undefined;
  function getCurrentParameterization() {
    return Marks.getFirstMark(Marks.getFrames(), ParameterizationKey, false);
  }
  function makeParameter(initValue) {
    var param = function(maybeSetVal) {
      var pv = getCurrentParameterization().get(param, false) || __top.get(param, false);
      if (!pv && maybeSetVal !== undefined) {
        pv = Box.make(initValue);
        __top.set(param, pv);
      }
      if (maybeSetVal === undefined) {
        return (pv && pv.get()) || initValue;
      } else {
        pv.set(maybeSetVal);
      }
    };
    return param;
  }
  function extendParameterization(parameterization) {
    for (var args = [],
        $__9 = 1; $__9 < arguments.length; $__9++)
      args[$__9 - 1] = arguments[$__9];
    var result = parameterization;
    for (var i = 0; i < args.length; i += 2) {
      result = result.set(args[i], Box.make(args[i + 1]));
    }
    return result;
  }
  function copyParameterization(parameterization) {
    var $__11,
        $__12;
    var result = hamt.make();
    var $__5 = true;
    var $__6 = false;
    var $__7 = undefined;
    try {
      for (var $__3 = void 0,
          $__2 = (parameterization)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
        var $__10 = $__3.value,
            key = ($__11 = $__10[Symbol.iterator](), ($__12 = $__11.next()).done ? void 0 : $__12.value),
            val = ($__12 = $__11.next()).done ? void 0 : $__12.value;
        {
          result = result.set(key, Box.make(val.get()));
        }
      }
    } catch ($__8) {
      $__6 = true;
      $__7 = $__8;
    } finally {
      try {
        if (!$__5 && $__2.return != null) {
          $__2.return();
        }
      } finally {
        if ($__6) {
          throw $__7;
        }
      }
    }
    return result;
  }
  (function() {
    var p = getCurrentParameterization();
    if (p !== false) {
      return;
    } else {
      Marks.setMark(ParameterizationKey, hamt.make());
    }
    __top = new Map();
    Marks.registerAsynCallbackWrapper({
      onCreate: function(state) {
        var $__11,
            $__12;
        var paramz = {};
        paramz.top = new Map();
        var $__5 = true;
        var $__6 = false;
        var $__7 = undefined;
        try {
          for (var $__3 = void 0,
              $__2 = (__top)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
            var $__10 = $__3.value,
                key = ($__11 = $__10[Symbol.iterator](), ($__12 = $__11.next()).done ? void 0 : $__12.value),
                val = ($__12 = $__11.next()).done ? void 0 : $__12.value;
            {
              paramz.top.set(key, Box.make(val.get()));
            }
          }
        } catch ($__8) {
          $__6 = true;
          $__7 = $__8;
        } finally {
          try {
            if (!$__5 && $__2.return != null) {
              $__2.return();
            }
          } finally {
            if ($__6) {
              throw $__7;
            }
          }
        }
        paramz.bottom = copyParameterization(Marks.getFirstMark(Marks.getFrames(), ParameterizationKey, false));
        state.paramz = paramz;
      },
      onInvoke: function(state) {
        __top = state.paramz.top;
        Marks.setMark(ParameterizationKey, state.paramz.bottom);
      }
    });
  })();
  return {
    get ParameterizationKey() {
      return ParameterizationKey;
    },
    get ExceptionHandlerKey() {
      return ExceptionHandlerKey;
    },
    get getCurrentParameterization() {
      return getCurrentParameterization;
    },
    get makeParameter() {
      return makeParameter;
    },
    get extendParameterization() {
      return extendParameterization;
    },
    get copyParameterization() {
      return copyParameterization;
    }
  };
})();
var $__runtime_47_kernel_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/kernel.js";
  var Core = $__runtime_47_core_46_js__;
  function format(pattern) {
    for (var args = [],
        $__0 = 1; $__0 < arguments.length; $__0++)
      args[$__0 - 1] = arguments[$__0];
    var matched = 0;
    return pattern.replace(/~[ax]/g, function(match) {
      if (matched >= args.length) {
        throw Core.racketContractError("insufficient pattern arguments");
      }
      switch (match[1]) {
        case 'a':
          return args[matched++];
        case 'x':
          return args[matched++].toString(16);
      }
    });
  }
  function display(v, out) {
    if (v === true) {
      out.write("#t");
    } else if (v === false) {
      out.write("#f");
    } else if (v === undefined || v === null) {
      out.write("#<void>");
    } else if (isBytes(v)) {
      out.write(utf8ToString(v));
    } else {
      out.write(Core.toString(v));
    }
  }
  function print(v, out) {
    if (v === true) {
      out.write("#t");
    } else if (v === false) {
      out.write("#f");
    } else if (v === undefined || v === null) {
      out.write("#<void>");
    } else if (isBytes(v)) {
      out.write(utf8ToString(v));
    } else {
      out.write(Core.toString(v));
    }
  }
  function error() {
    for (var args = [],
        $__1 = 0; $__1 < arguments.length; $__1++)
      args[$__1] = arguments[$__1];
    if (args.length === 1 && Core.Symbol.check(args[0])) {
      throw Core.racketCoreError(args[0].toString());
    } else if (args.length > 0 && typeof args[0] === 'string') {
      throw Core.racketCoreError(args.map(function(v) {
        return v.toString();
      }).join(" "));
    } else if (args.length > 0 && Core.Symbol.check(args[0])) {
      throw Core.racketCoreError(format.apply((void 0), $traceurRuntime.spread([(args[0].toString() + ": " + args[1])], args.slice(2))));
    } else {
      throw Core.racketContractError("error: invalid arguments");
    }
  }
  function random() {
    for (var args = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      args[$__2] = arguments[$__2];
    switch (args.length) {
      case 0:
        return Math.random();
      case 1:
        if (args[0] > 0) {
          return Math.floor(Math.random() * args[0]);
        } else {
          error("random: argument should be positive");
        }
      case 2:
        if (args[0] > 0 && args[1] > args[0]) {
          return Math.floor(args[0] + Math.random() * (args[1] - args[0]));
        } else {
          error("random: invalid arguments");
        }
      default:
        error("random: invalid number of arguments");
    }
  }
  function memv(v, lst) {
    while (Core.Pair.isEmpty(lst) == false) {
      if (Core.isEqv(v, lst.hd)) {
        return lst;
      }
      lst = lst.tl;
      continue;
    }
    return false;
  }
  function memq(v, lst) {
    while (Core.Pair.isEmpty(lst) == false) {
      if (Core.isEq(v, lst.hd)) {
        return lst;
      }
      lst = lst.tl;
      continue;
    }
    return false;
  }
  function memf(f, lst) {
    while (Core.Pair.isEmpty(lst) == false) {
      if (f(lst.hd)) {
        return lst;
      }
      lst = lst.tl;
      continue;
    }
    return false;
  }
  function findf(f, lst) {
    while (Core.Pair.isEmpty(lst) == false) {
      if (f(lst.hd)) {
        return list.hd;
      }
      lst = lst.tl;
      continue;
    }
    return false;
  }
  function sort9(lst, cmp) {
    var arr = Core.Pair.listToArray(lst);
    var x2i = new Map();
    arr.forEach(function(x, i) {
      x2i.set(x, i);
    });
    var srted = arr.sort(function(x, y) {
      if (cmp(x, y)) {
        return -1;
      } else if (cmp(y, x)) {
        return 1;
      } else {
        return x2i.get(x) - x2i.get(y);
      }
    });
    return Core.Pair.listFromArray(srted);
  }
  function assv(k, lst) {
    while (Core.Pair.isEmpty(lst) === false) {
      if (Core.isEqv(k, lst.hd.hd)) {
        return lst.hd;
      }
      lst = lst.tl;
    }
    return false;
  }
  function assq(k, lst) {
    while (Core.Pair.isEmpty(lst) === false) {
      if (Core.isEq(k, lst.hd.hd)) {
        return lst.hd;
      }
      lst = lst.tl;
    }
    return false;
  }
  function assf(f, lst) {
    while (Core.Pair.isEmpty(lst) === false) {
      if (f(lst.hd.hd)) {
        return lst.hd;
      }
      lst = lst.tl;
    }
    return false;
  }
  function isBytes(bs) {
    return bs instanceof Uint8Array;
  }
  function utf8ToString(bs) {
    if (!isBytes(bs)) {
      throw Core.racketContractError("expected bytes");
    }
    return String.fromCharCode.apply(null, bs);
  }
  function stringToUtf8(str) {
    if (!((typeof str === 'undefined' ? 'undefined' : $traceurRuntime.typeof(str))) == 'string') {
      throw Core.racketContractError("expected string");
    }
    return new Uint8Array(Array.prototype.map.call(str, function(x) {
      return x.charCodeAt(0);
    }));
  }
  return {
    get format() {
      return format;
    },
    get display() {
      return display;
    },
    get print() {
      return print;
    },
    get error() {
      return error;
    },
    get random() {
      return random;
    },
    get memv() {
      return memv;
    },
    get memq() {
      return memq;
    },
    get memf() {
      return memf;
    },
    get findf() {
      return findf;
    },
    get sort9() {
      return sort9;
    },
    get assv() {
      return assv;
    },
    get assq() {
      return assq;
    },
    get assf() {
      return assf;
    }
  };
})();
var $__runtime_47_lib_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/lib.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var Paramz = $__runtime_47_paramz_46_js__;
  var Core = $__runtime_47_core_46_js__;
  var Kernel = $__runtime_47_kernel_46_js__;
  var Values = Core.Values;
  var Pair = Core.Pair;
  var default_check_message = "Expected: {0}, Given: {1}, At: {2}";
  var __rjs_quoted__ = {};
  __rjs_quoted__.default_check_message = default_check_message;
  __rjs_quoted__.Core = Core;
  __rjs_quoted__.Pair = Pair;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get Kernel() {
      return Kernel;
    },
    get Core() {
      return Core;
    },
    get Paramz() {
      return Paramz;
    },
    get Values() {
      return Values;
    },
    get Pair() {
      return Pair;
    }
  };
})();
var $__runtime_47_kernel_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/kernel.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M2 = $__runtime_47_lib_46_rkt_46_js__;
  var equal_p = M2.Core.isEqual;
  var eqv_p = M2.Core.isEqv;
  var eq_p = M2.Core.isEq;
  var values = function() {
    var vals73 = M2.Core.argumentsToArray(arguments);
    if (vals73.length === 1 !== false) {
      var if_res10 = vals73[0];
    } else {
      var if_res10 = M2.Values.make(vals73);
    }
    return if_res10;
  };
  var call_with_values = function(generator74, receiver75) {
    var vals76 = generator74();
    if (M2.Values.check(vals76) !== false) {
      var if_res12 = receiver75.apply(this, vals76.getAll());
    } else {
      if (not(eq_p(vals76, undefined) || eq_p(vals76, null)) !== false) {
        var if_res11 = receiver75.apply(this, [vals76]);
      } else {
        var if_res11 = rvoid();
      }
      var if_res12 = if_res11;
    }
    return if_res12;
  };
  var rvoid = function() {
    return null;
  };
  var void_p = function(v77) {
    return (v77 === null) || (v77 === undefined);
  };
  var number_p = M2.Core.Number.check;
  var real_p = M2.Core.Number.check;
  var integer_p = Number.isInteger;
  var zero_p = function(v78) {
    if (number_p(v78) !== false) {
      var if_res13 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", v78, 0);
      var if_res13 = null;
    }
    if_res13;
    return v78 === 0;
  };
  var positive_p = function(v79) {
    if (real_p(v79) !== false) {
      var if_res14 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v79, 0);
      var if_res14 = null;
    }
    if_res14;
    return v79 > 0;
  };
  var negative_p = function(v80) {
    if (real_p(v80) !== false) {
      var if_res15 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v80, 0);
      var if_res15 = null;
    }
    if_res15;
    return v80 < 0;
  };
  var add1 = function(v81) {
    if (number_p(v81) !== false) {
      var if_res16 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", v81, 0);
      var if_res16 = null;
    }
    if_res16;
    return v81 + 1;
  };
  var sub1 = function(v82) {
    if (number_p(v82) !== false) {
      var if_res17 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", v82, 0);
      var if_res17 = null;
    }
    if_res17;
    return v82 - 1;
  };
  var quotient = function(dividend83, divisor84) {
    if (integer_p(dividend83) !== false) {
      var if_res18 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", dividend83, 0);
      var if_res18 = null;
    }
    if_res18;
    if (integer_p(divisor84) !== false) {
      var if_res19 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", divisor84, 1);
      var if_res19 = null;
    }
    if_res19;
    return (dividend83 / divisor84) | 0;
  };
  var even_p = function(v85) {
    if (integer_p(v85) !== false) {
      var if_res20 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", v85, 0);
      var if_res20 = null;
    }
    if_res20;
    return (v85 % 2) === 0;
  };
  var odd_p = function(v86) {
    if (integer_p(v86) !== false) {
      var if_res21 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", v86, 0);
      var if_res21 = null;
    }
    if_res21;
    return not((v86 % 2) === 0);
  };
  var exact_nonnegative_integer_p = function(v87) {
    return Number.isInteger(v87) && (v87 >= 0);
  };
  var exact_integer_p = function(v88) {
    return Number.isInteger(v88);
  };
  var _times_ = M2.Core.Number.mul;
  var _by_ = M2.Core.Number.div;
  var _plus_ = M2.Core.Number.add;
  var _ = M2.Core.Number.sub;
  var _lt_ = M2.Core.Number.lt;
  var _gt_ = M2.Core.Number.gt;
  var _lt__eq_ = M2.Core.Number.lte;
  var _gt__eq_ = M2.Core.Number.gte;
  var _eq_ = M2.Core.Number.equals;
  var floor = function(v89) {
    if (real_p(v89) !== false) {
      var if_res22 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v89, 0);
      var if_res22 = null;
    }
    if_res22;
    return Math.floor(v89);
  };
  var abs = function(v90) {
    if (real_p(v90) !== false) {
      var if_res23 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v90, 0);
      var if_res23 = null;
    }
    if_res23;
    return Math.abs(v90);
  };
  var sin = function(v91) {
    if (real_p(v91) !== false) {
      var if_res24 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v91, 0);
      var if_res24 = null;
    }
    if_res24;
    return Math.sin(v91);
  };
  var cos = function(v92) {
    if (real_p(v92) !== false) {
      var if_res25 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v92, 0);
      var if_res25 = null;
    }
    if_res25;
    return Math.cos(v92);
  };
  var tan = function(v93) {
    if (real_p(v93) !== false) {
      var if_res26 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v93, 0);
      var if_res26 = null;
    }
    if_res26;
    return Math.tan(v93);
  };
  var atan = function(v94) {
    if (real_p(v94) !== false) {
      var if_res27 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v94, 0);
      var if_res27 = null;
    }
    if_res27;
    return Math.atan(v94);
  };
  var ceiling = function(v95) {
    if (real_p(v95) !== false) {
      var if_res28 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v95, 0);
      var if_res28 = null;
    }
    if_res28;
    return Math.ceil(v95);
  };
  var round = function(v96) {
    if (real_p(v96) !== false) {
      var if_res29 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v96, 0);
      var if_res29 = null;
    }
    if_res29;
    return Math.round(v96);
  };
  var min = function(a97, b98) {
    if (real_p(a97) !== false) {
      var if_res30 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", a97, 0);
      var if_res30 = null;
    }
    if_res30;
    if (real_p(b98) !== false) {
      var if_res31 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", b98, 1);
      var if_res31 = null;
    }
    if_res31;
    return Math.min(a97, b98);
  };
  var max = function(a99, b100) {
    if (real_p(a99) !== false) {
      var if_res32 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", a99, 0);
      var if_res32 = null;
    }
    if_res32;
    if (real_p(b100) !== false) {
      var if_res33 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", b100, 1);
      var if_res33 = null;
    }
    if_res33;
    return Math.max(a99, b100);
  };
  var log = function(v101) {
    if (real_p(v101) !== false) {
      var if_res34 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "real?", v101, 0);
      var if_res34 = null;
    }
    if_res34;
    return Math.log(v101);
  };
  var expt = function(w102, z103) {
    if (number_p(w102) !== false) {
      var if_res35 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", w102, 0);
      var if_res35 = null;
    }
    if_res35;
    if (number_p(z103) !== false) {
      var if_res36 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", z103, 1);
      var if_res36 = null;
    }
    if_res36;
    return Math.pow(w102, z103);
  };
  var sqrt = function(v104) {
    if (number_p(v104) !== false) {
      var if_res37 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", v104, 0);
      var if_res37 = null;
    }
    if_res37;
    return Math.sqrt(v104);
  };
  var sqr = function(v105) {
    if (number_p(v105) !== false) {
      var if_res38 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", v105, 0);
      var if_res38 = null;
    }
    if_res38;
    return _times_(v105, v105);
  };
  var remainder = function(a106, b107) {
    if (integer_p(a106) !== false) {
      var if_res39 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", a106, 0);
      var if_res39 = null;
    }
    if_res39;
    if (integer_p(b107) !== false) {
      var if_res40 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", b107, 1);
      var if_res40 = null;
    }
    if_res40;
    return a106 % b107;
  };
  var number__gt_string = function(n108) {
    if (number_p(n108) !== false) {
      var if_res41 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "number?", n108, 0);
      var if_res41 = null;
    }
    if_res41;
    return n108.toString();
  };
  var inexact__gt_exact = function(x109) {
    return x109;
  };
  var exact__gt_inexact = function(x110) {
    return x110;
  };
  var not = function(v111) {
    return equal_p(v111, false) || false;
  };
  var rfalse = false;
  var rtrue = true;
  var false_p = function(v112) {
    return v112 === false;
  };
  var car = function(pair113) {
    if (pair_p(pair113) !== false) {
      var if_res42 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "pair?", pair113, 0);
      var if_res42 = null;
    }
    if_res42;
    return pair113.hd;
  };
  var cdr = function(pair114) {
    if (pair_p(pair114) !== false) {
      var if_res43 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "pair?", pair114, 0);
      var if_res43 = null;
    }
    if_res43;
    return pair114.tl;
  };
  var cons = M2.Pair.make;
  var cons_p = M2.Pair.check;
  var pair_p = M2.Pair.check;
  var caar = function(v115) {
    if ((function(v116) {
      return M2.Core.Pair.check(v116) && pair_p(v116.hd);
    })(v115) !== false) {
      var if_res44 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "(check/pair-of? pair? #t)", v115, 0);
      var if_res44 = null;
    }
    if_res44;
    return v115.hd.hd;
  };
  var cadr = function(v117) {
    if ((function(v118) {
      return M2.Core.Pair.check(v118) && pair_p(v118.tl);
    })(v117) !== false) {
      var if_res45 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "(check/pair-of? #t pair?)", v117, 0);
      var if_res45 = null;
    }
    if_res45;
    return v117.tl.hd;
  };
  var cdar = function(v119) {
    if ((function(v120) {
      return M2.Core.Pair.check(v120) && pair_p(v120.hd);
    })(v119) !== false) {
      var if_res46 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "(check/pair-of? pair? #t)", v119, 0);
      var if_res46 = null;
    }
    if_res46;
    return v119.hd.tl;
  };
  var cddr = function(v121) {
    if ((function(v122) {
      return M2.Core.Pair.check(v122) && pair_p(v122.tl);
    })(v121) !== false) {
      var if_res47 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "(check/pair-of? #t pair?)", v121, 0);
      var if_res47 = null;
    }
    if_res47;
    return v121.tl.tl;
  };
  var caddr = function(v123) {
    if ((function(v124) {
      return M2.Core.Pair.check(v124) && (function(v125) {
        return M2.Core.Pair.check(v125) && pair_p(v125.tl);
      })(v124.tl);
    })(v123) !== false) {
      var if_res48 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "(check/pair-of? #t (check/pair-of? #t pair?))", v123, 0);
      var if_res48 = null;
    }
    if_res48;
    return v123.tl.tl.hd;
  };
  var rnull = M2.Pair.Empty;
  var list = M2.Pair.makeList;
  var null_p = M2.Pair.isEmpty;
  var empty_p = M2.Pair.isEmpty;
  var length = M2.Pair.listLength;
  var list_p = function(v126) {
    if (null_p(v126) !== false) {
      var if_res50 = true;
    } else {
      if (cons_p(v126) !== false) {
        var if_res49 = list_p(v126.cdr());
      } else {
        var if_res49 = false;
      }
      var if_res50 = if_res49;
    }
    return if_res50;
  };
  var reverse = function(lst127) {
    if (list_p(lst127) !== false) {
      var if_res51 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "list?", lst127, 0);
      var if_res51 = null;
    }
    if_res51;
    var loop128 = function(lst129, result130) {
      if (null_p(lst129) !== false) {
        var if_res52 = result130;
      } else {
        var if_res52 = loop128(lst129.tl, M2.Core.Pair.make(lst129.hd, result130));
      }
      return if_res52;
    };
    return loop128(lst127, $rjs_core.Pair.Empty);
  };
  var list_times_ = $rjs_core.attachProcedureArity(function(a0131) {
    var args132 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
    var lst133 = reverse(cons(a0131, args132));
    var loop134 = function(rst135, result136) {
      if (null_p(rst135) !== false) {
        var if_res53 = rst135;
      } else {
        var if_res53 = loop134(cdr(rst135), cons(car(rst135), result136));
      }
      return if_res53;
    };
    return loop134(cdr(lst133), car(lst133));
  });
  var append = function() {
    var result137 = $rjs_core.Pair.Empty;
    var lsts138 = arguments;
    var loop139 = function(i140) {
      if (i140 < lsts138.length !== false) {
        var lst141 = lsts138[i140];
        result137 = foldr(M2.Core.Pair.make, lst141, result137);
        var if_res54 = loop139(i140 + 1);
      } else {
        var if_res54 = rvoid();
      }
      return if_res54;
    };
    loop139(0);
    return result137;
  };
  var for_each = function(lam142) {
    var lsts143 = Array.prototype.slice.call(arguments, 1);
    if (procedure_p(lam142) !== false) {
      var if_res55 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "procedure?", lam142, 0);
      var if_res55 = null;
    }
    if_res55;
    map.apply(null, [lam142].concat(lsts143));
    return null;
  };
  var mcons = function(hd144, tl145) {
    return M2.Core.MPair.make(hd144, tl145);
  };
  var mpair_p = function(v146) {
    return M2.Core.MPair.check(v146);
  };
  var mcar = function(p147) {
    if (mpair_p(p147) !== false) {
      var if_res56 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "mpair?", p147, 0);
      var if_res56 = null;
    }
    if_res56;
    return p147.car();
  };
  var mcdr = function(p148) {
    if (mpair_p(p148) !== false) {
      var if_res57 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "mpair?", p148, 0);
      var if_res57 = null;
    }
    if_res57;
    return p148.cdr();
  };
  var set_mcar_bang_ = function(p149, v150) {
    if (mpair_p(p149) !== false) {
      var if_res58 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "mpair?", p149, 0);
      var if_res58 = null;
    }
    if_res58;
    return p149.setCar(v150);
  };
  var set_mcdr_bang_ = function(p151, v152) {
    if (mpair_p(p151) !== false) {
      var if_res59 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "mpair?", p151, 0);
      var if_res59 = null;
    }
    if_res59;
    return p151.setCdr(v152);
  };
  var make_struct_type = function(name153, super_type154, init_field_count155, auto_field_count156, auto_v157, props158, inspector159, proc_spec160, immutables161, guard162, constructor_name163) {
    return M2.Core.Struct.makeStructType({
      'name': name153.toString(),
      'superType': super_type154,
      'initFieldCount': init_field_count155,
      'autoFieldCount': auto_field_count156,
      'autoV': auto_v157,
      'props': props158,
      'inspector': inspector159,
      'procSpec': proc_spec160,
      'immutables': immutables161,
      'guard': guard162,
      'constructorName': constructor_name163
    });
  };
  var make_struct_field_accessor = function(ref164, index165, field_name166) {
    return function(s167) {
      return ref164(s167, index165);
    };
  };
  var make_struct_field_mutator = function(set168, index169, fieldName170) {
    return function(s171, v172) {
      return set168(s171, index169, v172);
    };
  };
  var make_struct_type_property = function(name173, guard174, supers175, can_impersonate_p176) {
    return M2.Core.Struct.makeStructTypeProperty({
      'name': name173,
      'guard': guard174,
      'supers': supers175,
      'canImpersonate': can_impersonate_p176
    });
  };
  var check_struct_type = function(name177, what178) {
    if (what178 !== false) {
      if (M2.Core.Struct.isStructType(what178) !== false) {
        var if_res60 = rvoid();
      } else {
        throw M2.Core.racketCoreError("not a struct type");
        var if_res60 = null;
      }
      if_res60;
      var if_res61 = what178;
    } else {
      var if_res61 = rvoid();
    }
    return if_res61;
  };
  var struct_type_p = function(v179) {
    return M2.Core.Struct.isStructType(v179);
  };
  var struct_type_info = function(desc180) {
    return M2.Core.Values.make(M2.Core.Struct.structTypeInfo(desc180));
  };
  var vector = function() {
    return M2.Core.Vector.make(M2.Core.argumentsToArray(arguments), true);
  };
  var make_vector = function(size181, v182) {
    if (integer_p(size181) !== false) {
      var if_res62 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", size181, 0);
      var if_res62 = null;
    }
    if_res62;
    return M2.Core.Vector.makeInit(size181, v182 || 0);
  };
  var vector_p = M2.Core.Vector.check;
  var vector_length = function(v183) {
    if (vector_p(v183) !== false) {
      var if_res63 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "vector?", v183, 0);
      var if_res63 = null;
    }
    if_res63;
    return v183.length();
  };
  var vector_ref = function(vec184, i185) {
    if (vector_p(vec184) !== false) {
      var if_res64 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "vector?", vec184, 0);
      var if_res64 = null;
    }
    if_res64;
    if (integer_p(i185) !== false) {
      var if_res65 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", i185, 1);
      var if_res65 = null;
    }
    if_res65;
    return vec184.ref(i185);
  };
  var vector_set_bang_ = function(vec186, i187, v188) {
    if (vector(vec186) !== false) {
      var if_res66 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "vector", vec186, 0);
      var if_res66 = null;
    }
    if_res66;
    if (integer_p(i187) !== false) {
      var if_res67 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "integer?", i187, 1);
      var if_res67 = null;
    }
    if_res67;
    return vec186.set(i187, v188);
  };
  var vector__gt_list = function(vec189) {
    if (vector_p(vec189) !== false) {
      var if_res68 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "vector?", vec189, 0);
      var if_res68 = null;
    }
    if_res68;
    return M2.Core.Pair.listFromArray(vec189.items);
  };
  var vector__gt_immutable_vector = function(vec190) {
    if (vector_p(vec190) !== false) {
      var if_res69 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "vector?", vec190, 0);
      var if_res69 = null;
    }
    if_res69;
    return M2.Core.Vector.copy(vec190, false);
  };
  var hash = function() {
    var kv_times_191 = arguments;
    if ((kv_times_191.length % 2) !== 0 !== false) {
      throw M2.Core.racketContractError("invalid number of arguments");
      var if_res70 = null;
    } else {
      var if_res70 = rvoid();
    }
    if_res70;
    var items192 = [];
    var loop193 = function(i194) {
      if (i194 < kv_times_191.length !== false) {
        items192.push([kv_times_191[i194], kv_times_191[_plus_(i194, 1)]]);
        var if_res71 = loop193(i194 + 2);
      } else {
        var if_res71 = rvoid();
      }
      return if_res71;
    };
    loop193(0);
    return M2.Core.Hash.makeEqual(items192, false);
  };
  var hasheqv = function() {
    var kv_times_195 = arguments;
    if ((kv_times_195.length % 2) !== 0 !== false) {
      throw M2.Core.racketContractError("invalid number of arguments");
      var if_res72 = null;
    } else {
      var if_res72 = rvoid();
    }
    if_res72;
    var items196 = [];
    var loop197 = function(i198) {
      if (i198 < kv_times_195.length !== false) {
        items196.push([kv_times_195[i198], kv_times_195[_plus_(i198, 1)]]);
        var if_res73 = loop197(i198 + 2);
      } else {
        var if_res73 = rvoid();
      }
      return if_res73;
    };
    loop197(0);
    return M2.Core.Hash.makeEqv(items196, false);
  };
  var hasheq = function() {
    var kv_times_199 = arguments;
    if ((kv_times_199.length % 2) !== 0 !== false) {
      throw M2.Core.racketContractError("invalid number of arguments");
      var if_res74 = null;
    } else {
      var if_res74 = rvoid();
    }
    if_res74;
    var items200 = [];
    var loop201 = function(i202) {
      if (i202 < kv_times_199.length !== false) {
        items200.push([kv_times_199[i202], kv_times_199[_plus_(i202, 1)]]);
        var if_res75 = loop201(i202 + 2);
      } else {
        var if_res75 = rvoid();
      }
      return if_res75;
    };
    loop201(0);
    return M2.Core.Hash.makeEq(items200, false);
  };
  var make_hash = function(assocs203) {
    var assocs_times_204 = assocs203 || $rjs_core.Pair.Empty;
    return M2.Core.Hash.makeFromAssocs(assocs_times_204, "equal", true);
  };
  var make_hasheqv = function(assocs205) {
    var assocs_times_206 = assocs205 || $rjs_core.Pair.Empty;
    return M2.Core.Hash.makeFromAssocs(assocs_times_206, "eqv", true);
  };
  var make_hasheq = function(assocs207) {
    var assocs_times_208 = assocs207 || $rjs_core.Pair.Empty;
    return M2.Core.Hash.makeFromAssocs(assocs_times_208, "eq", true);
  };
  var make_immutable_hash = function(assocs209) {
    var assocs_times_210 = assocs209 || $rjs_core.Pair.Empty;
    return M2.Core.Hash.makeFromAssocs(assocs_times_210, "equal", false);
  };
  var make_immutable_hasheqv = function(assocs211) {
    var assocs_times_212 = assocs211 || $rjs_core.Pair.Empty;
    return M2.Core.Hash.makeFromAssocs(assocs_times_212, "eqv", false);
  };
  var make_immutable_hasheq = function(assocs213) {
    var assocs_times_214 = assocs213 || $rjs_core.Pair.Empty;
    return M2.Core.Hash.makeFromAssocs(assocs_times_214, "eq", false);
  };
  var hash_ref = function(h215, k216, fail217) {
    return h215.ref(k216, fail217);
  };
  var hash_set = function(h218, k219, v220) {
    return h218.set(k219, v220);
  };
  var hash_set_bang_ = function(h221, k222, v223) {
    return h221.set(k222, v223);
  };
  var hash_map = function(h224, proc225) {
    return M2.Core.Hash.map(h224, proc225);
  };
  var apply = function(lam226) {
    var args227 = Array.prototype.slice.call(arguments, 1);
    if (procedure_p(lam226) !== false) {
      var if_res76 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "procedure?", lam226, 0);
      var if_res76 = null;
    }
    if_res76;
    var let_result77 = values();
    if (zero_p(args227.length) !== false) {
      throw M2.Core.racketContractError("arity mismatch");
      var if_res81 = null;
    } else {
      if (equal_p(args227.length, 1) !== false) {
        if (null_p(args227[0]) !== false) {
          var if_res79 = rvoid();
        } else {
          if (M2.Core.Pair.check(args227[0]) !== false) {
            var if_res78 = rvoid();
          } else {
            throw M2.Core.racketContractError("expected a {0}, but given {1}", M2.Core.Pair, args227[0]);
            var if_res78 = null;
          }
          var if_res79 = if_res78;
        }
        if_res79;
        var if_res80 = M2.Core.Pair.listToArray(args227[0]);
      } else {
        var if_res80 = args227.concat(M2.Core.Pair.listToArray(args227.pop()));
      }
      var if_res81 = if_res80;
    }
    var final_args228 = if_res81;
    return lam226.apply(null, final_args228);
  };
  var map = function(fn229) {
    var lists230 = Array.prototype.slice.call(arguments, 1);
    if (procedure_p(fn229) !== false) {
      var if_res82 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "procedure?", fn229, 0);
      var if_res82 = null;
    }
    if_res82;
    var let_result83 = values();
    if (_lt__eq_(lists230.length, 0) !== false) {
      var if_res84 = error($rjs_core.Symbol.make("map"), "need at-least two arguments");
    } else {
      var if_res84 = rvoid();
    }
    if_res84;
    var let_result85 = values();
    var lst_len231 = length(lists230[0]);
    var loop232 = function(i233) {
      if (i233 < lists230.length !== false) {
        var v234 = lists230[i233];
        if (eq_p(length(v234), lst_len231) !== false) {
          var if_res86 = rvoid();
        } else {
          var if_res86 = error($rjs_core.Symbol.make("map"), "all input lists must have equal length");
        }
        if_res86;
        var if_res87 = loop232(i233 + 1);
      } else {
        var if_res87 = rvoid();
      }
      return if_res87;
    };
    loop232(1);
    var let_result88 = values();
    var result235 = Array(lst_len231);
    var args236 = Array(lists230.length);
    var loop237 = function(result_i238) {
      if (result_i238 < lst_len231 !== false) {
        var loop239 = function(lst_j240) {
          if (lst_j240 < lists230.length !== false) {
            var lst241 = lists230[lst_j240];
            args236[lst_j240] = lst241.hd;
            lists230[lst_j240] = lst241.tl;
            var if_res89 = loop239(lst_j240 + 1);
          } else {
            var if_res89 = rvoid();
          }
          return if_res89;
        };
        loop239(0);
        result235[result_i238] = fn229.apply(null, args236);
        var if_res90 = loop237(result_i238 + 1);
      } else {
        var if_res90 = rvoid();
      }
      return if_res90;
    };
    loop237(0);
    return M2.Core.Pair.listFromArray(result235);
  };
  var foldl = function(fn242, init243) {
    var lists244 = Array.prototype.slice.call(arguments, 2);
    if (procedure_p(fn242) !== false) {
      var if_res91 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "procedure?", fn242, 0);
      var if_res91 = null;
    }
    if_res91;
    var let_result92 = values();
    if (_lt__eq_(lists244.length, 0) !== false) {
      var if_res93 = error($rjs_core.Symbol.make("foldl"), "need at-least two arguments");
    } else {
      var if_res93 = rvoid();
    }
    if_res93;
    var let_result94 = values();
    var lst_len245 = length(lists244[0]);
    var loop246 = function(i247) {
      if (i247 < lists244.length !== false) {
        var v248 = lists244[i247];
        if (eq_p(length(v248), lst_len245) !== false) {
          var if_res95 = rvoid();
        } else {
          var if_res95 = error($rjs_core.Symbol.make("foldl"), "all input lists must have equal length");
        }
        if_res95;
        var if_res96 = loop246(i247 + 1);
      } else {
        var if_res96 = rvoid();
      }
      return if_res96;
    };
    loop246(1);
    var let_result97 = values();
    var result249 = init243;
    var args250 = Array(lists244.length + 1);
    var loop251 = function(result_i252) {
      if (result_i252 < lst_len245 !== false) {
        var loop253 = function(lst_j254) {
          if (lst_j254 < lists244.length !== false) {
            var lst255 = lists244[lst_j254];
            args250[lst_j254] = lst255.hd;
            lists244[lst_j254] = lst255.tl;
            var if_res98 = loop253(lst_j254 + 1);
          } else {
            var if_res98 = rvoid();
          }
          return if_res98;
        };
        loop253(0);
        args250[lists244.length] = result249;
        result249 = fn242.apply(null, args250);
        var if_res99 = loop251(result_i252 + 1);
      } else {
        var if_res99 = rvoid();
      }
      return if_res99;
    };
    loop251(0);
    return result249;
  };
  var _foldr = function(fn256, init257, lists258) {
    if (null_p(lists258[0]) !== false) {
      var if_res101 = init257;
    } else {
      var args259 = Array(add1(lists258.length));
      var loop260 = function(ii261) {
        if (ii261 < lists258.length !== false) {
          var lst262 = lists258[ii261];
          args259[ii261] = lst262.hd;
          lists258[ii261] = lst262.tl;
          var if_res100 = loop260(ii261 + 1);
        } else {
          var if_res100 = rvoid();
        }
        return if_res100;
      };
      loop260(0);
      args259[lists258.length] = _foldr(fn256, init257, lists258);
      var if_res101 = fn256.apply(null, args259);
    }
    return if_res101;
  };
  var foldr = function(fn263, init264) {
    var lists265 = Array.prototype.slice.call(arguments, 2);
    if (procedure_p(fn263) !== false) {
      var if_res102 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "procedure?", fn263, 0);
      var if_res102 = null;
    }
    if_res102;
    var let_result103 = values();
    if (_lt__eq_(lists265.length, 0) !== false) {
      var if_res104 = error($rjs_core.Symbol.make("foldr"), "need at-least two arguments");
    } else {
      var if_res104 = rvoid();
    }
    if_res104;
    var let_result105 = values();
    var lst_len266 = length(lists265[0]);
    var loop267 = function(i268) {
      if (i268 < lists265.length !== false) {
        var v269 = lists265[i268];
        if (eq_p(length(v269), lst_len266) !== false) {
          var if_res106 = rvoid();
        } else {
          var if_res106 = error($rjs_core.Symbol.make("foldr"), "all input lists must have equal length");
        }
        if_res106;
        var if_res107 = loop267(i268 + 1);
      } else {
        var if_res107 = rvoid();
      }
      return if_res107;
    };
    loop267(1);
    return _foldr(fn263, init264, lists265);
  };
  var cl108 = function(end270) {
    return range(0, end270, 1);
  };
  var cl109 = function(start271, end272) {
    if (_lt_(start271, end272) !== false) {
      var if_res112 = 1;
    } else {
      var if_res112 = -1;
    }
    return range(start271, end272, if_res112);
  };
  var cl110 = function(start273, end274, step275) {
    var result276 = [];
    if (_gt__eq_(step275, 0) && _lt_(step275, end274) !== false) {
      var loop277 = function(i278) {
        if (i278 < end274 !== false) {
          result276.push(i278);
          var if_res113 = loop277(i278 + step275);
        } else {
          var if_res113 = rvoid();
        }
        return if_res113;
      };
      var if_res116 = loop277(start273);
    } else {
      if (_lt__eq_(step275, 0) && _lt_(end274, start273) !== false) {
        var loop279 = function(i280) {
          if (i280 < _(end274) !== false) {
            result276.push(_(i280));
            var if_res114 = loop279(i280 + _(step275));
          } else {
            var if_res114 = rvoid();
          }
          return if_res114;
        };
        var if_res115 = loop279(_(start273));
      } else {
        var if_res115 = rvoid();
      }
      var if_res116 = if_res115;
    }
    if_res116;
    return M2.Core.Pair.listFromArray(result276);
  };
  var range = $rjs_core.attachProcedureArity(function() {
    var fixed_lam111 = {
      '1': cl108,
      '2': cl109,
      '3': cl110
    }[arguments.length];
    if (fixed_lam111 !== undefined !== false) {
      return fixed_lam111.apply(null, arguments);
    } else {
      return error("case-lambda: invalid case");
    }
  }, [1, 2, 3]);
  var remove = function(v281, lst282, proc283) {
    if (eq_p(proc283, undefined) !== false) {
      proc283 = M2.Core.isEqual;
      var if_res117 = null;
    } else {
      var if_res117 = rvoid();
    }
    if_res117;
    var loop284 = function(result285, lst286) {
      if (null_p(lst286) !== false) {
        var if_res119 = reverse(result285);
      } else {
        if (proc283(v281, car(lst286)) !== false) {
          var if_res118 = append(reverse(result285), cdr(lst286));
        } else {
          var if_res118 = rvoid();
        }
        if_res118;
        var if_res119 = loop284(cons(car(lst286), result285), cdr(lst286));
      }
      return if_res119;
    };
    return loop284($rjs_core.Pair.Empty, lst282);
  };
  var filter = function(fn287, lst288) {
    var loop289 = function(result290, lst291) {
      if (null_p(lst291) !== false) {
        var if_res121 = reverse(result290);
      } else {
        if (fn287(lst291.hd) !== false) {
          var if_res120 = loop289(M2.Core.Pair.make(lst291.hd, result290), lst291.tl);
        } else {
          var if_res120 = loop289(result290, lst291.tl);
        }
        var if_res121 = if_res120;
      }
      return if_res121;
    };
    return loop289($rjs_core.Pair.Empty, lst288);
  };
  var ormap = function(fn292) {
    var lists293 = Array.prototype.slice.call(arguments, 1);
    return foldl.apply(this, [function() {
      var args294 = M2.Core.argumentsToArray(arguments);
      var final_arg295 = args294.pop();
      return (final_arg295 || fn292.apply(null, args294)) && true;
    }, false].concat(lists293));
  };
  var andmap = function(fn296) {
    var lists297 = Array.prototype.slice.call(arguments, 1);
    return foldl.apply(this, [function() {
      var args298 = M2.Core.argumentsToArray(arguments);
      var final_arg299 = args298.pop();
      return (final_arg299 && fn296.apply(null, args298)) && true;
    }, true].concat(lists297));
  };
  var member = function(v300, lst301) {
    var loop302 = function(lst303) {
      if (null_p(lst303) !== false) {
        var if_res123 = false;
      } else {
        if (M2.Core.isEqual(v300, lst303.hd) !== false) {
          var if_res122 = lst303;
        } else {
          var if_res122 = loop302(lst303.tl);
        }
        var if_res123 = if_res122;
      }
      return if_res123;
    };
    return loop302(lst301);
  };
  var compose = function() {
    var procs304 = M2.Core.argumentsToArray(arguments);
    return function() {
      var result305 = M2.Core.argumentsToArray(arguments);
      var procs_times_306 = procs304.reverse();
      var loop307 = function(i308) {
        if (i308 < procs_times_306.length !== false) {
          var p309 = procs_times_306[i308];
          result305 = p309.apply(null, result305);
          if (M2.Core.Values.check(result305) !== false) {
            result305 = result305.getAll();
            var if_res124 = null;
          } else {
            result305 = [result305];
            var if_res124 = null;
          }
          if_res124;
          var if_res125 = loop307(i308 + 1);
        } else {
          var if_res125 = rvoid();
        }
        return if_res125;
      };
      loop307(0);
      if (result305.length === 1 !== false) {
        var if_res126 = result305[0];
      } else {
        var if_res126 = M2.Core.Values.make(result305);
      }
      return if_res126;
    };
  };
  var compose1 = function() {
    var procs310 = M2.Core.argumentsToArray(arguments);
    return function(v311) {
      var result312 = v311;
      var procs_times_313 = procs310.reverse();
      var loop314 = function(i315) {
        if (i315 < procs_times_313.length !== false) {
          var p316 = procs_times_313[i315];
          result312 = p316(result312);
          var if_res127 = loop314(i315 + 1);
        } else {
          var if_res127 = rvoid();
        }
        return if_res127;
      };
      loop314(0);
      return result312;
    };
  };
  var list_ref = function(lst317, pos318) {
    var loop319 = function(i320, lst321) {
      if (null_p(lst321) !== false) {
        var if_res129 = error($rjs_core.Symbol.make("list-ref?"), "insufficient elements");
      } else {
        if (i320 === pos318 !== false) {
          var if_res128 = lst321.hd;
        } else {
          var if_res128 = loop319(i320 + 1, lst321.tl);
        }
        var if_res129 = if_res128;
      }
      return if_res129;
    };
    return loop319(0, lst317);
  };
  var build_list = function(n322, proc323) {
    var arr324 = Array(n322);
    var loop325 = function(i326) {
      if (i326 < n322 !== false) {
        arr324[i326] = proc323(i326);
        var if_res130 = loop325(i326 + 1);
      } else {
        var if_res130 = rvoid();
      }
      return if_res130;
    };
    loop325(0);
    return M2.Core.Pair.listFromArray(arr324);
  };
  var make_list = function(n327, v328) {
    var loop329 = function(result330, i331) {
      if (i331 === n327 !== false) {
        var if_res131 = result330;
      } else {
        var if_res131 = loop329(M2.Core.Pair.make(v328, result330), i331 + 1);
      }
      return if_res131;
    };
    return loop329($rjs_core.Pair.Empty, 0);
  };
  var flatten = function(lst332) {
    if (null_p(lst332) !== false) {
      var if_res133 = lst332;
    } else {
      if (pair_p(lst332) !== false) {
        var if_res132 = append(flatten(lst332.hd), flatten(lst332.tl));
      } else {
        var if_res132 = list(lst332);
      }
      var if_res133 = if_res132;
    }
    return if_res133;
  };
  var assoc = function(k333, lst334) {
    var loop335 = function(lst336) {
      if (null_p(lst336) !== false) {
        var if_res135 = false;
      } else {
        if (M2.Core.isEqual(k333, lst336.hd.hd) !== false) {
          var if_res134 = lst336.hd;
        } else {
          var if_res134 = loop335(lst336.tl);
        }
        var if_res135 = if_res134;
      }
      return if_res135;
    };
    return loop335(lst334);
  };
  var memv = M2.Kernel.memv;
  var memq = M2.Kernel.memq;
  var memf = M2.Kernel.memf;
  var findf = M2.Kernel.findf;
  var sort9 = M2.Kernel.sort9;
  var assv = M2.Kernel.assv;
  var assq = M2.Kernel.assq;
  var assf = M2.Kernel.assf;
  var alt_reverse = reverse;
  var string = String.prototype.concat.bind("");
  var _a = function() {
    var args337 = M2.Core.argumentsToArray(arguments);
    return [].reduce.call(args337, function(x338, r339) {
      return r339 + M2.Core.toString(x338);
    }, "");
  };
  var string_append = string;
  var string_ref = function(s340, i341) {
    return s340.charAt(i341);
  };
  var string_eq__p = function(sa342, sb343) {
    return sa342 === sb343;
  };
  var string_lt__p = function(sa344, sb345) {
    return sa344 < sb345;
  };
  var string_lt__eq__p = function(sa346, sb347) {
    return sa346 <= sb347;
  };
  var string_gt__p = function(sa348, sb349) {
    return sa348 > sb349;
  };
  var string_gt__eq__p = function(sa350, sb351) {
    return sa350 >= sb351;
  };
  var string_p = function(v352) {
    return eqv_p($traceurRuntime.typeof((v352)), "string");
  };
  var format = M2.Kernel.format;
  var symbol_p = M2.Core.Symbol.check;
  var make_string = function(n353, c354) {
    return c354.repeat(n353);
  };
  var list__gt_string = M2.Core.Pair.listToString;
  var symbol__gt_string = function(v355) {
    if (symbol_p(v355) !== false) {
      var if_res136 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "symbol?", v355, 0);
      var if_res136 = null;
    }
    if_res136;
    return v355.toString();
  };
  var string__gt_symbol = function(s356) {
    if (string_p(s356) !== false) {
      var if_res137 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "string?", s356, 0);
      var if_res137 = null;
    }
    if_res137;
    return M2.Core.Symbol.make(s356);
  };
  var string__gt_uninterned_symbol = function(s357) {
    if (string_p(s357) !== false) {
      var if_res138 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "string?", s357, 0);
      var if_res138 = null;
    }
    if_res138;
    return M2.Core.Symbol.makeUninterned(s357);
  };
  var symbol_interned_p = function(sym358) {
    if (symbol_p(sym358) !== false) {
      var if_res139 = rvoid();
    } else {
      throw M2.Core.racketContractError(M2.__rjs_quoted__.default_check_message, "symbol?", sym358, 0);
      var if_res139 = null;
    }
    if_res139;
    return sym358 === M2.Core.Symbol.make(sym358.v);
  };
  var symbol_eq__p = function(s359, v360) {
    return s359.equals(v360);
  };
  var string_length = function(v361) {
    return v361.length;
  };
  var string_downcase = function(v362) {
    return v362.toLowerCase(v362);
  };
  var string_upcase = function(v363) {
    return v363.toUpperCase(v363);
  };
  var substring5364 = function(str3365, start4366, end1367, end2368) {
    var str369 = str3365;
    var start370 = start4366;
    if (end2368 !== false) {
      var if_res140 = end1367;
    } else {
      var if_res140 = false;
    }
    var end371 = if_res140;
    if (not(eqv_p($traceurRuntime.typeof((str369)), "string")) !== false) {
      throw M2.Core.racketContractError("expected a string");
      var if_res144 = null;
    } else {
      if (start370 < 0 !== false) {
        throw M2.Core.racketContractError("invalid start index");
        var if_res143 = null;
      } else {
        if ((end371 !== false) && ((end371 < 0) || (end371 > str369.length)) !== false) {
          throw M2.Core.racketContractError("invalid end index");
          var if_res142 = null;
        } else {
          if (end371 === false !== false) {
            end371 = str369.length;
            var if_res141 = null;
          } else {
            var if_res141 = rvoid();
          }
          var if_res142 = if_res141;
        }
        var if_res143 = if_res142;
      }
      var if_res144 = if_res143;
    }
    if_res144;
    return str369.substring(start370, end371);
  };
  var cl145 = function(str372, start373) {
    return substring5364(str372, start373, false, false);
  };
  var cl146 = function(str374, start375, end1376) {
    return substring5364(str374, start375, end1376, true);
  };
  var substring = $rjs_core.attachProcedureArity(function() {
    var fixed_lam147 = {
      '2': cl145,
      '3': cl146
    }[arguments.length];
    if (fixed_lam147 !== undefined !== false) {
      return fixed_lam147.apply(null, arguments);
    } else {
      return error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var string_split = function(str377, sep378) {
    return M2.Core.Pair.listFromArray(str377.split(sep378));
  };
  var char_p = function(c379) {
    return eqv_p($traceurRuntime.typeof((c379)), "string");
  };
  var char_lt__p = function(a380, b381) {
    return a380.codePointAt(0) < b381.codePointAt(0);
  };
  var char_lt__eq__p = function(a382, b383) {
    return a382.codePointAt(0) <= b383.codePointAt(0);
  };
  var char_gt__p = function(a384, b385) {
    return a384.codePointAt(0) > b385.codePointAt(0);
  };
  var char_gt__eq__p = function(a386, b387) {
    return a386.codePointAt(0) >= b387.codePointAt(0);
  };
  var char_eq__p = function(a388, b389) {
    return a388 === b389;
  };
  var char__gt_integer = function(c390) {
    return c390.codePointAt(0);
  };
  var box = M2.Core.Box.make;
  var unbox = function(v391) {
    return v391.get();
  };
  var set_box_bang_ = function(b392, v393) {
    return b392.set(v393);
  };
  var let_result148 = M2.Core.Struct.makeStructTypeProperty({'name': "prop:evt"});
  var prop_evt = let_result148.getAt(0);
  var evt_p = let_result148.getAt(1);
  var prop_checked_procedure = make_struct_type_property("prop:checked-procedure").getAt(0);
  var prop_impersonator_of = make_struct_type_property("prop:impersonator-of").getAt(0);
  var prop_arity_string = make_struct_type_property("prop:arity-string").getAt(0);
  var prop_incomplete_arity = make_struct_type_property("prop:incomplete-arity").getAt(0);
  var prop_method_arity_error = make_struct_type_property("prop:method-arity-error").getAt(0);
  var prop_exn_srclocs = make_struct_type_property("prop:exn:srclocs").getAt(0);
  var prop_procedure = M2.Core.Struct.propProcedure;
  var current_output_port = function() {
    return M2.Core.Ports.standardOutputPort;
  };
  var current_print = function() {
    return function(p394) {
      if (string_p(p394) !== false) {
        var if_res149 = display("\"");
      } else {
        var if_res149 = rvoid();
      }
      if_res149;
      display(p394);
      if (string_p(p394) !== false) {
        var if_res150 = display("\"");
      } else {
        var if_res150 = rvoid();
      }
      if_res150;
      return newline();
    };
  };
  var input_port_p = function(p395) {
    return M2.Core.Ports.checkInputPort(p395);
  };
  var output_port_p = function(p396) {
    return M2.Core.Ports.checkOutputPort(p396);
  };
  var open_output_string = M2.Core.Ports.openOutputString;
  var get_output_string = M2.Core.Ports.getOutputString;
  var display10397 = function(v9398, out7399, out8400) {
    var v401 = v9398;
    if (out8400 !== false) {
      var if_res151 = out7399;
    } else {
      var if_res151 = current_output_port();
    }
    var out402 = if_res151;
    return M2.Kernel.display(v401, out402);
  };
  var cl152 = function(v403) {
    return display10397(v403, false, false);
  };
  var cl153 = function(v404, out7405) {
    return display10397(v404, out7405, true);
  };
  var display = $rjs_core.attachProcedureArity(function() {
    var fixed_lam154 = {
      '1': cl152,
      '2': cl153
    }[arguments.length];
    if (fixed_lam154 !== undefined !== false) {
      return fixed_lam154.apply(null, arguments);
    } else {
      return error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var print15406 = function(v14407, out12408, out13409) {
    var v410 = v14407;
    if (out13409 !== false) {
      var if_res155 = out12408;
    } else {
      var if_res155 = current_output_port();
    }
    var out411 = if_res155;
    return M2.Kernel.print(v410, out411);
  };
  var cl156 = function(v412) {
    return print15406(v412, false, false);
  };
  var cl157 = function(v413, out12414) {
    return print15406(v413, out12414, true);
  };
  var print = $rjs_core.attachProcedureArity(function() {
    var fixed_lam158 = {
      '1': cl156,
      '2': cl157
    }[arguments.length];
    if (fixed_lam158 !== undefined !== false) {
      return fixed_lam158.apply(null, arguments);
    } else {
      return error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var newline19415 = function(out17416, out18417) {
    if (out18417 !== false) {
      var if_res159 = out17416;
    } else {
      var if_res159 = current_output_port();
    }
    var out418 = if_res159;
    return display("\n", out418);
  };
  var cl160 = function() {
    return newline19415(false, false);
  };
  var cl161 = function(out17419) {
    return newline19415(out17419, true);
  };
  var newline = $rjs_core.attachProcedureArity(function() {
    var fixed_lam162 = {
      '0': cl160,
      '1': cl161
    }[arguments.length];
    if (fixed_lam162 !== undefined !== false) {
      return fixed_lam162.apply(null, arguments);
    } else {
      return error("case-lambda: invalid case");
    }
  }, [0, 1]);
  var error = M2.Kernel.error;
  var bytes_p = function(bs420) {
    return (bs420) instanceof (Uint8Array);
  };
  var bytes__gt_string_by_utf_8 = function(bs421) {
    if (bytes_p(bs421) !== false) {
      var if_res163 = String.fromCharCode.apply(null, bs421);
    } else {
      throw M2.Core.racketContractError("expected bytes");
      var if_res163 = null;
    }
    return if_res163;
  };
  var string__gt_bytes_by_utf_8 = function(str422) {
    if (eqv_p($traceurRuntime.typeof((str422)), "string") !== false) {
      var if_res164 = new Uint8Array(Array.prototype.map.call(str422, function(x423) {
        return x423.charCodeAt(0);
      }));
    } else {
      throw M2.Core.racketContractError("expected string");
      var if_res164 = null;
    }
    return if_res164;
  };
  var current_continuation_marks = M2.Core.Marks.getContinuationMarks;
  var continuation_mark_set__gt_list = M2.Core.Marks.getMarks;
  var continuation_mark_set_first = function(mark_set424, key_v425, none_v426, prompt_tag427) {
    var mark_set428 = mark_set428 || M2.Core.Marks.getContinuationMarks(prompt_tag427);
    var marks429 = M2.Core.Marks.getMarks(mark_set428, key_v425, prompt_tag427);
    if (null_p(marks429) !== false) {
      var if_res165 = none_v426;
    } else {
      var if_res165 = marks429.hd;
    }
    return if_res165;
  };
  var make_parameter = M2.Paramz.makeParameter;
  var call_with_continuation_prompt = M2.Core.Marks.callWithContinuationPrompt;
  var abort_current_continuation = function(prompt_tag430) {
    var args431 = Array.prototype.slice.call(arguments, 1);
    throw new M2.Core.Marks.AbortCurrentContinuation(prompt_tag430, args431);
    return null;
  };
  var make_continuation_prompt_tag = M2.Core.Marks.makeContinuationPromptTag;
  var default_continuation_prompt_tag = M2.Core.Marks.defaultContinuationPromptTag;
  var raise = function(e432) {
    var abort_ccp433 = continuation_mark_set_first(current_continuation_marks(), M2.Paramz.ExceptionHandlerKey);
    return abort_ccp433(e432);
  };
  var current_inspector = function() {
    return true;
  };
  var raise_argument_error = error;
  var check_method = function() {
    return false;
  };
  var random = M2.Kernel.random;
  var current_seconds = function() {
    return Math.floor(Date.now() / 1000);
  };
  var regexp_p = function(v434) {
    return (v434) instanceof (RegExp);
  };
  var pregexp_p = regexp_p;
  var byte_regexp_p = regexp_p;
  var byte_pregexp_p = regexp_p;
  var regexp = function(str435) {
    if (eqv_p($traceurRuntime.typeof((str435)), "string") !== false) {
      throw M2.Core.racketContractError("expected string");
      var if_res166 = null;
    } else {
      var if_res166 = new RegExp(str435);
    }
    return if_res166;
  };
  var pregexp = regexp;
  var byte_regexp = function(bs436) {
    if (bytes_p(bs436) !== false) {
      var if_res167 = new RegExp(bytes__gt_string_by_utf_8(bs436));
    } else {
      throw M2.Core.racketContractError("expected bytes");
      var if_res167 = null;
    }
    return if_res167;
  };
  var byte_pregexp = byte_regexp;
  var regexp_match = function(p437, i438) {
    var rx_p_p439 = regexp_p(p437);
    var bytes_p_p440 = bytes_p(p437);
    var bytes_i_p441 = bytes_p(i438);
    var str_p_p442 = typeof(p437) === "string";
    var str_i_p443 = typeof(i438) === "string";
    if (not((rx_p_p439 || bytes_p_p440) || str_p_p442) && not(bytes_i_p441 || str_i_p443) !== false) {
      throw M2.Core.racketContractError("expected regexp, string or byte pat, and string or byte input");
      var if_res168 = null;
    } else {
      var if_res168 = rvoid();
    }
    if_res168;
    var let_result169 = values();
    if (str_i_p443 !== false) {
      var if_res170 = i438;
    } else {
      var if_res170 = bytes__gt_string_by_utf_8(i438);
    }
    var str444 = if_res170;
    if (rx_p_p439 !== false) {
      var if_res172 = p437;
    } else {
      if (str_p_p442 !== false) {
        var if_res171 = p437;
      } else {
        var if_res171 = bytes__gt_string_by_utf_8(p437);
      }
      var if_res172 = if_res171;
    }
    var pat445 = if_res172;
    var res446 = str444.match(pat445);
    if (res446 === null !== false) {
      var if_res176 = false;
    } else {
      if ((str_p_p442 || rx_p_p439) && str_i_p443 !== false) {
        var if_res175 = M2.Core.Pair.listFromArray(res446.map(function(x447) {
          if (x447 === undefined !== false) {
            var if_res173 = false;
          } else {
            var if_res173 = x447;
          }
          return if_res173;
        }));
      } else {
        var if_res175 = M2.Core.Pair.listFromArray(res446.map(function(x448) {
          if (x448 === undefined !== false) {
            var if_res174 = false;
          } else {
            var if_res174 = string__gt_bytes_by_utf_8(x448);
          }
          return if_res174;
        }));
      }
      var if_res176 = if_res175;
    }
    return if_res176;
  };
  var let_result177 = make_struct_type($rjs_core.Symbol.make("kernel:arity-at-least"), false, 1, 0, false, rnull, false, false, $rjs_core.Pair.makeList(0), false, $rjs_core.Symbol.make("kernel:arity-at-least"));
  var struct_449 = let_result177.getAt(0);
  var make_450 = let_result177.getAt(1);
  var _p451 = let_result177.getAt(2);
  var _ref452 = let_result177.getAt(3);
  var _set_bang_453 = let_result177.getAt(4);
  var let_result178 = values(struct_449, make_450, _p451, make_struct_field_accessor(_ref452, 0, $rjs_core.Symbol.make("value")));
  var struct_kernel_arity_at_least = let_result178.getAt(0);
  var make_arity_at_least = let_result178.getAt(1);
  var kernel_arity_at_least_p = let_result178.getAt(2);
  var kernel_arity_at_least_value = let_result178.getAt(3);
  var procedure_p = function(f454) {
    return eqv_p($traceurRuntime.typeof((f454)), "function");
  };
  var arity_at_least = make_arity_at_least;
  var arity_at_least_p = function(p455) {
    return kernel_arity_at_least_p(p455);
  };
  var arity_at_least_value = function(p456) {
    return kernel_arity_at_least_value(p456);
  };
  var procedure_arity_includes_p = function(f457) {
    return true;
  };
  var procedure_arity = function(fn458) {
    var lambda_type459 = fn458.__rjs_lambdaType;
    if (lambda_type459 === "variadic" !== false) {
      var if_res181 = make_arity_at_least(fn458.__rjs_arityValue || fn458.length);
    } else {
      if (lambda_type459 === "case-lambda" !== false) {
        if (fn458.__rjs_arityValue.length === 1 !== false) {
          var if_res179 = fn458.__rjs_arityValue[0];
        } else {
          var if_res179 = M2.Core.Pair.listFromArray(fn458.__rjs_arityValue);
        }
        var if_res180 = if_res179;
      } else {
        var if_res180 = fn458.length;
      }
      var if_res181 = if_res180;
    }
    return if_res181;
  };
  var procedure_arity_p = function(v460) {
    return (exact_nonnegative_integer_p(v460) || kernel_arity_at_least_p(v460)) || ormap(function(v461) {
      return exact_nonnegative_integer_p(v461) || kernel_arity_at_least_p(v461);
    }, v460);
  };
  var checked_procedure_check_and_extract = function(type462, v463, proc464, v1465, v2466) {
    if (M2.Core.Struct.check(v463, type462) && type462._findProperty(prop_checked_procedure) !== false) {
      var fn467 = v463.getField(0);
      var r1468 = fn467(v1465, v2466);
      if (r1468 !== false) {
        var if_res182 = v463.getField(1);
      } else {
        var if_res182 = proc464(v463, v1465, v2466);
      }
      var if_res183 = if_res182;
    } else {
      var if_res183 = proc464(v463, v1465, v2466);
    }
    return if_res183;
  };
  var gensym = function(sym469) {
    var s470 = (sym469 && sym469.v) || "";
    __count = __count + 1;
    return M2.Core.Symbol.makeUninterned(s470 + __count);
  };
  var eval_jit_enabled = function() {
    return false;
  };
  var variable_reference_constant_p = function(x471) {
    return false;
  };
  var inspector_p = function(p472) {
    return true;
  };
  var make_thread_cell = function(p473) {
    return p473;
  };
  var __count = 1000;
  var system_type = function(mod474) {
    return $rjs_core.Symbol.make("javascript");
  };
  var make_weak_hash = make_hash;
  var __rjs_quoted__ = {};
  __rjs_quoted__.make_struct_type_property = make_struct_type_property;
  __rjs_quoted__._plus_ = _plus_;
  __rjs_quoted__.struct_kernel_arity_at_least = struct_kernel_arity_at_least;
  __rjs_quoted__.length = length;
  __rjs_quoted__.kernel_arity_at_least_value = kernel_arity_at_least_value;
  __rjs_quoted__.make_arity_at_least = make_arity_at_least;
  __rjs_quoted__.kernel_arity_at_least_p = kernel_arity_at_least_p;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get equal_p() {
      return equal_p;
    },
    get eqv_p() {
      return eqv_p;
    },
    get eq_p() {
      return eq_p;
    },
    get values() {
      return values;
    },
    get call_with_values() {
      return call_with_values;
    },
    get rvoid() {
      return rvoid;
    },
    get void_p() {
      return void_p;
    },
    get number_p() {
      return number_p;
    },
    get real_p() {
      return real_p;
    },
    get integer_p() {
      return integer_p;
    },
    get zero_p() {
      return zero_p;
    },
    get positive_p() {
      return positive_p;
    },
    get negative_p() {
      return negative_p;
    },
    get add1() {
      return add1;
    },
    get sub1() {
      return sub1;
    },
    get quotient() {
      return quotient;
    },
    get even_p() {
      return even_p;
    },
    get odd_p() {
      return odd_p;
    },
    get exact_nonnegative_integer_p() {
      return exact_nonnegative_integer_p;
    },
    get exact_integer_p() {
      return exact_integer_p;
    },
    get _times_() {
      return _times_;
    },
    get _by_() {
      return _by_;
    },
    get _plus_() {
      return _plus_;
    },
    get _() {
      return _;
    },
    get _lt_() {
      return _lt_;
    },
    get _gt_() {
      return _gt_;
    },
    get _lt__eq_() {
      return _lt__eq_;
    },
    get _gt__eq_() {
      return _gt__eq_;
    },
    get _eq_() {
      return _eq_;
    },
    get floor() {
      return floor;
    },
    get abs() {
      return abs;
    },
    get sin() {
      return sin;
    },
    get cos() {
      return cos;
    },
    get tan() {
      return tan;
    },
    get atan() {
      return atan;
    },
    get ceiling() {
      return ceiling;
    },
    get round() {
      return round;
    },
    get min() {
      return min;
    },
    get max() {
      return max;
    },
    get log() {
      return log;
    },
    get expt() {
      return expt;
    },
    get sqrt() {
      return sqrt;
    },
    get sqr() {
      return sqr;
    },
    get remainder() {
      return remainder;
    },
    get number__gt_string() {
      return number__gt_string;
    },
    get inexact__gt_exact() {
      return inexact__gt_exact;
    },
    get exact__gt_inexact() {
      return exact__gt_inexact;
    },
    get not() {
      return not;
    },
    get rfalse() {
      return rfalse;
    },
    get rtrue() {
      return rtrue;
    },
    get false_p() {
      return false_p;
    },
    get car() {
      return car;
    },
    get cdr() {
      return cdr;
    },
    get cons() {
      return cons;
    },
    get cons_p() {
      return cons_p;
    },
    get pair_p() {
      return pair_p;
    },
    get caar() {
      return caar;
    },
    get cadr() {
      return cadr;
    },
    get cdar() {
      return cdar;
    },
    get cddr() {
      return cddr;
    },
    get caddr() {
      return caddr;
    },
    get rnull() {
      return rnull;
    },
    get list() {
      return list;
    },
    get null_p() {
      return null_p;
    },
    get empty_p() {
      return empty_p;
    },
    get length() {
      return length;
    },
    get list_p() {
      return list_p;
    },
    get reverse() {
      return reverse;
    },
    get list_times_() {
      return list_times_;
    },
    get append() {
      return append;
    },
    get for_each() {
      return for_each;
    },
    get mcons() {
      return mcons;
    },
    get mpair_p() {
      return mpair_p;
    },
    get mcar() {
      return mcar;
    },
    get mcdr() {
      return mcdr;
    },
    get set_mcar_bang_() {
      return set_mcar_bang_;
    },
    get set_mcdr_bang_() {
      return set_mcdr_bang_;
    },
    get make_struct_type() {
      return make_struct_type;
    },
    get make_struct_field_accessor() {
      return make_struct_field_accessor;
    },
    get make_struct_field_mutator() {
      return make_struct_field_mutator;
    },
    get make_struct_type_property() {
      return make_struct_type_property;
    },
    get check_struct_type() {
      return check_struct_type;
    },
    get struct_type_p() {
      return struct_type_p;
    },
    get struct_type_info() {
      return struct_type_info;
    },
    get vector() {
      return vector;
    },
    get make_vector() {
      return make_vector;
    },
    get vector_p() {
      return vector_p;
    },
    get vector_length() {
      return vector_length;
    },
    get vector_ref() {
      return vector_ref;
    },
    get vector_set_bang_() {
      return vector_set_bang_;
    },
    get vector__gt_list() {
      return vector__gt_list;
    },
    get vector__gt_immutable_vector() {
      return vector__gt_immutable_vector;
    },
    get hash() {
      return hash;
    },
    get hasheqv() {
      return hasheqv;
    },
    get hasheq() {
      return hasheq;
    },
    get make_hash() {
      return make_hash;
    },
    get make_hasheqv() {
      return make_hasheqv;
    },
    get make_hasheq() {
      return make_hasheq;
    },
    get make_immutable_hash() {
      return make_immutable_hash;
    },
    get make_immutable_hasheqv() {
      return make_immutable_hasheqv;
    },
    get make_immutable_hasheq() {
      return make_immutable_hasheq;
    },
    get hash_ref() {
      return hash_ref;
    },
    get hash_set() {
      return hash_set;
    },
    get hash_set_bang_() {
      return hash_set_bang_;
    },
    get hash_map() {
      return hash_map;
    },
    get apply() {
      return apply;
    },
    get map() {
      return map;
    },
    get foldl() {
      return foldl;
    },
    get _foldr() {
      return _foldr;
    },
    get foldr() {
      return foldr;
    },
    get range() {
      return range;
    },
    get remove() {
      return remove;
    },
    get filter() {
      return filter;
    },
    get ormap() {
      return ormap;
    },
    get andmap() {
      return andmap;
    },
    get member() {
      return member;
    },
    get compose() {
      return compose;
    },
    get compose1() {
      return compose1;
    },
    get list_ref() {
      return list_ref;
    },
    get build_list() {
      return build_list;
    },
    get make_list() {
      return make_list;
    },
    get flatten() {
      return flatten;
    },
    get assoc() {
      return assoc;
    },
    get memv() {
      return memv;
    },
    get memq() {
      return memq;
    },
    get memf() {
      return memf;
    },
    get findf() {
      return findf;
    },
    get sort9() {
      return sort9;
    },
    get assv() {
      return assv;
    },
    get assq() {
      return assq;
    },
    get assf() {
      return assf;
    },
    get alt_reverse() {
      return alt_reverse;
    },
    get string() {
      return string;
    },
    get _a() {
      return _a;
    },
    get string_append() {
      return string_append;
    },
    get string_ref() {
      return string_ref;
    },
    get string_eq__p() {
      return string_eq__p;
    },
    get string_lt__p() {
      return string_lt__p;
    },
    get string_lt__eq__p() {
      return string_lt__eq__p;
    },
    get string_gt__p() {
      return string_gt__p;
    },
    get string_gt__eq__p() {
      return string_gt__eq__p;
    },
    get string_p() {
      return string_p;
    },
    get format() {
      return format;
    },
    get symbol_p() {
      return symbol_p;
    },
    get make_string() {
      return make_string;
    },
    get list__gt_string() {
      return list__gt_string;
    },
    get symbol__gt_string() {
      return symbol__gt_string;
    },
    get string__gt_symbol() {
      return string__gt_symbol;
    },
    get string__gt_uninterned_symbol() {
      return string__gt_uninterned_symbol;
    },
    get symbol_interned_p() {
      return symbol_interned_p;
    },
    get symbol_eq__p() {
      return symbol_eq__p;
    },
    get string_length() {
      return string_length;
    },
    get string_downcase() {
      return string_downcase;
    },
    get string_upcase() {
      return string_upcase;
    },
    get substring() {
      return substring;
    },
    get string_split() {
      return string_split;
    },
    get char_p() {
      return char_p;
    },
    get char_lt__p() {
      return char_lt__p;
    },
    get char_lt__eq__p() {
      return char_lt__eq__p;
    },
    get char_gt__p() {
      return char_gt__p;
    },
    get char_gt__eq__p() {
      return char_gt__eq__p;
    },
    get char_eq__p() {
      return char_eq__p;
    },
    get char__gt_integer() {
      return char__gt_integer;
    },
    get box() {
      return box;
    },
    get unbox() {
      return unbox;
    },
    get set_box_bang_() {
      return set_box_bang_;
    },
    get evt_p() {
      return evt_p;
    },
    get prop_evt() {
      return prop_evt;
    },
    get prop_checked_procedure() {
      return prop_checked_procedure;
    },
    get prop_impersonator_of() {
      return prop_impersonator_of;
    },
    get prop_arity_string() {
      return prop_arity_string;
    },
    get prop_incomplete_arity() {
      return prop_incomplete_arity;
    },
    get prop_method_arity_error() {
      return prop_method_arity_error;
    },
    get prop_exn_srclocs() {
      return prop_exn_srclocs;
    },
    get prop_procedure() {
      return prop_procedure;
    },
    get current_output_port() {
      return current_output_port;
    },
    get current_print() {
      return current_print;
    },
    get input_port_p() {
      return input_port_p;
    },
    get output_port_p() {
      return output_port_p;
    },
    get open_output_string() {
      return open_output_string;
    },
    get get_output_string() {
      return get_output_string;
    },
    get display() {
      return display;
    },
    get print() {
      return print;
    },
    get newline() {
      return newline;
    },
    get error() {
      return error;
    },
    get bytes_p() {
      return bytes_p;
    },
    get bytes__gt_string_by_utf_8() {
      return bytes__gt_string_by_utf_8;
    },
    get string__gt_bytes_by_utf_8() {
      return string__gt_bytes_by_utf_8;
    },
    get current_continuation_marks() {
      return current_continuation_marks;
    },
    get continuation_mark_set__gt_list() {
      return continuation_mark_set__gt_list;
    },
    get continuation_mark_set_first() {
      return continuation_mark_set_first;
    },
    get make_parameter() {
      return make_parameter;
    },
    get call_with_continuation_prompt() {
      return call_with_continuation_prompt;
    },
    get abort_current_continuation() {
      return abort_current_continuation;
    },
    get make_continuation_prompt_tag() {
      return make_continuation_prompt_tag;
    },
    get default_continuation_prompt_tag() {
      return default_continuation_prompt_tag;
    },
    get raise() {
      return raise;
    },
    get current_inspector() {
      return current_inspector;
    },
    get raise_argument_error() {
      return raise_argument_error;
    },
    get check_method() {
      return check_method;
    },
    get random() {
      return random;
    },
    get current_seconds() {
      return current_seconds;
    },
    get regexp_p() {
      return regexp_p;
    },
    get pregexp_p() {
      return pregexp_p;
    },
    get byte_regexp_p() {
      return byte_regexp_p;
    },
    get byte_pregexp_p() {
      return byte_pregexp_p;
    },
    get regexp() {
      return regexp;
    },
    get pregexp() {
      return pregexp;
    },
    get byte_regexp() {
      return byte_regexp;
    },
    get byte_pregexp() {
      return byte_pregexp;
    },
    get regexp_match() {
      return regexp_match;
    },
    get kernel_arity_at_least_value() {
      return kernel_arity_at_least_value;
    },
    get kernel_arity_at_least_p() {
      return kernel_arity_at_least_p;
    },
    get make_arity_at_least() {
      return make_arity_at_least;
    },
    get struct_kernel_arity_at_least() {
      return struct_kernel_arity_at_least;
    },
    get procedure_p() {
      return procedure_p;
    },
    get arity_at_least() {
      return arity_at_least;
    },
    get arity_at_least_p() {
      return arity_at_least_p;
    },
    get arity_at_least_value() {
      return arity_at_least_value;
    },
    get procedure_arity_includes_p() {
      return procedure_arity_includes_p;
    },
    get procedure_arity() {
      return procedure_arity;
    },
    get procedure_arity_p() {
      return procedure_arity_p;
    },
    get checked_procedure_check_and_extract() {
      return checked_procedure_check_and_extract;
    },
    get gensym() {
      return gensym;
    },
    get eval_jit_enabled() {
      return eval_jit_enabled;
    },
    get variable_reference_constant_p() {
      return variable_reference_constant_p;
    },
    get inspector_p() {
      return inspector_p;
    },
    get make_thread_cell() {
      return make_thread_cell;
    },
    get system_type() {
      return system_type;
    },
    get make_weak_hash() {
      return make_weak_hash;
    }
  };
})();
var $__links_47_racketscript_45_compiler_47_racketscript_47_private_47_interop_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "links/racketscript-compiler/racketscript/private/interop.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var __js_ffi = $rjs_core.attachProcedureArity(function() {
    var _600 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
    return M0.error($rjs_core.Symbol.make("racketscript"), "can't make JS ffi calls in Racket");
  });
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get __js_ffi() {
      return __js_ffi;
    }
  };
})();
var $__collects_47_racket_47_private_47_map_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/map.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var cl828 = function(f1500, l1501) {
    if (M0.procedure_p(f1500) !== false) {
      if (M0.procedure_arity_includes_p(f1500, 1) !== false) {
        var if_res833 = M0.list_p(l1501);
      } else {
        var if_res833 = false;
      }
      var if_res834 = if_res833;
    } else {
      var if_res834 = false;
    }
    if (if_res834 !== false) {
      var loop1502 = function(l1503) {
        if (M0.null_p(l1503) !== false) {
          var if_res835 = M0.rnull;
        } else {
          var r1504 = M0.cdr(l1503);
          var if_res835 = M0.cons(f1500(M0.car(l1503)), loop1502(r1504));
        }
        return if_res835;
      };
      var if_res836 = loop1502(l1501);
    } else {
      var if_res836 = M0.map(f1500, l1501);
    }
    return if_res836;
  };
  var cl829 = function(f1505, l11506, l21507) {
    if (M0.procedure_p(f1505) !== false) {
      if (M0.procedure_arity_includes_p(f1505, 2) !== false) {
        if (M0.list_p(l11506) !== false) {
          if (M0.list_p(l21507) !== false) {
            var if_res837 = M0._eq_(M0.length(l11506), M0.length(l21507));
          } else {
            var if_res837 = false;
          }
          var if_res838 = if_res837;
        } else {
          var if_res838 = false;
        }
        var if_res839 = if_res838;
      } else {
        var if_res839 = false;
      }
      var if_res840 = if_res839;
    } else {
      var if_res840 = false;
    }
    if (if_res840 !== false) {
      var loop1508 = function(l11509, l21510) {
        if (M0.null_p(l11509) !== false) {
          var if_res841 = M0.rnull;
        } else {
          var r11511 = M0.cdr(l11509);
          var r21512 = M0.cdr(l21510);
          var if_res841 = M0.cons(f1505(M0.car(l11509), M0.car(l21510)), loop1508(r11511, r21512));
        }
        return if_res841;
      };
      var if_res842 = loop1508(l11506, l21507);
    } else {
      var if_res842 = M0.map(f1505, l11506, l21507);
    }
    return if_res842;
  };
  var cl830 = $rjs_core.attachProcedureArity(function(f1513, l1514) {
    var args1515 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return M0.apply(M0.map, f1513, l1514, args1515);
  });
  var map1499 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam831 = {
      '2': cl828,
      '3': cl829
    }[arguments.length];
    if (fixed_lam831 !== undefined !== false) {
      return fixed_lam831.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl830.length, 1) !== false) {
        var if_res832 = cl830.apply(null, arguments);
      } else {
        var if_res832 = M0.error("case-lambda: invalid case");
      }
      return if_res832;
    }
  }, [M0.make_arity_at_least(2)]);
  var map2 = map1499;
  var cl843 = function(f1517, l1518) {
    if (M0.procedure_p(f1517) !== false) {
      if (M0.procedure_arity_includes_p(f1517, 1) !== false) {
        var if_res848 = M0.list_p(l1518);
      } else {
        var if_res848 = false;
      }
      var if_res849 = if_res848;
    } else {
      var if_res849 = false;
    }
    if (if_res849 !== false) {
      var loop1519 = function(l1520) {
        if (M0.null_p(l1520) !== false) {
          var if_res850 = M0.rvoid();
        } else {
          var r1521 = M0.cdr(l1520);
          f1517(M0.car(l1520));
          var if_res850 = loop1519(r1521);
        }
        return if_res850;
      };
      var if_res851 = loop1519(l1518);
    } else {
      var if_res851 = M0.for_each(f1517, l1518);
    }
    return if_res851;
  };
  var cl844 = function(f1522, l11523, l21524) {
    if (M0.procedure_p(f1522) !== false) {
      if (M0.procedure_arity_includes_p(f1522, 2) !== false) {
        if (M0.list_p(l11523) !== false) {
          if (M0.list_p(l21524) !== false) {
            var if_res852 = M0._eq_(M0.length(l11523), M0.length(l21524));
          } else {
            var if_res852 = false;
          }
          var if_res853 = if_res852;
        } else {
          var if_res853 = false;
        }
        var if_res854 = if_res853;
      } else {
        var if_res854 = false;
      }
      var if_res855 = if_res854;
    } else {
      var if_res855 = false;
    }
    if (if_res855 !== false) {
      var loop1525 = function(l11526, l21527) {
        if (M0.null_p(l11526) !== false) {
          var if_res856 = M0.rvoid();
        } else {
          var r11528 = M0.cdr(l11526);
          var r21529 = M0.cdr(l21527);
          f1522(M0.car(l11526), M0.car(l21527));
          var if_res856 = loop1525(r11528, r21529);
        }
        return if_res856;
      };
      var if_res857 = loop1525(l11523, l21524);
    } else {
      var if_res857 = M0.for_each(f1522, l11523, l21524);
    }
    return if_res857;
  };
  var cl845 = $rjs_core.attachProcedureArity(function(f1530, l1531) {
    var args1532 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return M0.apply(M0.for_each, f1530, l1531, args1532);
  });
  var for_each1516 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam846 = {
      '2': cl843,
      '3': cl844
    }[arguments.length];
    if (fixed_lam846 !== undefined !== false) {
      return fixed_lam846.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl845.length, 1) !== false) {
        var if_res847 = cl845.apply(null, arguments);
      } else {
        var if_res847 = M0.error("case-lambda: invalid case");
      }
      return if_res847;
    }
  }, [M0.make_arity_at_least(2)]);
  var for_each2 = for_each1516;
  var cl858 = function(f1534, l1535) {
    if (M0.procedure_p(f1534) !== false) {
      if (M0.procedure_arity_includes_p(f1534, 1) !== false) {
        var if_res863 = M0.list_p(l1535);
      } else {
        var if_res863 = false;
      }
      var if_res864 = if_res863;
    } else {
      var if_res864 = false;
    }
    if (if_res864 !== false) {
      if (M0.null_p(l1535) !== false) {
        var if_res867 = true;
      } else {
        var loop1536 = function(l1537) {
          if (M0.null_p(M0.cdr(l1537)) !== false) {
            var if_res866 = f1534(M0.car(l1537));
          } else {
            var r1538 = M0.cdr(l1537);
            if (f1534(M0.car(l1537)) !== false) {
              var if_res865 = loop1536(r1538);
            } else {
              var if_res865 = false;
            }
            var if_res866 = if_res865;
          }
          return if_res866;
        };
        var if_res867 = loop1536(l1535);
      }
      var if_res868 = if_res867;
    } else {
      var if_res868 = M0.andmap(f1534, l1535);
    }
    return if_res868;
  };
  var cl859 = function(f1539, l11540, l21541) {
    if (M0.procedure_p(f1539) !== false) {
      if (M0.procedure_arity_includes_p(f1539, 2) !== false) {
        if (M0.list_p(l11540) !== false) {
          if (M0.list_p(l21541) !== false) {
            var if_res869 = M0._eq_(M0.length(l11540), M0.length(l21541));
          } else {
            var if_res869 = false;
          }
          var if_res870 = if_res869;
        } else {
          var if_res870 = false;
        }
        var if_res871 = if_res870;
      } else {
        var if_res871 = false;
      }
      var if_res872 = if_res871;
    } else {
      var if_res872 = false;
    }
    if (if_res872 !== false) {
      if (M0.null_p(l11540) !== false) {
        var if_res875 = true;
      } else {
        var loop1542 = function(l11543, l21544) {
          if (M0.null_p(M0.cdr(l11543)) !== false) {
            var if_res874 = f1539(M0.car(l11543), M0.car(l21544));
          } else {
            var r11545 = M0.cdr(l11543);
            var r21546 = M0.cdr(l21544);
            if (f1539(M0.car(l11543), M0.car(l21544)) !== false) {
              var if_res873 = loop1542(r11545, r21546);
            } else {
              var if_res873 = false;
            }
            var if_res874 = if_res873;
          }
          return if_res874;
        };
        var if_res875 = loop1542(l11540, l21541);
      }
      var if_res876 = if_res875;
    } else {
      var if_res876 = M0.andmap(f1539, l11540, l21541);
    }
    return if_res876;
  };
  var cl860 = $rjs_core.attachProcedureArity(function(f1547, l1548) {
    var args1549 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return M0.apply(M0.andmap, f1547, l1548, args1549);
  });
  var andmap1533 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam861 = {
      '2': cl858,
      '3': cl859
    }[arguments.length];
    if (fixed_lam861 !== undefined !== false) {
      return fixed_lam861.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl860.length, 1) !== false) {
        var if_res862 = cl860.apply(null, arguments);
      } else {
        var if_res862 = M0.error("case-lambda: invalid case");
      }
      return if_res862;
    }
  }, [M0.make_arity_at_least(2)]);
  var andmap2 = andmap1533;
  var cl877 = function(f1551, l1552) {
    if (M0.procedure_p(f1551) !== false) {
      if (M0.procedure_arity_includes_p(f1551, 1) !== false) {
        var if_res882 = M0.list_p(l1552);
      } else {
        var if_res882 = false;
      }
      var if_res883 = if_res882;
    } else {
      var if_res883 = false;
    }
    if (if_res883 !== false) {
      if (M0.null_p(l1552) !== false) {
        var if_res886 = false;
      } else {
        var loop1553 = function(l1554) {
          if (M0.null_p(M0.cdr(l1554)) !== false) {
            var if_res885 = f1551(M0.car(l1554));
          } else {
            var r1555 = M0.cdr(l1554);
            var or_part1556 = f1551(M0.car(l1554));
            if (or_part1556 !== false) {
              var if_res884 = or_part1556;
            } else {
              var if_res884 = loop1553(r1555);
            }
            var if_res885 = if_res884;
          }
          return if_res885;
        };
        var if_res886 = loop1553(l1552);
      }
      var if_res887 = if_res886;
    } else {
      var if_res887 = M0.ormap(f1551, l1552);
    }
    return if_res887;
  };
  var cl878 = function(f1557, l11558, l21559) {
    if (M0.procedure_p(f1557) !== false) {
      if (M0.procedure_arity_includes_p(f1557, 2) !== false) {
        if (M0.list_p(l11558) !== false) {
          if (M0.list_p(l21559) !== false) {
            var if_res888 = M0._eq_(M0.length(l11558), M0.length(l21559));
          } else {
            var if_res888 = false;
          }
          var if_res889 = if_res888;
        } else {
          var if_res889 = false;
        }
        var if_res890 = if_res889;
      } else {
        var if_res890 = false;
      }
      var if_res891 = if_res890;
    } else {
      var if_res891 = false;
    }
    if (if_res891 !== false) {
      if (M0.null_p(l11558) !== false) {
        var if_res894 = false;
      } else {
        var loop1560 = function(l11561, l21562) {
          if (M0.null_p(M0.cdr(l11561)) !== false) {
            var if_res893 = f1557(M0.car(l11561), M0.car(l21562));
          } else {
            var r11563 = M0.cdr(l11561);
            var r21564 = M0.cdr(l21562);
            var or_part1565 = f1557(M0.car(l11561), M0.car(l21562));
            if (or_part1565 !== false) {
              var if_res892 = or_part1565;
            } else {
              var if_res892 = loop1560(r11563, r21564);
            }
            var if_res893 = if_res892;
          }
          return if_res893;
        };
        var if_res894 = loop1560(l11558, l21559);
      }
      var if_res895 = if_res894;
    } else {
      var if_res895 = M0.ormap(f1557, l11558, l21559);
    }
    return if_res895;
  };
  var cl879 = $rjs_core.attachProcedureArity(function(f1566, l1567) {
    var args1568 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return M0.apply(M0.ormap, f1566, l1567, args1568);
  });
  var ormap1550 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam880 = {
      '2': cl877,
      '3': cl878
    }[arguments.length];
    if (fixed_lam880 !== undefined !== false) {
      return fixed_lam880.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl879.length, 1) !== false) {
        var if_res881 = cl879.apply(null, arguments);
      } else {
        var if_res881 = M0.error("case-lambda: invalid case");
      }
      return if_res881;
    }
  }, [M0.make_arity_at_least(2)]);
  var ormap2 = ormap1550;
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get ormap() {
      return ormap2;
    },
    get andmap() {
      return andmap2;
    },
    get for_each() {
      return for_each2;
    },
    get map() {
      return map2;
    }
  };
})();
var $__runtime_47_paramz_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/paramz.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var Paramz = $__runtime_47_paramz_46_js__;
  var parameterization_key = Paramz.ParameterizationKey;
  var extend_parameterization = Paramz.extendParameterization;
  var exception_handler_key = Paramz.ExceptionHandlerKey;
  var check_for_break = function() {
    return undefined;
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get parameterization_key() {
      return parameterization_key;
    },
    get extend_parameterization() {
      return extend_parameterization;
    },
    get exception_handler_key() {
      return exception_handler_key;
    },
    get check_for_break() {
      return check_for_break;
    }
  };
})();
var $__collects_47_racket_47_private_47_more_45_scheme_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/more-scheme.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_paramz_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var current_parameterization = function() {
    return M0.extend_parameterization(M1.continuation_mark_set_first(false, M0.parameterization_key));
  };
  var call_with_parameterization = function(paramz2976, thunk2977) {
    if (M1.__rjs_quoted__.parameterization_p(paramz2976) !== false) {
      var if_res1826 = M1.rvoid();
    } else {
      var if_res1826 = M1.raise_argument_error($rjs_core.Symbol.make("call-with-parameterization"), "parameterization?", 0, paramz2976, thunk2977);
    }
    if_res1826;
    if (M1.procedure_p(thunk2977) !== false) {
      var if_res1827 = M1.procedure_arity_includes_p(thunk2977, 0);
    } else {
      var if_res1827 = false;
    }
    if (if_res1827 !== false) {
      var if_res1828 = M1.rvoid();
    } else {
      var if_res1828 = M1.raise_argument_error($rjs_core.Symbol.make("call-with-parameterization"), "(-> any)", 1, paramz2976, thunk2977);
    }
    if_res1828;
    var __context1829 = $rjs_core.Marks.getFrames();
    var __context1830;
    try {
      __context1830 = $rjs_core.Marks.enterFrame();
      $rjs_core.Marks.setMark(M0.parameterization_key, paramz2976);
      var __wcm_result1831 = thunk2977();
    } finally {
      $rjs_core.Marks.updateFrame(__context1829, __context1830);
    }
    return __wcm_result1831;
  };
  var let_result1833 = M1.make_struct_type($rjs_core.Symbol.make("break-parameterization"), false, 1, 0, false);
  var struct_break_paramz = let_result1833.getAt(0);
  var make_break_paramz = let_result1833.getAt(1);
  var break_paramz_p = let_result1833.getAt(2);
  var break_paramz_ref = let_result1833.getAt(3);
  var break_paramz_set_bang_ = let_result1833.getAt(4);
  var inspector2978 = M1.current_inspector();
  if (inspector2978 !== false) {
    var if_res1834 = M1.not(M1.inspector_p(inspector2978));
  } else {
    var if_res1834 = false;
  }
  if (if_res1834 !== false) {
    var if_res1835 = M1.raise_argument_error($rjs_core.Symbol.make("define-struct"), "(or/c inspector? #f)", inspector2978);
  } else {
    var if_res1835 = M1.rvoid();
  }
  if_res1835;
  var let_result1836 = M1.make_struct_type($rjs_core.Symbol.make("break-parameterization"), false, 1, 0, false, M1.rnull, inspector2978);
  var type2979 = let_result1836.getAt(0);
  var maker2980 = let_result1836.getAt(1);
  var pred2981 = let_result1836.getAt(2);
  var access2982 = let_result1836.getAt(3);
  var mutate2983 = let_result1836.getAt(4);
  var let_result1837 = M1.values(type2979, maker2980, pred2981, M1.make_struct_field_accessor(access2982, 0, $rjs_core.Symbol.make("cell")), M1.make_struct_field_mutator(mutate2983, 0, $rjs_core.Symbol.make("cell")));
  var struct_break_parameterization = let_result1837.getAt(0);
  var make_break_parameterization = let_result1837.getAt(1);
  var break_parameterization_p = let_result1837.getAt(2);
  var break_parameterization_cell = let_result1837.getAt(3);
  var set_break_parameterization_cell_bang_ = let_result1837.getAt(4);
  var current_break_parameterization = function() {
    return make_break_paramz(M1.continuation_mark_set_first(false, M0.__rjs_quoted__.break_enabled_key));
  };
  var call_with_break_parameterization = function(paramz2984, thunk2985) {
    if (break_paramz_p(paramz2984) !== false) {
      var if_res1838 = M1.rvoid();
    } else {
      var if_res1838 = M1.raise_argument_error($rjs_core.Symbol.make("call-with-break-parameterization"), "break-parameterization?", 0, paramz2984, thunk2985);
    }
    if_res1838;
    if (M1.procedure_p(thunk2985) !== false) {
      var if_res1839 = M1.procedure_arity_includes_p(thunk2985, 0);
    } else {
      var if_res1839 = false;
    }
    if (if_res1839 !== false) {
      var if_res1840 = M1.rvoid();
    } else {
      var if_res1840 = M1.raise_argument_error($rjs_core.Symbol.make("call-with-parameterization"), "(-> any)", 1, paramz2984, thunk2985);
    }
    if_res1840;
    var __context1842 = $rjs_core.Marks.getFrames();
    var __context1843;
    try {
      __context1843 = $rjs_core.Marks.enterFrame();
      $rjs_core.Marks.setMark(M0.__rjs_quoted__.break_enabled_key, break_paramz_ref(paramz2984, 0));
      M0.check_for_break();
      var __wcm_result1844 = thunk2985();
    } finally {
      $rjs_core.Marks.updateFrame(__context1842, __context1843);
    }
    var begin_res1841 = __wcm_result1844;
    M0.check_for_break();
    return begin_res1841;
  };
  var select_handler_by_no_breaks = function(e2986, bpz2987, l2988) {
    var __context1853 = $rjs_core.Marks.getFrames();
    var __context1854;
    try {
      __context1854 = $rjs_core.Marks.enterFrame();
      $rjs_core.Marks.setMark(M0.__rjs_quoted__.break_enabled_key, M1.make_thread_cell(false));
      var loop2989 = function(l2990) {
        if (M1.null_p(l2990) !== false) {
          var if_res1852 = M1.raise(e2986);
        } else {
          if (M1.caar(l2990)(e2986) !== false) {
            var begin_res1846 = M1.cdar(l2990)(e2986);
            var __context1847 = $rjs_core.Marks.getFrames();
            var __context1848;
            try {
              __context1848 = $rjs_core.Marks.enterFrame();
              $rjs_core.Marks.setMark(M0.__rjs_quoted__.break_enabled_key, bpz2987);
              var __wcm_result1849 = M0.check_for_break();
            } finally {
              $rjs_core.Marks.updateFrame(__context1847, __context1848);
            }
            __wcm_result1849;
            var if_res1851 = begin_res1846;
          } else {
            var if_res1851 = loop2989(M1.cdr(l2990));
          }
          var if_res1852 = if_res1851;
        }
        return if_res1852;
      };
      var __wcm_result1855 = loop2989(l2988);
    } finally {
      $rjs_core.Marks.updateFrame(__context1853, __context1854);
    }
    return __wcm_result1855;
  };
  var select_handler_by_breaks_as_is = function(e2991, bpz2992, l2993) {
    if (M1.null_p(l2993) !== false) {
      var if_res1862 = M1.raise(e2991);
    } else {
      if (M1.caar(l2993)(e2991) !== false) {
        var __context1857 = $rjs_core.Marks.getFrames();
        var __context1858;
        try {
          __context1858 = $rjs_core.Marks.enterFrame();
          $rjs_core.Marks.setMark(M0.__rjs_quoted__.break_enabled_key, bpz2992);
          M0.check_for_break();
          var __wcm_result1859 = M1.cdar(l2993)(e2991);
        } finally {
          $rjs_core.Marks.updateFrame(__context1857, __context1858);
        }
        var if_res1861 = __wcm_result1859;
      } else {
        var if_res1861 = select_handler_by_breaks_as_is(e2991, bpz2992, M1.cdr(l2993));
      }
      var if_res1862 = if_res1861;
    }
    return if_res1862;
  };
  var false_thread_cell = M1.make_thread_cell(false);
  var check_with_handlers_in_context = function(handler_prompt_key2994) {
    if (M1.__rjs_quoted__.continuation_prompt_available_p(handler_prompt_key2994) !== false) {
      var if_res1863 = M1.rvoid();
    } else {
      var if_res1863 = M1.error($rjs_core.Symbol.make("with-handlers"), "exception handler used out of context");
    }
    return if_res1863;
  };
  var handler_prompt_key = M1.make_continuation_prompt_tag();
  var call_handled_body = function(bpz2995, handle_proc2996, body_thunk2997) {
    var __context1872 = $rjs_core.Marks.getFrames();
    var __context1873;
    try {
      __context1873 = $rjs_core.Marks.enterFrame();
      $rjs_core.Marks.setMark(M0.__rjs_quoted__.break_enabled_key, false_thread_cell);
      var __wcm_result1874 = M1.call_with_continuation_prompt(function(bpz2998, body_thunk2999) {
        var __context1868 = $rjs_core.Marks.getFrames();
        var __context1869;
        try {
          __context1869 = $rjs_core.Marks.enterFrame();
          $rjs_core.Marks.setMark(M0.__rjs_quoted__.break_enabled_key, bpz2998);
          var __context1864 = $rjs_core.Marks.getFrames();
          var __context1865;
          try {
            __context1865 = __context1864;
            $rjs_core.Marks.setMark(M0.exception_handler_key, function(e3000) {
              return M1.abort_current_continuation(handler_prompt_key, e3000);
            });
            var __wcm_result1866 = body_thunk2999();
          } finally {
            $rjs_core.Marks.updateFrame(__context1864, __context1865);
          }
          var __wcm_result1870 = __wcm_result1866;
        } finally {
          $rjs_core.Marks.updateFrame(__context1868, __context1869);
        }
        return __wcm_result1870;
      }, handler_prompt_key, handle_proc2996, bpz2995, body_thunk2997);
    } finally {
      $rjs_core.Marks.updateFrame(__context1872, __context1873);
    }
    return __wcm_result1874;
  };
  var call_with_exception_handler = function(exnh3001, thunk3002) {
    var __context1877 = $rjs_core.Marks.getFrames();
    var __context1878;
    try {
      __context1878 = $rjs_core.Marks.enterFrame();
      $rjs_core.Marks.setMark(M0.exception_handler_key, exnh3001);
      var __wcm_result1879 = thunk3002();
    } finally {
      $rjs_core.Marks.updateFrame(__context1877, __context1878);
    }
    var begin_res1876 = __wcm_result1879;
    M1.rvoid();
    return begin_res1876;
  };
  var call_by_cc = M1.__rjs_quoted__.call_with_current_continuation;
  var not_there3003 = M1.gensym();
  var up3004 = function(who3005, mut_p3006, set3007, ht3008, key3009, xform3010, default3011) {
    if (M1.__rjs_quoted__.hash_p(ht3008) !== false) {
      if (mut_p3006 !== false) {
        var if_res1881 = M1.not(M1.__rjs_quoted__.immutable_p(ht3008));
      } else {
        var if_res1881 = M1.__rjs_quoted__.immutable_p(ht3008);
      }
      var if_res1882 = if_res1881;
    } else {
      var if_res1882 = false;
    }
    if (if_res1882 !== false) {
      var if_res1884 = M1.rvoid();
    } else {
      if (mut_p3006 !== false) {
        var if_res1883 = "(and/c hash? (not/c immutable?))";
      } else {
        var if_res1883 = "(and/c hash? immutable?)";
      }
      var if_res1884 = M1.raise_argument_error(who3005, if_res1883, ht3008);
    }
    if_res1884;
    if (M1.procedure_p(xform3010) !== false) {
      var if_res1885 = M1.procedure_arity_includes_p(xform3010, 1);
    } else {
      var if_res1885 = false;
    }
    if (if_res1885 !== false) {
      var if_res1886 = M1.rvoid();
    } else {
      var if_res1886 = M1.raise_argument_error(who3005, "(any/c . -> . any/c)", xform3010);
    }
    if_res1886;
    var v3012 = M1.hash_ref(ht3008, key3009, default3011);
    if (M1.eq_p(v3012, not_there3003) !== false) {
      var if_res1887 = M1.__rjs_quoted__.raise_mismatch_error(who3005, "no value found for key: ", key3009);
    } else {
      var if_res1887 = set3007(ht3008, key3009, xform3010(v3012));
    }
    return if_res1887;
  };
  var cl1888 = function(ht3017, key3018, xform3019, default3020) {
    return up3004($rjs_core.Symbol.make("hash-update"), false, M1.hash_set, ht3017, key3018, xform3019, default3020);
  };
  var cl1889 = function(ht3021, key3022, xform3023) {
    return hash_update(ht3021, key3022, xform3023, not_there3003);
  };
  var hash_update3013 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1890 = {
      '4': cl1888,
      '3': cl1889
    }[arguments.length];
    if (fixed_lam1890 !== undefined !== false) {
      return fixed_lam1890.apply(null, arguments);
    } else {
      return M1.error("case-lambda: invalid case");
    }
  }, [3, 4]);
  var cl1891 = function(ht3024, key3025, xform3026, default3027) {
    return up3004($rjs_core.Symbol.make("hash-update!"), true, M1.hash_set_bang_, ht3024, key3025, xform3026, default3027);
  };
  var cl1892 = function(ht3028, key3029, xform3030) {
    return hash_update_bang_(ht3028, key3029, xform3030, not_there3003);
  };
  var hash_update_bang_3014 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1893 = {
      '4': cl1891,
      '3': cl1892
    }[arguments.length];
    if (fixed_lam1893 !== undefined !== false) {
      return fixed_lam1893.apply(null, arguments);
    } else {
      return M1.error("case-lambda: invalid case");
    }
  }, [3, 4]);
  var hash_has_key_p3015 = function(ht3031, key3032) {
    if (M1.__rjs_quoted__.hash_p(ht3031) !== false) {
      var if_res1894 = M1.rvoid();
    } else {
      var if_res1894 = M1.raise_argument_error($rjs_core.Symbol.make("hash-has-key?"), "hash?", 0, ht3031, key3032);
    }
    if_res1894;
    return M1.not(M1.eq_p(not_there3003, M1.hash_ref(ht3031, key3032, not_there3003)));
  };
  var hash_ref_bang_3016 = function(ht3033, key3034, new3035) {
    if (M1.__rjs_quoted__.hash_p(ht3033) !== false) {
      var if_res1895 = M1.not(M1.__rjs_quoted__.immutable_p(ht3033));
    } else {
      var if_res1895 = false;
    }
    if (if_res1895 !== false) {
      var if_res1896 = M1.rvoid();
    } else {
      var if_res1896 = M1.raise_argument_error($rjs_core.Symbol.make("hash-ref!"), "(and/c hash? (not/c immutable?))", 0, ht3033, key3034, new3035);
    }
    if_res1896;
    var v3036 = M1.hash_ref(ht3033, key3034, not_there3003);
    if (M1.eq_p(not_there3003, v3036) !== false) {
      if (M1.procedure_p(new3035) !== false) {
        var if_res1897 = new3035();
      } else {
        var if_res1897 = new3035;
      }
      var n3037 = if_res1897;
      M1.hash_set_bang_(ht3033, key3034, n3037);
      var if_res1898 = n3037;
    } else {
      var if_res1898 = v3036;
    }
    return if_res1898;
  };
  var let_result1899 = M1.values(hash_update3013, hash_update_bang_3014, hash_has_key_p3015, hash_ref_bang_3016);
  var hash_update = let_result1899.getAt(0);
  var hash_update_bang_ = let_result1899.getAt(1);
  var hash_has_key_p = let_result1899.getAt(2);
  var hash_ref_bang_ = let_result1899.getAt(3);
  var __rjs_quoted__ = {};
  __rjs_quoted__.select_handler_by_breaks_as_is = select_handler_by_breaks_as_is;
  __rjs_quoted__.call_by_cc = call_by_cc;
  __rjs_quoted__.select_handler_by_no_breaks = select_handler_by_no_breaks;
  __rjs_quoted__.call_handled_body = call_handled_body;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get hash_update_bang_() {
      return hash_update_bang_;
    },
    get hash_update() {
      return hash_update;
    },
    get hash_has_key_p() {
      return hash_has_key_p;
    },
    get hash_ref_bang_() {
      return hash_ref_bang_;
    },
    get call_by_cc() {
      return call_by_cc;
    },
    get call_with_exception_handler() {
      return call_with_exception_handler;
    },
    get break_parameterization_p() {
      return break_paramz_p;
    },
    get call_with_break_parameterization() {
      return call_with_break_parameterization;
    },
    get current_break_parameterization() {
      return current_break_parameterization;
    },
    get call_with_parameterization() {
      return call_with_parameterization;
    },
    get current_parameterization() {
      return current_parameterization;
    }
  };
})();
var $__collects_47_racket_47_private_47_path_45_list_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/path-list.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  if (M0.eq_p(M0.system_type(), $rjs_core.Symbol.make("windows")) !== false) {
    var if_res2812 = ";";
  } else {
    var if_res2812 = ":";
  }
  var sep4541 = if_res2812;
  var r4539 = M0.byte_regexp(M0.string__gt_bytes_by_utf_8(M0.format("([^~a]*)~a(.*)", sep4541, sep4541)));
  var cons_path4540 = function(default4542, s4543, l4544) {
    if (M0.eq_p(M0.system_type(), $rjs_core.Symbol.make("windows")) !== false) {
      var if_res2813 = M0.__rjs_quoted__.regexp_replace_times_("/\"/", s4543, new Uint8Array([]));
    } else {
      var if_res2813 = s4543;
    }
    var s4545 = if_res2813;
    if (M0.__rjs_quoted__.bytes_eq__p(s4545, new Uint8Array([])) !== false) {
      var if_res2814 = M0.append(default4542, l4544);
    } else {
      var if_res2814 = M0.cons(M0.__rjs_quoted__.bytes__gt_path(s4545), l4544);
    }
    return if_res2814;
  };
  var path_list_string__gt_path_list = function(s4546, default4547) {
    var or_part4548 = M0.bytes_p(s4546);
    if (or_part4548 !== false) {
      var if_res2815 = or_part4548;
    } else {
      var if_res2815 = M0.string_p(s4546);
    }
    if (if_res2815 !== false) {
      var if_res2816 = M0.rvoid();
    } else {
      var if_res2816 = M0.raise_argument_error($rjs_core.Symbol.make("path-list-string->path-list"), "(or/c bytes? string?)", s4546);
    }
    if_res2816;
    if (M0.list_p(default4547) !== false) {
      var if_res2817 = M0.andmap(M0.__rjs_quoted__.path_p, default4547);
    } else {
      var if_res2817 = false;
    }
    if (if_res2817 !== false) {
      var if_res2818 = M0.rvoid();
    } else {
      var if_res2818 = M0.raise_argument_error($rjs_core.Symbol.make("path-list-string->path-list"), "(listof path?)", default4547);
    }
    if_res2818;
    var loop4549 = function(s4550) {
      var m4551 = M0.regexp_match(r4539, s4550);
      if (m4551 !== false) {
        var if_res2820 = cons_path4540(default4547, M0.cadr(m4551), loop4549(M0.caddr(m4551)));
      } else {
        var if_res2820 = cons_path4540(default4547, s4550, M0.rnull);
      }
      return if_res2820;
    };
    if (M0.string_p(s4546) !== false) {
      var if_res2819 = M0.string__gt_bytes_by_utf_8(s4546);
    } else {
      var if_res2819 = s4546;
    }
    return loop4549(if_res2819);
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get path_list_string__gt_path_list() {
      return path_list_string__gt_path_list;
    }
  };
})();
var $__collects_47_racket_47_private_47_reading_45_param_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/reading-param.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_paramz_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var call_with_default_reading_parameterization = function(thunk4538) {
    if (M1.procedure_p(thunk4538) !== false) {
      var if_res2806 = M1.procedure_arity_includes_p(thunk4538, 0);
    } else {
      var if_res2806 = false;
    }
    if (if_res2806 !== false) {
      var __context2807 = $rjs_core.Marks.getFrames();
      var __context2808;
      try {
        __context2808 = $rjs_core.Marks.enterFrame();
        $rjs_core.Marks.setMark(M0.parameterization_key, M0.extend_parameterization(M1.continuation_mark_set_first(false, M0.parameterization_key), M1.__rjs_quoted__.read_case_sensitive, true, M1.__rjs_quoted__.read_square_bracket_as_paren, true, M1.__rjs_quoted__.read_curly_brace_as_paren, true, M1.__rjs_quoted__.read_square_bracket_with_tag, false, M1.__rjs_quoted__.read_curly_brace_with_tag, false, M1.__rjs_quoted__.read_accept_box, true, M1.__rjs_quoted__.read_accept_compiled, false, M1.__rjs_quoted__.read_accept_bar_quote, true, M1.__rjs_quoted__.read_accept_graph, true, M1.__rjs_quoted__.read_decimal_as_inexact, true, M1.__rjs_quoted__.read_cdot, false, M1.__rjs_quoted__.read_accept_dot, true, M1.__rjs_quoted__.read_accept_infix_dot, true, M1.__rjs_quoted__.read_accept_quasiquote, true, M1.__rjs_quoted__.read_accept_reader, false, M1.__rjs_quoted__.read_accept_lang, true, M1.__rjs_quoted__.current_readtable, false));
        var __wcm_result2809 = thunk4538();
      } finally {
        $rjs_core.Marks.updateFrame(__context2807, __context2808);
      }
      var if_res2811 = __wcm_result2809;
    } else {
      var if_res2811 = M1.raise_argument_error($rjs_core.Symbol.make("call-with-default-reading-parameterization"), "(procedure-arity-includes/c 0)", thunk4538);
    }
    return if_res2811;
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get call_with_default_reading_parameterization() {
      return call_with_default_reading_parameterization;
    }
  };
})();
var $__collects_47_racket_47_private_47_path_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/path.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var path_string_p = function(s4335) {
    var or_part4336 = M0.__rjs_quoted__.path_p(s4335);
    if (or_part4336 !== false) {
      var if_res2628 = or_part4336;
    } else {
      if (M0.string_p(s4335) !== false) {
        var or_part4337 = M0.__rjs_quoted__.relative_path_p(s4335);
        if (or_part4337 !== false) {
          var if_res2626 = or_part4337;
        } else {
          var if_res2626 = M0.__rjs_quoted__.absolute_path_p(s4335);
        }
        var if_res2627 = if_res2626;
      } else {
        var if_res2627 = false;
      }
      var if_res2628 = if_res2627;
    }
    return if_res2628;
  };
  var bsbs = M0.string("\\", "\\");
  var normal_case_path = function(s4338) {
    var or_part4339 = M0.__rjs_quoted__.path_for_some_system_p(s4338);
    if (or_part4339 !== false) {
      var if_res2629 = or_part4339;
    } else {
      var if_res2629 = path_string_p(s4338);
    }
    if (if_res2629 !== false) {
      var if_res2630 = M0.rvoid();
    } else {
      var if_res2630 = M0.raise_argument_error($rjs_core.Symbol.make("normal-path-case"), "(or/c path-for-some-system? path-string?)", s4338);
    }
    if_res2630;
    if (M0.__rjs_quoted__.path_for_some_system_p(s4338) !== false) {
      var if_res2631 = M0.eq_p(M0.__rjs_quoted__.path_convention_type(s4338), $rjs_core.Symbol.make("windows"));
    } else {
      var if_res2631 = M0.eq_p(M0.system_type(), $rjs_core.Symbol.make("windows"));
    }
    if (if_res2631 !== false) {
      if (M0.string_p(s4338) !== false) {
        var if_res2632 = s4338;
      } else {
        var if_res2632 = M0.__rjs_quoted__.bytes__gt_string_by_locale(M0.__rjs_quoted__.path__gt_bytes(s4338));
      }
      var str4340 = if_res2632;
      if (M0.__rjs_quoted__.regexp_match_p("/^[\\][\\][?][\\]/", str4340) !== false) {
        if (M0.string_p(s4338) !== false) {
          var if_res2633 = M0.__rjs_quoted__.string__gt_path(s4338);
        } else {
          var if_res2633 = s4338;
        }
        var if_res2635 = if_res2633;
      } else {
        var s4341 = M0.__rjs_quoted__.string_locale_downcase(str4340);
        if (M0.__rjs_quoted__.regexp_match_p("/[\\/\\][. ]+[\\/\\]*$/", s4341) !== false) {
          var if_res2634 = s4341;
        } else {
          var if_res2634 = M0.__rjs_quoted__.regexp_replace_times_("/[ .]+([\\/\\]*)$/", s4341, "\\1");
        }
        var if_res2635 = M0.__rjs_quoted__.bytes__gt_path(M0.__rjs_quoted__.string__gt_bytes_by_locale(M0.__rjs_quoted__.regexp_replace_times_("/\\//", if_res2634, bsbs)), $rjs_core.Symbol.make("windows"));
      }
      var if_res2637 = if_res2635;
    } else {
      if (M0.string_p(s4338) !== false) {
        var if_res2636 = M0.__rjs_quoted__.string__gt_path(s4338);
      } else {
        var if_res2636 = s4338;
      }
      var if_res2637 = if_res2636;
    }
    return if_res2637;
  };
  var check_extension_call = function(s4342, sfx4343, who4344) {
    var or_part4345 = M0.__rjs_quoted__.path_for_some_system_p(s4342);
    if (or_part4345 !== false) {
      var if_res2638 = or_part4345;
    } else {
      var if_res2638 = path_string_p(s4342);
    }
    if (if_res2638 !== false) {
      var if_res2639 = M0.rvoid();
    } else {
      var if_res2639 = M0.raise_argument_error(who4344, "(or/c path-for-some-system? path-string?)", 0, s4342, sfx4343);
    }
    if_res2639;
    var or_part4346 = M0.string_p(sfx4343);
    if (or_part4346 !== false) {
      var if_res2640 = or_part4346;
    } else {
      var if_res2640 = M0.bytes_p(sfx4343);
    }
    if (if_res2640 !== false) {
      var if_res2641 = M0.rvoid();
    } else {
      var if_res2641 = M0.raise_argument_error(who4344, "(or/c string? bytes?)", 1, s4342, sfx4343);
    }
    if_res2641;
    var let_result2642 = M0.__rjs_quoted__.split_path(s4342);
    var base4347 = let_result2642.getAt(0);
    var name4348 = let_result2642.getAt(1);
    var dir_p4349 = let_result2642.getAt(2);
    if (M0.not(base4347) !== false) {
      var if_res2643 = M0.__rjs_quoted__.raise_mismatch_error(who4344, "cannot add an extension to a root path: ", s4342);
    } else {
      var if_res2643 = M0.rvoid();
    }
    if_res2643;
    return M0.values(base4347, name4348);
  };
  var path_adjust_extension = function(name4350, sep4351, rest_bytes4352, s4353, sfx4354) {
    var let_result2644 = check_extension_call(s4353, sfx4354, name4350);
    var base4355 = let_result2644.getAt(0);
    var name4356 = let_result2644.getAt(1);
    var bs4357 = M0.__rjs_quoted__.path_element__gt_bytes(name4356);
    var finish4358 = function(i4359, sep4360, i24361) {
      var temp2648 = M0.__rjs_quoted__.subbytes(bs4357, 0, i4359);
      var temp2647 = rest_bytes4352(bs4357, i24361);
      if (M0.string_p(sfx4354) !== false) {
        var if_res2646 = M0.__rjs_quoted__.string__gt_bytes_by_locale(sfx4354, M0.char__gt_integer("?"));
      } else {
        var if_res2646 = sfx4354;
      }
      var temp2649 = M0.__rjs_quoted__.bytes_append(temp2648, sep4360, temp2647, if_res2646);
      if (M0.__rjs_quoted__.path_for_some_system_p(s4353) !== false) {
        var if_res2645 = M0.__rjs_quoted__.path_convention_type(s4353);
      } else {
        var if_res2645 = M0.__rjs_quoted__.system_path_convention_type();
      }
      return M0.__rjs_quoted__.bytes__gt_path_element(temp2649, if_res2645);
    };
    var loop4363 = function(i4364) {
      if (M0.zero_p(i4364) !== false) {
        var if_res2652 = finish4358(M0.__rjs_quoted__.bytes_length(bs4357), new Uint8Array([]), M0.__rjs_quoted__.bytes_length(bs4357));
      } else {
        var i4365 = M0.sub1(i4364);
        if (M0.not(M0.zero_p(i4365)) !== false) {
          var if_res2650 = M0.eq_p(M0.char__gt_integer("."), M0.__rjs_quoted__.bytes_ref(bs4357, i4365));
        } else {
          var if_res2650 = false;
        }
        if (if_res2650 !== false) {
          var if_res2651 = finish4358(i4365, sep4351, M0.add1(i4365));
        } else {
          var if_res2651 = loop4363(i4365);
        }
        var if_res2652 = if_res2651;
      }
      return if_res2652;
    };
    var new_name4362 = loop4363(M0.__rjs_quoted__.bytes_length(bs4357));
    if (M0.__rjs_quoted__.path_for_some_system_p(base4355) !== false) {
      var if_res2653 = M0.__rjs_quoted__.build_path(base4355, new_name4362);
    } else {
      var if_res2653 = new_name4362;
    }
    return if_res2653;
  };
  var path_replace_extension = function(s4366, sfx4367) {
    return path_adjust_extension($rjs_core.Symbol.make("path-replace-extension"), new Uint8Array([]), function(bs4368, i4369) {
      return new Uint8Array([]);
    }, s4366, sfx4367);
  };
  var path_add_extension = function(s4370, sfx4371) {
    return path_adjust_extension($rjs_core.Symbol.make("path-add-extension"), new Uint8Array([95]), M0.__rjs_quoted__.subbytes, s4370, sfx4371);
  };
  var reroot_path = function(p4372, root4373) {
    var or_part4374 = path_string_p(p4372);
    if (or_part4374 !== false) {
      var if_res2654 = or_part4374;
    } else {
      var if_res2654 = M0.__rjs_quoted__.path_for_some_system_p(p4372);
    }
    if (if_res2654 !== false) {
      var if_res2655 = M0.rvoid();
    } else {
      var if_res2655 = M0.raise_argument_error($rjs_core.Symbol.make("reroot-path"), "(or/c path-string? path-for-some-system?)", 0, p4372, root4373);
    }
    if_res2655;
    var let_result2656 = M0.values();
    var or_part4375 = path_string_p(root4373);
    if (or_part4375 !== false) {
      var if_res2657 = or_part4375;
    } else {
      var if_res2657 = M0.__rjs_quoted__.path_for_some_system_p(root4373);
    }
    if (if_res2657 !== false) {
      var if_res2658 = M0.rvoid();
    } else {
      var if_res2658 = M0.raise_argument_error($rjs_core.Symbol.make("reroot-path"), "(or/c path-string? path-for-some-system?)", 1, p4372, root4373);
    }
    if_res2658;
    var let_result2659 = M0.values();
    if (M0.__rjs_quoted__.path_for_some_system_p(p4372) !== false) {
      var if_res2660 = M0.__rjs_quoted__.path_convention_type(p4372);
    } else {
      var if_res2660 = M0.__rjs_quoted__.system_path_convention_type();
    }
    var conv4376 = if_res2660;
    var or_part4377 = M0.__rjs_quoted__.complete_path_p(p4372);
    if (or_part4377 !== false) {
      var if_res2661 = or_part4377;
    } else {
      var if_res2661 = M0.eq_p(M0.__rjs_quoted__.system_path_convention_type(), conv4376);
    }
    if (if_res2661 !== false) {
      var if_res2662 = M0.rvoid();
    } else {
      var if_res2662 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("reroot-path"), "path is not complete and not the platform's convention", "path", p4372, "platform convention type", M0.__rjs_quoted__.system_path_convention_type());
    }
    if_res2662;
    var let_result2663 = M0.values();
    if (M0.__rjs_quoted__.path_for_some_system_p(root4373) !== false) {
      var if_res2664 = M0.__rjs_quoted__.path_convention_type(root4373);
    } else {
      var if_res2664 = M0.__rjs_quoted__.system_path_convention_type();
    }
    if (M0.eq_p(if_res2664, conv4376) !== false) {
      var if_res2665 = M0.rvoid();
    } else {
      var if_res2665 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("reroot-path"), "given paths use different conventions", "path", p4372, "root path", root4373);
    }
    if_res2665;
    var let_result2666 = M0.values();
    if (M0.__rjs_quoted__.complete_path_p(p4372) !== false) {
      var if_res2667 = p4372;
    } else {
      var if_res2667 = M0.__rjs_quoted__.path__gt_complete_path(p4372);
    }
    var c_p4378 = normal_case_path(M0.__rjs_quoted__.cleanse_path(if_res2667));
    var bstr4379 = M0.__rjs_quoted__.path__gt_bytes(c_p4378);
    if (M0.eq_p(conv4376, $rjs_core.Symbol.make("unix")) !== false) {
      if (M0.__rjs_quoted__.bytes_eq__p(bstr4379, new Uint8Array([47])) !== false) {
        if (M0.__rjs_quoted__.path_for_some_system_p(root4373) !== false) {
          var if_res2668 = root4373;
        } else {
          var if_res2668 = M0.__rjs_quoted__.string__gt_path(root4373);
        }
        var if_res2669 = if_res2668;
      } else {
        var if_res2669 = M0.__rjs_quoted__.build_path(root4373, M0.__rjs_quoted__.bytes__gt_path(M0.__rjs_quoted__.subbytes(M0.__rjs_quoted__.path__gt_bytes(c_p4378), 1), conv4376));
      }
      var if_res2676 = if_res2669;
    } else {
      if (M0.eq_p(conv4376, $rjs_core.Symbol.make("windows")) !== false) {
        if (M0.__rjs_quoted__.regexp_match_p("/^\\\\\\\\[?]\\\\[a-z]:/", bstr4379) !== false) {
          var if_res2674 = M0.__rjs_quoted__.bytes_append(new Uint8Array([92, 92, 63, 92, 82, 69, 76, 92]), M0.__rjs_quoted__.subbytes(bstr4379, 4, 5), new Uint8Array([92]), M0.__rjs_quoted__.subbytes(bstr4379, 6));
        } else {
          if (M0.__rjs_quoted__.regexp_match_p("/^\\\\\\\\[?]\\\\UNC\\\\/", bstr4379) !== false) {
            var if_res2673 = M0.__rjs_quoted__.bytes_append(new Uint8Array([92, 92, 63, 92, 82, 69, 76, 92]), M0.__rjs_quoted__.subbytes(bstr4379, 4));
          } else {
            if (M0.__rjs_quoted__.regexp_match_p("/^\\\\\\\\[?]\\\\UNC\\\\/", bstr4379) !== false) {
              var if_res2672 = M0.__rjs_quoted__.bytes_append(new Uint8Array([92, 92, 63, 92, 82, 69, 76, 92]), M0.__rjs_quoted__.subbytes(bstr4379, 4));
            } else {
              if (M0.__rjs_quoted__.regexp_match_p("/^\\\\\\\\/", bstr4379) !== false) {
                var if_res2671 = M0.__rjs_quoted__.bytes_append(new Uint8Array([85, 78, 67, 92]), M0.__rjs_quoted__.subbytes(bstr4379, 2));
              } else {
                if (M0.__rjs_quoted__.regexp_match_p("/^[a-z]:/", bstr4379) !== false) {
                  var if_res2670 = M0.__rjs_quoted__.bytes_append(M0.__rjs_quoted__.subbytes(bstr4379, 0, 1), M0.__rjs_quoted__.subbytes(bstr4379, 2));
                } else {
                  var if_res2670 = M0.rvoid();
                }
                var if_res2671 = if_res2670;
              }
              var if_res2672 = if_res2671;
            }
            var if_res2673 = if_res2672;
          }
          var if_res2674 = if_res2673;
        }
        var if_res2675 = M0.__rjs_quoted__.build_path(root4373, M0.__rjs_quoted__.bytes__gt_path(if_res2674, conv4376));
      } else {
        var if_res2675 = M0.rvoid();
      }
      var if_res2676 = if_res2675;
    }
    return if_res2676;
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get reroot_path() {
      return reroot_path;
    },
    get path_add_extension() {
      return path_add_extension;
    },
    get path_replace_extension() {
      return path_replace_extension;
    },
    get normal_case_path() {
      return normal_case_path;
    },
    get path_string_p() {
      return path_string_p;
    }
  };
})();
var $__collects_47_racket_47_private_47_executable_45_path_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/executable-path.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var M1 = $__collects_47_racket_47_private_47_path_45_list_46_rkt_46_js__;
  var M2 = $__collects_47_racket_47_private_47_path_46_rkt_46_js__;
  var cl2821 = function(program4552, libpath4553, reverse_p4554) {
    if (M2.path_string_p(program4552) !== false) {
      var if_res2825 = M0.rvoid();
    } else {
      var if_res2825 = M0.raise_argument_error($rjs_core.Symbol.make("find-executable-path"), "path-string?", program4552);
    }
    if_res2825;
    var or_part4555 = M0.not(libpath4553);
    if (or_part4555 !== false) {
      var if_res2827 = or_part4555;
    } else {
      if (M2.path_string_p(libpath4553) !== false) {
        var if_res2826 = M0.__rjs_quoted__.relative_path_p(libpath4553);
      } else {
        var if_res2826 = false;
      }
      var if_res2827 = if_res2826;
    }
    if (if_res2827 !== false) {
      var if_res2828 = M0.rvoid();
    } else {
      var if_res2828 = M0.raise_argument_error($rjs_core.Symbol.make("find-executable-path"), "(or/c #f (and/c path-string? relative-path?))", libpath4553);
    }
    if_res2828;
    var found_exec4556 = function(exec_name4557) {
      if (libpath4553 !== false) {
        var let_result2829 = M0.__rjs_quoted__.split_path(exec_name4557);
        var base4558 = let_result2829.getAt(0);
        var name4559 = let_result2829.getAt(1);
        var isdir_p4560 = let_result2829.getAt(2);
        var next4561 = function() {
          var resolved4562 = M0.__rjs_quoted__.resolve_path(exec_name4557);
          if (M0.equal_p(resolved4562, exec_name4557) !== false) {
            var if_res2831 = false;
          } else {
            if (M0.__rjs_quoted__.relative_path_p(resolved4562) !== false) {
              var if_res2830 = found_exec4556(M0.__rjs_quoted__.build_path(base4558, resolved4562));
            } else {
              var if_res2830 = found_exec4556(resolved4562);
            }
            var if_res2831 = if_res2830;
          }
          return if_res2831;
        };
        if (reverse_p4554 !== false) {
          var if_res2832 = next4561();
        } else {
          var if_res2832 = false;
        }
        var or_part4563 = if_res2832;
        if (or_part4563 !== false) {
          var if_res2838 = or_part4563;
        } else {
          if (M0.__rjs_quoted__.path_p(base4558) !== false) {
            var lib4565 = M0.__rjs_quoted__.build_path(base4558, libpath4553);
            var or_part4566 = M0.__rjs_quoted__.directory_exists_p(lib4565);
            if (or_part4566 !== false) {
              var if_res2833 = or_part4566;
            } else {
              var if_res2833 = M0.__rjs_quoted__.file_exists_p(lib4565);
            }
            if (if_res2833 !== false) {
              var if_res2834 = lib4565;
            } else {
              var if_res2834 = false;
            }
            var if_res2835 = if_res2834;
          } else {
            var if_res2835 = false;
          }
          var or_part4564 = if_res2835;
          if (or_part4564 !== false) {
            var if_res2837 = or_part4564;
          } else {
            if (M0.not(reverse_p4554) !== false) {
              var if_res2836 = next4561();
            } else {
              var if_res2836 = false;
            }
            var if_res2837 = if_res2836;
          }
          var if_res2838 = if_res2837;
        }
        var if_res2839 = if_res2838;
      } else {
        var if_res2839 = exec_name4557;
      }
      return if_res2839;
    };
    if (M0.__rjs_quoted__.relative_path_p(program4552) !== false) {
      var let_result2840 = M0.__rjs_quoted__.split_path(program4552);
      var base4567 = let_result2840.getAt(0);
      var name4568 = let_result2840.getAt(1);
      var dir_p4569 = let_result2840.getAt(2);
      var if_res2841 = M0.eq_p(base4567, $rjs_core.Symbol.make("relative"));
    } else {
      var if_res2841 = false;
    }
    if (if_res2841 !== false) {
      var paths_str4570 = M0.__rjs_quoted__.environment_variables_ref(M0.__rjs_quoted__.current_environment_variables(), new Uint8Array([80, 65, 84, 72]));
      var win_add4571 = function(s4572) {
        if (M0.eq_p(M0.system_type(), $rjs_core.Symbol.make("windows")) !== false) {
          var if_res2842 = M0.cons(M0.__rjs_quoted__.bytes__gt_path(new Uint8Array([46])), s4572);
        } else {
          var if_res2842 = s4572;
        }
        return if_res2842;
      };
      var loop4573 = function(paths4574) {
        if (M0.null_p(paths4574) !== false) {
          var if_res2845 = false;
        } else {
          var base4575 = M0.__rjs_quoted__.path__gt_complete_path(M0.car(paths4574));
          var name4576 = M0.__rjs_quoted__.build_path(base4575, program4552);
          if (M0.__rjs_quoted__.file_exists_p(name4576) !== false) {
            var if_res2844 = found_exec4556(name4576);
          } else {
            var if_res2844 = loop4573(M0.cdr(paths4574));
          }
          var if_res2845 = if_res2844;
        }
        return if_res2845;
      };
      if (paths_str4570 !== false) {
        var if_res2843 = M1.path_list_string__gt_path_list(M0.__rjs_quoted__.bytes__gt_string_by_locale(paths_str4570, "?"), M0.rnull);
      } else {
        var if_res2843 = M0.rnull;
      }
      var if_res2847 = loop4573(win_add4571(if_res2843));
    } else {
      var p4577 = M0.__rjs_quoted__.path__gt_complete_path(program4552);
      if (M0.__rjs_quoted__.file_exists_p(p4577) !== false) {
        var if_res2846 = found_exec4556(p4577);
      } else {
        var if_res2846 = false;
      }
      var if_res2847 = if_res2846;
    }
    return if_res2847;
  };
  var cl2822 = function(program4578, libpath4579) {
    return find_executable_path(program4578, libpath4579, false);
  };
  var cl2823 = function(program4580) {
    return find_executable_path(program4580, false, false);
  };
  var find_executable_path = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2824 = {
      '3': cl2821,
      '2': cl2822,
      '1': cl2823
    }[arguments.length];
    if (fixed_lam2824 !== undefined !== false) {
      return fixed_lam2824.apply(null, arguments);
    } else {
      return M0.error("case-lambda: invalid case");
    }
  }, [1, 2, 3]);
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get find_executable_path() {
      return find_executable_path;
    }
  };
})();
var $__collects_47_racket_47_private_47_config_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/config.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_paramz_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var M2 = $__collects_47_racket_47_private_47_executable_45_path_46_rkt_46_js__;
  var find_main_collects = function() {
    return M0.__rjs_quoted__.cache_configuration(0, function() {
      return exe_relative_path__gt_complete_path(M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("collects-dir")));
    });
  };
  var find_main_config = function() {
    return M0.__rjs_quoted__.cache_configuration(1, function() {
      return exe_relative_path__gt_complete_path(M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("config-dir")));
    });
  };
  var exe_relative_path__gt_complete_path = function(collects_path4532) {
    if (M1.__rjs_quoted__.complete_path_p(collects_path4532) !== false) {
      var if_res2805 = M1.__rjs_quoted__.simplify_path(collects_path4532);
    } else {
      if (M1.__rjs_quoted__.absolute_path_p(collects_path4532) !== false) {
        var exec4533 = M1.__rjs_quoted__.path__gt_complete_path(M2.find_executable_path(M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("exec-file"))), M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("orig-dir")));
        var let_result2802 = M1.__rjs_quoted__.split_path(exec4533);
        var base4534 = let_result2802.getAt(0);
        var name4535 = let_result2802.getAt(1);
        var dir_p4536 = let_result2802.getAt(2);
        var if_res2804 = M1.__rjs_quoted__.simplify_path(M1.__rjs_quoted__.path__gt_complete_path(collects_path4532, base4534));
      } else {
        var p4537 = M2.find_executable_path(M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("exec-file")), collects_path4532, true);
        if (p4537 !== false) {
          var if_res2803 = M1.__rjs_quoted__.simplify_path(p4537);
        } else {
          var if_res2803 = false;
        }
        var if_res2804 = if_res2803;
      }
      var if_res2805 = if_res2804;
    }
    return if_res2805;
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get exe_relative_path__gt_complete_path() {
      return exe_relative_path__gt_complete_path;
    },
    get find_main_config() {
      return find_main_config;
    },
    get find_main_collects() {
      return find_main_collects;
    }
  };
})();
var $__collects_47_racket_47_private_47_collect_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/collect.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_paramz_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var M2 = $__collects_47_racket_47_private_47_path_45_list_46_rkt_46_js__;
  var M3 = $__collects_47_racket_47_private_47_reading_45_param_46_rkt_46_js__;
  var M4 = $__collects_47_racket_47_private_47_path_46_rkt_46_js__;
  var M5 = $__collects_47_racket_47_private_47_config_46_rkt_46_js__;
  var _check_relpath = function(who4380, s4381) {
    if (M4.path_string_p(s4381) !== false) {
      var if_res2677 = M1.rvoid();
    } else {
      var if_res2677 = M1.raise_argument_error(who4380, "path-string?", s4381);
    }
    if_res2677;
    if (M1.__rjs_quoted__.relative_path_p(s4381) !== false) {
      var if_res2678 = M1.rvoid();
    } else {
      var if_res2678 = M1.__rjs_quoted__.raise_arguments_error(who4380, "invalid relative path", "path", s4381);
    }
    return if_res2678;
  };
  var _check_collection = function(who4382, collection4383, collection_path4384) {
    _check_relpath(who4382, collection4383);
    return M1.for_each(function(p4385) {
      return _check_relpath(who4382, p4385);
    }, collection_path4384);
  };
  var _check_fail = function(who4386, fail4387) {
    if (M1.procedure_p(fail4387) !== false) {
      var if_res2679 = M1.procedure_arity_includes_p(fail4387, 1);
    } else {
      var if_res2679 = false;
    }
    if (if_res2679 !== false) {
      var if_res2680 = M1.rvoid();
    } else {
      var if_res2680 = M1.raise_argument_error(who4386, "(any/c . -> . any)", fail4387);
    }
    return if_res2680;
  };
  var collection_path = function(fail4388, collection4389, collection_path4390) {
    _check_collection($rjs_core.Symbol.make("collection-path"), collection4389, collection_path4390);
    _check_fail($rjs_core.Symbol.make("collection-path"), fail4388);
    return find_col_file(fail4388, collection4389, collection_path4390, false, false);
  };
  var collection_file_path = function(fail4391, check_compiled_p4392, file_name4393, collection4394, collection_path4395) {
    _check_relpath($rjs_core.Symbol.make("collection-file-path"), file_name4393);
    _check_collection($rjs_core.Symbol.make("collection-file-path"), collection4394, collection_path4395);
    _check_fail($rjs_core.Symbol.make("collection-file-path"), fail4391);
    return find_col_file(fail4391, collection4394, collection_path4395, file_name4393, check_compiled_p4392);
  };
  var get_config_table = function(d4396) {
    if (d4396 !== false) {
      var if_res2681 = M1.__rjs_quoted__.build_path(d4396, "config.rktd");
    } else {
      var if_res2681 = false;
    }
    var p4397 = if_res2681;
    if (p4397 !== false) {
      if (M1.__rjs_quoted__.file_exists_p(p4397) !== false) {
        var if_res2683 = M1.__rjs_quoted__.with_input_from_file(p4397, function() {
          var v4399 = M3.call_with_default_reading_parameterization(M1.__rjs_quoted__.read);
          if (M1.__rjs_quoted__.hash_p(v4399) !== false) {
            var if_res2682 = v4399;
          } else {
            var if_res2682 = false;
          }
          return if_res2682;
        });
      } else {
        var if_res2683 = false;
      }
      var if_res2684 = if_res2683;
    } else {
      var if_res2684 = false;
    }
    var or_part4398 = if_res2684;
    if (or_part4398 !== false) {
      var if_res2685 = or_part4398;
    } else {
      var if_res2685 = $rjs_core.Hash.makeEqual([], false);
    }
    return if_res2685;
  };
  var get_installation_name = function(config_table4400) {
    return M1.hash_ref(config_table4400, $rjs_core.Symbol.make("installation-name"), M1.__rjs_quoted__.version());
  };
  var coerce_to_path = function(p4401) {
    if (M1.string_p(p4401) !== false) {
      var if_res2688 = collects_relative_path__gt_complete_path(M1.__rjs_quoted__.string__gt_path(p4401));
    } else {
      if (M1.bytes_p(p4401) !== false) {
        var if_res2687 = collects_relative_path__gt_complete_path(M1.__rjs_quoted__.bytes__gt_path(p4401));
      } else {
        if (M1.__rjs_quoted__.path_p(p4401) !== false) {
          var if_res2686 = collects_relative_path__gt_complete_path(p4401);
        } else {
          var if_res2686 = p4401;
        }
        var if_res2687 = if_res2686;
      }
      var if_res2688 = if_res2687;
    }
    return if_res2688;
  };
  var collects_relative_path__gt_complete_path = function(p4402) {
    if (M1.__rjs_quoted__.complete_path_p(p4402) !== false) {
      var if_res2690 = p4402;
    } else {
      var or_part4403 = M5.find_main_collects();
      if (or_part4403 !== false) {
        var if_res2689 = or_part4403;
      } else {
        var if_res2689 = M1.__rjs_quoted__.current_directory();
      }
      var if_res2690 = M1.__rjs_quoted__.path__gt_complete_path(p4402, if_res2689);
    }
    return if_res2690;
  };
  var add_config_search = function(ht4404, key4405, orig_l4406) {
    var l4407 = M1.hash_ref(ht4404, key4405, false);
    if (l4407 !== false) {
      var loop4408 = function(l4409) {
        if (M1.null_p(l4409) !== false) {
          var if_res2692 = M1.rnull;
        } else {
          if (M1.not(M1.car(l4409)) !== false) {
            var if_res2691 = M1.append(orig_l4406, loop4408(M1.cdr(l4409)));
          } else {
            var if_res2691 = M1.cons(coerce_to_path(M1.car(l4409)), loop4408(M1.cdr(l4409)));
          }
          var if_res2692 = if_res2691;
        }
        return if_res2692;
      };
      var if_res2693 = loop4408(l4407);
    } else {
      var if_res2693 = orig_l4406;
    }
    return if_res2693;
  };
  var find_library_collection_links = function() {
    var ht4410 = get_config_table(M5.find_main_config());
    var or_part4412 = M1.hash_ref(ht4410, $rjs_core.Symbol.make("links-file"), false);
    if (or_part4412 !== false) {
      var if_res2695 = or_part4412;
    } else {
      var or_part4413 = M1.hash_ref(ht4410, $rjs_core.Symbol.make("share-dir"), false);
      if (or_part4413 !== false) {
        var if_res2694 = or_part4413;
      } else {
        var if_res2694 = M1.__rjs_quoted__.build_path($rjs_core.Symbol.make("up"), "share");
      }
      var if_res2695 = M1.__rjs_quoted__.build_path(if_res2694, "links.rktd");
    }
    var lf4411 = coerce_to_path(if_res2695);
    var temp2699 = M1.list(false);
    if (M1.__rjs_quoted__.use_user_specific_search_paths() !== false) {
      var if_res2697 = M1.__rjs_quoted__.use_collection_link_paths();
    } else {
      var if_res2697 = false;
    }
    if (if_res2697 !== false) {
      var if_res2698 = M1.list(M1.__rjs_quoted__.build_path(M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("addon-dir")), get_installation_name(ht4410), "links.rktd"));
    } else {
      var if_res2698 = M1.rnull;
    }
    if (M1.__rjs_quoted__.use_collection_link_paths() !== false) {
      var if_res2696 = add_config_search(ht4410, $rjs_core.Symbol.make("links-search-files"), M1.list(lf4411));
    } else {
      var if_res2696 = M1.rnull;
    }
    return M1.append(temp2699, if_res2698, if_res2696);
  };
  var links_cache = M1.make_weak_hash();
  var stamp_prompt_tag = M1.make_continuation_prompt_tag($rjs_core.Symbol.make("stamp"));
  var file__gt_stamp = function(path4414, old_stamp4415) {
    if (old_stamp4415 !== false) {
      if (M1.cdr(old_stamp4415) !== false) {
        var if_res2700 = M1.not(M1.__rjs_quoted__.sync_by_timeout(0, M1.cdr(old_stamp4415)));
      } else {
        var if_res2700 = false;
      }
      var if_res2701 = if_res2700;
    } else {
      var if_res2701 = false;
    }
    if (if_res2701 !== false) {
      var if_res2717 = old_stamp4415;
    } else {
      var if_res2717 = M1.call_with_continuation_prompt(function() {
        var __context2713 = $rjs_core.Marks.getFrames();
        var __context2714;
        try {
          __context2714 = $rjs_core.Marks.enterFrame();
          $rjs_core.Marks.setMark(M0.exception_handler_key, function(exn4416) {
            if (M1.__rjs_quoted__.exn_fail_filesystem_p(exn4416) !== false) {
              var if_res2702 = function() {
                return false;
              };
            } else {
              var if_res2702 = function() {
                return M1.raise(exn4416);
              };
            }
            return M1.abort_current_continuation(stamp_prompt_tag, if_res2702);
          });
          if (M1.vector_ref(M1.system_type($rjs_core.Symbol.make("fs-change")), 2) !== false) {
            var loop4418 = function(path4419) {
              var let_result2703 = M1.__rjs_quoted__.split_path(path4419);
              var base4420 = let_result2703.getAt(0);
              var name4421 = let_result2703.getAt(1);
              var dir_p4422 = let_result2703.getAt(2);
              if (M1.__rjs_quoted__.path_p(base4420) !== false) {
                if (M1.__rjs_quoted__.directory_exists_p(base4420) !== false) {
                  var if_res2704 = M1.__rjs_quoted__.filesystem_change_evt(base4420, function() {
                    return false;
                  });
                } else {
                  var if_res2704 = loop4418(base4420);
                }
                var if_res2705 = if_res2704;
              } else {
                var if_res2705 = false;
              }
              return if_res2705;
            };
            var if_res2706 = loop4418(path4414);
          } else {
            var if_res2706 = false;
          }
          var dir_evt4417 = if_res2706;
          if (M1.not(M1.__rjs_quoted__.file_exists_p(path4414)) !== false) {
            var if_res2712 = M1.cons(false, dir_evt4417);
          } else {
            if (M1.vector_ref(M1.system_type($rjs_core.Symbol.make("fs-change")), 2) !== false) {
              var if_res2707 = M1.__rjs_quoted__.filesystem_change_evt(path4414, function() {
                return false;
              });
            } else {
              var if_res2707 = false;
            }
            var evt4423 = if_res2707;
            if (dir_evt4417 !== false) {
              var if_res2708 = M1.__rjs_quoted__.filesystem_change_evt_cancel(dir_evt4417);
            } else {
              var if_res2708 = M1.rvoid();
            }
            if_res2708;
            var p4424 = M1.__rjs_quoted__.open_input_file(path4414);
            var if_res2712 = M1.cons(M1.__rjs_quoted__.dynamic_wind(M1.rvoid, function() {
              var bstr4425 = M1.__rjs_quoted__.read_bytes(8192, p4424);
              if (M1.bytes_p(bstr4425) !== false) {
                var if_res2709 = M1._gt__eq_(M1.__rjs_quoted__.bytes_length(bstr4425), 8192);
              } else {
                var if_res2709 = false;
              }
              if (if_res2709 !== false) {
                var loop4426 = function() {
                  var bstr4427 = M1.__rjs_quoted__.read_bytes(8192, p4424);
                  if (M1.__rjs_quoted__.eof_object_p(bstr4427) !== false) {
                    var if_res2710 = M1.rnull;
                  } else {
                    var if_res2710 = M1.cons(bstr4427, loop4426());
                  }
                  return if_res2710;
                };
                var if_res2711 = M1.apply(M1.__rjs_quoted__.bytes_append, M1.cons(bstr4425, loop4426()));
              } else {
                var if_res2711 = bstr4425;
              }
              return if_res2711;
            }, function() {
              return M1.__rjs_quoted__.close_input_port(p4424);
            }), evt4423);
          }
          var __wcm_result2715 = if_res2712;
        } finally {
          $rjs_core.Marks.updateFrame(__context2713, __context2714);
        }
        return __wcm_result2715;
      }, stamp_prompt_tag);
    }
    return if_res2717;
  };
  var no_file_stamp_p = function(a4428) {
    var or_part4429 = M1.not(a4428);
    if (or_part4429 !== false) {
      var if_res2718 = or_part4429;
    } else {
      var if_res2718 = M1.not(M1.car(a4428));
    }
    return if_res2718;
  };
  var get_linked_collections = function(links_path4430) {
    return M1.__rjs_quoted__.call_with_escape_continuation(function(esc4431) {
      var make_handler4432 = function(ts4433) {
        return function(exn4434) {
          if (M1.__rjs_quoted__.exn_fail_p(exn4434) !== false) {
            var l4435 = M1.__rjs_quoted__.current_logger();
            if (M1.__rjs_quoted__.log_level_p(l4435, $rjs_core.Symbol.make("error")) !== false) {
              var if_res2719 = M1.__rjs_quoted__.log_message(l4435, $rjs_core.Symbol.make("error"), M1.format("error reading collection links file ~s: ~a", links_path4430, M1.__rjs_quoted__.exn_message(exn4434)), M1.current_continuation_marks());
            } else {
              var if_res2719 = M1.rvoid();
            }
            var if_res2720 = if_res2719;
          } else {
            var if_res2720 = M1.rvoid();
          }
          if_res2720;
          if (ts4433 !== false) {
            var if_res2721 = M1.hash_set_bang_(links_cache, links_path4430, M1.cons(ts4433, $rjs_core.Hash.makeEq([], false)));
          } else {
            var if_res2721 = M1.rvoid();
          }
          if_res2721;
          if (M1.__rjs_quoted__.exn_fail_p(exn4434) !== false) {
            var if_res2722 = esc4431(M1.make_hasheq());
          } else {
            var if_res2722 = exn4434;
          }
          return if_res2722;
        };
      };
      var __context2748 = $rjs_core.Marks.getFrames();
      var __context2749;
      try {
        __context2749 = $rjs_core.Marks.enterFrame();
        $rjs_core.Marks.setMark(M0.exception_handler_key, make_handler4432(false));
        var links_stamp_plus_cache4436 = M1.hash_ref(links_cache, links_path4430, $rjs_core.Pair.make(false, $rjs_core.Hash.makeEq([], false)));
        var a_links_stamp4437 = M1.car(links_stamp_plus_cache4436);
        var ts4438 = file__gt_stamp(links_path4430, a_links_stamp4437);
        if (M1.not(M1.equal_p(ts4438, a_links_stamp4437)) !== false) {
          var __context2743 = $rjs_core.Marks.getFrames();
          var __context2744;
          try {
            __context2744 = __context2743;
            $rjs_core.Marks.setMark(M0.exception_handler_key, make_handler4432(ts4438));
            var __wcm_result2745 = M3.call_with_default_reading_parameterization(function() {
              if (no_file_stamp_p(ts4438) !== false) {
                var if_res2725 = M1.rnull;
              } else {
                var p4440 = M1.__rjs_quoted__.open_input_file(links_path4430, $rjs_core.Symbol.make("binary"));
                var if_res2725 = M1.__rjs_quoted__.dynamic_wind(M1.rvoid, function() {
                  var begin_res2723 = M1.__rjs_quoted__.read(p4440);
                  if (M1.__rjs_quoted__.eof_object_p(M1.__rjs_quoted__.read(p4440)) !== false) {
                    var if_res2724 = M1.rvoid();
                  } else {
                    var if_res2724 = M1.error("expected a single S-expression");
                  }
                  if_res2724;
                  return begin_res2723;
                }, function() {
                  return M1.__rjs_quoted__.close_input_port(p4440);
                });
              }
              var v4439 = if_res2725;
              if (M1.list_p(v4439) !== false) {
                var if_res2734 = M1.andmap(function(p4441) {
                  if (M1.list_p(p4441) !== false) {
                    var or_part4442 = M1._eq_(2, M1.length(p4441));
                    if (or_part4442 !== false) {
                      var if_res2726 = or_part4442;
                    } else {
                      var if_res2726 = M1._eq_(3, M1.length(p4441));
                    }
                    if (if_res2726 !== false) {
                      var or_part4443 = M1.string_p(M1.car(p4441));
                      if (or_part4443 !== false) {
                        var if_res2728 = or_part4443;
                      } else {
                        var or_part4444 = M1.eq_p($rjs_core.Symbol.make("root"), M1.car(p4441));
                        if (or_part4444 !== false) {
                          var if_res2727 = or_part4444;
                        } else {
                          var if_res2727 = M1.eq_p($rjs_core.Symbol.make("static-root"), M1.car(p4441));
                        }
                        var if_res2728 = if_res2727;
                      }
                      if (if_res2728 !== false) {
                        if (M4.path_string_p(M1.cadr(p4441)) !== false) {
                          var or_part4445 = M1.null_p(M1.cddr(p4441));
                          if (or_part4445 !== false) {
                            var if_res2729 = or_part4445;
                          } else {
                            var if_res2729 = M1.regexp_p(M1.caddr(p4441));
                          }
                          var if_res2730 = if_res2729;
                        } else {
                          var if_res2730 = false;
                        }
                        var if_res2731 = if_res2730;
                      } else {
                        var if_res2731 = false;
                      }
                      var if_res2732 = if_res2731;
                    } else {
                      var if_res2732 = false;
                    }
                    var if_res2733 = if_res2732;
                  } else {
                    var if_res2733 = false;
                  }
                  return if_res2733;
                }, v4439);
              } else {
                var if_res2734 = false;
              }
              if (if_res2734 !== false) {
                var if_res2735 = M1.rvoid();
              } else {
                var if_res2735 = M1.error("ill-formed content");
              }
              if_res2735;
              var ht4446 = M1.make_hasheq();
              var let_result2736 = M1.__rjs_quoted__.split_path(links_path4430);
              var base4448 = let_result2736.getAt(0);
              var name4449 = let_result2736.getAt(1);
              var dir_p4450 = let_result2736.getAt(2);
              var dir4447 = base4448;
              M1.for_each(function(p4451) {
                var or_part4452 = M1.null_p(M1.cddr(p4451));
                if (or_part4452 !== false) {
                  var if_res2737 = or_part4452;
                } else {
                  var if_res2737 = M1.__rjs_quoted__.regexp_match_p(M1.caddr(p4451), M1.__rjs_quoted__.version());
                }
                if (if_res2737 !== false) {
                  var dir4453 = M1.__rjs_quoted__.simplify_path(M1.__rjs_quoted__.path__gt_complete_path(M1.cadr(p4451), dir4447));
                  if (M1.eq_p(M1.car(p4451), $rjs_core.Symbol.make("static-root")) !== false) {
                    var if_res2741 = M1.for_each(function(sub4454) {
                      if (M1.__rjs_quoted__.directory_exists_p(M1.__rjs_quoted__.build_path(dir4453, sub4454)) !== false) {
                        var k4455 = M1.string__gt_symbol(M1.__rjs_quoted__.path__gt_string(sub4454));
                        var if_res2738 = M1.hash_set_bang_(ht4446, k4455, M1.cons(dir4453, M1.hash_ref(ht4446, k4455, M1.rnull)));
                      } else {
                        var if_res2738 = M1.rvoid();
                      }
                      return if_res2738;
                    }, M1.__rjs_quoted__.directory_list(dir4453));
                  } else {
                    if (M1.eq_p(M1.car(p4451), $rjs_core.Symbol.make("root")) !== false) {
                      if (M1.hash_ref(ht4446, false, false) !== false) {
                        var if_res2739 = M1.rvoid();
                      } else {
                        var if_res2739 = M1.hash_set_bang_(ht4446, false, M1.rnull);
                      }
                      if_res2739;
                      var if_res2740 = M1.__rjs_quoted__.hash_for_each(ht4446, function(k4456, v4457) {
                        return M1.hash_set_bang_(ht4446, k4456, M1.cons(dir4453, v4457));
                      });
                    } else {
                      var s4458 = M1.string__gt_symbol(M1.car(p4451));
                      var if_res2740 = M1.hash_set_bang_(ht4446, s4458, M1.cons(M1.box(dir4453), M1.hash_ref(ht4446, s4458, M1.rnull)));
                    }
                    var if_res2741 = if_res2740;
                  }
                  var if_res2742 = if_res2741;
                } else {
                  var if_res2742 = M1.rvoid();
                }
                return if_res2742;
              }, v4439);
              M1.__rjs_quoted__.hash_for_each(ht4446, function(k4459, v4460) {
                return M1.hash_set_bang_(ht4446, k4459, M1.reverse(v4460));
              });
              M1.hash_set_bang_(links_cache, links_path4430, M1.cons(ts4438, ht4446));
              return ht4446;
            });
          } finally {
            $rjs_core.Marks.updateFrame(__context2743, __context2744);
          }
          var if_res2747 = __wcm_result2745;
        } else {
          var if_res2747 = M1.cdr(links_stamp_plus_cache4436);
        }
        var __wcm_result2750 = if_res2747;
      } finally {
        $rjs_core.Marks.updateFrame(__context2748, __context2749);
      }
      return __wcm_result2750;
    });
  };
  var normalize_collection_reference = function(collection4461, collection_path4462) {
    if (M1.string_p(collection4461) !== false) {
      var m4463 = M1.__rjs_quoted__.regexp_match_positions("/\\/+/", collection4461);
      if (m4463 !== false) {
        if (M1._eq_(M1.caar(m4463), M1.sub1(M1.string_length(collection4461))) !== false) {
          var if_res2752 = M1.values(M1.substring(collection4461, 0, M1.caar(m4463)), collection_path4462);
        } else {
          var if_res2752 = M1.values(M1.substring(collection4461, 0, M1.caar(m4463)), M1.cons(M1.substring(collection4461, M1.cdar(m4463)), collection_path4462));
        }
        var if_res2753 = if_res2752;
      } else {
        var if_res2753 = M1.values(collection4461, collection_path4462);
      }
      var if_res2756 = if_res2753;
    } else {
      var let_result2754 = M1.__rjs_quoted__.split_path(collection4461);
      var base4464 = let_result2754.getAt(0);
      var name4465 = let_result2754.getAt(1);
      var dir_p4466 = let_result2754.getAt(2);
      if (M1.eq_p(base4464, $rjs_core.Symbol.make("relative")) !== false) {
        var if_res2755 = M1.values(name4465, collection_path4462);
      } else {
        var if_res2755 = normalize_collection_reference(base4464, M1.cons(name4465, collection_path4462));
      }
      var if_res2756 = if_res2755;
    }
    return if_res2756;
  };
  var find_col_file = function(fail4467, collection4468, collection_path4469, file_name4470, check_compiled_p4471) {
    var let_result2757 = normalize_collection_reference(collection4468, collection_path4469);
    var collection4472 = let_result2757.getAt(0);
    var collection_path4473 = let_result2757.getAt(1);
    if (M1.__rjs_quoted__.path_p(collection4472) !== false) {
      var if_res2758 = M1.__rjs_quoted__.path__gt_string(collection4472);
    } else {
      var if_res2758 = collection4472;
    }
    var sym4475 = M1.string__gt_symbol(if_res2758);
    var loop4476 = function(l4477) {
      if (M1.null_p(l4477) !== false) {
        var if_res2761 = M1.rnull;
      } else {
        if (M1.not(M1.car(l4477)) !== false) {
          var if_res2760 = M1.append(M1.__rjs_quoted__.current_library_collection_paths(), loop4476(M1.cdr(l4477)));
        } else {
          if (M1.__rjs_quoted__.hash_p(M1.car(l4477)) !== false) {
            var if_res2759 = M1.append(M1.map(M1.box, M1.hash_ref(M1.car(l4477), sym4475, M1.rnull)), M1.hash_ref(M1.car(l4477), false, M1.rnull), loop4476(M1.cdr(l4477)));
          } else {
            var ht4478 = get_linked_collections(M1.car(l4477));
            var if_res2759 = M1.append(M1.hash_ref(ht4478, sym4475, M1.rnull), M1.hash_ref(ht4478, false, M1.rnull), loop4476(M1.cdr(l4477)));
          }
          var if_res2760 = if_res2759;
        }
        var if_res2761 = if_res2760;
      }
      return if_res2761;
    };
    var all_paths4474 = loop4476(M1.__rjs_quoted__.current_library_collection_links());
    var done4479 = function(p4480) {
      if (file_name4470 !== false) {
        var if_res2762 = M1.__rjs_quoted__.build_path(p4480, file_name4470);
      } else {
        var if_res2762 = p4480;
      }
      return if_res2762;
    };
    var _times_build_path_rep4481 = function(p4482, c4483) {
      if (M1.__rjs_quoted__.path_p(p4482) !== false) {
        var if_res2763 = M1.__rjs_quoted__.build_path(p4482, c4483);
      } else {
        var if_res2763 = M1.unbox(p4482);
      }
      return if_res2763;
    };
    var _times_directory_exists_p4484 = function(orig4485, p4486) {
      if (M1.__rjs_quoted__.path_p(orig4485) !== false) {
        var if_res2764 = M1.__rjs_quoted__.directory_exists_p(p4486);
      } else {
        var if_res2764 = true;
      }
      return if_res2764;
    };
    var to_string4487 = function(p4488) {
      if (M1.__rjs_quoted__.path_p(p4488) !== false) {
        var if_res2765 = M1.__rjs_quoted__.path__gt_string(p4488);
      } else {
        var if_res2765 = p4488;
      }
      return if_res2765;
    };
    var cloop4489 = function(paths4490, found_col4491) {
      if (M1.null_p(paths4490) !== false) {
        if (found_col4491 !== false) {
          var if_res2774 = done4479(found_col4491);
        } else {
          if (M1.null_p(collection_path4473) !== false) {
            var if_res2767 = "";
          } else {
            var loop4493 = function(cp4494) {
              if (M1.null_p(M1.cdr(cp4494)) !== false) {
                var if_res2766 = M1.list(to_string4487(M1.car(cp4494)));
              } else {
                var if_res2766 = M1.list_times_(to_string4487(M1.car(cp4494)), "/", loop4493(M1.cdr(cp4494)));
              }
              return if_res2766;
            };
            var if_res2767 = M1.apply(M1.string_append, loop4493(collection_path4473));
          }
          var rest_coll4492 = if_res2767;
          var filter4495 = function(f4496, l4497) {
            if (M1.null_p(l4497) !== false) {
              var if_res2769 = M1.rnull;
            } else {
              if (f4496(M1.car(l4497)) !== false) {
                var if_res2768 = M1.cons(M1.car(l4497), filter4495(f4496, M1.cdr(l4497)));
              } else {
                var if_res2768 = filter4495(f4496, M1.cdr(l4497));
              }
              var if_res2769 = if_res2768;
            }
            return if_res2769;
          };
          if (M1.null_p(collection_path4473) !== false) {
            var if_res2773 = to_string4487(collection4472);
          } else {
            var if_res2773 = M1.string_append(to_string4487(collection4472), "/", rest_coll4492);
          }
          var len4499 = M1.length(all_paths4474);
          var clen4500 = M1.length(M1.__rjs_quoted__.current_library_collection_paths());
          if (M1._lt_(len4499 - clen4500, 5) !== false) {
            var if_res2771 = all_paths4474;
          } else {
            var if_res2771 = M1.append(M1.__rjs_quoted__.current_library_collection_paths(), M1.list(M1.format("... [~a additional linked and package directories]", len4499 - clen4500)));
          }
          var temp2772 = M1.apply(M1.string_append, M1.map(function(p4498) {
            return M1.format("\n ~a ~a", " ", p4498);
          }, if_res2771));
          if (M1.ormap(M1.__rjs_quoted__.box_p, all_paths4474) !== false) {
            var if_res2770 = M1.format("\n   sub-collection: ~s\n  in parent directories:~a", rest_coll4492, M1.apply(M1.string_append, M1.map(function(p4501) {
              return M1.format("\n   ~a", M1.unbox(p4501));
            }, filter4495(M1.__rjs_quoted__.box_p, all_paths4474))));
          } else {
            var if_res2770 = "";
          }
          var if_res2774 = fail4467(M1.format("collection not found\n  collection: ~s\n  in collection directories:~a~a", if_res2773, temp2772, if_res2770));
        }
        var if_res2787 = if_res2774;
      } else {
        var dir4502 = _times_build_path_rep4481(M1.car(paths4490), collection4472);
        if (_times_directory_exists_p4484(M1.car(paths4490), dir4502) !== false) {
          var cpath4503 = M1.apply(M1.__rjs_quoted__.build_path, dir4502, collection_path4473);
          if (M1.null_p(collection_path4473) !== false) {
            var if_res2775 = true;
          } else {
            var if_res2775 = M1.__rjs_quoted__.directory_exists_p(cpath4503);
          }
          if (if_res2775 !== false) {
            if (file_name4470 !== false) {
              var or_part4504 = file_exists_p_by_maybe_compiled(cpath4503, file_name4470, check_compiled_p4471);
              if (or_part4504 !== false) {
                var if_res2780 = or_part4504;
              } else {
                if (M1.__rjs_quoted__.path_p(file_name4470) !== false) {
                  var if_res2776 = M1.__rjs_quoted__.path__gt_string(file_name4470);
                } else {
                  var if_res2776 = file_name4470;
                }
                var file_name4506 = if_res2776;
                var len4507 = M1.string_length(file_name4506);
                if (M1._gt__eq_(len4507, 4) !== false) {
                  if (M1.string_eq__p(".rkt", M1.substring(file_name4506, len4507 - 4)) !== false) {
                    var if_res2777 = M1.string_append(M1.substring(file_name4506, 0, len4507 - 4), ".ss");
                  } else {
                    var if_res2777 = false;
                  }
                  var if_res2778 = if_res2777;
                } else {
                  var if_res2778 = false;
                }
                var alt_file_name4505 = if_res2778;
                if (alt_file_name4505 !== false) {
                  var if_res2779 = file_exists_p_by_maybe_compiled(cpath4503, alt_file_name4505, check_compiled_p4471);
                } else {
                  var if_res2779 = false;
                }
                var if_res2780 = if_res2779;
              }
              if (if_res2780 !== false) {
                var if_res2783 = done4479(cpath4503);
              } else {
                var temp2782 = M1.cdr(paths4490);
                var or_part4508 = found_col4491;
                if (or_part4508 !== false) {
                  var if_res2781 = or_part4508;
                } else {
                  var if_res2781 = cpath4503;
                }
                var if_res2783 = cloop4489(temp2782, if_res2781);
              }
              var if_res2784 = if_res2783;
            } else {
              var if_res2784 = done4479(cpath4503);
            }
            var if_res2785 = if_res2784;
          } else {
            var if_res2785 = cloop4489(M1.cdr(paths4490), found_col4491);
          }
          var if_res2786 = if_res2785;
        } else {
          var if_res2786 = cloop4489(M1.cdr(paths4490), found_col4491);
        }
        var if_res2787 = if_res2786;
      }
      return if_res2787;
    };
    return cloop4489(all_paths4474, false);
  };
  var file_exists_p_by_maybe_compiled = function(dir4509, path4510, check_compiled_p4511) {
    var or_part4512 = M1.__rjs_quoted__.file_exists_p(M1.__rjs_quoted__.build_path(dir4509, path4510));
    if (or_part4512 !== false) {
      var if_res2791 = or_part4512;
    } else {
      if (check_compiled_p4511 !== false) {
        var try_path4513 = M4.path_add_extension(path4510, new Uint8Array([46, 122, 111]));
        var modes4514 = M1.__rjs_quoted__.use_compiled_file_paths();
        var roots4515 = M1.__rjs_quoted__.current_compiled_file_roots();
        var if_res2790 = M1.ormap(function(d4516) {
          return M1.ormap(function(mode4517) {
            var p4518 = M1.__rjs_quoted__.build_path(dir4509, mode4517, try_path4513);
            if (M1.eq_p(d4516, $rjs_core.Symbol.make("same")) !== false) {
              var if_res2789 = p4518;
            } else {
              if (M1.__rjs_quoted__.relative_path_p(d4516) !== false) {
                var if_res2788 = M1.__rjs_quoted__.build_path(p4518, d4516);
              } else {
                var if_res2788 = M4.reroot_path(p4518, d4516);
              }
              var if_res2789 = if_res2788;
            }
            return M1.__rjs_quoted__.file_exists_p(if_res2789);
          }, modes4514);
        }, roots4515);
      } else {
        var if_res2790 = false;
      }
      var if_res2791 = if_res2790;
    }
    return if_res2791;
  };
  var cl2792 = function() {
    return find_library_collection_paths(M1.rnull, M1.rnull);
  };
  var cl2793 = function(extra_collects_dirs4519) {
    return find_library_collection_paths(extra_collects_dirs4519, M1.rnull);
  };
  var cl2794 = function(extra_collects_dirs4520, post_collects_dirs4521) {
    var user_too_p4522 = M1.__rjs_quoted__.use_user_specific_search_paths();
    var cons_if4523 = function(f4525, r4526) {
      if (f4525 !== false) {
        var if_res2796 = M1.cons(f4525, r4526);
      } else {
        var if_res2796 = r4526;
      }
      return if_res2796;
    };
    var config_table4524 = get_config_table(M5.find_main_config());
    if (user_too_p4522 !== false) {
      var c4527 = M1.__rjs_quoted__.environment_variables_ref(M1.__rjs_quoted__.current_environment_variables(), new Uint8Array([80, 76, 84, 67, 79, 76, 76, 69, 67, 84, 83]));
      if (c4527 !== false) {
        var if_res2800 = M1.__rjs_quoted__.bytes__gt_string_by_locale(c4527, "?");
      } else {
        var if_res2800 = "";
      }
      var if_res2801 = if_res2800;
    } else {
      var if_res2801 = "";
    }
    if (user_too_p4522 !== false) {
      var if_res2799 = M1.__rjs_quoted__.build_path(M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("addon-dir")), get_installation_name(config_table4524), "collects");
    } else {
      var if_res2799 = false;
    }
    var loop4528 = function(l4529) {
      if (M1.null_p(l4529) !== false) {
        var if_res2798 = M1.rnull;
      } else {
        var collects_path4530 = M1.car(l4529);
        var v4531 = M5.exe_relative_path__gt_complete_path(collects_path4530);
        if (v4531 !== false) {
          var if_res2797 = M1.cons(M1.__rjs_quoted__.simplify_path(M1.__rjs_quoted__.path__gt_complete_path(v4531, M1.__rjs_quoted__.current_directory())), loop4528(M1.cdr(l4529)));
        } else {
          var if_res2797 = loop4528(M1.cdr(l4529));
        }
        var if_res2798 = if_res2797;
      }
      return if_res2798;
    };
    return M2.path_list_string__gt_path_list(if_res2801, add_config_search(config_table4524, $rjs_core.Symbol.make("collects-search-dirs"), cons_if4523(if_res2799, loop4528(M1.append(extra_collects_dirs4520, M1.list(M1.__rjs_quoted__.find_system_path($rjs_core.Symbol.make("collects-dir"))), post_collects_dirs4521)))));
  };
  var find_library_collection_paths = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2795 = {
      '0': cl2792,
      '1': cl2793,
      '2': cl2794
    }[arguments.length];
    if (fixed_lam2795 !== undefined !== false) {
      return fixed_lam2795.apply(null, arguments);
    } else {
      return M1.error("case-lambda: invalid case");
    }
  }, [0, 1, 2]);
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get find_library_collection_links() {
      return find_library_collection_links;
    },
    get find_library_collection_paths() {
      return find_library_collection_paths;
    },
    get collection_file_path() {
      return collection_file_path;
    },
    get collection_path() {
      return collection_path;
    },
    get find_col_file() {
      return find_col_file;
    }
  };
})();
var $__runtime_47_unsafe_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/unsafe.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var Core = $__runtime_47_core_46_js__;
  var unsafe_fx_plus_ = function(a17, b18) {
    return (a17 + b18) | 0;
  };
  var unsafe_fx_ = function(a19, b20) {
    return (a19 - b20) | 0;
  };
  var unsafe_fx_times_ = function(a21, b22) {
    return (a21 * b22) | 0;
  };
  var unsafe_fxquotient = function(a23, b24) {
    return (a23 / b24) | 0;
  };
  var unsafe_fxremainder = function(a25, b26) {
    return (a25 % b26) | 0;
  };
  var unsafe_fxmodulo = function(a27, b28) {
    var remainder29 = a27 % b28;
    if (remainder29 >= 0 !== false) {
      var if_res7 = remainder29;
    } else {
      var if_res7 = remainder29 + b28;
    }
    return Math.floor(if_res7);
  };
  var unsafe_fxabs = function(a30) {
    return Math.abs(a30);
  };
  var unsafe_fx_eq_ = function(a31, b32) {
    return a31 === b32;
  };
  var unsafe_fx_lt_ = function(a33, b34) {
    return a33 < b34;
  };
  var unsafe_fx_lt__eq_ = function(a35, b36) {
    return a35 <= b36;
  };
  var unsafe_fx_gt_ = function(a37, b38) {
    return a37 > b38;
  };
  var unsafe_fx_gt__eq_ = function(a39, b40) {
    return a39 >= b40;
  };
  var unsafe_fxmin = function(a41, b42) {
    if (a41 < b42 !== false) {
      var if_res8 = a41;
    } else {
      var if_res8 = b42;
    }
    return if_res8;
  };
  var unsafe_fxmax = function(a43, b44) {
    if (a43 > b44 !== false) {
      var if_res9 = b44;
    } else {
      var if_res9 = a43;
    }
    return if_res9;
  };
  var unsafe_fxrshift = function(a45, b46) {
    return (a45 >> b46) | 0;
  };
  var unsafe_fxlshift = function(a47, b48) {
    return (a47 << b48) | 0;
  };
  var unsafe_fxand = function(a49, b50) {
    return (a49 && b50) | 0;
  };
  var unsafe_fxior = function(a51, b52) {
    return (a51 || b52) | 0;
  };
  var unsafe_fxxor = function(a53, b54) {
    return (a53 ^ b54) | 0;
  };
  var unsafe_fxnot = Core.bitwiseNot;
  var unsafe_car = function(v55) {
    return v55.hd;
  };
  var unsafe_cdr = function(v56) {
    return v56.tl;
  };
  var unsafe_mcar = function(v57) {
    return v57.hd;
  };
  var unsafe_mcdr = function(v58) {
    return v58.tl;
  };
  var unsafe_set_mcar_bang_ = function(p59, v60) {
    return p59.setCar(v60);
  };
  var unsafe_set_mcdr_bang_ = function(p61, v62) {
    return p61.setCdr(v62);
  };
  var unsafe_cons_list = function(v63, rest64) {
    return Core.Pair.make(v63, rest64);
  };
  var unsafe_struct_ref = function(v65, k66) {
    return v65._fields[k66];
  };
  var unsafe_vector_ref = function(v67, k68) {
    return v67.ref(k68);
  };
  var unsafe_vector_set_bang_ = function(v69, k70, val71) {
    return v69.set(k70, val71);
  };
  var unsafe_vector_length = function(v72) {
    return v72.length();
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get unsafe_fx_plus_() {
      return unsafe_fx_plus_;
    },
    get unsafe_fx_() {
      return unsafe_fx_;
    },
    get unsafe_fx_times_() {
      return unsafe_fx_times_;
    },
    get unsafe_fxquotient() {
      return unsafe_fxquotient;
    },
    get unsafe_fxremainder() {
      return unsafe_fxremainder;
    },
    get unsafe_fxmodulo() {
      return unsafe_fxmodulo;
    },
    get unsafe_fxabs() {
      return unsafe_fxabs;
    },
    get unsafe_fx_eq_() {
      return unsafe_fx_eq_;
    },
    get unsafe_fx_lt_() {
      return unsafe_fx_lt_;
    },
    get unsafe_fx_lt__eq_() {
      return unsafe_fx_lt__eq_;
    },
    get unsafe_fx_gt_() {
      return unsafe_fx_gt_;
    },
    get unsafe_fx_gt__eq_() {
      return unsafe_fx_gt__eq_;
    },
    get unsafe_fxmin() {
      return unsafe_fxmin;
    },
    get unsafe_fxmax() {
      return unsafe_fxmax;
    },
    get unsafe_fxrshift() {
      return unsafe_fxrshift;
    },
    get unsafe_fxlshift() {
      return unsafe_fxlshift;
    },
    get unsafe_fxand() {
      return unsafe_fxand;
    },
    get unsafe_fxior() {
      return unsafe_fxior;
    },
    get unsafe_fxxor() {
      return unsafe_fxxor;
    },
    get unsafe_fxnot() {
      return unsafe_fxnot;
    },
    get unsafe_car() {
      return unsafe_car;
    },
    get unsafe_cdr() {
      return unsafe_cdr;
    },
    get unsafe_mcar() {
      return unsafe_mcar;
    },
    get unsafe_mcdr() {
      return unsafe_mcdr;
    },
    get unsafe_set_mcar_bang_() {
      return unsafe_set_mcar_bang_;
    },
    get unsafe_set_mcdr_bang_() {
      return unsafe_set_mcdr_bang_;
    },
    get unsafe_cons_list() {
      return unsafe_cons_list;
    },
    get unsafe_struct_ref() {
      return unsafe_struct_ref;
    },
    get unsafe_vector_ref() {
      return unsafe_vector_ref;
    },
    get unsafe_vector_set_bang_() {
      return unsafe_vector_set_bang_;
    },
    get unsafe_vector_length() {
      return unsafe_vector_length;
    }
  };
})();
var $__collects_47_racket_47_private_47_kw_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/kw.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var M1 = $__runtime_47_unsafe_46_rkt_46_js__;
  var let_result1285 = M0.make_struct_type_property($rjs_core.Symbol.make("keyword-impersonator"));
  var prop_keyword_impersonator = let_result1285.getAt(0);
  var keyword_impersonator_p = let_result1285.getAt(1);
  var keyword_impersonator_ref = let_result1285.getAt(2);
  var keyword_procedure_impersonator_of = function(v2200) {
    if (keyword_impersonator_p(v2200) !== false) {
      var if_res1286 = keyword_impersonator_ref(v2200)(v2200);
    } else {
      var if_res1286 = false;
    }
    return if_res1286;
  };
  var let_result1287 = M0.make_struct_type($rjs_core.Symbol.make("keyword-procedure"), false, 4, 0, false, M0.list(M0.cons(M0.prop_checked_procedure, true), M0.cons(M0.prop_impersonator_of, keyword_procedure_impersonator_of)), M0.current_inspector(), false, $rjs_core.Pair.makeList(0, 1, 2, 3));
  var struct_keyword_procedure = let_result1287.getAt(0);
  var mk_kw_proc = let_result1287.getAt(1);
  var keyword_procedure_p = let_result1287.getAt(2);
  var keyword_procedure_ref = let_result1287.getAt(3);
  var keyword_procedure_set_bang_ = let_result1287.getAt(4);
  var keyword_procedure_checker = M0.make_struct_field_accessor(keyword_procedure_ref, 0);
  var keyword_procedure_proc = M0.make_struct_field_accessor(keyword_procedure_ref, 1);
  var keyword_procedure_required = M0.make_struct_field_accessor(keyword_procedure_ref, 2);
  var keyword_procedure_allowed = M0.make_struct_field_accessor(keyword_procedure_ref, 3);
  var let_result1288 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_procedure, 0, 0, false, M0.list(M0.cons(M0.prop_method_arity_error, true)));
  var struct_keyword_method = let_result1288.getAt(0);
  var make_km = let_result1288.getAt(1);
  var keyword_method_p = let_result1288.getAt(2);
  var km_ref = let_result1288.getAt(3);
  var km_set_bang_ = let_result1288.getAt(4);
  var generate_arity_string = function(proc2201) {
    var let_result1289 = procedure_keywords(proc2201);
    var req2202 = let_result1289.getAt(0);
    var allowed2203 = let_result1289.getAt(1);
    var a2204 = M0.procedure_arity(proc2201);
    var keywords_desc2205 = function(opt2207, req2208) {
      if (M0.null_p(M0.cdr(req2208)) !== false) {
        var if_res1294 = M0.format("an ~aargument", opt2207);
      } else {
        var if_res1294 = M0.format("~aarguments", opt2207);
      }
      if (M0.null_p(M0.cdr(req2208)) !== false) {
        var if_res1293 = "";
      } else {
        var if_res1293 = "s";
      }
      var tmp2209 = M0.length(req2208);
      if (M0.equal_p(tmp2209, 1) !== false) {
        var if_res1292 = M0.format(" ~a", M0.car(req2208));
      } else {
        if (M0.equal_p(tmp2209, 2) !== false) {
          var if_res1291 = M0.format(" ~a and ~a", M0.car(req2208), M0.cadr(req2208));
        } else {
          var loop2210 = function(req2211) {
            if (M0.null_p(M0.cdr(req2211)) !== false) {
              var if_res1290 = M0.format(" and ~a", M0.car(req2211));
            } else {
              var if_res1290 = M0.format(" ~a,~a", M0.car(req2211), loop2210(M0.cdr(req2211)));
            }
            return if_res1290;
          };
          var if_res1291 = loop2210(req2208);
        }
        var if_res1292 = if_res1291;
      }
      return M0.format("~a with keyword~a~a", if_res1294, if_res1293, if_res1292);
    };
    var method_adjust2206 = function(a2212) {
      var or_part2213 = okm_p(proc2201);
      if (or_part2213 !== false) {
        var if_res1295 = or_part2213;
      } else {
        var if_res1295 = keyword_method_p(proc2201);
      }
      if (if_res1295 !== false) {
        if (M0.zero_p(a2212) !== false) {
          var if_res1296 = 0;
        } else {
          var if_res1296 = M0.sub1(a2212);
        }
        var if_res1297 = if_res1296;
      } else {
        var if_res1297 = a2212;
      }
      return if_res1297;
    };
    if (M0.number_p(a2204) !== false) {
      var a2214 = method_adjust2206(a2204);
      var if_res1304 = M0.format("~a", a2214);
    } else {
      if (M0.arity_at_least_p(a2204) !== false) {
        var a2215 = method_adjust2206(M0.arity_at_least_value(a2204));
        var if_res1303 = M0.format("at least ~a", a2215);
      } else {
        var if_res1303 = "a different number";
      }
      var if_res1304 = if_res1303;
    }
    if (M0.null_p(req2202) !== false) {
      var if_res1302 = "";
    } else {
      var if_res1302 = M0.format(" plus ~a", keywords_desc2205("", req2202));
    }
    if (allowed2203 !== false) {
      var loop2217 = function(req2218, allowed2219) {
        if (M0.null_p(req2218) !== false) {
          var if_res1299 = allowed2219;
        } else {
          if (M0.eq_p(M0.car(req2218), M0.car(allowed2219)) !== false) {
            var if_res1298 = loop2217(M0.cdr(req2218), M0.cdr(allowed2219));
          } else {
            var if_res1298 = M0.cons(M0.car(allowed2219), loop2217(req2218, M0.cdr(allowed2219)));
          }
          var if_res1299 = if_res1298;
        }
        return if_res1299;
      };
      var others2216 = loop2217(req2202, allowed2203);
      if (M0.null_p(others2216) !== false) {
        var if_res1300 = "";
      } else {
        var if_res1300 = M0.format(" plus ~a", keywords_desc2205("optional ", others2216));
      }
      var if_res1301 = if_res1300;
    } else {
      var if_res1301 = " plus arbitrary keyword arguments";
    }
    return M0.string_append(if_res1304, if_res1302, if_res1301);
  };
  var let_result1305 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_procedure, 1, 0, false, M0.list(M0.cons(M0.prop_arity_string, generate_arity_string)), M0.current_inspector(), 0);
  var struct_okp = let_result1305.getAt(0);
  var make_optional_keyword_procedure = let_result1305.getAt(1);
  var okp_p = let_result1305.getAt(2);
  var okp_ref = let_result1305.getAt(3);
  var okp_set_bang_ = let_result1305.getAt(4);
  var let_result1306 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_okp, 0, 0, false, M0.list(M0.cons(M0.prop_method_arity_error, true)));
  var struct_okm = let_result1306.getAt(0);
  var make_optional_keyword_method = let_result1306.getAt(1);
  var okm_p = let_result1306.getAt(2);
  var okm_ref = let_result1306.getAt(3);
  var okm_set_bang_ = let_result1306.getAt(4);
  var let_result1307 = M0.make_struct_type_property($rjs_core.Symbol.make("named-keyword-procedure"));
  var prop_named_keyword_procedure = let_result1307.getAt(0);
  var named_keyword_procedure_p = let_result1307.getAt(1);
  var keyword_procedure_name_plus_fail = let_result1307.getAt(2);
  var let_result1309 = M0.make_struct_type_property($rjs_core.Symbol.make("procedure"), function(v2220, info_l2221) {
    if (M0.exact_integer_p(v2220) !== false) {
      var if_res1308 = M0.make_struct_field_accessor(M0.list_ref(info_l2221, 3), v2220);
    } else {
      var if_res1308 = false;
    }
    return if_res1308;
  });
  var prop_procedure_accessor = let_result1309.getAt(0);
  var procedure_accessor_p = let_result1309.getAt(1);
  var procedure_accessor_ref = let_result1309.getAt(2);
  var let_result1310 = M0.make_struct_type_property($rjs_core.Symbol.make("procedure"), false, M0.list(M0.cons(M0.prop_procedure, M0.values), M0.cons(prop_procedure_accessor, M0.values)));
  var new_prop_procedure = let_result1310.getAt(0);
  var new_procedure_p = let_result1310.getAt(1);
  var new_procedure_ref = let_result1310.getAt(2);
  var let_result1311 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_procedure, 1, 0, false, M0.list(M0.cons(prop_keyword_impersonator, function(v2222) {
    return kpp_ref(v2222, 0);
  })));
  var struct_keyword_procedure_impersonator = let_result1311.getAt(0);
  var make_kpp = let_result1311.getAt(1);
  var keyword_procedure_impersonator_p = let_result1311.getAt(2);
  var kpp_ref = let_result1311.getAt(3);
  var kpp_set_bang_ = let_result1311.getAt(4);
  var let_result1312 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_method, 1, 0, false, M0.list(M0.cons(prop_keyword_impersonator, function(v2223) {
    return kmp_ref(v2223, 0);
  })));
  var struct_keyword_method_impersonator = let_result1312.getAt(0);
  var make_kmp = let_result1312.getAt(1);
  var keyword_method_impersonator_p = let_result1312.getAt(2);
  var kmp_ref = let_result1312.getAt(3);
  var kmp_set_bang_ = let_result1312.getAt(4);
  var let_result1313 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_okp, 1, 0, false, M0.list(M0.cons(prop_keyword_impersonator, function(v2224) {
    return okpp_ref(v2224, 0);
  })));
  var struct_okpp = let_result1313.getAt(0);
  var make_optional_keyword_procedure_impersonator = let_result1313.getAt(1);
  var okpp_p = let_result1313.getAt(2);
  var okpp_ref = let_result1313.getAt(3);
  var okpp_set_bang_ = let_result1313.getAt(4);
  var let_result1314 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_okp, 1, 0, false, M0.list(M0.cons(prop_keyword_impersonator, function(v2225) {
    return okmp_ref(v2225, 0);
  })));
  var struct_okmp = let_result1314.getAt(0);
  var make_optional_keyword_method_impersonator = let_result1314.getAt(1);
  var okmp_p = let_result1314.getAt(2);
  var okmp_ref = let_result1314.getAt(3);
  var okmp_set_bang_ = let_result1314.getAt(4);
  var let_result1315 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_procedure, 0, 0, false, M0.list(M0.cons(M0.prop_arity_string, generate_arity_string), M0.cons(M0.prop_incomplete_arity, true)));
  var struct_keyword_procedure_by_arity_error = let_result1315.getAt(0);
  var make_kp_by_ae = let_result1315.getAt(1);
  var kp_by_ae_p = let_result1315.getAt(2);
  var kp_by_ae_ref = let_result1315.getAt(3);
  var kp_by_ae_set_bang_ = let_result1315.getAt(4);
  var let_result1316 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_method, 0, 0, false, M0.list(M0.cons(M0.prop_arity_string, generate_arity_string), M0.cons(M0.prop_incomplete_arity, true)));
  var struct_keyword_method_by_arity_error = let_result1316.getAt(0);
  var make_km_by_ae = let_result1316.getAt(1);
  var km_by_ae_p = let_result1316.getAt(2);
  var km_by_ae_ref = let_result1316.getAt(3);
  var km_by_ae_set_bang_ = let_result1316.getAt(4);
  var let_result1317 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_procedure_impersonator, 0, 0, false, M0.list(M0.cons(M0.prop_arity_string, generate_arity_string), M0.cons(M0.prop_incomplete_arity, true)));
  var struct_keyword_procedure_impersonator_by_arity_error = let_result1317.getAt(0);
  var make_kpi_by_ae = let_result1317.getAt(1);
  var kpi_by_ae_p = let_result1317.getAt(2);
  var kpi_by_ae_ref = let_result1317.getAt(3);
  var kpi_by_ae_set_bang_ = let_result1317.getAt(4);
  var let_result1318 = M0.make_struct_type($rjs_core.Symbol.make("procedure"), struct_keyword_method_impersonator, 0, 0, false, M0.list(M0.cons(M0.prop_arity_string, generate_arity_string), M0.cons(M0.prop_incomplete_arity, true)));
  var struct_keyword_method_impersonator_by_arity_error = let_result1318.getAt(0);
  var make_kmi_by_ae = let_result1318.getAt(1);
  var kmi_by_ae_p = let_result1318.getAt(2);
  var kmi_by_ae_ref = let_result1318.getAt(3);
  var kmi_by_ae_set_bang_ = let_result1318.getAt(4);
  var make_required = function(name2226, fail_proc2227, method_p2228, impersonator_p2229) {
    var or_part2235 = name2226;
    if (or_part2235 !== false) {
      var if_res1322 = or_part2235;
    } else {
      var if_res1322 = $rjs_core.Symbol.make("unknown");
    }
    if (impersonator_p2229 !== false) {
      if (method_p2228 !== false) {
        var if_res1319 = struct_keyword_method_impersonator_by_arity_error;
      } else {
        var if_res1319 = struct_keyword_procedure_impersonator_by_arity_error;
      }
      var if_res1321 = if_res1319;
    } else {
      if (method_p2228 !== false) {
        var if_res1320 = struct_keyword_method_by_arity_error;
      } else {
        var if_res1320 = struct_keyword_procedure_by_arity_error;
      }
      var if_res1321 = if_res1320;
    }
    var let_result1323 = M0.make_struct_type(if_res1322, if_res1321, 0, 0, false, M0.list(M0.cons(prop_named_keyword_procedure, M0.cons(name2226, fail_proc2227))), M0.current_inspector(), fail_proc2227);
    var s_2230 = let_result1323.getAt(0);
    var mk2231 = let_result1323.getAt(1);
    var _p2232 = let_result1323.getAt(2);
    var _ref2233 = let_result1323.getAt(3);
    var _set_bang_2234 = let_result1323.getAt(4);
    return mk2231;
  };
  var cl1324 = function(proc2236) {
    return make_keyword_procedure(proc2236, $rjs_core.attachProcedureArity(function() {
      var args2237 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
      return M0.apply(proc2236, M0.rnull, M0.rnull, args2237);
    }));
  };
  var cl1325 = function(proc2238, plain_proc2239) {
    return make_optional_keyword_procedure(make_keyword_checker(M0.rnull, false, M0.procedure_arity(proc2238)), proc2238, M0.rnull, false, plain_proc2239);
  };
  var make_keyword_procedure = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1326 = {
      '1': cl1324,
      '2': cl1325
    }[arguments.length];
    if (fixed_lam1326 !== undefined !== false) {
      return fixed_lam1326.apply(null, arguments);
    } else {
      return M0.error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var keyword_apply = $rjs_core.attachProcedureArity(function(proc2240, kws2241, kw_vals2242, normal_args2243) {
    var normal_argss2244 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 4));
    var type_error2245 = function(what2246, which2247) {
      return M0.apply(M0.raise_argument_error, $rjs_core.Symbol.make("keyword-apply"), what2246, which2247, proc2240, kws2241, kw_vals2242, normal_args2243, normal_argss2244);
    };
    if (M0.procedure_p(proc2240) !== false) {
      var if_res1327 = M0.rvoid();
    } else {
      var if_res1327 = type_error2245("procedure?", 0);
    }
    if_res1327;
    var loop2248 = function(ks2249) {
      if (M0.null_p(ks2249) !== false) {
        var if_res1334 = M0.rvoid();
      } else {
        var or_part2250 = M0.not(M0.pair_p(ks2249));
        if (or_part2250 !== false) {
          var if_res1328 = or_part2250;
        } else {
          var if_res1328 = M0.not(M0.__rjs_quoted__.keyword_p(M0.car(ks2249)));
        }
        if (if_res1328 !== false) {
          var if_res1333 = type_error2245("(listof keyword?)", 1);
        } else {
          if (M0.null_p(M0.cdr(ks2249)) !== false) {
            var if_res1332 = M0.rvoid();
          } else {
            var or_part2251 = M0.not(M0.pair_p(M0.cdr(ks2249)));
            if (or_part2251 !== false) {
              var if_res1329 = or_part2251;
            } else {
              var if_res1329 = M0.not(M0.__rjs_quoted__.keyword_p(M0.cadr(ks2249)));
            }
            if (if_res1329 !== false) {
              var if_res1331 = loop2248(M0.cdr(ks2249));
            } else {
              if (M0.__rjs_quoted__.keyword_lt__p(M0.car(ks2249), M0.cadr(ks2249)) !== false) {
                var if_res1330 = loop2248(M0.cdr(ks2249));
              } else {
                var if_res1330 = type_error2245("(and/c (listof? keyword?) sorted? distinct?)", 1);
              }
              var if_res1331 = if_res1330;
            }
            var if_res1332 = if_res1331;
          }
          var if_res1333 = if_res1332;
        }
        var if_res1334 = if_res1333;
      }
      return if_res1334;
    };
    loop2248(kws2241);
    if (M0.list_p(kw_vals2242) !== false) {
      var if_res1335 = M0.rvoid();
    } else {
      var if_res1335 = type_error2245("list?", 2);
    }
    if_res1335;
    if (M0._eq_(M0.length(kws2241), M0.length(kw_vals2242)) !== false) {
      var if_res1336 = M0.rvoid();
    } else {
      var if_res1336 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("keyword-apply"), "keyword list length does not match value list length", "keyword list length", M0.length(kws2241), "value list length", M0.length(kw_vals2242), "keyword list", kws2241, "value list", kw_vals2242);
    }
    if_res1336;
    var loop2253 = function(normal_argss2254, pos2255) {
      if (M0.null_p(M0.cdr(normal_argss2254)) !== false) {
        var l2256 = M0.car(normal_argss2254);
        if (M0.list_p(l2256) !== false) {
          var if_res1337 = l2256;
        } else {
          var if_res1337 = type_error2245("list?", pos2255);
        }
        var if_res1338 = if_res1337;
      } else {
        var if_res1338 = M0.cons(M0.car(normal_argss2254), loop2253(M0.cdr(normal_argss2254), M0.add1(pos2255)));
      }
      return if_res1338;
    };
    var normal_args2252 = loop2253(M0.cons(normal_args2243, normal_argss2244), 3);
    if (M0.null_p(kws2241) !== false) {
      var if_res1339 = M0.apply(proc2240, normal_args2252);
    } else {
      var if_res1339 = M0.apply(keyword_procedure_extract_by_method(kws2241, 2 + M0.length(normal_args2252), proc2240, 0), kws2241, kw_vals2242, normal_args2252);
    }
    return if_res1339;
  });
  var procedure_keywords = function(p2257) {
    if (keyword_procedure_p(p2257) !== false) {
      var if_res1344 = M0.values(keyword_procedure_required(p2257), keyword_procedure_allowed(p2257));
    } else {
      if (M0.procedure_p(p2257) !== false) {
        if (new_procedure_p(p2257) !== false) {
          var v2258 = new_procedure_ref(p2257);
          if (M0.procedure_p(v2258) !== false) {
            var if_res1341 = procedure_keywords(v2258);
          } else {
            var a2259 = procedure_accessor_ref(p2257);
            if (a2259 !== false) {
              var if_res1340 = procedure_keywords(a2259(p2257));
            } else {
              var if_res1340 = M0.values(M0.rnull, M0.rnull);
            }
            var if_res1341 = if_res1340;
          }
          var if_res1342 = if_res1341;
        } else {
          var if_res1342 = M0.values(M0.rnull, M0.rnull);
        }
        var if_res1343 = if_res1342;
      } else {
        var if_res1343 = M0.raise_argument_error($rjs_core.Symbol.make("procedure-keywords"), "procedure?", p2257);
      }
      var if_res1344 = if_res1343;
    }
    return if_res1344;
  };
  var missing_kw = $rjs_core.attachProcedureArity(function(proc2260) {
    var args2261 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
    return M0.apply(keyword_procedure_extract_by_method(M0.rnull, 0, proc2260, 0), M0.rnull, M0.rnull, args2261);
  });
  var check_kw_args = function(p2262, kws2263) {
    var loop2264 = function(kws2265, required2266, allowed2267) {
      if (M0.null_p(kws2265) !== false) {
        if (M0.null_p(required2266) !== false) {
          var if_res1345 = M0.values(false, false);
        } else {
          var if_res1345 = M0.values(M0.car(required2266), false);
        }
        var if_res1354 = if_res1345;
      } else {
        if (M0.pair_p(required2266) !== false) {
          var if_res1346 = M0.eq_p(M0.car(required2266), M0.car(kws2265));
        } else {
          var if_res1346 = false;
        }
        if (if_res1346 !== false) {
          var temp1349 = M0.cdr(kws2265);
          var temp1348 = M0.cdr(required2266);
          if (allowed2267 !== false) {
            var if_res1347 = M0.cdr(allowed2267);
          } else {
            var if_res1347 = false;
          }
          var if_res1353 = loop2264(temp1349, temp1348, if_res1347);
        } else {
          if (M0.not(allowed2267) !== false) {
            var if_res1352 = loop2264(M0.cdr(kws2265), required2266, false);
          } else {
            if (M0.pair_p(allowed2267) !== false) {
              if (M0.eq_p(M0.car(allowed2267), M0.car(kws2265)) !== false) {
                var if_res1350 = loop2264(M0.cdr(kws2265), required2266, M0.cdr(allowed2267));
              } else {
                var if_res1350 = loop2264(kws2265, required2266, M0.cdr(allowed2267));
              }
              var if_res1351 = if_res1350;
            } else {
              var if_res1351 = M0.values(false, M0.car(kws2265));
            }
            var if_res1352 = if_res1351;
          }
          var if_res1353 = if_res1352;
        }
        var if_res1354 = if_res1353;
      }
      return if_res1354;
    };
    return loop2264(kws2263, keyword_procedure_required(p2262), keyword_procedure_allowed(p2262));
  };
  var make_keyword_checker = function(req_kws2268, allowed_kws2269, arity2270) {
    if (M0.not(allowed_kws2269) !== false) {
      if (M0.null_p(req_kws2268) !== false) {
        if (M0.integer_p(arity2270) !== false) {
          var if_res1359 = function(kws2271, a2272) {
            if (true !== false) {
              var if_res1355 = M0._eq_(a2272, arity2270);
            } else {
              var if_res1355 = false;
            }
            return if_res1355;
          };
        } else {
          if (M0.arity_at_least_p(arity2270) !== false) {
            var arity2273 = M0.arity_at_least_value(arity2270);
            var if_res1358 = function(kws2274, a2275) {
              if (true !== false) {
                var if_res1356 = M0._gt__eq_(a2275, arity2273);
              } else {
                var if_res1356 = false;
              }
              return if_res1356;
            };
          } else {
            var if_res1358 = function(kws2276, a2277) {
              if (true !== false) {
                var if_res1357 = arity_includes_p(arity2270, a2277);
              } else {
                var if_res1357 = false;
              }
              return if_res1357;
            };
          }
          var if_res1359 = if_res1358;
        }
        var if_res1365 = if_res1359;
      } else {
        if (M0.integer_p(arity2270) !== false) {
          var if_res1364 = function(kws2278, a2279) {
            if (subset_p(req_kws2268, kws2278) !== false) {
              var if_res1360 = M0._eq_(a2279, arity2270);
            } else {
              var if_res1360 = false;
            }
            return if_res1360;
          };
        } else {
          if (M0.arity_at_least_p(arity2270) !== false) {
            var arity2280 = M0.arity_at_least_value(arity2270);
            var if_res1363 = function(kws2281, a2282) {
              if (subset_p(req_kws2268, kws2281) !== false) {
                var if_res1361 = M0._gt__eq_(a2282, arity2280);
              } else {
                var if_res1361 = false;
              }
              return if_res1361;
            };
          } else {
            var if_res1363 = function(kws2283, a2284) {
              if (subset_p(req_kws2268, kws2283) !== false) {
                var if_res1362 = arity_includes_p(arity2270, a2284);
              } else {
                var if_res1362 = false;
              }
              return if_res1362;
            };
          }
          var if_res1364 = if_res1363;
        }
        var if_res1365 = if_res1364;
      }
      var if_res1398 = if_res1365;
    } else {
      if (M0.null_p(allowed_kws2269) !== false) {
        if (M0.integer_p(arity2270) !== false) {
          var if_res1370 = function(kws2285, a2286) {
            if (M0.null_p(kws2285) !== false) {
              var if_res1366 = M0._eq_(a2286, arity2270);
            } else {
              var if_res1366 = false;
            }
            return if_res1366;
          };
        } else {
          if (M0.arity_at_least_p(arity2270) !== false) {
            var arity2287 = M0.arity_at_least_value(arity2270);
            var if_res1369 = function(kws2288, a2289) {
              if (M0.null_p(kws2288) !== false) {
                var if_res1367 = M0._gt__eq_(a2289, arity2287);
              } else {
                var if_res1367 = false;
              }
              return if_res1367;
            };
          } else {
            var if_res1369 = function(kws2290, a2291) {
              if (M0.null_p(kws2290) !== false) {
                var if_res1368 = arity_includes_p(arity2270, a2291);
              } else {
                var if_res1368 = false;
              }
              return if_res1368;
            };
          }
          var if_res1370 = if_res1369;
        }
        var if_res1397 = if_res1370;
      } else {
        if (M0.null_p(req_kws2268) !== false) {
          if (M0.integer_p(arity2270) !== false) {
            var if_res1375 = function(kws2292, a2293) {
              if (subset_p(kws2292, allowed_kws2269) !== false) {
                var if_res1371 = M0._eq_(a2293, arity2270);
              } else {
                var if_res1371 = false;
              }
              return if_res1371;
            };
          } else {
            if (M0.arity_at_least_p(arity2270) !== false) {
              var arity2294 = M0.arity_at_least_value(arity2270);
              var if_res1374 = function(kws2295, a2296) {
                if (subset_p(kws2295, allowed_kws2269) !== false) {
                  var if_res1372 = M0._gt__eq_(a2296, arity2294);
                } else {
                  var if_res1372 = false;
                }
                return if_res1372;
              };
            } else {
              var if_res1374 = function(kws2297, a2298) {
                if (subset_p(kws2297, allowed_kws2269) !== false) {
                  var if_res1373 = arity_includes_p(arity2270, a2298);
                } else {
                  var if_res1373 = false;
                }
                return if_res1373;
              };
            }
            var if_res1375 = if_res1374;
          }
          var if_res1396 = if_res1375;
        } else {
          if (M0.equal_p(req_kws2268, allowed_kws2269) !== false) {
            if (M0.integer_p(arity2270) !== false) {
              var if_res1389 = function(kws2299, a2300) {
                var loop2301 = function(kws2302, req_kws2303) {
                  if (M0.null_p(req_kws2303) !== false) {
                    var if_res1378 = M0.null_p(kws2302);
                  } else {
                    if (M0.null_p(kws2302) !== false) {
                      var if_res1377 = false;
                    } else {
                      if (M0.eq_p(M0.car(kws2302), M0.car(req_kws2303)) !== false) {
                        var if_res1376 = loop2301(M0.cdr(kws2302), M0.cdr(req_kws2303));
                      } else {
                        var if_res1376 = false;
                      }
                      var if_res1377 = if_res1376;
                    }
                    var if_res1378 = if_res1377;
                  }
                  return if_res1378;
                };
                if (loop2301(kws2299, req_kws2268) !== false) {
                  var if_res1379 = M0._eq_(a2300, arity2270);
                } else {
                  var if_res1379 = false;
                }
                return if_res1379;
              };
            } else {
              if (M0.arity_at_least_p(arity2270) !== false) {
                var arity2304 = M0.arity_at_least_value(arity2270);
                var if_res1388 = function(kws2305, a2306) {
                  var loop2307 = function(kws2308, req_kws2309) {
                    if (M0.null_p(req_kws2309) !== false) {
                      var if_res1382 = M0.null_p(kws2308);
                    } else {
                      if (M0.null_p(kws2308) !== false) {
                        var if_res1381 = false;
                      } else {
                        if (M0.eq_p(M0.car(kws2308), M0.car(req_kws2309)) !== false) {
                          var if_res1380 = loop2307(M0.cdr(kws2308), M0.cdr(req_kws2309));
                        } else {
                          var if_res1380 = false;
                        }
                        var if_res1381 = if_res1380;
                      }
                      var if_res1382 = if_res1381;
                    }
                    return if_res1382;
                  };
                  if (loop2307(kws2305, req_kws2268) !== false) {
                    var if_res1383 = M0._gt__eq_(a2306, arity2304);
                  } else {
                    var if_res1383 = false;
                  }
                  return if_res1383;
                };
              } else {
                var if_res1388 = function(kws2310, a2311) {
                  var loop2312 = function(kws2313, req_kws2314) {
                    if (M0.null_p(req_kws2314) !== false) {
                      var if_res1386 = M0.null_p(kws2313);
                    } else {
                      if (M0.null_p(kws2313) !== false) {
                        var if_res1385 = false;
                      } else {
                        if (M0.eq_p(M0.car(kws2313), M0.car(req_kws2314)) !== false) {
                          var if_res1384 = loop2312(M0.cdr(kws2313), M0.cdr(req_kws2314));
                        } else {
                          var if_res1384 = false;
                        }
                        var if_res1385 = if_res1384;
                      }
                      var if_res1386 = if_res1385;
                    }
                    return if_res1386;
                  };
                  if (loop2312(kws2310, req_kws2268) !== false) {
                    var if_res1387 = arity_includes_p(arity2270, a2311);
                  } else {
                    var if_res1387 = false;
                  }
                  return if_res1387;
                };
              }
              var if_res1389 = if_res1388;
            }
            var if_res1395 = if_res1389;
          } else {
            if (M0.integer_p(arity2270) !== false) {
              var if_res1394 = function(kws2315, a2316) {
                if (subsets_p(req_kws2268, kws2315, allowed_kws2269) !== false) {
                  var if_res1390 = M0._eq_(a2316, arity2270);
                } else {
                  var if_res1390 = false;
                }
                return if_res1390;
              };
            } else {
              if (M0.arity_at_least_p(arity2270) !== false) {
                var arity2317 = M0.arity_at_least_value(arity2270);
                var if_res1393 = function(kws2318, a2319) {
                  if (subsets_p(req_kws2268, kws2318, allowed_kws2269) !== false) {
                    var if_res1391 = M0._gt__eq_(a2319, arity2317);
                  } else {
                    var if_res1391 = false;
                  }
                  return if_res1391;
                };
              } else {
                var if_res1393 = function(kws2320, a2321) {
                  if (subsets_p(req_kws2268, kws2320, allowed_kws2269) !== false) {
                    var if_res1392 = arity_includes_p(arity2270, a2321);
                  } else {
                    var if_res1392 = false;
                  }
                  return if_res1392;
                };
              }
              var if_res1394 = if_res1393;
            }
            var if_res1395 = if_res1394;
          }
          var if_res1396 = if_res1395;
        }
        var if_res1397 = if_res1396;
      }
      var if_res1398 = if_res1397;
    }
    return if_res1398;
  };
  var arity_includes_p = function(arity2322, a2323) {
    if (M0.integer_p(arity2322) !== false) {
      var if_res1400 = M0._eq_(arity2322, a2323);
    } else {
      if (M0.arity_at_least_p(arity2322) !== false) {
        var if_res1399 = M0._gt__eq_(a2323, M0.arity_at_least_value(a2323));
      } else {
        var if_res1399 = M0.ormap(function(ar2324) {
          return arity_includes_p(ar2324, a2323);
        }, arity2322);
      }
      var if_res1400 = if_res1399;
    }
    return if_res1400;
  };
  var subset_p = function(l12325, l22326) {
    if (M0.null_p(l12325) !== false) {
      var if_res1403 = true;
    } else {
      if (M0.null_p(l22326) !== false) {
        var if_res1402 = false;
      } else {
        if (M0.eq_p(M0.car(l12325), M0.car(l22326)) !== false) {
          var if_res1401 = subset_p(M0.cdr(l12325), M0.cdr(l22326));
        } else {
          var if_res1401 = subset_p(l12325, M0.cdr(l22326));
        }
        var if_res1402 = if_res1401;
      }
      var if_res1403 = if_res1402;
    }
    return if_res1403;
  };
  var subsets_p = function(l12327, l22328, l32329) {
    if (M0.null_p(l12327) !== false) {
      var if_res1408 = subset_p(l22328, l32329);
    } else {
      if (M0.null_p(l22328) !== false) {
        var if_res1407 = false;
      } else {
        if (M0.null_p(l32329) !== false) {
          var if_res1406 = false;
        } else {
          var v22330 = M0.car(l22328);
          if (M0.eq_p(M0.car(l12327), v22330) !== false) {
            var if_res1405 = subsets_p(M0.cdr(l12327), M0.cdr(l22328), M0.cdr(l32329));
          } else {
            if (M0.eq_p(v22330, M0.car(l32329)) !== false) {
              var if_res1404 = subsets_p(l12327, M0.cdr(l22328), M0.cdr(l32329));
            } else {
              var if_res1404 = subsets_p(l12327, l22328, M0.cdr(l32329));
            }
            var if_res1405 = if_res1404;
          }
          var if_res1406 = if_res1405;
        }
        var if_res1407 = if_res1406;
      }
      var if_res1408 = if_res1407;
    }
    return if_res1408;
  };
  var keyword_procedure_extract_by_method = function(kws2331, n2332, p2333, method_n2334) {
    if (keyword_procedure_p(p2333) !== false) {
      var if_res1409 = keyword_procedure_checker(p2333)(kws2331, n2332);
    } else {
      var if_res1409 = false;
    }
    if (if_res1409 !== false) {
      var if_res1435 = keyword_procedure_proc(p2333);
    } else {
      if (M0.not(keyword_procedure_p(p2333)) !== false) {
        if (M0.procedure_p(p2333) !== false) {
          if (new_procedure_p(p2333) !== false) {
            var a2337 = procedure_accessor_ref(p2333);
            if (a2337 !== false) {
              var if_res1410 = a2337(p2333);
            } else {
              var if_res1410 = false;
            }
            var if_res1411 = if_res1410;
          } else {
            var if_res1411 = false;
          }
          var or_part2336 = if_res1411;
          if (or_part2336 !== false) {
            var if_res1414 = or_part2336;
          } else {
            var or_part2338 = M0.__rjs_quoted__.procedure_extract_target(p2333);
            if (or_part2338 !== false) {
              var if_res1413 = or_part2338;
            } else {
              if (new_procedure_p(p2333) !== false) {
                var if_res1412 = $rjs_core.Symbol.make("method");
              } else {
                var if_res1412 = false;
              }
              var if_res1413 = if_res1412;
            }
            var if_res1414 = if_res1413;
          }
          var if_res1415 = if_res1414;
        } else {
          var if_res1415 = false;
        }
        var if_res1416 = if_res1415;
      } else {
        var if_res1416 = false;
      }
      var p22335 = if_res1416;
      if (p22335 !== false) {
        if (M0.eq_p(p22335, $rjs_core.Symbol.make("method")) !== false) {
          var p32339 = keyword_procedure_extract_by_method(kws2331, M0.add1(n2332), new_procedure_ref(p2333), M0.add1(method_n2334));
          var if_res1417 = $rjs_core.attachProcedureArity(function(kws2340, kw_args2341) {
            var args2342 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
            return M0.apply(p32339, kws2340, kw_args2341, M0.cons(p2333, args2342));
          });
        } else {
          var if_res1417 = keyword_procedure_extract_by_method(kws2331, n2332, p22335, method_n2334);
        }
        var if_res1434 = if_res1417;
      } else {
        var if_res1434 = $rjs_core.attachProcedureArity(function(kws2343, kw_args2344) {
          var args2345 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
          if (keyword_procedure_p(p2333) !== false) {
            var if_res1418 = check_kw_args(p2333, kws2343);
          } else {
            var if_res1418 = M0.values(false, M0.car(kws2343));
          }
          var let_result1419 = if_res1418;
          var missing_kw2346 = let_result1419.getAt(0);
          var extra_kw2347 = let_result1419.getAt(1);
          var or_part2352 = keyword_method_p(p2333);
          if (or_part2352 !== false) {
            var if_res1420 = or_part2352;
          } else {
            var if_res1420 = okm_p(p2333);
          }
          if (if_res1420 !== false) {
            var if_res1421 = 1;
          } else {
            var if_res1421 = 0;
          }
          var method_n2351 = method_n2334 + if_res1421;
          if (M0._gt__eq_(n2332, method_n2351) !== false) {
            var if_res1422 = n2332 - method_n2351;
          } else {
            var if_res1422 = n2332;
          }
          var n2348 = if_res1422;
          if (M0.null_p(args2345) !== false) {
            var if_res1423 = M0.null_p(kws2343);
          } else {
            var if_res1423 = false;
          }
          if (if_res1423 !== false) {
            var if_res1424 = "";
          } else {
            var if_res1424 = M0.apply(M0.string_append, "\n  arguments...:", M0.append(M0.map(function(v2353) {
              return M0.format("\n   ~e", v2353);
            }, args2345), M0.map(function(kw2354, kw_arg2355) {
              return M0.format("\n   ~a ~e", kw2354, kw_arg2355);
            }, kws2343, kw_args2344)));
          }
          var args_str2349 = if_res1424;
          var proc_name2350 = function(p2356) {
            if (named_keyword_procedure_p(p2356) !== false) {
              var if_res1425 = M0.car(keyword_procedure_name_plus_fail(p2356));
            } else {
              var if_res1425 = false;
            }
            var or_part2357 = if_res1425;
            if (or_part2357 !== false) {
              var if_res1427 = or_part2357;
            } else {
              var or_part2358 = M0.__rjs_quoted__.object_name(p2356);
              if (or_part2358 !== false) {
                var if_res1426 = or_part2358;
              } else {
                var if_res1426 = p2356;
              }
              var if_res1427 = if_res1426;
            }
            return if_res1427;
          };
          if (extra_kw2347 !== false) {
            if (keyword_procedure_p(p2333) !== false) {
              var if_res1429 = M0.format(M0.string_append("application: procedure does not expect an argument with given keyword\n", "  procedure: ~a\n", "  given keyword: ~a", "~a"), proc_name2350(p2333), extra_kw2347, args_str2349);
            } else {
              if (M0.procedure_p(p2333) !== false) {
                var if_res1428 = M0.format(M0.string_append("application: procedure does not accept keyword arguments\n", "  procedure: ~a", "~a"), proc_name2350(p2333), args_str2349);
              } else {
                var if_res1428 = M0.format(M0.string_append("application: not a procedure;\n", " expected a procedure that can be applied to arguments\n", "  given: ~e", "~a"), p2333, args_str2349);
              }
              var if_res1429 = if_res1428;
            }
            var if_res1433 = if_res1429;
          } else {
            if (missing_kw2346 !== false) {
              var if_res1432 = M0.format(M0.string_append("application: required keyword argument not supplied\n", "  procedure: ~a\n", "  required keyword: ~a", "~a"), proc_name2350(p2333), missing_kw2346, args_str2349);
            } else {
              var temp1431 = M0.string_append("application: no case matching ~a non-keyword argument~a\n", "  procedure: ~a", "~a");
              if (M0._eq_(1, n2348 - 2) !== false) {
                var if_res1430 = "";
              } else {
                var if_res1430 = "s";
              }
              var if_res1432 = M0.format(temp1431, n2348 - 2, if_res1430, proc_name2350(p2333), args_str2349);
            }
            var if_res1433 = if_res1432;
          }
          return M0.raise(M0.__rjs_quoted__.exn_fail_contract(if_res1433, M0.current_continuation_marks()));
        });
      }
      var if_res1435 = if_res1434;
    }
    return if_res1435;
  };
  var keyword_procedure_extract = function(p2359, kws2360, n2361) {
    return keyword_procedure_extract_by_method(kws2360, n2361, p2359, 0);
  };
  var procedure_reduce_keyword_arity = function(proc2362, arity2363, req_kw2364, allowed_kw2365) {
    if (okp_p(proc2362) !== false) {
      var if_res1436 = okp_ref(proc2362, 0);
    } else {
      var if_res1436 = proc2362;
    }
    var plain_proc2366 = M0.__rjs_quoted__.procedure_reduce_arity(if_res1436, arity2363);
    var sorted_p2367 = function(kws2368) {
      var loop2369 = function(kws2370) {
        if (M0.null_p(kws2370) !== false) {
          var if_res1439 = true;
        } else {
          if (M0.null_p(M0.cdr(kws2370)) !== false) {
            var if_res1438 = true;
          } else {
            if (M0.__rjs_quoted__.keyword_lt__p(M0.car(kws2370), M0.cadr(kws2370)) !== false) {
              var if_res1437 = loop2369(M0.cdr(kws2370));
            } else {
              var if_res1437 = false;
            }
            var if_res1438 = if_res1437;
          }
          var if_res1439 = if_res1438;
        }
        return if_res1439;
      };
      return loop2369(kws2368);
    };
    if (M0.list_p(req_kw2364) !== false) {
      if (M0.andmap(M0.__rjs_quoted__.keyword_p, req_kw2364) !== false) {
        var if_res1440 = sorted_p2367(req_kw2364);
      } else {
        var if_res1440 = false;
      }
      var if_res1441 = if_res1440;
    } else {
      var if_res1441 = false;
    }
    if (if_res1441 !== false) {
      var if_res1442 = M0.rvoid();
    } else {
      var if_res1442 = M0.raise_argument_error($rjs_core.Symbol.make("procedure-reduce-keyword-arity"), "(and/c (listof? keyword?) sorted? distinct?)", 2, proc2362, arity2363, req_kw2364, allowed_kw2365);
    }
    if_res1442;
    if (allowed_kw2365 !== false) {
      if (M0.list_p(allowed_kw2365) !== false) {
        if (M0.andmap(M0.__rjs_quoted__.keyword_p, allowed_kw2365) !== false) {
          var if_res1443 = sorted_p2367(allowed_kw2365);
        } else {
          var if_res1443 = false;
        }
        var if_res1444 = if_res1443;
      } else {
        var if_res1444 = false;
      }
      if (if_res1444 !== false) {
        var if_res1445 = M0.rvoid();
      } else {
        var if_res1445 = M0.raise_argument_error($rjs_core.Symbol.make("procedure-reduce-keyword-arity"), "(or/c (and/c (listof? keyword?) sorted? distinct?) #f)", 3, proc2362, arity2363, req_kw2364, allowed_kw2365);
      }
      if_res1445;
      if (subset_p(req_kw2364, allowed_kw2365) !== false) {
        var if_res1446 = M0.rvoid();
      } else {
        var if_res1446 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("procedure-reduce-keyword-arity"), "allowed-keyword list does not include all required keywords", "allowed-keyword list", allowed_kw2365, "required keywords", req_kw2364);
      }
      var if_res1447 = if_res1446;
    } else {
      var if_res1447 = M0.rvoid();
    }
    if_res1447;
    var let_result1448 = procedure_keywords(proc2362);
    var old_req2371 = let_result1448.getAt(0);
    var old_allowed2372 = let_result1448.getAt(1);
    if (subset_p(old_req2371, req_kw2364) !== false) {
      var if_res1449 = M0.rvoid();
    } else {
      var if_res1449 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("procedure-reduce-keyword-arity"), "cannot reduce required keyword set", "required keywords", old_req2371, "requested required keywords", req_kw2364);
    }
    if_res1449;
    if (old_allowed2372 !== false) {
      if (subset_p(req_kw2364, old_allowed2372) !== false) {
        var if_res1450 = M0.rvoid();
      } else {
        var if_res1450 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("procedure-reduce-keyword-arity"), "cannot require keywords not in original allowed set", "original allowed keywords", old_allowed2372, "requested required keywords", req_kw2364);
      }
      if_res1450;
      var or_part2373 = M0.not(allowed_kw2365);
      if (or_part2373 !== false) {
        var if_res1451 = or_part2373;
      } else {
        var if_res1451 = subset_p(allowed_kw2365, old_allowed2372);
      }
      if (if_res1451 !== false) {
        var if_res1452 = M0.rvoid();
      } else {
        var if_res1452 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("procedure-reduce-keyword-arity"), "cannot allow keywords not in original allowed set", "original allowed keywords", old_allowed2372, "requested allowed keywords", allowed_kw2365);
      }
      var if_res1453 = if_res1452;
    } else {
      var if_res1453 = M0.rvoid();
    }
    if_res1453;
    if (M0.null_p(allowed_kw2365) !== false) {
      var if_res1462 = plain_proc2366;
    } else {
      var inc_arity2374 = function(arity2375, delta2376) {
        var loop2377 = function(a2378) {
          if (M0.integer_p(a2378) !== false) {
            var if_res1455 = a2378 + delta2376;
          } else {
            if (M0.arity_at_least_p(a2378) !== false) {
              var if_res1454 = M0.arity_at_least(M0.arity_at_least_value(a2378) + delta2376);
            } else {
              var if_res1454 = M0.map(loop2377, a2378);
            }
            var if_res1455 = if_res1454;
          }
          return if_res1455;
        };
        return loop2377(arity2375);
      };
      var new_arity2379 = inc_arity2374(arity2363, 2);
      var kw_checker2380 = make_keyword_checker(req_kw2364, allowed_kw2365, new_arity2379);
      var proc2381 = normalize_proc(proc2362);
      var new_kw_proc2382 = M0.__rjs_quoted__.procedure_reduce_arity(keyword_procedure_proc(proc2381), new_arity2379);
      if (M0.null_p(req_kw2364) !== false) {
        if (okm_p(proc2381) !== false) {
          var if_res1456 = make_optional_keyword_method;
        } else {
          var if_res1456 = make_optional_keyword_procedure;
        }
        var if_res1461 = if_res1456(kw_checker2380, new_kw_proc2382, req_kw2364, allowed_kw2365, plain_proc2366);
      } else {
        if (named_keyword_procedure_p(proc2381) !== false) {
          var if_res1459 = M0.car(keyword_procedure_name_plus_fail(proc2381));
        } else {
          var if_res1459 = false;
        }
        var or_part2383 = if_res1459;
        if (or_part2383 !== false) {
          var if_res1460 = or_part2383;
        } else {
          var if_res1460 = M0.__rjs_quoted__.object_name(proc2381);
        }
        var temp1458 = M0.__rjs_quoted__.procedure_reduce_arity(missing_kw, inc_arity2374(arity2363, 1));
        var or_part2384 = okm_p(proc2381);
        if (or_part2384 !== false) {
          var if_res1457 = or_part2384;
        } else {
          var if_res1457 = keyword_method_p(proc2381);
        }
        var if_res1461 = make_required(if_res1460, temp1458, if_res1457, false)(kw_checker2380, new_kw_proc2382, req_kw2364, allowed_kw2365);
      }
      var if_res1462 = if_res1461;
    }
    return if_res1462;
  };
  var procedure_reduce_arity2385 = function(proc2386, arity2387) {
    if (M0.procedure_p(proc2386) !== false) {
      var let_result1463 = procedure_keywords(proc2386);
      var req2388 = let_result1463.getAt(0);
      var allows2389 = let_result1463.getAt(1);
      if (M0.pair_p(req2388) !== false) {
        var if_res1464 = M0.not(M0.null_p(arity2387));
      } else {
        var if_res1464 = false;
      }
      var if_res1465 = if_res1464;
    } else {
      var if_res1465 = false;
    }
    if (if_res1465 !== false) {
      var if_res1467 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("procedure-reduce-arity"), "procedure has required keyword arguments", "procedure", proc2386);
    } else {
      if (okm_p(proc2386) !== false) {
        var if_res1466 = M0.__rjs_quoted__.procedure__gt_method(proc2386);
      } else {
        var if_res1466 = proc2386;
      }
      var if_res1467 = M0.__rjs_quoted__.procedure_reduce_arity(if_res1466, arity2387);
    }
    return if_res1467;
  };
  var new_procedure_reduce_arity = procedure_reduce_arity2385;
  var procedure__gt_method2390 = function(proc2391) {
    var proc2392 = normalize_proc(proc2391);
    if (keyword_procedure_p(proc2392) !== false) {
      if (okm_p(proc2392) !== false) {
        var if_res1470 = proc2392;
      } else {
        if (keyword_method_p(proc2392) !== false) {
          var if_res1469 = proc2392;
        } else {
          if (okp_p(proc2392) !== false) {
            var if_res1468 = make_optional_keyword_method(keyword_procedure_checker(proc2392), keyword_procedure_proc(proc2392), keyword_procedure_required(proc2392), keyword_procedure_allowed(proc2392), okp_ref(proc2392, 0));
          } else {
            var name_plus_fail2393 = keyword_procedure_name_plus_fail(proc2392);
            var mk2394 = make_required(M0.car(name_plus_fail2393), M0.cdr(name_plus_fail2393), true, false);
            var if_res1468 = mk2394(keyword_procedure_checker(proc2392), keyword_procedure_proc(proc2392), keyword_procedure_required(proc2392), keyword_procedure_allowed(proc2392));
          }
          var if_res1469 = if_res1468;
        }
        var if_res1470 = if_res1469;
      }
      var if_res1471 = if_res1470;
    } else {
      var if_res1471 = M0.__rjs_quoted__.procedure__gt_method(proc2392);
    }
    return if_res1471;
  };
  var new_procedure__gt_method = procedure__gt_method2390;
  var procedure_rename2395 = function(proc2396, name2397) {
    if (keyword_procedure_p(proc2396) !== false) {
      var if_res1472 = M0.symbol_p(name2397);
    } else {
      var if_res1472 = false;
    }
    if (M0.not(if_res1472) !== false) {
      var if_res1475 = M0.__rjs_quoted__.procedure_rename(proc2396, name2397);
    } else {
      if (okp_p(proc2396) !== false) {
        if (okm_p(proc2396) !== false) {
          var if_res1473 = make_optional_keyword_method;
        } else {
          var if_res1473 = make_optional_keyword_procedure;
        }
        var if_res1474 = if_res1473(keyword_procedure_checker(proc2396), keyword_procedure_proc(proc2396), keyword_procedure_required(proc2396), keyword_procedure_allowed(proc2396), M0.__rjs_quoted__.procedure_rename(okp_ref(proc2396, 0), name2397));
      } else {
        var name_plus_fail2398 = keyword_procedure_name_plus_fail(proc2396);
        var mk2399 = make_required(name2397, M0.cdr(name_plus_fail2398), keyword_method_p(proc2396), false);
        var if_res1474 = mk2399(keyword_procedure_checker(proc2396), keyword_procedure_proc(proc2396), keyword_procedure_required(proc2396), keyword_procedure_allowed(proc2396));
      }
      var if_res1475 = if_res1474;
    }
    return if_res1475;
  };
  var new_procedure_rename = procedure_rename2395;
  var chaperone_procedure2400 = $rjs_core.attachProcedureArity(function(proc2401, wrap_proc2402) {
    var props2403 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return do_chaperone_procedure(false, false, M0.__rjs_quoted__.chaperone_procedure, $rjs_core.Symbol.make("chaperone-procedure"), proc2401, wrap_proc2402, props2403);
  });
  var new_chaperone_procedure = chaperone_procedure2400;
  var unsafe_chaperone_procedure2404 = $rjs_core.attachProcedureArity(function(proc2405, wrap_proc2406) {
    var props2407 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return do_unsafe_chaperone_procedure(M1.__rjs_quoted__.unsafe_chaperone_procedure, $rjs_core.Symbol.make("unsafe-chaperone-procedure"), proc2405, wrap_proc2406, props2407);
  });
  var new_unsafe_chaperone_procedure = unsafe_chaperone_procedure2404;
  var impersonate_procedure2408 = $rjs_core.attachProcedureArity(function(proc2409, wrap_proc2410) {
    var props2411 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return do_chaperone_procedure(true, false, M0.__rjs_quoted__.impersonate_procedure, $rjs_core.Symbol.make("impersonate-procedure"), proc2409, wrap_proc2410, props2411);
  });
  var new_impersonate_procedure = impersonate_procedure2408;
  var unsafe_impersonate_procedure2412 = $rjs_core.attachProcedureArity(function(proc2413, wrap_proc2414) {
    var props2415 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return do_unsafe_chaperone_procedure(M1.__rjs_quoted__.unsafe_impersonate_procedure, $rjs_core.Symbol.make("unsafe-impersonate-procedure"), proc2413, wrap_proc2414, props2415);
  });
  var new_unsafe_impersonate_procedure = unsafe_impersonate_procedure2412;
  var chaperone_procedure_times_2416 = $rjs_core.attachProcedureArity(function(proc2417, wrap_proc2418) {
    var props2419 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return do_chaperone_procedure(false, true, M0.__rjs_quoted__.chaperone_procedure_times_, $rjs_core.Symbol.make("chaperone-procedure"), proc2417, wrap_proc2418, props2419);
  });
  var new_chaperone_procedure_times_ = chaperone_procedure_times_2416;
  var impersonate_procedure_times_2420 = $rjs_core.attachProcedureArity(function(proc2421, wrap_proc2422) {
    var props2423 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return do_chaperone_procedure(true, true, M0.__rjs_quoted__.impersonate_procedure_times_, $rjs_core.Symbol.make("impersonate-procedure"), proc2421, wrap_proc2422, props2423);
  });
  var new_impersonate_procedure_times_ = impersonate_procedure_times_2420;
  var do_chaperone_procedure = function(is_impersonator_p2424, self_arg_p2425, chaperone_procedure2426, name2427, proc2428, wrap_proc2429, props2430) {
    var n_proc2431 = normalize_proc(proc2428);
    var n_wrap_proc2432 = normalize_proc(wrap_proc2429);
    var or_part2433 = M0.not(keyword_procedure_p(n_proc2431));
    if (or_part2433 !== false) {
      var if_res1477 = or_part2433;
    } else {
      var or_part2434 = M0.not(M0.procedure_p(wrap_proc2429));
      if (or_part2434 !== false) {
        var if_res1476 = or_part2434;
      } else {
        var if_res1476 = bad_props_p(props2430);
      }
      var if_res1477 = if_res1476;
    }
    if (if_res1477 !== false) {
      var if_res1520 = M0.apply(chaperone_procedure2426, proc2428, wrap_proc2429, props2430);
    } else {
      chaperone_arity_match_checking(self_arg_p2425, name2427, proc2428, wrap_proc2429, props2430);
      var p2436 = keyword_procedure_proc(n_wrap_proc2432);
      if (self_arg_p2425 !== false) {
        var cl1478 = $rjs_core.attachProcedureArity(function(self_proc2437, kws2438, args2439) {
          var rest2440 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 3));
          return M0.call_with_values(function() {
            return M0.apply(p2436, kws2438, args2439, self_proc2437, rest2440);
          }, $rjs_core.attachProcedureArity(function() {
            var results2441 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
            var len2442 = M0.length(results2441);
            var alen2443 = M0.length(rest2440);
            if (M0._lt_(len2442, alen2443 + 1) !== false) {
              var if_res1483 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("keyword procedure chaperone"), "wrong number of results from wrapper procedure", "expected minimum number of results", alen2443 + 1, "received number of results", len2442, "wrapper procedure", wrap_proc2429);
            } else {
              var if_res1483 = M0.rvoid();
            }
            if_res1483;
            var num_extra2444 = len2442 - (alen2443 + 1);
            var new_args2445 = M0.list_ref(results2441, num_extra2444);
            if (M0.list_p(new_args2445) !== false) {
              var if_res1484 = M0._eq_(M0.length(new_args2445), M0.length(args2439));
            } else {
              var if_res1484 = false;
            }
            if (if_res1484 !== false) {
              var if_res1486 = M0.rvoid();
            } else {
              if (M0._eq_(len2442, alen2443) !== false) {
                var if_res1485 = "";
              } else {
                var if_res1485 = " (after the result-wrapper procedure or mark specifications)";
              }
              var if_res1486 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("keyword procedure chaperone"), M0.format("expected a list of keyword-argument values as first result~a from wrapper procedure", if_res1485), "first result", new_args2445, "wrapper procedure", wrap_proc2429);
            }
            if_res1486;
            M0.for_each(function(kw2446, new_arg2447, arg2448) {
              if (is_impersonator_p2424 !== false) {
                var if_res1488 = M0.rvoid();
              } else {
                if (M0.__rjs_quoted__.chaperone_of_p(new_arg2447, arg2448) !== false) {
                  var if_res1487 = M0.rvoid();
                } else {
                  var if_res1487 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("keyword procedure chaperone"), M0.format("~a keyword result is not a chaperone of original argument from chaperoning procedure", kw2446), "result", new_arg2447, "wrapper procedure", wrap_proc2429);
                }
                var if_res1488 = if_res1487;
              }
              return if_res1488;
            }, kws2438, new_args2445, args2439);
            var tmp2449 = num_extra2444;
            if (M0.equal_p(tmp2449, 0) !== false) {
              var if_res1491 = M0.apply(M0.values, kws2438, results2441);
            } else {
              if (M0.equal_p(tmp2449, 1) !== false) {
                var if_res1490 = M0.apply(M0.values, M0.car(results2441), kws2438, M0.cdr(results2441));
              } else {
                var loop2450 = function(results2451, c2452) {
                  if (M0.zero_p(c2452) !== false) {
                    var if_res1489 = M0.cons(kws2438, results2451);
                  } else {
                    var if_res1489 = M0.cons(M0.car(results2451), loop2450(M0.cdr(results2451), M0.sub1(c2452)));
                  }
                  return if_res1489;
                };
                var if_res1490 = M0.apply(M0.values, loop2450(results2441, num_extra2444));
              }
              var if_res1491 = if_res1490;
            }
            return if_res1491;
          }));
        });
        var cl1479 = $rjs_core.attachProcedureArity(function() {
          var other2453 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          return M0.error("shouldn't get here");
        });
        var if_res1506 = $rjs_core.attachProcedureArity(function() {
          var fixed_lam1480 = {}[arguments.length];
          if (fixed_lam1480 !== undefined !== false) {
            return fixed_lam1480.apply(null, arguments);
          } else {
            if (M0._gt__eq_(cl1478.length, 1) !== false) {
              var if_res1482 = cl1478.apply(null, arguments);
            } else {
              if (true !== false) {
                var if_res1481 = cl1479.apply(null, arguments);
              } else {
                var if_res1481 = M0.error("case-lambda: invalid case");
              }
              var if_res1482 = if_res1481;
            }
            return if_res1482;
          }
        }, [M0.make_arity_at_least(0)]);
      } else {
        var cl1492 = $rjs_core.attachProcedureArity(function(kws2454, args2455) {
          var rest2456 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
          return M0.call_with_values(function() {
            return M0.apply(p2436, kws2454, args2455, rest2456);
          }, $rjs_core.attachProcedureArity(function() {
            var results2457 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
            var len2458 = M0.length(results2457);
            var alen2459 = M0.length(rest2456);
            if (M0._lt_(len2458, alen2459 + 1) !== false) {
              var if_res1497 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("keyword procedure chaperone"), "wrong number of results from wrapper procedure", "expected minimum number of results", alen2459 + 1, "received number of results", len2458, "wrapper procedure", wrap_proc2429);
            } else {
              var if_res1497 = M0.rvoid();
            }
            if_res1497;
            var num_extra2460 = len2458 - (alen2459 + 1);
            var new_args2461 = M0.list_ref(results2457, num_extra2460);
            if (M0.list_p(new_args2461) !== false) {
              var if_res1498 = M0._eq_(M0.length(new_args2461), M0.length(args2455));
            } else {
              var if_res1498 = false;
            }
            if (if_res1498 !== false) {
              var if_res1500 = M0.rvoid();
            } else {
              if (M0._eq_(len2458, alen2459) !== false) {
                var if_res1499 = "";
              } else {
                var if_res1499 = " (after the result-wrapper procedure or mark specifications)";
              }
              var if_res1500 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("keyword procedure chaperone"), M0.format("expected a list of keyword-argument values as first result~a from wrapper procedure", if_res1499), "first result", new_args2461, "wrapper procedure", wrap_proc2429);
            }
            if_res1500;
            M0.for_each(function(kw2462, new_arg2463, arg2464) {
              if (is_impersonator_p2424 !== false) {
                var if_res1502 = M0.rvoid();
              } else {
                if (M0.__rjs_quoted__.chaperone_of_p(new_arg2463, arg2464) !== false) {
                  var if_res1501 = M0.rvoid();
                } else {
                  var if_res1501 = M0.__rjs_quoted__.raise_arguments_error($rjs_core.Symbol.make("keyword procedure chaperone"), M0.format("~a keyword result is not a chaperone of original argument from chaperoning procedure", kw2462), "result", new_arg2463, "wrapper procedure", wrap_proc2429);
                }
                var if_res1502 = if_res1501;
              }
              return if_res1502;
            }, kws2454, new_args2461, args2455);
            var tmp2465 = num_extra2460;
            if (M0.equal_p(tmp2465, 0) !== false) {
              var if_res1505 = M0.apply(M0.values, kws2454, results2457);
            } else {
              if (M0.equal_p(tmp2465, 1) !== false) {
                var if_res1504 = M0.apply(M0.values, M0.car(results2457), kws2454, M0.cdr(results2457));
              } else {
                var loop2466 = function(results2467, c2468) {
                  if (M0.zero_p(c2468) !== false) {
                    var if_res1503 = M0.cons(kws2454, results2467);
                  } else {
                    var if_res1503 = M0.cons(M0.car(results2467), loop2466(M0.cdr(results2467), M0.sub1(c2468)));
                  }
                  return if_res1503;
                };
                var if_res1504 = M0.apply(M0.values, loop2466(results2457, num_extra2460));
              }
              var if_res1505 = if_res1504;
            }
            return if_res1505;
          }));
        });
        var cl1493 = $rjs_core.attachProcedureArity(function() {
          var other2469 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          return M0.error("shouldn't get here");
        });
        var if_res1506 = $rjs_core.attachProcedureArity(function() {
          var fixed_lam1494 = {}[arguments.length];
          if (fixed_lam1494 !== undefined !== false) {
            return fixed_lam1494.apply(null, arguments);
          } else {
            if (M0._gt__eq_(cl1492.length, 1) !== false) {
              var if_res1496 = cl1492.apply(null, arguments);
            } else {
              if (true !== false) {
                var if_res1495 = cl1493.apply(null, arguments);
              } else {
                var if_res1495 = M0.error("case-lambda: invalid case");
              }
              var if_res1496 = if_res1495;
            }
            return if_res1496;
          }
        }, [M0.make_arity_at_least(0)]);
      }
      var kw_chaperone2435 = if_res1506;
      var wrap2472 = function(proc2473, n_proc2474) {
        if (M0.not(M0.eq_p(n_proc2474, proc2473)) !== false) {
          var if_res1507 = new_procedure_p(proc2473);
        } else {
          var if_res1507 = false;
        }
        if (if_res1507 !== false) {
          var v2475 = new_procedure_ref(proc2473);
          if (M0.exact_integer_p(v2475) !== false) {
            var acc2476 = procedure_accessor_ref(proc2473);
            var if_res1512 = M0.values(M0.__rjs_quoted__.chaperone_struct(proc2473, acc2476, function(self2477, sub_proc2478) {
              var let_result1508 = wrap2472(sub_proc2478, normalize_proc(sub_proc2478));
              var f2479 = let_result1508.getAt(0);
              var acc2480 = let_result1508.getAt(1);
              return f2479;
            }), acc2476);
          } else {
            var if_res1512 = M0.values(M0.__rjs_quoted__.chaperone_struct(proc2473, new_procedure_ref, function(self2481, proc2482) {
              if (self_arg_p2425 !== false) {
                var if_res1511 = $rjs_core.attachProcedureArity(function(proc_self2483, kws2484, kw_args2485, self2486) {
                  var args2487 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 4));
                  var len2488 = M0.length(args2487);
                  return M0.call_with_values(function() {
                    return M0.apply(kw_chaperone2435, proc_self2483, kws2484, kw_args2485, args2487);
                  }, $rjs_core.attachProcedureArity(function() {
                    var results2489 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
                    if (M0._eq_(M0.length(results2489), M0.add1(len2488)) !== false) {
                      var if_res1509 = M0.apply(M0.values, M0.car(results2489), self2486, M0.cdr(results2489));
                    } else {
                      var if_res1509 = M0.apply(M0.values, M0.car(results2489), M0.cadr(results2489), self2486, M0.cddr(results2489));
                    }
                    return if_res1509;
                  }));
                });
              } else {
                var if_res1511 = $rjs_core.attachProcedureArity(function(kws2490, kw_args2491, self2492) {
                  var args2493 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 3));
                  var len2494 = M0.length(args2493);
                  return M0.call_with_values(function() {
                    return M0.apply(kw_chaperone2435, kws2490, kw_args2491, args2493);
                  }, $rjs_core.attachProcedureArity(function() {
                    var results2495 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
                    if (M0._eq_(M0.length(results2495), M0.add1(len2494)) !== false) {
                      var if_res1510 = M0.apply(M0.values, M0.car(results2495), self2492, M0.cdr(results2495));
                    } else {
                      var if_res1510 = M0.apply(M0.values, M0.car(results2495), M0.cadr(results2495), self2492, M0.cddr(results2495));
                    }
                    return if_res1510;
                  }));
                });
              }
              return chaperone_procedure2426(proc2482, make_keyword_procedure(if_res1511));
            }), new_procedure_ref);
          }
          var if_res1517 = if_res1512;
        } else {
          if (okp_p(n_proc2474) !== false) {
            if (is_impersonator_p2424 !== false) {
              if (okm_p(n_proc2474) !== false) {
                var if_res1513 = make_optional_keyword_method_impersonator;
              } else {
                var if_res1513 = make_optional_keyword_procedure_impersonator;
              }
              var if_res1514 = if_res1513(keyword_procedure_checker(n_proc2474), chaperone_procedure2426(keyword_procedure_proc(n_proc2474), kw_chaperone2435), keyword_procedure_required(n_proc2474), keyword_procedure_allowed(n_proc2474), chaperone_procedure2426(okp_ref(n_proc2474, 0), okp_ref(n_wrap_proc2432, 0)), n_proc2474);
            } else {
              var if_res1514 = M0.__rjs_quoted__.chaperone_struct(proc2473, keyword_procedure_proc, function(self2496, proc2497) {
                return chaperone_procedure2426(proc2497, kw_chaperone2435);
              }, M0.make_struct_field_accessor(okp_ref, 0), function(self2498, proc2499) {
                return chaperone_procedure2426(proc2499, okp_ref(n_wrap_proc2432, 0));
              });
            }
            var if_res1516 = M0.values(if_res1514, keyword_procedure_proc);
          } else {
            if (is_impersonator_p2424 !== false) {
              var name_plus_fail2500 = keyword_procedure_name_plus_fail(n_proc2474);
              var mk2501 = make_required(M0.car(name_plus_fail2500), M0.cdr(name_plus_fail2500), keyword_method_p(n_proc2474), true);
              var if_res1515 = mk2501(keyword_procedure_checker(n_proc2474), chaperone_procedure2426(keyword_procedure_proc(n_proc2474), kw_chaperone2435), keyword_procedure_required(n_proc2474), keyword_procedure_allowed(n_proc2474), n_proc2474);
            } else {
              var if_res1515 = M0.__rjs_quoted__.chaperone_struct(n_proc2474, keyword_procedure_proc, function(self2502, proc2503) {
                return chaperone_procedure2426(proc2503, kw_chaperone2435);
              });
            }
            var if_res1516 = M0.values(if_res1515, keyword_procedure_proc);
          }
          var if_res1517 = if_res1516;
        }
        return if_res1517;
      };
      var let_result1518 = wrap2472(proc2428, n_proc2431);
      var new_proc2470 = let_result1518.getAt(0);
      var chap_accessor2471 = let_result1518.getAt(1);
      if (M0.null_p(props2430) !== false) {
        var if_res1519 = new_proc2470;
      } else {
        var if_res1519 = M0.apply(M0.__rjs_quoted__.chaperone_struct, new_proc2470, chap_accessor2471, false, props2430);
      }
      var if_res1520 = if_res1519;
    }
    return if_res1520;
  };
  var do_unsafe_chaperone_procedure = function(unsafe_chaperone_procedure2504, name2505, proc2506, wrap_proc2507, props2508) {
    var n_proc2509 = normalize_proc(proc2506);
    var n_wrap_proc2510 = normalize_proc(wrap_proc2507);
    var or_part2511 = M0.not(keyword_procedure_p(n_proc2509));
    if (or_part2511 !== false) {
      var if_res1522 = or_part2511;
    } else {
      var or_part2512 = M0.not(M0.procedure_p(wrap_proc2507));
      if (or_part2512 !== false) {
        var if_res1521 = or_part2512;
      } else {
        var if_res1521 = bad_props_p(props2508);
      }
      var if_res1522 = if_res1521;
    }
    if (if_res1522 !== false) {
      var if_res1523 = M0.apply(unsafe_chaperone_procedure2504, proc2506, wrap_proc2507, props2508);
    } else {
      chaperone_arity_match_checking(false, name2505, proc2506, wrap_proc2507, props2508);
      var if_res1523 = M0.apply(unsafe_chaperone_procedure2504, proc2506, wrap_proc2507, props2508);
    }
    return if_res1523;
  };
  var bad_props_p = function(props2513) {
    var loop2514 = function(props2515) {
      if (M0.null_p(props2515) !== false) {
        var if_res1526 = false;
      } else {
        if (M0.__rjs_quoted__.impersonator_property_p(M0.car(props2515)) !== false) {
          var props2516 = M0.cdr(props2515);
          var or_part2517 = M0.null_p(props2516);
          if (or_part2517 !== false) {
            var if_res1524 = or_part2517;
          } else {
            var if_res1524 = loop2514(M0.cdr(props2516));
          }
          var if_res1525 = if_res1524;
        } else {
          var if_res1525 = true;
        }
        var if_res1526 = if_res1525;
      }
      return if_res1526;
    };
    return loop2514(props2513);
  };
  var chaperone_arity_match_checking = function(self_arg_p2518, name2519, proc2520, wrap_proc2521, props2522) {
    var a2523 = M0.procedure_arity(proc2520);
    var b2524 = M0.procedure_arity(wrap_proc2521);
    if (self_arg_p2518 !== false) {
      var if_res1527 = 1;
    } else {
      var if_res1527 = 0;
    }
    var d2525 = if_res1527;
    var let_result1528 = procedure_keywords(proc2520);
    var a_req2526 = let_result1528.getAt(0);
    var a_allow2527 = let_result1528.getAt(1);
    var let_result1529 = procedure_keywords(wrap_proc2521);
    var b_req2528 = let_result1529.getAt(0);
    var b_allow2529 = let_result1529.getAt(1);
    var includes_p2530 = function(a2531, b2532) {
      if (M0.number_p(b2532) !== false) {
        if (M0.number_p(a2531) !== false) {
          var if_res1531 = M0._eq_(b2532, a2531 + d2525);
        } else {
          if (M0.arity_at_least_p(a2531) !== false) {
            var if_res1530 = M0._gt__eq_(b2532, M0.arity_at_least_value(a2531) + d2525);
          } else {
            var if_res1530 = M0.ormap(function(a2533) {
              return includes_p2530(a2533, b2532);
            }, a2531);
          }
          var if_res1531 = if_res1530;
        }
        var if_res1535 = if_res1531;
      } else {
        if (M0.arity_at_least_p(b2532) !== false) {
          if (M0.number_p(a2531) !== false) {
            var if_res1533 = false;
          } else {
            if (M0.arity_at_least_p(a2531) !== false) {
              var if_res1532 = M0._gt__eq_(M0.arity_at_least_value(b2532), M0.arity_at_least_value(a2531) + d2525);
            } else {
              var if_res1532 = M0.ormap(function(a2534) {
                return includes_p2530(b2532, a2534);
              }, a2531);
            }
            var if_res1533 = if_res1532;
          }
          var if_res1534 = if_res1533;
        } else {
          var if_res1534 = M0.andmap(function(b2535) {
            return includes_p2530(a2531, b2535);
          }, b2532);
        }
        var if_res1535 = if_res1534;
      }
      return if_res1535;
    };
    if (includes_p2530(b2524, a2523) !== false) {
      var if_res1536 = M0.rvoid();
    } else {
      var if_res1536 = M0.apply(M0.__rjs_quoted__.chaperone_procedure, proc2520, wrap_proc2521, props2522);
    }
    if_res1536;
    if (subset_p(b_req2528, a_req2526) !== false) {
      var if_res1537 = M0.rvoid();
    } else {
      var if_res1537 = M0.__rjs_quoted__.raise_arguments_error(name2519, "wrapper procedure requires more keywords than original procedure", "wrapper procedure", wrap_proc2521, "original procedure", proc2520);
    }
    if_res1537;
    var or_part2536 = M0.not(b_allow2529);
    if (or_part2536 !== false) {
      var if_res1539 = or_part2536;
    } else {
      if (a_allow2527 !== false) {
        var if_res1538 = subset_p(a_allow2527, b_allow2529);
      } else {
        var if_res1538 = false;
      }
      var if_res1539 = if_res1538;
    }
    if (if_res1539 !== false) {
      var if_res1540 = M0.rvoid();
    } else {
      var if_res1540 = M0.__rjs_quoted__.raise_arguments_error(name2519, "wrapper procedure does not accept all keywords of original procedure", "wrapper procedure", wrap_proc2521, "original procedure", proc2520);
    }
    if_res1540;
    return M0.rvoid();
  };
  var normalize_proc = function(proc2537) {
    if (keyword_procedure_p(proc2537) !== false) {
      var if_res1547 = proc2537;
    } else {
      if (new_procedure_p(proc2537) !== false) {
        var let_result1541 = procedure_keywords(proc2537);
        var req_kws2538 = let_result1541.getAt(0);
        var allowed_kws2539 = let_result1541.getAt(1);
        if (M0.null_p(allowed_kws2539) !== false) {
          var if_res1545 = proc2537;
        } else {
          var if_res1545 = make_optional_keyword_procedure(function(given_kws2540, given_argc2541) {
            if (M0.procedure_arity_includes_p(proc2537, given_argc2541 - 2, true) !== false) {
              var or_part2542 = M0.not(allowed_kws2539);
              if (or_part2542 !== false) {
                var if_res1542 = or_part2542;
              } else {
                var if_res1542 = subset_p(given_kws2540, allowed_kws2539);
              }
              if (if_res1542 !== false) {
                var if_res1543 = subset_p(req_kws2538, given_kws2540);
              } else {
                var if_res1543 = false;
              }
              var if_res1544 = if_res1543;
            } else {
              var if_res1544 = false;
            }
            return if_res1544;
          }, $rjs_core.attachProcedureArity(function(kws2543, kw_args2544) {
            var vals2545 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
            return keyword_apply(proc2537, kws2543, kw_args2544, vals2545);
          }), req_kws2538, allowed_kws2539, proc2537);
        }
        var if_res1546 = if_res1545;
      } else {
        var if_res1546 = proc2537;
      }
      var if_res1547 = if_res1546;
    }
    return if_res1547;
  };
  var __rjs_quoted__ = {};
  __rjs_quoted__.keyword_procedure_extract = keyword_procedure_extract;
  __rjs_quoted__.struct_keyword_method_by_arity_error = struct_keyword_method_by_arity_error;
  __rjs_quoted__.make_optional_keyword_method = make_optional_keyword_method;
  __rjs_quoted__.prop_named_keyword_procedure = prop_named_keyword_procedure;
  __rjs_quoted__.struct_keyword_procedure_by_arity_error = struct_keyword_procedure_by_arity_error;
  __rjs_quoted__.subsets_p = subsets_p;
  __rjs_quoted__.struct_keyword_procedure = struct_keyword_procedure;
  __rjs_quoted__.subset_p = subset_p;
  __rjs_quoted__.missing_kw = missing_kw;
  __rjs_quoted__.make_optional_keyword_procedure = make_optional_keyword_procedure;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get new_impersonate_procedure_times_() {
      return new_impersonate_procedure_times_;
    },
    get new_chaperone_procedure_times_() {
      return new_chaperone_procedure_times_;
    },
    get new_impersonate_procedure() {
      return new_impersonate_procedure;
    },
    get new_chaperone_procedure() {
      return new_chaperone_procedure;
    },
    get new_procedure_rename() {
      return new_procedure_rename;
    },
    get new_procedure__gt_method() {
      return new_procedure__gt_method;
    },
    get new_prop_procedure() {
      return new_prop_procedure;
    },
    get procedure_reduce_keyword_arity() {
      return procedure_reduce_keyword_arity;
    },
    get new_procedure_reduce_arity() {
      return new_procedure_reduce_arity;
    },
    get procedure_keywords() {
      return procedure_keywords;
    },
    get keyword_apply() {
      return keyword_apply;
    },
    get make_keyword_procedure() {
      return make_keyword_procedure;
    }
  };
})();
var $__collects_47_racket_47_private_47_pre_45_base_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/pre-base.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var M1 = $__collects_47_racket_47_private_47_collect_46_rkt_46_js__;
  var M2 = $__collects_47_racket_47_private_47_path_46_rkt_46_js__;
  var M3 = $__collects_47_racket_47_private_47_kw_46_rkt_46_js__;
  var new_apply_proc = M3.make_keyword_procedure($rjs_core.attachProcedureArity(function(kws2873, kw_args2874, proc2875, args2876) {
    var rest2877 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 4));
    return M3.keyword_apply(proc2875, kws2873, kw_args2874, M0.apply(M0.list_times_, args2876, rest2877));
  }), M0.apply);
  var new_keyword_apply = M3.make_keyword_procedure($rjs_core.attachProcedureArity(function(kws2878, kw_args2879, proc2880, orig_kws2881, orig_kw_args2882, args2883) {
    var rest2884 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 6));
    var loop2887 = function(kws2888, kw_args2889, kws22890, kw_args22891, swapped_p2892) {
      if (M0.null_p(kws2888) !== false) {
        var if_res1781 = M0.values(kws22890, kw_args22891);
      } else {
        if (M0.null_p(kws22890) !== false) {
          var if_res1780 = M0.values(kws2888, kw_args2889);
        } else {
          if (M0.__rjs_quoted__.keyword_lt__p(M0.car(kws2888), M0.car(kws22890)) !== false) {
            var let_result1777 = loop2887(M0.cdr(kws2888), M0.cdr(kw_args2889), kws22890, kw_args22891, false);
            var res_kws2893 = let_result1777.getAt(0);
            var res_kw_args2894 = let_result1777.getAt(1);
            var if_res1779 = M0.values(M0.cons(M0.car(kws2888), res_kws2893), M0.cons(M0.car(kw_args2889), res_kw_args2894));
          } else {
            if (swapped_p2892 !== false) {
              var if_res1778 = M0.__rjs_quoted__.raise_mismatch_error($rjs_core.Symbol.make("keyword-apply"), "keyword duplicated in list and direct keyword arguments: ", M0.car(kws2888));
            } else {
              var if_res1778 = loop2887(kws22890, kw_args22891, kws2888, kw_args2889, true);
            }
            var if_res1779 = if_res1778;
          }
          var if_res1780 = if_res1779;
        }
        var if_res1781 = if_res1780;
      }
      return if_res1781;
    };
    var let_result1782 = loop2887(kws2878, kw_args2879, orig_kws2881, orig_kw_args2882, false);
    var kws2885 = let_result1782.getAt(0);
    var kw_args2886 = let_result1782.getAt(1);
    return M3.keyword_apply(proc2880, kws2885, kw_args2886, M0.apply(M0.list_times_, args2883, rest2884));
  }), M3.keyword_apply);
  var double_flonum_p = function(x2895) {
    return M0.__rjs_quoted__.flonum_p(x2895);
  };
  var enforce_random_int_range = function(x2896) {
    if (M0.__rjs_quoted__.exact_positive_integer_p(x2896) !== false) {
      var if_res1783 = M0._lt__eq_(x2896, 4294967087);
    } else {
      var if_res1783 = false;
    }
    if (if_res1783 !== false) {
      var if_res1784 = M0.rvoid();
    } else {
      var if_res1784 = M0.raise_argument_error($rjs_core.Symbol.make("random"), "(integer-in 1 4294967087)", x2896);
    }
    return if_res1784;
  };
  var enforce_greater = function(x2897, y2898) {
    if (M0._gt_(y2898, x2897) !== false) {
      var if_res1785 = M0.rvoid();
    } else {
      var if_res1785 = M0.raise_argument_error($rjs_core.Symbol.make("random"), M0.string_append("integer greater than ", M0.number__gt_string(x2897)), y2898);
    }
    return if_res1785;
  };
  var cl1786 = function() {
    return M0.random();
  };
  var cl1787 = function(x2900) {
    return M0.random(x2900);
  };
  var cl1788 = function(x2901, y2902) {
    if (M0.__rjs_quoted__.exact_positive_integer_p(y2902) !== false) {
      enforce_random_int_range(x2901);
      enforce_random_int_range(y2902);
      enforce_greater(x2901, y2902);
      var if_res1792 = x2901 + M0.random(y2902 - x2901);
    } else {
      if (M0.__rjs_quoted__.pseudo_random_generator_p(y2902) !== false) {
        enforce_random_int_range(x2901);
        var if_res1791 = M0.random(x2901, y2902);
      } else {
        var if_res1791 = M0.raise_argument_error($rjs_core.Symbol.make("random"), "(or/c (integer-in 1 4294967087) pseudo-random-generator?)", y2902);
      }
      var if_res1792 = if_res1791;
    }
    return if_res1792;
  };
  var cl1789 = function(min2903, max2904, prng2905) {
    enforce_random_int_range(min2903);
    enforce_random_int_range(max2904);
    enforce_greater(min2903, max2904);
    if (M0.__rjs_quoted__.pseudo_random_generator_p(prng2905) !== false) {
      var if_res1793 = M0.rvoid();
    } else {
      var if_res1793 = M0.raise_argument_error($rjs_core.Symbol.make("random"), "pseudo-random-generator?", prng2905);
    }
    if_res1793;
    return min2903 + M0.random(max2904 - min2903, prng2905);
  };
  var random2899 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1790 = {
      '0': cl1786,
      '1': cl1787,
      '2': cl1788,
      '3': cl1789
    }[arguments.length];
    if (fixed_lam1790 !== undefined !== false) {
      return fixed_lam1790.apply(null, arguments);
    } else {
      return M0.error("case-lambda: invalid case");
    }
  }, [0, 1, 2, 3]);
  var _random = random2899;
  var core42907 = function(fail12908, fail22909, collection32910, new_rest2911) {
    var collection2912 = collection32910;
    if (fail22909 !== false) {
      var if_res1794 = fail12908;
    } else {
      var if_res1794 = function(s2914) {
        return M0.raise(M0.__rjs_quoted__.kernel_exn_fail_filesystem(M0.string_append("collection-path: ", s2914), M0.current_continuation_marks()));
      };
    }
    var fail2913 = if_res1794;
    var collections2915 = new_rest2911;
    return M1.collection_path(fail2913, collection2912, collections2915);
  };
  var unpack52916 = function(given_kws2917, given_args2918, collection32919, new_rest2920) {
    var fail22921 = M0.pair_p(given_kws2917);
    if (fail22921 !== false) {
      var if_res1795 = M0.car(given_args2918);
    } else {
      var if_res1795 = M0.rvoid();
    }
    var fail12922 = if_res1795;
    return core42907(fail12922, fail22921, collection32919, new_rest2920);
  };
  var cl1799 = $rjs_core.attachProcedureArity(function(given_kws2927, given_args2928, collection2929) {
    var collections2930 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 3));
    return unpack52916(given_kws2927, given_args2928, collection2929, collections2930);
  });
  var temp1802 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1800 = {}[arguments.length];
    if (fixed_lam1800 !== undefined !== false) {
      return fixed_lam1800.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl1799.length, 1) !== false) {
        var if_res1801 = cl1799.apply(null, arguments);
      } else {
        var if_res1801 = M0.error("case-lambda: invalid case");
      }
      return if_res1801;
    }
  }, [M0.make_arity_at_least(3)]);
  var cl1796 = $rjs_core.attachProcedureArity(function(collection2932) {
    var collections2933 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
    return unpack52916(M0.rnull, M0.rnull, collection2932, collections2933);
  });
  var collection_path2931 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1797 = {}[arguments.length];
    if (fixed_lam1797 !== undefined !== false) {
      return fixed_lam1797.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl1796.length, 1) !== false) {
        var if_res1798 = cl1796.apply(null, arguments);
      } else {
        var if_res1798 = M0.error("case-lambda: invalid case");
      }
      return if_res1798;
    }
  }, [M0.make_arity_at_least(1)]);
  var collection_path2906 = M3.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws2923, given_argc2924) {
    if (M0._gt__eq_(given_argc2924, 3) !== false) {
      var l12925 = given_kws2923;
      if (M0.null_p(l12925) !== false) {
        var if_res1804 = l12925;
      } else {
        if (M0.eq_p(M0.car(l12925), $rjs_core.Keyword.make('#:fail')) !== false) {
          var if_res1803 = M0.cdr(l12925);
        } else {
          var if_res1803 = l12925;
        }
        var if_res1804 = if_res1803;
      }
      var l12926 = if_res1804;
      var if_res1805 = M0.null_p(l12926);
    } else {
      var if_res1805 = false;
    }
    return if_res1805;
  }, temp1802, M0.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:fail')), collection_path2931);
  var new_collection_path = collection_path2906;
  var core122935 = function(check_compiled_p62936, check_compiled_p82937, fail72938, fail92939, file_name102940, collection112941, new_rest2942) {
    var file_name2943 = file_name102940;
    var collection2944 = collection112941;
    if (check_compiled_p82937 !== false) {
      var if_res1807 = check_compiled_p62936;
    } else {
      if (M2.path_string_p(file_name2943) !== false) {
        var if_res1806 = M0.__rjs_quoted__.regexp_match_p("/.[.]rkt$/", file_name2943);
      } else {
        var if_res1806 = false;
      }
      var if_res1807 = if_res1806;
    }
    var check_compiled_p2945 = if_res1807;
    if (fail92939 !== false) {
      var if_res1808 = fail72938;
    } else {
      var if_res1808 = function(s2947) {
        return M0.raise(M0.__rjs_quoted__.kernel_exn_fail_filesystem(M0.string_append("collection-file-path: ", s2947), M0.current_continuation_marks()));
      };
    }
    var fail2946 = if_res1808;
    var collections2948 = new_rest2942;
    return M1.collection_file_path(fail2946, check_compiled_p2945, file_name2943, collection2944, collections2948);
  };
  var unpack132949 = function(given_kws2950, given_args2951, file_name102952, collection112953, new_rest2954) {
    if (M0.pair_p(given_kws2950) !== false) {
      var if_res1809 = M0.eq_p($rjs_core.Keyword.make('#:check-compiled?'), M0.car(given_kws2950));
    } else {
      var if_res1809 = false;
    }
    var check_compiled_p82955 = if_res1809;
    if (check_compiled_p82955 !== false) {
      var if_res1810 = M0.car(given_args2951);
    } else {
      var if_res1810 = M0.rvoid();
    }
    var check_compiled_p62956 = if_res1810;
    if (check_compiled_p82955 !== false) {
      var if_res1811 = M0.cdr(given_kws2950);
    } else {
      var if_res1811 = given_kws2950;
    }
    var given_kws2957 = if_res1811;
    if (check_compiled_p82955 !== false) {
      var if_res1812 = M0.cdr(given_args2951);
    } else {
      var if_res1812 = given_args2951;
    }
    var given_args2958 = if_res1812;
    var fail92959 = M0.pair_p(given_kws2957);
    if (fail92959 !== false) {
      var if_res1813 = M0.car(given_args2958);
    } else {
      var if_res1813 = M0.rvoid();
    }
    var fail72960 = if_res1813;
    return core122935(check_compiled_p62956, check_compiled_p82955, fail72960, fail92959, file_name102952, collection112953, new_rest2954);
  };
  var cl1817 = $rjs_core.attachProcedureArity(function(given_kws2967, given_args2968, file_name2969, collection2970) {
    var collections2971 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 4));
    return unpack132949(given_kws2967, given_args2968, file_name2969, collection2970, collections2971);
  });
  var temp1820 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1818 = {}[arguments.length];
    if (fixed_lam1818 !== undefined !== false) {
      return fixed_lam1818.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl1817.length, 1) !== false) {
        var if_res1819 = cl1817.apply(null, arguments);
      } else {
        var if_res1819 = M0.error("case-lambda: invalid case");
      }
      return if_res1819;
    }
  }, [M0.make_arity_at_least(4)]);
  var cl1814 = $rjs_core.attachProcedureArity(function(file_name2973, collection2974) {
    var collections2975 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return unpack132949(M0.rnull, M0.rnull, file_name2973, collection2974, collections2975);
  });
  var collection_file_path2972 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1815 = {}[arguments.length];
    if (fixed_lam1815 !== undefined !== false) {
      return fixed_lam1815.apply(null, arguments);
    } else {
      if (M0._gt__eq_(cl1814.length, 1) !== false) {
        var if_res1816 = cl1814.apply(null, arguments);
      } else {
        var if_res1816 = M0.error("case-lambda: invalid case");
      }
      return if_res1816;
    }
  }, [M0.make_arity_at_least(2)]);
  var collection_file_path2934 = M3.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws2961, given_argc2962) {
    if (M0._gt__eq_(given_argc2962, 4) !== false) {
      var l12963 = given_kws2961;
      if (M0.null_p(l12963) !== false) {
        var if_res1822 = l12963;
      } else {
        if (M0.eq_p(M0.car(l12963), $rjs_core.Keyword.make('#:check-compiled?')) !== false) {
          var if_res1821 = M0.cdr(l12963);
        } else {
          var if_res1821 = l12963;
        }
        var if_res1822 = if_res1821;
      }
      var l12964 = if_res1822;
      var l12965 = l12964;
      if (M0.null_p(l12965) !== false) {
        var if_res1824 = l12965;
      } else {
        if (M0.eq_p(M0.car(l12965), $rjs_core.Keyword.make('#:fail')) !== false) {
          var if_res1823 = M0.cdr(l12965);
        } else {
          var if_res1823 = l12965;
        }
        var if_res1824 = if_res1823;
      }
      var l12966 = if_res1824;
      var if_res1825 = M0.null_p(l12966);
    } else {
      var if_res1825 = false;
    }
    return if_res1825;
  }, temp1820, M0.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:check-compiled?'), $rjs_core.Keyword.make('#:fail')), collection_file_path2972);
  var new_collection_file_path = collection_file_path2934;
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get random() {
      return _random;
    },
    get double_flonum_p() {
      return double_flonum_p;
    },
    get keyword_apply() {
      return new_keyword_apply;
    },
    get collection_file_path() {
      return new_collection_file_path;
    },
    get collection_path() {
      return new_collection_path;
    },
    get new_apply_proc() {
      return new_apply_proc;
    }
  };
})();
var $__collects_47_racket_47_private_47_qq_45_and_45_or_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/qq-and-or.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var qq_append = function(a2871, b2872) {
    if (M0.list_p(a2871) !== false) {
      var if_res1776 = M0.append(a2871, b2872);
    } else {
      var if_res1776 = M0.raise_argument_error($rjs_core.Symbol.make("unquote-splicing"), "list?", a2871);
    }
    return if_res1776;
  };
  var __rjs_quoted__ = {};
  __rjs_quoted__.qq_append = qq_append;
  ;
  return {get __rjs_quoted__() {
      return __rjs_quoted__;
    }};
})();
var $__collects_47_racket_47_private_47_member_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/member.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var bad_list = function(who2842, orig_l2843) {
    return M0.__rjs_quoted__.raise_mismatch_error(who2842, "not a proper list: ", orig_l2843);
  };
  var memq2844 = function(v2845, orig_l2846) {
    var loop2847 = function(ls2848) {
      if (M0.null_p(ls2848) !== false) {
        var if_res1774 = false;
      } else {
        if (M0.not(M0.pair_p(ls2848)) !== false) {
          var if_res1773 = bad_list($rjs_core.Symbol.make("memq"), orig_l2846);
        } else {
          if (M0.eq_p(v2845, M0.car(ls2848)) !== false) {
            var if_res1772 = ls2848;
          } else {
            var if_res1772 = loop2847(M0.cdr(ls2848));
          }
          var if_res1773 = if_res1772;
        }
        var if_res1774 = if_res1773;
      }
      return if_res1774;
    };
    return loop2847(orig_l2846);
  };
  var memv2849 = function(v2850, orig_l2851) {
    var loop2852 = function(ls2853) {
      if (M0.null_p(ls2853) !== false) {
        var if_res1771 = false;
      } else {
        if (M0.not(M0.pair_p(ls2853)) !== false) {
          var if_res1770 = bad_list($rjs_core.Symbol.make("memv"), orig_l2851);
        } else {
          if (M0.eqv_p(v2850, M0.car(ls2853)) !== false) {
            var if_res1769 = ls2853;
          } else {
            var if_res1769 = loop2852(M0.cdr(ls2853));
          }
          var if_res1770 = if_res1769;
        }
        var if_res1771 = if_res1770;
      }
      return if_res1771;
    };
    return loop2852(orig_l2851);
  };
  var member2855 = function(v2856, orig_l2857) {
    var loop2858 = function(ls2859) {
      if (M0.null_p(ls2859) !== false) {
        var if_res1760 = false;
      } else {
        if (M0.not(M0.pair_p(ls2859)) !== false) {
          var if_res1759 = bad_list($rjs_core.Symbol.make("member"), orig_l2857);
        } else {
          if (M0.equal_p(v2856, M0.car(ls2859)) !== false) {
            var if_res1758 = ls2859;
          } else {
            var if_res1758 = loop2858(M0.cdr(ls2859));
          }
          var if_res1759 = if_res1758;
        }
        var if_res1760 = if_res1759;
      }
      return if_res1760;
    };
    return loop2858(orig_l2857);
  };
  var default2854 = member2855;
  var cl1761 = function(v2861, orig_l2862) {
    return default2854(v2861, orig_l2862);
  };
  var cl1762 = function(v2863, orig_l2864, eq_p2865) {
    if (M0.procedure_p(eq_p2865) !== false) {
      var if_res1764 = M0.procedure_arity_includes_p(eq_p2865, 2);
    } else {
      var if_res1764 = false;
    }
    if (if_res1764 !== false) {
      var if_res1765 = M0.rvoid();
    } else {
      var if_res1765 = M0.raise_argument_error($rjs_core.Symbol.make("member"), "(procedure-arity-includes/c 2)", eq_p2865);
    }
    if_res1765;
    var member2866 = function(v2867, orig_l2868) {
      var loop2869 = function(ls2870) {
        if (M0.null_p(ls2870) !== false) {
          var if_res1768 = false;
        } else {
          if (M0.not(M0.pair_p(ls2870)) !== false) {
            var if_res1767 = bad_list($rjs_core.Symbol.make("member"), orig_l2868);
          } else {
            if (eq_p2865(v2867, M0.car(ls2870)) !== false) {
              var if_res1766 = ls2870;
            } else {
              var if_res1766 = loop2869(M0.cdr(ls2870));
            }
            var if_res1767 = if_res1766;
          }
          var if_res1768 = if_res1767;
        }
        return if_res1768;
      };
      return loop2869(orig_l2868);
    };
    return member2866(v2863, orig_l2864);
  };
  var member2860 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1763 = {
      '2': cl1761,
      '3': cl1762
    }[arguments.length];
    if (fixed_lam1763 !== undefined !== false) {
      return fixed_lam1763.apply(null, arguments);
    } else {
      return M0.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var let_result1775 = M0.values(memq2844, memv2849, member2860);
  var memq = let_result1775.getAt(0);
  var memv = let_result1775.getAt(1);
  var member = let_result1775.getAt(2);
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get member() {
      return member;
    },
    get memv() {
      return memv;
    },
    get memq() {
      return memq;
    }
  };
})();
var $__collects_47_racket_47_private_47_sort_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/sort.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var M1 = $__runtime_47_unsafe_46_rkt_46_js__;
  var sorts3323 = M0.make_hasheq();
  var sort_proc3324 = function(A3325, n3326) {
    var n_by_2_3327 = M1.unsafe_fxrshift(n3326, 1);
    var n_by_2_plus_3328 = M1.unsafe_fx_(n3326, n_by_2_3327);
    var copying_mergesort3329 = function(Alo3330, Blo3331, n3332) {
      if (M1.unsafe_fx_eq_(n3332, 1) !== false) {
        var if_res2099 = M1.unsafe_vector_set_bang_(A3325, Blo3331, M1.unsafe_vector_ref(A3325, Alo3330));
      } else {
        if (M1.unsafe_fx_eq_(n3332, 2) !== false) {
          var x3333 = M1.unsafe_vector_ref(A3325, Alo3330);
          var y3334 = M1.unsafe_vector_ref(A3325, M1.unsafe_fx_plus_(Alo3330, 1));
          if (false !== false) {
            var if_res2084 = M1.__rjs_quoted__.unsafe_fl_lt_(false(y3334), false(x3333));
          } else {
            var if_res2084 = M1.__rjs_quoted__.unsafe_fl_lt_(y3334, x3333);
          }
          if (if_res2084 !== false) {
            M1.unsafe_vector_set_bang_(A3325, Blo3331, y3334);
            var if_res2085 = M1.unsafe_vector_set_bang_(A3325, M1.unsafe_fx_plus_(Blo3331, 1), x3333);
          } else {
            M1.unsafe_vector_set_bang_(A3325, Blo3331, x3333);
            var if_res2085 = M1.unsafe_vector_set_bang_(A3325, M1.unsafe_fx_plus_(Blo3331, 1), y3334);
          }
          var if_res2098 = if_res2085;
        } else {
          if (M1.unsafe_fx_lt_(n3332, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3325, Blo3331, M1.unsafe_vector_ref(A3325, Alo3330));
            var iloop3335 = function(i3336) {
              if (M1.unsafe_fx_lt_(i3336, n3332) !== false) {
                var ref_i3337 = M1.unsafe_vector_ref(A3325, M1.unsafe_fx_plus_(Alo3330, i3336));
                var jloop3338 = function(j3339) {
                  var ref_j_13340 = M1.unsafe_vector_ref(A3325, M1.unsafe_fx_(j3339, 1));
                  if (M1.unsafe_fx_lt_(Blo3331, j3339) !== false) {
                    if (false !== false) {
                      var if_res2086 = M1.__rjs_quoted__.unsafe_fl_lt_(false(ref_i3337), false(ref_j_13340));
                    } else {
                      var if_res2086 = M1.__rjs_quoted__.unsafe_fl_lt_(ref_i3337, ref_j_13340);
                    }
                    var if_res2087 = if_res2086;
                  } else {
                    var if_res2087 = false;
                  }
                  if (if_res2087 !== false) {
                    M1.unsafe_vector_set_bang_(A3325, j3339, ref_j_13340);
                    var if_res2088 = jloop3338(M1.unsafe_fx_(j3339, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3325, j3339, ref_i3337);
                    var if_res2088 = iloop3335(M1.unsafe_fx_plus_(i3336, 1));
                  }
                  return if_res2088;
                };
                var if_res2089 = jloop3338(M1.unsafe_fx_plus_(Blo3331, i3336));
              } else {
                var if_res2089 = M0.rvoid();
              }
              return if_res2089;
            };
            var if_res2097 = iloop3335(1);
          } else {
            var n_by_2_3341 = M1.unsafe_fxrshift(n3332, 1);
            var n_by_2_plus_3342 = M1.unsafe_fx_(n3332, n_by_2_3341);
            var Amid13343 = M1.unsafe_fx_plus_(Alo3330, n_by_2_3341);
            var Amid23344 = M1.unsafe_fx_plus_(Alo3330, n_by_2_plus_3342);
            var Bmid13345 = M1.unsafe_fx_plus_(Blo3331, n_by_2_3341);
            copying_mergesort3329(Amid13343, Bmid13345, n_by_2_plus_3342);
            copying_mergesort3329(Alo3330, Amid23344, n_by_2_3341);
            var b23346 = M1.unsafe_fx_plus_(Blo3331, n3332);
            var loop3347 = function(a13348, b13349, c13350) {
              var x3351 = M1.unsafe_vector_ref(A3325, a13348);
              var y3352 = M1.unsafe_vector_ref(A3325, b13349);
              if (true !== false) {
                if (false !== false) {
                  var if_res2090 = M1.__rjs_quoted__.unsafe_fl_lt_(false(y3352), false(x3351));
                } else {
                  var if_res2090 = M1.__rjs_quoted__.unsafe_fl_lt_(y3352, x3351);
                }
                var if_res2092 = M0.not(if_res2090);
              } else {
                if (false !== false) {
                  var if_res2091 = M1.__rjs_quoted__.unsafe_fl_lt_(false(x3351), false(y3352));
                } else {
                  var if_res2091 = M1.__rjs_quoted__.unsafe_fl_lt_(x3351, y3352);
                }
                var if_res2092 = if_res2091;
              }
              if (if_res2092 !== false) {
                M1.unsafe_vector_set_bang_(A3325, c13350, x3351);
                var a13353 = M1.unsafe_fx_plus_(a13348, 1);
                var c13354 = M1.unsafe_fx_plus_(c13350, 1);
                if (M1.unsafe_fx_lt_(c13354, b13349) !== false) {
                  var if_res2093 = loop3347(a13353, b13349, c13354);
                } else {
                  var if_res2093 = M0.rvoid();
                }
                var if_res2096 = if_res2093;
              } else {
                M1.unsafe_vector_set_bang_(A3325, c13350, y3352);
                var b13355 = M1.unsafe_fx_plus_(b13349, 1);
                var c13356 = M1.unsafe_fx_plus_(c13350, 1);
                if (M1.unsafe_fx_lt__eq_(b23346, b13355) !== false) {
                  var loop3357 = function(a13358, c13359) {
                    if (M1.unsafe_fx_lt_(c13359, b13355) !== false) {
                      M1.unsafe_vector_set_bang_(A3325, c13359, M1.unsafe_vector_ref(A3325, a13358));
                      var if_res2094 = loop3357(M1.unsafe_fx_plus_(a13358, 1), M1.unsafe_fx_plus_(c13359, 1));
                    } else {
                      var if_res2094 = M0.rvoid();
                    }
                    return if_res2094;
                  };
                  var if_res2095 = loop3357(a13348, c13356);
                } else {
                  var if_res2095 = loop3347(a13348, b13355, c13356);
                }
                var if_res2096 = if_res2095;
              }
              return if_res2096;
            };
            var if_res2097 = loop3347(Amid23344, Bmid13345, Blo3331);
          }
          var if_res2098 = if_res2097;
        }
        var if_res2099 = if_res2098;
      }
      return if_res2099;
    };
    var Alo3360 = 0;
    var Amid13361 = n_by_2_3327;
    var Amid23362 = n_by_2_plus_3328;
    var Ahi3363 = n3326;
    var B1lo3364 = n3326;
    copying_mergesort3329(Amid13361, B1lo3364, n_by_2_plus_3328);
    if (M0.zero_p(n_by_2_3327) !== false) {
      var if_res2100 = M0.rvoid();
    } else {
      var if_res2100 = copying_mergesort3329(Alo3360, Amid23362, n_by_2_3327);
    }
    if_res2100;
    var b23365 = Ahi3363;
    var loop3366 = function(a13367, b13368, c13369) {
      var x3370 = M1.unsafe_vector_ref(A3325, a13367);
      var y3371 = M1.unsafe_vector_ref(A3325, b13368);
      if (false !== false) {
        if (false !== false) {
          var if_res2101 = M1.__rjs_quoted__.unsafe_fl_lt_(false(y3371), false(x3370));
        } else {
          var if_res2101 = M1.__rjs_quoted__.unsafe_fl_lt_(y3371, x3370);
        }
        var if_res2103 = M0.not(if_res2101);
      } else {
        if (false !== false) {
          var if_res2102 = M1.__rjs_quoted__.unsafe_fl_lt_(false(x3370), false(y3371));
        } else {
          var if_res2102 = M1.__rjs_quoted__.unsafe_fl_lt_(x3370, y3371);
        }
        var if_res2103 = if_res2102;
      }
      if (if_res2103 !== false) {
        M1.unsafe_vector_set_bang_(A3325, c13369, x3370);
        var a13372 = M1.unsafe_fx_plus_(a13367, 1);
        var c13373 = M1.unsafe_fx_plus_(c13369, 1);
        if (M1.unsafe_fx_lt_(c13373, b13368) !== false) {
          var if_res2104 = loop3366(a13372, b13368, c13373);
        } else {
          var if_res2104 = M0.rvoid();
        }
        var if_res2107 = if_res2104;
      } else {
        M1.unsafe_vector_set_bang_(A3325, c13369, y3371);
        var b13374 = M1.unsafe_fx_plus_(b13368, 1);
        var c13375 = M1.unsafe_fx_plus_(c13369, 1);
        if (M1.unsafe_fx_lt__eq_(b23365, b13374) !== false) {
          var loop3376 = function(a13377, c13378) {
            if (M1.unsafe_fx_lt_(c13378, b13374) !== false) {
              M1.unsafe_vector_set_bang_(A3325, c13378, M1.unsafe_vector_ref(A3325, a13377));
              var if_res2105 = loop3376(M1.unsafe_fx_plus_(a13377, 1), M1.unsafe_fx_plus_(c13378, 1));
            } else {
              var if_res2105 = M0.rvoid();
            }
            return if_res2105;
          };
          var if_res2106 = loop3376(a13367, c13375);
        } else {
          var if_res2106 = loop3366(a13367, b13374, c13375);
        }
        var if_res2107 = if_res2106;
      }
      return if_res2107;
    };
    return loop3366(B1lo3364, Amid23362, Alo3360);
  };
  M0.hash_set_bang_(sorts3323, M1.__rjs_quoted__.unsafe_fl_lt_, sort_proc3324);
  M0.hash_set_bang_(sorts3323, M1.__rjs_quoted__.unsafe_fl_lt__eq_, sort_proc3324);
  var sort_proc3379 = function(A3380, n3381) {
    var n_by_2_3382 = M1.unsafe_fxrshift(n3381, 1);
    var n_by_2_plus_3383 = M1.unsafe_fx_(n3381, n_by_2_3382);
    var copying_mergesort3384 = function(Alo3385, Blo3386, n3387) {
      if (M1.unsafe_fx_eq_(n3387, 1) !== false) {
        var if_res2123 = M1.unsafe_vector_set_bang_(A3380, Blo3386, M1.unsafe_vector_ref(A3380, Alo3385));
      } else {
        if (M1.unsafe_fx_eq_(n3387, 2) !== false) {
          var x3388 = M1.unsafe_vector_ref(A3380, Alo3385);
          var y3389 = M1.unsafe_vector_ref(A3380, M1.unsafe_fx_plus_(Alo3385, 1));
          if (false !== false) {
            var if_res2108 = M1.__rjs_quoted__.unsafe_fl_gt_(false(y3389), false(x3388));
          } else {
            var if_res2108 = M1.__rjs_quoted__.unsafe_fl_gt_(y3389, x3388);
          }
          if (if_res2108 !== false) {
            M1.unsafe_vector_set_bang_(A3380, Blo3386, y3389);
            var if_res2109 = M1.unsafe_vector_set_bang_(A3380, M1.unsafe_fx_plus_(Blo3386, 1), x3388);
          } else {
            M1.unsafe_vector_set_bang_(A3380, Blo3386, x3388);
            var if_res2109 = M1.unsafe_vector_set_bang_(A3380, M1.unsafe_fx_plus_(Blo3386, 1), y3389);
          }
          var if_res2122 = if_res2109;
        } else {
          if (M1.unsafe_fx_lt_(n3387, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3380, Blo3386, M1.unsafe_vector_ref(A3380, Alo3385));
            var iloop3390 = function(i3391) {
              if (M1.unsafe_fx_lt_(i3391, n3387) !== false) {
                var ref_i3392 = M1.unsafe_vector_ref(A3380, M1.unsafe_fx_plus_(Alo3385, i3391));
                var jloop3393 = function(j3394) {
                  var ref_j_13395 = M1.unsafe_vector_ref(A3380, M1.unsafe_fx_(j3394, 1));
                  if (M1.unsafe_fx_lt_(Blo3386, j3394) !== false) {
                    if (false !== false) {
                      var if_res2110 = M1.__rjs_quoted__.unsafe_fl_gt_(false(ref_i3392), false(ref_j_13395));
                    } else {
                      var if_res2110 = M1.__rjs_quoted__.unsafe_fl_gt_(ref_i3392, ref_j_13395);
                    }
                    var if_res2111 = if_res2110;
                  } else {
                    var if_res2111 = false;
                  }
                  if (if_res2111 !== false) {
                    M1.unsafe_vector_set_bang_(A3380, j3394, ref_j_13395);
                    var if_res2112 = jloop3393(M1.unsafe_fx_(j3394, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3380, j3394, ref_i3392);
                    var if_res2112 = iloop3390(M1.unsafe_fx_plus_(i3391, 1));
                  }
                  return if_res2112;
                };
                var if_res2113 = jloop3393(M1.unsafe_fx_plus_(Blo3386, i3391));
              } else {
                var if_res2113 = M0.rvoid();
              }
              return if_res2113;
            };
            var if_res2121 = iloop3390(1);
          } else {
            var n_by_2_3396 = M1.unsafe_fxrshift(n3387, 1);
            var n_by_2_plus_3397 = M1.unsafe_fx_(n3387, n_by_2_3396);
            var Amid13398 = M1.unsafe_fx_plus_(Alo3385, n_by_2_3396);
            var Amid23399 = M1.unsafe_fx_plus_(Alo3385, n_by_2_plus_3397);
            var Bmid13400 = M1.unsafe_fx_plus_(Blo3386, n_by_2_3396);
            copying_mergesort3384(Amid13398, Bmid13400, n_by_2_plus_3397);
            copying_mergesort3384(Alo3385, Amid23399, n_by_2_3396);
            var b23401 = M1.unsafe_fx_plus_(Blo3386, n3387);
            var loop3402 = function(a13403, b13404, c13405) {
              var x3406 = M1.unsafe_vector_ref(A3380, a13403);
              var y3407 = M1.unsafe_vector_ref(A3380, b13404);
              if (true !== false) {
                if (false !== false) {
                  var if_res2114 = M1.__rjs_quoted__.unsafe_fl_gt_(false(y3407), false(x3406));
                } else {
                  var if_res2114 = M1.__rjs_quoted__.unsafe_fl_gt_(y3407, x3406);
                }
                var if_res2116 = M0.not(if_res2114);
              } else {
                if (false !== false) {
                  var if_res2115 = M1.__rjs_quoted__.unsafe_fl_gt_(false(x3406), false(y3407));
                } else {
                  var if_res2115 = M1.__rjs_quoted__.unsafe_fl_gt_(x3406, y3407);
                }
                var if_res2116 = if_res2115;
              }
              if (if_res2116 !== false) {
                M1.unsafe_vector_set_bang_(A3380, c13405, x3406);
                var a13408 = M1.unsafe_fx_plus_(a13403, 1);
                var c13409 = M1.unsafe_fx_plus_(c13405, 1);
                if (M1.unsafe_fx_lt_(c13409, b13404) !== false) {
                  var if_res2117 = loop3402(a13408, b13404, c13409);
                } else {
                  var if_res2117 = M0.rvoid();
                }
                var if_res2120 = if_res2117;
              } else {
                M1.unsafe_vector_set_bang_(A3380, c13405, y3407);
                var b13410 = M1.unsafe_fx_plus_(b13404, 1);
                var c13411 = M1.unsafe_fx_plus_(c13405, 1);
                if (M1.unsafe_fx_lt__eq_(b23401, b13410) !== false) {
                  var loop3412 = function(a13413, c13414) {
                    if (M1.unsafe_fx_lt_(c13414, b13410) !== false) {
                      M1.unsafe_vector_set_bang_(A3380, c13414, M1.unsafe_vector_ref(A3380, a13413));
                      var if_res2118 = loop3412(M1.unsafe_fx_plus_(a13413, 1), M1.unsafe_fx_plus_(c13414, 1));
                    } else {
                      var if_res2118 = M0.rvoid();
                    }
                    return if_res2118;
                  };
                  var if_res2119 = loop3412(a13403, c13411);
                } else {
                  var if_res2119 = loop3402(a13403, b13410, c13411);
                }
                var if_res2120 = if_res2119;
              }
              return if_res2120;
            };
            var if_res2121 = loop3402(Amid23399, Bmid13400, Blo3386);
          }
          var if_res2122 = if_res2121;
        }
        var if_res2123 = if_res2122;
      }
      return if_res2123;
    };
    var Alo3415 = 0;
    var Amid13416 = n_by_2_3382;
    var Amid23417 = n_by_2_plus_3383;
    var Ahi3418 = n3381;
    var B1lo3419 = n3381;
    copying_mergesort3384(Amid13416, B1lo3419, n_by_2_plus_3383);
    if (M0.zero_p(n_by_2_3382) !== false) {
      var if_res2124 = M0.rvoid();
    } else {
      var if_res2124 = copying_mergesort3384(Alo3415, Amid23417, n_by_2_3382);
    }
    if_res2124;
    var b23420 = Ahi3418;
    var loop3421 = function(a13422, b13423, c13424) {
      var x3425 = M1.unsafe_vector_ref(A3380, a13422);
      var y3426 = M1.unsafe_vector_ref(A3380, b13423);
      if (false !== false) {
        if (false !== false) {
          var if_res2125 = M1.__rjs_quoted__.unsafe_fl_gt_(false(y3426), false(x3425));
        } else {
          var if_res2125 = M1.__rjs_quoted__.unsafe_fl_gt_(y3426, x3425);
        }
        var if_res2127 = M0.not(if_res2125);
      } else {
        if (false !== false) {
          var if_res2126 = M1.__rjs_quoted__.unsafe_fl_gt_(false(x3425), false(y3426));
        } else {
          var if_res2126 = M1.__rjs_quoted__.unsafe_fl_gt_(x3425, y3426);
        }
        var if_res2127 = if_res2126;
      }
      if (if_res2127 !== false) {
        M1.unsafe_vector_set_bang_(A3380, c13424, x3425);
        var a13427 = M1.unsafe_fx_plus_(a13422, 1);
        var c13428 = M1.unsafe_fx_plus_(c13424, 1);
        if (M1.unsafe_fx_lt_(c13428, b13423) !== false) {
          var if_res2128 = loop3421(a13427, b13423, c13428);
        } else {
          var if_res2128 = M0.rvoid();
        }
        var if_res2131 = if_res2128;
      } else {
        M1.unsafe_vector_set_bang_(A3380, c13424, y3426);
        var b13429 = M1.unsafe_fx_plus_(b13423, 1);
        var c13430 = M1.unsafe_fx_plus_(c13424, 1);
        if (M1.unsafe_fx_lt__eq_(b23420, b13429) !== false) {
          var loop3431 = function(a13432, c13433) {
            if (M1.unsafe_fx_lt_(c13433, b13429) !== false) {
              M1.unsafe_vector_set_bang_(A3380, c13433, M1.unsafe_vector_ref(A3380, a13432));
              var if_res2129 = loop3431(M1.unsafe_fx_plus_(a13432, 1), M1.unsafe_fx_plus_(c13433, 1));
            } else {
              var if_res2129 = M0.rvoid();
            }
            return if_res2129;
          };
          var if_res2130 = loop3431(a13422, c13430);
        } else {
          var if_res2130 = loop3421(a13422, b13429, c13430);
        }
        var if_res2131 = if_res2130;
      }
      return if_res2131;
    };
    return loop3421(B1lo3419, Amid23417, Alo3415);
  };
  M0.hash_set_bang_(sorts3323, M1.__rjs_quoted__.unsafe_fl_gt_, sort_proc3379);
  M0.hash_set_bang_(sorts3323, M1.__rjs_quoted__.unsafe_fl_gt__eq_, sort_proc3379);
  var sort_proc3434 = function(A3435, n3436) {
    var n_by_2_3437 = M1.unsafe_fxrshift(n3436, 1);
    var n_by_2_plus_3438 = M1.unsafe_fx_(n3436, n_by_2_3437);
    var copying_mergesort3439 = function(Alo3440, Blo3441, n3442) {
      if (M1.unsafe_fx_eq_(n3442, 1) !== false) {
        var if_res2147 = M1.unsafe_vector_set_bang_(A3435, Blo3441, M1.unsafe_vector_ref(A3435, Alo3440));
      } else {
        if (M1.unsafe_fx_eq_(n3442, 2) !== false) {
          var x3443 = M1.unsafe_vector_ref(A3435, Alo3440);
          var y3444 = M1.unsafe_vector_ref(A3435, M1.unsafe_fx_plus_(Alo3440, 1));
          if (false !== false) {
            var if_res2132 = M1.unsafe_fx_lt_(false(y3444), false(x3443));
          } else {
            var if_res2132 = M1.unsafe_fx_lt_(y3444, x3443);
          }
          if (if_res2132 !== false) {
            M1.unsafe_vector_set_bang_(A3435, Blo3441, y3444);
            var if_res2133 = M1.unsafe_vector_set_bang_(A3435, M1.unsafe_fx_plus_(Blo3441, 1), x3443);
          } else {
            M1.unsafe_vector_set_bang_(A3435, Blo3441, x3443);
            var if_res2133 = M1.unsafe_vector_set_bang_(A3435, M1.unsafe_fx_plus_(Blo3441, 1), y3444);
          }
          var if_res2146 = if_res2133;
        } else {
          if (M1.unsafe_fx_lt_(n3442, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3435, Blo3441, M1.unsafe_vector_ref(A3435, Alo3440));
            var iloop3445 = function(i3446) {
              if (M1.unsafe_fx_lt_(i3446, n3442) !== false) {
                var ref_i3447 = M1.unsafe_vector_ref(A3435, M1.unsafe_fx_plus_(Alo3440, i3446));
                var jloop3448 = function(j3449) {
                  var ref_j_13450 = M1.unsafe_vector_ref(A3435, M1.unsafe_fx_(j3449, 1));
                  if (M1.unsafe_fx_lt_(Blo3441, j3449) !== false) {
                    if (false !== false) {
                      var if_res2134 = M1.unsafe_fx_lt_(false(ref_i3447), false(ref_j_13450));
                    } else {
                      var if_res2134 = M1.unsafe_fx_lt_(ref_i3447, ref_j_13450);
                    }
                    var if_res2135 = if_res2134;
                  } else {
                    var if_res2135 = false;
                  }
                  if (if_res2135 !== false) {
                    M1.unsafe_vector_set_bang_(A3435, j3449, ref_j_13450);
                    var if_res2136 = jloop3448(M1.unsafe_fx_(j3449, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3435, j3449, ref_i3447);
                    var if_res2136 = iloop3445(M1.unsafe_fx_plus_(i3446, 1));
                  }
                  return if_res2136;
                };
                var if_res2137 = jloop3448(M1.unsafe_fx_plus_(Blo3441, i3446));
              } else {
                var if_res2137 = M0.rvoid();
              }
              return if_res2137;
            };
            var if_res2145 = iloop3445(1);
          } else {
            var n_by_2_3451 = M1.unsafe_fxrshift(n3442, 1);
            var n_by_2_plus_3452 = M1.unsafe_fx_(n3442, n_by_2_3451);
            var Amid13453 = M1.unsafe_fx_plus_(Alo3440, n_by_2_3451);
            var Amid23454 = M1.unsafe_fx_plus_(Alo3440, n_by_2_plus_3452);
            var Bmid13455 = M1.unsafe_fx_plus_(Blo3441, n_by_2_3451);
            copying_mergesort3439(Amid13453, Bmid13455, n_by_2_plus_3452);
            copying_mergesort3439(Alo3440, Amid23454, n_by_2_3451);
            var b23456 = M1.unsafe_fx_plus_(Blo3441, n3442);
            var loop3457 = function(a13458, b13459, c13460) {
              var x3461 = M1.unsafe_vector_ref(A3435, a13458);
              var y3462 = M1.unsafe_vector_ref(A3435, b13459);
              if (true !== false) {
                if (false !== false) {
                  var if_res2138 = M1.unsafe_fx_lt_(false(y3462), false(x3461));
                } else {
                  var if_res2138 = M1.unsafe_fx_lt_(y3462, x3461);
                }
                var if_res2140 = M0.not(if_res2138);
              } else {
                if (false !== false) {
                  var if_res2139 = M1.unsafe_fx_lt_(false(x3461), false(y3462));
                } else {
                  var if_res2139 = M1.unsafe_fx_lt_(x3461, y3462);
                }
                var if_res2140 = if_res2139;
              }
              if (if_res2140 !== false) {
                M1.unsafe_vector_set_bang_(A3435, c13460, x3461);
                var a13463 = M1.unsafe_fx_plus_(a13458, 1);
                var c13464 = M1.unsafe_fx_plus_(c13460, 1);
                if (M1.unsafe_fx_lt_(c13464, b13459) !== false) {
                  var if_res2141 = loop3457(a13463, b13459, c13464);
                } else {
                  var if_res2141 = M0.rvoid();
                }
                var if_res2144 = if_res2141;
              } else {
                M1.unsafe_vector_set_bang_(A3435, c13460, y3462);
                var b13465 = M1.unsafe_fx_plus_(b13459, 1);
                var c13466 = M1.unsafe_fx_plus_(c13460, 1);
                if (M1.unsafe_fx_lt__eq_(b23456, b13465) !== false) {
                  var loop3467 = function(a13468, c13469) {
                    if (M1.unsafe_fx_lt_(c13469, b13465) !== false) {
                      M1.unsafe_vector_set_bang_(A3435, c13469, M1.unsafe_vector_ref(A3435, a13468));
                      var if_res2142 = loop3467(M1.unsafe_fx_plus_(a13468, 1), M1.unsafe_fx_plus_(c13469, 1));
                    } else {
                      var if_res2142 = M0.rvoid();
                    }
                    return if_res2142;
                  };
                  var if_res2143 = loop3467(a13458, c13466);
                } else {
                  var if_res2143 = loop3457(a13458, b13465, c13466);
                }
                var if_res2144 = if_res2143;
              }
              return if_res2144;
            };
            var if_res2145 = loop3457(Amid23454, Bmid13455, Blo3441);
          }
          var if_res2146 = if_res2145;
        }
        var if_res2147 = if_res2146;
      }
      return if_res2147;
    };
    var Alo3470 = 0;
    var Amid13471 = n_by_2_3437;
    var Amid23472 = n_by_2_plus_3438;
    var Ahi3473 = n3436;
    var B1lo3474 = n3436;
    copying_mergesort3439(Amid13471, B1lo3474, n_by_2_plus_3438);
    if (M0.zero_p(n_by_2_3437) !== false) {
      var if_res2148 = M0.rvoid();
    } else {
      var if_res2148 = copying_mergesort3439(Alo3470, Amid23472, n_by_2_3437);
    }
    if_res2148;
    var b23475 = Ahi3473;
    var loop3476 = function(a13477, b13478, c13479) {
      var x3480 = M1.unsafe_vector_ref(A3435, a13477);
      var y3481 = M1.unsafe_vector_ref(A3435, b13478);
      if (false !== false) {
        if (false !== false) {
          var if_res2149 = M1.unsafe_fx_lt_(false(y3481), false(x3480));
        } else {
          var if_res2149 = M1.unsafe_fx_lt_(y3481, x3480);
        }
        var if_res2151 = M0.not(if_res2149);
      } else {
        if (false !== false) {
          var if_res2150 = M1.unsafe_fx_lt_(false(x3480), false(y3481));
        } else {
          var if_res2150 = M1.unsafe_fx_lt_(x3480, y3481);
        }
        var if_res2151 = if_res2150;
      }
      if (if_res2151 !== false) {
        M1.unsafe_vector_set_bang_(A3435, c13479, x3480);
        var a13482 = M1.unsafe_fx_plus_(a13477, 1);
        var c13483 = M1.unsafe_fx_plus_(c13479, 1);
        if (M1.unsafe_fx_lt_(c13483, b13478) !== false) {
          var if_res2152 = loop3476(a13482, b13478, c13483);
        } else {
          var if_res2152 = M0.rvoid();
        }
        var if_res2155 = if_res2152;
      } else {
        M1.unsafe_vector_set_bang_(A3435, c13479, y3481);
        var b13484 = M1.unsafe_fx_plus_(b13478, 1);
        var c13485 = M1.unsafe_fx_plus_(c13479, 1);
        if (M1.unsafe_fx_lt__eq_(b23475, b13484) !== false) {
          var loop3486 = function(a13487, c13488) {
            if (M1.unsafe_fx_lt_(c13488, b13484) !== false) {
              M1.unsafe_vector_set_bang_(A3435, c13488, M1.unsafe_vector_ref(A3435, a13487));
              var if_res2153 = loop3486(M1.unsafe_fx_plus_(a13487, 1), M1.unsafe_fx_plus_(c13488, 1));
            } else {
              var if_res2153 = M0.rvoid();
            }
            return if_res2153;
          };
          var if_res2154 = loop3486(a13477, c13485);
        } else {
          var if_res2154 = loop3476(a13477, b13484, c13485);
        }
        var if_res2155 = if_res2154;
      }
      return if_res2155;
    };
    return loop3476(B1lo3474, Amid23472, Alo3470);
  };
  M0.hash_set_bang_(sorts3323, M1.unsafe_fx_lt_, sort_proc3434);
  M0.hash_set_bang_(sorts3323, M1.unsafe_fx_lt__eq_, sort_proc3434);
  var sort_proc3489 = function(A3490, n3491) {
    var n_by_2_3492 = M1.unsafe_fxrshift(n3491, 1);
    var n_by_2_plus_3493 = M1.unsafe_fx_(n3491, n_by_2_3492);
    var copying_mergesort3494 = function(Alo3495, Blo3496, n3497) {
      if (M1.unsafe_fx_eq_(n3497, 1) !== false) {
        var if_res2171 = M1.unsafe_vector_set_bang_(A3490, Blo3496, M1.unsafe_vector_ref(A3490, Alo3495));
      } else {
        if (M1.unsafe_fx_eq_(n3497, 2) !== false) {
          var x3498 = M1.unsafe_vector_ref(A3490, Alo3495);
          var y3499 = M1.unsafe_vector_ref(A3490, M1.unsafe_fx_plus_(Alo3495, 1));
          if (false !== false) {
            var if_res2156 = M1.unsafe_fx_gt_(false(y3499), false(x3498));
          } else {
            var if_res2156 = M1.unsafe_fx_gt_(y3499, x3498);
          }
          if (if_res2156 !== false) {
            M1.unsafe_vector_set_bang_(A3490, Blo3496, y3499);
            var if_res2157 = M1.unsafe_vector_set_bang_(A3490, M1.unsafe_fx_plus_(Blo3496, 1), x3498);
          } else {
            M1.unsafe_vector_set_bang_(A3490, Blo3496, x3498);
            var if_res2157 = M1.unsafe_vector_set_bang_(A3490, M1.unsafe_fx_plus_(Blo3496, 1), y3499);
          }
          var if_res2170 = if_res2157;
        } else {
          if (M1.unsafe_fx_lt_(n3497, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3490, Blo3496, M1.unsafe_vector_ref(A3490, Alo3495));
            var iloop3500 = function(i3501) {
              if (M1.unsafe_fx_lt_(i3501, n3497) !== false) {
                var ref_i3502 = M1.unsafe_vector_ref(A3490, M1.unsafe_fx_plus_(Alo3495, i3501));
                var jloop3503 = function(j3504) {
                  var ref_j_13505 = M1.unsafe_vector_ref(A3490, M1.unsafe_fx_(j3504, 1));
                  if (M1.unsafe_fx_lt_(Blo3496, j3504) !== false) {
                    if (false !== false) {
                      var if_res2158 = M1.unsafe_fx_gt_(false(ref_i3502), false(ref_j_13505));
                    } else {
                      var if_res2158 = M1.unsafe_fx_gt_(ref_i3502, ref_j_13505);
                    }
                    var if_res2159 = if_res2158;
                  } else {
                    var if_res2159 = false;
                  }
                  if (if_res2159 !== false) {
                    M1.unsafe_vector_set_bang_(A3490, j3504, ref_j_13505);
                    var if_res2160 = jloop3503(M1.unsafe_fx_(j3504, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3490, j3504, ref_i3502);
                    var if_res2160 = iloop3500(M1.unsafe_fx_plus_(i3501, 1));
                  }
                  return if_res2160;
                };
                var if_res2161 = jloop3503(M1.unsafe_fx_plus_(Blo3496, i3501));
              } else {
                var if_res2161 = M0.rvoid();
              }
              return if_res2161;
            };
            var if_res2169 = iloop3500(1);
          } else {
            var n_by_2_3506 = M1.unsafe_fxrshift(n3497, 1);
            var n_by_2_plus_3507 = M1.unsafe_fx_(n3497, n_by_2_3506);
            var Amid13508 = M1.unsafe_fx_plus_(Alo3495, n_by_2_3506);
            var Amid23509 = M1.unsafe_fx_plus_(Alo3495, n_by_2_plus_3507);
            var Bmid13510 = M1.unsafe_fx_plus_(Blo3496, n_by_2_3506);
            copying_mergesort3494(Amid13508, Bmid13510, n_by_2_plus_3507);
            copying_mergesort3494(Alo3495, Amid23509, n_by_2_3506);
            var b23511 = M1.unsafe_fx_plus_(Blo3496, n3497);
            var loop3512 = function(a13513, b13514, c13515) {
              var x3516 = M1.unsafe_vector_ref(A3490, a13513);
              var y3517 = M1.unsafe_vector_ref(A3490, b13514);
              if (true !== false) {
                if (false !== false) {
                  var if_res2162 = M1.unsafe_fx_gt_(false(y3517), false(x3516));
                } else {
                  var if_res2162 = M1.unsafe_fx_gt_(y3517, x3516);
                }
                var if_res2164 = M0.not(if_res2162);
              } else {
                if (false !== false) {
                  var if_res2163 = M1.unsafe_fx_gt_(false(x3516), false(y3517));
                } else {
                  var if_res2163 = M1.unsafe_fx_gt_(x3516, y3517);
                }
                var if_res2164 = if_res2163;
              }
              if (if_res2164 !== false) {
                M1.unsafe_vector_set_bang_(A3490, c13515, x3516);
                var a13518 = M1.unsafe_fx_plus_(a13513, 1);
                var c13519 = M1.unsafe_fx_plus_(c13515, 1);
                if (M1.unsafe_fx_lt_(c13519, b13514) !== false) {
                  var if_res2165 = loop3512(a13518, b13514, c13519);
                } else {
                  var if_res2165 = M0.rvoid();
                }
                var if_res2168 = if_res2165;
              } else {
                M1.unsafe_vector_set_bang_(A3490, c13515, y3517);
                var b13520 = M1.unsafe_fx_plus_(b13514, 1);
                var c13521 = M1.unsafe_fx_plus_(c13515, 1);
                if (M1.unsafe_fx_lt__eq_(b23511, b13520) !== false) {
                  var loop3522 = function(a13523, c13524) {
                    if (M1.unsafe_fx_lt_(c13524, b13520) !== false) {
                      M1.unsafe_vector_set_bang_(A3490, c13524, M1.unsafe_vector_ref(A3490, a13523));
                      var if_res2166 = loop3522(M1.unsafe_fx_plus_(a13523, 1), M1.unsafe_fx_plus_(c13524, 1));
                    } else {
                      var if_res2166 = M0.rvoid();
                    }
                    return if_res2166;
                  };
                  var if_res2167 = loop3522(a13513, c13521);
                } else {
                  var if_res2167 = loop3512(a13513, b13520, c13521);
                }
                var if_res2168 = if_res2167;
              }
              return if_res2168;
            };
            var if_res2169 = loop3512(Amid23509, Bmid13510, Blo3496);
          }
          var if_res2170 = if_res2169;
        }
        var if_res2171 = if_res2170;
      }
      return if_res2171;
    };
    var Alo3525 = 0;
    var Amid13526 = n_by_2_3492;
    var Amid23527 = n_by_2_plus_3493;
    var Ahi3528 = n3491;
    var B1lo3529 = n3491;
    copying_mergesort3494(Amid13526, B1lo3529, n_by_2_plus_3493);
    if (M0.zero_p(n_by_2_3492) !== false) {
      var if_res2172 = M0.rvoid();
    } else {
      var if_res2172 = copying_mergesort3494(Alo3525, Amid23527, n_by_2_3492);
    }
    if_res2172;
    var b23530 = Ahi3528;
    var loop3531 = function(a13532, b13533, c13534) {
      var x3535 = M1.unsafe_vector_ref(A3490, a13532);
      var y3536 = M1.unsafe_vector_ref(A3490, b13533);
      if (false !== false) {
        if (false !== false) {
          var if_res2173 = M1.unsafe_fx_gt_(false(y3536), false(x3535));
        } else {
          var if_res2173 = M1.unsafe_fx_gt_(y3536, x3535);
        }
        var if_res2175 = M0.not(if_res2173);
      } else {
        if (false !== false) {
          var if_res2174 = M1.unsafe_fx_gt_(false(x3535), false(y3536));
        } else {
          var if_res2174 = M1.unsafe_fx_gt_(x3535, y3536);
        }
        var if_res2175 = if_res2174;
      }
      if (if_res2175 !== false) {
        M1.unsafe_vector_set_bang_(A3490, c13534, x3535);
        var a13537 = M1.unsafe_fx_plus_(a13532, 1);
        var c13538 = M1.unsafe_fx_plus_(c13534, 1);
        if (M1.unsafe_fx_lt_(c13538, b13533) !== false) {
          var if_res2176 = loop3531(a13537, b13533, c13538);
        } else {
          var if_res2176 = M0.rvoid();
        }
        var if_res2179 = if_res2176;
      } else {
        M1.unsafe_vector_set_bang_(A3490, c13534, y3536);
        var b13539 = M1.unsafe_fx_plus_(b13533, 1);
        var c13540 = M1.unsafe_fx_plus_(c13534, 1);
        if (M1.unsafe_fx_lt__eq_(b23530, b13539) !== false) {
          var loop3541 = function(a13542, c13543) {
            if (M1.unsafe_fx_lt_(c13543, b13539) !== false) {
              M1.unsafe_vector_set_bang_(A3490, c13543, M1.unsafe_vector_ref(A3490, a13542));
              var if_res2177 = loop3541(M1.unsafe_fx_plus_(a13542, 1), M1.unsafe_fx_plus_(c13543, 1));
            } else {
              var if_res2177 = M0.rvoid();
            }
            return if_res2177;
          };
          var if_res2178 = loop3541(a13532, c13540);
        } else {
          var if_res2178 = loop3531(a13532, b13539, c13540);
        }
        var if_res2179 = if_res2178;
      }
      return if_res2179;
    };
    return loop3531(B1lo3529, Amid23527, Alo3525);
  };
  M0.hash_set_bang_(sorts3323, M1.unsafe_fx_gt_, sort_proc3489);
  M0.hash_set_bang_(sorts3323, M1.unsafe_fx_gt__eq_, sort_proc3489);
  var sort_proc3544 = function(A3545, n3546) {
    var n_by_2_3547 = M1.unsafe_fxrshift(n3546, 1);
    var n_by_2_plus_3548 = M1.unsafe_fx_(n3546, n_by_2_3547);
    var copying_mergesort3549 = function(Alo3550, Blo3551, n3552) {
      if (M1.unsafe_fx_eq_(n3552, 1) !== false) {
        var if_res2195 = M1.unsafe_vector_set_bang_(A3545, Blo3551, M1.unsafe_vector_ref(A3545, Alo3550));
      } else {
        if (M1.unsafe_fx_eq_(n3552, 2) !== false) {
          var x3553 = M1.unsafe_vector_ref(A3545, Alo3550);
          var y3554 = M1.unsafe_vector_ref(A3545, M1.unsafe_fx_plus_(Alo3550, 1));
          if (false !== false) {
            var if_res2180 = M0._lt_(false(y3554), false(x3553));
          } else {
            var if_res2180 = M0._lt_(y3554, x3553);
          }
          if (if_res2180 !== false) {
            M1.unsafe_vector_set_bang_(A3545, Blo3551, y3554);
            var if_res2181 = M1.unsafe_vector_set_bang_(A3545, M1.unsafe_fx_plus_(Blo3551, 1), x3553);
          } else {
            M1.unsafe_vector_set_bang_(A3545, Blo3551, x3553);
            var if_res2181 = M1.unsafe_vector_set_bang_(A3545, M1.unsafe_fx_plus_(Blo3551, 1), y3554);
          }
          var if_res2194 = if_res2181;
        } else {
          if (M1.unsafe_fx_lt_(n3552, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3545, Blo3551, M1.unsafe_vector_ref(A3545, Alo3550));
            var iloop3555 = function(i3556) {
              if (M1.unsafe_fx_lt_(i3556, n3552) !== false) {
                var ref_i3557 = M1.unsafe_vector_ref(A3545, M1.unsafe_fx_plus_(Alo3550, i3556));
                var jloop3558 = function(j3559) {
                  var ref_j_13560 = M1.unsafe_vector_ref(A3545, M1.unsafe_fx_(j3559, 1));
                  if (M1.unsafe_fx_lt_(Blo3551, j3559) !== false) {
                    if (false !== false) {
                      var if_res2182 = M0._lt_(false(ref_i3557), false(ref_j_13560));
                    } else {
                      var if_res2182 = M0._lt_(ref_i3557, ref_j_13560);
                    }
                    var if_res2183 = if_res2182;
                  } else {
                    var if_res2183 = false;
                  }
                  if (if_res2183 !== false) {
                    M1.unsafe_vector_set_bang_(A3545, j3559, ref_j_13560);
                    var if_res2184 = jloop3558(M1.unsafe_fx_(j3559, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3545, j3559, ref_i3557);
                    var if_res2184 = iloop3555(M1.unsafe_fx_plus_(i3556, 1));
                  }
                  return if_res2184;
                };
                var if_res2185 = jloop3558(M1.unsafe_fx_plus_(Blo3551, i3556));
              } else {
                var if_res2185 = M0.rvoid();
              }
              return if_res2185;
            };
            var if_res2193 = iloop3555(1);
          } else {
            var n_by_2_3561 = M1.unsafe_fxrshift(n3552, 1);
            var n_by_2_plus_3562 = M1.unsafe_fx_(n3552, n_by_2_3561);
            var Amid13563 = M1.unsafe_fx_plus_(Alo3550, n_by_2_3561);
            var Amid23564 = M1.unsafe_fx_plus_(Alo3550, n_by_2_plus_3562);
            var Bmid13565 = M1.unsafe_fx_plus_(Blo3551, n_by_2_3561);
            copying_mergesort3549(Amid13563, Bmid13565, n_by_2_plus_3562);
            copying_mergesort3549(Alo3550, Amid23564, n_by_2_3561);
            var b23566 = M1.unsafe_fx_plus_(Blo3551, n3552);
            var loop3567 = function(a13568, b13569, c13570) {
              var x3571 = M1.unsafe_vector_ref(A3545, a13568);
              var y3572 = M1.unsafe_vector_ref(A3545, b13569);
              if (true !== false) {
                if (false !== false) {
                  var if_res2186 = M0._lt_(false(y3572), false(x3571));
                } else {
                  var if_res2186 = M0._lt_(y3572, x3571);
                }
                var if_res2188 = M0.not(if_res2186);
              } else {
                if (false !== false) {
                  var if_res2187 = M0._lt_(false(x3571), false(y3572));
                } else {
                  var if_res2187 = M0._lt_(x3571, y3572);
                }
                var if_res2188 = if_res2187;
              }
              if (if_res2188 !== false) {
                M1.unsafe_vector_set_bang_(A3545, c13570, x3571);
                var a13573 = M1.unsafe_fx_plus_(a13568, 1);
                var c13574 = M1.unsafe_fx_plus_(c13570, 1);
                if (M1.unsafe_fx_lt_(c13574, b13569) !== false) {
                  var if_res2189 = loop3567(a13573, b13569, c13574);
                } else {
                  var if_res2189 = M0.rvoid();
                }
                var if_res2192 = if_res2189;
              } else {
                M1.unsafe_vector_set_bang_(A3545, c13570, y3572);
                var b13575 = M1.unsafe_fx_plus_(b13569, 1);
                var c13576 = M1.unsafe_fx_plus_(c13570, 1);
                if (M1.unsafe_fx_lt__eq_(b23566, b13575) !== false) {
                  var loop3577 = function(a13578, c13579) {
                    if (M1.unsafe_fx_lt_(c13579, b13575) !== false) {
                      M1.unsafe_vector_set_bang_(A3545, c13579, M1.unsafe_vector_ref(A3545, a13578));
                      var if_res2190 = loop3577(M1.unsafe_fx_plus_(a13578, 1), M1.unsafe_fx_plus_(c13579, 1));
                    } else {
                      var if_res2190 = M0.rvoid();
                    }
                    return if_res2190;
                  };
                  var if_res2191 = loop3577(a13568, c13576);
                } else {
                  var if_res2191 = loop3567(a13568, b13575, c13576);
                }
                var if_res2192 = if_res2191;
              }
              return if_res2192;
            };
            var if_res2193 = loop3567(Amid23564, Bmid13565, Blo3551);
          }
          var if_res2194 = if_res2193;
        }
        var if_res2195 = if_res2194;
      }
      return if_res2195;
    };
    var Alo3580 = 0;
    var Amid13581 = n_by_2_3547;
    var Amid23582 = n_by_2_plus_3548;
    var Ahi3583 = n3546;
    var B1lo3584 = n3546;
    copying_mergesort3549(Amid13581, B1lo3584, n_by_2_plus_3548);
    if (M0.zero_p(n_by_2_3547) !== false) {
      var if_res2196 = M0.rvoid();
    } else {
      var if_res2196 = copying_mergesort3549(Alo3580, Amid23582, n_by_2_3547);
    }
    if_res2196;
    var b23585 = Ahi3583;
    var loop3586 = function(a13587, b13588, c13589) {
      var x3590 = M1.unsafe_vector_ref(A3545, a13587);
      var y3591 = M1.unsafe_vector_ref(A3545, b13588);
      if (false !== false) {
        if (false !== false) {
          var if_res2197 = M0._lt_(false(y3591), false(x3590));
        } else {
          var if_res2197 = M0._lt_(y3591, x3590);
        }
        var if_res2199 = M0.not(if_res2197);
      } else {
        if (false !== false) {
          var if_res2198 = M0._lt_(false(x3590), false(y3591));
        } else {
          var if_res2198 = M0._lt_(x3590, y3591);
        }
        var if_res2199 = if_res2198;
      }
      if (if_res2199 !== false) {
        M1.unsafe_vector_set_bang_(A3545, c13589, x3590);
        var a13592 = M1.unsafe_fx_plus_(a13587, 1);
        var c13593 = M1.unsafe_fx_plus_(c13589, 1);
        if (M1.unsafe_fx_lt_(c13593, b13588) !== false) {
          var if_res2200 = loop3586(a13592, b13588, c13593);
        } else {
          var if_res2200 = M0.rvoid();
        }
        var if_res2203 = if_res2200;
      } else {
        M1.unsafe_vector_set_bang_(A3545, c13589, y3591);
        var b13594 = M1.unsafe_fx_plus_(b13588, 1);
        var c13595 = M1.unsafe_fx_plus_(c13589, 1);
        if (M1.unsafe_fx_lt__eq_(b23585, b13594) !== false) {
          var loop3596 = function(a13597, c13598) {
            if (M1.unsafe_fx_lt_(c13598, b13594) !== false) {
              M1.unsafe_vector_set_bang_(A3545, c13598, M1.unsafe_vector_ref(A3545, a13597));
              var if_res2201 = loop3596(M1.unsafe_fx_plus_(a13597, 1), M1.unsafe_fx_plus_(c13598, 1));
            } else {
              var if_res2201 = M0.rvoid();
            }
            return if_res2201;
          };
          var if_res2202 = loop3596(a13587, c13595);
        } else {
          var if_res2202 = loop3586(a13587, b13594, c13595);
        }
        var if_res2203 = if_res2202;
      }
      return if_res2203;
    };
    return loop3586(B1lo3584, Amid23582, Alo3580);
  };
  M0.hash_set_bang_(sorts3323, M0._lt_, sort_proc3544);
  M0.hash_set_bang_(sorts3323, M0._lt__eq_, sort_proc3544);
  var sort_proc3599 = function(A3600, n3601) {
    var n_by_2_3602 = M1.unsafe_fxrshift(n3601, 1);
    var n_by_2_plus_3603 = M1.unsafe_fx_(n3601, n_by_2_3602);
    var copying_mergesort3604 = function(Alo3605, Blo3606, n3607) {
      if (M1.unsafe_fx_eq_(n3607, 1) !== false) {
        var if_res2219 = M1.unsafe_vector_set_bang_(A3600, Blo3606, M1.unsafe_vector_ref(A3600, Alo3605));
      } else {
        if (M1.unsafe_fx_eq_(n3607, 2) !== false) {
          var x3608 = M1.unsafe_vector_ref(A3600, Alo3605);
          var y3609 = M1.unsafe_vector_ref(A3600, M1.unsafe_fx_plus_(Alo3605, 1));
          if (false !== false) {
            var if_res2204 = M0._gt_(false(y3609), false(x3608));
          } else {
            var if_res2204 = M0._gt_(y3609, x3608);
          }
          if (if_res2204 !== false) {
            M1.unsafe_vector_set_bang_(A3600, Blo3606, y3609);
            var if_res2205 = M1.unsafe_vector_set_bang_(A3600, M1.unsafe_fx_plus_(Blo3606, 1), x3608);
          } else {
            M1.unsafe_vector_set_bang_(A3600, Blo3606, x3608);
            var if_res2205 = M1.unsafe_vector_set_bang_(A3600, M1.unsafe_fx_plus_(Blo3606, 1), y3609);
          }
          var if_res2218 = if_res2205;
        } else {
          if (M1.unsafe_fx_lt_(n3607, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3600, Blo3606, M1.unsafe_vector_ref(A3600, Alo3605));
            var iloop3610 = function(i3611) {
              if (M1.unsafe_fx_lt_(i3611, n3607) !== false) {
                var ref_i3612 = M1.unsafe_vector_ref(A3600, M1.unsafe_fx_plus_(Alo3605, i3611));
                var jloop3613 = function(j3614) {
                  var ref_j_13615 = M1.unsafe_vector_ref(A3600, M1.unsafe_fx_(j3614, 1));
                  if (M1.unsafe_fx_lt_(Blo3606, j3614) !== false) {
                    if (false !== false) {
                      var if_res2206 = M0._gt_(false(ref_i3612), false(ref_j_13615));
                    } else {
                      var if_res2206 = M0._gt_(ref_i3612, ref_j_13615);
                    }
                    var if_res2207 = if_res2206;
                  } else {
                    var if_res2207 = false;
                  }
                  if (if_res2207 !== false) {
                    M1.unsafe_vector_set_bang_(A3600, j3614, ref_j_13615);
                    var if_res2208 = jloop3613(M1.unsafe_fx_(j3614, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3600, j3614, ref_i3612);
                    var if_res2208 = iloop3610(M1.unsafe_fx_plus_(i3611, 1));
                  }
                  return if_res2208;
                };
                var if_res2209 = jloop3613(M1.unsafe_fx_plus_(Blo3606, i3611));
              } else {
                var if_res2209 = M0.rvoid();
              }
              return if_res2209;
            };
            var if_res2217 = iloop3610(1);
          } else {
            var n_by_2_3616 = M1.unsafe_fxrshift(n3607, 1);
            var n_by_2_plus_3617 = M1.unsafe_fx_(n3607, n_by_2_3616);
            var Amid13618 = M1.unsafe_fx_plus_(Alo3605, n_by_2_3616);
            var Amid23619 = M1.unsafe_fx_plus_(Alo3605, n_by_2_plus_3617);
            var Bmid13620 = M1.unsafe_fx_plus_(Blo3606, n_by_2_3616);
            copying_mergesort3604(Amid13618, Bmid13620, n_by_2_plus_3617);
            copying_mergesort3604(Alo3605, Amid23619, n_by_2_3616);
            var b23621 = M1.unsafe_fx_plus_(Blo3606, n3607);
            var loop3622 = function(a13623, b13624, c13625) {
              var x3626 = M1.unsafe_vector_ref(A3600, a13623);
              var y3627 = M1.unsafe_vector_ref(A3600, b13624);
              if (true !== false) {
                if (false !== false) {
                  var if_res2210 = M0._gt_(false(y3627), false(x3626));
                } else {
                  var if_res2210 = M0._gt_(y3627, x3626);
                }
                var if_res2212 = M0.not(if_res2210);
              } else {
                if (false !== false) {
                  var if_res2211 = M0._gt_(false(x3626), false(y3627));
                } else {
                  var if_res2211 = M0._gt_(x3626, y3627);
                }
                var if_res2212 = if_res2211;
              }
              if (if_res2212 !== false) {
                M1.unsafe_vector_set_bang_(A3600, c13625, x3626);
                var a13628 = M1.unsafe_fx_plus_(a13623, 1);
                var c13629 = M1.unsafe_fx_plus_(c13625, 1);
                if (M1.unsafe_fx_lt_(c13629, b13624) !== false) {
                  var if_res2213 = loop3622(a13628, b13624, c13629);
                } else {
                  var if_res2213 = M0.rvoid();
                }
                var if_res2216 = if_res2213;
              } else {
                M1.unsafe_vector_set_bang_(A3600, c13625, y3627);
                var b13630 = M1.unsafe_fx_plus_(b13624, 1);
                var c13631 = M1.unsafe_fx_plus_(c13625, 1);
                if (M1.unsafe_fx_lt__eq_(b23621, b13630) !== false) {
                  var loop3632 = function(a13633, c13634) {
                    if (M1.unsafe_fx_lt_(c13634, b13630) !== false) {
                      M1.unsafe_vector_set_bang_(A3600, c13634, M1.unsafe_vector_ref(A3600, a13633));
                      var if_res2214 = loop3632(M1.unsafe_fx_plus_(a13633, 1), M1.unsafe_fx_plus_(c13634, 1));
                    } else {
                      var if_res2214 = M0.rvoid();
                    }
                    return if_res2214;
                  };
                  var if_res2215 = loop3632(a13623, c13631);
                } else {
                  var if_res2215 = loop3622(a13623, b13630, c13631);
                }
                var if_res2216 = if_res2215;
              }
              return if_res2216;
            };
            var if_res2217 = loop3622(Amid23619, Bmid13620, Blo3606);
          }
          var if_res2218 = if_res2217;
        }
        var if_res2219 = if_res2218;
      }
      return if_res2219;
    };
    var Alo3635 = 0;
    var Amid13636 = n_by_2_3602;
    var Amid23637 = n_by_2_plus_3603;
    var Ahi3638 = n3601;
    var B1lo3639 = n3601;
    copying_mergesort3604(Amid13636, B1lo3639, n_by_2_plus_3603);
    if (M0.zero_p(n_by_2_3602) !== false) {
      var if_res2220 = M0.rvoid();
    } else {
      var if_res2220 = copying_mergesort3604(Alo3635, Amid23637, n_by_2_3602);
    }
    if_res2220;
    var b23640 = Ahi3638;
    var loop3641 = function(a13642, b13643, c13644) {
      var x3645 = M1.unsafe_vector_ref(A3600, a13642);
      var y3646 = M1.unsafe_vector_ref(A3600, b13643);
      if (false !== false) {
        if (false !== false) {
          var if_res2221 = M0._gt_(false(y3646), false(x3645));
        } else {
          var if_res2221 = M0._gt_(y3646, x3645);
        }
        var if_res2223 = M0.not(if_res2221);
      } else {
        if (false !== false) {
          var if_res2222 = M0._gt_(false(x3645), false(y3646));
        } else {
          var if_res2222 = M0._gt_(x3645, y3646);
        }
        var if_res2223 = if_res2222;
      }
      if (if_res2223 !== false) {
        M1.unsafe_vector_set_bang_(A3600, c13644, x3645);
        var a13647 = M1.unsafe_fx_plus_(a13642, 1);
        var c13648 = M1.unsafe_fx_plus_(c13644, 1);
        if (M1.unsafe_fx_lt_(c13648, b13643) !== false) {
          var if_res2224 = loop3641(a13647, b13643, c13648);
        } else {
          var if_res2224 = M0.rvoid();
        }
        var if_res2227 = if_res2224;
      } else {
        M1.unsafe_vector_set_bang_(A3600, c13644, y3646);
        var b13649 = M1.unsafe_fx_plus_(b13643, 1);
        var c13650 = M1.unsafe_fx_plus_(c13644, 1);
        if (M1.unsafe_fx_lt__eq_(b23640, b13649) !== false) {
          var loop3651 = function(a13652, c13653) {
            if (M1.unsafe_fx_lt_(c13653, b13649) !== false) {
              M1.unsafe_vector_set_bang_(A3600, c13653, M1.unsafe_vector_ref(A3600, a13652));
              var if_res2225 = loop3651(M1.unsafe_fx_plus_(a13652, 1), M1.unsafe_fx_plus_(c13653, 1));
            } else {
              var if_res2225 = M0.rvoid();
            }
            return if_res2225;
          };
          var if_res2226 = loop3651(a13642, c13650);
        } else {
          var if_res2226 = loop3641(a13642, b13649, c13650);
        }
        var if_res2227 = if_res2226;
      }
      return if_res2227;
    };
    return loop3641(B1lo3639, Amid23637, Alo3635);
  };
  M0.hash_set_bang_(sorts3323, M0._gt_, sort_proc3599);
  M0.hash_set_bang_(sorts3323, M0._gt__eq_, sort_proc3599);
  var sort_proc3654 = function(A3655, n3656) {
    var n_by_2_3657 = M1.unsafe_fxrshift(n3656, 1);
    var n_by_2_plus_3658 = M1.unsafe_fx_(n3656, n_by_2_3657);
    var copying_mergesort3659 = function(Alo3660, Blo3661, n3662) {
      if (M1.unsafe_fx_eq_(n3662, 1) !== false) {
        var if_res2243 = M1.unsafe_vector_set_bang_(A3655, Blo3661, M1.unsafe_vector_ref(A3655, Alo3660));
      } else {
        if (M1.unsafe_fx_eq_(n3662, 2) !== false) {
          var x3663 = M1.unsafe_vector_ref(A3655, Alo3660);
          var y3664 = M1.unsafe_vector_ref(A3655, M1.unsafe_fx_plus_(Alo3660, 1));
          if (false !== false) {
            var if_res2228 = M0.string_lt__p(false(y3664), false(x3663));
          } else {
            var if_res2228 = M0.string_lt__p(y3664, x3663);
          }
          if (if_res2228 !== false) {
            M1.unsafe_vector_set_bang_(A3655, Blo3661, y3664);
            var if_res2229 = M1.unsafe_vector_set_bang_(A3655, M1.unsafe_fx_plus_(Blo3661, 1), x3663);
          } else {
            M1.unsafe_vector_set_bang_(A3655, Blo3661, x3663);
            var if_res2229 = M1.unsafe_vector_set_bang_(A3655, M1.unsafe_fx_plus_(Blo3661, 1), y3664);
          }
          var if_res2242 = if_res2229;
        } else {
          if (M1.unsafe_fx_lt_(n3662, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3655, Blo3661, M1.unsafe_vector_ref(A3655, Alo3660));
            var iloop3665 = function(i3666) {
              if (M1.unsafe_fx_lt_(i3666, n3662) !== false) {
                var ref_i3667 = M1.unsafe_vector_ref(A3655, M1.unsafe_fx_plus_(Alo3660, i3666));
                var jloop3668 = function(j3669) {
                  var ref_j_13670 = M1.unsafe_vector_ref(A3655, M1.unsafe_fx_(j3669, 1));
                  if (M1.unsafe_fx_lt_(Blo3661, j3669) !== false) {
                    if (false !== false) {
                      var if_res2230 = M0.string_lt__p(false(ref_i3667), false(ref_j_13670));
                    } else {
                      var if_res2230 = M0.string_lt__p(ref_i3667, ref_j_13670);
                    }
                    var if_res2231 = if_res2230;
                  } else {
                    var if_res2231 = false;
                  }
                  if (if_res2231 !== false) {
                    M1.unsafe_vector_set_bang_(A3655, j3669, ref_j_13670);
                    var if_res2232 = jloop3668(M1.unsafe_fx_(j3669, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3655, j3669, ref_i3667);
                    var if_res2232 = iloop3665(M1.unsafe_fx_plus_(i3666, 1));
                  }
                  return if_res2232;
                };
                var if_res2233 = jloop3668(M1.unsafe_fx_plus_(Blo3661, i3666));
              } else {
                var if_res2233 = M0.rvoid();
              }
              return if_res2233;
            };
            var if_res2241 = iloop3665(1);
          } else {
            var n_by_2_3671 = M1.unsafe_fxrshift(n3662, 1);
            var n_by_2_plus_3672 = M1.unsafe_fx_(n3662, n_by_2_3671);
            var Amid13673 = M1.unsafe_fx_plus_(Alo3660, n_by_2_3671);
            var Amid23674 = M1.unsafe_fx_plus_(Alo3660, n_by_2_plus_3672);
            var Bmid13675 = M1.unsafe_fx_plus_(Blo3661, n_by_2_3671);
            copying_mergesort3659(Amid13673, Bmid13675, n_by_2_plus_3672);
            copying_mergesort3659(Alo3660, Amid23674, n_by_2_3671);
            var b23676 = M1.unsafe_fx_plus_(Blo3661, n3662);
            var loop3677 = function(a13678, b13679, c13680) {
              var x3681 = M1.unsafe_vector_ref(A3655, a13678);
              var y3682 = M1.unsafe_vector_ref(A3655, b13679);
              if (true !== false) {
                if (false !== false) {
                  var if_res2234 = M0.string_lt__p(false(y3682), false(x3681));
                } else {
                  var if_res2234 = M0.string_lt__p(y3682, x3681);
                }
                var if_res2236 = M0.not(if_res2234);
              } else {
                if (false !== false) {
                  var if_res2235 = M0.string_lt__p(false(x3681), false(y3682));
                } else {
                  var if_res2235 = M0.string_lt__p(x3681, y3682);
                }
                var if_res2236 = if_res2235;
              }
              if (if_res2236 !== false) {
                M1.unsafe_vector_set_bang_(A3655, c13680, x3681);
                var a13683 = M1.unsafe_fx_plus_(a13678, 1);
                var c13684 = M1.unsafe_fx_plus_(c13680, 1);
                if (M1.unsafe_fx_lt_(c13684, b13679) !== false) {
                  var if_res2237 = loop3677(a13683, b13679, c13684);
                } else {
                  var if_res2237 = M0.rvoid();
                }
                var if_res2240 = if_res2237;
              } else {
                M1.unsafe_vector_set_bang_(A3655, c13680, y3682);
                var b13685 = M1.unsafe_fx_plus_(b13679, 1);
                var c13686 = M1.unsafe_fx_plus_(c13680, 1);
                if (M1.unsafe_fx_lt__eq_(b23676, b13685) !== false) {
                  var loop3687 = function(a13688, c13689) {
                    if (M1.unsafe_fx_lt_(c13689, b13685) !== false) {
                      M1.unsafe_vector_set_bang_(A3655, c13689, M1.unsafe_vector_ref(A3655, a13688));
                      var if_res2238 = loop3687(M1.unsafe_fx_plus_(a13688, 1), M1.unsafe_fx_plus_(c13689, 1));
                    } else {
                      var if_res2238 = M0.rvoid();
                    }
                    return if_res2238;
                  };
                  var if_res2239 = loop3687(a13678, c13686);
                } else {
                  var if_res2239 = loop3677(a13678, b13685, c13686);
                }
                var if_res2240 = if_res2239;
              }
              return if_res2240;
            };
            var if_res2241 = loop3677(Amid23674, Bmid13675, Blo3661);
          }
          var if_res2242 = if_res2241;
        }
        var if_res2243 = if_res2242;
      }
      return if_res2243;
    };
    var Alo3690 = 0;
    var Amid13691 = n_by_2_3657;
    var Amid23692 = n_by_2_plus_3658;
    var Ahi3693 = n3656;
    var B1lo3694 = n3656;
    copying_mergesort3659(Amid13691, B1lo3694, n_by_2_plus_3658);
    if (M0.zero_p(n_by_2_3657) !== false) {
      var if_res2244 = M0.rvoid();
    } else {
      var if_res2244 = copying_mergesort3659(Alo3690, Amid23692, n_by_2_3657);
    }
    if_res2244;
    var b23695 = Ahi3693;
    var loop3696 = function(a13697, b13698, c13699) {
      var x3700 = M1.unsafe_vector_ref(A3655, a13697);
      var y3701 = M1.unsafe_vector_ref(A3655, b13698);
      if (false !== false) {
        if (false !== false) {
          var if_res2245 = M0.string_lt__p(false(y3701), false(x3700));
        } else {
          var if_res2245 = M0.string_lt__p(y3701, x3700);
        }
        var if_res2247 = M0.not(if_res2245);
      } else {
        if (false !== false) {
          var if_res2246 = M0.string_lt__p(false(x3700), false(y3701));
        } else {
          var if_res2246 = M0.string_lt__p(x3700, y3701);
        }
        var if_res2247 = if_res2246;
      }
      if (if_res2247 !== false) {
        M1.unsafe_vector_set_bang_(A3655, c13699, x3700);
        var a13702 = M1.unsafe_fx_plus_(a13697, 1);
        var c13703 = M1.unsafe_fx_plus_(c13699, 1);
        if (M1.unsafe_fx_lt_(c13703, b13698) !== false) {
          var if_res2248 = loop3696(a13702, b13698, c13703);
        } else {
          var if_res2248 = M0.rvoid();
        }
        var if_res2251 = if_res2248;
      } else {
        M1.unsafe_vector_set_bang_(A3655, c13699, y3701);
        var b13704 = M1.unsafe_fx_plus_(b13698, 1);
        var c13705 = M1.unsafe_fx_plus_(c13699, 1);
        if (M1.unsafe_fx_lt__eq_(b23695, b13704) !== false) {
          var loop3706 = function(a13707, c13708) {
            if (M1.unsafe_fx_lt_(c13708, b13704) !== false) {
              M1.unsafe_vector_set_bang_(A3655, c13708, M1.unsafe_vector_ref(A3655, a13707));
              var if_res2249 = loop3706(M1.unsafe_fx_plus_(a13707, 1), M1.unsafe_fx_plus_(c13708, 1));
            } else {
              var if_res2249 = M0.rvoid();
            }
            return if_res2249;
          };
          var if_res2250 = loop3706(a13697, c13705);
        } else {
          var if_res2250 = loop3696(a13697, b13704, c13705);
        }
        var if_res2251 = if_res2250;
      }
      return if_res2251;
    };
    return loop3696(B1lo3694, Amid23692, Alo3690);
  };
  M0.hash_set_bang_(sorts3323, M0.string_lt__p, sort_proc3654);
  M0.hash_set_bang_(sorts3323, M0.string_lt__eq__p, sort_proc3654);
  var sort_proc3709 = function(A3710, n3711) {
    var n_by_2_3712 = M1.unsafe_fxrshift(n3711, 1);
    var n_by_2_plus_3713 = M1.unsafe_fx_(n3711, n_by_2_3712);
    var copying_mergesort3714 = function(Alo3715, Blo3716, n3717) {
      if (M1.unsafe_fx_eq_(n3717, 1) !== false) {
        var if_res2267 = M1.unsafe_vector_set_bang_(A3710, Blo3716, M1.unsafe_vector_ref(A3710, Alo3715));
      } else {
        if (M1.unsafe_fx_eq_(n3717, 2) !== false) {
          var x3718 = M1.unsafe_vector_ref(A3710, Alo3715);
          var y3719 = M1.unsafe_vector_ref(A3710, M1.unsafe_fx_plus_(Alo3715, 1));
          if (false !== false) {
            var if_res2252 = M0.string_gt__p(false(y3719), false(x3718));
          } else {
            var if_res2252 = M0.string_gt__p(y3719, x3718);
          }
          if (if_res2252 !== false) {
            M1.unsafe_vector_set_bang_(A3710, Blo3716, y3719);
            var if_res2253 = M1.unsafe_vector_set_bang_(A3710, M1.unsafe_fx_plus_(Blo3716, 1), x3718);
          } else {
            M1.unsafe_vector_set_bang_(A3710, Blo3716, x3718);
            var if_res2253 = M1.unsafe_vector_set_bang_(A3710, M1.unsafe_fx_plus_(Blo3716, 1), y3719);
          }
          var if_res2266 = if_res2253;
        } else {
          if (M1.unsafe_fx_lt_(n3717, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3710, Blo3716, M1.unsafe_vector_ref(A3710, Alo3715));
            var iloop3720 = function(i3721) {
              if (M1.unsafe_fx_lt_(i3721, n3717) !== false) {
                var ref_i3722 = M1.unsafe_vector_ref(A3710, M1.unsafe_fx_plus_(Alo3715, i3721));
                var jloop3723 = function(j3724) {
                  var ref_j_13725 = M1.unsafe_vector_ref(A3710, M1.unsafe_fx_(j3724, 1));
                  if (M1.unsafe_fx_lt_(Blo3716, j3724) !== false) {
                    if (false !== false) {
                      var if_res2254 = M0.string_gt__p(false(ref_i3722), false(ref_j_13725));
                    } else {
                      var if_res2254 = M0.string_gt__p(ref_i3722, ref_j_13725);
                    }
                    var if_res2255 = if_res2254;
                  } else {
                    var if_res2255 = false;
                  }
                  if (if_res2255 !== false) {
                    M1.unsafe_vector_set_bang_(A3710, j3724, ref_j_13725);
                    var if_res2256 = jloop3723(M1.unsafe_fx_(j3724, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3710, j3724, ref_i3722);
                    var if_res2256 = iloop3720(M1.unsafe_fx_plus_(i3721, 1));
                  }
                  return if_res2256;
                };
                var if_res2257 = jloop3723(M1.unsafe_fx_plus_(Blo3716, i3721));
              } else {
                var if_res2257 = M0.rvoid();
              }
              return if_res2257;
            };
            var if_res2265 = iloop3720(1);
          } else {
            var n_by_2_3726 = M1.unsafe_fxrshift(n3717, 1);
            var n_by_2_plus_3727 = M1.unsafe_fx_(n3717, n_by_2_3726);
            var Amid13728 = M1.unsafe_fx_plus_(Alo3715, n_by_2_3726);
            var Amid23729 = M1.unsafe_fx_plus_(Alo3715, n_by_2_plus_3727);
            var Bmid13730 = M1.unsafe_fx_plus_(Blo3716, n_by_2_3726);
            copying_mergesort3714(Amid13728, Bmid13730, n_by_2_plus_3727);
            copying_mergesort3714(Alo3715, Amid23729, n_by_2_3726);
            var b23731 = M1.unsafe_fx_plus_(Blo3716, n3717);
            var loop3732 = function(a13733, b13734, c13735) {
              var x3736 = M1.unsafe_vector_ref(A3710, a13733);
              var y3737 = M1.unsafe_vector_ref(A3710, b13734);
              if (true !== false) {
                if (false !== false) {
                  var if_res2258 = M0.string_gt__p(false(y3737), false(x3736));
                } else {
                  var if_res2258 = M0.string_gt__p(y3737, x3736);
                }
                var if_res2260 = M0.not(if_res2258);
              } else {
                if (false !== false) {
                  var if_res2259 = M0.string_gt__p(false(x3736), false(y3737));
                } else {
                  var if_res2259 = M0.string_gt__p(x3736, y3737);
                }
                var if_res2260 = if_res2259;
              }
              if (if_res2260 !== false) {
                M1.unsafe_vector_set_bang_(A3710, c13735, x3736);
                var a13738 = M1.unsafe_fx_plus_(a13733, 1);
                var c13739 = M1.unsafe_fx_plus_(c13735, 1);
                if (M1.unsafe_fx_lt_(c13739, b13734) !== false) {
                  var if_res2261 = loop3732(a13738, b13734, c13739);
                } else {
                  var if_res2261 = M0.rvoid();
                }
                var if_res2264 = if_res2261;
              } else {
                M1.unsafe_vector_set_bang_(A3710, c13735, y3737);
                var b13740 = M1.unsafe_fx_plus_(b13734, 1);
                var c13741 = M1.unsafe_fx_plus_(c13735, 1);
                if (M1.unsafe_fx_lt__eq_(b23731, b13740) !== false) {
                  var loop3742 = function(a13743, c13744) {
                    if (M1.unsafe_fx_lt_(c13744, b13740) !== false) {
                      M1.unsafe_vector_set_bang_(A3710, c13744, M1.unsafe_vector_ref(A3710, a13743));
                      var if_res2262 = loop3742(M1.unsafe_fx_plus_(a13743, 1), M1.unsafe_fx_plus_(c13744, 1));
                    } else {
                      var if_res2262 = M0.rvoid();
                    }
                    return if_res2262;
                  };
                  var if_res2263 = loop3742(a13733, c13741);
                } else {
                  var if_res2263 = loop3732(a13733, b13740, c13741);
                }
                var if_res2264 = if_res2263;
              }
              return if_res2264;
            };
            var if_res2265 = loop3732(Amid23729, Bmid13730, Blo3716);
          }
          var if_res2266 = if_res2265;
        }
        var if_res2267 = if_res2266;
      }
      return if_res2267;
    };
    var Alo3745 = 0;
    var Amid13746 = n_by_2_3712;
    var Amid23747 = n_by_2_plus_3713;
    var Ahi3748 = n3711;
    var B1lo3749 = n3711;
    copying_mergesort3714(Amid13746, B1lo3749, n_by_2_plus_3713);
    if (M0.zero_p(n_by_2_3712) !== false) {
      var if_res2268 = M0.rvoid();
    } else {
      var if_res2268 = copying_mergesort3714(Alo3745, Amid23747, n_by_2_3712);
    }
    if_res2268;
    var b23750 = Ahi3748;
    var loop3751 = function(a13752, b13753, c13754) {
      var x3755 = M1.unsafe_vector_ref(A3710, a13752);
      var y3756 = M1.unsafe_vector_ref(A3710, b13753);
      if (false !== false) {
        if (false !== false) {
          var if_res2269 = M0.string_gt__p(false(y3756), false(x3755));
        } else {
          var if_res2269 = M0.string_gt__p(y3756, x3755);
        }
        var if_res2271 = M0.not(if_res2269);
      } else {
        if (false !== false) {
          var if_res2270 = M0.string_gt__p(false(x3755), false(y3756));
        } else {
          var if_res2270 = M0.string_gt__p(x3755, y3756);
        }
        var if_res2271 = if_res2270;
      }
      if (if_res2271 !== false) {
        M1.unsafe_vector_set_bang_(A3710, c13754, x3755);
        var a13757 = M1.unsafe_fx_plus_(a13752, 1);
        var c13758 = M1.unsafe_fx_plus_(c13754, 1);
        if (M1.unsafe_fx_lt_(c13758, b13753) !== false) {
          var if_res2272 = loop3751(a13757, b13753, c13758);
        } else {
          var if_res2272 = M0.rvoid();
        }
        var if_res2275 = if_res2272;
      } else {
        M1.unsafe_vector_set_bang_(A3710, c13754, y3756);
        var b13759 = M1.unsafe_fx_plus_(b13753, 1);
        var c13760 = M1.unsafe_fx_plus_(c13754, 1);
        if (M1.unsafe_fx_lt__eq_(b23750, b13759) !== false) {
          var loop3761 = function(a13762, c13763) {
            if (M1.unsafe_fx_lt_(c13763, b13759) !== false) {
              M1.unsafe_vector_set_bang_(A3710, c13763, M1.unsafe_vector_ref(A3710, a13762));
              var if_res2273 = loop3761(M1.unsafe_fx_plus_(a13762, 1), M1.unsafe_fx_plus_(c13763, 1));
            } else {
              var if_res2273 = M0.rvoid();
            }
            return if_res2273;
          };
          var if_res2274 = loop3761(a13752, c13760);
        } else {
          var if_res2274 = loop3751(a13752, b13759, c13760);
        }
        var if_res2275 = if_res2274;
      }
      return if_res2275;
    };
    return loop3751(B1lo3749, Amid23747, Alo3745);
  };
  M0.hash_set_bang_(sorts3323, M0.string_gt__p, sort_proc3709);
  M0.hash_set_bang_(sorts3323, M0.string_gt__eq__p, sort_proc3709);
  var sort_proc3764 = function(A3765, n3766) {
    var n_by_2_3767 = M1.unsafe_fxrshift(n3766, 1);
    var n_by_2_plus_3768 = M1.unsafe_fx_(n3766, n_by_2_3767);
    var copying_mergesort3769 = function(Alo3770, Blo3771, n3772) {
      if (M1.unsafe_fx_eq_(n3772, 1) !== false) {
        var if_res2291 = M1.unsafe_vector_set_bang_(A3765, Blo3771, M1.unsafe_vector_ref(A3765, Alo3770));
      } else {
        if (M1.unsafe_fx_eq_(n3772, 2) !== false) {
          var x3773 = M1.unsafe_vector_ref(A3765, Alo3770);
          var y3774 = M1.unsafe_vector_ref(A3765, M1.unsafe_fx_plus_(Alo3770, 1));
          if (false !== false) {
            var if_res2276 = M0.__rjs_quoted__.string_ci_lt__p(false(y3774), false(x3773));
          } else {
            var if_res2276 = M0.__rjs_quoted__.string_ci_lt__p(y3774, x3773);
          }
          if (if_res2276 !== false) {
            M1.unsafe_vector_set_bang_(A3765, Blo3771, y3774);
            var if_res2277 = M1.unsafe_vector_set_bang_(A3765, M1.unsafe_fx_plus_(Blo3771, 1), x3773);
          } else {
            M1.unsafe_vector_set_bang_(A3765, Blo3771, x3773);
            var if_res2277 = M1.unsafe_vector_set_bang_(A3765, M1.unsafe_fx_plus_(Blo3771, 1), y3774);
          }
          var if_res2290 = if_res2277;
        } else {
          if (M1.unsafe_fx_lt_(n3772, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3765, Blo3771, M1.unsafe_vector_ref(A3765, Alo3770));
            var iloop3775 = function(i3776) {
              if (M1.unsafe_fx_lt_(i3776, n3772) !== false) {
                var ref_i3777 = M1.unsafe_vector_ref(A3765, M1.unsafe_fx_plus_(Alo3770, i3776));
                var jloop3778 = function(j3779) {
                  var ref_j_13780 = M1.unsafe_vector_ref(A3765, M1.unsafe_fx_(j3779, 1));
                  if (M1.unsafe_fx_lt_(Blo3771, j3779) !== false) {
                    if (false !== false) {
                      var if_res2278 = M0.__rjs_quoted__.string_ci_lt__p(false(ref_i3777), false(ref_j_13780));
                    } else {
                      var if_res2278 = M0.__rjs_quoted__.string_ci_lt__p(ref_i3777, ref_j_13780);
                    }
                    var if_res2279 = if_res2278;
                  } else {
                    var if_res2279 = false;
                  }
                  if (if_res2279 !== false) {
                    M1.unsafe_vector_set_bang_(A3765, j3779, ref_j_13780);
                    var if_res2280 = jloop3778(M1.unsafe_fx_(j3779, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3765, j3779, ref_i3777);
                    var if_res2280 = iloop3775(M1.unsafe_fx_plus_(i3776, 1));
                  }
                  return if_res2280;
                };
                var if_res2281 = jloop3778(M1.unsafe_fx_plus_(Blo3771, i3776));
              } else {
                var if_res2281 = M0.rvoid();
              }
              return if_res2281;
            };
            var if_res2289 = iloop3775(1);
          } else {
            var n_by_2_3781 = M1.unsafe_fxrshift(n3772, 1);
            var n_by_2_plus_3782 = M1.unsafe_fx_(n3772, n_by_2_3781);
            var Amid13783 = M1.unsafe_fx_plus_(Alo3770, n_by_2_3781);
            var Amid23784 = M1.unsafe_fx_plus_(Alo3770, n_by_2_plus_3782);
            var Bmid13785 = M1.unsafe_fx_plus_(Blo3771, n_by_2_3781);
            copying_mergesort3769(Amid13783, Bmid13785, n_by_2_plus_3782);
            copying_mergesort3769(Alo3770, Amid23784, n_by_2_3781);
            var b23786 = M1.unsafe_fx_plus_(Blo3771, n3772);
            var loop3787 = function(a13788, b13789, c13790) {
              var x3791 = M1.unsafe_vector_ref(A3765, a13788);
              var y3792 = M1.unsafe_vector_ref(A3765, b13789);
              if (true !== false) {
                if (false !== false) {
                  var if_res2282 = M0.__rjs_quoted__.string_ci_lt__p(false(y3792), false(x3791));
                } else {
                  var if_res2282 = M0.__rjs_quoted__.string_ci_lt__p(y3792, x3791);
                }
                var if_res2284 = M0.not(if_res2282);
              } else {
                if (false !== false) {
                  var if_res2283 = M0.__rjs_quoted__.string_ci_lt__p(false(x3791), false(y3792));
                } else {
                  var if_res2283 = M0.__rjs_quoted__.string_ci_lt__p(x3791, y3792);
                }
                var if_res2284 = if_res2283;
              }
              if (if_res2284 !== false) {
                M1.unsafe_vector_set_bang_(A3765, c13790, x3791);
                var a13793 = M1.unsafe_fx_plus_(a13788, 1);
                var c13794 = M1.unsafe_fx_plus_(c13790, 1);
                if (M1.unsafe_fx_lt_(c13794, b13789) !== false) {
                  var if_res2285 = loop3787(a13793, b13789, c13794);
                } else {
                  var if_res2285 = M0.rvoid();
                }
                var if_res2288 = if_res2285;
              } else {
                M1.unsafe_vector_set_bang_(A3765, c13790, y3792);
                var b13795 = M1.unsafe_fx_plus_(b13789, 1);
                var c13796 = M1.unsafe_fx_plus_(c13790, 1);
                if (M1.unsafe_fx_lt__eq_(b23786, b13795) !== false) {
                  var loop3797 = function(a13798, c13799) {
                    if (M1.unsafe_fx_lt_(c13799, b13795) !== false) {
                      M1.unsafe_vector_set_bang_(A3765, c13799, M1.unsafe_vector_ref(A3765, a13798));
                      var if_res2286 = loop3797(M1.unsafe_fx_plus_(a13798, 1), M1.unsafe_fx_plus_(c13799, 1));
                    } else {
                      var if_res2286 = M0.rvoid();
                    }
                    return if_res2286;
                  };
                  var if_res2287 = loop3797(a13788, c13796);
                } else {
                  var if_res2287 = loop3787(a13788, b13795, c13796);
                }
                var if_res2288 = if_res2287;
              }
              return if_res2288;
            };
            var if_res2289 = loop3787(Amid23784, Bmid13785, Blo3771);
          }
          var if_res2290 = if_res2289;
        }
        var if_res2291 = if_res2290;
      }
      return if_res2291;
    };
    var Alo3800 = 0;
    var Amid13801 = n_by_2_3767;
    var Amid23802 = n_by_2_plus_3768;
    var Ahi3803 = n3766;
    var B1lo3804 = n3766;
    copying_mergesort3769(Amid13801, B1lo3804, n_by_2_plus_3768);
    if (M0.zero_p(n_by_2_3767) !== false) {
      var if_res2292 = M0.rvoid();
    } else {
      var if_res2292 = copying_mergesort3769(Alo3800, Amid23802, n_by_2_3767);
    }
    if_res2292;
    var b23805 = Ahi3803;
    var loop3806 = function(a13807, b13808, c13809) {
      var x3810 = M1.unsafe_vector_ref(A3765, a13807);
      var y3811 = M1.unsafe_vector_ref(A3765, b13808);
      if (false !== false) {
        if (false !== false) {
          var if_res2293 = M0.__rjs_quoted__.string_ci_lt__p(false(y3811), false(x3810));
        } else {
          var if_res2293 = M0.__rjs_quoted__.string_ci_lt__p(y3811, x3810);
        }
        var if_res2295 = M0.not(if_res2293);
      } else {
        if (false !== false) {
          var if_res2294 = M0.__rjs_quoted__.string_ci_lt__p(false(x3810), false(y3811));
        } else {
          var if_res2294 = M0.__rjs_quoted__.string_ci_lt__p(x3810, y3811);
        }
        var if_res2295 = if_res2294;
      }
      if (if_res2295 !== false) {
        M1.unsafe_vector_set_bang_(A3765, c13809, x3810);
        var a13812 = M1.unsafe_fx_plus_(a13807, 1);
        var c13813 = M1.unsafe_fx_plus_(c13809, 1);
        if (M1.unsafe_fx_lt_(c13813, b13808) !== false) {
          var if_res2296 = loop3806(a13812, b13808, c13813);
        } else {
          var if_res2296 = M0.rvoid();
        }
        var if_res2299 = if_res2296;
      } else {
        M1.unsafe_vector_set_bang_(A3765, c13809, y3811);
        var b13814 = M1.unsafe_fx_plus_(b13808, 1);
        var c13815 = M1.unsafe_fx_plus_(c13809, 1);
        if (M1.unsafe_fx_lt__eq_(b23805, b13814) !== false) {
          var loop3816 = function(a13817, c13818) {
            if (M1.unsafe_fx_lt_(c13818, b13814) !== false) {
              M1.unsafe_vector_set_bang_(A3765, c13818, M1.unsafe_vector_ref(A3765, a13817));
              var if_res2297 = loop3816(M1.unsafe_fx_plus_(a13817, 1), M1.unsafe_fx_plus_(c13818, 1));
            } else {
              var if_res2297 = M0.rvoid();
            }
            return if_res2297;
          };
          var if_res2298 = loop3816(a13807, c13815);
        } else {
          var if_res2298 = loop3806(a13807, b13814, c13815);
        }
        var if_res2299 = if_res2298;
      }
      return if_res2299;
    };
    return loop3806(B1lo3804, Amid23802, Alo3800);
  };
  M0.hash_set_bang_(sorts3323, M0.__rjs_quoted__.string_ci_lt__p, sort_proc3764);
  M0.hash_set_bang_(sorts3323, M0.__rjs_quoted__.string_ci_lt__eq__p, sort_proc3764);
  var sort_proc3819 = function(A3820, n3821) {
    var n_by_2_3822 = M1.unsafe_fxrshift(n3821, 1);
    var n_by_2_plus_3823 = M1.unsafe_fx_(n3821, n_by_2_3822);
    var copying_mergesort3824 = function(Alo3825, Blo3826, n3827) {
      if (M1.unsafe_fx_eq_(n3827, 1) !== false) {
        var if_res2315 = M1.unsafe_vector_set_bang_(A3820, Blo3826, M1.unsafe_vector_ref(A3820, Alo3825));
      } else {
        if (M1.unsafe_fx_eq_(n3827, 2) !== false) {
          var x3828 = M1.unsafe_vector_ref(A3820, Alo3825);
          var y3829 = M1.unsafe_vector_ref(A3820, M1.unsafe_fx_plus_(Alo3825, 1));
          if (false !== false) {
            var if_res2300 = M0.__rjs_quoted__.string_ci_gt__p(false(y3829), false(x3828));
          } else {
            var if_res2300 = M0.__rjs_quoted__.string_ci_gt__p(y3829, x3828);
          }
          if (if_res2300 !== false) {
            M1.unsafe_vector_set_bang_(A3820, Blo3826, y3829);
            var if_res2301 = M1.unsafe_vector_set_bang_(A3820, M1.unsafe_fx_plus_(Blo3826, 1), x3828);
          } else {
            M1.unsafe_vector_set_bang_(A3820, Blo3826, x3828);
            var if_res2301 = M1.unsafe_vector_set_bang_(A3820, M1.unsafe_fx_plus_(Blo3826, 1), y3829);
          }
          var if_res2314 = if_res2301;
        } else {
          if (M1.unsafe_fx_lt_(n3827, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3820, Blo3826, M1.unsafe_vector_ref(A3820, Alo3825));
            var iloop3830 = function(i3831) {
              if (M1.unsafe_fx_lt_(i3831, n3827) !== false) {
                var ref_i3832 = M1.unsafe_vector_ref(A3820, M1.unsafe_fx_plus_(Alo3825, i3831));
                var jloop3833 = function(j3834) {
                  var ref_j_13835 = M1.unsafe_vector_ref(A3820, M1.unsafe_fx_(j3834, 1));
                  if (M1.unsafe_fx_lt_(Blo3826, j3834) !== false) {
                    if (false !== false) {
                      var if_res2302 = M0.__rjs_quoted__.string_ci_gt__p(false(ref_i3832), false(ref_j_13835));
                    } else {
                      var if_res2302 = M0.__rjs_quoted__.string_ci_gt__p(ref_i3832, ref_j_13835);
                    }
                    var if_res2303 = if_res2302;
                  } else {
                    var if_res2303 = false;
                  }
                  if (if_res2303 !== false) {
                    M1.unsafe_vector_set_bang_(A3820, j3834, ref_j_13835);
                    var if_res2304 = jloop3833(M1.unsafe_fx_(j3834, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3820, j3834, ref_i3832);
                    var if_res2304 = iloop3830(M1.unsafe_fx_plus_(i3831, 1));
                  }
                  return if_res2304;
                };
                var if_res2305 = jloop3833(M1.unsafe_fx_plus_(Blo3826, i3831));
              } else {
                var if_res2305 = M0.rvoid();
              }
              return if_res2305;
            };
            var if_res2313 = iloop3830(1);
          } else {
            var n_by_2_3836 = M1.unsafe_fxrshift(n3827, 1);
            var n_by_2_plus_3837 = M1.unsafe_fx_(n3827, n_by_2_3836);
            var Amid13838 = M1.unsafe_fx_plus_(Alo3825, n_by_2_3836);
            var Amid23839 = M1.unsafe_fx_plus_(Alo3825, n_by_2_plus_3837);
            var Bmid13840 = M1.unsafe_fx_plus_(Blo3826, n_by_2_3836);
            copying_mergesort3824(Amid13838, Bmid13840, n_by_2_plus_3837);
            copying_mergesort3824(Alo3825, Amid23839, n_by_2_3836);
            var b23841 = M1.unsafe_fx_plus_(Blo3826, n3827);
            var loop3842 = function(a13843, b13844, c13845) {
              var x3846 = M1.unsafe_vector_ref(A3820, a13843);
              var y3847 = M1.unsafe_vector_ref(A3820, b13844);
              if (true !== false) {
                if (false !== false) {
                  var if_res2306 = M0.__rjs_quoted__.string_ci_gt__p(false(y3847), false(x3846));
                } else {
                  var if_res2306 = M0.__rjs_quoted__.string_ci_gt__p(y3847, x3846);
                }
                var if_res2308 = M0.not(if_res2306);
              } else {
                if (false !== false) {
                  var if_res2307 = M0.__rjs_quoted__.string_ci_gt__p(false(x3846), false(y3847));
                } else {
                  var if_res2307 = M0.__rjs_quoted__.string_ci_gt__p(x3846, y3847);
                }
                var if_res2308 = if_res2307;
              }
              if (if_res2308 !== false) {
                M1.unsafe_vector_set_bang_(A3820, c13845, x3846);
                var a13848 = M1.unsafe_fx_plus_(a13843, 1);
                var c13849 = M1.unsafe_fx_plus_(c13845, 1);
                if (M1.unsafe_fx_lt_(c13849, b13844) !== false) {
                  var if_res2309 = loop3842(a13848, b13844, c13849);
                } else {
                  var if_res2309 = M0.rvoid();
                }
                var if_res2312 = if_res2309;
              } else {
                M1.unsafe_vector_set_bang_(A3820, c13845, y3847);
                var b13850 = M1.unsafe_fx_plus_(b13844, 1);
                var c13851 = M1.unsafe_fx_plus_(c13845, 1);
                if (M1.unsafe_fx_lt__eq_(b23841, b13850) !== false) {
                  var loop3852 = function(a13853, c13854) {
                    if (M1.unsafe_fx_lt_(c13854, b13850) !== false) {
                      M1.unsafe_vector_set_bang_(A3820, c13854, M1.unsafe_vector_ref(A3820, a13853));
                      var if_res2310 = loop3852(M1.unsafe_fx_plus_(a13853, 1), M1.unsafe_fx_plus_(c13854, 1));
                    } else {
                      var if_res2310 = M0.rvoid();
                    }
                    return if_res2310;
                  };
                  var if_res2311 = loop3852(a13843, c13851);
                } else {
                  var if_res2311 = loop3842(a13843, b13850, c13851);
                }
                var if_res2312 = if_res2311;
              }
              return if_res2312;
            };
            var if_res2313 = loop3842(Amid23839, Bmid13840, Blo3826);
          }
          var if_res2314 = if_res2313;
        }
        var if_res2315 = if_res2314;
      }
      return if_res2315;
    };
    var Alo3855 = 0;
    var Amid13856 = n_by_2_3822;
    var Amid23857 = n_by_2_plus_3823;
    var Ahi3858 = n3821;
    var B1lo3859 = n3821;
    copying_mergesort3824(Amid13856, B1lo3859, n_by_2_plus_3823);
    if (M0.zero_p(n_by_2_3822) !== false) {
      var if_res2316 = M0.rvoid();
    } else {
      var if_res2316 = copying_mergesort3824(Alo3855, Amid23857, n_by_2_3822);
    }
    if_res2316;
    var b23860 = Ahi3858;
    var loop3861 = function(a13862, b13863, c13864) {
      var x3865 = M1.unsafe_vector_ref(A3820, a13862);
      var y3866 = M1.unsafe_vector_ref(A3820, b13863);
      if (false !== false) {
        if (false !== false) {
          var if_res2317 = M0.__rjs_quoted__.string_ci_gt__p(false(y3866), false(x3865));
        } else {
          var if_res2317 = M0.__rjs_quoted__.string_ci_gt__p(y3866, x3865);
        }
        var if_res2319 = M0.not(if_res2317);
      } else {
        if (false !== false) {
          var if_res2318 = M0.__rjs_quoted__.string_ci_gt__p(false(x3865), false(y3866));
        } else {
          var if_res2318 = M0.__rjs_quoted__.string_ci_gt__p(x3865, y3866);
        }
        var if_res2319 = if_res2318;
      }
      if (if_res2319 !== false) {
        M1.unsafe_vector_set_bang_(A3820, c13864, x3865);
        var a13867 = M1.unsafe_fx_plus_(a13862, 1);
        var c13868 = M1.unsafe_fx_plus_(c13864, 1);
        if (M1.unsafe_fx_lt_(c13868, b13863) !== false) {
          var if_res2320 = loop3861(a13867, b13863, c13868);
        } else {
          var if_res2320 = M0.rvoid();
        }
        var if_res2323 = if_res2320;
      } else {
        M1.unsafe_vector_set_bang_(A3820, c13864, y3866);
        var b13869 = M1.unsafe_fx_plus_(b13863, 1);
        var c13870 = M1.unsafe_fx_plus_(c13864, 1);
        if (M1.unsafe_fx_lt__eq_(b23860, b13869) !== false) {
          var loop3871 = function(a13872, c13873) {
            if (M1.unsafe_fx_lt_(c13873, b13869) !== false) {
              M1.unsafe_vector_set_bang_(A3820, c13873, M1.unsafe_vector_ref(A3820, a13872));
              var if_res2321 = loop3871(M1.unsafe_fx_plus_(a13872, 1), M1.unsafe_fx_plus_(c13873, 1));
            } else {
              var if_res2321 = M0.rvoid();
            }
            return if_res2321;
          };
          var if_res2322 = loop3871(a13862, c13870);
        } else {
          var if_res2322 = loop3861(a13862, b13869, c13870);
        }
        var if_res2323 = if_res2322;
      }
      return if_res2323;
    };
    return loop3861(B1lo3859, Amid23857, Alo3855);
  };
  M0.hash_set_bang_(sorts3323, M0.__rjs_quoted__.string_ci_gt__p, sort_proc3819);
  M0.hash_set_bang_(sorts3323, M0.__rjs_quoted__.string_ci_gt__eq__p, sort_proc3819);
  var sort_proc3874 = function(A3875, n3876) {
    var n_by_2_3877 = M1.unsafe_fxrshift(n3876, 1);
    var n_by_2_plus_3878 = M1.unsafe_fx_(n3876, n_by_2_3877);
    var copying_mergesort3879 = function(Alo3880, Blo3881, n3882) {
      if (M1.unsafe_fx_eq_(n3882, 1) !== false) {
        var if_res2339 = M1.unsafe_vector_set_bang_(A3875, Blo3881, M1.unsafe_vector_ref(A3875, Alo3880));
      } else {
        if (M1.unsafe_fx_eq_(n3882, 2) !== false) {
          var x3883 = M1.unsafe_vector_ref(A3875, Alo3880);
          var y3884 = M1.unsafe_vector_ref(A3875, M1.unsafe_fx_plus_(Alo3880, 1));
          if (false !== false) {
            var if_res2324 = M0.char_lt__p(false(y3884), false(x3883));
          } else {
            var if_res2324 = M0.char_lt__p(y3884, x3883);
          }
          if (if_res2324 !== false) {
            M1.unsafe_vector_set_bang_(A3875, Blo3881, y3884);
            var if_res2325 = M1.unsafe_vector_set_bang_(A3875, M1.unsafe_fx_plus_(Blo3881, 1), x3883);
          } else {
            M1.unsafe_vector_set_bang_(A3875, Blo3881, x3883);
            var if_res2325 = M1.unsafe_vector_set_bang_(A3875, M1.unsafe_fx_plus_(Blo3881, 1), y3884);
          }
          var if_res2338 = if_res2325;
        } else {
          if (M1.unsafe_fx_lt_(n3882, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3875, Blo3881, M1.unsafe_vector_ref(A3875, Alo3880));
            var iloop3885 = function(i3886) {
              if (M1.unsafe_fx_lt_(i3886, n3882) !== false) {
                var ref_i3887 = M1.unsafe_vector_ref(A3875, M1.unsafe_fx_plus_(Alo3880, i3886));
                var jloop3888 = function(j3889) {
                  var ref_j_13890 = M1.unsafe_vector_ref(A3875, M1.unsafe_fx_(j3889, 1));
                  if (M1.unsafe_fx_lt_(Blo3881, j3889) !== false) {
                    if (false !== false) {
                      var if_res2326 = M0.char_lt__p(false(ref_i3887), false(ref_j_13890));
                    } else {
                      var if_res2326 = M0.char_lt__p(ref_i3887, ref_j_13890);
                    }
                    var if_res2327 = if_res2326;
                  } else {
                    var if_res2327 = false;
                  }
                  if (if_res2327 !== false) {
                    M1.unsafe_vector_set_bang_(A3875, j3889, ref_j_13890);
                    var if_res2328 = jloop3888(M1.unsafe_fx_(j3889, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3875, j3889, ref_i3887);
                    var if_res2328 = iloop3885(M1.unsafe_fx_plus_(i3886, 1));
                  }
                  return if_res2328;
                };
                var if_res2329 = jloop3888(M1.unsafe_fx_plus_(Blo3881, i3886));
              } else {
                var if_res2329 = M0.rvoid();
              }
              return if_res2329;
            };
            var if_res2337 = iloop3885(1);
          } else {
            var n_by_2_3891 = M1.unsafe_fxrshift(n3882, 1);
            var n_by_2_plus_3892 = M1.unsafe_fx_(n3882, n_by_2_3891);
            var Amid13893 = M1.unsafe_fx_plus_(Alo3880, n_by_2_3891);
            var Amid23894 = M1.unsafe_fx_plus_(Alo3880, n_by_2_plus_3892);
            var Bmid13895 = M1.unsafe_fx_plus_(Blo3881, n_by_2_3891);
            copying_mergesort3879(Amid13893, Bmid13895, n_by_2_plus_3892);
            copying_mergesort3879(Alo3880, Amid23894, n_by_2_3891);
            var b23896 = M1.unsafe_fx_plus_(Blo3881, n3882);
            var loop3897 = function(a13898, b13899, c13900) {
              var x3901 = M1.unsafe_vector_ref(A3875, a13898);
              var y3902 = M1.unsafe_vector_ref(A3875, b13899);
              if (true !== false) {
                if (false !== false) {
                  var if_res2330 = M0.char_lt__p(false(y3902), false(x3901));
                } else {
                  var if_res2330 = M0.char_lt__p(y3902, x3901);
                }
                var if_res2332 = M0.not(if_res2330);
              } else {
                if (false !== false) {
                  var if_res2331 = M0.char_lt__p(false(x3901), false(y3902));
                } else {
                  var if_res2331 = M0.char_lt__p(x3901, y3902);
                }
                var if_res2332 = if_res2331;
              }
              if (if_res2332 !== false) {
                M1.unsafe_vector_set_bang_(A3875, c13900, x3901);
                var a13903 = M1.unsafe_fx_plus_(a13898, 1);
                var c13904 = M1.unsafe_fx_plus_(c13900, 1);
                if (M1.unsafe_fx_lt_(c13904, b13899) !== false) {
                  var if_res2333 = loop3897(a13903, b13899, c13904);
                } else {
                  var if_res2333 = M0.rvoid();
                }
                var if_res2336 = if_res2333;
              } else {
                M1.unsafe_vector_set_bang_(A3875, c13900, y3902);
                var b13905 = M1.unsafe_fx_plus_(b13899, 1);
                var c13906 = M1.unsafe_fx_plus_(c13900, 1);
                if (M1.unsafe_fx_lt__eq_(b23896, b13905) !== false) {
                  var loop3907 = function(a13908, c13909) {
                    if (M1.unsafe_fx_lt_(c13909, b13905) !== false) {
                      M1.unsafe_vector_set_bang_(A3875, c13909, M1.unsafe_vector_ref(A3875, a13908));
                      var if_res2334 = loop3907(M1.unsafe_fx_plus_(a13908, 1), M1.unsafe_fx_plus_(c13909, 1));
                    } else {
                      var if_res2334 = M0.rvoid();
                    }
                    return if_res2334;
                  };
                  var if_res2335 = loop3907(a13898, c13906);
                } else {
                  var if_res2335 = loop3897(a13898, b13905, c13906);
                }
                var if_res2336 = if_res2335;
              }
              return if_res2336;
            };
            var if_res2337 = loop3897(Amid23894, Bmid13895, Blo3881);
          }
          var if_res2338 = if_res2337;
        }
        var if_res2339 = if_res2338;
      }
      return if_res2339;
    };
    var Alo3910 = 0;
    var Amid13911 = n_by_2_3877;
    var Amid23912 = n_by_2_plus_3878;
    var Ahi3913 = n3876;
    var B1lo3914 = n3876;
    copying_mergesort3879(Amid13911, B1lo3914, n_by_2_plus_3878);
    if (M0.zero_p(n_by_2_3877) !== false) {
      var if_res2340 = M0.rvoid();
    } else {
      var if_res2340 = copying_mergesort3879(Alo3910, Amid23912, n_by_2_3877);
    }
    if_res2340;
    var b23915 = Ahi3913;
    var loop3916 = function(a13917, b13918, c13919) {
      var x3920 = M1.unsafe_vector_ref(A3875, a13917);
      var y3921 = M1.unsafe_vector_ref(A3875, b13918);
      if (false !== false) {
        if (false !== false) {
          var if_res2341 = M0.char_lt__p(false(y3921), false(x3920));
        } else {
          var if_res2341 = M0.char_lt__p(y3921, x3920);
        }
        var if_res2343 = M0.not(if_res2341);
      } else {
        if (false !== false) {
          var if_res2342 = M0.char_lt__p(false(x3920), false(y3921));
        } else {
          var if_res2342 = M0.char_lt__p(x3920, y3921);
        }
        var if_res2343 = if_res2342;
      }
      if (if_res2343 !== false) {
        M1.unsafe_vector_set_bang_(A3875, c13919, x3920);
        var a13922 = M1.unsafe_fx_plus_(a13917, 1);
        var c13923 = M1.unsafe_fx_plus_(c13919, 1);
        if (M1.unsafe_fx_lt_(c13923, b13918) !== false) {
          var if_res2344 = loop3916(a13922, b13918, c13923);
        } else {
          var if_res2344 = M0.rvoid();
        }
        var if_res2347 = if_res2344;
      } else {
        M1.unsafe_vector_set_bang_(A3875, c13919, y3921);
        var b13924 = M1.unsafe_fx_plus_(b13918, 1);
        var c13925 = M1.unsafe_fx_plus_(c13919, 1);
        if (M1.unsafe_fx_lt__eq_(b23915, b13924) !== false) {
          var loop3926 = function(a13927, c13928) {
            if (M1.unsafe_fx_lt_(c13928, b13924) !== false) {
              M1.unsafe_vector_set_bang_(A3875, c13928, M1.unsafe_vector_ref(A3875, a13927));
              var if_res2345 = loop3926(M1.unsafe_fx_plus_(a13927, 1), M1.unsafe_fx_plus_(c13928, 1));
            } else {
              var if_res2345 = M0.rvoid();
            }
            return if_res2345;
          };
          var if_res2346 = loop3926(a13917, c13925);
        } else {
          var if_res2346 = loop3916(a13917, b13924, c13925);
        }
        var if_res2347 = if_res2346;
      }
      return if_res2347;
    };
    return loop3916(B1lo3914, Amid23912, Alo3910);
  };
  M0.hash_set_bang_(sorts3323, M0.char_lt__p, sort_proc3874);
  M0.hash_set_bang_(sorts3323, M0.char_lt__eq__p, sort_proc3874);
  var sort_proc3929 = function(A3930, n3931) {
    var n_by_2_3932 = M1.unsafe_fxrshift(n3931, 1);
    var n_by_2_plus_3933 = M1.unsafe_fx_(n3931, n_by_2_3932);
    var copying_mergesort3934 = function(Alo3935, Blo3936, n3937) {
      if (M1.unsafe_fx_eq_(n3937, 1) !== false) {
        var if_res2363 = M1.unsafe_vector_set_bang_(A3930, Blo3936, M1.unsafe_vector_ref(A3930, Alo3935));
      } else {
        if (M1.unsafe_fx_eq_(n3937, 2) !== false) {
          var x3938 = M1.unsafe_vector_ref(A3930, Alo3935);
          var y3939 = M1.unsafe_vector_ref(A3930, M1.unsafe_fx_plus_(Alo3935, 1));
          if (false !== false) {
            var if_res2348 = M0.char_gt__p(false(y3939), false(x3938));
          } else {
            var if_res2348 = M0.char_gt__p(y3939, x3938);
          }
          if (if_res2348 !== false) {
            M1.unsafe_vector_set_bang_(A3930, Blo3936, y3939);
            var if_res2349 = M1.unsafe_vector_set_bang_(A3930, M1.unsafe_fx_plus_(Blo3936, 1), x3938);
          } else {
            M1.unsafe_vector_set_bang_(A3930, Blo3936, x3938);
            var if_res2349 = M1.unsafe_vector_set_bang_(A3930, M1.unsafe_fx_plus_(Blo3936, 1), y3939);
          }
          var if_res2362 = if_res2349;
        } else {
          if (M1.unsafe_fx_lt_(n3937, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3930, Blo3936, M1.unsafe_vector_ref(A3930, Alo3935));
            var iloop3940 = function(i3941) {
              if (M1.unsafe_fx_lt_(i3941, n3937) !== false) {
                var ref_i3942 = M1.unsafe_vector_ref(A3930, M1.unsafe_fx_plus_(Alo3935, i3941));
                var jloop3943 = function(j3944) {
                  var ref_j_13945 = M1.unsafe_vector_ref(A3930, M1.unsafe_fx_(j3944, 1));
                  if (M1.unsafe_fx_lt_(Blo3936, j3944) !== false) {
                    if (false !== false) {
                      var if_res2350 = M0.char_gt__p(false(ref_i3942), false(ref_j_13945));
                    } else {
                      var if_res2350 = M0.char_gt__p(ref_i3942, ref_j_13945);
                    }
                    var if_res2351 = if_res2350;
                  } else {
                    var if_res2351 = false;
                  }
                  if (if_res2351 !== false) {
                    M1.unsafe_vector_set_bang_(A3930, j3944, ref_j_13945);
                    var if_res2352 = jloop3943(M1.unsafe_fx_(j3944, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3930, j3944, ref_i3942);
                    var if_res2352 = iloop3940(M1.unsafe_fx_plus_(i3941, 1));
                  }
                  return if_res2352;
                };
                var if_res2353 = jloop3943(M1.unsafe_fx_plus_(Blo3936, i3941));
              } else {
                var if_res2353 = M0.rvoid();
              }
              return if_res2353;
            };
            var if_res2361 = iloop3940(1);
          } else {
            var n_by_2_3946 = M1.unsafe_fxrshift(n3937, 1);
            var n_by_2_plus_3947 = M1.unsafe_fx_(n3937, n_by_2_3946);
            var Amid13948 = M1.unsafe_fx_plus_(Alo3935, n_by_2_3946);
            var Amid23949 = M1.unsafe_fx_plus_(Alo3935, n_by_2_plus_3947);
            var Bmid13950 = M1.unsafe_fx_plus_(Blo3936, n_by_2_3946);
            copying_mergesort3934(Amid13948, Bmid13950, n_by_2_plus_3947);
            copying_mergesort3934(Alo3935, Amid23949, n_by_2_3946);
            var b23951 = M1.unsafe_fx_plus_(Blo3936, n3937);
            var loop3952 = function(a13953, b13954, c13955) {
              var x3956 = M1.unsafe_vector_ref(A3930, a13953);
              var y3957 = M1.unsafe_vector_ref(A3930, b13954);
              if (true !== false) {
                if (false !== false) {
                  var if_res2354 = M0.char_gt__p(false(y3957), false(x3956));
                } else {
                  var if_res2354 = M0.char_gt__p(y3957, x3956);
                }
                var if_res2356 = M0.not(if_res2354);
              } else {
                if (false !== false) {
                  var if_res2355 = M0.char_gt__p(false(x3956), false(y3957));
                } else {
                  var if_res2355 = M0.char_gt__p(x3956, y3957);
                }
                var if_res2356 = if_res2355;
              }
              if (if_res2356 !== false) {
                M1.unsafe_vector_set_bang_(A3930, c13955, x3956);
                var a13958 = M1.unsafe_fx_plus_(a13953, 1);
                var c13959 = M1.unsafe_fx_plus_(c13955, 1);
                if (M1.unsafe_fx_lt_(c13959, b13954) !== false) {
                  var if_res2357 = loop3952(a13958, b13954, c13959);
                } else {
                  var if_res2357 = M0.rvoid();
                }
                var if_res2360 = if_res2357;
              } else {
                M1.unsafe_vector_set_bang_(A3930, c13955, y3957);
                var b13960 = M1.unsafe_fx_plus_(b13954, 1);
                var c13961 = M1.unsafe_fx_plus_(c13955, 1);
                if (M1.unsafe_fx_lt__eq_(b23951, b13960) !== false) {
                  var loop3962 = function(a13963, c13964) {
                    if (M1.unsafe_fx_lt_(c13964, b13960) !== false) {
                      M1.unsafe_vector_set_bang_(A3930, c13964, M1.unsafe_vector_ref(A3930, a13963));
                      var if_res2358 = loop3962(M1.unsafe_fx_plus_(a13963, 1), M1.unsafe_fx_plus_(c13964, 1));
                    } else {
                      var if_res2358 = M0.rvoid();
                    }
                    return if_res2358;
                  };
                  var if_res2359 = loop3962(a13953, c13961);
                } else {
                  var if_res2359 = loop3952(a13953, b13960, c13961);
                }
                var if_res2360 = if_res2359;
              }
              return if_res2360;
            };
            var if_res2361 = loop3952(Amid23949, Bmid13950, Blo3936);
          }
          var if_res2362 = if_res2361;
        }
        var if_res2363 = if_res2362;
      }
      return if_res2363;
    };
    var Alo3965 = 0;
    var Amid13966 = n_by_2_3932;
    var Amid23967 = n_by_2_plus_3933;
    var Ahi3968 = n3931;
    var B1lo3969 = n3931;
    copying_mergesort3934(Amid13966, B1lo3969, n_by_2_plus_3933);
    if (M0.zero_p(n_by_2_3932) !== false) {
      var if_res2364 = M0.rvoid();
    } else {
      var if_res2364 = copying_mergesort3934(Alo3965, Amid23967, n_by_2_3932);
    }
    if_res2364;
    var b23970 = Ahi3968;
    var loop3971 = function(a13972, b13973, c13974) {
      var x3975 = M1.unsafe_vector_ref(A3930, a13972);
      var y3976 = M1.unsafe_vector_ref(A3930, b13973);
      if (false !== false) {
        if (false !== false) {
          var if_res2365 = M0.char_gt__p(false(y3976), false(x3975));
        } else {
          var if_res2365 = M0.char_gt__p(y3976, x3975);
        }
        var if_res2367 = M0.not(if_res2365);
      } else {
        if (false !== false) {
          var if_res2366 = M0.char_gt__p(false(x3975), false(y3976));
        } else {
          var if_res2366 = M0.char_gt__p(x3975, y3976);
        }
        var if_res2367 = if_res2366;
      }
      if (if_res2367 !== false) {
        M1.unsafe_vector_set_bang_(A3930, c13974, x3975);
        var a13977 = M1.unsafe_fx_plus_(a13972, 1);
        var c13978 = M1.unsafe_fx_plus_(c13974, 1);
        if (M1.unsafe_fx_lt_(c13978, b13973) !== false) {
          var if_res2368 = loop3971(a13977, b13973, c13978);
        } else {
          var if_res2368 = M0.rvoid();
        }
        var if_res2371 = if_res2368;
      } else {
        M1.unsafe_vector_set_bang_(A3930, c13974, y3976);
        var b13979 = M1.unsafe_fx_plus_(b13973, 1);
        var c13980 = M1.unsafe_fx_plus_(c13974, 1);
        if (M1.unsafe_fx_lt__eq_(b23970, b13979) !== false) {
          var loop3981 = function(a13982, c13983) {
            if (M1.unsafe_fx_lt_(c13983, b13979) !== false) {
              M1.unsafe_vector_set_bang_(A3930, c13983, M1.unsafe_vector_ref(A3930, a13982));
              var if_res2369 = loop3981(M1.unsafe_fx_plus_(a13982, 1), M1.unsafe_fx_plus_(c13983, 1));
            } else {
              var if_res2369 = M0.rvoid();
            }
            return if_res2369;
          };
          var if_res2370 = loop3981(a13972, c13980);
        } else {
          var if_res2370 = loop3971(a13972, b13979, c13980);
        }
        var if_res2371 = if_res2370;
      }
      return if_res2371;
    };
    return loop3971(B1lo3969, Amid23967, Alo3965);
  };
  M0.hash_set_bang_(sorts3323, M0.char_gt__p, sort_proc3929);
  M0.hash_set_bang_(sorts3323, M0.char_gt__eq__p, sort_proc3929);
  var sort_proc3984 = function(A3985, n3986) {
    var n_by_2_3987 = M1.unsafe_fxrshift(n3986, 1);
    var n_by_2_plus_3988 = M1.unsafe_fx_(n3986, n_by_2_3987);
    var copying_mergesort3989 = function(Alo3990, Blo3991, n3992) {
      if (M1.unsafe_fx_eq_(n3992, 1) !== false) {
        var if_res2387 = M1.unsafe_vector_set_bang_(A3985, Blo3991, M1.unsafe_vector_ref(A3985, Alo3990));
      } else {
        if (M1.unsafe_fx_eq_(n3992, 2) !== false) {
          var x3993 = M1.unsafe_vector_ref(A3985, Alo3990);
          var y3994 = M1.unsafe_vector_ref(A3985, M1.unsafe_fx_plus_(Alo3990, 1));
          if (false !== false) {
            var if_res2372 = M0.__rjs_quoted__.keyword_lt__p(false(y3994), false(x3993));
          } else {
            var if_res2372 = M0.__rjs_quoted__.keyword_lt__p(y3994, x3993);
          }
          if (if_res2372 !== false) {
            M1.unsafe_vector_set_bang_(A3985, Blo3991, y3994);
            var if_res2373 = M1.unsafe_vector_set_bang_(A3985, M1.unsafe_fx_plus_(Blo3991, 1), x3993);
          } else {
            M1.unsafe_vector_set_bang_(A3985, Blo3991, x3993);
            var if_res2373 = M1.unsafe_vector_set_bang_(A3985, M1.unsafe_fx_plus_(Blo3991, 1), y3994);
          }
          var if_res2386 = if_res2373;
        } else {
          if (M1.unsafe_fx_lt_(n3992, 16) !== false) {
            M1.unsafe_vector_set_bang_(A3985, Blo3991, M1.unsafe_vector_ref(A3985, Alo3990));
            var iloop3995 = function(i3996) {
              if (M1.unsafe_fx_lt_(i3996, n3992) !== false) {
                var ref_i3997 = M1.unsafe_vector_ref(A3985, M1.unsafe_fx_plus_(Alo3990, i3996));
                var jloop3998 = function(j3999) {
                  var ref_j_14000 = M1.unsafe_vector_ref(A3985, M1.unsafe_fx_(j3999, 1));
                  if (M1.unsafe_fx_lt_(Blo3991, j3999) !== false) {
                    if (false !== false) {
                      var if_res2374 = M0.__rjs_quoted__.keyword_lt__p(false(ref_i3997), false(ref_j_14000));
                    } else {
                      var if_res2374 = M0.__rjs_quoted__.keyword_lt__p(ref_i3997, ref_j_14000);
                    }
                    var if_res2375 = if_res2374;
                  } else {
                    var if_res2375 = false;
                  }
                  if (if_res2375 !== false) {
                    M1.unsafe_vector_set_bang_(A3985, j3999, ref_j_14000);
                    var if_res2376 = jloop3998(M1.unsafe_fx_(j3999, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A3985, j3999, ref_i3997);
                    var if_res2376 = iloop3995(M1.unsafe_fx_plus_(i3996, 1));
                  }
                  return if_res2376;
                };
                var if_res2377 = jloop3998(M1.unsafe_fx_plus_(Blo3991, i3996));
              } else {
                var if_res2377 = M0.rvoid();
              }
              return if_res2377;
            };
            var if_res2385 = iloop3995(1);
          } else {
            var n_by_2_4001 = M1.unsafe_fxrshift(n3992, 1);
            var n_by_2_plus_4002 = M1.unsafe_fx_(n3992, n_by_2_4001);
            var Amid14003 = M1.unsafe_fx_plus_(Alo3990, n_by_2_4001);
            var Amid24004 = M1.unsafe_fx_plus_(Alo3990, n_by_2_plus_4002);
            var Bmid14005 = M1.unsafe_fx_plus_(Blo3991, n_by_2_4001);
            copying_mergesort3989(Amid14003, Bmid14005, n_by_2_plus_4002);
            copying_mergesort3989(Alo3990, Amid24004, n_by_2_4001);
            var b24006 = M1.unsafe_fx_plus_(Blo3991, n3992);
            var loop4007 = function(a14008, b14009, c14010) {
              var x4011 = M1.unsafe_vector_ref(A3985, a14008);
              var y4012 = M1.unsafe_vector_ref(A3985, b14009);
              if (true !== false) {
                if (false !== false) {
                  var if_res2378 = M0.__rjs_quoted__.keyword_lt__p(false(y4012), false(x4011));
                } else {
                  var if_res2378 = M0.__rjs_quoted__.keyword_lt__p(y4012, x4011);
                }
                var if_res2380 = M0.not(if_res2378);
              } else {
                if (false !== false) {
                  var if_res2379 = M0.__rjs_quoted__.keyword_lt__p(false(x4011), false(y4012));
                } else {
                  var if_res2379 = M0.__rjs_quoted__.keyword_lt__p(x4011, y4012);
                }
                var if_res2380 = if_res2379;
              }
              if (if_res2380 !== false) {
                M1.unsafe_vector_set_bang_(A3985, c14010, x4011);
                var a14013 = M1.unsafe_fx_plus_(a14008, 1);
                var c14014 = M1.unsafe_fx_plus_(c14010, 1);
                if (M1.unsafe_fx_lt_(c14014, b14009) !== false) {
                  var if_res2381 = loop4007(a14013, b14009, c14014);
                } else {
                  var if_res2381 = M0.rvoid();
                }
                var if_res2384 = if_res2381;
              } else {
                M1.unsafe_vector_set_bang_(A3985, c14010, y4012);
                var b14015 = M1.unsafe_fx_plus_(b14009, 1);
                var c14016 = M1.unsafe_fx_plus_(c14010, 1);
                if (M1.unsafe_fx_lt__eq_(b24006, b14015) !== false) {
                  var loop4017 = function(a14018, c14019) {
                    if (M1.unsafe_fx_lt_(c14019, b14015) !== false) {
                      M1.unsafe_vector_set_bang_(A3985, c14019, M1.unsafe_vector_ref(A3985, a14018));
                      var if_res2382 = loop4017(M1.unsafe_fx_plus_(a14018, 1), M1.unsafe_fx_plus_(c14019, 1));
                    } else {
                      var if_res2382 = M0.rvoid();
                    }
                    return if_res2382;
                  };
                  var if_res2383 = loop4017(a14008, c14016);
                } else {
                  var if_res2383 = loop4007(a14008, b14015, c14016);
                }
                var if_res2384 = if_res2383;
              }
              return if_res2384;
            };
            var if_res2385 = loop4007(Amid24004, Bmid14005, Blo3991);
          }
          var if_res2386 = if_res2385;
        }
        var if_res2387 = if_res2386;
      }
      return if_res2387;
    };
    var Alo4020 = 0;
    var Amid14021 = n_by_2_3987;
    var Amid24022 = n_by_2_plus_3988;
    var Ahi4023 = n3986;
    var B1lo4024 = n3986;
    copying_mergesort3989(Amid14021, B1lo4024, n_by_2_plus_3988);
    if (M0.zero_p(n_by_2_3987) !== false) {
      var if_res2388 = M0.rvoid();
    } else {
      var if_res2388 = copying_mergesort3989(Alo4020, Amid24022, n_by_2_3987);
    }
    if_res2388;
    var b24025 = Ahi4023;
    var loop4026 = function(a14027, b14028, c14029) {
      var x4030 = M1.unsafe_vector_ref(A3985, a14027);
      var y4031 = M1.unsafe_vector_ref(A3985, b14028);
      if (false !== false) {
        if (false !== false) {
          var if_res2389 = M0.__rjs_quoted__.keyword_lt__p(false(y4031), false(x4030));
        } else {
          var if_res2389 = M0.__rjs_quoted__.keyword_lt__p(y4031, x4030);
        }
        var if_res2391 = M0.not(if_res2389);
      } else {
        if (false !== false) {
          var if_res2390 = M0.__rjs_quoted__.keyword_lt__p(false(x4030), false(y4031));
        } else {
          var if_res2390 = M0.__rjs_quoted__.keyword_lt__p(x4030, y4031);
        }
        var if_res2391 = if_res2390;
      }
      if (if_res2391 !== false) {
        M1.unsafe_vector_set_bang_(A3985, c14029, x4030);
        var a14032 = M1.unsafe_fx_plus_(a14027, 1);
        var c14033 = M1.unsafe_fx_plus_(c14029, 1);
        if (M1.unsafe_fx_lt_(c14033, b14028) !== false) {
          var if_res2392 = loop4026(a14032, b14028, c14033);
        } else {
          var if_res2392 = M0.rvoid();
        }
        var if_res2395 = if_res2392;
      } else {
        M1.unsafe_vector_set_bang_(A3985, c14029, y4031);
        var b14034 = M1.unsafe_fx_plus_(b14028, 1);
        var c14035 = M1.unsafe_fx_plus_(c14029, 1);
        if (M1.unsafe_fx_lt__eq_(b24025, b14034) !== false) {
          var loop4036 = function(a14037, c14038) {
            if (M1.unsafe_fx_lt_(c14038, b14034) !== false) {
              M1.unsafe_vector_set_bang_(A3985, c14038, M1.unsafe_vector_ref(A3985, a14037));
              var if_res2393 = loop4036(M1.unsafe_fx_plus_(a14037, 1), M1.unsafe_fx_plus_(c14038, 1));
            } else {
              var if_res2393 = M0.rvoid();
            }
            return if_res2393;
          };
          var if_res2394 = loop4036(a14027, c14035);
        } else {
          var if_res2394 = loop4026(a14027, b14034, c14035);
        }
        var if_res2395 = if_res2394;
      }
      return if_res2395;
    };
    return loop4026(B1lo4024, Amid24022, Alo4020);
  };
  M0.hash_set_bang_(sorts3323, M0.__rjs_quoted__.keyword_lt__p, sort_proc3984);
  var precompiled_sorts3322 = M0.make_immutable_hasheq(M0.hash_map(sorts3323, M0.cons));
  var generic_sort4039 = function(A4040, less_than_p4041, n4042) {
    var n_by_2_4043 = M1.unsafe_fxrshift(n4042, 1);
    var n_by_2_plus_4044 = M1.unsafe_fx_(n4042, n_by_2_4043);
    var copying_mergesort4045 = function(Alo4046, Blo4047, n4048) {
      if (M1.unsafe_fx_eq_(n4048, 1) !== false) {
        var if_res2411 = M1.unsafe_vector_set_bang_(A4040, Blo4047, M1.unsafe_vector_ref(A4040, Alo4046));
      } else {
        if (M1.unsafe_fx_eq_(n4048, 2) !== false) {
          var x4049 = M1.unsafe_vector_ref(A4040, Alo4046);
          var y4050 = M1.unsafe_vector_ref(A4040, M1.unsafe_fx_plus_(Alo4046, 1));
          if (false !== false) {
            var if_res2396 = less_than_p4041(false(y4050), false(x4049));
          } else {
            var if_res2396 = less_than_p4041(y4050, x4049);
          }
          if (if_res2396 !== false) {
            M1.unsafe_vector_set_bang_(A4040, Blo4047, y4050);
            var if_res2397 = M1.unsafe_vector_set_bang_(A4040, M1.unsafe_fx_plus_(Blo4047, 1), x4049);
          } else {
            M1.unsafe_vector_set_bang_(A4040, Blo4047, x4049);
            var if_res2397 = M1.unsafe_vector_set_bang_(A4040, M1.unsafe_fx_plus_(Blo4047, 1), y4050);
          }
          var if_res2410 = if_res2397;
        } else {
          if (M1.unsafe_fx_lt_(n4048, 16) !== false) {
            M1.unsafe_vector_set_bang_(A4040, Blo4047, M1.unsafe_vector_ref(A4040, Alo4046));
            var iloop4051 = function(i4052) {
              if (M1.unsafe_fx_lt_(i4052, n4048) !== false) {
                var ref_i4053 = M1.unsafe_vector_ref(A4040, M1.unsafe_fx_plus_(Alo4046, i4052));
                var jloop4054 = function(j4055) {
                  var ref_j_14056 = M1.unsafe_vector_ref(A4040, M1.unsafe_fx_(j4055, 1));
                  if (M1.unsafe_fx_lt_(Blo4047, j4055) !== false) {
                    if (false !== false) {
                      var if_res2398 = less_than_p4041(false(ref_i4053), false(ref_j_14056));
                    } else {
                      var if_res2398 = less_than_p4041(ref_i4053, ref_j_14056);
                    }
                    var if_res2399 = if_res2398;
                  } else {
                    var if_res2399 = false;
                  }
                  if (if_res2399 !== false) {
                    M1.unsafe_vector_set_bang_(A4040, j4055, ref_j_14056);
                    var if_res2400 = jloop4054(M1.unsafe_fx_(j4055, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A4040, j4055, ref_i4053);
                    var if_res2400 = iloop4051(M1.unsafe_fx_plus_(i4052, 1));
                  }
                  return if_res2400;
                };
                var if_res2401 = jloop4054(M1.unsafe_fx_plus_(Blo4047, i4052));
              } else {
                var if_res2401 = M0.rvoid();
              }
              return if_res2401;
            };
            var if_res2409 = iloop4051(1);
          } else {
            var n_by_2_4057 = M1.unsafe_fxrshift(n4048, 1);
            var n_by_2_plus_4058 = M1.unsafe_fx_(n4048, n_by_2_4057);
            var Amid14059 = M1.unsafe_fx_plus_(Alo4046, n_by_2_4057);
            var Amid24060 = M1.unsafe_fx_plus_(Alo4046, n_by_2_plus_4058);
            var Bmid14061 = M1.unsafe_fx_plus_(Blo4047, n_by_2_4057);
            copying_mergesort4045(Amid14059, Bmid14061, n_by_2_plus_4058);
            copying_mergesort4045(Alo4046, Amid24060, n_by_2_4057);
            var b24062 = M1.unsafe_fx_plus_(Blo4047, n4048);
            var loop4063 = function(a14064, b14065, c14066) {
              var x4067 = M1.unsafe_vector_ref(A4040, a14064);
              var y4068 = M1.unsafe_vector_ref(A4040, b14065);
              if (true !== false) {
                if (false !== false) {
                  var if_res2402 = less_than_p4041(false(y4068), false(x4067));
                } else {
                  var if_res2402 = less_than_p4041(y4068, x4067);
                }
                var if_res2404 = M0.not(if_res2402);
              } else {
                if (false !== false) {
                  var if_res2403 = less_than_p4041(false(x4067), false(y4068));
                } else {
                  var if_res2403 = less_than_p4041(x4067, y4068);
                }
                var if_res2404 = if_res2403;
              }
              if (if_res2404 !== false) {
                M1.unsafe_vector_set_bang_(A4040, c14066, x4067);
                var a14069 = M1.unsafe_fx_plus_(a14064, 1);
                var c14070 = M1.unsafe_fx_plus_(c14066, 1);
                if (M1.unsafe_fx_lt_(c14070, b14065) !== false) {
                  var if_res2405 = loop4063(a14069, b14065, c14070);
                } else {
                  var if_res2405 = M0.rvoid();
                }
                var if_res2408 = if_res2405;
              } else {
                M1.unsafe_vector_set_bang_(A4040, c14066, y4068);
                var b14071 = M1.unsafe_fx_plus_(b14065, 1);
                var c14072 = M1.unsafe_fx_plus_(c14066, 1);
                if (M1.unsafe_fx_lt__eq_(b24062, b14071) !== false) {
                  var loop4073 = function(a14074, c14075) {
                    if (M1.unsafe_fx_lt_(c14075, b14071) !== false) {
                      M1.unsafe_vector_set_bang_(A4040, c14075, M1.unsafe_vector_ref(A4040, a14074));
                      var if_res2406 = loop4073(M1.unsafe_fx_plus_(a14074, 1), M1.unsafe_fx_plus_(c14075, 1));
                    } else {
                      var if_res2406 = M0.rvoid();
                    }
                    return if_res2406;
                  };
                  var if_res2407 = loop4073(a14064, c14072);
                } else {
                  var if_res2407 = loop4063(a14064, b14071, c14072);
                }
                var if_res2408 = if_res2407;
              }
              return if_res2408;
            };
            var if_res2409 = loop4063(Amid24060, Bmid14061, Blo4047);
          }
          var if_res2410 = if_res2409;
        }
        var if_res2411 = if_res2410;
      }
      return if_res2411;
    };
    var Alo4076 = 0;
    var Amid14077 = n_by_2_4043;
    var Amid24078 = n_by_2_plus_4044;
    var Ahi4079 = n4042;
    var B1lo4080 = n4042;
    copying_mergesort4045(Amid14077, B1lo4080, n_by_2_plus_4044);
    if (M0.zero_p(n_by_2_4043) !== false) {
      var if_res2412 = M0.rvoid();
    } else {
      var if_res2412 = copying_mergesort4045(Alo4076, Amid24078, n_by_2_4043);
    }
    if_res2412;
    var b24081 = Ahi4079;
    var loop4082 = function(a14083, b14084, c14085) {
      var x4086 = M1.unsafe_vector_ref(A4040, a14083);
      var y4087 = M1.unsafe_vector_ref(A4040, b14084);
      if (false !== false) {
        if (false !== false) {
          var if_res2413 = less_than_p4041(false(y4087), false(x4086));
        } else {
          var if_res2413 = less_than_p4041(y4087, x4086);
        }
        var if_res2415 = M0.not(if_res2413);
      } else {
        if (false !== false) {
          var if_res2414 = less_than_p4041(false(x4086), false(y4087));
        } else {
          var if_res2414 = less_than_p4041(x4086, y4087);
        }
        var if_res2415 = if_res2414;
      }
      if (if_res2415 !== false) {
        M1.unsafe_vector_set_bang_(A4040, c14085, x4086);
        var a14088 = M1.unsafe_fx_plus_(a14083, 1);
        var c14089 = M1.unsafe_fx_plus_(c14085, 1);
        if (M1.unsafe_fx_lt_(c14089, b14084) !== false) {
          var if_res2416 = loop4082(a14088, b14084, c14089);
        } else {
          var if_res2416 = M0.rvoid();
        }
        var if_res2419 = if_res2416;
      } else {
        M1.unsafe_vector_set_bang_(A4040, c14085, y4087);
        var b14090 = M1.unsafe_fx_plus_(b14084, 1);
        var c14091 = M1.unsafe_fx_plus_(c14085, 1);
        if (M1.unsafe_fx_lt__eq_(b24081, b14090) !== false) {
          var loop4092 = function(a14093, c14094) {
            if (M1.unsafe_fx_lt_(c14094, b14090) !== false) {
              M1.unsafe_vector_set_bang_(A4040, c14094, M1.unsafe_vector_ref(A4040, a14093));
              var if_res2417 = loop4092(M1.unsafe_fx_plus_(a14093, 1), M1.unsafe_fx_plus_(c14094, 1));
            } else {
              var if_res2417 = M0.rvoid();
            }
            return if_res2417;
          };
          var if_res2418 = loop4092(a14083, c14091);
        } else {
          var if_res2418 = loop4082(a14083, b14090, c14091);
        }
        var if_res2419 = if_res2418;
      }
      return if_res2419;
    };
    return loop4082(B1lo4080, Amid24078, Alo4076);
  };
  var generic_sort_by_key4095 = function(A4096, less_than_p4097, n4098, key4099) {
    var n_by_2_4100 = M1.unsafe_fxrshift(n4098, 1);
    var n_by_2_plus_4101 = M1.unsafe_fx_(n4098, n_by_2_4100);
    var copying_mergesort4102 = function(Alo4103, Blo4104, n4105) {
      if (M1.unsafe_fx_eq_(n4105, 1) !== false) {
        var if_res2435 = M1.unsafe_vector_set_bang_(A4096, Blo4104, M1.unsafe_vector_ref(A4096, Alo4103));
      } else {
        if (M1.unsafe_fx_eq_(n4105, 2) !== false) {
          var x4106 = M1.unsafe_vector_ref(A4096, Alo4103);
          var y4107 = M1.unsafe_vector_ref(A4096, M1.unsafe_fx_plus_(Alo4103, 1));
          if (key4099 !== false) {
            var if_res2420 = less_than_p4097(key4099(y4107), key4099(x4106));
          } else {
            var if_res2420 = less_than_p4097(y4107, x4106);
          }
          if (if_res2420 !== false) {
            M1.unsafe_vector_set_bang_(A4096, Blo4104, y4107);
            var if_res2421 = M1.unsafe_vector_set_bang_(A4096, M1.unsafe_fx_plus_(Blo4104, 1), x4106);
          } else {
            M1.unsafe_vector_set_bang_(A4096, Blo4104, x4106);
            var if_res2421 = M1.unsafe_vector_set_bang_(A4096, M1.unsafe_fx_plus_(Blo4104, 1), y4107);
          }
          var if_res2434 = if_res2421;
        } else {
          if (M1.unsafe_fx_lt_(n4105, 16) !== false) {
            M1.unsafe_vector_set_bang_(A4096, Blo4104, M1.unsafe_vector_ref(A4096, Alo4103));
            var iloop4108 = function(i4109) {
              if (M1.unsafe_fx_lt_(i4109, n4105) !== false) {
                var ref_i4110 = M1.unsafe_vector_ref(A4096, M1.unsafe_fx_plus_(Alo4103, i4109));
                var jloop4111 = function(j4112) {
                  var ref_j_14113 = M1.unsafe_vector_ref(A4096, M1.unsafe_fx_(j4112, 1));
                  if (M1.unsafe_fx_lt_(Blo4104, j4112) !== false) {
                    if (key4099 !== false) {
                      var if_res2422 = less_than_p4097(key4099(ref_i4110), key4099(ref_j_14113));
                    } else {
                      var if_res2422 = less_than_p4097(ref_i4110, ref_j_14113);
                    }
                    var if_res2423 = if_res2422;
                  } else {
                    var if_res2423 = false;
                  }
                  if (if_res2423 !== false) {
                    M1.unsafe_vector_set_bang_(A4096, j4112, ref_j_14113);
                    var if_res2424 = jloop4111(M1.unsafe_fx_(j4112, 1));
                  } else {
                    M1.unsafe_vector_set_bang_(A4096, j4112, ref_i4110);
                    var if_res2424 = iloop4108(M1.unsafe_fx_plus_(i4109, 1));
                  }
                  return if_res2424;
                };
                var if_res2425 = jloop4111(M1.unsafe_fx_plus_(Blo4104, i4109));
              } else {
                var if_res2425 = M0.rvoid();
              }
              return if_res2425;
            };
            var if_res2433 = iloop4108(1);
          } else {
            var n_by_2_4114 = M1.unsafe_fxrshift(n4105, 1);
            var n_by_2_plus_4115 = M1.unsafe_fx_(n4105, n_by_2_4114);
            var Amid14116 = M1.unsafe_fx_plus_(Alo4103, n_by_2_4114);
            var Amid24117 = M1.unsafe_fx_plus_(Alo4103, n_by_2_plus_4115);
            var Bmid14118 = M1.unsafe_fx_plus_(Blo4104, n_by_2_4114);
            copying_mergesort4102(Amid14116, Bmid14118, n_by_2_plus_4115);
            copying_mergesort4102(Alo4103, Amid24117, n_by_2_4114);
            var b24119 = M1.unsafe_fx_plus_(Blo4104, n4105);
            var loop4120 = function(a14121, b14122, c14123) {
              var x4124 = M1.unsafe_vector_ref(A4096, a14121);
              var y4125 = M1.unsafe_vector_ref(A4096, b14122);
              if (true !== false) {
                if (key4099 !== false) {
                  var if_res2426 = less_than_p4097(key4099(y4125), key4099(x4124));
                } else {
                  var if_res2426 = less_than_p4097(y4125, x4124);
                }
                var if_res2428 = M0.not(if_res2426);
              } else {
                if (key4099 !== false) {
                  var if_res2427 = less_than_p4097(key4099(x4124), key4099(y4125));
                } else {
                  var if_res2427 = less_than_p4097(x4124, y4125);
                }
                var if_res2428 = if_res2427;
              }
              if (if_res2428 !== false) {
                M1.unsafe_vector_set_bang_(A4096, c14123, x4124);
                var a14126 = M1.unsafe_fx_plus_(a14121, 1);
                var c14127 = M1.unsafe_fx_plus_(c14123, 1);
                if (M1.unsafe_fx_lt_(c14127, b14122) !== false) {
                  var if_res2429 = loop4120(a14126, b14122, c14127);
                } else {
                  var if_res2429 = M0.rvoid();
                }
                var if_res2432 = if_res2429;
              } else {
                M1.unsafe_vector_set_bang_(A4096, c14123, y4125);
                var b14128 = M1.unsafe_fx_plus_(b14122, 1);
                var c14129 = M1.unsafe_fx_plus_(c14123, 1);
                if (M1.unsafe_fx_lt__eq_(b24119, b14128) !== false) {
                  var loop4130 = function(a14131, c14132) {
                    if (M1.unsafe_fx_lt_(c14132, b14128) !== false) {
                      M1.unsafe_vector_set_bang_(A4096, c14132, M1.unsafe_vector_ref(A4096, a14131));
                      var if_res2430 = loop4130(M1.unsafe_fx_plus_(a14131, 1), M1.unsafe_fx_plus_(c14132, 1));
                    } else {
                      var if_res2430 = M0.rvoid();
                    }
                    return if_res2430;
                  };
                  var if_res2431 = loop4130(a14121, c14129);
                } else {
                  var if_res2431 = loop4120(a14121, b14128, c14129);
                }
                var if_res2432 = if_res2431;
              }
              return if_res2432;
            };
            var if_res2433 = loop4120(Amid24117, Bmid14118, Blo4104);
          }
          var if_res2434 = if_res2433;
        }
        var if_res2435 = if_res2434;
      }
      return if_res2435;
    };
    var Alo4133 = 0;
    var Amid14134 = n_by_2_4100;
    var Amid24135 = n_by_2_plus_4101;
    var Ahi4136 = n4098;
    var B1lo4137 = n4098;
    copying_mergesort4102(Amid14134, B1lo4137, n_by_2_plus_4101);
    if (M0.zero_p(n_by_2_4100) !== false) {
      var if_res2436 = M0.rvoid();
    } else {
      var if_res2436 = copying_mergesort4102(Alo4133, Amid24135, n_by_2_4100);
    }
    if_res2436;
    var b24138 = Ahi4136;
    var loop4139 = function(a14140, b14141, c14142) {
      var x4143 = M1.unsafe_vector_ref(A4096, a14140);
      var y4144 = M1.unsafe_vector_ref(A4096, b14141);
      if (false !== false) {
        if (key4099 !== false) {
          var if_res2437 = less_than_p4097(key4099(y4144), key4099(x4143));
        } else {
          var if_res2437 = less_than_p4097(y4144, x4143);
        }
        var if_res2439 = M0.not(if_res2437);
      } else {
        if (key4099 !== false) {
          var if_res2438 = less_than_p4097(key4099(x4143), key4099(y4144));
        } else {
          var if_res2438 = less_than_p4097(x4143, y4144);
        }
        var if_res2439 = if_res2438;
      }
      if (if_res2439 !== false) {
        M1.unsafe_vector_set_bang_(A4096, c14142, x4143);
        var a14145 = M1.unsafe_fx_plus_(a14140, 1);
        var c14146 = M1.unsafe_fx_plus_(c14142, 1);
        if (M1.unsafe_fx_lt_(c14146, b14141) !== false) {
          var if_res2440 = loop4139(a14145, b14141, c14146);
        } else {
          var if_res2440 = M0.rvoid();
        }
        var if_res2443 = if_res2440;
      } else {
        M1.unsafe_vector_set_bang_(A4096, c14142, y4144);
        var b14147 = M1.unsafe_fx_plus_(b14141, 1);
        var c14148 = M1.unsafe_fx_plus_(c14142, 1);
        if (M1.unsafe_fx_lt__eq_(b24138, b14147) !== false) {
          var loop4149 = function(a14150, c14151) {
            if (M1.unsafe_fx_lt_(c14151, b14147) !== false) {
              M1.unsafe_vector_set_bang_(A4096, c14151, M1.unsafe_vector_ref(A4096, a14150));
              var if_res2441 = loop4149(M1.unsafe_fx_plus_(a14150, 1), M1.unsafe_fx_plus_(c14151, 1));
            } else {
              var if_res2441 = M0.rvoid();
            }
            return if_res2441;
          };
          var if_res2442 = loop4149(a14140, c14148);
        } else {
          var if_res2442 = loop4139(a14140, b14147, c14148);
        }
        var if_res2443 = if_res2442;
      }
      return if_res2443;
    };
    return loop4139(B1lo4137, Amid24135, Alo4133);
  };
  var cl2553 = function(lst4152, less_than_p4153) {
    var n4154 = M0.length(lst4152);
    if (M1.unsafe_fx_eq_(n4154, 0) !== false) {
      var if_res2578 = lst4152;
    } else {
      if (false !== false) {
        var vec4155 = M0.make_vector(n4154 + M0.ceiling(n4154 / 2));
        var loop4156 = function(i4157, lst4158) {
          if (M0.pair_p(lst4158) !== false) {
            var x4159 = M0.car(lst4158);
            M1.unsafe_vector_set_bang_(vec4155, i4157, M0.cons(false(x4159), x4159));
            var if_res2557 = loop4156(M1.unsafe_fx_plus_(i4157, 1), M0.cdr(lst4158));
          } else {
            var if_res2557 = M0.rvoid();
          }
          return if_res2557;
        };
        loop4156(0, lst4152);
        generic_sort_by_key4095(vec4155, less_than_p4153, n4154, M1.unsafe_car);
        var loop4160 = function(i4161, r4162) {
          var i4163 = M1.unsafe_fx_(i4161, 1);
          if (M1.unsafe_fx_lt_(i4163, 0) !== false) {
            var if_res2558 = r4162;
          } else {
            var if_res2558 = loop4160(i4163, M0.cons(M1.unsafe_cdr(M1.unsafe_vector_ref(vec4155, i4163)), r4162));
          }
          return if_res2558;
        };
        var if_res2577 = loop4160(n4154, $rjs_core.Pair.Empty);
      } else {
        var loop4164 = function(last4165, next4166) {
          var or_part4167 = M0.null_p(next4166);
          if (or_part4167 !== false) {
            var if_res2561 = or_part4167;
          } else {
            if (false !== false) {
              var if_res2559 = less_than_p4153(false(M1.unsafe_car(next4166)), false(last4165));
            } else {
              var if_res2559 = less_than_p4153(M1.unsafe_car(next4166), last4165);
            }
            if (M0.not(if_res2559) !== false) {
              var if_res2560 = loop4164(M1.unsafe_car(next4166), M1.unsafe_cdr(next4166));
            } else {
              var if_res2560 = false;
            }
            var if_res2561 = if_res2560;
          }
          return if_res2561;
        };
        if (loop4164(M0.car(lst4152), M0.cdr(lst4152)) !== false) {
          var if_res2576 = lst4152;
        } else {
          if (M1.unsafe_fx_lt__eq_(n4154, 3) !== false) {
            if (M1.unsafe_fx_eq_(n4154, 1) !== false) {
              var if_res2571 = lst4152;
            } else {
              if (M1.unsafe_fx_eq_(n4154, 2) !== false) {
                var if_res2570 = M0.list(M0.cadr(lst4152), M0.car(lst4152));
              } else {
                var a4168 = M0.car(lst4152);
                var b4169 = M0.cadr(lst4152);
                var c4170 = M0.caddr(lst4152);
                if (false !== false) {
                  var if_res2562 = less_than_p4153(false(b4169), false(a4168));
                } else {
                  var if_res2562 = less_than_p4153(b4169, a4168);
                }
                if (if_res2562 !== false) {
                  if (false !== false) {
                    var if_res2563 = less_than_p4153(false(c4170), false(b4169));
                  } else {
                    var if_res2563 = less_than_p4153(c4170, b4169);
                  }
                  if (if_res2563 !== false) {
                    var if_res2566 = M0.list(c4170, b4169, a4168);
                  } else {
                    if (false !== false) {
                      var if_res2564 = less_than_p4153(false(c4170), false(a4168));
                    } else {
                      var if_res2564 = less_than_p4153(c4170, a4168);
                    }
                    if (if_res2564 !== false) {
                      var if_res2565 = M0.list(b4169, c4170, a4168);
                    } else {
                      var if_res2565 = M0.list(b4169, a4168, c4170);
                    }
                    var if_res2566 = if_res2565;
                  }
                  var if_res2569 = if_res2566;
                } else {
                  if (false !== false) {
                    var if_res2567 = less_than_p4153(false(c4170), false(a4168));
                  } else {
                    var if_res2567 = less_than_p4153(c4170, a4168);
                  }
                  if (if_res2567 !== false) {
                    var if_res2568 = M0.list(c4170, a4168, b4169);
                  } else {
                    var if_res2568 = M0.list(a4168, c4170, b4169);
                  }
                  var if_res2569 = if_res2568;
                }
                var if_res2570 = if_res2569;
              }
              var if_res2571 = if_res2570;
            }
            var if_res2575 = if_res2571;
          } else {
            var vec4171 = M0.make_vector(n4154 + M0.ceiling(n4154 / 2));
            var loop4172 = function(i4173, lst4174) {
              if (M0.pair_p(lst4174) !== false) {
                M0.vector_set_bang_(vec4171, i4173, M0.car(lst4174));
                var if_res2572 = loop4172(M0.add1(i4173), M0.cdr(lst4174));
              } else {
                var if_res2572 = M0.rvoid();
              }
              return if_res2572;
            };
            loop4172(0, lst4152);
            var precomp4175 = M0.hash_ref(precompiled_sorts3322, less_than_p4153, false);
            if (precomp4175 !== false) {
              var if_res2573 = precomp4175(vec4171, n4154);
            } else {
              var if_res2573 = generic_sort4039(vec4171, less_than_p4153, n4154);
            }
            if_res2573;
            var loop4176 = function(i4177, r4178) {
              var i4179 = M0.sub1(i4177);
              if (M0._lt_(i4179, 0) !== false) {
                var if_res2574 = r4178;
              } else {
                var if_res2574 = loop4176(i4179, M0.cons(M0.vector_ref(vec4171, i4179), r4178));
              }
              return if_res2574;
            };
            var if_res2575 = loop4176(n4154, $rjs_core.Pair.Empty);
          }
          var if_res2576 = if_res2575;
        }
        var if_res2577 = if_res2576;
      }
      var if_res2578 = if_res2577;
    }
    return if_res2578;
  };
  var cl2554 = function(lst4180, less_than_p4181, getkey4182) {
    if (getkey4182 !== false) {
      var if_res2579 = M0.not(M0.eq_p(M0.values, getkey4182));
    } else {
      var if_res2579 = false;
    }
    if (if_res2579 !== false) {
      var if_res2580 = sort(lst4180, less_than_p4181, getkey4182, false);
    } else {
      var if_res2580 = sort(lst4180, less_than_p4181);
    }
    return if_res2580;
  };
  var cl2555 = function(lst4183, less_than_p4184, getkey4185, cache_keys_p4186) {
    if (getkey4185 !== false) {
      var if_res2581 = M0.not(M0.eq_p(M0.values, getkey4185));
    } else {
      var if_res2581 = false;
    }
    if (if_res2581 !== false) {
      var n4187 = M0.length(lst4183);
      if (M1.unsafe_fx_eq_(n4187, 0) !== false) {
        var if_res2602 = lst4183;
      } else {
        if (cache_keys_p4186 !== false) {
          var vec4188 = M0.make_vector(n4187 + M0.ceiling(n4187 / 2));
          var loop4189 = function(i4190, lst4191) {
            if (M0.pair_p(lst4191) !== false) {
              var x4192 = M0.car(lst4191);
              M1.unsafe_vector_set_bang_(vec4188, i4190, M0.cons(getkey4185(x4192), x4192));
              var if_res2582 = loop4189(M1.unsafe_fx_plus_(i4190, 1), M0.cdr(lst4191));
            } else {
              var if_res2582 = M0.rvoid();
            }
            return if_res2582;
          };
          loop4189(0, lst4183);
          generic_sort_by_key4095(vec4188, less_than_p4184, n4187, M1.unsafe_car);
          var loop4193 = function(i4194, r4195) {
            var i4196 = M1.unsafe_fx_(i4194, 1);
            if (M1.unsafe_fx_lt_(i4196, 0) !== false) {
              var if_res2583 = r4195;
            } else {
              var if_res2583 = loop4193(i4196, M0.cons(M1.unsafe_cdr(M1.unsafe_vector_ref(vec4188, i4196)), r4195));
            }
            return if_res2583;
          };
          var if_res2601 = loop4193(n4187, $rjs_core.Pair.Empty);
        } else {
          var loop4197 = function(last4198, next4199) {
            var or_part4200 = M0.null_p(next4199);
            if (or_part4200 !== false) {
              var if_res2586 = or_part4200;
            } else {
              if (getkey4185 !== false) {
                var if_res2584 = less_than_p4184(getkey4185(M1.unsafe_car(next4199)), getkey4185(last4198));
              } else {
                var if_res2584 = less_than_p4184(M1.unsafe_car(next4199), last4198);
              }
              if (M0.not(if_res2584) !== false) {
                var if_res2585 = loop4197(M1.unsafe_car(next4199), M1.unsafe_cdr(next4199));
              } else {
                var if_res2585 = false;
              }
              var if_res2586 = if_res2585;
            }
            return if_res2586;
          };
          if (loop4197(M0.car(lst4183), M0.cdr(lst4183)) !== false) {
            var if_res2600 = lst4183;
          } else {
            if (M1.unsafe_fx_lt__eq_(n4187, 3) !== false) {
              if (M1.unsafe_fx_eq_(n4187, 1) !== false) {
                var if_res2596 = lst4183;
              } else {
                if (M1.unsafe_fx_eq_(n4187, 2) !== false) {
                  var if_res2595 = M0.list(M0.cadr(lst4183), M0.car(lst4183));
                } else {
                  var a4201 = M0.car(lst4183);
                  var b4202 = M0.cadr(lst4183);
                  var c4203 = M0.caddr(lst4183);
                  if (getkey4185 !== false) {
                    var if_res2587 = less_than_p4184(getkey4185(b4202), getkey4185(a4201));
                  } else {
                    var if_res2587 = less_than_p4184(b4202, a4201);
                  }
                  if (if_res2587 !== false) {
                    if (getkey4185 !== false) {
                      var if_res2588 = less_than_p4184(getkey4185(c4203), getkey4185(b4202));
                    } else {
                      var if_res2588 = less_than_p4184(c4203, b4202);
                    }
                    if (if_res2588 !== false) {
                      var if_res2591 = M0.list(c4203, b4202, a4201);
                    } else {
                      if (getkey4185 !== false) {
                        var if_res2589 = less_than_p4184(getkey4185(c4203), getkey4185(a4201));
                      } else {
                        var if_res2589 = less_than_p4184(c4203, a4201);
                      }
                      if (if_res2589 !== false) {
                        var if_res2590 = M0.list(b4202, c4203, a4201);
                      } else {
                        var if_res2590 = M0.list(b4202, a4201, c4203);
                      }
                      var if_res2591 = if_res2590;
                    }
                    var if_res2594 = if_res2591;
                  } else {
                    if (getkey4185 !== false) {
                      var if_res2592 = less_than_p4184(getkey4185(c4203), getkey4185(a4201));
                    } else {
                      var if_res2592 = less_than_p4184(c4203, a4201);
                    }
                    if (if_res2592 !== false) {
                      var if_res2593 = M0.list(c4203, a4201, b4202);
                    } else {
                      var if_res2593 = M0.list(a4201, c4203, b4202);
                    }
                    var if_res2594 = if_res2593;
                  }
                  var if_res2595 = if_res2594;
                }
                var if_res2596 = if_res2595;
              }
              var if_res2599 = if_res2596;
            } else {
              var vec4204 = M0.make_vector(n4187 + M0.ceiling(n4187 / 2));
              var loop4205 = function(i4206, lst4207) {
                if (M0.pair_p(lst4207) !== false) {
                  M0.vector_set_bang_(vec4204, i4206, M0.car(lst4207));
                  var if_res2597 = loop4205(M0.add1(i4206), M0.cdr(lst4207));
                } else {
                  var if_res2597 = M0.rvoid();
                }
                return if_res2597;
              };
              loop4205(0, lst4183);
              generic_sort_by_key4095(vec4204, less_than_p4184, n4187, getkey4185);
              var loop4208 = function(i4209, r4210) {
                var i4211 = M0.sub1(i4209);
                if (M0._lt_(i4211, 0) !== false) {
                  var if_res2598 = r4210;
                } else {
                  var if_res2598 = loop4208(i4211, M0.cons(M0.vector_ref(vec4204, i4211), r4210));
                }
                return if_res2598;
              };
              var if_res2599 = loop4208(n4187, $rjs_core.Pair.Empty);
            }
            var if_res2600 = if_res2599;
          }
          var if_res2601 = if_res2600;
        }
        var if_res2602 = if_res2601;
      }
      var if_res2603 = if_res2602;
    } else {
      var if_res2603 = sort(lst4183, less_than_p4184);
    }
    return if_res2603;
  };
  var temp2604 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2556 = {
      '2': cl2553,
      '3': cl2554,
      '4': cl2555
    }[arguments.length];
    if (fixed_lam2556 !== undefined !== false) {
      return fixed_lam2556.apply(null, arguments);
    } else {
      return M0.error("case-lambda: invalid case");
    }
  }, [2, 3, 4]);
  var cl2498 = function(vec4212, less_than_p4213, start4214, end4215) {
    var n4216 = end4215 - start4214;
    if (true !== false) {
      var if_res2501 = M0.make_vector(n4216);
    } else {
      var if_res2501 = vec4212;
    }
    var dst_vec4217 = if_res2501;
    if (true !== false) {
      var if_res2502 = 0;
    } else {
      var if_res2502 = start4214;
    }
    var dst_start4218 = if_res2502;
    if (M1.unsafe_fx_eq_(n4216, 0) !== false) {
      var if_res2524 = M0.rvoid();
    } else {
      if (false !== false) {
        var work_vec4219 = M0.make_vector(n4216 + M0.ceiling(n4216 / 2), true);
        var loop4220 = function(i4221) {
          if (M1.unsafe_fx_lt_(i4221, n4216) !== false) {
            var x4222 = M1.unsafe_vector_ref(vec4212, M1.unsafe_fx_plus_(i4221, start4214));
            M1.unsafe_vector_set_bang_(work_vec4219, i4221, M0.cons(false(x4222), x4222));
            var if_res2503 = loop4220(M1.unsafe_fx_plus_(i4221, 1));
          } else {
            var if_res2503 = M0.rvoid();
          }
          return if_res2503;
        };
        loop4220(0);
        generic_sort_by_key4095(work_vec4219, less_than_p4213, n4216, M1.unsafe_car);
        var loop4223 = function(i4224) {
          if (M1.unsafe_fx_lt_(i4224, n4216) !== false) {
            M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(i4224, dst_start4218), M1.unsafe_cdr(M1.unsafe_vector_ref(work_vec4219, i4224)));
            var if_res2504 = loop4223(M1.unsafe_fx_plus_(i4224, 1));
          } else {
            var if_res2504 = M0.rvoid();
          }
          return if_res2504;
        };
        var if_res2523 = loop4223(0);
      } else {
        var loop4225 = function(prev_val4226, next_index4227) {
          var or_part4228 = M1.unsafe_fx_eq_(next_index4227, end4215);
          if (or_part4228 !== false) {
            var if_res2507 = or_part4228;
          } else {
            var next_val4229 = M1.unsafe_vector_ref(vec4212, next_index4227);
            if (false !== false) {
              var if_res2505 = less_than_p4213(false(next_val4229), false(prev_val4226));
            } else {
              var if_res2505 = less_than_p4213(next_val4229, prev_val4226);
            }
            if (M0.not(if_res2505) !== false) {
              var if_res2506 = loop4225(next_val4229, M1.unsafe_fx_plus_(next_index4227, 1));
            } else {
              var if_res2506 = false;
            }
            var if_res2507 = if_res2506;
          }
          return if_res2507;
        };
        if (loop4225(M1.unsafe_vector_ref(vec4212, start4214), M1.unsafe_fx_plus_(start4214, 1)) !== false) {
          if (true !== false) {
            var if_res2508 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4217, dst_start4218, vec4212, start4214, end4215);
          } else {
            var if_res2508 = M0.rvoid();
          }
          var if_res2522 = if_res2508;
        } else {
          if (M1.unsafe_fx_lt__eq_(n4216, 3) !== false) {
            if (true !== false) {
              var if_res2509 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4217, dst_start4218, vec4212, start4214, end4215);
            } else {
              var if_res2509 = M0.rvoid();
            }
            if_res2509;
            if (M1.unsafe_fx_eq_(n4216, 1) !== false) {
              var if_res2519 = M0.rvoid();
            } else {
              if (M1.unsafe_fx_eq_(n4216, 2) !== false) {
                var tmp4230 = M1.unsafe_vector_ref(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 0));
                M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 0), M1.unsafe_vector_ref(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 1)));
                var if_res2518 = M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 1), tmp4230);
              } else {
                var a4231 = M1.unsafe_vector_ref(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 0));
                var b4232 = M1.unsafe_vector_ref(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 1));
                var c4233 = M1.unsafe_vector_ref(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 2));
                if (false !== false) {
                  var if_res2510 = less_than_p4213(false(b4232), false(a4231));
                } else {
                  var if_res2510 = less_than_p4213(b4232, a4231);
                }
                if (if_res2510 !== false) {
                  if (false !== false) {
                    var if_res2511 = less_than_p4213(false(c4233), false(b4232));
                  } else {
                    var if_res2511 = less_than_p4213(c4233, b4232);
                  }
                  if (if_res2511 !== false) {
                    M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 0), c4233);
                    var if_res2514 = M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 2), a4231);
                  } else {
                    if (false !== false) {
                      var if_res2512 = less_than_p4213(false(c4233), false(a4231));
                    } else {
                      var if_res2512 = less_than_p4213(c4233, a4231);
                    }
                    if (if_res2512 !== false) {
                      M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 0), b4232);
                      M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 1), c4233);
                      var if_res2513 = M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 2), a4231);
                    } else {
                      M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 0), b4232);
                      var if_res2513 = M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 1), a4231);
                    }
                    var if_res2514 = if_res2513;
                  }
                  var if_res2517 = if_res2514;
                } else {
                  if (false !== false) {
                    var if_res2515 = less_than_p4213(false(c4233), false(a4231));
                  } else {
                    var if_res2515 = less_than_p4213(c4233, a4231);
                  }
                  if (if_res2515 !== false) {
                    M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 0), c4233);
                    M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 1), a4231);
                    var if_res2516 = M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 2), b4232);
                  } else {
                    M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 1), c4233);
                    var if_res2516 = M1.unsafe_vector_set_bang_(dst_vec4217, M1.unsafe_fx_plus_(dst_start4218, 2), b4232);
                  }
                  var if_res2517 = if_res2516;
                }
                var if_res2518 = if_res2517;
              }
              var if_res2519 = if_res2518;
            }
            var if_res2521 = if_res2519;
          } else {
            var work_vec4234 = M0.make_vector(n4216 + M0.ceiling(n4216 / 2), false);
            M0.__rjs_quoted__.vector_copy_bang_(work_vec4234, 0, vec4212, start4214, end4215);
            var precomp4235 = M0.hash_ref(precompiled_sorts3322, less_than_p4213, false);
            if (precomp4235 !== false) {
              var if_res2520 = precomp4235(work_vec4234, n4216);
            } else {
              var if_res2520 = generic_sort4039(work_vec4234, less_than_p4213, n4216);
            }
            if_res2520;
            var if_res2521 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4217, dst_start4218, work_vec4234, 0, n4216);
          }
          var if_res2522 = if_res2521;
        }
        var if_res2523 = if_res2522;
      }
      var if_res2524 = if_res2523;
    }
    if_res2524;
    if (true !== false) {
      var if_res2525 = dst_vec4217;
    } else {
      var if_res2525 = M0.rvoid();
    }
    return if_res2525;
  };
  var cl2499 = function(vec4236, less_than_p4237, start4238, end4239, getkey4240, cache_keys_p4241) {
    if (getkey4240 !== false) {
      var if_res2526 = M0.not(M0.eq_p(M0.values, getkey4240));
    } else {
      var if_res2526 = false;
    }
    if (if_res2526 !== false) {
      var n4242 = end4239 - start4238;
      if (true !== false) {
        var if_res2527 = M0.make_vector(n4242);
      } else {
        var if_res2527 = vec4236;
      }
      var dst_vec4243 = if_res2527;
      if (true !== false) {
        var if_res2528 = 0;
      } else {
        var if_res2528 = start4238;
      }
      var dst_start4244 = if_res2528;
      if (M1.unsafe_fx_eq_(n4242, 0) !== false) {
        var if_res2549 = M0.rvoid();
      } else {
        if (cache_keys_p4241 !== false) {
          var work_vec4245 = M0.make_vector(n4242 + M0.ceiling(n4242 / 2), true);
          var loop4246 = function(i4247) {
            if (M1.unsafe_fx_lt_(i4247, n4242) !== false) {
              var x4248 = M1.unsafe_vector_ref(vec4236, M1.unsafe_fx_plus_(i4247, start4238));
              M1.unsafe_vector_set_bang_(work_vec4245, i4247, M0.cons(getkey4240(x4248), x4248));
              var if_res2529 = loop4246(M1.unsafe_fx_plus_(i4247, 1));
            } else {
              var if_res2529 = M0.rvoid();
            }
            return if_res2529;
          };
          loop4246(0);
          generic_sort_by_key4095(work_vec4245, less_than_p4237, n4242, M1.unsafe_car);
          var loop4249 = function(i4250) {
            if (M1.unsafe_fx_lt_(i4250, n4242) !== false) {
              M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(i4250, dst_start4244), M1.unsafe_cdr(M1.unsafe_vector_ref(work_vec4245, i4250)));
              var if_res2530 = loop4249(M1.unsafe_fx_plus_(i4250, 1));
            } else {
              var if_res2530 = M0.rvoid();
            }
            return if_res2530;
          };
          var if_res2548 = loop4249(0);
        } else {
          var loop4251 = function(prev_val4252, next_index4253) {
            var or_part4254 = M1.unsafe_fx_eq_(next_index4253, end4239);
            if (or_part4254 !== false) {
              var if_res2533 = or_part4254;
            } else {
              var next_val4255 = M1.unsafe_vector_ref(vec4236, next_index4253);
              if (getkey4240 !== false) {
                var if_res2531 = less_than_p4237(getkey4240(next_val4255), getkey4240(prev_val4252));
              } else {
                var if_res2531 = less_than_p4237(next_val4255, prev_val4252);
              }
              if (M0.not(if_res2531) !== false) {
                var if_res2532 = loop4251(next_val4255, M1.unsafe_fx_plus_(next_index4253, 1));
              } else {
                var if_res2532 = false;
              }
              var if_res2533 = if_res2532;
            }
            return if_res2533;
          };
          if (loop4251(M1.unsafe_vector_ref(vec4236, start4238), M1.unsafe_fx_plus_(start4238, 1)) !== false) {
            if (true !== false) {
              var if_res2534 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4243, dst_start4244, vec4236, start4238, end4239);
            } else {
              var if_res2534 = M0.rvoid();
            }
            var if_res2547 = if_res2534;
          } else {
            if (M1.unsafe_fx_lt__eq_(n4242, 3) !== false) {
              if (true !== false) {
                var if_res2535 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4243, dst_start4244, vec4236, start4238, end4239);
              } else {
                var if_res2535 = M0.rvoid();
              }
              if_res2535;
              if (M1.unsafe_fx_eq_(n4242, 1) !== false) {
                var if_res2545 = M0.rvoid();
              } else {
                if (M1.unsafe_fx_eq_(n4242, 2) !== false) {
                  var tmp4256 = M1.unsafe_vector_ref(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 0));
                  M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 0), M1.unsafe_vector_ref(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 1)));
                  var if_res2544 = M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 1), tmp4256);
                } else {
                  var a4257 = M1.unsafe_vector_ref(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 0));
                  var b4258 = M1.unsafe_vector_ref(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 1));
                  var c4259 = M1.unsafe_vector_ref(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 2));
                  if (getkey4240 !== false) {
                    var if_res2536 = less_than_p4237(getkey4240(b4258), getkey4240(a4257));
                  } else {
                    var if_res2536 = less_than_p4237(b4258, a4257);
                  }
                  if (if_res2536 !== false) {
                    if (getkey4240 !== false) {
                      var if_res2537 = less_than_p4237(getkey4240(c4259), getkey4240(b4258));
                    } else {
                      var if_res2537 = less_than_p4237(c4259, b4258);
                    }
                    if (if_res2537 !== false) {
                      M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 0), c4259);
                      var if_res2540 = M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 2), a4257);
                    } else {
                      if (getkey4240 !== false) {
                        var if_res2538 = less_than_p4237(getkey4240(c4259), getkey4240(a4257));
                      } else {
                        var if_res2538 = less_than_p4237(c4259, a4257);
                      }
                      if (if_res2538 !== false) {
                        M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 0), b4258);
                        M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 1), c4259);
                        var if_res2539 = M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 2), a4257);
                      } else {
                        M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 0), b4258);
                        var if_res2539 = M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 1), a4257);
                      }
                      var if_res2540 = if_res2539;
                    }
                    var if_res2543 = if_res2540;
                  } else {
                    if (getkey4240 !== false) {
                      var if_res2541 = less_than_p4237(getkey4240(c4259), getkey4240(a4257));
                    } else {
                      var if_res2541 = less_than_p4237(c4259, a4257);
                    }
                    if (if_res2541 !== false) {
                      M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 0), c4259);
                      M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 1), a4257);
                      var if_res2542 = M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 2), b4258);
                    } else {
                      M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 1), c4259);
                      var if_res2542 = M1.unsafe_vector_set_bang_(dst_vec4243, M1.unsafe_fx_plus_(dst_start4244, 2), b4258);
                    }
                    var if_res2543 = if_res2542;
                  }
                  var if_res2544 = if_res2543;
                }
                var if_res2545 = if_res2544;
              }
              var if_res2546 = if_res2545;
            } else {
              var work_vec4260 = M0.make_vector(n4242 + M0.ceiling(n4242 / 2), false);
              M0.__rjs_quoted__.vector_copy_bang_(work_vec4260, 0, vec4236, start4238, end4239);
              generic_sort_by_key4095(work_vec4260, less_than_p4237, n4242, getkey4240);
              var if_res2546 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4243, dst_start4244, work_vec4260, 0, n4242);
            }
            var if_res2547 = if_res2546;
          }
          var if_res2548 = if_res2547;
        }
        var if_res2549 = if_res2548;
      }
      if_res2549;
      if (true !== false) {
        var if_res2550 = dst_vec4243;
      } else {
        var if_res2550 = M0.rvoid();
      }
      var if_res2551 = if_res2550;
    } else {
      var if_res2551 = vector_sort(vec4236, less_than_p4237, start4238, end4239);
    }
    return if_res2551;
  };
  var temp2552 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2500 = {
      '4': cl2498,
      '6': cl2499
    }[arguments.length];
    if (fixed_lam2500 !== undefined !== false) {
      return fixed_lam2500.apply(null, arguments);
    } else {
      return M0.error("case-lambda: invalid case");
    }
  }, [4, 6]);
  var cl2444 = function(vec4261, less_than_p4262, start4263, end4264) {
    var n4265 = end4264 - start4263;
    if (false !== false) {
      var if_res2447 = M0.make_vector(n4265);
    } else {
      var if_res2447 = vec4261;
    }
    var dst_vec4266 = if_res2447;
    if (false !== false) {
      var if_res2448 = 0;
    } else {
      var if_res2448 = start4263;
    }
    var dst_start4267 = if_res2448;
    if (M1.unsafe_fx_eq_(n4265, 0) !== false) {
      var if_res2470 = M0.rvoid();
    } else {
      if (false !== false) {
        var work_vec4268 = M0.make_vector(n4265 + M0.ceiling(n4265 / 2), true);
        var loop4269 = function(i4270) {
          if (M1.unsafe_fx_lt_(i4270, n4265) !== false) {
            var x4271 = M1.unsafe_vector_ref(vec4261, M1.unsafe_fx_plus_(i4270, start4263));
            M1.unsafe_vector_set_bang_(work_vec4268, i4270, M0.cons(false(x4271), x4271));
            var if_res2449 = loop4269(M1.unsafe_fx_plus_(i4270, 1));
          } else {
            var if_res2449 = M0.rvoid();
          }
          return if_res2449;
        };
        loop4269(0);
        generic_sort_by_key4095(work_vec4268, less_than_p4262, n4265, M1.unsafe_car);
        var loop4272 = function(i4273) {
          if (M1.unsafe_fx_lt_(i4273, n4265) !== false) {
            M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(i4273, dst_start4267), M1.unsafe_cdr(M1.unsafe_vector_ref(work_vec4268, i4273)));
            var if_res2450 = loop4272(M1.unsafe_fx_plus_(i4273, 1));
          } else {
            var if_res2450 = M0.rvoid();
          }
          return if_res2450;
        };
        var if_res2469 = loop4272(0);
      } else {
        var loop4274 = function(prev_val4275, next_index4276) {
          var or_part4277 = M1.unsafe_fx_eq_(next_index4276, end4264);
          if (or_part4277 !== false) {
            var if_res2453 = or_part4277;
          } else {
            var next_val4278 = M1.unsafe_vector_ref(vec4261, next_index4276);
            if (false !== false) {
              var if_res2451 = less_than_p4262(false(next_val4278), false(prev_val4275));
            } else {
              var if_res2451 = less_than_p4262(next_val4278, prev_val4275);
            }
            if (M0.not(if_res2451) !== false) {
              var if_res2452 = loop4274(next_val4278, M1.unsafe_fx_plus_(next_index4276, 1));
            } else {
              var if_res2452 = false;
            }
            var if_res2453 = if_res2452;
          }
          return if_res2453;
        };
        if (loop4274(M1.unsafe_vector_ref(vec4261, start4263), M1.unsafe_fx_plus_(start4263, 1)) !== false) {
          if (false !== false) {
            var if_res2454 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4266, dst_start4267, vec4261, start4263, end4264);
          } else {
            var if_res2454 = M0.rvoid();
          }
          var if_res2468 = if_res2454;
        } else {
          if (M1.unsafe_fx_lt__eq_(n4265, 3) !== false) {
            if (false !== false) {
              var if_res2455 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4266, dst_start4267, vec4261, start4263, end4264);
            } else {
              var if_res2455 = M0.rvoid();
            }
            if_res2455;
            if (M1.unsafe_fx_eq_(n4265, 1) !== false) {
              var if_res2465 = M0.rvoid();
            } else {
              if (M1.unsafe_fx_eq_(n4265, 2) !== false) {
                var tmp4279 = M1.unsafe_vector_ref(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 0));
                M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 0), M1.unsafe_vector_ref(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 1)));
                var if_res2464 = M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 1), tmp4279);
              } else {
                var a4280 = M1.unsafe_vector_ref(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 0));
                var b4281 = M1.unsafe_vector_ref(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 1));
                var c4282 = M1.unsafe_vector_ref(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 2));
                if (false !== false) {
                  var if_res2456 = less_than_p4262(false(b4281), false(a4280));
                } else {
                  var if_res2456 = less_than_p4262(b4281, a4280);
                }
                if (if_res2456 !== false) {
                  if (false !== false) {
                    var if_res2457 = less_than_p4262(false(c4282), false(b4281));
                  } else {
                    var if_res2457 = less_than_p4262(c4282, b4281);
                  }
                  if (if_res2457 !== false) {
                    M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 0), c4282);
                    var if_res2460 = M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 2), a4280);
                  } else {
                    if (false !== false) {
                      var if_res2458 = less_than_p4262(false(c4282), false(a4280));
                    } else {
                      var if_res2458 = less_than_p4262(c4282, a4280);
                    }
                    if (if_res2458 !== false) {
                      M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 0), b4281);
                      M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 1), c4282);
                      var if_res2459 = M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 2), a4280);
                    } else {
                      M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 0), b4281);
                      var if_res2459 = M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 1), a4280);
                    }
                    var if_res2460 = if_res2459;
                  }
                  var if_res2463 = if_res2460;
                } else {
                  if (false !== false) {
                    var if_res2461 = less_than_p4262(false(c4282), false(a4280));
                  } else {
                    var if_res2461 = less_than_p4262(c4282, a4280);
                  }
                  if (if_res2461 !== false) {
                    M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 0), c4282);
                    M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 1), a4280);
                    var if_res2462 = M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 2), b4281);
                  } else {
                    M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 1), c4282);
                    var if_res2462 = M1.unsafe_vector_set_bang_(dst_vec4266, M1.unsafe_fx_plus_(dst_start4267, 2), b4281);
                  }
                  var if_res2463 = if_res2462;
                }
                var if_res2464 = if_res2463;
              }
              var if_res2465 = if_res2464;
            }
            var if_res2467 = if_res2465;
          } else {
            var work_vec4283 = M0.make_vector(n4265 + M0.ceiling(n4265 / 2), false);
            M0.__rjs_quoted__.vector_copy_bang_(work_vec4283, 0, vec4261, start4263, end4264);
            var precomp4284 = M0.hash_ref(precompiled_sorts3322, less_than_p4262, false);
            if (precomp4284 !== false) {
              var if_res2466 = precomp4284(work_vec4283, n4265);
            } else {
              var if_res2466 = generic_sort4039(work_vec4283, less_than_p4262, n4265);
            }
            if_res2466;
            var if_res2467 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4266, dst_start4267, work_vec4283, 0, n4265);
          }
          var if_res2468 = if_res2467;
        }
        var if_res2469 = if_res2468;
      }
      var if_res2470 = if_res2469;
    }
    if_res2470;
    if (false !== false) {
      var if_res2471 = dst_vec4266;
    } else {
      var if_res2471 = M0.rvoid();
    }
    return if_res2471;
  };
  var cl2445 = function(vec4285, less_than_p4286, start4287, end4288, getkey4289, cache_keys_p4290) {
    if (getkey4289 !== false) {
      var if_res2472 = M0.not(M0.eq_p(M0.values, getkey4289));
    } else {
      var if_res2472 = false;
    }
    if (if_res2472 !== false) {
      var n4291 = end4288 - start4287;
      if (false !== false) {
        var if_res2473 = M0.make_vector(n4291);
      } else {
        var if_res2473 = vec4285;
      }
      var dst_vec4292 = if_res2473;
      if (false !== false) {
        var if_res2474 = 0;
      } else {
        var if_res2474 = start4287;
      }
      var dst_start4293 = if_res2474;
      if (M1.unsafe_fx_eq_(n4291, 0) !== false) {
        var if_res2495 = M0.rvoid();
      } else {
        if (cache_keys_p4290 !== false) {
          var work_vec4294 = M0.make_vector(n4291 + M0.ceiling(n4291 / 2), true);
          var loop4295 = function(i4296) {
            if (M1.unsafe_fx_lt_(i4296, n4291) !== false) {
              var x4297 = M1.unsafe_vector_ref(vec4285, M1.unsafe_fx_plus_(i4296, start4287));
              M1.unsafe_vector_set_bang_(work_vec4294, i4296, M0.cons(getkey4289(x4297), x4297));
              var if_res2475 = loop4295(M1.unsafe_fx_plus_(i4296, 1));
            } else {
              var if_res2475 = M0.rvoid();
            }
            return if_res2475;
          };
          loop4295(0);
          generic_sort_by_key4095(work_vec4294, less_than_p4286, n4291, M1.unsafe_car);
          var loop4298 = function(i4299) {
            if (M1.unsafe_fx_lt_(i4299, n4291) !== false) {
              M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(i4299, dst_start4293), M1.unsafe_cdr(M1.unsafe_vector_ref(work_vec4294, i4299)));
              var if_res2476 = loop4298(M1.unsafe_fx_plus_(i4299, 1));
            } else {
              var if_res2476 = M0.rvoid();
            }
            return if_res2476;
          };
          var if_res2494 = loop4298(0);
        } else {
          var loop4300 = function(prev_val4301, next_index4302) {
            var or_part4303 = M1.unsafe_fx_eq_(next_index4302, end4288);
            if (or_part4303 !== false) {
              var if_res2479 = or_part4303;
            } else {
              var next_val4304 = M1.unsafe_vector_ref(vec4285, next_index4302);
              if (getkey4289 !== false) {
                var if_res2477 = less_than_p4286(getkey4289(next_val4304), getkey4289(prev_val4301));
              } else {
                var if_res2477 = less_than_p4286(next_val4304, prev_val4301);
              }
              if (M0.not(if_res2477) !== false) {
                var if_res2478 = loop4300(next_val4304, M1.unsafe_fx_plus_(next_index4302, 1));
              } else {
                var if_res2478 = false;
              }
              var if_res2479 = if_res2478;
            }
            return if_res2479;
          };
          if (loop4300(M1.unsafe_vector_ref(vec4285, start4287), M1.unsafe_fx_plus_(start4287, 1)) !== false) {
            if (false !== false) {
              var if_res2480 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4292, dst_start4293, vec4285, start4287, end4288);
            } else {
              var if_res2480 = M0.rvoid();
            }
            var if_res2493 = if_res2480;
          } else {
            if (M1.unsafe_fx_lt__eq_(n4291, 3) !== false) {
              if (false !== false) {
                var if_res2481 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4292, dst_start4293, vec4285, start4287, end4288);
              } else {
                var if_res2481 = M0.rvoid();
              }
              if_res2481;
              if (M1.unsafe_fx_eq_(n4291, 1) !== false) {
                var if_res2491 = M0.rvoid();
              } else {
                if (M1.unsafe_fx_eq_(n4291, 2) !== false) {
                  var tmp4305 = M1.unsafe_vector_ref(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 0));
                  M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 0), M1.unsafe_vector_ref(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 1)));
                  var if_res2490 = M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 1), tmp4305);
                } else {
                  var a4306 = M1.unsafe_vector_ref(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 0));
                  var b4307 = M1.unsafe_vector_ref(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 1));
                  var c4308 = M1.unsafe_vector_ref(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 2));
                  if (getkey4289 !== false) {
                    var if_res2482 = less_than_p4286(getkey4289(b4307), getkey4289(a4306));
                  } else {
                    var if_res2482 = less_than_p4286(b4307, a4306);
                  }
                  if (if_res2482 !== false) {
                    if (getkey4289 !== false) {
                      var if_res2483 = less_than_p4286(getkey4289(c4308), getkey4289(b4307));
                    } else {
                      var if_res2483 = less_than_p4286(c4308, b4307);
                    }
                    if (if_res2483 !== false) {
                      M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 0), c4308);
                      var if_res2486 = M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 2), a4306);
                    } else {
                      if (getkey4289 !== false) {
                        var if_res2484 = less_than_p4286(getkey4289(c4308), getkey4289(a4306));
                      } else {
                        var if_res2484 = less_than_p4286(c4308, a4306);
                      }
                      if (if_res2484 !== false) {
                        M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 0), b4307);
                        M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 1), c4308);
                        var if_res2485 = M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 2), a4306);
                      } else {
                        M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 0), b4307);
                        var if_res2485 = M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 1), a4306);
                      }
                      var if_res2486 = if_res2485;
                    }
                    var if_res2489 = if_res2486;
                  } else {
                    if (getkey4289 !== false) {
                      var if_res2487 = less_than_p4286(getkey4289(c4308), getkey4289(a4306));
                    } else {
                      var if_res2487 = less_than_p4286(c4308, a4306);
                    }
                    if (if_res2487 !== false) {
                      M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 0), c4308);
                      M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 1), a4306);
                      var if_res2488 = M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 2), b4307);
                    } else {
                      M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 1), c4308);
                      var if_res2488 = M1.unsafe_vector_set_bang_(dst_vec4292, M1.unsafe_fx_plus_(dst_start4293, 2), b4307);
                    }
                    var if_res2489 = if_res2488;
                  }
                  var if_res2490 = if_res2489;
                }
                var if_res2491 = if_res2490;
              }
              var if_res2492 = if_res2491;
            } else {
              var work_vec4309 = M0.make_vector(n4291 + M0.ceiling(n4291 / 2), false);
              M0.__rjs_quoted__.vector_copy_bang_(work_vec4309, 0, vec4285, start4287, end4288);
              generic_sort_by_key4095(work_vec4309, less_than_p4286, n4291, getkey4289);
              var if_res2492 = M0.__rjs_quoted__.vector_copy_bang_(dst_vec4292, dst_start4293, work_vec4309, 0, n4291);
            }
            var if_res2493 = if_res2492;
          }
          var if_res2494 = if_res2493;
        }
        var if_res2495 = if_res2494;
      }
      if_res2495;
      if (false !== false) {
        var if_res2496 = dst_vec4292;
      } else {
        var if_res2496 = M0.rvoid();
      }
      var if_res2497 = if_res2496;
    } else {
      var if_res2497 = vector_sort_bang_(vec4285, less_than_p4286, start4287, end4288);
    }
    return if_res2497;
  };
  var let_result2605 = M0.values(temp2604, temp2552, $rjs_core.attachProcedureArity(function() {
    var fixed_lam2446 = {
      '4': cl2444,
      '6': cl2445
    }[arguments.length];
    if (fixed_lam2446 !== undefined !== false) {
      return fixed_lam2446.apply(null, arguments);
    } else {
      return M0.error("case-lambda: invalid case");
    }
  }, [4, 6]));
  var sort = let_result2605.getAt(0);
  var vector_sort = let_result2605.getAt(1);
  var vector_sort_bang_ = let_result2605.getAt(2);
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get vector_sort_bang_() {
      return vector_sort_bang_;
    },
    get vector_sort() {
      return vector_sort;
    },
    get sort() {
      return sort;
    }
  };
})();
var $__collects_47_racket_47_private_47_norm_45_arity_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/norm-arity.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_sort_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var procedure_arity4310 = function(p4311) {
    return normalize_arity(M1.procedure_arity(p4311));
  };
  var norm_procedure_arity = procedure_arity4310;
  var raise_arity_error4312 = $rjs_core.attachProcedureArity(function(name4313, arity_v4314) {
    var arg_vs4315 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    var or_part4316 = M1.exact_nonnegative_integer_p(arity_v4314);
    if (or_part4316 !== false) {
      var if_res2609 = or_part4316;
    } else {
      var or_part4317 = M1.arity_at_least_p(arity_v4314);
      if (or_part4317 !== false) {
        var if_res2608 = or_part4317;
      } else {
        if (M1.list_p(arity_v4314) !== false) {
          var if_res2607 = M1.andmap(function(x4318) {
            var or_part4319 = M1.exact_nonnegative_integer_p(x4318);
            if (or_part4319 !== false) {
              var if_res2606 = or_part4319;
            } else {
              var if_res2606 = M1.arity_at_least_p(x4318);
            }
            return if_res2606;
          }, arity_v4314);
        } else {
          var if_res2607 = false;
        }
        var if_res2608 = if_res2607;
      }
      var if_res2609 = if_res2608;
    }
    if (if_res2609 !== false) {
      var if_res2610 = M1.apply(M1.__rjs_quoted__.raise_arity_error, name4313, normalize_arity(arity_v4314), arg_vs4315);
    } else {
      var if_res2610 = M1.apply(M1.__rjs_quoted__.raise_arity_error, name4313, arity_v4314, arg_vs4315);
    }
    return if_res2610;
  });
  var norm_raise_arity_error = raise_arity_error4312;
  var normalize_arity = function(arity4320) {
    if (M1.procedure_arity_p(arity4320) !== false) {
      var if_res2611 = M1.rvoid();
    } else {
      var if_res2611 = M1.raise_argument_error($rjs_core.Symbol.make("normalize-arity"), "procedure-arity?", arity4320);
    }
    if_res2611;
    if (M1.pair_p(arity4320) !== false) {
      var reversed4321 = reverse_sort_arity(arity4320);
      var normalized4322 = normalize_reversed_arity(reversed4321, $rjs_core.Pair.Empty);
      var simplified4323 = normalize_singleton_arity(normalized4322);
      var if_res2612 = simplified4323;
    } else {
      var if_res2612 = arity4320;
    }
    return if_res2612;
  };
  var normalize_singleton_arity = function(arity4324) {
    if (M1.pair_p(arity4324) !== false) {
      var if_res2613 = M1.null_p(M1.cdr(arity4324));
    } else {
      var if_res2613 = false;
    }
    if (if_res2613 !== false) {
      var if_res2614 = M1.car(arity4324);
    } else {
      var if_res2614 = arity4324;
    }
    return if_res2614;
  };
  var normalize_reversed_arity = function(arity4325, tail4326) {
    if (M1.pair_p(arity4325) !== false) {
      var if_res2615 = normalize_reversed_arity(M1.cdr(arity4325), arity_insert(M1.car(arity4325), tail4326));
    } else {
      var if_res2615 = tail4326;
    }
    return if_res2615;
  };
  var arity_insert = function(elem4327, arity4328) {
    if (M1.pair_p(arity4328) !== false) {
      var next4329 = M1.car(arity4328);
      if (M1.arity_at_least_p(next4329) !== false) {
        var next_value4330 = M1.arity_at_least_value(next4329);
        if (M1.arity_at_least_p(elem4327) !== false) {
          var elem_value4331 = M1.arity_at_least_value(elem4327);
          if (M1._lt_(elem_value4331, next_value4330) !== false) {
            var if_res2616 = M1.cons(elem4327, M1.cdr(arity4328));
          } else {
            var if_res2616 = arity4328;
          }
          var if_res2619 = if_res2616;
        } else {
          if (M1._lt_(elem4327, next_value4330 - 1) !== false) {
            var if_res2618 = M1.cons(elem4327, arity4328);
          } else {
            if (M1._eq_(elem4327, next_value4330 - 1) !== false) {
              var if_res2617 = M1.cons(M1.arity_at_least(elem4327), M1.cdr(arity4328));
            } else {
              var if_res2617 = arity4328;
            }
            var if_res2618 = if_res2617;
          }
          var if_res2619 = if_res2618;
        }
        var if_res2621 = if_res2619;
      } else {
        if (M1._lt_(elem4327, next4329) !== false) {
          var if_res2620 = M1.cons(elem4327, arity4328);
        } else {
          var if_res2620 = arity4328;
        }
        var if_res2621 = if_res2620;
      }
      var if_res2622 = if_res2621;
    } else {
      var if_res2622 = M1.cons(elem4327, arity4328);
    }
    return if_res2622;
  };
  var reverse_sort_arity = function(arity4332) {
    return M0.sort(arity4332, arity_gt__p);
  };
  var arity_gt__p = function(a4333, b4334) {
    if (M1.arity_at_least_p(a4333) !== false) {
      if (M1.arity_at_least_p(b4334) !== false) {
        var if_res2623 = M1._gt_(M1.arity_at_least_value(a4333), M1.arity_at_least_value(b4334));
      } else {
        var if_res2623 = true;
      }
      var if_res2625 = if_res2623;
    } else {
      if (M1.arity_at_least_p(b4334) !== false) {
        var if_res2624 = false;
      } else {
        var if_res2624 = M1._gt_(a4333, b4334);
      }
      var if_res2625 = if_res2624;
    }
    return if_res2625;
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get normalize_arity() {
      return normalize_arity;
    },
    get norm_raise_arity_error() {
      return norm_raise_arity_error;
    },
    get norm_procedure_arity() {
      return norm_procedure_arity;
    }
  };
})();
var $__collects_47_racket_47_private_47_reverse_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/reverse.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  if (M0.eval_jit_enabled() !== false) {
    var reverse2195 = function(l2196) {
      if (M0.list_p(l2196) !== false) {
        var if_res1282 = M0.rvoid();
      } else {
        var if_res1282 = M0.raise_argument_error($rjs_core.Symbol.make("reverse"), "list?", l2196);
      }
      if_res1282;
      var loop2197 = function(a2198, l2199) {
        if (M0.null_p(l2199) !== false) {
          var if_res1283 = a2198;
        } else {
          var if_res1283 = loop2197(M0.cons(M0.car(l2199), a2198), M0.cdr(l2199));
        }
        return if_res1283;
      };
      return loop2197(M0.rnull, l2196);
    };
    var if_res1284 = reverse2195;
  } else {
    var if_res1284 = M0.reverse;
  }
  var alt_reverse = if_res1284;
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get alt_reverse() {
      return alt_reverse;
    }
  };
})();
var $__collects_47_racket_47_private_47_list_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/list.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M1 = $__collects_47_racket_47_private_47_norm_45_arity_46_rkt_46_js__;
  var M2 = $__collects_47_racket_47_private_47_pre_45_base_46_rkt_46_js__;
  var M3 = $__collects_47_racket_47_private_47_sort_46_rkt_46_js__;
  var M4 = $__runtime_47_kernel_46_rkt_46_js__;
  var M5 = $__collects_47_racket_47_private_47_kw_46_rkt_46_js__;
  var M6 = $__collects_47_racket_47_private_47_reverse_46_rkt_46_js__;
  var M7 = $__runtime_47_unsafe_46_rkt_46_js__;
  var sort7 = function(cache_keys_p22546, cache_keys_p42547, key12548, key32549, lst52550, less_p62551) {
    var lst2552 = lst52550;
    var less_p2553 = less_p62551;
    if (key32549 !== false) {
      var if_res1548 = key12548;
    } else {
      var if_res1548 = false;
    }
    var getkey2554 = if_res1548;
    if (cache_keys_p42547 !== false) {
      var if_res1549 = cache_keys_p22546;
    } else {
      var if_res1549 = false;
    }
    var cache_keys_p2555 = if_res1549;
    if (M4.list_p(lst2552) !== false) {
      var if_res1550 = M4.rvoid();
    } else {
      var if_res1550 = M4.raise_argument_error($rjs_core.Symbol.make("sort"), "list?", lst2552);
    }
    if_res1550;
    if (M4.procedure_p(less_p2553) !== false) {
      var if_res1551 = M4.procedure_arity_includes_p(less_p2553, 2);
    } else {
      var if_res1551 = false;
    }
    if (if_res1551 !== false) {
      var if_res1552 = M4.rvoid();
    } else {
      var if_res1552 = M4.raise_argument_error($rjs_core.Symbol.make("sort"), "(any/c any/c . -> . any/c)", less_p2553);
    }
    if_res1552;
    if (getkey2554 !== false) {
      if (M4.procedure_p(getkey2554) !== false) {
        var if_res1553 = M4.procedure_arity_includes_p(getkey2554, 1);
      } else {
        var if_res1553 = false;
      }
      var if_res1554 = M4.not(if_res1553);
    } else {
      var if_res1554 = false;
    }
    if (if_res1554 !== false) {
      var if_res1555 = M4.raise_argument_error($rjs_core.Symbol.make("sort"), "(any/c . -> . any/c)", getkey2554);
    } else {
      var if_res1555 = M4.rvoid();
    }
    if_res1555;
    if (getkey2554 !== false) {
      var if_res1556 = M3.sort(lst2552, less_p2553, getkey2554, cache_keys_p2555);
    } else {
      var if_res1556 = M3.sort(lst2552, less_p2553);
    }
    return if_res1556;
  };
  var unpack8 = function(given_kws2556, given_args2557, lst52558, less_p62559) {
    if (M4.pair_p(given_kws2556) !== false) {
      var if_res1557 = M4.eq_p($rjs_core.Keyword.make('#:cache-keys?'), M4.car(given_kws2556));
    } else {
      var if_res1557 = false;
    }
    var cache_keys_p42560 = if_res1557;
    if (cache_keys_p42560 !== false) {
      var if_res1558 = M4.car(given_args2557);
    } else {
      var if_res1558 = M4.rvoid();
    }
    var cache_keys_p22561 = if_res1558;
    if (cache_keys_p42560 !== false) {
      var if_res1559 = M4.cdr(given_kws2556);
    } else {
      var if_res1559 = given_kws2556;
    }
    var given_kws2562 = if_res1559;
    if (cache_keys_p42560 !== false) {
      var if_res1560 = M4.cdr(given_args2557);
    } else {
      var if_res1560 = given_args2557;
    }
    var given_args2563 = if_res1560;
    var key32564 = M4.pair_p(given_kws2562);
    if (key32564 !== false) {
      var if_res1561 = M4.car(given_args2563);
    } else {
      var if_res1561 = M4.rvoid();
    }
    var key12565 = if_res1561;
    return sort7(cache_keys_p22561, cache_keys_p42560, key12565, key32564, lst52558, less_p62559);
  };
  var cl1564 = function(given_kws2572, given_args2573, lst2574, less_p2575) {
    return unpack8(given_kws2572, given_args2573, lst2574, less_p2575);
  };
  var temp1566 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1565 = {'4': cl1564}[arguments.length];
    if (fixed_lam1565 !== undefined !== false) {
      return fixed_lam1565.apply(null, arguments);
    } else {
      return M4.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl1562 = function(lst2577, less_p2578) {
    return unpack8(M4.rnull, M4.rnull, lst2577, less_p2578);
  };
  var sort2576 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1563 = {'2': cl1562}[arguments.length];
    if (fixed_lam1563 !== undefined !== false) {
      return fixed_lam1563.apply(null, arguments);
    } else {
      return M4.error("case-lambda: invalid case");
    }
  }, [2]);
  var sort9 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws2566, given_argc2567) {
    if (M4._eq_(given_argc2567, 4) !== false) {
      var l12568 = given_kws2566;
      if (M4.null_p(l12568) !== false) {
        var if_res1568 = l12568;
      } else {
        if (M4.eq_p(M4.car(l12568), $rjs_core.Keyword.make('#:cache-keys?')) !== false) {
          var if_res1567 = M4.cdr(l12568);
        } else {
          var if_res1567 = l12568;
        }
        var if_res1568 = if_res1567;
      }
      var l12569 = if_res1568;
      var l12570 = l12569;
      if (M4.null_p(l12570) !== false) {
        var if_res1570 = l12570;
      } else {
        if (M4.eq_p(M4.car(l12570), $rjs_core.Keyword.make('#:key')) !== false) {
          var if_res1569 = M4.cdr(l12570);
        } else {
          var if_res1569 = l12570;
        }
        var if_res1570 = if_res1569;
      }
      var l12571 = if_res1570;
      var if_res1571 = M4.null_p(l12571);
    } else {
      var if_res1571 = false;
    }
    return if_res1571;
  }, temp1566, M4.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:cache-keys?'), $rjs_core.Keyword.make('#:key')), sort2576);
  var do_remove = function(who2579, item2580, list2581, equal_p2582) {
    if (M4.list_p(list2581) !== false) {
      var if_res1572 = M4.rvoid();
    } else {
      var if_res1572 = M4.raise_argument_error(who2579, "list?", list2581);
    }
    if_res1572;
    var loop2583 = function(list2584) {
      if (M4.null_p(list2584) !== false) {
        var if_res1574 = M4.rnull;
      } else {
        if (equal_p2582(item2580, M4.car(list2584)) !== false) {
          var if_res1573 = M4.cdr(list2584);
        } else {
          var if_res1573 = M4.cons(M4.car(list2584), loop2583(M4.cdr(list2584)));
        }
        var if_res1574 = if_res1573;
      }
      return if_res1574;
    };
    return loop2583(list2581);
  };
  var cl1575 = function(item2585, list2586) {
    return do_remove($rjs_core.Symbol.make("remove"), item2585, list2586, M4.equal_p);
  };
  var cl1576 = function(item2587, list2588, equal_p2589) {
    if (M4.procedure_p(equal_p2589) !== false) {
      var if_res1578 = M4.procedure_arity_includes_p(equal_p2589, 2);
    } else {
      var if_res1578 = false;
    }
    if (if_res1578 !== false) {
      var if_res1579 = M4.rvoid();
    } else {
      var if_res1579 = M4.raise_argument_error($rjs_core.Symbol.make("remove"), "(any/c any/c . -> . any/c)", equal_p2589);
    }
    if_res1579;
    return do_remove($rjs_core.Symbol.make("remove"), item2587, list2588, equal_p2589);
  };
  var remove = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1577 = {
      '2': cl1575,
      '3': cl1576
    }[arguments.length];
    if (fixed_lam1577 !== undefined !== false) {
      return fixed_lam1577.apply(null, arguments);
    } else {
      return M4.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var remq = function(item2590, list2591) {
    return do_remove($rjs_core.Symbol.make("remq"), item2590, list2591, M4.eq_p);
  };
  var remv = function(item2592, list2593) {
    return do_remove($rjs_core.Symbol.make("remv"), item2592, list2593, M4.eqv_p);
  };
  var do_remove_times_ = function(who2594, l2595, r2596, equal_p2597) {
    if (M4.list_p(l2595) !== false) {
      var if_res1580 = M4.rvoid();
    } else {
      var if_res1580 = M4.raise_argument_error(who2594, "list?", l2595);
    }
    if_res1580;
    if (M4.list_p(r2596) !== false) {
      var if_res1581 = M4.rvoid();
    } else {
      var if_res1581 = M4.raise_argument_error(who2594, "list?", r2596);
    }
    if_res1581;
    var rloop2598 = function(r2599) {
      if (M4.null_p(r2599) !== false) {
        var if_res1584 = M4.rnull;
      } else {
        var first_r2600 = M4.car(r2599);
        var loop2601 = function(l_rest2602) {
          if (M4.null_p(l_rest2602) !== false) {
            var if_res1583 = M4.cons(first_r2600, rloop2598(M4.cdr(r2599)));
          } else {
            if (equal_p2597(M4.car(l_rest2602), first_r2600) !== false) {
              var if_res1582 = rloop2598(M4.cdr(r2599));
            } else {
              var if_res1582 = loop2601(M4.cdr(l_rest2602));
            }
            var if_res1583 = if_res1582;
          }
          return if_res1583;
        };
        var if_res1584 = loop2601(l2595);
      }
      return if_res1584;
    };
    return rloop2598(r2596);
  };
  var cl1585 = function(l2603, r2604) {
    return do_remove_times_($rjs_core.Symbol.make("remove*"), l2603, r2604, M4.equal_p);
  };
  var cl1586 = function(l2605, r2606, equal_p2607) {
    if (M4.procedure_p(equal_p2607) !== false) {
      var if_res1588 = M4.procedure_arity_includes_p(equal_p2607, 2);
    } else {
      var if_res1588 = false;
    }
    if (if_res1588 !== false) {
      var if_res1589 = M4.rvoid();
    } else {
      var if_res1589 = M4.raise_argument_error($rjs_core.Symbol.make("remove*"), "(any/c any/c . -> . any/c)", equal_p2607);
    }
    if_res1589;
    return do_remove_times_($rjs_core.Symbol.make("remove*"), l2605, r2606, equal_p2607);
  };
  var remove_times_ = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1587 = {
      '2': cl1585,
      '3': cl1586
    }[arguments.length];
    if (fixed_lam1587 !== undefined !== false) {
      return fixed_lam1587.apply(null, arguments);
    } else {
      return M4.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var remq_times_ = function(l2608, r2609) {
    return do_remove_times_($rjs_core.Symbol.make("remq*"), l2608, r2609, M4.eq_p);
  };
  var remv_times_ = function(l2610, r2611) {
    return do_remove_times_($rjs_core.Symbol.make("remv*"), l2610, r2611, M4.eqv_p);
  };
  var memf = function(f2612, list2613) {
    if (M4.procedure_p(f2612) !== false) {
      var if_res1590 = M4.procedure_arity_includes_p(f2612, 1);
    } else {
      var if_res1590 = false;
    }
    if (if_res1590 !== false) {
      var if_res1591 = M4.rvoid();
    } else {
      var if_res1591 = M4.raise_argument_error($rjs_core.Symbol.make("memf"), "(any/c . -> any/c)", f2612);
    }
    if_res1591;
    var loop2614 = function(l2615) {
      if (M4.null_p(l2615) !== false) {
        var if_res1594 = false;
      } else {
        if (M4.not(M4.pair_p(l2615)) !== false) {
          var if_res1593 = M4.raise_mismatch_error($rjs_core.Symbol.make("memf"), "not a proper list: ", list2613);
        } else {
          if (f2612(M4.car(l2615)) !== false) {
            var if_res1592 = l2615;
          } else {
            var if_res1592 = loop2614(M4.cdr(l2615));
          }
          var if_res1593 = if_res1592;
        }
        var if_res1594 = if_res1593;
      }
      return if_res1594;
    };
    return loop2614(list2613);
  };
  var findf = function(f2616, list2617) {
    if (M4.procedure_p(f2616) !== false) {
      var if_res1595 = M4.procedure_arity_includes_p(f2616, 1);
    } else {
      var if_res1595 = false;
    }
    if (if_res1595 !== false) {
      var if_res1596 = M4.rvoid();
    } else {
      var if_res1596 = M4.raise_argument_error($rjs_core.Symbol.make("findf"), "(any/c . -> . any/c)", f2616);
    }
    if_res1596;
    var loop2618 = function(l2619) {
      if (M4.null_p(l2619) !== false) {
        var if_res1599 = false;
      } else {
        if (M4.not(M4.pair_p(l2619)) !== false) {
          var if_res1598 = M4.raise_mismatch_error($rjs_core.Symbol.make("findf"), "not a proper list: ", list2617);
        } else {
          var a2620 = M4.car(l2619);
          if (f2616(a2620) !== false) {
            var if_res1597 = a2620;
          } else {
            var if_res1597 = loop2618(M4.cdr(l2619));
          }
          var if_res1598 = if_res1597;
        }
        var if_res1599 = if_res1598;
      }
      return if_res1599;
    };
    return loop2618(list2617);
  };
  var bad_list = function(who2621, orig_l2622) {
    return M4.raise_mismatch_error(who2621, "not a proper list: ", orig_l2622);
  };
  var bad_item = function(who2623, a2624, orig_l2625) {
    return M4.raise_mismatch_error(who2623, "non-pair found in list: ", a2624, " in ", orig_l2625);
  };
  var assq2626 = function(x2630, l2631) {
    var loop2632 = function(l2633, t2634) {
      if (M4.pair_p(l2633) !== false) {
        var a2635 = M7.unsafe_car(l2633);
        if (M4.pair_p(a2635) !== false) {
          if (M4.eq_p(x2630, M7.unsafe_car(a2635)) !== false) {
            var if_res1605 = a2635;
          } else {
            var l2636 = M7.unsafe_cdr(l2633);
            if (M4.pair_p(l2636) !== false) {
              var a2637 = M7.unsafe_car(l2636);
              if (M4.pair_p(a2637) !== false) {
                if (M4.eq_p(x2630, M7.unsafe_car(a2637)) !== false) {
                  var if_res1601 = a2637;
                } else {
                  var t2638 = M7.unsafe_cdr(t2634);
                  var l2639 = M7.unsafe_cdr(l2636);
                  if (M4.eq_p(l2639, t2638) !== false) {
                    var if_res1600 = bad_list($rjs_core.Symbol.make("assq"), l2631);
                  } else {
                    var if_res1600 = loop2632(l2639, t2638);
                  }
                  var if_res1601 = if_res1600;
                }
                var if_res1602 = if_res1601;
              } else {
                var if_res1602 = bad_item($rjs_core.Symbol.make("assq"), a2637, l2631);
              }
              var if_res1604 = if_res1602;
            } else {
              if (M4.null_p(l2636) !== false) {
                var if_res1603 = false;
              } else {
                var if_res1603 = bad_list($rjs_core.Symbol.make("assq"), l2631);
              }
              var if_res1604 = if_res1603;
            }
            var if_res1605 = if_res1604;
          }
          var if_res1606 = if_res1605;
        } else {
          var if_res1606 = bad_item($rjs_core.Symbol.make("assq"), a2635, l2631);
        }
        var if_res1608 = if_res1606;
      } else {
        if (M4.null_p(l2633) !== false) {
          var if_res1607 = false;
        } else {
          var if_res1607 = bad_list($rjs_core.Symbol.make("assq"), l2631);
        }
        var if_res1608 = if_res1607;
      }
      return if_res1608;
    };
    return loop2632(l2631, l2631);
  };
  var assv2627 = function(x2640, l2641) {
    var loop2642 = function(l2643, t2644) {
      if (M4.pair_p(l2643) !== false) {
        var a2645 = M7.unsafe_car(l2643);
        if (M4.pair_p(a2645) !== false) {
          if (M4.eqv_p(x2640, M7.unsafe_car(a2645)) !== false) {
            var if_res1614 = a2645;
          } else {
            var l2646 = M7.unsafe_cdr(l2643);
            if (M4.pair_p(l2646) !== false) {
              var a2647 = M7.unsafe_car(l2646);
              if (M4.pair_p(a2647) !== false) {
                if (M4.eqv_p(x2640, M7.unsafe_car(a2647)) !== false) {
                  var if_res1610 = a2647;
                } else {
                  var t2648 = M7.unsafe_cdr(t2644);
                  var l2649 = M7.unsafe_cdr(l2646);
                  if (M4.eq_p(l2649, t2648) !== false) {
                    var if_res1609 = bad_list($rjs_core.Symbol.make("assv"), l2641);
                  } else {
                    var if_res1609 = loop2642(l2649, t2648);
                  }
                  var if_res1610 = if_res1609;
                }
                var if_res1611 = if_res1610;
              } else {
                var if_res1611 = bad_item($rjs_core.Symbol.make("assv"), a2647, l2641);
              }
              var if_res1613 = if_res1611;
            } else {
              if (M4.null_p(l2646) !== false) {
                var if_res1612 = false;
              } else {
                var if_res1612 = bad_list($rjs_core.Symbol.make("assv"), l2641);
              }
              var if_res1613 = if_res1612;
            }
            var if_res1614 = if_res1613;
          }
          var if_res1615 = if_res1614;
        } else {
          var if_res1615 = bad_item($rjs_core.Symbol.make("assv"), a2645, l2641);
        }
        var if_res1617 = if_res1615;
      } else {
        if (M4.null_p(l2643) !== false) {
          var if_res1616 = false;
        } else {
          var if_res1616 = bad_list($rjs_core.Symbol.make("assv"), l2641);
        }
        var if_res1617 = if_res1616;
      }
      return if_res1617;
    };
    return loop2642(l2641, l2641);
  };
  var cl1618 = function(x2650, l2651) {
    var loop2652 = function(l2653, t2654) {
      if (M4.pair_p(l2653) !== false) {
        var a2655 = M7.unsafe_car(l2653);
        if (M4.pair_p(a2655) !== false) {
          if (M4.equal_p(x2650, M7.unsafe_car(a2655)) !== false) {
            var if_res1626 = a2655;
          } else {
            var l2656 = M7.unsafe_cdr(l2653);
            if (M4.pair_p(l2656) !== false) {
              var a2657 = M7.unsafe_car(l2656);
              if (M4.pair_p(a2657) !== false) {
                if (M4.equal_p(x2650, M7.unsafe_car(a2657)) !== false) {
                  var if_res1622 = a2657;
                } else {
                  var t2658 = M7.unsafe_cdr(t2654);
                  var l2659 = M7.unsafe_cdr(l2656);
                  if (M4.eq_p(l2659, t2658) !== false) {
                    var if_res1621 = bad_list($rjs_core.Symbol.make("assoc"), l2651);
                  } else {
                    var if_res1621 = loop2652(l2659, t2658);
                  }
                  var if_res1622 = if_res1621;
                }
                var if_res1623 = if_res1622;
              } else {
                var if_res1623 = bad_item($rjs_core.Symbol.make("assoc"), a2657, l2651);
              }
              var if_res1625 = if_res1623;
            } else {
              if (M4.null_p(l2656) !== false) {
                var if_res1624 = false;
              } else {
                var if_res1624 = bad_list($rjs_core.Symbol.make("assoc"), l2651);
              }
              var if_res1625 = if_res1624;
            }
            var if_res1626 = if_res1625;
          }
          var if_res1627 = if_res1626;
        } else {
          var if_res1627 = bad_item($rjs_core.Symbol.make("assoc"), a2655, l2651);
        }
        var if_res1629 = if_res1627;
      } else {
        if (M4.null_p(l2653) !== false) {
          var if_res1628 = false;
        } else {
          var if_res1628 = bad_list($rjs_core.Symbol.make("assoc"), l2651);
        }
        var if_res1629 = if_res1628;
      }
      return if_res1629;
    };
    return loop2652(l2651, l2651);
  };
  var cl1619 = function(x2660, l2661, is_equal_p2662) {
    if (M4.procedure_p(is_equal_p2662) !== false) {
      var if_res1630 = M4.procedure_arity_includes_p(is_equal_p2662, 2);
    } else {
      var if_res1630 = false;
    }
    if (if_res1630 !== false) {
      var if_res1631 = M4.rvoid();
    } else {
      var if_res1631 = M4.raise_argument_error($rjs_core.Symbol.make("assoc"), "(any/c any/c . -> . any/c)", is_equal_p2662);
    }
    if_res1631;
    var loop2663 = function(l2664, t2665) {
      if (M4.pair_p(l2664) !== false) {
        var a2666 = M7.unsafe_car(l2664);
        if (M4.pair_p(a2666) !== false) {
          if (is_equal_p2662(x2660, M7.unsafe_car(a2666)) !== false) {
            var if_res1637 = a2666;
          } else {
            var l2667 = M7.unsafe_cdr(l2664);
            if (M4.pair_p(l2667) !== false) {
              var a2668 = M7.unsafe_car(l2667);
              if (M4.pair_p(a2668) !== false) {
                if (is_equal_p2662(x2660, M7.unsafe_car(a2668)) !== false) {
                  var if_res1633 = a2668;
                } else {
                  var t2669 = M7.unsafe_cdr(t2665);
                  var l2670 = M7.unsafe_cdr(l2667);
                  if (M4.eq_p(l2670, t2669) !== false) {
                    var if_res1632 = bad_list($rjs_core.Symbol.make("assoc"), l2661);
                  } else {
                    var if_res1632 = loop2663(l2670, t2669);
                  }
                  var if_res1633 = if_res1632;
                }
                var if_res1634 = if_res1633;
              } else {
                var if_res1634 = bad_item($rjs_core.Symbol.make("assoc"), a2668, l2661);
              }
              var if_res1636 = if_res1634;
            } else {
              if (M4.null_p(l2667) !== false) {
                var if_res1635 = false;
              } else {
                var if_res1635 = bad_list($rjs_core.Symbol.make("assoc"), l2661);
              }
              var if_res1636 = if_res1635;
            }
            var if_res1637 = if_res1636;
          }
          var if_res1638 = if_res1637;
        } else {
          var if_res1638 = bad_item($rjs_core.Symbol.make("assoc"), a2666, l2661);
        }
        var if_res1640 = if_res1638;
      } else {
        if (M4.null_p(l2664) !== false) {
          var if_res1639 = false;
        } else {
          var if_res1639 = bad_list($rjs_core.Symbol.make("assoc"), l2661);
        }
        var if_res1640 = if_res1639;
      }
      return if_res1640;
    };
    return loop2663(l2661, l2661);
  };
  var assoc2628 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1620 = {
      '2': cl1618,
      '3': cl1619
    }[arguments.length];
    if (fixed_lam1620 !== undefined !== false) {
      return fixed_lam1620.apply(null, arguments);
    } else {
      return M4.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var assf2629 = function(f2671, l2672) {
    if (M4.procedure_p(f2671) !== false) {
      var if_res1641 = M4.procedure_arity_includes_p(f2671, 1);
    } else {
      var if_res1641 = false;
    }
    if (if_res1641 !== false) {
      var if_res1642 = M4.rvoid();
    } else {
      var if_res1642 = M4.raise_argument_error($rjs_core.Symbol.make("assf"), "(any/c any/c . -> . any/c)", f2671);
    }
    if_res1642;
    var loop2673 = function(l2674, t2675) {
      if (M4.pair_p(l2674) !== false) {
        var a2676 = M7.unsafe_car(l2674);
        if (M4.pair_p(a2676) !== false) {
          if ((function(_2677, a2678) {
            return f2671(a2678);
          })(false, M7.unsafe_car(a2676)) !== false) {
            var if_res1648 = a2676;
          } else {
            var l2679 = M7.unsafe_cdr(l2674);
            if (M4.pair_p(l2679) !== false) {
              var a2680 = M7.unsafe_car(l2679);
              if (M4.pair_p(a2680) !== false) {
                if ((function(_2681, a2682) {
                  return f2671(a2682);
                })(false, M7.unsafe_car(a2680)) !== false) {
                  var if_res1644 = a2680;
                } else {
                  var t2683 = M7.unsafe_cdr(t2675);
                  var l2684 = M7.unsafe_cdr(l2679);
                  if (M4.eq_p(l2684, t2683) !== false) {
                    var if_res1643 = bad_list($rjs_core.Symbol.make("assf"), l2672);
                  } else {
                    var if_res1643 = loop2673(l2684, t2683);
                  }
                  var if_res1644 = if_res1643;
                }
                var if_res1645 = if_res1644;
              } else {
                var if_res1645 = bad_item($rjs_core.Symbol.make("assf"), a2680, l2672);
              }
              var if_res1647 = if_res1645;
            } else {
              if (M4.null_p(l2679) !== false) {
                var if_res1646 = false;
              } else {
                var if_res1646 = bad_list($rjs_core.Symbol.make("assf"), l2672);
              }
              var if_res1647 = if_res1646;
            }
            var if_res1648 = if_res1647;
          }
          var if_res1649 = if_res1648;
        } else {
          var if_res1649 = bad_item($rjs_core.Symbol.make("assf"), a2676, l2672);
        }
        var if_res1651 = if_res1649;
      } else {
        if (M4.null_p(l2674) !== false) {
          var if_res1650 = false;
        } else {
          var if_res1650 = bad_list($rjs_core.Symbol.make("assf"), l2672);
        }
        var if_res1651 = if_res1650;
      }
      return if_res1651;
    };
    return loop2673(l2672, l2672);
  };
  var let_result1652 = M4.values(assq2626, assv2627, assoc2628, assf2629);
  var assq = let_result1652.getAt(0);
  var assv = let_result1652.getAt(1);
  var assoc = let_result1652.getAt(2);
  var assf = let_result1652.getAt(3);
  var mapadd = function(f2685, l2686, last2687) {
    var loop2688 = function(l2689) {
      if (M4.null_p(l2689) !== false) {
        var if_res1653 = M4.list(last2687);
      } else {
        var if_res1653 = M4.cons(f2685(M4.car(l2689)), loop2688(M4.cdr(l2689)));
      }
      return if_res1653;
    };
    return loop2688(l2686);
  };
  var check_fold = function(name2690, proc2691, init2692, l2693, more2694) {
    if (M4.procedure_p(proc2691) !== false) {
      var if_res1654 = M4.rvoid();
    } else {
      var if_res1654 = M4.apply(M4.raise_argument_error, name2690, "procedure?", 0, proc2691, init2692, l2693, more2694);
    }
    if_res1654;
    if (M4.list_p(l2693) !== false) {
      var if_res1655 = M4.rvoid();
    } else {
      var if_res1655 = M4.apply(M4.raise_argument_error, name2690, "list?", 2, proc2691, init2692, l2693, more2694);
    }
    if_res1655;
    if (M4.null_p(more2694) !== false) {
      if (M4.procedure_arity_includes_p(proc2691, 2) !== false) {
        var if_res1656 = M4.rvoid();
      } else {
        var if_res1656 = M4.raise_mismatch_error(name2690, "given procedure does not accept 2 arguments: ", proc2691);
      }
      var if_res1661 = if_res1656;
    } else {
      var len2695 = M4.length(l2693);
      var loop2696 = function(more2697, n2698) {
        if (M4.null_p(more2697) !== false) {
          var if_res1659 = M4.rvoid();
        } else {
          if (M4.list_p(M4.car(more2697)) !== false) {
            var if_res1657 = M4.rvoid();
          } else {
            var if_res1657 = M4.apply(M4.raise_argument_error, name2690, "list?", n2698, proc2691, init2692, l2693, more2697);
          }
          if_res1657;
          if (M4._eq_(len2695, M4.length(M4.car(more2697))) !== false) {
            var if_res1658 = M4.rvoid();
          } else {
            var if_res1658 = M4.raise_mismatch_error(name2690, "given list does not have the same size as the first list: ", M4.car(more2697));
          }
          if_res1658;
          var if_res1659 = loop2696(M4.cdr(more2697), M4.add1(n2698));
        }
        return if_res1659;
      };
      loop2696(more2694, 3);
      if (M4.procedure_arity_includes_p(proc2691, 2 + M4.length(more2694)) !== false) {
        var if_res1660 = M4.rvoid();
      } else {
        var if_res1660 = M4.raise_mismatch_error(name2690, M4.format("given procedure does not accept ~a arguments: ", 2 + M4.length(more2694)), proc2691);
      }
      var if_res1661 = if_res1660;
    }
    return if_res1661;
  };
  var cl1662 = function(f2699, init2700, l2701) {
    check_fold($rjs_core.Symbol.make("foldl"), f2699, init2700, l2701, M4.rnull);
    var loop2702 = function(init2703, l2704) {
      if (M4.null_p(l2704) !== false) {
        var if_res1666 = init2703;
      } else {
        var if_res1666 = loop2702(f2699(M4.car(l2704), init2703), M4.cdr(l2704));
      }
      return if_res1666;
    };
    return loop2702(init2700, l2701);
  };
  var cl1663 = $rjs_core.attachProcedureArity(function(f2705, init2706, l2707) {
    var ls2708 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 3));
    check_fold($rjs_core.Symbol.make("foldl"), f2705, init2706, l2707, ls2708);
    var loop2709 = function(init2710, ls2711) {
      if (M4.pair_p(M4.car(ls2711)) !== false) {
        var if_res1667 = loop2709(M4.apply(f2705, mapadd(M4.car, ls2711, init2710)), M0.map(M4.cdr, ls2711));
      } else {
        var if_res1667 = init2710;
      }
      return if_res1667;
    };
    return loop2709(init2706, M4.cons(l2707, ls2708));
  });
  var foldl = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1664 = {'3': cl1662}[arguments.length];
    if (fixed_lam1664 !== undefined !== false) {
      return fixed_lam1664.apply(null, arguments);
    } else {
      if (M4._gt__eq_(cl1663.length, 1) !== false) {
        var if_res1665 = cl1663.apply(null, arguments);
      } else {
        var if_res1665 = M4.error("case-lambda: invalid case");
      }
      return if_res1665;
    }
  }, [M4.make_arity_at_least(3)]);
  var cl1668 = function(f2712, init2713, l2714) {
    check_fold($rjs_core.Symbol.make("foldr"), f2712, init2713, l2714, M4.rnull);
    var loop2715 = function(init2716, l2717) {
      if (M4.null_p(l2717) !== false) {
        var if_res1672 = init2716;
      } else {
        var if_res1672 = f2712(M4.car(l2717), loop2715(init2716, M4.cdr(l2717)));
      }
      return if_res1672;
    };
    return loop2715(init2713, l2714);
  };
  var cl1669 = $rjs_core.attachProcedureArity(function(f2718, init2719, l2720) {
    var ls2721 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 3));
    check_fold($rjs_core.Symbol.make("foldr"), f2718, init2719, l2720, ls2721);
    var loop2722 = function(ls2723) {
      if (M4.pair_p(M4.car(ls2723)) !== false) {
        var if_res1673 = M4.apply(f2718, mapadd(M4.car, ls2723, loop2722(M0.map(M4.cdr, ls2723))));
      } else {
        var if_res1673 = init2719;
      }
      return if_res1673;
    };
    return loop2722(M4.cons(l2720, ls2721));
  });
  var foldr = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1670 = {'3': cl1668}[arguments.length];
    if (fixed_lam1670 !== undefined !== false) {
      return fixed_lam1670.apply(null, arguments);
    } else {
      if (M4._gt__eq_(cl1669.length, 1) !== false) {
        var if_res1671 = cl1669.apply(null, arguments);
      } else {
        var if_res1671 = M4.error("case-lambda: invalid case");
      }
      return if_res1671;
    }
  }, [M4.make_arity_at_least(3)]);
  var filter = function(f2724, list2725) {
    if (M4.procedure_p(f2724) !== false) {
      var if_res1674 = M4.procedure_arity_includes_p(f2724, 1);
    } else {
      var if_res1674 = false;
    }
    if (if_res1674 !== false) {
      var if_res1675 = M4.rvoid();
    } else {
      var if_res1675 = M4.raise_argument_error($rjs_core.Symbol.make("filter"), "(any/c . -> . any/c)", f2724);
    }
    if_res1675;
    if (M4.list_p(list2725) !== false) {
      var if_res1676 = M4.rvoid();
    } else {
      var if_res1676 = M4.raise_argument_error($rjs_core.Symbol.make("filter"), "list?", list2725);
    }
    if_res1676;
    var loop2726 = function(l2727, result2728) {
      if (M4.null_p(l2727) !== false) {
        var if_res1679 = M6.alt_reverse(result2728);
      } else {
        var temp1678 = M4.cdr(l2727);
        if (f2724(M4.car(l2727)) !== false) {
          var if_res1677 = M4.cons(M4.car(l2727), result2728);
        } else {
          var if_res1677 = result2728;
        }
        var if_res1679 = loop2726(temp1678, if_res1677);
      }
      return if_res1679;
    };
    return loop2726(list2725, M4.rnull);
  };
  var build_vector = function(n2729, fcn2730) {
    if (M4.exact_nonnegative_integer_p(n2729) !== false) {
      var if_res1680 = M4.rvoid();
    } else {
      var if_res1680 = M4.raise_argument_error($rjs_core.Symbol.make("build-vector"), "exact-nonnegative-integer?", n2729);
    }
    if_res1680;
    if (M4.procedure_p(fcn2730) !== false) {
      var if_res1681 = M4.procedure_arity_includes_p(fcn2730, 1);
    } else {
      var if_res1681 = false;
    }
    if (if_res1681 !== false) {
      var if_res1682 = M4.rvoid();
    } else {
      var if_res1682 = M4.raise_argument_error($rjs_core.Symbol.make("build-vector"), "(exact-nonnegative-integer? . -> . any/c)", fcn2730);
    }
    if_res1682;
    var vec2731 = M4.make_vector(n2729);
    var loop2732 = function(i2733) {
      if (M4._eq_(i2733, n2729) !== false) {
        var if_res1683 = vec2731;
      } else {
        M4.vector_set_bang_(vec2731, i2733, fcn2730(i2733));
        var if_res1683 = loop2732(M4.add1(i2733));
      }
      return if_res1683;
    };
    return loop2732(0);
  };
  var build_string = function(n2734, fcn2735) {
    if (M4.exact_nonnegative_integer_p(n2734) !== false) {
      var if_res1684 = M4.rvoid();
    } else {
      var if_res1684 = M4.raise_argument_error($rjs_core.Symbol.make("build-string"), "exact-nonnegative-integer?", n2734);
    }
    if_res1684;
    if (M4.procedure_p(fcn2735) !== false) {
      var if_res1685 = M4.procedure_arity_includes_p(fcn2735, 1);
    } else {
      var if_res1685 = false;
    }
    if (if_res1685 !== false) {
      var if_res1686 = M4.rvoid();
    } else {
      var if_res1686 = M4.raise_argument_error($rjs_core.Symbol.make("build-string"), "(exact-nonnegative-integer? . -> . char?)", fcn2735);
    }
    if_res1686;
    var str2736 = M4.make_string(n2734);
    var loop2737 = function(i2738) {
      if (M4._eq_(i2738, n2734) !== false) {
        var if_res1687 = str2736;
      } else {
        M4.string_set_bang_(str2736, i2738, fcn2735(i2738));
        var if_res1687 = loop2737(M4.add1(i2738));
      }
      return if_res1687;
    };
    return loop2737(0);
  };
  var build_list = function(n2739, fcn2740) {
    if (M4.exact_nonnegative_integer_p(n2739) !== false) {
      var if_res1688 = M4.rvoid();
    } else {
      var if_res1688 = M4.raise_argument_error($rjs_core.Symbol.make("build-list"), "exact-nonnegative-integer?", n2739);
    }
    if_res1688;
    if (M4.procedure_p(fcn2740) !== false) {
      var if_res1689 = M4.procedure_arity_includes_p(fcn2740, 1);
    } else {
      var if_res1689 = false;
    }
    if (if_res1689 !== false) {
      var if_res1690 = M4.rvoid();
    } else {
      var if_res1690 = M4.raise_argument_error($rjs_core.Symbol.make("build-list"), "(exact-nonnegative-integer? . -> . any/c)", fcn2740);
    }
    if_res1690;
    var recr2741 = function(j2742, i2743) {
      if (M4.zero_p(i2743) !== false) {
        var if_res1691 = M4.rnull;
      } else {
        var if_res1691 = M4.cons(fcn2740(j2742), recr2741(M4.add1(j2742), M4.sub1(i2743)));
      }
      return if_res1691;
    };
    return recr2741(0, n2739);
  };
  var pipeline12744 = function(f2745, rfuns2746) {
    return function(x2747) {
      var loop2748 = function(x2749, f2750, rfuns2751) {
        if (M4.null_p(rfuns2751) !== false) {
          var if_res1692 = f2750(x2749);
        } else {
          var if_res1692 = loop2748(f2750(x2749), M4.car(rfuns2751), M4.cdr(rfuns2751));
        }
        return if_res1692;
      };
      return loop2748(x2747, f2745, rfuns2746);
    };
  };
  var pipeline_times_2752 = function(f2753, rfuns2754) {
    if (M4.eqv_p(1, M1.norm_procedure_arity(f2753)) !== false) {
      var loop2755 = function(f2756, rfuns2757) {
        if (M4.null_p(rfuns2757) !== false) {
          var if_res1694 = f2756;
        } else {
          var fst2758 = M4.car(rfuns2757);
          if (M4.eqv_p(1, M1.norm_procedure_arity(fst2758)) !== false) {
            var if_res1693 = function(x2759) {
              return fst2758(f2756(x2759));
            };
          } else {
            var if_res1693 = function(x2760) {
              return M4.call_with_values(function() {
                return f2756(x2760);
              }, fst2758);
            };
          }
          var if_res1694 = loop2755(if_res1693, M4.cdr(rfuns2757));
        }
        return if_res1694;
      };
      var if_res1699 = loop2755(f2753, rfuns2754);
    } else {
      var funs2761 = M6.alt_reverse(M4.cons(f2753, rfuns2754));
      var loop2762 = function(f2763, funs2764) {
        if (M4.null_p(funs2764) !== false) {
          var if_res1698 = f2763;
        } else {
          var fst2765 = M4.car(funs2764);
          if (M4.eqv_p(1, M1.norm_procedure_arity(f2763)) !== false) {
            if (M4.eqv_p(1, M1.norm_procedure_arity(fst2765)) !== false) {
              var if_res1695 = function(x2766) {
                return f2763(fst2765(x2766));
              };
            } else {
              var if_res1695 = $rjs_core.attachProcedureArity(function() {
                var xs2767 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
                return f2763(M4.apply(fst2765, xs2767));
              });
            }
            var if_res1697 = if_res1695;
          } else {
            if (M4.eqv_p(1, M1.norm_procedure_arity(fst2765)) !== false) {
              var if_res1696 = function(x2768) {
                return M4.call_with_values(function() {
                  return fst2765(x2768);
                }, f2763);
              };
            } else {
              var if_res1696 = $rjs_core.attachProcedureArity(function() {
                var xs2769 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
                return M4.call_with_values(function() {
                  return M4.apply(fst2765, xs2769);
                }, f2763);
              });
            }
            var if_res1697 = if_res1696;
          }
          var if_res1698 = loop2762(if_res1697, M4.cdr(funs2764));
        }
        return if_res1698;
      };
      var if_res1699 = loop2762(M4.car(funs2761), M4.cdr(funs2761));
    }
    return if_res1699;
  };
  var simple_compose2771 = function(f2772, g2773) {
    var arity2774 = M1.norm_procedure_arity(g2773);
    var let_result1700 = M5.procedure_keywords(g2773);
    var required_kwds2775 = let_result1700.getAt(0);
    var allowed_kwds2776 = let_result1700.getAt(1);
    if (M4.eq_p(1, arity2774) !== false) {
      var if_res1706 = function(x2778) {
        return f2772(g2773(x2778));
      };
    } else {
      var cl1701 = function(x2779) {
        return f2772(g2773(x2779));
      };
      var cl1702 = function(x2780, y2781) {
        return f2772(g2773(x2780, y2781));
      };
      var cl1703 = $rjs_core.attachProcedureArity(function() {
        var args2782 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
        return f2772(M4.apply(g2773, args2782));
      });
      var if_res1706 = $rjs_core.attachProcedureArity(function() {
        var fixed_lam1704 = {
          '1': cl1701,
          '2': cl1702
        }[arguments.length];
        if (fixed_lam1704 !== undefined !== false) {
          return fixed_lam1704.apply(null, arguments);
        } else {
          if (true !== false) {
            var if_res1705 = cl1703.apply(null, arguments);
          } else {
            var if_res1705 = M4.error("case-lambda: invalid case");
          }
          return if_res1705;
        }
      }, [M4.make_arity_at_least(0)]);
    }
    var composed2777 = if_res1706;
    if (M4.null_p(allowed_kwds2776) !== false) {
      var if_res1707 = composed2777;
    } else {
      var if_res1707 = M5.make_keyword_procedure($rjs_core.attachProcedureArity(function(kws2783, kw_args2784) {
        var xs2785 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
        return f2772(M2.keyword_apply(g2773, kws2783, kw_args2784, xs2785));
      }), composed2777);
    }
    return if_res1707;
  };
  var cl1708 = function(f2786) {
    if (M4.procedure_p(f2786) !== false) {
      var if_res1714 = f2786;
    } else {
      var if_res1714 = M4.raise_argument_error($rjs_core.Symbol.make("compose1"), "procedure?", 0, f2786);
    }
    return if_res1714;
  };
  var cl1709 = function(f2787, g2788) {
    if (M4.procedure_p(f2787) !== false) {
      var if_res1715 = M4.rvoid();
    } else {
      var if_res1715 = M4.raise_argument_error($rjs_core.Symbol.make("compose1"), "procedure?", 0, f2787, g2788);
    }
    if_res1715;
    if (M4.procedure_p(g2788) !== false) {
      var if_res1716 = M4.rvoid();
    } else {
      var if_res1716 = M4.raise_argument_error($rjs_core.Symbol.make("compose1"), "procedure?", 1, f2787, g2788);
    }
    if_res1716;
    if (M4.procedure_arity_includes_p(f2787, 1) !== false) {
      var if_res1717 = M4.rvoid();
    } else {
      var if_res1717 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose1"), "(any/c . -> . any/c)", 0, f2787, $rjs_core.Pair.Empty);
    }
    if_res1717;
    var let_result1718 = M5.procedure_keywords(f2787);
    var req2789 = let_result1718.getAt(0);
    var _2790 = let_result1718.getAt(1);
    if (M4.null_p(req2789) !== false) {
      var if_res1719 = M4.rvoid();
    } else {
      var if_res1719 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose1"), "procedure-with-no-required-keywords?", 0, f2787, $rjs_core.Pair.Empty);
    }
    if_res1719;
    return simple_compose2771(f2787, g2788);
  };
  var cl1710 = function() {
    return M4.values;
  };
  var cl1711 = $rjs_core.attachProcedureArity(function(f02791) {
    var fs02792 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
    var loop2793 = function(f2794, fs2795, i2796, rfuns2797) {
      if (M4.procedure_p(f2794) !== false) {
        var if_res1720 = M4.rvoid();
      } else {
        var if_res1720 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose1"), "procedure?", i2796, f02791, fs02792);
      }
      if_res1720;
      if (M4.pair_p(fs2795) !== false) {
        if (M4.procedure_arity_includes_p(f2794, 1) !== false) {
          var if_res1721 = M4.rvoid();
        } else {
          var if_res1721 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose1"), "(any/c . -> . any/c)", i2796, f02791, fs02792);
        }
        if_res1721;
        var let_result1722 = M5.procedure_keywords(f2794);
        var req2798 = let_result1722.getAt(0);
        var _2799 = let_result1722.getAt(1);
        if (M4.null_p(req2798) !== false) {
          var if_res1723 = M4.rvoid();
        } else {
          var if_res1723 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose1"), "procedure-with-no-required-keywords?", i2796, f02791, fs02792);
        }
        if_res1723;
        var if_res1724 = loop2793(M4.car(fs2795), M4.cdr(fs2795), M4.add1(i2796), M4.cons(f2794, rfuns2797));
      } else {
        var if_res1724 = simple_compose2771(pipeline12744(M4.car(rfuns2797), M4.cdr(rfuns2797)), f2794);
      }
      return if_res1724;
    };
    return loop2793(f02791, fs02792, 0, $rjs_core.Pair.Empty);
  });
  var compose12770 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1712 = {
      '1': cl1708,
      '2': cl1709,
      '0': cl1710
    }[arguments.length];
    if (fixed_lam1712 !== undefined !== false) {
      return fixed_lam1712.apply(null, arguments);
    } else {
      if (M4._gt__eq_(cl1711.length, 1) !== false) {
        var if_res1713 = cl1711.apply(null, arguments);
      } else {
        var if_res1713 = M4.error("case-lambda: invalid case");
      }
      return if_res1713;
    }
  }, [0, M4.make_arity_at_least(1)]);
  var simple_compose2801 = function(f2802, g2803) {
    if (M4.eqv_p(1, M1.norm_procedure_arity(f2802)) !== false) {
      var arity2804 = M1.norm_procedure_arity(g2803);
      var let_result1725 = M5.procedure_keywords(g2803);
      var required_kwds2805 = let_result1725.getAt(0);
      var allowed_kwds2806 = let_result1725.getAt(1);
      if (M4.eq_p(1, arity2804) !== false) {
        var if_res1731 = function(x2808) {
          return f2802(g2803(x2808));
        };
      } else {
        var cl1726 = function(x2809) {
          return f2802(g2803(x2809));
        };
        var cl1727 = function(x2810, y2811) {
          return f2802(g2803(x2810, y2811));
        };
        var cl1728 = $rjs_core.attachProcedureArity(function() {
          var args2812 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          return f2802(M4.apply(g2803, args2812));
        });
        var if_res1731 = $rjs_core.attachProcedureArity(function() {
          var fixed_lam1729 = {
            '1': cl1726,
            '2': cl1727
          }[arguments.length];
          if (fixed_lam1729 !== undefined !== false) {
            return fixed_lam1729.apply(null, arguments);
          } else {
            if (true !== false) {
              var if_res1730 = cl1728.apply(null, arguments);
            } else {
              var if_res1730 = M4.error("case-lambda: invalid case");
            }
            return if_res1730;
          }
        }, [M4.make_arity_at_least(0)]);
      }
      var composed2807 = if_res1731;
      if (M4.null_p(allowed_kwds2806) !== false) {
        var if_res1732 = composed2807;
      } else {
        var if_res1732 = M5.make_keyword_procedure($rjs_core.attachProcedureArity(function(kws2813, kw_args2814) {
          var xs2815 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
          return f2802(M2.keyword_apply(g2803, kws2813, kw_args2814, xs2815));
        }), composed2807);
      }
      var if_res1741 = if_res1732;
    } else {
      var arity2816 = M1.norm_procedure_arity(g2803);
      var let_result1733 = M5.procedure_keywords(g2803);
      var required_kwds2817 = let_result1733.getAt(0);
      var allowed_kwds2818 = let_result1733.getAt(1);
      if (M4.eq_p(1, arity2816) !== false) {
        var if_res1739 = function(x2820) {
          return M4.call_with_values(function() {
            return g2803(x2820);
          }, f2802);
        };
      } else {
        var cl1734 = function(x2821) {
          return M4.call_with_values(function() {
            return g2803(x2821);
          }, f2802);
        };
        var cl1735 = function(x2822, y2823) {
          return M4.call_with_values(function() {
            return g2803(x2822, y2823);
          }, f2802);
        };
        var cl1736 = $rjs_core.attachProcedureArity(function() {
          var args2824 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          return M4.call_with_values(function() {
            return M4.apply(g2803, args2824);
          }, f2802);
        });
        var if_res1739 = $rjs_core.attachProcedureArity(function() {
          var fixed_lam1737 = {
            '1': cl1734,
            '2': cl1735
          }[arguments.length];
          if (fixed_lam1737 !== undefined !== false) {
            return fixed_lam1737.apply(null, arguments);
          } else {
            if (true !== false) {
              var if_res1738 = cl1736.apply(null, arguments);
            } else {
              var if_res1738 = M4.error("case-lambda: invalid case");
            }
            return if_res1738;
          }
        }, [M4.make_arity_at_least(0)]);
      }
      var composed2819 = if_res1739;
      if (M4.null_p(allowed_kwds2818) !== false) {
        var if_res1740 = composed2819;
      } else {
        var if_res1740 = M5.make_keyword_procedure($rjs_core.attachProcedureArity(function(kws2825, kw_args2826) {
          var xs2827 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
          return M4.call_with_values(function() {
            return M2.keyword_apply(g2803, kws2825, kw_args2826, xs2827);
          }, f2802);
        }), composed2819);
      }
      var if_res1741 = if_res1740;
    }
    return if_res1741;
  };
  var cl1742 = function(f2828) {
    if (M4.procedure_p(f2828) !== false) {
      var if_res1748 = f2828;
    } else {
      var if_res1748 = M4.raise_argument_error($rjs_core.Symbol.make("compose"), "procedure?", 0, f2828);
    }
    return if_res1748;
  };
  var cl1743 = function(f2829, g2830) {
    if (M4.procedure_p(f2829) !== false) {
      var if_res1749 = M4.rvoid();
    } else {
      var if_res1749 = M4.raise_argument_error($rjs_core.Symbol.make("compose"), "procedure?", 0, f2829, g2830);
    }
    if_res1749;
    if (M4.procedure_p(g2830) !== false) {
      var if_res1750 = M4.rvoid();
    } else {
      var if_res1750 = M4.raise_argument_error($rjs_core.Symbol.make("compose"), "procedure?", 1, f2829, g2830);
    }
    if_res1750;
    var let_result1751 = M5.procedure_keywords(f2829);
    var req2831 = let_result1751.getAt(0);
    var _2832 = let_result1751.getAt(1);
    if (M4.null_p(req2831) !== false) {
      var if_res1752 = M4.rvoid();
    } else {
      var if_res1752 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose"), "procedure-with-no-required-keywords?", 0, f2829, $rjs_core.Pair.Empty);
    }
    if_res1752;
    return simple_compose2801(f2829, g2830);
  };
  var cl1744 = function() {
    return M4.values;
  };
  var cl1745 = $rjs_core.attachProcedureArity(function(f02833) {
    var fs02834 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
    var loop2835 = function(f2836, fs2837, i2838, rfuns2839) {
      if (M4.procedure_p(f2836) !== false) {
        var if_res1753 = M4.rvoid();
      } else {
        var if_res1753 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose"), "procedure?", i2838, f02833, fs02834);
      }
      if_res1753;
      if (M4.pair_p(fs2837) !== false) {
        var let_result1754 = M5.procedure_keywords(f2836);
        var req2840 = let_result1754.getAt(0);
        var _2841 = let_result1754.getAt(1);
        if (M4.null_p(req2840) !== false) {
          var if_res1755 = M4.rvoid();
        } else {
          var if_res1755 = M4.apply(M4.raise_argument_error, $rjs_core.Symbol.make("compose"), "procedure-with-no-required-keywords?", i2838, f02833, fs02834);
        }
        if_res1755;
        var if_res1756 = loop2835(M4.car(fs2837), M4.cdr(fs2837), M4.add1(i2838), M4.cons(f2836, rfuns2839));
      } else {
        var if_res1756 = simple_compose2801(pipeline_times_2752(M4.car(rfuns2839), M4.cdr(rfuns2839)), f2836);
      }
      return if_res1756;
    };
    return loop2835(f02833, fs02834, 0, $rjs_core.Pair.Empty);
  });
  var compose2800 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1746 = {
      '1': cl1742,
      '2': cl1743,
      '0': cl1744
    }[arguments.length];
    if (fixed_lam1746 !== undefined !== false) {
      return fixed_lam1746.apply(null, arguments);
    } else {
      if (M4._gt__eq_(cl1745.length, 1) !== false) {
        var if_res1747 = cl1745.apply(null, arguments);
      } else {
        var if_res1747 = M4.error("case-lambda: invalid case");
      }
      return if_res1747;
    }
  }, [0, M4.make_arity_at_least(1)]);
  var let_result1757 = M4.values(compose12770, compose2800);
  var compose1 = let_result1757.getAt(0);
  var compose = let_result1757.getAt(1);
  var __rjs_quoted__ = {};
  __rjs_quoted__.sort7 = sort7;
  __rjs_quoted__.sort9 = sort9;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get compose1() {
      return compose1;
    },
    get compose() {
      return compose;
    },
    get build_list() {
      return build_list;
    },
    get build_string() {
      return build_string;
    },
    get build_vector() {
      return build_vector;
    },
    get filter() {
      return filter;
    },
    get assoc() {
      return assoc;
    },
    get assv() {
      return assv;
    },
    get assq() {
      return assq;
    },
    get findf() {
      return findf;
    },
    get assf() {
      return assf;
    },
    get memf() {
      return memf;
    },
    get remove_times_() {
      return remove_times_;
    },
    get remq_times_() {
      return remq_times_;
    },
    get remv_times_() {
      return remv_times_;
    },
    get remove() {
      return remove;
    },
    get remq() {
      return remq;
    },
    get remv() {
      return remv;
    },
    get foldr() {
      return foldr;
    },
    get foldl() {
      return foldl;
    }
  };
})();
var $__runtime_47_flfxnum_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "runtime/flfxnum.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var __rjs_quoted__ = {};
  ;
  return {get __rjs_quoted__() {
      return __rjs_quoted__;
    }};
})();
var $__collects_47_racket_47_private_47_for_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/for.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_sort_46_rkt_46_js__;
  var M1 = $__runtime_47_flfxnum_46_rkt_46_js__;
  var M2 = $__runtime_47_kernel_46_rkt_46_js__;
  var M3 = $__collects_47_racket_47_private_47_member_46_rkt_46_js__;
  var M4 = $__collects_47_racket_47_private_47_reverse_46_rkt_46_js__;
  var M5 = $__runtime_47_unsafe_46_rkt_46_js__;
  var let_result968 = M2.make_struct_type($rjs_core.Symbol.make("sequence"), false, 1, 0, false);
  var struct_do_sequence = let_result968.getAt(0);
  var make_do_sequence = let_result968.getAt(1);
  var do_sequence_p = let_result968.getAt(2);
  var do_sequence_ref = let_result968.getAt(3);
  var do_sequence_set_bang_ = let_result968.getAt(4);
  var let_result977 = M2.make_struct_type_property($rjs_core.Symbol.make("stream"), function(v1688, si1689) {
    if (M2.vector_p(v1688) !== false) {
      if (M2._eq_(3, M2.vector_length(v1688)) !== false) {
        if (M2.procedure_p(M2.vector_ref(v1688, 0)) !== false) {
          if (M2.procedure_arity_includes_p(M2.vector_ref(v1688, 0), 1) !== false) {
            if (M2.procedure_p(M2.vector_ref(v1688, 1)) !== false) {
              if (M2.procedure_arity_includes_p(M2.vector_ref(v1688, 1), 1) !== false) {
                if (M2.procedure_p(M2.vector_ref(v1688, 2)) !== false) {
                  var if_res969 = M2.procedure_arity_includes_p(M2.vector_ref(v1688, 2), 1);
                } else {
                  var if_res969 = false;
                }
                var if_res970 = if_res969;
              } else {
                var if_res970 = false;
              }
              var if_res971 = if_res970;
            } else {
              var if_res971 = false;
            }
            var if_res972 = if_res971;
          } else {
            var if_res972 = false;
          }
          var if_res973 = if_res972;
        } else {
          var if_res973 = false;
        }
        var if_res974 = if_res973;
      } else {
        var if_res974 = false;
      }
      var if_res975 = if_res974;
    } else {
      var if_res975 = false;
    }
    if (if_res975 !== false) {
      var if_res976 = M2.rvoid();
    } else {
      var if_res976 = M2.raise_argument_error($rjs_core.Symbol.make("guard-for-prop:stream"), M2.string_append("(vector/c (procedure-arity-includes/c 1)\n", "          (procedure-arity-includes/c 1)\n", "          (procedure-arity-includes/c 1))"), v1688);
    }
    if_res976;
    return M2.vector__gt_immutable_vector(v1688);
  });
  var prop_stream = let_result977.getAt(0);
  var stream_via_prop_p = let_result977.getAt(1);
  var stream_ref = let_result977.getAt(2);
  var let_result980 = M2.make_struct_type_property($rjs_core.Symbol.make("sequence"), function(v1690, si1691) {
    if (M2.procedure_p(v1690) !== false) {
      var if_res978 = M2.procedure_arity_includes_p(v1690, 1);
    } else {
      var if_res978 = false;
    }
    if (if_res978 !== false) {
      var if_res979 = M2.rvoid();
    } else {
      var if_res979 = M2.raise_argument_error($rjs_core.Symbol.make("guard-for-prop:sequence"), "(procedure-arity-includes/c 1)", v1690);
    }
    if_res979;
    return v1690;
  });
  var prop_gen_sequence = let_result980.getAt(0);
  var sequence_via_prop_p = let_result980.getAt(1);
  var sequence_ref = let_result980.getAt(2);
  var let_result984 = M2.make_struct_type_property($rjs_core.Symbol.make("sequence"), function(v1692, sinfo1693) {
    if (M2.procedure_p(v1692) !== false) {
      var if_res981 = M2.procedure_arity_includes_p(v1692, 1);
    } else {
      var if_res981 = false;
    }
    if (if_res981 !== false) {
      var if_res982 = M2.rvoid();
    } else {
      var if_res982 = M2.raise_argument_error($rjs_core.Symbol.make("sequence-property-guard"), "(procedure-arity-includes/c 1)", v1692);
    }
    if_res982;
    return function(self1694) {
      var s1695 = v1692(self1694);
      if (sequence_p(s1695) !== false) {
        var if_res983 = M2.rvoid();
      } else {
        var if_res983 = M2.__rjs_quoted__.raise_mismatch_error($rjs_core.Symbol.make("sequence-generate"), "procedure (value of prop:sequence) produced a non-sequence: ", s1695);
      }
      if_res983;
      return s1695;
    };
  });
  var prop_sequence = let_result984.getAt(0);
  var _sequence_p = let_result984.getAt(1);
  var _sequence_ref = let_result984.getAt(2);
  var stream_p = function(v1696) {
    var or_part1697 = M2.list_p(v1696);
    if (or_part1697 !== false) {
      var if_res985 = or_part1697;
    } else {
      var if_res985 = stream_via_prop_p(v1696);
    }
    return if_res985;
  };
  var unsafe_stream_not_empty_p = function(v1698) {
    if (M2.null_p(v1698) !== false) {
      var if_res987 = false;
    } else {
      var or_part1699 = M2.pair_p(v1698);
      if (or_part1699 !== false) {
        var if_res986 = or_part1699;
      } else {
        var if_res986 = M2.not(M5.unsafe_vector_ref(stream_ref(v1698), 0)(v1698));
      }
      var if_res987 = if_res986;
    }
    return if_res987;
  };
  var stream_empty_p = function(v1700) {
    var or_part1701 = M2.null_p(v1700);
    if (or_part1701 !== false) {
      var if_res990 = or_part1701;
    } else {
      if (stream_p(v1700) !== false) {
        if (M2.pair_p(v1700) !== false) {
          var if_res988 = false;
        } else {
          var if_res988 = M5.unsafe_vector_ref(stream_ref(v1700), 0)(v1700);
        }
        var if_res989 = if_res988;
      } else {
        var if_res989 = M2.raise_argument_error($rjs_core.Symbol.make("stream-empty?"), "stream?", v1700);
      }
      var if_res990 = if_res989;
    }
    return if_res990;
  };
  var unsafe_stream_first = function(v1702) {
    if (M2.pair_p(v1702) !== false) {
      var if_res991 = M2.car(v1702);
    } else {
      var if_res991 = M5.unsafe_vector_ref(stream_ref(v1702), 1)(v1702);
    }
    return if_res991;
  };
  var stream_first = function(v1703) {
    if (stream_p(v1703) !== false) {
      var if_res992 = M2.not(stream_empty_p(v1703));
    } else {
      var if_res992 = false;
    }
    if (if_res992 !== false) {
      var if_res993 = unsafe_stream_first(v1703);
    } else {
      var if_res993 = M2.raise_argument_error($rjs_core.Symbol.make("stream-first"), "(and/c stream? (not/c stream-empty?))", v1703);
    }
    return if_res993;
  };
  var unsafe_stream_rest = function(v1704) {
    if (M2.pair_p(v1704) !== false) {
      var if_res995 = M2.cdr(v1704);
    } else {
      var r1705 = M5.unsafe_vector_ref(stream_ref(v1704), 2)(v1704);
      if (stream_p(r1705) !== false) {
        var if_res994 = M2.rvoid();
      } else {
        var if_res994 = M2.__rjs_quoted__.raise_mismatch_error($rjs_core.Symbol.make("stream-rest-guard"), "result is not a stream: ", r1705);
      }
      if_res994;
      var if_res995 = r1705;
    }
    return if_res995;
  };
  var stream_rest = function(v1706) {
    if (stream_p(v1706) !== false) {
      var if_res996 = M2.not(stream_empty_p(v1706));
    } else {
      var if_res996 = false;
    }
    if (if_res996 !== false) {
      var if_res997 = unsafe_stream_rest(v1706);
    } else {
      var if_res997 = M2.raise_argument_error($rjs_core.Symbol.make("stream-rest"), "(and/c stream? (not/c stream-empty?))", v1706);
    }
    return if_res997;
  };
  var sequence_p = function(v1707) {
    var or_part1708 = M2.exact_nonnegative_integer_p(v1707);
    if (or_part1708 !== false) {
      var if_res1010 = or_part1708;
    } else {
      var or_part1709 = do_sequence_p(v1707);
      if (or_part1709 !== false) {
        var if_res1009 = or_part1709;
      } else {
        var or_part1710 = sequence_via_prop_p(v1707);
        if (or_part1710 !== false) {
          var if_res1008 = or_part1710;
        } else {
          var or_part1711 = stream_p(v1707);
          if (or_part1711 !== false) {
            var if_res1007 = or_part1711;
          } else {
            var or_part1712 = M2.mpair_p(v1707);
            if (or_part1712 !== false) {
              var if_res1006 = or_part1712;
            } else {
              var or_part1713 = M2.vector_p(v1707);
              if (or_part1713 !== false) {
                var if_res1005 = or_part1713;
              } else {
                var or_part1714 = M1.__rjs_quoted__.flvector_p(v1707);
                if (or_part1714 !== false) {
                  var if_res1004 = or_part1714;
                } else {
                  var or_part1715 = M1.__rjs_quoted__.fxvector_p(v1707);
                  if (or_part1715 !== false) {
                    var if_res1003 = or_part1715;
                  } else {
                    var or_part1716 = M2.string_p(v1707);
                    if (or_part1716 !== false) {
                      var if_res1002 = or_part1716;
                    } else {
                      var or_part1717 = M2.bytes_p(v1707);
                      if (or_part1717 !== false) {
                        var if_res1001 = or_part1717;
                      } else {
                        var or_part1718 = M2.input_port_p(v1707);
                        if (or_part1718 !== false) {
                          var if_res1000 = or_part1718;
                        } else {
                          var or_part1719 = M2.__rjs_quoted__.hash_p(v1707);
                          if (or_part1719 !== false) {
                            var if_res999 = or_part1719;
                          } else {
                            if (_sequence_p(v1707) !== false) {
                              var if_res998 = M2.not(M2.struct_type_p(v1707));
                            } else {
                              var if_res998 = false;
                            }
                            var if_res999 = if_res998;
                          }
                          var if_res1000 = if_res999;
                        }
                        var if_res1001 = if_res1000;
                      }
                      var if_res1002 = if_res1001;
                    }
                    var if_res1003 = if_res1002;
                  }
                  var if_res1004 = if_res1003;
                }
                var if_res1005 = if_res1004;
              }
              var if_res1006 = if_res1005;
            }
            var if_res1007 = if_res1006;
          }
          var if_res1008 = if_res1007;
        }
        var if_res1009 = if_res1008;
      }
      var if_res1010 = if_res1009;
    }
    return if_res1010;
  };
  var make_sequence = function(who1720, v1721) {
    if (M2.exact_nonnegative_integer_p(v1721) !== false) {
      var if_res1028 = _integer_gen(v1721);
    } else {
      if (do_sequence_p(v1721) !== false) {
        var cl1011 = function(pos__gt_vals1722, pos_next1723, init1724, pos_cont_p1725, val_cont_p1726, all_cont_p1727) {
          return M2.values(pos__gt_vals1722, false, pos_next1723, init1724, pos_cont_p1725, val_cont_p1726, all_cont_p1727);
        };
        var cl1012 = function(pos__gt_vals1728, pre_pos_next1729, pos_next1730, init1731, pos_cont_p1732, val_cont_p1733, all_cont_p1734) {
          return M2.values(pos__gt_vals1728, pre_pos_next1729, pos_next1730, init1731, pos_cont_p1732, val_cont_p1733, all_cont_p1734);
        };
        var if_res1027 = M2.call_with_values(function() {
          return do_sequence_ref(v1721, 0)();
        }, $rjs_core.attachProcedureArity(function() {
          var fixed_lam1013 = {
            '6': cl1011,
            '7': cl1012
          }[arguments.length];
          if (fixed_lam1013 !== undefined !== false) {
            return fixed_lam1013.apply(null, arguments);
          } else {
            return M2.error("case-lambda: invalid case");
          }
        }, [6, 7]));
      } else {
        if (M2.mpair_p(v1721) !== false) {
          var if_res1026 = _mlist_gen(v1721);
        } else {
          if (M2.list_p(v1721) !== false) {
            var if_res1025 = _list_gen(v1721);
          } else {
            if (M2.vector_p(v1721) !== false) {
              var if_res1024 = _vector_gen(v1721, 0, M2.vector_length(v1721), 1);
            } else {
              if (M1.__rjs_quoted__.flvector_p(v1721) !== false) {
                var if_res1023 = _flvector_gen(v1721, 0, M1.__rjs_quoted__.flvector_length(v1721), 1);
              } else {
                if (M1.__rjs_quoted__.fxvector_p(v1721) !== false) {
                  var if_res1022 = _fxvector_gen(v1721, 0, M1.__rjs_quoted__.fxvector_length(v1721), 1);
                } else {
                  if (M2.string_p(v1721) !== false) {
                    var if_res1021 = _string_gen(v1721, 0, M2.string_length(v1721), 1);
                  } else {
                    if (M2.bytes_p(v1721) !== false) {
                      var if_res1020 = _bytes_gen(v1721, 0, M2.__rjs_quoted__.bytes_length(v1721), 1);
                    } else {
                      if (M2.input_port_p(v1721) !== false) {
                        var if_res1019 = _input_port_gen(v1721);
                      } else {
                        if (M2.__rjs_quoted__.hash_p(v1721) !== false) {
                          var if_res1018 = _hash_gen(v1721, M2.__rjs_quoted__.hash_iterate_key_plus_value, M2.__rjs_quoted__.hash_iterate_first, M2.__rjs_quoted__.hash_iterate_next);
                        } else {
                          if (sequence_via_prop_p(v1721) !== false) {
                            var if_res1017 = sequence_ref(v1721)(v1721);
                          } else {
                            if (_sequence_p(v1721) !== false) {
                              var if_res1016 = make_sequence(who1720, _sequence_ref(v1721)(v1721));
                            } else {
                              if (stream_p(v1721) !== false) {
                                var if_res1015 = _stream_gen(v1721);
                              } else {
                                if (M2._eq_(1, M2.length(who1720)) !== false) {
                                  var if_res1014 = M2.car(who1720);
                                } else {
                                  var if_res1014 = who1720;
                                }
                                var if_res1015 = M2.raise(M2.__rjs_quoted__.exn_fail_contract(M2.format("for: expected a sequence for ~a, got something else: ~v", if_res1014, v1721), M2.current_continuation_marks()));
                              }
                              var if_res1016 = if_res1015;
                            }
                            var if_res1017 = if_res1016;
                          }
                          var if_res1018 = if_res1017;
                        }
                        var if_res1019 = if_res1018;
                      }
                      var if_res1020 = if_res1019;
                    }
                    var if_res1021 = if_res1020;
                  }
                  var if_res1022 = if_res1021;
                }
                var if_res1023 = if_res1022;
              }
              var if_res1024 = if_res1023;
            }
            var if_res1025 = if_res1024;
          }
          var if_res1026 = if_res1025;
        }
        var if_res1027 = if_res1026;
      }
      var if_res1028 = if_res1027;
    }
    return if_res1028;
  };
  var let_result1030 = M2.make_struct_type($rjs_core.Symbol.make("stream"), false, 3, 0, false, M2.list(M2.cons(prop_stream, M2.vector(function(v1735) {
    var cont_p1736 = range_ref(v1735, 2);
    if (cont_p1736 !== false) {
      var if_res1029 = M2.not(cont_p1736(range_ref(v1735, 0)));
    } else {
      var if_res1029 = false;
    }
    return if_res1029;
  }, function(v1737) {
    return range_ref(v1737, 0);
  }, function(v1738) {
    return make_range(range_ref(v1738, 1)(range_ref(v1738, 0)), range_ref(v1738, 1), range_ref(v1738, 2));
  })), M2.cons(prop_gen_sequence, function(v1739) {
    return M2.values(M2.values, false, range_ref(v1739, 1), range_ref(v1739, 0), range_ref(v1739, 2), false, false);
  })));
  var struct_range = let_result1030.getAt(0);
  var make_range = let_result1030.getAt(1);
  var range_p = let_result1030.getAt(2);
  var range_ref = let_result1030.getAt(3);
  var range_set_bang_ = let_result1030.getAt(4);
  var cl1031 = function(b1740) {
    return in_range(0, b1740, 1);
  };
  var cl1032 = function(a1741, b1742) {
    return in_range(a1741, b1742, 1);
  };
  var cl1033 = function(a1743, b1744, step1745) {
    if (M2.real_p(a1743) !== false) {
      var if_res1035 = M2.rvoid();
    } else {
      var if_res1035 = M2.raise_argument_error($rjs_core.Symbol.make("in-range"), "real?", a1743);
    }
    if_res1035;
    if (M2.real_p(b1744) !== false) {
      var if_res1036 = M2.rvoid();
    } else {
      var if_res1036 = M2.raise_argument_error($rjs_core.Symbol.make("in-range"), "real?", b1744);
    }
    if_res1036;
    if (M2.real_p(step1745) !== false) {
      var if_res1037 = M2.rvoid();
    } else {
      var if_res1037 = M2.raise_argument_error($rjs_core.Symbol.make("in-range"), "real?", step1745);
    }
    if_res1037;
    if (M2._gt__eq_(step1745, 0) !== false) {
      var if_res1038 = function(x1747) {
        return M2._lt_(x1747, b1744);
      };
    } else {
      var if_res1038 = function(x1748) {
        return M2._gt_(x1748, b1744);
      };
    }
    var cont_p1746 = if_res1038;
    var inc1749 = function(x1750) {
      return x1750 + step1745;
    };
    return make_range(a1743, inc1749, cont_p1746);
  };
  var in_range = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1034 = {
      '1': cl1031,
      '2': cl1032,
      '3': cl1033
    }[arguments.length];
    if (fixed_lam1034 !== undefined !== false) {
      return fixed_lam1034.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1, 2, 3]);
  var _integer_gen = function(v1751) {
    return M2.values(M2.values, false, M2.add1, 0, function(i1752) {
      return M2._lt_(i1752, v1751);
    }, false, false);
  };
  var cl1039 = function() {
    return in_naturals(0);
  };
  var cl1040 = function(n1753) {
    if (M2.integer_p(n1753) !== false) {
      if (M2.__rjs_quoted__.exact_p(n1753) !== false) {
        var if_res1042 = M2._gt__eq_(n1753, 0);
      } else {
        var if_res1042 = false;
      }
      var if_res1043 = if_res1042;
    } else {
      var if_res1043 = false;
    }
    if (if_res1043 !== false) {
      var if_res1044 = M2.rvoid();
    } else {
      var if_res1044 = M2.raise_argument_error($rjs_core.Symbol.make("in-naturals"), "exact-nonnegative-integer?", n1753);
    }
    if_res1044;
    return make_range(n1753, M2.add1, false);
  };
  var in_naturals = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1041 = {
      '0': cl1039,
      '1': cl1040
    }[arguments.length];
    if (fixed_lam1041 !== undefined !== false) {
      return fixed_lam1041.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [0, 1]);
  var let_result1045 = M2.make_struct_type($rjs_core.Symbol.make("stream"), false, 1, 0, false, M2.list(M2.cons(prop_stream, M2.vector(function(v1754) {
    return M2.not(M2.pair_p(list_stream_ref(v1754, 0)));
  }, function(v1755) {
    return M2.car(list_stream_ref(v1755, 0));
  }, function(v1756) {
    return make_list_stream(M2.cdr(list_stream_ref(v1756, 0)));
  })), M2.cons(prop_gen_sequence, function(v1757) {
    return M2.values(M2.car, M2.cdr, M2.values, list_stream_ref(v1757, 0), M2.pair_p, false, false);
  })));
  var struct_list_stream = let_result1045.getAt(0);
  var make_list_stream = let_result1045.getAt(1);
  var list_stream_p = let_result1045.getAt(2);
  var list_stream_ref = let_result1045.getAt(3);
  var list_stream_set_bang_ = let_result1045.getAt(4);
  var in_list = function(l1758) {
    if (M2.list_p(l1758) !== false) {
      var if_res1046 = M2.rvoid();
    } else {
      var if_res1046 = M2.raise_argument_error($rjs_core.Symbol.make("in-list"), "list?", l1758);
    }
    if_res1046;
    return make_list_stream(l1758);
  };
  var _list_gen = function(l1759) {
    return M2.values(M2.car, M2.cdr, M2.values, l1759, M2.pair_p, false, false);
  };
  var in_mlist = function(l1760) {
    if (M2.mpair_p(l1760) !== false) {
      var if_res1047 = M2.rvoid();
    } else {
      var if_res1047 = M2.raise_argument_error($rjs_core.Symbol.make("in-mlist"), "mpair?", l1760);
    }
    if_res1047;
    return make_do_sequence(function() {
      return _mlist_gen(l1760);
    });
  };
  var _mlist_gen = function(l1761) {
    return M2.values(M2.mcar, false, M2.mcdr, l1761, M2.mpair_p, false, false);
  };
  var in_input_port_bytes = function(p1762) {
    if (M2.input_port_p(p1762) !== false) {
      var if_res1048 = M2.rvoid();
    } else {
      var if_res1048 = M2.raise_argument_error($rjs_core.Symbol.make("in-input-port-bytes"), "input-port?", p1762);
    }
    if_res1048;
    return make_do_sequence(function() {
      return _input_port_gen(p1762);
    });
  };
  var _input_port_gen = function(p1763) {
    return M2.values(M2.__rjs_quoted__.read_byte, false, M2.values, p1763, false, function(x1764) {
      return M2.not(M2.__rjs_quoted__.eof_object_p(x1764));
    }, false);
  };
  var in_input_port_chars = function(p1765) {
    if (M2.input_port_p(p1765) !== false) {
      var if_res1049 = M2.rvoid();
    } else {
      var if_res1049 = M2.raise_argument_error($rjs_core.Symbol.make("in-input-port-chars"), "input-port?", p1765);
    }
    if_res1049;
    return in_producer(function() {
      return M2.__rjs_quoted__.read_char(p1765);
    }, M2.__rjs_quoted__.eof);
  };
  var check_in_port = function(r1766, p1767) {
    if (M2.procedure_p(r1766) !== false) {
      var if_res1050 = M2.procedure_arity_includes_p(r1766, 1);
    } else {
      var if_res1050 = false;
    }
    if (if_res1050 !== false) {
      var if_res1051 = M2.rvoid();
    } else {
      var if_res1051 = M2.raise_argument_error($rjs_core.Symbol.make("in-port"), "(procedure-arity-includes/c 1)", r1766);
    }
    if_res1051;
    if (M2.input_port_p(p1767) !== false) {
      var if_res1052 = M2.rvoid();
    } else {
      var if_res1052 = M2.raise_argument_error($rjs_core.Symbol.make("in-port"), "input-port?", p1767);
    }
    return if_res1052;
  };
  var cl1053 = function() {
    return in_port(M2.__rjs_quoted__.read, M2.__rjs_quoted__.current_input_port());
  };
  var cl1054 = function(r1768) {
    return in_port(r1768, M2.__rjs_quoted__.current_input_port());
  };
  var cl1055 = function(r1769, p1770) {
    check_in_port(r1769, p1770);
    return in_producer(function() {
      return r1769(p1770);
    }, M2.__rjs_quoted__.eof);
  };
  var in_port = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1056 = {
      '0': cl1053,
      '1': cl1054,
      '2': cl1055
    }[arguments.length];
    if (fixed_lam1056 !== undefined !== false) {
      return fixed_lam1056.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [0, 1, 2]);
  var check_in_lines = function(p1771, mode1772) {
    if (M2.input_port_p(p1771) !== false) {
      var if_res1057 = M2.rvoid();
    } else {
      var if_res1057 = M2.raise_argument_error($rjs_core.Symbol.make("in-lines"), "input-port?", p1771);
    }
    if_res1057;
    if (M3.memq(mode1772, $rjs_core.Pair.makeList($rjs_core.Symbol.make("linefeed"), $rjs_core.Symbol.make("return"), $rjs_core.Symbol.make("return-linefeed"), $rjs_core.Symbol.make("any"), $rjs_core.Symbol.make("any-one"))) !== false) {
      var if_res1058 = M2.rvoid();
    } else {
      var if_res1058 = M2.raise_argument_error($rjs_core.Symbol.make("in-lines"), "(or/c 'linefeed 'return 'return-linefeed 'any 'any-one)", mode1772);
    }
    return if_res1058;
  };
  var cl1059 = function() {
    return in_lines(M2.__rjs_quoted__.current_input_port(), $rjs_core.Symbol.make("any"));
  };
  var cl1060 = function(p1773) {
    return in_lines(p1773, $rjs_core.Symbol.make("any"));
  };
  var cl1061 = function(p1774, mode1775) {
    check_in_lines(p1774, mode1775);
    return in_producer(function() {
      return M2.__rjs_quoted__.read_line(p1774, mode1775);
    }, M2.__rjs_quoted__.eof);
  };
  var in_lines = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1062 = {
      '0': cl1059,
      '1': cl1060,
      '2': cl1061
    }[arguments.length];
    if (fixed_lam1062 !== undefined !== false) {
      return fixed_lam1062.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [0, 1, 2]);
  var check_in_bytes_lines = function(p1776, mode1777) {
    if (M2.input_port_p(p1776) !== false) {
      var if_res1063 = M2.rvoid();
    } else {
      var if_res1063 = M2.raise_argument_error($rjs_core.Symbol.make("in-bytes-lines"), "input-port", p1776);
    }
    if_res1063;
    if (M3.memq(mode1777, $rjs_core.Pair.makeList($rjs_core.Symbol.make("linefeed"), $rjs_core.Symbol.make("return"), $rjs_core.Symbol.make("return-linefeed"), $rjs_core.Symbol.make("any"), $rjs_core.Symbol.make("any-one"))) !== false) {
      var if_res1064 = M2.rvoid();
    } else {
      var if_res1064 = M2.raise_argument_error($rjs_core.Symbol.make("in-bytes-lines"), "(or/c 'linefeed 'return 'return-linefeed 'any 'any-one)", mode1777);
    }
    return if_res1064;
  };
  var cl1065 = function() {
    return in_bytes_lines(M2.__rjs_quoted__.current_input_port(), $rjs_core.Symbol.make("any"));
  };
  var cl1066 = function(p1778) {
    return in_bytes_lines(p1778, $rjs_core.Symbol.make("any"));
  };
  var cl1067 = function(p1779, mode1780) {
    check_in_bytes_lines(p1779, mode1780);
    return in_producer(function() {
      return M2.__rjs_quoted__.read_bytes_line(p1779, mode1780);
    }, M2.__rjs_quoted__.eof);
  };
  var in_bytes_lines = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1068 = {
      '0': cl1065,
      '1': cl1066,
      '2': cl1067
    }[arguments.length];
    if (fixed_lam1068 !== undefined !== false) {
      return fixed_lam1068.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [0, 1, 2]);
  var in_stream = function(l1781) {
    if (stream_p(l1781) !== false) {
      var if_res1069 = M2.rvoid();
    } else {
      var if_res1069 = M2.raise_argument_error($rjs_core.Symbol.make("in-stream"), "stream?", l1781);
    }
    if_res1069;
    return make_do_sequence(function() {
      return _stream_gen(l1781);
    });
  };
  var _stream_gen = function(l1782) {
    return M2.values(unsafe_stream_first, unsafe_stream_rest, M2.values, l1782, unsafe_stream_not_empty_p, false, false);
  };
  var _hash_gen = function(ht1783, _get1784, _first1785, _next1786) {
    return M2.values(function(pos1787) {
      return _get1784(ht1783, pos1787);
    }, false, function(pos1788) {
      return _next1786(ht1783, pos1788);
    }, _first1785(ht1783), function(pos1789) {
      return pos1789;
    }, false, false);
  };
  var mutable_p = function(ht1790) {
    return M2.not(M2.__rjs_quoted__.immutable_p(ht1790));
  };
  var not_weak_p = function(ht1791) {
    return M2.not(M2.__rjs_quoted__.hash_weak_p(ht1791));
  };
  var default_in_hash = function(ht1792) {
    if ((function(ht1793) {
      return M2.__rjs_quoted__.hash_p(ht1793);
    })(ht1792) !== false) {
      var if_res1070 = M2.rvoid();
    } else {
      var if_res1070 = M2.raise_argument_error($rjs_core.Symbol.make("in-hash"), "hash?", ht1792);
    }
    if_res1070;
    return make_do_sequence(function() {
      return _hash_gen(ht1792, M2.__rjs_quoted__.hash_iterate_key_plus_value, M2.__rjs_quoted__.hash_iterate_first, M2.__rjs_quoted__.hash_iterate_next);
    });
  };
  var default_in_mutable_hash = function(ht1794) {
    if ((function(ht1795) {
      if (M2.__rjs_quoted__.hash_p(ht1795) !== false) {
        if (mutable_p(ht1795) !== false) {
          var if_res1071 = not_weak_p(ht1795);
        } else {
          var if_res1071 = false;
        }
        var if_res1072 = if_res1071;
      } else {
        var if_res1072 = false;
      }
      return if_res1072;
    })(ht1794) !== false) {
      var if_res1073 = M2.rvoid();
    } else {
      var if_res1073 = M2.raise_argument_error($rjs_core.Symbol.make("in-mutable-hash"), "(and/c hash? mutable? not-weak?)", ht1794);
    }
    if_res1073;
    return make_do_sequence(function() {
      return _hash_gen(ht1794, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_key_plus_value, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_next);
    });
  };
  var default_in_immutable_hash = function(ht1796) {
    if ((function(ht1797) {
      if (M2.__rjs_quoted__.hash_p(ht1797) !== false) {
        var if_res1074 = M2.__rjs_quoted__.immutable_p(ht1797);
      } else {
        var if_res1074 = false;
      }
      return if_res1074;
    })(ht1796) !== false) {
      var if_res1075 = M2.rvoid();
    } else {
      var if_res1075 = M2.raise_argument_error($rjs_core.Symbol.make("in-immutable-hash"), "(and/c hash? immutable?)", ht1796);
    }
    if_res1075;
    return make_do_sequence(function() {
      return _hash_gen(ht1796, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_key_plus_value, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_next);
    });
  };
  var default_in_weak_hash = function(ht1798) {
    if ((function(ht1799) {
      if (M2.__rjs_quoted__.hash_p(ht1799) !== false) {
        var if_res1076 = M2.__rjs_quoted__.hash_weak_p(ht1799);
      } else {
        var if_res1076 = false;
      }
      return if_res1076;
    })(ht1798) !== false) {
      var if_res1077 = M2.rvoid();
    } else {
      var if_res1077 = M2.raise_argument_error($rjs_core.Symbol.make("in-weak-hash"), "(and/c hash? hash-weak?)", ht1798);
    }
    if_res1077;
    return make_do_sequence(function() {
      return _hash_gen(ht1798, M5.__rjs_quoted__.unsafe_weak_hash_iterate_key_plus_value, M5.__rjs_quoted__.unsafe_weak_hash_iterate_first, M5.__rjs_quoted__.unsafe_weak_hash_iterate_next);
    });
  };
  var default_in_hash_keys = function(ht1800) {
    if ((function(ht1801) {
      return M2.__rjs_quoted__.hash_p(ht1801);
    })(ht1800) !== false) {
      var if_res1078 = M2.rvoid();
    } else {
      var if_res1078 = M2.raise_argument_error($rjs_core.Symbol.make("in-hash-keys"), "hash?", ht1800);
    }
    if_res1078;
    return make_do_sequence(function() {
      return _hash_gen(ht1800, M2.__rjs_quoted__.hash_iterate_key, M2.__rjs_quoted__.hash_iterate_first, M2.__rjs_quoted__.hash_iterate_next);
    });
  };
  var default_in_mutable_hash_keys = function(ht1802) {
    if ((function(ht1803) {
      if (M2.__rjs_quoted__.hash_p(ht1803) !== false) {
        if (mutable_p(ht1803) !== false) {
          var if_res1079 = not_weak_p(ht1803);
        } else {
          var if_res1079 = false;
        }
        var if_res1080 = if_res1079;
      } else {
        var if_res1080 = false;
      }
      return if_res1080;
    })(ht1802) !== false) {
      var if_res1081 = M2.rvoid();
    } else {
      var if_res1081 = M2.raise_argument_error($rjs_core.Symbol.make("in-mutable-hash-keys"), "(and/c hash? mutable? not-weak?)", ht1802);
    }
    if_res1081;
    return make_do_sequence(function() {
      return _hash_gen(ht1802, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_key, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_next);
    });
  };
  var default_in_immutable_hash_keys = function(ht1804) {
    if ((function(ht1805) {
      if (M2.__rjs_quoted__.hash_p(ht1805) !== false) {
        var if_res1082 = M2.__rjs_quoted__.immutable_p(ht1805);
      } else {
        var if_res1082 = false;
      }
      return if_res1082;
    })(ht1804) !== false) {
      var if_res1083 = M2.rvoid();
    } else {
      var if_res1083 = M2.raise_argument_error($rjs_core.Symbol.make("in-immutable-hash-keys"), "(and/c hash? immutable?)", ht1804);
    }
    if_res1083;
    return make_do_sequence(function() {
      return _hash_gen(ht1804, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_key, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_next);
    });
  };
  var default_in_weak_hash_keys = function(ht1806) {
    if ((function(ht1807) {
      if (M2.__rjs_quoted__.hash_p(ht1807) !== false) {
        var if_res1084 = M2.__rjs_quoted__.hash_weak_p(ht1807);
      } else {
        var if_res1084 = false;
      }
      return if_res1084;
    })(ht1806) !== false) {
      var if_res1085 = M2.rvoid();
    } else {
      var if_res1085 = M2.raise_argument_error($rjs_core.Symbol.make("in-weak-hash-keys"), "(and/c hash? hash-weak?)", ht1806);
    }
    if_res1085;
    return make_do_sequence(function() {
      return _hash_gen(ht1806, M5.__rjs_quoted__.unsafe_weak_hash_iterate_key, M5.__rjs_quoted__.unsafe_weak_hash_iterate_first, M5.__rjs_quoted__.unsafe_weak_hash_iterate_next);
    });
  };
  var default_in_hash_values = function(ht1808) {
    if ((function(ht1809) {
      return M2.__rjs_quoted__.hash_p(ht1809);
    })(ht1808) !== false) {
      var if_res1086 = M2.rvoid();
    } else {
      var if_res1086 = M2.raise_argument_error($rjs_core.Symbol.make("in-hash-values"), "hash?", ht1808);
    }
    if_res1086;
    return make_do_sequence(function() {
      return _hash_gen(ht1808, M2.__rjs_quoted__.hash_iterate_value, M2.__rjs_quoted__.hash_iterate_first, M2.__rjs_quoted__.hash_iterate_next);
    });
  };
  var default_in_mutable_hash_values = function(ht1810) {
    if ((function(ht1811) {
      if (M2.__rjs_quoted__.hash_p(ht1811) !== false) {
        if (mutable_p(ht1811) !== false) {
          var if_res1087 = not_weak_p(ht1811);
        } else {
          var if_res1087 = false;
        }
        var if_res1088 = if_res1087;
      } else {
        var if_res1088 = false;
      }
      return if_res1088;
    })(ht1810) !== false) {
      var if_res1089 = M2.rvoid();
    } else {
      var if_res1089 = M2.raise_argument_error($rjs_core.Symbol.make("in-mutable-hash-values"), "(and/c hash? mutable? not-weak?)", ht1810);
    }
    if_res1089;
    return make_do_sequence(function() {
      return _hash_gen(ht1810, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_value, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_next);
    });
  };
  var default_in_immutable_hash_values = function(ht1812) {
    if ((function(ht1813) {
      if (M2.__rjs_quoted__.hash_p(ht1813) !== false) {
        var if_res1090 = M2.__rjs_quoted__.immutable_p(ht1813);
      } else {
        var if_res1090 = false;
      }
      return if_res1090;
    })(ht1812) !== false) {
      var if_res1091 = M2.rvoid();
    } else {
      var if_res1091 = M2.raise_argument_error($rjs_core.Symbol.make("in-immutable-hash-values"), "(and/c hash? immutable?)", ht1812);
    }
    if_res1091;
    return make_do_sequence(function() {
      return _hash_gen(ht1812, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_value, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_next);
    });
  };
  var default_in_weak_hash_values = function(ht1814) {
    if ((function(ht1815) {
      if (M2.__rjs_quoted__.hash_p(ht1815) !== false) {
        var if_res1092 = M2.__rjs_quoted__.hash_weak_p(ht1815);
      } else {
        var if_res1092 = false;
      }
      return if_res1092;
    })(ht1814) !== false) {
      var if_res1093 = M2.rvoid();
    } else {
      var if_res1093 = M2.raise_argument_error($rjs_core.Symbol.make("in-weak-hash-values"), "(and/c hash? hash-weak?)", ht1814);
    }
    if_res1093;
    return make_do_sequence(function() {
      return _hash_gen(ht1814, M5.__rjs_quoted__.unsafe_weak_hash_iterate_value, M5.__rjs_quoted__.unsafe_weak_hash_iterate_first, M5.__rjs_quoted__.unsafe_weak_hash_iterate_next);
    });
  };
  var default_in_hash_pairs = function(ht1816) {
    if ((function(ht1817) {
      return M2.__rjs_quoted__.hash_p(ht1817);
    })(ht1816) !== false) {
      var if_res1094 = M2.rvoid();
    } else {
      var if_res1094 = M2.raise_argument_error($rjs_core.Symbol.make("in-hash-pairs"), "hash?", ht1816);
    }
    if_res1094;
    return make_do_sequence(function() {
      return _hash_gen(ht1816, M2.__rjs_quoted__.hash_iterate_pair, M2.__rjs_quoted__.hash_iterate_first, M2.__rjs_quoted__.hash_iterate_next);
    });
  };
  var default_in_mutable_hash_pairs = function(ht1818) {
    if ((function(ht1819) {
      if (M2.__rjs_quoted__.hash_p(ht1819) !== false) {
        if (mutable_p(ht1819) !== false) {
          var if_res1095 = not_weak_p(ht1819);
        } else {
          var if_res1095 = false;
        }
        var if_res1096 = if_res1095;
      } else {
        var if_res1096 = false;
      }
      return if_res1096;
    })(ht1818) !== false) {
      var if_res1097 = M2.rvoid();
    } else {
      var if_res1097 = M2.raise_argument_error($rjs_core.Symbol.make("in-mutable-hash-pairs"), "(and/c hash? mutable? not-weak?)", ht1818);
    }
    if_res1097;
    return make_do_sequence(function() {
      return _hash_gen(ht1818, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_pair, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_mutable_hash_iterate_next);
    });
  };
  var default_in_immutable_hash_pairs = function(ht1820) {
    if ((function(ht1821) {
      if (M2.__rjs_quoted__.hash_p(ht1821) !== false) {
        var if_res1098 = M2.__rjs_quoted__.immutable_p(ht1821);
      } else {
        var if_res1098 = false;
      }
      return if_res1098;
    })(ht1820) !== false) {
      var if_res1099 = M2.rvoid();
    } else {
      var if_res1099 = M2.raise_argument_error($rjs_core.Symbol.make("in-immutable-hash-pairs"), "(and/c hash? immutable?)", ht1820);
    }
    if_res1099;
    return make_do_sequence(function() {
      return _hash_gen(ht1820, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_pair, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_first, M5.__rjs_quoted__.unsafe_immutable_hash_iterate_next);
    });
  };
  var default_in_weak_hash_pairs = function(ht1822) {
    if ((function(ht1823) {
      if (M2.__rjs_quoted__.hash_p(ht1823) !== false) {
        var if_res1100 = M2.__rjs_quoted__.hash_weak_p(ht1823);
      } else {
        var if_res1100 = false;
      }
      return if_res1100;
    })(ht1822) !== false) {
      var if_res1101 = M2.rvoid();
    } else {
      var if_res1101 = M2.raise_argument_error($rjs_core.Symbol.make("in-weak-hash-pairs"), "(and/c hash? hash-weak?)", ht1822);
    }
    if_res1101;
    return make_do_sequence(function() {
      return _hash_gen(ht1822, M5.__rjs_quoted__.unsafe_weak_hash_iterate_pair, M5.__rjs_quoted__.unsafe_weak_hash_iterate_first, M5.__rjs_quoted__.unsafe_weak_hash_iterate_next);
    });
  };
  var check_ranges = function(who1824, vec1825, start1826, stop1827, step1828, len1829) {
    if (M2.exact_nonnegative_integer_p(start1826) !== false) {
      var or_part1830 = M2._lt_(start1826, len1829);
      if (or_part1830 !== false) {
        var if_res1102 = or_part1830;
      } else {
        var if_res1102 = M2._eq_(len1829, start1826, stop1827);
      }
      var if_res1103 = if_res1102;
    } else {
      var if_res1103 = false;
    }
    if (if_res1103 !== false) {
      var if_res1104 = M2.rvoid();
    } else {
      var if_res1104 = M2.__rjs_quoted__.raise_range_error(who1824, "vector", "starting ", start1826, vec1825, 0, M2.sub1(len1829));
    }
    if_res1104;
    if (M2.exact_integer_p(stop1827) !== false) {
      if (M2._lt__eq_(-1, stop1827) !== false) {
        var if_res1105 = M2._lt__eq_(stop1827, len1829);
      } else {
        var if_res1105 = false;
      }
      var if_res1106 = if_res1105;
    } else {
      var if_res1106 = false;
    }
    if (if_res1106 !== false) {
      var if_res1107 = M2.rvoid();
    } else {
      var if_res1107 = M2.__rjs_quoted__.raise_range_error(who1824, "vector", "stopping ", stop1827, vec1825, -1, len1829);
    }
    if_res1107;
    if (M2.exact_integer_p(step1828) !== false) {
      var if_res1108 = M2.not(M2.zero_p(step1828));
    } else {
      var if_res1108 = false;
    }
    if (if_res1108 !== false) {
      var if_res1109 = M2.rvoid();
    } else {
      var if_res1109 = M2.raise_argument_error(who1824, "(and/c exact-integer? (not/c zero?))", step1828);
    }
    if_res1109;
    if (M2._lt_(start1826, stop1827) !== false) {
      var if_res1110 = M2._lt_(step1828, 0);
    } else {
      var if_res1110 = false;
    }
    if (if_res1110 !== false) {
      var if_res1111 = M2.__rjs_quoted__.raise_arguments_error(who1824, "starting index less than stopping index, but given a negative step", "starting index", start1826, "stopping index", stop1827, "step", step1828);
    } else {
      var if_res1111 = M2.rvoid();
    }
    if_res1111;
    if (M2._lt_(stop1827, start1826) !== false) {
      var if_res1112 = M2._gt_(step1828, 0);
    } else {
      var if_res1112 = false;
    }
    if (if_res1112 !== false) {
      var if_res1113 = M2.__rjs_quoted__.raise_arguments_error(who1824, "starting index more than stopping index, but given a positive step", "starting index", start1826, "stopping index", stop1827, "step", step1828);
    } else {
      var if_res1113 = M2.rvoid();
    }
    return if_res1113;
  };
  var normalise_inputs = function(who1831, type_name1832, vector_p1833, unsafe_vector_length1834, vec1835, start1836, stop1837, step1838) {
    if (vector_p1833(vec1835) !== false) {
      var if_res1114 = M2.rvoid();
    } else {
      var if_res1114 = M2.raise_argument_error(who1831, type_name1832, vec1835);
    }
    if_res1114;
    var len1839 = unsafe_vector_length1834(vec1835);
    if (stop1837 !== false) {
      var if_res1115 = stop1837;
    } else {
      var if_res1115 = len1839;
    }
    var stop_times_1840 = if_res1115;
    check_ranges(who1831, vec1835, start1836, stop_times_1840, step1838, len1839);
    return M2.values(vec1835, start1836, stop_times_1840, step1838);
  };
  var _vector_gen = function(v1841, start1842, stop1843, step1844) {
    if (M2._eq_(step1844, 1) !== false) {
      var if_res1117 = M2.add1;
    } else {
      var if_res1117 = function(i1846) {
        return i1846 + step1844;
      };
    }
    if (M2._gt_(step1844, 0) !== false) {
      var if_res1116 = function(i1847) {
        return M2._lt_(i1847, stop1843);
      };
    } else {
      var if_res1116 = function(i1848) {
        return M2._gt_(i1848, stop1843);
      };
    }
    return M2.values(function(i1845) {
      return M5.unsafe_vector_ref(v1841, i1845);
    }, false, if_res1117, start1842, if_res1116, false, false);
  };
  var cl1118 = function(v1849) {
    return in_vector(v1849, 0, false, 1);
  };
  var cl1119 = function(v1850, start1851) {
    return in_vector(v1850, start1851, false, 1);
  };
  var cl1120 = function(v1852, start1853, stop1854) {
    return in_vector(v1852, start1853, stop1854, 1);
  };
  var cl1121 = function(v1855, start1856, stop1857, step1858) {
    var let_result1123 = normalise_inputs($rjs_core.Symbol.make("in-vector"), "vector", M2.vector_p, M2.vector_length, v1855, start1856, stop1857, step1858);
    var v1859 = let_result1123.getAt(0);
    var start1860 = let_result1123.getAt(1);
    var stop1861 = let_result1123.getAt(2);
    var step1862 = let_result1123.getAt(3);
    return make_do_sequence(function() {
      return _vector_gen(v1859, start1860, stop1861, step1862);
    });
  };
  var in_vector = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1122 = {
      '1': cl1118,
      '2': cl1119,
      '3': cl1120,
      '4': cl1121
    }[arguments.length];
    if (fixed_lam1122 !== undefined !== false) {
      return fixed_lam1122.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1, 2, 3, 4]);
  var _string_gen = function(v1863, start1864, stop1865, step1866) {
    if (M2._eq_(step1866, 1) !== false) {
      var if_res1125 = M2.add1;
    } else {
      var if_res1125 = function(i1868) {
        return i1868 + step1866;
      };
    }
    if (M2._gt_(step1866, 0) !== false) {
      var if_res1124 = function(i1869) {
        return M2._lt_(i1869, stop1865);
      };
    } else {
      var if_res1124 = function(i1870) {
        return M2._gt_(i1870, stop1865);
      };
    }
    return M2.values(function(i1867) {
      return M2.string_ref(v1863, i1867);
    }, false, if_res1125, start1864, if_res1124, false, false);
  };
  var cl1126 = function(v1871) {
    return in_string(v1871, 0, false, 1);
  };
  var cl1127 = function(v1872, start1873) {
    return in_string(v1872, start1873, false, 1);
  };
  var cl1128 = function(v1874, start1875, stop1876) {
    return in_string(v1874, start1875, stop1876, 1);
  };
  var cl1129 = function(v1877, start1878, stop1879, step1880) {
    var let_result1131 = normalise_inputs($rjs_core.Symbol.make("in-string"), "string", M2.string_p, M2.string_length, v1877, start1878, stop1879, step1880);
    var v1881 = let_result1131.getAt(0);
    var start1882 = let_result1131.getAt(1);
    var stop1883 = let_result1131.getAt(2);
    var step1884 = let_result1131.getAt(3);
    return make_do_sequence(function() {
      return _string_gen(v1881, start1882, stop1883, step1884);
    });
  };
  var in_string = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1130 = {
      '1': cl1126,
      '2': cl1127,
      '3': cl1128,
      '4': cl1129
    }[arguments.length];
    if (fixed_lam1130 !== undefined !== false) {
      return fixed_lam1130.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1, 2, 3, 4]);
  var _bytes_gen = function(v1885, start1886, stop1887, step1888) {
    if (M2._eq_(step1888, 1) !== false) {
      var if_res1133 = M2.add1;
    } else {
      var if_res1133 = function(i1890) {
        return i1890 + step1888;
      };
    }
    if (M2._gt_(step1888, 0) !== false) {
      var if_res1132 = function(i1891) {
        return M2._lt_(i1891, stop1887);
      };
    } else {
      var if_res1132 = function(i1892) {
        return M2._gt_(i1892, stop1887);
      };
    }
    return M2.values(function(i1889) {
      return M5.__rjs_quoted__.unsafe_bytes_ref(v1885, i1889);
    }, false, if_res1133, start1886, if_res1132, false, false);
  };
  var cl1134 = function(v1893) {
    return in_bytes(v1893, 0, false, 1);
  };
  var cl1135 = function(v1894, start1895) {
    return in_bytes(v1894, start1895, false, 1);
  };
  var cl1136 = function(v1896, start1897, stop1898) {
    return in_bytes(v1896, start1897, stop1898, 1);
  };
  var cl1137 = function(v1899, start1900, stop1901, step1902) {
    var let_result1139 = normalise_inputs($rjs_core.Symbol.make("in-bytes"), "bytes", M2.bytes_p, M2.__rjs_quoted__.bytes_length, v1899, start1900, stop1901, step1902);
    var v1903 = let_result1139.getAt(0);
    var start1904 = let_result1139.getAt(1);
    var stop1905 = let_result1139.getAt(2);
    var step1906 = let_result1139.getAt(3);
    return make_do_sequence(function() {
      return _bytes_gen(v1903, start1904, stop1905, step1906);
    });
  };
  var in_bytes = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1138 = {
      '1': cl1134,
      '2': cl1135,
      '3': cl1136,
      '4': cl1137
    }[arguments.length];
    if (fixed_lam1138 !== undefined !== false) {
      return fixed_lam1138.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1, 2, 3, 4]);
  var _flvector_gen = function(v1907, start1908, stop1909, step1910) {
    if (M2._eq_(step1910, 1) !== false) {
      var if_res1141 = M2.add1;
    } else {
      var if_res1141 = function(i1912) {
        return i1912 + step1910;
      };
    }
    if (M2._gt_(step1910, 0) !== false) {
      var if_res1140 = function(i1913) {
        return M2._lt_(i1913, stop1909);
      };
    } else {
      var if_res1140 = function(i1914) {
        return M2._gt_(i1914, stop1909);
      };
    }
    return M2.values(function(i1911) {
      return M5.__rjs_quoted__.unsafe_flvector_ref(v1907, i1911);
    }, false, if_res1141, start1908, if_res1140, false, false);
  };
  var _fxvector_gen = function(v1915, start1916, stop1917, step1918) {
    if (M2._eq_(step1918, 1) !== false) {
      var if_res1143 = M2.add1;
    } else {
      var if_res1143 = function(i1920) {
        return i1920 + step1918;
      };
    }
    if (M2._gt_(step1918, 0) !== false) {
      var if_res1142 = function(i1921) {
        return M2._lt_(i1921, stop1917);
      };
    } else {
      var if_res1142 = function(i1922) {
        return M2._gt_(i1922, stop1917);
      };
    }
    return M2.values(function(i1919) {
      return M5.__rjs_quoted__.unsafe_fxvector_ref(v1915, i1919);
    }, false, if_res1143, start1916, if_res1142, false, false);
  };
  var stop_before = function(g1923, pred1924) {
    if (sequence_p(g1923) !== false) {
      var if_res1144 = M2.rvoid();
    } else {
      var if_res1144 = M2.raise_argument_error($rjs_core.Symbol.make("stop-before"), "sequence?", g1923);
    }
    if_res1144;
    if (M2.procedure_p(pred1924) !== false) {
      var if_res1145 = M2.procedure_arity_includes_p(pred1924, 1);
    } else {
      var if_res1145 = false;
    }
    if (if_res1145 !== false) {
      var if_res1146 = M2.rvoid();
    } else {
      var if_res1146 = M2.raise_argument_error($rjs_core.Symbol.make("stop-before"), "(procedure-arity-includes/c 1)", pred1924);
    }
    if_res1146;
    return make_do_sequence(function() {
      var let_result1147 = make_sequence(false, g1923);
      var pos__gt_val1925 = let_result1147.getAt(0);
      var pre_pos_next1926 = let_result1147.getAt(1);
      var pos_next1927 = let_result1147.getAt(2);
      var init1928 = let_result1147.getAt(3);
      var pos_cont_p1929 = let_result1147.getAt(4);
      var pre_cont_p1930 = let_result1147.getAt(5);
      var post_cont_p1931 = let_result1147.getAt(6);
      var cl1148 = function(val1932) {
        if (pre_cont_p1930 !== false) {
          var if_res1152 = pre_cont_p1930(val1932);
        } else {
          var if_res1152 = true;
        }
        if (if_res1152 !== false) {
          var if_res1153 = M2.not(pred1924(val1932));
        } else {
          var if_res1153 = false;
        }
        return if_res1153;
      };
      var cl1149 = $rjs_core.attachProcedureArity(function() {
        var vals1933 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
        if (pre_cont_p1930 !== false) {
          var if_res1154 = M2.apply(pre_cont_p1930, vals1933);
        } else {
          var if_res1154 = true;
        }
        if (if_res1154 !== false) {
          var if_res1155 = M2.not(M2.apply(pred1924, vals1933));
        } else {
          var if_res1155 = false;
        }
        return if_res1155;
      });
      return M2.values(pos__gt_val1925, pre_pos_next1926, pos_next1927, init1928, pos_cont_p1929, $rjs_core.attachProcedureArity(function() {
        var fixed_lam1150 = {'1': cl1148}[arguments.length];
        if (fixed_lam1150 !== undefined !== false) {
          return fixed_lam1150.apply(null, arguments);
        } else {
          if (true !== false) {
            var if_res1151 = cl1149.apply(null, arguments);
          } else {
            var if_res1151 = M2.error("case-lambda: invalid case");
          }
          return if_res1151;
        }
      }, [M2.make_arity_at_least(0)]), post_cont_p1931);
    });
  };
  var stop_after = function(g1934, pred1935) {
    if (sequence_p(g1934) !== false) {
      var if_res1156 = M2.rvoid();
    } else {
      var if_res1156 = M2.raise_argument_error($rjs_core.Symbol.make("stop-after"), "sequence?", g1934);
    }
    if_res1156;
    if (M2.procedure_p(pred1935) !== false) {
      var if_res1157 = M2.procedure_arity_includes_p(pred1935, 1);
    } else {
      var if_res1157 = false;
    }
    if (if_res1157 !== false) {
      var if_res1158 = M2.rvoid();
    } else {
      var if_res1158 = M2.raise_argument_error($rjs_core.Symbol.make("stop-after"), "(procedure-arity-includes/c 1)", pred1935);
    }
    if_res1158;
    return make_do_sequence(function() {
      var let_result1159 = make_sequence(false, g1934);
      var pos__gt_val1936 = let_result1159.getAt(0);
      var pre_pos_next1937 = let_result1159.getAt(1);
      var pos_next1938 = let_result1159.getAt(2);
      var init1939 = let_result1159.getAt(3);
      var pos_cont_p1940 = let_result1159.getAt(4);
      var pre_cont_p1941 = let_result1159.getAt(5);
      var post_cont_p1942 = let_result1159.getAt(6);
      var cl1160 = function(pos1943, val1944) {
        if (post_cont_p1942 !== false) {
          var if_res1164 = post_cont_p1942(pos1943, val1944);
        } else {
          var if_res1164 = true;
        }
        if (if_res1164 !== false) {
          var if_res1165 = M2.not(pred1935(val1944));
        } else {
          var if_res1165 = false;
        }
        return if_res1165;
      };
      var cl1161 = $rjs_core.attachProcedureArity(function(pos1945) {
        var vals1946 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
        if (post_cont_p1942 !== false) {
          var if_res1166 = M2.apply(post_cont_p1942, pos1945, vals1946);
        } else {
          var if_res1166 = true;
        }
        if (if_res1166 !== false) {
          var if_res1167 = M2.not(M2.apply(pred1935, vals1946));
        } else {
          var if_res1167 = false;
        }
        return if_res1167;
      });
      return M2.values(pos__gt_val1936, pre_pos_next1937, pos_next1938, init1939, pos_cont_p1940, pre_cont_p1941, $rjs_core.attachProcedureArity(function() {
        var fixed_lam1162 = {'2': cl1160}[arguments.length];
        if (fixed_lam1162 !== undefined !== false) {
          return fixed_lam1162.apply(null, arguments);
        } else {
          if (M2._gt__eq_(cl1161.length, 1) !== false) {
            var if_res1163 = cl1161.apply(null, arguments);
          } else {
            var if_res1163 = M2.error("case-lambda: invalid case");
          }
          return if_res1163;
        }
      }, [M2.make_arity_at_least(1)]));
    });
  };
  var in_indexed = function(g1947) {
    if (sequence_p(g1947) !== false) {
      var if_res1168 = M2.rvoid();
    } else {
      var if_res1168 = M2.raise_argument_error($rjs_core.Symbol.make("in-indexed"), "sequence?", g1947);
    }
    if_res1168;
    return make_do_sequence(function() {
      var let_result1169 = make_sequence(false, g1947);
      var pos__gt_val1948 = let_result1169.getAt(0);
      var pre_pos_next1949 = let_result1169.getAt(1);
      var pos_next1950 = let_result1169.getAt(2);
      var init1951 = let_result1169.getAt(3);
      var pos_cont_p1952 = let_result1169.getAt(4);
      var pre_cont_p1953 = let_result1169.getAt(5);
      var post_cont_p1954 = let_result1169.getAt(6);
      if (pre_pos_next1949 !== false) {
        var if_res1174 = function(pos1956) {
          return M2.cons(pre_pos_next1949(M2.car(pos1956)), M2.cdr(pos1956));
        };
      } else {
        var if_res1174 = false;
      }
      var temp1173 = M2.cons(init1951, 0);
      if (pos_cont_p1952 !== false) {
        var if_res1172 = function(pos1958) {
          return pos_cont_p1952(M2.car(pos1958));
        };
      } else {
        var if_res1172 = false;
      }
      if (pre_cont_p1953 !== false) {
        var if_res1171 = function(val1959, idx1960) {
          return pre_cont_p1953(val1959);
        };
      } else {
        var if_res1171 = false;
      }
      if (post_cont_p1954 !== false) {
        var if_res1170 = function(pos1961, val1962, idx1963) {
          return post_cont_p1954(pos1961, val1962);
        };
      } else {
        var if_res1170 = false;
      }
      return M2.values(function(pos1955) {
        return M2.values(pos__gt_val1948(M2.car(pos1955)), M2.cdr(pos1955));
      }, if_res1174, function(pos1957) {
        return M2.cons(pos_next1950(M2.car(pos1957)), M2.add1(M2.cdr(pos1957)));
      }, temp1173, if_res1172, if_res1171, if_res1170);
    });
  };
  var in_value = function(v1964) {
    return make_do_sequence(function() {
      return M2.values(function(pos1965) {
        return v1964;
      }, function(pos1966) {
        return false;
      }, true, function(pos1967) {
        return pos1967;
      }, false, false);
    });
  };
  var in_values_sequence = function(g1968) {
    if (sequence_p(g1968) !== false) {
      var if_res1175 = M2.rvoid();
    } else {
      var if_res1175 = M2.raise_argument_error($rjs_core.Symbol.make("in-values-sequence"), "sequence?", g1968);
    }
    if_res1175;
    return make_do_sequence(function() {
      var let_result1176 = make_sequence(false, g1968);
      var pos__gt_val1969 = let_result1176.getAt(0);
      var pre_pos_next1970 = let_result1176.getAt(1);
      var pos_next1971 = let_result1176.getAt(2);
      var init1972 = let_result1176.getAt(3);
      var pos_cont_p1973 = let_result1176.getAt(4);
      var pre_cont_p1974 = let_result1176.getAt(5);
      var post_cont_p1975 = let_result1176.getAt(6);
      if (pre_cont_p1974 !== false) {
        var if_res1178 = function(vals1977) {
          return M2.apply(pre_cont_p1974, vals1977);
        };
      } else {
        var if_res1178 = false;
      }
      if (post_cont_p1975 !== false) {
        var if_res1177 = function(pos1978, vals1979) {
          return M2.apply(post_cont_p1975, pos1978, vals1979);
        };
      } else {
        var if_res1177 = false;
      }
      return M2.values(function(pos1976) {
        return M2.call_with_values(function() {
          return pos__gt_val1969(pos1976);
        }, M2.list);
      }, pre_pos_next1970, pos_next1971, init1972, pos_cont_p1973, if_res1178, if_res1177);
    });
  };
  var in_values_times__sequence = function(g1980) {
    if (sequence_p(g1980) !== false) {
      var if_res1179 = M2.rvoid();
    } else {
      var if_res1179 = M2.raise_argument_error($rjs_core.Symbol.make("in-values-sequence"), "sequence?", g1980);
    }
    if_res1179;
    return make_do_sequence(function() {
      var let_result1180 = make_sequence(false, g1980);
      var pos__gt_val1981 = let_result1180.getAt(0);
      var pre_pos_next1982 = let_result1180.getAt(1);
      var pos_next1983 = let_result1180.getAt(2);
      var init1984 = let_result1180.getAt(3);
      var pos_cont_p1985 = let_result1180.getAt(4);
      var pre_cont_p1986 = let_result1180.getAt(5);
      var post_cont_p1987 = let_result1180.getAt(6);
      if (pre_cont_p1986 !== false) {
        var if_res1184 = function(vals1991) {
          if (M2.list_p(vals1991) !== false) {
            var if_res1183 = M2.apply(pre_cont_p1986, vals1991);
          } else {
            var if_res1183 = pre_cont_p1986(vals1991);
          }
          return if_res1183;
        };
      } else {
        var if_res1184 = false;
      }
      if (post_cont_p1987 !== false) {
        var if_res1182 = function(pos1992, vals1993) {
          if (M2.list_p(vals1993) !== false) {
            var if_res1181 = M2.apply(post_cont_p1987, pos1992, vals1993);
          } else {
            var if_res1181 = post_cont_p1987(pos1992, vals1993);
          }
          return if_res1181;
        };
      } else {
        var if_res1182 = false;
      }
      return M2.values(function(pos1988) {
        var cl1185 = function(v1989) {
          if (M2.list_p(v1989) !== false) {
            var if_res1189 = M2.list(v1989);
          } else {
            var if_res1189 = v1989;
          }
          return if_res1189;
        };
        var cl1186 = $rjs_core.attachProcedureArity(function() {
          var vs1990 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          return vs1990;
        });
        return M2.call_with_values(function() {
          return pos__gt_val1981(pos1988);
        }, $rjs_core.attachProcedureArity(function() {
          var fixed_lam1187 = {'1': cl1185}[arguments.length];
          if (fixed_lam1187 !== undefined !== false) {
            return fixed_lam1187.apply(null, arguments);
          } else {
            if (true !== false) {
              var if_res1188 = cl1186.apply(null, arguments);
            } else {
              var if_res1188 = M2.error("case-lambda: invalid case");
            }
            return if_res1188;
          }
        }, [M2.make_arity_at_least(0)]));
      }, pre_pos_next1982, pos_next1983, init1984, pos_cont_p1985, if_res1184, if_res1182);
    });
  };
  var append_sequences = function(sequences1994, cyclic_p1995) {
    var seqs__gt_m_plus_g_plus_r1996 = function(seqs1997) {
      if (M2.pair_p(seqs1997) !== false) {
        var let_result1190 = sequence_generate(M2.car(seqs1997));
        var more_p1998 = let_result1190.getAt(0);
        var get1999 = let_result1190.getAt(1);
        var seqs2000 = M2.cdr(seqs1997);
        if (more_p1998() !== false) {
          var if_res1191 = M2.list_times_(more_p1998, get1999, seqs2000);
        } else {
          var if_res1191 = seqs__gt_m_plus_g_plus_r1996(seqs2000);
        }
        var if_res1193 = if_res1191;
      } else {
        if (cyclic_p1995 !== false) {
          var if_res1192 = seqs__gt_m_plus_g_plus_r1996(sequences1994);
        } else {
          var if_res1192 = false;
        }
        var if_res1193 = if_res1192;
      }
      return if_res1193;
    };
    return make_do_sequence(function() {
      return M2.values(function(m_plus_g_plus_r2001) {
        return M2.cadr(m_plus_g_plus_r2001)();
      }, function(m_plus_g_plus_r2002) {
        if (M2.pair_p(m_plus_g_plus_r2002) !== false) {
          var if_res1194 = M2.not(M2.car(m_plus_g_plus_r2002)());
        } else {
          var if_res1194 = false;
        }
        if (if_res1194 !== false) {
          var if_res1195 = seqs__gt_m_plus_g_plus_r1996(M2.cddr(m_plus_g_plus_r2002));
        } else {
          var if_res1195 = m_plus_g_plus_r2002;
        }
        return if_res1195;
      }, seqs__gt_m_plus_g_plus_r1996(sequences1994), M2.values, false, false);
    });
  };
  var check_sequences = function(who2003, sequences2004) {
    return M2.for_each(function(g2005) {
      if (sequence_p(g2005) !== false) {
        var if_res1196 = M2.rvoid();
      } else {
        var if_res1196 = M2.raise_argument_error(who2003, "sequence?", g2005);
      }
      return if_res1196;
    }, sequences2004);
  };
  var in_sequences = $rjs_core.attachProcedureArity(function() {
    var sequences2006 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
    check_sequences($rjs_core.Symbol.make("in-sequences"), sequences2006);
    if (M2.pair_p(sequences2006) !== false) {
      var if_res1197 = M2.null_p(M2.cdr(sequences2006));
    } else {
      var if_res1197 = false;
    }
    if (if_res1197 !== false) {
      var if_res1198 = M2.car(sequences2006);
    } else {
      var if_res1198 = append_sequences(sequences2006, false);
    }
    return if_res1198;
  });
  var in_cycle = $rjs_core.attachProcedureArity(function() {
    var sequences2007 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
    check_sequences($rjs_core.Symbol.make("in-cycle"), sequences2007);
    return append_sequences(sequences2007, true);
  });
  var in_parallel = $rjs_core.attachProcedureArity(function() {
    var sequences2008 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
    check_sequences($rjs_core.Symbol.make("in-parallel"), sequences2008);
    if (M2._eq_(1, M2.length(sequences2008)) !== false) {
      var if_res1223 = M2.car(sequences2008);
    } else {
      var if_res1223 = make_do_sequence(function() {
        var let_result1199 = make_sequence($rjs_core.Pair.makeList($rjs_core.Symbol.make("g")), sequences2008);
        var pos__gt_vals2023 = let_result1199.getAt(0);
        var pos_pre_inc2024 = let_result1199.getAt(1);
        var pos_next2025 = let_result1199.getAt(2);
        var init2026 = let_result1199.getAt(3);
        var pos_cont_p2027 = let_result1199.getAt(4);
        var val_cont_p2028 = let_result1199.getAt(5);
        var all_cont_p2029 = let_result1199.getAt(6);
        M2.rvoid();
        var for_loop2030 = function(p__gt_v2031, p_p_n2032, p_n2033, i2034, ps_p2035, pr_p2036, po_p2037, pos2038) {
          if (pos_cont_p2027 !== false) {
            var if_res1200 = pos_cont_p2027(pos2038);
          } else {
            var if_res1200 = true;
          }
          if (if_res1200 !== false) {
            var g2042 = pos__gt_vals2023(pos2038);
            if (all_cont_p2029 !== false) {
              var if_res1201 = function(pos2043) {
                return all_cont_p2029(pos2043, g2042);
              };
            } else {
              var if_res1201 = false;
            }
            var let_result1202 = M2.values(g2042, if_res1201);
            var g2039 = let_result1202.getAt(0);
            var all_cont_p_by_pos2040 = let_result1202.getAt(1);
            if (pos_pre_inc2024 !== false) {
              var if_res1203 = pos_pre_inc2024(pos2038);
            } else {
              var if_res1203 = pos2038;
            }
            var pos2041 = if_res1203;
            if (val_cont_p2028 !== false) {
              var if_res1204 = val_cont_p2028(g2039);
            } else {
              var if_res1204 = true;
            }
            if (if_res1204 !== false) {
              var p__gt_v2051 = p__gt_v2031;
              var p_p_n2052 = p_p_n2032;
              var p_n2053 = p_n2033;
              var i2054 = i2034;
              var ps_p2055 = ps_p2035;
              var pr_p2056 = pr_p2036;
              var po_p2057 = po_p2037;
              var let_result1205 = make_sequence(false, g2039);
              var p__gt_v12065 = let_result1205.getAt(0);
              var p_p_n22066 = let_result1205.getAt(1);
              var p_n32067 = let_result1205.getAt(2);
              var i42068 = let_result1205.getAt(3);
              var ps_p52069 = let_result1205.getAt(4);
              var pr_p62070 = let_result1205.getAt(5);
              var po_p72071 = let_result1205.getAt(6);
              var let_result1206 = M2.values(M2.cons(p__gt_v12065, p__gt_v2051), M2.cons(p_p_n22066, p_p_n2052), M2.cons(p_n32067, p_n2053), M2.cons(i42068, i2054), M2.cons(ps_p52069, ps_p2055), M2.cons(pr_p62070, pr_p2056), M2.cons(po_p72071, po_p2057));
              var p__gt_v2058 = let_result1206.getAt(0);
              var p_p_n2059 = let_result1206.getAt(1);
              var p_n2060 = let_result1206.getAt(2);
              var i2061 = let_result1206.getAt(3);
              var ps_p2062 = let_result1206.getAt(4);
              var pr_p2063 = let_result1206.getAt(5);
              var po_p2064 = let_result1206.getAt(6);
              var let_result1207 = M2.values(p__gt_v2058, p_p_n2059, p_n2060, i2061, ps_p2062, pr_p2063, po_p2064);
              var p__gt_v2044 = let_result1207.getAt(0);
              var p_p_n2045 = let_result1207.getAt(1);
              var p_n2046 = let_result1207.getAt(2);
              var i2047 = let_result1207.getAt(3);
              var ps_p2048 = let_result1207.getAt(4);
              var pr_p2049 = let_result1207.getAt(5);
              var po_p2050 = let_result1207.getAt(6);
              if (all_cont_p_by_pos2040 !== false) {
                var if_res1208 = all_cont_p_by_pos2040(pos2041);
              } else {
                var if_res1208 = true;
              }
              if (if_res1208 !== false) {
                var if_res1209 = M2.not(false);
              } else {
                var if_res1209 = false;
              }
              if (if_res1209 !== false) {
                var if_res1210 = for_loop2030(p__gt_v2044, p_p_n2045, p_n2046, i2047, ps_p2048, pr_p2049, po_p2050, pos_next2025(pos2041));
              } else {
                var if_res1210 = M2.values(p__gt_v2044, p_p_n2045, p_n2046, i2047, ps_p2048, pr_p2049, po_p2050);
              }
              var if_res1211 = if_res1210;
            } else {
              var if_res1211 = M2.values(p__gt_v2031, p_p_n2032, p_n2033, i2034, ps_p2035, pr_p2036, po_p2037);
            }
            var if_res1212 = if_res1211;
          } else {
            var if_res1212 = M2.values(p__gt_v2031, p_p_n2032, p_n2033, i2034, ps_p2035, pr_p2036, po_p2037);
          }
          return if_res1212;
        };
        var let_result1213 = for_loop2030(M2.rnull, M2.rnull, M2.rnull, M2.rnull, M2.rnull, M2.rnull, M2.rnull, init2026);
        var p__gt_v2016 = let_result1213.getAt(0);
        var p_p_n2017 = let_result1213.getAt(1);
        var p_n2018 = let_result1213.getAt(2);
        var i2019 = let_result1213.getAt(3);
        var ps_p2020 = let_result1213.getAt(4);
        var pr_p2021 = let_result1213.getAt(5);
        var po_p2022 = let_result1213.getAt(6);
        var let_result1214 = M2.values(M4.alt_reverse(p__gt_v2016), M4.alt_reverse(p_p_n2017), M4.alt_reverse(p_n2018), M4.alt_reverse(i2019), M4.alt_reverse(ps_p2020), M4.alt_reverse(pr_p2021), M4.alt_reverse(po_p2022));
        var pos__gt_vals2009 = let_result1214.getAt(0);
        var pre_pos_nexts2010 = let_result1214.getAt(1);
        var pos_nexts2011 = let_result1214.getAt(2);
        var inits2012 = let_result1214.getAt(3);
        var pos_cont_ps2013 = let_result1214.getAt(4);
        var pre_cont_ps2014 = let_result1214.getAt(5);
        var post_cont_ps2015 = let_result1214.getAt(6);
        if (M2.ormap(M2.values, pre_pos_nexts2010) !== false) {
          var if_res1222 = function(poses2075) {
            return M2.map(function(pre_pos_next2076, pos2077) {
              if (pre_pos_next2076 !== false) {
                var if_res1221 = pre_pos_next2076(pos2077);
              } else {
                var if_res1221 = pos2077;
              }
              return if_res1221;
            }, pre_pos_nexts2010, poses2075);
          };
        } else {
          var if_res1222 = false;
        }
        if (M2.ormap(M2.values, pos_cont_ps2013) !== false) {
          var if_res1220 = function(poses2081) {
            return M2.andmap(function(pos_cont_p2082, pos2083) {
              if (pos_cont_p2082 !== false) {
                var if_res1219 = pos_cont_p2082(pos2083);
              } else {
                var if_res1219 = true;
              }
              return if_res1219;
            }, pos_cont_ps2013, poses2081);
          };
        } else {
          var if_res1220 = false;
        }
        if (M2.ormap(M2.values, pre_cont_ps2014) !== false) {
          var if_res1218 = $rjs_core.attachProcedureArity(function() {
            var vals2084 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
            return M2.andmap(function(pre_cont_p2085, val2086) {
              if (pre_cont_p2085 !== false) {
                var if_res1217 = pre_cont_p2085(val2086);
              } else {
                var if_res1217 = true;
              }
              return if_res1217;
            }, pre_cont_ps2014, vals2084);
          });
        } else {
          var if_res1218 = false;
        }
        if (M2.ormap(M2.values, post_cont_ps2015) !== false) {
          var if_res1216 = $rjs_core.attachProcedureArity(function(poses2087) {
            var vals2088 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
            return M2.andmap(function(post_cont_p2089, pos2090, val2091) {
              if (post_cont_p2089 !== false) {
                var if_res1215 = post_cont_p2089(pos2090, val2091);
              } else {
                var if_res1215 = true;
              }
              return if_res1215;
            }, post_cont_ps2015, poses2087, vals2088);
          });
        } else {
          var if_res1216 = false;
        }
        return M2.values(function(poses2072) {
          return M2.apply(M2.values, M2.map(function(pos__gt_val2073, pos2074) {
            return pos__gt_val2073(pos2074);
          }, pos__gt_vals2009, poses2072));
        }, if_res1222, function(poses2078) {
          return M2.map(function(pos_next2079, pos2080) {
            return pos_next2079(pos2080);
          }, pos_nexts2011, poses2078);
        }, inits2012, if_res1220, if_res1218, if_res1216);
      });
    }
    return if_res1223;
  });
  var cl1224 = function(producer2092) {
    return make_do_sequence(function() {
      return M2.values($rjs_core.attachProcedureArity(function() {
        var _2093 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
        return producer2092();
      }), M2.rvoid, M2.rvoid(), false, false, false);
    });
  };
  var cl1225 = $rjs_core.attachProcedureArity(function(producer2094, stop2095) {
    var more2096 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    if (M2.null_p(more2096) !== false) {
      var if_res1228 = function(_2098) {
        return producer2094();
      };
    } else {
      var if_res1228 = function(_2099) {
        return M2.apply(producer2094, more2096);
      };
    }
    var produce_bang_2097 = if_res1228;
    if (M2.not(M2.procedure_p(stop2095)) !== false) {
      var if_res1230 = function(x2101) {
        return M2.not(M2.eq_p(x2101, stop2095));
      };
    } else {
      if (M2.equal_p(1, M2.procedure_arity(stop2095)) !== false) {
        var if_res1229 = function(x2102) {
          return M2.not(stop2095(x2102));
        };
      } else {
        var if_res1229 = $rjs_core.attachProcedureArity(function() {
          var xs2103 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          return M2.not(M2.apply(stop2095, xs2103));
        });
      }
      var if_res1230 = if_res1229;
    }
    var stop_p2100 = if_res1230;
    return make_do_sequence(function() {
      return M2.values(produce_bang_2097, M2.rvoid, M2.rvoid(), false, stop_p2100, false);
    });
  });
  var in_producer = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1226 = {'1': cl1224}[arguments.length];
    if (fixed_lam1226 !== undefined !== false) {
      return fixed_lam1226.apply(null, arguments);
    } else {
      if (M2._gt__eq_(cl1225.length, 1) !== false) {
        var if_res1227 = cl1225.apply(null, arguments);
      } else {
        var if_res1227 = M2.error("case-lambda: invalid case");
      }
      return if_res1227;
    }
  }, [1, M2.make_arity_at_least(2)]);
  var let_result1231 = M2.make_struct_type($rjs_core.Symbol.make("stream"), false, 3, 0, false, M2.list(M2.cons(prop_stream, M2.vector(function(v2104) {
    return do_stream_ref(v2104, 0)();
  }, function(v2105) {
    return do_stream_ref(v2105, 1)();
  }, function(v2106) {
    return do_stream_ref(v2106, 2)();
  }))));
  var struct_do_stream = let_result1231.getAt(0);
  var make_do_stream = let_result1231.getAt(1);
  var do_stream_p = let_result1231.getAt(2);
  var do_stream_ref = let_result1231.getAt(3);
  var do_stream_set_bang_ = let_result1231.getAt(4);
  var empty_stream = make_do_stream(function() {
    return true;
  }, M2.rvoid, M2.rvoid);
  var sequence__gt_stream = function(s2107) {
    if (sequence_p(s2107) !== false) {
      var if_res1232 = M2.rvoid();
    } else {
      var if_res1232 = M2.raise_argument_error($rjs_core.Symbol.make("sequence-generate"), "sequence?", s2107);
    }
    if_res1232;
    if (stream_p(s2107) !== false) {
      var if_res1243 = s2107;
    } else {
      var let_result1233 = make_sequence(false, s2107);
      var pos__gt_val2108 = let_result1233.getAt(0);
      var pre_pos_next2109 = let_result1233.getAt(1);
      var pos_next2110 = let_result1233.getAt(2);
      var init2111 = let_result1233.getAt(3);
      var pos_cont_p2112 = let_result1233.getAt(4);
      var pre_cont_p2113 = let_result1233.getAt(5);
      var post_cont_p2114 = let_result1233.getAt(6);
      var gen_stream2115 = function(pos2116) {
        var done_p2117 = false;
        var vals2118 = false;
        var empty_p2119 = false;
        var next2120 = false;
        var force_bang_2121 = function() {
          if (done_p2117 !== false) {
            var if_res1239 = M2.rvoid();
          } else {
            if (pos_cont_p2112 !== false) {
              var if_res1234 = pos_cont_p2112(pos2116);
            } else {
              var if_res1234 = true;
            }
            if (if_res1234 !== false) {
              vals2118 = M2.call_with_values(function() {
                return pos__gt_val2108(pos2116);
              }, M2.list);
              if (pre_pos_next2109 !== false) {
                pos2116 = pre_pos_next2109(pos2116);
                var if_res1235 = null;
              } else {
                var if_res1235 = M2.rvoid();
              }
              if_res1235;
              if (pre_cont_p2113 !== false) {
                var if_res1236 = M2.apply(pre_cont_p2113, vals2118);
              } else {
                var if_res1236 = true;
              }
              if (if_res1236 !== false) {
                var if_res1237 = M2.rvoid();
              } else {
                vals2118 = false;
                empty_p2119 = true;
                var if_res1237 = null;
              }
              var if_res1238 = if_res1237;
            } else {
              empty_p2119 = true;
              var if_res1238 = null;
            }
            if_res1238;
            done_p2117 = true;
            var if_res1239 = null;
          }
          return if_res1239;
        };
        return make_do_stream(function() {
          force_bang_2121();
          return empty_p2119;
        }, function() {
          force_bang_2121();
          return M2.apply(M2.values, vals2118);
        }, function() {
          force_bang_2121();
          if (next2120 !== false) {
            var if_res1242 = next2120;
          } else {
            if (post_cont_p2114 !== false) {
              var if_res1240 = M2.apply(post_cont_p2114, pos2116, vals2118);
            } else {
              var if_res1240 = true;
            }
            if (if_res1240 !== false) {
              next2120 = gen_stream2115(pos_next2110(pos2116));
              var if_res1241 = null;
            } else {
              next2120 = empty_stream;
              var if_res1241 = null;
            }
            if_res1241;
            var if_res1242 = next2120;
          }
          return if_res1242;
        });
      };
      var if_res1243 = gen_stream2115(init2111);
    }
    return if_res1243;
  };
  var no_more = function() {
    return M2.raise(M2.__rjs_quoted__.exn_fail_contract("sequence has no more values", M2.current_continuation_marks()));
  };
  var sequence_generate = function(g2122) {
    if (sequence_p(g2122) !== false) {
      var if_res1244 = M2.rvoid();
    } else {
      var if_res1244 = M2.raise_argument_error($rjs_core.Symbol.make("sequence-generate"), "sequence?", g2122);
    }
    if_res1244;
    var let_result1245 = make_sequence(false, g2122);
    var pos__gt_val2123 = let_result1245.getAt(0);
    var pre_pos_next2124 = let_result1245.getAt(1);
    var pos_next2125 = let_result1245.getAt(2);
    var init2126 = let_result1245.getAt(3);
    var pos_cont_p2127 = let_result1245.getAt(4);
    var pre_cont_p2128 = let_result1245.getAt(5);
    var post_cont_p2129 = let_result1245.getAt(6);
    var pos2130 = init2126;
    var more_p2131 = false;
    var prep_val_bang_2132 = false;
    var next2133 = false;
    var init_more_p2134 = function() {
      prep_val_bang_2132();
      return more_p2131();
    };
    var init_next2135 = function() {
      prep_val_bang_2132();
      return next2133();
    };
    var init_prep_val_bang_2136 = function() {
      if (pos_cont_p2127 !== false) {
        var if_res1246 = pos_cont_p2127(pos2130);
      } else {
        var if_res1246 = true;
      }
      if (if_res1246 !== false) {
        var if_res1253 = M2.call_with_values(function() {
          var begin_res1251 = pos__gt_val2123(pos2130);
          if (pre_pos_next2124 !== false) {
            pos2130 = pre_pos_next2124(pos2130);
            var if_res1252 = null;
          } else {
            var if_res1252 = M2.rvoid();
          }
          if_res1252;
          return begin_res1251;
        }, $rjs_core.attachProcedureArity(function() {
          var vals2137 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          if (pre_cont_p2128 !== false) {
            var if_res1247 = M2.apply(pre_cont_p2128, vals2137);
          } else {
            var if_res1247 = true;
          }
          if (if_res1247 !== false) {
            more_p2131 = function() {
              return true;
            };
            next2133 = function() {
              var v2138 = vals2137;
              prep_val_bang_2132 = function() {
                if (post_cont_p2129 !== false) {
                  var if_res1248 = M2.apply(post_cont_p2129, pos2130, vals2137);
                } else {
                  var if_res1248 = true;
                }
                if (if_res1248 !== false) {
                  pos2130 = pos_next2125(pos2130);
                  prep_val_bang_2132 = init_prep_val_bang_2136;
                  var if_res1249 = prep_val_bang_2132();
                } else {
                  more_p2131 = function() {
                    return false;
                  };
                  next2133 = no_more;
                  var if_res1249 = null;
                }
                return if_res1249;
              };
              more_p2131 = init_more_p2134;
              next2133 = init_next2135;
              return M2.apply(M2.values, v2138);
            };
            prep_val_bang_2132 = M2.rvoid;
            var if_res1250 = M2.apply(M2.values, vals2137);
          } else {
            more_p2131 = function() {
              return false;
            };
            next2133 = no_more;
            var if_res1250 = null;
          }
          return if_res1250;
        }));
      } else {
        more_p2131 = function() {
          return false;
        };
        next2133 = no_more;
        var if_res1253 = null;
      }
      return if_res1253;
    };
    more_p2131 = init_more_p2134;
    prep_val_bang_2132 = init_prep_val_bang_2136;
    next2133 = init_next2135;
    var sequence_more_p2139 = function() {
      return more_p2131();
    };
    var sequence_next2140 = function() {
      return next2133();
    };
    return M2.values(sequence_more_p2139, sequence_next2140);
  };
  var sequence_generate_times_ = function(g2141) {
    if (sequence_p(g2141) !== false) {
      var if_res1254 = M2.rvoid();
    } else {
      var if_res1254 = M2.raise_argument_error($rjs_core.Symbol.make("sequence-generate*"), "sequence?", g2141);
    }
    if_res1254;
    var let_result1255 = make_sequence(false, g2141);
    var pos__gt_val2142 = let_result1255.getAt(0);
    var pre_pos_next2143 = let_result1255.getAt(1);
    var pos_next2144 = let_result1255.getAt(2);
    var init2145 = let_result1255.getAt(3);
    var pos_cont_p2146 = let_result1255.getAt(4);
    var pre_cont_p2147 = let_result1255.getAt(5);
    var post_cont_p2148 = let_result1255.getAt(6);
    var next_bang_2149 = function(pos2150) {
      if (pos_cont_p2146 !== false) {
        var if_res1256 = pos_cont_p2146(pos2150);
      } else {
        var if_res1256 = true;
      }
      if (if_res1256 !== false) {
        var if_res1263 = M2.call_with_values(function() {
          var begin_res1261 = pos__gt_val2142(pos2150);
          if (pre_pos_next2143 !== false) {
            pos2150 = pre_pos_next2143(pos2150);
            var if_res1262 = null;
          } else {
            var if_res1262 = M2.rvoid();
          }
          if_res1262;
          return begin_res1261;
        }, $rjs_core.attachProcedureArity(function() {
          var vals2151 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
          if (pre_cont_p2147 !== false) {
            var if_res1257 = M2.apply(pre_cont_p2147, vals2151);
          } else {
            var if_res1257 = true;
          }
          if (if_res1257 !== false) {
            var if_res1260 = M2.values(vals2151, function() {
              if (post_cont_p2148 !== false) {
                var if_res1258 = M2.apply(post_cont_p2148, pos2150, vals2151);
              } else {
                var if_res1258 = true;
              }
              if (if_res1258 !== false) {
                var if_res1259 = next_bang_2149(pos_next2144(pos2150));
              } else {
                var if_res1259 = M2.values(false, no_more);
              }
              return if_res1259;
            });
          } else {
            var if_res1260 = M2.values(false, no_more);
          }
          return if_res1260;
        }));
      } else {
        var if_res1263 = M2.values(false, no_more);
      }
      return if_res1263;
    };
    return next_bang_2149(init2145);
  };
  var grow_vector = function(vec2152) {
    var n2153 = M2.vector_length(vec2152);
    var new_vec2154 = M2.make_vector(2 * n2153);
    M2.__rjs_quoted__.vector_copy_bang_(new_vec2154, 0, vec2152, 0, n2153);
    return new_vec2154;
  };
  var shrink_vector = function(vec2155, i2156) {
    var new_vec2157 = M2.make_vector(i2156);
    M2.__rjs_quoted__.vector_copy_bang_(new_vec2157, 0, vec2155, 0, i2156);
    return new_vec2157;
  };
  var dir_list = function(full_d2158, d2159, acc2160) {
    var let_result1264 = make_sequence($rjs_core.Pair.makeList($rjs_core.Symbol.make("f")), in_list(M2.reverse(M0.sort(M2.__rjs_quoted__.directory_list(full_d2158), M2.__rjs_quoted__.path_lt__p))));
    var pos__gt_vals2161 = let_result1264.getAt(0);
    var pos_pre_inc2162 = let_result1264.getAt(1);
    var pos_next2163 = let_result1264.getAt(2);
    var init2164 = let_result1264.getAt(3);
    var pos_cont_p2165 = let_result1264.getAt(4);
    var val_cont_p2166 = let_result1264.getAt(5);
    var all_cont_p2167 = let_result1264.getAt(6);
    M2.rvoid();
    var for_loop2168 = function(acc2169, pos2170) {
      if (pos_cont_p2165 !== false) {
        var if_res1265 = pos_cont_p2165(pos2170);
      } else {
        var if_res1265 = true;
      }
      if (if_res1265 !== false) {
        var f2174 = pos__gt_vals2161(pos2170);
        if (all_cont_p2167 !== false) {
          var if_res1266 = function(pos2175) {
            return all_cont_p2167(pos2175, f2174);
          };
        } else {
          var if_res1266 = false;
        }
        var let_result1267 = M2.values(f2174, if_res1266);
        var f2171 = let_result1267.getAt(0);
        var all_cont_p_by_pos2172 = let_result1267.getAt(1);
        if (pos_pre_inc2162 !== false) {
          var if_res1268 = pos_pre_inc2162(pos2170);
        } else {
          var if_res1268 = pos2170;
        }
        var pos2173 = if_res1268;
        if (val_cont_p2166 !== false) {
          var if_res1269 = val_cont_p2166(f2171);
        } else {
          var if_res1269 = true;
        }
        if (if_res1269 !== false) {
          var acc2177 = acc2169;
          var acc2178 = M2.cons(M2.__rjs_quoted__.build_path(d2159, f2171), acc2177);
          var acc2176 = M2.values(acc2178);
          if (all_cont_p_by_pos2172 !== false) {
            var if_res1270 = all_cont_p_by_pos2172(pos2173);
          } else {
            var if_res1270 = true;
          }
          if (if_res1270 !== false) {
            var if_res1271 = M2.not(false);
          } else {
            var if_res1271 = false;
          }
          if (if_res1271 !== false) {
            var if_res1272 = for_loop2168(acc2176, pos_next2163(pos2173));
          } else {
            var if_res1272 = acc2176;
          }
          var if_res1273 = if_res1272;
        } else {
          var if_res1273 = acc2169;
        }
        var if_res1274 = if_res1273;
      } else {
        var if_res1274 = acc2169;
      }
      return if_res1274;
    };
    return for_loop2168(acc2160, init2164);
  };
  var next_body = function(l2179, d2180, init_dir2181, use_dir_p2182) {
    var full_d2183 = M2.__rjs_quoted__.path__gt_complete_path(d2180, init_dir2181);
    if (M2.__rjs_quoted__.directory_exists_p(full_d2183) !== false) {
      var if_res1275 = use_dir_p2182(full_d2183);
    } else {
      var if_res1275 = false;
    }
    if (if_res1275 !== false) {
      var if_res1276 = dir_list(full_d2183, d2180, M2.cdr(l2179));
    } else {
      var if_res1276 = M2.cdr(l2179);
    }
    return if_res1276;
  };
  var initial_state = function(orig_dir2184, init_dir2185) {
    if (orig_dir2184 !== false) {
      var if_res1277 = dir_list(M2.__rjs_quoted__.path__gt_complete_path(orig_dir2184, init_dir2185), orig_dir2184, M2.rnull);
    } else {
      var if_res1277 = M2.__rjs_quoted__.directory_list(init_dir2185);
    }
    return if_res1277;
  };
  var cl1278 = function() {
    return _times_in_directory(false, function(d2186) {
      return true;
    });
  };
  var cl1279 = function(orig_dir2187) {
    return _times_in_directory(orig_dir2187, function(d2188) {
      return true;
    });
  };
  var cl1280 = function(orig_dir2189, use_dir_p2190) {
    var init_dir2191 = M2.__rjs_quoted__.current_directory();
    var next2192 = function(l2193) {
      var d2194 = M2.car(l2193);
      return next_body(l2193, d2194, init_dir2191, use_dir_p2190);
    };
    return make_do_sequence(function() {
      return M2.values(M2.car, next2192, initial_state(orig_dir2189, init_dir2191), M2.pair_p, false, false);
    });
  };
  var _times_in_directory = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1281 = {
      '0': cl1278,
      '1': cl1279,
      '2': cl1280
    }[arguments.length];
    if (fixed_lam1281 !== undefined !== false) {
      return fixed_lam1281.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [0, 1, 2]);
  var __rjs_quoted__ = {};
  __rjs_quoted__.default_in_hash_pairs = default_in_hash_pairs;
  __rjs_quoted__.in_naturals = in_naturals;
  __rjs_quoted__.in_vector = in_vector;
  __rjs_quoted__.default_in_hash_values = default_in_hash_values;
  __rjs_quoted__.check_in_bytes_lines = check_in_bytes_lines;
  __rjs_quoted__.default_in_weak_hash_pairs = default_in_weak_hash_pairs;
  __rjs_quoted__.in_input_port_chars = in_input_port_chars;
  __rjs_quoted__.default_in_mutable_hash_values = default_in_mutable_hash_values;
  __rjs_quoted__.next_body = next_body;
  __rjs_quoted__.grow_vector = grow_vector;
  __rjs_quoted__.in_indexed = in_indexed;
  __rjs_quoted__.default_in_immutable_hash_keys = default_in_immutable_hash_keys;
  __rjs_quoted__.in_port = in_port;
  __rjs_quoted__.in_producer = in_producer;
  __rjs_quoted__.default_in_hash_keys = default_in_hash_keys;
  __rjs_quoted__.default_in_mutable_hash_pairs = default_in_mutable_hash_pairs;
  __rjs_quoted__.default_in_immutable_hash = default_in_immutable_hash;
  __rjs_quoted__.default_in_mutable_hash = default_in_mutable_hash;
  __rjs_quoted__.default_in_mutable_hash_keys = default_in_mutable_hash_keys;
  __rjs_quoted__.not_weak_p = not_weak_p;
  __rjs_quoted__.default_in_weak_hash = default_in_weak_hash;
  __rjs_quoted__.initial_state = initial_state;
  __rjs_quoted__.in_lines = in_lines;
  __rjs_quoted__.default_in_immutable_hash_pairs = default_in_immutable_hash_pairs;
  __rjs_quoted__.shrink_vector = shrink_vector;
  __rjs_quoted__.default_in_weak_hash_keys = default_in_weak_hash_keys;
  __rjs_quoted__.in_range = in_range;
  __rjs_quoted__.in_parallel = in_parallel;
  __rjs_quoted__.in_value = in_value;
  __rjs_quoted__._times_in_directory = _times_in_directory;
  __rjs_quoted__.default_in_immutable_hash_values = default_in_immutable_hash_values;
  __rjs_quoted__.unsafe_stream_rest = unsafe_stream_rest;
  __rjs_quoted__.check_in_port = check_in_port;
  __rjs_quoted__.check_in_lines = check_in_lines;
  __rjs_quoted__.normalise_inputs = normalise_inputs;
  __rjs_quoted__._hash_gen = _hash_gen;
  __rjs_quoted__.in_string = in_string;
  __rjs_quoted__.make_sequence = make_sequence;
  __rjs_quoted__.unsafe_stream_first = unsafe_stream_first;
  __rjs_quoted__.unsafe_stream_not_empty_p = unsafe_stream_not_empty_p;
  __rjs_quoted__.in_input_port_bytes = in_input_port_bytes;
  __rjs_quoted__.mutable_p = mutable_p;
  __rjs_quoted__.default_in_weak_hash_values = default_in_weak_hash_values;
  __rjs_quoted__.stream_p = stream_p;
  __rjs_quoted__.in_bytes = in_bytes;
  __rjs_quoted__.stop_after = stop_after;
  __rjs_quoted__.default_in_hash = default_in_hash;
  __rjs_quoted__.in_stream = in_stream;
  __rjs_quoted__.make_do_sequence = make_do_sequence;
  __rjs_quoted__.in_mlist = in_mlist;
  __rjs_quoted__.in_bytes_lines = in_bytes_lines;
  __rjs_quoted__.in_list = in_list;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get make_do_sequence() {
      return make_do_sequence;
    },
    get prop_sequence() {
      return prop_sequence;
    },
    get sequence_generate_times_() {
      return sequence_generate_times_;
    },
    get sequence_generate() {
      return sequence_generate;
    },
    get sequence_p() {
      return sequence_p;
    },
    get make_do_stream() {
      return make_do_stream;
    },
    get empty_stream() {
      return empty_stream;
    },
    get sequence__gt_stream() {
      return sequence__gt_stream;
    },
    get stream_via_prop_p() {
      return stream_via_prop_p;
    },
    get stream_ref() {
      return stream_ref;
    },
    get prop_stream() {
      return prop_stream;
    },
    get stream_rest() {
      return stream_rest;
    },
    get stream_first() {
      return stream_first;
    },
    get stream_empty_p() {
      return stream_empty_p;
    },
    get stream_p() {
      return stream_p;
    },
    get stop_after() {
      return stop_after;
    },
    get stop_before() {
      return stop_before;
    },
    get in_values_times__sequence() {
      return in_values_times__sequence;
    },
    get in_values_sequence() {
      return in_values_sequence;
    },
    get in_parallel() {
      return in_parallel;
    },
    get in_cycle() {
      return in_cycle;
    },
    get in_sequences() {
      return in_sequences;
    }
  };
})();
var $__collects_47_racket_47_list_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/list.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_more_45_scheme_46_rkt_46_js__;
  var M1 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M2 = $__collects_47_racket_47_private_47_pre_45_base_46_rkt_46_js__;
  var M3 = $__runtime_47_kernel_46_rkt_46_js__;
  var M4 = $__collects_47_racket_47_private_47_qq_45_and_45_or_46_rkt_46_js__;
  var M5 = $__collects_47_racket_47_private_47_member_46_rkt_46_js__;
  var M6 = $__collects_47_racket_47_private_47_list_46_rkt_46_js__;
  var M7 = $__collects_47_racket_47_private_47_kw_46_rkt_46_js__;
  var M8 = $__collects_47_racket_47_private_47_reverse_46_rkt_46_js__;
  var M9 = $__runtime_47_unsafe_46_rkt_46_js__;
  var M10 = $__collects_47_racket_47_private_47_for_46_rkt_46_js__;
  var first = function(x705) {
    if (M3.pair_p(x705) !== false) {
      var if_res315 = M3.list_p(x705);
    } else {
      var if_res315 = false;
    }
    if (if_res315 !== false) {
      var if_res316 = M3.car(x705);
    } else {
      var if_res316 = M3.raise_argument_error($rjs_core.Symbol.make("first"), "(and/c list? (not/c empty?))", x705);
    }
    return if_res316;
  };
  var second = function(l0706) {
    if (M3.list_p(l0706) !== false) {
      var loop707 = function(l708, pos709) {
        if (M3.pair_p(l708) !== false) {
          if (M3.eq_p(pos709, 1) !== false) {
            var if_res317 = M3.car(l708);
          } else {
            var if_res317 = loop707(M3.cdr(l708), M3.sub1(pos709));
          }
          var if_res318 = if_res317;
        } else {
          var if_res318 = M3.raise_arguments_error($rjs_core.Symbol.make("second"), "list contains too few elements", "list", l0706);
        }
        return if_res318;
      };
      var if_res319 = loop707(l0706, 2);
    } else {
      var if_res319 = M3.raise_argument_error($rjs_core.Symbol.make("second"), "list?", l0706);
    }
    return if_res319;
  };
  var third = function(l0710) {
    if (M3.list_p(l0710) !== false) {
      var loop711 = function(l712, pos713) {
        if (M3.pair_p(l712) !== false) {
          if (M3.eq_p(pos713, 1) !== false) {
            var if_res320 = M3.car(l712);
          } else {
            var if_res320 = loop711(M3.cdr(l712), M3.sub1(pos713));
          }
          var if_res321 = if_res320;
        } else {
          var if_res321 = M3.raise_arguments_error($rjs_core.Symbol.make("third"), "list contains too few elements", "list", l0710);
        }
        return if_res321;
      };
      var if_res322 = loop711(l0710, 3);
    } else {
      var if_res322 = M3.raise_argument_error($rjs_core.Symbol.make("third"), "list?", l0710);
    }
    return if_res322;
  };
  var fourth = function(l0714) {
    if (M3.list_p(l0714) !== false) {
      var loop715 = function(l716, pos717) {
        if (M3.pair_p(l716) !== false) {
          if (M3.eq_p(pos717, 1) !== false) {
            var if_res323 = M3.car(l716);
          } else {
            var if_res323 = loop715(M3.cdr(l716), M3.sub1(pos717));
          }
          var if_res324 = if_res323;
        } else {
          var if_res324 = M3.raise_arguments_error($rjs_core.Symbol.make("fourth"), "list contains too few elements", "list", l0714);
        }
        return if_res324;
      };
      var if_res325 = loop715(l0714, 4);
    } else {
      var if_res325 = M3.raise_argument_error($rjs_core.Symbol.make("fourth"), "list?", l0714);
    }
    return if_res325;
  };
  var fifth = function(l0718) {
    if (M3.list_p(l0718) !== false) {
      var loop719 = function(l720, pos721) {
        if (M3.pair_p(l720) !== false) {
          if (M3.eq_p(pos721, 1) !== false) {
            var if_res326 = M3.car(l720);
          } else {
            var if_res326 = loop719(M3.cdr(l720), M3.sub1(pos721));
          }
          var if_res327 = if_res326;
        } else {
          var if_res327 = M3.raise_arguments_error($rjs_core.Symbol.make("fifth"), "list contains too few elements", "list", l0718);
        }
        return if_res327;
      };
      var if_res328 = loop719(l0718, 5);
    } else {
      var if_res328 = M3.raise_argument_error($rjs_core.Symbol.make("fifth"), "list?", l0718);
    }
    return if_res328;
  };
  var sixth = function(l0722) {
    if (M3.list_p(l0722) !== false) {
      var loop723 = function(l724, pos725) {
        if (M3.pair_p(l724) !== false) {
          if (M3.eq_p(pos725, 1) !== false) {
            var if_res329 = M3.car(l724);
          } else {
            var if_res329 = loop723(M3.cdr(l724), M3.sub1(pos725));
          }
          var if_res330 = if_res329;
        } else {
          var if_res330 = M3.raise_arguments_error($rjs_core.Symbol.make("sixth"), "list contains too few elements", "list", l0722);
        }
        return if_res330;
      };
      var if_res331 = loop723(l0722, 6);
    } else {
      var if_res331 = M3.raise_argument_error($rjs_core.Symbol.make("sixth"), "list?", l0722);
    }
    return if_res331;
  };
  var seventh = function(l0726) {
    if (M3.list_p(l0726) !== false) {
      var loop727 = function(l728, pos729) {
        if (M3.pair_p(l728) !== false) {
          if (M3.eq_p(pos729, 1) !== false) {
            var if_res332 = M3.car(l728);
          } else {
            var if_res332 = loop727(M3.cdr(l728), M3.sub1(pos729));
          }
          var if_res333 = if_res332;
        } else {
          var if_res333 = M3.raise_arguments_error($rjs_core.Symbol.make("seventh"), "list contains too few elements", "list", l0726);
        }
        return if_res333;
      };
      var if_res334 = loop727(l0726, 7);
    } else {
      var if_res334 = M3.raise_argument_error($rjs_core.Symbol.make("seventh"), "list?", l0726);
    }
    return if_res334;
  };
  var eighth = function(l0730) {
    if (M3.list_p(l0730) !== false) {
      var loop731 = function(l732, pos733) {
        if (M3.pair_p(l732) !== false) {
          if (M3.eq_p(pos733, 1) !== false) {
            var if_res335 = M3.car(l732);
          } else {
            var if_res335 = loop731(M3.cdr(l732), M3.sub1(pos733));
          }
          var if_res336 = if_res335;
        } else {
          var if_res336 = M3.raise_arguments_error($rjs_core.Symbol.make("eighth"), "list contains too few elements", "list", l0730);
        }
        return if_res336;
      };
      var if_res337 = loop731(l0730, 8);
    } else {
      var if_res337 = M3.raise_argument_error($rjs_core.Symbol.make("eighth"), "list?", l0730);
    }
    return if_res337;
  };
  var ninth = function(l0734) {
    if (M3.list_p(l0734) !== false) {
      var loop735 = function(l736, pos737) {
        if (M3.pair_p(l736) !== false) {
          if (M3.eq_p(pos737, 1) !== false) {
            var if_res338 = M3.car(l736);
          } else {
            var if_res338 = loop735(M3.cdr(l736), M3.sub1(pos737));
          }
          var if_res339 = if_res338;
        } else {
          var if_res339 = M3.raise_arguments_error($rjs_core.Symbol.make("ninth"), "list contains too few elements", "list", l0734);
        }
        return if_res339;
      };
      var if_res340 = loop735(l0734, 9);
    } else {
      var if_res340 = M3.raise_argument_error($rjs_core.Symbol.make("ninth"), "list?", l0734);
    }
    return if_res340;
  };
  var tenth = function(l0738) {
    if (M3.list_p(l0738) !== false) {
      var loop739 = function(l740, pos741) {
        if (M3.pair_p(l740) !== false) {
          if (M3.eq_p(pos741, 1) !== false) {
            var if_res341 = M3.car(l740);
          } else {
            var if_res341 = loop739(M3.cdr(l740), M3.sub1(pos741));
          }
          var if_res342 = if_res341;
        } else {
          var if_res342 = M3.raise_arguments_error($rjs_core.Symbol.make("tenth"), "list contains too few elements", "list", l0738);
        }
        return if_res342;
      };
      var if_res343 = loop739(l0738, 10);
    } else {
      var if_res343 = M3.raise_argument_error($rjs_core.Symbol.make("tenth"), "list?", l0738);
    }
    return if_res343;
  };
  var last_pair = function(l742) {
    if (M3.pair_p(l742) !== false) {
      var loop743 = function(l744, x745) {
        if (M3.pair_p(x745) !== false) {
          var if_res344 = loop743(x745, M3.cdr(x745));
        } else {
          var if_res344 = l744;
        }
        return if_res344;
      };
      var if_res345 = loop743(l742, M3.cdr(l742));
    } else {
      var if_res345 = M3.raise_argument_error($rjs_core.Symbol.make("last-pair"), "pair?", l742);
    }
    return if_res345;
  };
  var last = function(l746) {
    if (M3.pair_p(l746) !== false) {
      var if_res346 = M3.list_p(l746);
    } else {
      var if_res346 = false;
    }
    if (if_res346 !== false) {
      var loop747 = function(l748, x749) {
        if (M3.pair_p(x749) !== false) {
          var if_res347 = loop747(x749, M3.cdr(x749));
        } else {
          var if_res347 = M3.car(l748);
        }
        return if_res347;
      };
      var if_res348 = loop747(l746, M3.cdr(l746));
    } else {
      var if_res348 = M3.raise_argument_error($rjs_core.Symbol.make("last"), "(and/c list? (not/c empty?))", l746);
    }
    return if_res348;
  };
  var rest = function(l750) {
    if (M3.pair_p(l750) !== false) {
      var if_res349 = M3.list_p(l750);
    } else {
      var if_res349 = false;
    }
    if (if_res349 !== false) {
      var if_res350 = M3.cdr(l750);
    } else {
      var if_res350 = M3.raise_argument_error($rjs_core.Symbol.make("rest"), "(and/c list? (not/c empty?))", l750);
    }
    return if_res350;
  };
  var cons_p = function(l751) {
    return M3.pair_p(l751);
  };
  var empty_p = function(l752) {
    return M3.null_p(l752);
  };
  var empty = $rjs_core.Pair.Empty;
  var make_list = function(n753, x754) {
    if (M3.exact_nonnegative_integer_p(n753) !== false) {
      var if_res351 = M3.rvoid();
    } else {
      var if_res351 = M3.raise_argument_error($rjs_core.Symbol.make("make-list"), "exact-nonnegative-integer?", 0, n753, x754);
    }
    if_res351;
    var loop755 = function(n756, r757) {
      if (M3.zero_p(n756) !== false) {
        var if_res352 = r757;
      } else {
        var if_res352 = loop755(M3.sub1(n756), M3.cons(x754, r757));
      }
      return if_res352;
    };
    return loop755(n753, $rjs_core.Pair.Empty);
  };
  var list_update = function(l758, i759, f760) {
    if (M3.list_p(l758) !== false) {
      var if_res353 = M3.rvoid();
    } else {
      var if_res353 = M3.raise_argument_error($rjs_core.Symbol.make("list-update"), "list?", 0, l758, i759, f760);
    }
    if_res353;
    if (M3.exact_nonnegative_integer_p(i759) !== false) {
      var if_res354 = M3.rvoid();
    } else {
      var if_res354 = M3.raise_argument_error($rjs_core.Symbol.make("list-update"), "exact-nonnegative-integer?", 1, l758, i759, f760);
    }
    if_res354;
    if (M3.procedure_p(f760) !== false) {
      var if_res355 = M3.procedure_arity_includes_p(f760, 1);
    } else {
      var if_res355 = false;
    }
    if (if_res355 !== false) {
      var if_res356 = M3.rvoid();
    } else {
      var if_res356 = M3.raise_argument_error($rjs_core.Symbol.make("list-update"), "(-> any/c any/c)", 2, l758, i759, f760);
    }
    if_res356;
    if (M3.zero_p(i759) !== false) {
      var if_res357 = M3.cons(f760(M3.car(l758)), M3.cdr(l758));
    } else {
      var if_res357 = M3.cons(M3.car(l758), list_update(M3.cdr(l758), M3.sub1(i759), f760));
    }
    return if_res357;
  };
  var list_set = function(l761, k762, v763) {
    if (M3.list_p(l761) !== false) {
      var if_res358 = M3.rvoid();
    } else {
      var if_res358 = M3.raise_argument_error($rjs_core.Symbol.make("list-set"), "list?", 0, l761, k762, v763);
    }
    if_res358;
    if (M3.exact_nonnegative_integer_p(k762) !== false) {
      var if_res359 = M3.rvoid();
    } else {
      var if_res359 = M3.raise_argument_error($rjs_core.Symbol.make("list-set"), "exact-nonnegative-integer?", 1, l761, k762, v763);
    }
    if_res359;
    return list_update(l761, k762, function(_764) {
      return v763;
    });
  };
  var drop_times_ = function(list765, n766) {
    if (M3.zero_p(n766) !== false) {
      var if_res361 = list765;
    } else {
      if (M3.pair_p(list765) !== false) {
        var if_res360 = drop_times_(M3.cdr(list765), M3.sub1(n766));
      } else {
        var if_res360 = false;
      }
      var if_res361 = if_res360;
    }
    return if_res361;
  };
  var too_large = function(who767, list768, n769) {
    if (M3.list_p(list768) !== false) {
      var if_res363 = "index is too large for list";
    } else {
      var if_res363 = "index reaches a non-pair";
    }
    if (M3.list_p(list768) !== false) {
      var if_res362 = "list";
    } else {
      var if_res362 = "in";
    }
    return M3.raise_arguments_error(who767, if_res363, "index", n769, if_res362, list768);
  };
  var take = function(list0770, n0771) {
    if (M3.exact_nonnegative_integer_p(n0771) !== false) {
      var if_res364 = M3.rvoid();
    } else {
      var if_res364 = M3.raise_argument_error($rjs_core.Symbol.make("take"), "exact-nonnegative-integer?", 1, list0770, n0771);
    }
    if_res364;
    var loop772 = function(list773, n774) {
      if (M3.zero_p(n774) !== false) {
        var if_res366 = $rjs_core.Pair.Empty;
      } else {
        if (M3.pair_p(list773) !== false) {
          var if_res365 = M3.cons(M3.car(list773), loop772(M3.cdr(list773), M3.sub1(n774)));
        } else {
          var if_res365 = too_large($rjs_core.Symbol.make("take"), list0770, n0771);
        }
        var if_res366 = if_res365;
      }
      return if_res366;
    };
    return loop772(list0770, n0771);
  };
  var drop = function(list775, n776) {
    if (M3.exact_nonnegative_integer_p(n776) !== false) {
      var if_res367 = M3.rvoid();
    } else {
      var if_res367 = M3.raise_argument_error($rjs_core.Symbol.make("drop"), "exact-nonnegative-integer?", 1, list775, n776);
    }
    if_res367;
    var or_part777 = drop_times_(list775, n776);
    if (or_part777 !== false) {
      var if_res368 = or_part777;
    } else {
      var if_res368 = too_large($rjs_core.Symbol.make("drop"), list775, n776);
    }
    return if_res368;
  };
  var split_at = function(list0778, n0779) {
    if (M3.exact_nonnegative_integer_p(n0779) !== false) {
      var if_res369 = M3.rvoid();
    } else {
      var if_res369 = M3.raise_argument_error($rjs_core.Symbol.make("split-at"), "exact-nonnegative-integer?", 1, list0778, n0779);
    }
    if_res369;
    var loop780 = function(list781, n782, pfx783) {
      if (M3.zero_p(n782) !== false) {
        var if_res371 = M3.values(M8.alt_reverse(pfx783), list781);
      } else {
        if (M3.pair_p(list781) !== false) {
          var if_res370 = loop780(M3.cdr(list781), M3.sub1(n782), M3.cons(M3.car(list781), pfx783));
        } else {
          var if_res370 = too_large($rjs_core.Symbol.make("split-at"), list0778, n0779);
        }
        var if_res371 = if_res370;
      }
      return if_res371;
    };
    return loop780(list0778, n0779, $rjs_core.Pair.Empty);
  };
  var takef = function(list784, pred785) {
    if (M3.procedure_p(pred785) !== false) {
      var if_res372 = M3.rvoid();
    } else {
      var if_res372 = M3.raise_argument_error($rjs_core.Symbol.make("takef"), "procedure?", 1, list784, pred785);
    }
    if_res372;
    var loop786 = function(list787) {
      if (M3.pair_p(list787) !== false) {
        var x788 = M3.car(list787);
        if (pred785(x788) !== false) {
          var if_res373 = M3.cons(x788, loop786(M3.cdr(list787)));
        } else {
          var if_res373 = $rjs_core.Pair.Empty;
        }
        var if_res374 = if_res373;
      } else {
        var if_res374 = $rjs_core.Pair.Empty;
      }
      return if_res374;
    };
    return loop786(list784);
  };
  var dropf = function(list789, pred790) {
    if (M3.procedure_p(pred790) !== false) {
      var if_res375 = M3.rvoid();
    } else {
      var if_res375 = M3.raise_argument_error($rjs_core.Symbol.make("dropf"), "procedure?", 1, list789, pred790);
    }
    if_res375;
    var loop791 = function(list792) {
      if (M3.pair_p(list792) !== false) {
        var if_res376 = pred790(M3.car(list792));
      } else {
        var if_res376 = false;
      }
      if (if_res376 !== false) {
        var if_res377 = loop791(M3.cdr(list792));
      } else {
        var if_res377 = list792;
      }
      return if_res377;
    };
    return loop791(list789);
  };
  var splitf_at = function(list793, pred794) {
    if (M3.procedure_p(pred794) !== false) {
      var if_res378 = M3.rvoid();
    } else {
      var if_res378 = M3.raise_argument_error($rjs_core.Symbol.make("splitf-at"), "procedure?", 1, list793, pred794);
    }
    if_res378;
    var loop795 = function(list796, pfx797) {
      if (M3.pair_p(list796) !== false) {
        var if_res379 = pred794(M3.car(list796));
      } else {
        var if_res379 = false;
      }
      if (if_res379 !== false) {
        var if_res380 = loop795(M3.cdr(list796), M3.cons(M3.car(list796), pfx797));
      } else {
        var if_res380 = M3.values(M8.alt_reverse(pfx797), list796);
      }
      return if_res380;
    };
    return loop795(list793, $rjs_core.Pair.Empty);
  };
  var take_right = function(list798, n799) {
    if (M3.exact_nonnegative_integer_p(n799) !== false) {
      var if_res381 = M3.rvoid();
    } else {
      var if_res381 = M3.raise_argument_error($rjs_core.Symbol.make("take-right"), "exact-nonnegative-integer?", 1, list798, n799);
    }
    if_res381;
    var loop800 = function(list801, lead802) {
      if (M3.pair_p(lead802) !== false) {
        var if_res383 = loop800(M3.cdr(list801), M3.cdr(lead802));
      } else {
        var if_res383 = list801;
      }
      return if_res383;
    };
    var or_part803 = drop_times_(list798, n799);
    if (or_part803 !== false) {
      var if_res382 = or_part803;
    } else {
      var if_res382 = too_large($rjs_core.Symbol.make("take-right"), list798, n799);
    }
    return loop800(list798, if_res382);
  };
  var drop_right = function(list804, n805) {
    if (M3.exact_nonnegative_integer_p(n805) !== false) {
      var if_res384 = M3.rvoid();
    } else {
      var if_res384 = M3.raise_argument_error($rjs_core.Symbol.make("drop-right"), "exact-nonnegative-integer?", 1, list804, n805);
    }
    if_res384;
    var loop806 = function(list807, lead808) {
      if (M3.pair_p(lead808) !== false) {
        var if_res386 = M3.cons(M3.car(list807), loop806(M3.cdr(list807), M3.cdr(lead808)));
      } else {
        var if_res386 = $rjs_core.Pair.Empty;
      }
      return if_res386;
    };
    var or_part809 = drop_times_(list804, n805);
    if (or_part809 !== false) {
      var if_res385 = or_part809;
    } else {
      var if_res385 = too_large($rjs_core.Symbol.make("drop-right"), list804, n805);
    }
    return loop806(list804, if_res385);
  };
  var split_at_right = function(list810, n811) {
    if (M3.exact_nonnegative_integer_p(n811) !== false) {
      var if_res387 = M3.rvoid();
    } else {
      var if_res387 = M3.raise_argument_error($rjs_core.Symbol.make("split-at-right"), "exact-nonnegative-integer?", 1, list810, n811);
    }
    if_res387;
    var loop812 = function(list813, lead814, pfx815) {
      if (M3.pair_p(lead814) !== false) {
        var if_res389 = loop812(M3.cdr(list813), M3.cdr(lead814), M3.cons(M3.car(list813), pfx815));
      } else {
        var if_res389 = M3.values(M8.alt_reverse(pfx815), list813);
      }
      return if_res389;
    };
    var or_part816 = drop_times_(list810, n811);
    if (or_part816 !== false) {
      var if_res388 = or_part816;
    } else {
      var if_res388 = too_large($rjs_core.Symbol.make("split-at-right"), list810, n811);
    }
    return loop812(list810, if_res388, $rjs_core.Pair.Empty);
  };
  var count_from_right = function(who817, list818, pred819) {
    if (M3.procedure_p(pred819) !== false) {
      var if_res390 = M3.rvoid();
    } else {
      var if_res390 = M3.raise_argument_error(who817, "procedure?", 0, list818, pred819);
    }
    if_res390;
    var loop820 = function(list821, rev822, n823) {
      if (M3.pair_p(list821) !== false) {
        var if_res393 = loop820(M3.cdr(list821), M3.cons(M3.car(list821), rev822), M3.add1(n823));
      } else {
        var loop824 = function(n825, list826) {
          if (M3.pair_p(list826) !== false) {
            var if_res391 = pred819(M3.car(list826));
          } else {
            var if_res391 = false;
          }
          if (if_res391 !== false) {
            var if_res392 = loop824(M3.sub1(n825), M3.cdr(list826));
          } else {
            var if_res392 = n825;
          }
          return if_res392;
        };
        var if_res393 = loop824(n823, rev822);
      }
      return if_res393;
    };
    return loop820(list818, $rjs_core.Pair.Empty, 0);
  };
  var takef_right = function(list827, pred828) {
    return drop(list827, count_from_right($rjs_core.Symbol.make("takef-right"), list827, pred828));
  };
  var dropf_right = function(list829, pred830) {
    return take(list829, count_from_right($rjs_core.Symbol.make("dropf-right"), list829, pred830));
  };
  var splitf_at_right = function(list831, pred832) {
    return split_at(list831, count_from_right($rjs_core.Symbol.make("splitf-at-right"), list831, pred832));
  };
  var list_prefix_p5833 = function(ls3834, rs4835, same_p1836, same_p2837) {
    var ls838 = ls3834;
    var rs839 = rs4835;
    if (same_p2837 !== false) {
      var if_res394 = same_p1836;
    } else {
      var if_res394 = M3.equal_p;
    }
    var same_p840 = if_res394;
    if (M3.list_p(ls838) !== false) {
      var if_res395 = M3.rvoid();
    } else {
      var if_res395 = M3.raise_argument_error($rjs_core.Symbol.make("list-prefix?"), "list?", 0, ls838, rs839);
    }
    if_res395;
    if (M3.list_p(rs839) !== false) {
      var if_res396 = M3.rvoid();
    } else {
      var if_res396 = M3.raise_argument_error($rjs_core.Symbol.make("list-prefix?"), "list?", 1, ls838, rs839);
    }
    if_res396;
    if (M3.procedure_p(same_p840) !== false) {
      var if_res397 = M3.procedure_arity_includes_p(same_p840, 2);
    } else {
      var if_res397 = false;
    }
    if (if_res397 !== false) {
      var if_res398 = M3.rvoid();
    } else {
      var if_res398 = M3.raise_argument_error($rjs_core.Symbol.make("list-prefix?"), "(any/c any/c . -> . any/c)", 2, ls838, rs839, same_p840);
    }
    if_res398;
    var or_part841 = M3.null_p(ls838);
    if (or_part841 !== false) {
      var if_res401 = or_part841;
    } else {
      if (M3.pair_p(rs839) !== false) {
        if (same_p840(M3.car(ls838), M3.car(rs839)) !== false) {
          var if_res399 = list_prefix_p(M3.cdr(ls838), M3.cdr(rs839));
        } else {
          var if_res399 = false;
        }
        var if_res400 = if_res399;
      } else {
        var if_res400 = false;
      }
      var if_res401 = if_res400;
    }
    return if_res401;
  };
  var cl402 = function(ls842, rs843) {
    return list_prefix_p5833(ls842, rs843, false, false);
  };
  var cl403 = function(ls844, rs845, same_p1846) {
    return list_prefix_p5833(ls844, rs845, same_p1846, true);
  };
  var list_prefix_p = $rjs_core.attachProcedureArity(function() {
    var fixed_lam404 = {
      '2': cl402,
      '3': cl403
    }[arguments.length];
    if (fixed_lam404 !== undefined !== false) {
      return fixed_lam404.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var internal_split_common_prefix = function(as847, bs848, same_p849, keep_prefix_p850, name851) {
    if (M3.list_p(as847) !== false) {
      var if_res405 = M3.rvoid();
    } else {
      var if_res405 = M3.raise_argument_error(name851, "list?", 0, as847, bs848);
    }
    if_res405;
    if (M3.list_p(bs848) !== false) {
      var if_res406 = M3.rvoid();
    } else {
      var if_res406 = M3.raise_argument_error(name851, "list?", 1, as847, bs848);
    }
    if_res406;
    if (M3.procedure_p(same_p849) !== false) {
      var if_res407 = M3.procedure_arity_includes_p(same_p849, 2);
    } else {
      var if_res407 = false;
    }
    if (if_res407 !== false) {
      var if_res408 = M3.rvoid();
    } else {
      var if_res408 = M3.raise_argument_error(name851, "(any/c any/c . -> . any/c)", 2, as847, bs848, same_p849);
    }
    if_res408;
    var loop852 = function(as853, bs854) {
      if (M3.pair_p(as853) !== false) {
        if (M3.pair_p(bs854) !== false) {
          var if_res409 = same_p849(M3.car(as853), M3.car(bs854));
        } else {
          var if_res409 = false;
        }
        var if_res410 = if_res409;
      } else {
        var if_res410 = false;
      }
      if (if_res410 !== false) {
        var let_result411 = loop852(M3.cdr(as853), M3.cdr(bs854));
        var prefix855 = let_result411.getAt(0);
        var atail856 = let_result411.getAt(1);
        var btail857 = let_result411.getAt(2);
        if (keep_prefix_p850 !== false) {
          var if_res412 = M3.cons(M3.car(as853), prefix855);
        } else {
          var if_res412 = false;
        }
        var if_res413 = M3.values(if_res412, atail856, btail857);
      } else {
        var if_res413 = M3.values(M3.rnull, as853, bs854);
      }
      return if_res413;
    };
    return loop852(as847, bs848);
  };
  var split_common_prefix11858 = function(as9859, bs10860, same_p7861, same_p8862) {
    var as863 = as9859;
    var bs864 = bs10860;
    if (same_p8862 !== false) {
      var if_res414 = same_p7861;
    } else {
      var if_res414 = M3.equal_p;
    }
    var same_p865 = if_res414;
    return internal_split_common_prefix(as863, bs864, same_p865, true, $rjs_core.Symbol.make("split-common-prefix"));
  };
  var cl415 = function(as866, bs867) {
    return split_common_prefix11858(as866, bs867, false, false);
  };
  var cl416 = function(as868, bs869, same_p7870) {
    return split_common_prefix11858(as868, bs869, same_p7870, true);
  };
  var split_common_prefix = $rjs_core.attachProcedureArity(function() {
    var fixed_lam417 = {
      '2': cl415,
      '3': cl416
    }[arguments.length];
    if (fixed_lam417 !== undefined !== false) {
      return fixed_lam417.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var take_common_prefix17871 = function(as15872, bs16873, same_p13874, same_p14875) {
    var as876 = as15872;
    var bs877 = bs16873;
    if (same_p14875 !== false) {
      var if_res418 = same_p13874;
    } else {
      var if_res418 = M3.equal_p;
    }
    var same_p878 = if_res418;
    var let_result419 = internal_split_common_prefix(as876, bs877, same_p878, true, $rjs_core.Symbol.make("take-common-prefix"));
    var prefix879 = let_result419.getAt(0);
    var atail880 = let_result419.getAt(1);
    var btail881 = let_result419.getAt(2);
    return prefix879;
  };
  var cl420 = function(as882, bs883) {
    return take_common_prefix17871(as882, bs883, false, false);
  };
  var cl421 = function(as884, bs885, same_p13886) {
    return take_common_prefix17871(as884, bs885, same_p13886, true);
  };
  var take_common_prefix = $rjs_core.attachProcedureArity(function() {
    var fixed_lam422 = {
      '2': cl420,
      '3': cl421
    }[arguments.length];
    if (fixed_lam422 !== undefined !== false) {
      return fixed_lam422.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var drop_common_prefix23887 = function(as21888, bs22889, same_p19890, same_p20891) {
    var as892 = as21888;
    var bs893 = bs22889;
    if (same_p20891 !== false) {
      var if_res423 = same_p19890;
    } else {
      var if_res423 = M3.equal_p;
    }
    var same_p894 = if_res423;
    var let_result424 = internal_split_common_prefix(as892, bs893, same_p894, false, $rjs_core.Symbol.make("drop-common-prefix"));
    var prefix895 = let_result424.getAt(0);
    var atail896 = let_result424.getAt(1);
    var btail897 = let_result424.getAt(2);
    return M3.values(atail896, btail897);
  };
  var cl425 = function(as898, bs899) {
    return drop_common_prefix23887(as898, bs899, false, false);
  };
  var cl426 = function(as900, bs901, same_p19902) {
    return drop_common_prefix23887(as900, bs901, same_p19902, true);
  };
  var drop_common_prefix = $rjs_core.attachProcedureArity(function() {
    var fixed_lam427 = {
      '2': cl425,
      '3': cl426
    }[arguments.length];
    if (fixed_lam427 !== undefined !== false) {
      return fixed_lam427.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var cl428 = function(ls903) {
    return M3.apply(M3.append, ls903);
  };
  var cl429 = function(l1904, l2905) {
    return M3.apply(M3.append, l1904, l2905);
  };
  var cl430 = function(l1906, l2907, l3908) {
    return M3.apply(M3.append, l1906, l2907, l3908);
  };
  var cl431 = function(l1909, l2910, l3911, l4912) {
    return M3.apply(M3.append, l1909, l2910, l3911, l4912);
  };
  var cl432 = $rjs_core.attachProcedureArity(function(l913) {
    var lss914 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 1));
    return M3.apply(M2.new_apply_proc, M3.append, l913, lss914);
  });
  var append_times_ = $rjs_core.attachProcedureArity(function() {
    var fixed_lam433 = {
      '1': cl428,
      '2': cl429,
      '3': cl430,
      '4': cl431
    }[arguments.length];
    if (fixed_lam433 !== undefined !== false) {
      return fixed_lam433.apply(null, arguments);
    } else {
      if (M3._gt__eq_(cl432.length, 1) !== false) {
        var if_res434 = cl432.apply(null, arguments);
      } else {
        var if_res434 = M3.error("case-lambda: invalid case");
      }
      return if_res434;
    }
  }, [M3.make_arity_at_least(1)]);
  var flatten = function(orig_sexp915) {
    var loop916 = function(sexp917, acc918) {
      if (M3.null_p(sexp917) !== false) {
        var if_res436 = acc918;
      } else {
        if (M3.pair_p(sexp917) !== false) {
          var if_res435 = loop916(M3.car(sexp917), loop916(M3.cdr(sexp917), acc918));
        } else {
          var if_res435 = M3.cons(sexp917, acc918);
        }
        var if_res436 = if_res435;
      }
      return if_res436;
    };
    return loop916(orig_sexp915, M3.rnull);
  };
  var add_between35 = function(after_last28919, after_last32920, before_first26921, before_first30922, before_last27923, before_last31924, splice_p25925, splice_p29926, l33927, x34928) {
    var l929 = l33927;
    var x930 = x34928;
    if (splice_p29926 !== false) {
      var if_res437 = splice_p25925;
    } else {
      var if_res437 = false;
    }
    var splice_p931 = if_res437;
    if (before_first30922 !== false) {
      var if_res438 = before_first26921;
    } else {
      var if_res438 = $rjs_core.Pair.Empty;
    }
    var before_first932 = if_res438;
    if (before_last31924 !== false) {
      var if_res439 = before_last27923;
    } else {
      var if_res439 = x930;
    }
    var before_last933 = if_res439;
    if (after_last32920 !== false) {
      var if_res440 = after_last28919;
    } else {
      var if_res440 = $rjs_core.Pair.Empty;
    }
    var after_last934 = if_res440;
    if (M3.list_p(l929) !== false) {
      var if_res441 = M3.rvoid();
    } else {
      var if_res441 = M3.raise_argument_error($rjs_core.Symbol.make("add-between"), "list?", 0, l929, x930);
    }
    if_res441;
    if (splice_p931 !== false) {
      var check_list935 = function(x936, which937) {
        if (M3.list_p(x936) !== false) {
          var if_res442 = M3.rvoid();
        } else {
          var if_res442 = M3.raise_arguments_error($rjs_core.Symbol.make("add-between"), M3.string_append("list needed in splicing mode", which937), "given", x936, "given list...", l929);
        }
        return if_res442;
      };
      check_list935(x930, "");
      check_list935(before_first932, " for #:before-first");
      check_list935(before_last933, " for #:before-last");
      var if_res444 = check_list935(after_last934, " for #:after-last");
    } else {
      var check_not_given938 = function(x939, which940) {
        if (M3.eq_p($rjs_core.Pair.Empty, x939) !== false) {
          var if_res443 = M3.rvoid();
        } else {
          var if_res443 = M3.raise_arguments_error($rjs_core.Symbol.make("add-between"), M3.string_append(which940, " can only be used in splicing mode"), "given", x939, "given list...", l929);
        }
        return if_res443;
      };
      check_not_given938(before_first932, "#:before-first");
      var if_res444 = check_not_given938(after_last934, "#:after-last");
    }
    if_res444;
    var or_part941 = M3.null_p(l929);
    if (or_part941 !== false) {
      var if_res445 = or_part941;
    } else {
      var if_res445 = M3.null_p(M3.cdr(l929));
    }
    if (if_res445 !== false) {
      if (splice_p931 !== false) {
        var if_res446 = M3.append(before_first932, l929, after_last934);
      } else {
        var if_res446 = l929;
      }
      var if_res451 = if_res446;
    } else {
      if (splice_p931 !== false) {
        var x942 = M8.alt_reverse(x930);
        var loop944 = function(i945, l946, r947) {
          if (M3.pair_p(l946) !== false) {
            var if_res447 = loop944(M3.car(l946), M3.cdr(l946), M3.cons(i945, M3.append(x942, r947)));
          } else {
            var if_res447 = M3.cons(i945, M3.append(M8.alt_reverse(before_last933), r947));
          }
          return if_res447;
        };
        var r943 = loop944(M3.cadr(l929), M3.cddr(l929), $rjs_core.Pair.Empty);
        var r948 = M8.alt_reverse(M3.append(M8.alt_reverse(after_last934), r943));
        var r949 = M4.__rjs_quoted__.qq_append(before_first932, M3.list_times_(M3.car(l929), r948));
        var if_res450 = r949;
      } else {
        var temp449 = M3.car(l929);
        var loop950 = function(i951, l952, r953) {
          if (M3.pair_p(l952) !== false) {
            var if_res448 = loop950(M3.car(l952), M3.cdr(l952), M3.cons(i951, M3.cons(x930, r953)));
          } else {
            var if_res448 = M3.cons(i951, M3.cons(before_last933, r953));
          }
          return if_res448;
        };
        var if_res450 = M3.cons(temp449, M8.alt_reverse(loop950(M3.cadr(l929), M3.cddr(l929), $rjs_core.Pair.Empty)));
      }
      var if_res451 = if_res450;
    }
    return if_res451;
  };
  var unpack36 = function(given_kws954, given_args955, l33956, x34957) {
    if (M3.pair_p(given_kws954) !== false) {
      var if_res452 = M3.eq_p($rjs_core.Keyword.make('#:after-last'), M3.car(given_kws954));
    } else {
      var if_res452 = false;
    }
    var after_last32958 = if_res452;
    if (after_last32958 !== false) {
      var if_res453 = M3.car(given_args955);
    } else {
      var if_res453 = M3.rvoid();
    }
    var after_last28959 = if_res453;
    if (after_last32958 !== false) {
      var if_res454 = M3.cdr(given_kws954);
    } else {
      var if_res454 = given_kws954;
    }
    var given_kws960 = if_res454;
    if (after_last32958 !== false) {
      var if_res455 = M3.cdr(given_args955);
    } else {
      var if_res455 = given_args955;
    }
    var given_args961 = if_res455;
    if (M3.pair_p(given_kws960) !== false) {
      var if_res456 = M3.eq_p($rjs_core.Keyword.make('#:before-first'), M3.car(given_kws960));
    } else {
      var if_res456 = false;
    }
    var before_first30962 = if_res456;
    if (before_first30962 !== false) {
      var if_res457 = M3.car(given_args961);
    } else {
      var if_res457 = M3.rvoid();
    }
    var before_first26963 = if_res457;
    if (before_first30962 !== false) {
      var if_res458 = M3.cdr(given_kws960);
    } else {
      var if_res458 = given_kws960;
    }
    var given_kws964 = if_res458;
    if (before_first30962 !== false) {
      var if_res459 = M3.cdr(given_args961);
    } else {
      var if_res459 = given_args961;
    }
    var given_args965 = if_res459;
    if (M3.pair_p(given_kws964) !== false) {
      var if_res460 = M3.eq_p($rjs_core.Keyword.make('#:before-last'), M3.car(given_kws964));
    } else {
      var if_res460 = false;
    }
    var before_last31966 = if_res460;
    if (before_last31966 !== false) {
      var if_res461 = M3.car(given_args965);
    } else {
      var if_res461 = M3.rvoid();
    }
    var before_last27967 = if_res461;
    if (before_last31966 !== false) {
      var if_res462 = M3.cdr(given_kws964);
    } else {
      var if_res462 = given_kws964;
    }
    var given_kws968 = if_res462;
    if (before_last31966 !== false) {
      var if_res463 = M3.cdr(given_args965);
    } else {
      var if_res463 = given_args965;
    }
    var given_args969 = if_res463;
    var splice_p29970 = M3.pair_p(given_kws968);
    if (splice_p29970 !== false) {
      var if_res464 = M3.car(given_args969);
    } else {
      var if_res464 = M3.rvoid();
    }
    var splice_p25971 = if_res464;
    return add_between35(after_last28959, after_last32958, before_first26963, before_first30962, before_last27967, before_last31966, splice_p25971, splice_p29970, l33956, x34957);
  };
  var cl467 = function(given_kws982, given_args983, l984, x985) {
    return unpack36(given_kws982, given_args983, l984, x985);
  };
  var temp469 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam468 = {'4': cl467}[arguments.length];
    if (fixed_lam468 !== undefined !== false) {
      return fixed_lam468.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl465 = function(l987, x988) {
    return unpack36(M3.rnull, M3.rnull, l987, x988);
  };
  var add_between986 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam466 = {'2': cl465}[arguments.length];
    if (fixed_lam466 !== undefined !== false) {
      return fixed_lam466.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2]);
  var add_between37 = M7.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws972, given_argc973) {
    if (M3._eq_(given_argc973, 4) !== false) {
      var l1974 = given_kws972;
      if (M3.null_p(l1974) !== false) {
        var if_res471 = l1974;
      } else {
        if (M3.eq_p(M3.car(l1974), $rjs_core.Keyword.make('#:after-last')) !== false) {
          var if_res470 = M3.cdr(l1974);
        } else {
          var if_res470 = l1974;
        }
        var if_res471 = if_res470;
      }
      var l1975 = if_res471;
      var l1976 = l1975;
      if (M3.null_p(l1976) !== false) {
        var if_res473 = l1976;
      } else {
        if (M3.eq_p(M3.car(l1976), $rjs_core.Keyword.make('#:before-first')) !== false) {
          var if_res472 = M3.cdr(l1976);
        } else {
          var if_res472 = l1976;
        }
        var if_res473 = if_res472;
      }
      var l1977 = if_res473;
      var l1978 = l1977;
      if (M3.null_p(l1978) !== false) {
        var if_res475 = l1978;
      } else {
        if (M3.eq_p(M3.car(l1978), $rjs_core.Keyword.make('#:before-last')) !== false) {
          var if_res474 = M3.cdr(l1978);
        } else {
          var if_res474 = l1978;
        }
        var if_res475 = if_res474;
      }
      var l1979 = if_res475;
      var l1980 = l1979;
      if (M3.null_p(l1980) !== false) {
        var if_res477 = l1980;
      } else {
        if (M3.eq_p(M3.car(l1980), $rjs_core.Keyword.make('#:splice?')) !== false) {
          var if_res476 = M3.cdr(l1980);
        } else {
          var if_res476 = l1980;
        }
        var if_res477 = if_res476;
      }
      var l1981 = if_res477;
      var if_res478 = M3.null_p(l1981);
    } else {
      var if_res478 = false;
    }
    return if_res478;
  }, temp469, M3.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:after-last'), $rjs_core.Keyword.make('#:before-first'), $rjs_core.Keyword.make('#:before-last'), $rjs_core.Keyword.make('#:splice?')), add_between986);
  var remove_duplicates43 = function(key38989, key39990, l42991, _eq__p40992, _eq__p41993) {
    var l994 = l42991;
    if (_eq__p41993 !== false) {
      var if_res479 = _eq__p40992;
    } else {
      var if_res479 = M3.equal_p;
    }
    var _eq__p995 = if_res479;
    if (key39990 !== false) {
      var if_res480 = key38989;
    } else {
      var if_res480 = false;
    }
    var key996 = if_res480;
    if (M3.list_p(l994) !== false) {
      var if_res481 = M3.rvoid();
    } else {
      var if_res481 = M3.raise_argument_error($rjs_core.Symbol.make("remove-duplicates"), "list?", l994);
    }
    if_res481;
    var len997 = M3.length(l994);
    if (M3._lt__eq_(len997, 1) !== false) {
      var if_res485 = true;
    } else {
      if (M3._lt__eq_(len997, 40) !== false) {
        var if_res484 = false;
      } else {
        if (M3.eq_p(_eq__p995, M3.eq_p) !== false) {
          var if_res483 = M3.make_hasheq();
        } else {
          if (M3.eq_p(_eq__p995, M3.equal_p) !== false) {
            var if_res482 = M3.make_hash();
          } else {
            var if_res482 = false;
          }
          var if_res483 = if_res482;
        }
        var if_res484 = if_res483;
      }
      var if_res485 = if_res484;
    }
    var h998 = if_res485;
    var tmp999 = h998;
    if (M3.equal_p(tmp999, true) !== false) {
      var if_res504 = l994;
    } else {
      if (M3.equal_p(tmp999, false) !== false) {
        var or_part1001 = key996;
        if (or_part1001 !== false) {
          var if_res486 = or_part1001;
        } else {
          var if_res486 = function(x1002) {
            return x1002;
          };
        }
        var key1000 = if_res486;
        if (M3.eq_p(_eq__p995, M3.equal_p) !== false) {
          var loop1003 = function(l1004, seen1005) {
            if (M3.null_p(l1004) !== false) {
              var if_res488 = l1004;
            } else {
              var x1006 = M3.car(l1004);
              var k1007 = key1000(x1006);
              var l1008 = M3.cdr(l1004);
              if (M5.member(k1007, seen1005) !== false) {
                var if_res487 = loop1003(l1008, seen1005);
              } else {
                var if_res487 = M3.cons(x1006, loop1003(l1008, M3.cons(k1007, seen1005)));
              }
              var if_res488 = if_res487;
            }
            return if_res488;
          };
          var if_res497 = loop1003(l994, M3.rnull);
        } else {
          if (M3.eq_p(_eq__p995, M3.eq_p) !== false) {
            var loop1009 = function(l1010, seen1011) {
              if (M3.null_p(l1010) !== false) {
                var if_res490 = l1010;
              } else {
                var x1012 = M3.car(l1010);
                var k1013 = key1000(x1012);
                var l1014 = M3.cdr(l1010);
                if (M5.memq(k1013, seen1011) !== false) {
                  var if_res489 = loop1009(l1014, seen1011);
                } else {
                  var if_res489 = M3.cons(x1012, loop1009(l1014, M3.cons(k1013, seen1011)));
                }
                var if_res490 = if_res489;
              }
              return if_res490;
            };
            var if_res496 = loop1009(l994, M3.rnull);
          } else {
            if (M3.eq_p(_eq__p995, M3.eqv_p) !== false) {
              var loop1015 = function(l1016, seen1017) {
                if (M3.null_p(l1016) !== false) {
                  var if_res492 = l1016;
                } else {
                  var x1018 = M3.car(l1016);
                  var k1019 = key1000(x1018);
                  var l1020 = M3.cdr(l1016);
                  if (M5.memv(k1019, seen1017) !== false) {
                    var if_res491 = loop1015(l1020, seen1017);
                  } else {
                    var if_res491 = M3.cons(x1018, loop1015(l1020, M3.cons(k1019, seen1017)));
                  }
                  var if_res492 = if_res491;
                }
                return if_res492;
              };
              var if_res495 = loop1015(l994, M3.rnull);
            } else {
              var loop1021 = function(l1022, seen1023) {
                if (M3.null_p(l1022) !== false) {
                  var if_res494 = l1022;
                } else {
                  var x1024 = M3.car(l1022);
                  var k1025 = key1000(x1024);
                  var l1026 = M3.cdr(l1022);
                  if ((function(x1027, seen1028) {
                    return M1.ormap(function(y1029) {
                      return _eq__p995(x1027, y1029);
                    }, seen1028);
                  })(k1025, seen1023) !== false) {
                    var if_res493 = loop1021(l1026, seen1023);
                  } else {
                    var if_res493 = M3.cons(x1024, loop1021(l1026, M3.cons(k1025, seen1023)));
                  }
                  var if_res494 = if_res493;
                }
                return if_res494;
              };
              var if_res495 = loop1021(l994, M3.rnull);
            }
            var if_res496 = if_res495;
          }
          var if_res497 = if_res496;
        }
        var if_res503 = if_res497;
      } else {
        if (key996 !== false) {
          var loop1030 = function(l1031) {
            if (M3.null_p(l1031) !== false) {
              var if_res499 = l1031;
            } else {
              var x1032 = M3.car(l1031);
              var k1033 = key996(x1032);
              var l1034 = M3.cdr(l1031);
              if (M3.hash_ref(h998, k1033, false) !== false) {
                var if_res498 = loop1030(l1034);
              } else {
                M3.hash_set_bang_(h998, k1033, true);
                var if_res498 = M3.cons(x1032, loop1030(l1034));
              }
              var if_res499 = if_res498;
            }
            return if_res499;
          };
          var if_res502 = loop1030(l994);
        } else {
          var loop1035 = function(l1036) {
            if (M3.null_p(l1036) !== false) {
              var if_res501 = l1036;
            } else {
              var x1037 = M3.car(l1036);
              var k1038 = x1037;
              var l1039 = M3.cdr(l1036);
              if (M3.hash_ref(h998, k1038, false) !== false) {
                var if_res500 = loop1035(l1039);
              } else {
                M3.hash_set_bang_(h998, k1038, true);
                var if_res500 = M3.cons(x1037, loop1035(l1039));
              }
              var if_res501 = if_res500;
            }
            return if_res501;
          };
          var if_res502 = loop1035(l994);
        }
        var if_res503 = if_res502;
      }
      var if_res504 = if_res503;
    }
    return if_res504;
  };
  var unpack44 = function(given_kws1040, given_args1041, l421042, _eq__p401043, _eq__p411044) {
    var key391045 = M3.pair_p(given_kws1040);
    if (key391045 !== false) {
      var if_res505 = M3.car(given_args1041);
    } else {
      var if_res505 = M3.rvoid();
    }
    var key381046 = if_res505;
    return remove_duplicates43(key381046, key391045, l421042, _eq__p401043, _eq__p411044);
  };
  var cl509 = function(given_kws1051, given_args1052, l1053) {
    return unpack44(given_kws1051, given_args1052, l1053, false, false);
  };
  var cl510 = function(given_kws1054, given_args1055, l1056, _eq__p401057) {
    return unpack44(given_kws1054, given_args1055, l1056, _eq__p401057, true);
  };
  var temp512 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam511 = {
      '3': cl509,
      '4': cl510
    }[arguments.length];
    if (fixed_lam511 !== undefined !== false) {
      return fixed_lam511.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [3, 4]);
  var cl506 = function(l1059) {
    return unpack44(M3.rnull, M3.rnull, l1059, false, false);
  };
  var cl507 = function(l1060, _eq__p401061) {
    return unpack44(M3.rnull, M3.rnull, l1060, _eq__p401061, true);
  };
  var remove_duplicates1058 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam508 = {
      '1': cl506,
      '2': cl507
    }[arguments.length];
    if (fixed_lam508 !== undefined !== false) {
      return fixed_lam508.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var remove_duplicates45 = M7.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws1047, given_argc1048) {
    if (M3._gt__eq_(given_argc1048, 3) !== false) {
      var if_res513 = M3._lt__eq_(given_argc1048, 4);
    } else {
      var if_res513 = false;
    }
    if (if_res513 !== false) {
      var l11049 = given_kws1047;
      if (M3.null_p(l11049) !== false) {
        var if_res515 = l11049;
      } else {
        if (M3.eq_p(M3.car(l11049), $rjs_core.Keyword.make('#:key')) !== false) {
          var if_res514 = M3.cdr(l11049);
        } else {
          var if_res514 = l11049;
        }
        var if_res515 = if_res514;
      }
      var l11050 = if_res515;
      var if_res516 = M3.null_p(l11050);
    } else {
      var if_res516 = false;
    }
    return if_res516;
  }, temp512, M3.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), remove_duplicates1058);
  var check_duplicates51 = function(key461062, key471063, items501064, same_p481065, same_p491066) {
    var items1067 = items501064;
    if (same_p491066 !== false) {
      var if_res517 = same_p481065;
    } else {
      var if_res517 = M3.equal_p;
    }
    var same_p1068 = if_res517;
    if (key471063 !== false) {
      var if_res518 = key461062;
    } else {
      var if_res518 = M3.values;
    }
    var key1069 = if_res518;
    if (M3.list_p(items1067) !== false) {
      var if_res519 = M3.rvoid();
    } else {
      var if_res519 = M3.raise_argument_error($rjs_core.Symbol.make("check-duplicates"), "list?", 0, items1067);
    }
    if_res519;
    if (M3.procedure_p(key1069) !== false) {
      var if_res520 = M3.procedure_arity_includes_p(key1069, 1);
    } else {
      var if_res520 = false;
    }
    if (if_res520 !== false) {
      var if_res521 = M3.rvoid();
    } else {
      var if_res521 = M3.raise_argument_error($rjs_core.Symbol.make("check-duplicates"), "(-> any/c any/c)", key1069);
    }
    if_res521;
    if (M3.eq_p(same_p1068, M3.equal_p) !== false) {
      var if_res526 = check_duplicates_by_t(items1067, key1069, M3.make_hash());
    } else {
      if (M3.eq_p(same_p1068, M3.eq_p) !== false) {
        var if_res525 = check_duplicates_by_t(items1067, key1069, M3.make_hasheq());
      } else {
        if (M3.eq_p(same_p1068, M3.eqv_p) !== false) {
          var if_res524 = check_duplicates_by_t(items1067, key1069, M3.make_hasheqv());
        } else {
          if (M3.procedure_p(same_p1068) !== false) {
            var if_res522 = M3.procedure_arity_includes_p(same_p1068, 2);
          } else {
            var if_res522 = false;
          }
          if (if_res522 !== false) {
            var if_res523 = M3.rvoid();
          } else {
            var if_res523 = M3.raise_argument_error($rjs_core.Symbol.make("check-duplicates"), "(any/c any/c . -> . any/c)", 1, items1067, same_p1068);
          }
          if_res523;
          var if_res524 = check_duplicates_by_list(items1067, key1069, same_p1068);
        }
        var if_res525 = if_res524;
      }
      var if_res526 = if_res525;
    }
    return if_res526;
  };
  var unpack52 = function(given_kws1070, given_args1071, items501072, same_p481073, same_p491074) {
    var key471075 = M3.pair_p(given_kws1070);
    if (key471075 !== false) {
      var if_res527 = M3.car(given_args1071);
    } else {
      var if_res527 = M3.rvoid();
    }
    var key461076 = if_res527;
    return check_duplicates51(key461076, key471075, items501072, same_p481073, same_p491074);
  };
  var cl531 = function(given_kws1081, given_args1082, items1083) {
    return unpack52(given_kws1081, given_args1082, items1083, false, false);
  };
  var cl532 = function(given_kws1084, given_args1085, items1086, same_p481087) {
    return unpack52(given_kws1084, given_args1085, items1086, same_p481087, true);
  };
  var temp534 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam533 = {
      '3': cl531,
      '4': cl532
    }[arguments.length];
    if (fixed_lam533 !== undefined !== false) {
      return fixed_lam533.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [3, 4]);
  var cl528 = function(items1089) {
    return unpack52(M3.rnull, M3.rnull, items1089, false, false);
  };
  var cl529 = function(items1090, same_p481091) {
    return unpack52(M3.rnull, M3.rnull, items1090, same_p481091, true);
  };
  var check_duplicates1088 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam530 = {
      '1': cl528,
      '2': cl529
    }[arguments.length];
    if (fixed_lam530 !== undefined !== false) {
      return fixed_lam530.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var check_duplicates53 = M7.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws1077, given_argc1078) {
    if (M3._gt__eq_(given_argc1078, 3) !== false) {
      var if_res535 = M3._lt__eq_(given_argc1078, 4);
    } else {
      var if_res535 = false;
    }
    if (if_res535 !== false) {
      var l11079 = given_kws1077;
      if (M3.null_p(l11079) !== false) {
        var if_res537 = l11079;
      } else {
        if (M3.eq_p(M3.car(l11079), $rjs_core.Keyword.make('#:key')) !== false) {
          var if_res536 = M3.cdr(l11079);
        } else {
          var if_res536 = l11079;
        }
        var if_res537 = if_res536;
      }
      var l11080 = if_res537;
      var if_res538 = M3.null_p(l11080);
    } else {
      var if_res538 = false;
    }
    return if_res538;
  }, temp534, M3.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), check_duplicates1088);
  var check_duplicates_by_t = function(items1092, key1093, table1094) {
    var loop1095 = function(items1096) {
      if (M3.pair_p(items1096) !== false) {
        var key_item1097 = key1093(M3.car(items1096));
        if (M3.hash_ref(table1094, key_item1097, false) !== false) {
          var if_res539 = M3.car(items1096);
        } else {
          M3.hash_set_bang_(table1094, key_item1097, true);
          var if_res539 = loop1095(M3.cdr(items1096));
        }
        var if_res540 = if_res539;
      } else {
        var if_res540 = false;
      }
      return if_res540;
    };
    return loop1095(items1092);
  };
  var check_duplicates_by_list = function(items1098, key1099, same_p1100) {
    var loop1101 = function(items1102, sofar1103) {
      if (M3.pair_p(items1102) !== false) {
        var key_item1104 = key1099(M3.car(items1102));
        var lst1105 = sofar1103;
        if (M3.list_p(lst1105) !== false) {
          var if_res541 = M3.rvoid();
        } else {
          var if_res541 = M10.__rjs_quoted__.in_list(lst1105);
        }
        if_res541;
        var for_loop1106 = function(result1107, lst1108) {
          if (M3.pair_p(lst1108) !== false) {
            var prev1109 = M9.unsafe_car(lst1108);
            var rest1110 = M9.unsafe_cdr(lst1108);
            if (true !== false) {
              var result1112 = result1107;
              var result1113 = same_p1100(key_item1104, prev1109);
              var result1111 = M3.values(result1113);
              if (true !== false) {
                var if_res542 = M3.not($rjs_core.attachProcedureArity(function() {
                  var x1114 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
                  return result1111;
                })(prev1109));
              } else {
                var if_res542 = false;
              }
              if (if_res542 !== false) {
                var if_res543 = M3.not(false);
              } else {
                var if_res543 = false;
              }
              if (if_res543 !== false) {
                var if_res544 = for_loop1106(result1111, rest1110);
              } else {
                var if_res544 = result1111;
              }
              var if_res545 = if_res544;
            } else {
              var if_res545 = result1107;
            }
            var if_res546 = if_res545;
          } else {
            var if_res546 = result1107;
          }
          return if_res546;
        };
        if (for_loop1106(false, lst1105) !== false) {
          var if_res547 = M3.car(items1102);
        } else {
          var if_res547 = loop1101(M3.cdr(items1102), M3.cons(key_item1104, sofar1103));
        }
        var if_res548 = if_res547;
      } else {
        var if_res548 = false;
      }
      return if_res548;
    };
    return loop1101(items1098, M3.rnull);
  };
  var check_filter_arguments = function(who1115, f1116, l1117, ls1118) {
    if (M3.procedure_p(f1116) !== false) {
      var if_res549 = M3.rvoid();
    } else {
      var if_res549 = M3.apply(M3.raise_argument_error, who1115, "procedure?", 0, f1116, l1117, ls1118);
    }
    if_res549;
    if (M3.procedure_arity_includes_p(f1116, M3.add1(M3.length(ls1118))) !== false) {
      var if_res550 = M3.rvoid();
    } else {
      var if_res550 = M3.raise_arguments_error(who1115, "mismatch between procedure arity and argument count", "procedure", f1116, "expected arity", M3.add1(M3.length(ls1118)));
    }
    if_res550;
    if (M3.list_p(l1117) !== false) {
      var if_res551 = M1.andmap(M3.list_p, ls1118);
    } else {
      var if_res551 = false;
    }
    if (if_res551 !== false) {
      var if_res571 = M3.rvoid();
    } else {
      var let_result552 = M10.__rjs_quoted__.make_sequence($rjs_core.Pair.makeList($rjs_core.Symbol.make("x")), M3.cons(l1117, ls1118));
      var pos__gt_vals1119 = let_result552.getAt(0);
      var pos_pre_inc1120 = let_result552.getAt(1);
      var pos_next1121 = let_result552.getAt(2);
      var init1122 = let_result552.getAt(3);
      var pos_cont_p1123 = let_result552.getAt(4);
      var val_cont_p1124 = let_result552.getAt(5);
      var all_cont_p1125 = let_result552.getAt(6);
      var start1126 = 0;
      if (M3.rvoid() !== false) {
        if (M3.exact_nonnegative_integer_p(start1126) !== false) {
          var if_res553 = M3.rvoid();
        } else {
          var if_res553 = M10.__rjs_quoted__.in_naturals(start1126);
        }
        var if_res554 = if_res553;
      } else {
        var if_res554 = false;
      }
      if_res554;
      var for_loop1127 = function(pos1128, pos1129) {
        if (pos_cont_p1123 !== false) {
          var if_res555 = pos_cont_p1123(pos1128);
        } else {
          var if_res555 = true;
        }
        if (if_res555 !== false) {
          var if_res556 = true;
        } else {
          var if_res556 = false;
        }
        if (if_res556 !== false) {
          var x1134 = pos__gt_vals1119(pos1128);
          if (all_cont_p1125 !== false) {
            var if_res557 = function(pos1135) {
              return all_cont_p1125(pos1135, x1134);
            };
          } else {
            var if_res557 = false;
          }
          var let_result558 = M3.values(x1134, if_res557);
          var x1130 = let_result558.getAt(0);
          var all_cont_p_by_pos1131 = let_result558.getAt(1);
          if (pos_pre_inc1120 !== false) {
            var if_res559 = pos_pre_inc1120(pos1128);
          } else {
            var if_res559 = pos1128;
          }
          var pos1132 = if_res559;
          var i1133 = pos1129;
          if (val_cont_p1124 !== false) {
            var if_res560 = val_cont_p1124(x1130);
          } else {
            var if_res560 = true;
          }
          if (if_res560 !== false) {
            var if_res561 = true;
          } else {
            var if_res561 = false;
          }
          if (if_res561 !== false) {
            if (M3.list_p(x1130) !== false) {
              var if_res562 = M3.rvoid();
            } else {
              var if_res562 = M3.apply(M3.raise_argument_error, who1115, "list?", M3.add1(i1133), f1116, l1117, ls1118);
            }
            if_res562;
            var let_result563 = M3.values();
            var let_result564 = M3.values();
            if (all_cont_p_by_pos1131 !== false) {
              var if_res565 = all_cont_p_by_pos1131(pos1132);
            } else {
              var if_res565 = true;
            }
            if (if_res565 !== false) {
              var if_res566 = true;
            } else {
              var if_res566 = false;
            }
            if (if_res566 !== false) {
              var if_res567 = M3.not(false);
            } else {
              var if_res567 = false;
            }
            if (if_res567 !== false) {
              var if_res568 = for_loop1127(pos_next1121(pos1132), pos1129 + 1);
            } else {
              var if_res568 = M3.values();
            }
            var if_res569 = if_res568;
          } else {
            var if_res569 = M3.values();
          }
          var if_res570 = if_res569;
        } else {
          var if_res570 = M3.values();
        }
        return if_res570;
      };
      for_loop1127(init1122, start1126);
      var if_res571 = M3.rvoid();
    }
    return if_res571;
  };
  var filter_map = $rjs_core.attachProcedureArity(function(f1136, l1137) {
    var ls1138 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    check_filter_arguments($rjs_core.Symbol.make("filter-map"), f1136, l1137, ls1138);
    if (M3.pair_p(ls1138) !== false) {
      var len1139 = M3.length(l1137);
      if (M1.andmap(function(l1140) {
        return M3._eq_(len1139, M3.length(l1140));
      }, ls1138) !== false) {
        var loop1141 = function(l1142, ls1143) {
          if (M3.null_p(l1142) !== false) {
            var if_res573 = M3.rnull;
          } else {
            var x1144 = M3.apply(f1136, M3.car(l1142), M1.map(M3.car, ls1143));
            if (x1144 !== false) {
              var if_res572 = M3.cons(x1144, loop1141(M3.cdr(l1142), M1.map(M3.cdr, ls1143)));
            } else {
              var if_res572 = loop1141(M3.cdr(l1142), M1.map(M3.cdr, ls1143));
            }
            var if_res573 = if_res572;
          }
          return if_res573;
        };
        var if_res574 = loop1141(l1137, ls1138);
      } else {
        var if_res574 = M3.raise_arguments_error($rjs_core.Symbol.make("filter-map"), "all lists must have same size");
      }
      var if_res577 = if_res574;
    } else {
      var loop1145 = function(l1146) {
        if (M3.null_p(l1146) !== false) {
          var if_res576 = M3.rnull;
        } else {
          var x1147 = f1136(M3.car(l1146));
          if (x1147 !== false) {
            var if_res575 = M3.cons(x1147, loop1145(M3.cdr(l1146)));
          } else {
            var if_res575 = loop1145(M3.cdr(l1146));
          }
          var if_res576 = if_res575;
        }
        return if_res576;
      };
      var if_res577 = loop1145(l1137);
    }
    return if_res577;
  });
  var count = $rjs_core.attachProcedureArity(function(f1148, l1149) {
    var ls1150 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    check_filter_arguments($rjs_core.Symbol.make("count"), f1148, l1149, ls1150);
    if (M3.pair_p(ls1150) !== false) {
      var len1151 = M3.length(l1149);
      if (M1.andmap(function(l1152) {
        return M3._eq_(len1151, M3.length(l1152));
      }, ls1150) !== false) {
        var loop1153 = function(l1154, ls1155, c1156) {
          if (M3.null_p(l1154) !== false) {
            var if_res581 = c1156;
          } else {
            var temp580 = M3.cdr(l1154);
            var temp579 = M1.map(M3.cdr, ls1155);
            if (M3.apply(f1148, M3.car(l1154), M1.map(M3.car, ls1155)) !== false) {
              var if_res578 = M3.add1(c1156);
            } else {
              var if_res578 = c1156;
            }
            var if_res581 = loop1153(temp580, temp579, if_res578);
          }
          return if_res581;
        };
        var if_res582 = loop1153(l1149, ls1150, 0);
      } else {
        var if_res582 = M3.raise_arguments_error($rjs_core.Symbol.make("count"), "all lists must have same size");
      }
      var if_res586 = if_res582;
    } else {
      var loop1157 = function(l1158, c1159) {
        if (M3.null_p(l1158) !== false) {
          var if_res585 = c1159;
        } else {
          var temp584 = M3.cdr(l1158);
          if (f1148(M3.car(l1158)) !== false) {
            var if_res583 = M3.add1(c1159);
          } else {
            var if_res583 = c1159;
          }
          var if_res585 = loop1157(temp584, if_res583);
        }
        return if_res585;
      };
      var if_res586 = loop1157(l1149, 0);
    }
    return if_res586;
  });
  var partition = function(pred1160, l1161) {
    if (M3.procedure_p(pred1160) !== false) {
      var if_res587 = M3.procedure_arity_includes_p(pred1160, 1);
    } else {
      var if_res587 = false;
    }
    if (if_res587 !== false) {
      var if_res588 = M3.rvoid();
    } else {
      var if_res588 = M3.raise_argument_error($rjs_core.Symbol.make("partition"), "(any/c . -> . any/c)", 0, pred1160, l1161);
    }
    if_res588;
    if (M3.list_p(l1161) !== false) {
      var if_res589 = M3.rvoid();
    } else {
      var if_res589 = M3.raise_argument_error($rjs_core.Symbol.make("partition"), "list?", 1, pred1160, l1161);
    }
    if_res589;
    var loop1162 = function(l1163, i1164, o1165) {
      if (M3.null_p(l1163) !== false) {
        var if_res591 = M3.values(M8.alt_reverse(i1164), M8.alt_reverse(o1165));
      } else {
        var x1166 = M3.car(l1163);
        var l1167 = M3.cdr(l1163);
        if (pred1160(x1166) !== false) {
          var if_res590 = loop1162(l1167, M3.cons(x1166, i1164), o1165);
        } else {
          var if_res590 = loop1162(l1167, i1164, M3.cons(x1166, o1165));
        }
        var if_res591 = if_res590;
      }
      return if_res591;
    };
    return loop1162(l1161, $rjs_core.Pair.Empty, $rjs_core.Pair.Empty);
  };
  var cl592 = function(end1169) {
    var start1170 = 0;
    var end1171 = end1169;
    var inc1172 = 1;
    if (M3.real_p(start1170) !== false) {
      if (M3.real_p(end1171) !== false) {
        var if_res596 = M3.real_p(inc1172);
      } else {
        var if_res596 = false;
      }
      var if_res597 = if_res596;
    } else {
      var if_res597 = false;
    }
    if (if_res597 !== false) {
      var if_res598 = M3.rvoid();
    } else {
      var if_res598 = M10.__rjs_quoted__.in_range(start1170, end1171, inc1172);
    }
    if_res598;
    var for_loop1173 = function(pos1174) {
      if (M3._lt_(pos1174, end1171) !== false) {
        var i1175 = pos1174;
        if (true !== false) {
          var post_guard_var1176 = function() {
            return true;
          };
          var elem1177 = i1175;
          if (false !== false) {
            var if_res600 = M3.rnull;
          } else {
            if (post_guard_var1176() !== false) {
              var if_res599 = for_loop1173(pos1174 + inc1172);
            } else {
              var if_res599 = M3.rnull;
            }
            var if_res600 = if_res599;
          }
          var result1178 = if_res600;
          var if_res601 = M3.cons(elem1177, result1178);
        } else {
          var if_res601 = M3.rnull;
        }
        var if_res602 = if_res601;
      } else {
        var if_res602 = M3.rnull;
      }
      return if_res602;
    };
    return for_loop1173(start1170);
  };
  var cl593 = function(start1179, end1180) {
    var start1181 = start1179;
    var end1182 = end1180;
    var inc1183 = 1;
    if (M3.real_p(start1181) !== false) {
      if (M3.real_p(end1182) !== false) {
        var if_res603 = M3.real_p(inc1183);
      } else {
        var if_res603 = false;
      }
      var if_res604 = if_res603;
    } else {
      var if_res604 = false;
    }
    if (if_res604 !== false) {
      var if_res605 = M3.rvoid();
    } else {
      var if_res605 = M10.__rjs_quoted__.in_range(start1181, end1182, inc1183);
    }
    if_res605;
    var for_loop1184 = function(pos1185) {
      if (M3._lt_(pos1185, end1182) !== false) {
        var i1186 = pos1185;
        if (true !== false) {
          var post_guard_var1187 = function() {
            return true;
          };
          var elem1188 = i1186;
          if (false !== false) {
            var if_res607 = M3.rnull;
          } else {
            if (post_guard_var1187() !== false) {
              var if_res606 = for_loop1184(pos1185 + inc1183);
            } else {
              var if_res606 = M3.rnull;
            }
            var if_res607 = if_res606;
          }
          var result1189 = if_res607;
          var if_res608 = M3.cons(elem1188, result1189);
        } else {
          var if_res608 = M3.rnull;
        }
        var if_res609 = if_res608;
      } else {
        var if_res609 = M3.rnull;
      }
      return if_res609;
    };
    return for_loop1184(start1181);
  };
  var cl594 = function(start1190, end1191, step1192) {
    var start1193 = start1190;
    var end1194 = end1191;
    var inc1195 = step1192;
    if (M3.real_p(start1193) !== false) {
      if (M3.real_p(end1194) !== false) {
        var if_res610 = M3.real_p(inc1195);
      } else {
        var if_res610 = false;
      }
      var if_res611 = if_res610;
    } else {
      var if_res611 = false;
    }
    if (if_res611 !== false) {
      var if_res612 = M3.rvoid();
    } else {
      var if_res612 = M10.__rjs_quoted__.in_range(start1193, end1194, inc1195);
    }
    if_res612;
    var for_loop1196 = function(pos1197) {
      if (M3._gt__eq_(step1192, 0) !== false) {
        var if_res613 = M3._lt_(pos1197, end1194);
      } else {
        var if_res613 = M3._gt_(pos1197, end1194);
      }
      if (if_res613 !== false) {
        var i1198 = pos1197;
        if (true !== false) {
          var post_guard_var1199 = function() {
            return true;
          };
          var elem1200 = i1198;
          if (false !== false) {
            var if_res615 = M3.rnull;
          } else {
            if (post_guard_var1199() !== false) {
              var if_res614 = for_loop1196(pos1197 + inc1195);
            } else {
              var if_res614 = M3.rnull;
            }
            var if_res615 = if_res614;
          }
          var result1201 = if_res615;
          var if_res616 = M3.cons(elem1200, result1201);
        } else {
          var if_res616 = M3.rnull;
        }
        var if_res617 = if_res616;
      } else {
        var if_res617 = M3.rnull;
      }
      return if_res617;
    };
    return for_loop1196(start1193);
  };
  var range1168 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam595 = {
      '1': cl592,
      '2': cl593,
      '3': cl594
    }[arguments.length];
    if (fixed_lam595 !== undefined !== false) {
      return fixed_lam595.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [1, 2, 3]);
  var range_proc = range1168;
  var cl618 = function(f1202, l1203) {
    return M3.apply(M3.append, M1.map(f1202, l1203));
  };
  var cl619 = function(f1204, l11205, l21206) {
    return M3.apply(M3.append, M1.map(f1204, l11205, l21206));
  };
  var cl620 = $rjs_core.attachProcedureArity(function(f1207, l1208) {
    var ls1209 = $rjs_core.Pair.listFromArray($rjs_core.argumentsSlice($rjs_core.argumentsToArray(arguments), 2));
    return M3.apply(M3.append, M3.apply(M1.map, f1207, l1208, ls1209));
  });
  var append_map = $rjs_core.attachProcedureArity(function() {
    var fixed_lam621 = {
      '2': cl618,
      '3': cl619
    }[arguments.length];
    if (fixed_lam621 !== undefined !== false) {
      return fixed_lam621.apply(null, arguments);
    } else {
      if (M3._gt__eq_(cl620.length, 1) !== false) {
        var if_res622 = cl620.apply(null, arguments);
      } else {
        var if_res622 = M3.error("case-lambda: invalid case");
      }
      return if_res622;
    }
  }, [M3.make_arity_at_least(2)]);
  var filter_not = function(f1210, list1211) {
    if (M3.procedure_p(f1210) !== false) {
      var if_res623 = M3.procedure_arity_includes_p(f1210, 1);
    } else {
      var if_res623 = false;
    }
    if (if_res623 !== false) {
      var if_res624 = M3.rvoid();
    } else {
      var if_res624 = M3.raise_argument_error($rjs_core.Symbol.make("filter-not"), "(any/c . -> . any/c)", 0, f1210, list1211);
    }
    if_res624;
    if (M3.list_p(list1211) !== false) {
      var if_res625 = M3.rvoid();
    } else {
      var if_res625 = M3.raise_argument_error($rjs_core.Symbol.make("filter-not"), "list?", 1, f1210, list1211);
    }
    if_res625;
    var loop1212 = function(l1213, result1214) {
      if (M3.null_p(l1213) !== false) {
        var if_res628 = M8.alt_reverse(result1214);
      } else {
        var temp627 = M3.cdr(l1213);
        if (f1210(M3.car(l1213)) !== false) {
          var if_res626 = result1214;
        } else {
          var if_res626 = M3.cons(M3.car(l1213), result1214);
        }
        var if_res628 = loop1212(temp627, if_res626);
      }
      return if_res628;
    };
    return loop1212(list1211, M3.rnull);
  };
  var shuffle = function(l1215) {
    var a1216 = M3.make_vector(M3.length(l1215));
    var lst1217 = l1215;
    var start1218 = 0;
    if (M3.list_p(lst1217) !== false) {
      var if_res629 = M3.rvoid();
    } else {
      var if_res629 = M10.__rjs_quoted__.in_list(lst1217);
    }
    if_res629;
    if (M3.exact_nonnegative_integer_p(start1218) !== false) {
      var if_res630 = M3.rvoid();
    } else {
      var if_res630 = M10.__rjs_quoted__.in_naturals(start1218);
    }
    if_res630;
    var for_loop1219 = function(lst1220, pos1221) {
      if (M3.pair_p(lst1220) !== false) {
        var if_res631 = true;
      } else {
        var if_res631 = false;
      }
      if (if_res631 !== false) {
        var x1222 = M9.unsafe_car(lst1220);
        var rest1223 = M9.unsafe_cdr(lst1220);
        var i1224 = pos1221;
        if (true !== false) {
          var if_res632 = true;
        } else {
          var if_res632 = false;
        }
        if (if_res632 !== false) {
          var j1225 = M2.random(M3.add1(i1224));
          if (M3._eq_(j1225, i1224) !== false) {
            var if_res633 = M3.rvoid();
          } else {
            var if_res633 = M3.vector_set_bang_(a1216, i1224, M3.vector_ref(a1216, j1225));
          }
          if_res633;
          M3.vector_set_bang_(a1216, j1225, x1222);
          var let_result634 = M3.values();
          var let_result635 = M3.values();
          if (true !== false) {
            if (true !== false) {
              var if_res636 = M3.not(false);
            } else {
              var if_res636 = false;
            }
            var if_res637 = if_res636;
          } else {
            var if_res637 = false;
          }
          if (if_res637 !== false) {
            var if_res638 = for_loop1219(rest1223, pos1221 + 1);
          } else {
            var if_res638 = M3.values();
          }
          var if_res639 = if_res638;
        } else {
          var if_res639 = M3.values();
        }
        var if_res640 = if_res639;
      } else {
        var if_res640 = M3.values();
      }
      return if_res640;
    };
    for_loop1219(lst1217, start1218);
    M3.rvoid();
    return M3.vector__gt_list(a1216);
  };
  var combinations571226 = function(l561227, k541228, k551229) {
    var l1230 = l561227;
    if (k551229 !== false) {
      var if_res641 = k541228;
    } else {
      var if_res641 = false;
    }
    var k1231 = if_res641;
    var let_result642 = M10.__rjs_quoted__.make_sequence($rjs_core.Pair.makeList($rjs_core.Symbol.make("x")), in_combinations(l1230, k1231));
    var pos__gt_vals1232 = let_result642.getAt(0);
    var pos_pre_inc1233 = let_result642.getAt(1);
    var pos_next1234 = let_result642.getAt(2);
    var init1235 = let_result642.getAt(3);
    var pos_cont_p1236 = let_result642.getAt(4);
    var val_cont_p1237 = let_result642.getAt(5);
    var all_cont_p1238 = let_result642.getAt(6);
    M3.rvoid();
    var for_loop1239 = function(pos1240) {
      if (pos_cont_p1236 !== false) {
        var if_res643 = pos_cont_p1236(pos1240);
      } else {
        var if_res643 = true;
      }
      if (if_res643 !== false) {
        var x1244 = pos__gt_vals1232(pos1240);
        if (all_cont_p1238 !== false) {
          var if_res644 = function(pos1245) {
            return all_cont_p1238(pos1245, x1244);
          };
        } else {
          var if_res644 = false;
        }
        var let_result645 = M3.values(x1244, if_res644);
        var x1241 = let_result645.getAt(0);
        var all_cont_p_by_pos1242 = let_result645.getAt(1);
        if (pos_pre_inc1233 !== false) {
          var if_res646 = pos_pre_inc1233(pos1240);
        } else {
          var if_res646 = pos1240;
        }
        var pos1243 = if_res646;
        if (val_cont_p1237 !== false) {
          var if_res647 = val_cont_p1237(x1241);
        } else {
          var if_res647 = true;
        }
        if (if_res647 !== false) {
          var post_guard_var1246 = function() {
            if (all_cont_p_by_pos1242 !== false) {
              var if_res648 = all_cont_p_by_pos1242(pos1243);
            } else {
              var if_res648 = true;
            }
            return if_res648;
          };
          var elem1247 = x1241;
          if (false !== false) {
            var if_res650 = M3.rnull;
          } else {
            if (post_guard_var1246() !== false) {
              var if_res649 = for_loop1239(pos_next1234(pos1243));
            } else {
              var if_res649 = M3.rnull;
            }
            var if_res650 = if_res649;
          }
          var result1248 = if_res650;
          var if_res651 = M3.cons(elem1247, result1248);
        } else {
          var if_res651 = M3.rnull;
        }
        var if_res652 = if_res651;
      } else {
        var if_res652 = M3.rnull;
      }
      return if_res652;
    };
    return for_loop1239(init1235);
  };
  var cl653 = function(l1249) {
    return combinations571226(l1249, false, false);
  };
  var cl654 = function(l1250, k541251) {
    return combinations571226(l1250, k541251, true);
  };
  var combinations = $rjs_core.attachProcedureArity(function() {
    var fixed_lam655 = {
      '1': cl653,
      '2': cl654
    }[arguments.length];
    if (fixed_lam655 !== undefined !== false) {
      return fixed_lam655.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var in_combinations621252 = function(l611253, k591254, k601255) {
    var l1256 = l611253;
    if (k601255 !== false) {
      var if_res656 = k591254;
    } else {
      var if_res656 = false;
    }
    var k1257 = if_res656;
    if (M3.list_p(l1256) !== false) {
      var if_res657 = M3.rvoid();
    } else {
      var if_res657 = M3.raise_argument_error($rjs_core.Symbol.make("in-combinations"), "list?", 0, l1256);
    }
    if_res657;
    var let_result658 = M3.values();
    if (k1257 !== false) {
      var if_res659 = M3.not(M3.exact_nonnegative_integer_p(k1257));
    } else {
      var if_res659 = false;
    }
    if (if_res659 !== false) {
      var if_res660 = M3.raise_argument_error($rjs_core.Symbol.make("in-combinations"), "exact-nonnegative-integer?", 1, l1256, k1257);
    } else {
      var if_res660 = M3.rvoid();
    }
    if_res660;
    var let_result661 = M3.values();
    var v1258 = M3.list__gt_vector(l1256);
    var N1259 = M3.vector_length(v1258);
    var N_11260 = N1259 - 1;
    var vector_ref_by_bits1261 = function(v1262, b1263) {
      var start1264 = N_11260;
      var end1265 = -1;
      var inc1266 = -1;
      if (M3.real_p(start1264) !== false) {
        if (M3.real_p(end1265) !== false) {
          var if_res662 = M3.real_p(inc1266);
        } else {
          var if_res662 = false;
        }
        var if_res663 = if_res662;
      } else {
        var if_res663 = false;
      }
      if (if_res663 !== false) {
        var if_res664 = M3.rvoid();
      } else {
        var if_res664 = M10.__rjs_quoted__.in_range(start1264, end1265, inc1266);
      }
      if_res664;
      var for_loop1267 = function(acc1268, pos1269) {
        if (M3._gt_(pos1269, end1265) !== false) {
          var i1270 = pos1269;
          if (true !== false) {
            var acc1272 = acc1268;
            if (M3.bitwise_bit_set_p(b1263, i1270) !== false) {
              var if_res665 = M3.cons(M3.vector_ref(v1262, i1270), acc1272);
            } else {
              var if_res665 = acc1272;
            }
            var acc1273 = if_res665;
            var acc1271 = M3.values(acc1273);
            if (true !== false) {
              var if_res666 = M3.not(false);
            } else {
              var if_res666 = false;
            }
            if (if_res666 !== false) {
              var if_res667 = for_loop1267(acc1271, pos1269 + inc1266);
            } else {
              var if_res667 = acc1271;
            }
            var if_res668 = if_res667;
          } else {
            var if_res668 = acc1268;
          }
          var if_res669 = if_res668;
        } else {
          var if_res669 = acc1268;
        }
        return if_res669;
      };
      return for_loop1267($rjs_core.Pair.Empty, start1264);
    };
    if (M3.not(k1257) !== false) {
      var if_res672 = M3.values(0, M3.expt(2, N1259) - 1, M3.add1);
    } else {
      if (M3._lt_(N1259, k1257) !== false) {
        var if_res671 = M3.values(1, 0, M3.values);
      } else {
        var first1277 = M3.expt(2, k1257) - 1;
        if (M3.zero_p(first1277) !== false) {
          var if_res670 = M3.add1;
        } else {
          var if_res670 = function(n1279) {
            var u1280 = M3.bitwise_and(n1279, M3._(n1279));
            var v1281 = u1280 + n1279;
            return v1281 + M3.arithmetic_shift(M3.quotient(M3.bitwise_xor(v1281, n1279), u1280), -2);
          };
        }
        var gospers_hack1278 = if_res670;
        var if_res671 = M3.values(first1277, M3.arithmetic_shift(first1277, N1259 - k1257), gospers_hack1278);
      }
      var if_res672 = if_res671;
    }
    var let_result673 = if_res672;
    var first1274 = let_result673.getAt(0);
    var last1275 = let_result673.getAt(1);
    var incr1276 = let_result673.getAt(2);
    var curr_box1283 = M3.box(first1274);
    var gen_next1282 = function() {
      var curr1284 = M3.unbox(curr_box1283);
      if (M3._lt__eq_(curr1284, last1275) !== false) {
        var begin_res674 = vector_ref_by_bits1261(v1258, curr1284);
        M3.set_box_bang_(curr_box1283, incr1276(curr1284));
        var if_res675 = begin_res674;
      } else {
        var if_res675 = false;
      }
      return if_res675;
    };
    return M10.__rjs_quoted__.in_producer(gen_next1282, false);
  };
  var cl676 = function(l1285) {
    return in_combinations621252(l1285, false, false);
  };
  var cl677 = function(l1286, k591287) {
    return in_combinations621252(l1286, k591287, true);
  };
  var in_combinations = $rjs_core.attachProcedureArity(function() {
    var fixed_lam678 = {
      '1': cl676,
      '2': cl677
    }[arguments.length];
    if (fixed_lam678 !== undefined !== false) {
      return fixed_lam678.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var swap_plus_flip = function(l1288, i1289, j1290) {
    var tmp1291 = j1290;
    if (M3.equal_p(tmp1291, 0) !== false) {
      var if_res686 = M3.list_times_(M3.cadr(l1288), M3.car(l1288), M3.cddr(l1288));
    } else {
      if (M3.equal_p(tmp1291, 1) !== false) {
        var a1292 = M3.car(l1288);
        var b1293 = M3.cadr(l1288);
        var c1294 = M3.caddr(l1288);
        var l1295 = M3.cdddr(l1288);
        var tmp1296 = i1289;
        if (M3.equal_p(tmp1296, 0) !== false) {
          var if_res679 = M3.list_times_(b1293, c1294, a1292, l1295);
        } else {
          var if_res679 = M3.list_times_(c1294, a1292, b1293, l1295);
        }
        var if_res685 = if_res679;
      } else {
        if (M3.equal_p(tmp1291, 2) !== false) {
          var a1297 = M3.car(l1288);
          var b1298 = M3.cadr(l1288);
          var c1299 = M3.caddr(l1288);
          var d1300 = M3.cadddr(l1288);
          var l1301 = M3.cddddr(l1288);
          var tmp1302 = i1289;
          if (M3.equal_p(tmp1302, 0) !== false) {
            var if_res681 = M3.list_times_(c1299, b1298, d1300, a1297, l1301);
          } else {
            if (M3.equal_p(tmp1302, 1) !== false) {
              var if_res680 = M3.list_times_(c1299, d1300, a1297, b1298, l1301);
            } else {
              var if_res680 = M3.list_times_(d1300, b1298, a1297, c1299, l1301);
            }
            var if_res681 = if_res680;
          }
          var if_res684 = if_res681;
        } else {
          var loop1303 = function(n1304, l11305, r11306) {
            if (M3._gt_(n1304, 0) !== false) {
              var if_res683 = loop1303(M3.sub1(n1304), M3.cons(M3.car(r11306), l11305), M3.cdr(r11306));
            } else {
              var loop1307 = function(n1308, l21309, r21310) {
                if (M3._gt_(n1308, 0) !== false) {
                  var if_res682 = loop1307(M3.sub1(n1308), M3.cons(M3.car(r21310), l21309), M3.cdr(r21310));
                } else {
                  var if_res682 = M4.__rjs_quoted__.qq_append(l21309, M3.list_times_(M3.car(r21310), M4.__rjs_quoted__.qq_append(l11305, M3.list_times_(M3.car(r11306), M3.cdr(r21310)))));
                }
                return if_res682;
              };
              var if_res683 = loop1307(j1290 - i1289, $rjs_core.Pair.Empty, M3.cdr(r11306));
            }
            return if_res683;
          };
          var if_res684 = loop1303(i1289, $rjs_core.Pair.Empty, l1288);
        }
        var if_res685 = if_res684;
      }
      var if_res686 = if_res685;
    }
    return if_res686;
  };
  var permutations = function(l1311) {
    if (M3.not(M3.list_p(l1311)) !== false) {
      var if_res693 = M3.raise_argument_error($rjs_core.Symbol.make("permutations"), "list?", 0, l1311);
    } else {
      var or_part1312 = M3.null_p(l1311);
      if (or_part1312 !== false) {
        var if_res687 = or_part1312;
      } else {
        var if_res687 = M3.null_p(M3.cdr(l1311));
      }
      if (if_res687 !== false) {
        var if_res692 = M3.list(l1311);
      } else {
        var N1313 = M3.length(l1311) - 2;
        if (M3._gt_(N1313, 254) !== false) {
          var if_res688 = M3.error($rjs_core.Symbol.make("permutations"), "input list too long: ~e", l1311);
        } else {
          var if_res688 = M3.rvoid();
        }
        if_res688;
        var let_result689 = M3.values();
        var c1314 = M3.make_bytes(M3.add1(N1313), 0);
        var loop1315 = function(i1316, acc1317) {
          var ci1318 = M3.bytes_ref(c1314, i1316);
          if (M3._lt__eq_(ci1318, i1316) !== false) {
            M3.bytes_set_bang_(c1314, i1316, M3.add1(ci1318));
            var if_res691 = loop1315(0, M3.cons(swap_plus_flip(M3.car(acc1317), ci1318, i1316), acc1317));
          } else {
            if (M3._lt_(i1316, N1313) !== false) {
              M3.bytes_set_bang_(c1314, i1316, 0);
              var if_res690 = loop1315(M3.add1(i1316), acc1317);
            } else {
              var if_res690 = acc1317;
            }
            var if_res691 = if_res690;
          }
          return if_res691;
        };
        var if_res692 = loop1315(0, M3.list(M8.alt_reverse(l1311)));
      }
      var if_res693 = if_res692;
    }
    return if_res693;
  };
  var in_permutations = function(l1319) {
    if (M3.not(M3.list_p(l1319)) !== false) {
      var if_res702 = M3.raise_argument_error($rjs_core.Symbol.make("in-permutations"), "list?", 0, l1319);
    } else {
      var or_part1320 = M3.null_p(l1319);
      if (or_part1320 !== false) {
        var if_res694 = or_part1320;
      } else {
        var if_res694 = M3.null_p(M3.cdr(l1319));
      }
      if (if_res694 !== false) {
        var if_res701 = M10.__rjs_quoted__.in_value(l1319);
      } else {
        var N1321 = M3.length(l1319) - 2;
        if (M3._gt_(N1321, 254) !== false) {
          var if_res695 = M3.error($rjs_core.Symbol.make("permutations"), "input list too long: ~e", l1319);
        } else {
          var if_res695 = M3.rvoid();
        }
        if_res695;
        var let_result696 = M3.values();
        var c1322 = M3.make_bytes(M3.add1(N1321), 0);
        var i1323 = 0;
        var cur1324 = M8.alt_reverse(l1319);
        var next1325 = function() {
          var r1326 = cur1324;
          var ci1327 = M3.bytes_ref(c1322, i1323);
          if (M3._lt__eq_(ci1327, i1323) !== false) {
            M3.bytes_set_bang_(c1322, i1323, M3.add1(ci1327));
            var begin_res697 = swap_plus_flip(cur1324, ci1327, i1323);
            i1323 = 0;
            var if_res699 = begin_res697;
          } else {
            if (M3._lt_(i1323, N1321) !== false) {
              M3.bytes_set_bang_(c1322, i1323, 0);
              i1323 = M3.add1(i1323);
              var if_res698 = next1325();
            } else {
              var if_res698 = false;
            }
            var if_res699 = if_res698;
          }
          return if_res699;
        };
        var if_res701 = M10.__rjs_quoted__.in_producer(function() {
          var begin_res700 = cur1324;
          cur1324 = next1325();
          return begin_res700;
        }, false);
      }
      var if_res702 = if_res701;
    }
    return if_res702;
  };
  var mk_min = function(cmp1328, name1329, f1330, xs1331) {
    if (M3.procedure_p(f1330) !== false) {
      var if_res703 = M3.procedure_arity_includes_p(f1330, 1);
    } else {
      var if_res703 = false;
    }
    if (if_res703 !== false) {
      var if_res704 = M3.rvoid();
    } else {
      var if_res704 = M3.raise_argument_error(name1329, "(any/c . -> . real?)", 0, f1330, xs1331);
    }
    if_res704;
    if (M3.list_p(xs1331) !== false) {
      var if_res705 = M3.pair_p(xs1331);
    } else {
      var if_res705 = false;
    }
    if (if_res705 !== false) {
      var if_res706 = M3.rvoid();
    } else {
      var if_res706 = M3.raise_argument_error(name1329, "(and/c list? (not/c empty?))", 1, f1330, xs1331);
    }
    if_res706;
    var init_min_var1332 = f1330(M3.car(xs1331));
    if (M3.real_p(init_min_var1332) !== false) {
      var if_res707 = M3.rvoid();
    } else {
      var if_res707 = M3.raise_result_error(name1329, "real?", init_min_var1332);
    }
    if_res707;
    var loop1333 = function(min1334, min_var1335, xs1336) {
      if (M3.null_p(xs1336) !== false) {
        var if_res710 = min1334;
      } else {
        var new_min1337 = f1330(M3.car(xs1336));
        if (M3.real_p(new_min1337) !== false) {
          var if_res708 = M3.rvoid();
        } else {
          var if_res708 = M3.raise_result_error(name1329, "real?", new_min1337);
        }
        if_res708;
        if (cmp1328(new_min1337, min_var1335) !== false) {
          var if_res709 = loop1333(M3.car(xs1336), new_min1337, M3.cdr(xs1336));
        } else {
          var if_res709 = loop1333(min1334, min_var1335, M3.cdr(xs1336));
        }
        var if_res710 = if_res709;
      }
      return if_res710;
    };
    return loop1333(M3.car(xs1331), init_min_var1332, M3.cdr(xs1331));
  };
  var argmin = function(f1338, xs1339) {
    return mk_min(M3._lt_, $rjs_core.Symbol.make("argmin"), f1338, xs1339);
  };
  var argmax = function(f1340, xs1341) {
    return mk_min(M3._gt_, $rjs_core.Symbol.make("argmax"), f1340, xs1341);
  };
  var group_by681342 = function(key661343, l671344, _eq__p641345, _eq__p651346) {
    var key1347 = key661343;
    var l1348 = l671344;
    if (_eq__p651346 !== false) {
      var if_res711 = _eq__p641345;
    } else {
      var if_res711 = M3.equal_p;
    }
    var _eq__p1349 = if_res711;
    if (M3.procedure_p(key1347) !== false) {
      var if_res712 = M3.procedure_arity_includes_p(key1347, 1);
    } else {
      var if_res712 = false;
    }
    if (if_res712 !== false) {
      var if_res713 = M3.rvoid();
    } else {
      var if_res713 = M3.raise_argument_error($rjs_core.Symbol.make("group-by"), "(-> any/c any/c)", 0, key1347, l1348);
    }
    if_res713;
    var let_result714 = M3.values();
    if (M3.procedure_p(_eq__p1349) !== false) {
      var if_res715 = M3.procedure_arity_includes_p(_eq__p1349, 2);
    } else {
      var if_res715 = false;
    }
    if (if_res715 !== false) {
      var if_res716 = M3.rvoid();
    } else {
      var if_res716 = M3.raise_argument_error($rjs_core.Symbol.make("group-by"), "(any/c any/c . -> . any/c)", 2, key1347, l1348, _eq__p1349);
    }
    if_res716;
    var let_result717 = M3.values();
    if (M3.list_p(l1348) !== false) {
      var if_res718 = M3.rvoid();
    } else {
      var if_res718 = M3.raise_argument_error($rjs_core.Symbol.make("group-by"), "list?", 1, key1347, l1348);
    }
    if_res718;
    var let_result719 = M3.values();
    var alist_update1350 = function(al1351, k1352, up1353, fail1354) {
      var loop1355 = function(al1356) {
        if (M3.null_p(al1356) !== false) {
          var if_res721 = M3.list(M3.cons(k1352, up1353($rjs_core.Pair.Empty)));
        } else {
          if (_eq__p1349(M3.car(M3.car(al1356)), k1352) !== false) {
            var if_res720 = M3.cons(M3.cons(k1352, up1353(M3.cdr(M3.car(al1356)))), M3.cdr(al1356));
          } else {
            var if_res720 = M3.cons(M3.car(al1356), loop1355(M3.cdr(al1356)));
          }
          var if_res721 = if_res720;
        }
        return if_res721;
      };
      return loop1355(al1351);
    };
    if (M3.equal_p(_eq__p1349, M3.eq_p) !== false) {
      var if_res724 = M3.values(M3.hasheq(), M0.hash_update);
    } else {
      if (M3.equal_p(_eq__p1349, M3.eqv_p) !== false) {
        var if_res723 = M3.values(M3.hasheqv(), M0.hash_update);
      } else {
        if (M3.equal_p(_eq__p1349, M3.equal_p) !== false) {
          var if_res722 = M3.values(M3.hash(), M0.hash_update);
        } else {
          var if_res722 = M3.values($rjs_core.Pair.Empty, alist_update1350);
        }
        var if_res723 = if_res722;
      }
      var if_res724 = if_res723;
    }
    var let_result725 = if_res724;
    var base1357 = let_result725.getAt(0);
    var update1358 = let_result725.getAt(1);
    var lst1360 = l1348;
    var start1361 = 0;
    if (M3.list_p(lst1360) !== false) {
      var if_res726 = M3.rvoid();
    } else {
      var if_res726 = M10.__rjs_quoted__.in_list(lst1360);
    }
    if_res726;
    if (M3.exact_nonnegative_integer_p(start1361) !== false) {
      var if_res727 = M3.rvoid();
    } else {
      var if_res727 = M10.__rjs_quoted__.in_naturals(start1361);
    }
    if_res727;
    var for_loop1362 = function(res1363, lst1364, pos1365) {
      if (M3.pair_p(lst1364) !== false) {
        var if_res728 = true;
      } else {
        var if_res728 = false;
      }
      if (if_res728 !== false) {
        var elt1366 = M9.unsafe_car(lst1364);
        var rest1367 = M9.unsafe_cdr(lst1364);
        var idx1368 = pos1365;
        if (true !== false) {
          var if_res729 = true;
        } else {
          var if_res729 = false;
        }
        if (if_res729 !== false) {
          var res1370 = res1363;
          var k1372 = key1347(elt1366);
          var v1373 = M3.cons(idx1368, elt1366);
          var res1371 = update1358(res1370, k1372, function(o1374) {
            return M3.cons(v1373, o1374);
          }, $rjs_core.Pair.Empty);
          var res1369 = M3.values(res1371);
          if (true !== false) {
            if (true !== false) {
              var if_res730 = M3.not(false);
            } else {
              var if_res730 = false;
            }
            var if_res731 = if_res730;
          } else {
            var if_res731 = false;
          }
          if (if_res731 !== false) {
            var if_res732 = for_loop1362(res1369, rest1367, pos1365 + 1);
          } else {
            var if_res732 = res1369;
          }
          var if_res733 = if_res732;
        } else {
          var if_res733 = res1363;
        }
        var if_res734 = if_res733;
      } else {
        var if_res734 = res1363;
      }
      return if_res734;
    };
    var classes1359 = for_loop1362(base1357, lst1360, start1361);
    if (M3.list_p(classes1359) !== false) {
      var lst1376 = classes1359;
      if (M3.list_p(lst1376) !== false) {
        var if_res735 = M3.rvoid();
      } else {
        var if_res735 = M10.__rjs_quoted__.in_list(lst1376);
      }
      if_res735;
      var for_loop1377 = function(lst1378) {
        if (M3.pair_p(lst1378) !== false) {
          var p1379 = M9.unsafe_car(lst1378);
          var rest1380 = M9.unsafe_cdr(lst1378);
          if (true !== false) {
            var post_guard_var1381 = function() {
              return true;
            };
            var _dot__dot__dot_ects_by_racket_by_list_dot_rkt__314681383 = M6.__rjs_quoted__.sort9;
            var temp861384 = M3.cdr(p1379);
            var _lt_871385 = M3._lt_;
            var car881386 = M3.car;
            if (M3.variable_reference_constant_p(M6.__rjs_quoted__.sort9) !== false) {
              var if_res736 = M6.__rjs_quoted__.sort7(false, false, car881386, true, temp861384, _lt_871385);
            } else {
              var if_res736 = M3.checked_procedure_check_and_extract(M7.__rjs_quoted__.struct_keyword_procedure, _dot__dot__dot_ects_by_racket_by_list_dot_rkt__314681383, M7.__rjs_quoted__.keyword_procedure_extract, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), 4)($rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), M3.list(car881386), temp861384, _lt_871385);
            }
            var elem1382 = if_res736;
            if (false !== false) {
              var if_res738 = M3.rnull;
            } else {
              if (post_guard_var1381() !== false) {
                var if_res737 = for_loop1377(rest1380);
              } else {
                var if_res737 = M3.rnull;
              }
              var if_res738 = if_res737;
            }
            var result1387 = if_res738;
            var if_res739 = M3.cons(elem1382, result1387);
          } else {
            var if_res739 = M3.rnull;
          }
          var if_res740 = if_res739;
        } else {
          var if_res740 = M3.rnull;
        }
        return if_res740;
      };
      var if_res748 = for_loop1377(lst1376);
    } else {
      var ht1388 = classes1359;
      if ((function(ht1389) {
        return M3.__rjs_quoted__.hash_p(ht1389);
      })(ht1388) !== false) {
        var if_res741 = M3.rvoid();
      } else {
        var if_res741 = M10.__rjs_quoted__.default_in_hash(ht1388);
      }
      if_res741;
      var for_loop1390 = function(i1391) {
        if (i1391 !== false) {
          var let_result742 = M3.__rjs_quoted__.hash_iterate_key_plus_value(ht1388, i1391);
          var _1392 = let_result742.getAt(0);
          var c1393 = let_result742.getAt(1);
          if (true !== false) {
            var post_guard_var1394 = function() {
              return true;
            };
            var _dot__dot__dot_ects_by_racket_by_list_dot_rkt__315521396 = M6.__rjs_quoted__.sort9;
            var c891397 = c1393;
            var _lt_901398 = M3._lt_;
            var car911399 = M3.car;
            if (M3.variable_reference_constant_p(M6.__rjs_quoted__.sort9) !== false) {
              var if_res743 = M6.__rjs_quoted__.sort7(false, false, car911399, true, c891397, _lt_901398);
            } else {
              var if_res743 = M3.checked_procedure_check_and_extract(M7.__rjs_quoted__.struct_keyword_procedure, _dot__dot__dot_ects_by_racket_by_list_dot_rkt__315521396, M7.__rjs_quoted__.keyword_procedure_extract, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), 4)($rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), M3.list(car911399), c891397, _lt_901398);
            }
            var elem1395 = if_res743;
            if (false !== false) {
              var if_res745 = M3.rnull;
            } else {
              if (post_guard_var1394() !== false) {
                var if_res744 = for_loop1390(M3.__rjs_quoted__.hash_iterate_next(ht1388, i1391));
              } else {
                var if_res744 = M3.rnull;
              }
              var if_res745 = if_res744;
            }
            var result1400 = if_res745;
            var if_res746 = M3.cons(elem1395, result1400);
          } else {
            var if_res746 = M3.rnull;
          }
          var if_res747 = if_res746;
        } else {
          var if_res747 = M3.rnull;
        }
        return if_res747;
      };
      var if_res748 = for_loop1390(M3.__rjs_quoted__.hash_iterate_first(ht1388));
    }
    var sorted_classes1375 = if_res748;
    var _dot__dot__dot_ects_by_racket_by_list_dot_rkt__316691402 = M6.__rjs_quoted__.sort9;
    var sorted_classes921403 = sorted_classes1375;
    var _lt_931404 = M3._lt_;
    var caar941405 = M3.caar;
    if (M3.variable_reference_constant_p(M6.__rjs_quoted__.sort9) !== false) {
      var if_res749 = M6.__rjs_quoted__.sort7(false, false, caar941405, true, sorted_classes921403, _lt_931404);
    } else {
      var if_res749 = M3.checked_procedure_check_and_extract(M7.__rjs_quoted__.struct_keyword_procedure, _dot__dot__dot_ects_by_racket_by_list_dot_rkt__316691402, M7.__rjs_quoted__.keyword_procedure_extract, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), 4)($rjs_core.Pair.makeList($rjs_core.Keyword.make('#:key')), M3.list(caar941405), sorted_classes921403, _lt_931404);
    }
    var lst1401 = if_res749;
    if (M3.list_p(lst1401) !== false) {
      var if_res750 = M3.rvoid();
    } else {
      var if_res750 = M10.__rjs_quoted__.in_list(lst1401);
    }
    if_res750;
    var for_loop1406 = function(lst1407) {
      if (M3.pair_p(lst1407) !== false) {
        var c1408 = M9.unsafe_car(lst1407);
        var rest1409 = M9.unsafe_cdr(lst1407);
        if (true !== false) {
          var post_guard_var1410 = function() {
            return true;
          };
          var elem1411 = M1.map(M3.cdr, c1408);
          if (false !== false) {
            var if_res752 = M3.rnull;
          } else {
            if (post_guard_var1410() !== false) {
              var if_res751 = for_loop1406(rest1409);
            } else {
              var if_res751 = M3.rnull;
            }
            var if_res752 = if_res751;
          }
          var result1412 = if_res752;
          var if_res753 = M3.cons(elem1411, result1412);
        } else {
          var if_res753 = M3.rnull;
        }
        var if_res754 = if_res753;
      } else {
        var if_res754 = M3.rnull;
      }
      return if_res754;
    };
    return for_loop1406(lst1401);
  };
  var cl755 = function(key1413, l1414) {
    return group_by681342(key1413, l1414, false, false);
  };
  var cl756 = function(key1415, l1416, _eq__p641417) {
    return group_by681342(key1415, l1416, _eq__p641417, true);
  };
  var group_by = $rjs_core.attachProcedureArity(function() {
    var fixed_lam757 = {
      '2': cl755,
      '3': cl756
    }[arguments.length];
    if (fixed_lam757 !== undefined !== false) {
      return fixed_lam757.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var cartesian_product = $rjs_core.attachProcedureArity(function() {
    var ls1418 = $rjs_core.Pair.listFromArray($rjs_core.argumentsToArray(arguments));
    var let_result758 = M10.__rjs_quoted__.make_sequence($rjs_core.Pair.makeList($rjs_core.Symbol.make("l")), ls1418);
    var pos__gt_vals1419 = let_result758.getAt(0);
    var pos_pre_inc1420 = let_result758.getAt(1);
    var pos_next1421 = let_result758.getAt(2);
    var init1422 = let_result758.getAt(3);
    var pos_cont_p1423 = let_result758.getAt(4);
    var val_cont_p1424 = let_result758.getAt(5);
    var all_cont_p1425 = let_result758.getAt(6);
    var start1426 = 0;
    if (M3.rvoid() !== false) {
      if (M3.exact_nonnegative_integer_p(start1426) !== false) {
        var if_res759 = M3.rvoid();
      } else {
        var if_res759 = M10.__rjs_quoted__.in_naturals(start1426);
      }
      var if_res760 = if_res759;
    } else {
      var if_res760 = false;
    }
    if_res760;
    var for_loop1427 = function(pos1428, pos1429) {
      if (pos_cont_p1423 !== false) {
        var if_res761 = pos_cont_p1423(pos1428);
      } else {
        var if_res761 = true;
      }
      if (if_res761 !== false) {
        var if_res762 = true;
      } else {
        var if_res762 = false;
      }
      if (if_res762 !== false) {
        var l1434 = pos__gt_vals1419(pos1428);
        if (all_cont_p1425 !== false) {
          var if_res763 = function(pos1435) {
            return all_cont_p1425(pos1435, l1434);
          };
        } else {
          var if_res763 = false;
        }
        var let_result764 = M3.values(l1434, if_res763);
        var l1430 = let_result764.getAt(0);
        var all_cont_p_by_pos1431 = let_result764.getAt(1);
        if (pos_pre_inc1420 !== false) {
          var if_res765 = pos_pre_inc1420(pos1428);
        } else {
          var if_res765 = pos1428;
        }
        var pos1432 = if_res765;
        var i1433 = pos1429;
        if (val_cont_p1424 !== false) {
          var if_res766 = val_cont_p1424(l1430);
        } else {
          var if_res766 = true;
        }
        if (if_res766 !== false) {
          var if_res767 = true;
        } else {
          var if_res767 = false;
        }
        if (if_res767 !== false) {
          if (M3.list_p(l1430) !== false) {
            var if_res768 = M3.rvoid();
          } else {
            var if_res768 = M3.apply(M3.raise_argument_error, $rjs_core.Symbol.make("cartesian-product"), "list?", i1433, ls1418);
          }
          if_res768;
          var let_result769 = M3.values();
          var let_result770 = M3.values();
          if (all_cont_p_by_pos1431 !== false) {
            var if_res771 = all_cont_p_by_pos1431(pos1432);
          } else {
            var if_res771 = true;
          }
          if (if_res771 !== false) {
            var if_res772 = true;
          } else {
            var if_res772 = false;
          }
          if (if_res772 !== false) {
            var if_res773 = M3.not(false);
          } else {
            var if_res773 = false;
          }
          if (if_res773 !== false) {
            var if_res774 = for_loop1427(pos_next1421(pos1432), pos1429 + 1);
          } else {
            var if_res774 = M3.values();
          }
          var if_res775 = if_res774;
        } else {
          var if_res775 = M3.values();
        }
        var if_res776 = if_res775;
      } else {
        var if_res776 = M3.values();
      }
      return if_res776;
    };
    for_loop1427(init1422, start1426);
    var let_result777 = M3.values();
    M3.rvoid();
    var let_result778 = M3.values();
    var cp_21436 = function(as1437, bs1438) {
      var lst1439 = as1437;
      if (M3.list_p(lst1439) !== false) {
        var if_res779 = M3.rvoid();
      } else {
        var if_res779 = M10.__rjs_quoted__.in_list(lst1439);
      }
      if_res779;
      var for_loop1440 = function(lst1441) {
        if (M3.pair_p(lst1441) !== false) {
          var i1442 = M9.unsafe_car(lst1441);
          var rest1443 = M9.unsafe_cdr(lst1441);
          if (true !== false) {
            var post_guard_var1444 = function() {
              return true;
            };
            var lst1445 = bs1438;
            if (M3.list_p(lst1445) !== false) {
              var if_res780 = M3.rvoid();
            } else {
              var if_res780 = M10.__rjs_quoted__.in_list(lst1445);
            }
            if_res780;
            var for_loop1446 = function(lst1447) {
              if (M3.pair_p(lst1447) !== false) {
                var j1448 = M9.unsafe_car(lst1447);
                var rest1449 = M9.unsafe_cdr(lst1447);
                if (true !== false) {
                  var post_guard_var1450 = function() {
                    return true;
                  };
                  var elem1451 = M3.cons(i1442, j1448);
                  if (false !== false) {
                    var if_res783 = M3.rnull;
                  } else {
                    if (post_guard_var1450() !== false) {
                      var if_res782 = for_loop1446(rest1449);
                    } else {
                      if (post_guard_var1444() !== false) {
                        var if_res781 = for_loop1440(rest1443);
                      } else {
                        var if_res781 = M3.rnull;
                      }
                      var if_res782 = if_res781;
                    }
                    var if_res783 = if_res782;
                  }
                  var result1452 = if_res783;
                  var if_res785 = M3.cons(elem1451, result1452);
                } else {
                  if (post_guard_var1444() !== false) {
                    var if_res784 = for_loop1440(rest1443);
                  } else {
                    var if_res784 = M3.rnull;
                  }
                  var if_res785 = if_res784;
                }
                var if_res787 = if_res785;
              } else {
                if (post_guard_var1444() !== false) {
                  var if_res786 = for_loop1440(rest1443);
                } else {
                  var if_res786 = M3.rnull;
                }
                var if_res787 = if_res786;
              }
              return if_res787;
            };
            var if_res788 = for_loop1446(lst1445);
          } else {
            var if_res788 = M3.rnull;
          }
          var if_res789 = if_res788;
        } else {
          var if_res789 = M3.rnull;
        }
        return if_res789;
      };
      return for_loop1440(lst1439);
    };
    return M6.foldr(cp_21436, M3.list(M3.list()), ls1418);
  });
  var remf = function(f1453, ls1454) {
    if (M3.list_p(ls1454) !== false) {
      var if_res790 = M3.rvoid();
    } else {
      var if_res790 = M3.raise_argument_error($rjs_core.Symbol.make("remf"), "list?", 1, f1453, ls1454);
    }
    if_res790;
    if (M3.procedure_p(f1453) !== false) {
      var if_res791 = M3.procedure_arity_includes_p(f1453, 1);
    } else {
      var if_res791 = false;
    }
    if (if_res791 !== false) {
      var if_res792 = M3.rvoid();
    } else {
      var if_res792 = M3.raise_argument_error($rjs_core.Symbol.make("remf"), "(-> any/c any/c)", 0, f1453, ls1454);
    }
    if_res792;
    if (M3.null_p(ls1454) !== false) {
      var if_res794 = $rjs_core.Pair.Empty;
    } else {
      if (f1453(M3.car(ls1454)) !== false) {
        var if_res793 = M3.cdr(ls1454);
      } else {
        var if_res793 = M3.cons(M3.car(ls1454), remf(f1453, M3.cdr(ls1454)));
      }
      var if_res794 = if_res793;
    }
    return if_res794;
  };
  var remf_times_ = function(f1455, ls1456) {
    if (M3.list_p(ls1456) !== false) {
      var if_res795 = M3.rvoid();
    } else {
      var if_res795 = M3.raise_argument_error($rjs_core.Symbol.make("remf*"), "list?", 1, f1455, ls1456);
    }
    if_res795;
    if (M3.procedure_p(f1455) !== false) {
      var if_res796 = M3.procedure_arity_includes_p(f1455, 1);
    } else {
      var if_res796 = false;
    }
    if (if_res796 !== false) {
      var if_res797 = M3.rvoid();
    } else {
      var if_res797 = M3.raise_argument_error($rjs_core.Symbol.make("remf*"), "(-> any/c any/c)", 0, f1455, ls1456);
    }
    if_res797;
    if (M3.null_p(ls1456) !== false) {
      var if_res799 = $rjs_core.Pair.Empty;
    } else {
      if (f1455(M3.car(ls1456)) !== false) {
        var if_res798 = remf_times_(f1455, M3.cdr(ls1456));
      } else {
        var if_res798 = M3.cons(M3.car(ls1456), remf_times_(f1455, M3.cdr(ls1456)));
      }
      var if_res799 = if_res798;
    }
    return if_res799;
  };
  var index_of741457 = function(ls721458, v731459, _eq__p701460, _eq__p711461) {
    var ls1462 = ls721458;
    var v1463 = v731459;
    if (_eq__p711461 !== false) {
      var if_res800 = _eq__p701460;
    } else {
      var if_res800 = M3.equal_p;
    }
    var _eq__p1464 = if_res800;
    if (M3.list_p(ls1462) !== false) {
      var if_res801 = M3.rvoid();
    } else {
      var if_res801 = M3.raise_argument_error($rjs_core.Symbol.make("index-of"), "list?", 0, ls1462, v1463);
    }
    if_res801;
    if (M3.procedure_p(_eq__p1464) !== false) {
      var if_res802 = M3.procedure_arity_includes_p(_eq__p1464, 2);
    } else {
      var if_res802 = false;
    }
    if (if_res802 !== false) {
      var if_res803 = M3.rvoid();
    } else {
      var if_res803 = M3.raise_argument_error($rjs_core.Symbol.make("index-of"), "(-> any/c any/c any/c)", 2, ls1462, v1463, _eq__p1464);
    }
    if_res803;
    var loop1465 = function(ls1466, i1467) {
      if (M3.null_p(ls1466) !== false) {
        var if_res805 = false;
      } else {
        if (_eq__p1464(M3.car(ls1466), v1463) !== false) {
          var if_res804 = i1467;
        } else {
          var if_res804 = loop1465(M3.cdr(ls1466), M3.add1(i1467));
        }
        var if_res805 = if_res804;
      }
      return if_res805;
    };
    return loop1465(ls1462, 0);
  };
  var cl806 = function(ls1468, v1469) {
    return index_of741457(ls1468, v1469, false, false);
  };
  var cl807 = function(ls1470, v1471, _eq__p701472) {
    return index_of741457(ls1470, v1471, _eq__p701472, true);
  };
  var index_of = $rjs_core.attachProcedureArity(function() {
    var fixed_lam808 = {
      '2': cl806,
      '3': cl807
    }[arguments.length];
    if (fixed_lam808 !== undefined !== false) {
      return fixed_lam808.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var index_where = function(ls1473, f1474) {
    if (M3.list_p(ls1473) !== false) {
      var if_res809 = M3.rvoid();
    } else {
      var if_res809 = M3.raise_argument_error($rjs_core.Symbol.make("index-where"), "list?", 0, ls1473, f1474);
    }
    if_res809;
    if (M3.procedure_p(f1474) !== false) {
      var if_res810 = M3.procedure_arity_includes_p(f1474, 1);
    } else {
      var if_res810 = false;
    }
    if (if_res810 !== false) {
      var if_res811 = M3.rvoid();
    } else {
      var if_res811 = M3.raise_argument_error($rjs_core.Symbol.make("index-where"), "(-> any/c any/c)", 1, ls1473, f1474);
    }
    if_res811;
    var loop1475 = function(ls1476, i1477) {
      if (M3.null_p(ls1476) !== false) {
        var if_res813 = false;
      } else {
        if (f1474(M3.car(ls1476)) !== false) {
          var if_res812 = i1477;
        } else {
          var if_res812 = loop1475(M3.cdr(ls1476), M3.add1(i1477));
        }
        var if_res813 = if_res812;
      }
      return if_res813;
    };
    return loop1475(ls1473, 0);
  };
  var indexes_of801478 = function(ls781479, v791480, _eq__p761481, _eq__p771482) {
    var ls1483 = ls781479;
    var v1484 = v791480;
    if (_eq__p771482 !== false) {
      var if_res814 = _eq__p761481;
    } else {
      var if_res814 = M3.equal_p;
    }
    var _eq__p1485 = if_res814;
    if (M3.list_p(ls1483) !== false) {
      var if_res815 = M3.rvoid();
    } else {
      var if_res815 = M3.raise_argument_error($rjs_core.Symbol.make("indexes-of"), "list?", 0, ls1483, v1484);
    }
    if_res815;
    if (M3.procedure_p(_eq__p1485) !== false) {
      var if_res816 = M3.procedure_arity_includes_p(_eq__p1485, 2);
    } else {
      var if_res816 = false;
    }
    if (if_res816 !== false) {
      var if_res817 = M3.rvoid();
    } else {
      var if_res817 = M3.raise_argument_error($rjs_core.Symbol.make("indexes-of"), "(-> any/c any/c any/c)", 2, ls1483, v1484, _eq__p1485);
    }
    if_res817;
    var loop1486 = function(ls1487, i1488) {
      if (M3.null_p(ls1487) !== false) {
        var if_res819 = $rjs_core.Pair.Empty;
      } else {
        if (_eq__p1485(M3.car(ls1487), v1484) !== false) {
          var if_res818 = M3.cons(i1488, loop1486(M3.cdr(ls1487), M3.add1(i1488)));
        } else {
          var if_res818 = loop1486(M3.cdr(ls1487), M3.add1(i1488));
        }
        var if_res819 = if_res818;
      }
      return if_res819;
    };
    return loop1486(ls1483, 0);
  };
  var cl820 = function(ls1489, v1490) {
    return indexes_of801478(ls1489, v1490, false, false);
  };
  var cl821 = function(ls1491, v1492, _eq__p761493) {
    return indexes_of801478(ls1491, v1492, _eq__p761493, true);
  };
  var indexes_of = $rjs_core.attachProcedureArity(function() {
    var fixed_lam822 = {
      '2': cl820,
      '3': cl821
    }[arguments.length];
    if (fixed_lam822 !== undefined !== false) {
      return fixed_lam822.apply(null, arguments);
    } else {
      return M3.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var indexes_where = function(ls1494, f1495) {
    if (M3.list_p(ls1494) !== false) {
      var if_res823 = M3.rvoid();
    } else {
      var if_res823 = M3.raise_argument_error($rjs_core.Symbol.make("indexes-where"), "list?", 0, ls1494, f1495);
    }
    if_res823;
    if (M3.procedure_p(f1495) !== false) {
      var if_res824 = M3.procedure_arity_includes_p(f1495, 1);
    } else {
      var if_res824 = false;
    }
    if (if_res824 !== false) {
      var if_res825 = M3.rvoid();
    } else {
      var if_res825 = M3.raise_argument_error($rjs_core.Symbol.make("indexes-where"), "(-> any/c any/c)", 1, ls1494, f1495);
    }
    if_res825;
    var loop1496 = function(ls1497, i1498) {
      if (M3.null_p(ls1497) !== false) {
        var if_res827 = $rjs_core.Pair.Empty;
      } else {
        if (f1495(M3.car(ls1497)) !== false) {
          var if_res826 = M3.cons(i1498, loop1496(M3.cdr(ls1497), M3.add1(i1498)));
        } else {
          var if_res826 = loop1496(M3.cdr(ls1497), M3.add1(i1498));
        }
        var if_res827 = if_res826;
      }
      return if_res827;
    };
    return loop1496(ls1494, 0);
  };
  var __rjs_quoted__ = {};
  __rjs_quoted__.check_duplicates53 = check_duplicates53;
  __rjs_quoted__.add_between35 = add_between35;
  __rjs_quoted__.check_duplicates51 = check_duplicates51;
  __rjs_quoted__.remove_duplicates43 = remove_duplicates43;
  __rjs_quoted__.remove_duplicates45 = remove_duplicates45;
  __rjs_quoted__.add_between37 = add_between37;
  __rjs_quoted__.range_proc = range_proc;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get remf_times_() {
      return remf_times_;
    },
    get remf() {
      return remf;
    },
    get cartesian_product() {
      return cartesian_product;
    },
    get group_by() {
      return group_by;
    },
    get argmax() {
      return argmax;
    },
    get argmin() {
      return argmin;
    },
    get in_permutations() {
      return in_permutations;
    },
    get permutations() {
      return permutations;
    },
    get in_combinations() {
      return in_combinations;
    },
    get combinations() {
      return combinations;
    },
    get shuffle() {
      return shuffle;
    },
    get filter_not() {
      return filter_not;
    },
    get append_map() {
      return append_map;
    },
    get partition() {
      return partition;
    },
    get count() {
      return count;
    },
    get filter_map() {
      return filter_map;
    },
    get flatten() {
      return flatten;
    },
    get append_times_() {
      return append_times_;
    },
    get drop_common_prefix() {
      return drop_common_prefix;
    },
    get take_common_prefix() {
      return take_common_prefix;
    },
    get split_common_prefix() {
      return split_common_prefix;
    },
    get list_prefix_p() {
      return list_prefix_p;
    },
    get splitf_at_right() {
      return splitf_at_right;
    },
    get dropf_right() {
      return dropf_right;
    },
    get takef_right() {
      return takef_right;
    },
    get split_at_right() {
      return split_at_right;
    },
    get take_right() {
      return take_right;
    },
    get drop_right() {
      return drop_right;
    },
    get splitf_at() {
      return splitf_at;
    },
    get dropf() {
      return dropf;
    },
    get takef() {
      return takef;
    },
    get split_at() {
      return split_at;
    },
    get take() {
      return take;
    },
    get drop() {
      return drop;
    },
    get indexes_where() {
      return indexes_where;
    },
    get indexes_of() {
      return indexes_of;
    },
    get index_where() {
      return index_where;
    },
    get index_of() {
      return index_of;
    },
    get list_set() {
      return list_set;
    },
    get list_update() {
      return list_update;
    },
    get make_list() {
      return make_list;
    },
    get empty_p() {
      return empty_p;
    },
    get empty() {
      return empty;
    },
    get cons_p() {
      return cons_p;
    },
    get rest() {
      return rest;
    },
    get last() {
      return last;
    },
    get last_pair() {
      return last_pair;
    },
    get tenth() {
      return tenth;
    },
    get ninth() {
      return ninth;
    },
    get eighth() {
      return eighth;
    },
    get seventh() {
      return seventh;
    },
    get sixth() {
      return sixth;
    },
    get fifth() {
      return fifth;
    },
    get fourth() {
      return fourth;
    },
    get third() {
      return third;
    },
    get second() {
      return second;
    },
    get first() {
      return first;
    }
  };
})();
var $__collects_47_waxeye_47_ast_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/waxeye/ast.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var M2 = $__collects_47_racket_47_list_46_rkt_46_js__;
  var let_result232 = M1.make_struct_type($rjs_core.Symbol.make("ast"), false, 3, 0, false, M1.rnull, M1.current_inspector(), false, $rjs_core.Pair.Empty, false, $rjs_core.Symbol.make("ast"));
  var struct_511 = let_result232.getAt(0);
  var make_512 = let_result232.getAt(1);
  var _p513 = let_result232.getAt(2);
  var _ref514 = let_result232.getAt(3);
  var _set_bang_515 = let_result232.getAt(4);
  var let_result233 = M1.values(struct_511, make_512, _p513, M1.make_struct_field_accessor(_ref514, 0, $rjs_core.Symbol.make("t")), M1.make_struct_field_accessor(_ref514, 1, $rjs_core.Symbol.make("c")), M1.make_struct_field_accessor(_ref514, 2, $rjs_core.Symbol.make("pos")), M1.make_struct_field_mutator(_set_bang_515, 0, $rjs_core.Symbol.make("t")), M1.make_struct_field_mutator(_set_bang_515, 1, $rjs_core.Symbol.make("c")), M1.make_struct_field_mutator(_set_bang_515, 2, $rjs_core.Symbol.make("pos")));
  var struct_ast = let_result233.getAt(0);
  var ast1 = let_result233.getAt(1);
  var ast_p = let_result233.getAt(2);
  var ast_t = let_result233.getAt(3);
  var ast_c = let_result233.getAt(4);
  var ast_pos = let_result233.getAt(5);
  var set_ast_t_bang_ = let_result233.getAt(6);
  var set_ast_c_bang_ = let_result233.getAt(7);
  var set_ast_pos_bang_ = let_result233.getAt(8);
  var let_result234 = M1.make_struct_type($rjs_core.Symbol.make("parse-error"), false, 6, 0, false, M1.rnull, M1.current_inspector(), false, $rjs_core.Pair.makeList(0, 1, 2, 3, 4, 5), false, $rjs_core.Symbol.make("parse-error"));
  var struct_516 = let_result234.getAt(0);
  var make_517 = let_result234.getAt(1);
  var _p518 = let_result234.getAt(2);
  var _ref519 = let_result234.getAt(3);
  var _set_bang_520 = let_result234.getAt(4);
  var let_result235 = M1.values(struct_516, make_517, _p518, M1.make_struct_field_accessor(_ref519, 0, $rjs_core.Symbol.make("pos")), M1.make_struct_field_accessor(_ref519, 1, $rjs_core.Symbol.make("line")), M1.make_struct_field_accessor(_ref519, 2, $rjs_core.Symbol.make("col")), M1.make_struct_field_accessor(_ref519, 3, $rjs_core.Symbol.make("expected")), M1.make_struct_field_accessor(_ref519, 4, $rjs_core.Symbol.make("received")), M1.make_struct_field_accessor(_ref519, 5, $rjs_core.Symbol.make("snippet")));
  var struct_parse_error = let_result235.getAt(0);
  var parse_error2 = let_result235.getAt(1);
  var parse_error_p = let_result235.getAt(2);
  var parse_error_pos = let_result235.getAt(3);
  var parse_error_line = let_result235.getAt(4);
  var parse_error_col = let_result235.getAt(5);
  var parse_error_expected = let_result235.getAt(6);
  var parse_error_received = let_result235.getAt(7);
  var parse_error_snippet = let_result235.getAt(8);
  var ast__gt_string = function(ast521) {
    var indent_level522 = 0;
    var o523 = M1.open_output_string();
    var display_a524 = function(c527) {
      if (M1._gt_(indent_level522, 0) !== false) {
        var if_res236 = M1.display("->  ", o523);
      } else {
        var if_res236 = M1.rvoid();
      }
      if_res236;
      M1.display(ast_t(c527), o523);
      indent_level522 = indent_level522 + 1;
      M0.for_each(function(a528) {
        M1.newline(o523);
        return display_iter526(a528);
      }, ast_c(c527));
      indent_level522 = indent_level522 - 1;
      return null;
    };
    var display_c525 = function(c529) {
      if (M1._gt_(indent_level522, 0) !== false) {
        var if_res237 = M1.display("|   ", o523);
      } else {
        var if_res237 = M1.rvoid();
      }
      if_res237;
      return M1.display(c529, o523);
    };
    var display_iter526 = function(ast530) {
      var or_part531 = M1.char_p(ast530);
      if (or_part531 !== false) {
        var if_res238 = or_part531;
      } else {
        var if_res238 = ast_p(ast530);
      }
      if (if_res238 !== false) {
        var loop532 = function(i533) {
          if (M1._lt_(i533, indent_level522) !== false) {
            M1.display("    ", o523);
            var if_res239 = loop532(i533 + 1);
          } else {
            var if_res239 = M1.rvoid();
          }
          return if_res239;
        };
        loop532(1);
        if (M1.char_p(ast530) !== false) {
          var if_res240 = display_c525(ast530);
        } else {
          var if_res240 = display_a524(ast530);
        }
        var if_res241 = if_res240;
      } else {
        var if_res241 = M1.rvoid();
      }
      return if_res241;
    };
    display_iter526(ast521);
    return M1.get_output_string(o523);
  };
  var display_ast = function(ast534) {
    if (ast_p(ast534) !== false) {
      var if_res243 = ast__gt_string(ast534);
    } else {
      if (parse_error_p(ast534) !== false) {
        var if_res242 = parse_error__gt_string(ast534);
      } else {
        var if_res242 = ast534;
      }
      var if_res243 = if_res242;
    }
    M1.display(if_res243);
    return M1.newline();
  };
  var ast__gt_string_sexpr = function(ast535) {
    var o536 = M1.open_output_string();
    var display_iter537 = function(ast538) {
      M1.display("(", o536);
      M1.display(ast_t(ast538), o536);
      M0.for_each(function(a539) {
        M1.display(" ", o536);
        if (ast_p(a539) !== false) {
          var if_res244 = display_iter537(a539);
        } else {
          var if_res244 = M1.display(a539, o536);
        }
        return if_res244;
      }, ast_c(ast538));
      return M1.display(")", o536);
    };
    display_iter537(ast535);
    return M1.get_output_string(o536);
  };
  var parse_error__gt_string = function(error540) {
    var comma_separate541 = function(l542) {
      var temp5543 = M0.map(M1.symbol__gt_string, l542);
      var temp6544 = ", ";
      if (M1.variable_reference_constant_p(M2.__rjs_quoted__.add_between37) !== false) {
        var if_res245 = M2.__rjs_quoted__.add_between35(false, false, false, false, false, false, false, false, temp5543, temp6544);
      } else {
        var if_res245 = M2.__rjs_quoted__.add_between37(temp5543, temp6544);
      }
      return M1.apply(M1.string_append, if_res245);
    };
    var expected545 = function(nts546) {
      var len547 = M1.length(nts546);
      if (M1._eq_(len547, 0) !== false) {
        var if_res246 = "<end of input>";
      } else {
        var if_res246 = M1.string_append("[", comma_separate541(nts546), "]");
      }
      return if_res246;
    };
    var temp249 = M1.number__gt_string(parse_error_line(error540));
    var temp248 = M1.number__gt_string(parse_error_col(error540));
    var temp7548 = parse_error_expected(error540);
    if (M1.variable_reference_constant_p(M2.__rjs_quoted__.remove_duplicates45) !== false) {
      var if_res247 = M2.__rjs_quoted__.remove_duplicates43(false, false, temp7548, false, false);
    } else {
      var if_res247 = M2.__rjs_quoted__.remove_duplicates45(temp7548);
    }
    return M1.string_append(temp249, ":", temp248, " expected: ", expected545(if_res247), " received: ", parse_error_received(error540), "\n", parse_error_snippet(error540));
  };
  var display_parse_error = function(error549) {
    M1.display(parse_error__gt_string(error549));
    return M1.newline();
  };
  var __rjs_quoted__ = {};
  __rjs_quoted__.parse_error_snippet = parse_error_snippet;
  __rjs_quoted__.struct_ast = struct_ast;
  __rjs_quoted__.parse_error_received = parse_error_received;
  __rjs_quoted__.set_ast_c_bang_ = set_ast_c_bang_;
  __rjs_quoted__.parse_error_pos = parse_error_pos;
  __rjs_quoted__.struct_parse_error = struct_parse_error;
  __rjs_quoted__.ast_pos = ast_pos;
  __rjs_quoted__.ast_t = ast_t;
  __rjs_quoted__.ast_c = ast_c;
  __rjs_quoted__.ast1 = ast1;
  __rjs_quoted__.ast_p = ast_p;
  __rjs_quoted__.parse_error_col = parse_error_col;
  __rjs_quoted__.set_ast_t_bang_ = set_ast_t_bang_;
  __rjs_quoted__.parse_error_line = parse_error_line;
  __rjs_quoted__.parse_error2 = parse_error2;
  __rjs_quoted__.parse_error_p = parse_error_p;
  __rjs_quoted__.set_ast_pos_bang_ = set_ast_pos_bang_;
  __rjs_quoted__.parse_error_expected = parse_error_expected;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get struct_ast() {
      return struct_ast;
    },
    get ast_p() {
      return ast_p;
    },
    get ast_t() {
      return ast_t;
    },
    get ast_c() {
      return ast_c;
    },
    get ast_pos() {
      return ast_pos;
    },
    get set_ast_t_bang_() {
      return set_ast_t_bang_;
    },
    get set_ast_c_bang_() {
      return set_ast_c_bang_;
    },
    get set_ast_pos_bang_() {
      return set_ast_pos_bang_;
    },
    get struct_parse_error() {
      return struct_parse_error;
    },
    get parse_error_p() {
      return parse_error_p;
    },
    get parse_error_pos() {
      return parse_error_pos;
    },
    get parse_error_line() {
      return parse_error_line;
    },
    get parse_error_col() {
      return parse_error_col;
    },
    get parse_error_expected() {
      return parse_error_expected;
    },
    get parse_error_received() {
      return parse_error_received;
    },
    get parse_error_snippet() {
      return parse_error_snippet;
    },
    get ast__gt_string() {
      return ast__gt_string;
    },
    get display_ast() {
      return display_ast;
    },
    get ast__gt_string_sexpr() {
      return ast__gt_string_sexpr;
    },
    get parse_error__gt_string() {
      return parse_error__gt_string;
    },
    get display_parse_error() {
      return display_parse_error;
    }
  };
})();
var $__modules_47_gen_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/gen.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var M2 = $__collects_47_waxeye_47_ast_46_rkt_46_js__;
  var _times_eof_check_times_ = true;
  var _times_expression_level_times_ = $rjs_core.Pair.Empty;
  var _times_file_header_times_ = false;
  var _times_module_name_times_ = false;
  var _times_name_prefix_times_ = false;
  var _times_start_index_times_ = 0;
  var _times_start_name_times_ = "";
  var eof_check_bang_ = function(val578) {
    _times_eof_check_times_ = val578;
    return null;
  };
  var file_header_bang_ = function(val579) {
    _times_file_header_times_ = val579;
    return null;
  };
  var module_name_bang_ = function(val580) {
    _times_module_name_times_ = val580;
    return null;
  };
  var name_prefix_bang_ = function(val581) {
    _times_name_prefix_times_ = val581;
    return null;
  };
  var start_index_bang_ = function(val582) {
    _times_start_index_times_ = val582;
    return null;
  };
  var start_name_bang_ = function(val583) {
    _times_start_name_times_ = val583;
    return null;
  };
  var start_nt_bang_ = function(name584, grammar585) {
    var index_of586 = function(ls587, v588) {
      var loop589 = function(ls590, i591) {
        if (M1.null_p(ls590) !== false) {
          var if_res262 = false;
        } else {
          if (M1.equal_p(M1.car(ls590), v588) !== false) {
            var if_res261 = i591;
          } else {
            var if_res261 = loop589(M1.cdr(ls590), M1.add1(i591));
          }
          var if_res262 = if_res261;
        }
        return if_res262;
      };
      return loop589(ls587, 0);
    };
    _times_start_name_times_ = name584;
    if (M1.equal_p(name584, "") !== false) {
      var if_res264 = start_name_bang_(get_non_term(M1.car(get_defs(grammar585))));
    } else {
      var si592 = index_of586(M0.map(get_non_term, get_defs(grammar585)), name584);
      if (si592 !== false) {
        var if_res263 = start_index_bang_(si592);
      } else {
        var if_res263 = M1.error($rjs_core.Symbol.make("waxeye"), M1.format("Can't find definition of starting non-terminal: ~a", _times_start_name_times_));
      }
      var if_res264 = if_res263;
    }
    return if_res264;
  };
  var push_exp_level = function(level593) {
    _times_expression_level_times_ = M1.cons(level593, _times_expression_level_times_);
    return null;
  };
  var pop_exp_level = function() {
    var top594 = M1.car(_times_expression_level_times_);
    _times_expression_level_times_ = M1.cdr(_times_expression_level_times_);
    return top594;
  };
  var peek_exp_level = function() {
    return M1.car(_times_expression_level_times_);
  };
  var get_non_terms = function(grammar595) {
    return M0.map(get_non_term, M2.ast_c(grammar595));
  };
  var get_non_term = function(def596) {
    return M1.list__gt_string(M2.ast_c(M1.car(M2.ast_c(def596))));
  };
  var get_defs = function(grammar597) {
    return M2.ast_c(grammar597);
  };
  var get_arrow = function(def598) {
    return M2.ast_t(M1.cadr(M2.ast_c(def598)));
  };
  var get_alternation = function(def599) {
    return M1.caddr(M2.ast_c(def599));
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get _times_eof_check_times_() {
      return _times_eof_check_times_;
    },
    get _times_expression_level_times_() {
      return _times_expression_level_times_;
    },
    get _times_file_header_times_() {
      return _times_file_header_times_;
    },
    get _times_module_name_times_() {
      return _times_module_name_times_;
    },
    get _times_name_prefix_times_() {
      return _times_name_prefix_times_;
    },
    get _times_start_index_times_() {
      return _times_start_index_times_;
    },
    get _times_start_name_times_() {
      return _times_start_name_times_;
    },
    get eof_check_bang_() {
      return eof_check_bang_;
    },
    get file_header_bang_() {
      return file_header_bang_;
    },
    get module_name_bang_() {
      return module_name_bang_;
    },
    get name_prefix_bang_() {
      return name_prefix_bang_;
    },
    get start_index_bang_() {
      return start_index_bang_;
    },
    get start_name_bang_() {
      return start_name_bang_;
    },
    get start_nt_bang_() {
      return start_nt_bang_;
    },
    get push_exp_level() {
      return push_exp_level;
    },
    get pop_exp_level() {
      return pop_exp_level;
    },
    get peek_exp_level() {
      return peek_exp_level;
    },
    get get_non_terms() {
      return get_non_terms;
    },
    get get_non_term() {
      return get_non_term;
    },
    get get_defs() {
      return get_defs;
    },
    get get_arrow() {
      return get_arrow;
    },
    get get_alternation() {
      return get_alternation;
    }
  };
})();
var $__modules_47_action_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/action.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M1 = $__modules_47_gen_46_rkt_46_js__;
  var M2 = $__runtime_47_kernel_46_rkt_46_js__;
  var M3 = $__collects_47_waxeye_47_ast_46_rkt_46_js__;
  var M4 = $__collects_47_racket_47_private_47_reverse_46_rkt_46_js__;
  var collect_actions = function(grammar1667) {
    var action_list1668 = $rjs_core.Pair.Empty;
    var visit_action1669 = function(exp1670) {
      action_list1668 = M2.cons(exp1670, action_list1668);
      return null;
    };
    var visit_alternation1671 = function(exp1675) {
      return M0.for_each(visit_sequence1672, M3.ast_c(exp1675));
    };
    var visit_sequence1672 = function(exp1676) {
      return M0.for_each(visit_unit1673, M3.ast_c(exp1676));
    };
    var visit_unit1673 = function(exp1677) {
      var el1678 = M3.ast_c(exp1677);
      var el_len1679 = M2.length(el1678);
      return visit_exp1674(M2.list_ref(el1678, el_len1679 - 1));
    };
    var visit_exp1674 = function(exp1680) {
      var type1681 = M3.ast_t(exp1680);
      var tmp1682 = type1681;
      if (M2.equal_p(tmp1682, $rjs_core.Symbol.make("action")) !== false) {
        var if_res960 = visit_action1669(exp1680);
      } else {
        if (M2.equal_p(tmp1682, $rjs_core.Symbol.make("alternation")) !== false) {
          var if_res959 = visit_alternation1671(exp1680);
        } else {
          if (M2.equal_p(tmp1682, $rjs_core.Symbol.make("sequence")) !== false) {
            var if_res958 = visit_sequence1672(exp1680);
          } else {
            if (M2.equal_p(tmp1682, $rjs_core.Symbol.make("unit")) !== false) {
              var if_res957 = visit_unit1673(exp1680);
            } else {
              var if_res957 = M2.rvoid();
            }
            var if_res958 = if_res957;
          }
          var if_res959 = if_res958;
        }
        var if_res960 = if_res959;
      }
      return if_res960;
    };
    var get_def_actions1683 = function(def1684) {
      return visit_alternation1671(M2.caddr(M3.ast_c(def1684)));
    };
    M0.for_each(get_def_actions1683, M1.get_defs(grammar1667));
    action_list1668 = M4.alt_reverse(action_list1668);
    return null;
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get collect_actions() {
      return collect_actions;
    }
  };
})();
var $__modules_47_expand_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/expand.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M1 = $__modules_47_gen_46_rkt_46_js__;
  var M2 = $__runtime_47_kernel_46_rkt_46_js__;
  var M3 = $__collects_47_waxeye_47_ast_46_rkt_46_js__;
  var M4 = $__collects_47_racket_47_private_47_list_46_rkt_46_js__;
  var M5 = $__runtime_47_unsafe_46_rkt_46_js__;
  var expand_grammar = function(grammar1598) {
    var lift_only_sub_exp1599 = function(visitor1600, exp1601) {
      var chil1602 = M3.ast_c(exp1601);
      M0.for_each(visitor1600, chil1602);
      if (M2._eq_(M2.length(chil1602), 1) !== false) {
        var only1603 = M2.car(chil1602);
        M3.set_ast_t_bang_(exp1601, M3.ast_t(only1603));
        M3.set_ast_c_bang_(exp1601, M3.ast_c(only1603));
        var if_res904 = M3.set_ast_pos_bang_(exp1601, M3.ast_pos(only1603));
      } else {
        var if_res904 = M2.rvoid();
      }
      return if_res904;
    };
    var visit_alternation1604 = function(exp1608) {
      return lift_only_sub_exp1599(visit_sequence1605, exp1608);
    };
    var visit_sequence1605 = function(exp1609) {
      M3.set_ast_c_bang_(exp1609, M0.map(expand_unit, M3.ast_c(exp1609)));
      return lift_only_sub_exp1599(visit_exp1607, exp1609);
    };
    var visit_only_child1606 = function(exp1610) {
      return visit_exp1607(M2.car(M3.ast_c(exp1610)));
    };
    var visit_exp1607 = function(exp1611) {
      var type1612 = M3.ast_t(exp1611);
      var tmp1613 = type1612;
      if (M2.symbol_p(tmp1613) !== false) {
        var if_res905 = M2.hash_ref($rjs_core.Hash.makeEq([[$rjs_core.Symbol.make("sequence"), 13], [$rjs_core.Symbol.make("identifier"), 7], [$rjs_core.Symbol.make("optional"), 11], [$rjs_core.Symbol.make("not"), 10], [$rjs_core.Symbol.make("caseLiteral"), 4], [$rjs_core.Symbol.make("closure"), 6], [$rjs_core.Symbol.make("charClass"), 5], [$rjs_core.Symbol.make("void"), 14], [$rjs_core.Symbol.make("action"), 1], [$rjs_core.Symbol.make("alternation"), 2], [$rjs_core.Symbol.make("plus"), 12], [$rjs_core.Symbol.make("wildCard"), 15], [$rjs_core.Symbol.make("label"), 8], [$rjs_core.Symbol.make("and"), 3], [$rjs_core.Symbol.make("literal"), 9]], false), tmp1613, function() {
          return 0;
        });
      } else {
        var if_res905 = 0;
      }
      var index1614 = if_res905;
      if (M5.unsafe_fx_lt_(index1614, 7) !== false) {
        if (M5.unsafe_fx_lt_(index1614, 3) !== false) {
          if (M5.unsafe_fx_lt_(index1614, 1) !== false) {
            var if_res907 = M2.error($rjs_core.Symbol.make("expand-grammar"), "unknown expression type: ~s", type1612);
          } else {
            if (M5.unsafe_fx_lt_(index1614, 2) !== false) {
              var if_res906 = M2.rvoid();
            } else {
              var if_res906 = visit_alternation1604(exp1611);
            }
            var if_res907 = if_res906;
          }
          var if_res911 = if_res907;
        } else {
          if (M5.unsafe_fx_lt_(index1614, 4) !== false) {
            var if_res910 = visit_only_child1606(exp1611);
          } else {
            if (M5.unsafe_fx_lt_(index1614, 5) !== false) {
              var if_res909 = visit_case_literal(exp1611);
            } else {
              if (M5.unsafe_fx_lt_(index1614, 6) !== false) {
                var if_res908 = visit_char_class(exp1611);
              } else {
                var if_res908 = visit_only_child1606(exp1611);
              }
              var if_res909 = if_res908;
            }
            var if_res910 = if_res909;
          }
          var if_res911 = if_res910;
        }
        var if_res920 = if_res911;
      } else {
        if (M5.unsafe_fx_lt_(index1614, 11) !== false) {
          if (M5.unsafe_fx_lt_(index1614, 8) !== false) {
            var if_res914 = M2.rvoid();
          } else {
            if (M5.unsafe_fx_lt_(index1614, 9) !== false) {
              var if_res913 = M2.rvoid();
            } else {
              if (M5.unsafe_fx_lt_(index1614, 10) !== false) {
                var if_res912 = visit_literal(exp1611);
              } else {
                var if_res912 = visit_only_child1606(exp1611);
              }
              var if_res913 = if_res912;
            }
            var if_res914 = if_res913;
          }
          var if_res919 = if_res914;
        } else {
          if (M5.unsafe_fx_lt_(index1614, 13) !== false) {
            if (M5.unsafe_fx_lt_(index1614, 12) !== false) {
              var if_res915 = visit_only_child1606(exp1611);
            } else {
              var if_res915 = visit_only_child1606(exp1611);
            }
            var if_res918 = if_res915;
          } else {
            if (M5.unsafe_fx_lt_(index1614, 14) !== false) {
              var if_res917 = visit_sequence1605(exp1611);
            } else {
              if (M5.unsafe_fx_lt_(index1614, 15) !== false) {
                var if_res916 = visit_only_child1606(exp1611);
              } else {
                var if_res916 = M2.rvoid();
              }
              var if_res917 = if_res916;
            }
            var if_res918 = if_res917;
          }
          var if_res919 = if_res918;
        }
        var if_res920 = if_res919;
      }
      return if_res920;
    };
    var expand_def1615 = function(def1616) {
      return visit_alternation1604(M2.caddr(M3.ast_c(def1616)));
    };
    return M0.for_each(expand_def1615, M1.get_defs(grammar1598));
  };
  var expand_unit = function(exp1617) {
    var make_prefix1618 = function(v1619, e1620) {
      var r1621 = M2.car(M3.ast_c(v1619));
      if (M2.equal_p(r1621, "*") !== false) {
        var if_res926 = $rjs_core.Symbol.make("closure");
      } else {
        if (M2.equal_p(r1621, "+") !== false) {
          var if_res925 = $rjs_core.Symbol.make("plus");
        } else {
          if (M2.equal_p(r1621, "?") !== false) {
            var if_res924 = $rjs_core.Symbol.make("optional");
          } else {
            if (M2.equal_p(r1621, ":") !== false) {
              var if_res923 = $rjs_core.Symbol.make("void");
            } else {
              if (M2.equal_p(r1621, "&") !== false) {
                var if_res922 = $rjs_core.Symbol.make("and");
              } else {
                if (M2.equal_p(r1621, "!") !== false) {
                  var if_res921 = $rjs_core.Symbol.make("not");
                } else {
                  var if_res921 = M2.error($rjs_core.Symbol.make("make-prefix"), "unknown expression type: ~s", r1621);
                }
                var if_res922 = if_res921;
              }
              var if_res923 = if_res922;
            }
            var if_res924 = if_res923;
          }
          var if_res925 = if_res924;
        }
        var if_res926 = if_res925;
      }
      return M3.__rjs_quoted__.ast1(if_res926, M2.list(e1620), M2.cons(0, 0));
    };
    var make_label1622 = function(v1623, e1624) {
      var r1625 = M2.car(M3.ast_c(v1623));
      return M3.__rjs_quoted__.ast1($rjs_core.Symbol.make("label"), M2.list(e1624), M2.cons(0, 0));
    };
    var expand_unit_iter1626 = function(el1627) {
      var rest1628 = M2.cdr(el1627);
      if (M2.null_p(rest1628) !== false) {
        var if_res929 = M2.car(el1627);
      } else {
        var type1629 = M3.ast_t(M2.car(el1627));
        var tmp1630 = type1629;
        if (M2.equal_p(tmp1630, $rjs_core.Symbol.make("prefix")) !== false) {
          var if_res928 = make_prefix1618;
        } else {
          if (M2.equal_p(tmp1630, $rjs_core.Symbol.make("label")) !== false) {
            var if_res927 = make_label1622;
          } else {
            var if_res927 = M2.error($rjs_core.Symbol.make("expand-unit-iter"), "unknown expression type: ~s", type1629);
          }
          var if_res928 = if_res927;
        }
        var if_res929 = if_res928(M2.car(el1627), expand_unit_iter1626(rest1628));
      }
      return if_res929;
    };
    return expand_unit_iter1626(M3.ast_c(exp1617));
  };
  var visit_case_literal = function(exp1631) {
    var cc_chil1632 = function(c1633) {
      if (M2.char_alphabetic_p(c1633) !== false) {
        var if_res930 = M2.list(M2.char_upcase(c1633), M2.char_downcase(c1633));
      } else {
        var if_res930 = M2.list(c1633);
      }
      return if_res930;
    };
    convert_chars_bang_(exp1631);
    var letters1634 = M3.ast_c(exp1631);
    if (M4.memf(M2.char_alphabetic_p, letters1634) !== false) {
      if (M2.null_p(M2.cdr(letters1634)) !== false) {
        var c1635 = M2.car(letters1634);
        M3.set_ast_t_bang_(exp1631, $rjs_core.Symbol.make("charClass"));
        var if_res931 = M3.set_ast_c_bang_(exp1631, cc_chil1632(c1635));
      } else {
        M3.set_ast_t_bang_(exp1631, $rjs_core.Symbol.make("sequence"));
        var if_res931 = M3.set_ast_c_bang_(exp1631, M0.map(function(a1636) {
          return M3.__rjs_quoted__.ast1($rjs_core.Symbol.make("charClass"), cc_chil1632(a1636), M2.cons(0, 0));
        }, letters1634));
      }
      var if_res932 = if_res931;
    } else {
      var if_res932 = M3.set_ast_t_bang_(exp1631, $rjs_core.Symbol.make("literal"));
    }
    return if_res932;
  };
  var convert_char = function(c1637) {
    var cc_char1638 = function(c1639) {
      var chil1640 = M3.ast_c(c1639);
      if (M2._eq_(M2.length(chil1640), 1) !== false) {
        var if_res936 = M2.car(chil1640);
      } else {
        var s1641 = M2.cadr(chil1640);
        if (M2.equal_p(s1641, "n") !== false) {
          var if_res935 = "\n";
        } else {
          if (M2.equal_p(s1641, "t") !== false) {
            var if_res934 = "\t";
          } else {
            if (M2.equal_p(s1641, "r") !== false) {
              var if_res933 = "\r";
            } else {
              var if_res933 = s1641;
            }
            var if_res934 = if_res933;
          }
          var if_res935 = if_res934;
        }
        var if_res936 = if_res935;
      }
      return if_res936;
    };
    var cc_hex1642 = function(c1643) {
      return M2.integer__gt_char(M2.string__gt_number(M2.list__gt_string(M3.ast_c(c1643)), 16));
    };
    if (M2.equal_p(M3.ast_t(c1637), $rjs_core.Symbol.make("hex")) !== false) {
      var if_res937 = cc_hex1642(c1637);
    } else {
      var if_res937 = cc_char1638(c1637);
    }
    return if_res937;
  };
  var convert_chars_bang_ = function(exp1644) {
    return M3.set_ast_c_bang_(exp1644, M0.map(convert_char, M3.ast_c(exp1644)));
  };
  var visit_literal = function(exp1645) {
    return convert_chars_bang_(exp1645);
  };
  var visit_char_class = function(exp1646) {
    var cc_part1647 = function(part1648) {
      var range1649 = M3.ast_c(part1648);
      if (M2._eq_(M2.length(range1649), 1) !== false) {
        var if_res940 = convert_char(M2.car(range1649));
      } else {
        var r11650 = convert_char(M2.car(range1649));
        var r21651 = convert_char(M2.cadr(range1649));
        if (M2.char_eq__p(r11650, r21651) !== false) {
          var if_res939 = r11650;
        } else {
          if (M2.char_lt__p(r11650, r21651) !== false) {
            var if_res938 = M2.cons(r11650, r21651);
          } else {
            var if_res938 = M2.cons(r21651, r11650);
          }
          var if_res939 = if_res938;
        }
        var if_res940 = if_res939;
      }
      return if_res940;
    };
    var cc_less_than_p1652 = function(a1653, b1654) {
      if (M2.char_p(a1653) !== false) {
        var if_res942 = a1653;
      } else {
        var if_res942 = M2.car(a1653);
      }
      if (M2.char_p(b1654) !== false) {
        var if_res941 = b1654;
      } else {
        var if_res941 = M2.car(b1654);
      }
      return M2.char_lt__p(if_res942, if_res941);
    };
    var minimise1655 = function(cc1656) {
      var next_to_p1657 = function(a1658, b1659) {
        return M2._eq_(M2.char__gt_integer(b1659) - M2.char__gt_integer(a1658), 1);
      };
      if (M2.null_p(cc1656) !== false) {
        var if_res955 = $rjs_core.Pair.Empty;
      } else {
        var a1660 = M2.car(cc1656);
        var rest1661 = M2.cdr(cc1656);
        if (M2.null_p(rest1661) !== false) {
          var if_res954 = cc1656;
        } else {
          var b1662 = M2.car(rest1661);
          if (M2.char_p(a1660) !== false) {
            if (M2.char_p(b1662) !== false) {
              if (M2.char_eq__p(a1660, b1662) !== false) {
                var if_res944 = minimise1655(M2.cons(a1660, M2.cdr(rest1661)));
              } else {
                if (next_to_p1657(a1660, b1662) !== false) {
                  var if_res943 = minimise1655(M2.cons(M2.cons(a1660, b1662), M2.cdr(rest1661)));
                } else {
                  var if_res943 = M2.cons(a1660, minimise1655(rest1661));
                }
                var if_res944 = if_res943;
              }
              var if_res946 = if_res944;
            } else {
              if (next_to_p1657(a1660, M2.car(b1662)) !== false) {
                var if_res945 = minimise1655(M2.cons(M2.cons(a1660, M2.cdr(b1662)), M2.cdr(rest1661)));
              } else {
                var if_res945 = M2.cons(a1660, minimise1655(rest1661));
              }
              var if_res946 = if_res945;
            }
            var if_res953 = if_res946;
          } else {
            if (M2.char_p(b1662) !== false) {
              var or_part1663 = M2.char_eq__p(b1662, M2.car(a1660));
              if (or_part1663 !== false) {
                var if_res947 = or_part1663;
              } else {
                var if_res947 = M2.char_lt__eq__p(b1662, M2.cdr(a1660));
              }
              if (if_res947 !== false) {
                var if_res949 = minimise1655(M2.cons(a1660, M2.cdr(rest1661)));
              } else {
                if (next_to_p1657(M2.cdr(a1660), b1662) !== false) {
                  var if_res948 = minimise1655(M2.cons(M2.cons(M2.car(a1660), b1662), M2.cdr(rest1661)));
                } else {
                  var if_res948 = M2.cons(a1660, minimise1655(rest1661));
                }
                var if_res949 = if_res948;
              }
              var if_res952 = if_res949;
            } else {
              var or_part1664 = M2.char_lt__eq__p(M2.car(b1662), M2.cdr(a1660));
              if (or_part1664 !== false) {
                var if_res950 = or_part1664;
              } else {
                var if_res950 = next_to_p1657(M2.cdr(a1660), M2.car(b1662));
              }
              if (if_res950 !== false) {
                var if_res951 = minimise1655(M2.cons(M2.cons(M2.integer__gt_char(M2.min(M2.char__gt_integer(M2.car(a1660)), M2.char__gt_integer(M2.car(b1662)))), M2.integer__gt_char(M2.max(M2.char__gt_integer(M2.cdr(a1660)), M2.char__gt_integer(M2.cdr(b1662))))), M2.cdr(rest1661)));
              } else {
                var if_res951 = M2.cons(a1660, minimise1655(rest1661));
              }
              var if_res952 = if_res951;
            }
            var if_res953 = if_res952;
          }
          var if_res954 = if_res953;
        }
        var if_res955 = if_res954;
      }
      return if_res955;
    };
    var temp11665 = M0.map(cc_part1647, M3.ast_c(exp1646));
    var cc_less_than_p21666 = cc_less_than_p1652;
    if (M2.variable_reference_constant_p(M4.__rjs_quoted__.sort9) !== false) {
      var if_res956 = M4.__rjs_quoted__.sort7(false, false, false, false, temp11665, cc_less_than_p21666);
    } else {
      var if_res956 = M4.__rjs_quoted__.sort9(temp11665, cc_less_than_p21666);
    }
    return M3.set_ast_c_bang_(exp1646, minimise1655(if_res956));
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get expand_grammar() {
      return expand_grammar;
    },
    get expand_unit() {
      return expand_unit;
    },
    get visit_case_literal() {
      return visit_case_literal;
    },
    get convert_char() {
      return convert_char;
    },
    get convert_chars_bang_() {
      return convert_chars_bang_;
    },
    get visit_literal() {
      return visit_literal;
    },
    get visit_char_class() {
      return visit_char_class;
    }
  };
})();
var $__modules_47_transform_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/transform.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M1 = $__modules_47_gen_46_rkt_46_js__;
  var M2 = $__runtime_47_kernel_46_rkt_46_js__;
  var M3 = $__modules_47_action_46_rkt_46_js__;
  var M4 = $__collects_47_waxeye_47_ast_46_rkt_46_js__;
  var M5 = $__modules_47_expand_46_rkt_46_js__;
  var transform_grammar = function(g550) {
    var nt_names551 = M2.make_hash();
    if (check_not_empty(g550) !== false) {
      if (M3.collect_actions(g550) !== false) {
        if (collect_nt_names(g550, nt_names551) !== false) {
          if (check_refs(g550, nt_names551) !== false) {
            var if_res250 = M5.expand_grammar(g550);
          } else {
            var if_res250 = false;
          }
          var if_res251 = if_res250;
        } else {
          var if_res251 = false;
        }
        var if_res252 = if_res251;
      } else {
        var if_res252 = false;
      }
      var if_res253 = if_res252;
    } else {
      var if_res253 = false;
    }
    return if_res253;
  };
  var check_not_empty = function(g552) {
    if (M2.null_p(M4.ast_c(g552)) !== false) {
      var if_res254 = M2.error($rjs_core.Symbol.make("check-not-empty"), "grammar is empty");
    } else {
      var if_res254 = M2.rvoid();
    }
    return if_res254;
  };
  var collect_nt_names = function(g553, nt_names554) {
    var ok555 = true;
    M0.for_each(function(a556) {
      var name557 = M1.get_non_term(a556);
      var found558 = M2.hash_ref(nt_names554, name557, false);
      if (found558 !== false) {
        ok555 = false;
        var if_res255 = M2.error($rjs_core.Symbol.make("check-duplicate"), "duplicate definition of non-terminal: ~a", name557);
      } else {
        var if_res255 = M2.hash_set_bang_(nt_names554, name557, name557);
      }
      return if_res255;
    }, M4.ast_c(g553));
    return ok555;
  };
  var check_refs = function(grammar559, nt_names560) {
    var visit_nt561 = function(exp562) {
      var name563 = M2.list__gt_string(M4.ast_c(exp562));
      if (M2.hash_ref(nt_names560, name563, false) !== false) {
        var if_res256 = M2.rvoid();
      } else {
        var if_res256 = M2.error($rjs_core.Symbol.make("waxeye"), "undefined reference to non-terminal: ~a", name563);
      }
      return if_res256;
    };
    var visit_alternation564 = function(exp568) {
      return M0.for_each(visit_sequence565, M4.ast_c(exp568));
    };
    var visit_sequence565 = function(exp569) {
      return M0.for_each(visit_unit566, M4.ast_c(exp569));
    };
    var visit_unit566 = function(exp570) {
      var el571 = M4.ast_c(exp570);
      var el_len572 = M2.length(el571);
      return visit_exp567(M2.list_ref(el571, el_len572 - 1));
    };
    var visit_exp567 = function(exp573) {
      var type574 = M4.ast_t(exp573);
      var tmp575 = type574;
      if (M2.equal_p(tmp575, $rjs_core.Symbol.make("alternation")) !== false) {
        var if_res260 = visit_alternation564(exp573);
      } else {
        if (M2.equal_p(tmp575, $rjs_core.Symbol.make("identifier")) !== false) {
          var if_res259 = visit_nt561(exp573);
        } else {
          if (M2.equal_p(tmp575, $rjs_core.Symbol.make("sequence")) !== false) {
            var if_res258 = visit_sequence565(exp573);
          } else {
            if (M2.equal_p(tmp575, $rjs_core.Symbol.make("unit")) !== false) {
              var if_res257 = visit_unit566(exp573);
            } else {
              var if_res257 = M2.rvoid();
            }
            var if_res258 = if_res257;
          }
          var if_res259 = if_res258;
        }
        var if_res260 = if_res259;
      }
      return if_res260;
    };
    var check_nt_refs576 = function(def577) {
      return visit_alternation564(M2.caddr(M4.ast_c(def577)));
    };
    return M0.for_each(check_nt_refs576, M1.get_defs(grammar559));
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get transform_grammar() {
      return transform_grammar;
    },
    get check_not_empty() {
      return check_not_empty;
    },
    get collect_nt_names() {
      return collect_nt_names;
    },
    get check_refs() {
      return check_refs;
    }
  };
})();
var $__collects_47_racket_47_private_47_kw_45_file_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/racket/private/kw-file.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M1 = $__collects_47_racket_47_private_47_sort_46_rkt_46_js__;
  var M2 = $__runtime_47_kernel_46_rkt_46_js__;
  var M3 = $__collects_47_racket_47_private_47_member_46_rkt_46_js__;
  var M4 = $__collects_47_racket_47_private_47_path_46_rkt_46_js__;
  var M5 = $__collects_47_racket_47_private_47_kw_46_rkt_46_js__;
  var exists_syms = $rjs_core.Pair.makeList($rjs_core.Symbol.make("error"), $rjs_core.Symbol.make("append"), $rjs_core.Symbol.make("update"), $rjs_core.Symbol.make("can-update"), $rjs_core.Symbol.make("replace"), $rjs_core.Symbol.make("truncate"), $rjs_core.Symbol.make("must-truncate"), $rjs_core.Symbol.make("truncate/replace"));
  var exists_desc = "(or/c 'error 'append 'update 'can-update 'replace 'truncate 'must-truncate 'truncate/replace)";
  var binary_or_text_desc = "(or/c 'binary 'text)";
  var open_input_file6 = function(for_module_p23038, for_module_p43039, mode13040, mode33041, path53042) {
    var path3043 = path53042;
    if (mode33041 !== false) {
      var if_res1900 = mode13040;
    } else {
      var if_res1900 = $rjs_core.Symbol.make("binary");
    }
    var mode3044 = if_res1900;
    if (for_module_p43039 !== false) {
      var if_res1901 = for_module_p23038;
    } else {
      var if_res1901 = false;
    }
    var for_module_p3045 = if_res1901;
    if (M4.path_string_p(path3043) !== false) {
      var if_res1902 = M2.rvoid();
    } else {
      var if_res1902 = M2.raise_argument_error($rjs_core.Symbol.make("open-input-file"), "path-string?", path3043);
    }
    if_res1902;
    if (M3.memq(mode3044, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res1903 = M2.rvoid();
    } else {
      var if_res1903 = M2.raise_argument_error($rjs_core.Symbol.make("open-input-file"), binary_or_text_desc, mode3044);
    }
    if_res1903;
    if (for_module_p3045 !== false) {
      var if_res1904 = $rjs_core.Symbol.make("module");
    } else {
      var if_res1904 = $rjs_core.Symbol.make("none");
    }
    return M2.open_input_file(path3043, mode3044, if_res1904);
  };
  var unpack7 = function(given_kws3046, given_args3047, path53048) {
    if (M2.pair_p(given_kws3046) !== false) {
      var if_res1905 = M2.eq_p($rjs_core.Keyword.make('#:for-module?'), M2.car(given_kws3046));
    } else {
      var if_res1905 = false;
    }
    var for_module_p43049 = if_res1905;
    if (for_module_p43049 !== false) {
      var if_res1906 = M2.car(given_args3047);
    } else {
      var if_res1906 = M2.rvoid();
    }
    var for_module_p23050 = if_res1906;
    if (for_module_p43049 !== false) {
      var if_res1907 = M2.cdr(given_kws3046);
    } else {
      var if_res1907 = given_kws3046;
    }
    var given_kws3051 = if_res1907;
    if (for_module_p43049 !== false) {
      var if_res1908 = M2.cdr(given_args3047);
    } else {
      var if_res1908 = given_args3047;
    }
    var given_args3052 = if_res1908;
    var mode33053 = M2.pair_p(given_kws3051);
    if (mode33053 !== false) {
      var if_res1909 = M2.car(given_args3052);
    } else {
      var if_res1909 = M2.rvoid();
    }
    var mode13054 = if_res1909;
    return open_input_file6(for_module_p23050, for_module_p43049, mode13054, mode33053, path53048);
  };
  var cl1912 = function(given_kws3061, given_args3062, path3063) {
    return unpack7(given_kws3061, given_args3062, path3063);
  };
  var temp1914 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1913 = {'3': cl1912}[arguments.length];
    if (fixed_lam1913 !== undefined !== false) {
      return fixed_lam1913.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [3]);
  var cl1910 = function(path3065) {
    return unpack7(M2.rnull, M2.rnull, path3065);
  };
  var open_input_file3064 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1911 = {'1': cl1910}[arguments.length];
    if (fixed_lam1911 !== undefined !== false) {
      return fixed_lam1911.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1]);
  var open_input_file8 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3055, given_argc3056) {
    if (M2._eq_(given_argc3056, 3) !== false) {
      var l13057 = given_kws3055;
      if (M2.null_p(l13057) !== false) {
        var if_res1916 = l13057;
      } else {
        if (M2.eq_p(M2.car(l13057), $rjs_core.Keyword.make('#:for-module?')) !== false) {
          var if_res1915 = M2.cdr(l13057);
        } else {
          var if_res1915 = l13057;
        }
        var if_res1916 = if_res1915;
      }
      var l13058 = if_res1916;
      var l13059 = l13058;
      if (M2.null_p(l13059) !== false) {
        var if_res1918 = l13059;
      } else {
        if (M2.eq_p(M2.car(l13059), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res1917 = M2.cdr(l13059);
        } else {
          var if_res1917 = l13059;
        }
        var if_res1918 = if_res1917;
      }
      var l13060 = if_res1918;
      var if_res1919 = M2.null_p(l13060);
    } else {
      var if_res1919 = false;
    }
    return if_res1919;
  }, temp1914, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:for-module?'), $rjs_core.Keyword.make('#:mode')), open_input_file3064);
  var open_output_file14 = function(exists103066, exists123067, mode93068, mode113069, path133070) {
    var path3071 = path133070;
    if (mode113069 !== false) {
      var if_res1920 = mode93068;
    } else {
      var if_res1920 = $rjs_core.Symbol.make("binary");
    }
    var mode3072 = if_res1920;
    if (exists123067 !== false) {
      var if_res1921 = exists103066;
    } else {
      var if_res1921 = $rjs_core.Symbol.make("error");
    }
    var exists3073 = if_res1921;
    if (M4.path_string_p(path3071) !== false) {
      var if_res1922 = M2.rvoid();
    } else {
      var if_res1922 = M2.raise_argument_error($rjs_core.Symbol.make("open-output-file"), "path-string?", path3071);
    }
    if_res1922;
    if (M3.memq(mode3072, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res1923 = M2.rvoid();
    } else {
      var if_res1923 = M2.raise_argument_error($rjs_core.Symbol.make("open-output-file"), binary_or_text_desc, mode3072);
    }
    if_res1923;
    if (M3.memq(exists3073, exists_syms) !== false) {
      var if_res1924 = M2.rvoid();
    } else {
      var if_res1924 = M2.raise_argument_error($rjs_core.Symbol.make("open-output-file"), exists_desc, exists3073);
    }
    if_res1924;
    return M2.open_output_file(path3071, mode3072, exists3073);
  };
  var unpack15 = function(given_kws3074, given_args3075, path133076) {
    if (M2.pair_p(given_kws3074) !== false) {
      var if_res1925 = M2.eq_p($rjs_core.Keyword.make('#:exists'), M2.car(given_kws3074));
    } else {
      var if_res1925 = false;
    }
    var exists123077 = if_res1925;
    if (exists123077 !== false) {
      var if_res1926 = M2.car(given_args3075);
    } else {
      var if_res1926 = M2.rvoid();
    }
    var exists103078 = if_res1926;
    if (exists123077 !== false) {
      var if_res1927 = M2.cdr(given_kws3074);
    } else {
      var if_res1927 = given_kws3074;
    }
    var given_kws3079 = if_res1927;
    if (exists123077 !== false) {
      var if_res1928 = M2.cdr(given_args3075);
    } else {
      var if_res1928 = given_args3075;
    }
    var given_args3080 = if_res1928;
    var mode113081 = M2.pair_p(given_kws3079);
    if (mode113081 !== false) {
      var if_res1929 = M2.car(given_args3080);
    } else {
      var if_res1929 = M2.rvoid();
    }
    var mode93082 = if_res1929;
    return open_output_file14(exists103078, exists123077, mode93082, mode113081, path133076);
  };
  var cl1932 = function(given_kws3089, given_args3090, path3091) {
    return unpack15(given_kws3089, given_args3090, path3091);
  };
  var temp1934 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1933 = {'3': cl1932}[arguments.length];
    if (fixed_lam1933 !== undefined !== false) {
      return fixed_lam1933.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [3]);
  var cl1930 = function(path3093) {
    return unpack15(M2.rnull, M2.rnull, path3093);
  };
  var open_output_file3092 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1931 = {'1': cl1930}[arguments.length];
    if (fixed_lam1931 !== undefined !== false) {
      return fixed_lam1931.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1]);
  var open_output_file16 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3083, given_argc3084) {
    if (M2._eq_(given_argc3084, 3) !== false) {
      var l13085 = given_kws3083;
      if (M2.null_p(l13085) !== false) {
        var if_res1936 = l13085;
      } else {
        if (M2.eq_p(M2.car(l13085), $rjs_core.Keyword.make('#:exists')) !== false) {
          var if_res1935 = M2.cdr(l13085);
        } else {
          var if_res1935 = l13085;
        }
        var if_res1936 = if_res1935;
      }
      var l13086 = if_res1936;
      var l13087 = l13086;
      if (M2.null_p(l13087) !== false) {
        var if_res1938 = l13087;
      } else {
        if (M2.eq_p(M2.car(l13087), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res1937 = M2.cdr(l13087);
        } else {
          var if_res1937 = l13087;
        }
        var if_res1938 = if_res1937;
      }
      var l13088 = if_res1938;
      var if_res1939 = M2.null_p(l13088);
    } else {
      var if_res1939 = false;
    }
    return if_res1939;
  }, temp1934, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:exists'), $rjs_core.Keyword.make('#:mode')), open_output_file3092);
  var open_input_output_file22 = function(exists183094, exists203095, mode173096, mode193097, path213098) {
    var path3099 = path213098;
    if (mode193097 !== false) {
      var if_res1940 = mode173096;
    } else {
      var if_res1940 = $rjs_core.Symbol.make("binary");
    }
    var mode3100 = if_res1940;
    if (exists203095 !== false) {
      var if_res1941 = exists183094;
    } else {
      var if_res1941 = $rjs_core.Symbol.make("error");
    }
    var exists3101 = if_res1941;
    if (M4.path_string_p(path3099) !== false) {
      var if_res1942 = M2.rvoid();
    } else {
      var if_res1942 = M2.raise_argument_error($rjs_core.Symbol.make("open-input-output-file"), "path-string?", path3099);
    }
    if_res1942;
    if (M3.memq(mode3100, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res1943 = M2.rvoid();
    } else {
      var if_res1943 = M2.raise_argument_error($rjs_core.Symbol.make("open-input-output-file"), binary_or_text_desc, mode3100);
    }
    if_res1943;
    if (M3.memq(exists3101, exists_syms) !== false) {
      var if_res1944 = M2.rvoid();
    } else {
      var if_res1944 = M2.raise_argument_error($rjs_core.Symbol.make("open-input-output-file"), exists_desc, exists3101);
    }
    if_res1944;
    return M2.open_input_output_file(path3099, mode3100, exists3101);
  };
  var unpack23 = function(given_kws3102, given_args3103, path213104) {
    if (M2.pair_p(given_kws3102) !== false) {
      var if_res1945 = M2.eq_p($rjs_core.Keyword.make('#:exists'), M2.car(given_kws3102));
    } else {
      var if_res1945 = false;
    }
    var exists203105 = if_res1945;
    if (exists203105 !== false) {
      var if_res1946 = M2.car(given_args3103);
    } else {
      var if_res1946 = M2.rvoid();
    }
    var exists183106 = if_res1946;
    if (exists203105 !== false) {
      var if_res1947 = M2.cdr(given_kws3102);
    } else {
      var if_res1947 = given_kws3102;
    }
    var given_kws3107 = if_res1947;
    if (exists203105 !== false) {
      var if_res1948 = M2.cdr(given_args3103);
    } else {
      var if_res1948 = given_args3103;
    }
    var given_args3108 = if_res1948;
    var mode193109 = M2.pair_p(given_kws3107);
    if (mode193109 !== false) {
      var if_res1949 = M2.car(given_args3108);
    } else {
      var if_res1949 = M2.rvoid();
    }
    var mode173110 = if_res1949;
    return open_input_output_file22(exists183106, exists203105, mode173110, mode193109, path213104);
  };
  var cl1952 = function(given_kws3117, given_args3118, path3119) {
    return unpack23(given_kws3117, given_args3118, path3119);
  };
  var temp1954 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1953 = {'3': cl1952}[arguments.length];
    if (fixed_lam1953 !== undefined !== false) {
      return fixed_lam1953.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [3]);
  var cl1950 = function(path3121) {
    return unpack23(M2.rnull, M2.rnull, path3121);
  };
  var open_input_output_file3120 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1951 = {'1': cl1950}[arguments.length];
    if (fixed_lam1951 !== undefined !== false) {
      return fixed_lam1951.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1]);
  var open_input_output_file24 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3111, given_argc3112) {
    if (M2._eq_(given_argc3112, 3) !== false) {
      var l13113 = given_kws3111;
      if (M2.null_p(l13113) !== false) {
        var if_res1956 = l13113;
      } else {
        if (M2.eq_p(M2.car(l13113), $rjs_core.Keyword.make('#:exists')) !== false) {
          var if_res1955 = M2.cdr(l13113);
        } else {
          var if_res1955 = l13113;
        }
        var if_res1956 = if_res1955;
      }
      var l13114 = if_res1956;
      var l13115 = l13114;
      if (M2.null_p(l13115) !== false) {
        var if_res1958 = l13115;
      } else {
        if (M2.eq_p(M2.car(l13115), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res1957 = M2.cdr(l13115);
        } else {
          var if_res1957 = l13115;
        }
        var if_res1958 = if_res1957;
      }
      var l13116 = if_res1958;
      var if_res1959 = M2.null_p(l13116);
    } else {
      var if_res1959 = false;
    }
    return if_res1959;
  }, temp1954, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:exists'), $rjs_core.Keyword.make('#:mode')), open_input_output_file3120);
  var call_with_input_file29 = function(mode253122, mode263123, path273124, proc283125) {
    var path3126 = path273124;
    var proc3127 = proc283125;
    if (mode263123 !== false) {
      var if_res1960 = mode253122;
    } else {
      var if_res1960 = $rjs_core.Symbol.make("binary");
    }
    var mode3128 = if_res1960;
    if (M4.path_string_p(path3126) !== false) {
      var if_res1961 = M2.rvoid();
    } else {
      var if_res1961 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-input-file"), "path-string?", path3126);
    }
    if_res1961;
    if (M2.procedure_p(proc3127) !== false) {
      var if_res1962 = M2.procedure_arity_includes_p(proc3127, 1);
    } else {
      var if_res1962 = false;
    }
    if (if_res1962 !== false) {
      var if_res1963 = M2.rvoid();
    } else {
      var if_res1963 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-input-file"), "(input-port? . -> . any)", proc3127);
    }
    if_res1963;
    if (M3.memq(mode3128, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res1964 = M2.rvoid();
    } else {
      var if_res1964 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-input-file"), binary_or_text_desc, mode3128);
    }
    if_res1964;
    return M2.call_with_input_file(path3126, proc3127, mode3128);
  };
  var unpack30 = function(given_kws3129, given_args3130, path273131, proc283132) {
    var mode263133 = M2.pair_p(given_kws3129);
    if (mode263133 !== false) {
      var if_res1965 = M2.car(given_args3130);
    } else {
      var if_res1965 = M2.rvoid();
    }
    var mode253134 = if_res1965;
    return call_with_input_file29(mode253134, mode263133, path273131, proc283132);
  };
  var cl1968 = function(given_kws3139, given_args3140, path3141, proc3142) {
    return unpack30(given_kws3139, given_args3140, path3141, proc3142);
  };
  var temp1970 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1969 = {'4': cl1968}[arguments.length];
    if (fixed_lam1969 !== undefined !== false) {
      return fixed_lam1969.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl1966 = function(path3144, proc3145) {
    return unpack30(M2.rnull, M2.rnull, path3144, proc3145);
  };
  var call_with_input_file3143 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1967 = {'2': cl1966}[arguments.length];
    if (fixed_lam1967 !== undefined !== false) {
      return fixed_lam1967.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [2]);
  var call_with_input_file31 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3135, given_argc3136) {
    if (M2._eq_(given_argc3136, 4) !== false) {
      var l13137 = given_kws3135;
      if (M2.null_p(l13137) !== false) {
        var if_res1972 = l13137;
      } else {
        if (M2.eq_p(M2.car(l13137), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res1971 = M2.cdr(l13137);
        } else {
          var if_res1971 = l13137;
        }
        var if_res1972 = if_res1971;
      }
      var l13138 = if_res1972;
      var if_res1973 = M2.null_p(l13138);
    } else {
      var if_res1973 = false;
    }
    return if_res1973;
  }, temp1970, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:mode')), call_with_input_file3143);
  var call_with_output_file38 = function(exists333146, exists353147, mode323148, mode343149, path363150, proc373151) {
    var path3152 = path363150;
    var proc3153 = proc373151;
    if (mode343149 !== false) {
      var if_res1974 = mode323148;
    } else {
      var if_res1974 = $rjs_core.Symbol.make("binary");
    }
    var mode3154 = if_res1974;
    if (exists353147 !== false) {
      var if_res1975 = exists333146;
    } else {
      var if_res1975 = $rjs_core.Symbol.make("error");
    }
    var exists3155 = if_res1975;
    if (M4.path_string_p(path3152) !== false) {
      var if_res1976 = M2.rvoid();
    } else {
      var if_res1976 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file"), "path-string?", path3152);
    }
    if_res1976;
    if (M2.procedure_p(proc3153) !== false) {
      var if_res1977 = M2.procedure_arity_includes_p(proc3153, 1);
    } else {
      var if_res1977 = false;
    }
    if (if_res1977 !== false) {
      var if_res1978 = M2.rvoid();
    } else {
      var if_res1978 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file"), "(output-port? . -> . any)", proc3153);
    }
    if_res1978;
    if (M3.memq(mode3154, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res1979 = M2.rvoid();
    } else {
      var if_res1979 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file"), binary_or_text_desc, mode3154);
    }
    if_res1979;
    if (M3.memq(exists3155, exists_syms) !== false) {
      var if_res1980 = M2.rvoid();
    } else {
      var if_res1980 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file"), exists_desc, exists3155);
    }
    if_res1980;
    return M2.call_with_output_file(path3152, proc3153, mode3154, exists3155);
  };
  var unpack39 = function(given_kws3156, given_args3157, path363158, proc373159) {
    if (M2.pair_p(given_kws3156) !== false) {
      var if_res1981 = M2.eq_p($rjs_core.Keyword.make('#:exists'), M2.car(given_kws3156));
    } else {
      var if_res1981 = false;
    }
    var exists353160 = if_res1981;
    if (exists353160 !== false) {
      var if_res1982 = M2.car(given_args3157);
    } else {
      var if_res1982 = M2.rvoid();
    }
    var exists333161 = if_res1982;
    if (exists353160 !== false) {
      var if_res1983 = M2.cdr(given_kws3156);
    } else {
      var if_res1983 = given_kws3156;
    }
    var given_kws3162 = if_res1983;
    if (exists353160 !== false) {
      var if_res1984 = M2.cdr(given_args3157);
    } else {
      var if_res1984 = given_args3157;
    }
    var given_args3163 = if_res1984;
    var mode343164 = M2.pair_p(given_kws3162);
    if (mode343164 !== false) {
      var if_res1985 = M2.car(given_args3163);
    } else {
      var if_res1985 = M2.rvoid();
    }
    var mode323165 = if_res1985;
    return call_with_output_file38(exists333161, exists353160, mode323165, mode343164, path363158, proc373159);
  };
  var cl1988 = function(given_kws3172, given_args3173, path3174, proc3175) {
    return unpack39(given_kws3172, given_args3173, path3174, proc3175);
  };
  var temp1990 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1989 = {'4': cl1988}[arguments.length];
    if (fixed_lam1989 !== undefined !== false) {
      return fixed_lam1989.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl1986 = function(path3177, proc3178) {
    return unpack39(M2.rnull, M2.rnull, path3177, proc3178);
  };
  var call_with_output_file3176 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam1987 = {'2': cl1986}[arguments.length];
    if (fixed_lam1987 !== undefined !== false) {
      return fixed_lam1987.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [2]);
  var call_with_output_file40 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3166, given_argc3167) {
    if (M2._eq_(given_argc3167, 4) !== false) {
      var l13168 = given_kws3166;
      if (M2.null_p(l13168) !== false) {
        var if_res1992 = l13168;
      } else {
        if (M2.eq_p(M2.car(l13168), $rjs_core.Keyword.make('#:exists')) !== false) {
          var if_res1991 = M2.cdr(l13168);
        } else {
          var if_res1991 = l13168;
        }
        var if_res1992 = if_res1991;
      }
      var l13169 = if_res1992;
      var l13170 = l13169;
      if (M2.null_p(l13170) !== false) {
        var if_res1994 = l13170;
      } else {
        if (M2.eq_p(M2.car(l13170), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res1993 = M2.cdr(l13170);
        } else {
          var if_res1993 = l13170;
        }
        var if_res1994 = if_res1993;
      }
      var l13171 = if_res1994;
      var if_res1995 = M2.null_p(l13171);
    } else {
      var if_res1995 = false;
    }
    return if_res1995;
  }, temp1990, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:exists'), $rjs_core.Keyword.make('#:mode')), call_with_output_file3176);
  var with_input_from_file45 = function(mode413179, mode423180, path433181, proc443182) {
    var path3183 = path433181;
    var proc3184 = proc443182;
    if (mode423180 !== false) {
      var if_res1996 = mode413179;
    } else {
      var if_res1996 = $rjs_core.Symbol.make("binary");
    }
    var mode3185 = if_res1996;
    if (M4.path_string_p(path3183) !== false) {
      var if_res1997 = M2.rvoid();
    } else {
      var if_res1997 = M2.raise_argument_error($rjs_core.Symbol.make("with-input-from-file"), "path-string?", path3183);
    }
    if_res1997;
    if (M2.procedure_p(proc3184) !== false) {
      var if_res1998 = M2.procedure_arity_includes_p(proc3184, 0);
    } else {
      var if_res1998 = false;
    }
    if (if_res1998 !== false) {
      var if_res1999 = M2.rvoid();
    } else {
      var if_res1999 = M2.raise_argument_error($rjs_core.Symbol.make("with-input-from-file"), "(-> any)", proc3184);
    }
    if_res1999;
    if (M3.memq(mode3185, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res2000 = M2.rvoid();
    } else {
      var if_res2000 = M2.raise_argument_error($rjs_core.Symbol.make("with-input-from-file"), binary_or_text_desc, mode3185);
    }
    if_res2000;
    return M2.with_input_from_file(path3183, proc3184, mode3185);
  };
  var unpack46 = function(given_kws3186, given_args3187, path433188, proc443189) {
    var mode423190 = M2.pair_p(given_kws3186);
    if (mode423190 !== false) {
      var if_res2001 = M2.car(given_args3187);
    } else {
      var if_res2001 = M2.rvoid();
    }
    var mode413191 = if_res2001;
    return with_input_from_file45(mode413191, mode423190, path433188, proc443189);
  };
  var cl2004 = function(given_kws3196, given_args3197, path3198, proc3199) {
    return unpack46(given_kws3196, given_args3197, path3198, proc3199);
  };
  var temp2006 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2005 = {'4': cl2004}[arguments.length];
    if (fixed_lam2005 !== undefined !== false) {
      return fixed_lam2005.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl2002 = function(path3201, proc3202) {
    return unpack46(M2.rnull, M2.rnull, path3201, proc3202);
  };
  var with_input_from_file3200 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2003 = {'2': cl2002}[arguments.length];
    if (fixed_lam2003 !== undefined !== false) {
      return fixed_lam2003.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [2]);
  var with_input_from_file47 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3192, given_argc3193) {
    if (M2._eq_(given_argc3193, 4) !== false) {
      var l13194 = given_kws3192;
      if (M2.null_p(l13194) !== false) {
        var if_res2008 = l13194;
      } else {
        if (M2.eq_p(M2.car(l13194), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res2007 = M2.cdr(l13194);
        } else {
          var if_res2007 = l13194;
        }
        var if_res2008 = if_res2007;
      }
      var l13195 = if_res2008;
      var if_res2009 = M2.null_p(l13195);
    } else {
      var if_res2009 = false;
    }
    return if_res2009;
  }, temp2006, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:mode')), with_input_from_file3200);
  var with_output_to_file54 = function(exists493203, exists513204, mode483205, mode503206, path523207, proc533208) {
    var path3209 = path523207;
    var proc3210 = proc533208;
    if (mode503206 !== false) {
      var if_res2010 = mode483205;
    } else {
      var if_res2010 = $rjs_core.Symbol.make("binary");
    }
    var mode3211 = if_res2010;
    if (exists513204 !== false) {
      var if_res2011 = exists493203;
    } else {
      var if_res2011 = $rjs_core.Symbol.make("error");
    }
    var exists3212 = if_res2011;
    if (M4.path_string_p(path3209) !== false) {
      var if_res2012 = M2.rvoid();
    } else {
      var if_res2012 = M2.raise_argument_error($rjs_core.Symbol.make("with-output-to-file"), "path-string?", path3209);
    }
    if_res2012;
    if (M2.procedure_p(proc3210) !== false) {
      var if_res2013 = M2.procedure_arity_includes_p(proc3210, 0);
    } else {
      var if_res2013 = false;
    }
    if (if_res2013 !== false) {
      var if_res2014 = M2.rvoid();
    } else {
      var if_res2014 = M2.raise_argument_error($rjs_core.Symbol.make("with-output-to-file"), "(-> any)", proc3210);
    }
    if_res2014;
    if (M3.memq(mode3211, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res2015 = M2.rvoid();
    } else {
      var if_res2015 = M2.raise_argument_error($rjs_core.Symbol.make("with-output-to-file"), binary_or_text_desc, mode3211);
    }
    if_res2015;
    if (M3.memq(exists3212, exists_syms) !== false) {
      var if_res2016 = M2.rvoid();
    } else {
      var if_res2016 = M2.raise_argument_error($rjs_core.Symbol.make("with-output-to-file"), exists_desc, exists3212);
    }
    if_res2016;
    return M2.with_output_to_file(path3209, proc3210, mode3211, exists3212);
  };
  var unpack55 = function(given_kws3213, given_args3214, path523215, proc533216) {
    if (M2.pair_p(given_kws3213) !== false) {
      var if_res2017 = M2.eq_p($rjs_core.Keyword.make('#:exists'), M2.car(given_kws3213));
    } else {
      var if_res2017 = false;
    }
    var exists513217 = if_res2017;
    if (exists513217 !== false) {
      var if_res2018 = M2.car(given_args3214);
    } else {
      var if_res2018 = M2.rvoid();
    }
    var exists493218 = if_res2018;
    if (exists513217 !== false) {
      var if_res2019 = M2.cdr(given_kws3213);
    } else {
      var if_res2019 = given_kws3213;
    }
    var given_kws3219 = if_res2019;
    if (exists513217 !== false) {
      var if_res2020 = M2.cdr(given_args3214);
    } else {
      var if_res2020 = given_args3214;
    }
    var given_args3220 = if_res2020;
    var mode503221 = M2.pair_p(given_kws3219);
    if (mode503221 !== false) {
      var if_res2021 = M2.car(given_args3220);
    } else {
      var if_res2021 = M2.rvoid();
    }
    var mode483222 = if_res2021;
    return with_output_to_file54(exists493218, exists513217, mode483222, mode503221, path523215, proc533216);
  };
  var cl2024 = function(given_kws3229, given_args3230, path3231, proc3232) {
    return unpack55(given_kws3229, given_args3230, path3231, proc3232);
  };
  var temp2026 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2025 = {'4': cl2024}[arguments.length];
    if (fixed_lam2025 !== undefined !== false) {
      return fixed_lam2025.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl2022 = function(path3234, proc3235) {
    return unpack55(M2.rnull, M2.rnull, path3234, proc3235);
  };
  var with_output_to_file3233 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2023 = {'2': cl2022}[arguments.length];
    if (fixed_lam2023 !== undefined !== false) {
      return fixed_lam2023.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [2]);
  var with_output_to_file56 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3223, given_argc3224) {
    if (M2._eq_(given_argc3224, 4) !== false) {
      var l13225 = given_kws3223;
      if (M2.null_p(l13225) !== false) {
        var if_res2028 = l13225;
      } else {
        if (M2.eq_p(M2.car(l13225), $rjs_core.Keyword.make('#:exists')) !== false) {
          var if_res2027 = M2.cdr(l13225);
        } else {
          var if_res2027 = l13225;
        }
        var if_res2028 = if_res2027;
      }
      var l13226 = if_res2028;
      var l13227 = l13226;
      if (M2.null_p(l13227) !== false) {
        var if_res2030 = l13227;
      } else {
        if (M2.eq_p(M2.car(l13227), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res2029 = M2.cdr(l13227);
        } else {
          var if_res2029 = l13227;
        }
        var if_res2030 = if_res2029;
      }
      var l13228 = if_res2030;
      var if_res2031 = M2.null_p(l13228);
    } else {
      var if_res2031 = false;
    }
    return if_res2031;
  }, temp2026, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:exists'), $rjs_core.Keyword.make('#:mode')), with_output_to_file3233);
  var call_with_input_file_times_61 = function(mode573236, mode583237, path593238, proc603239) {
    var path3240 = path593238;
    var proc3241 = proc603239;
    if (mode583237 !== false) {
      var if_res2032 = mode573236;
    } else {
      var if_res2032 = $rjs_core.Symbol.make("binary");
    }
    var mode3242 = if_res2032;
    if (M4.path_string_p(path3240) !== false) {
      var if_res2033 = M2.rvoid();
    } else {
      var if_res2033 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-input-file*"), "path-string?", path3240);
    }
    if_res2033;
    if (M2.procedure_p(proc3241) !== false) {
      var if_res2034 = M2.procedure_arity_includes_p(proc3241, 1);
    } else {
      var if_res2034 = false;
    }
    if (if_res2034 !== false) {
      var if_res2035 = M2.rvoid();
    } else {
      var if_res2035 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-input-file*"), "(input-port? . -> . any)", proc3241);
    }
    if_res2035;
    if (M3.memq(mode3242, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res2036 = M2.rvoid();
    } else {
      var if_res2036 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-input-file*"), binary_or_text_desc, mode3242);
    }
    if_res2036;
    var p3243 = M2.open_input_file(path3240, mode3242);
    return M2.dynamic_wind(M2.rvoid, function() {
      return proc3241(p3243);
    }, function() {
      return M2.close_input_port(p3243);
    });
  };
  var unpack62 = function(given_kws3244, given_args3245, path593246, proc603247) {
    var mode583248 = M2.pair_p(given_kws3244);
    if (mode583248 !== false) {
      var if_res2037 = M2.car(given_args3245);
    } else {
      var if_res2037 = M2.rvoid();
    }
    var mode573249 = if_res2037;
    return call_with_input_file_times_61(mode573249, mode583248, path593246, proc603247);
  };
  var cl2040 = function(given_kws3254, given_args3255, path3256, proc3257) {
    return unpack62(given_kws3254, given_args3255, path3256, proc3257);
  };
  var temp2042 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2041 = {'4': cl2040}[arguments.length];
    if (fixed_lam2041 !== undefined !== false) {
      return fixed_lam2041.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl2038 = function(path3259, proc3260) {
    return unpack62(M2.rnull, M2.rnull, path3259, proc3260);
  };
  var call_with_input_file_times_3258 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2039 = {'2': cl2038}[arguments.length];
    if (fixed_lam2039 !== undefined !== false) {
      return fixed_lam2039.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [2]);
  var call_with_input_file_times_63 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3250, given_argc3251) {
    if (M2._eq_(given_argc3251, 4) !== false) {
      var l13252 = given_kws3250;
      if (M2.null_p(l13252) !== false) {
        var if_res2044 = l13252;
      } else {
        if (M2.eq_p(M2.car(l13252), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res2043 = M2.cdr(l13252);
        } else {
          var if_res2043 = l13252;
        }
        var if_res2044 = if_res2043;
      }
      var l13253 = if_res2044;
      var if_res2045 = M2.null_p(l13253);
    } else {
      var if_res2045 = false;
    }
    return if_res2045;
  }, temp2042, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:mode')), call_with_input_file_times_3258);
  var call_with_output_file_times_70 = function(exists653261, exists673262, mode643263, mode663264, path683265, proc693266) {
    var path3267 = path683265;
    var proc3268 = proc693266;
    if (mode663264 !== false) {
      var if_res2046 = mode643263;
    } else {
      var if_res2046 = $rjs_core.Symbol.make("binary");
    }
    var mode3269 = if_res2046;
    if (exists673262 !== false) {
      var if_res2047 = exists653261;
    } else {
      var if_res2047 = $rjs_core.Symbol.make("error");
    }
    var exists3270 = if_res2047;
    if (M4.path_string_p(path3267) !== false) {
      var if_res2048 = M2.rvoid();
    } else {
      var if_res2048 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file*"), "path-string?", path3267);
    }
    if_res2048;
    if (M2.procedure_p(proc3268) !== false) {
      var if_res2049 = M2.procedure_arity_includes_p(proc3268, 1);
    } else {
      var if_res2049 = false;
    }
    if (if_res2049 !== false) {
      var if_res2050 = M2.rvoid();
    } else {
      var if_res2050 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file*"), "(output-port? . -> . any)", proc3268);
    }
    if_res2050;
    if (M3.memq(mode3269, $rjs_core.Pair.makeList($rjs_core.Symbol.make("binary"), $rjs_core.Symbol.make("text"))) !== false) {
      var if_res2051 = M2.rvoid();
    } else {
      var if_res2051 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file*"), binary_or_text_desc, mode3269);
    }
    if_res2051;
    if (M3.memq(exists3270, exists_syms) !== false) {
      var if_res2052 = M2.rvoid();
    } else {
      var if_res2052 = M2.raise_argument_error($rjs_core.Symbol.make("call-with-output-file*"), exists_desc, exists3270);
    }
    if_res2052;
    var p3271 = M2.open_output_file(path3267, mode3269, exists3270);
    return M2.dynamic_wind(M2.rvoid, function() {
      return proc3268(p3271);
    }, function() {
      return M2.close_output_port(p3271);
    });
  };
  var unpack71 = function(given_kws3272, given_args3273, path683274, proc693275) {
    if (M2.pair_p(given_kws3272) !== false) {
      var if_res2053 = M2.eq_p($rjs_core.Keyword.make('#:exists'), M2.car(given_kws3272));
    } else {
      var if_res2053 = false;
    }
    var exists673276 = if_res2053;
    if (exists673276 !== false) {
      var if_res2054 = M2.car(given_args3273);
    } else {
      var if_res2054 = M2.rvoid();
    }
    var exists653277 = if_res2054;
    if (exists673276 !== false) {
      var if_res2055 = M2.cdr(given_kws3272);
    } else {
      var if_res2055 = given_kws3272;
    }
    var given_kws3278 = if_res2055;
    if (exists673276 !== false) {
      var if_res2056 = M2.cdr(given_args3273);
    } else {
      var if_res2056 = given_args3273;
    }
    var given_args3279 = if_res2056;
    var mode663280 = M2.pair_p(given_kws3278);
    if (mode663280 !== false) {
      var if_res2057 = M2.car(given_args3279);
    } else {
      var if_res2057 = M2.rvoid();
    }
    var mode643281 = if_res2057;
    return call_with_output_file_times_70(exists653277, exists673276, mode643281, mode663280, path683274, proc693275);
  };
  var cl2060 = function(given_kws3288, given_args3289, path3290, proc3291) {
    return unpack71(given_kws3288, given_args3289, path3290, proc3291);
  };
  var temp2062 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2061 = {'4': cl2060}[arguments.length];
    if (fixed_lam2061 !== undefined !== false) {
      return fixed_lam2061.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [4]);
  var cl2058 = function(path3293, proc3294) {
    return unpack71(M2.rnull, M2.rnull, path3293, proc3294);
  };
  var call_with_output_file_times_3292 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2059 = {'2': cl2058}[arguments.length];
    if (fixed_lam2059 !== undefined !== false) {
      return fixed_lam2059.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [2]);
  var call_with_output_file_times_72 = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3282, given_argc3283) {
    if (M2._eq_(given_argc3283, 4) !== false) {
      var l13284 = given_kws3282;
      if (M2.null_p(l13284) !== false) {
        var if_res2064 = l13284;
      } else {
        if (M2.eq_p(M2.car(l13284), $rjs_core.Keyword.make('#:exists')) !== false) {
          var if_res2063 = M2.cdr(l13284);
        } else {
          var if_res2063 = l13284;
        }
        var if_res2064 = if_res2063;
      }
      var l13285 = if_res2064;
      var l13286 = l13285;
      if (M2.null_p(l13286) !== false) {
        var if_res2066 = l13286;
      } else {
        if (M2.eq_p(M2.car(l13286), $rjs_core.Keyword.make('#:mode')) !== false) {
          var if_res2065 = M2.cdr(l13286);
        } else {
          var if_res2065 = l13286;
        }
        var if_res2066 = if_res2065;
      }
      var l13287 = if_res2066;
      var if_res2067 = M2.null_p(l13287);
    } else {
      var if_res2067 = false;
    }
    return if_res2067;
  }, temp2062, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:exists'), $rjs_core.Keyword.make('#:mode')), call_with_output_file_times_3292);
  var core773295 = function(build_p733296, build_p743297, dir753298, dir763299) {
    if (dir763299 !== false) {
      var if_res2068 = dir753298;
    } else {
      var if_res2068 = M2.current_directory();
    }
    var dir3300 = if_res2068;
    if (build_p743297 !== false) {
      var if_res2069 = build_p733296;
    } else {
      var if_res2069 = false;
    }
    var build_p3301 = if_res2069;
    if (M4.path_string_p(dir3300) !== false) {
      var if_res2070 = M2.rvoid();
    } else {
      var if_res2070 = M2.raise_argument_error($rjs_core.Symbol.make("directory-list"), "path-string?", dir3300);
    }
    if_res2070;
    var content3302 = M1.sort(M2.directory_list(dir3300), M2.path_lt__p);
    if (build_p3301 !== false) {
      var if_res2071 = M0.map(function(i3303) {
        return M2.build_path(dir3300, i3303);
      }, content3302);
    } else {
      var if_res2071 = content3302;
    }
    return if_res2071;
  };
  var unpack783304 = function(given_kws3305, given_args3306, dir753307, dir763308) {
    var build_p743309 = M2.pair_p(given_kws3305);
    if (build_p743309 !== false) {
      var if_res2072 = M2.car(given_args3306);
    } else {
      var if_res2072 = M2.rvoid();
    }
    var build_p733310 = if_res2072;
    return core773295(build_p733310, build_p743309, dir753307, dir763308);
  };
  var cl2076 = function(given_kws3315, given_args3316) {
    return unpack783304(given_kws3315, given_args3316, false, false);
  };
  var cl2077 = function(given_kws3317, given_args3318, dir753319) {
    return unpack783304(given_kws3317, given_args3318, dir753319, true);
  };
  var temp2079 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2078 = {
      '2': cl2076,
      '3': cl2077
    }[arguments.length];
    if (fixed_lam2078 !== undefined !== false) {
      return fixed_lam2078.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [2, 3]);
  var cl2073 = function() {
    return unpack783304(M2.rnull, M2.rnull, false, false);
  };
  var cl2074 = function(dir753321) {
    return unpack783304(M2.rnull, M2.rnull, dir753321, true);
  };
  var directory_list3320 = $rjs_core.attachProcedureArity(function() {
    var fixed_lam2075 = {
      '0': cl2073,
      '1': cl2074
    }[arguments.length];
    if (fixed_lam2075 !== undefined !== false) {
      return fixed_lam2075.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [0, 1]);
  var directory_list = M5.__rjs_quoted__.make_optional_keyword_procedure(function(given_kws3311, given_argc3312) {
    if (M2._gt__eq_(given_argc3312, 2) !== false) {
      var if_res2080 = M2._lt__eq_(given_argc3312, 3);
    } else {
      var if_res2080 = false;
    }
    if (if_res2080 !== false) {
      var l13313 = given_kws3311;
      if (M2.null_p(l13313) !== false) {
        var if_res2082 = l13313;
      } else {
        if (M2.eq_p(M2.car(l13313), $rjs_core.Keyword.make('#:build?')) !== false) {
          var if_res2081 = M2.cdr(l13313);
        } else {
          var if_res2081 = l13313;
        }
        var if_res2082 = if_res2081;
      }
      var l13314 = if_res2082;
      var if_res2083 = M2.null_p(l13314);
    } else {
      var if_res2083 = false;
    }
    return if_res2083;
  }, temp2079, M2.rnull, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:build?')), directory_list3320);
  var __rjs_quoted__ = {};
  __rjs_quoted__.call_with_input_file29 = call_with_input_file29;
  __rjs_quoted__.open_input_output_file22 = open_input_output_file22;
  __rjs_quoted__.call_with_input_file31 = call_with_input_file31;
  __rjs_quoted__.call_with_output_file40 = call_with_output_file40;
  __rjs_quoted__.call_with_input_file_times_61 = call_with_input_file_times_61;
  __rjs_quoted__.open_output_file14 = open_output_file14;
  __rjs_quoted__.call_with_output_file_times_72 = call_with_output_file_times_72;
  __rjs_quoted__.open_output_file16 = open_output_file16;
  __rjs_quoted__.with_output_to_file54 = with_output_to_file54;
  __rjs_quoted__.with_output_to_file56 = with_output_to_file56;
  __rjs_quoted__.with_input_from_file45 = with_input_from_file45;
  __rjs_quoted__.call_with_input_file_times_63 = call_with_input_file_times_63;
  __rjs_quoted__.open_input_file6 = open_input_file6;
  __rjs_quoted__.call_with_output_file38 = call_with_output_file38;
  __rjs_quoted__.with_input_from_file47 = with_input_from_file47;
  __rjs_quoted__.open_input_file8 = open_input_file8;
  __rjs_quoted__.open_input_output_file24 = open_input_output_file24;
  __rjs_quoted__.call_with_output_file_times_70 = call_with_output_file_times_70;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get _directory_list() {
      return directory_list;
    }
  };
})();
var $__modules_47_version_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/version.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var _times_version_times_ = "0.8.1";
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get _times_version_times_() {
      return _times_version_times_;
    }
  };
})();
var $__modules_47_code_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/code.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_racket_47_private_47_kw_45_file_46_rkt_46_js__;
  var M1 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M2 = $__runtime_47_kernel_46_rkt_46_js__;
  var M3 = $__collects_47_racket_47_private_47_kw_46_rkt_46_js__;
  var M4 = $__modules_47_version_46_rkt_46_js__;
  var _times_default_header_times_ = M2.list(M2.string_append("Generated by the Waxeye Parser Generator - version ", M4._times_version_times_), "www.waxeye.org");
  var _times_indent_unit_times_ = 4;
  var _times_indent_level_times_ = 0;
  var indent_unit_bang_ = function(val1569) {
    _times_indent_unit_times_ = val1569;
    return null;
  };
  var dump_string = function(s1570, path1571) {
    var _dot__dot__dot__by_src_by_waxeye_by_code_dot_rkt__5001572 = M0.__rjs_quoted__.call_with_output_file40;
    var path11573 = path1571;
    var temp21574 = function(p1576) {
      return M2.display(s1570, p1576);
    };
    var temp31575 = $rjs_core.Symbol.make("replace");
    if (M2.variable_reference_constant_p(M0.__rjs_quoted__.call_with_output_file40) !== false) {
      var if_res896 = M0.__rjs_quoted__.call_with_output_file38(temp31575, true, false, false, path11573, temp21574);
    } else {
      var if_res896 = M2.checked_procedure_check_and_extract(M3.__rjs_quoted__.struct_keyword_procedure, _dot__dot__dot__by_src_by_waxeye_by_code_dot_rkt__5001572, M3.__rjs_quoted__.keyword_procedure_extract, $rjs_core.Pair.makeList($rjs_core.Keyword.make('#:exists')), 4)($rjs_core.Pair.makeList($rjs_core.Keyword.make('#:exists')), M2.list(temp31575), path11573, temp21574);
    }
    return if_res896;
  };
  var ind = function() {
    return M2.make_string(_times_indent_level_times_, " ");
  };
  var indent_plus_ = function(n1577) {
    _times_indent_level_times_ = _times_indent_level_times_ + n1577;
    return null;
  };
  var indent_ = function(n1578) {
    _times_indent_level_times_ = _times_indent_level_times_ - n1578;
    return null;
  };
  var bool__gt_s = function(b1579) {
    if (b1579 !== false) {
      var if_res897 = "true";
    } else {
      var if_res897 = "false";
    }
    return if_res897;
  };
  var comment_bookend = function(top1580, unit1581, bot1582, lines1583) {
    return M2.string_append(ind(), top1580, "\n", comment_base(unit1581, lines1583), ind(), bot1582, "\n");
  };
  var comment_base = function(unit1584, lines1585) {
    return M2.apply(M2.string_append, M1.map(function(a1586) {
      if (M2.equal_p("", a1586) !== false) {
        var if_res898 = M2.format("~a~a\n", ind(), unit1584);
      } else {
        var if_res898 = M2.format("~a~a ~a\n", ind(), unit1584, a1586);
      }
      return if_res898;
    }, lines1585));
  };
  var script_comment = function(lines1587) {
    return comment_base("#", lines1587);
  };
  var camel_case_lower = function(s1588) {
    var sl1589 = M2.string__gt_list(s1588);
    if (M2.null_p(sl1589) !== false) {
      var if_res899 = "";
    } else {
      var if_res899 = M2.list__gt_string(M2.cons(M2.char_downcase(M2.car(sl1589)), M2.cdr(sl1589)));
    }
    return if_res899;
  };
  var camel_case_upper = function(s1590) {
    var sl1591 = M2.string__gt_list(s1590);
    if (M2.null_p(sl1591) !== false) {
      var if_res900 = "";
    } else {
      var if_res900 = M2.list__gt_string(M2.cons(M2.char_upcase(M2.car(sl1591)), M2.cdr(sl1591)));
    }
    return if_res900;
  };
  var string__gt_upper = function(s1592) {
    return M2.list__gt_string(M1.map(M2.char_upcase, M2.string__gt_list(s1592)));
  };
  var escape_for_java_char_p = function(ch1593) {
    var or_part1594 = M2.equal_p(ch1593, "\\");
    if (or_part1594 !== false) {
      var if_res901 = or_part1594;
    } else {
      var if_res901 = M2.equal_p(ch1593, "'");
    }
    return if_res901;
  };
  var escape_java_string = function(s1595) {
    var escape_java_string_iter1596 = function(sl1597) {
      if (M2.null_p(sl1597) !== false) {
        var if_res903 = $rjs_core.Pair.Empty;
      } else {
        if (M2.equal_p(M2.car(sl1597), "\"") !== false) {
          var if_res902 = M2.cons("\\", M2.cons("\"", escape_java_string_iter1596(M2.cdr(sl1597))));
        } else {
          var if_res902 = M2.cons(M2.car(sl1597), escape_java_string_iter1596(M2.cdr(sl1597)));
        }
        var if_res903 = if_res902;
      }
      return if_res903;
    };
    return M2.list__gt_string(escape_java_string_iter1596(M2.string__gt_list(s1595)));
  };
  var __rjs_quoted__ = {};
  __rjs_quoted__.indent_ = indent_;
  __rjs_quoted__.indent_plus_ = indent_plus_;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get _times_default_header_times_() {
      return _times_default_header_times_;
    },
    get _times_indent_unit_times_() {
      return _times_indent_unit_times_;
    },
    get _times_indent_level_times_() {
      return _times_indent_level_times_;
    },
    get indent_unit_bang_() {
      return indent_unit_bang_;
    },
    get dump_string() {
      return dump_string;
    },
    get ind() {
      return ind;
    },
    get indent_plus_() {
      return indent_plus_;
    },
    get indent_() {
      return indent_;
    },
    get bool__gt_s() {
      return bool__gt_s;
    },
    get comment_bookend() {
      return comment_bookend;
    },
    get comment_base() {
      return comment_base;
    },
    get script_comment() {
      return script_comment;
    },
    get camel_case_lower() {
      return camel_case_lower;
    },
    get camel_case_upper() {
      return camel_case_upper;
    },
    get string__gt_upper() {
      return string__gt_upper;
    },
    get escape_for_java_char_p() {
      return escape_for_java_char_p;
    },
    get escape_java_string() {
      return escape_java_string;
    }
  };
})();
var $__modules_47_javascript_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/javascript.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__modules_47_code_46_rkt_46_js__;
  var M1 = $__collects_47_racket_47_private_47_map_46_rkt_46_js__;
  var M2 = $__modules_47_gen_46_rkt_46_js__;
  var M3 = $__runtime_47_kernel_46_rkt_46_js__;
  var M4 = $__collects_47_waxeye_47_ast_46_rkt_46_js__;
  var M5 = $__collects_47_racket_47_list_46_rkt_46_js__;
  var M6 = $__runtime_47_unsafe_46_rkt_46_js__;
  var javascript_comment = function(lines475) {
    return M0.comment_bookend("/*", " *", " */", lines475);
  };
  var gen_javascript = function(grammar476, path477) {
    M0.indent_unit_bang_(4);
    if (M2._times_name_prefix_times_ !== false) {
      var if_res184 = M3.string_append(M3.string_downcase(M2._times_name_prefix_times_), "_parser.js");
    } else {
      var if_res184 = "parser.js";
    }
    var file_path478 = M3.string_append(path477, if_res184);
    M0.dump_string(gen_parser(grammar476), file_path478);
    return M3.list(file_path478);
  };
  var gen_literal = function(a479) {
    var gen_char480 = function(t481) {
      if (M0.escape_for_java_char_p(t481) !== false) {
        var if_res189 = "\\";
      } else {
        var if_res189 = "";
      }
      if (M3.equal_p(t481, "\"") !== false) {
        var if_res188 = "\\\"";
      } else {
        if (M3.equal_p(t481, "\n") !== false) {
          var if_res187 = "\\n";
        } else {
          if (M3.equal_p(t481, "\t") !== false) {
            var if_res186 = "\\t";
          } else {
            if (M3.equal_p(t481, "\r") !== false) {
              var if_res185 = "\\r";
            } else {
              var if_res185 = t481;
            }
            var if_res186 = if_res185;
          }
          var if_res187 = if_res186;
        }
        var if_res188 = if_res187;
      }
      return M3.format("'~a~a'", if_res189, if_res188);
    };
    return gen_array(gen_char480, a479);
  };
  var gen_char_class = function(a482) {
    var gen_char_class_item483 = function(a484) {
      if (M3.char_p(a484) !== false) {
        var if_res190 = M3.format("0x~x", M3.char__gt_integer(a484));
      } else {
        var if_res190 = M3.format("[0x~x, 0x~x]", M3.char__gt_integer(M3.car(a484)), M3.char__gt_integer(M3.cdr(a484)));
      }
      return if_res190;
    };
    if (M3.symbol_p(a482) !== false) {
      var if_res193 = "-1";
    } else {
      if (M3.list_p(a482) !== false) {
        var if_res192 = gen_array(gen_char_class_item483, a482);
      } else {
        if (M3.char_p(a482) !== false) {
          var if_res191 = gen_char_class_item483(a482);
        } else {
          var if_res191 = a482;
        }
        var if_res192 = if_res191;
      }
      var if_res193 = if_res192;
    }
    return if_res193;
  };
  var gen_exp = function(a485) {
    var tmp486 = M4.ast_t(a485);
    if (M3.symbol_p(tmp486) !== false) {
      var if_res208 = M3.hash_ref($rjs_core.Hash.makeEq([[$rjs_core.Symbol.make("sequence"), 10], [$rjs_core.Symbol.make("identifier"), 2], [$rjs_core.Symbol.make("optional"), 8], [$rjs_core.Symbol.make("not"), 7], [$rjs_core.Symbol.make("closure"), 11], [$rjs_core.Symbol.make("charClass"), 5], [$rjs_core.Symbol.make("void"), 3], [$rjs_core.Symbol.make("alternation"), 9], [$rjs_core.Symbol.make("plus"), 12], [$rjs_core.Symbol.make("wildCard"), 1], [$rjs_core.Symbol.make("and"), 6], [$rjs_core.Symbol.make("literal"), 4]], false), tmp486, function() {
        return 0;
      });
    } else {
      var if_res208 = 0;
    }
    var index487 = if_res208;
    if (M6.unsafe_fx_lt_(index487, 6) !== false) {
      if (M6.unsafe_fx_lt_(index487, 2) !== false) {
        if (M6.unsafe_fx_lt_(index487, 1) !== false) {
          var if_res209 = M3.format("unknown:~a", M4.ast_t(a485));
        } else {
          var if_res209 = "ANY";
        }
        var if_res214 = if_res209;
      } else {
        if (M6.unsafe_fx_lt_(index487, 3) !== false) {
          var if_res213 = "NT";
        } else {
          if (M6.unsafe_fx_lt_(index487, 4) !== false) {
            var if_res212 = "VOID";
          } else {
            if (M6.unsafe_fx_lt_(index487, 5) !== false) {
              if (M3._lt__eq_(M3.length(M4.ast_c(a485)), 1) !== false) {
                var if_res210 = "CHAR";
              } else {
                var if_res210 = "SEQ";
              }
              var if_res211 = if_res210;
            } else {
              var if_res211 = "CHAR_CLASS";
            }
            var if_res212 = if_res211;
          }
          var if_res213 = if_res212;
        }
        var if_res214 = if_res213;
      }
      var if_res221 = if_res214;
    } else {
      if (M6.unsafe_fx_lt_(index487, 9) !== false) {
        if (M6.unsafe_fx_lt_(index487, 7) !== false) {
          var if_res216 = "AND";
        } else {
          if (M6.unsafe_fx_lt_(index487, 8) !== false) {
            var if_res215 = "NOT";
          } else {
            var if_res215 = "OPT";
          }
          var if_res216 = if_res215;
        }
        var if_res220 = if_res216;
      } else {
        if (M6.unsafe_fx_lt_(index487, 10) !== false) {
          var if_res219 = "ALT";
        } else {
          if (M6.unsafe_fx_lt_(index487, 11) !== false) {
            var if_res218 = "SEQ";
          } else {
            if (M6.unsafe_fx_lt_(index487, 12) !== false) {
              var if_res217 = "STAR";
            } else {
              var if_res217 = "PLUS";
            }
            var if_res218 = if_res217;
          }
          var if_res219 = if_res218;
        }
        var if_res220 = if_res219;
      }
      var if_res221 = if_res220;
    }
    var tmp488 = M4.ast_t(a485);
    if (M3.symbol_p(tmp488) !== false) {
      var if_res194 = M3.hash_ref($rjs_core.Hash.makeEq([[$rjs_core.Symbol.make("sequence"), 10], [$rjs_core.Symbol.make("identifier"), 2], [$rjs_core.Symbol.make("optional"), 8], [$rjs_core.Symbol.make("not"), 7], [$rjs_core.Symbol.make("closure"), 11], [$rjs_core.Symbol.make("charClass"), 5], [$rjs_core.Symbol.make("void"), 3], [$rjs_core.Symbol.make("alternation"), 9], [$rjs_core.Symbol.make("plus"), 12], [$rjs_core.Symbol.make("wildCard"), 1], [$rjs_core.Symbol.make("and"), 6], [$rjs_core.Symbol.make("literal"), 4]], false), tmp488, function() {
        return 0;
      });
    } else {
      var if_res194 = 0;
    }
    var index489 = if_res194;
    if (M6.unsafe_fx_lt_(index489, 6) !== false) {
      if (M6.unsafe_fx_lt_(index489, 2) !== false) {
        if (M6.unsafe_fx_lt_(index489, 1) !== false) {
          var if_res195 = M3.format("unknown:~a", M4.ast_t(a485));
        } else {
          var if_res195 = "[]";
        }
        var if_res200 = if_res195;
      } else {
        if (M6.unsafe_fx_lt_(index489, 3) !== false) {
          var if_res199 = M3.format("['~a']", M3.list__gt_string(M4.ast_c(a485)));
        } else {
          if (M6.unsafe_fx_lt_(index489, 4) !== false) {
            var if_res198 = gen_array(gen_exp, M4.ast_c(a485));
          } else {
            if (M6.unsafe_fx_lt_(index489, 5) !== false) {
              if (M3._lt__eq_(M3.length(M4.ast_c(a485)), 1) !== false) {
                var if_res196 = gen_literal(M4.ast_c(a485));
              } else {
                var if_res196 = gen_array(gen_exp, M1.map(function(b490) {
                  return M4.__rjs_quoted__.ast1($rjs_core.Symbol.make("literal"), M3.cons(b490, $rjs_core.Pair.Empty), $rjs_core.Pair.Empty);
                }, M4.ast_c(a485)));
              }
              var if_res197 = if_res196;
            } else {
              var if_res197 = gen_char_class(M4.ast_c(a485));
            }
            var if_res198 = if_res197;
          }
          var if_res199 = if_res198;
        }
        var if_res200 = if_res199;
      }
      var if_res207 = if_res200;
    } else {
      if (M6.unsafe_fx_lt_(index489, 9) !== false) {
        if (M6.unsafe_fx_lt_(index489, 7) !== false) {
          var if_res202 = gen_array(gen_exp, M4.ast_c(a485));
        } else {
          if (M6.unsafe_fx_lt_(index489, 8) !== false) {
            var if_res201 = gen_array(gen_exp, M4.ast_c(a485));
          } else {
            var if_res201 = gen_array(gen_exp, M4.ast_c(a485));
          }
          var if_res202 = if_res201;
        }
        var if_res206 = if_res202;
      } else {
        if (M6.unsafe_fx_lt_(index489, 10) !== false) {
          var if_res205 = gen_array(gen_exp, M4.ast_c(a485));
        } else {
          if (M6.unsafe_fx_lt_(index489, 11) !== false) {
            var if_res204 = gen_array(gen_exp, M4.ast_c(a485));
          } else {
            if (M6.unsafe_fx_lt_(index489, 12) !== false) {
              var if_res203 = gen_array(gen_exp, M4.ast_c(a485));
            } else {
              var if_res203 = gen_array(gen_exp, M4.ast_c(a485));
            }
            var if_res204 = if_res203;
          }
          var if_res205 = if_res204;
        }
        var if_res206 = if_res205;
      }
      var if_res207 = if_res206;
    }
    return M3.format("{type:'~a', args:~a}", if_res221, if_res207);
  };
  var gen_def = function(a491) {
    var temp225 = M3.list__gt_string(M4.ast_c(M3.list_ref(M4.ast_c(a491), 0)));
    var tmp492 = M4.ast_t(M3.list_ref(M4.ast_c(a491), 1));
    if (M3.equal_p(tmp492, $rjs_core.Symbol.make("voidArrow")) !== false) {
      var if_res224 = "VOIDING";
    } else {
      if (M3.equal_p(tmp492, $rjs_core.Symbol.make("pruneArrow")) !== false) {
        var if_res223 = "PRUNING";
      } else {
        if (M3.equal_p(tmp492, $rjs_core.Symbol.make("leftArrow")) !== false) {
          var if_res222 = "NORMAL";
        } else {
          var if_res222 = M3.rvoid();
        }
        var if_res223 = if_res222;
      }
      var if_res224 = if_res223;
    }
    return M3.format("'~a' : { mode : waxeye.Modes.~a, exp : ~a }", temp225, if_res224, gen_exp(M3.list_ref(M4.ast_c(a491), 2)));
  };
  var gen_defs = function(a493) {
    return gen_map(gen_def, M4.ast_c(a493));
  };
  var gen_map = function(fn494, data495) {
    M0.indent_plus_(1);
    if (M3.null_p(data495) !== false) {
      var if_res226 = "";
    } else {
      var if_res226 = M3.string_append(fn494(M3.car(data495)), M3.apply(M3.string_append, M1.map(function(a497) {
        return M3.string_append(",\n", M0.ind(), fn494(a497));
      }, M3.cdr(data495))));
    }
    var val496 = if_res226;
    M0.indent_(1);
    return M3.format("{~a}", val496);
  };
  var gen_array = function(fn498, data499) {
    M0.indent_plus_(1);
    if (M3.null_p(data499) !== false) {
      var if_res228 = "";
    } else {
      var temp1501 = M1.map(fn498, data499);
      var temp2502 = ", ";
      if (M3.variable_reference_constant_p(M5.__rjs_quoted__.add_between37) !== false) {
        var if_res227 = M5.__rjs_quoted__.add_between35(false, false, false, false, false, false, false, false, temp1501, temp2502);
      } else {
        var if_res227 = M5.__rjs_quoted__.add_between37(temp1501, temp2502);
      }
      var if_res228 = M3.apply(M3.string_append, if_res227);
    }
    var val500 = if_res228;
    M0.indent_(1);
    return M3.format("[~a]", val500);
  };
  var gen_parser = function(grammar503) {
    if (M2._times_name_prefix_times_ !== false) {
      var if_res229 = M3.string_append(M0.camel_case_upper(M2._times_name_prefix_times_), "Parser");
    } else {
      var if_res229 = "Parser";
    }
    var parser_name504 = if_res229;
    var gen_parser_class505 = function() {
      var temp230 = M0.ind();
      M0.indent_plus_(1);
      var val506 = M3.format("\n~avar parser = function() { return this; };\n~aparser.prototype = new waxeye.WaxeyeParser(\n~a~a~a\n~a~a, '~a');\n~areturn parser;\n", M0.ind(), M0.ind(), M0.ind(), M0.ind(), gen_defs(grammar503), M0.ind(), M0.ind(), M2._times_start_name_times_, M0.ind());
      M0.indent_(1);
      return M3.format("\n~avar ~a = (function() {\n~a \n~a})();\n", temp230, parser_name504, val506, M0.ind());
    };
    var gen_nodejs_imports507 = function() {
      M0.indent_plus_(1);
      var val508 = M3.format("\nvar waxeye = waxeye;\nif (typeof module !== 'undefined') {\n~a// require from module system\n~awaxeye = require('waxeye');\n}\n", M0.ind(), M0.ind());
      M0.indent_(1);
      return val508;
    };
    var gen_nodejs_exports509 = function() {
      M0.indent_plus_(1);
      var val510 = M3.format("\n// Add to module system\nif (typeof module !== 'undefined') {\n~amodule.exports.~a = ~a;\n}\n", M0.ind(), parser_name504, parser_name504);
      M0.indent_(1);
      return val510;
    };
    if (M2._times_file_header_times_ !== false) {
      var if_res231 = javascript_comment(M2._times_file_header_times_);
    } else {
      var if_res231 = javascript_comment(M0._times_default_header_times_);
    }
    return M3.format("~a~a~a~a", if_res231, gen_nodejs_imports507(), gen_parser_class505(), gen_nodejs_exports509());
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get gen_javascript_parser() {
      return gen_parser;
    },
    get gen_javascript() {
      return gen_javascript;
    }
  };
})();
var $__collects_47_waxeye_47_set_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/waxeye/set.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var within_set_p = function(a1685, b1686) {
    if (M0.null_p(a1685) !== false) {
      var if_res967 = false;
    } else {
      var aa1687 = M0.car(a1685);
      if (M0.char_p(aa1687) !== false) {
        if (M0.char_eq__p(aa1687, b1686) !== false) {
          var if_res962 = true;
        } else {
          if (M0.char_lt__p(aa1687, b1686) !== false) {
            var if_res961 = within_set_p(M0.cdr(a1685), b1686);
          } else {
            var if_res961 = false;
          }
          var if_res962 = if_res961;
        }
        var if_res966 = if_res962;
      } else {
        if (M0.char_lt__eq__p(M0.car(aa1687), b1686) !== false) {
          var if_res963 = M0.char_lt__eq__p(b1686, M0.cdr(aa1687));
        } else {
          var if_res963 = false;
        }
        if (if_res963 !== false) {
          var if_res965 = true;
        } else {
          if (M0.char_lt__p(M0.cdr(aa1687), b1686) !== false) {
            var if_res964 = within_set_p(M0.cdr(a1685), b1686);
          } else {
            var if_res964 = false;
          }
          var if_res965 = if_res964;
        }
        var if_res966 = if_res965;
      }
      var if_res967 = if_res966;
    }
    return if_res967;
  };
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get within_set_p() {
      return within_set_p;
    }
  };
})();
var $__collects_47_waxeye_47_fa_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/waxeye/fa.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var let_result265 = M0.make_struct_type($rjs_core.Symbol.make("edge"), false, 3, 0, false, M0.rnull, M0.current_inspector(), false, $rjs_core.Pair.Empty, false, $rjs_core.Symbol.make("edge"));
  var struct_601 = let_result265.getAt(0);
  var make_602 = let_result265.getAt(1);
  var _p603 = let_result265.getAt(2);
  var _ref604 = let_result265.getAt(3);
  var _set_bang_605 = let_result265.getAt(4);
  var let_result266 = M0.values(struct_601, make_602, _p603, M0.make_struct_field_accessor(_ref604, 0, $rjs_core.Symbol.make("t")), M0.make_struct_field_accessor(_ref604, 1, $rjs_core.Symbol.make("s")), M0.make_struct_field_accessor(_ref604, 2, $rjs_core.Symbol.make("v")), M0.make_struct_field_mutator(_set_bang_605, 0, $rjs_core.Symbol.make("t")), M0.make_struct_field_mutator(_set_bang_605, 1, $rjs_core.Symbol.make("s")), M0.make_struct_field_mutator(_set_bang_605, 2, $rjs_core.Symbol.make("v")));
  var struct_edge = let_result266.getAt(0);
  var edge1 = let_result266.getAt(1);
  var edge_p = let_result266.getAt(2);
  var edge_t = let_result266.getAt(3);
  var edge_s = let_result266.getAt(4);
  var edge_v = let_result266.getAt(5);
  var set_edge_t_bang_ = let_result266.getAt(6);
  var set_edge_s_bang_ = let_result266.getAt(7);
  var set_edge_v_bang_ = let_result266.getAt(8);
  var let_result267 = M0.make_struct_type($rjs_core.Symbol.make("state"), false, 2, 0, false, M0.rnull, M0.current_inspector(), false, $rjs_core.Pair.Empty, false, $rjs_core.Symbol.make("state"));
  var struct_606 = let_result267.getAt(0);
  var make_607 = let_result267.getAt(1);
  var _p608 = let_result267.getAt(2);
  var _ref609 = let_result267.getAt(3);
  var _set_bang_610 = let_result267.getAt(4);
  var let_result268 = M0.values(struct_606, make_607, _p608, M0.make_struct_field_accessor(_ref609, 0, $rjs_core.Symbol.make("edges")), M0.make_struct_field_accessor(_ref609, 1, $rjs_core.Symbol.make("match")), M0.make_struct_field_mutator(_set_bang_610, 0, $rjs_core.Symbol.make("edges")), M0.make_struct_field_mutator(_set_bang_610, 1, $rjs_core.Symbol.make("match")));
  var struct_state = let_result268.getAt(0);
  var state2 = let_result268.getAt(1);
  var state_p = let_result268.getAt(2);
  var state_edges = let_result268.getAt(3);
  var state_match = let_result268.getAt(4);
  var set_state_edges_bang_ = let_result268.getAt(5);
  var set_state_match_bang_ = let_result268.getAt(6);
  var let_result269 = M0.make_struct_type($rjs_core.Symbol.make("fa"), false, 3, 0, false, M0.rnull, M0.current_inspector(), false, $rjs_core.Pair.makeList(0, 1, 2), false, $rjs_core.Symbol.make("fa"));
  var struct_611 = let_result269.getAt(0);
  var make_612 = let_result269.getAt(1);
  var _p613 = let_result269.getAt(2);
  var _ref614 = let_result269.getAt(3);
  var _set_bang_615 = let_result269.getAt(4);
  var let_result270 = M0.values(struct_611, make_612, _p613, M0.make_struct_field_accessor(_ref614, 0, $rjs_core.Symbol.make("type")), M0.make_struct_field_accessor(_ref614, 1, $rjs_core.Symbol.make("states")), M0.make_struct_field_accessor(_ref614, 2, $rjs_core.Symbol.make("mode")));
  var struct_fa = let_result270.getAt(0);
  var fa3 = let_result270.getAt(1);
  var fa_p = let_result270.getAt(2);
  var fa_type = let_result270.getAt(3);
  var fa_states = let_result270.getAt(4);
  var fa_mode = let_result270.getAt(5);
  var __rjs_quoted__ = {};
  __rjs_quoted__.set_edge_v_bang_ = set_edge_v_bang_;
  __rjs_quoted__.set_edge_t_bang_ = set_edge_t_bang_;
  __rjs_quoted__.state2 = state2;
  __rjs_quoted__.set_edge_s_bang_ = set_edge_s_bang_;
  __rjs_quoted__.state_match = state_match;
  __rjs_quoted__.struct_fa = struct_fa;
  __rjs_quoted__.set_state_edges_bang_ = set_state_edges_bang_;
  __rjs_quoted__.edge_s = edge_s;
  __rjs_quoted__.fa_p = fa_p;
  __rjs_quoted__.edge_t = edge_t;
  __rjs_quoted__.set_state_match_bang_ = set_state_match_bang_;
  __rjs_quoted__.struct_state = struct_state;
  __rjs_quoted__.edge1 = edge1;
  __rjs_quoted__.edge_p = edge_p;
  __rjs_quoted__.state_p = state_p;
  __rjs_quoted__.fa_type = fa_type;
  __rjs_quoted__.fa_mode = fa_mode;
  __rjs_quoted__.state_edges = state_edges;
  __rjs_quoted__.fa_states = fa_states;
  __rjs_quoted__.edge_v = edge_v;
  __rjs_quoted__.struct_edge = struct_edge;
  __rjs_quoted__.fa3 = fa3;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get struct_edge() {
      return struct_edge;
    },
    get edge_p() {
      return edge_p;
    },
    get edge_t() {
      return edge_t;
    },
    get edge_s() {
      return edge_s;
    },
    get edge_v() {
      return edge_v;
    },
    get set_edge_t_bang_() {
      return set_edge_t_bang_;
    },
    get set_edge_s_bang_() {
      return set_edge_s_bang_;
    },
    get set_edge_v_bang_() {
      return set_edge_v_bang_;
    },
    get struct_state() {
      return struct_state;
    },
    get state_p() {
      return state_p;
    },
    get state_edges() {
      return state_edges;
    },
    get state_match() {
      return state_match;
    },
    get set_state_edges_bang_() {
      return set_state_edges_bang_;
    },
    get set_state_match_bang_() {
      return set_state_match_bang_;
    },
    get struct_fa() {
      return struct_fa;
    },
    get fa_p() {
      return fa_p;
    },
    get fa_type() {
      return fa_type;
    },
    get fa_states() {
      return fa_states;
    },
    get fa_mode() {
      return fa_mode;
    }
  };
})();
var $__collects_47_waxeye_47_parser_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "collects/waxeye/parser.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__collects_47_waxeye_47_set_46_rkt_46_js__;
  var M1 = $__runtime_47_kernel_46_rkt_46_js__;
  var M2 = $__collects_47_waxeye_47_ast_46_rkt_46_js__;
  var M3 = $__collects_47_waxeye_47_fa_46_rkt_46_js__;
  var let_result271 = M1.make_struct_type($rjs_core.Symbol.make("cache-item"), false, 5, 0, false, M1.rnull, M1.current_inspector(), false, $rjs_core.Pair.makeList(0, 1, 2, 3, 4), false, $rjs_core.Symbol.make("cache-item"));
  var struct_616 = let_result271.getAt(0);
  var make_617 = let_result271.getAt(1);
  var _p618 = let_result271.getAt(2);
  var _ref619 = let_result271.getAt(3);
  var _set_bang_620 = let_result271.getAt(4);
  var let_result272 = M1.values(struct_616, make_617, _p618, M1.make_struct_field_accessor(_ref619, 0, $rjs_core.Symbol.make("val")), M1.make_struct_field_accessor(_ref619, 1, $rjs_core.Symbol.make("pos")), M1.make_struct_field_accessor(_ref619, 2, $rjs_core.Symbol.make("line")), M1.make_struct_field_accessor(_ref619, 3, $rjs_core.Symbol.make("col")), M1.make_struct_field_accessor(_ref619, 4, $rjs_core.Symbol.make("cr")));
  var struct_cache_item = let_result272.getAt(0);
  var cache_item1 = let_result272.getAt(1);
  var cache_item_p = let_result272.getAt(2);
  var cache_item_val = let_result272.getAt(3);
  var cache_item_pos = let_result272.getAt(4);
  var cache_item_line = let_result272.getAt(5);
  var cache_item_col = let_result272.getAt(6);
  var cache_item_cr = let_result272.getAt(7);
  var make_parser = function(start621, eof_check622, automata623) {
    return function(input624) {
      var input_len625 = M1.string_length(input624);
      var input_pos626 = 0;
      var line627 = 1;
      var column628 = 0;
      var last_cr629 = false;
      var error_pos630 = 0;
      var error_line631 = 1;
      var error_col632 = 0;
      var error_expected633 = $rjs_core.Pair.Empty;
      var fa_stack634 = $rjs_core.Pair.Empty;
      var cache635 = M1.make_hash();
      var match_automaton636 = function(index644) {
        var key645 = M1.cons(index644, input_pos626);
        var value646 = M1.hash_ref(cache635, key645, false);
        if (value646 !== false) {
          restore_pos641(cache_item_pos(value646), cache_item_line(value646), cache_item_col(value646), cache_item_cr(value646));
          var if_res282 = cache_item_val(value646);
        } else {
          var automaton647 = M1.vector_ref(automata623, index644);
          var type648 = M3.fa_type(automaton647);
          var states649 = M3.fa_states(automaton647);
          var automaton_mode650 = M3.fa_mode(automaton647);
          fa_stack634 = M1.cons(M1.cons(automaton647, false), fa_stack634);
          var start_pos652 = input_pos626;
          var start_line653 = line627;
          var start_col654 = column628;
          var start_cr655 = last_cr629;
          var res656 = match_state637(M1.vector_ref(states649, 0));
          if (M1.equal_p(type648, $rjs_core.Symbol.make("&")) !== false) {
            restore_pos641(start_pos652, start_line653, start_col654, start_cr655);
            var if_res281 = M1.not(M1.not(res656));
          } else {
            if (M1.equal_p(type648, $rjs_core.Symbol.make("!")) !== false) {
              restore_pos641(start_pos652, start_line653, start_col654, start_cr655);
              if (res656 !== false) {
                var if_res273 = update_error643();
              } else {
                var if_res273 = true;
              }
              var if_res280 = if_res273;
            } else {
              if (res656 !== false) {
                var tmp657 = automaton_mode650;
                if (M1.equal_p(tmp657, $rjs_core.Symbol.make("voidArrow")) !== false) {
                  var if_res278 = true;
                } else {
                  if (M1.equal_p(tmp657, $rjs_core.Symbol.make("pruneArrow")) !== false) {
                    if (M1.null_p(res656) !== false) {
                      var if_res275 = true;
                    } else {
                      if (M1.null_p(M1.cdr(res656)) !== false) {
                        var if_res274 = M1.car(res656);
                      } else {
                        var if_res274 = M2.__rjs_quoted__.ast1(type648, res656, M1.cons(start_pos652, input_pos626));
                      }
                      var if_res275 = if_res274;
                    }
                    var if_res277 = if_res275;
                  } else {
                    if (M1.equal_p(tmp657, $rjs_core.Symbol.make("leftArrow")) !== false) {
                      var if_res276 = M2.__rjs_quoted__.ast1(type648, res656, M1.cons(start_pos652, input_pos626));
                    } else {
                      var if_res276 = M1.error($rjs_core.Symbol.make("waxeye"), "Unknown automaton mode");
                    }
                    var if_res277 = if_res276;
                  }
                  var if_res278 = if_res277;
                }
                var if_res279 = if_res278;
              } else {
                var if_res279 = update_error643();
              }
              var if_res280 = if_res279;
            }
            var if_res281 = if_res280;
          }
          var v651 = if_res281;
          fa_stack634 = M1.cdr(fa_stack634);
          M1.hash_set_bang_(cache635, key645, cache_item1(v651, input_pos626, line627, column628, last_cr629));
          var if_res282 = v651;
        }
        return if_res282;
      };
      var match_state637 = function(state658) {
        var res659 = match_edges638(M3.state_edges(state658));
        if (res659 !== false) {
          var if_res284 = res659;
        } else {
          if (M3.state_match(state658) !== false) {
            var if_res283 = $rjs_core.Pair.Empty;
          } else {
            var if_res283 = false;
          }
          var if_res284 = if_res283;
        }
        return if_res284;
      };
      var match_edges638 = function(edges660) {
        if (M1.null_p(edges660) !== false) {
          var if_res286 = false;
        } else {
          var res661 = match_edge639(M1.car(edges660));
          if (res661 !== false) {
            var if_res285 = res661;
          } else {
            var if_res285 = match_edges638(M1.cdr(edges660));
          }
          var if_res286 = if_res285;
        }
        return if_res286;
      };
      var match_edge639 = function(edge662) {
        var start_pos663 = input_pos626;
        var start_line664 = line627;
        var start_col665 = column628;
        var start_cr666 = last_cr629;
        var t667 = M3.edge_t(edge662);
        if (M1.equal_p($rjs_core.Symbol.make("wild"), t667) !== false) {
          if (M1._lt_(input_pos626, input_len625) !== false) {
            var if_res287 = mv640();
          } else {
            var if_res287 = record_error642();
          }
          var if_res295 = if_res287;
        } else {
          if (M1.char_p(t667) !== false) {
            if (M1._lt_(input_pos626, input_len625) !== false) {
              var if_res288 = M1.equal_p(M1.string_ref(input624, input_pos626), t667);
            } else {
              var if_res288 = false;
            }
            if (if_res288 !== false) {
              var if_res289 = mv640();
            } else {
              var if_res289 = record_error642();
            }
            var if_res294 = if_res289;
          } else {
            if (M1.pair_p(t667) !== false) {
              if (M1._lt_(input_pos626, input_len625) !== false) {
                var if_res290 = M0.within_set_p(t667, M1.string_ref(input624, input_pos626));
              } else {
                var if_res290 = false;
              }
              if (if_res290 !== false) {
                var if_res291 = mv640();
              } else {
                var if_res291 = record_error642();
              }
              var if_res293 = if_res291;
            } else {
              if (M1.integer_p(t667) !== false) {
                var if_res292 = match_automaton636(t667);
              } else {
                var if_res292 = false;
              }
              var if_res293 = if_res292;
            }
            var if_res294 = if_res293;
          }
          var if_res295 = if_res294;
        }
        var res668 = if_res295;
        if (res668 !== false) {
          var tran_res669 = match_state637(M1.vector_ref(M3.fa_states(M1.caar(fa_stack634)), M3.edge_s(edge662)));
          if (tran_res669 !== false) {
            var or_part670 = M3.edge_v(edge662);
            if (or_part670 !== false) {
              var if_res296 = or_part670;
            } else {
              var if_res296 = M1.equal_p(res668, true);
            }
            if (if_res296 !== false) {
              var if_res297 = tran_res669;
            } else {
              var if_res297 = M1.cons(res668, tran_res669);
            }
            var if_res298 = if_res297;
          } else {
            restore_pos641(start_pos663, start_line664, start_col665, start_cr666);
            var if_res298 = false;
          }
          var if_res299 = if_res298;
        } else {
          var if_res299 = false;
        }
        return if_res299;
      };
      var mv640 = function() {
        var ch671 = M1.string_ref(input624, input_pos626);
        input_pos626 = input_pos626 + 1;
        if (M1.char_eq__p(ch671, "\r") !== false) {
          line627 = line627 + 1;
          column628 = 0;
          last_cr629 = true;
          var if_res302 = null;
        } else {
          if (M1.char_eq__p(ch671, "\n") !== false) {
            if (last_cr629 !== false) {
              var if_res300 = M1.rvoid();
            } else {
              line627 = line627 + 1;
              column628 = 0;
              var if_res300 = null;
            }
            var if_res301 = if_res300;
          } else {
            column628 = column628 + 1;
            var if_res301 = null;
          }
          if_res301;
          last_cr629 = false;
          var if_res302 = null;
        }
        if_res302;
        return ch671;
      };
      var restore_pos641 = function(p672, l673, c674, cr675) {
        input_pos626 = p672;
        line627 = l673;
        column628 = c674;
        last_cr629 = cr675;
        return null;
      };
      var record_error642 = function() {
        if (M1._lt_(error_pos630, input_pos626) !== false) {
          error_pos630 = input_pos626;
          error_line631 = line627;
          error_col632 = column628;
          error_expected633 = $rjs_core.Pair.Empty;
          var if_res303 = null;
        } else {
          var if_res303 = M1.rvoid();
        }
        if_res303;
        if (M1._lt__eq_(error_pos630, input_pos626) !== false) {
          fa_stack634 = M1.cons(M1.cons(M1.caar(fa_stack634), true), M1.cdr(fa_stack634));
          var if_res304 = null;
        } else {
          var if_res304 = M1.rvoid();
        }
        if_res304;
        return false;
      };
      var update_error643 = function() {
        if (M1.cdar(fa_stack634) !== false) {
          error_expected633 = M1.cons(M3.fa_type(M1.caar(fa_stack634)), error_expected633);
          var if_res305 = null;
        } else {
          var if_res305 = M1.rvoid();
        }
        if_res305;
        return false;
      };
      var do_eof_check676 = function(res679) {
        if (res679 !== false) {
          if (eof_check622 !== false) {
            var if_res306 = M1._lt_(input_pos626, input_len625);
          } else {
            var if_res306 = false;
          }
          if (if_res306 !== false) {
            var if_res307 = M2.__rjs_quoted__.parse_error2(error_pos630, error_line631, error_col632, error_expected633, received677(), snippet678());
          } else {
            var if_res307 = res679;
          }
          var if_res308 = if_res307;
        } else {
          var if_res308 = M2.__rjs_quoted__.parse_error2(error_pos630, error_line631, error_col632, error_expected633, received677(), snippet678());
        }
        return if_res308;
      };
      var received677 = function() {
        if (M1._eq_(error_pos630, input_len625) !== false) {
          var if_res309 = "<end of input>";
        } else {
          var if_res309 = M1.substring(input624, error_pos630, error_pos630 + 1);
        }
        return if_res309;
      };
      var snippet678 = function() {
        var snippet_length_max680 = 80;
        var line_finder681 = function(index_test682, index_move683) {
          var loop684 = function(i685, j686) {
            if (index_test682(i685) !== false) {
              if (M1._lt_(j686, snippet_length_max680) !== false) {
                var ch687 = M1.string_ref(input624, index_move683(i685));
                var or_part688 = M1.char_eq__p(ch687, "\n");
                if (or_part688 !== false) {
                  var if_res310 = or_part688;
                } else {
                  var if_res310 = M1.char_eq__p(ch687, "\r");
                }
                var if_res311 = M1.not(if_res310);
              } else {
                var if_res311 = false;
              }
              var if_res312 = if_res311;
            } else {
              var if_res312 = false;
            }
            if (if_res312 !== false) {
              var if_res313 = loop684(index_move683(i685), j686 + 1);
            } else {
              var if_res313 = i685;
            }
            return if_res313;
          };
          return loop684(error_pos630, 0);
        };
        var find_line_start689 = function() {
          return line_finder681(function(i690) {
            return M1._gt_(i690, 0);
          }, M1.sub1);
        };
        var find_line_end691 = function() {
          return line_finder681(function(i692) {
            return M1._lt_(i692, input_len625 - 1);
          }, M1.add1);
        };
        var build_snippet693 = function(start694, end695) {
          return M1.string_append(M1.substring(input624, start694, M1.min(end695, input_len625)), "\n", M1.make_string(error_pos630 - start694, " "), "^");
        };
        var line_start696 = find_line_start689();
        var line_end697 = find_line_end691();
        if (M1._lt_(line_end697 - line_start696, snippet_length_max680) !== false) {
          var if_res314 = build_snippet693(line_start696, line_end697 + 1);
        } else {
          var s_len698 = error_pos630 - line_start696;
          var e_len699 = (line_end697 + 1) - error_pos630;
          var half_max700 = snippet_length_max680 / 2;
          var s701 = M1.min(s_len698, half_max700);
          var e702 = M1.min(e_len699, half_max700);
          var ss703 = s701 + (half_max700 - e702);
          var ee704 = e702 + (half_max700 - s701);
          var if_res314 = build_snippet693(error_pos630 - ss703, error_pos630 + ee704);
        }
        return if_res314;
      };
      return do_eof_check676(match_automaton636(start621));
    };
  };
  var __rjs_quoted__ = {};
  __rjs_quoted__.cache_item_p = cache_item_p;
  __rjs_quoted__.cache_item_cr = cache_item_cr;
  __rjs_quoted__.cache_item_pos = cache_item_pos;
  __rjs_quoted__.cache_item_val = cache_item_val;
  __rjs_quoted__.cache_item1 = cache_item1;
  __rjs_quoted__.struct_cache_item = struct_cache_item;
  __rjs_quoted__.cache_item_col = cache_item_col;
  __rjs_quoted__.cache_item_line = cache_item_line;
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get make_parser() {
      return make_parser;
    }
  };
})();
var $__modules_47_grammar_45_parser_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/grammar-parser.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__runtime_47_kernel_46_rkt_46_js__;
  var M1 = $__collects_47_waxeye_47_parser_46_rkt_46_js__;
  var M2 = $__collects_47_waxeye_47_fa_46_rkt_46_js__;
  var automata = M0.vector(M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("grammar"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(1, 1, false)), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("definition"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(8, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(17, 2, false), M2.__rjs_quoted__.edge1(18, 2, false), M2.__rjs_quoted__.edge1(19, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(2, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 4, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("alternation"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(3, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(20, 2, false)), true), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(3, 1, false)), false)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("sequence"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(4, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(4, 1, false)), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("unit"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(5, 0, false), M2.__rjs_quoted__.edge1(6, 0, false), M2.__rjs_quoted__.edge1(8, 1, false), M2.__rjs_quoted__.edge1(21, 3, false), M2.__rjs_quoted__.edge1(7, 2, false), M2.__rjs_quoted__.edge1(9, 2, false), M2.__rjs_quoted__.edge1(10, 2, false), M2.__rjs_quoted__.edge1(12, 2, false), M2.__rjs_quoted__.edge1(16, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(28, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(2, 4, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(22, 2, false)), false)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("prefix"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("!", "&", M0.cons("*", "+"), ":", "?"), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("label"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(8, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("=", 3, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 4, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("action"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("@", 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(8, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("<", 3, true), M2.__rjs_quoted__.edge1(27, 8, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 4, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(8, 5, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(23, 6, false), M2.__rjs_quoted__.edge1(">", 7, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(8, 5, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 8, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("identifier"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list(M0.cons("A", "Z"), "_", M0.cons("a", "z")), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("-", M0.cons("0", "9"), M0.cons("A", "Z"), "_", M0.cons("a", "z")), 1, false), M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("literal"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("'"), 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(30, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(11, 3, false), M2.__rjs_quoted__.edge1(15, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(29, 4, false), M2.__rjs_quoted__.edge1(M0.list("'"), 5, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(11, 3, false), M2.__rjs_quoted__.edge1(15, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 6, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("caseLiteral"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("\""), 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(32, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(11, 3, false), M2.__rjs_quoted__.edge1(15, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(31, 4, false), M2.__rjs_quoted__.edge1(M0.list("\""), 5, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(11, 3, false), M2.__rjs_quoted__.edge1(15, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 6, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("lChar"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("\\", 1, false), M2.__rjs_quoted__.edge1(34, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("\"", "'", "\\", "n", "r", "t"), 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(33, 4, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1($rjs_core.Symbol.make("wild"), 2, false)), false)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("charClass"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("[", 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(35, 2, false), M2.__rjs_quoted__.edge1("]", 3, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(13, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 4, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("range"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(14, 1, false), M2.__rjs_quoted__.edge1(15, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("-", 2, true)), true), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(14, 3, false), M2.__rjs_quoted__.edge1(15, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("char"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("\\", 1, false), M2.__rjs_quoted__.edge1(38, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("-", M0.cons("\\", "]"), "n", "r", "t"), 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(37, 4, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(36, 5, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1($rjs_core.Symbol.make("wild"), 2, false)), false)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("hex"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("\\", 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("<", 2, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list(M0.cons("0", "9"), M0.cons("A", "F"), M0.cons("a", "f")), 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list(M0.cons("0", "9"), M0.cons("A", "F"), M0.cons("a", "f")), 4, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(">", 5, true)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("wildCard"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(".", 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("leftArrow"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("<", 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("-", 2, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("pruneArrow"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("<", 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("=", 2, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("voidArrow"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("<", 1, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(":", 2, true)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("leftArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("alt"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("|", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("open"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("(", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("close"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(")", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("comma"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(",", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(27, 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("sComment"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("#", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(40, 2, false), M2.__rjs_quoted__.edge1(26, 3, false), M2.__rjs_quoted__.edge1(39, 3, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1($rjs_core.Symbol.make("wild"), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("mComment"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("/", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("*", 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(25, 2, false), M2.__rjs_quoted__.edge1(41, 3, false), M2.__rjs_quoted__.edge1("*", 4, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1($rjs_core.Symbol.make("wild"), 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("/", 5, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("endOfLine"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("\r", 1, false), M2.__rjs_quoted__.edge1("\n", 2, false), M2.__rjs_quoted__.edge1("\r", 2, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("\n", 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("ws"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("\t", " "), 0, false), M2.__rjs_quoted__.edge1(26, 0, false), M2.__rjs_quoted__.edge1(24, 0, false), M2.__rjs_quoted__.edge1(25, 0, false)), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(17, 1, false), M2.__rjs_quoted__.edge1(18, 1, false), M2.__rjs_quoted__.edge1(19, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("'"), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("'"), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("\""), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(M0.list("\""), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(26, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("\\", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("]", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(26, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("]", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("\\", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1($rjs_core.Symbol.make("wild"), 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1(26, 1, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")), M2.__rjs_quoted__.fa3($rjs_core.Symbol.make("!"), M0.vector(M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("*", 1, false)), false), M2.__rjs_quoted__.state2(M0.list(M2.__rjs_quoted__.edge1("/", 2, false)), false), M2.__rjs_quoted__.state2(M0.list(), true)), $rjs_core.Symbol.make("voidArrow")));
  var grammar_parser = M1.make_parser(0, true, automata);
  var __rjs_quoted__ = {};
  ;
  return {
    get __rjs_quoted__() {
      return __rjs_quoted__;
    },
    get grammar_parser() {
      return grammar_parser;
    }
  };
})();
var $__modules_47_racketscript_46_rkt_46_js__ = (function() {
  "use strict";
  var __moduleName = "modules/racketscript.rkt.js";
  var $rjs_core = $__runtime_47_core_46_js__;
  var M0 = $__links_47_racketscript_45_compiler_47_racketscript_47_private_47_interop_46_rkt_46_js__;
  var M1 = $__modules_47_gen_46_rkt_46_js__;
  var M2 = $__runtime_47_kernel_46_rkt_46_js__;
  var M3 = $__modules_47_transform_46_rkt_46_js__;
  var M4 = $__collects_47_waxeye_47_ast_46_rkt_46_js__;
  var M5 = $__modules_47_javascript_46_rkt_46_js__;
  var M6 = $__modules_47_grammar_45_parser_46_rkt_46_js__;
  var syntax_error_message = function(error1) {
    return M2.string_append("syntax error in grammar: ", M4.parse_error__gt_string(error1));
  };
  var transform_and_set_start42 = function(grammar_or_error33, start_name14, start_name25) {
    var grammar_or_error6 = grammar_or_error33;
    if (start_name25 !== false) {
      var if_res1 = start_name14;
    } else {
      var if_res1 = "";
    }
    var start_name7 = if_res1;
    if (M4.ast_p(grammar_or_error6) !== false) {
      var grammar8 = grammar_or_error6;
      M3.transform_grammar(grammar8);
      M1.start_nt_bang_(start_name7, grammar8);
      var if_res2 = grammar8;
    } else {
      var if_res2 = grammar_or_error6;
    }
    return if_res2;
  };
  var cl3 = function(grammar_or_error9) {
    return transform_and_set_start42(grammar_or_error9, false, false);
  };
  var cl4 = function(grammar_or_error10, start_name111) {
    return transform_and_set_start42(grammar_or_error10, start_name111, true);
  };
  var transform_and_set_start = $rjs_core.attachProcedureArity(function() {
    var fixed_lam5 = {
      '1': cl3,
      '2': cl4
    }[arguments.length];
    if (fixed_lam5 !== undefined !== false) {
      return fixed_lam5.apply(null, arguments);
    } else {
      return M2.error("case-lambda: invalid case");
    }
  }, [1, 2]);
  var js_result = function(grammar_or_error12, fn13) {
    if (M4.ast_p(grammar_or_error12) !== false) {
      var if_res6 = [fn13(grammar_or_error12), null];
    } else {
      var if_res6 = [null, syntax_error_message(grammar_or_error12)];
    }
    return if_res6;
  };
  var grammar_to_ast_string = function(grammar_src14) {
    return js_result(M6.grammar_parser(grammar_src14), M4.ast__gt_string);
  };
  var grammar_to_transformed_ast_string = function(grammar_src15) {
    return js_result(transform_and_set_start(M6.grammar_parser(grammar_src15)), M4.ast__gt_string);
  };
  var generate_parser = function(grammar_src16) {
    return js_result(transform_and_set_start(M6.grammar_parser(grammar_src16)), M5.gen_javascript_parser);
  };
  window.waxeyeCompiler = {
    'grammarToAstString': grammar_to_ast_string,
    'grammarToTransformedAstString': grammar_to_transformed_ast_string,
    'generateParser': generate_parser
  };
  var __rjs_quoted__ = {};
  ;
  return {get __rjs_quoted__() {
      return __rjs_quoted__;
    }};
})();
