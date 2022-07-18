<template>
    <h1>登录</h1>
    <el-form :model="loginForm" label-width="120px">
        <el-form-item label="用户名">
            <el-input v-model="loginForm.name" placeholder="输入用户名" clearable/>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password" placeholder="输入密码" clearable/>
        </el-form-item>
        <el-form-item>
            <el-button @click="login">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import requestHttp from '@/net/http.js'
import Cookies from 'js-cookie'
export default {
    data(){
        return{
            loginForm:{
                name:'',
                password:'',
            }
        
        }
    },
    methods:{
        login(){
            requestHttp({url:'/login',method:'post',data:{username:this.loginForm.name,password:this.loginForm.password}})
            .then(res=>{
                console.log('登录响应'+res)
                if(res.status===200){
                    console.log('登录成功'+res.data.message+res.data.token)
                    //保存token到cookie
                    Cookies.set('name',this.loginForm.name,{expires:1})
                    Cookies.set('token',res.data.token,{expires:1})
                    //路由跳转
                    this.$router.push({name:'DeviceList'})
                }
            })
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>