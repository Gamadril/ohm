!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('../src/ohm.js')
ohm._ohmGrammarFactory =
(function(ohm, optNamespace) {
  var b = ohm.builder()
  b.setName('Ohm')
  b.inline('space-singleLine', b.seq(b._('//'), b.many(b.seq(b.not(b._('\n')), b.app('_')), 0), b._('\n')))
  b.inline('space-multiLine', b.seq(b._('/*'), b.many(b.seq(b.not(b._('*/')), b.app('_')), 0), b._('*/')))
  b.extend('space', b.alt(b.app('space-singleLine'), b.app('space-multiLine')))
  b.define('_name', b.seq(b.app('nameFirst'), b.many(b.app('nameRest'), 0)))
  b.define('nameFirst', b.alt(b._('_'), b.app('letter')))
  b.define('nameRest', b.alt(b._('_'), b.app('alnum')))
  b.define('name', b.seq(b.not(b.app('namedConst')), b.bind(b.app('_name'), 'n')))
  b.inline('namedConst-undefined', b.seq(b._('undefined'), b.not(b.app('nameRest'))))
  b.inline('namedConst-null', b.seq(b._('null'), b.not(b.app('nameRest'))))
  b.inline('namedConst-true', b.seq(b._('true'), b.not(b.app('nameRest'))))
  b.inline('namedConst-false', b.seq(b._('false'), b.not(b.app('nameRest'))))
  b.define('namedConst', b.alt(b.app('namedConst-undefined'), b.app('namedConst-null'), b.app('namedConst-true'), b.app('namedConst-false')))
  b.define('string', b.seq(b._("'"), b.bind(b.many(b.app('sChar'), 0), 'cs'), b._("'")))
  b.define('sChar', b.alt(b.seq(b._('\\x'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b._('\\u'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b._('\\'), b.app('_')), b.seq(b.not(b._("'")), b.app('_'))))
  b.define('regexp', b.seq(b._('/'), b.bind(b.app('reCharClass'), 'e'), b._('/')))
  b.define('reCharClass', b.seq(b._('['), b.many(b.alt(b._('\\]'), b.seq(b.not(b._(']')), b.app('_'))), 0), b._(']')))
  b.define('number', b.seq(b.opt(b._('-')), b.many(b.app('digit'), 1)))
  b.inline('Alt-rec', b.seq(b.bind(b.app('Term'), 'x'), b._('|'), b.bind(b.app('Alt'), 'y')))
  b.define('Alt', b.alt(b.app('Alt-rec'), b.app('Term')))
  b.inline('Term-inline', b.seq(b.bind(b.app('Seq'), 'x'), b._('{'), b.bind(b.app('_name'), 'n'), b._('}')))
  b.define('Term', b.alt(b.app('Term-inline'), b.app('Seq')))
  b.define('Seq', b.many(b.app('Factor'), 0))
  b.inline('Factor-bind', b.seq(b.bind(b.app('Iter'), 'x'), b._('.'), b.bind(b.app('name'), 'n')))
  b.define('Factor', b.alt(b.app('Factor-bind'), b.app('Iter')))
  b.inline('Iter-star', b.seq(b.bind(b.app('Pred'), 'x'), b._('*')))
  b.inline('Iter-plus', b.seq(b.bind(b.app('Pred'), 'x'), b._('+')))
  b.inline('Iter-opt', b.seq(b.bind(b.app('Pred'), 'x'), b._('?')))
  b.define('Iter', b.alt(b.app('Iter-star'), b.app('Iter-plus'), b.app('Iter-opt'), b.app('Pred')))
  b.inline('Pred-not', b.seq(b._('~'), b.bind(b.app('Base'), 'x')))
  b.inline('Pred-lookahead', b.seq(b._('&'), b.bind(b.app('Base'), 'x')))
  b.define('Pred', b.alt(b.app('Pred-not'), b.app('Pred-lookahead'), b.app('Base')))
  b.inline('Base-application', b.seq(b.bind(b.app('name'), 'ruleName'), b.not(b.alt(b._('=='), b._(':='), b._('+=')))))
  b.inline('Base-prim', b.bind(b.alt(b.app('namedConst'), b.app('string'), b.app('regexp'), b.app('number')), 'x'))
  b.inline('Base-lst', b.seq(b._('['), b.bind(b.app('Alt'), 'x'), b._(']')))
  b.inline('Base-str', b.seq(b._('"'), b.bind(b.app('Alt'), 'x'), b._('"')))
  b.inline('Base-paren', b.seq(b._('('), b.bind(b.app('Alt'), 'x'), b._(')')))
  b.inline('Base-obj', b.seq(b._('{'), b.bind(b.opt(b._('...')), 'lenient'), b._('}')))
  b.inline('Base-objWithProps', b.seq(b._('{'), b.bind(b.app('Props'), 'ps'), b.bind(b.opt(b.seq(b._(','), b._('...'))), 'lenient'), b._('}')))
  b.define('Base', b.alt(b.app('Base-application'), b.app('Base-prim'), b.app('Base-lst'), b.app('Base-str'), b.app('Base-paren'), b.app('Base-obj'), b.app('Base-objWithProps')))
  b.inline('Props-rec', b.seq(b.bind(b.app('Prop'), 'p'), b._(','), b.bind(b.app('Props'), 'ps')))
  b.inline('Props-base', b.bind(b.app('Prop'), 'p'))
  b.define('Props', b.alt(b.app('Props-rec'), b.app('Props-base')))
  b.define('Prop', b.seq(b.bind(b.alt(b.app('_name'), b.app('string')), 'n'), b._(':'), b.bind(b.app('Factor'), 'p')))
  b.inline('Rule-define', b.seq(b.bind(b.app('RuleName'), 'n'), b._('=='), b.bind(b.app('Alt'), 'b')))
  b.inline('Rule-override', b.seq(b.bind(b.app('RuleName'), 'n'), b._(':='), b.bind(b.app('Alt'), 'b')))
  b.inline('Rule-extend', b.seq(b.bind(b.app('RuleName'), 'n'), b._('+='), b.bind(b.app('Alt'), 'b')))
  b.define('Rule', b.alt(b.app('Rule-define'), b.app('Rule-override'), b.app('Rule-extend')))
  b.define('RuleName', b.app('name'))
  b.inline('SuperGrammar-qualified', b.seq(b._('<:'), b.bind(b.app('name'), 'ns'), b._('.'), b.bind(b.app('name'), 'n')))
  b.inline('SuperGrammar-unqualified', b.seq(b._('<:'), b.bind(b.app('name'), 'n')))
  b.define('SuperGrammar', b.alt(b.app('SuperGrammar-qualified'), b.app('SuperGrammar-unqualified')))
  b.define('Grammar', b.seq(b.bind(b.app('GrammarName'), 'n'), b.bind(b.opt(b.app('SuperGrammar')), 's'), b._('{'), b.bind(b.many(b.app('Rule'), 0), 'rs'), b._('}')))
  b.define('Grammars', b.many(b.app('Grammar'), 0))
  b.define('GrammarName', b.app('name'))
  return b.build(optNamespace)
})

},{"../src/ohm.js":7}],2:[function(_dereq_,module,exports){
exports.objectUtils = _dereq_('./objectUtils.js')
exports.stringUtils = _dereq_('./stringUtils.js')
exports.equals = _dereq_('./equals.js')
exports.browser = _dereq_('./browser.js')

},{"./browser.js":3,"./equals.js":4,"./objectUtils.js":5,"./stringUtils.js":6}],3:[function(_dereq_,module,exports){
var thisModule = exports

// --------------------------------------------------------------------
// Logging
// --------------------------------------------------------------------

var subscribed = {}

exports.log = function(subject /* , ... */) {
  if (!subscribed[subject])
    return
  arguments[0] = '[' + subject + ']'
  console.log.apply(console, arguments)
}

exports.subscribe = function(subject) {
  subscribed[subject] = true
}

exports.unsubscribe = function(subject) {
  delete showing[subject]
}

// --------------------------------------------------------------------
// Asserts, errors, etc.
// --------------------------------------------------------------------

exports.error = function(/* arg1, arg2, ... */) {
  var args = Array.prototype.slice.call(arguments)
  console.error.apply(console, args)
  throw 'error: ' + args.join(' ')
}

exports.sanityCheck = function(name, condition) {
  if (!condition)
    thisModule.error('failed sanity check:', name)
}

// --------------------------------------------------------------------
// DOM utils
// --------------------------------------------------------------------

exports.prettyPrintNode = function(node, endNode, endOffset) {
  if (node instanceof Text) {
    if (node === endNode)
      return 'text{' + node.data.substr(0, endOffset) + '|' + node.data.substr(endOffset) + '}'
    else
      return 'text{' + node.data + '}'
  }

  var parts = [node.tagName, '{']
  for (var idx = 0; idx < node.childNodes.length; idx++) {
    if (node === endNode && endOffset == idx)
      parts.push('|')
    parts.push(thisModule.prettyPrintNode(node.childNodes.item(idx), endNode, endOffset))
  }
  if (node === endNode && endOffset == node.childNodes.length)
    parts.push('|')
  parts.push('}')
  return parts.join('')
}


},{}],4:[function(_dereq_,module,exports){
// Helpers

function doubleEquals(x, y) {
  return x == y
}

function tripleEquals(x, y) {
  return x === y
}

function isPrimitive(x) {
  var type = typeof x
  return type !== 'object'
}

function equals(x, y, deep, eqFn) {
  if (isPrimitive(x))
    return eqFn(x, y)
  for (var p in x)
    if (deep && !equals(x[p], y[p], deep, eqFn) ||
        !deep && !eqFn(x[p], y[p]))
      return false
  for (var p in y)
    if (y[p] !== undefined &&
        x[p] === undefined)
      return false
  return true
}

function haveSameContentsInAnyOrder(arr1, arr2, deep, eqFn) {
  if (!arr1 instanceof Array || !arr2 instanceof Array ||
      arr1.length !== arr2.length)
    return false
  for (var idx = 0; idx < arr1.length; idx++) {
    var x = arr1[idx]
    var foundX = arr2.some(function(y) {
      return equals(x, y, deep, eqFn)
    })
    if (!foundX)
      return false
  }
  return true
}

// Public methods

exports.equals = function(x, y) {
  return equals(x, y, false, doubleEquals)
}

exports.deepEquals = function(x, y) {
  return equals(x, y, true, doubleEquals)
}

exports.strictEquals = function(x, y) {
  return equals(x, y, false, tripleEquals)
}

exports.strictDeepEquals = function(x, y) {
  return equals(x, y, true, tripleEquals)
}

exports.haveSameContentsInAnyOrder = function(arr1, arr2) {
  return haveSameContentsInAnyOrder(arr1, arr2, true, doubleEquals)
}


},{}],5:[function(_dereq_,module,exports){
var thisModule = exports

exports.objectThatDelegatesTo = function(obj, optProperties) {
  function cons() {}
  cons.prototype = obj
  var ans = new cons()
  if (optProperties)
    thisModule.keysAndValuesDo(optProperties, function(k, v) {
      ans[k] = v
    })
  return ans
}

exports.formals = function(func) {
  return func.
    toString().
    match(/\((.*?)\)/)[0].
    replace(/ /g, '').
    slice(1, -1).
    split(',').
    filter(function(moduleName) { return moduleName != '' })
}

exports.keysDo = function(object, fn) {
  for (var p in object)
    if (object.hasOwnProperty(p))
      fn(p)
}

exports.valuesDo = function(object, fn) {
  thisModule.keysDo(object, function(p) { fn(object[p]) })
}

exports.keysAndValuesDo = function(object, fn) {
  thisModule.keysDo(object, function(p) { fn(p, object[p]) })
}

exports.keysIterator = function(object) {
  return function(fn) { self.keysDo(object, fn) }
}

exports.valuesIterator = function(object) {
  return function(fn) { self.valuesDo(object, fn) }
}

exports.keysAndValuesIterator = function(object) {
  return function(fn) { self.keysAndValuesDo(object, fn) }
}

exports.values = function(object) {
  var ans = []
  thisModule.keysDo(object, function(p) { ans.push(object[p]) })
  return ans
}

function StringBuffer() {
  this.strings = []
  this.lengthSoFar = 0
  for (var idx = 0; idx < arguments.length; idx++)
    this.nextPutAll(arguments[idx])
}

StringBuffer.prototype = {
  nextPutAll: function(s) {
    this.strings.push(s)
    this.lengthSoFar += s.length
  },

  contents: function()  {
    return this.strings.join('')
  }
}

exports.StringBuffer = StringBuffer


},{}],6:[function(_dereq_,module,exports){
var objectUtils = _dereq_('./objectUtils.js')
var thisModule = exports

// Helpers

function pad(numberAsString, len) {
  var zeros = []
  for (var idx = 0; idx < numberAsString.length - len; idx++)
    zeros.push('0')
  return zeros.join('') + numberAsString
}

var escapeStringFor = {}
for (var c = 0; c < 128; c++)
  escapeStringFor[c] = String.fromCharCode(c)
escapeStringFor["'".charCodeAt(0)]  = "\\'"
escapeStringFor['"'.charCodeAt(0)]  = '\\"'
escapeStringFor['\\'.charCodeAt(0)] = '\\\\'
escapeStringFor['\b'.charCodeAt(0)] = '\\b'
escapeStringFor['\f'.charCodeAt(0)] = '\\f'
escapeStringFor['\n'.charCodeAt(0)] = '\\n'
escapeStringFor['\r'.charCodeAt(0)] = '\\r'
escapeStringFor['\t'.charCodeAt(0)] = '\\t'
escapeStringFor['\v'.charCodeAt(0)] = '\\v'

// Public methods

exports.escapeChar = function(c, optDelim) {
  var charCode = c.charCodeAt(0)
  if ((c == '"' || c == "'") && optDelim && c !== optDelim)
    return c
  else if (charCode < 128)
    return escapeStringFor[charCode]
  else if (128 <= charCode && charCode < 256)
    return '\\x' + pad(charCode.toString(16), 2)
  else
    return '\\u' + pad(charCode.toString(16), 4)
}

exports.unescapeChar = function(s) {
  if (s.charAt(0) == '\\')
    switch (s.charAt(1)) {
      case 'b':  return '\b'
      case 'f':  return '\f'
      case 'n':  return '\n'
      case 'r':  return '\r'
      case 't':  return '\t'
      case 'v':  return '\v'
      case 'x':  return String.fromCharCode(parseInt(s.substring(2, 4), 16))
      case 'u':  return String.fromCharCode(parseInt(s.substring(2, 6), 16))
      default:   return s.charAt(1)
    }
  else
    return s
}

function printOn(x, ws) {
  if (x instanceof Array) {
    ws.nextPutAll('[')
    for (var idx = 0; idx < x.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      printOn(x[idx], ws)
    }
    ws.nextPutAll(']')
  } else if (typeof x === 'string') {
    var hasSingleQuotes = x.indexOf("'") >= 0
    var hasDoubleQuotes = x.indexOf('"') >= 0
    var delim = hasSingleQuotes && !hasDoubleQuotes ? '"' : "'"
    ws.nextPutAll(delim)
    for (var idx = 0; idx < x.length; idx++)
      ws.nextPutAll(thisModule.escapeChar(x[idx], delim))
    ws.nextPutAll(delim)
  } else if (x === null) {
    ws.nextPutAll('null')
  } else if (typeof x === 'object' && !(x instanceof RegExp)) {
    ws.nextPutAll('{')
    var first = true
    objectUtils.keysAndValuesDo(x, function(k, v) {
      if (first)
        first = false
      else
        ws.nextPutAll(', ')
      printOn(k, ws)
      ws.nextPutAll(': ')
      printOn(v, ws)
    })
    ws.nextPutAll('}')
  } else
    ws.nextPutAll('' + x)
}

exports.printString = function(obj) {
  var ws = new objectUtils.StringBuffer()
  printOn(obj, ws)
  return ws.contents()
}


},{"./objectUtils.js":5}],7:[function(_dereq_,module,exports){
/*

TODO:

* Think about improving the implementation of syntactic rules' automatic space skipping:
  -- Could keep track of the current rule name by modifying the code (in Apply.eval) where enter and exit methods
     are called. (Would also want to keep track of whether the rule is syntactic to avoid re-doing that work
     at each application.)

* Consider borrowing (something like) the variable-not-otherwise-mentioned idea from Robby Findler's redex, as a way
  to make it easier for programmers to deal with keywords and identifiers.

* Think about a better way to deal with lists
  -- Built-in list operator?
  -- Parameterized rules?

* Improve test coverage
  -- Add tests for scoping, e.g., "foo:a [bar:b baz:c]:d" should have 4 bindings.
     (Same kind of thing for nested string and lookahead expressions, their bindings should leak to the enclosing seq.)

* Think about foreign rule invocation
  -- Can't just be done in the same way as in OMeta b/c of the actionDict
  -- Will want to preserve the "no unnecessary semantic actions" guarantee
  -- The solution might be to enable the programmer to provide multiple actionDicts,
     but I'll have to come up with a convenient way to associate each with a particular grammar.

* Think about incremental parsing (good for editors)
  -- Basic idea: keep track of max index seen to compute a result
     (store this in memo rec as an int relative to curr pos)
  -- Ok to reuse memoized value as long as range from current index to max index hasn't changed
  -- Could be a cute workshop paper...


Syntax / language ideas:

* Syntax for rule declarations:

    foo == bar baz     (define)
    foo := bar baz     (override / replace)
    foo <= bar baz     (extend)

* Inline rules, e.g.,

    addExpr = addExpr:x '+' mulExpr:y {plus}
            | addExpr:x '-' mulExpr:y {minus}
            | mulExpr

  is syntactic sugar for

    addExpr = plus | minus | mulExpr,
    plus = addExpr:x '+' mulExpr:y,
    minus = addExpr:x '-' mulExpr:y

* In this example:

    foo = "bar"
    bar = 'abc'

  The foo rule says it wants the bar rule to match the contents of a string object. (The "s is a kind of parenthesis.)
  Then you could either say

    m.matchAll('abc', 'bar')

  or

    m.match('abc', 'foo')

  Both should succeed.

* About object matching

  Some issues:
  -- Should definitely allow pattern matching on each property's value. But what about property names?
  -- What to do about unspecified properties?
  -- Syntax: JSON uses colons to separate property names and values. Will look bad w/ bindings, e.g.,
     {foo: number:n} (ewwww)

  Current strawman:
  -- Require property names to be string literals (not patterns), only allow pattern matching on their values.
  -- Allow an optional '...' as the last pattern, that would match any unspecified properties.
       {'foo': number, 'bar': string, 'baz': 5, ...}
     Might even allow the ... to be bound to a variable that would contain all of those properties.
  -- Consider changing binding syntax from expr:name to expr.name
     (More JSON-friendly, but it doesn't work well with ... syntax. But maybe it's not so important to be able to bind
     the rest of the properties and values anyway, since you can always bind the entire object.)


Optimization ideas:

* Optimize 'binds' -- should pre-allocate an array of bindings instead of doing pushes, throwing away arrays on fail
  (see Alt), etc.

* Consider adding an additional code generation step that generates efficient code from the ASTs, instead of
  interpreting them directly.

* Don't bother creating thunks / lists of thunks when value is not needed (OMeta did this)
  -- E.g., in "foo = space* bar" the result of space* is not needed, so don't bother creating a list of thunks / values
  -- Could just return undefined (anything except fail)

* Get rid of unnecessary Seqs and Alts (OMeta did this too)

*/

// --------------------------------------------------------------------
// Dependencies
// --------------------------------------------------------------------

_dereq_('../dist/ohm-grammar.js')

var awlib = _dereq_('awlib')
var objectUtils = awlib.objectUtils
var stringUtils = awlib.stringUtils
var browser = awlib.browser
var equals = awlib.equals

// --------------------------------------------------------------------
// Helpers, etc.
// --------------------------------------------------------------------

var thisModule = exports

var fail = {}

function getDuplicates(array) {
  var duplicates = []
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx]
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0)
      duplicates.push(x)
  }
  return duplicates
}

function abstract() {
  throw 'this method is abstract!'
}

function isSyntactic(ruleName) {
  var firstChar = ruleName[0]
  return 'A' <= firstChar && firstChar <= 'Z'
}

var _applySpaces
function skipSpaces(ruleDict, inputStream) {
  (_applySpaces || (_applySpaces = new Apply('spaces'))).eval(false, ruleDict, inputStream, undefined)
}

// --------------------------------------------------------------------
// Input streams
// --------------------------------------------------------------------

function InputStream() {
  throw 'InputStream cannot be instantiated -- it\'s abstract'
}

InputStream.newFor = function(obj) {
  if (typeof obj === 'string')
    return new StringInputStream(obj)
  else if (obj instanceof Array)
    return new ListInputStream(obj)
  else
    throw 'cannot make input stream for ' + obj
}

InputStream.prototype = {
  init: function(source) {
    this.source = source
    this.pos = 0
    this.posInfos = []
  },

  getCurrentPosInfo: function() {
    var currPos = this.pos
    var posInfo = this.posInfos[currPos]
    return posInfo || (this.posInfos[currPos] = new PosInfo(currPos))
  },

  atEnd: function() {
    return this.pos === this.source.length
  },

  next: function() {
    return this.atEnd() ? fail : this.source[this.pos++]
  },

  matchExactly: function(x) {
    return this.next() === x ? true : fail
  },

  interval: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx)
  }
}

function StringInputStream(source) {
  this.init(source)
}

StringInputStream.prototype = objectUtils.objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    for (var idx = 0; idx < s.length; idx++)
      if (this.matchExactly(s[idx]) === fail)
        return fail
    return true
  },

  matchRegExp: function(e) {
    // IMPORTANT: e must be a non-global, one-character expression, e.g., /./ and /[0-9]/
    var c = this.next()
    return c !== fail && e.test(c) ? true : fail
  }
})

function ListInputStream(source) {
  this.init(source)
}

ListInputStream.prototype = objectUtils.objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    return this.matchExactly(s)
  },
    
  matchRegExp: function(e) {
    return this.matchExactly(e)
  }
})

function PosInfo(pos) {
  this.pos = pos
  this.ruleStack = []
  this.activeRules = {}  // redundant data (could be generated from ruleStack), exists for performance reasons
  this.memo = {}
}

PosInfo.prototype = {
  isActive: function(ruleName) {
    return this.activeRules[ruleName]
  },

  enter: function(ruleName) {
    this.ruleStack.push(ruleName)
    this.activeRules[ruleName] = true
  },

  exit: function(ruleName) {
    this.ruleStack.pop()
    this.activeRules[ruleName] = false
  },

  shouldUseMemoizedResult: function(memoRec) {
    var involvedRules = memoRec.involvedRules
    for (var ruleName in involvedRules)
      if (involvedRules[ruleName] && this.activeRules[ruleName])
        return false
    return true
  },

  getCurrentLeftRecursion: function() {
    return this.leftRecursionStack ? this.leftRecursionStack[this.leftRecursionStack.length - 1] : undefined
  },

  startLeftRecursion: function(ruleName) {
    if (!this.leftRecursionStack)
      this.leftRecursionStack = []
    this.leftRecursionStack.push({name: ruleName, value: fail, pos: -1, involvedRules: {}})
    this.updateInvolvedRules()
  },

  endLeftRecursion: function(ruleName) {
    this.leftRecursionStack.pop()
  },

  updateInvolvedRules: function() {
    var currentLeftRecursion = this.getCurrentLeftRecursion()
    var involvedRules = currentLeftRecursion.involvedRules
    var lrRuleName = currentLeftRecursion.name
    var idx = this.ruleStack.length - 1
    while (true) {
      var ruleName = this.ruleStack[idx--]
      if (ruleName === lrRuleName)
        break
      involvedRules[ruleName] = true
    }
  }
}

// --------------------------------------------------------------------
// Intervals
// --------------------------------------------------------------------

function Interval(source, startIdx, endIdx) {
  this.source = source
  this.startIdx = startIdx
  this.endIdx = endIdx
}

Interval.prototype = {
  contents: function() {
    return InputStream.newFor(this.source).interval(this.startIdx, this.endIdx)
  },

  onlyElement: function() {
    if (this.startIdx + 1 !== this.endIdx)
      browser.error('interval', this, 'was expected to contain only one element')
    else
      return this.source[this.startIdx]
  }
}

// --------------------------------------------------------------------
// Thunks
// --------------------------------------------------------------------

var nextThunkId = 0

function RuleThunk(ruleName, source, startIdx, endIdx, value, bindings) {
  this.id = nextThunkId++
  this.ruleName = ruleName
  this.source = source
  this.startIdx = startIdx
  this.endIdx = endIdx
  this.value = value
  this.bindings = bindings
}

RuleThunk.prototype = {
  force: function(actionDict, memo) {
    if (memo.hasOwnProperty(this.id))
      return memo[this.id]
    var action = this.lookupAction(actionDict)
    var addlInfo = this.createAddlInfo()
    if (this.bindings.length === 0)
      return memo[this.id] = action.call(addlInfo, this.value.force(actionDict, memo))
    else {
      var argDict = {}
      for (var idx = 0; idx < this.bindings.length; idx += 2)
        argDict[this.bindings[idx]] = this.bindings[idx + 1]
      var formals = objectUtils.formals(action)
      var args = formals.length === 0 ?
        objectUtils.values(argDict).map(function(arg) { return arg.force(actionDict, memo) }) :
        formals.map(function(name) { return argDict[name].force(actionDict, memo) })
      return memo[this.id] = action.apply(addlInfo, args)
    }
  },

  lookupAction: function(actionDict) {
    var ruleName = this.ruleName
    var action = actionDict[ruleName]
    if (action === undefined && actionDict._default !== undefined)
      action = function() {
        return actionDict._default.apply(this, [ruleName].concat(Array.prototype.slice.call(arguments)))
      }
    return action || browser.error('missing semantic action for', ruleName)
  },

  createAddlInfo: function() {
    return {
      interval: new Interval(this.source, this.startIdx, this.endIdx)
    }
  }
}

function ListThunk(thunks) {
  this.id = nextThunkId++
  this.thunks = thunks
}

ListThunk.prototype = {
  force: function(actionDict, memo) {
    if (memo.hasOwnProperty(this.id))
      return memo[this.id]
    else
      return memo[this.id] = this.thunks.map(function(thunk) { return thunk.force(actionDict, memo) })
  }
}

function ValueThunk(value) {
  this.value = value
}

ValueThunk.prototype = {
  force: function(actionDict, memo) {
    return this.value
  }
}

var valuelessThunk = new ValueThunk(undefined)

// --------------------------------------------------------------------
// Types of patterns
// --------------------------------------------------------------------

// General stuff

function Pattern() {
  throw 'Pattern cannot be instantiated -- it\'s abstract'
}

Pattern.prototype = {
  getBindingNames: function() {
    return []
  },

  producesValue: function() {
    return true
  },

  assertNoDuplicateBindings: abstract,
  assertChoicesHaveUniformBindings: abstract,

  outputRecipe: abstract
}

// Anything

var anything = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var value = inputStream.next()
    if (value === fail)
      return fail
    else
      return new ValueThunk(value)
  },

  assertNoDuplicateBindings: function(ruleName) {},
  assertChoicesHaveUniformBindings: function(ruleName) {},

  outputRecipe: function(ws) {
    // no-op
  }
})

// Primitives

function Prim(obj) {
  this.obj = obj
}

Prim.newFor = function(obj) {
  if (typeof obj === 'string' && obj.length !== 1)
    return new StringPrim(obj)
  else if (obj instanceof RegExp)
    return new RegExpPrim(obj)
  else
    return new Prim(obj)
}
    
Prim.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    if (this.match(inputStream) === fail)
      return fail
    else
      return new ValueThunk(this.obj)
  },

  match: function(inputStream) {
    return inputStream.matchExactly(this.obj)
  },

  assertNoDuplicateBindings: function(ruleName) {},
  assertChoicesHaveUniformBindings: function(ruleName) {},

  outputRecipe: function(ws) {
    ws.nextPutAll('b._(')
    ws.nextPutAll(stringUtils.printString(this.obj))
    ws.nextPutAll(')')
  }
})

function StringPrim(obj) {
  this.obj = obj
}

StringPrim.prototype = objectUtils.objectThatDelegatesTo(Prim.prototype, {
  match: function(inputStream) {
    return inputStream.matchString(this.obj)
  }
})

function RegExpPrim(obj) {
  this.obj = obj
}

RegExpPrim.prototype = objectUtils.objectThatDelegatesTo(Prim.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var origPos = inputStream.pos
    if (inputStream.matchRegExp(this.obj) === fail)
      return fail
    else
      return new ValueThunk(inputStream.source[origPos])
  }
})

// Alternation

function Alt(terms) {
  this.terms = terms
}

Alt.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var origNumBindings = bindings.length
    for (var idx = 0; idx < this.terms.length; idx++) {
      if (syntactic)
        skipSpaces(ruleDict, inputStream)
      var value = this.terms[idx].eval(syntactic, ruleDict, inputStream, bindings)
      if (value !== fail)
        return value
      else {
        inputStream.pos = origPos
        // Note: while the following assignment could be done unconditionally, only doing it when necessary is
        // better for performance. This is b/c assigning to an array's length property is more expensive than a
        // typical assignment.
        if (bindings.length > origNumBindings)
          bindings.length = origNumBindings
      }
    }
    return fail
  },

  getBindingNames: function() {
    // This is ok b/c all terms must have the same bindings -- this property is checked by the Grammar constructor.
    return this.terms.length === 0 ? [] : this.terms[0].getBindingNames()
  },

  producesValue: function() {
    for (var idx = 0; idx < this.terms.length; idx++)
      if (!this.terms[idx].producesValue())
        return false
    return true
  },

  assertNoDuplicateBindings: function(ruleName) {
    for (var idx = 0; idx < this.terms.length; idx++)
      this.terms[idx].assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    if (this.terms.length === 0)
      return
    var names = this.terms[0].getBindingNames()
    for (var idx = 0; idx < this.terms.length; idx++) {
      var term = this.terms[idx]
      term.assertChoicesHaveUniformBindings()
      var otherNames = term.getBindingNames()
      if (!equals.equals(names, otherNames))
        browser.error('rule', ruleName, 'has an alt with inconsistent bindings:', names, 'vs', otherNames)
    }
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.alt(')
    for (var idx = 0; idx < this.terms.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      this.terms[idx].outputRecipe(ws)
    }
    ws.nextPutAll(')')
  }
})

// Sequences

function Seq(factors) {
  this.factors = factors
}

Seq.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    for (var idx = 0; idx < this.factors.length; idx++) {
      if (syntactic)
        skipSpaces(ruleDict, inputStream)
      var factor = this.factors[idx]
      var value = factor.eval(syntactic, ruleDict, inputStream, bindings)
      if (value === fail)
        return fail
    }
    return valuelessThunk
  },

  getBindingNames: function() {
    var names = []
    for (var idx = 0; idx < this.factors.length; idx++)
      names = names.concat(this.factors[idx].getBindingNames())
    return names.sort()
  },

  producesValue: function() {
    return false
  },

  assertNoDuplicateBindings: function(ruleName) {
    for (var idx = 0; idx < this.factors.length; idx++)
      this.factors[idx].assertNoDuplicateBindings(ruleName)

    var duplicates = getDuplicates(this.getBindingNames())
    if (duplicates.length > 0)
      browser.error('rule', ruleName, 'has duplicate bindings:', duplicates)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    for (var idx = 0; idx < this.factors.length; idx++)
      this.factors[idx].assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.seq(')
    for (var idx = 0; idx < this.factors.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      this.factors[idx].outputRecipe(ws)
    }
    ws.nextPutAll(')')
  }
})

// Bindings

function Bind(expr, name) {
  this.expr = expr
  this.name = name
}

Bind.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var value = this.expr.eval(syntactic, ruleDict, inputStream, bindings)
    if (value !== fail)
      bindings.push(this.name, value)
    return value
  },

  getBindingNames: function() {
    return [this.name]
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.bind(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(', ')
    ws.nextPutAll(stringUtils.printString(this.name))
    ws.nextPutAll(')')
  }
})

// Iterators and optionals

function Many(expr, minNumMatches) {
  this.expr = expr
  this.minNumMatches = minNumMatches
}

Many.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var matches = []
    while (true) {
      var backtrackPos = inputStream.pos
      var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
      if (value === fail) {
        inputStream.pos = backtrackPos
        break
      } else
        matches.push(value)
    }
    return matches.length < this.minNumMatches ?  fail : new ListThunk(matches)
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.many(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(', ')
    ws.nextPutAll(this.minNumMatches)
    ws.nextPutAll(')')
  }
})

function Opt(expr) {
  this.expr = expr
}

Opt.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value === fail) {
      inputStream.pos = origPos
      return valuelessThunk
    } else
      return new ListThunk([value])
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.opt(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// Predicates

function Not(expr) {
  this.expr = expr
}

Not.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value !== fail)
      return fail
    else {
      inputStream.pos = origPos
      return valuelessThunk
    }
  },

  producesValue: function() {
    return false
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.not(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

function Lookahead(expr) {
  this.expr = expr
}

Lookahead.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value !== fail) {
      inputStream.pos = origPos
      return value
    } else
      return fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.la(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// String decomposition

function Str(expr) {
  this.expr = expr
}

Str.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var string = inputStream.next()
    if (typeof string === 'string') {
      var stringInputStream = new StringInputStream(string)
      var value = this.expr.eval(syntactic, ruleDict, stringInputStream, bindings)
      return value !== fail && stringInputStream.atEnd() ?  new ValueThunk(string) : fail
    } else
      return fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.str(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// List decomposition

function List(expr) {
  this.expr = expr
}

List.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var list = inputStream.next()
    if (list instanceof Array) {
      var listInputStream = new ListInputStream(list)
      var value = this.expr.eval(syntactic, ruleDict, listInputStream, bindings)
      return value !== fail && listInputStream.atEnd() ?  new ValueThunk(list) : fail
    } else
      return fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.lst(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// Object decomposition

function Obj(properties, isLenient) {
  var names = properties.map(function(property) { return property.name })
  var duplicates = getDuplicates(names)
  if (duplicates.length > 0)
    browser.error('object pattern has duplicate property names:', duplicates)
  else {
    this.properties = properties
    this.isLenient = isLenient
  }
}

Obj.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var obj = inputStream.next()
    if (obj !== fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
      var numOwnPropertiesMatched = 0
      for (var idx = 0; idx < this.properties.length; idx++) {
        var property = this.properties[idx]
        var value = obj[property.name]
        var valueInputStream = new ListInputStream([value])
        var matched =
          property.pattern.eval(syntactic, ruleDict, valueInputStream, bindings) !== fail && valueInputStream.atEnd()
        if (!matched)
          return fail
        if (obj.hasOwnProperty(property.name))
          numOwnPropertiesMatched++
      }
      return this.isLenient || numOwnPropertiesMatched === Object.keys(obj).length ?
        new ValueThunk(obj) :
        fail
    } else
      return fail
  },

  getBindingNames: function() {
    var names = []
    for (var idx = 0; idx < this.properties.length; idx++)
      names = names.concat(this.properties[idx].pattern.getBindingNames())
    return names.sort()
  },

  assertNoDuplicateBindings: function(ruleName) {
    for (var idx = 0; idx < this.properties.length; idx++)
      this.properties[idx].pattern.assertNoDuplicateBindings(ruleName)

    var duplicates = getDuplicates(this.getBindingNames())
    if (duplicates.length > 0)
      browser.error('rule', ruleName, 'has an object pattern with duplicate bindings:', duplicates)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    for (var idx = 0; idx < this.properties.length; idx++)
      this.properties[idx].pattern.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    function outputPropertyRecipe(prop) {
      ws.nextPutAll('{name: ')
      ws.nextPutAll(stringUtils.printString(prop.name))
      ws.nextPutAll(', pattern: ')
      prop.pattern.outputRecipe(ws)
      ws.nextPutAll('}')
    }

    ws.nextPutAll('b.obj([')
    for (var idx = 0; idx < this.properties.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      outputPropertyRecipe(this.properties[idx])
    }
    ws.nextPutAll('], ')
    ws.nextPutAll(stringUtils.printString(!!this.isLenient))
    ws.nextPutAll(')')
  }
})

// Rule application

function Apply(ruleName) {
  this.ruleName = ruleName
}

Apply.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var ruleName = this.ruleName
    var origPosInfo = inputStream.getCurrentPosInfo()
    var memoRec = origPosInfo.memo[ruleName]
    if (memoRec && origPosInfo.shouldUseMemoizedResult(memoRec)) {
      inputStream.pos = memoRec.pos
      return memoRec.value
    } else if (origPosInfo.isActive(ruleName)) {
      var currentLeftRecursion = origPosInfo.getCurrentLeftRecursion()
      if (currentLeftRecursion && currentLeftRecursion.name === ruleName) {
        origPosInfo.updateInvolvedRules()
        inputStream.pos = currentLeftRecursion.pos
        return currentLeftRecursion.value
      } else {
        origPosInfo.startLeftRecursion(ruleName)
        return fail
      }
    } else {
      var body = ruleDict[ruleName] || browser.error('undefined rule', ruleName)
      origPosInfo.enter(ruleName)
      var value = this.evalOnce(body, ruleDict, inputStream)
      var currentLeftRecursion = origPosInfo.getCurrentLeftRecursion()
      if (currentLeftRecursion) {
        if (currentLeftRecursion.name === ruleName) {
          value = this.handleLeftRecursion(body, ruleDict, inputStream, origPosInfo.pos, currentLeftRecursion, value)
          origPosInfo.memo[ruleName] =
            {pos: inputStream.pos, value: value, involvedRules: currentLeftRecursion.involvedRules}
          origPosInfo.endLeftRecursion(ruleName)
        } else if (!currentLeftRecursion.involvedRules[ruleName])
          // Only memoize if this rule is not involved in the current left recursion
          origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value}
      } else
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value}
      origPosInfo.exit(ruleName)
      return value
    }
  },

  evalOnce: function(expr, ruleDict, inputStream) {
    var origPos = inputStream.pos
    var bindings = []
    var value = expr.eval(isSyntactic(this.ruleName), ruleDict, inputStream, bindings)
    if (value === fail)
      return fail
    else
      return new RuleThunk(this.ruleName, inputStream.source, origPos, inputStream.pos, value, bindings)
  },

  handleLeftRecursion: function(body, ruleDict, inputStream, origPos, currentLeftRecursion, seedValue) {
    var value = seedValue
    if (seedValue !== fail) {
      currentLeftRecursion.value = seedValue
      currentLeftRecursion.pos = inputStream.pos
      while (true) {
        inputStream.pos = origPos
        value = this.evalOnce(body, ruleDict, inputStream)
        if (value !== fail && inputStream.pos > currentLeftRecursion.pos) {
          currentLeftRecursion.value = value
          currentLeftRecursion.pos = inputStream.pos
        } else {
          value = currentLeftRecursion.value
          inputStream.pos = currentLeftRecursion.pos
          break
        }
      }
    }
    return value
  },

  assertNoDuplicateBindings: function(ruleName) {},
  assertChoicesHaveUniformBindings: function(ruleName) {},

  outputRecipe: function(ws) {
    ws.nextPutAll('b.app(')
    ws.nextPutAll(stringUtils.printString(this.ruleName))
    ws.nextPutAll(')')
  }
})

// Rule expansion -- an implementation detail of rule extension

function _Expand(ruleName, grammar) {
  if (grammar.ruleDict[ruleName] === undefined)
    browser.error('grammar', grammar.name, 'does not have a rule called', ruleName)
  else {
    this.ruleName = ruleName
    this.grammar = grammar
  }
}

_Expand.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    return this.expansion().eval(syntactic, ruleDict, inputStream, bindings)
  },

  expansion: function() {
    return this.grammar.ruleDict[this.ruleName]
  },

  getBindingNames: function() {
    return this.expansion().getBindingNames()
  },

  producesValue: function() {
    return this.expansion().producesValue()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expansion().assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    this.expansion().assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    // no-op
  }
})

// --------------------------------------------------------------------
// Grammar
// --------------------------------------------------------------------

function Grammar(ruleDict) {
  this.ruleDict = ruleDict
}

Grammar.prototype = {
  ruleDict: new function() {
    this._ = anything
    this.end = new Not(this._)
    this.space = Prim.newFor(/[\s]/)
    this.spaces = new Many(new Apply('space'), 0)
    this.alnum = Prim.newFor(/[0-9a-zA-Z]/)
    this.letter = Prim.newFor(/[a-zA-Z]/)
    this.lower = Prim.newFor(/[a-z]/)
    this.upper = Prim.newFor(/[A-Z]/)
    this.digit = Prim.newFor(/[0-9]/)
    this.hexDigit = Prim.newFor(/[0-9a-fA-F]/)
  },

  match: function(obj, startRule) {
    return this.matchContents([obj], startRule)
  },

  matchContents: function(obj, startRule) {
    var inputStream = InputStream.newFor(obj)
    var thunk = new Apply(startRule).eval(undefined, this.ruleDict, inputStream, undefined)
    if (isSyntactic(startRule))
      skipSpaces(this.ruleDict, inputStream)
    var assertSemanticActionNamesMatch = this.assertSemanticActionNamesMatch.bind(this)
    return thunk === fail || !inputStream.atEnd() ?
      false :
      function(actionDict) {
        assertSemanticActionNamesMatch(actionDict)
        return thunk.force(actionDict, {})
      }
  },

  assertSemanticActionNamesMatch: function(actionDict) {
    var self = this
    var ruleDict = this.ruleDict
    var ok = true
    objectUtils.keysDo(ruleDict, function(ruleName) {
      if (actionDict[ruleName] === undefined)
        return
      var actual = objectUtils.formals(actionDict[ruleName]).sort()
      var expected = self.semanticActionArgNames(ruleName)
      if (!equals.equals(actual, expected)) {
        ok = false
        console.log('semantic action for rule', ruleName, 'has the wrong argument names')
        console.log('  expected', expected)
        console.log('    actual', actual)
      }
    })
    if (!ok)
      browser.error('one or more semantic actions have the wrong argument names -- see console for details')
  },

  semanticActionArgNames: function(ruleName) {
    if (this.superGrammar && this.superGrammar.ruleDict[ruleName])
      return this.superGrammar.semanticActionArgNames(ruleName)
    else {
      var body = this.ruleDict[ruleName]
      var names = body.getBindingNames()
      if (names.length > 0)
        return names
      else if (body.producesValue())
        return ['value']
      else
        return []
    }
  },

  toRecipe: function() {
    var ws = new objectUtils.StringBuffer()
    ws.nextPutAll('(function(ohm, optNamespace) {\n')
    ws.nextPutAll('  var b = ohm.builder()\n')
    ws.nextPutAll('  b.setName('); ws.nextPutAll(stringUtils.printString(this.name)); ws.nextPutAll(')\n')
    if (this.superGrammar.name && this.superGrammar.namespaceName) {
      ws.nextPutAll('  b.setSuperGrammar(ohm.namespace(')
      ws.nextPutAll(stringUtils.printString(this.superGrammar.namespaceName))
      ws.nextPutAll(').getGrammar(')
      ws.nextPutAll(stringUtils.printString(this.superGrammar.name))
      ws.nextPutAll('))\n')
    }
    for (var idx = 0; idx < this.ruleDecls.length; idx++) {
      ws.nextPutAll('  ')
      this.ruleDecls[idx].outputRecipe(ws)
      ws.nextPutAll('\n')
    }
    ws.nextPutAll('  return b.build(optNamespace)\n')
    ws.nextPutAll('})')
    return ws.contents()
  }
}

// --------------------------------------------------------------------
// Builder
// --------------------------------------------------------------------

function RuleDecl() {
  throw 'RuleDecl cannot be instantiated -- it\'s abstract'
}

RuleDecl.prototype = {
  performChecks: abstract,

  performCommonChecks: function(name, body) {
    body.assertNoDuplicateBindings(name)
    body.assertChoicesHaveUniformBindings(name)
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.body
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.')
    ws.nextPutAll(this.kind)
    ws.nextPutAll('(')
    ws.nextPutAll(stringUtils.printString(this.name))
    ws.nextPutAll(', ')
    this.body.outputRecipe(ws)
    ws.nextPutAll(')')
  }
}

function Define(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.superGrammar = superGrammar
}

Define.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'define',

  performChecks: function() {
    if (this.superGrammar.ruleDict[this.name])
      browser.error('cannot define rule', this.name, 'because it already exists in the super-grammar.',
                    '(try override or extend instead.)')
    this.performCommonChecks(this.name, this.body)
  }
})

function Override(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.superGrammar = superGrammar
}

Override.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'override',

  performChecks: function() {
    var overridden = this.superGrammar.ruleDict[this.name]
    if (!overridden)
      browser.error('cannot override rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)')
    if (overridden.getBindingNames().length === 0 && overridden.producesValue() && !this.body.producesValue())
      browser.error('the body of rule', this.name,
                    'must produce a value, because the rule it\'s overriding also produces a value')
    // TODO: add unit test for this!
    // (if rule being overridden has no bindings but its body produces a value, this must produce a value too.)
    this.performCommonChecks(this.name, this.body)
  }
})

function Inline(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.superGrammar = superGrammar
}

Inline.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'inline',

  performChecks: function() {
    // TODO: consider relaxing this check, e.g., make it ok to override an inline rule if the nesting rule is
    // an override. But only if the inline rule that's being overridden is nested inside the nesting rule that
    // we're overriding? Hopefully there's a much less complicated way to do this :)
    if (this.superGrammar.ruleDict[this.name])
      browser.error('cannot define inline rule', this.name, 'because it already exists in the super-grammar.')
    this.performCommonChecks(this.name, this.body)
  }
})

function Extend(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.expandedBody = new Alt([body, new _Expand(name, superGrammar)])
  this.superGrammar = superGrammar
}

Extend.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'extend',

  performChecks: function() {
    var extended = this.superGrammar.ruleDict[this.name]
    if (!extended)
      browser.error('cannot extend rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)')
    if (extended.getBindingNames().length === 0 && extended.producesValue() && !this.body.producesValue())
      browser.error('the body of rule', this.name,
                    'must produce a value, because the rule it\'s extending also produces a value')
    // TODO: add unit test for this!
    // (if the rule being extended has no bindings but its body produces a value, this must produce a value too.)
    this.performCommonChecks(this.name, this.expandedBody)
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.expandedBody
  }
})

function Builder() {
  this.init()
}

Builder.prototype = {
  init: function() {
    this.name = undefined
    this.superGrammar = Grammar.prototype
    this.ruleDecls = []
  },

  setName: function(name) {
    this.name = name
  },

  setSuperGrammar: function(grammar) {
    this.superGrammar = grammar
  },

  define: function(ruleName, body) {
    this.ruleDecls.push(new Define(ruleName, body, this.superGrammar))
  },

  override: function(ruleName, body) {
    this.ruleDecls.push(new Override(ruleName, body, this.superGrammar))
  },

  inline: function(ruleName, body) {
    this.ruleDecls.push(new Inline(ruleName, body, this.superGrammar))
    return this.app(ruleName)
  },

  extend: function(ruleName, body) {
    this.ruleDecls.push(new Extend(ruleName, body, this.superGrammar))
  },

  build: function(optNamespace) {
    var superGrammar = this.superGrammar
    var ruleDict = objectUtils.objectThatDelegatesTo(superGrammar.ruleDict)
    this.ruleDecls.forEach(function(ruleDecl) {
      ruleDecl.performChecks()
      ruleDecl.install(ruleDict)
    })

    var grammar = new Grammar(ruleDict)
    grammar.superGrammar = superGrammar
    grammar.ruleDecls = this.ruleDecls
    if (this.name) {
      grammar.name = this.name
      if (optNamespace) {
        grammar.namespaceName = optNamespace.name
        optNamespace.install(this.name, grammar)
      }
    }
    this.init()
    return grammar
  },

  _: function(x) { return Prim.newFor(x) },
  alt: function(/* term1, term1, ... */) {
    var terms = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof Alt)
        terms = terms.concat(arg.terms)
      else
        terms.push(arg)
    }
    return terms.length === 1 ? terms[0] : new Alt(terms)
  },
  seq: function(/* factor1, factor2, ... */) {
    var factors = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof Seq)
        factors = factors.concat(arg.factors)
      else
        factors.push(arg)
    }
    return factors.length === 1 ? factors[0] : new Seq(factors)
  },
  bind: function(expr, name) { return new Bind(expr, name) },
  many: function(expr, minNumMatches) { return new Many(expr, minNumMatches) },
  opt: function(expr) { return new Opt(expr) },
  not: function(expr) { return new Not(expr) },
  la: function(expr) { return new Lookahead(expr) },
  str: function(expr) { return new Str(expr) },
  lst: function(expr) { return new List(expr) },
  obj: function(properties, isLenient) { return new Obj(properties, !!isLenient) },
  app: function(ruleName) { return new Apply(ruleName) }
}

// --------------------------------------------------------------------
// Namespaces
// --------------------------------------------------------------------

var namespaces = {}

function Namespace(name) {
  this.name = name
  this.grammars = {}
}

Namespace.prototype = {
  install: function(name, grammar) {
    if (this.grammars[name])
      browser.error('duplicate declaration of grammar', name, 'in namespace', this.name)
    else
      this.grammars[name] = grammar
    return this
  },

  getGrammar: function(name) {
    return this.grammars[name] || browser.error('ohm namespace', this.name, 'has no grammar called', name)
  },

  loadGrammarsFromScriptElement: function(element) {
    browser.sanityCheck('script tag\'s type attribute must be "text/ohm-js"', element.type === 'text/ohm-js')
    makeGrammars(element.innerHTML, this)
    return this
  }
}

// --------------------------------------------------------------------
// Factories
// --------------------------------------------------------------------

function makeGrammarActionDict(optNamespace) {
  var builder
  return {
    space: function(value) {},
    'space-multiLine': function() {},
    'space-singleLine': function() {},

    _name: function() { return this.interval.contents() },
    nameFirst: function(value) {},
    nameRest: function(value) {},

    name: function(n) { return n },

    namedConst: function(value) { return value },
    'namedConst-undefined': function() { return undefined },
    'namedConst-null': function() { return null },
    'namedConst-true': function() { return true },
    'namedConst-false': function() { return false },

    string: function(cs) { return cs.map(function(c) { return stringUtils.unescapeChar(c) }).join('') },
    sChar: function() { return this.interval.contents() },
    regexp: function(e) { return new RegExp(e) },
    reCharClass: function() { return this.interval.contents() },
    number: function() { return parseInt(this.interval.contents()) },

    Alt: function(value) { return value },
    'Alt-rec': function(x, y) { return builder.alt(x, y) },

    Term: function(value) { return value },
    'Term-inline': function(x, n) { return builder.inline(builder.currentRuleName + '-' + n, x) },

    Seq: function(value) { return builder.seq.apply(builder, value) },

    Factor: function(value) { return value },
    'Factor-bind': function(x, n) { return builder.bind(x, n) },

    Iter: function(value) { return value },
    'Iter-star': function(x) { return builder.many(x, 0) },
    'Iter-plus': function(x) { return builder.many(x, 1) },
    'Iter-opt': function(x) { return builder.opt(x) },

    Pred: function(value) { return value },
    'Pred-not': function(x) { return builder.not(x) },
    'Pred-lookahead': function(x) { return builder.la(x) },

    Base: function(value) { return value },
    'Base-undefined': function() { return builder._(undefined) },
    'Base-null': function() { return builder._(null) },
    'Base-true': function() { return builder._(true) },
    'Base-false': function() { return builder._(false) },
    'Base-application': function(ruleName) { return builder.app(ruleName) },
    'Base-prim': function(x) { return builder._(x) },
    'Base-lst': function(x) { return builder.lst(x) },
    'Base-str': function(x) { return builder.str(x) },
    'Base-paren': function(x) { return x },
    'Base-obj': function(lenient) { return builder.obj([], lenient) },
    'Base-objWithProps': function(ps, lenient) { return builder.obj(ps, lenient) },

    Props: function(value) { return value },
    'Props-base': function(p) { return [p] },
    'Props-rec': function(p, ps) { return [p].concat(ps) },
    Prop: function(n, p) { return {name: n, pattern: p} },

    Rule: function(value) {},
    'Rule-define': function(n, b) { return builder.define(n, b) },
    'Rule-override': function(n, b) { return builder.override(n, b) },
    'Rule-extend': function(n, b) { return builder.extend(n, b) },
    RuleName: function(value) { builder.currentRuleName = value; return value },

    SuperGrammar: function(value) { builder.setSuperGrammar(value) },
    'SuperGrammar-qualified': function(ns, n) { return thisModule.namespace(ns).getGrammar(n) },
    'SuperGrammar-unqualified': function(n) { return optNamespace.getGrammar(n) },

    Grammar: function(n, s, rs) {
      return builder.build(optNamespace)
    },
    Grammars: function(value) {
      return value
    },
    GrammarName: function(value) { builder = new Builder(); builder.setName(value); return value }
  }
}

var first = true
function compileAndLoad(source, whatItIs, optNamespace) {
  var thunk = thisModule._ohmGrammar.matchContents(source, whatItIs)
  if (thunk)
    return thunk(makeGrammarActionDict(optNamespace))
  else
    // TODO: improve error message (show what part of the input is wrong, what was expected, etc.)
    browser.error('invalid input in:', source)
}

function makeGrammar(source, optNamespace) {
  return compileAndLoad(source, 'Grammar', optNamespace)
}

function makeGrammars(source, optNamespace) {
  return compileAndLoad(source, 'Grammars', optNamespace)
}

// --------------------------------------------------------------------
// Public methods
// --------------------------------------------------------------------

// Stuff that users should know about

thisModule.namespace = function(name) {
  if (namespaces[name] === undefined)
    namespaces[name] = new Namespace(name)
  return namespaces[name]
}

thisModule.makeGrammar = makeGrammar
thisModule.makeGrammars = makeGrammars

// Stuff that's only useful for bootstrapping, testing, etc.

// TODO: rename to _builder
thisModule.builder = function() {
  return new Builder()
}

thisModule._makeGrammarActionDict = makeGrammarActionDict

var ohmGrammar
Object.defineProperty(thisModule, '_ohmGrammar', {
  get: function() {
    if (!ohmGrammar)
      ohmGrammar = this._ohmGrammarFactory(this)
    return ohmGrammar
  }
})


},{"../dist/ohm-grammar.js":1,"awlib":2}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9vaG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uL3NyYy9vaG0uanMnKVxub2htLl9vaG1HcmFtbWFyRmFjdG9yeSA9XG4oZnVuY3Rpb24ob2htLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIGIgPSBvaG0uYnVpbGRlcigpXG4gIGIuc2V0TmFtZSgnT2htJylcbiAgYi5pbmxpbmUoJ3NwYWNlLXNpbmdsZUxpbmUnLCBiLnNlcShiLl8oJy8vJyksIGIubWFueShiLnNlcShiLm5vdChiLl8oJ1xcbicpKSwgYi5hcHAoJ18nKSksIDApLCBiLl8oJ1xcbicpKSlcbiAgYi5pbmxpbmUoJ3NwYWNlLW11bHRpTGluZScsIGIuc2VxKGIuXygnLyonKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnKi8nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCcqLycpKSlcbiAgYi5leHRlbmQoJ3NwYWNlJywgYi5hbHQoYi5hcHAoJ3NwYWNlLXNpbmdsZUxpbmUnKSwgYi5hcHAoJ3NwYWNlLW11bHRpTGluZScpKSlcbiAgYi5kZWZpbmUoJ19uYW1lJywgYi5zZXEoYi5hcHAoJ25hbWVGaXJzdCcpLCBiLm1hbnkoYi5hcHAoJ25hbWVSZXN0JyksIDApKSlcbiAgYi5kZWZpbmUoJ25hbWVGaXJzdCcsIGIuYWx0KGIuXygnXycpLCBiLmFwcCgnbGV0dGVyJykpKVxuICBiLmRlZmluZSgnbmFtZVJlc3QnLCBiLmFsdChiLl8oJ18nKSwgYi5hcHAoJ2FsbnVtJykpKVxuICBiLmRlZmluZSgnbmFtZScsIGIuc2VxKGIubm90KGIuYXBwKCduYW1lZENvbnN0JykpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJykpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC11bmRlZmluZWQnLCBiLnNlcShiLl8oJ3VuZGVmaW5lZCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC1udWxsJywgYi5zZXEoYi5fKCdudWxsJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LXRydWUnLCBiLnNlcShiLl8oJ3RydWUnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtZmFsc2UnLCBiLnNlcShiLl8oJ2ZhbHNlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuZGVmaW5lKCduYW1lZENvbnN0JywgYi5hbHQoYi5hcHAoJ25hbWVkQ29uc3QtdW5kZWZpbmVkJyksIGIuYXBwKCduYW1lZENvbnN0LW51bGwnKSwgYi5hcHAoJ25hbWVkQ29uc3QtdHJ1ZScpLCBiLmFwcCgnbmFtZWRDb25zdC1mYWxzZScpKSlcbiAgYi5kZWZpbmUoJ3N0cmluZycsIGIuc2VxKGIuXyhcIidcIiksIGIuYmluZChiLm1hbnkoYi5hcHAoJ3NDaGFyJyksIDApLCAnY3MnKSwgYi5fKFwiJ1wiKSkpXG4gIGIuZGVmaW5lKCdzQ2hhcicsIGIuYWx0KGIuc2VxKGIuXygnXFxcXHgnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5fKCdcXFxcdScpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIuXygnXFxcXCcpLCBiLmFwcCgnXycpKSwgYi5zZXEoYi5ub3QoYi5fKFwiJ1wiKSksIGIuYXBwKCdfJykpKSlcbiAgYi5kZWZpbmUoJ3JlZ2V4cCcsIGIuc2VxKGIuXygnLycpLCBiLmJpbmQoYi5hcHAoJ3JlQ2hhckNsYXNzJyksICdlJyksIGIuXygnLycpKSlcbiAgYi5kZWZpbmUoJ3JlQ2hhckNsYXNzJywgYi5zZXEoYi5fKCdbJyksIGIubWFueShiLmFsdChiLl8oJ1xcXFxdJyksIGIuc2VxKGIubm90KGIuXygnXScpKSwgYi5hcHAoJ18nKSkpLCAwKSwgYi5fKCddJykpKVxuICBiLmRlZmluZSgnbnVtYmVyJywgYi5zZXEoYi5vcHQoYi5fKCctJykpLCBiLm1hbnkoYi5hcHAoJ2RpZ2l0JyksIDEpKSlcbiAgYi5pbmxpbmUoJ0FsdC1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Rlcm0nKSwgJ3gnKSwgYi5fKCd8JyksIGIuYmluZChiLmFwcCgnQWx0JyksICd5JykpKVxuICBiLmRlZmluZSgnQWx0JywgYi5hbHQoYi5hcHAoJ0FsdC1yZWMnKSwgYi5hcHAoJ1Rlcm0nKSkpXG4gIGIuaW5saW5lKCdUZXJtLWlubGluZScsIGIuc2VxKGIuYmluZChiLmFwcCgnU2VxJyksICd4JyksIGIuXygneycpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJyksIGIuXygnfScpKSlcbiAgYi5kZWZpbmUoJ1Rlcm0nLCBiLmFsdChiLmFwcCgnVGVybS1pbmxpbmUnKSwgYi5hcHAoJ1NlcScpKSlcbiAgYi5kZWZpbmUoJ1NlcScsIGIubWFueShiLmFwcCgnRmFjdG9yJyksIDApKVxuICBiLmlubGluZSgnRmFjdG9yLWJpbmQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ0l0ZXInKSwgJ3gnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5kZWZpbmUoJ0ZhY3RvcicsIGIuYWx0KGIuYXBwKCdGYWN0b3ItYmluZCcpLCBiLmFwcCgnSXRlcicpKSlcbiAgYi5pbmxpbmUoJ0l0ZXItc3RhcicsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJyonKSkpXG4gIGIuaW5saW5lKCdJdGVyLXBsdXMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCcrJykpKVxuICBiLmlubGluZSgnSXRlci1vcHQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCc/JykpKVxuICBiLmRlZmluZSgnSXRlcicsIGIuYWx0KGIuYXBwKCdJdGVyLXN0YXInKSwgYi5hcHAoJ0l0ZXItcGx1cycpLCBiLmFwcCgnSXRlci1vcHQnKSwgYi5hcHAoJ1ByZWQnKSkpXG4gIGIuaW5saW5lKCdQcmVkLW5vdCcsIGIuc2VxKGIuXygnficpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuaW5saW5lKCdQcmVkLWxvb2thaGVhZCcsIGIuc2VxKGIuXygnJicpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuZGVmaW5lKCdQcmVkJywgYi5hbHQoYi5hcHAoJ1ByZWQtbm90JyksIGIuYXBwKCdQcmVkLWxvb2thaGVhZCcpLCBiLmFwcCgnQmFzZScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtYXBwbGljYXRpb24nLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ3J1bGVOYW1lJyksIGIubm90KGIuYWx0KGIuXygnPT0nKSwgYi5fKCc6PScpLCBiLl8oJys9JykpKSkpXG4gIGIuaW5saW5lKCdCYXNlLXByaW0nLCBiLmJpbmQoYi5hbHQoYi5hcHAoJ25hbWVkQ29uc3QnKSwgYi5hcHAoJ3N0cmluZycpLCBiLmFwcCgncmVnZXhwJyksIGIuYXBwKCdudW1iZXInKSksICd4JykpXG4gIGIuaW5saW5lKCdCYXNlLWxzdCcsIGIuc2VxKGIuXygnWycpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJ10nKSkpXG4gIGIuaW5saW5lKCdCYXNlLXN0cicsIGIuc2VxKGIuXygnXCInKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5fKCdcIicpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtcGFyZW4nLCBiLnNlcShiLl8oJygnKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5fKCcpJykpKVxuICBiLmlubGluZSgnQmFzZS1vYmonLCBiLnNlcShiLl8oJ3snKSwgYi5iaW5kKGIub3B0KGIuXygnLi4uJykpLCAnbGVuaWVudCcpLCBiLl8oJ30nKSkpXG4gIGIuaW5saW5lKCdCYXNlLW9ialdpdGhQcm9wcycsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5hcHAoJ1Byb3BzJyksICdwcycpLCBiLmJpbmQoYi5vcHQoYi5zZXEoYi5fKCcsJyksIGIuXygnLi4uJykpKSwgJ2xlbmllbnQnKSwgYi5fKCd9JykpKVxuICBiLmRlZmluZSgnQmFzZScsIGIuYWx0KGIuYXBwKCdCYXNlLWFwcGxpY2F0aW9uJyksIGIuYXBwKCdCYXNlLXByaW0nKSwgYi5hcHAoJ0Jhc2UtbHN0JyksIGIuYXBwKCdCYXNlLXN0cicpLCBiLmFwcCgnQmFzZS1wYXJlbicpLCBiLmFwcCgnQmFzZS1vYmonKSwgYi5hcHAoJ0Jhc2Utb2JqV2l0aFByb3BzJykpKVxuICBiLmlubGluZSgnUHJvcHMtcmVjJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcm9wJyksICdwJyksIGIuXygnLCcpLCBiLmJpbmQoYi5hcHAoJ1Byb3BzJyksICdwcycpKSlcbiAgYi5pbmxpbmUoJ1Byb3BzLWJhc2UnLCBiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSlcbiAgYi5kZWZpbmUoJ1Byb3BzJywgYi5hbHQoYi5hcHAoJ1Byb3BzLXJlYycpLCBiLmFwcCgnUHJvcHMtYmFzZScpKSlcbiAgYi5kZWZpbmUoJ1Byb3AnLCBiLnNlcShiLmJpbmQoYi5hbHQoYi5hcHAoJ19uYW1lJyksIGIuYXBwKCdzdHJpbmcnKSksICduJyksIGIuXygnOicpLCBiLmJpbmQoYi5hcHAoJ0ZhY3RvcicpLCAncCcpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtZGVmaW5lJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdSdWxlTmFtZScpLCAnbicpLCBiLl8oJz09JyksIGIuYmluZChiLmFwcCgnQWx0JyksICdiJykpKVxuICBiLmlubGluZSgnUnVsZS1vdmVycmlkZScsIGIuc2VxKGIuYmluZChiLmFwcCgnUnVsZU5hbWUnKSwgJ24nKSwgYi5fKCc6PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtZXh0ZW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdSdWxlTmFtZScpLCAnbicpLCBiLl8oJys9JyksIGIuYmluZChiLmFwcCgnQWx0JyksICdiJykpKVxuICBiLmRlZmluZSgnUnVsZScsIGIuYWx0KGIuYXBwKCdSdWxlLWRlZmluZScpLCBiLmFwcCgnUnVsZS1vdmVycmlkZScpLCBiLmFwcCgnUnVsZS1leHRlbmQnKSkpXG4gIGIuZGVmaW5lKCdSdWxlTmFtZScsIGIuYXBwKCduYW1lJykpXG4gIGIuaW5saW5lKCdTdXBlckdyYW1tYXItcXVhbGlmaWVkJywgYi5zZXEoYi5fKCc8OicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ25zJyksIGIuXygnLicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSkpXG4gIGIuaW5saW5lKCdTdXBlckdyYW1tYXItdW5xdWFsaWZpZWQnLCBiLnNlcShiLl8oJzw6JyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5kZWZpbmUoJ1N1cGVyR3JhbW1hcicsIGIuYWx0KGIuYXBwKCdTdXBlckdyYW1tYXItcXVhbGlmaWVkJyksIGIuYXBwKCdTdXBlckdyYW1tYXItdW5xdWFsaWZpZWQnKSkpXG4gIGIuZGVmaW5lKCdHcmFtbWFyJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdHcmFtbWFyTmFtZScpLCAnbicpLCBiLmJpbmQoYi5vcHQoYi5hcHAoJ1N1cGVyR3JhbW1hcicpKSwgJ3MnKSwgYi5fKCd7JyksIGIuYmluZChiLm1hbnkoYi5hcHAoJ1J1bGUnKSwgMCksICdycycpLCBiLl8oJ30nKSkpXG4gIGIuZGVmaW5lKCdHcmFtbWFycycsIGIubWFueShiLmFwcCgnR3JhbW1hcicpLCAwKSlcbiAgYi5kZWZpbmUoJ0dyYW1tYXJOYW1lJywgYi5hcHAoJ25hbWUnKSlcbiAgcmV0dXJuIGIuYnVpbGQob3B0TmFtZXNwYWNlKVxufSlcbiIsImV4cG9ydHMub2JqZWN0VXRpbHMgPSByZXF1aXJlKCcuL29iamVjdFV0aWxzLmpzJylcbmV4cG9ydHMuc3RyaW5nVXRpbHMgPSByZXF1aXJlKCcuL3N0cmluZ1V0aWxzLmpzJylcbmV4cG9ydHMuZXF1YWxzID0gcmVxdWlyZSgnLi9lcXVhbHMuanMnKVxuZXhwb3J0cy5icm93c2VyID0gcmVxdWlyZSgnLi9icm93c2VyLmpzJylcbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTG9nZ2luZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHN1YnNjcmliZWQgPSB7fVxuXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKHN1YmplY3QgLyogLCAuLi4gKi8pIHtcbiAgaWYgKCFzdWJzY3JpYmVkW3N1YmplY3RdKVxuICAgIHJldHVyblxuICBhcmd1bWVudHNbMF0gPSAnWycgKyBzdWJqZWN0ICsgJ10nXG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbn1cblxuZXhwb3J0cy5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHN1YnNjcmliZWRbc3ViamVjdF0gPSB0cnVlXG59XG5cbmV4cG9ydHMudW5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIGRlbGV0ZSBzaG93aW5nW3N1YmplY3RdXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBc3NlcnRzLCBlcnJvcnMsIGV0Yy5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuZXJyb3IgPSBmdW5jdGlvbigvKiBhcmcxLCBhcmcyLCAuLi4gKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJncylcbiAgdGhyb3cgJ2Vycm9yOiAnICsgYXJncy5qb2luKCcgJylcbn1cblxuZXhwb3J0cy5zYW5pdHlDaGVjayA9IGZ1bmN0aW9uKG5hbWUsIGNvbmRpdGlvbikge1xuICBpZiAoIWNvbmRpdGlvbilcbiAgICB0aGlzTW9kdWxlLmVycm9yKCdmYWlsZWQgc2FuaXR5IGNoZWNrOicsIG5hbWUpXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBET00gdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMucHJldHR5UHJpbnROb2RlID0gZnVuY3Rpb24obm9kZSwgZW5kTm9kZSwgZW5kT2Zmc2V0KSB7XG4gIGlmIChub2RlIGluc3RhbmNlb2YgVGV4dCkge1xuICAgIGlmIChub2RlID09PSBlbmROb2RlKVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEuc3Vic3RyKDAsIGVuZE9mZnNldCkgKyAnfCcgKyBub2RlLmRhdGEuc3Vic3RyKGVuZE9mZnNldCkgKyAnfSdcbiAgICBlbHNlXG4gICAgICByZXR1cm4gJ3RleHR7JyArIG5vZGUuZGF0YSArICd9J1xuICB9XG5cbiAgdmFyIHBhcnRzID0gW25vZGUudGFnTmFtZSwgJ3snXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBpZHgpXG4gICAgICBwYXJ0cy5wdXNoKCd8JylcbiAgICBwYXJ0cy5wdXNoKHRoaXNNb2R1bGUucHJldHR5UHJpbnROb2RlKG5vZGUuY2hpbGROb2Rlcy5pdGVtKGlkeCksIGVuZE5vZGUsIGVuZE9mZnNldCkpXG4gIH1cbiAgaWYgKG5vZGUgPT09IGVuZE5vZGUgJiYgZW5kT2Zmc2V0ID09IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgcGFydHMucHVzaCgnfCcpXG4gIHBhcnRzLnB1c2goJ30nKVxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cblxuIiwiLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBkb3VibGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PSB5XG59XG5cbmZ1bmN0aW9uIHRyaXBsZUVxdWFscyh4LCB5KSB7XG4gIHJldHVybiB4ID09PSB5XG59XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKHgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgeFxuICByZXR1cm4gdHlwZSAhPT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pIHtcbiAgaWYgKGlzUHJpbWl0aXZlKHgpKVxuICAgIHJldHVybiBlcUZuKHgsIHkpXG4gIGZvciAodmFyIHAgaW4geClcbiAgICBpZiAoZGVlcCAmJiAhZXF1YWxzKHhbcF0sIHlbcF0sIGRlZXAsIGVxRm4pIHx8XG4gICAgICAgICFkZWVwICYmICFlcUZuKHhbcF0sIHlbcF0pKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIHAgaW4geSlcbiAgICBpZiAoeVtwXSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHhbcF0gPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiBmYWxzZVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCBkZWVwLCBlcUZuKSB7XG4gIGlmICghYXJyMSBpbnN0YW5jZW9mIEFycmF5IHx8ICFhcnIyIGluc3RhbmNlb2YgQXJyYXkgfHxcbiAgICAgIGFycjEubGVuZ3RoICE9PSBhcnIyLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2VcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJyMS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnIxW2lkeF1cbiAgICB2YXIgZm91bmRYID0gYXJyMi5zb21lKGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiBlcXVhbHMoeCwgeSwgZGVlcCwgZXFGbilcbiAgICB9KVxuICAgIGlmICghZm91bmRYKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuLy8gUHVibGljIG1ldGhvZHNcblxuZXhwb3J0cy5lcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgZmFsc2UsIGRvdWJsZUVxdWFscylcbn1cblxuZXhwb3J0cy5kZWVwRXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIHRydWUsIGRvdWJsZUVxdWFscylcbn1cblxuZXhwb3J0cy5zdHJpY3RFcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgZmFsc2UsIHRyaXBsZUVxdWFscylcbn1cblxuZXhwb3J0cy5zdHJpY3REZWVwRXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIHRydWUsIHRyaXBsZUVxdWFscylcbn1cblxuZXhwb3J0cy5oYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlciA9IGZ1bmN0aW9uKGFycjEsIGFycjIpIHtcbiAgcmV0dXJuIGhhdmVTYW1lQ29udGVudHNJbkFueU9yZGVyKGFycjEsIGFycjIsIHRydWUsIGRvdWJsZUVxdWFscylcbn1cblxuIiwidmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbmV4cG9ydHMub2JqZWN0VGhhdERlbGVnYXRlc1RvID0gZnVuY3Rpb24ob2JqLCBvcHRQcm9wZXJ0aWVzKSB7XG4gIGZ1bmN0aW9uIGNvbnMoKSB7fVxuICBjb25zLnByb3RvdHlwZSA9IG9ialxuICB2YXIgYW5zID0gbmV3IGNvbnMoKVxuICBpZiAob3B0UHJvcGVydGllcylcbiAgICB0aGlzTW9kdWxlLmtleXNBbmRWYWx1ZXNEbyhvcHRQcm9wZXJ0aWVzLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBhbnNba10gPSB2XG4gICAgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5leHBvcnRzLmZvcm1hbHMgPSBmdW5jdGlvbihmdW5jKSB7XG4gIHJldHVybiBmdW5jLlxuICAgIHRvU3RyaW5nKCkuXG4gICAgbWF0Y2goL1xcKCguKj8pXFwpLylbMF0uXG4gICAgcmVwbGFjZSgvIC9nLCAnJykuXG4gICAgc2xpY2UoMSwgLTEpLlxuICAgIHNwbGl0KCcsJykuXG4gICAgZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZU5hbWUpIHsgcmV0dXJuIG1vZHVsZU5hbWUgIT0gJycgfSlcbn1cblxuZXhwb3J0cy5rZXlzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIGZvciAodmFyIHAgaW4gb2JqZWN0KVxuICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkocCkpXG4gICAgICBmbihwKVxufVxuXG5leHBvcnRzLnZhbHVlc0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICB0aGlzTW9kdWxlLmtleXNEbyhvYmplY3QsIGZ1bmN0aW9uKHApIHsgZm4ob2JqZWN0W3BdKSB9KVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKHAsIG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYua2V5c0RvKG9iamVjdCwgZm4pIH1cbn1cblxuZXhwb3J0cy52YWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi52YWx1ZXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMua2V5c0FuZFZhbHVlc0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNBbmRWYWx1ZXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBhbnMgPSBbXVxuICB0aGlzTW9kdWxlLmtleXNEbyhvYmplY3QsIGZ1bmN0aW9uKHApIHsgYW5zLnB1c2gob2JqZWN0W3BdKSB9KVxuICByZXR1cm4gYW5zXG59XG5cbmZ1bmN0aW9uIFN0cmluZ0J1ZmZlcigpIHtcbiAgdGhpcy5zdHJpbmdzID0gW11cbiAgdGhpcy5sZW5ndGhTb0ZhciA9IDBcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspXG4gICAgdGhpcy5uZXh0UHV0QWxsKGFyZ3VtZW50c1tpZHhdKVxufVxuXG5TdHJpbmdCdWZmZXIucHJvdG90eXBlID0ge1xuICBuZXh0UHV0QWxsOiBmdW5jdGlvbihzKSB7XG4gICAgdGhpcy5zdHJpbmdzLnB1c2gocylcbiAgICB0aGlzLmxlbmd0aFNvRmFyICs9IHMubGVuZ3RoXG4gIH0sXG5cbiAgY29udGVudHM6IGZ1bmN0aW9uKCkgIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmdzLmpvaW4oJycpXG4gIH1cbn1cblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIgPSBTdHJpbmdCdWZmZXJcblxuIiwidmFyIG9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBwYWQobnVtYmVyQXNTdHJpbmcsIGxlbikge1xuICB2YXIgemVyb3MgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1iZXJBc1N0cmluZy5sZW5ndGggLSBsZW47IGlkeCsrKVxuICAgIHplcm9zLnB1c2goJzAnKVxuICByZXR1cm4gemVyb3Muam9pbignJykgKyBudW1iZXJBc1N0cmluZ1xufVxuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge31cbmZvciAodmFyIGMgPSAwOyBjIDwgMTI4OyBjKyspXG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYylcbmVzY2FwZVN0cmluZ0ZvcltcIidcIi5jaGFyQ29kZUF0KDApXSAgPSBcIlxcXFwnXCJcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldICA9ICdcXFxcXCInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJ1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxyJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0J1xuZXNjYXBlU3RyaW5nRm9yWydcXHYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx2J1xuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLmVzY2FwZUNoYXIgPSBmdW5jdGlvbihjLCBvcHREZWxpbSkge1xuICB2YXIgY2hhckNvZGUgPSBjLmNoYXJDb2RlQXQoMClcbiAgaWYgKChjID09ICdcIicgfHwgYyA9PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pXG4gICAgcmV0dXJuIGNcbiAgZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpXG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV1cbiAgZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KVxuICAgIHJldHVybiAnXFxcXHgnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMilcbiAgZWxzZVxuICAgIHJldHVybiAnXFxcXHUnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNClcbn1cblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PSAnXFxcXCcpXG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6ICByZXR1cm4gJ1xcYidcbiAgICAgIGNhc2UgJ2YnOiAgcmV0dXJuICdcXGYnXG4gICAgICBjYXNlICduJzogIHJldHVybiAnXFxuJ1xuICAgICAgY2FzZSAncic6ICByZXR1cm4gJ1xccidcbiAgICAgIGNhc2UgJ3QnOiAgcmV0dXJuICdcXHQnXG4gICAgICBjYXNlICd2JzogIHJldHVybiAnXFx2J1xuICAgICAgY2FzZSAneCc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA0KSwgMTYpKVxuICAgICAgY2FzZSAndSc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKVxuICAgICAgZGVmYXVsdDogICByZXR1cm4gcy5jaGFyQXQoMSlcbiAgICB9XG4gIGVsc2VcbiAgICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiBwcmludE9uKHgsIHdzKSB7XG4gIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdbJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB4Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKHhbaWR4XSwgd3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJ10nKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIHZhciBoYXNTaW5nbGVRdW90ZXMgPSB4LmluZGV4T2YoXCInXCIpID49IDBcbiAgICB2YXIgaGFzRG91YmxlUXVvdGVzID0geC5pbmRleE9mKCdcIicpID49IDBcbiAgICB2YXIgZGVsaW0gPSBoYXNTaW5nbGVRdW90ZXMgJiYgIWhhc0RvdWJsZVF1b3RlcyA/ICdcIicgOiBcIidcIlxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKVxuICAgICAgd3MubmV4dFB1dEFsbCh0aGlzTW9kdWxlLmVzY2FwZUNoYXIoeFtpZHhdLCBkZWxpbSkpXG4gICAgd3MubmV4dFB1dEFsbChkZWxpbSlcbiAgfSBlbHNlIGlmICh4ID09PSBudWxsKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnbnVsbCcpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmICEoeCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCd7JylcbiAgICB2YXIgZmlyc3QgPSB0cnVlXG4gICAgb2JqZWN0VXRpbHMua2V5c0FuZFZhbHVlc0RvKHgsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGlmIChmaXJzdClcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKGssIHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnOiAnKVxuICAgICAgcHJpbnRPbih2LCB3cylcbiAgICB9KVxuICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICB9IGVsc2VcbiAgICB3cy5uZXh0UHV0QWxsKCcnICsgeClcbn1cblxuZXhwb3J0cy5wcmludFN0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgd3MgPSBuZXcgb2JqZWN0VXRpbHMuU3RyaW5nQnVmZmVyKClcbiAgcHJpbnRPbihvYmosIHdzKVxuICByZXR1cm4gd3MuY29udGVudHMoKVxufVxuXG4iLCIvKlxuXG5UT0RPOlxuXG4qIFRoaW5rIGFib3V0IGltcHJvdmluZyB0aGUgaW1wbGVtZW50YXRpb24gb2Ygc3ludGFjdGljIHJ1bGVzJyBhdXRvbWF0aWMgc3BhY2Ugc2tpcHBpbmc6XG4gIC0tIENvdWxkIGtlZXAgdHJhY2sgb2YgdGhlIGN1cnJlbnQgcnVsZSBuYW1lIGJ5IG1vZGlmeWluZyB0aGUgY29kZSAoaW4gQXBwbHkuZXZhbCkgd2hlcmUgZW50ZXIgYW5kIGV4aXQgbWV0aG9kc1xuICAgICBhcmUgY2FsbGVkLiAoV291bGQgYWxzbyB3YW50IHRvIGtlZXAgdHJhY2sgb2Ygd2hldGhlciB0aGUgcnVsZSBpcyBzeW50YWN0aWMgdG8gYXZvaWQgcmUtZG9pbmcgdGhhdCB3b3JrXG4gICAgIGF0IGVhY2ggYXBwbGljYXRpb24uKVxuXG4qIENvbnNpZGVyIGJvcnJvd2luZyAoc29tZXRoaW5nIGxpa2UpIHRoZSB2YXJpYWJsZS1ub3Qtb3RoZXJ3aXNlLW1lbnRpb25lZCBpZGVhIGZyb20gUm9iYnkgRmluZGxlcidzIHJlZGV4LCBhcyBhIHdheVxuICB0byBtYWtlIGl0IGVhc2llciBmb3IgcHJvZ3JhbW1lcnMgdG8gZGVhbCB3aXRoIGtleXdvcmRzIGFuZCBpZGVudGlmaWVycy5cblxuKiBUaGluayBhYm91dCBhIGJldHRlciB3YXkgdG8gZGVhbCB3aXRoIGxpc3RzXG4gIC0tIEJ1aWx0LWluIGxpc3Qgb3BlcmF0b3I/XG4gIC0tIFBhcmFtZXRlcml6ZWQgcnVsZXM/XG5cbiogSW1wcm92ZSB0ZXN0IGNvdmVyYWdlXG4gIC0tIEFkZCB0ZXN0cyBmb3Igc2NvcGluZywgZS5nLiwgXCJmb286YSBbYmFyOmIgYmF6OmNdOmRcIiBzaG91bGQgaGF2ZSA0IGJpbmRpbmdzLlxuICAgICAoU2FtZSBraW5kIG9mIHRoaW5nIGZvciBuZXN0ZWQgc3RyaW5nIGFuZCBsb29rYWhlYWQgZXhwcmVzc2lvbnMsIHRoZWlyIGJpbmRpbmdzIHNob3VsZCBsZWFrIHRvIHRoZSBlbmNsb3Npbmcgc2VxLilcblxuKiBUaGluayBhYm91dCBmb3JlaWduIHJ1bGUgaW52b2NhdGlvblxuICAtLSBDYW4ndCBqdXN0IGJlIGRvbmUgaW4gdGhlIHNhbWUgd2F5IGFzIGluIE9NZXRhIGIvYyBvZiB0aGUgYWN0aW9uRGljdFxuICAtLSBXaWxsIHdhbnQgdG8gcHJlc2VydmUgdGhlIFwibm8gdW5uZWNlc3Nhcnkgc2VtYW50aWMgYWN0aW9uc1wiIGd1YXJhbnRlZVxuICAtLSBUaGUgc29sdXRpb24gbWlnaHQgYmUgdG8gZW5hYmxlIHRoZSBwcm9ncmFtbWVyIHRvIHByb3ZpZGUgbXVsdGlwbGUgYWN0aW9uRGljdHMsXG4gICAgIGJ1dCBJJ2xsIGhhdmUgdG8gY29tZSB1cCB3aXRoIGEgY29udmVuaWVudCB3YXkgdG8gYXNzb2NpYXRlIGVhY2ggd2l0aCBhIHBhcnRpY3VsYXIgZ3JhbW1hci5cblxuKiBUaGluayBhYm91dCBpbmNyZW1lbnRhbCBwYXJzaW5nIChnb29kIGZvciBlZGl0b3JzKVxuICAtLSBCYXNpYyBpZGVhOiBrZWVwIHRyYWNrIG9mIG1heCBpbmRleCBzZWVuIHRvIGNvbXB1dGUgYSByZXN1bHRcbiAgICAgKHN0b3JlIHRoaXMgaW4gbWVtbyByZWMgYXMgYW4gaW50IHJlbGF0aXZlIHRvIGN1cnIgcG9zKVxuICAtLSBPayB0byByZXVzZSBtZW1vaXplZCB2YWx1ZSBhcyBsb25nIGFzIHJhbmdlIGZyb20gY3VycmVudCBpbmRleCB0byBtYXggaW5kZXggaGFzbid0IGNoYW5nZWRcbiAgLS0gQ291bGQgYmUgYSBjdXRlIHdvcmtzaG9wIHBhcGVyLi4uXG5cblxuU3ludGF4IC8gbGFuZ3VhZ2UgaWRlYXM6XG5cbiogU3ludGF4IGZvciBydWxlIGRlY2xhcmF0aW9uczpcblxuICAgIGZvbyA9PSBiYXIgYmF6ICAgICAoZGVmaW5lKVxuICAgIGZvbyA6PSBiYXIgYmF6ICAgICAob3ZlcnJpZGUgLyByZXBsYWNlKVxuICAgIGZvbyA8PSBiYXIgYmF6ICAgICAoZXh0ZW5kKVxuXG4qIElubGluZSBydWxlcywgZS5nLixcblxuICAgIGFkZEV4cHIgPSBhZGRFeHByOnggJysnIG11bEV4cHI6eSB7cGx1c31cbiAgICAgICAgICAgIHwgYWRkRXhwcjp4ICctJyBtdWxFeHByOnkge21pbnVzfVxuICAgICAgICAgICAgfCBtdWxFeHByXG5cbiAgaXMgc3ludGFjdGljIHN1Z2FyIGZvclxuXG4gICAgYWRkRXhwciA9IHBsdXMgfCBtaW51cyB8IG11bEV4cHIsXG4gICAgcGx1cyA9IGFkZEV4cHI6eCAnKycgbXVsRXhwcjp5LFxuICAgIG1pbnVzID0gYWRkRXhwcjp4ICctJyBtdWxFeHByOnlcblxuKiBJbiB0aGlzIGV4YW1wbGU6XG5cbiAgICBmb28gPSBcImJhclwiXG4gICAgYmFyID0gJ2FiYydcblxuICBUaGUgZm9vIHJ1bGUgc2F5cyBpdCB3YW50cyB0aGUgYmFyIHJ1bGUgdG8gbWF0Y2ggdGhlIGNvbnRlbnRzIG9mIGEgc3RyaW5nIG9iamVjdC4gKFRoZSBcInMgaXMgYSBraW5kIG9mIHBhcmVudGhlc2lzLilcbiAgVGhlbiB5b3UgY291bGQgZWl0aGVyIHNheVxuXG4gICAgbS5tYXRjaEFsbCgnYWJjJywgJ2JhcicpXG5cbiAgb3JcblxuICAgIG0ubWF0Y2goJ2FiYycsICdmb28nKVxuXG4gIEJvdGggc2hvdWxkIHN1Y2NlZWQuXG5cbiogQWJvdXQgb2JqZWN0IG1hdGNoaW5nXG5cbiAgU29tZSBpc3N1ZXM6XG4gIC0tIFNob3VsZCBkZWZpbml0ZWx5IGFsbG93IHBhdHRlcm4gbWF0Y2hpbmcgb24gZWFjaCBwcm9wZXJ0eSdzIHZhbHVlLiBCdXQgd2hhdCBhYm91dCBwcm9wZXJ0eSBuYW1lcz9cbiAgLS0gV2hhdCB0byBkbyBhYm91dCB1bnNwZWNpZmllZCBwcm9wZXJ0aWVzP1xuICAtLSBTeW50YXg6IEpTT04gdXNlcyBjb2xvbnMgdG8gc2VwYXJhdGUgcHJvcGVydHkgbmFtZXMgYW5kIHZhbHVlcy4gV2lsbCBsb29rIGJhZCB3LyBiaW5kaW5ncywgZS5nLixcbiAgICAge2ZvbzogbnVtYmVyOm59IChld3d3dylcblxuICBDdXJyZW50IHN0cmF3bWFuOlxuICAtLSBSZXF1aXJlIHByb3BlcnR5IG5hbWVzIHRvIGJlIHN0cmluZyBsaXRlcmFscyAobm90IHBhdHRlcm5zKSwgb25seSBhbGxvdyBwYXR0ZXJuIG1hdGNoaW5nIG9uIHRoZWlyIHZhbHVlcy5cbiAgLS0gQWxsb3cgYW4gb3B0aW9uYWwgJy4uLicgYXMgdGhlIGxhc3QgcGF0dGVybiwgdGhhdCB3b3VsZCBtYXRjaCBhbnkgdW5zcGVjaWZpZWQgcHJvcGVydGllcy5cbiAgICAgICB7J2Zvbyc6IG51bWJlciwgJ2Jhcic6IHN0cmluZywgJ2Jheic6IDUsIC4uLn1cbiAgICAgTWlnaHQgZXZlbiBhbGxvdyB0aGUgLi4uIHRvIGJlIGJvdW5kIHRvIGEgdmFyaWFibGUgdGhhdCB3b3VsZCBjb250YWluIGFsbCBvZiB0aG9zZSBwcm9wZXJ0aWVzLlxuICAtLSBDb25zaWRlciBjaGFuZ2luZyBiaW5kaW5nIHN5bnRheCBmcm9tIGV4cHI6bmFtZSB0byBleHByLm5hbWVcbiAgICAgKE1vcmUgSlNPTi1mcmllbmRseSwgYnV0IGl0IGRvZXNuJ3Qgd29yayB3ZWxsIHdpdGggLi4uIHN5bnRheC4gQnV0IG1heWJlIGl0J3Mgbm90IHNvIGltcG9ydGFudCB0byBiZSBhYmxlIHRvIGJpbmRcbiAgICAgdGhlIHJlc3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBhbnl3YXksIHNpbmNlIHlvdSBjYW4gYWx3YXlzIGJpbmQgdGhlIGVudGlyZSBvYmplY3QuKVxuXG5cbk9wdGltaXphdGlvbiBpZGVhczpcblxuKiBPcHRpbWl6ZSAnYmluZHMnIC0tIHNob3VsZCBwcmUtYWxsb2NhdGUgYW4gYXJyYXkgb2YgYmluZGluZ3MgaW5zdGVhZCBvZiBkb2luZyBwdXNoZXMsIHRocm93aW5nIGF3YXkgYXJyYXlzIG9uIGZhaWxcbiAgKHNlZSBBbHQpLCBldGMuXG5cbiogQ29uc2lkZXIgYWRkaW5nIGFuIGFkZGl0aW9uYWwgY29kZSBnZW5lcmF0aW9uIHN0ZXAgdGhhdCBnZW5lcmF0ZXMgZWZmaWNpZW50IGNvZGUgZnJvbSB0aGUgQVNUcywgaW5zdGVhZCBvZlxuICBpbnRlcnByZXRpbmcgdGhlbSBkaXJlY3RseS5cblxuKiBEb24ndCBib3RoZXIgY3JlYXRpbmcgdGh1bmtzIC8gbGlzdHMgb2YgdGh1bmtzIHdoZW4gdmFsdWUgaXMgbm90IG5lZWRlZCAoT01ldGEgZGlkIHRoaXMpXG4gIC0tIEUuZy4sIGluIFwiZm9vID0gc3BhY2UqIGJhclwiIHRoZSByZXN1bHQgb2Ygc3BhY2UqIGlzIG5vdCBuZWVkZWQsIHNvIGRvbid0IGJvdGhlciBjcmVhdGluZyBhIGxpc3Qgb2YgdGh1bmtzIC8gdmFsdWVzXG4gIC0tIENvdWxkIGp1c3QgcmV0dXJuIHVuZGVmaW5lZCAoYW55dGhpbmcgZXhjZXB0IGZhaWwpXG5cbiogR2V0IHJpZCBvZiB1bm5lY2Vzc2FyeSBTZXFzIGFuZCBBbHRzIChPTWV0YSBkaWQgdGhpcyB0b28pXG5cbiovXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBEZXBlbmRlbmNpZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4uL2Rpc3Qvb2htLWdyYW1tYXIuanMnKVxuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpXG52YXIgb2JqZWN0VXRpbHMgPSBhd2xpYi5vYmplY3RVdGlsc1xudmFyIHN0cmluZ1V0aWxzID0gYXdsaWIuc3RyaW5nVXRpbHNcbnZhciBicm93c2VyID0gYXdsaWIuYnJvd3NlclxudmFyIGVxdWFscyA9IGF3bGliLmVxdWFsc1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVycywgZXRjLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbnZhciBmYWlsID0ge31cblxuZnVuY3Rpb24gZ2V0RHVwbGljYXRlcyhhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgeCA9IGFycmF5W2lkeF1cbiAgICBpZiAoYXJyYXkubGFzdEluZGV4T2YoeCkgIT09IGlkeCAmJiBkdXBsaWNhdGVzLmluZGV4T2YoeCkgPCAwKVxuICAgICAgZHVwbGljYXRlcy5wdXNoKHgpXG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXNcbn1cblxuZnVuY3Rpb24gYWJzdHJhY3QoKSB7XG4gIHRocm93ICd0aGlzIG1ldGhvZCBpcyBhYnN0cmFjdCEnXG59XG5cbmZ1bmN0aW9uIGlzU3ludGFjdGljKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXVxuICByZXR1cm4gJ0EnIDw9IGZpcnN0Q2hhciAmJiBmaXJzdENoYXIgPD0gJ1onXG59XG5cbnZhciBfYXBwbHlTcGFjZXNcbmZ1bmN0aW9uIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKSB7XG4gIChfYXBwbHlTcGFjZXMgfHwgKF9hcHBseVNwYWNlcyA9IG5ldyBBcHBseSgnc3BhY2VzJykpKS5ldmFsKGZhbHNlLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZClcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIElucHV0IHN0cmVhbXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIElucHV0U3RyZWFtKCkge1xuICB0aHJvdyAnSW5wdXRTdHJlYW0gY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdFxcJ3MgYWJzdHJhY3QnXG59XG5cbklucHV0U3RyZWFtLm5ld0ZvciA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpXG4gICAgcmV0dXJuIG5ldyBTdHJpbmdJbnB1dFN0cmVhbShvYmopXG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxuICAgIHJldHVybiBuZXcgTGlzdElucHV0U3RyZWFtKG9iailcbiAgZWxzZVxuICAgIHRocm93ICdjYW5ub3QgbWFrZSBpbnB1dCBzdHJlYW0gZm9yICcgKyBvYmpcbn1cblxuSW5wdXRTdHJlYW0ucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICAgIHRoaXMucG9zID0gMFxuICAgIHRoaXMucG9zSW5mb3MgPSBbXVxuICB9LFxuXG4gIGdldEN1cnJlbnRQb3NJbmZvOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyclBvcyA9IHRoaXMucG9zXG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLnBvc0luZm9zW2N1cnJQb3NdXG4gICAgcmV0dXJuIHBvc0luZm8gfHwgKHRoaXMucG9zSW5mb3NbY3VyclBvc10gPSBuZXcgUG9zSW5mbyhjdXJyUG9zKSlcbiAgfSxcblxuICBhdEVuZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zID09PSB0aGlzLnNvdXJjZS5sZW5ndGhcbiAgfSxcblxuICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hdEVuZCgpID8gZmFpbCA6IHRoaXMuc291cmNlW3RoaXMucG9zKytdXG4gIH0sXG5cbiAgbWF0Y2hFeGFjdGx5OiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMubmV4dCgpID09PSB4ID8gdHJ1ZSA6IGZhaWxcbiAgfSxcblxuICBpbnRlcnZhbDogZnVuY3Rpb24oc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydElkeCwgZW5kSWR4KVxuICB9XG59XG5cbmZ1bmN0aW9uIFN0cmluZ0lucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKVxufVxuXG5TdHJpbmdJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiBmdW5jdGlvbihzKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgaWYgKHRoaXMubWF0Y2hFeGFjdGx5KHNbaWR4XSkgPT09IGZhaWwpXG4gICAgICAgIHJldHVybiBmYWlsXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBtYXRjaFJlZ0V4cDogZnVuY3Rpb24oZSkge1xuICAgIC8vIElNUE9SVEFOVDogZSBtdXN0IGJlIGEgbm9uLWdsb2JhbCwgb25lLWNoYXJhY3RlciBleHByZXNzaW9uLCBlLmcuLCAvLi8gYW5kIC9bMC05XS9cbiAgICB2YXIgYyA9IHRoaXMubmV4dCgpXG4gICAgcmV0dXJuIGMgIT09IGZhaWwgJiYgZS50ZXN0KGMpID8gdHJ1ZSA6IGZhaWxcbiAgfVxufSlcblxuZnVuY3Rpb24gTGlzdElucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKVxufVxuXG5MaXN0SW5wdXRTdHJlYW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocykge1xuICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShzKVxuICB9LFxuICAgIFxuICBtYXRjaFJlZ0V4cDogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShlKVxuICB9XG59KVxuXG5mdW5jdGlvbiBQb3NJbmZvKHBvcykge1xuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLnJ1bGVTdGFjayA9IFtdXG4gIHRoaXMuYWN0aXZlUnVsZXMgPSB7fSAgLy8gcmVkdW5kYW50IGRhdGEgKGNvdWxkIGJlIGdlbmVyYXRlZCBmcm9tIHJ1bGVTdGFjayksIGV4aXN0cyBmb3IgcGVyZm9ybWFuY2UgcmVhc29uc1xuICB0aGlzLm1lbW8gPSB7fVxufVxuXG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdXG4gIH0sXG5cbiAgZW50ZXI6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5ydWxlU3RhY2sucHVzaChydWxlTmFtZSlcbiAgICB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXSA9IHRydWVcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnBvcCgpXG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSBmYWxzZVxuICB9LFxuXG4gIHNob3VsZFVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbihtZW1vUmVjKSB7XG4gICAgdmFyIGludm9sdmVkUnVsZXMgPSBtZW1vUmVjLmludm9sdmVkUnVsZXNcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiBpbnZvbHZlZFJ1bGVzKVxuICAgICAgaWYgKGludm9sdmVkUnVsZXNbcnVsZU5hbWVdICYmIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sgPyB0aGlzLmxlZnRSZWN1cnNpb25TdGFja1t0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZFxuICB9LFxuXG4gIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAoIXRoaXMubGVmdFJlY3Vyc2lvblN0YWNrKVxuICAgICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sgPSBbXVxuICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrLnB1c2goe25hbWU6IHJ1bGVOYW1lLCB2YWx1ZTogZmFpbCwgcG9zOiAtMSwgaW52b2x2ZWRSdWxlczoge319KVxuICAgIHRoaXMudXBkYXRlSW52b2x2ZWRSdWxlcygpXG4gIH0sXG5cbiAgZW5kTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wb3AoKVxuICB9LFxuXG4gIHVwZGF0ZUludm9sdmVkUnVsZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHRoaXMuZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKVxuICAgIHZhciBpbnZvbHZlZFJ1bGVzID0gY3VycmVudExlZnRSZWN1cnNpb24uaW52b2x2ZWRSdWxlc1xuICAgIHZhciBsclJ1bGVOYW1lID0gY3VycmVudExlZnRSZWN1cnNpb24ubmFtZVxuICAgIHZhciBpZHggPSB0aGlzLnJ1bGVTdGFjay5sZW5ndGggLSAxXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZVN0YWNrW2lkeC0tXVxuICAgICAgaWYgKHJ1bGVOYW1lID09PSBsclJ1bGVOYW1lKVxuICAgICAgICBicmVha1xuICAgICAgaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbnRlcnZhbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEludGVydmFsKHNvdXJjZSwgc3RhcnRJZHgsIGVuZElkeCkge1xuICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHhcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHhcbn1cblxuSW50ZXJ2YWwucHJvdG90eXBlID0ge1xuICBjb250ZW50czogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIElucHV0U3RyZWFtLm5ld0Zvcih0aGlzLnNvdXJjZSkuaW50ZXJ2YWwodGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpXG4gIH0sXG5cbiAgb25seUVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN0YXJ0SWR4ICsgMSAhPT0gdGhpcy5lbmRJZHgpXG4gICAgICBicm93c2VyLmVycm9yKCdpbnRlcnZhbCcsIHRoaXMsICd3YXMgZXhwZWN0ZWQgdG8gY29udGFpbiBvbmx5IG9uZSBlbGVtZW50JylcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VbdGhpcy5zdGFydElkeF1cbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGh1bmtzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgbmV4dFRodW5rSWQgPSAwXG5cbmZ1bmN0aW9uIFJ1bGVUaHVuayhydWxlTmFtZSwgc291cmNlLCBzdGFydElkeCwgZW5kSWR4LCB2YWx1ZSwgYmluZGluZ3MpIHtcbiAgdGhpcy5pZCA9IG5leHRUaHVua0lkKytcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lXG4gIHRoaXMuc291cmNlID0gc291cmNlXG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeFxuICB0aGlzLmVuZElkeCA9IGVuZElkeFxuICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzXG59XG5cblJ1bGVUaHVuay5wcm90b3R5cGUgPSB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgaWYgKG1lbW8uaGFzT3duUHJvcGVydHkodGhpcy5pZCkpXG4gICAgICByZXR1cm4gbWVtb1t0aGlzLmlkXVxuICAgIHZhciBhY3Rpb24gPSB0aGlzLmxvb2t1cEFjdGlvbihhY3Rpb25EaWN0KVxuICAgIHZhciBhZGRsSW5mbyA9IHRoaXMuY3JlYXRlQWRkbEluZm8oKVxuICAgIGlmICh0aGlzLmJpbmRpbmdzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBtZW1vW3RoaXMuaWRdID0gYWN0aW9uLmNhbGwoYWRkbEluZm8sIHRoaXMudmFsdWUuZm9yY2UoYWN0aW9uRGljdCwgbWVtbykpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgYXJnRGljdCA9IHt9XG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmJpbmRpbmdzLmxlbmd0aDsgaWR4ICs9IDIpXG4gICAgICAgIGFyZ0RpY3RbdGhpcy5iaW5kaW5nc1tpZHhdXSA9IHRoaXMuYmluZGluZ3NbaWR4ICsgMV1cbiAgICAgIHZhciBmb3JtYWxzID0gb2JqZWN0VXRpbHMuZm9ybWFscyhhY3Rpb24pXG4gICAgICB2YXIgYXJncyA9IGZvcm1hbHMubGVuZ3RoID09PSAwID9cbiAgICAgICAgb2JqZWN0VXRpbHMudmFsdWVzKGFyZ0RpY3QpLm1hcChmdW5jdGlvbihhcmcpIHsgcmV0dXJuIGFyZy5mb3JjZShhY3Rpb25EaWN0LCBtZW1vKSB9KSA6XG4gICAgICAgIGZvcm1hbHMubWFwKGZ1bmN0aW9uKG5hbWUpIHsgcmV0dXJuIGFyZ0RpY3RbbmFtZV0uZm9yY2UoYWN0aW9uRGljdCwgbWVtbykgfSlcbiAgICAgIHJldHVybiBtZW1vW3RoaXMuaWRdID0gYWN0aW9uLmFwcGx5KGFkZGxJbmZvLCBhcmdzKVxuICAgIH1cbiAgfSxcblxuICBsb29rdXBBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVOYW1lXG4gICAgdmFyIGFjdGlvbiA9IGFjdGlvbkRpY3RbcnVsZU5hbWVdXG4gICAgaWYgKGFjdGlvbiA9PT0gdW5kZWZpbmVkICYmIGFjdGlvbkRpY3QuX2RlZmF1bHQgIT09IHVuZGVmaW5lZClcbiAgICAgIGFjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYWN0aW9uRGljdC5fZGVmYXVsdC5hcHBseSh0aGlzLCBbcnVsZU5hbWVdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSlcbiAgICAgIH1cbiAgICByZXR1cm4gYWN0aW9uIHx8IGJyb3dzZXIuZXJyb3IoJ21pc3Npbmcgc2VtYW50aWMgYWN0aW9uIGZvcicsIHJ1bGVOYW1lKVxuICB9LFxuXG4gIGNyZWF0ZUFkZGxJbmZvOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW50ZXJ2YWw6IG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZSwgdGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIExpc3RUaHVuayh0aHVua3MpIHtcbiAgdGhpcy5pZCA9IG5leHRUaHVua0lkKytcbiAgdGhpcy50aHVua3MgPSB0aHVua3Ncbn1cblxuTGlzdFRodW5rLnByb3RvdHlwZSA9IHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBpZiAobWVtby5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSlcbiAgICAgIHJldHVybiBtZW1vW3RoaXMuaWRdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG1lbW9bdGhpcy5pZF0gPSB0aGlzLnRodW5rcy5tYXAoZnVuY3Rpb24odGh1bmspIHsgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QsIG1lbW8pIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gVmFsdWVUaHVuayh2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWVcbn1cblxuVmFsdWVUaHVuay5wcm90b3R5cGUgPSB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgfVxufVxuXG52YXIgdmFsdWVsZXNzVGh1bmsgPSBuZXcgVmFsdWVUaHVuayh1bmRlZmluZWQpXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUeXBlcyBvZiBwYXR0ZXJuc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2VuZXJhbCBzdHVmZlxuXG5mdW5jdGlvbiBQYXR0ZXJuKCkge1xuICB0aHJvdyAnUGF0dGVybiBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxuUGF0dGVybi5wcm90b3R5cGUgPSB7XG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFtdXG4gIH0sXG5cbiAgcHJvZHVjZXNWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBhYnN0cmFjdCxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGFic3RyYWN0LFxuXG4gIG91dHB1dFJlY2lwZTogYWJzdHJhY3Rcbn1cblxuLy8gQW55dGhpbmdcblxudmFyIGFueXRoaW5nID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgdmFsdWUgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgVmFsdWVUaHVuayh2YWx1ZSlcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIC8vIG5vLW9wXG4gIH1cbn0pXG5cbi8vIFByaW1pdGl2ZXNcblxuZnVuY3Rpb24gUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuUHJpbS5uZXdGb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnICYmIG9iai5sZW5ndGggIT09IDEpXG4gICAgcmV0dXJuIG5ldyBTdHJpbmdQcmltKG9iailcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgIHJldHVybiBuZXcgUmVnRXhwUHJpbShvYmopXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFByaW0ob2JqKVxufVxuICAgIFxuUHJpbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIGlmICh0aGlzLm1hdGNoKGlucHV0U3RyZWFtKSA9PT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBWYWx1ZVRodW5rKHRoaXMub2JqKVxuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICAgIHJldHVybiBpbnB1dFN0cmVhbS5tYXRjaEV4YWN0bHkodGhpcy5vYmopXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLl8oJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMub2JqKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuZnVuY3Rpb24gU3RyaW5nUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuU3RyaW5nUHJpbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2g6IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gICAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKHRoaXMub2JqKVxuICB9XG59KVxuXG5mdW5jdGlvbiBSZWdFeHBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9ialxufVxuXG5SZWdFeHBQcmltLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQcmltLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICBpZiAoaW5wdXRTdHJlYW0ubWF0Y2hSZWdFeHAodGhpcy5vYmopID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFZhbHVlVGh1bmsoaW5wdXRTdHJlYW0uc291cmNlW29yaWdQb3NdKVxuICB9XG59KVxuXG4vLyBBbHRlcm5hdGlvblxuXG5mdW5jdGlvbiBBbHQodGVybXMpIHtcbiAgdGhpcy50ZXJtcyA9IHRlcm1zXG59XG5cbkFsdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgb3JpZ051bUJpbmRpbmdzID0gYmluZGluZ3MubGVuZ3RoXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoc3ludGFjdGljKVxuICAgICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMudGVybXNbaWR4XS5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIGlmICh2YWx1ZSAhPT0gZmFpbClcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICBlbHNlIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgICAvLyBOb3RlOiB3aGlsZSB0aGUgZm9sbG93aW5nIGFzc2lnbm1lbnQgY291bGQgYmUgZG9uZSB1bmNvbmRpdGlvbmFsbHksIG9ubHkgZG9pbmcgaXQgd2hlbiBuZWNlc3NhcnkgaXNcbiAgICAgICAgLy8gYmV0dGVyIGZvciBwZXJmb3JtYW5jZS4gVGhpcyBpcyBiL2MgYXNzaWduaW5nIHRvIGFuIGFycmF5J3MgbGVuZ3RoIHByb3BlcnR5IGlzIG1vcmUgZXhwZW5zaXZlIHRoYW4gYVxuICAgICAgICAvLyB0eXBpY2FsIGFzc2lnbm1lbnQuXG4gICAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPiBvcmlnTnVtQmluZGluZ3MpXG4gICAgICAgICAgYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIG9rIGIvYyBhbGwgdGVybXMgbXVzdCBoYXZlIHRoZSBzYW1lIGJpbmRpbmdzIC0tIHRoaXMgcHJvcGVydHkgaXMgY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyBbXSA6IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBwcm9kdWNlc1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspXG4gICAgICBpZiAoIXRoaXMudGVybXNbaWR4XS5wcm9kdWNlc1ZhbHVlKCkpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm5cbiAgICB2YXIgbmFtZXMgPSB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XVxuICAgICAgdGVybS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncygpXG4gICAgICB2YXIgb3RoZXJOYW1lcyA9IHRlcm0uZ2V0QmluZGluZ05hbWVzKClcbiAgICAgIGlmICghZXF1YWxzLmVxdWFscyhuYW1lcywgb3RoZXJOYW1lcykpXG4gICAgICAgIGJyb3dzZXIuZXJyb3IoJ3J1bGUnLCBydWxlTmFtZSwgJ2hhcyBhbiBhbHQgd2l0aCBpbmNvbnNpc3RlbnQgYmluZGluZ3M6JywgbmFtZXMsICd2cycsIG90aGVyTmFtZXMpXG4gICAgfVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmFsdCgnKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHRoaXMudGVybXNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBTZXF1ZW5jZXNcblxuZnVuY3Rpb24gU2VxKGZhY3RvcnMpIHtcbiAgdGhpcy5mYWN0b3JzID0gZmFjdG9yc1xufVxuXG5TZXEucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoc3ludGFjdGljKVxuICAgICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XVxuICAgICAgdmFyIHZhbHVlID0gZmFjdG9yLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgaWYgKHZhbHVlID09PSBmYWlsKVxuICAgICAgICByZXR1cm4gZmFpbFxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVsZXNzVGh1bmtcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuYW1lcyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdCh0aGlzLmZhY3RvcnNbaWR4XS5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICByZXR1cm4gbmFtZXMuc29ydCgpXG4gIH0sXG5cbiAgcHJvZHVjZXNWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG5cbiAgICB2YXIgZHVwbGljYXRlcyA9IGdldER1cGxpY2F0ZXModGhpcy5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKVxuICAgICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGR1cGxpY2F0ZSBiaW5kaW5nczonLCBkdXBsaWNhdGVzKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iuc2VxKCcpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICB0aGlzLmZhY3RvcnNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBCaW5kaW5nc1xuXG5mdW5jdGlvbiBCaW5kKGV4cHIsIG5hbWUpIHtcbiAgdGhpcy5leHByID0gZXhwclxuICB0aGlzLm5hbWUgPSBuYW1lXG59XG5cbkJpbmQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICBpZiAodmFsdWUgIT09IGZhaWwpXG4gICAgICBiaW5kaW5ncy5wdXNoKHRoaXMubmFtZSwgdmFsdWUpXG4gICAgcmV0dXJuIHZhbHVlXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMubmFtZV1cbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuYmluZCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5uYW1lKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gTWFueShleHByLCBtaW5OdW1NYXRjaGVzKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbiAgdGhpcy5taW5OdW1NYXRjaGVzID0gbWluTnVtTWF0Y2hlc1xufVxuXG5NYW55LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBiYWNrdHJhY2tQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFpbCkge1xuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBiYWNrdHJhY2tQb3NcbiAgICAgICAgYnJlYWtcbiAgICAgIH0gZWxzZVxuICAgICAgICBtYXRjaGVzLnB1c2godmFsdWUpXG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVzLmxlbmd0aCA8IHRoaXMubWluTnVtTWF0Y2hlcyA/ICBmYWlsIDogbmV3IExpc3RUaHVuayhtYXRjaGVzKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5tYW55KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgd3MubmV4dFB1dEFsbCh0aGlzLm1pbk51bU1hdGNoZXMpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuT3B0LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgIHJldHVybiB2YWx1ZWxlc3NUaHVua1xuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIG5ldyBMaXN0VGh1bmsoW3ZhbHVlXSlcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iub3B0KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbk5vdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgaWYgKHZhbHVlICE9PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgIHJldHVybiB2YWx1ZWxlc3NUaHVua1xuICAgIH1cbiAgfSxcblxuICBwcm9kdWNlc1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iubm90KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuZnVuY3Rpb24gTG9va2FoZWFkKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5Mb29rYWhlYWQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgIGlmICh2YWx1ZSAhPT0gZmFpbCkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5sYSgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFN0cmluZyBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIFN0cihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuU3RyLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIHN0cmluZyA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmICh0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHN0cmluZ0lucHV0U3RyZWFtID0gbmV3IFN0cmluZ0lucHV0U3RyZWFtKHN0cmluZylcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIHN0cmluZ0lucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIHJldHVybiB2YWx1ZSAhPT0gZmFpbCAmJiBzdHJpbmdJbnB1dFN0cmVhbS5hdEVuZCgpID8gIG5ldyBWYWx1ZVRodW5rKHN0cmluZykgOiBmYWlsXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5zdHIoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBMaXN0IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gTGlzdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTGlzdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBsaXN0ID0gaW5wdXRTdHJlYW0ubmV4dCgpXG4gICAgaWYgKGxpc3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdmFyIGxpc3RJbnB1dFN0cmVhbSA9IG5ldyBMaXN0SW5wdXRTdHJlYW0obGlzdClcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGxpc3RJbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgICByZXR1cm4gdmFsdWUgIT09IGZhaWwgJiYgbGlzdElucHV0U3RyZWFtLmF0RW5kKCkgPyAgbmV3IFZhbHVlVGh1bmsobGlzdCkgOiBmYWlsXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5sc3QoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBPYmplY3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBPYmoocHJvcGVydGllcywgaXNMZW5pZW50KSB7XG4gIHZhciBuYW1lcyA9IHByb3BlcnRpZXMubWFwKGZ1bmN0aW9uKHByb3BlcnR5KSB7IHJldHVybiBwcm9wZXJ0eS5uYW1lIH0pXG4gIHZhciBkdXBsaWNhdGVzID0gZ2V0RHVwbGljYXRlcyhuYW1lcylcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICBicm93c2VyLmVycm9yKCdvYmplY3QgcGF0dGVybiBoYXMgZHVwbGljYXRlIHByb3BlcnR5IG5hbWVzOicsIGR1cGxpY2F0ZXMpXG4gIGVsc2Uge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICB0aGlzLmlzTGVuaWVudCA9IGlzTGVuaWVudFxuICB9XG59XG5cbk9iai5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBvYmogPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAob2JqICE9PSBmYWlsICYmIG9iaiAmJiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgIHZhciBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9IDBcbiAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1tpZHhdXG4gICAgICAgIHZhciB2YWx1ZSA9IG9ialtwcm9wZXJ0eS5uYW1lXVxuICAgICAgICB2YXIgdmFsdWVJbnB1dFN0cmVhbSA9IG5ldyBMaXN0SW5wdXRTdHJlYW0oW3ZhbHVlXSlcbiAgICAgICAgdmFyIG1hdGNoZWQgPVxuICAgICAgICAgIHByb3BlcnR5LnBhdHRlcm4uZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCB2YWx1ZUlucHV0U3RyZWFtLCBiaW5kaW5ncykgIT09IGZhaWwgJiYgdmFsdWVJbnB1dFN0cmVhbS5hdEVuZCgpXG4gICAgICAgIGlmICghbWF0Y2hlZClcbiAgICAgICAgICByZXR1cm4gZmFpbFxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3BlcnR5Lm5hbWUpKVxuICAgICAgICAgIG51bU93blByb3BlcnRpZXNNYXRjaGVkKytcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzTGVuaWVudCB8fCBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9PT0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggP1xuICAgICAgICBuZXcgVmFsdWVUaHVuayhvYmopIDpcbiAgICAgICAgZmFpbFxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuYW1lcyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdCh0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIHJldHVybiBuYW1lcy5zb3J0KClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuXG4gICAgdmFyIGR1cGxpY2F0ZXMgPSBnZXREdXBsaWNhdGVzKHRoaXMuZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3J1bGUnLCBydWxlTmFtZSwgJ2hhcyBhbiBvYmplY3QgcGF0dGVybiB3aXRoIGR1cGxpY2F0ZSBiaW5kaW5nczonLCBkdXBsaWNhdGVzKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgZnVuY3Rpb24gb3V0cHV0UHJvcGVydHlSZWNpcGUocHJvcCkge1xuICAgICAgd3MubmV4dFB1dEFsbCgne25hbWU6ICcpXG4gICAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHByb3AubmFtZSkpXG4gICAgICB3cy5uZXh0UHV0QWxsKCcsIHBhdHRlcm46ICcpXG4gICAgICBwcm9wLnBhdHRlcm4ub3V0cHV0UmVjaXBlKHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnfScpXG4gICAgfVxuXG4gICAgd3MubmV4dFB1dEFsbCgnYi5vYmooWycpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBvdXRwdXRQcm9wZXJ0eVJlY2lwZSh0aGlzLnByb3BlcnRpZXNbaWR4XSlcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnXSwgJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKCEhdGhpcy5pc0xlbmllbnQpKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxufVxuXG5BcHBseS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlTmFtZVxuICAgIHZhciBvcmlnUG9zSW5mbyA9IGlucHV0U3RyZWFtLmdldEN1cnJlbnRQb3NJbmZvKClcbiAgICB2YXIgbWVtb1JlYyA9IG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdXG4gICAgaWYgKG1lbW9SZWMgJiYgb3JpZ1Bvc0luZm8uc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG1lbW9SZWMucG9zXG4gICAgICByZXR1cm4gbWVtb1JlYy52YWx1ZVxuICAgIH0gZWxzZSBpZiAob3JpZ1Bvc0luZm8uaXNBY3RpdmUocnVsZU5hbWUpKSB7XG4gICAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpXG4gICAgICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24gJiYgY3VycmVudExlZnRSZWN1cnNpb24ubmFtZSA9PT0gcnVsZU5hbWUpIHtcbiAgICAgICAgb3JpZ1Bvc0luZm8udXBkYXRlSW52b2x2ZWRSdWxlcygpXG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvc1xuICAgICAgICByZXR1cm4gY3VycmVudExlZnRSZWN1cnNpb24udmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9yaWdQb3NJbmZvLnN0YXJ0TGVmdFJlY3Vyc2lvbihydWxlTmFtZSlcbiAgICAgICAgcmV0dXJuIGZhaWxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSBydWxlRGljdFtydWxlTmFtZV0gfHwgYnJvd3Nlci5lcnJvcigndW5kZWZpbmVkIHJ1bGUnLCBydWxlTmFtZSlcbiAgICAgIG9yaWdQb3NJbmZvLmVudGVyKHJ1bGVOYW1lKVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpXG4gICAgICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24pIHtcbiAgICAgICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmhhbmRsZUxlZnRSZWN1cnNpb24oYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zSW5mby5wb3MsIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLCB2YWx1ZSlcbiAgICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9XG4gICAgICAgICAgICB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZSwgaW52b2x2ZWRSdWxlczogY3VycmVudExlZnRSZWN1cnNpb24uaW52b2x2ZWRSdWxlc31cbiAgICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKVxuICAgICAgICB9IGVsc2UgaWYgKCFjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSlcbiAgICAgICAgICAvLyBPbmx5IG1lbW9pemUgaWYgdGhpcyBydWxlIGlzIG5vdCBpbnZvbHZlZCBpbiB0aGUgY3VycmVudCBsZWZ0IHJlY3Vyc2lvblxuICAgICAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID0ge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9IGVsc2VcbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIG9yaWdQb3NJbmZvLmV4aXQocnVsZU5hbWUpXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgZXZhbE9uY2U6IGZ1bmN0aW9uKGV4cHIsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIGJpbmRpbmdzID0gW11cbiAgICB2YXIgdmFsdWUgPSBleHByLmV2YWwoaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgaWYgKHZhbHVlID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFJ1bGVUaHVuayh0aGlzLnJ1bGVOYW1lLCBpbnB1dFN0cmVhbS5zb3VyY2UsIG9yaWdQb3MsIGlucHV0U3RyZWFtLnBvcywgdmFsdWUsIGJpbmRpbmdzKVxuICB9LFxuXG4gIGhhbmRsZUxlZnRSZWN1cnNpb246IGZ1bmN0aW9uKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgb3JpZ1BvcywgY3VycmVudExlZnRSZWN1cnNpb24sIHNlZWRWYWx1ZSkge1xuICAgIHZhciB2YWx1ZSA9IHNlZWRWYWx1ZVxuICAgIGlmIChzZWVkVmFsdWUgIT09IGZhaWwpIHtcbiAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnZhbHVlID0gc2VlZFZhbHVlXG4gICAgICBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgICAgaWYgKHZhbHVlICE9PSBmYWlsICYmIGlucHV0U3RyZWFtLnBvcyA+IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcykge1xuICAgICAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnZhbHVlID0gdmFsdWVcbiAgICAgICAgICBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnZhbHVlXG4gICAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gY3VycmVudExlZnRSZWN1cnNpb24ucG9zXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuYXBwKCcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnJ1bGVOYW1lKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gUnVsZSBleHBhbnNpb24gLS0gYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIF9FeHBhbmQocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgaWYgKGdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpXG4gICAgYnJvd3Nlci5lcnJvcignZ3JhbW1hcicsIGdyYW1tYXIubmFtZSwgJ2RvZXMgbm90IGhhdmUgYSBydWxlIGNhbGxlZCcsIHJ1bGVOYW1lKVxuICBlbHNlIHtcbiAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWVcbiAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyXG4gIH1cbn1cblxuX0V4cGFuZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uKCkuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gIH0sXG5cbiAgZXhwYW5zaW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFtbWFyLnJ1bGVEaWN0W3RoaXMucnVsZU5hbWVdXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbnNpb24oKS5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIHByb2R1Y2VzVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLnByb2R1Y2VzVmFsdWUoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHBhbnNpb24oKS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwYW5zaW9uKCkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIC8vIG5vLW9wXG4gIH1cbn0pXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHcmFtbWFyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBHcmFtbWFyKHJ1bGVEaWN0KSB7XG4gIHRoaXMucnVsZURpY3QgPSBydWxlRGljdFxufVxuXG5HcmFtbWFyLnByb3RvdHlwZSA9IHtcbiAgcnVsZURpY3Q6IG5ldyBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl8gPSBhbnl0aGluZ1xuICAgIHRoaXMuZW5kID0gbmV3IE5vdCh0aGlzLl8pXG4gICAgdGhpcy5zcGFjZSA9IFByaW0ubmV3Rm9yKC9bXFxzXS8pXG4gICAgdGhpcy5zcGFjZXMgPSBuZXcgTWFueShuZXcgQXBwbHkoJ3NwYWNlJyksIDApXG4gICAgdGhpcy5hbG51bSA9IFByaW0ubmV3Rm9yKC9bMC05YS16QS1aXS8pXG4gICAgdGhpcy5sZXR0ZXIgPSBQcmltLm5ld0ZvcigvW2EtekEtWl0vKVxuICAgIHRoaXMubG93ZXIgPSBQcmltLm5ld0ZvcigvW2Etel0vKVxuICAgIHRoaXMudXBwZXIgPSBQcmltLm5ld0ZvcigvW0EtWl0vKVxuICAgIHRoaXMuZGlnaXQgPSBQcmltLm5ld0ZvcigvWzAtOV0vKVxuICAgIHRoaXMuaGV4RGlnaXQgPSBQcmltLm5ld0ZvcigvWzAtOWEtZkEtRl0vKVxuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihvYmosIHN0YXJ0UnVsZSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoQ29udGVudHMoW29ial0sIHN0YXJ0UnVsZSlcbiAgfSxcblxuICBtYXRjaENvbnRlbnRzOiBmdW5jdGlvbihvYmosIHN0YXJ0UnVsZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihvYmopXG4gICAgdmFyIHRodW5rID0gbmV3IEFwcGx5KHN0YXJ0UnVsZSkuZXZhbCh1bmRlZmluZWQsIHRoaXMucnVsZURpY3QsIGlucHV0U3RyZWFtLCB1bmRlZmluZWQpXG4gICAgaWYgKGlzU3ludGFjdGljKHN0YXJ0UnVsZSkpXG4gICAgICBza2lwU3BhY2VzKHRoaXMucnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2ggPSB0aGlzLmFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaC5iaW5kKHRoaXMpXG4gICAgcmV0dXJuIHRodW5rID09PSBmYWlsIHx8ICFpbnB1dFN0cmVhbS5hdEVuZCgpID9cbiAgICAgIGZhbHNlIDpcbiAgICAgIGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICAgICAgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoKGFjdGlvbkRpY3QpXG4gICAgICAgIHJldHVybiB0aHVuay5mb3JjZShhY3Rpb25EaWN0LCB7fSlcbiAgICAgIH1cbiAgfSxcblxuICBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2g6IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgcnVsZURpY3QgPSB0aGlzLnJ1bGVEaWN0XG4gICAgdmFyIG9rID0gdHJ1ZVxuICAgIG9iamVjdFV0aWxzLmtleXNEbyhydWxlRGljdCwgZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIGlmIChhY3Rpb25EaWN0W3J1bGVOYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm5cbiAgICAgIHZhciBhY3R1YWwgPSBvYmplY3RVdGlscy5mb3JtYWxzKGFjdGlvbkRpY3RbcnVsZU5hbWVdKS5zb3J0KClcbiAgICAgIHZhciBleHBlY3RlZCA9IHNlbGYuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSlcbiAgICAgIGlmICghZXF1YWxzLmVxdWFscyhhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgICAgICBvayA9IGZhbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW1hbnRpYyBhY3Rpb24gZm9yIHJ1bGUnLCBydWxlTmFtZSwgJ2hhcyB0aGUgd3JvbmcgYXJndW1lbnQgbmFtZXMnKVxuICAgICAgICBjb25zb2xlLmxvZygnICBleHBlY3RlZCcsIGV4cGVjdGVkKVxuICAgICAgICBjb25zb2xlLmxvZygnICAgIGFjdHVhbCcsIGFjdHVhbClcbiAgICAgIH1cbiAgICB9KVxuICAgIGlmICghb2spXG4gICAgICBicm93c2VyLmVycm9yKCdvbmUgb3IgbW9yZSBzZW1hbnRpYyBhY3Rpb25zIGhhdmUgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzIC0tIHNlZSBjb25zb2xlIGZvciBkZXRhaWxzJylcbiAgfSxcblxuICBzZW1hbnRpY0FjdGlvbkFyZ05hbWVzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hciAmJiB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0pXG4gICAgICByZXR1cm4gdGhpcy5zdXBlckdyYW1tYXIuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5ydWxlRGljdFtydWxlTmFtZV1cbiAgICAgIHZhciBuYW1lcyA9IGJvZHkuZ2V0QmluZGluZ05hbWVzKClcbiAgICAgIGlmIChuYW1lcy5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gbmFtZXNcbiAgICAgIGVsc2UgaWYgKGJvZHkucHJvZHVjZXNWYWx1ZSgpKVxuICAgICAgICByZXR1cm4gWyd2YWx1ZSddXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfSxcblxuICB0b1JlY2lwZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdzID0gbmV3IG9iamVjdFV0aWxzLlN0cmluZ0J1ZmZlcigpXG4gICAgd3MubmV4dFB1dEFsbCgnKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCcgIHZhciBiID0gb2htLmJ1aWxkZXIoKVxcbicpXG4gICAgd3MubmV4dFB1dEFsbCgnICBiLnNldE5hbWUoJyk7IHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5uYW1lKSk7IHdzLm5leHRQdXRBbGwoJylcXG4nKVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5uYW1lICYmIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWVzcGFjZU5hbWUpIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJyAgYi5zZXRTdXBlckdyYW1tYXIob2htLm5hbWVzcGFjZSgnKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykuZ2V0R3JhbW1hcignKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykpXFxuJylcbiAgICB9XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5ydWxlRGVjbHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgd3MubmV4dFB1dEFsbCgnICAnKVxuICAgICAgdGhpcy5ydWxlRGVjbHNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCdcXG4nKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcgIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcXG4nKVxuICAgIHdzLm5leHRQdXRBbGwoJ30pJylcbiAgICByZXR1cm4gd3MuY29udGVudHMoKVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBCdWlsZGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSdWxlRGVjbCgpIHtcbiAgdGhyb3cgJ1J1bGVEZWNsIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5SdWxlRGVjbC5wcm90b3R5cGUgPSB7XG4gIHBlcmZvcm1DaGVja3M6IGFic3RyYWN0LFxuXG4gIHBlcmZvcm1Db21tb25DaGVja3M6IGZ1bmN0aW9uKG5hbWUsIGJvZHkpIHtcbiAgICBib2R5LmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MobmFtZSlcbiAgICBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKG5hbWUpXG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5XG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuJylcbiAgICB3cy5uZXh0UHV0QWxsKHRoaXMua2luZClcbiAgICB3cy5uZXh0UHV0QWxsKCcoJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMubmFtZSkpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHRoaXMuYm9keS5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn1cblxuZnVuY3Rpb24gRGVmaW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuRGVmaW5lLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2RlZmluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZGVmaW5lIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IG92ZXJyaWRlIG9yIGV4dGVuZCBpbnN0ZWFkLiknKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gT3ZlcnJpZGUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ib2R5ID0gYm9keVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5PdmVycmlkZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdvdmVycmlkZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG92ZXJyaWRkZW4gPSB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdXG4gICAgaWYgKCFvdmVycmlkZGVuKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IG92ZXJyaWRlIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IGRlZmluZSBpbnN0ZWFkLiknKVxuICAgIGlmIChvdmVycmlkZGVuLmdldEJpbmRpbmdOYW1lcygpLmxlbmd0aCA9PT0gMCAmJiBvdmVycmlkZGVuLnByb2R1Y2VzVmFsdWUoKSAmJiAhdGhpcy5ib2R5LnByb2R1Y2VzVmFsdWUoKSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3RoZSBib2R5IG9mIHJ1bGUnLCB0aGlzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdtdXN0IHByb2R1Y2UgYSB2YWx1ZSwgYmVjYXVzZSB0aGUgcnVsZSBpdFxcJ3Mgb3ZlcnJpZGluZyBhbHNvIHByb2R1Y2VzIGEgdmFsdWUnKVxuICAgIC8vIFRPRE86IGFkZCB1bml0IHRlc3QgZm9yIHRoaXMhXG4gICAgLy8gKGlmIHJ1bGUgYmVpbmcgb3ZlcnJpZGRlbiBoYXMgbm8gYmluZGluZ3MgYnV0IGl0cyBib2R5IHByb2R1Y2VzIGEgdmFsdWUsIHRoaXMgbXVzdCBwcm9kdWNlIGEgdmFsdWUgdG9vLilcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIElubGluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbklubGluZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdpbmxpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIHJlbGF4aW5nIHRoaXMgY2hlY2ssIGUuZy4sIG1ha2UgaXQgb2sgdG8gb3ZlcnJpZGUgYW4gaW5saW5lIHJ1bGUgaWYgdGhlIG5lc3RpbmcgcnVsZSBpc1xuICAgIC8vIGFuIG92ZXJyaWRlLiBCdXQgb25seSBpZiB0aGUgaW5saW5lIHJ1bGUgdGhhdCdzIGJlaW5nIG92ZXJyaWRkZW4gaXMgbmVzdGVkIGluc2lkZSB0aGUgbmVzdGluZyBydWxlIHRoYXRcbiAgICAvLyB3ZSdyZSBvdmVycmlkaW5nPyBIb3BlZnVsbHkgdGhlcmUncyBhIG11Y2ggbGVzcyBjb21wbGljYXRlZCB3YXkgdG8gZG8gdGhpcyA6KVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGRlZmluZSBpbmxpbmUgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIEV4dGVuZChuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuZXhwYW5kZWRCb2R5ID0gbmV3IEFsdChbYm9keSwgbmV3IF9FeHBhbmQobmFtZSwgc3VwZXJHcmFtbWFyKV0pXG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbkV4dGVuZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdleHRlbmQnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBleHRlbmRlZCA9IHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV1cbiAgICBpZiAoIWV4dGVuZGVkKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGV4dGVuZCBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc3VwZXItZ3JhbW1hci4nLFxuICAgICAgICAgICAgICAgICAgICAnKHRyeSBkZWZpbmUgaW5zdGVhZC4pJylcbiAgICBpZiAoZXh0ZW5kZWQuZ2V0QmluZGluZ05hbWVzKCkubGVuZ3RoID09PSAwICYmIGV4dGVuZGVkLnByb2R1Y2VzVmFsdWUoKSAmJiAhdGhpcy5ib2R5LnByb2R1Y2VzVmFsdWUoKSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3RoZSBib2R5IG9mIHJ1bGUnLCB0aGlzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdtdXN0IHByb2R1Y2UgYSB2YWx1ZSwgYmVjYXVzZSB0aGUgcnVsZSBpdFxcJ3MgZXh0ZW5kaW5nIGFsc28gcHJvZHVjZXMgYSB2YWx1ZScpXG4gICAgLy8gVE9ETzogYWRkIHVuaXQgdGVzdCBmb3IgdGhpcyFcbiAgICAvLyAoaWYgdGhlIHJ1bGUgYmVpbmcgZXh0ZW5kZWQgaGFzIG5vIGJpbmRpbmdzIGJ1dCBpdHMgYm9keSBwcm9kdWNlcyBhIHZhbHVlLCB0aGlzIG11c3QgcHJvZHVjZSBhIHZhbHVlIHRvby4pXG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5leHBhbmRlZEJvZHkpXG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5leHBhbmRlZEJvZHlcbiAgfVxufSlcblxuZnVuY3Rpb24gQnVpbGRlcigpIHtcbiAgdGhpcy5pbml0KClcbn1cblxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubmFtZSA9IHVuZGVmaW5lZFxuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gR3JhbW1hci5wcm90b3R5cGVcbiAgICB0aGlzLnJ1bGVEZWNscyA9IFtdXG4gIH0sXG5cbiAgc2V0TmFtZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgfSxcblxuICBzZXRTdXBlckdyYW1tYXI6IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IGdyYW1tYXJcbiAgfSxcblxuICBkZWZpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgRGVmaW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gIH0sXG5cbiAgb3ZlcnJpZGU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgT3ZlcnJpZGUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBpbmxpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgSW5saW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gICAgcmV0dXJuIHRoaXMuYXBwKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGV4dGVuZDogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBFeHRlbmQocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBidWlsZDogZnVuY3Rpb24ob3B0TmFtZXNwYWNlKSB7XG4gICAgdmFyIHN1cGVyR3JhbW1hciA9IHRoaXMuc3VwZXJHcmFtbWFyXG4gICAgdmFyIHJ1bGVEaWN0ID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKHN1cGVyR3JhbW1hci5ydWxlRGljdClcbiAgICB0aGlzLnJ1bGVEZWNscy5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVEZWNsKSB7XG4gICAgICBydWxlRGVjbC5wZXJmb3JtQ2hlY2tzKClcbiAgICAgIHJ1bGVEZWNsLmluc3RhbGwocnVsZURpY3QpXG4gICAgfSlcblxuICAgIHZhciBncmFtbWFyID0gbmV3IEdyYW1tYXIocnVsZURpY3QpXG4gICAgZ3JhbW1hci5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbiAgICBncmFtbWFyLnJ1bGVEZWNscyA9IHRoaXMucnVsZURlY2xzXG4gICAgaWYgKHRoaXMubmFtZSkge1xuICAgICAgZ3JhbW1hci5uYW1lID0gdGhpcy5uYW1lXG4gICAgICBpZiAob3B0TmFtZXNwYWNlKSB7XG4gICAgICAgIGdyYW1tYXIubmFtZXNwYWNlTmFtZSA9IG9wdE5hbWVzcGFjZS5uYW1lXG4gICAgICAgIG9wdE5hbWVzcGFjZS5pbnN0YWxsKHRoaXMubmFtZSwgZ3JhbW1hcilcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pbml0KClcbiAgICByZXR1cm4gZ3JhbW1hclxuICB9LFxuXG4gIF86IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIFByaW0ubmV3Rm9yKHgpIH0sXG4gIGFsdDogZnVuY3Rpb24oLyogdGVybTEsIHRlcm0xLCAuLi4gKi8pIHtcbiAgICB2YXIgdGVybXMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF1cbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBBbHQpXG4gICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcylcbiAgICAgIGVsc2VcbiAgICAgICAgdGVybXMucHVzaChhcmcpXG4gICAgfVxuICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBBbHQodGVybXMpXG4gIH0sXG4gIHNlcTogZnVuY3Rpb24oLyogZmFjdG9yMSwgZmFjdG9yMiwgLi4uICovKSB7XG4gICAgdmFyIGZhY3RvcnMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF1cbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBTZXEpXG4gICAgICAgIGZhY3RvcnMgPSBmYWN0b3JzLmNvbmNhdChhcmcuZmFjdG9ycylcbiAgICAgIGVsc2VcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZylcbiAgICB9XG4gICAgcmV0dXJuIGZhY3RvcnMubGVuZ3RoID09PSAxID8gZmFjdG9yc1swXSA6IG5ldyBTZXEoZmFjdG9ycylcbiAgfSxcbiAgYmluZDogZnVuY3Rpb24oZXhwciwgbmFtZSkgeyByZXR1cm4gbmV3IEJpbmQoZXhwciwgbmFtZSkgfSxcbiAgbWFueTogZnVuY3Rpb24oZXhwciwgbWluTnVtTWF0Y2hlcykgeyByZXR1cm4gbmV3IE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykgfSxcbiAgb3B0OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgT3B0KGV4cHIpIH0sXG4gIG5vdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IE5vdChleHByKSB9LFxuICBsYTogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IExvb2thaGVhZChleHByKSB9LFxuICBzdHI6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBTdHIoZXhwcikgfSxcbiAgbHN0OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTGlzdChleHByKSB9LFxuICBvYmo6IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGlzTGVuaWVudCkgeyByZXR1cm4gbmV3IE9iaihwcm9wZXJ0aWVzLCAhIWlzTGVuaWVudCkgfSxcbiAgYXBwOiBmdW5jdGlvbihydWxlTmFtZSkgeyByZXR1cm4gbmV3IEFwcGx5KHJ1bGVOYW1lKSB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBOYW1lc3BhY2VzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgbmFtZXNwYWNlcyA9IHt9XG5cbmZ1bmN0aW9uIE5hbWVzcGFjZShuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ncmFtbWFycyA9IHt9XG59XG5cbk5hbWVzcGFjZS5wcm90b3R5cGUgPSB7XG4gIGluc3RhbGw6IGZ1bmN0aW9uKG5hbWUsIGdyYW1tYXIpIHtcbiAgICBpZiAodGhpcy5ncmFtbWFyc1tuYW1lXSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2R1cGxpY2F0ZSBkZWNsYXJhdGlvbiBvZiBncmFtbWFyJywgbmFtZSwgJ2luIG5hbWVzcGFjZScsIHRoaXMubmFtZSlcbiAgICBlbHNlXG4gICAgICB0aGlzLmdyYW1tYXJzW25hbWVdID0gZ3JhbW1hclxuICAgIHJldHVybiB0aGlzXG4gIH0sXG5cbiAgZ2V0R3JhbW1hcjogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLmdyYW1tYXJzW25hbWVdIHx8IGJyb3dzZXIuZXJyb3IoJ29obSBuYW1lc3BhY2UnLCB0aGlzLm5hbWUsICdoYXMgbm8gZ3JhbW1hciBjYWxsZWQnLCBuYW1lKVxuICB9LFxuXG4gIGxvYWRHcmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgYnJvd3Nlci5zYW5pdHlDaGVjaygnc2NyaXB0IHRhZ1xcJ3MgdHlwZSBhdHRyaWJ1dGUgbXVzdCBiZSBcInRleHQvb2htLWpzXCInLCBlbGVtZW50LnR5cGUgPT09ICd0ZXh0L29obS1qcycpXG4gICAgbWFrZUdyYW1tYXJzKGVsZW1lbnQuaW5uZXJIVE1MLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZhY3Rvcmllc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJBY3Rpb25EaWN0KG9wdE5hbWVzcGFjZSkge1xuICB2YXIgYnVpbGRlclxuICByZXR1cm4ge1xuICAgIHNwYWNlOiBmdW5jdGlvbih2YWx1ZSkge30sXG4gICAgJ3NwYWNlLW11bHRpTGluZSc6IGZ1bmN0aW9uKCkge30sXG4gICAgJ3NwYWNlLXNpbmdsZUxpbmUnOiBmdW5jdGlvbigpIHt9LFxuXG4gICAgX25hbWU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cygpIH0sXG4gICAgbmFtZUZpcnN0OiBmdW5jdGlvbih2YWx1ZSkge30sXG4gICAgbmFtZVJlc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7fSxcblxuICAgIG5hbWU6IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIG4gfSxcblxuICAgIG5hbWVkQ29uc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICduYW1lZENvbnN0LXVuZGVmaW5lZCc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkIH0sXG4gICAgJ25hbWVkQ29uc3QtbnVsbCc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbnVsbCB9LFxuICAgICduYW1lZENvbnN0LXRydWUnOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWUgfSxcbiAgICAnbmFtZWRDb25zdC1mYWxzZSc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2UgfSxcblxuICAgIHN0cmluZzogZnVuY3Rpb24oY3MpIHsgcmV0dXJuIGNzLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiBzdHJpbmdVdGlscy51bmVzY2FwZUNoYXIoYykgfSkuam9pbignJykgfSxcbiAgICBzQ2hhcjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICByZWdleHA6IGZ1bmN0aW9uKGUpIHsgcmV0dXJuIG5ldyBSZWdFeHAoZSkgfSxcbiAgICByZUNoYXJDbGFzczogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICBudW1iZXI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5pbnRlcnZhbC5jb250ZW50cygpKSB9LFxuXG4gICAgQWx0OiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnQWx0LXJlYyc6IGZ1bmN0aW9uKHgsIHkpIHsgcmV0dXJuIGJ1aWxkZXIuYWx0KHgsIHkpIH0sXG5cbiAgICBUZXJtOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnVGVybS1pbmxpbmUnOiBmdW5jdGlvbih4LCBuKSB7IHJldHVybiBidWlsZGVyLmlubGluZShidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSArICctJyArIG4sIHgpIH0sXG5cbiAgICBTZXE6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiBidWlsZGVyLnNlcS5hcHBseShidWlsZGVyLCB2YWx1ZSkgfSxcblxuICAgIEZhY3RvcjogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlIH0sXG4gICAgJ0ZhY3Rvci1iaW5kJzogZnVuY3Rpb24oeCwgbikgeyByZXR1cm4gYnVpbGRlci5iaW5kKHgsIG4pIH0sXG5cbiAgICBJdGVyOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnSXRlci1zdGFyJzogZnVuY3Rpb24oeCkgeyByZXR1cm4gYnVpbGRlci5tYW55KHgsIDApIH0sXG4gICAgJ0l0ZXItcGx1cyc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIubWFueSh4LCAxKSB9LFxuICAgICdJdGVyLW9wdCc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIub3B0KHgpIH0sXG5cbiAgICBQcmVkOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnUHJlZC1ub3QnOiBmdW5jdGlvbih4KSB7IHJldHVybiBidWlsZGVyLm5vdCh4KSB9LFxuICAgICdQcmVkLWxvb2thaGVhZCc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIubGEoeCkgfSxcblxuICAgIEJhc2U6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdCYXNlLXVuZGVmaW5lZCc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKHVuZGVmaW5lZCkgfSxcbiAgICAnQmFzZS1udWxsJzogZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8obnVsbCkgfSxcbiAgICAnQmFzZS10cnVlJzogZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8odHJ1ZSkgfSxcbiAgICAnQmFzZS1mYWxzZSc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKGZhbHNlKSB9LFxuICAgICdCYXNlLWFwcGxpY2F0aW9uJzogZnVuY3Rpb24ocnVsZU5hbWUpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKHJ1bGVOYW1lKSB9LFxuICAgICdCYXNlLXByaW0nOiBmdW5jdGlvbih4KSB7IHJldHVybiBidWlsZGVyLl8oeCkgfSxcbiAgICAnQmFzZS1sc3QnOiBmdW5jdGlvbih4KSB7IHJldHVybiBidWlsZGVyLmxzdCh4KSB9LFxuICAgICdCYXNlLXN0cic6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIuc3RyKHgpIH0sXG4gICAgJ0Jhc2UtcGFyZW4nOiBmdW5jdGlvbih4KSB7IHJldHVybiB4IH0sXG4gICAgJ0Jhc2Utb2JqJzogZnVuY3Rpb24obGVuaWVudCkgeyByZXR1cm4gYnVpbGRlci5vYmooW10sIGxlbmllbnQpIH0sXG4gICAgJ0Jhc2Utb2JqV2l0aFByb3BzJzogZnVuY3Rpb24ocHMsIGxlbmllbnQpIHsgcmV0dXJuIGJ1aWxkZXIub2JqKHBzLCBsZW5pZW50KSB9LFxuXG4gICAgUHJvcHM6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdQcm9wcy1iYXNlJzogZnVuY3Rpb24ocCkgeyByZXR1cm4gW3BdIH0sXG4gICAgJ1Byb3BzLXJlYyc6IGZ1bmN0aW9uKHAsIHBzKSB7IHJldHVybiBbcF0uY29uY2F0KHBzKSB9LFxuICAgIFByb3A6IGZ1bmN0aW9uKG4sIHApIHsgcmV0dXJuIHtuYW1lOiBuLCBwYXR0ZXJuOiBwfSB9LFxuXG4gICAgUnVsZTogZnVuY3Rpb24odmFsdWUpIHt9LFxuICAgICdSdWxlLWRlZmluZSc6IGZ1bmN0aW9uKG4sIGIpIHsgcmV0dXJuIGJ1aWxkZXIuZGVmaW5lKG4sIGIpIH0sXG4gICAgJ1J1bGUtb3ZlcnJpZGUnOiBmdW5jdGlvbihuLCBiKSB7IHJldHVybiBidWlsZGVyLm92ZXJyaWRlKG4sIGIpIH0sXG4gICAgJ1J1bGUtZXh0ZW5kJzogZnVuY3Rpb24obiwgYikgeyByZXR1cm4gYnVpbGRlci5leHRlbmQobiwgYikgfSxcbiAgICBSdWxlTmFtZTogZnVuY3Rpb24odmFsdWUpIHsgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSB2YWx1ZTsgcmV0dXJuIHZhbHVlIH0sXG5cbiAgICBTdXBlckdyYW1tYXI6IGZ1bmN0aW9uKHZhbHVlKSB7IGJ1aWxkZXIuc2V0U3VwZXJHcmFtbWFyKHZhbHVlKSB9LFxuICAgICdTdXBlckdyYW1tYXItcXVhbGlmaWVkJzogZnVuY3Rpb24obnMsIG4pIHsgcmV0dXJuIHRoaXNNb2R1bGUubmFtZXNwYWNlKG5zKS5nZXRHcmFtbWFyKG4pIH0sXG4gICAgJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCc6IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIG9wdE5hbWVzcGFjZS5nZXRHcmFtbWFyKG4pIH0sXG5cbiAgICBHcmFtbWFyOiBmdW5jdGlvbihuLCBzLCBycykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYnVpbGQob3B0TmFtZXNwYWNlKVxuICAgIH0sXG4gICAgR3JhbW1hcnM6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9LFxuICAgIEdyYW1tYXJOYW1lOiBmdW5jdGlvbih2YWx1ZSkgeyBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTsgYnVpbGRlci5zZXROYW1lKHZhbHVlKTsgcmV0dXJuIHZhbHVlIH1cbiAgfVxufVxuXG52YXIgZmlyc3QgPSB0cnVlXG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIHdoYXRJdElzLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIHRodW5rID0gdGhpc01vZHVsZS5fb2htR3JhbW1hci5tYXRjaENvbnRlbnRzKHNvdXJjZSwgd2hhdEl0SXMpXG4gIGlmICh0aHVuaylcbiAgICByZXR1cm4gdGh1bmsobWFrZUdyYW1tYXJBY3Rpb25EaWN0KG9wdE5hbWVzcGFjZSkpXG4gIGVsc2VcbiAgICAvLyBUT0RPOiBpbXByb3ZlIGVycm9yIG1lc3NhZ2UgKHNob3cgd2hhdCBwYXJ0IG9mIHRoZSBpbnB1dCBpcyB3cm9uZywgd2hhdCB3YXMgZXhwZWN0ZWQsIGV0Yy4pXG4gICAgYnJvd3Nlci5lcnJvcignaW52YWxpZCBpbnB1dCBpbjonLCBzb3VyY2UpXG59XG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFyJywgb3B0TmFtZXNwYWNlKVxufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXJzJywgb3B0TmFtZXNwYWNlKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHVibGljIG1ldGhvZHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFN0dWZmIHRoYXQgdXNlcnMgc2hvdWxkIGtub3cgYWJvdXRcblxudGhpc01vZHVsZS5uYW1lc3BhY2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGlmIChuYW1lc3BhY2VzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgbmFtZXNwYWNlc1tuYW1lXSA9IG5ldyBOYW1lc3BhY2UobmFtZSlcbiAgcmV0dXJuIG5hbWVzcGFjZXNbbmFtZV1cbn1cblxudGhpc01vZHVsZS5tYWtlR3JhbW1hciA9IG1ha2VHcmFtbWFyXG50aGlzTW9kdWxlLm1ha2VHcmFtbWFycyA9IG1ha2VHcmFtbWFyc1xuXG4vLyBTdHVmZiB0aGF0J3Mgb25seSB1c2VmdWwgZm9yIGJvb3RzdHJhcHBpbmcsIHRlc3RpbmcsIGV0Yy5cblxuLy8gVE9ETzogcmVuYW1lIHRvIF9idWlsZGVyXG50aGlzTW9kdWxlLmJ1aWxkZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCdWlsZGVyKClcbn1cblxudGhpc01vZHVsZS5fbWFrZUdyYW1tYXJBY3Rpb25EaWN0ID0gbWFrZUdyYW1tYXJBY3Rpb25EaWN0XG5cbnZhciBvaG1HcmFtbWFyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkodGhpc01vZHVsZSwgJ19vaG1HcmFtbWFyJywge1xuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghb2htR3JhbW1hcilcbiAgICAgIG9obUdyYW1tYXIgPSB0aGlzLl9vaG1HcmFtbWFyRmFjdG9yeSh0aGlzKVxuICAgIHJldHVybiBvaG1HcmFtbWFyXG4gIH1cbn0pXG5cbiJdfQ==
(7)
});