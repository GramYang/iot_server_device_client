<template>
    <el-dialog v-model="dialogVisible" width="30%">
        <span>{{dialogContent.get(btnIndex)}}</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dialogConfirm">是的</el-button>
            </span>
        </template>
    </el-dialog>
    <div>{{deviceInfo1()}}</div>
    <div class="buttons">
        <el-switch v-model="isInSeries" active-text="串联" inactive-text="并联"/>
        <el-button type="primary" @click="dialogVisible=true;btnIndex=5;switchIndex=-1">全部开</el-button>
        <el-button type="info" @click="dialogVisible=true;btnIndex=6;switchIndex=-1">全部关</el-button>
        <el-button type="warning" @click="dialogVisible=true;btnIndex=7;switchIndex=-1">重新分配地址</el-button>
        <el-button @click="this.$router.push({name:'DeviceList'})">回到设备列表</el-button>
    </div>

    <ul class="infinite-list">
        <li v-for="i in switchNum" :key="i" class="infinite-list-item">
            <div>
                <p>{{switchInfo(i-1)+(switchIndex>0?switchIndex:'')}}</p>
                <el-button @click="switchOpenOrClose(i)">{{switchStatus(i)}}</el-button>
                <el-button @click="switchLockOnOrOff(i)">{{switchMode(i)}}</el-button>
                <el-button @click="dialogVisible=true;btnIndex=8;switchIndex=i">故障清除</el-button>
                <el-button @click="this.$router.push({name:'SwitchDetail',params:{deviceId:this.deviceId,product:this.product,addr:i}})">详情</el-button>
            </div>
        </li>
    </ul>
</template>

<script>
import {send} from '@/net/websocket.js'
import beanMap from '@/net/bean_meta.js'
import Cookies from 'js-cookie'
export default {
    data(){
        return{
            heartbeat:{Username:Cookies.get('name'),Token:Cookies.get('token')},
            deviceId:this.$route.params.deviceId,
            product:this.$route.params.product,
            isInSeries:true,//默认串联
            dialogVisible:false,
            btnIndex:-1,//标记功能
            switchIndex:-1,//标记操作开关地址
            dialogContent:new Map([
                [1,'是否开启开关'],
                [2,'是否关闭开关'],
                [3,'是否锁定开关'],
                [4,'是否解锁开关'],
                [5,'是否开启全部开关'],
                [6,'是否关闭全部开关'],
                [7,'是否重新分配开关地址'],
                [8,'是否清除故障']
            ])
        }
    },
    mounted(){
        send(beanMap.DeviceAllState,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product})
    },
    computed:{
        switchNum(){
            let host=this.$store.state.response.HostMap.get(this.deviceId)
            return host==null?1:host.DeviceCount
        },
    },
    methods:{
        deviceInfo1(){
            let host=this.$store.state.response.HostMap.get(this.deviceId)
            if(host !=null){
                let msg='总用电量'+this.$store.getters['response/totalQuantity'](this.deviceId)+'子开关数'+host.DeviceCount+'实时功率'+this.valueByMode(host.PowerPs)
                return msg
            }else{
                return '没有数据'
            }         
        },
        valueByMode(arr){
            let v=0
            if(arr==null){return v}
            if(this.isInSeries){
                return arr[0]
            }else{
                for(let x of arr){
                    v+=x
                }
                return v
            }
        },
        dialogConfirm(){
            this.dialogVisible=false
            switch(this.btnIndex){
                case 1:
                    if(this.switchIndex>0){
                        this.switchOpen(this.switchIndex)
                    }
                    break
                case 2:
                    if(this.switchIndex>0){
                        this.switchClose(this.switchIndex)
                    }
                    break
                case 3:
                    if(this.switchIndex>0){
                        this.switchLockOn(this.switchIndex)
                    }
                    break
                case 4:
                    if(this.switchIndex>0){
                        this.switchLockOff(this.switchIndex)
                    }
                    break
                case 5:
                    this.allSwitchOpen()
                    break
                case 6:
                    this.allSwitchClose()
                    break
                case 7:
                    this.deviceReset()
                    break
                case 8:
                    send(beanMap.SwitchClearFault,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.switchIndex})
                    break
            }
        },
        allSwitchOpen(){
            let cmd=[]
            for(let i=0;i<this.switchNum;i++){
                cmd.push(1)
            }
            send(beanMap.MultiSwitchOperation,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Cmd:cmd})
        },
        allSwitchClose(){
            let cmd=[]
            for(let i=0;i<this.switchNum;i++){
                cmd.push(0)
            }
            send(beanMap.MultiSwitchOperation,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Cmd:cmd})
        },
        deviceReset(){
            send(beanMap.DeviceReset,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product})
        },
        switchOpen(addr){
            send(beanMap.SwitchOn,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:addr})
        },
        switchClose(addr){
            send(beanMap.SwitchOff,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:addr})
        },
        switchLockOn(addr){
            send(beanMap.SwitchLockOn,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:addr})
        },
        switchLockOff(addr){
            send(beanMap.SwitchLockOff,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:addr})
        },
        switchInfo(index){
            let host = this.$store.state.response.HostMap.get(this.deviceId)
            if(host!=null){
                let info='开关电量'+host.EnergyPts[index]+'开关功率'+host.PowerPs[index]
                // +'开关类型'+host.SwitchTypes[index]
                return info
            }else{
                return '没有数据'
            }
        },
        switchStatus(addr){
            let key=this.deviceId+'|'+addr
            let switchEvent=this.$store.state.response.SwitchEventMap.get(key)
            if(switchEvent!=null){
                return switchEvent.Status
            }else{
                return '开/关'
            }
        },
        switchMode(addr){
            let key=this.deviceId+'|'+addr
            let switchEvent=this.$store.state.response.SwitchEventMap.get(key)
            if(switchEvent!=null){
                return switchEvent.Mode
            }else{
                return '锁定/解锁'
            }
        },
        switchOpenOrClose(addr){
            this.dialogVisible=true
            let key=this.deviceId+'|'+addr
            let switchEvent=this.$store.state.response.SwitchEventMap.get(key)
            if(switchEvent!=null){
                this.switchIndex=addr
                if(switchEvent.isOpen){
                    this.btnIndex=2
                }else{
                    this.btnIndex=1
                }
            }
        },
        switchLockOnOrOff(addr){
            this.dialogVisible=true
            let key=this.deviceId+'|'+addr
            let switchEvent=this.$store.state.response.SwitchEventMap.get(key)
            if(switchEvent!=null){
                this.switchIndex=addr
                if(switchEvent.isLock){
                    this.btnIndex=4
                }else{
                    this.btnIndex=3
                }
            }
        },
    }
}
</script>

<style lang="stylus" scoped>
.buttons
    display inline
.infinite-list
    height 300px
    padding 0
    margin 0
    list-style none
    .infinite-list-item
        display: flex
        align-items center
        justify-content center
        background var(--el-color-primary-light-9)
        color var(--el-color-primary)
.dialog-footer
    margin-right 10px
    display inline
</style>