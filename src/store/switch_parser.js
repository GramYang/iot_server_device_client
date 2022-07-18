const SwitchParser={}

SwitchParser.stateParser=(state)=>{
    switch (state){
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
}

SwitchParser.isSwitchOpen=(state)=>{
    return state != 0 && state != 2 && state != 4 && state != 6 && state != 8 && state != 10 && state != 11
}

SwitchParser.modeParser=(mode)=>{
    switch(mode){
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
}

SwitchParser.isSwitchLocked=(mode)=>{
    return mode == 1 || mode == 2 || mode == 4
}

SwitchParser.valueChecker=(v,bit)=>{
    return (v >> bit & 1) == 1
}

SwitchParser.hardFaultParser=(hardFault)=>{
    let msgs=[]
    let totalMessage='|'
    if((hardFault &1)==1){
        msgs.push("计量故障");
    }
    if((hardFault>>1 &1)==1){
        msgs.push("漏电故障");
    }
    if((hardFault>>2 &1)==1){
        msgs.push("传动故障");
    }
    if((hardFault>>3 &1)==1){
        msgs.push("合闸状态限位");
    }
    if((hardFault>>4 &1)==1){
        msgs.push("合闸停止限位");
    }
    if((hardFault>>5 &1)==1){
        msgs.push("分闸状态限位");
    }
    if((hardFault>>6 &1)==1){
        msgs.push("分闸停止限位");
    }
    for(let x of msgs){
        totalMessage+=x
        totalMessage+='|'
    }
    return totalMessage
}

SwitchParser.alarmStateParser=(alarm)=>{
    let msgs=[]
    let totalMessage='|'
    if(SwitchParser.valueChecker(alarm,0)){
        msgs.push("过流");
    }
    if(SwitchParser.valueChecker(alarm,1)){
        msgs.push("过压");
    }
    if(SwitchParser.valueChecker(alarm,2)){
        msgs.push("欠压");
    }
    if(SwitchParser.valueChecker(alarm,4)){
        msgs.push("过载");
    }
    if(SwitchParser.valueChecker(alarm,5)){
        msgs.push("电量");
    }
    if(SwitchParser.valueChecker(alarm,6)){
        msgs.push("过温");
    }
    if(SwitchParser.valueChecker(alarm,7)){
        msgs.push("电弧");
    }
    for(let x of msgs){
        totalMessage+=x
        totalMessage+='|'
    }
    return totalMessage
}

SwitchParser.alarmEnableParser=(alarm)=>{
    let msgs=[]
    let totalMessage='|'
    if(SwitchParser.valueChecker(alarm,0)){
        msgs.push("过流");
    }
    if(SwitchParser.valueChecker(alarm,1)){
        msgs.push("过压");
    }
    if(SwitchParser.valueChecker(alarm,2)){
        msgs.push("欠压");
    }
    if(SwitchParser.valueChecker(alarm,4)){
        msgs.push("过载");
    }
    if(SwitchParser.valueChecker(alarm,5)){
        msgs.push("电量");
    }
    if(SwitchParser.valueChecker(alarm,6)){
        msgs.push("过温");
    }
    for(let x of msgs){
        totalMessage+=x
        totalMessage+='|'
    }
    return totalMessage
}

SwitchParser.errorStateParser=(error)=>{
    let msgs=[]
    let totalMessage='|'
    if(SwitchParser.valueChecker(error,0)){
        msgs.push("过流");
    }
    if(SwitchParser.valueChecker(error,1)){
        msgs.push("过压");
    }
    if(SwitchParser.valueChecker(error,2)){
        msgs.push("欠压");
    }
    if(SwitchParser.valueChecker(error,4)){
        msgs.push("过载");
    }
    if(SwitchParser.valueChecker(error,5)){
        msgs.push("电量");
    }
    if(SwitchParser.valueChecker(error,6)){
        msgs.push("过温");
    }
    if(SwitchParser.valueChecker(error,8)){
        msgs.push("短路");
    }
    if(SwitchParser.valueChecker(error,9)){
        msgs.push("漏电");
    }
    if(SwitchParser.valueChecker(error,10)){
        msgs.push("地线");
    }
    if(SwitchParser.valueChecker(error,11)){
        msgs.push("电弧");
    }
    for(let x of msgs){
        totalMessage+=x
        totalMessage+='|'
    }
    return totalMessage
}

SwitchParser.errorEnableParser=(error)=>{
    let msgs=[]
    let totalMessage='|'
    if(SwitchParser.valueChecker(error,0)){
        msgs.push("过流");
    }
    if(SwitchParser.valueChecker(error,1)){
        msgs.push("过压");
    }
    if(SwitchParser.valueChecker(error,2)){
        msgs.push("欠压");
    }
    if(SwitchParser.valueChecker(error,4)){
        msgs.push("过载");
    }
    if(SwitchParser.valueChecker(error,5)){
        msgs.push("电量");
    }
    if(SwitchParser.valueChecker(error,6)){
        msgs.push("过温");
    }
    if(SwitchParser.valueChecker(error,11)){
        msgs.push("电弧");
    }
    for(let x of msgs){
        totalMessage+=x
        totalMessage+='|'
    }
    return totalMessage
}

export default SwitchParser