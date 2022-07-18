import {ElMessage} from 'element-plus'
import SwitchParser from './switch_parser.js'
import router from '@/router/index.js'
import {websocketClose} from '@/net/websocket.js'
import Cookies from 'js-cookie'

const wsResponse={
    namespaced:true,
    state:()=>({
        //瞬时数据（不是状态，先不处理）
        DeviceResultMessage:{},//发送命令失败响应
        ModbusSingleWriteResult:{},//modbus单独写响应
        ResultMessage:{},//设备无关操作响应（比如数据库）
        ShutDown:{},//关闭连接响应
        ClientHeartBeatResponse:{},//心跳响应

        //开关事件
        SwitchEventMap:new Map(),//key是主机名称|开关地址，value是SwitchEvent

        //数据库查询
        //历史电量
        DeviceQuantityMap:new Map(),//key是主机名称，value是DeviceElectricQuantityResult
        DeviceMap:new Map(),//用户关联设备，key是deviceId，value是product
        //设备数据
        HostMap:new Map(),//key是主机名称，value是主机值
        SwitchRuntimeMap:new Map(),//key是主机名称|开关地址，value是开关实时数据
        SwitchSettingMap:new Map(),//key是主机名称|开关地址，value是开关设置数据
        SwitchTimerMap:new Map(),//key是主机名称|开关地址|定时器编号，value是开关定时器状态
    }),
    mutations:{        
        SaveDeviceAllRegister(state,o){
            console.log('收到DeviceAllRegister',o)
            if(state.HostMap.has(o.DeviceId)){
                let host=state.HostMap.get(o.DeviceId)
                host.DeviceId=o.DeviceId
                host.SignalIntensity=o.SignalIntensity
                host.InternetMode=o.InternetMode
                host.DeviceCount=o.DeviceCount
                host.UploadInterval=o.UploadInterval
            }else{
                let host=new Host()
                host.DeviceId=o.DeviceId
                host.SignalIntensity=o.SignalIntensity
                host.InternetMode=o.InternetMode
                host.DeviceCount=o.DeviceCount
                host.UploadInterval=o.UploadInterval
                state.HostMap.set(o.DeviceId,host)
            }
        },
        SaveDeviceAllStateResult(state,o){
            console.log('收到DeviceAllStateResult',o)
            if(state.HostMap.has(o.DeviceId)){
                let host=state.HostMap.get(o.DeviceId)
                host.SwitchStates=parseObjectArray(o.List,'SwitchState')
                for(let i=0;i<host.SwitchStates.length;i++){
                    let key=o.DeviceId+'|'+(i+1)
                    let status=SwitchParser.stateParser(host.SwitchStates[i])
                    let isOpen=SwitchParser.isSwitchOpen(host.SwitchStates[i])
                    if(state.SwitchEventMap.has(key)){
                        let switchEvent=state.SwitchEventMap.get(key)
                        switchEvent.Status=status
                        switchEvent.isOpen=isOpen
                    }else{
                        let switchEvent=new SwitchEvent()
                        switchEvent.Status=status
                        switchEvent.isOpen=isOpen
                        state.SwitchEventMap.set(key,switchEvent)
                    }
                }
                host.SwitchModes=parseObjectArray(o.List,'SwitchMode')
                for(let i=0;i<host.SwitchModes.length;i++){
                    let key=o.DeviceId+'|'+(i+1)
                    let mode=SwitchParser.modeParser(host.SwitchModes[i])
                    let isLock=SwitchParser.isSwitchLocked(host.SwitchModes[i])
                    if(state.SwitchEventMap.has(key)){
                        let switchEvent=state.SwitchEventMap.get(key)
                        switchEvent.Mode=mode
                        switchEvent.isLock=isLock
                    }else{
                        let switchEvent=new SwitchEvent()
                        switchEvent.Mode=mode
                        switchEvent.isLock=isLock
                        state.SwitchEventMap.set(key,switchEvent)
                    }
                }
            }else{
                let host=new Host()
                host.SwitchStates=parseObjectArray(o.List,'SwitchState')
                for(let i=0;i<host.SwitchStates.length;i++){
                    let key=o.DeviceId+'|'+(i+1)
                    let status=SwitchParser.stateParser(host.SwitchStates[i])
                    let isOpen=SwitchParser.isSwitchOpen(host.SwitchStates[i])
                    if(state.SwitchEventMap.has(key)){
                        let switchEvent=state.SwitchEventMap.get(key)
                        switchEvent.Status=status
                        switchEvent.isOpen=isOpen
                    }else{
                        let switchEvent=new SwitchEvent()
                        switchEvent.Status=status
                        switchEvent.isOpen=isOpen
                        state.SwitchEventMap.set(key,switchEvent)
                    }
                }
                host.SwitchModes=parseObjectArray(o.List,'SwitchMode')
                for(let i=0;i<host.SwitchModes.length;i++){
                    let key=o.DeviceId+'|'+(i+1)
                    let mode=SwitchParser.modeParser(host.SwitchModes[i])
                    let isLock=SwitchParser.isSwitchLocked(host.SwitchModes[i])
                    if(state.SwitchEventMap.has(key)){
                        let switchEvent=state.SwitchEventMap.get(key)
                        switchEvent.Mode=mode
                        switchEvent.isLock=isLock
                    }else{
                        let switchEvent=new SwitchEvent()
                        switchEvent.Mode=mode
                        switchEvent.isLock=isLock
                        state.SwitchEventMap.set(key,switchEvent)
                    }
                }
                state.HostMap.set(o.DeviceId,host)
            }
        },
        SaveDeviceElectricQuantityResult(state,o){
            state.DeviceQuantityMap.set(o.DeviceId,o)
        },
        SaveDeviceLoop(state,o){
            if(state.HostMap.has(o.DeviceId)){
                let host=state.HostMap.get(o.DeviceId)
                host.PowerPs=parseObjectArray(o.List,'PowerP')
                host.EnergyPts=parseObjectArray(o.List,'Energy_pt')
                host.SwitchTypes=parseObjectArray(o.List,'DeviceType')
            }else{
                let host=new Host()
                host.PowerPs=parseObjectArray(o.List,'PowerP')
                host.EnergyPts=parseObjectArray(o.List,'Energy_pt')
                host.SwitchTypes=parseObjectArray(o.List,'DeviceType')
                state.HostMap.set(o.DeviceId,host)
            }
        },
        SaveDeviceResultMessage(state,o){
            state.DeviceResultMessage=o
            let msg='设备'+o.DeviceId+' 操作'+o.IsSuccess+'描述'+o.Message
            ElMessage(msg)
        },
        //这个指令没用上
        // SaveDeviceSnapShoot(state,o){
        // },
        SaveGetDeviceListResult(state,o){
            for(let i=0;i<o.DeviceIds.length;i++){
                state.DeviceMap.set(o.DeviceIds.at(i),o.Products.at(i))
            }
        },
        SaveModbusSingleWriteResult(state,o){
            state.ModbusSingleWriteResult=o
            if(o.Ok){
                let msg='设备'+o.DeviceId+'开关'+o.Addr+'modbus单独写成功 '+
                '寄存器'+o.RegisterIndex+'新值'+o.NewValue
                ElMessage(msg)
            }else{
                let msg='设备'+o.DeviceId+'开关'+o.Addr+'modbus单独写失败 '+
                '原因'+o.ErrorMsg
                ElMessage(msg)
            }
            
        },
        SaveResultMessage(state,o){
            state.ResultMessage=o
            let msg='服务器操作'+o.IsSuccess+'描述'+o.Message
            ElMessage(msg)
        },
        SaveShutDown(state,o){
            Cookies.remove('name')
            Cookies.remove('token')
            websocketClose()
            //重置store
            state.DeviceResultMessage={}
            state.ModbusSingleWriteResult={}
            state.ResultMessage={}
            state.ShutDown={}
            state.ClientHeartBeatResponse={}
            state.SwitchEventMap=new Map()
            state.DeviceQuantityMap=new Map()
            state.DeviceMap=new Map()
            state.HostMap=new Map()
            state.SwitchRuntimeMap=new Map()
            state.SwitchSettingMap=new Map()
            state.SwitchTimerMap=new Map()
            //跳转路由
            router.push({name:'Login'})
            state.ShutDown=o
            let msg='连接关闭'+o.Code+'描述'+o.Message
            ElMessage(msg)
        },
        SaveSwitchElectricLeakageTestEvent(state,o){
            let key=o.DeviceId+'|'+o.Addr
            if(state.SwitchEventMap.has(key)){
                let switchEvent=state.SwitchEventMap.get(key)
                switchEvent.ElectricLeakageTestStatus=o.Status
            }else{
                let switchEvent=new SwitchEvent()
                switchEvent.ElectricLeakageTestStatus=o.Status
                state.SwitchEventMap.set(key,switchEvent)
            }
            let msg='设备'+o.DeviceId+'开关'+o.Addr+'漏电检测事件'+o.Status
            ElMessage(msg)
        },
        SaveSwitchFaultEvent(state,o){
            let key=o.DeviceId+'|'+o.Addr
            let events=SwitchParser.errorStateParser(o.FaultEvents)
            if(state.SwitchEventMap.has(key)){
                let switchEvent=state.SwitchEventMap.get(key)
                switchEvent.FaultEvents=events
                switchEvent.FaultEventData=o.Data
            }else{
                let switchEvent=new SwitchEvent()
                switchEvent.FaultEvents=events
                switchEvent.FaultEventData=o.Data
                state.SwitchEventMap.set(key,switchEvent)
            }
            let msg='设备'+o.DeviceId+'开关'+o.Addr+'开关故障'+events+'数据'+o.Data
            ElMessage(msg)
        },
        SaveSwitchHardwareFaultEvent(state,o){
            let key=o.DeviceId+'|'+o.Addr
            let events=SwitchParser.hardFaultParser(o.HardwareEvents)
            if(state.SwitchEventMap.has(key)){
                let switchEvent=state.SwitchEventMap.get(key)
                switchEvent.HardwareEvents=events
            }else{
                let switchEvent=new SwitchEvent()
                switchEvent.HardwareEvents=events
                state.SwitchEventMap.set(key,switchEvent)
            }
            let msg='设备'+o.DeviceId+'开关'+o.Addr+'开关硬件故障'+events
            ElMessage(msg)
        },
        SaveSwitchLoop(state,o){
            let key=o.DeviceId+'|'+o.Addr
            console.log('开关key ',key,'runtime 数据 ',JSON.stringify(o.Runtime))
            state.SwitchRuntimeMap.set(key,o.Runtime)
        },
        SaveSwitchModeEvent(state,o){
            let key=o.DeviceId+'|'+o.Addr
            let mode=SwitchParser.modeParser(o.SwitchMode)
            let isLock=SwitchParser.isSwitchLocked(o.SwitchMode)
            if(state.SwitchEventMap.has(key)){
                let switchEvent=state.SwitchEventMap.get(key)
                switchEvent.Mode=mode
                switchEvent.isLock=isLock
            }else{
                let switchEvent=new SwitchEvent()
                switchEvent.Mode=mode
                switchEvent.isLock=isLock
                state.SwitchEventMap.set(key,switchEvent)
            }
            let msg='设备'+o.DeviceId+'开关'+o.Addr+mode
            ElMessage(msg)
        },
        SaveSwitchSettingUpload(state,o){
            let key=o.DeviceId+'|'+o.Addr
            console.log('开关key '+key+' 设置数据 '+JSON.stringify(o.Data))
            state.SwitchSettingMap.set(key,o.Data)
            for(let t of o.Timers){
                let key1=key+'|'+t.Group
                state.SwitchTimerMap.set(key1,t)
            }
        },
        SaveSwitchStateEvent(state,o){
            let key=o.DeviceId+'|'+o.Addr
            let status=SwitchParser.stateParser(o.SwitchStatus)
            let isOpen=SwitchParser.isSwitchOpen(o.SwitchStatus)
            if(state.SwitchEventMap.has(key)){
                let switchEvent=state.SwitchEventMap.get(key)
                switchEvent.Status=status
                switchEvent.isOpen=isOpen
            }else{
                let switchEvent=new SwitchEvent()
                switchEvent.Status=status
                switchEvent.isOpen=isOpen
                state.SwitchEventMap.set(key,switchEvent)
            }
            let msg='设备'+o.DeviceId+'开关'+o.Addr+status
            ElMessage(msg)
        },
        SaveSwitchWarnEvent(state,o){
            let key=o.DeviceId+'|'+o.Addr
            let events=SwitchParser.alarmStateParser(o.WarnEvents)
            if(state.SwitchEventMap.has(key)){
                let switchEvent=state.SwitchEventMap.get(key)
                switchEvent.WarnEvents=events
                switchEvent.WarnEventData=o.Data
            }else{
                let switchEvent=new SwitchEvent()
                switchEvent.WarnEvents=events
                switchEvent.WarnEventData=o.Data
                state.SwitchEventMap.set(key,switchEvent)
            }
            let msg='设备'+o.DeviceId+'开关'+o.Addr+events+'数据'+o.Data
            ElMessage(msg)
        },
        SaveClientHeartBeatResponse(state,o){
            state.ClientHeartBeatResponse=o
        },
        ClearWebsocketResponse(state){
            state.DeviceResultMessage={}
            state.ModbusSingleWriteResult={}
            state.ResultMessage={}
            state.ShutDown={}
            state.ClientHeartBeatResponse={}
            state.SwitchEventMap=new Map()
            state.DeviceQuantityMap=new Map()
            state.DeviceMap=new Map()
            state.HostMap=new Map()
            state.SwitchRuntimeMap=new Map()
            state.SwitchSettingMap=new Map()
            state.SwitchTimerMap=new Map()
        },
        SaveSwitchRuntimeResponse(state,o){
            let key=o.DeviceId+'|'+o.Addr
            state.SwitchRuntimeMap.set(key,o.Data)
            if(state.HostMap.has(o.DeviceId)){
                let host=state.HostMap.get(o.DeviceId)
                host.PowerPs[o.Addr-1]=o.Data.Power_p
                host.EnergyPts[o.Addr-1]=o.Data.Energy_pt
            }else{
                let host=new Host()
                host.PowerPs[o.Addr-1]=o.Data.Power_p
                host.EnergyPts[o.Addr-1]=o.Data.Energy_pt
                state.HostMap.set(o.DeviceId,host)
            }
        },
        //清空switchdetail页面computed获取的store值，因为computed是只读的，只能用响应触发computed改变以触发watch赋值
        ClearSwitchDetailValue(state,key){
            state.SwitchSettingMap.delete(key)
            state.SwitchTimerMap.delete(key+'|1')
            state.SwitchTimerMap.delete(key+'|2')
            state.SwitchTimerMap.delete(key+'|3')
            state.SwitchTimerMap.delete(key+'|4')
        }
    },
    getters:{
        //返回设备总电量
        totalQuantity:(state)=>(deviceId)=>{
            let total=0
            let host=state.HostMap.get(deviceId)
            if(host !=null &&'EnergyPts' in host){
                host.EnergyPts.forEach(e => {
                    total+=e
                })
            }
            return total
        }
    },
}

export default wsResponse

//获取对象数组arr中对象的指定域名prop的值并存入数组返回
function parseObjectArray(arr,prop){
    let result=[]
    for(let x of arr){
        if(prop in x){
            result.push(x[prop])
        }
    }
    return result
}

class Host{
    constructor(){
        //主机参数
        this.DeviceId
        this.SignalIntensity
        this.InternetMode
        this.DeviceCount
        this.UploadInterval
        //开关状态参数(数组)
        this.SwitchTypes=[]
        this.SwitchStates=[]
        this.SwitchModes=[]
        this.PowerPs=[]
        this.EnergyPts=[]
    }
}

class SwitchEvent{
    constructor(){
        this.isOpen
        this.isLock
        this.ElectricLeakageTestStatus
        this.FaultEvents
        this.FaultEventData
        this.HardwareEvents
        this.Mode
        this.Status
        this.WarnEvents
        this.WarnEventData
    }
}