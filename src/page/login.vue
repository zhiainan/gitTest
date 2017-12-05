<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>rgb后台管理系统</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="phoneNumber">
						<el-input v-model.number="loginForm.phoneNumber" placeholder="登陆手机号"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="手机验证码" v-model="loginForm.password" class="pass_input"></el-input>
                        <div class="pass_show">
                            <span class="send_pass" @click="sendMsg" v-if="isSend">发送验证码</span>
                            <span class="time_surplus" v-else>{{timeShow}}s</span>
                        </div>
					</el-form-item>
                    <el-form-item prop="authImg">
                        <el-input v-model="loginForm.authImg" placeholder="图形验证码" class="img-input"><span>dsfsf</span></el-input>
                        <div class="imgtest" @click="imgClick">
                            <img :src=imgSrc alt="图片验证码">
                        </div>
                    </el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import {login, getAdminInfo,myTest} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'
    const phoneTest = /^1[3|4|7|5|8][0-9]\d{4,8}$/;
	export default {
	    data(){
            let checkPhone = (rule, value, callback) => {//手机号验证
                if(!value) {
                    return callback(new Error('手机号码不能为空'));
                };
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入正确的手机号'));
                    } else {
                        if(!phoneTest.test(value)) {
                            callback(new Error('请输入正确的手机号'));
                        } else {
                            callback();
                            this.isPhone = true;
                        }
                    }
                }, 0);
            };
			return {
				loginForm: {
                    phoneNumber: '',
					password: '',
                    authImg:''
				},
				rules: {
                    phoneNumber: [
			            { validator: checkPhone, trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入手机验证码', trigger: 'blur' }
					],
                    authImg: [
                        { required: true, message: '请输入图形验证码', trigger: 'blur' }
                    ]
				},
				showLogin: false,
                imgSrc:"",
                isPhone:false,
                timeShow:20,
                isSend:true
			}
		},
		mounted(){
            this.showLogin = true;
            var randomNum = this.makeRand();
            this.imgSrc = 'http://premis.mayi.com/common/authimage?random='+randomNum+'&width=130&height=38';
		},
		computed: {
			...mapState(['adminInfo']),
		},
		methods: {
			...mapActions(['getAdminData','getMyInfo']),
			submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        this.$ajax({
                            url: 'http://premis.mayi.com/mis/login.do',
                            method: 'post',
                            data: {
                                phoneNumber: this.loginForm.phoneNumber,
                                password: this.loginForm.password,
                                imagecode:this.loginForm.authImg
                            },
                            transformRequest: [function (data) {
                                let ret = ''
                                for (let it in data) {
                                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                }
                                return ret
                            }],
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then( res => {
                            if(res.data.data.result === 'success') {
                                this.$message({
                                    type: 'success',
                                    message: '登录成功'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.error.message
                                });
                            }

                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: ""
                            });
                        })
                    }
				})
			},
            imgClick() {//点击图片更新验证码
                var randomNum = this.makeRand();
                this.imgSrc = 'http://premis.mayi.com/common/authimage?random='+randomNum+'&width=130&height=38';
            },
            makeRand() {//生成随机数
                var Num="";
                for(var i=0;i<4;i++){
                    Num+=Math.floor(Math.random()*10);
                }
                return Num;
            },
            sendMsg() {//发送手机验证码
                if(!this.isPhone) {
                    return false;
                }
                this.$ajax.get('http://pre.mayi.com/apistore/wxxcx/mobile/authcode',{
                    params:{
                        mobile:this.loginForm.phoneNumber
                    }
                }).then( res => {
                    if(res.data.data.result === 'success') {
                        this.isSend = false;
                        let num = 20;
                        setInterval( () => {
                            num --;
                            this.timeShow = num;
                            if(num <= 0) {
                                return false;
                            }
                        },1000)
                    }
                })
            }
		},
		watch: {
			adminInfo: function (newValue){
                if (newValue.id) {
					this.$message({
                        type: 'success',
                        message: '检测到您之前登录过，将自动登录'
                    });
					this.$router.push('manage')
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page{
		background-color: #324057;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(320px, 210px);
		.ctp(320px, 210px);
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		.submit_btn{
			width: 100%;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
    .pass_input {
        width: 240px;
    }
    .pass_show {
        display: inline-block;
        width: 75px;
        span {
            display: inline-block;
            width: 100%;
            cursor: pointer;
            &.time_surplus {
                background: #8c939d;
            }
        }
    }
    .img-input {
        width: 185px;
    }
    .imgtest {
        display: inline-block;
        width: 130px;
        img {
            width: 100%;
            height: 36px;
            vertical-align: middle;
        }
    }
</style>
