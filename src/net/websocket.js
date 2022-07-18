import store from '@/store/index.js'
import beanMap from './bean_meta.js'

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

const addr="ws://127.0.0.1:8104/entry"
const reconnectTimeout=5000
const pongTimeout=17000
let heartbeat=null//此变量在连接前必须赋值！
let ws=null
let isOpen=false
let lockReconnect=false
let forbidReconnect=false
let repeat=0
let repeatLimit=10
let pongTimeoutId=null
let isLoop=true
let loopInterval=10000

function handleMessage(evt){
    if(evt.data instanceof ArrayBuffer){
        let dv=new DataView(evt.data)
        let msgid=dv.getUint16(0,true)
        let msg=JSON.parse(new TextDecoder('utf8').decode(evt.data.slice(2)))
        if(beanMap.responseMap.has(msgid)){
            console.log('websocket handle msg'+msgid+'|'+msg)
            store.commit(beanMap.responseMap.get(msgid),msg)
        }else{
            console.log('websocket handle unknown message:',msg)
        }
    }
    send(beanMap.ClientHeartBeat,heartbeat)
    heartCheck()
}

function reconnect(){
    if(repeatLimit<=repeat){return}
    if(lockReconnect || forbidReconnect){return}
    lockReconnect=true
    repeat++
    setTimeout(()=>{
        websocketConnect()
        console.log('重连')
        lockReconnect=false
    },reconnectTimeout)
}

export function send(id,msg){
    if(ws!=null && isOpen){
        let msgData=new TextEncoder('utf8').encode(JSON.stringify(msg))
        let dv=new DataView(new ArrayBuffer(msgData.length+2))
        dv.setUint16(0,id,true)
        for(let i=0;i<msgData.length;i++){
            dv.setUint8(2+i,msgData[i])
        }
        ws.send(dv)
        console.log('websocket send:'+id+'|'+msg)
    }
}

export function enableLoop(){
    isLoop=true
}

export function loopSend(id,msg){
    // if(!isLoop){return}
    // send(id,msg)
    // setTimeout(()=>{loopSend(id,msg)},loopInterval)
    return new Promise((resolve)=>{
        if(isLoop){
            send(id,msg)
        }
        return resolve()
    }).then(()=>{if(isLoop){setTimeout(()=>{loopSend(id,msg)},loopInterval)}})
}

export function disableLoop(){
    isLoop=false
    console.log('stop all loopsend')
}

function heartReset(){
    clearTimeout(pongTimeoutId)
}

function heartStart(){
    if(forbidReconnect){return}
    pongTimeoutId=setTimeout(()=>{
        ws.close()
    },pongTimeout)
}

function heartCheck(){
    heartReset()
    heartStart()
}

export function setHeartBeat(o){
    heartbeat=o
}

export function websocketConnect(){
    if(isOpen){return}
    console.log('websocket connecting...')
    ws=new WebSocket(addr)
    ws.binaryType='arraybuffer'
    ws.onopen=function(evt){
        console.log('websocket open'+evt)
        repeat=0
        isOpen=true
        heartCheck()
    }
    ws.onerror=function(evt){
        console.log('websocket connect failure'+evt)
        isOpen=false
        reconnect()
    }
    ws.onclose=function(evt){
        console.log('websocket close'+evt)
        isOpen=false
        reconnect()
    }
    ws.onmessage=handleMessage
}

export function websocketClose(){
    isOpen=false
    forbidReconnect=true
    heartReset()
    ws.close()
    ws=null
}