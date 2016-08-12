'use strict';

let five = require('johnny-five');
let Goldelox = require('../')(five);
let board = new five.Board({});

board.on('ready', () => {
	let display = new Goldelox({
		pins: {
			rx: 11,
			tx: 10
		},
		repl: false
	});
	setTimeout(() => {
		display.gfxCls();
	}, 1000);
	setTimeout(() => {
		display.mediaInit();
	}, 2000);
	setTimeout(() => {
		display.mediaVideo(0, 0);
	}, 3000);
});
