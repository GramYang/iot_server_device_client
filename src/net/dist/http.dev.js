"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var httpRequest = _axios["default"].create();

httpRequest.defaults.baseURL = "http://127.0.0.1:8108";
httpRequest.defaults.headers.post["Content-Type"] = "application/json";
var _default = httpRequest;
exports["default"] = _default;