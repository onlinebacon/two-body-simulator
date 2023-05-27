import * as Plot from './plot.js';
import * as Log from './log.js';

import { ExecLoop, FrameLoop } from './loops.js';

const { PI, min, max, sqrt, acos } = Math;

let canvas = true ? null : document.createElement('canvas');
let info = true ? null : document.createElement('textarea');
let ctx = true ? null : new CanvasRenderingContext2D();

const recording = [];
const G = 6.6743e-11;
const nIt = 2e3;
const r1 = 2;
const r2 = 4;
const nDataPoints = 1000;

Plot.setRecording(recording);

let m1, m2, v0, d0, dt, maxT;
let mSum, px, py, vx, vy;
let minD, maxD;
let minY, maxY;
let dst, angle;
let itCount, nextRecT, strideRec;

const round = (val) => {
	return Number(val.toPrecision(8));
};

const checkRecording = () => {
	const t = itCount*dt;
	if (t < nextRecT) return;
	recording.push({ t, px, py, angle });
	Log.log(t + ', ' + angle);
	nextRecT = recording.length*strideRec;
};

const renderBody = (x, y, rad) => {
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, PI*2);
	ctx.fill();
};

const updateInfo = () => {
	let text = '';
	text += 'x: ' + px + '\n';
	text += 'y: ' + py + '\n';
	text += 'r: ' + dst + '\n';
	text += 'Min. r: ' + minD + '\n';
	text += 'Max. r: ' + maxD + '\n';
	text += 'Min. y: ' + minY + '\n';
	text += 'Max. y: ' + maxY + '\n';
	text += 'e: ' + (maxD - minD)/(maxD + minD) + '\n';
	text += 'Angle: ' + angle + '\n';
	info.value = text;
};

const render = () => {
	const { width, height } = canvas;
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = '#fff';
	const s = min(width, height)*0.4/d0;
	const cx = width*0.5;
	const cy = height*0.5;
	renderBody(cx, cy, r2);
	renderBody(cx + px*s, cy - py*s, r1);
	updateInfo();
	Plot.render();
};

const updateBodies = () => {
	const dstSqr = px*px + py*py;
	const a = G*mSum/dstSqr;
	dst = sqrt(dstSqr);
	minD = min(minD, dst);
	maxD = max(maxD, dst);
	const s = a/dst*dt;
	vx -= px*s;
	vy -= py*s;
	px += vx*dt;
	py += vy*dt;
	maxY = max(maxY, py);
	minY = min(minY, py);
	const nx = px/dst;
	angle = (py >= 0 ? acos(nx) : PI*2 - acos(nx))/PI*180;
	++ itCount;
};

const iterate = () => {
	if (itCount*dt >= maxT) {
		stop();
		return;
	}
	checkRecording();
	for (let i=0; i<nIt; ++i) {
		updateBodies();
		checkRecording();
		if (itCount*dt >= maxT) {
			stop();
			return;
		}
	}
};

const renderLoop = new FrameLoop(render);
const execLoop = new ExecLoop(iterate);

export const setCanvas = (dom) => {
	canvas = dom;
	ctx = canvas.getContext('2d');
};

export const reset = (data = {}) => {
	Log.clear();
	Log.log('time (sec), angle (deg)');
	recording.length = 0;
	m1 = data.m1 ?? m1;
	m2 = data.m2 ?? m2;
	mSum = m1 + m2;
	v0 = data.v0 ?? v0;
	d0 = data.d0 ?? d0;
	dt = data.dt ?? dt;
	px = d0;
	py = 0;
	vx = 0;
	vy = v0;
	maxT = data.maxT ?? maxT;
	itCount = 0;
	nextRecT = 0;
	minD = maxD = dst = d0;
	minY = maxY = py;
	strideRec = maxT/(nDataPoints - 1);
	angle = 0;
};

export const start = () => {
	renderLoop.start();
	execLoop.start();
};

export const setInfo = (dom) => {
	info = dom;
};

export const stop = () => {
	execLoop.stop();
	renderLoop.stop();
	render();
};

reset();
