"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = send;
exports.enableLoop = enableLoop;
exports.loopSend = loopSend;
exports.disableLoop = disableLoop;
exports.setHeartBeat = setHeartBeat;
exports.websocketConnect = websocketConnect;
exports.websocketClose = websocketClose;

var _index = _interopRequireDefault(require("@/store/index.js"));

var _bean_meta = _interopRequireDefault(require("./bean_meta.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//参考https://github.com/davyxu/cellnet/blob/master/examples/websocket/index.html
//官方文档https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket
//规则
//1，客户端连接成功后触发一次心跳包发送。后端记录心跳时间，不响应心跳包。
//2，客户端每次收到消息后触发一次心跳包发送。后端记录心跳时间，不响应心跳包。
//3，客户端在心跳时间内收不到响应会触发一次断线重连，重连后发送心跳包。
//流程
//客户端无关联设备
//websocketClient连接成功后发送一个心跳，再发送一个消息后就不会主动发送消息了。服务端响应最后的消息会触发websocketClient的心跳包，然后服务端再延迟响应构成循环。
//（客户端消息会更新服务端心跳时间；服务端必须延迟响应心跳消息，且此延迟响应也需要时间间隔）
//客户端有关联设备
//websocketClient连接成功后发送一个心跳，再发送一个消息后就不会主动发送消息了。服务端会开启设备轮询，以非常短的间隔不停给客户端发消息。同时也会延迟响应第一个心跳包。
//服务端能否做到延迟响应心跳包的同时给客户端不断的发消息？
//根据cellnet的源码，peer.start中accept在子协程中，session包裹Conn的处理仍然在子协程中，Conn接受和发送消息分别在两个子协程中。但是发送和接受消息是不分子协程的。
//不过可以用异步方法time.AfterFunc做到延迟响应
var addr = "ws://127.0.0.1:8104/entry";
var reconnectTimeout = 5000;
var pongTimeout = 17000;
var heartbeat = null; //此变量在连接前必须赋值！

var ws = null;
var isOpen = false;
var lockReconnect = false;
var forbidReconnect = false;
var repeat = 0;
var repeatLimit = 10;
var pongTimeoutId = null;
var isLoop = true;
var loopInterval = 10000;

function handleMessage(evt) {
  if (evt.data instanceof ArrayBuffer) {
    var dv = new DataView(evt.data);
    var msgid = dv.getUint16(0, true);
    var msg = JSON.parse(new TextDecoder('utf8').decode(evt.data.slice(2)));

    if (_bean_meta["default"].responseMap.has(msgid)) {
      console.log('websocket handle msg' + msgid + '|' + msg);

      _index["default"].commit(_bean_meta["default"].responseMap.get(msgid), msg);
    } else {
      console.log('websocket handle unknown message:', msg);
    }
  }

  send(_bean_meta["default"].ClientHeartBeat, heartbeat);
  heartCheck();
}

function reconnect() {
  if (repeatLimit <= repeat) {
    return;
  }

  if (lockReconnect || forbidReconnect) {
    return;
  }

  lockReconnect = true;
  repeat++;
  setTimeout(function () {
    websocketConnect();
    console.log('重连');
    lockReconnect = false;
  }, reconnectTimeout);
}

function send(id, msg) {
  if (ws != null && isOpen) {
    var msgData = new TextEncoder('utf8').encode(JSON.stringify(msg));
    var dv = new DataView(new ArrayBuffer(msgData.length + 2));
    dv.setUint16(0, id, true);

    for (var i = 0; i < msgData.length; i++) {
      dv.setUint8(2 + i, msgData[i]);
    }

    ws.send(dv);
    console.log('websocket send:' + id + '|' + msg);
  }
}

function enableLoop() {
  isLoop = true;
}

function loopSend(id, msg) {
  // if(!isLoop){return}
  // send(id,msg)
  // setTimeout(()=>{loopSend(id,msg)},loopInterval)
  return new Promise(function (resolve) {
    if (isLoop) {
      send(id, msg);
    }

    return resolve();
  }).then(function () {
    if (isLoop) {
      setTimeout(function () {
        loopSend(id, msg);
      }, loopInterval);
    }
  });
}

function disableLoop() {
  isLoop = false;
  console.log('stop all loopsend');
}

function heartReset() {
  clearTimeout(pongTimeoutId);
}

function heartStart() {
  if (forbidReconnect) {
    return;
  }

  pongTimeoutId = setTimeout(function () {
    ws.close();
  }, pongTimeout);
}

function heartCheck() {
  heartReset();
  heartStart();
}

function setHeartBeat(o) {
  heartbeat = o;
}

function websocketConnect() {
  if (isOpen) {
    return;
  }

  console.log('websocket connecting...');
  ws = new WebSocket(addr);
  ws.binaryType = 'arraybuffer';

  ws.onopen = function (evt) {
    console.log('websocket open' + evt);
    repeat = 0;
    isOpen = true;
    heartCheck();
  };

  ws.onerror = function (evt) {
    console.log('websocket connect failure' + evt);
    isOpen = false;
    reconnect();
  };

  ws.onclose = function (evt) {
    console.log('websocket close' + evt);
    isOpen = false;
    reconnect();
  };

  ws.onmessage = handleMessage;
}

function websocketClose() {
  isOpen = false;
  forbidReconnect = true;
  heartReset();
  ws.close();
  ws = null;
}