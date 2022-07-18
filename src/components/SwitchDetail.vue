<template>
    <el-dialog v-model="dialogVisible" width="30%">
        <span>{{dialogDescription}}</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dialogConfirm">是的</el-button>
            </span>
        </template>
    </el-dialog>
    <el-button type="primary" @click="debug()">debug</el-button>
    <el-button type="primary" @click="this.$router.push({name:'DeviceDetail',params:{deviceId:this.deviceId,product:this.product}})">回到设备明细</el-button>
    <div>{{switchInfo1()}}</div>
    <el-button @click="dialogContent(1)" type="primary">漏电测试</el-button>
    <h3>开关故障预警开启</h3>
    <div>
        <el-switch v-model="alarmEnable.enable1.isEnable" active-text="过流"/>
        <el-switch v-model="alarmEnable.enable2.isEnable" active-text="过压"/>
        <el-switch v-model="alarmEnable.enable3.isEnable" active-text="欠压"/>
        <el-switch v-model="alarmEnable.enable4.isEnable" active-text="过载"/>
        <el-switch v-model="alarmEnable.enable5.isEnable" active-text="电量"/>
        <el-switch v-model="alarmEnable.enable6.isEnable" active-text="过温"/>
    </div>
    <el-button type="primary" @click="dialogContent(2)">预警开启</el-button>
    <h3>开关故障保护开启</h3>
    <div>
        <el-switch v-model="errorEnable.enable1.isEnable" active-text="过流"/>
        <el-switch v-model="errorEnable.enable2.isEnable" active-text="过压"/>
        <el-switch v-model="errorEnable.enable3.isEnable" active-text="欠压"/>
        <el-switch v-model="errorEnable.enable4.isEnable" active-text="过载"/>
        <el-switch v-model="errorEnable.enable5.isEnable" active-text="电量"/>
        <el-switch v-model="errorEnable.enable6.isEnable" active-text="过温"/>
        <el-switch v-model="errorEnable.enable7.isEnable" active-text="电弧"/>
    </div>
    <el-button type="primary" @click="dialogContent(3)">保护开启</el-button>
    <h3>过欠压恢复开启</h3>
    <div>
        <el-switch v-model="voltageLimtRstEnable" active-text="过欠压恢复"/>
    </div>
    <el-button type="primary" @click="dialogContent(8)">过欠压设置</el-button>
    <h3>开关设置值</h3>
    <div>
        <span>IHP电流预警保护值A</span>
        <el-input-number v-model="valueSetting.IH_P" :min="0" :max="5000"/>
        <el-button type="primary" @click="dialogContent(9)">设置</el-button>
    </div>
    <div>
        <span>IH限定电流保护值A</span>
        <el-input-number v-model="valueSetting.IH" :min="0" :max="5000"/>
        <el-button type="primary" @click="dialogContent(10)">设置</el-button>
    </div>
    <div>
        <span>UHP过压预警值V</span>
        <el-input-number v-model="valueSetting.UH_P" :min="0" :max="5000"/>
        <el-button type="primary" @click="dialogContent(11)">设置</el-button>
    </div>
    <div>
        <span>UH过压保护值V（240-400）</span>
        <el-input-number v-model="valueSetting.UH" :min="240" :max="400"/>
        <el-button type="primary" @click="dialogContent(12)">设置</el-button>
    </div>
    <div>
        <span>ULP欠压预警值V（100-200）</span>
        <el-input-number v-model="valueSetting.UL_P" :min="100" :max="200"/>
        <el-button type="primary" @click="dialogContent(13)">设置</el-button>
    </div>
    <div>
        <span>UL欠压保护值V（100-200）</span>
        <el-input-number v-model="valueSetting.UL" :min="100" :max="200"/>
        <el-button type="primary" @click="dialogContent(14)">设置</el-button>
    </div>
    <div>
        <span>PHP限定功率预警值W（必须小于PH）</span>
        <el-input-number v-model="valueSetting.PH_P" :min="0" :max="5000"/>
        <el-button type="primary" @click="dialogContent(15)">设置</el-button>
    </div>
    <div>
        <span>PH限定功率保护值W</span>
        <el-input-number v-model="valueSetting.PH" :min="0" :max="5000"/>
        <el-button type="primary" @click="dialogContent(16)">设置</el-button>
    </div>
    <div>
        <span>EHP剩余电量预警值KW.H</span>
        <el-input-number v-model="valueSetting.EH_P" :min="0" :max="50000"/>
        <el-button type="primary" @click="dialogContent(17)">设置</el-button>
    </div>
    <div>
        <span>ILP漏电流预警值mA</span>
        <el-input-number v-model="valueSetting.IL_P" :min="0" :max="5000"/>
        <el-button type="primary" @click="dialogContent(18)">设置</el-button>
    </div>
    <div>
        <span>IL漏电流保护值mA</span>
        <el-input-number v-model="valueSetting.IL" :min="0" :max="5000"/>
        <el-button type="primary" @click="dialogContent(19)">设置</el-button>
    </div>
    <div>
        <span>THP过温预警值℃（必须小于TH）</span>
        <el-input-number v-model="valueSetting.TH_P" :min="0" :max="200"/>
        <el-button type="primary" @click="dialogContent(20)">设置</el-button>
    </div>
    <div>
        <span>TH过温保护值（50-125℃）</span>
        <el-input-number v-model="valueSetting.TH" :min="50" :max="125"/>
        <el-button type="primary" @click="dialogContent(21)">设置</el-button>
    </div>
    <div>
        <span>UHLCT过欠压动作时间（0-60s）</span>
        <el-input-number v-model="valueSetting.UHL_CT" :min="0" :max="60"/>
        <el-button type="primary" @click="dialogContent(22)">设置</el-button>
    </div>
    <div>
        <span>UHLRT过欠压恢复时间（0-60s）</span>
        <el-input-number v-model="valueSetting.UHL_RT" :min="50" :max="60"/>
        <el-button type="primary" @click="dialogContent(23)">设置</el-button>
    </div>
    <div>
        <span>IHPHCT电流功率动作时间（0-50s）</span>
        <el-input-number v-model="valueSetting.IH_PH_CT" :min="0" :max="50"/>
        <el-button type="primary" @click="dialogContent(24)">设置</el-button>
    </div>

    <h3>定时器1</h3>
    <div>
        <span>任务</span>
        <el-select v-model="timer1.task" placeholder="无数据" size="small">
            <el-option
                v-for="item in timerSetting.task"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <span>周期</span>
            <el-select v-model="timer1.cycle" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.cycle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>状态</span>
            <el-select v-model="timer1.state" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.state"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>年</span>
        <el-input-number v-model="timer1.year" :min="2022" :max="2122"/>
        <span>月</span>
        <el-input-number v-model="timer1.month" :min="1" :max="12"/>
        <span>日</span>
        <el-input-number v-model="timer1.day" :min="1" :max="31"/>
        <span>星期日</span>
        <el-input-number v-model="timer1.weekday" :min="1" :max="7"/>
        <span>小时</span>
        <el-input-number v-model="timer1.hour" :min="0" :max="59"/>
        <span>分钟</span>
        <el-input-number v-model="timer1.minute" :min="0" :max="59"/>
    </div>
    <el-button @click="dialogContent(4)" type="primary">设置定时器1</el-button>
    <h3>定时器2</h3>
    <div>
        <span>任务</span>
        <el-select v-model="timer2.task" placeholder="无数据" size="small">
            <el-option
                v-for="item in timerSetting.task"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <span>周期</span>
            <el-select v-model="timer2.cycle" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.cycle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>状态</span>
            <el-select v-model="timer2.state" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.state"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>年</span>
        <el-input-number v-model="timer2.year" :min="2022" :max="2122"/>
        <span>月</span>
        <el-input-number v-model="timer2.month" :min="1" :max="12"/>
        <span>日</span>
        <el-input-number v-model="timer2.day" :min="1" :max="31"/>
        <span>星期日</span>
        <el-input-number v-model="timer2.weekday" :min="1" :max="7"/>
        <span>小时</span>
        <el-input-number v-model="timer2.hour" :min="0" :max="59"/>
        <span>分钟</span>
        <el-input-number v-model="timer2.minute" :min="0" :max="59"/>
    </div>
    <el-button @click="dialogContent(5)" type="primary">设置定时器2</el-button>
    <h3>定时器3</h3>
    <div>
        <span>任务</span>
        <el-select v-model="timer3.task" placeholder="无数据" size="small">
            <el-option
                v-for="item in timerSetting.task"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <span>周期</span>
            <el-select v-model="timer3.cycle" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.cycle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>状态</span>
            <el-select v-model="timer3.state" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.state"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>年</span>
        <el-input-number v-model="timer3.year" :min="2022" :max="2122"/>
        <span>月</span>
        <el-input-number v-model="timer3.month" :min="1" :max="12"/>
        <span>日</span>
        <el-input-number v-model="timer3.day" :min="1" :max="31"/>
        <span>星期日</span>
        <el-input-number v-model="timer3.weekday" :min="1" :max="7"/>
        <span>小时</span>
        <el-input-number v-model="timer3.hour" :min="0" :max="59"/>
        <span>分钟</span>
        <el-input-number v-model="timer3.minute" :min="0" :max="59"/>
    </div>
    <el-button @click="dialogContent(6)" type="primary">设置定时器3</el-button>
    <h3>定时器4</h3>
    <div>
        <span>任务</span>
        <el-select v-model="timer4.task" placeholder="无数据" size="small">
            <el-option
                v-for="item in timerSetting.task"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <span>周期</span>
            <el-select v-model="timer4.cycle" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.cycle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>状态</span>
            <el-select v-model="timer4.state" placeholder="无数据" size="small">
                <el-option
                    v-for="item in timerSetting.state"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
        </el-select>
        <span>年</span>
        <el-input-number v-model="timer4.year" :min="2022" :max="2122"/>
        <span>月</span>
        <el-input-number v-model="timer4.month" :min="1" :max="12"/>
        <span>日</span>
        <el-input-number v-model="timer4.day" :min="1" :max="31"/>
        <span>星期日</span>
        <el-input-number v-model="timer4.weekday" :min="1" :max="7"/>
        <span>小时</span>
        <el-input-number v-model="timer4.hour" :min="0" :max="23"/>
        <span>分钟</span>
        <el-input-number v-model="timer4.minute" :min="0" :max="59"/>
    </div>
    <el-button @click="dialogContent(7)" type="primary">设置定时器4</el-button>
</template>

<script>
import {send} from '@/net/websocket.js'
import beanMap from '@/net/bean_meta.js'
import SwitchParser from '@/store/switch_parser.js'
import Cookies from 'js-cookie'
export default {
    data(){
        return{
            heartbeat:{Username:Cookies.get('name'),Token:Cookies.get('token')},
            deviceId:this.$route.params.deviceId,
            product:this.$route.params.product,
            addr:parseInt(this.$route.params.addr),
            btnIndex:-1,
            dialogVisible:false,
            dialogDescription:'',
            timerSetting:{
                task:[{label:'关闸',value:'0'},{label:'开闸',value:'1'},{label:'漏电检测',value:'2'}],
                cycle:[{label:'一次',value:'0'},{label:'每天',value:'1'},{label:'每周',value:'2'},{label:'每月',value:'3'}],
                state:[{label:'禁止',value:'0'},{label:'允许',value:'1'},{label:'待执行',value:'2'},{label:'已执行',value:'3'},{label:'已执行并继续',value:'4'}],
            },
            alarmEnable:{
                enable1:{bit:0,isEnable:false,content:'过流'},
                enable2:{bit:1,isEnable:false,content:'过压'},
                enable3:{bit:2,isEnable:false,content:'欠压'},
                enable4:{bit:4,isEnable:false,content:'过载'},
                enable5:{bit:5,isEnable:false,content:'电量'},
                enable6:{bit:6,isEnable:false,content:'过温'},
            },
            errorEnable:{
                enable1:{bit:0,isEnable:false,content:'过流'},
                enable2:{bit:1,isEnable:false,content:'过压'},
                enable3:{bit:2,isEnable:false,content:'欠压'},
                enable4:{bit:4,isEnable:false,content:'过载'},
                enable5:{bit:5,isEnable:false,content:'电量'},
                enable6:{bit:6,isEnable:false,content:'过温'},
                enable7:{bit:11,isEnable:false,content:'电弧'},
            },
            timer1:{
                    task:'',
                    cycle:'',
                    state:'',
                    year:-1,
                    month:-1,
                    day:-1,
                    weekday:-1,
                    hour:-1,
                    minute:-1
                },
            timer2:{
                    task:'',
                    cycle:'',
                    state:'',
                    year:-1,
                    month:-1,
                    day:-1,
                    weekday:-1,
                    hour:-1,
                    minute:-1
                },
            timer3:{
                    task:'',
                    cycle:'',
                    state:'',
                    year:-1,
                    month:-1,
                    day:-1,
                    weekday:-1,
                    hour:-1,
                    minute:-1
                },
            timer4:{
                    task:'',
                    cycle:'',
                    state:'',
                    year:-1,
                    month:-1,
                    day:-1,
                    weekday:-1,
                    hour:-1,
                    minute:-1
                },
            voltageLimtRstEnable:false,
            valueSetting:{
                IH_P:0,
                IH:0,
                UH_P:0,
                UH:0,
                UL_P:0,
                UL:0,
                PH_P:0,
                PH:0,
                EH_P:0,
                EH:0,
                IL_P:0,
                IL:0,
                TH_P:0,
                TH:0,
                UHL_CT:0,
                UHL_RT:0,
                IH_PH_CT:0,
            }
        }
    },
    mounted(){
        send(beanMap.GetSwitchSetting,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr})
        setTimeout(()=>{
            console.log('打开开关轮询')
            send(beanMap.SwitchLoopOn,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr})
        },500)
        //清空对应store，触发watch
        this.$store.commit('response/ClearSwitchDetailValue',this.deviceId+'|'+this.addr)
    },
    unmounted(){
        console.log('关闭开关轮询')
        send(beanMap.SwitchLoopOff,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr})
        //清空对应store，触发watch
        this.$store.commit('response/ClearSwitchDetailValue',this.deviceId+'|'+this.addr)
    },
    computed:{
        switchSetting(){
            let key=this.deviceId+'|'+this.addr
            let setting=this.$store.state.response.SwitchSettingMap.get(key)
            if(setting!=null){
                return setting
            }else{
                return {
                    AlarmEnable:0,
                    ErrorEnable:0,
                    VoltageLimitRstEnable:0,
                    IH_P:0,
                    IH:0,
                    UH_P:0,
                    UH:0,
                    UL_P:0,
                    UL:0,
                    PH_P:0,
                    PH:0,
                    EH_P:0,
                    EH:0,
                    IL_P:0,
                    IL:0,
                    TH_P:0,
                    TH:0,
                    UHL_CT:0,
                    UHL_RT:0,
                    IH_PH_CT:0,
                }
            }  
        },
        timer1Value(){
            return this.getTimer(0)
        },
        timer2Value(){
            return this.getTimer(1)
        },
        timer3Value(){
            return this.getTimer(2)
        },
        timer4Value(){
            return this.getTimer(3)
        },
    },
    watch:{
        'switchSetting.AlarmEnable'(v){
            console.log('watch AlarmEnable ',v)
            this.alarmEnable.enable1.isEnable=SwitchParser.valueChecker(v,0)?true:false
            this.alarmEnable.enable2.isEnable=SwitchParser.valueChecker(v,1)?true:false
            this.alarmEnable.enable3.isEnable=SwitchParser.valueChecker(v,2)?true:false
            this.alarmEnable.enable4.isEnable=SwitchParser.valueChecker(v,4)?true:false
            this.alarmEnable.enable5.isEnable=SwitchParser.valueChecker(v,5)?true:false
            this.alarmEnable.enable6.isEnable=SwitchParser.valueChecker(v,6)?true:false
        },
        'switchSetting.ErrorEnable'(v){
            console.log('watch ErrorEnable ',v)
            this.errorEnable.enable1.isEnable=SwitchParser.valueChecker(v,0)?true:false
            this.errorEnable.enable2.isEnable=SwitchParser.valueChecker(v,1)?true:false
            this.errorEnable.enable3.isEnable=SwitchParser.valueChecker(v,2)?true:false
            this.errorEnable.enable4.isEnable=SwitchParser.valueChecker(v,4)?true:false
            this.errorEnable.enable5.isEnable=SwitchParser.valueChecker(v,5)?true:false
            this.errorEnable.enable6.isEnable=SwitchParser.valueChecker(v,6)?true:false
            this.errorEnable.enable7.isEnable=SwitchParser.valueChecker(v,11)?true:false
        },
        'switchSetting.VoltageLimitRstEnable'(v){
            console.log('watch VoltageLimitRstEnable ',v)
            if(v==0){
                this.voltageLimtRstEnable= false
            }else if(v==1){
                this.voltageLimtRstEnable= true
            }else{
                this.voltageLimtRstEnable= false
            }
        },
        'switchSetting.IH_P'(v){
            console.log('watch IH_P ',v)
            this.valueSetting.IH_P=v
        },
        'switchSetting.IH'(v){
            console.log('watch IH ',v)
            this.valueSetting.IH=v
        },
        'switchSetting.UH_P'(v){
            console.log('watch UH_P ',v)
            this.valueSetting.UH_P=v
        },
        'switchSetting.UH'(v){
            console.log('watch UH ',v)
            this.valueSetting.UH=v
        },
        'switchSetting.UL_P'(v){
            console.log('watch UL_P ',v)
            this.valueSetting.UL_P=v
        },
        'switchSetting.UL'(v){
            console.log('watch UL ',v)
            this.valueSetting.UL=v
        },
        'switchSetting.PH_P'(v){
            console.log('watch PH_P ',v)
            this.valueSetting.PH_P=v
        },
        'switchSetting.PH'(v){
            console.log('watch PH ',v)
            this.valueSetting.PH=v
        },
        'switchSetting.EH_P'(v){
            console.log('watch EH_P ',v)
            this.valueSetting.EH_P=v
        },
        'switchSetting.EH'(v){
            console.log('watch EH ',v)
            this.valueSetting.EH=v
        },
        'switchSetting.IL_P'(v){
            console.log('watch IL_P ',v)
            this.valueSetting.IL_P=v
        },
        'switchSetting.IL'(v){
            console.log('watch IL ',v)
            this.valueSetting.IL=v
        },
        'switchSetting.TH_P'(v){
            console.log('watch TH_P ',v)
            this.valueSetting.TH_P=v
        },
        'switchSetting.TH'(v){
            console.log('watch TH ',v)
            this.valueSetting.TH=v
        },
        'switchSetting.UHL_CT'(v){
            console.log('watch UHL_CT ',v)
            this.valueSetting.UHL_CT=v
        },
        'switchSetting.UHL_RT'(v){
            console.log('watch UHL_RT ',v)
            this.valueSetting.UHL_RT=v
        },
        'switchSetting.IH_PH_CT'(v){
            console.log('watch IH_PH_CT ',v)
            this.valueSetting.IH_PH_CT=v
        },
        timer1Value(v){
            this.timer1=v
        },
        timer2Value(v){
            this.timer2=v
        },
        timer3Value(v){
            this.timer3=v
        },
        timer4Value(v){
            this.timer4=v
        },
    },
    methods:{
        switchInfo1(){
            let key=this.deviceId+'|'+this.addr
            let switchRuntime=this.$store.state.response.SwitchRuntimeMap.get(key)
            if(switchRuntime!=null){
                let msg='总电量['+switchRuntime.Energy_pt+']'+
                '预警状态['+SwitchParser.alarmStateParser(switchRuntime.AlarmState)+']'+'故障状态['+SwitchParser.errorStateParser(switchRuntime.ErrorState)+']'+
                '开关状态['+SwitchParser.stateParser(switchRuntime.SwitchState)+']'+'开关模式['+SwitchParser.modeParser(switchRuntime.SwitchMode)+']'+
                '电压有效值['+switchRuntime.Rms_u+']'+'电流有效值['+switchRuntime.Rms_i+']'+'有功功率['+switchRuntime.Power_p+']'+'无功功率['+switchRuntime.Power_q+']'+
                '功率因数['+switchRuntime.Pf+']'+'温度['+switchRuntime.Temperature+']'
                return msg
            }else{
                return '没有数据'
            }
        },
        dialogContent(btn){
            this.btnIndex=btn
            this.dialogVisible=true
            switch(btn){
                case 1:
                    this.dialogDescription='是否进行漏电测试？'
                    break
                case 2:
                    {
                        let content=''
                        for(let k in this.alarmEnable){
                            let o=this.alarmEnable[k]
                            if(o.isEnable){
                                content+='|'+o.content
                            }
                        }
                        this.dialogDescription='是否开启故障预警？启用功能:'+content
                    }
                    break
                case 3:
                    {
                        let content=''
                        for(let k in this.errorEnable){
                            let o=this.errorEnable[k]
                            if(o.isEnable){
                                content+='|'+o.content
                            }
                        }
                        this.dialogDescription='是否开启故障保护？启用功能:'+content
                    }
                    break
                case 4:
                    {
                        let taskContent=''
                        let cycleContent=''
                        let stateContent=''
                        let tmp=this.timer1
                        for(let o of this.timerSetting.task){
                            if(o.value==tmp.task){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.cycle){
                            if(o.value==tmp.cycle){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.state){
                            if(o.value==tmp.state){
                                taskContent=o.label
                            }
                        }
                        this.dialogDescription='是否设置定时器1？'+'任务:'+taskContent+'周期'+cycleContent+'操作'+stateContent+
                        '年'+tmp.year+'月'+tmp.month+'日'+tmp.day+'星期日'+tmp.weekday+'小时'+tmp.hour+'分钟'+tmp.minute
                    }
                    break
                case 5:
                    {
                        let taskContent=''
                        let cycleContent=''
                        let stateContent=''
                        let tmp=this.timer2
                        for(let o of this.timerSetting.task){
                            if(o.value==tmp.task){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.cycle){
                            if(o.value==tmp.cycle){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.state){
                            if(o.value==tmp.state){
                                taskContent=o.label
                            }
                        }
                        this.dialogDescription='是否设置定时器2？'+'任务:'+taskContent+'周期'+cycleContent+'操作'+stateContent+
                        '年'+tmp.year+'月'+tmp.month+'日'+tmp.day+'星期日'+tmp.weekday+'小时'+tmp.hour+'分钟'+tmp.minute
                    }
                    break
                case 6:
                    {
                        let taskContent=''
                        let cycleContent=''
                        let stateContent=''
                        let tmp=this.timer3
                        for(let o of this.timerSetting.task){
                            if(o.value==tmp.task){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.cycle){
                            if(o.value==tmp.cycle){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.state){
                            if(o.value==tmp.state){
                                taskContent=o.label
                            }
                        }
                        this.dialogDescription='是否设置定时器3？'+'任务:'+taskContent+'周期'+cycleContent+'操作'+stateContent+
                        '年'+tmp.year+'月'+tmp.month+'日'+tmp.day+'星期日'+tmp.weekday+'小时'+tmp.hour+'分钟'+tmp.minute
                    }
                    break
                case 7:
                    {
                        let taskContent=''
                        let cycleContent=''
                        let stateContent=''
                        let tmp=this.timer4
                        for(let o of this.timerSetting.task){
                            if(o.value==tmp.task){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.cycle){
                            if(o.value==tmp.cycle){
                                taskContent=o.label
                            }
                        }
                        for(let o of this.timerSetting.state){
                            if(o.value==tmp.state){
                                taskContent=o.label
                            }
                        }
                        this.dialogDescription='是否设置定时器4？'+'任务:'+taskContent+'周期'+cycleContent+'操作'+stateContent+
                        '年'+tmp.year+'月'+tmp.month+'日'+tmp.day+'星期日'+tmp.weekday+'小时'+tmp.hour+'分钟'+tmp.minute
                    }
                    break
                case 8:
                    this.dialogDescription='是否设置过欠压恢复开启？'
                    break
                case 9:
                    this.dialogDescription='是否设置电流预警保护值？'
                    break
                case 10:
                    this.dialogDescription='是否设置限定电流保护值？'
                    break
                case 11:
                    this.dialogDescription='是否设置过压预警值？'
                    break
                case 12:
                    this.dialogDescription='是否设置过压保护值？'
                    break
                case 13:
                    this.dialogDescription='是否设置欠压预警值？'
                    break
                case 14:
                    this.dialogDescription='是否设置过压保护值？'
                    break
                case 15:
                    this.dialogDescription='是否设置限定功率预警值？'
                    break
                case 16:
                    this.dialogDescription='是否设置限定功率保护值？'
                    break
                case 17:
                    this.dialogDescription='是否设置剩余电量预警值？'
                    break
                case 18:
                    this.dialogDescription='是否设置漏电流预警值？'
                    break
                case 19:
                    this.dialogDescription='是否设置漏电流保护值？'
                    break
                case 20:
                    this.dialogDescription='是否设置过温预警值？'
                    break
                case 21:
                    this.dialogDescription='是否设置过温保护值？'
                    break
                case 22:
                    this.dialogDescription='是否设置过欠压动作时间？'
                    break
                case 23:
                    this.dialogDescription='是否设置过欠压恢复时间？'
                    break
                case 24:
                    this.dialogDescription='是否设置电流功率动作时间？'
                    break
            }
        },
        dialogConfirm(){
            this.dialogVisible=false
            this.dialogDescription=''
            switch(this.btnIndex){
                case 1:
                    send(beanMap.SwitchElectricLeakageTest,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr})
                    break
                case 2:
                    {
                        let enables=[]
                        for(let k in this.alarmEnable){
                            let o=this.alarmEnable[k]
                            if(o.isEnable){
                                enables.push(o.bit)
                            }
                        }
                        send(beanMap.SwitchAlarmEnable,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Enables:enables})
                    }
                    break
                case 3:
                    {
                        let enables=[]
                        for(let k in this.errorEnable){
                            let o=this.errorEnable[k]
                            if(o.isEnable){
                                enables.push(o.bit)
                            }
                        }
                        send(beanMap.SwitchErrorEnable,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Enables:enables})
                    }
                    break
                case 4:
                    {
                        this.sendTimer(this.timer1,0)
                    }
                    break
                case 5:
                    {
                        this.sendTimer(this.timer2,1)
                    }
                    break
                case 6:
                    {
                        this.sendTimer(this.timer3,2)
                    }
                    break
                case 7:
                    {
                        this.sendTimer(this.timer4,3)
                    }
                    break
                case 8:
                    send(beanMap.VoltageLimtRstEnable,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Enable:this.voltageLimtRstEnable})
                    break
                case 9:
                    send(beanMap.IHP,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.IH_P})
                    break
                case 10:
                    send(beanMap.IH,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.IH})
                    break
                case 11:
                    send(beanMap.UHP,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.UH_P})
                    break
                case 12:
                    send(beanMap.UH,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.UH})
                    break
                case 13:
                    send(beanMap.ULP,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.UL_P})
                    break
                case 14:
                    send(beanMap.UL,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.UL})
                    break
                case 15:
                    send(beanMap.PHP,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.PH_P})
                    break
                case 16:
                    send(beanMap.PH,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.PH})
                    break
                case 17:
                    send(beanMap.EHP,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.EH_P})
                    break
                case 18:
                    send(beanMap.ILP,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.IL_P})
                    break
                case 19:
                    send(beanMap.IL,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.IL})
                    break
                case 20:
                    send(beanMap.THP,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.TH_P})
                    break
                case 21:
                    send(beanMap.TH,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.TH})
                    break
                case 22:
                    send(beanMap.UHLCT,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.UHL_CT})
                    break
                case 23:
                    send(beanMap.UHLRT,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.UHL_RT})
                    break
                case 24:
                    send(beanMap.IHPHCT,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,Value:this.valueSetting.IH_PH_CT})
                    break
            }

        },
        parseTimer(o){
            let result={}
            result.task=''+o.Type
            result.cycle=''+o.Cycle
            result.state=''+o.State
            switch (o.Cycle){
                case 0:
                    {
                        let date=new Date(o.Timer.Timestamp*1000)
                        result.year=date.getFullYear()
                        result.month=date.getMonth()+1
                        result.day=date.getDate()
                        result.hour=date.getHours()
                        result.minute=date.getMinutes()
                        result.weekday=-1
                    }
                    break
                case 1:
                    result.year=-1
                    result.month=-1
                    result.day=-1
                    result.hour=o.Timer.Hour
                    result.minute=o.Timer.Minute
                    result.weekday=-1
                    break
                case 2:
                    result.year=-1
                    result.month=-1
                    result.day=-1
                    result.hour=o.Timer.Hour
                    result.minute=o.Timer.Minute
                    result.weekday=o.Timer.WeekDay
                    break
                case 3:
                    result.year=-1
                    result.month=-1
                    result.day=o.Timer.Day
                    result.hour=o.Timer.Hour
                    result.minute=o.Timer.Minute
                    result.weekday=-1
                    break
            }
            return result
        },
        getTimer(group){
            let key=this.deviceId+'|'+this.addr+'|'+group
            let timerResponse=this.$store.state.response.SwitchTimerMap.get(key)
            if(timerResponse!=null){
                return this.parseTimer(timerResponse)
            }else{
                return {
                    task:'',
                    cycle:'',
                    state:'',
                    year:-1,
                    month:-1,
                    day:-1,
                    weekday:-1,
                    hour:-1,
                    minute:-1
                }
            }
        },
        sendTimer(tmp,index){
            let timestamp=Date.UTC(tmp.year,tmp.month-1,tmp.day,tmp.hour,tmp.minute,0)/1000
            send(beanMap.SetTimer,{Heartbeat:this.heartbeat,DeviceId:this.deviceId,Product:this.product,Addr:this.addr,
                Group:index,Task:parseInt(tmp.task),Cycle:parseInt(tmp.cycle),State:parseInt(tmp.state),
                Timestamp:timestamp,Minute:tmp.minute,Hour:tmp.hour,WeekDay:tmp.weekday,Day:tmp.day
            })
        },
        debug(){
            console.log('****************************************************')
            console.log('timer1value ',JSON.stringify(this.timer1Value))
            console.log('timer1 ',JSON.stringify(this.timer1))
            console.log('switchSetting ',JSON.stringify(this.switchSetting))
            console.log('valueSetting ',JSON.stringify(this.valueSetting))
            console.log('alarmenable ',JSON.stringify(this.alarmEnable))
            console.log('errorenable ',JSON.stringify(this.errorEnable))
            console.log('****************************************************')
        },
    }
}
</script>

<style lang="stylus" scoped>
.dialog-footer
    margin-right 10px
    display inline
</style>