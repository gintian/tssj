<template>
    <div id="editor">
        <div ref="toolbar" class="toolbar">
        </div>
        <div ref="editor" class="text" style="height: 100%">
        </div>
    </div>
</template>
<script>
  import E from 'wangeditor'
  import {emoji} from './emoji'
  export default {
    name: 'editorElem',
    data () {
      return {
        editor: null,
        editorContent: '',
        emoji
      }
    },
    model: {
      prop: 'content',
      event: 'change'
    },
    props: {
      content: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: true
      },
      isClear: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      content (value) {
        // console.log('content',value)
        this.editor.txt.html(this.content)
      },
      isClear(val) {
        // 触发清除文本域内容
        // console.log(val)
        if (val) {
          this.editor.txt.clear()
          this.editorContent = null
        }
      },
      disabled (value) {
        // console.log('disabled',!value)
        this.editor.$textElem.attr('contenteditable', !value)//false==禁用
      },
    },
    mounted () {
      for(let i in this.emoji){
        this.emoji[i].content=[...this.emoji[i].content]
      }
      // console.log(this.emoji)
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        // this.$emit('change', this.editorContent)
      }

      this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
      // this.editor.customConfig.uploadImgServer = 'http://otp.cdinfotech.top/file/upload_images'// 配置服务器端地址
      // this.editor.customConfig.uploadImgHeaders = { }// 自定义 header
      // this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
      // this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      // this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
      // this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
      this.editor.customConfig.menus = [          // 菜单配置
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]

      this.editor.customConfig.emotions = this.emoji

      this.editor.customConfig.linkImgCallback = function (url) {
        // console.log(url) // url 即插入图片的地址
      }


      // 下面是最重要的的方法
      // this.editor.customConfig.uploadImgHooks = {
      //   before: function (xhr, editor, files) {
      //     // 图片上传之前触发
      //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
      //
      //     // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
      //     // return {
      //     //     prevent: true,
      //     //     msg: '放弃上传'
      //     // }
      //   },
      //   success: function (xhr, editor, result) {
      //     // 图片上传并返回结果，图片插入成功之后触发
      //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      //     this.imgUrl = Object.values(result.data).toString()
      //   },
      //   fail: function (xhr, editor, result) {
      //     // 图片上传并返回结果，但图片插入错误时触发
      //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      //   },
      //   error: function (xhr, editor) {
      //     // 图片上传出错时触发
      //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      //   },
      //   timeout: function (xhr, editor) {
      //     // 图片上传超时时触发
      //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      //   },
      //
      //   // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      //   // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      //   customInsert: function (insertImg, result, editor) {
      //     // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
      //     // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
      //
      //     // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
      //     let url = Object.values(result.data)      // result.data就是服务器返回的图片名字和链接
      //     JSON.stringify(url)    // 在这里转成JSON格式
      //     insertImg(url)
      //     // result 必须是一个 JSON 格式字符串！！！否则报错
      //   }
      // }

      this.editor.create()     // 创建富文本实例
      if (!this.content) {
        this.editor.txt.html('请编辑内容1')
      }else{
        this.editor.txt.html(this.content)
      }
    },
    methods:{
      // clear(){
      //   // this.editor.txt.clear()
      //   this.editor.txt.html('')
      // }
    }
  }
</script>
<style lang="less" >
    @media screen and (max-width: 1366px) {
        #editor {
            /deep/ .w-e-toolbar .w-e-menu {
                padding: 5px 6px;
            }
        }
    }
    @media screen and (min-width: 1367px) {
        #editor {
            /deep/ .w-e-toolbar .w-e-menu {
                padding: 5px 10px;
            }
        }
    }

    #editor {
        width: 100%;
        height:  calc(100% - 70px);
        /deep/.w-e-text{
            overflow-y: auto!important;
            margin: 1px;
        }
        /*/deep/.w-e-toolbar .w-e-menu{*/
        /*    padding: 5px 6px;*/
        /*}*/
    }
</style>
