'use strict';

let five = require('johnny-five');
let Goldelox = require('../')(five);
let board = new five.Board({});

board.on('ready', () => {
	let display = new Goldelox({
		pins: {
			rx: 2,
			tx: 10
		},
		repl: false
	});
	setTimeout(() => {
		console.log('gfxCls');
		display.gfxCls();
	}, 3000);
	setTimeout(() => {
		console.log('mediaInit');
		display.mediaInit();
	}, 6000);
	setTimeout(() => {
		console.log('mediaVideo');
		display.mediaVideo(0, 0);
	}, 9000);
});
