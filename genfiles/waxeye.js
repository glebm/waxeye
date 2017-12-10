(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["waxeye"] = factory();
	else
		root["waxeye"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cons;
/* harmony export (immutable) */ __webpack_exports__["b"] = empty;
// Creates a non-empty cons list.
function cons(head, tail) {
    return new Cons(head, tail);
}
// Returns the empty cons list.
function empty() {
    return Empty.instance;
}
// A non-empty cons list.
class Cons {
    // Internal, not public.
    // TODO(glebm): Add the internal modifier once it's implemented in TypeScript
    // https://github.com/Microsoft/TypeScript/issues/5228
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
    }
    isEmpty() {
        return false;
    }
    toArray() {
        const result = [this.head];
        let currentTail = this.tail;
        while (!currentTail.isEmpty()) {
            result.push(currentTail.head);
            currentTail = currentTail.tail;
        }
        return result;
    }
    [Symbol.iterator]() {
        let current = this;
        return {
            next() {
                if (current.isEmpty()) {
                    // This typecast is necessary because TypeScript incorrectly
                    // specifies both `done` and `value` as required.
                    return { done: true };
                }
                const value = current.head;
                current = current.tail;
                return { value };
            },
        };
    }
}
/* unused harmony export Cons */

// An empty cons list.
class Empty {
    constructor() { }
    isEmpty() {
        return true;
    }
    toArray() {
        return [];
    }
    [Symbol.iterator]() {
        return {
            next() {
                return { done: true };
            },
        };
    }
}
/* unused harmony export Empty */

Empty.instance = new Empty();


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["EmptyAST"] = EmptyAST;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cons_list__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__expr__ = __webpack_require__(2);
/*
 * Waxeye Parser Generator http://www.waxeye.org
 * Licensed under the MIT license. See 'LICENSE' for details.
 */


class WaxeyeParser {
    constructor(config, start /* keyof env */) {
        this.config = config;
        this.start = start; /* keyof env */
        this.env = parserConfigToRuntimeParserConfig(config);
    }
    parse(input, start = this.start) {
        if (!this.env[start]) {
            throw new Error(`Invalid non-terminal ${start}. Expected one of: ${Object.keys(this.env).join(', ')}`);
        }
        return match(this.env, start, input);
    }
}
/* harmony export (immutable) */ __webpack_exports__["WaxeyeParser"] = WaxeyeParser;

function parserConfigToRuntimeParserConfig(config) {
    const result = {};
    for (const [name, nonterminal] of Object.entries(config)) {
        result[name] = {
            mode: nonterminal.mode,
            exp: Object(__WEBPACK_IMPORTED_MODULE_1__expr__["a" /* exprToRuntimeExpr */])(nonterminal.exp),
        };
    }
    return result;
}
/*
 * An abstract syntax tree holds the non-terminal's name (`type`),
 * and a list of child ASTs.
 */
class AST {
    constructor(type, children) {
        this.type = type;
        this.children = children;
    }
    /**
     * The empty AST is an AST that has an empty `type` and no children.
     */
    isEmpty() {
        return this.type === '' && this.children.length === 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["AST"] = AST;

function EmptyAST() {
    return new AST('', []);
}
// A failed single character match.
class ErrChar {
    constructor(char) {
        this.char = char;
    }
    toGrammarString() {
        return `'${JSON.stringify(this.char).slice(1, -1)}'`;
    }
}
/* harmony export (immutable) */ __webpack_exports__["ErrChar"] = ErrChar;

// A failed character class match.
class ErrCC {
    // A list of Unicode codepoints / ranges of codepoints.
    constructor(charClasses) {
        this.charClasses = charClasses;
    }
    toGrammarString() {
        return `[${this.charClasses
            .map((charClass) => {
            return JSON
                .stringify(typeof charClass === 'number' ?
                String.fromCodePoint(charClass) :
                `${String.fromCodePoint(charClass[0])}-${String.fromCodePoint(charClass[1])}`)
                .slice(1, -1);
        })
            .join('')}]`;
    }
}
/* harmony export (immutable) */ __webpack_exports__["ErrCC"] = ErrCC;

// A failed wildcard match.
class ErrAny {
    toGrammarString() {
        return '.';
    }
}
/* harmony export (immutable) */ __webpack_exports__["ErrAny"] = ErrAny;

class ParseError {
    constructor(pos, line, col, nt, chars) {
        this.pos = pos;
        this.line = line;
        this.col = col;
        this.nt = nt;
        this.chars = chars;
    }
    toString() {
        const chars = this.chars.map((err) => err.toGrammarString()).join(' | ') || '\'\'';
        return `Parse error: Failed to match '${this.nt.join(',')}' at line=${this.line}, col=${this.col}, pos=${this.pos}. Expected: ${chars}`;
    }
}
/* harmony export (immutable) */ __webpack_exports__["ParseError"] = ParseError;

class RawError {
    constructor(pos, nonterminals, failedChars, currentNT) {
        this.pos = pos;
        this.nonterminals = nonterminals;
        this.failedChars = failedChars;
        this.currentNT = currentNT;
    }
    toParseError(input) {
        const [line, col] = getLineCol(this.pos, input);
        const uniqueNonterminals = [];
        const seenNonterminals = new Set();
        for (const nt of this.nonterminals) {
            if (seenNonterminals.has(nt)) {
                continue;
            }
            uniqueNonterminals.push(nt);
            seenNonterminals.add(nt);
        }
        return new ParseError(this.pos, line, col, uniqueNonterminals, this.failedChars.toArray().reverse());
    }
}
function updateError(err, pos, e) {
    if (err !== null) {
        if (pos > err.pos) {
            return new RawError(pos, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(err.currentNT, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])()), Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(e, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])()), err.currentNT);
        }
        else if (pos === err.pos) {
            return new RawError(err.pos, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(err.currentNT, err.nonterminals), Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(e, err.failedChars), err.currentNT);
        }
        else {
            return new RawError(err.pos, err.nonterminals, err.failedChars, err.currentNT);
        }
    }
    else {
        return new RawError(0, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])('', Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])()), Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(e, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])()), '');
    }
}
function contSeq(expressions) {
    return { type: 1 /* SEQ */, expressions };
}
function contAlt(expressions, pos, asts) {
    return { type: 2 /* ALT */, expressions, pos, asts };
}
function contAnd(pos, asts, err) {
    return { type: 3 /* AND */, pos, asts, err };
}
function contNot(pos, asts, err) {
    return { type: 4 /* NOT */, pos, asts, err };
}
function contOpt(pos, asts) {
    return { type: 5 /* OPT */, pos, asts };
}
function contStar(expression, pos, asts) {
    return { type: 6 /* STAR */, expression, pos, asts };
}
function contPlus(expression) {
    return { type: 7 /* PLUS */, expression };
}
function contVoid(asts) {
    return { type: 8 /* VOID */, asts };
}
function contNT(mode, name, asts, nt) {
    return { type: 9 /* NT */, mode, name, asts, nt };
}
function accept(pos, asts, err) {
    return { type: 1 /* ACCEPT */, pos, asts, err };
}
function reject(err) {
    return { type: 2 /* REJECT */, err };
}
function evalNext(exp, pos, asts, err, continuations) {
    return { type: 1 /* EVAL */, asts, continuations, err, exp, pos };
}
function applyNext(continuations, value) {
    return { type: 2 /* APPLY */, continuations, value };
}
function match(env, start, input) {
    // move from initial state to halting state
    let action = moveEval(env, input, evalNext(env[start].exp, /*pos=*/ 0, /*asts=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), new RawError(
    /*pos=*/ 0, /*nonterminals=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(start, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])()), 
    /*failedChars=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), 
    /*currentNT=*/ start), 
    /*continuations=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])()));
    while (true) {
        switch (action.type) {
            case 1 /* EVAL */:
                action = moveEval(env, input, action);
                break;
            case 2 /* APPLY */:
                const { continuations, value } = action;
                if (continuations.isEmpty()) {
                    return moveReturn(env, start, input, value);
                }
                action =
                    moveApply(input, value, continuations.head, continuations.tail);
                break;
        }
    }
}
// Evaluates the result of the expression given in `action`.
function moveEval(env, input, action) {
    const { exp, pos, asts, err, continuations } = action;
    const eof = pos >= input.length;
    switch (exp.type) {
        case 10 /* ANY_CHAR */:
            if (eof) {
                return applyNext(continuations, reject(updateError(err, pos, new ErrAny())));
            }
            else {
                // Advance one position if the input code-point is in BMP, two positions
                // otherwise.
                return applyNext(continuations, isSingleCharCodepoint(codePointAtOrFail(input, pos)) ?
                    accept(pos + 1, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(input[pos], asts), err) :
                    // A non single-char code-point implies !eof(pos + 1)
                    accept(pos + 2, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(input[pos] + input[pos + 1], asts), err));
            }
        case 2 /* ALT */: {
            const { exprs } = exp;
            if (exprs.isEmpty()) {
                return applyNext(continuations, reject(err));
            }
            return evalNext(exprs.head, pos, asts, err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contAlt(exprs.tail, pos, asts), continuations));
        }
        case 7 /* AND */:
            return evalNext(exp.expr, pos, /*asts=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contAnd(pos, asts, err), continuations));
        case 8 /* NOT */:
            return evalNext(exp.expr, pos, /*asts=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contNot(pos, asts, err), continuations));
        case 9 /* VOID */:
            return evalNext(exp.expr, pos, /*asts=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contVoid(asts), continuations));
        case 11 /* CHAR */:
            const c = exp.char;
            return applyNext(continuations, c.length === 1 ?
                eof || c !== input[pos] ?
                    reject(updateError(err, pos, new ErrChar(c))) :
                    accept(pos + 1, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(input[pos], asts), err) :
                // c.length === 2:
                pos + 1 >= input.length || c[0] !== input[pos] ||
                    c[1] !== input[pos + 1] ?
                    reject(updateError(err, pos, new ErrChar(c))) :
                    accept(pos + 2, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(input[pos] + input[pos + 1], asts), err));
        case 12 /* CHAR_CLASS */:
            const cc = exp.codepoints;
            if (eof) {
                return applyNext(continuations, reject(updateError(err, pos, new ErrCC(cc))));
            }
            // JavaScript string comparison does not compare Unicode characters
            // correctly, so we must compare codepoints. Example:
            //   'ﬆ' > '𝌆' //=> true
            //   'ﬆ'.codePointAt(0) > '𝌆'.codePointAt(0) //=> false
            const inputCodePoint = codePointAtOrFail(input, pos);
            // Loop over cc instead of recursing to avoid stack overflow on large
            // character classes.
            for (const charClass of cc) {
                const isMatch = typeof charClass === 'number' ?
                    // Single character
                    charClass === inputCodePoint :
                    // Range
                    charClass[0] <= inputCodePoint && charClass[1] >= inputCodePoint;
                if (isMatch) {
                    return applyNext(continuations, isSingleCharCodepoint(inputCodePoint) ?
                        accept(pos + 1, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(input[pos], asts), err) :
                        accept(pos + 2, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(input[pos] + input[pos + 1], asts), err));
                }
            }
            return applyNext(continuations, reject(updateError(err, pos, new ErrCC(cc))));
        case 3 /* SEQ */: {
            // A sequence is made up of a list of expressions.
            // We traverse the list, making sure each expression succeeds.
            // The rest of the string returned by the expression is used
            // as input to the next expression.
            const { exprs } = exp;
            if (exprs.isEmpty()) {
                return applyNext(continuations, accept(pos, asts, err));
            }
            return evalNext(exprs.head, pos, asts, err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contSeq(exprs.tail), continuations));
        }
        case 4 /* PLUS */:
            return evalNext(exp.expr, pos, asts, err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contPlus(exp.expr), continuations));
        case 5 /* STAR */:
            return evalNext(exp.expr, pos, asts, err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contStar(exp.expr, pos, asts), continuations));
        case 6 /* OPT */:
            return evalNext(exp.expr, pos, asts, err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contOpt(pos, asts), continuations));
        case 1 /* NT */:
            const { name } = exp;
            const nt = env[name];
            return evalNext(nt.exp, pos, /*asts=*/ Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), new RawError(err.pos, err.nonterminals, err.failedChars, name), Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contNT(nt.mode, name, asts, err.currentNT), continuations));
        default:
            throw new Error(`Unsupported exp.type in exp=${exp.type} action=${JSON.stringify(action)}`);
    }
}
// Handles the result of a processed continuation.
function moveApply(input, value, evaluated, rest) {
    switch (value.type) {
        case 1 /* ACCEPT */:
            return moveApplyOnAccept(input, value, evaluated, rest);
        case 2 /* REJECT */:
            return moveApplyOnReject(input, value, evaluated, rest);
    }
}
// Called after the `evaluated` continuation got accepted (matched).
function moveApplyOnAccept(input, accepted, evaluated, rest) {
    switch (evaluated.type) {
        case 1 /* SEQ */: {
            const { expressions } = evaluated;
            if (expressions.isEmpty()) {
                return applyNext(rest, accepted);
            }
            return evalNext(expressions.head, accepted.pos, accepted.asts, accepted.err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contSeq(expressions.tail), rest));
        }
        case 6 /* STAR */:
        case 7 /* PLUS */:
            return evalNext(evaluated.expression, accepted.pos, accepted.asts, accepted.err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contStar(evaluated.expression, accepted.pos, accepted.asts), rest));
        case 2 /* ALT */:
        case 5 /* OPT */:
            return applyNext(rest, accepted);
        case 3 /* AND */:
            return applyNext(rest, accept(evaluated.pos, evaluated.asts, evaluated.err));
        case 8 /* VOID */:
            return applyNext(rest, accept(accepted.pos, evaluated.asts, accepted.err));
        case 4 /* NOT */:
            return applyNext(rest, reject(evaluated.err));
        case 9 /* NT */:
            const { mode, name, asts, nt } = evaluated;
            const valAsts = accepted.asts;
            const newErr = new RawError(accepted.err.pos, accepted.err.nonterminals, accepted.err.failedChars, nt);
            switch (mode) {
                case 1 /* NORMAL */:
                    return applyNext(rest, accept(accepted.pos, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(new AST(name, valAsts.toArray().reverse()), asts), newErr));
                case 2 /* PRUNING */:
                    if (valAsts.isEmpty()) {
                        return applyNext(rest, accept(accepted.pos, asts, newErr));
                    }
                    else if (valAsts.tail.isEmpty()) {
                        return applyNext(rest, accept(accepted.pos, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(valAsts.head, asts), newErr));
                    }
                    else {
                        return applyNext(rest, accept(accepted.pos, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(new AST(name, valAsts.toArray().reverse()), asts), newErr));
                    }
                case 3 /* VOIDING */:
                    return applyNext(rest, accept(accepted.pos, asts, newErr));
                default:
                    // Without this check, the TypeScript compiler doesn't
                    // realize that the outer case is also exhaustive.
                    // tslint:disable-next-line:no-unused-variable
                    const checkExhaustive = mode;
                    throw new Error(`Invalid mode: ${JSON.stringify(mode)}`);
            }
    }
}
// Called after the `evaluated` continuation got rejected (did not match).
function moveApplyOnReject(input, rejected, evaluated, continuations) {
    switch (evaluated.type) {
        case 2 /* ALT */: {
            const { expressions } = evaluated;
            if (expressions.isEmpty()) {
                return applyNext(continuations, rejected);
            }
            return evalNext(expressions.head, evaluated.pos, evaluated.asts, rejected.err, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(contAlt(expressions.tail, evaluated.pos, evaluated.asts), continuations));
        }
        case 1 /* SEQ */:
        case 8 /* VOID */:
        case 7 /* PLUS */:
            return applyNext(continuations, rejected);
        case 3 /* AND */:
            return applyNext(continuations, reject(evaluated.err));
        case 4 /* NOT */:
        case 6 /* STAR */:
        case 5 /* OPT */:
            return applyNext(continuations, accept(evaluated.pos, evaluated.asts, rejected.err));
        case 9 /* NT */:
            const err = rejected.err;
            return applyNext(continuations, reject(new RawError(err.pos, err.nonterminals, err.failedChars, evaluated.nt)));
        default:
            // tslint:disable-next-line:no-unused-variable
            const checkExhaustive = evaluated;
            throw new Error(`Invalid continuation: ${JSON.stringify(evaluated)}`);
    }
}
// Called after the final continuation was processed.
function moveReturn(env, start, input, value) {
    switch (value.type) {
        case 1 /* ACCEPT */:
            const asts = value.asts;
            if (value.pos >= input.length) {
                switch (env[start].mode) {
                    case 1 /* NORMAL */:
                        return new AST(start, asts.toArray().reverse());
                    case 2 /* PRUNING */:
                        if (asts.isEmpty()) {
                            return EmptyAST();
                        }
                        else if (asts.tail.isEmpty()) {
                            const ast = asts.head;
                            if (typeof ast === 'string') {
                                throw new Error(`Expected an AST, got a string ${JSON.stringify(ast)}, in ${value}`);
                            }
                            return ast;
                        }
                        else {
                            return new AST(start, asts.toArray().reverse());
                        }
                    case 3 /* VOIDING */:
                        return EmptyAST();
                }
            }
            else if (value.err && value.pos === value.err.pos) {
                return new RawError(value.pos, value.err.nonterminals, value.err.failedChars, '')
                    .toParseError(input);
            }
            else {
                return new RawError(value.pos, Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])(), '')
                    .toParseError(input);
            }
        case 2 /* REJECT */:
            return value.err.toParseError(input);
    }
}
function getLineCol(pos, input) {
    let lineNumber = 1;
    let lineStartPos = 0;
    let newlinePos = -1;
    // tslint:disable-next-line:no-conditional-assignment
    while ((newlinePos = input.indexOf('\n', lineStartPos)) !== -1 &&
        newlinePos < pos) {
        ++lineNumber;
        lineStartPos = newlinePos + 1;
    }
    return [lineNumber, pos - lineStartPos + 1];
}
// Whether the given Unicode code-point can be represented
// by a single JavaScript String (UTF-16) character.
function isSingleCharCodepoint(codePoint) {
    return codePoint <= 0xFFFF;
}
function codePointAtOrFail(input, pos) {
    const codePoint = input.codePointAt(pos);
    if (typeof codePoint === 'undefined') {
        throw new Error(`Undefined input codepoint at ${pos} in ${JSON.stringify(input)}`);
    }
    return codePoint;
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = exprToRuntimeExpr;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cons_list__ = __webpack_require__(0);
// We have two representations for expression:
// the config one, and the internal one.
// The config representation is JSON-compatible.
// The internal one is optimized for performance.

function exprToRuntimeExpr(expr) {
    switch (expr.type) {
        case 1 /* NT */:
        case 11 /* CHAR */:
        case 12 /* CHAR_CLASS */:
        case 10 /* ANY_CHAR */:
            return expr;
        case 4 /* PLUS */:
        case 5 /* STAR */:
        case 6 /* OPT */:
        case 7 /* AND */:
        case 8 /* NOT */:
        case 9 /* VOID */:
            return { type: expr.type, expr: exprToRuntimeExpr(expr.expr) };
        case 2 /* ALT */:
        case 3 /* SEQ */:
            return {
                type: expr.type,
                exprs: expr.exprs.reduceRight((result, value) => Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["a" /* cons */])(exprToRuntimeExpr(value), result), Object(__WEBPACK_IMPORTED_MODULE_0__cons_list__["b" /* empty */])()),
            };
    }
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=waxeye.js.map