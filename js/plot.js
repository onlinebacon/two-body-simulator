const TAU = Math.PI*2;

let canvas = true ? null : document.createElement('canvas');
let ctx = true ? null : new CanvasRenderingContext2D();
let recording = [];

export const setRecording = (array) => {
	recording = array;
};

export const render = () => {
	const { width, height } = canvas;
	ctx.clearRect(0, 0, width, height);
	if (recording.length < 2) return;
	const t0 = recording[0].t;
	const t1 = recording.at(-1).t;
	const dt = t1 - t0;
	ctx.strokeStyle = '#07f';
	ctx.beginPath();
	for (let i=0; i<recording.length; ++i) {
		const { t, angle } = recording[i];
		const x = t/dt*width;
		const y = (1 - angle/TAU)*height;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
};

export const setCanvas = (dom) => {
	canvas = dom;
	ctx = canvas.getContext('2d');
};
