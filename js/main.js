import * as Simulation from './simulation.js';

const canvasRatio = 16/9;

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
	const info = document.querySelector('#info');
	resizeCanvas(simCanvas);
	Simulation.setCanvas(simCanvas);
	Simulation.setInfo(info);
	Simulation.start();

	// const plotCanvas = document.querySelector('#plot');
	// resizeCanvas(plotCanvas);
});
