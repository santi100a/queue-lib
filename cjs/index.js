"use strict";
exports.__esModule = true;
exports.createQueue = exports.Queue = void 0;
var assertion_lib_1 = require("@santi100/assertion-lib");
var equal_lib_1 = require("@santi100/equal-lib");
function __throwClosed(already) {
    throw new Error("This queue has ".concat(already ? 'already been closed' : 'been closed', "."));
}
/**
 * Main class.
 */
var Queue = /** @class */ (function () {
    function Queue(jsonOrItems) {
        if (jsonOrItems === void 0) { jsonOrItems = []; }
        this.__isClosed = false;
        var opts = { enumerable: false, writable: true };
        Object.defineProperty(this, '__items', opts);
        Object.defineProperty(this, '__isClosed', opts);
        if (typeof jsonOrItems === 'string') {
            var parseResults = JSON.parse(jsonOrItems);
            (0, assertion_lib_1.assertArray)(parseResults, 'parseResults');
            this.__items = parseResults;
            return;
        }
        (0, assertion_lib_1.assertArray)(jsonOrItems, 'initialItems');
        this.__items = jsonOrItems.slice();
    }
    Queue.prototype.enqueue = function () {
        var _a;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        if (this.__isClosed)
            __throwClosed();
        (_a = this.__items).push.apply(_a, items);
        return this;
    };
    Queue.prototype.dequeue = function () {
        if (this.__isClosed)
            __throwClosed();
        return this.__items.shift();
    };
    /**
     * Clears the queue's items, leaving it empty.
     *
     * @returns `this` object for chaining.
     */
    Queue.prototype.clear = function () {
        if (this.__isClosed)
            __throwClosed();
        this.__items = [];
        return this;
    };
    Queue.prototype.peek = function (amount) {
        if (amount === void 0) { amount = 1; }
        if (amount === 1)
            return this.__items[0];
        var top = this.__items.slice(-amount); // shallow copy of top element(s)
        return top.slice();
    };
    /**
     * Retrieves the length of the queue.
     *
     * @returns The length of the queue.
     */
    Queue.prototype.getLength = function () {
        return this.__items.length;
    };
    /**
     * Executes `cb` for every item in the queue.
     *
     * @param cb The callback function to be executed for every item in the queue.
     * @returns `this` object for chaining.
     */
    Queue.prototype.forEach = function (cb) {
        if (typeof cb !== 'function')
            throw new TypeError("\"cb\" must be of type \"function\". Got \"".concat(cb, "\" of type \"").concat(typeof cb, "\"."));
        for (var i = 0; i < this.__items.length; i++) {
            cb(this.__items[i], i, this);
        }
        return this;
    };
    /**
     * Executes `cb` for every item in the queue, and creates a new one which contains
     * only the items that make `cb` return `true`.
     *
     * @param cb The callback function to be executed for every item in the queue.
     * @returns A new queue containing only the items that make `cb` return `true`.
     */
    Queue.prototype.filter = function (cb) {
        var newItems = [];
        if (typeof cb !== 'function')
            throw new TypeError("\"cb\" must be of type \"function\". Got \"".concat(cb, "\" of type \"").concat(typeof cb, "\"."));
        for (var i = 0; i < this.__items.length; i++) {
            var doPush = cb(this.__items[i], i, this);
            if (typeof doPush !== 'boolean')
                throw new TypeError("\"cb\" must return a value of type \"boolean\". Got \"".concat(doPush, "\" of type \"").concat(typeof doPush, "\"."));
            if (doPush)
                newItems.push(this.__items[i]);
        }
        return new Queue(newItems);
    };
    /**
     * Returns whether or not at least one item of the queue makes `cb` return `true`.
     *
     * @param cb The callback function to be executed on every item of the queue.
     * @returns Whether or not at least one item makes `cb` return `true`.
     */
    Queue.prototype.some = function (cb) {
        if (typeof cb !== 'function')
            throw new TypeError("\"cb\" must be of type \"function\". Got \"".concat(cb, "\" of type \"").concat(typeof cb, "\"."));
        for (var i = 0; i < this.__items.length; i++) {
            var isSatisfied = cb(this.__items[i], i, this);
            if (typeof isSatisfied !== 'boolean')
                throw new TypeError("\"cb\" must return a value of type \"boolean\". Got ".concat(isSatisfied, " of type ").concat(typeof isSatisfied));
            if (isSatisfied)
                return true;
        }
        return false;
    };
    Queue.prototype.reduce = function (cb, initialValue) {
        if (typeof cb !== 'function')
            throw new TypeError("\"cb\" must be of type \"function\". Got \"".concat(cb, "\" of type \"").concat(typeof cb, "\"."));
        if (this.__items.length === 0 && initialValue === undefined) {
            throw new Error('Reduce of empty queue with no initial value!');
        }
        var accumulator = initialValue !== null && initialValue !== void 0 ? initialValue : this.__items[0];
        var startIndex = initialValue !== undefined ? 0 : 1;
        for (var i = startIndex; i < this.__items.length; i++) {
            accumulator = cb(accumulator, this.__items[i], i, this);
        }
        return accumulator;
    };
    /**
     * Maps every item of this queue to another one in a new queue, via `cb`.
     *
     * @param cb A callback to be executed for every item in the original queue.
     * @returns A new queue containing the results of calling `cb` for every
     * item in the original one.
     */
    Queue.prototype.map = function (cb) {
        if (typeof cb !== 'function')
            throw new TypeError("\"cb\" must be of type \"function\". Got \"".concat(cb, "\" of type \"").concat(typeof cb, "\"."));
        var newItems = [];
        for (var i = 0; i < this.__items.length; i++) {
            newItems.push(cb(this.__items[i], i, this));
        }
        return new Queue(newItems);
    };
    /**
     * Returns `true` if there's no items in the queue, `false` otherwise.
     *
     * @returns Whether or not this queue is empty.
     */
    Queue.prototype.isEmpty = function () {
        return this.__items.length === 0;
    };
    /**
     * Returns `true` if `item` is in the queue, `false` otherwise.
     *
     * @returns Whether or not this queue is empty.
     */
    Queue.prototype.includes = function (item) {
        return this.indexOf(item) !== -1;
    };
    /**
     * Returns `true` if `item` is in the queue (by deep comparison), `false` otherwise.
     * Deep equality is powered by `@santi100/equal-lib`, as per usual :)
     *
     * @returns Whether or not `item` is in this queue. `item` is deeply compared
     * against each item in order to determine this.
     */
    Queue.prototype.deepIncludes = function (item) {
        return this.deepIndexOf(item) !== -1;
    };
    /**
     * Returns `item`'s index in the queue (by deep comparison), or -1 if it's not there.
     * Deep equality is powered by `@santi100/equal-lib`, as per usual :)
     *
     * @returns `item`'s index in the queue (by deep comparison), or -1 if it's not in the queue.
     */
    Queue.prototype.deepIndexOf = function (item, epsilon) {
        for (var i = 0; i < this.__items.length; i++) {
            if ((0, equal_lib_1.deepEquality)(item, this.__items[i], { epsilon: epsilon }))
                return i;
        }
        return -1;
    };
    /**
     * Returns this queue's closure state.
     * @returns Whether or not this queue is closed.
     */
    Queue.prototype.isClosed = function () {
        return this.__isClosed;
    };
    /**
     * Shallowly looks for `item` in the queue and returns its index, or -1 if it's not there.
     *
     * @returns `item`'s index in the queue by shallow comparison, or -1 if it's not in the queue.
     */
    Queue.prototype.indexOf = function (item) {
        for (var i = 0; i < this.__items.length; i++) {
            if (item === this.__items[i])
                return i;
        }
        return -1;
    };
    /**
     * Shallowly looks for `item`'s last occurrence
     * in the queue and returns its index, or -1 if it's not there.
     *
     * @returns The index of the last occurence of `items` in the queue, or -1 if it's not in the
     * queue.
     */
    Queue.prototype.lastIndexOf = function (item) {
        for (var i = this.__items.length - 1; i >= 0; i--) {
            if (item === this.__items[i])
                return i;
        }
        return -1;
    };
    /**
     * Reverses the queue in-place. If you want to create a reversed copy, add `.copy()`
     * before this method.
     *
     * @returns `this` object for chaining.
     */
    Queue.prototype.reverse = function () {
        if (this.__isClosed)
            __throwClosed();
        this.__items.reverse();
        return this;
    };
    /**
     * Returns an array containing all items currently in the queue.
     *
     * @returns An array with all items in the queue.
     */
    Queue.prototype.toArray = function () {
        return this.__items.slice();
    };
    /**
     * Makes a new queue with all items contained in this one.
     *
     * @returns A new queue with all items of this one.
     */
    Queue.prototype.copy = function () {
        return new Queue(this.__items.slice());
    };
    /**
     * Returns a JSON representation of this queue.
     * @param beautify Whether or not to add indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     */
    Queue.prototype.toString = function (beautify) {
        if (beautify === void 0) { beautify = false; }
        (0, assertion_lib_1.assertTypeOf)(beautify, 'boolean', 'beautify');
        return JSON.stringify(this.__items, null, beautify ? 4 : undefined);
    };
    Queue.prototype.close = function () {
        if (this.__isClosed)
            __throwClosed(true);
        this.__isClosed = true;
        return this;
    };
    return Queue;
}());
exports.Queue = Queue;
function createQueue(initialItems) {
    if (initialItems === void 0) { initialItems = []; }
    return new Queue(initialItems);
}
exports.createQueue = createQueue;
exports["default"] = Queue;
