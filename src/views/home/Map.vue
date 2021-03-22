<template>
    <div id="home" style="z-index: 900;">
        <div id="map" ref="map">

        </div>

        <!-- <button @click="pushMessage" style="position: absolute;top: 0%;z-index: 400;right: 8px;width:23px;height:25px;">123</button> -->
        <!-- 统计图标 -->
        <button class="signTitle" style="position: absolute;top: 59%;z-index: 400;right: 8px;width:23px;height:25px;"
                @click="showShipStatistics=!showShipStatistics">
            <img src="../../assets/Statistics.png" alt="">
        </button>
        <!-- 图例图标 -->
        <!-- <button  class="signTitle" style="position: absolute;top: 62%;z-index: 400;right: 8px;width:23px;height:25px;" @click="showMapSign=!showMapSign">
                   <img src="../../assets/example.png" alt="" >
         </button> -->
        <!-- 轨迹线回放 -->
        <div v-if="myMovingMarker" id="myMovingMarker" style=" position: absolute;left:10%; bottom:20%;z-index: 400;">
            <el-button type="warning" plain @click="myMovingMarker.start()">开始</el-button>
            <el-button type="primary" plain @click="myMovingMarker.pause()">暂停</el-button>
            <el-button type="success" plain @click="myMovingMarker.stop()">停止</el-button>
            <el-button type="danger" plain @click="myMovingMarker.resume()">重置</el-button>
            <!-- <el-button type="primary" plain  @click="backMarker.moveTo([48.8567, 2.3508],1000)">快退</el-button> -->
            <!-- <el-button type="success" plain @click="myMovingMarker.stop()">停止</el-button>   -->
        </div>
        <!--    导入离线船只-->
        <div id="import" style=" position: absolute;right:6%; bottom:35%;z-index: 400;" v-drag v-show="showimportexcel">
            <importExcel @hide='showimportexcel=false' close-on-click-modal></importExcel>
        </div>
        <!-- 折叠开关国家船舶列表信息显示-->
        <div id="countrySigns"
             style="position: absolute;top: 8%;z-index: 400;left: 2%;background: #0075EE;width:37px;height:30px;">
            <country-signs @ship_detail='ship_detail'></country-signs>
        </div>
        <!-- 高级搜索框 -->
        <div class="query-input" style="position: absolute;top: 8%;z-index: 400; right: 2%;">
            <el-button type="primary" @click="choosed" style=" box-shadow: 4px 4px 10px #409eff;">
                <i class="el-icon-search" style="margin-right:10px;"></i>高级搜索
            </el-button>
            <div v-drag>
                <el-dialog
                        :visible.sync="searchdialog"
                        custom-class="signdialog"
                        width="27%"
                        :append-to-body="true">
                    <div>
                        <div class="signChild">
                            <button @click="queryName">目标名称</button>
                            <input placeholder="请输入目标名称" v-model="objectname">
                        </div>
                        <div class="signChild">
                            <button @click="queryNumber">目标编号</button>
                            <input placeholder="请输入目标编号" v-model="objectmmsi">
                        </div>
                        <div class="signChild">
                            <button @click="queryData">目标类型</button>
                            <el-select v-model="oshipType" :popper-append-to-body="false">
                                <el-option v-for="item in shipflag" :key="item.id" :value="item.shipType">
                                    {{item.shipType}}
                                </el-option>
                            </el-select>
                        </div>
                        <div class="signChild">
                            <button @click="queryTime">出现时间</button>
                            <span>开始</span>
                            <el-date-picker
                                    v-model="beginTime"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                            <span style="border-left:none;">结束</span>
                            <el-date-picker
                                    v-model="endTime"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="signChild">
                            <button @click="queryArea" :data='objectArea'>出现区域</button>
                            <el-select v-model="type" :popper-append-to-body="false">
                                <el-option v-for="item in objectArea" :key="item.id" :value="item.name"
                                           :type="item.type">
                                    {{item.name}}
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-dialog>
            </div>
            <el-dialog
                    :visible.sync="dialogVisible1"
                    width="20%"
                    custom-class="typedialog"
                    :append-to-body="true">
                <h3>当前所填的目标名称，所对应的船舶有:</h3>
                <ul class="search-result-list">
                    <li class="open-shipdialog" v-for="item in objectnamelist" :key="item.id"
                        @click="ship_detail(item)">{{item}}
                    </li>
                </ul>
            </el-dialog>
            <el-dialog
                    :visible.sync="dialogVisible2"
                    width="20%"
                    custom-class="typedialog"
                    :append-to-body="true">
                <h3>当前所填的目标编号，所对应的船舶有:</h3>
                <ul class="search-result-list">
                    <li class="open-shipdialog" v-for="item in mmsilist" :key="item.id" @click="ship_detail(item)">
                        {{item}}
                    </li>
                </ul>
            </el-dialog>
            <el-dialog
                    :visible.sync="dialogVisible3"
                    custom-class="typedialog"
                    width="20%"
                    :append-to-body="true">
                <!-- 当前所选的目标类型，所对应的船舶有{{typelist}} -->
                <!-- <p v-for="item in typelist"    :key="item"  >
                   {{value}}
                </p> -->
                <h3>当前所选的目标类型，所对应的船舶有:</h3>
                <ul class="search-result-list">
                    <li class="open-shipdialog" v-for="item in typelist" :key="item.id" @click="ship_detail(item)">
                        {{item}}
                    </li>
                </ul>
            </el-dialog>
            <el-dialog
                    :visible.sync="dialogVisible4"
                    width="20%"
                    custom-class="typedialog"
                    :append-to-body="true">
                <!-- <h3>当前时间段内，所对应的船舶:</h3> -->
                <ul class="search-result-list">
                    <li class="open-shipdialog" v-for="item in timelist" :key="item.id" @click="ship_detail(item)">
                        {{item}}
                    </li>
                </ul>
            </el-dialog>
            <el-dialog
                    :visible.sync="dialogVisible5"
                    width="20%"
                    custom-class="typedialog"
                    :append-to-body="true">
                <h3>当前所选的目标区域，返回:</h3>
                <ul class="search-result-list">
                    <li class="open-shipdialog" v-for="item in arealist" :key="item.id" @click="ship_detail(item)">
                        {{item}}
                    </li>
                </ul>
            </el-dialog>
        </div>


        <!--     海量点-->
        <img :src="pointCollectionImg" alt=""
             style="position: fixed;left: 20px;top: 94px;z-index: 400;pointer-events: none;"
             v-show="showPointCollectionImg">
        <!--     地图类型切换-->
        <div class="ButtonGroupDiv" style="position: absolute; right: 30px;bottom: 5%;z-index: 400;">
            <ButtonGroup item1Text='海图' item2Text='卫星图' item3Text='地图' @clickItem='buttonGroupClickItem'/>
        </div>
        <!--       地图图例-->
        <div id="mapSigns" style=" position: absolute;right:8px; bottom:35%;z-index: 400;" v-drag>
            <map-signs></map-signs>
        </div>
        <!--       统计-->
        <div id="Statistics" style=" position: absolute;left:4%; top:8%;z-index: 400;" v-drag
             v-show="showShipStatistics">
            <Statistics :shipList='shipStatistics' @hide='ShipStatistical' close-on-click-modal></Statistics>
        </div>
        <!-- 放大缩小的按钮 -->
        <div id="mapControl" style=" position: absolute;right: 10px; bottom:24%;z-index: 400;">
            <mapControl v-model="mapZoom" @add="map.setZoom(map.getZoom()+1)" @minus="map.setZoom(map.getZoom()-1)"
                        :ship="areaShipData.length"></mapControl>
        </div>
        <!-- 目标等6个图例 -->
        <div style="right: 0%;  top: 15%;  position: absolute;  z-index: 400;  background: #FAFAFA;   border-radius: 10px 0px 0px 10px;"
             ref='dropdown'>
            <Dropdown v-for="(item,index) in dropdownTitleData" @iconClick='dropdownButton' :item='item' :key="index"
                      :title='item.title' :titleIcon='item.icon' :dropdownData='item.dropdownInfoData'
                      @clickItem='' ref="dropDown"/>
        </div>

        <!--      目标筛选选择-->
        <div id="selectMarker" style=" position: absolute;right: 3%; top:9%;z-index: 400" v-drag
             v-show="showObjectSelect">
            <ObjectSelect @ObjectSelect="ObjectSelect" @hide='showObjectSelect=false'
                          close-on-click-modal>
            </ObjectSelect>
        </div>
        <!--      图层筛选选择-->
        <div id="selectMarker2" style=" position: absolute;right: 3%; top:9%;z-index: 400" v-drag
             v-show="showlayerSelect">
            <layerSelect @layerSelect="layerSelect" @hide='showlayerSelect=false' close-on-click-modal></layerSelect>
        </div>
        <!--      图层（筛船）显示 覆盖物图层选择-->
        <div id="selectMarker3" style=" position: absolute;right: 5%; top:20%;z-index: 400;width: 350px" v-drag
             v-show="showSelectMarker">
            <SelectMarker @selectMarker="selectMarker" @hide='showSelectMarker=false'
                          :loadShip="loadShipData"
                          :selecarea="selectAreaData"
                          close-on-click-modal></SelectMarker>
        </div>

        <!-- 船只信息 -->
        <div style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500;" id='ShipDataInfo'
             v-drag v-show="showInfo.ship">
            <ShipInfoView :shipTabObj='dialogInfo.ship'
                          @remove='showInfo.ship=false'
                          @isFocus="infoViewFocus"
                          @is="cancelFocus"
                          @track='shipTrack'
                          @histroy='showInfo.shipHistory=true'
                          @shipDetail='shipDetail'
            />
        </div>
        <!-- 船只详细信息 -->
        <div style="height: auto;width: auto;position: absolute;left: 26%; top:15%;z-index: 500;" id='ShipDetail' v-drag
             v-show="showInfo.shipDetail">
            <ShipDetailView :shipTabObj='dialogInfo.shipDetail'
                            @remove='showInfo.shipDetail=false'
            />
        </div>

        <!-- 船舶跟踪轨迹时间选择 -->
        <div style="height: auto;width: auto;position: absolute;right: 10%; top:45%;z-index: 500;" v-drag
             v-show="showInfo.shipHistory">
            <ShipHistory
                    :targetName="dialogInfo.ship.mmsi"
                    @yes='setShipHistory'
                    @no='animateLayer.clearLayers()'
                    @destroy="()=>{showInfo.shipHistory=false,animateLayer.clearLayers()}"
            />
        </div>

        <!--            船舶密度功能-->
        <!-- <div  id="shipCount"  style="width: 100%;height: 100%;position: absolute;right: 0; top:0;z-index: 400;" v-show="showShipCount" >
            <ShipCount @hide="showShipCount=false" v-model="shipCountData"></ShipCount>
        </div> -->
        <!--            船舶统计功能-->
        <!-- <div  id="shipAreaCount"  style="width: 500px;height: 250px;position: absolute;right: 35%; top:10%;z-index: 400;" v-show="showShipAreaCount" >
            <ShipAreaCount @hide="showShipAreaCount=false,drawLayer.clearLayers()" v-model="shipAreaCountData"></ShipAreaCount>
        </div> -->

        <!-- 锚地 信息框 -->
        <div id='anchInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.anchorage">
            <AnchInfoView
                    :tabObj='dialogInfo.anchorage'
                    titleName=''
                    @remove='showInfo.anchorage=false'
                    @showAnchArea='showAnchArea'
                    @isFocus="infoViewFocus"
            />
        </div>
        <!-- radar 信息框 -->
        <div id='radarInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.radar">
            <RadarInfoView
                    :tabObj='dialogInfo.radar'
                    titleName=''
                    @remove='showInfo.radar=false'
                    @isFocus="infoViewFocus"
            />
        </div>
        <!-- radar表格信息 -->
        <div class="radarShipDataInfo"
             style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500" v-drag @mouseover=''
             @mouseout="" v-show="showInfo.radarShip">
            <RadarDataTabView
                    :tableData='socketRadarShipData'
                    :titleName='dialogInfo.radar.name'
                    @remove='showInfo.radarShip=false'
            />
        </div>
        <!-- 码头泊位 信息框 -->
        <div id='pierInfoView' style="height: auto;width: 550px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.berth">
            <PierInfoView
                    :tabObj='dialogInfo.berth'
                    :namelist='namelist'
                    titleName=''
                    @remove='showInfo.berth=false'
                    @isFocus="infoViewFocus"

            />
        </div>
        <!-- 区域信息框 -->
        <div id='CustomArea' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.customArea">
            <CustomArea
                    :tabObj='dialogInfo.customArea'
                    :points="dialogInfo.points"
                    titleName=''
                    @remove='showInfo.customArea=false'
            />
        </div>
        <!-- 组织机构之陆军海防部队信息框 -->
        <div id='portInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.port">
            <PortInfoView
                    :tabObj='dialogInfo.port'
                    titleName=''
                    @remove='showInfo.port=false'
                    @isFocus="infoViewFocus"

            />
        </div>
        <!-- 海军信息框 -->
        <div id='NavyInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.navy">
            <NavyInfoView
                    :tabObj='dialogInfo.navy'
                    titleName=''
                    @remove='showInfo.navy=false'
            />
        </div>
        <!-- 海警局信息框 -->
        <div id='MarpoInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.mary">
            <MarpoInfoView
                    :tabObj='dialogInfo.mary'
                    titleName=''
                    @remove='showInfo.mary=false'
            />
        </div>
        <!-- 军分区信息框 -->
        <div id='MilidivisInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.milidivi">
            <MilidivisInfoView
                    :tabObj='dialogInfo.milidivi'
                    titleName=''
                    @remove='showInfo.milidivi=false'
            />
        </div>
        <!-- 海事局信息框 -->
        <div id='MSA' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.msa">
            <MSA
                    :tabObj='dialogInfo.msa'
                    titleName=''
                    @remove='showInfo.msa=false'
            />
        </div>
        <!-- 海事局信息框 -->
        <div id='PSB' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.psb">
            <PSB
                    :tabObj='dialogInfo.psb'
                    titleName=''
                    @remove='showInfo.psb=false'
            />
        </div>
        <!-- 军民融合办信息框 -->
        <div id='CMIO' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.cmio">
            <CMIO
                    :tabObj='dialogInfo.cmio'
                    titleName=''
                    @remove='showInfo.cmio=false'
            />
        </div>
        <!-- 海洋与渔业局信息框 -->
        <div id='OFA' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.ofa">
            <OFA
                    :tabObj='dialogInfo.ofa'
                    titleName=''
                    @remove='showInfo.ofa=false'
            />
        </div>
        <!-- 边检信息框 -->
        <div id='FI' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.fi">
            <FI
                    :tabObj='dialogInfo.fi'
                    titleName=''
                    @remove='showInfo.fi=false'
            />
        </div>
        <!-- 海关信息框 -->
        <div id='customs' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.customs">
            <Customs
                    :tabObj='dialogInfo.customs'
                    titleName=''
                    @remove='showInfo.customs=false'
            />
        </div>
        <!-- 海底光缆 信息框 -->
        <div id='seaLineInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.seaLine">
            <SeaLineInfoView
                    :tabObj='dialogInfo.seaLine'
                    titleName=''
                    @remove='showInfo.seaLine=false'
                    @isFocus="infoViewFocus"
            />
        </div>

        <!-- 资源站 信息框 -->
        <div id='stationInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.station">
            <StationInfoView
                    :tabObj='dialogInfo.stationInfo'
                    titleName=''
                    @remove='showInfo.station=false'
                    @isFocus="infoViewFocus"
            />
        </div>


        <!-- Ais 信息框 -->
        <div id='aisInfoView' style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"
             v-drag v-show="showInfo.ais">
            <AisInfoView
                    :tabObj='dialogInfo.ais'
                    titleName=''
                    @remove='showInfo.ais=false'
                    @info='aisShipView'
                    @isFocus="infoViewFocus"
            />
        </div>
        <!-- AIS表格信息 -->
        <div style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500" v-drag
             v-show="showInfo.aisShip">
            <AisDataTabView
                    :tableData='dialogInfo.aisShipTable'
                    :titleName='dialogInfo.ais.name'
                    @remove='showInfo.aisShip=false'
            />
        </div>
        <!--摄像头视频-->
        <div id='CameraVideoView' :style="{width: videoWidth}"
             style="height: auto;width: auto;position: absolute;right: 2%; top:10%;z-index: 500" v-drag
             v-show="showInfo.camera">
            <VideoView
                    v-for="(itme,index) in dialogInfo.camera" :key="index"
                    :videoName="itme.name"
                    :background="'#2770D4'"
                    :isBird="{is:false}"
                    :videoID='itme.id' :videoSrc='itme.videoUrl'
                    @enlarge='enlargeVideo'
            />
            <el-button type="text" @click="showInfo.camera=false"
                       style="position: absolute;top: 1px;right: 10px;color: #eee;">X
            </el-button>
        </div>
        <!-- 左侧抽屉 -->
        <!-- <div  id="leftDrawerView"  style="width: 440px;height: calc(100% - 121px);position: absolute;left:82px; top:95px;z-index: 400" :style="{width:showLeft?'440px':'20px'}" >
            <LeftDrawer ref="leftDrawer" :row1="leftDrawerData.row1" :row2="leftDrawerData.row2" :row3="leftDrawerData.row3" :row4="leftDrawerData.row4" v-on:showLeft="showLeft = $event"
                        :station1="leftDrawerData.station1" :station2="leftDrawerData.station2" @searchStation="loadLeftDrawerSearch"
                        @change1="LeftDrawerStationChange1" @showDailyEvent="leftDrawerDailyEvent" :map="map" @shipType="leftDrawerSelectShip"
            ></LeftDrawer>
        </div> -->
        <!-- 当天事件 -->
        <div id="dailyEventDiag" v-drag v-show="showDailyEvent"
             style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500">
            <DailyEventDiag @hide='showDailyEvent=false' :dailyList="dailyEventList" @change1="changeDailyEvent"
                            @search="searchDailyEvent"></DailyEventDiag>
        </div>

        <!--        关注按钮弹窗-->
        <div id="focusDialog" v-drag v-show="showInfo.focus"
             style="height: auto;width: auto;position: absolute;left:5%; top:10%;z-index: 500">
            <FocusDialog @hide='showInfo.focus=false' :table-data="dialogInfo.focus"
                         @rowClick="focusClick"></FocusDialog>
        </div>
        <!--            区域分组显示-->
        <div id="groupView" ref='groupView' v-show="showGroupView"
             style="position: absolute;right: 10%; top:20%;z-index: 500" v-drag>
            <div class="groupViewTitle">
                <div>
                    <p>标绘区域</p>
                    <span @click="showGroupView=false">X</span>
                </div>
            </div>
            <div class="groupViewMain">
                <div class="mainTitle" style="padding:15px;"><p>全部区域设置 <span>{{areaLength}}个</span></p>
                    <el-radio-group v-model="showOrHide" style="margin-top: -1rem;" @change="showAllArea">
                        <el-radio-button label="1">显示</el-radio-button>
                        <el-radio-button label="0">隐藏</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="line"></div>
                <div class="mainContent" style="padding:15px;">
                    <group-tree @openDrawView="openDrawView" :map="map" :groupData="groupData" :areaLayer="areaLayer"
                                @allowDrop="" @updateGroupName=""
                                :areaData="areaData" ref="groupTree" @removeArea='removeArea' ></group-tree>
                </div>
            </div>
        </div>
        <!--            区域绘制-->
        <div id="drawView" ref='drawView' v-show="showDrawView"
             style="position: absolute;right: 9%; top:30%;z-index: 500">

            <div class="drawTitle groupViewTitle">
                <div>
                    <p>添加区域</p>
                    <span @click="closeDraw">X</span>
                </div>
            </div>
            <div class="DrawMain">

                <el-form label-position="left" :rules="formRules" status-icon label-width="80px" ref="ruleForm"
                         :model="drawData">
                    <div class="drawItem"><span>形状:</span>
                        <p v-for="(item,index) in DrawType" :key="index" :class="{'acitve':index===isDrawType}"
                           @click="drawArea(item.value,index)">{{item.label}}</p></div>
                    <el-row>
                        <el-col :span="15" style="margin-left:10px;">
                            <el-form-item label="名称:" prop="name" label-width="60px" class="name-item">
                                <el-input class="nameInput" v-model="drawData.name"
                                          ref="nameInput" size="medium "/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col :span="15">
                            <el-form-item label="类型:" label-width="60px" prop="lever">
                                <el-select v-model="drawData.lever">
                                    <el-option
                                            v-for="item in watersLevel"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="分组:" label-width="60px" prop="groupId">
                                <el-select v-model="drawData.groupId" placeholder="请选择">
                                    <el-option
                                            v-for="item in groupData"
                                            :key="item.id"
                                            :label="item.label"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3"><span @click="showAddGroup=true" class="selectAdd selectAdd2">+</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="描述:" label-width="60px">
                                <el-input v-model="drawData.description"
                                          type="textarea"/>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
                    <div class="drawItem" v-show="drawData.positions[0]"><span>+新增点
                            <el-button icon="el-icon-edit" circle size="mini" style="height: 27px;"
                                       @click="disabledDraw=false,drawData.preview=true"
                                       v-show="!drawData.preview"></el-button>
                            <el-button type="success" icon="el-icon-check" circle size="mini" style="height: 27px;"
                                       v-show="drawData.preview" @click="drawPreview"></el-button>
                        </span>
                        <div class="drawRadius drawPos" v-if="isDrawType===0">
                            <el-form-item label="" label-width="0" prop="radius"><input v-model="drawData.radius"
                                                                                        :disabled="disabledDraw"/>
                                <p>半径</p></el-form-item>
                        </div>
                        <div class="drawPos" v-for="(pos,index) in drawData.positions" :key="index">
                            <span>{{index+1}}.</span><input v-model="pos[0]" :disabled="disabledDraw"/>
                            <p>经</p> <input v-model="pos[1]" :disabled="disabledDraw"/>
                            <p>纬</p>
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
        </div>

    </div>
</template>

<script>
    import mapComputeds from './mapComputed';
    import mapWatch from './mapWatch';
    import homeMethods from './methods';
    import mapSocketFun, {mapSocket} from './mapSocket';
    import mapUtils from '../../utils/mapUtils';
    import {mapData} from './mapData';
    import {actions} from './noIf';
    import Dropdown from '../../components/Dropdown.vue'
    import ButtonGroup from '../../components/ButtonGroup.vue'
    import MapControl from '../../components/map/MapControl'
    import SelectMarker from '../../components/map/SelectMarker'
    import ObjectSelect from '../../components/map/ObjectSelect'  //目标筛选
    import layerSelect from '../../components/map/layerSelect'  //图层筛选
    import importExcel from '../../components/map/importExcel'// 导入离线船只数据
    import ShipCount from '../../components/map/ShipCount'
    import ShipAreaCount from '../../components/map/ShipAreaCount'
    import AnchInfoView from '../../components/map/AnchInfoView'
    import PierInfoView from '../../components/map/PierInfoView'
    import PortInfoView from '../../components/map/PortInfoView'   //陆军
    import NavyInfoView from '../../components/map/NavyInfoView'  //海军
    import MarpoInfoView from '../../components/map/MarpoInfoView'  //海警局
    import MilidivisInfoView from '../../components/map/MilidivisInfoView '  //军分区
    import MSA from '../../components/map/MSA'  //海事局
    import PSB from '../../components/map/PSB'  //公安局
    import CMIO from '../../components/map/CMIO' //军民融合办
    import OFA from '../../components/map/OFA' //海洋与渔业局
    import FI from '../../components/map/FI' //边检
    import Customs from '../../components/map/Customs' //海关

    import CustomArea from '../../components/map/CustomArea' //自定义区域

    import SeaLineInfoView from '../../components/map/SeaLineInfoView'
    import StationInfoView from '../../components/map/StationInfoView'
    import RadarInfoView from '../../components/map/RadarInfoView'
    import RadarDataTabView from '../../components/map/RadarDataTab'
    import AisInfoView from '../../components/map/AisInfoView'
    import AisDataTabView from '../../components/map/AisDataTab'
    import VideoView from '../../components/map/VideoView'
    import LeftDrawer from '../../components/map/LeftDrawer'
    import DailyEventDiag from '../../components/map/DailyEventDiag';
    import ShipInfoView from '../../components/map/ShipInfoView';
    import ShipDetailView from '../../components/map/ShipDetailView';
    import ShipHistory from '../../components/map/ShipHistroyView';
    import FocusDialog from '../../components/map/FocusDialog'
    import groupTree from '../../components/groupTree.vue'
    import MapSigns from '../../components/MapSigns.vue'
    import Statistics from '../../components/Statistics.vue'
    import CountrySigns from '../../components/CountrySigns .vue'
    import {wgs84ToBD} from '../../utils/coordinateConvert'
    import {formRules} from '../../utils/formRules'
    //   import {
    //     addMyMarker,
    //     addPolygon, customMarker, addStationDom,
    //     mapComopentFun, addRadarDom
    //   } from './mapComponentFactory'
    export default {
        name: 'Map',
        components: {
            Dropdown,
            ButtonGroup,
            MapControl,
            SelectMarker,
            ObjectSelect,
            layerSelect,
            ShipCount,
            ShipAreaCount,
            AnchInfoView,
            PierInfoView,
            PortInfoView,
            SeaLineInfoView,
            StationInfoView,
            RadarInfoView,
            RadarDataTabView,
            AisInfoView,
            AisDataTabView,
            VideoView,
            LeftDrawer,
            DailyEventDiag,
            importExcel,
            ShipInfoView,
            Statistics,
            ShipDetailView,
            ShipHistory,
            FocusDialog,
            groupTree,
            NavyInfoView,
            MarpoInfoView,
            MilidivisInfoView,
            MSA,
            PSB,
            CMIO,
            OFA,
            FI,
            Customs,
            CustomArea,
            'map-signs': MapSigns,
            'country-signs': CountrySigns
        },
        data() {
            return {
                ...mapData, ...mapSocket,
                formRules: formRules,
                item: '',
                objectArea: ''
            }
        },
        computed: {
            ...mapComputeds,
        },
        watch: {
            ...mapWatch,

        },

        mounted() {
            this.objectType()
            this.objectareaData()
            this.mapInit()
            this.initWebSocket()
            this.map.setView([30.37892927824675, 122.19491755725795], 10);
            console.log("user", this.$store.getters.user.data)
            this.loadGroupData()   //重点目标
            this.stationLayerGroup = new L.FeatureGroup().addTo(this.map);
            this.leftDrawerShipTypeLayer = new L.FeatureGroup().addTo(this.map);
            this.drawLayer = new L.FeatureGroup().addTo(this.map);
            this.areadefineLayer = new L.FeatureGroup().addTo(this.drawLayer);

            this.planeLayer = new L.FeatureGroup().addTo(this.map);
            this.animateLayer = new L.FeatureGroup().addTo(this.map);
            this.stationLayers = new L.FeatureGroup().addTo(this.stationLayerGroup);
            this.radarLayer = new L.FeatureGroup().addTo(this.map);
            this.focusShipLayer = new L.FeatureGroup().addTo(this.map);
            this.markerLayersGroup = new L.FeatureGroup({}).addTo(this.map);
            this.roadLayer = new L.FeatureGroup({}).addTo(this.markerLayersGroup);
            this.seaLineLayer = new L.FeatureGroup({}).addTo(this.markerLayersGroup);
            this.departmentLayers = new L.FeatureGroup().addTo(this.map);
            this.areaLayer = new L.FeatureGroup().addTo(this.map);
            for (let i = 1; i < 11; i++) {
                this['orgLayer' + i] = new L.FeatureGroup().addTo(this.departmentLayers)
            }

        
            this.loadDefaultMarker()
            this.loadLeftDrawer()
            this.ShipStatistical()

            setTimeout(() => {
                this.websocketsend(JSON.stringify({
                    action: 'criminal',
                    data: {uid: this.$store.getters.user.data.user.id}
                }))
                this.websocketsend(JSON.stringify({
                    action: 'focus',
                    data: {uid: this.$store.getters.user.data.user.id}
                }))
                this.websocketsend(JSON.stringify({action: 'allRadar', data: {}}))
            }, 500)

            this.loadShip()
            this.selecarea()
            this.queryArea()  //区域筛选
        },
        methods: {
            choosed() {
                // console.log(item)
                this.searchdialog = true
            },
            objectType() {
                this.service.get('/ship/shipType', {
                    params: {
                        flag: this.shipflag
                    }
                }).then(res => {
                    // console.log('船舶类型',res)
                    this.shipflag = res.flags
                    // console.log("shipflag",this.shipflag)
                })
            },
            objectareaData() {
                this.service.get('/water/allList', {
                    params: {
                        name: this.objectArea
                    }
                }).then(res => {
                    // console.log('所有区域目标', res)
                    this.objectArea = res.list
                    if(!this.objectArea){
                        return  '暂无数据'
                    }
                    else{
                        //  console.log("objectArea",this.objectArea)
                    this.objectArea.forEach(function (item, index) {
                        var otype = item.type
                        // console.log('item', otype);
                    });
                }              
                })
            },
            queryName() {
                this.service.get('/ship/screeningName', {
                    params: {name: this.objectname}
                }).then(res => {
                    // console.log("目标名称筛选", res)
                    this.dialogVisible1 = true
                    this.objectnamelist = res.result
                })
            },
            queryNumber() {
                this.service.get('/ship/screeningMmsi', {
                    params: {mmsi: this.objectmmsi}
                }).then(res => {
                    // console.log("目标编号筛选",res)
                    this.dialogVisible2 = true
                    this.mmsilist = res.result
                })
            },
            queryData() {
                this.service.get('/ship/screeningType', {
                    params: {type: this.oshipType}
                }).then(res => {
                    // console.log("目标类型筛选",res)
                    this.dialogVisible3 = true
                    this.typelist = res.result
                })
            },
            queryArea() {
                let area
                if (this.type == '圆形海域') {
                    area = 0
                } else if (this.type == '矩形海域') {
                    area = 1
                } else if (this.type == '多边形海域') {
                    area = 2
                }
                // console.log('区域data', this.objectArea)
                for (let i in this.objectArea) {
                    //   console.log("i",i,this.objectArea[i].type)
                    // if (this.objectArea[i].type === area) {
                        // console.log("objectArea[i]", this.objectArea[i])
                        var points = (this.objectArea[i].points)
                        // console.log('points', points)
                        var points111 = JSON.stringify(this.objectArea[i].points)
                        // console.log('points', points111)
                        // let [radius, lat, lon] = [this.objectArea[i].radius, this.objectArea[i].lat, this.objectArea[i].lon]
                        let [radius, lat, lon,type] = [this.objectArea[i].radius, this.objectArea[i].lat, this.objectArea[i].lon,this.objectArea[i].type]
                        this.service.post('/ship/screeningWater', {
                            // type: area,
                            type:type,
                            lat: lat,
                            lon: lon,
                            points: JSON.stringify(this.objectArea[i].points),
                            radius: radius,
                        }).then(res => {
                            // console.log("目标区域筛选", res)
                            // console.log('区域data',this.objectArea)
                            this.dialogVisible5 = true
                            this.arealist = res.result
                        })
                    // }

                }
            },
            queryTime() {
                this.service.get('/ship/screeningTime', {
                    params: {
                        beginTime: this.beginTime,
                        endTime: this.endTime
                    }
                }).then(res => {
                    console.log("目标时间筛选", res)
                   
                    // if (res.error==0) {
                      
                        if(res.result.length==0){
                            this.$message('当前时间段内，暂无查到所对应的船舶' + '!');
                        }else{
                            this.timelist = res.result
                            this.dialogVisible4 = true
                        }
                    // } 
                    // else if(res.result===[]){
                    //     this.$message('当前时间段内，暂无查到所对应的船舶' + '!');
                    // }
                    //  else {
                    //     this.$message('当前时间段内，暂无查到所对应的船舶' + '!');
                    // }

                })
            },

            // 统计
            ShipStatistical(isShow = true, times = [], types = [], waters = []) {
                let swne = this.getMapBounds()
                let d = {
                    'maxLat': swne['neLat'],
                    'minLat': swne['swLat'],
                    'minLon': swne['swLon'],
                    'maxLon': swne['neLon'],
                    'times': times,
                    'types': types,
                    "waters": waters,
                }
                this.service.post('/ship/statistical', {
                    ...d
                }).then(res => {
                    // console.log("船舶统计",res)
                    this.shipStatistics = res.list
                })
            },
            ...mapUtils, ...homeMethods, ...mapSocketFun,
            //加载区域船舶
            loadAreaShip(isShow = true, times = [], types = [], waters = []) {
                // console.log('loadAreaShip')
                //    console.log("当前用户登录信息",this.$store.getters.user.data.user.id)
                let swne = this.getMapBounds()
                let d = {
                    // 'isshow': isShow,
                    'maxLat': swne['neLat'],
                    'minLat': swne['swLat'],
                    'minLon': swne['swLon'],
                    'maxLon': swne['neLon'],
                    'times': times,
                    'types': types,
                    "waters": waters,
                    // 'uid':this.$store.getters.user.data.user.id?this.$store.getters.user.data.user.id:null
                }
                this.service.post('/ship/areaList', {
                    ...d
                }).then(res => {
                    console.log("区域内船舶加载", res)
                    if (this.map.getZoom() >= this.maxMapZoom) {
                        this.areaShipData = [...res.list]
                        //   console.log('areaShipData', this.areaShipData)
                    }
                    // else{
                    //      this.$alert('当前层级下暂无船只，请放大层级！');
                    // }
                    // this.leftDrawerData.row1 = res.data.targetMap.columns
                    // this.leftDrawerData.row3 = res.data.typeMap
                    // // console.log(this.leftDrawerData.row3)
                    // this.leftDrawerData.row3.typeList.forEach(e=>{if(this.leftDrawerShipType.name===e.name)this.leftDrawerShipType.num=e.num;})
                })
            },
            //初始化海量点
            addShipPointCollection(size, id = -1) {
                let swne = this.getMapBounds()
                //   console.log('size',size)
                this.service.post('/ship/drawSeaPoints', {
                    width: size.x,
                    height: size.y,
                    // attributionid: id,
                    body: id,
                    'neLat': swne['neLat'],
                    'swLat': swne['swLat'],
                    'swLon': swne['swLon'],
                    'neLon': swne['neLon']
                }).then(res => {
                    // console.log(res,'addShipPointCollection')
                    this.pointCollectionImg = res.data
                    this.showPointCollectionImg = true
                    this.map.dragging.enable();
                    // this.map.scrollWheelZoom.enable();
                })
            },
        },
        directives: {
            drag: function (el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - dragBox.offsetLeft;
                    let disY = e.clientY - dragBox.offsetTop;
                    document.onmousemove = e => {
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        // console.log(e.clientX,e.clientY)
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        if (e.clientY < 105) {
                            top = 110 - disY;
                        }
                        //移动当前元素
                        dragBox.style.cursor = 'all-scroll';
                        dragBox.style.left = left + "px";
                        dragBox.style.top = top + "px";
                    };
                    document.onmouseup = e => {
                        //鼠标弹起来的时候不再移动
                        dragBox.style.cursor = 'default';

                        document.onmousemove = null;
                        //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
                        document.onmouseup = null;
                    };
                };
            }
        },
    }
</script>

<style scoped lang="less">
    * {
        margin: 0;
        padding: 0;
    }

    /deep/ .el-dialog {
        position: absolute;
        right: 10%;
        top: -12%;
    }

    // 搜索的结果弹框
    /deep/ .typedialog {
        width: 20%;
        position: absolute;
        right: 10%;
        top: 22%;

        .el-dialog__header {
            padding: 0;
        }
    }

    // 高级搜索
    /deep/ .signdialog {
        background: #e3efff;
        outline: 2px solid #c8ffff;

        .el-icon-close:before { //关闭弹框图标
            content: "";
        }

        .el-dialog__header {
            padding: 0;
        }

        .el-select > .el-input {
            //  width: 273px;
            width: 360px;
        }

        .el-date-editor.el-input {
            width: 120px;
        }
    }

    .signChild {
        margin-bottom: 10px;
        font-weight: 900;
    }

    .signChild button {
        background: #0175ee;
        width: 110px;
        height: 40px;
        border-color: #306ba3;
        outline: 2px solid #c8ffff;
        color: #97dbff;
    }

    .signChild input {
        // width: 273px;
        width: 360px;
        height: 40px;
        border-color: #306ba3;
        padding: 0 15px;
        color: #606266;
        //   box-shadow: 0 0 10px #c8ffff inset;
        outline: 2px solid #c8ffff;
    }

    .signChild span {
        width: 40px;
        height: 40px;
        border: 2px solid #306ba3;
        padding: 10px 15px;
        color: #606266;
        // box-shadow: 0 0 15px #c8ffff inset;
        outline: 2px solid #c8ffff;
        // border-right: none;
    }

    .search-result-list {
        margin: 5px;
        height: 220px;
        overflow: auto;
    }

    .search-result-list li a:hover {
        background: #f5f5f5;
    }

    // 船舶列表前面加图标
    .shipstate {
        // background: url(../images/dialog-cssimages.png) no-repeat -11px -205px;
        padding: 0 8px;
        margin-right: 11px;
    }

    .open-shipdialog {
        list-style: none;
        font-weight: bold;
        display: block;
        border-bottom: 1px dashed #ccc;
        padding: 5px 8px;
    }

    .signChild {
        /deep/ .el-input__inner {
            border: 2px solid #316ca4;
            //  box-shadow: 0 0 10px #c8ffff inset;
            outline: 2px solid #c8ffff;
        }

        /* 图标 */

        /deep/ .el-input .el-select__caret {
            transform: rotateZ(180deg);
            cursor: pointer;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #0071eb;
            font-size: 0;
            line-height: 0;
        }

        /deep/ .el-input__suffix {
            right: 18px;
            transition: all .3s;
            position: absolute;
            top: 4px;
        }

        /deep/ .el-icon-arrow-up:before {
            content: "";
        }
    }

    #home {

        height: calc(100% - 54px);
        width: 100%;
        margin-top: 54px;
        /*height: 100%;*/
    }

    #map {
        width: 100%;
        height: 100%;
    }

    #map /deep/ .radarMarker {
        pointer-events: none;
    }

    #map /deep/ #radarSpin {
        top: 50%;
        left: 50%;
        width: 50%;
        height: 50%;
        animation: turn 3s linear infinite;
        transform-origin: 0% -0%
    }

    @keyframes turn {
        0% {
            -webkit-transform: rotate(-0deg);
        }
        25% {
            -webkit-transform: rotate(-90deg);
        }
        50% {
            -webkit-transform: rotate(-180deg);
        }
        75% {
            -webkit-transform: rotate(-270deg);
        }
        100% {
            -webkit-transform: rotate(-360deg);
        }
    }

    #map /deep/ .leaflet-div-icon {
        border: none;
        background: transparent;
    }

    #map /deep/ #PlaneInfoView {

        background: none;
        pointer-events: none;

        #plane {
            pointer-events: none;
            background: url("../../assets/mapSigns/plane/planeInfoBack.png") no-repeat;
            width: 100%;
            height: 100%;
            background-size: contain;
            color: white;
            padding: 20px;

            .inner {
                width: 80%;
                /*height: 80%;*/
                margin: -10px auto;
                display: grid;
                grid-template-columns: 90% 10%;
                pointer-events: none;

                .title {
                    font-size: 20px;
                    margin-top: 3%;
                }

                .content {
                    pointer-events: none;
                    font-size: 14px;

                    ul {
                        margin-left: 10px;
                        padding: 0;

                    }


                }
            }
        }
    }

    /*          区域分组显示        */
    #groupView {
        /*right: 50px !important;*/
        /*top: 10% !important;*/
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
        // padding: 15px;
        background: white;
    }

    .groupViewMain /deep/ .el-input__inner {
        background: transparent;
        // color: white;
    }

    .groupViewMain p {
        display: inline;
        // color: white;
        color: black;
    }

    .groupViewMain p span:nth-child(1) {
        color: #5586f9;
    }

    .el-radio-group {
        float: right;
    }

    #groupView /deep/ .el-radio-button__inner {
        padding: 5px;
        margin-top: .8rem;
    }

    .line {
        margin-top: 0.5rem;
        width: 100%;
        height: 8px;
        background: #e6e6e6;
        margin-bottom: 1rem;
    }

    .mainSearch {
    }

    .mainSearch .el-input {
        width: 92%;
    }

    .mainSearch .el-input .el-input__inner {
        height: 32px;
        line-height: 32px;
        border-radius: 0;
    }

    .selectAdd {
        /*border-radius: 4px;*/
        text-align: center;
        margin-left: -1px;
        width: 1.4rem;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        border: 1px solid #DCDFE6;
        cursor: pointer;
        background: #eeeeee;
    }

    .selectAdd2 {
        width: 1.8rem;
        height: 38px;
        line-height: 38px;
    }

    .mainSearch {
    }

    /*添加分组界面*/
    #addGroup {
        right: 170px !important;
        top: 13%;
        display: flex;
        width: 350px;
        height: 200px;
        background: #ffffff;
        flex-flow: column;
        color: white;
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

    .radarShipDataInfo {
        width: 725px;
        height: 270px;
        background: #f2f6fc;
        right: 3%;
        top: 20%;
        box-shadow: 2px 4px 2px #000;
    }

    .ship-evens {
        display: grid;
        grid-template-rows: 20% 80%;
        background: #fff;
        height: 150px;
        width: 320px;
        bottom: 47% !important;
        right: 10px !important;
        box-shadow: 2px 2px 2px #222;
    }

    .ship-evens .top {
        background: linear-gradient(rgb(103, 143, 232) 0%, rgb(63, 81, 181) 100%); /*#007584;*/
        color: #eee;
        padding: 5px;
    }

    .ship-evens .main {
        background: #061C2B;
        color: #ffffff;
        padding: 10px;
        overflow: auto;
    }

    .ship-evens .main .box {
        border: #eee dashed 2px;
        /*border-style: dashed;*/
        padding: 2px 35px;
        background: url("../../assets/mapicon/shipEven.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        font-size: 13px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    .shipNotify {
        /*width: 280px;*/
        /*height: 50px;*/
        border: #eee dashed 2px;
        /*border-style: dashed;*/
        padding: 2px 35px;
        background: url("../../assets/mapicon/shipEven.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        font-size: 12px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    /*        绘制css        */
    #drawView {
        z-index: 999;
        /*background: url("../../assets/dataAnalysis/left1.png");*/
        width: 451px;
        height: 459px;
        /*background: #0a76a4;*/
        /*right: 250px !important;*/
        /*top: 15% !important;*/
        display: flex;
        flex-flow: column;
        // background: #305071;
        /*position: relative;*/
    }

    #drawView.drawTitle {
        width: 100%;
        height: 50px;
    }

    .drawTitle span {
        margin-right: 10px;
    }

    .DrawMain {
        // width: 86%;
        width: 100%;
        height: 80%;
        background: #ffffff;
        color: #000000;
        margin: 0 auto;
        max-height: 80%;
        overflow: auto;
    }

    #drawMainContent {
        width: 85%;
        margin: 0 auto;
        max-height: 80%;
    }

    .DrawMain .drawItem {
        // margin: 10px 0;
        margin: 15px 20px;
    }

    .DrawMain /deep/ .el-input__inner, .DrawMain /deep/ .el-form-item__label, .DrawMain /deep/ .el-textarea__inner {
        background: transparent;
        color: black;
    }

    #drawView .DrawMain .drawItem #el-select.el-input__inner {
        height: 32px;
    }

    #drawView .DrawMain .drawItem.el-select .el-input .el-select__caret {
        margin-top: 5px;
    }

    #drawView .DrawMain .drawItem.el-input--suffix .el-input__inner {
        height: 20px;
    }

    .DrawMain .drawItem p {
        display: inline-block;
        border-bottom: #3696ff 1px solid;
        margin: 0 5px;
        cursor: pointer;
        height: 22px;
        line-height: 22px;
    }

    .DrawMain .drawItem .acitve {
        color: #3696ff;
    }

    .DrawMain .drawItem textarea {
        outline: none;
        width: 54%;
        border: #d5d9e2 solid 1px;
    }

    .DrawMain .drawItem .nameInput {
        width: 180px;
        height: 27px;
        outline: none;
        border: #d5d9e2 solid 1px;
        border-radius: 3px;
        background: #eeeeee;
    }

    .drawPos {
        margin-top: 10px;
    }

    .DrawMain .drawItem .drawPos p {

        color: white;
        border: none;
        padding: 1px 3px;
        background: #3696ff;
        cursor: default;
    }

    .drawPos input {
        outline: none;
        width: 90px;
        height: 20px;
        margin-left: 6%;
        border: #d5d9e2 solid 1px;
        border-radius: 3px;
    }

    .drawPos input:nth-child(4) {
        margin-left: 10%;
    }

    .drawItem:last-child {
        text-align: center;
        // margin-left: -10%;

    }

    .drawRadius {
        padding-left: 25%;
    }

    .drawItem button {
        width: 70px;
        height: 37px;
    }

    // 区域设置
    /deep/ .el-scrollbar__wrap {
        // overflow: scroll; 
        height: 100%;
    }
</style>
