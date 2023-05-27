describe('Queue', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { Queue, createQueue } = require('..');
	describe('enqueue', () => {
		test('should add items to the queue', () => {
			const queue = new Queue([1, 2, 3]);
			queue.enqueue(4, 5, 6);

			expect(queue.peek(6)).toEqual([1, 2, 3, 4, 5, 6]);
		});

		test('should throw an error if the queue is closed', () => {
			const queue = new Queue([1, 2]).close();

			expect(() => queue.enqueue(3)).toThrow();
		});
	});
	describe('map', () => {
		test('should map correctly', () => {
			const queue = new Queue([1, 2, 3, 4, 5]);
			const mapper = jest.fn((n) => 2 * n);
			const mappedQueue = queue.map(mapper);

			expect(mapper).toHaveBeenCalled();
			expect(mapper).toHaveBeenCalledTimes(queue.getLength());
			expect(mappedQueue.toArray()).toEqual([2, 4, 6, 8, 10]);
		});
		test('error handling', () => {
			const queue = new Queue();
			expect(() => queue.map()).toThrow(TypeError);
			expect(() => queue.map(1)).toThrow(TypeError);
			expect(() => queue.map('not a function')).toThrow(TypeError);
			expect(() => queue.map(true)).toThrow(TypeError);
			expect(() => queue.map(false)).toThrow(TypeError);
			expect(() => queue.map(null)).toThrow(TypeError);
			expect(() => queue.map(new Date())).toThrow(TypeError);
			expect(() => queue.map(Symbol('water'))).toThrow(TypeError);
			expect(() => queue.map([])).toThrow(TypeError);
		});
	});
	describe('reduce', () => {
		test('reduction of number works correctly', () => {
			const queue = new Queue([1, 2, 3, 4, 5]);
			const add = jest.fn((a, b) => a + b);
			const sum = queue.reduce(add);

			expect(add).toHaveBeenCalled();
			expect(add).toHaveBeenCalledTimes(queue.getLength() - 1);
			expect(sum).toBe(15);
		});
		test('error handling', () => {
			const queue = new Queue();
			expect(() => queue.reduce()).toThrow(TypeError);
			expect(() => queue.reduce(1)).toThrow(TypeError);
			expect(() => queue.reduce('not a function')).toThrow(TypeError);
			expect(() => queue.reduce(true)).toThrow(TypeError);
			expect(() => queue.reduce(false)).toThrow(TypeError);
			expect(() => queue.reduce(null)).toThrow(TypeError);
			expect(() => queue.reduce(new Date())).toThrow(TypeError);
			expect(() => queue.reduce(Symbol('water'))).toThrow(TypeError);
			expect(() => queue.reduce([])).toThrow(TypeError);
			expect(() => queue.reduce((a, b) => a + b)).toThrow(
				/Reduce of empty queue with no initial value(!)?/
			);
		});
	});
	describe('some', () => {
		test('some works as expected', () => {
			const isOdd = jest.fn((n) => n % 2 !== 0);
			const isEven = jest.fn((n) => n % 2 === 0);
			const queue = new Queue([2, 4, 6, 8]);
			const containsOdd = queue.some(isOdd);
			const containsEven = queue.some(isEven);

			expect(containsOdd).toBeFalsy();
			expect(containsEven).toBeTruthy();
			expect(isEven).toHaveBeenCalled();
			expect(isEven).toHaveBeenCalledTimes(1);
			expect(isOdd).toHaveBeenCalled();
			expect(isOdd).toHaveBeenCalledTimes(queue.getLength());
		});
		test('error handling', () => {
			const queue = new Queue([1, 2, 3, 4]);
			expect(() => queue.some()).toThrow(TypeError);
			expect(() => queue.some(1)).toThrow(TypeError);
			expect(() => queue.some('not a function')).toThrow(TypeError);
			expect(() => queue.some(true)).toThrow(TypeError);
			expect(() => queue.some(false)).toThrow(TypeError);
			expect(() => queue.some(null)).toThrow(TypeError);
			expect(() => queue.some(new Date())).toThrow(TypeError);
			expect(() => queue.some(Symbol('water'))).toThrow(TypeError);
			expect(() => queue.some([])).toThrow(TypeError);

			expect(() => queue.some(() => void 0)).toThrow(TypeError);
			expect(() => queue.some(() => 30)).toThrow(TypeError);
			expect(() => queue.some(() => 'not a boolean')).toThrow(TypeError);
			expect(() => queue.some(() => null)).toThrow(TypeError);
			expect(() => queue.some(() => new Date())).toThrow(TypeError);
			expect(() => queue.some(() => Symbol('water'))).toThrow(TypeError);
			expect(() => queue.some(() => [])).toThrow(TypeError);
		});
	});

	describe('dequeue', () => {
		test('should remove and return the first item in the queue', () => {
			const queue = new Queue([1, 2, 3]);

			expect(queue.dequeue()).toEqual(1);
			expect(queue.peek()).toEqual(2);
		});

		test('should return undefined if the queue is empty', () => {
			const queue = new Queue();

			expect(queue.dequeue()).toBeUndefined();
		});

		test('should throw an error if the queue is closed', () => {
			const queue = new Queue([1, 2]).close();

			expect(() => queue.dequeue()).toThrow();
		});
	});
	describe('filter', () => {
		test('should filter out numbers', () => {
			const isEven = jest.fn((n) => n % 2 === 0);
			const isOdd = jest.fn((n) => n % 2 !== 0);
			const queue = new Queue([1, 2, 3, 4, 5, 6]);
			const evensQueue = queue.filter(isEven);
			const oddsQueue = queue.filter(isOdd);

			expect(evensQueue.toArray()).toEqual([2, 4, 6]);
			expect(oddsQueue.toArray()).toEqual([1, 3, 5]);
			expect(isEven).toHaveBeenCalled();
			expect(isEven).toHaveBeenCalledTimes(queue.getLength());
			expect(isOdd).toHaveBeenCalled();
			expect(isOdd).toHaveBeenCalledTimes(queue.getLength());
		});
		test('error handling', () => {
			const queue = new Queue([1, 2, 3, 4]);
			expect(() => queue.filter()).toThrow(TypeError);
			expect(() => queue.filter(1)).toThrow(TypeError);
			expect(() => queue.filter('not a function')).toThrow(TypeError);
			expect(() => queue.filter(true)).toThrow(TypeError);
			expect(() => queue.filter(false)).toThrow(TypeError);
			expect(() => queue.filter(null)).toThrow(TypeError);
			expect(() => queue.filter(new Date())).toThrow(TypeError);
			expect(() => queue.filter(Symbol('water'))).toThrow(TypeError);
			expect(() => queue.filter([])).toThrow(TypeError);

			expect(() => queue.filter(() => void 0)).toThrow(TypeError);
			expect(() => queue.filter(() => 30)).toThrow(TypeError);
			expect(() => queue.filter(() => 'not a boolean')).toThrow(TypeError);
			expect(() => queue.filter(() => null)).toThrow(TypeError);
			expect(() => queue.filter(() => new Date())).toThrow(TypeError);
			expect(() => queue.filter(() => Symbol('water'))).toThrow(TypeError);
			expect(() => queue.filter(() => [])).toThrow(TypeError);
		});
	});
	describe('toString', () => {
		test('serialization and deserialization work as expected', () => {
			const queue = new Queue([1, 2, 3, 4]);
			const json = queue.toString();
			const reconstructedQueue = new Queue(json);

			expect(queue.toArray()).toEqual(reconstructedQueue.toArray());
		});
	});
	describe('isEmpty', () => {
		test('tests the result is valid', () => {
			const emptyQueue = new Queue();
			const populatedQueue = new Queue([1, 2, 3, 4]);

			expect(emptyQueue.isEmpty()).toBeTruthy();
			expect(populatedQueue.isEmpty()).toBeFalsy();
		});
	});
	describe('includes', () => {
		const queue = new Queue([1, 2, 3, 4, { foo: 'bar' }]);
		test('tests it detects items', () => {
			expect(queue.includes(2)).toBeTruthy();
		});
		test("tests it doesn't detect items", () => {
			expect(queue.includes(5)).toBeFalsy();
		});
		test('tests it doesn\'t support deep equality', () => {
			expect(queue.includes({ foo: 'bar' })).toBeFalsy();
		});
	});
	describe('deepIncludes', () => {
		const queue = new Queue([1, 2, 3, 4, { foo: 'bar' }]);
		test('tests it detects items', () => {
			expect(queue.deepIncludes(2)).toBeTruthy();
		});
		test("tests it doesn't detect items", () => {
			expect(queue.deepIncludes(5)).toBeFalsy();
		});
		test('tests it supports deep equality', () => {
			expect(queue.deepIncludes({ foo: 'bar' })).toBeTruthy();
		});
	});
	describe('clear', () => {
		test('should remove all items from the queue', () => {
			const queue = new Queue([1, 2, 3]);

			expect(queue.clear().peek()).toEqual(undefined);
		});

		test('should throw an error if the queue is closed', () => {
			const queue = new Queue([1, 2]).close();

			expect(() => queue.clear()).toThrow();
		});
	});

	describe('peek', () => {
		test('should return the last item in the queue if no argument is passed', () => {
			const queue = new Queue([1, 2, 3]);

			expect(queue.peek()).toEqual(1);
		});

		test('should return the last n items in the queue if n is passed as an argument', () => {
			const queue = new Queue([1, 2, 3, 4, 5]);

			expect(queue.peek(3)).toEqual([3, 4, 5]);
		});
	});

	describe('getLength', () => {
		test('should return the length of the queue', () => {
			const queue = new Queue([1, 2, 3]);

			expect(queue.getLength()).toEqual(3);
		});
	});

	describe('forEach', () => {
		test('should execute a callback for each item in the queue', () => {
			const queue = new Queue([1, 2, 3]);
			const spy = jest.fn();

			queue.forEach(spy);

			expect(spy).toHaveBeenCalledTimes(3);
			expect(spy).toHaveBeenCalledWith(1, 0, queue);
			expect(spy).toHaveBeenCalledWith(2, 1, queue);
			expect(spy).toHaveBeenCalledWith(3, 2, queue);
		});

		test('should throw an error if the callback is not a function', () => {
			const queue = new Queue([1, 2]);

			expect(() => queue.forEach('not a function')).toThrow(
				/"cb" must be of type "function"/
			);
		});
	});
	describe('createQueue', () => {
		test("the type of createQueue's output is correct", () => {
			const queue = createQueue();
			expect(queue.constructor).toBe(Queue);
		});
	});
});
