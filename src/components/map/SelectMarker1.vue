<template>
    <div>
      
 <!--     标绘区域显示-->
            <!-- <div id="groupView"> -->
              <!-- <el-dialog    :visible.sync="showGroupView"
                        width="23%"
                        :append-to-body="true">  -->
                <!-- <div class="groupViewTitle">
                    <div>
                        <p>标绘区域</p>
                        <span @click="showGroupView=false">X</span>
                    </div>
                </div>

                <div class="groupViewMain">
                    <div class="mainTitle"><p>全部区域设置 （<span>{{areaLength}}个</span>）</p>
                        <el-radio-group v-model="showOrHide" style="margin-top: -1rem; margin-left: 1rem;" @change="showAllArea">
                            <el-radio-button label="1">显示</el-radio-button>
                            <el-radio-button label="0">隐藏</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="line"></div>
                    
                    <div class="mainContent">
                        <group-tree @openDrawView="openDrawView" :map="map" :groupData="groupData"
                                    @allowDrop="allowDrop" @updateGroupName="updateGroupName" @isFocus="isFocus"
                                    :areaData="areaData" ref="groupTree" @removeArea='removeArea'></group-tree>
                     
                    </div>
                </div> -->
                  <!-- </el-dialog> -->
            <!-- </div> -->
          

   <!-- 添加分组界面-->
            <!-- <div id="addGroup" ref="addGroup">
                <div class="groupViewTitle">
                    <div>
                        <p>导入数据</p>
                        <span @click="showAddGroup=false">X</span>
                    </div>
                </div>
                <div class="groupViewMain">
                    <div class="addGroupItem"><span>分组名称:</span>
                        <el-input v-model="groupName"></el-input>
                    </div>
                    <div class="addGroupItem">
                        <el-button
                                @click="groupName='',showAddGroup=false" style="width: 75px!important;">
                            取消
                        </el-button>
                        <el-button type="primary" @click="addGroup" style="width: 75px!important;">保存</el-button>
                    </div>
                </div>
            </div> -->
             <!--            区域绘制-->
            <!-- <div id="drawView">
                <div class="drawTitle groupViewTitle">
                    <div>
                        <p>区域绘制</p>
                        <span @click="closeDraw">X</span>
                    </div>
                </div>
                <div class="DrawMain">
                    <el-form label-position="left" :rules="formRules" status-icon label-width="80px" ref="ruleForm"
                             :model="drawData">
                        <div class="drawItem"><span>形状:</span>
                            <p v-for="(item,index) in DrawType" :key="index" :class="{'acitve':index==isDrawType}"
                               @click="drawArea(item.value,index)">{{item.label}}</p></div>
                        <el-row>
                            <el-col :span="15">
                                <el-form-item label="名称:" prop="name" label-width="60px">
                                    <el-input class="nameInput" v-model="drawData.name"
                                              ref="nameInput" size="medium "/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                       
                        <el-row>
                        </el-row>
                        <el-row>
                            <el-col :span="15">
                                <el-form-item label="描述:" label-width="60px">
                                    <el-input v-model="drawData.description"
                                              type="textarea"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="drawItem" v-show="drawData.positions[0]"><span>+新增点</span>
                            <div class="drawRadius drawPos" v-show="drawData.radius">
                                <input v-model="drawData.radius"/>
                                <p>半径</p>
                            </div>
                            <div class="drawPos" v-for="(pos,index) in drawData.positions[0]" :key="index">
                                <span>{{index+1}}.</span><input v-model="pos.lng"/>
                                <p>经度</p> <input v-model="pos.lat"/>
                                <p>纬度</p>
                            </div>
                        </div>
                        <div class="drawItem">
                            <el-button
                                    @click="closeDraw">
                                取消
                            </el-button>
                            <el-button type="primary" @click="subDraw('ruleForm')">确认</el-button>
                        </div>
                    </el-form>
                </div>
            </div> -->
    </div>
</template>

<script>
import groupTree from '../groupTree.vue'
import { formRules } from '../../utils/formRules'
  export default {
    name: 'SelectMarker1',
    components:{
       'group-tree': groupTree,
    },
    model:{
      prop:'zoom',
      event:'change',
    },
    props:{
      zoom:{
        type:Number,
        default:10
      },
      ship:{
        type:Number,
        default:0
      },
    },
    watch:{
      ship(val){
        this.ship=val
      }
    },

    data(){
      return{
        drawData: {
          lever: '1',
          name: '',
          description: '',
          centerx: '',
          centery: '',
          radius: '',
          positions: [],
          groupId: ''
        },
        DrawType: [{ label: '圆', value: 1 }, { label: '矩形', value: 2 }, { label: '多边形', value: 3 }],
        showGroupView: true,//是否展示绘制分组界面
        showAddGroup: false,//是否展示添加分组界面
        groupName: '',//添加分组界面分组名称
        groupData: [],
        currentDraw: {},//当前绘制的图形
        currentDrawLabel: {},//当前绘制的图形的文字信息
        areaData: [],
        areaLength: 0,
        showOrHide: 1,
        formRules: formRules,
      }
    },
    methods:{
      // ares(i){
      //   i.is=!i.is
      //   console.log("选中点击",i)
      //   this.$emit('selectMarker1',i)
      //   this.$emit('openDrawView', true)
      // },
      openDrawView(){
        // this.$emit('openDrawView', true)
      },
      allowDrop(data) /*拖拽 移动分组*/ {

        this.service.post('/region/updateRegionGroup', {
          'id': data.id,
          'groupId': data.groupId
        }).then(req => {
          console.log(req)

        })
      },
    }
  }
</script>

<style scoped lang="less">
    /*          区域分组显示        */
    #groupView {
        right: 50px !important;
        top: 10% !important;
        display: flex;
        width: 350px;
        height: 691px;
        /*background: white;*/
        background: #305071;
        flex-flow: column;
    }

    .groupViewTitle {

        color: white;
        background: #2770D4;
        width: 100%;
        height: 40px;
    }

    .groupViewTitle div {

        padding: 10px;
    }

    .groupViewTitle p {
        display: inline;
    }

    .groupViewTitle span {

        cursor: pointer;
        float: right;
        font-size: 18px;
    }

    .groupViewMain {
        padding: 15px;
        // background: #305071;
        background: white;
    }
    .groupViewMain /deep/.el-input__inner{
        background: transparent;
        color: white;
    }

    .groupViewMain p {
        display: inline;
        color: black;
    }

    .groupViewMain p span:nth-child(1) {
        color: #5586f9;
    }
    .mainTitle{
      margin: 1rem auto;
    border-bottom: 3px solid #b8b7b7;
    padding-bottom: 1rem;
    }
    .mainTitle .el-radio-button:first-child .el-radio-button__inner {
        margin-top: 1rem;
        width: 40px;
        height: 30px;
        padding: 0;
        line-height: 30px;
        font-size: .5rem;
    }

    .mainTitle .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        margin-top: 1rem;
        width: 40px;
        height: 30px;
        padding: 0;
        line-height: 30px;
        font-size: .5rem;
    }

    .mainTitle .el-radio-button:last-child .el-radio-button__inner {
        width: 40px;
        height: 30px;
        padding: 0;
        line-height: 30px;
        font-size: .5rem;
        margin-top: 1rem;
    }
     /*添加分组界面*/
    #addGroup {
        right: 170px !important;
        top: 13% ;
        display: flex;
        width: 350px;
        height: 200px;
        background: #ffffff;
        flex-flow: column;
    }

    #addGroup .addGroupItem .el-input__inner {
        width: 60%;
        height: 30px;

    }

    #addGroup .addGroupItem:first-child {
        display: flex;
        justify-content: center;
        text-align: center;
        margin-top: 1rem;
    }

    #addGroup .addGroupItem:last-child {
        margin-top: 2rem;
        /*display: flex;*/
        text-align: center;
    }

    #addGroup .addGroupItem span {

        /*width: 40%;*/
        height: 30px;
        line-height: 30px;
        text-align: right;
        /*margin-right: 1rem;*/
    }

    #addGroup .addGroupItem .el-input {
        width: 60%;
        text-align: left;
        margin-left: 1rem;
    }

    #addGroup .addGroupItem .el-button {

        width: 70px;
        height: 37px;
        line-height: 30px;
        padding: 0;
    }
</style>
