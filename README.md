# PromiseQueue
Javascript Promise FIFO Sequential Queue

PromiseQueue allows a sequence of Promise-based functions to be queued (chained) in order to be run sequentially.  Each queued function runs after the previous one completes, regardless of whether the previous one resolved or rejected.

Additional functions can be added to the queue while the queue is in process of running.

The queue can be stopped before completing all queued elements.

# Usage

[constructor] - initialize empty queue

add(function_to_execute, run_now) - Add an asynchronous function to the queue.  (set run_now to true to start running the queue immediately upon adding this function.  Additional functions can be added even after the queue is running.

run() - Run the queue (if not already running)

set PromiseQueue.stop = true to stop the queue after the currently executing item is completed.

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
			// Wrap the queued function in an anonymous function so that it can be executed by the queue runner.
			// Return a Promise from the wrapped function.
			// Return a value to the calling function by calling resolve([return_value]) within the anonymous function.
			return this.queue.add(() => {
				return new Promise((resolve, reject) => {
					// Here we do some async stuff:
					setTimeout(() => { 
						resolve(input * input); 
						// If error, call reject() here
					}, 2000);
					
				});
			});
		}

		halfIt(input)
		// Another demo async function: divide a number by two asynchronously
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
	.then((result) => console.log("The result of squareIt(47) is", result))
	.catch((err) => console.log("Error running squareIt:", err));

	f.halfIt(100)
	.then((result) => console.log("The result of halfIt(100) is", result))
	.catch((err) => console.log("Error running halfIt:", err));

	// At this point the functions are queued and ready to execute.

	// Run the queue sequentially:
	f.queue.run();
	// Each function will execute in sequence, and when complete, its Promise will resolve, returning the result to the .then() function above.
