export type QueueCallback<T, R = unknown> = (item: T, index: number, queue: Queue<T>) => R;
export type QueueReducerCb<T, R = unknown> = (acc: T, cur: T, idx: number, queue: Queue<T>) => R;
/**
 * Main class.
 */
export declare class Queue<T = unknown> {
    private __items;
    private __isClosed;
    constructor(json: string);
    constructor(initialItems?: T[]);
    enqueue(...items: T[]): this;
    dequeue(): T | undefined;
    /**
     * Clears the queue's items, leaving it empty.
     *
     * @returns `this` object for chaining.
     */
    clear(): this;
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
    /**
     * Retrieves the length of the queue.
     *
     * @returns The length of the queue.
     */
    getLength(): number;
    /**
     * Executes `cb` for every item in the queue.
     *
     * @param cb The callback function to be executed for every item in the queue.
     * @returns `this` object for chaining.
     */
    forEach<R = unknown>(cb: QueueCallback<T, R>): this;
    /**
     * Executes `cb` for every item in the queue, and creates a new one which contains
     * only the items that make `cb` return `true`.
     *
     * @param cb The callback function to be executed for every item in the queue.
     * @returns A new queue containing only the items that make `cb` return `true`.
     */
    filter(cb: QueueCallback<T, boolean>): Queue<T>;
    /**
     * Returns whether or not at least one item of the queue makes `cb` return `true`.
     *
     * @param cb The callback function to be executed on every item of the queue.
     * @returns Whether or not at least one item makes `cb` return `true`.
     */
    some(cb: QueueCallback<T, boolean>): boolean;
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
    /**
     * Maps every item of this queue to another one in a new queue, via `cb`.
     *
     * @param cb A callback to be executed for every item in the original queue.
     * @returns A new queue containing the results of calling `cb` for every
     * item in the original one.
     */
    map<R = unknown>(cb: QueueCallback<T, R>): Queue<R>;
    /**
     * Returns `true` if there's no items in the queue, `false` otherwise.
     *
     * @returns Whether or not this queue is empty.
     */
    isEmpty(): boolean;
    /**
     * Returns `true` if `item` is in the queue, `false` otherwise.
     *
     * @returns Whether or not this queue is empty.
     */
    includes(item: T): boolean;
    /**
     * Returns `true` if `item` is in the queue (by deep comparison), `false` otherwise.
     * Deep equality is powered by `@santi100/equal-lib`, as per usual :)
     *
     * @returns Whether or not `item` is in this queue. `item` is deeply compared
     * against each item in order to determine this.
     */
    deepIncludes(item: T): boolean;
    /**
     * Returns `item`'s index in the queue (by deep comparison), or -1 if it's not there.
     * Deep equality is powered by `@santi100/equal-lib`, as per usual :)
     *
     * @returns `item`'s index in the queue (by deep comparison), or -1 if it's not in the queue.
     */
    deepIndexOf(item: T, epsilon?: number): number;
    /**
     * Returns this queue's closure state.
     * @returns Whether or not this queue is closed.
     */
    isClosed(): boolean;
    /**
     * Shallowly looks for `item` in the queue and returns its index, or -1 if it's not there.
     *
     * @returns `item`'s index in the queue by shallow comparison, or -1 if it's not in the queue.
     */
    indexOf(item: T): number;
    /**
     * Shallowly looks for `item`'s last occurrence
     * in the queue and returns its index, or -1 if it's not there.
     *
     * @returns The index of the last occurence of `items` in the queue, or -1 if it's not in the
     * queue.
     */
    lastIndexOf(item: T): number;
    /**
     * Reverses the queue in-place. If you want to create a reversed copy, add `.copy()`
     * before this method.
     *
     * @returns `this` object for chaining.
     */
    reverse(): this;
    /**
     * Returns an array containing all items currently in the queue.
     *
     * @returns An array with all items in the queue.
     */
    toArray(): T[];
    /**
     * Makes a new queue with all items contained in this one.
     *
     * @returns A new queue with all items of this one.
     */
    copy(): Queue<T>;
    /**
     * Returns a JSON representation of this queue.
     * @param beautify Whether or not to add indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     */
    toString(beautify?: boolean): string;
    close(): this;
}
export declare function createQueue<T = unknown>(initialItems?: T[]): Queue<T>;
export default Queue;
