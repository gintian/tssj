<template>
    <div id="selectShipDom">
        <div class="title">
            <h4>自定义规格数据</h4>
            <i class="el-icon-close" @click="$emit('hide')"></i>
        </div>
        <div class="content"  >
              <el-upload
                      class="upload-demo"
                       ref="upload"
                      :http-request="uploadSectionFile" 
                      accept=".xls"
                      multiple
                      :action="uploadUrl"
                      :on-change="handleChange"
                      :file-list="fileList">
                  <el-button size="small" type="primary" @click="submitUpload"  >导入AIS目标</el-button>
                </el-upload>
                <el-upload
                      class="upload-demo"
                       ref="RadarUpload"
                      :http-request="uploadRadarFile" 
                      accept=".xls"
                      multiple
                      :action="uploadRadar"
                      :on-change="handleChange"
                      :file-list="fileRadarList">
                  <el-button size="small" type="primary" @click="RadarUpload"  >导入雷达目标</el-button>
                </el-upload>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'layerSelect',
    model:{
      prop:'zoom',
      event:'change',
    },
    props:{
      
    },
    watch:{
      ship(val){
        this.ship=val
      }
    },

    data(){
      return{
        toastShow: false,
				toastText: '',
        action:'aaa',
        uploadUrl:'ship/pushExcel',
        uploadRadar:'radar/targetPushExcel',
        fileList: [],  
        fileRadarList:[]
      }
    },
    methods:{
        exportData(){
            this.service.get('/ship/excel',{
              responseType: 'blob',
            }).then(res=>{
                // console.log("导出文件",res)
                //  if (res.error === 0) {
                const blob = new Blob([res], {
                type: 'application/ms-excel',
                });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = e => {
                const a = document.createElement('a');
                a.download = '离线船舶数据.xls';
                a.href = e.target.result;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                };
                // }
            })
        },

      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      submitUpload(){
          this.$refs.upload.submit();
      },
      RadarUpload(){
          this.$refs.RadarUpload.submit();
      },
       // 导入AIS数据
       uploadSectionFile(item){
        //  console.log("导入的数据",item,process.env.VUE_APP_BASE_API+this.uploadUrl)
           const fileObj = item.file;
        // FormData 对象
          const form = new FormData();
          // 文件对象
          form.append('file', fileObj);  
          // console.log('baseURL',process.env.VUE_APP_BASE_API)
         this.$axios({
            method: 'post',
            url: 'http://192.168.1.36:8093/'+this.uploadUrl,
            headers: {
              'Content-Type': 'multipart/form-data',
              'my-session':this.$store.getters.getJSESSIONID
            },
            data: form,
          }).then((res) => {
            if(res.data.error==0){
              this.$message({
                  type: 'success',
                  message: res.data.message
              })
            }
          });
      } ,  
      // 导入雷达目标数据
       uploadRadarFile(item){
           const fileObj = item.file;
        // FormData 对象
          const form = new FormData();
          // 文件对象
          form.append('file', fileObj);  
         this.$axios({
            method: 'post',
            url: 'http://192.168.1.36:8093/'+this.uploadRadar,
            headers: {
              'Content-Type': 'multipart/form-data',
              'my-session':this.$store.getters.getJSESSIONID
            },
            data: form,
          }).then((res) => {
            if(res.data.error==0){
              //  this.$message.success('成功导入船舶离线数据' + '!');
              //  this.$alert('成功导入1条船舶离线数据!');
              this.$message({
                  type: 'success',
                  message: res.data.message
              })
            }
          });
      } , 
     
    }
  }
</script>

<style scoped lang="less">
    *{
        margin: 0;
        padding: 0;
    }
#selectShipDom{
    width: 272px;
    height: 220px;
    background: white;
    .title{
        width: 100%;
        height: 46px;
        background: #2770D4;
           display: grid;
        grid-template-columns: 85% 15%;
          h4{
            color: white;
            font-weight: 100;
            font-weight: normal;
            height: 40px;
            font-size: 14px;
            line-height: 46px;
            padding-left: 10px;
            display: inline;
        }
        i{
            color: white;
            cursor: pointer;
            font-size: 20px;
            line-height: 46px;
            float: right;
            margin-right: 10px;
        }
    }
   .content{
       display: flex;
       justify-content: space-around;
       margin: 50px;
   }
   .upload-demo{
     margin-right: 15px;
   }
    .toast {
			position: fixed;
			z-index: 2000;
			left: 50%;
			top: 45%;
			transition: all .5s;
			-webkit-transform: translateX(-50%) translateY(-50%);
			-moz-transform: translateX(-50%) translateY(-50%);
			-ms-transform: translateX(-50%) translateY(-50%);
			-o-transform: translateX(-50%) translateY(-50%);
			transform: translateX(-50%) translateY(-50%);
			text-align: center;
			border-radius: 5px;
			color: #FFF;
			background: rgba(17, 17, 17, 0.7);
			height: 45px;
			line-height: 45px;
			padding: 0 15px;
			max-width: 150px;
		}
}
</style>
