'use strict';

let five = require('johnny-five');
let Goldelox = require('../')(five);
let board = new five.Board({});

function setup(display) {
	console.log('gfxCls');
	display.gfxCls((err) => {
		if (err) {
			console.warn(err);
			return;
		}
		console.log('mediaInit');
		display.mediaInit((err) => {
			if (err) {
				console.warn(err);
				return;
			}
			console.log('mediaVideo');
			display.mediaVideo();
		});
	});
};

board.on('ready', () => {
	let display1 = new Goldelox({
		pins: {
			rx: 4,
			tx: 5
		},
		portId: 0x09,
		repl: false
	});
	let display2 = new Goldelox({
		pins: {
			rx: 6,
			tx: 7
		},
		portId: 0x10,
		repl: false
	});
	setTimeout(() => {
		setup(display1);
		setup(display2);
	}, 3000);
});
