import { assertArray, assertTypeOf } from '@santi100/assertion-lib';
import { deepEquality } from '@santi100/equal-lib';

export type QueueCallback<T, R = unknown> = (
	item: T,
	index: number,
	queue: Queue<T>
) => R;

export type QueueReducerCb<T, R = unknown> = (
	acc: T,
	cur: T,
	idx: number,
	queue: Queue<T>
) => R;
function __throwClosed(already?: boolean): never {
	throw new Error(
		`This queue has ${already ? 'already been closed' : 'been closed'}.`
	);
}
/**
 * Main class.
 */
export class Queue<T = unknown> {
	private __items: T[];
	private __isClosed: boolean;
	constructor(json: string);
	constructor(initialItems?: T[]);
	constructor(jsonOrItems: T[] | string = []) {
		this.__isClosed = false;

		const opts: PropertyDescriptor = { enumerable: false, writable: true };
		Object.defineProperty(this, '__items', opts);
		Object.defineProperty(this, '__isClosed', opts);

		if (typeof jsonOrItems === 'string') {
			const parseResults = JSON.parse(jsonOrItems);
			assertArray(parseResults, 'parseResults');
			this.__items = parseResults;
			return;
		}
		assertArray(jsonOrItems, 'initialItems');
		this.__items = jsonOrItems.slice();
	}
	enqueue(...items: T[]) {
		if (this.__isClosed) __throwClosed();
		this.__items.push(...items);
		return this;
	}
	dequeue() {
		if (this.__isClosed) __throwClosed();
		return this.__items.shift();
	}
	/**
	 * Clears the queue's items, leaving it empty.
	 *
	 * @returns `this` object for chaining.
	 */
	clear() {
		if (this.__isClosed) __throwClosed();

		this.__items = [];
		return this;
	}
	/**
	 * Peeks `amount` items (retrieves items without popping them out).
	 *
	 * @param amount The amount of items to peek.
	 * @returns `amount` items from the queue.
	 */
	peek(amount: number): T[];
	/**
	 * Peeks (retrieves without popping out) the last item.
	 *
	 * @returns The last item.
	 */
	peek(): T;
	peek(amount = 1) {
		if (amount === 1) return this.__items[0];
		const top = this.__items.slice(-amount); // shallow copy of top element(s)
		return top.slice();
	}
	/**
	 * Retrieves the length of the queue.
	 *
	 * @returns The length of the queue.
	 */
	getLength() {
		return this.__items.length;
	}
	/**
	 * Executes `cb` for every item in the queue.
	 *
	 * @param cb The callback function to be executed for every item in the queue.
	 * @returns `this` object for chaining.
	 */
	forEach<R = unknown>(cb: QueueCallback<T, R>) {
		if (typeof cb !== 'function')
			throw new TypeError(
				`"cb" must be of type "function". Got "${cb}" of type "${typeof cb}".`
			);
		for (let i = 0; i < this.__items.length; i++) {
			cb(this.__items[i], i, this);
		}
		return this;
	}
	/**
	 * Executes `cb` for every item in the queue, and creates a new one which contains
	 * only the items that make `cb` return `true`.
	 *
	 * @param cb The callback function to be executed for every item in the queue.
	 * @returns A new queue containing only the items that make `cb` return `true`.
	 */
	filter(cb: QueueCallback<T, boolean>) {
		const newItems = [];
		if (typeof cb !== 'function')
			throw new TypeError(
				`"cb" must be of type "function". Got "${cb}" of type "${typeof cb}".`
			);
		for (let i = 0; i < this.__items.length; i++) {
			const doPush = cb(this.__items[i], i, this);
			if (typeof doPush !== 'boolean')
				throw new TypeError(
					`"cb" must return a value of type "boolean". Got "${doPush}" of type "${typeof doPush}".`
				);

			if (doPush) newItems.push(this.__items[i]);
		}
		return new Queue(newItems);
	}
	/**
	 * Returns whether or not at least one item of the queue makes `cb` return `true`.
	 *
	 * @param cb The callback function to be executed on every item of the queue.
	 * @returns Whether or not at least one item makes `cb` return `true`.
	 */
	some(cb: QueueCallback<T, boolean>) {
		if (typeof cb !== 'function')
			throw new TypeError(
				`"cb" must be of type "function". Got "${cb}" of type "${typeof cb}".`
			);
		for (let i = 0; i < this.__items.length; i++) {
			const isSatisfied = cb(this.__items[i], i, this);
			if (typeof isSatisfied !== 'boolean')
				throw new TypeError(
					`"cb" must return a value of type "boolean". Got ${isSatisfied} of type ${typeof isSatisfied}`
				);

			if (isSatisfied) return true;
		}
		return false;
	}
	/**
	 * Reduces the queue to one value by repeatedly calling `cb` and accumulating its results.
	 *
	 * @param cb A callback to be executed for every item (see {@link Array.prototype.reduce}).
	 */
	reduce<R = unknown>(cb: QueueReducerCb<T, R>): T;
	/**
	 * Reduces the queue to one value by repeatedly calling `cb` and accumulating its results.
	 *
	 * @param cb A callback to be executed for every item (see {@link Array.prototype.reduce}).
	 * @param initialValue The initial value to be used instead of the first item in the queue.
	 */
	reduce<R = unknown>(cb: QueueReducerCb<T, R>, initialValue: R): R;
	reduce<R = unknown>(cb: QueueReducerCb<T, R>, initialValue?: R): T | R {
		if (typeof cb !== 'function')
			throw new TypeError(
				`"cb" must be of type "function". Got "${cb}" of type "${typeof cb}".`
			);
		if (this.__items.length === 0 && initialValue === undefined) {
			throw new Error('Reduce of empty queue with no initial value!');
		}
		let accumulator: R | T = initialValue ?? this.__items[0];
		const startIndex = initialValue !== undefined ? 0 : 1;
		for (let i = startIndex; i < this.__items.length; i++) {
			accumulator = cb(accumulator as T, this.__items[i], i, this);
		}

		return accumulator;
	}
	/**
	 * Maps every item of this queue to another one in a new queue, via `cb`.
	 *
	 * @param cb A callback to be executed for every item in the original queue.
	 * @returns A new queue containing the results of calling `cb` for every
	 * item in the original one.
	 */
	map<R = unknown>(cb: QueueCallback<T, R>) {
		if (typeof cb !== 'function')
			throw new TypeError(
				`"cb" must be of type "function". Got "${cb}" of type "${typeof cb}".`
			);
		const newItems = [];
		for (let i = 0; i < this.__items.length; i++) {
			newItems.push(cb(this.__items[i], i, this));
		}
		return new Queue(newItems);
	}
	/**
	 * Returns `true` if there's no items in the queue, `false` otherwise.
	 *
	 * @returns Whether or not this queue is empty.
	 */
	isEmpty() {
		return this.__items.length === 0;
	}
	/**
	 * Returns `true` if `item` is in the queue, `false` otherwise.
	 *
	 * @returns Whether or not this queue is empty.
	 */
	includes(item: T) {
		return this.indexOf(item) !== -1;
	}
	/**
	 * Returns `true` if `item` is in the queue (by deep comparison), `false` otherwise.
	 * Deep equality is powered by `@santi100/equal-lib`, as per usual :)
	 *
	 * @returns Whether or not `item` is in this queue. `item` is deeply compared
	 * against each item in order to determine this.
	 */
	deepIncludes(item: T) {
		return this.deepIndexOf(item) !== -1;
	}
	/**
	 * Returns `item`'s index in the queue (by deep comparison), or -1 if it's not there.
	 * Deep equality is powered by `@santi100/equal-lib`, as per usual :)
	 *
	 * @returns `item`'s index in the queue (by deep comparison), or -1 if it's not in the queue.
	 */
	deepIndexOf(item: T, epsilon?: number) {
		for (let i = 0; i < this.__items.length; i++) {
			if (deepEquality(item, this.__items[i], { epsilon })) return i;
		}
		return -1;
	}
	/**
	 * Returns this queue's closure state.
	 * @returns Whether or not this queue is closed.
	 */
	isClosed() {
		return this.__isClosed;
	}
	/**
	 * Shallowly looks for `item` in the queue and returns its index, or -1 if it's not there.
	 *
	 * @returns `item`'s index in the queue by shallow comparison, or -1 if it's not in the queue.
	 */
	indexOf(item: T) {
		for (let i = 0; i < this.__items.length; i++) {
			if (item === this.__items[i]) return i;
		}
		return -1;
	}
	/**
	 * Shallowly looks for `item`'s last occurrence
	 * in the queue and returns its index, or -1 if it's not there.
	 *
	 * @returns The index of the last occurence of `items` in the queue, or -1 if it's not in the
	 * queue.
	 */
	lastIndexOf(item: T) {
		for (let i = this.__items.length - 1; i >= 0; i--) {
			if (item === this.__items[i]) return i;
		}
		return -1;
	}
	/**
	 * Reverses the queue in-place. If you want to create a reversed copy, add `.copy()`
	 * before this method.
	 *
	 * @returns `this` object for chaining.
	 */
	reverse() {
		if (this.__isClosed) __throwClosed();

		this.__items.reverse();
		return this;
	}
	/**
	 * Returns an array containing all items currently in the queue.
	 *
	 * @returns An array with all items in the queue.
	 */
	toArray(): T[] {
		return this.__items.slice();
	}
	/**
	 * Makes a new queue with all items contained in this one.
	 *
	 * @returns A new queue with all items of this one.
	 */
	copy() {
		return new Queue(this.__items.slice());
	}
	/**
	 * Returns a JSON representation of this queue.
	 * @param beautify Whether or not to add indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
	 */
	toString(beautify = false) {
		assertTypeOf(beautify, 'boolean', 'beautify');
		return JSON.stringify(this.__items, null, beautify ? 4 : undefined);
	}
	close() {
		if (this.__isClosed) __throwClosed(true);
		this.__isClosed = true;
		return this;
	}
}
export function createQueue<T = unknown>(initialItems: T[] = []) {
	return new Queue<T>(initialItems);
}
export default Queue;
