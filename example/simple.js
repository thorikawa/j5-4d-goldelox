'use strict';

let five = require('johnny-five');
let Goldelox = require('../')(five);
let board = new five.Board({});

board.on('ready', () => {
	let display = new Goldelox({
		pins: {
			rx: 4,
			tx: 5
		},
		repl: false
	});
	setTimeout(() => {
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
	}, 3000);
});
