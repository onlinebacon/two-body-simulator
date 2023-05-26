import { ExecLoop, FrameLoop } from './loops.js';

let canvas = true ? null : document.createElement('canvas');
let ctx = true ? null : new CanvasRenderingContext2D();

class Body {
	constructor(...args) {
		this.set(...args);
	}
	set(m = 1, x = 0, y = 0, vx = 0, vy = 0) {
		this.m = m;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	}
}

const recording = [];
const nIt = 2e3;
const r1 = 2;
const r2 = 4;
const b1 = new Body(1, 1, 0, 0, 0);
const b2 = new Body(1, 0, 0, 0, 0);

let m1 = 1;
let m2 = 1e3;
let v0 = 2e-4;
let d0 = 1;
let dt = 1e-3;
let maxT = 0;
let itCount = 0;
let nextRecT = 0;

const calcInitialVelocities = (m1, m2, v0) => {
	const v2 = -v0*m1/(m1 + m2);
	const v1 = v0 + v2;
	return [ v1, v2 ];
};

const renderBody = (x, y, rad) => {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, Math.PI*2);
	ctx.fill();
};

const render = () => {
	const { width, height } = canvas;
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = '#fff';
	const rad = 5;
	const s = Math.min(width, height)*0.4/d0;
	const cx = width*0.5;
	const cy = height*0.5;
	renderBody(cx + b1.x*s, cy - b1.y*s, r1);
	renderBody(cx + b2.x*s, cy - b2.y*s, r2);
};

const checkRecord = () => {
	
};

const iterate = () => {
	for (let i=0; i<nIt; ++i) {

	}
};

const renderLoop = new FrameLoop(render);

export const setCanvas = (dom) => {
	canvas = dom;
	ctx = canvas.getContext('2d');
};

export const reset = (data) => {
	recording.length = 0;
	m1 = data.m1 ?? m1;
	m2 = data.m2 ?? m2;
	v0 = data.v0 ?? v0;
	d0 = data.d0 ?? d0;
	dt = data.dt ?? dt;
	maxT = data.maxT ?? maxT;
	itCount = 0;
	nextRecT = 0;
	const [ v1, v2 ] = calcInitialVelocities(m1, m2, v0);
	b1.set(m1, d0, 0, 0, v1);
	b2.set(m2, 0, 0, 0, v2);
};

export const start = () => {
	renderLoop.start();
};
