Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _googleMaterialColorPaletteJson = require('google-material-color-palette-json');

var _googleMaterialColorPaletteJson2 = _interopRequireDefault(_googleMaterialColorPaletteJson);

var _reduce = require('@f/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _drop = require('lodash/drop');

var _drop2 = _interopRequireDefault(_drop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _drop2.default)((0, _reduce2.default)(function (arr, value, key) {
  return [].concat((0, _toConsumableArray3.default)(arr), [{
    name: key,
    value: value['shade_500'] || value
  }]);
}, [], _googleMaterialColorPaletteJson2.default));
