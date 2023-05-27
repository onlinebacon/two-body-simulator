const TAU = Math.PI*2;

let canvas = true ? null : document.createElement('canvas');
let ctx = true ? null : new CanvasRenderingContext2D();
let recording = [];

let mx = null;
let my = null;

const calcDist = (ax, ay, bx, by) => {
	const dx = bx - ax;
	const dy = by - ay;
	return Math.sqrt(dx*dx + dy*dy);
};

const locateMousePoint = () => {
	if (mx == null) {
		return;
	}
	const { width, height } = canvas;
	const n = recording.length;
	if (n < 2) {
		return null;
	}
	const i = Math.round(mx/width*(n - 1));
	let closest = null;
	let d = Infinity;
	for (let j=-2; j<=2; ++j) {
		const point = recording[i + j];
		if (point == null) continue;
		const [ x, y ] = projectPoint(point);
		const dst = calcDist(x, y, mx, my);
		if (dst < d) {
			closest = point;
			d = dst;
		}
	}
	return closest;
};

const handleMouse = (x, y) => {
	mx = x;
	my = y;
	render();
};

const projectPoint = (point) => {
	const { width, height } = canvas;
	const { t, angle } = point;
	const t0 = recording[0].t;
	const t1 = recording.at(-1).t;
	const dt = t1 - t0;
	const x = t/dt*width;
	const y = (1 - angle/360)*height;
	return [ x, y ];
};

const renderPoint = (point) => {
	const [ x, y ] = projectPoint(point);
	const { t, angle } = point;
	let tx = x;
	let ty = y;
	const nx = x/canvas.width;
	const ny = y/canvas.height;
	const space = 5;
	if (nx < 0.5) {
		tx += space;
		ctx.textAlign = 'left';
	} else {
		tx -= space;
		ctx.textAlign = 'right';
	}
	if (ny < 0.5) {
		ty += space;
		ctx.textBaseline = 'top';
	} else {
		ty -= space;
		ctx.textBaseline = 'bottom';
	}
	ctx.fillStyle = '#fff';
	ctx.font = '14px arial';
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, TAU);
	ctx.fill();
	const text = '(' + [ t, angle ].map(val => val.toPrecision(6)*1).join(', ') + ')';
	ctx.fillText(text, tx, ty);
};

export const setRecording = (array) => {
	recording = array;
};

export const render = () => {
	const { width, height } = canvas;
	ctx.clearRect(0, 0, width, height);
	if (recording.length < 2) return;
	ctx.strokeStyle = '#07f';
	ctx.beginPath();
	for (let i=0; i<recording.length; ++i) {
		const [ x, y ] = projectPoint(recording[i]);
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
	const point = locateMousePoint();
	if (point != null) {
		renderPoint(point);
	}
};

export const setCanvas = (dom) => {
	canvas = dom;
	ctx = canvas.getContext('2d');
};

export const bindMouse = () => {
	canvas.addEventListener('mousemove', e => handleMouse(e.offsetX, e.offsetY));
};
