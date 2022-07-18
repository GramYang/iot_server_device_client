"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

var _ws_response = _interopRequireDefault(require("./ws_response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = (0, _vuex.createStore)({
  modules: {
    response: _ws_response["default"]
  }
});

exports["default"] = _default;