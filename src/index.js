'use strict';

const Emitter = require('events').EventEmitter;
const util = require('util');
const priv = new Map();

export default function(five) {
	let Fn = five.Fn;
	let Animation = five.Animation;

	class Goldelox extends Emitter {
		constructor(opts) {
			super();
			if (!(this instanceof Goldelox)) {
				return new Goldelox(opts);
			}

			// call Board.Compnent's constructor for 'this'
			five.Board.Component.call(
				this, opts = five.Board.Options(opts)
			);

			var state = {
				portId: opts.portId || this.io.SERIAL_PORT_IDs.DEFAULT,
				baud: opts.baud || 9600
			};

			priv.set(this, state);

			let rx = 0, tx = 1;
			if (this.pins) {
				if (Number.isInteger(this.pins.rx)) rx = this.pins.rx;
				if (Number.isInteger(this.pins.tx)) tx = this.pins.tx;
			}

			let serialConfig = {
				portId: state.portId, 
				baud: state.baud,
				rxPin: rx,
				txPin: tx,
			};

			this.io.serialConfig(serialConfig);

			process.nextTick(() => {
				this.io.serialFlush(state.portId);
				this.io.serialRead(state.portId, (bytes) => {
					// read bytes and determine event types to emit
					// store received things in state object, use
					// for emitting events 
					// TODO
					// console.log(this.byteRead, bytes, this.callback)
					let _read = this.byteRead;
					this.byteRead += bytes.length;
					this.bytesToRead -= bytes.length;

					if (_read === 0) {
						if (bytes[0] === 6) {
							if (typeof(this.callback) === 'function') {
								this.callback(null, bytes);
							}
						} else {
							if (typeof(this.callback) === 'function') {
								this.callback(new Error('error occured:' + bytes));
							}
						}
					}
				});
			});

			Object.defineProperties(this, {
				// Define any accessors here
			});
		}

		serialWrite(bytes) {
			// console.log(bytes);
			let state = priv.get(this);
			this.io.serialWrite(state.portId, bytes);
		}

		gfxCls(callback) {
			let buf = new Buffer(2);
			buf[0] = 0xFF;
			buf[1] = 0xD7;
			this.getAck(callback);
			this.serialWrite(buf);
		}

		mediaInit(callback) {
			let buf = new Buffer(2);
			buf[0] = 0xFF;
			buf[1] = 0xB1;
			this.getAckResp(callback);
			this.serialWrite(buf);
		}

		mediaSetAdd(hword, lword, callback) {
			let buf = new Buffer(6);
			buf[0] = 0xFF;
			buf[1] = 0xB9;
			buf[2] = (hword >> 8) & 0xff;
			buf[3] = (hword) & 0xff;
			buf[4] = (lword >> 8) & 0xff;
			buf[5] = (lword) & 0xff;
			this.getAck(callback);
			this.serialWrite(buf);
		}

		mediaVideo(x, y, callback) {
			let buf = new Buffer(6);
			buf[0] = 0xFF;
			buf[1] = 0xBB;
			buf[2] = (x >> 8) & 0xff;
			buf[3] = (x) & 0xff;
			buf[4] = (y >> 8) & 0xff;
			buf[5] = (y) & 0xff;
			this.getAck(callback);
			this.serialWrite(buf);
		}

		mediaImage(x, y, callback) {
			let buf = new Buffer(6);
			buf[0] = 0xFF;
			buf[1] = 0xB3;
			buf[2] = (x >> 8) & 0xff;
			buf[3] = (x) & 0xff;
			buf[4] = (y >> 8) & 0xff;
			buf[5] = (y) & 0xff;
			this.getAck(callback);
			this.serialWrite(buf);
		}

		getAck(callback) {
			this.byteRead = 0;
			this.bytesToRead = 1;
			this.callback = callback;
		}

		getAckResp(callback) {
			this.byteRead = 0;
			this.bytesToRead = 3;
			this.callback = callback;
		}
	}

	return Goldelox;
};

/**
 *  To use the plugin in a program:
 *
 *  var five = require("johnny-five");
 *  var Component = require("component")(five);
 *
 *
 */
