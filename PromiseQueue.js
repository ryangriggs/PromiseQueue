// PromiseQueue.js
// By Ryan Griggs (c) 2020 - MIT License
// github.com/ryangriggs/PromiseQueue

module.exports = class	
{
	constructor()
	{
		this.queue = [];		// Queue of promises
		this.running = false;	// Is queue running
		this.stop = false;		// Stop a running queue
	}

	add(func, run = false)
	// Add a queue-able function to the queue
	// 'func' = an anonymous-wrapped function which returns a Promise.
	// 'run' = if true, start running queue immediately.
	// Returns a Promise to the queued function which, when resolves, provides the function's return value.
	{
		var p = new Promise((resolve, reject) => {
			this.queue.push({func, resolve, reject });
		});

		if (run && !this.running)
		{
			this.run();
		}

		return p;
	}


	async run()
	// Run queue if not running
	{
		if (this.running) { return; }

		// Execute until no more items in queue
		while (this.queue.length > 0 && this.stop == false)
		{
			// Get the function to run.
			let action = this.queue.shift();
			try
			{
				let result = await action.func();
				action.resolve(result);
			}
			catch(e)
			{
				action.reject(e);
			}
		}
		this.running = false;
		this.stop = false;
	}
};
