# PromiseQueue
Javascript Promise FIFO Sequential Queue

PromiseQueue allows a sequence of Promises to be queued together, running sequentially.
Additional Promises can be queued while the existing queue are running.

# Usage

[constructor] - initialize empty queue

add(function_to_execute) - Add an asynchronous function to the queue.

run() - Run the queue (if not already running)


Example:

	// Load the PromiseQueue class:
	const PromiseQueue = require("./PromiseQueue.js");

	// A dummy class to simulate asynchronous queue-able functions
	class Funcs
	{
		constructor()
		{
			// Cretate a new queue:
			this.queue = new PromiseQueue();
		}

		
		squareIt(input)
		// An asynchronous function to calculate the square of a number.
		{
			// queue.add() returns a promise which can be watched by the calling code.
			// Wrap the queued function as an anonymous function so that it can be executed by the queue runner.
			// Return a promise from the wrapped function.
			// Return a value to the calling function by calling resolve([return_value]) within the anonymous function.
			return this.queue.add(() => {
				return new Promise((resolve, reject) => {
					// Here we do some async stuff:
					setTimeout(() => { resolve(input * input); }, 2000);
					// If error, call reject() here
				});
			});
		}

		halfIt(input)
		// Another demo async function
		{
			return this.queue.add(() => {
				return new Promise((resolve, reject) => {
					// Here we do some async stuff:
					setTimeout(() => { resolve(input / 2); }, 3000);
				});
			});
		}
	};


	let f = new Funcs();

	// Queue some functions:
	f.squareIt(47)
	.then((result) => l("The result of squareIt(47) is", result))
	.catch((err) => l("Error running squareIt:", err));

	f.halfIt(100)
	.then((result) => l("The result of halfIt(100) is", result))
	.catch((err) => l("Error running halfIt:", err));

	// Run the queue sequentially:
	f.queue.run();


