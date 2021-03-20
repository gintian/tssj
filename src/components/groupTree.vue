<template>
    <div class="custom-tree-container">
        <div class="tree-block">
            <div class="tree_filter">
                <el-input
                        placeholder="请输入区域名称搜索"
                        v-model="filterText"
                        :input="valueChange">
                </el-input>

                <span @click="openDrawView" class="selectAdd">+</span></div>
                <el-upload
                      class="upload-demo"
                      :http-request="uploadSectionFile"
                      accept=".xls"
                      multiple
                      :action="uploadUrl"
                      :on-change="handleChange"
                      :file-list="fileList">
                  <el-button size="small" type="primary" @click="submitUpload"  >导入</el-button>
                </el-upload>
          </div>

         <el-dialog
                :visible.sync="importdialog"
                custom-class="importdialog"
                width="40%"
                title="导入数据"
                :append-to-body="true">
             <div class="importcontent">
                      <el-table
                          :data="tableData"
                          style="width: 100%"
                          :header-cell-style="tableHeaderColor">
                          <el-table-column
                              v-for="(item,index) in tableTop"
                              :key="index"
                              :prop="item.prop"
                              :label="item.name"
                              >
                          </el-table-column>
                           <el-table-column  label="海域点位" prop="points" width="160">
                              <template slot-scope="props">
                              <span v-for="real in props.row.points" :key="real.index">纬度：{{real.lat}},经度：{{real.lon}}；</span>
                            </template>
                          </el-table-column>
                          <el-table-column key='7' prop="opr" label="操作" align="center">
                              <template slot-scope="scope">
                                <el-button
                                  type="text" size="small" class="btn-upt" @click="handleUpdate(scope.row,index)"   v-show="tableData[scope.row.id].show"  >导入</el-button>

                                <el-button
                                  type="text" size="small" class="btn-upt" @click="handleDel(scope.row)"  v-show="tableData[scope.row.id].show"  >删除</el-button>

                                   <h3   v-show="!tableData[scope.row.id].show"   class="btn-upt">√</h3>
                              </template>
                          </el-table-column>
                    </el-table>
                    <el-button  type="primary" size="small" :import='tableData' @click="clickImport()">一键导入</el-button>
              </div>
        </el-dialog>

        <el-tree
                :data="groupData"
                node-key="id"
                ref="tree"
                draggable
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                :render-content="renderContent"
                :allow-drop="allowDrop"
                @node-drop="handleDrop">
        </el-tree>
        <el-dialog
                :title="areaInfo.label"
                :visible.sync="areaInfo.dialog"
                width="15%"
                :modal='false'>
            <span>备注：{{areaInfo.description}}</span>
            <span slot="footer" class="dialog-footer"></span>
        </el-dialog>


        <el-dialog
                :modal="false"
                title="备注"
                :visible.sync="focusDialog.show"
                width="30%"
                :show-close="false" >
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="focusDialog.des">
            </el-input>
            <span slot="footer" class="dialog-footer">
    <el-button @click="focusDialog.show=false,checkItem.isFocus=false">取 消</el-button>
    <el-button type="primary" @click="subFocus">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
  import mapUtils from '../utils/mapUtils';
  //  import { addPolygon } from '../views/home/mapComponentFactory.js'
  import { wgs84ToBD } from '../utils/coordinateConvert'
  let id = 1000
  export default {
    name: 'groupTree',
    props: {
      map: Object,
      groupData: {
        type: Array,
        default: []
      },
      areaData: {
        type: Array,
        default: []
      },
      areaLayer: {
        type: Object,
      },
    },
    data() {

      const data = [{
        id: 1,
        label: '一级 1',
        isEdit: false,
        // className: "icon_rect",
        children: [{
          id: 4,
          label: '二级 1-1',
          isEdit: false,
          className: 'icon_circle',
          show: true,
          type: 'circle'
        }, {
          id: 9,
          label: '三级 1-1-1',
          isEdit: false,
          className: 'icon_polygon',
          type: 'circle'
        }]
      }, {
        id: 2,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      }, {
        id: 3,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 4,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 5,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 6,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 7,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 8,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 9,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 10,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 11,
        label: '一级 2',
        isEdit: false,
        children: [{
          id: 5,
          label: '二级 2-1',
          show: true,
          isEdit: false,
          type: 'circle'
        }, {
          id: 6,
          label: '二级 2-2', isEdit: false,
          type: 'circle'
        }]
      },{
        id: 3,
        label: '一级 3 ',
        isEdit: false
      }]
      return {
        show:'',
        tableData:[],
        tableTop:[
          { id: 0, prop: 'name', name: '名称',width: ''},
          { id: 1, prop: 'type', name: '类型',width: ''},
          { id: 2, prop: 'level', name: '等级',width: ''},
          { id: 3, prop: 'radius', name: '海域半径',width: ''},
          { id: 4, prop: 'lon', name: '经度',width: ''},
          { id: 5, prop: 'lat', name: '纬度',width: ''}
          // { id: 6, prop: 'points', name: '海域点位',width: ''},
        ],
        importTable:'',
        importdata:'',
        uploadUrl:'water/pushExcel',
        showSearch:false,

      temp:{  //表单字段
        id:'',
        station:'',
        name:'',
        lat:'',
        lon:'',
        range:'',
        status:'',
      },
        dialogDelVisible:false, //删除弹层显隐
        delid:'',
        importdialog:false,
        data: JSON.parse(JSON.stringify(data)),
        labels:[],
        areaInfo:{
          label:'',
          dialog:false,
          description:''
        },
        focusDialog:{
          show:false,
          des:''
        },
         action:'aaa',
        checkItem:{}, //点击关注时当前选中的列
        // groupData: [],
        filterText: '',
         fileList: [],
        areaTypeStyle: {
          1: {
            // color: '#eaeaea',
            color:'black',
            opacity: 0.8,
            fillColor: '#ff3a3d',
            strokeStyle: 'dashed',
            fillOpacity: 0.4
          },
          2: {
            // color: '#eaeaea',
            color:'black',
            opacity: 0.8,
            fillColor: '#FFFC82',
            strokeStyle: 'dashed',
            fillOpacity: 0.4
          },
          3: {
            // color: '#eaeaea',
            color:'black',
            opacity: 0.8,
            fillColor: '#fc923a',
            strokeStyle: 'dashed',
            fillOpacity: 0.4
          }
        }
      }

    },
    watch: {
        // removeArea(val){
        //     console.log('removeArea',val)
        // },
      filterText(val) {
          // console.log("val",val)
          // this.filterText=val
        this.$refs.tree.filter(val)
      },
      groupData(val){
        // console.log('groupData',val)
        this.groupData=val
      },
      areaData(val){
        this.areaData=val
        // console.log('areaData',val)
      },
      areaLayer(val){
        // console.log(val,"val")
        this.areaLayer=val
      },
      tableData(val){
        // console.log(val,"val")

        for(let i in val){
              val[i].id=i
              val[i].show=true
              }
              this.tableData=val
      },

    },

    mounted() {

    },
    updated() {
      // console.log(this.groupData)
      // console.log(this.areaData)
      // this.map.addEventListener('zoomend', (e) => {
      //
      //   let s = 5 / (Math.pow(2, 9)) * Math.pow(2, this.map.getZoom())
      //   console.log(s, this.map.getZoom())
      //
      // })
    },
    methods: {
        valueChange(e){
            console.log('e',e.target.value);
            // this.msg=this.target.value;
        },
    handleUpdate(row,index){
      console.log('handleUpdate',row,index)
      // console.log('this.tableData[row.id]',this.tableData[row.id])
      if(row){
        let [level,type,points,radius,lat,lon]=[row.level,row.type,row.points,row.radius,row.lat,row.lon]
        console.log('level,type',level,type)
         this.service.post( '/water/save',{
              level: level,
              type: type,
              lat:lat,
              lon:lon,
              radius:radius,
              points:points
         }).then(req => {
          console.log("导入的数据",req)
          // console.log("导入数据的状态",req.error)
          if(req.error==0){
            row.show=false
            let _index=-1
            for(let i =0;i< this.tableData.length;i+=1){
               if(this.tableData[i].id===row.id){
                  _index=i
              }
            }
             this.$set(this.tableData,_index,{...row})
          }
        })
      }
    },
    //一键导入
      clickImport(){
        console.log("表格数据",this.tableData)
        for(let i in this.tableData){
          // console.log("i",i)
          if(this.tableData[i].show){
              console.log("tableData",this.tableData[i])
            let [level,type,points,radius,lat,lon]=[this.tableData[i].level,this.tableData[i].type,this.tableData[i].points,this.tableData[i].radius,this.tableData[i].lat,this.tableData[i].lon]
              this.service.post( '/water/save',{
                    level: level,
                    type: type,
                    lat:lat,
                    lon:lon,
                    radius:radius,
                    points:points
              }).then(req => {
                console.log("一键导入的数据",req)
                // console.log("导入的数据",req.error)
                  if(req.error==0){
                      this.tableData[i].show=false;
                        this.$set(this.tableData,i,this.tableData[i])
                      console.log("表格数据更新后",this.tableData);
                  }
              })
          }
        }
      },
          //删除弹层
        handleDel(row){
            console.log('row',row)
            // row.show=false
          //  this.tableData.splice(row.index, 1);
            this.tableData.splice(row.index, 1);
            row.show=false

            //  this.$set(this.tableData,_index,{...row})
          console.log("this.tableData",this.tableData)
        },

       tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #e7f3ff;color: #000;font-weight: 500;'
          }
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
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: form,
          }).then((res) => {

            var importdata=res
            // console.log("接收数据：",importdata);
            // console.log("返回数据：",res.data);
            this.importdialog=true
            this.tableData = res.data.list
            // let t=[JSON.Parse(res.data)]
            // var  tt=this.tableData.split('/',2)

            for(let i in this.tableData){
              this.tableData[i].id=i
              this.tableData[i].show=true
              }
            // console.log("原始excel:",this.tableData)
          });

      } ,
       handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      submitUpload(){
          this.$refs.upload.submit();
          // this.importdialog=true
      },
      ...mapUtils,
      //tree数据拖拽
      allowDrop(draggingNode, dropNode, type) {
        // console.log(draggingNode,dropNode,type)
        //限制首层仅有一个节点，其他节点不可并列+
        if(type!=='inner')return false
        else {
          if(draggingNode.level===1)return false
          else {
            if(dropNode.level===2){
              return false
            }else{
              return  true
            }
          }
        }
        // return true
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log( 'draggingNode',draggingNode, dropType,dropNode);
        this.$emit('allowDrop',{id:draggingNode.data.id,groupId:dropNode.data.id})
      },
      openDrawView() {
        this.$emit('openDrawView', true)
      },


      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      moverView(ev, store, data)/*移动视野*/{
        console.log('move',data)
        // this.map.setView([30.37892927824675,122.19491755725795], 12);
        // this.map.panTo(mp[marker.tp]().pos)
        // let tp={
        //   0:()=>{return}
        // // }
        // let point=[]
        // for(let marker of this.areaData){
        //   if(marker.id===data.id){
        //     // console.log(marker)
        //     // if(marker.type===0){
        //       let bd09Arr=wgs84ToBD(parseFloat(marker.centerLon),parseFloat(marker.centerlat))
        //       point.push(bd09Arr[1], bd09Arr[0])
        //     // }else if(marker.type===1){
        //     //   for (let i of marker.points) {
        //     //     let bd09Arr=wgs84ToBD(parseFloat(marker.centerLon),parseFloat(marker.centerlat))
        //     //     point.push(bd09Arr[1], bd09Arr[0])
        //     //   }
        //     // }else if(marker.type===2){
        //     //   let bd09Arr=wgs84ToBD(parseFloat(marker.centerLon),parseFloat(marker.centerlat))
        //     //   point.push(bd09Arr[1], bd09Arr[0])
        //     // }
        //   }
        // }
        this.map.setView([data.lat,data.lon], 12);
      },
      remove(node, data) /*删除区域*/ {
          // console.log('remove',data)
        // children.splice(index, 1)
        console.log('remove',node,data)
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
          console.log(data)
          if (data.name) {
            console.log('删除区域')
              // console.log('this.',this)
            this.$emit('removeArea', { id: data.id})
          }
          // else {
          //   console.log('删除分组')
          //   // this.$emit('removeArea', { id: data.id, label: data.label, type: 1 })
          // }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })


      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node" style="width:100%">
                        <i class='el-icon-bell' style="width:20px;color:#2770D4;"> &nbsp;</i>
            <span class="tree_node_top" on-click={(ev) => this.moverView(ev, store, data)}> {this.showOrEdit(data)}</span>
            <span class="tree_node_op " style="font-size: 14px;float:right;color:#2770D4;">
                  <i class='el-icon-view' on-click={(ev) => this.showArea(ev, store, data)} style="margin-left:5px"></i>
                  <i class='el-icon-s-claim' style="margin-left:5px"  on-click={(ev) => this.nodeEdit(ev, store, data)}></i>
                  <i class='el-icon-delete' style="margin-left:5px"  on-click={() => this.remove(node, data)}></i>
            </span>
        </span>)
      },
      showOrEdit(data) {
        // console.log('showOrEdit',data)
        if (data.edit) {
          console.log('data.edit',data.edit)
          return (
            <input type="text" class="node_labe" value={data.name}
            // onclick='ship_detail(item)'
                   on-blur={ev => this.edit_sure(ev, data)}/>
          )
        } else {
          return <span class="node_labe">{data.name}</span>
        }
      },
      showOrdHide(data)/* 绘制/隐藏区域   icon 样式*/ {

        // console.log(data.show,'showOrdHide')
        if (data.className) {
          if (data.show) {
            return 'show-icon-view el-icon-view'
          } else {
            return ' el-icon-view'
          }
        } else {
          return ''
        }
      },
      isFocus(data)/* 是否关注 icon 样式*/ {

        // console.log(data.show,'showOrdHide')
        if (data.className) {
          if (data.isFocus) {
            return 'el-icon-star-on show-icon-view'
          } else {
            return 'el-icon-star-off'
          }
        } else {
          return ''
        }
      },
      edit_sure(ev, data) /*失焦事件*/ {
        const $input =
          ev.target.parentNode.parentNode.querySelector('input') ||
          ev.target.parentElement.parentElement.querySelector('input')
        if (!$input) {
          return false
        } else if ($input.value == '') {
          this.$message({
            type: 'error',
            message: '内容不能为空!'
          })
        } else {//赋值value
          console.log(ev)
          if (data.className) {
            console.log('修改区域')
            console.log(data)
            data.label = $input.value
            this.$emit('updateGroupName', { id: data.id, label: data.name, type: 0 })
            data.edit = false
          } else {
            console.log('修改组名')
            data.label = $input.value
            this.$emit('updateGroupName', { id: data.id, label: data.name, type: 1 })
            data.edit = false
          }

          // console.log(data)

        }

      },
      showAllArea(data, type)/*显示所有区域*/ {
        // console.log('showAllArea',data,type)
        // i.typeLabel=type[this.areaData.lever]
        // console.log('showAllArea')
        // console.log(data,type)

        // for(let i of this.groupData){ //设置分组的所有区域眼睛icon为亮
        // console.log(i,this.groupData)
        //   if(i.children.length>0){
        //     // area.push(i.children)
        //     for (let j of i.children){
        //       j.show=true
        //       this.labels.push(j)
        //       // console.log(j,'showAllArea')
        //     }

        //   }
        // }
      },
      labelOverlay(data,label) {
        let _this=this;
        let s=5/(Math.pow(2, 9))*Math.pow(2, this.map.getZoom())
        let p=wgs84ToBD(data.centerLon, data.centerlat)

        let style={
          1:'#ff6161',
          2:'#ffd461',
          3:'#ff9661',
        }

        function ComplexCustomOverlay(point, text, mouseoverText) {
          this._point = point
          this._text = text
          this._overText = mouseoverText
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay()
        ComplexCustomOverlay.prototype.initialize = function(map) {
          _this._map = map
          var div = this._div = document.createElement('div')
          div.style.position = 'absolute'
          div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
          div.style.backgroundColor = style[data.lever]
          // div.style.border = '1px solid #BC3B3A'
          div.style.color = 'black'
          div.style.height = "15px"
          // div.style.width = "px"
          div.style.padding = '2px'
          div.style.lineHeight =  "15px"
          div.style.whiteSpace = 'nowrap'
          div.style.MozUserSelect = 'none'
          div.style.fontSize =  "10px"
          var span = this._span = document.createElement('span')
          div.appendChild(span)
          span.appendChild(document.createTextNode(this._text))
          var that = this
          _this.map.getPanes().labelPane.appendChild(div)
          return div
        }
        ComplexCustomOverlay.prototype.draw = function() {
          var map = _this._map
          var pixel = map.pointToOverlayPixel(this._point)
          let s=5/(Math.pow(2, 9))*Math.pow(2, map.getZoom())
          // console.log(s)
          this._div.style.left = pixel.x-25 - 0.55*s + "px";
          this._div.style.top  = pixel.y - 0.78*s  + "px";
          this._div.style.zIndex = "0"
          if(_this.map.getZoom()>10||_this.map.getZoom()<9)/*地图缩放到9级以下 对文字隐藏*/{
            this._div.style.height = "0px"
            this._div.style.lineHeight =  "0px"
            this._div.style.width = "0px"
            this._div.style.fontSize =  "0px"
            this._div.style.padding = '0'
          }else{
            this._div.style.padding = '2px'
            this._div.style.height = s+"px"
            this._div.style.lineHeight = s+"px"
            this._div.style.width = "auto"
            this._div.style.fontSize =  s+"px"
          }
        }
        ComplexCustomOverlay.prototype.addEventListener = function(event,fun){
          this._div['on'+event] = fun;
        }
        var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(p[0], p[1]), label)//data.typeLabel

        // myCompOverlay.imm
        myCompOverlay.tp = 'areaLabel'
        myCompOverlay.mmsi = data.id
        this.map.addOverlay(myCompOverlay)
        myCompOverlay.addEventListener('click',() =>{
          // console.log(label)
          this.areaInfo.dialog=true
          this.areaInfo.label=label
          this.areaInfo.description=data.description
        })
      },
      hideAllArea(data)/*隐藏所有区域*/ {
        //
        // var allOverlay = this.map.getOverlays()
        // // console.log(allOverlay)
        // for (var i = 0; i <= allOverlay.length - 1; i++) {
        //   // console.log('id1:'+allOverlay[i].mmsi)
        //   if (allOverlay[i].tp === 'area'||allOverlay[i].tp==='areaLabel') {
        //     // console.log('id2:'+allOverlay[i].mmsi)
        //     this.map.removeOverlay(allOverlay[i])
        //     // return false;
        //   }
        // }
        //
        // for (let i of this.groupData) {
        //   if (i.children.length > 0) {
        //     // area.push(i.children)
        //     for (let j of i.children) {
        //       j.show = false
        //     }
        //   }
        // }
        // this.groupData[0].children[0].show=true
        // console.log(this.groupData[0].children[0])

        // console.log(area)

      },
      showArea(ev, store, data) {

        console.log('showArea',data)
        // let market = {}
        // const m = {
        //   '0': 'circle',
        //   '1': 'polygon',
        //   '2': 'rectangle'
        // }
        // for (let mark of this.areaData) {
        //   if (mark.id == data.id) {
        //     market = mark
        //     market.tp = m[mark.type]
        //   }
        // }
        // // console.log(market)
        // // console.log(this.map)

        if (data.show) {
          console.log('hide')
        console.log(data)
          this.areaLayer.eachLayer(item=>{
            // console.log(item)
            if(item.signal===('area'+data.id)){
              this.areaLayer.removeLayer(item)
            }
          })
        } else {
          console.log('show')
          console.log(market,data)
          const m = {
            '0': 'circle',
            '1': 'polygon',
            '2': 'rectangle'
          }
          let icon={
            1:' ⛒ ',
            2:' ★ ',
            3:' ✷ ',
          }
          // for (let x of this.watersLevel) {//设置文字内容
          //   if (x.value === market.lever) market.typeLabel = icon[market.lever]+x.name
          // }
          // console.log(i)
          this.createPolygon(m[market.type], market,'area' +market.id,
            this.areaTypeStyle[market.lever]
          )(wgs84ToBD).addTo(this.areaLayer);
        }
        data.show = !data.show
      },
      focusArea(ev, store, data) /*关注区域*/ {
        // const parent = node.parent
        // const children = parent.data.children || parent.data
        // const index = children.findIndex(d => d.id === data.id)
        // children.splice(index, 1)
        console.log(data)
        this.checkItem=data
        if(data.isFocus){

          this.$emit('isFocus',{description:this.focusDialog.des,focus:true,targetType:8,targetSign:this.checkItem.id})
          data.isFocus=false
        }else{
          this.focusDialog.show=true
          // data.isFocus=true
        }

      },
      subFocus(){
        this.$emit('isFocus',{description:this.focusDialog.des,focus:false,targetType:8,targetSign:this.checkItem.id})
        this.checkItem.isFocus=true
        this.focusDialog.show=false
      },
      removeMarker(id) {
        var allOverlay = this.map.getOverlays()
        console.log(allOverlay)
        for (var i = 0; i <= allOverlay.length - 1; i++) {
          // console.log('id1:'+allOverlay[i].mmsi)
          if (allOverlay[i].mmsi === id) {
            // console.log('id2:'+allOverlay[i].mmsi)
            this.map.removeOverlay(allOverlay[i])
            // return false;
          }
        }
      },
      addMarker(marker,data) {
        // console.log('marker',marker)
        const mp = {

          'ship': () => {
            let bd09Arr = wgs84ToBD(parseFloat(this.mapData.longitude), parseFloat(this.mapData.latitude))
            var pt = new BMap.Point(bd09Arr[0], bd09Arr[1])
            var myIcon = new BMap.Icon(require('../assets/mapicon/ship2.png'), new BMap.Size(13, 22))
            var marker = new BMap.Marker(pt, { icon: myIcon })
            marker.setRotation(this.mapData.course)
            return marker
          },
          'point': () => {
            let bd09Arr = wgs84ToBD(parseFloat(this.mapData.longitude), parseFloat(this.mapData.latitude))
            let marker = new BMap.Marker(new BMap.Point(bd09Arr[0], bd09Arr[1]), {
              anchor: new BMap.Size(10, 30)
            })
            return marker
          },
          'polyline': () => {
            var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
              scale: 0.6,//图标缩放大小
              strokeColor: '#fff',//设置矢量图标的线填充颜色
              strokeWeight: '2'//设置线宽
            })
            var icons = new BMap.IconSequence(sy, '10', '30')// 创建polyline对象
            var pois = [
              new BMap.Point(116.350658, 39.938285),
              new BMap.Point(116.386446, 39.939281),
              new BMap.Point(116.389034, 39.913828),
              new BMap.Point(116.442501, 39.914603)
            ]
            var polyline = new BMap.Polyline(pois, {
              enableEditing: false,//是否启用线编辑，默认为false
              enableClicking: true,//是否响应点击事件，默认为true
              icons: [icons],
              strokeWeight: '8',//折线的宽度，以像素为单位
              strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
              strokeColor: '#18a45b' //折线颜色
            })
            return polyline
          },
          'circle': () => {
            let bd09Arr = wgs84ToBD(parseFloat(marker.centerx), parseFloat(marker.centery))
            let points = []
            points.push(new BMap.Point(bd09Arr[0], bd09Arr[1]))
            var circle = new BMap.Circle(new BMap.Point(bd09Arr[0], bd09Arr[1]), marker.radius, { ...this.areaTypeStyle[marker.lever] })
            return { circle, pos: points[0] }
          },
          'polygon': () => {
            let points = []
            for (let i of marker.points) {
              let bd09Arr = wgs84ToBD(parseFloat(i.lon), parseFloat(i.lat))
              points.push(new BMap.Point(bd09Arr[0], bd09Arr[1]))
            }
            var polygon = new BMap.Polygon(points, { ...this.areaTypeStyle[marker.lever] })
            return { polygon, pos: points[0] }
          },
          'rectangle': () => {
            let bd09Arr = wgs84ToBD(parseFloat(marker.lon1), parseFloat(marker.lat1))
            let bd09Arr2 = wgs84ToBD(parseFloat(marker.lon2), parseFloat(marker.lat2))
            let points = []
            points.push(new BMap.Point(bd09Arr[0], bd09Arr[1]))
            var rectangle = new BMap.Polygon([
              new BMap.Point(bd09Arr[0], bd09Arr[1]),
              new BMap.Point(bd09Arr2[0], bd09Arr[1]),
              new BMap.Point(bd09Arr2[0], bd09Arr2[1]),
              new BMap.Point(bd09Arr[0], bd09Arr2[1])
            ],{ ...this.areaTypeStyle[marker.lever] })
            return { rectangle, pos: points[0] }
          }

        }
        // console.log(mp[marker.tp]()[marker.tp],mp[marker.tp]().pos)
        this.map.setZoom(10)
        let mark = mp[marker.tp]()[marker.tp]
        mark.mmsi = marker.id
        mark.tp = 'area'
        mark.addEventListener('click', (e) => {
          console.log('mark')
          this.areaInfo.dialog=true
          this.areaInfo.label=data.label
          this.areaInfo.description=marker.description
        })
        console.log(marker,data)
        this.map.addOverlay(mark)
        this.labelOverlay(marker,marker.name)
        this.map.panTo(mp[marker.tp]().pos)
      },

      nodeEdit(ev, store, data) /*修改区域名称*/ {
          // console.log('ev',ev)
        data.edit = true
        this.$nextTick(() => {//得到input
          const $input =
            ev.target.parentNode.parentNode.querySelector('input') ||
            ev.target.parentElement.parentElement.querySelector('input')

          !$input ? '' : $input.focus()//获取焦点
        })
      },
      editStyle(data)/*未分组隐藏修改按钮*/ {
        if (!data.canUpdate) {
          return ''
        } else {
          return 'el-icon-edit-outline'
        }
      },
      deleteStyle(data)/*未分组隐藏删除按钮*/ {
        if (!data.canUpdate) {
          return ''
        } else {
          return 'el-icon-delete'
        }
      }
    }
  }
</script>

<style scoped lang="less">
/* 操作部分 */
  .btn-upt{
    margin: 0 .5rem 0 0!important;
    color: #0075EE;
    padding-left: 14px;
  }
/deep/.importdialog{
    right: 3%;
    position: absolute;
    top: 5%;
  .el-dialog__header{
     height: 53px;
     line-height: 18px;
    background: #2770D4;
     color: white;
     .el-dialog__title{
        color: white;
     }
    .el-dialog__headerbtn .el-dialog__close {
        color: white;
      }
  }
}

    /deep/ .el-input{
    //   font-size: 14px;
    // display: inline-block;
    }
    /deep/.el-input__inner{
        background: none;
    }
    /deep/.el-tree{
        background: none!important;
        // color: white;
        // color: #eeeeee;

    }
    .custom-tree-container{
        // color: white;
        // color: #eeeeee;
    }
    /deep/.el-tree-node:hover>.el-tree-node__content{
        background: none;
    }
    /deep/.el-tree-node:focus>.el-tree-node__content{
        background: none;
    }
    .custom-tree-container /deep/ .icon_rect {
        background: url("../assets/mapGroup/rect.png") no-repeat;
        /*width: 10px;*/
        /*height: 10px;*/
        display: inline-block;
    }

    .custom-tree-container /deep/  .icon_circle {
        background: url("../assets/mapGroup/circle.png") no-repeat;
        display: inline-block;
    }

    .custom-tree-container /deep/ .icon_polygon {
        background: url("../assets/mapGroup/duo.png") no-repeat;
        display: inline-block;
    }

    .custom-tree-container /deep/  .tree_filter {
        margin-bottom: 1rem;
        height: 30px;
        display: flex;
    }
    .custom-tree-container /deep/  .tree-block{
          display: flex;
    justify-content: space-between;

    }

    .custom-tree-container /deep/ .tree_filter .el-input {
        height: 32px;
    }

    .custom-tree-container /deep/ .tree_filter .el-input .el-input__inner {
        height: 32px;
        line-height: 32px;
        border-radius: 0;
    }

    .custom-tree-container /deep/ .selectAdd {

    text-align: center;
    margin-left: -1px;
    width: 3.2rem;
    display: inline-block;
    height: 33px;
    line-height: 186%;
    border: 1px solid #DCDFE6;
    cursor: pointer;
    color: #999999;
    font-size: 16px;
    font-weight: 900;

    }

    .custom-tree-container /deep/ .show-icon-view {
        color: #4f81f8;
    }
    .custom-tree-container /deep/ .el-tree {
        height: 500px;
        overflow: auto;
    }

</style>
