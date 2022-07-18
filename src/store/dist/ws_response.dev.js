"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _elementPlus = require("element-plus");

var _switch_parser = _interopRequireDefault(require("./switch_parser.js"));

var _index = _interopRequireDefault(require("@/router/index.js"));

var _websocket = require("@/net/websocket.js");

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wsResponse = {
  namespaced: true,
  state: function state() {
    return {
      //瞬时数据（不是状态，先不处理）
      DeviceResultMessage: {},
      //发送命令失败响应
      ModbusSingleWriteResult: {},
      //modbus单独写响应
      ResultMessage: {},
      //设备无关操作响应（比如数据库）
      ShutDown: {},
      //关闭连接响应
      ClientHeartBeatResponse: {},
      //心跳响应
      //开关事件
      SwitchEventMap: new Map(),
      //key是主机名称|开关地址，value是SwitchEvent
      //数据库查询
      //历史电量
      DeviceQuantityMap: new Map(),
      //key是主机名称，value是DeviceElectricQuantityResult
      DeviceMap: new Map(),
      //用户关联设备，key是deviceId，value是product
      //设备数据
      HostMap: new Map(),
      //key是主机名称，value是主机值
      SwitchRuntimeMap: new Map(),
      //key是主机名称|开关地址，value是开关实时数据
      SwitchSettingMap: new Map(),
      //key是主机名称|开关地址，value是开关设置数据
      SwitchTimerMap: new Map() //key是主机名称|开关地址|定时器编号，value是开关定时器状态

    };
  },
  mutations: {
    SaveDeviceAllRegister: function SaveDeviceAllRegister(state, o) {
      console.log('收到DeviceAllRegister', o);

      if (state.HostMap.has(o.DeviceId)) {
        var host = state.HostMap.get(o.DeviceId);
        host.DeviceId = o.DeviceId;
        host.SignalIntensity = o.SignalIntensity;
        host.InternetMode = o.InternetMode;
        host.DeviceCount = o.DeviceCount;
        host.UploadInterval = o.UploadInterval;
      } else {
        var _host = new Host();

        _host.DeviceId = o.DeviceId;
        _host.SignalIntensity = o.SignalIntensity;
        _host.InternetMode = o.InternetMode;
        _host.DeviceCount = o.DeviceCount;
        _host.UploadInterval = o.UploadInterval;
        state.HostMap.set(o.DeviceId, _host);
      }
    },
    SaveDeviceAllStateResult: function SaveDeviceAllStateResult(state, o) {
      console.log('收到DeviceAllStateResult', o);

      if (state.HostMap.has(o.DeviceId)) {
        var host = state.HostMap.get(o.DeviceId);
        host.SwitchStates = parseObjectArray(o.List, 'SwitchState');

        for (var i = 0; i < host.SwitchStates.length; i++) {
          var key = o.DeviceId + '|' + (i + 1);

          var status = _switch_parser["default"].stateParser(host.SwitchStates[i]);

          var isOpen = _switch_parser["default"].isSwitchOpen(host.SwitchStates[i]);

          if (state.SwitchEventMap.has(key)) {
            var switchEvent = state.SwitchEventMap.get(key);
            switchEvent.Status = status;
            switchEvent.isOpen = isOpen;
          } else {
            var _switchEvent = new SwitchEvent();

            _switchEvent.Status = status;
            _switchEvent.isOpen = isOpen;
            state.SwitchEventMap.set(key, _switchEvent);
          }
        }

        host.SwitchModes = parseObjectArray(o.List, 'SwitchMode');

        for (var _i = 0; _i < host.SwitchModes.length; _i++) {
          var _key = o.DeviceId + '|' + (_i + 1);

          var mode = _switch_parser["default"].modeParser(host.SwitchModes[_i]);

          var isLock = _switch_parser["default"].isSwitchLocked(host.SwitchModes[_i]);

          if (state.SwitchEventMap.has(_key)) {
            var _switchEvent2 = state.SwitchEventMap.get(_key);

            _switchEvent2.Mode = mode;
            _switchEvent2.isLock = isLock;
          } else {
            var _switchEvent3 = new SwitchEvent();

            _switchEvent3.Mode = mode;
            _switchEvent3.isLock = isLock;
            state.SwitchEventMap.set(_key, _switchEvent3);
          }
        }
      } else {
        var _host2 = new Host();

        _host2.SwitchStates = parseObjectArray(o.List, 'SwitchState');

        for (var _i2 = 0; _i2 < _host2.SwitchStates.length; _i2++) {
          var _key2 = o.DeviceId + '|' + (_i2 + 1);

          var _status = _switch_parser["default"].stateParser(_host2.SwitchStates[_i2]);

          var _isOpen = _switch_parser["default"].isSwitchOpen(_host2.SwitchStates[_i2]);

          if (state.SwitchEventMap.has(_key2)) {
            var _switchEvent4 = state.SwitchEventMap.get(_key2);

            _switchEvent4.Status = _status;
            _switchEvent4.isOpen = _isOpen;
          } else {
            var _switchEvent5 = new SwitchEvent();

            _switchEvent5.Status = _status;
            _switchEvent5.isOpen = _isOpen;
            state.SwitchEventMap.set(_key2, _switchEvent5);
          }
        }

        _host2.SwitchModes = parseObjectArray(o.List, 'SwitchMode');

        for (var _i3 = 0; _i3 < _host2.SwitchModes.length; _i3++) {
          var _key3 = o.DeviceId + '|' + (_i3 + 1);

          var _mode = _switch_parser["default"].modeParser(_host2.SwitchModes[_i3]);

          var _isLock = _switch_parser["default"].isSwitchLocked(_host2.SwitchModes[_i3]);

          if (state.SwitchEventMap.has(_key3)) {
            var _switchEvent6 = state.SwitchEventMap.get(_key3);

            _switchEvent6.Mode = _mode;
            _switchEvent6.isLock = _isLock;
          } else {
            var _switchEvent7 = new SwitchEvent();

            _switchEvent7.Mode = _mode;
            _switchEvent7.isLock = _isLock;
            state.SwitchEventMap.set(_key3, _switchEvent7);
          }
        }

        state.HostMap.set(o.DeviceId, _host2);
      }
    },
    SaveDeviceElectricQuantityResult: function SaveDeviceElectricQuantityResult(state, o) {
      state.DeviceQuantityMap.set(o.DeviceId, o);
    },
    SaveDeviceLoop: function SaveDeviceLoop(state, o) {
      if (state.HostMap.has(o.DeviceId)) {
        var host = state.HostMap.get(o.DeviceId);
        host.PowerPs = parseObjectArray(o.List, 'PowerP');
        host.EnergyPts = parseObjectArray(o.List, 'Energy_pt');
        host.SwitchTypes = parseObjectArray(o.List, 'DeviceType');
      } else {
        var _host3 = new Host();

        _host3.PowerPs = parseObjectArray(o.List, 'PowerP');
        _host3.EnergyPts = parseObjectArray(o.List, 'Energy_pt');
        _host3.SwitchTypes = parseObjectArray(o.List, 'DeviceType');
        state.HostMap.set(o.DeviceId, _host3);
      }
    },
    SaveDeviceResultMessage: function SaveDeviceResultMessage(state, o) {
      state.DeviceResultMessage = o;
      var msg = '设备' + o.DeviceId + ' 操作' + o.IsSuccess + '描述' + o.Message;
      (0, _elementPlus.ElMessage)(msg);
    },
    //这个指令没用上
    // SaveDeviceSnapShoot(state,o){
    // },
    SaveGetDeviceListResult: function SaveGetDeviceListResult(state, o) {
      for (var i = 0; i < o.DeviceIds.length; i++) {
        state.DeviceMap.set(o.DeviceIds.at(i), o.Products.at(i));
      }
    },
    SaveModbusSingleWriteResult: function SaveModbusSingleWriteResult(state, o) {
      state.ModbusSingleWriteResult = o;

      if (o.Ok) {
        var msg = '设备' + o.DeviceId + '开关' + o.Addr + 'modbus单独写成功 ' + '寄存器' + o.RegisterIndex + '新值' + o.NewValue;
        (0, _elementPlus.ElMessage)(msg);
      } else {
        var _msg = '设备' + o.DeviceId + '开关' + o.Addr + 'modbus单独写失败 ' + '原因' + o.ErrorMsg;

        (0, _elementPlus.ElMessage)(_msg);
      }
    },
    SaveResultMessage: function SaveResultMessage(state, o) {
      state.ResultMessage = o;
      var msg = '服务器操作' + o.IsSuccess + '描述' + o.Message;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveShutDown: function SaveShutDown(state, o) {
      _jsCookie["default"].remove('name');

      _jsCookie["default"].remove('token');

      (0, _websocket.websocketClose)(); //重置store

      state.DeviceResultMessage = {};
      state.ModbusSingleWriteResult = {};
      state.ResultMessage = {};
      state.ShutDown = {};
      state.ClientHeartBeatResponse = {};
      state.SwitchEventMap = new Map();
      state.DeviceQuantityMap = new Map();
      state.DeviceMap = new Map();
      state.HostMap = new Map();
      state.SwitchRuntimeMap = new Map();
      state.SwitchSettingMap = new Map();
      state.SwitchTimerMap = new Map(); //跳转路由

      _index["default"].push({
        name: 'Login'
      });

      state.ShutDown = o;
      var msg = '连接关闭' + o.Code + '描述' + o.Message;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveSwitchElectricLeakageTestEvent: function SaveSwitchElectricLeakageTestEvent(state, o) {
      var key = o.DeviceId + '|' + o.Addr;

      if (state.SwitchEventMap.has(key)) {
        var switchEvent = state.SwitchEventMap.get(key);
        switchEvent.ElectricLeakageTestStatus = o.Status;
      } else {
        var _switchEvent8 = new SwitchEvent();

        _switchEvent8.ElectricLeakageTestStatus = o.Status;
        state.SwitchEventMap.set(key, _switchEvent8);
      }

      var msg = '设备' + o.DeviceId + '开关' + o.Addr + '漏电检测事件' + o.Status;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveSwitchFaultEvent: function SaveSwitchFaultEvent(state, o) {
      var key = o.DeviceId + '|' + o.Addr;

      var events = _switch_parser["default"].errorStateParser(o.FaultEvents);

      if (state.SwitchEventMap.has(key)) {
        var switchEvent = state.SwitchEventMap.get(key);
        switchEvent.FaultEvents = events;
        switchEvent.FaultEventData = o.Data;
      } else {
        var _switchEvent9 = new SwitchEvent();

        _switchEvent9.FaultEvents = events;
        _switchEvent9.FaultEventData = o.Data;
        state.SwitchEventMap.set(key, _switchEvent9);
      }

      var msg = '设备' + o.DeviceId + '开关' + o.Addr + '开关故障' + events + '数据' + o.Data;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveSwitchHardwareFaultEvent: function SaveSwitchHardwareFaultEvent(state, o) {
      var key = o.DeviceId + '|' + o.Addr;

      var events = _switch_parser["default"].hardFaultParser(o.HardwareEvents);

      if (state.SwitchEventMap.has(key)) {
        var switchEvent = state.SwitchEventMap.get(key);
        switchEvent.HardwareEvents = events;
      } else {
        var _switchEvent10 = new SwitchEvent();

        _switchEvent10.HardwareEvents = events;
        state.SwitchEventMap.set(key, _switchEvent10);
      }

      var msg = '设备' + o.DeviceId + '开关' + o.Addr + '开关硬件故障' + events;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveSwitchLoop: function SaveSwitchLoop(state, o) {
      var key = o.DeviceId + '|' + o.Addr;
      console.log('开关key ', key, 'runtime 数据 ', JSON.stringify(o.Runtime));
      state.SwitchRuntimeMap.set(key, o.Runtime);
    },
    SaveSwitchModeEvent: function SaveSwitchModeEvent(state, o) {
      var key = o.DeviceId + '|' + o.Addr;

      var mode = _switch_parser["default"].modeParser(o.SwitchMode);

      var isLock = _switch_parser["default"].isSwitchLocked(o.SwitchMode);

      if (state.SwitchEventMap.has(key)) {
        var switchEvent = state.SwitchEventMap.get(key);
        switchEvent.Mode = mode;
        switchEvent.isLock = isLock;
      } else {
        var _switchEvent11 = new SwitchEvent();

        _switchEvent11.Mode = mode;
        _switchEvent11.isLock = isLock;
        state.SwitchEventMap.set(key, _switchEvent11);
      }

      var msg = '设备' + o.DeviceId + '开关' + o.Addr + mode;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveSwitchSettingUpload: function SaveSwitchSettingUpload(state, o) {
      var key = o.DeviceId + '|' + o.Addr;
      console.log('开关key ' + key + ' 设置数据 ' + JSON.stringify(o.Data));
      state.SwitchSettingMap.set(key, o.Data);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = o.Timers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var t = _step.value;
          var key1 = key + '|' + t.Group;
          state.SwitchTimerMap.set(key1, t);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    SaveSwitchStateEvent: function SaveSwitchStateEvent(state, o) {
      var key = o.DeviceId + '|' + o.Addr;

      var status = _switch_parser["default"].stateParser(o.SwitchStatus);

      var isOpen = _switch_parser["default"].isSwitchOpen(o.SwitchStatus);

      if (state.SwitchEventMap.has(key)) {
        var switchEvent = state.SwitchEventMap.get(key);
        switchEvent.Status = status;
        switchEvent.isOpen = isOpen;
      } else {
        var _switchEvent12 = new SwitchEvent();

        _switchEvent12.Status = status;
        _switchEvent12.isOpen = isOpen;
        state.SwitchEventMap.set(key, _switchEvent12);
      }

      var msg = '设备' + o.DeviceId + '开关' + o.Addr + status;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveSwitchWarnEvent: function SaveSwitchWarnEvent(state, o) {
      var key = o.DeviceId + '|' + o.Addr;

      var events = _switch_parser["default"].alarmStateParser(o.WarnEvents);

      if (state.SwitchEventMap.has(key)) {
        var switchEvent = state.SwitchEventMap.get(key);
        switchEvent.WarnEvents = events;
        switchEvent.WarnEventData = o.Data;
      } else {
        var _switchEvent13 = new SwitchEvent();

        _switchEvent13.WarnEvents = events;
        _switchEvent13.WarnEventData = o.Data;
        state.SwitchEventMap.set(key, _switchEvent13);
      }

      var msg = '设备' + o.DeviceId + '开关' + o.Addr + events + '数据' + o.Data;
      (0, _elementPlus.ElMessage)(msg);
    },
    SaveClientHeartBeatResponse: function SaveClientHeartBeatResponse(state, o) {
      state.ClientHeartBeatResponse = o;
    },
    ClearWebsocketResponse: function ClearWebsocketResponse(state) {
      state.DeviceResultMessage = {};
      state.ModbusSingleWriteResult = {};
      state.ResultMessage = {};
      state.ShutDown = {};
      state.ClientHeartBeatResponse = {};
      state.SwitchEventMap = new Map();
      state.DeviceQuantityMap = new Map();
      state.DeviceMap = new Map();
      state.HostMap = new Map();
      state.SwitchRuntimeMap = new Map();
      state.SwitchSettingMap = new Map();
      state.SwitchTimerMap = new Map();
    },
    SaveSwitchRuntimeResponse: function SaveSwitchRuntimeResponse(state, o) {
      var key = o.DeviceId + '|' + o.Addr;
      state.SwitchRuntimeMap.set(key, o.Data);

      if (state.HostMap.has(o.DeviceId)) {
        var host = state.HostMap.get(o.DeviceId);
        host.PowerPs[o.Addr - 1] = o.Data.Power_p;
        host.EnergyPts[o.Addr - 1] = o.Data.Energy_pt;
      } else {
        var _host4 = new Host();

        _host4.PowerPs[o.Addr - 1] = o.Data.Power_p;
        _host4.EnergyPts[o.Addr - 1] = o.Data.Energy_pt;
        state.HostMap.set(o.DeviceId, _host4);
      }
    },
    //清空switchdetail页面computed获取的store值，因为computed是只读的，只能用响应触发computed改变以触发watch赋值
    ClearSwitchDetailValue: function ClearSwitchDetailValue(state, key) {
      state.SwitchSettingMap["delete"](key);
      state.SwitchTimerMap["delete"](key + '|1');
      state.SwitchTimerMap["delete"](key + '|2');
      state.SwitchTimerMap["delete"](key + '|3');
      state.SwitchTimerMap["delete"](key + '|4');
    }
  },
  getters: {
    //返回设备总电量
    totalQuantity: function totalQuantity(state) {
      return function (deviceId) {
        var total = 0;
        var host = state.HostMap.get(deviceId);

        if (host != null && 'EnergyPts' in host) {
          host.EnergyPts.forEach(function (e) {
            total += e;
          });
        }

        return total;
      };
    }
  }
};
var _default = wsResponse; //获取对象数组arr中对象的指定域名prop的值并存入数组返回

exports["default"] = _default;

function parseObjectArray(arr, prop) {
  var result = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var x = _step2.value;

      if (prop in x) {
        result.push(x[prop]);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return result;
}

var Host = function Host() {
  _classCallCheck(this, Host);

  //主机参数
  this.DeviceId;
  this.SignalIntensity;
  this.InternetMode;
  this.DeviceCount;
  this.UploadInterval; //开关状态参数(数组)

  this.SwitchTypes = [];
  this.SwitchStates = [];
  this.SwitchModes = [];
  this.PowerPs = [];
  this.EnergyPts = [];
};

var SwitchEvent = function SwitchEvent() {
  _classCallCheck(this, SwitchEvent);

  this.isOpen;
  this.isLock;
  this.ElectricLeakageTestStatus;
  this.FaultEvents;
  this.FaultEventData;
  this.HardwareEvents;
  this.Mode;
  this.Status;
  this.WarnEvents;
  this.WarnEventData;
};