<template>
    <h1>设备列表</h1>
    <el-button @click="logout">退出登录</el-button>
    <el-button @click="getDeviceList">获取设备列表</el-button>
    <ul class="infinite-list">
        <li v-for="i in count" :key="i" class="infinite-list-item" @click="toDeviceDetail(i-1)">{{ deviceInfo(deviceIds[i-1]) }}</li>
    </ul>
    <el-button @click="debug">debug</el-button>
</template>

<script>
import {setHeartBeat,websocketConnect,send,websocketClose} from '@/net/websocket.js'
import beanMap from '@/net/bean_meta.js'
import Cookies from 'js-cookie'
export default {
    data(){
        return{
            heartbeat:{Username:Cookies.get('name'),Token:Cookies.get('token')}
        }
    },
    mounted(){
        setHeartBeat(this.heartbeat)
        websocketConnect()
    },
    computed:{
        count(){
            let v=this.$store.state.response.DeviceMap.size
            return v==0?1:v
        },
        deviceIds(){
            let res=[]
            for(let x of this.$store.state.response.DeviceMap){
                res.push(x[0])
            }
            return res
        },
    },
    methods:{
        logout(){
            send(beanMap.ClientLogout,{Heartbeat:this.heartbeat})
            Cookies.remove('name')
            Cookies.remove('token')
            websocketClose()
            this.$store.commit('response/ClearWebsocketResponse')
            this.$router.push({name:'Login'})
        },
        getDeviceList(){
            send(beanMap.GetDeviceList,{Heartbeat:this.heartbeat})
        },
        toDeviceDetail(index){
            this.$router.push({name:'DeviceDetail',params:{deviceId:this.deviceIds[index],product:this.$store.state.response.DeviceMap.get(this.deviceIds[index])}})
        },
        deviceInfo(deviceId){
            let host=this.$store.state.response.HostMap.get(deviceId)
            if(host !=null){
                let info='设备名称'+deviceId+'网络信号'+host.SignalIntensity+'子开关数'+host.DeviceCount+'总用电量'+this.$store.getters['response/totalQuantity'](deviceId)
                return info
            }else{
                return '没有数据'
            }
        },
        debug(){
            console.log('devicelist deviceIds',this.deviceIds)
            console.log('devicelist count',this.count)
        }
    },
}
</script>

<style scoped>
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
</style>