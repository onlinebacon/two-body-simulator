import * as Simulation from './simulation.js';

const canvasRatio = 4/3;

const resizeCanvas = (canvas) => {
	let e = canvas;
	while (!e.matches('.block')) {
		e = e.parentElement;
	}
	let width = Number(window.getComputedStyle(e).width.replace('px', ''));
	let height = Math.round(width/canvasRatio);
	canvas.width = width;
	canvas.height = height;
};

window.addEventListener('load', () => {
	const simCanvas = document.querySelector('#simulation');
	resizeCanvas(simCanvas);
	Simulation.setCanvas(simCanvas);
	Simulation.start();

	const plotCanvas = document.querySelector('#plot');
	resizeCanvas(plotCanvas);
});
