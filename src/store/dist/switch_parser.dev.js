"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var SwitchParser = {};

SwitchParser.stateParser = function (state) {
  switch (state) {
    case 0:
      return "本地关闸";

    case 1:
      return "本地开闸";

    case 2:
      return "按键关闸";

    case 3:
      return "按键开闸";

    case 4:
      return "远程关闸";

    case 5:
      return "远程开闸";

    case 6:
      return "故障关闸";

    case 7:
      return "故障自动恢复合闸";

    case 8:
      return "定时关闸";

    case 9:
      return "定时开闸";

    case 10:
      return "短路分闸";

    case 11:
      return "漏电分闸";

    case 12:
      return "漏电测试合闸";

    default:
      return "未知状态";
  }
};

SwitchParser.isSwitchOpen = function (state) {
  return state != 0 && state != 2 && state != 4 && state != 6 && state != 8 && state != 10 && state != 11;
};

SwitchParser.modeParser = function (mode) {
  switch (mode) {
    case 0:
      return "正常未锁定";

    case 1:
      return "本地锁定";

    case 2:
      return "远程锁定";

    case 4:
      return "故障锁定";

    case 8:
      return "离线";

    default:
      return "未知模式";
  }
};

SwitchParser.isSwitchLocked = function (mode) {
  return mode == 1 || mode == 2 || mode == 4;
};

SwitchParser.valueChecker = function (v, bit) {
  return (v >> bit & 1) == 1;
};

SwitchParser.hardFaultParser = function (hardFault) {
  var msgs = [];
  var totalMessage = '|';

  if ((hardFault & 1) == 1) {
    msgs.push("计量故障");
  }

  if ((hardFault >> 1 & 1) == 1) {
    msgs.push("漏电故障");
  }

  if ((hardFault >> 2 & 1) == 1) {
    msgs.push("传动故障");
  }

  if ((hardFault >> 3 & 1) == 1) {
    msgs.push("合闸状态限位");
  }

  if ((hardFault >> 4 & 1) == 1) {
    msgs.push("合闸停止限位");
  }

  if ((hardFault >> 5 & 1) == 1) {
    msgs.push("分闸状态限位");
  }

  if ((hardFault >> 6 & 1) == 1) {
    msgs.push("分闸停止限位");
  }

  for (var _i = 0, _msgs = msgs; _i < _msgs.length; _i++) {
    var x = _msgs[_i];
    totalMessage += x;
    totalMessage += '|';
  }

  return totalMessage;
};

SwitchParser.alarmStateParser = function (alarm) {
  var msgs = [];
  var totalMessage = '|';

  if (SwitchParser.valueChecker(alarm, 0)) {
    msgs.push("过流");
  }

  if (SwitchParser.valueChecker(alarm, 1)) {
    msgs.push("过压");
  }

  if (SwitchParser.valueChecker(alarm, 2)) {
    msgs.push("欠压");
  }

  if (SwitchParser.valueChecker(alarm, 4)) {
    msgs.push("过载");
  }

  if (SwitchParser.valueChecker(alarm, 5)) {
    msgs.push("电量");
  }

  if (SwitchParser.valueChecker(alarm, 6)) {
    msgs.push("过温");
  }

  if (SwitchParser.valueChecker(alarm, 7)) {
    msgs.push("电弧");
  }

  for (var _i2 = 0, _msgs2 = msgs; _i2 < _msgs2.length; _i2++) {
    var x = _msgs2[_i2];
    totalMessage += x;
    totalMessage += '|';
  }

  return totalMessage;
};

SwitchParser.alarmEnableParser = function (alarm) {
  var msgs = [];
  var totalMessage = '|';

  if (SwitchParser.valueChecker(alarm, 0)) {
    msgs.push("过流");
  }

  if (SwitchParser.valueChecker(alarm, 1)) {
    msgs.push("过压");
  }

  if (SwitchParser.valueChecker(alarm, 2)) {
    msgs.push("欠压");
  }

  if (SwitchParser.valueChecker(alarm, 4)) {
    msgs.push("过载");
  }

  if (SwitchParser.valueChecker(alarm, 5)) {
    msgs.push("电量");
  }

  if (SwitchParser.valueChecker(alarm, 6)) {
    msgs.push("过温");
  }

  for (var _i3 = 0, _msgs3 = msgs; _i3 < _msgs3.length; _i3++) {
    var x = _msgs3[_i3];
    totalMessage += x;
    totalMessage += '|';
  }

  return totalMessage;
};

SwitchParser.errorStateParser = function (error) {
  var msgs = [];
  var totalMessage = '|';

  if (SwitchParser.valueChecker(error, 0)) {
    msgs.push("过流");
  }

  if (SwitchParser.valueChecker(error, 1)) {
    msgs.push("过压");
  }

  if (SwitchParser.valueChecker(error, 2)) {
    msgs.push("欠压");
  }

  if (SwitchParser.valueChecker(error, 4)) {
    msgs.push("过载");
  }

  if (SwitchParser.valueChecker(error, 5)) {
    msgs.push("电量");
  }

  if (SwitchParser.valueChecker(error, 6)) {
    msgs.push("过温");
  }

  if (SwitchParser.valueChecker(error, 8)) {
    msgs.push("短路");
  }

  if (SwitchParser.valueChecker(error, 9)) {
    msgs.push("漏电");
  }

  if (SwitchParser.valueChecker(error, 10)) {
    msgs.push("地线");
  }

  if (SwitchParser.valueChecker(error, 11)) {
    msgs.push("电弧");
  }

  for (var _i4 = 0, _msgs4 = msgs; _i4 < _msgs4.length; _i4++) {
    var x = _msgs4[_i4];
    totalMessage += x;
    totalMessage += '|';
  }

  return totalMessage;
};

SwitchParser.errorEnableParser = function (error) {
  var msgs = [];
  var totalMessage = '|';

  if (SwitchParser.valueChecker(error, 0)) {
    msgs.push("过流");
  }

  if (SwitchParser.valueChecker(error, 1)) {
    msgs.push("过压");
  }

  if (SwitchParser.valueChecker(error, 2)) {
    msgs.push("欠压");
  }

  if (SwitchParser.valueChecker(error, 4)) {
    msgs.push("过载");
  }

  if (SwitchParser.valueChecker(error, 5)) {
    msgs.push("电量");
  }

  if (SwitchParser.valueChecker(error, 6)) {
    msgs.push("过温");
  }

  if (SwitchParser.valueChecker(error, 11)) {
    msgs.push("电弧");
  }

  for (var _i5 = 0, _msgs5 = msgs; _i5 < _msgs5.length; _i5++) {
    var x = _msgs5[_i5];
    totalMessage += x;
    totalMessage += '|';
  }

  return totalMessage;
};

var _default = SwitchParser;
exports["default"] = _default;