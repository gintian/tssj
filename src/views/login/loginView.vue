<template>
    <div class="login-mian">
        <div class="loginView">

            <div class="content">
                 <h2 class="title">欢迎登录</h2>
                <div>
                    <el-input
                            @keyup.enter.native="loginReq"
                            placeholder="账号"
                            clearable
                            prefix-icon="el-icon-user-solid"
                            v-model="username">
                    </el-input>
                </div>
                <div>
                    <el-input
                            @keyup.enter.native="loginReq"
                            show-password
                            placeholder="密码"
                            prefix-icon="el-icon-s-goods"
                            v-model="password">
                    </el-input>
                </div>
                <div>
                    <el-button @click="loginReq()" :loading="isInLogin" type="primary" style="background:#3A5DDF;margin-top: 55px;">登录</el-button>
                </div>
            </div>
        </div>
        <p class="footer-msg">支持单位：中船（浙江）海洋科技有限公司</p>
    </div>
</template>

<script>
  import { sha512 } from 'js-sha512'
  // import service from '../../tools/request'
  // import {login} from '../../api/user'
  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        isInLogin: false
      }
    },
    mounted() {
      this.$store.dispatch('setUserData', {})
      this.$store.commit('setMenuData', [])
    },
    methods: {
      test1(val) {

        console.log(sha512(val))
      },
      open(e) {
        this.$alert('您输入的用户名/密码不正确，请重新输入', '温馨提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: e
            });
          }
        });
        // this.$notify({
        //   title: '警告',
        //   message: '您输入的用户名/密码不正确，请重新输入',
        //   type: 'warning'
        // });
      },
      loginReq() {
        let _this = this
        this.isInLogin = true
        this.service.post('/user/login', {
          'username': this.username,
          // 'password': sha512(this.password)
           'password': this.password
        }).then(res => {
          console.log("登录返回的数据",res.data)
          if(res.data.error===0){
          this.$store.dispatch('setUserData', res)
          this.$store.commit('setJSESSIONID', res.data.JSESSIONID)
          this.$router.push({ path: '/map' })
          }else if(res.data.error===-1){
            this.isInLogin = false
            this.open(res.data.message)
          } 
        })
      }
    }
  }
</script>

<style scoped lang="less">

@media  screen and (min-width: 750px) and (max-width: 1920px){
  
  .login-mian {
      // background: url("../../assets/login.jpg")  81% -31% ;
      background: url("../../assets/login.jpg") ;
      // height:97.3%;
      height:100%;
      .footer-msg{
              position: absolute;
              bottom: 28px;
              left: 40%;
              color: #B0B0B0;
              font-size: 18px;
        }
    .loginView {   
      .content{
          /*width: auto;*/
          width: 418px;
          padding: 233px 35px 15px 35px;
          background: #fff;
          border: 1px solid #eaeaea;
          box-shadow: 0 0 25px #cac6c6;
          position: absolute;
          // left: 65%;
           left: 65.2%;
          top: 10%;
          height:82.3%;
          h2{
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
            letter-spacing: 1px;
            font-weight: bold;
          }
           h2::after{
                width: 61px;
                  height: 5px;
                  background: #3A5DDF;
                  border-radius: 3px;
                  content: "";
                  position: absolute;
                  top: 263px;
                  left: 178px;
            }
          
          div{
              margin-bottom: 1%;
              /deep/  input::placeholder{
                    color:black;
                    font-weight: bolder;
                    font-size: 14px;
                    position: absolute;
                    top: 16px;
                    left: 12%;
                }
              /deep/.el-input{
                  width: 350px;
                  .el-input__inner{
                      // border: 1px solid rgba(255, 255, 255, 0.15);
                      color: black!important;
                      height: 4rem!important;
                      // line-height: 4rem!important;
                      line-height: 2rem;
                      // font-size: .8rem;
                      // margin-left: 20px;
                      font-size: 16px;
                      border: none;
                      padding-left: 42px;
                      // background: rgba(255, 255, 255, 0.15);
                      border-bottom: 2px solid #b5b6b6;
                  }
                   .el-input__inner:focus{
                        border-bottom: 2px solid #5371e3;
                   }
              }
              /deep/ .el-input__prefix, .el-input__suffix {
                          position: absolute;
                          // top: 11px;
                          top: 3px;
                          -webkit-transition: all .3s;
                          height: 100%;
                          color: #78787a;
                          text-align: center;
                      }
               /deep/  .el-input__icon{
                        font-size: 18px;
                      }
              /deep/.el-button{
                  width: 350px!important;
                  height: 3rem!important;
                  font-size: 1.1rem;
                  box-shadow: 4px 10px 5px #d9e2f9;
              }
          }
      }
    }
  }
}
</style>
