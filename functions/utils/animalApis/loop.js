'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loopFn = exports.loopAction = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createAction = require('@f/create-action');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var _marked = [loopFn].map(_regenerator2.default.mark);

var loopAction = (0, _createAction2.default)('LOOP');

function loopFn(max, fn) {
	var i;
	return _regenerator2.default.wrap(function loopFn$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					i = 0;

				case 1:
					if (!(i < max)) {
						_context.next = 6;
						break;
					}

					return _context.delegateYield(fn(), 't0', 3);

				case 3:
					i++;
					_context.next = 1;
					break;

				case 6:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

exports.loopAction = loopAction;
exports.loopFn = loopFn;