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
                  <el-button size="small" type="primary" @click="submitUpload"  >导入</el-button>
                </el-upload>
            <el-button size="small" type="primary" @click="exportData"  style="margin-top: 20px;" >导出</el-button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'layerSelect',
    // props:
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
        fileList: [],
        
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
          // this.importdialog=true
      },
       // 导入数据
       uploadSectionFile(item){
        //  console.log("导入的数据",item,process.env.VUE_APP_BASE_API+this.uploadUrl)
           const fileObj = item.file;
        // FormData 对象
          const form = new FormData();
          // 文件对象
          form.append('file', fileObj);  
         this.$axios({
            method: 'post',
            url: 'http://192.168.1.36:8093/'+this.uploadUrl,
            // url: 'http://127.0.0.1:8093/'+this.uploadUrl,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: form,
          }).then((res) => {
            // console.log("返回数据：",res);
            //  console.log("返回数据状态码：",res.data.error);
            if(res.data.error==0){
              //  this.$message.success('成功导入船舶离线数据' + '!');
               this.$alert('成功导入1条船舶离线数据!');
              //  this.$message({
              //   type: 'success',
              //   message: '成功导入船舶离线数据!',
              //   offset:500
              // });
              // this.$notify({
              //   type: 'success',
              //   message: '成功导入1条船舶离线数据!'
              //   //  duration: 0
              //   //  position: 'bottom-left' 默认右上角
              // });
            }
          });
      } ,  
      selectClick(item,index) {
        console.log('selectClick',item)
				if(!item.isShow) {   // 判断是否有isShow属性
					this.$set(item,'isShow',false)  // 没有则为当前对象设置该属性为false
					item.isShow = !item.isShow
				}else {
					item.isShow = !item.isShow
        }
         this.$emit('layerSelect',item)
			},  
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
       /*display: flex;*/
       /*justify-content: space-around;*/
       margin: 50px;
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
