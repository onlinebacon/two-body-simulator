export class FrameLoop {
	constructor(fn) {
		this.fn = fn;
		this.request = null;
	}
	start() {
		if (this.request !== null) {
			return this;
		}
		const loop = () => {
			this.fn();
			this.request = requestAnimationFrame(loop);
		};
		loop();
		return this;
	}
	stop() {
		if (this.request === null) {
			return this;
		}
		cancelAnimationFrame(this.request);
		this.request = null;
		return this;
	}
}

export class ExecLoop {
	constructor(fn) {
		this.fn = fn;
		this.request = null;
	}
	start() {
		if (this.request !== null) {
			return this;
		}
		this.request = setInterval(this.fn, 0);
		return this;
	}
	stop() {
		if (this.request === null) {
			return this;
		}
		clearInterval(this.request);
		this.request = null;
		return this;
	}
}
