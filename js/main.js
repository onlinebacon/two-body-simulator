import * as Simulation from './simulation.js';
import * as Plot from './plot.js';

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

const resetSim = () => {
	const data = {};
	document.querySelectorAll('.text-field .val').forEach(span => {
		const name = span.getAttribute('name');
		data[name] = Number(span.innerText);
	});
	Simulation.reset(data);
};

window.addEventListener('load', () => {
	const simCanvas = document.querySelector('#simulation');
	const info = document.querySelector('#info');
	resizeCanvas(simCanvas);
	Simulation.setCanvas(simCanvas);
	Simulation.setInfo(info);
	
	const plotCanvas = document.querySelector('#plot');
	resizeCanvas(plotCanvas);
	Plot.setCanvas(plotCanvas);

	resetSim();
	Simulation.start();

	document.querySelector('#restart').addEventListener('click', () => {
		resetSim();
		Simulation.start();
	});
});
