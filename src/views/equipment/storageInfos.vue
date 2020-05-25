<template>
    <div class="storage-info">
        <el-card shadow="never" :body-style="{ padding:'0'}">
            <div slot="header" class="header">
                <span class="_card-title">{{title}}</span>
                <div class="black" @click="black">
                    <svg-icon icon-class="返回" class="svg-info"></svg-icon>
                    <span v-text="'返回'"></span>
                </div>
            </div>
            <div>
                <!--装备参数-->
                <el-card class="box-card" shadow="never">
                    <div slot="header">
                        <span>装备参数</span>
                        <el-button type="text" class="topIcon" @click="$refs.copyRfidDialog.show()"
                                   v-if="title.includes('装备信息详情')">
                            <svg-icon icon-class="加号"/>
                            复制RFID
                        </el-button>


                        <el-button type="text" class="topIcon" @click="editJuadge" v-if="title.includes('装备参数详情')">
                            <svg-icon icon-class="编辑"/>
                            {{edit?'编辑':'取消编辑'}}
                        </el-button>


                        <el-button type="text" class="topIcon" @click="extendEditJudge"
                                   v-if="title.includes('装备信息详情')">
                            <svg-icon icon-class="编辑"/>
                            {{extendEdit?'编辑':'取消编辑'}}
                        </el-button>
                    </div>
                    <div class="box-body">
                        <form-container ref="form" :model="form" class="formList">
                           <field-input v-model="form.name" label="装备名称" width="2.5" name="装备名称"
                                         :rules="r(true).all(R.require)" prop="name"
                                         v-if="['新增装备参数', '装备参数详情', '装备信息详情'].includes(title)"
                                         :disabled="edit"
                            ></field-input>
                            <field-select label="装备名称" v-model="form.name" width="2.5" name="装备名称"
                                          :list="equipment.name" :rules="r(true).all(R.require)"
                                          @change="equipNameSelected" placeholder="请选择" prop="name"
                                          v-else></field-select>
            
                            <field-input v-model="form.model" label="装备型号" width="2.5"
                                         :rules="r(true).all(R.require)" prop="model"
                                         v-if="['新增装备参数', '装备参数详情', '装备信息详情'].includes(title)"
                                         :disabled="edit" :class="{'occupy-position': !title.includes('装备信息详情')}"
                            ></field-input>
                            <field-select label="装备型号" v-model="form.model" width="2.5" name="装备型号" prop="model"
                                          :list="equipment.model" :rules="r(true).all(R.require)"
                                          @change="equipSelected" placeholder="请选择"
                                          :class="{'occupy-position': !title.includes('装备信息详情')}" v-else></field-select>

                            <field-input v-model="form.serial" label="装备序号" width="2.5" :disabled="true"
                                        v-if="title.includes('装备信息详情')"
                                      prop="serial"></field-input>
                            
                            <field-input v-model="form.shelfLifeQ" label="保质期(天)" width="2.5" :disabled="edit"
                                         :rules="r(true).all(R.integer)" prop="shelfLifeQ"></field-input>

                            <field-input v-model="form.chargeCycle" label="充电周期(天)" width="2.5"
                                         :rules="r(false).all(R.num)" prop="chargeCycle"
                                         :disabled="edit"
                            ></field-input>

                            <field-input v-model="form.upkeepCycle" label="保养周期(天)" width="2.5"
                                         :rules="r(false).all(R.num)" prop="upkeepCycle"
                                         :disabled="edit"
                            ></field-input>

                            <field-input v-model="form.vendorId" label="供应商" width="2.5"
                                         :rules="r(true).all(R.require)" prop="vendorId"
                                         :disabled="true" v-if="['入库装备', '装备信息详情'].includes(title)"
                            ></field-input>
                            <field-select label="供应商" v-model="form.vendorId" width="2.5" name="供应商"
                                          :rules="r(true).all(R.require)"
                                          prop="vendorId" @change="vendor(form.vendorId)"
                                          :disabled="edit" :list="supplierArr"
                                          v-else></field-select>

                            <field-input v-model="form.personM" label="联系人员" width="2.5" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="personM"></field-input>
                                         
                            <field-input v-model="form.phoneM" label="联系方式" width="2.5" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="phoneM"></field-input>

                        </form-container>


                        <!--<el-button type="primary" class="button" @click="pushForm" v-if="!equipId">提交</el-button>-->
                        <div class="imgUp">
                            <imgUp @success="successUp" :disabled="edit"
                                   :image="form.image" :upload="title.includes('入库')?false:true" :noimg="tempImage == null||tempImage==''"></imgUp>
                        </div>
                    </div>

                </el-card>

                <!--扩展信息-->

                <el-card class="box-card" shadow="never" v-if="['入库装备', '装备信息详情'].includes(title)">
                    <div slot="header">
                        <span>扩展信息</span>
                    </div>
                    <div>
                        <form-container ref="zbForm" :model="zbForm" class="zbFormList">


                            <field-input v-model="zbForm.numberL" label="架体编号" width="2.5"
                                        :rules="r(true).all(R.integer)" prop="numberL"
                                         :disabled="extendEdit"></field-input>

                            <field-select label="架体AB面" v-model="zbForm.surfaceL" width="2.5"
                                          :disabled="extendEdit"  :rules="r(true).all(R.require)"
                                          :list="[{val:'A',key:'A面'},{val:'B',key:'B面'}]"></field-select>

                            <field-input v-model="zbForm.sectionL" label="架体节号" width="2.5"
                                        :rules="r(true).all(R.integer)" prop="sectionL"
                                         :disabled="extendEdit"></field-input>

                            <field-input v-model="zbForm.floorL" label="架体层号" width="2.5"
                                        :rules="r(true).all(R.integer)" prop="floorL"
                                         :disabled="extendEdit"></field-input>

                            <field-date-picker v-model="zbForm.productDateQ" label="生产日期" width="2.5" :disabled="extendEdit"
                                               :rules="r(true).all(R.require)" prop="productDateQ"></field-date-picker>

                            <field-input v-model="zbForm.price" label="装备单价" width="2.5" :disabled="extendEdit"
                                         :rules="r(true).all(R.integer)" prop="price"
                                         ></field-input>
                        </form-container>
                        <!--<el-button type="primary" class="button" @click="pushzbForm" v-if="!equipId">提交</el-button>-->

                    </div>
                </el-card>

                <!--绑定序号-->

                 <el-card class="box-card" shadow="never" v-if="title.includes('入库')">
                    <div slot="header">
                        <span>扫描装备</span>
                    </div>
                    <div>
                        <div >
                        <div class="header_tab">
                        <div :class="isFlag?'header_tab_box':'header_tab_box_now'" @click="changeTab" style="cursor:pointer">绑定箱码</div><div :class="isFlag?'header_tab_box_now':'header_tab_box'">明细</div>
                        <!-- <div @click="getRfid">假装扫描</div> -->
                        <div style="display: flex;
            justify-content: flex-start;margin-left:300px; algin-item:center;line-height:38px;">
            
                            <span>硬件选择： </span>
                  <el-select v-model="hardware.selected" @change="selectHardware" size="small" style="width: 220px">
                    <el-option v-for="item in hardware.selectArr"
                      :label="item.key" :key="item.val" :value="item.val">
                    </el-option>
                  </el-select>
                  <el-button :class="{'read': true, 'throttle':throttle}" @click="readerHandheld" :disabled="throttle" v-show="hardware.selected == 'Handheld'">读取</el-button>
                            
                        </div>
                        </div>
                        <el-table :data="bindRfidList" fit height="330" class="list" :header-cell-style="{background:'Gainsboro'}" border  show-summary v-if="!isFlag" :summary-method="getSummaries" highlight-current-row>
                            <el-table-column  label="类别" width="100px">
                             <template scope="scope">
                              <div v-if="scope.$index==0" @click="toMore(scope.row,scope.$index)" style="cursor:pointer">散件</div>
                              <div v-if="scope.$index!=0" style="cursor:pointer">整箱</div>
                             </template>
                            </el-table-column>
                            <el-table-column  label="操作" width="100px">
                             <template scope="scope">
                                 <div style="width:20px;float:left;margin-left:'19px'" @click="addqrr"> <svg-icon icon-class="加号" class="icon-search" ></svg-icon></div>
                                 <div style="margin-left:'20px';width:20px;float:right" @click="sliceArr(scope.row,scope.$index)">
                             <svg-icon icon-class="移除" class="icon-search" ></svg-icon>
                                 </div>
                            
                             </template>
                            </el-table-column>
                            <el-table-column  label="RFID" >
                             <template scope="scope">
                             <div @dblclick="toMore(scope.row,scope.$index)" @click="fetchRfid(scope.row,scope.$index)" style="cursor:pointer">
                                 <span v-text="scope.row.rfid" ></span>
                                 <span v-text="'单击扫描'" v-if="(scope.row.rfid==''||scope.row.rfid==null)&&scope.$index!=0" ></span>
                             </div>
                             </template>
                            </el-table-column>
                            <el-table-column  label="装备数量" >
                             <template scope="scope">
                                 
                              <!-- <span v-text="scope.row.details.length"></span> -->
                              <span >{{rfidListNum(scope.row,scope.$index)}}</span>
                             </template>
                            </el-table-column>
                        </el-table>
                        <el-table :data="bindRfidList[findIndex].details" fit height="330" class="list" :header-cell-style="{background:'Gainsboro'}" show-summary border highlight-current-row  v-if="isFlag" :summary-method="getSummaries">
                            <el-table-column  label="序号" width="100px">
                             <template scope="scope">
                              <span>{{scope.$index+1}}</span>
                             </template>
                            </el-table-column>
                            <el-table-column  label="操作" width="100px">
                             <template scope="scope">
                                <div style="width:20px;float:left;margin-left:'19px'" @click="addqrr2()"> <svg-icon icon-class="加号" class="icon-search" ></svg-icon></div>
                                 <div style="margin-left:'20px';width:20px;float:right" @click="sliceArr2(scope.row,scope.$index)">
                             <svg-icon icon-class="移除" class="icon-search" ></svg-icon>
                                 </div>
                             </template>
                            </el-table-column>
                            <el-table-column  label="RFID">
                             <template scope="scope">
                              <div  @click="fetchRfid2(scope.row,scope.$index)" style="cursor:pointer">
                                 <span v-text="scope.row.rfid" ></span>
                                 <span v-text="'单击扫描'" v-if="scope.row.rfid==''||scope.row.rfid==null" ></span>
                             </div>
                             </template>
                            </el-table-column>
                            <el-table-column  label="装备序号">
                             <template scope="scope">
                              <el-input v-model="scope.row.serial">

                              </el-input>
                             </template>
                            </el-table-column>
                            <!-- <el-table-column  label="装备数量">
                             <template scope="scope">
                              <span v-text="scope.row.rfid!=null?'1':'0'"></span>
                             </template>
                            </el-table-column> -->
                        </el-table>
                        <!-- <el-table :data="list" fit height="330" class="list" :row-class-name="tableRowClassName">
                            <el-table-column label="序号" align="center">
                                <template scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>

                            <el-table-column label="RFID" align="center">
                                <template scope="scope">
                                    <el-input size="small" v-model="scope.row.rfid"
                                              :disabled="true"
                                              style="width:100px"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="装备序号" align="center">
                                <template scope="scope">
                                    <el-input size="small" v-model="scope.row.serial"
                                              style="width:100px"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template scope="scope">
                                    <el-button type="danger" @click="delqaq(scope)">删除</el-button>
                                </template>
                            </el-table-column>

                        </el-table> -->
                        </div>
                    </div>
                </el-card>


                <div class="_box-bottom">
                    <el-button type="primary" @click="addEquipArg" :disabled="isClick" v-if="!extendEdit&&title.includes('装备信息详情')">提交</el-button>
                    <el-button type="primary" @click="addEquipArg" :disabled="isClick" v-if="edit == submitShow">提交</el-button>
                </div>
            </div>
        </el-card>

        <field-dialog title="提示" ref="dialog" @cancel="isEditDialog=false" @confirm="dialogConfirm">
            <div class="_dialogDiv">
                您确定要放弃本次操作吗?
            </div>
        </field-dialog>


        <serviceDialog title="复制RFID" ref="copyRfidDialog" @confirm="copyRfid" confirmInfo="写入" :secondary="false">
            <form-container ref="copyRfid" :model="copyRfidList" style="text-align: center">
                <field-input v-model="copyRfidList.rfid" label="RFID：" width="4"
                             :disabled="true"></field-input>
            </form-container>
        </serviceDialog>


    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {scrappedUp} from "api/workflow";
    import imgUp from 'components/base/axiosImgUp';
    import axios from 'axios';
    import {imgUpUrl, pdfUpUrl, videoUpUrl, imgBaseUrl, pdfBaseUrl, videoBaseUrl} from "api/config";
    import {delFile} from "api/basic";
    import { equipArgsByName, inHouse, findEquip, updateEquipArg, getAllSupplier, saveEquipArg, updateEquip} from "api/storage"
    import serviceDialog from 'components/base/serviceDialog/index'
    import {transformMixin} from "common/js/transformMixin";
    import { start, startOne, killProcess,handheld, modifyFileName } from 'common/js/rfidReader'
    import {getSupplier} from "api/supplier";
    import request from 'common/js/request'
    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;
    // import {killProcess, killProcessSync} from "common/js/kill";

    export default {
        data() {
            return {
                form: {
                    name: '', // 装备名称
                    model: '', // 装备型号
                    shelfLifeQ: '', // 装备保质期
                    chargeCycle: '', // 装备充电周期
                    upkeepCycle: '', // 装备保养周期
                    vendorId: '' , // 装备供应商
                    personM: '', // 装备联系人员
                    phoneM: '', // 装备联系方式
                    id: '',
                    image: null, // 图片
                },
                equipment: {
                    name: [],
                    model: [],
                    allEquip: []
                },
                zbForm: {
                    numberL: '', // 架体编号
                    surfaceL: 'A', // 架体AB面
                    sectionL: '', // 架体节号
                    extendEdit: '', // 架体层号
                    productDateQ: '', // 生产日期
                    price: '', // 装备单价
                },
                list: [{rfid: null, serial: ''}],
                bindRfidList:[{rfid:null,count:'',details:[{rfid:null,serial:''}]},{rfid:null,count:'',details:[{rfid:null,serial:''}]}],
                tempImage: '', // 用以保存图片的名字
                findIndex:'',
                findRfid:'',//找到箱子绑定的rfid
                categoryList: [], // 位置分配列表
                formRes: '',
                throttle: false,
                isFlag:false,
                inlineForm: {},
                leadershipList: [],
                unitId: JSON.parse(localStorage.getItem('user')).unitId,
                options: [],
                supplierArr: [], // 供应商列表
                allSupplier: [], // 供应商所有数据列表
                edit: true, // 装备参数详情的编辑
                extendEdit: true, // 装备信息详情的编辑
                isEditDialog: false, // 是否由 取消编辑 触发的弹窗
                submitShow: false, // 提交按钮是否显示
                hardwareOpen: false, // 硬件是否启动
                hardware: {//选择硬件
                  selectArr: [{
                    val: 'Handheld', 
                    key: '手持机'
                  }, {
                    val: 'cardReader', 
                    key: '读写器'
                  }],
                  selected: '', // 所选用的硬件
                  operator: ""
                },
                useProp: false, // 装备入库是否自动选择
                imageUrl: '',
                rfids: [],
                serialList: [],
                pid: '',
                index: 0, // 标识当前扫入是否是第一件装备
                com: 0,
                copyRfidList: {},
                judgeEdit: {
                    form: {},
                    zbForm: {}
                },// 判断是否对数据进行修改
                isClick: false, // 避免提交按钮快速点击
            }
        },
        mixins: [formRulesMixin, transformMixin],
        components: {
            imgUp,
            serviceDialog
        },
        props: {
            commonHouseId: {
                type: String,
                default: '',
            },
            equipId: {
                type: String,
                default: null,
            },
            equipArgId: {
                type: String,
                default: null,
            },
            title: {
                type: String,
                default: null,
            },
            equipList: {
                type: Object,
                default() {
                    return {}
                }
            },
            getPropEquip: { // 从装备参数来，直接选择完装备
                type: Object,
                default() {
                    return null
                }
            }
        },


        methods: {
            init() {
                this.form = Object.assign(this.form, {
                    model: '', 
                    shelfLifeQ: '',
                    chargeCycle: '',
                    upkeepCycle: '',
                    vendorId: '' ,
                    personM: '',
                    phoneM: '',
                })
                this.zbForm = {
                    numberL: '', 
                    surfaceL: 'A',
                    sectionL: '', 
                    extendEdit: '', 
                    productDateQ: '', 
                    price: '', 
                }
                this.list = [{rfid: null, serial: ''}]
                this.pid = ''
                this.index = 0
                this.hardwareOpen = false
            },
            //离开页面
            black() {
                if(!this.isEqual()) {
                    this.$refs.dialog.show()
                } else {
                    this.$emit('black');
                }
            },
            selectHardware(val){

            },
            // 扩展信息 编辑后未提交应初始
            extendEditJudge() {
                 if(!this.extendEdit) {
                    this.zbForm = JSON.parse(JSON.stringify(this.judgeEdit.zbForm))
                }
                this.extendEdit = !this.extendEdit
            },
            // 装备参数 编辑后未提交应初始
            editJuadge() {
             if(!this.edit) {
                  this.form = JSON.parse(JSON.stringify(this.judgeEdit.form))
              }  
              this.edit = !this.edit
            },
            /* 判断两次数据是否相等 */
            isEqual() {
                let flag1 = JSON.stringify(this.form) == JSON.stringify(this.judgeEdit.form),
                    flag2 = JSON.stringify(this.zbForm) == JSON.stringify(this.judgeEdit.zbForm)
                return flag1&&flag2
            },
            // 弹窗点击确认后退出
            dialogConfirm() {
                // if(this.title.includes('入库装备') && this.hardwareOpen) {
                //     killProcess(this.pid)
                // }
                if(this.isEditDialog) {
                    this.isEditDialog = false
                    if(this.title.includes("装备参数详情")) {
                        this.edit = !this.edit
                        this.form = JSON.parse(JSON.stringify(this.judgeEdit.form))
                    }
                    if(this.title.includes("装备信息详情")) {
                        this.extendEdit = !this.extendEdit
                        this.zbForm = JSON.parse(JSON.stringify(this.judgeEdit.zbForm))
                    }
                    this.$refs.dialog.hide()
                } else {
                    this.$emit('black');
                }
            },
            toMore(row,index){
            if(row.rfid!==null)
            {
            this.isFlag=true
            this.findRfid=row.rfid;
            }
            if(index==0)
            {
                
                this.isFlag=true;
                this.findRfid=-1;
            }
            this.findIndex=index;
            },
            addqrr()
            {
            let newLine={rfid: null,details:[{rfid:null,count:'',serial:''}]}
            this.bindRfidList.push(newLine)
            },
            addqrr2(){
            let newLine={rfid:null,serial:''}
            this.bindRfidList.forEach(item=>{
                if(item.rfid==this.findRfid)
                {
                    
                    item.details.push(newLine)
                }
               
            })
             if(this.findRfid==-1)
                {
                    this.bindRfidList[0].details.push(newLine)
                }
            },
            rfidListNum(arr,index){//计算数组个数
            
            let len=0;
           
            this.bindRfidList[index].details.forEach(item=>{
                if(item.rfid!=null)
                len++
            })
            this.bindRfidList[index].count=len
                return len;

            
            
            },
            
            sliceArr(row,index)
            {
                if(index!==0)
                {
             this.bindRfidList.splice(index, 1);
                }
                else {
                    this.$message.error("无法删除当前行")
                }
            },
            addNum(){
                let len=0;
            this.bindRfidList.forEach(item=>{
                console.log(item);
                if(item.details.length!=0)
                {
                    item.details.forEach(it=>{
                        if(it.rfid!=null&&it.rfid!='')
                         {
                             console.log(it.rfid);
                             len++
                         }
                    })
                }
            })
            return len
            },
            addNum2(){
                let len=0;
            this.bindRfidList.forEach((item,index)=>{
               if(item.rfid==this.findRfid)
               {
                   this.bindRfidList[index].details.forEach(it=>{
                       if(it.rfid!=null&&it.rfid!='')
                       {
                           len++
                       }
                   })
               }
            })
            return len
            },
            getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        let boxLen=0;
        this.bindRfidList.forEach(item=>{
            if(item.rfid!=null&&item.rfid!='')
            {
                boxLen++
            }
        })
        columns.forEach((column, index) => {
          if (index === 0&&!this.isFlag) {
            let len=this.addNum();
            sums[index] = '总计'+boxLen+'箱'+len+'件';
            return;
          }
           if (index === 0&&this.isFlag) {
            let len=this.addNum2();
            sums[index] = '总计'+len+'件';
            return;
          }
        });

        return sums;
      },
      
            sliceArr2(row,index)
            {

                this.bindRfidList.forEach(item=>{
                    if(item.rfid==this.findRfid){ 
                        if(item.details.length!==1)
                        {
                            item.details.splice(index, 1);
                        }
                        
                    }
                })
                if(this.findRfid==-1)
                {
                    this.bindRfidList[0].details.splice(index,1)
                }
                
                
            },

            changeTab(){
            this.isFlag=false;
            killProcess(this.pid);//推出详细界面时杀掉进程
            },
            readerHandheld() {//手持机读取数据
              if(this.throttle) return
              this.throttle = true
              this.list = []
              this.rfidList = []
              setTimeout(() => this.throttle = false, 2000)
              handheld((err) => this.$message.error(err)).then(data => {//["123456","456789"]
                  console.log("手持机扫描到的数据");
                  console.log(data);
                  console.log(JSON.parse(data));
                  console.log(JSON.parse(data).rfid)
                  if(!this.isFlag)//在绑定箱码界面时
                  {
                      JSON.parse(data).rfid.forEach(item=>{
                      this.bindRfidList.push({rfid:item,details:[]})
                })
                
                  }
                else {
                   
                    this.bindRfidList.forEach(item=>{//在明细界面时
                        if(item.rfid==this.findRfid)
                        {
                            console.log("手持机明细读取数据");
                            JSON.parse(data).rfid.forEach(it=>{
                            item.details.push({rfid:it,serial:''})
                })
                        }
                        
                    })
                    if(this.findRfid==-1)
                        {
                             JSON.parse(data).rfid.forEach(it=>{
                            this.bindRfidList[0].details.push({rfid:it,serial:''})
                })
                        }
                    
                }
                this.bindRfidList.forEach((item,index)=>{
                    if((item.rfid==''||item.rfid==null)&&index!=0)
                    {
                        console.log(index);
                        this.bindRfidList.splice(index,1)
                    }
                })
                this.bindRfidList.forEach((item,Tindex)=>{
                    item.details.forEach((it,index)=>{
                      if((it.rfid==''||it.rfid==null))
                    {
                        console.log(index);
                        this.bindRfidList[Tindex].details.splice(index,1)
                    }  
                    })
                })
                console.log("扫描后");
                console.log(this.bindRfidList);
              })
            },
            //点击提交后 根据从什么入口进入的执行对应的  新增  入库  装备基础信息修改 装备入库信息修改
            addEquipArg() {
                this.isClick = true;
                setTimeout(() => {this.isClick = false}, 1600);
                if(this.title.includes('入库装备')) {
                    console.log("入库时的对象");
                   console.log(this.bindRfidList);
                    let boxMore=[]
                    let singleBox=[]
                    this.bindRfidList.forEach((item,index)=>{
                        console.log(item);
                        let boxObject={
                        boxRfid:'',
                        count:'',
                        rfids:[],
                        serials:[]
                    }
                        if(index!=0)//整箱的数据
                        {
                            console.log("整箱");
                           boxObject.boxRfid=item.rfid
                           boxObject.count=item.details.length 
                           if(item.details.length!=0)
                           {
                               item.details.forEach(it=>{
                                   boxObject.rfids.push(it.rfid)
                                   boxObject.serials.push(it.serial)
                               })
                           }
                           boxMore.push(boxObject)
                        }
                        console.log("整箱的数据");
                      console.log(boxMore);  
                    })
                     let singleObject={
                        rfids:[],
                        serials:[]
                    }
                    if(this.bindRfidList[0].details.length!=0)
                    {
                       
                        this.bindRfidList[0].details.forEach(item=>{
                            if(item.rfid!=''&&item.rfid!=null)
                            {
                                singleObject.rfids.push(item.rfid)
                            singleObject.serials.push(item.serial)
                            }
                            
                        })
                       
                    }
                    let tempForm = JSON.parse(JSON.stringify(this.form)),
                        tempZbForm = JSON.parse(JSON.stringify(this.zbForm)),
                        
                        requestBody = {
                            boxInHouses:boxMore,
                            singleInHouse:singleObject,
                            equipArgId:tempForm.id,
                            // equipArg: {
                            //     chargeCycle: tempForm.chargeCycle*1000*3600*24,
                            //     upkeepCycle: tempForm.upkeepCycle*1000*3600*24,
                            //     id: tempForm.id,
                            //     model: tempForm.model,
                            //     name: tempForm.name,
                            //     shelfLife: tempForm.shelfLifeQ*1000*3600*24,
                            // },
                            price: tempZbForm.price * 100,
                            productDate: tempZbForm.productDateQ
                        },
                        rfidList = [],
                        serialList = [];
                    // this.list.forEach(equip => {
                    //     rfidList.push(equip.rfid)
                    //     serialList.push(['', undefined, null].includes(equip.serial)?'""':equip.serial)
                    // })
                    requestBody = Object.assign({}, requestBody, {location: {
                                floor: tempZbForm.floorL,
                                number: tempZbForm.numberL,
                                section: tempZbForm.sectionL,
                                surface: tempZbForm.surfaceL
                            }})
                    console.log("请求体");
                    console.log(requestBody);
                    this.$refs.form.validate.then(() => {
                            this.$refs.zbForm.postValidate(inHouse,{},requestBody, (state, res) => {
                            // 关闭硬件
                            // killProcess(this.pid)
                            this.init()
                            this.$message.success("入库成功")
                            this.$emit('black')  
                        })
                    }).catch(err => {
                        this.$message.error("未通过检验")
                    })
                } else if(this.title.includes('装备参数详情')) {
                    let tempForm =  {
                        id: this.form.id,
                        name: this.form.name,
                        model: this.form.model,
                        chargeCycle: this.form.chargeCycle*1000*3600*24,
                        shelfLife: this.form.shelfLifeQ*1000*3600*24,
                        upkeepCycle: this.form.upkeepCycle*1000*3600*24,
                        image: this.form.imageAddress,
                        supplier: {
                            name: this.form.vendorId,
                            person: this.form.personM,
                            phone: this.form.phoneM,
                            id: this.form.supplierId
                        }
                    }
                    this.$refs.form.restValidate(updateEquipArg, JSON.parse(JSON.stringify(tempForm)), (res) => {
                        this.edit = true;
                        this.$message.success("更新成功")
                        this.$emit('black')
                    })
                } else if(this.title.includes('新增装备参数')) {
                    let tempForm = {
                        name: this.form.name,
                        model: this.form.model,
                        image: this.form.imageAddress,
                        shelfLife: this.form.shelfLifeQ*1000*3600*24,
                        chargeCycle: this.form.chargeCycle*1000*3600*24,
                        upkeepCycle: this.form.upkeepCycle*1000*3600*24,
                        supplier: {
                            id: this.form.supplierId,
                            name: this.form.vendorId,
                            person: this.form.personM,
                            phone: this.form.phoneM
                        }
                    }
                    this.$refs.form.restValidate(saveEquipArg, tempForm, (res) => {
                        this.$message.success("新增成功")
                        this.$emit('black', {
                            name: tempForm.name,
                            model: tempForm.model
                        })
                    })
                } else if(this.title.includes('装备信息详情')) {
                    let tempForm = {
                        equipArg: {
                            id: this.form.equipId,
                            name: this.form.name,
                            model: this.form.model,
                            image: this.tempImage,
                            shelfLife: this.form.shelfLifeQ*1000*3600*24,
                            chargeCycle: this.form.chargeCycle*1000*3600*24,
                            upkeepCycle: this.form.upkeepCycle*1000*3600*24,
                            supplier: {
                                id: this.form.supplierId,
                                name: this.form.vendorId,
                                person: this.form.personM,
                                phone: this.form.phoneM
                            }
                        },
                        location: {
                            number: this.zbForm.numberL,
                            surface: this.zbForm.surfaceL,
                            section: this.zbForm.sectionL,
                            floor: this.zbForm.floorL
                        },
                        id: this.form.id,
                        productDate: this.zbForm.productDateQ,
                        price: this.zbForm.price*100,
                        rfid: this.form.rfid,
                        serial: this.form.serial
                    }
                    // updateEquip
                    this.$refs.form.validate.then(() => {
                        this.$refs.zbForm.restValidate(updateEquip, tempForm, (res) => {
                            this.$message.success("更新成功")
                            this.$emit('black')
                        })
                    }).catch(err => {
                        this.$message.error('未通过检验');
                    })
                }
            },


            tableRowClassName({row, rowIndex}) {
                if (row.style) {
                    return 'err-row';
                }
                return '';
            },

            //选择供应商后更新 对应信息
            vendor(data) {
                this.allSupplier.some(item => {
                    console.log(item);
                    if (item.id === data) {
                        this.form.personM = item.person;
                        this.form.phoneM = item.phone;
                        this.form.vendorId = item.name,
                        this.form.supplierId = item.id
                        return true
                    }
                })
            },

            //图片上传成功暴露的方法
            successUp(data) {
                this.form.imageAddress = data;
            },

            // 复制RFID
            copyRfid() {
                startOne("java -jar writing.jar", (data) => {
                    if (data.includes('succeed')) {
                        this.$message.success('复制成功!');
                        this.$refs.copyRfidDialog.hide();
                    } else {
                        this.$message.error('复制失败!');
                    }
                }, this.copyRfidList.rfid)
            },
            getRfid(){
                // this.bindRfidList=[
                //     {
                //         rfid:'',
                //         details:[{
                //             rfid:'123',
                //             serial:''
                //             },
                //             {
                //                 rfid:'568',
                //                 serial:''
                //                 }]
                                
                                
                //     },
                //     {
                //         rfid:"1256",
                //         details:[{
                //             rfid:"999",
                //             serial:""}]}]
                let data={rfid:["123456","56879"]}
                if(!this.isFlag)//在绑定箱码界面时
                  {
                      data.rfid.forEach(item=>{
                      this.bindRfidList.push({rfid:item,details:[]})
                })
                
                  }
                else {
                   
                    this.bindRfidList.forEach(item=>{//在明细界面时
                        if(item.rfid==this.findRfid)
                        {
                            console.log("手持机明细读取数据");
                            data.rfid.forEach(it=>{
                            item.details.push({rfid:it,serial:''})
                })
                        }
                        
                    })
                    if(this.findRfid==-1)
                        {
                             data.rfid.forEach(it=>{
                            this.bindRfidList[0].details.push({rfid:it,serial:''})
                })
                        }
                    
                }
                this.bindRfidList.forEach((item,index)=>{
                    if((item.rfid==''||item.rfid==null)&&index!=0)
                    {
                        console.log(index);
                        this.bindRfidList.splice(index,1)
                    }
                })
                this.bindRfidList.forEach((item,Tindex)=>{
                    item.details.forEach((it,index)=>{
                      if((it.rfid==''||it.rfid==null))
                    {
                        console.log(index);
                        this.bindRfidList[Tindex].details.splice(index,1)
                    }  
                    })
                })

                
            },
            fetchRfid(row,index)
            {
                if(this.pid)
                {
                    killProcess(this.pid)
                }
                 if(row.rfid==null)
                 {
                     console.log("读写器开始扫描");
                 console.log(this.hardware.selected);
                  if(this.hardware.selected!=''&&this.hardware.selected!=='Handheld')
                 {
                     
                     startOne("java -jar reading.jar", (data) => {
                         console.log("读到的data",data);
                    if (data.includes('succeed')) {
                        this.$message.success('扫描成功!');
                        this.bindRfidList[index].rfid=data.split('\n')[1]
                        
                        
                    } else {
                        this.$message.error('扫描失败!');
                    }
                }, )
                 }
                 }
            },
            fetchRfid2(row,index)
            {
                killProcess(this.pid)
                start("java -jar scan.jar", (data) => {
                       this.bindRfidList.forEach(item=>{
                                if(item.rfid==this.findRfid)
                                {
                                    item.details.push({rfid:data,serial:''})
                                }
                                if(this.findRfid==-1){
                                this.bindRfidList[0].details.push({rfid:data,serial:''})
                            }
                            })
                    }, (fail) => {
                        this.index = 1;
                        this.$message.error(fail);
                    }, (pid, err) => { pid? this.pid = pid: this.$message.error(err)})
               
            },
            // 装备实体扫描列表点击删除
            delqaq(row) {
                this.list.splice(row.$index, 1);
                // if (this.list.length > 1) {
                //     this.list.splice(row.$index, 1);
                // } else {
                //     this.$message.error('不能删除最后一个');
                // }
            },
            // 装备名称选择完成
            equipNameSelected() {
                if(this.pid != '' || this.pid != 0) {
                    killProcess(this.pid)
                    this.pid = ''
                }
                this.useProp = false
                this.getEquipInfo()
            },
            // 选择型号完成，显示对应装备参数
            equipSelected() {
                let temp = this.equipment.allEquip.find(equip => equip.model == this.form.model)
                this.form = Object.assign(this.form, {
                    shelfLifeQ: temp.shelfLife/1000/3600/24,
                    chargeCycle: temp.chargeCycle==0?'':temp.chargeCycle/1000/3600/24,
                    upkeepCycle: temp.upkeepCycle==0?'':temp.upkeepCycle/1000/3600/24,
                    vendorId: temp.supplier.name,
                    personM: temp.supplier.person,
                    phoneM: temp.supplier.phone,
                    id: temp.id,
                    image: `${imgBaseUrl}${temp.image}`
                })
                this.tempImage = temp.image || null
                // 硬件开启 hardwareOpen
                // if(!this.hardwareOpen) {
                //     start("java -jar scan.jar", (data) => {
                //         if(this.index == 0) {
                //             this.list[0].rfid = data;
                //         } else {
                //             this.list.push({ rfid: data });
                //         }
                //         this.index = this.index + 1
                //         this.hardwareOpen = true
                //     }, (fail) => {
                //         this.index = 1;
                //         this.$message.error(fail);
                //     }, (pid, err) => { pid? this.pid = pid: this.$message.error(err)})
                // }
            },
            //进入页面获取数据
            getEquipInfo() {
                this.init()
                // 获取供应商列表
                getSupplier().then(res => {
                        let result = JSON.parse(JSON.stringify(res.content)), arr = [];
                        result.forEach(supplier => {
                            arr.push({key: supplier.name, val: supplier.id})
                        })
                        this.supplierArr = arr
                        this.allSupplier = result
                })
                if(this.title.includes('入库装备')) {
                    equipArgsByName({name: this.form.name}).then(res => {
                        let result = JSON.parse(JSON.stringify(res)), nameArr = [], modelArr = [];
                        result.forEach(equip => {
                            nameArr.push(equip.name)
                            modelArr.push(equip.model)
                        })
                        if(this.equipment.name != "") {
                            this.equipment.model = Array.from(new Set(modelArr))
                            this.equipment.allEquip = res
                            if(this.useProp) {
                                this.form.model = this.getPropEquip.model
                                this.equipSelected()
                            }
                        } else {
                            this.equipment.name = Array.from(new Set(nameArr))
                            if(this.useProp) { // 自动选择装备
                                this.form.name = this.getPropEquip.name
                                this.getEquipInfo()
                            }
                        }
                        if(this.judgeEdit.form.name == undefined) {
                            this.judgeEdit.form = JSON.parse(JSON.stringify(this.form))
                            this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
                        }
                    })
                } else if(this.title.includes('装备信息详情')) {
                    findEquip(this.equipId).then(res => {
                        let result = JSON.parse(JSON.stringify(res))
                        this.tempImage = result.equipArg.image
                        this.copyRfidList.rfid = result.rfid
                        this.form = {
                            id: result.id,
                            equipId: result.equipArg.id,
                            name: result.equipArg.name,
                            model: result.equipArg.model,
                            serial: result.serial == '""'?'':result.serial,
                            image: `${imgBaseUrl}${result.equipArg.image}`,
                            shelfLifeQ: result.equipArg.shelfLife/1000/3600/24,
                            chargeCycle: result.equipArg.chargeCycle==0?'':result.equipArg.chargeCycle/1000/3600/24,
                            upkeepCycle: result.equipArg.upkeepCycle==0?'':result.equipArg.upkeepCycle/1000/3600/24,
                            supplierId: result.equipArg.supplier.id,
                            vendorId: result.equipArg.supplier.name,
                            personM: result.equipArg.supplier.person,
                            phoneM: result.equipArg.supplier.phone,
                            rfid: result.rfid,
                        }
                        this.zbForm = {
                            numberL: result.location.number,
                            surfaceL: result.location.surface,
                            sectionL: result.location.section,
                            floorL: result.location.floor,
                            productDateQ: result.productDate,
                            price: result.price/100
                        }
                        this.judgeEdit.form = JSON.parse(JSON.stringify(this.form))
                        this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
                    })
                } else if(this.title.includes('装备参数详情')) {
                    let tempForm = JSON.parse(JSON.stringify(this.equipList))
                    this.tempImage = tempForm.image || null
                    this.form = {
                        id: tempForm.id,
                        name: tempForm.name,
                        model: tempForm.model,
                        image: `${imgBaseUrl}${tempForm.image}`,
                        imageAddress: tempForm.image,
                        shelfLifeQ: tempForm.shelfLife/1000/3600/24,
                        upkeepCycle: tempForm.upkeepCycle==0?'':tempForm.upkeepCycle/1000/3600/24,
                        chargeCycle: tempForm.chargeCycle==0?'':tempForm.chargeCycle/1000/3600/24,
                        vendorId: tempForm.supplier.name,
                        personM: tempForm.supplier.person,
                        phoneM: tempForm.supplier.phone,
                        supplierId: tempForm.supplier.id
                    }
                    this.judgeEdit.form = JSON.parse(JSON.stringify(this.form))
                }
            }
        },

        created() {
            modifyFileName('search.json');
            // this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];//获取到串口号
        },
        mounted() {
            //不同的入口进入的展示不同页面
            if (this.title.includes('入库装备')) {
                this.submitShow = true; // edit与submitShow同 则按钮显示
                this.extendEdit = false;
            } else if(this.title.includes('装备信息详情')) {
                
            } else if (this.title.includes('新增装备参数')) {
                this.edit = false;
                this.judgeEdit.form = JSON.parse(JSON.stringify(this.form))
                this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
            } else if (this.title.includes('装备参数详情')) {
                this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
            }
            if(this.getPropEquip) {
                this.useProp = true
            }
            this.getEquipInfo();
        },
        beforeDestroy() {
            if(this.hardwareOpen || this.pid != '') {
                killProcess(this.pid)
            }
             let gateModel="RECEIVE_RETURN"
            clearInterval(this.timeId)
        }

    }
</script>

<style lang="scss" scoped>
    @import "common/css/mixin.scss";
    @import "common/css/variables.scss";
    .storage-info {
        /* 可调整 */
        font-size: 16px;
    }

    .el-card {
        border: none !important;
    }
    .el-form {
        /deep/ .el-form-item {
            margin-bottom: 10px;
        }
    }

    .black {
        /* 可调整 */
        font-size: 20px;
        display: flex;
        align-items: center;
        float: right;
        cursor: pointer;
    }

    .black .svg-info {
        height: 20px;
        width: 20px;
        margin-right: 0.0521rem;
    }

    .box-card {
        .topIcon {
            /* 可调整 */
            // font-size: 0.0833rem;
            margin-left: 0.2604rem;
        }

        .box-body {
            display: flex;

            .imgUp {
                margin-left: 0.2344rem;
            }

            .formList {
                width: 6.7708rem;
            }
        }

        .path {
            ._form-item {
                display: block !important;
            }
        }

        .list {
            width: 80%;
            margin: 0 auto;
            max-height: 40vh;
            border: 1px solid #EBEEF5;
            border-bottom: none !important;
        }

        .zbFormList {
            width: 6.7708rem;
        }
        .header_tab{
            width: 80%;
            // border: 1px solid black;
            margin: 0 auto;
            display: flex;
            height: 40px;
            // float: right;
            // justify-content: flex-start;
            .hardware,
          .operator {
              margin-left:auto ;
            //   border: 1px solid red;
            .label {
              display: block;
              float: left;
            }
            .read {
              width: 64px;
              height: 32px;
              color: white;
              text-align: center;
              line-height: 32px;
              margin-left: 12px;
              float: right;
              background-color: #2F2F76;
              border-radius:4px;
              padding: 0;
              border: 0;
            }
            .throttle {
              background-color: #ddd;
            }
          }
        }
        .header_tab_box
        {
            width:100px;
            font-size:16px;
            line-height: 38px;;
            border: 1px solid lightgray;
            text-align: center;
        }
        .header_tab_box_now
        {
            width:100px;
            font-size:16px;
            line-height: 38px;;
            background:lightgray;
            text-align: center;
            border: 1px solid lightgray;
        }
    }
    .occupy-position {
        margin-right: 2.0833rem;
    }
    .lineLeight {
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        opacity:1;
    }
</style>
