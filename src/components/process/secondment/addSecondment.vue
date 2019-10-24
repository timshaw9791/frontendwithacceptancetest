<template>
    <div>
        <serviceDialog :title="`${taskType}申请`" ref="checkTransferDialog" width="1040px" :button="false" @cancel="resultData">
            <div class="addApply">
                <div class="addApply-label" >
                    <div class="label" v-if="taskType!='直调'">
                        <span v-text="'所在库房：'"></span>
                        <el-input class="input" :disabled="true" size="large" v-model="house.name"></el-input>
                        <!--<div class="default-span"><span v-text="house.name"></span></div>-->
                    </div>
                    <div class="label" v-if="taskType!='报废'">
                        <span v-text="`${ZhiDingOrJieShou}机构：`"></span>
                        <div style="width: 185px">
                            <el-cascader
                                    size="large"
                                    :options="unitList"
                                    v-model="selectUnit"
                                    :props="selectProp"
                                    change-on-select
                                    :show-all-levels="false"
                                    @change="handleUnitChange">
                            </el-cascader>
                        </div>
                        <!--<el-input class="input" :disabled="true" size="small" v-model="unit.name"></el-input>-->
                    </div>
                    <div class="label" v-if="taskType=='直调'">
                        <span v-text="`${ZhiDingOrJieShou}库房：`"></span>
                        <field-input-query size="large" v-model="houseObj.houseName"
                                           :inputList="houseObj.houseList"
                                           @select="getHouseSelect"></field-input-query>
                        <!--<el-input class="input" :disabled="true" size="small" v-model="unit.name"></el-input>-->
                    </div>
                    <div class="label" v-if="taskType=='直调'">
                        <span v-text="`${ZhiDingOrJieShou}人员：`"></span>
                        <field-input-query size="large" v-model="adminUser.adminName"
                                           :inputList="adminUser.adminList"
                                           @select="getAdminSelect"></field-input-query>
                        <!--<el-input class="input" :disabled="true" size="small" v-model="unit.name"></el-input>-->
                    </div>
                    <div class="label" v-if="taskType!='直调'">
                        <span v-text="'指定领导：'"></span>
                        <field-input-query size="large" v-model="leader.leaderName"
                                           :inputList="leader.leaderList"
                                           @select="getLeaderSelect"></field-input-query>
                    </div>
                    <div class="label" v-if="taskType=='报废'">
                        <span v-text="'硬件选择：'"></span>
                        <el-select v-model="hardware.hardwareSelect" placeholder="请选择" size="large">
                            <el-option
                                    v-for="item in hardware.hardwareList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="addApply-label" v-if="taskType=='直调'" :style="taskType=='报废'?'justify-content: left!important;margin-top: 17px;margin-bottom: 12px;':''">
                    <div class="label" style="margin-top: 18px">
                        <span v-text="'指定领导：'"></span>
                        <field-input-query size="large" v-model="leader.leaderName"
                                           :inputList="leader.leaderList"
                                           @select="getLeaderSelect"></field-input-query>
                    </div>
                </div>
                <div class="addApply-label" v-if="taskType=='报废'" :style="taskType=='报废'?'justify-content: left!important;margin-top: 17px;margin-bottom: 12px;':''">
                    <span v-text="'申请原因：'"></span>
                    <div style="width: 92.9%">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows:2}"
                                placeholder="请输入内容"
                                v-model="reason"
                                maxlength="150"
                                show-word-limit>
                        </el-input>
                    </div>
                </div>
                <div class="addApply-table">
                    <form-container ref="form" :model="form" style="width: 100%">
                        <el-table :data="form.orderItems" :height="taskType=='报废'||taskType=='直调'?'378':'490'">
                            <el-table-column label="序号" align="center">
                                <template scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="装备型号" align="center" v-if="taskType!='报废'">
                                <template scope="scope">
                                    <field-input-query size="small" v-model="scope.row.model"
                                                       :inputList="restaurants"
                                                       @select="getEquipName(scope,$event)"></field-input-query>
                                </template>
                            </el-table-column>
                            <el-table-column label="装备型号" align="center" v-if="taskType=='报废'">
                                <template scope="scope">
                                    {{scope.row.model}}
                                </template>
                            </el-table-column>
                            <el-table-column label="装备名称" align="center">
                                <template scope="scope">
                                    {{scope.row.name}}
                                </template>
                            </el-table-column>
                            <el-table-column label="装备序号" align="center" v-if="taskType=='报废'">
                                <template scope="scope">
                                    {{scope.row.serial}}
                                </template>
                            </el-table-column>
                            <el-table-column label="RFID" align="center" v-if="taskType=='报废'">
                                <template scope="scope">
                                    {{scope.row.rfid}}
                                </template>
                            </el-table-column>
                            <el-table-column label="装备数量" align="center" v-if="taskType!='报废'">
                                <template scope="scope">
                                    <el-input v-model="scope.row.count" size="small"
                                              @blur="changeCount(scope,$event)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="120" align="center">
                                <template scope="scope">
                                    <el-button type="danger"  @click="delqaq(scope)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </form-container>
                    <div class="addApply-label" :style="taskType=='报废'||taskType=='直调'?'margin-top: 122px;position: relative':'margin-top: 12px;position: relative'">
                        <div class="label" style="position: absolute;right: 0">
                            <span v-text="'申请人员：'"></span>
                            <el-input class="input" :disabled="true" size="small" v-model="userName"></el-input>
                            <!--<div class="default-span"><span v-text="getUserName()"></span></div>-->
                        </div>
                    </div>
                </div>
                <div class="addApply-bottom">
                    <el-button class="cancel" @click="cancel">取消</el-button>
                    <el-button style="margin-left: 34px" class="submit" :disabled="isClick" @click="submit">提交</el-button>
                </div>
            </div>
        </serviceDialog>
        <!--<a_dialog :width="1040" ref="dialog" :title="'调拨申请'">-->

        <!--</a_dialog>-->
    </div>
</template>

<script>
    function debounce(fun, delay) {
        return function (args) {
            let that = this;
            let _args = args;
            clearTimeout(fun.id);
            fun.id = setTimeout(function () {
                fun.call(that, _args)
            }, delay)
        }
    }
    import a_dialog from 'components/surroundings/surroundingDialog'
    import serviceDialog from 'components/base/gailiangban'
    import request from 'common/js/request'
    import {baseBURL,baseURL} from "../../../api/config";
    import { start, delFile, handheld, killProcess } from 'common/js/rfidReader'

    // import {handheld} from 'common/js/pda'
    // const cmdPath = 'C:\\Users\\Administrator';
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // const fs = window.require('fs');
    // const path = window.require('path');
    // const newFile_path = 'C:\\Users\\Administrator\\inventory.json';

    export default {
        name: "addApply",
        components: {
            a_dialog,
            serviceDialog
        },
        props: {
            unit: {
                type: Object
            },
            house: {
                type: Object
            },
            myUnit: {
                type: Object
            },
            addType: {
                type: String,
                default: 'add'
            },
            applyOrderId:{
              type:String,
              default:''
            },
            taskId:{
                type:String,
                default: ''
            },
            taskType:{
                type:String,
                default:'借调'
            }
        },
        data() {
            return {
                pid:'',
                form: {},
                inHouseName: '',
                lastTime: '',
                unitName: '',
                userName: '',
                nowTime: 0,
                com:0,
                hardware:{
                    hardwareList: [
                        {value: '手持机', label: '手持机'},
                        {value: 'RFID读写器', label: 'RFID读写器'},
                    ],
                    hardwareSelect:'' // 硬件选择
                },
                nowRow: {},
                restaurants:[],
                selectProp:{value:'id',label:'name',children:'organUnitSet'},
                unitList:[
                ],
                houseObj:{
                    houseList:[],
                    houseName:'',
                    houseItem:{}
                },
                adminUser:{
                  adminList:[],
                  adminName:'',
                  adminItem:'',
                },
                selectUnitNow:'',
                selectUnit:[],
                nowCount: '',
                processLevelId: '',
                reason:'',
                index:0,
                leader: {
                    leaderList: [],
                    leaderName: '', // 指定领导
                    leaderItem: {},
                },
                isClick: false,
                isZero:false,
                isIdentical:false,
            }
        },
        created() {
            this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];
            this.unitName = this.unit.name;
            if(this.taskType=='报废'){
                this.getLeader(JSON.parse(localStorage.getItem('user')).unitId);
                // this.handleUnitChange([JSON.parse(localStorage.getItem('user')).unitId])
            }else if(this.taskType=='借调'){
                this.getUnitList();
            }else if(this.taskType=='直调'){
                this.getLowerLevelUnitList()
            }

        },
        computed:{
          ZhiDingOrJieShou(){
              if(this.taskType=='直调'){
                  return '接收'
              }else{
                  return '指定'
              }
          }
        },
        watch: {
            'inHouseName': {
                handler(newVal) {
                    this.$emit('getInHouse', newVal)
                }
            },
            // 'nowCount': {
            //     handler(newVal) {
            //         this.throttle(this.addRow, 1000)
            //     }
            // },
            'hardware.hardwareSelect': {
                deep:true,
                handler(newVal, oldVal) {
                    if (oldVal == 'RFID读写器' && newVal == '手持机') {
                        this.end(this.pid)
                    }else if(newVal==''){
                        this.end(this.pid)
                    }
                    if (newVal == '手持机') {
                        this.restaurants=[];
                        this.handheldMachine();
                    } else if (newVal == 'RFID读写器') {
                        this.restaurants=[];
                        //this.getOutDataCopy(['1908000C']);
                        this.getListUsb();
                    }
                }
            }
        },
        methods: {
            getLowerLevelUnitList(){
                request({
                    method:'get',
                    url:baseBURL+'/architecture/organUnitInfo',
                }).then(res=>{
                    this.findId(res);
                    // this.$set(this,'unitList',[res]);
                })
            },
            findId(item) {
                if(item.id==JSON.parse(localStorage.getItem('user')).unitId){
                   
                    this.$set(this,'unitList',[item]);
                    
                }else if(item.organUnitSet!=null&&item.organUnitSet!=[]&&item.level!='POLICE_STATION'){
                    item.organUnitSet.forEach(lowerItem=>{
                        this.findId(lowerItem)
                    })
                }
            },
            end(pid) {
                // alert('关掉了');
                // this.closeUsb=true
                if (pid) {
                    //spawn("taskkill", ["/PID", pid, "/T", "/F"]);
                    killProcess(this.pid)
                    this.index = 0;
                }
            },
            handheldMachine() {
                handheld().then((data) => {
                    let json = JSON.parse(data);
                    this.getOutDataCopy(json.rfid);
                    this.deleteFile();
                });
                //todo 要换回来
                // let data = inventoryData;
                // this.getOutDataCopy([19080012])
            },
            getListUsb() {//todo
                start("java -jar scan.jar", (data) => {
                    let arr = [];
                    arr.push(data);
                    this.getOutDataCopy(arr);
                }, (fail) => {
                    this.$message.error(fail)
                }, (pid, err) => {pid?this.pid = pid:this.$message.error(err)})
                // const process = exec(`java -jar scan.jar ${this.com}`, {cwd: cmdPath});
                // this.pid = process.pid;
                // process.stderr.on('data', (err) => {
                //     this.$message.error('设备故障请重新插拔!');
                //     console.log(err);
                // });

                // process.stdout.on('data', (data) => {
                //     console.log(data);
                //     if (this.index > 0) {
                //         let arr = [];
                //         arr.push(data);
                //         this.getOutDataCopy(arr);
                //     } else {
                //         let newData = JSON.parse(data);
                //         newData.status === 'succeed' ? this.index = 1 : this.index = 0;
                //     }
                // });

                // process.on('exit', (code) => {
                //     console.log(`子进程退出，退出码 ${code}`);
                // });
                // let intercal=setInterval(()=>{
                //     if(this.closeUsb){
                //         clearInterval(intercal);
                //         return;
                //     }
                //     this.getOutDataCopy(['q2', '3', '4', '55','6','7','8','9','11','天下第一','sdfa','10','222','23252s'])
                // },1000)

            },
            deleteFile() {
                delFile(newFile_path, () => {})
                // fs.unlink(newFile_path, function (error) {
                //     if (error) {
                //         return false;
                //     }
                // })

            },
            getOutDataCopy(data) {
                let url = baseURL+'/equips/by-rfidlist';
                request({
                    method: 'PUT',
                    url: url,
                    data: data
                }).then(res => {
                    if (res) {
                       res.forEach(item=>{
                           this.form.orderItems.push({
                               name: item.name,
                               model: item.model,
                               rfid: item.rfid,
                               id: item.id,
                               serial: item.serial
                           })
                       })
                    }
                })
            },
            resultData(){
              this.hardware={
                    hardwareList: [
                        {value: '手持机', label: '手持机'},
                        {value: 'RFID读写器', label: 'RFID读写器'},
                    ],
                        hardwareSelect:''
                };
                this.houseObj={
                    houseList:[],
                        houseName:'',
                        houseItem:{}
                };
                this.adminUser={
                    adminList:[],
                    adminName:'',
                    adminItem:'',
                };
                this.restaurants=[];
                this.selectUnit=[];
                this.leader.leaderName='';
                this.leader.leaderItem={};
                this.reason='';

            },
            getUnitList(){
                request({
                    method:'get',
                    url:baseBURL+'/architecture/organUnitInfo',
                }).then(res=>{
                    this.$set(this,'unitList',[res]);
                })
            },
            handleUnitChange(data){
                let unitId=data[data.length-1];
                console.log("领导")
                console.log;
                let gethouseUnitId='';
                
                // if(this.taskType=='直调'){
                //     gethouseUnitId=JSON.parse(localStorage.getItem('user')).unitId;
                // }else {
                //     gethouseUnitId=unitId
                // }
                gethouseUnitId=JSON.parse(localStorage.getItem('user')).unitId;
                if(data[data.length-1]==gethouseUnitId)
                {
                this.isIdentical=true;
                }else {
                this.isIdentical=false;
                }
                request({
                    method:'get',
                    url:baseBURL+'/architecture/houseByOrganUnitId',
                    params:{organUnitId:gethouseUnitId}
                }).then(res=>{
                   let houseId='';
                   res.forEach(item=>{
                       if(houseId==''){
                           houseId=item.id
                       }else {
                           houseId=houseId+','+item.id
                       }
                   });
                    this.getRestaurants(houseId);
                });

                request({
                    method:'get',
                    url:baseBURL+'/architecture/findById',
                    params:{id:unitId}
                }).then(res=>{
                    this.selectUnitNow={
                        name:res.name,
                        id:res.id
                    };
                });
                this.getLeader(gethouseUnitId);
                this.getHouseList(unitId);
                this.getAdminList(unitId)
            },
            getAdminList(unitId){
                request({
                    method:'get',
                    url:baseBURL+'/identity/findByUnitAdmin',
                    params:{unitId:unitId}
                }).then(res=>{
                    this.adminUser.adminList=[];
                    res.forEach(item=>{
                        this.adminUser.adminList.push({value: item.name, key: item})
                    });
                });
            },
            getHouseList(unitId){
                request({
                    method:'get',
                    url:baseBURL+ '/architecture/houseByOrganUnitId',
                    params:{organUnitId:unitId}
                }).then(res=>{
                    this.houseObj.houseList=[];
                    res.forEach(item=>{
                        this.houseObj.houseList.push({value: item.name, key: item})
                    });
                });
            },
            getRestaurants(houseId){
                request({
                    method: 'get',
                    url: baseBURL + '/equip-arg/by-houseIds/list',
                    params: {
                        houseIds:houseId
                    }
                }).then(res => {
                    this.restaurants=[];
                    let list=res;
                    list.forEach(item=>{
                        this.restaurants.push({
                            value:item.model,
                            key:item
                        })
                    });
                })
            },
            getLeaderSelect(data) {
                this.leader.leaderItem = data.key;
            },
            getHouseSelect(data){
                this.houseObj.houseItem = data.key;
                console.log('this.houseObj.houseItem',this.houseObj.houseItem)
            },
            getAdminSelect(data){
                this.adminUser.adminItem= data.key
            },
            getLeader(id) {
                // this.$ajax({
                //     method:'get',
                //     url:baseBURL+'/process-level/by-organ-unit-and-transfer-type',
                //     params:{
                //         organUnitId:this.unit.id,
                //         transferType:'DOWN_TO_UP'
                //     }
                // }).then(res=>{
                //      })
                let type='';
              
                switch (this.taskType) {
                    case '报废':
                        type='SCRAP';
                        break;
                    case '借调':
                       type='BORROW';
                        break;
                    case '直调':
                        type='DIRECT_TRANSFER';
                        break;
                }
                request({
                    method: 'get',
                    url: baseBURL + '/process-level/by-organ-unit-and-transfer-type',
                    params: {
                        organUnitId: id,
                        transferType: type
                    }
                }).then(res => {
                
                    if(res){
                        console.log("res")
                        console.log(res)
                        this.leader.leaderList = [];
                        this.processLevelId = res.id;
                        if(res.levelLeaderMap!=null){
                            if (Object.keys(res.levelLeaderMap).length == 0) {
                                res.applyLeaders.forEach(item => {
                                    this.leader.leaderList.push({value: item.organUnit.name+item.name, key: item})
                                })
                            } else {
                                res.levelLeaderMap['1'].forEach(item => {
                                    this.leader.leaderList.push({value: item.organUnit.name+item.name, key: item})
                                })
                            }
                        }else {
                            res.applyLeaders.forEach(item => {
                                this.leader.leaderList.push({value: item.organUnit.name+item.name, key: item})
                            })
                        }
                    }else {
                       this.$message.error('尚未设置本机构的'+this.taskType+'流程！')
                    }
                }).catch(err=>{
                    this.$message.error(err);
                })
            },
            submit() {
                this.isClick = true
                setTimeout(() => this.isClick = false, 1000)
                let url = '';
                let orderItems=[];
                let applyOrder = {};
                let urlApi='';
                if(this.leader.leaderName.trim() == '') {
                    this.$message.error("请选择指定领导")
                    return
                }
                if(this.hardware.hardwareSelect == '' && this.taskType=='报废') {
                    this.$message.error("请选择硬件")
                    return;
                }
                if(this.form.orderItems.length == 0 && this.taskType=='报废') {
                    this.$message.error("请扫入RFID")
                    return;
                }
                if(this.taskType=='借调'){
                    this.form.orderItems.forEach(item=>{
                        if(item.count==0)
                        {
                           this.isZero=1
                        }
                        if(item.count!=undefined){
                            if(item.count!=''){
                                orderItems.push(item)
                            }
                        }
                    });
                    urlApi='borrow';
                    applyOrder={
                        "applicant": {
                            "name": JSON.parse(localStorage.getItem('user')).name,
                            "organUnit": {
                                "id": JSON.parse(localStorage.getItem('user')).unitId,
                                "name": this.myUnit.name
                            },
                            "userId": JSON.parse(localStorage.getItem('user')).id
                        },
                        "reason":this.reason,
                        "inHouse": {
                            "id": this.house.id,
                            "name": this.house.name,
                            "organUnit": {
                                "id": JSON.parse(localStorage.getItem('user')).unitId,
                                "name": this.myUnit.name
                            }
                        },
                        "outOrganUnit": {
                            "id": this.selectUnitNow.id,
                            "name": this.selectUnitNow.name
                        },
                        "applyNeedEquips": orderItems,
                    };
                }else if(this.taskType=='报废') {
                    orderItems=this.form.orderItems;
                    urlApi='scrap';
                    applyOrder={
                        "applicant": {
                            "name": JSON.parse(localStorage.getItem('user')).name,
                            "organUnit": {
                                "id": JSON.parse(localStorage.getItem('user')).unitId,
                                "name": this.myUnit.name
                            },
                            "userId": JSON.parse(localStorage.getItem('user')).id
                        },
                        "reason":this.reason,
                        "house": {
                            "id": this.house.id,
                            "name": this.house.name,
                            "organUnit": {
                                "id": JSON.parse(localStorage.getItem('user')).unitId,
                                "name": this.myUnit.name
                            }
                        },
                        "scrapEquips": orderItems,
                    }
                }else if (this.taskType=='直调'){
                    urlApi='direct-transfer';
                    this.form.orderItems.forEach(item=>{
                        if(item.count!=undefined){
                            if(item.count!=''){
                                orderItems.push(item)
                            }
                        }
                    });
                    applyOrder={
                        "applicant": {
                            "name": JSON.parse(localStorage.getItem('user')).name,
                            "organUnit": {
                                "id": JSON.parse(localStorage.getItem('user')).unitId,
                                "name": this.myUnit.name
                            },
                            "userId": JSON.parse(localStorage.getItem('user')).id
                        },
                        "inHouse": {
                            "id": this.houseObj.houseItem.id,
                            "name": this.houseObj.houseItem.name,
                            "organUnit": {
                                "id": this.selectUnitNow.id,
                                "name": this.selectUnitNow.name
                            }
                        },
                        "outOrganUnit": {
                            "id": JSON.parse(localStorage.getItem('user')).unitId,
                            "name": this.myUnit.name
                        },
                        "applyNeedEquips":orderItems,
                        "inUser": {
                            "name":this.adminUser.adminItem.name,
                            "organUnit": {
                                "id": this.selectUnitNow.id,
                                "name": this.selectUnitNow.name
                            },
                            "userId": this.adminUser.adminItem.id
                        }
                    };

                }
                if (this.addType == 'add') {
                    url = baseBURL + `/${urlApi}/start` + '?nextApproveId=' + this.leader.leaderItem.userId + '&processLevelId=' + this.processLevelId
                }else {
                    applyOrder.id=this.applyOrderId;
                    url = baseBURL + `/${urlApi}/apply` + '?nextApproveId=' + this.leader.leaderItem.userId + '&taskId=' + this.taskId
                }
                if(!this.isZero&&!this.isIdentical)
                {
                 this.allocationApplication(url, applyOrder);
                }
                else {
                 this.$message.error('申请失败')
                }
                // let transferOrder={};
                // transferOrder.applicant=JSON.parse(localStorage.getItem('user')).name;
                // transferOrder.inHouseName=this.inHouseName;
                // transferOrder.outHouseName=this.house.name;
                // transferOrder.orderItems = this.form.orderItems;
                // this.$emit('submit',transferOrder)

            },
            allocationApplication(url, borrowApplyOrder) {
                if(this.addType=='add'){
                    this.$ajax.post(url, borrowApplyOrder).then(res => {
                        this.sucesssAdd()
                    }, err => {
                        this.$message.error("申请失败")
                    })
                }else {
                    request({
                        method: 'PUT',
                        url: url,
                        data: borrowApplyOrder
                    }).then(res => {
                        this.sucesssAdd()
                    }, err => {
                        this.$message.error("申请失败")
                    });

                }

                // this.$ajax({
                //     method:'post',
                //     url:url,
                //     params:{transferApplyOrder:transferApplyOrder},
                // }).then(res=>{
                //    console.log(res);
                // })
            },
            sucesssAdd(){
              this.$message.success('申请成功');
              this.$emit('sucessAdd',true);
              this.resultData();
            },
            showAdd() {
                this.form = {};
                if(this.taskType!='报废'){
                    this.form['orderItems'] = [{model: ''}];
                }else {
                    this.form['orderItems'] = [];
                }
                this.$refs.checkTransferDialog.show();
                this.userName = JSON.parse(localStorage.getItem('user')).name;
            },
            addRow() {
                if (this.nowRow.$index === this.form.orderItems.length - 1) {
                    this.form.orderItems.push({model: ''});
                }
            },
            delqaq(data) {
                if (this.form.orderItems.length > 1) {
                    this.form.orderItems.splice(data.$index, 1);
                } else {
                    this.$message.error('不能删除最后一个');
                }
            },
            close() {
                this.$refs.dialog.close();
            },
            cancel() {
                this.$refs.checkTransferDialog.cancelDb()
            },
            getEquipName(row, data) {
                this.form.orderItems[row.$index].name = data.key.name;
            },
            changeCount(row, event) {
                if(row.row.count==0)
                {
                    this.$message.error('装备数量不能为零')
                }
                if(row.row.count && row.row.count != 0) {
                    this.nowRow = row;
                    this.addRow()
                }
            },
            // throttle(method, context) {
            //     clearTimeout(method.tId);
            //     method.tId = setTimeout( ()=>{
            //         method.call(context)
            //     }, 1000)
            // }
        },
        beforeDestroy() {
            killProcess(this.pid)
        }
    }
</script>

<style scoped>
    .addApply {
        height: 697px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .addApply-bottom {
        width: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 54px;
    }

    .addApply-bottom .cancel {
        width: 70px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        line-height: 0px;

    }

    .addApply-bottom .submit {
        width: 70px;
        height: 30px;
        background: rgba(47, 47, 118, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        color: white;
        line-height: 0px;
    }

    .addApply-table {
        width: 974px;
        height: 492px;
        margin-top: 30px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(112, 112, 112, 1);
        opacity: 1;
    }

    .addApply-label {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        flex-wrap:  wrap;
    }

    .addApply-label .label {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }

    .label .default-span {
        width: 217px;
        height: 100%;
        background: rgba(235, 235, 235, 1);
        opacity: 1;
        display: flex;
        font-size: 16px;
        padding-left: 9px;
        color: #cccccc;
        align-items: center;
    }

    .label .input {
        width: 217px;
        line-height: 30px;
        background: rgba(255, 255, 255, 1);
        opacity: 1;
        font-size: 16px;
    }
</style>
