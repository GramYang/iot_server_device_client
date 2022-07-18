"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var beanMap = {
  ClientHeartBeat: 3,
  GetDeviceList: 4,
  MultiSwitchOperation: 5,
  SwitchOn: 6,
  SwitchOff: 7,
  SwitchLockOn: 8,
  SwitchLockOff: 9,
  DeviceReset: 10,
  SetTimer: 11,
  SwitchElectricLeakageTest: 12,
  SwitchAlarmEnable: 13,
  SwitchErrorEnable: 14,
  DeviceElectricQuantity: 15,
  DeviceAllState: 16,
  GetSwitchSetting: 17,
  SwitchLoopOn: 18,
  SwitchLoopOff: 19,
  SwitchClearFault: 20,
  VoltageLimtRstEnable: 21,
  IHP: 22,
  IH: 23,
  UHP: 24,
  UH: 25,
  ULP: 26,
  UL: 27,
  PHP: 28,
  PH: 29,
  EHP: 30,
  EH: 31,
  ILP: 32,
  IL: 33,
  THP: 34,
  TH: 35,
  UHLCT: 36,
  UHLRT: 37,
  IHPHCT: 38,
  GetAllSwitchRuntime: 39,
  ClientLogout: 40,
  responseMap: new Map([[200, 'response/Save' + 'DeviceAllRegister'], // [201,'response/Save'+'DeviceSnapShoot'],//暂时不用，先注释掉
  [202, 'response/Save' + 'DeviceResultMessage'], [203, 'response/Save' + 'GetDeviceListResult'], [204, 'response/Save' + 'SwitchStateEvent'], [205, 'response/Save' + 'SwitchModeEvent'], [206, 'response/Save' + 'DeviceLoop'], [207, 'response/Save' + 'SwitchLoop'], [208, 'response/Save' + 'SwitchFaultEvent'], [209, 'response/Save' + 'SwitchWarnEvent'], [210, 'response/Save' + 'SwitchHardwareFaultEvent'], [211, 'response/Save' + 'SwitchElectricLeakageTestEvent'], [212, 'response/Save' + 'ModbusSingleWriteResult'], [213, 'response/Save' + 'SwitchSettingUpload'], [214, 'response/Save' + 'DeviceElectricQuantityResult'], [215, 'response/Save' + 'DeviceAllStateResult'], [216, 'response/Save' + 'ShutDown'], [217, 'response/Save' + 'ResultMessage'], [218, 'response/Save' + 'ClientHeartBeatResponse'], [219, 'response/Save' + 'SwitchRuntimeResponse']])
};
var _default = beanMap;
exports["default"] = _default;