<template>
    <div class="inventory">
        <my-header :title="'盘点'" :searchFlag="false"></my-header>
        <div class="action-bar">
            <el-button type="text" class="in_button" @click="toInventory">
                <svg-icon icon-class="加号"/>
                开始盘点
            </el-button>
        </div>
        <i_inventory :tableData="inventoryObj.inventoryData.inventoryItems" ref="inventoryComponent"
                     :overview="inventoryObj.inventoryData.inventory" :size="size" @handleSubmission="handleSubmission"
                     @newNote="getNote"></i_inventory>
        <i_dialog ref="inventory_dialog" :rfList="inventoryObj.rflist" :size="size" @submit="submit"></i_dialog>
        <service-dialog title="请选择报废审核人" ref="scrap_dialog" :button="true" :secondary="false" @confirm="toScrap">
            <div style="margin:0 auto;text-align:center;">
                    <label> <span>审核人：</span></label>
                    <el-select v-model="nextAssignee" placeholder="请选择" style="width:200px" >
                        <el-option 
                            v-for="item in leaderList" 
                            :label="item.name" 
                            :value="item.id" 
                            :key="item.name">
                    </el-option>
                </el-select>
                </div>
        </service-dialog>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import serviceDialog from "components/base/serviceDialog"
    import i_inventory from 'components/inventory/inventoryComponent'
    import i_dialog from 'components/inventory/inventoryDialog'
    import {getHouseInfo, getApplyLeader, scrapStarts} from 'api/process'
    // import inventoryData from './inventoryData'
    import {getToken} from "../../common/js/auth";
    import request from 'common/js/request'
    import {baseURL} from "../../api/config";
    import { modifyFileName , handheld } from 'common/js/rfidReader'

    // import {handheld} from 'common/js/pda'
    // const fs = window.require('fs');
    // const path = window.require('path');
    // const newFile_path = 'C:\\Users\\Administrator\\inventory.json';


    /*Melanie Dunne supernova*/
    export default {
        name: "inventory",
        components: {
            myHeader,
            i_inventory,
            i_dialog,
            serviceDialog
        },
        data() {
            return {
                inventoryObj: {
                    rflist: [],
                    inventoryData: {
                        inventory: {},
                        inventoryItems: []
                    },
                    getInventory: {},
                },
                size: '',
                scrapList:{
                    applicant:{
                        id:"",
                        name:"",
                        organUnitId:""
                    },
                    equips:[],
                    warehouse:{
                        id:"",
                        name:""
                    }
                },
                nextAssignee:"",
                processConfigId:"",
                leaderList:[],
                houseList:{}
            }
        },
        created() {

        },
        methods: {
            toInventory() {
                this.inventoryObj.rflist = [];
                // modifyFileName('in_house.json')
                // handheld((err) => this.$message.error(err)).then(data => {
                //     this.getInventoryRf(JSON.parse(data));
                // });
                // this.getInventoryRf();
                // this.getInventoryRfCopy();
                //todo 记得合并前换回来
                this.getInventoryRf({"endTime":1574651680308,"rfid":["050001D3"],"size":1,"startTime":1574651671133});
            },
            getNote(data) {
                if (Object.keys(this.inventoryObj.inventoryData.inventory).length != 0) {
                    this.inventoryObj.inventoryData.inventory.remark = data
                } else {
                    this.$message.warning('请先进行盘点')
                }
            },
            handleSubmission(data){
                if(data){
                    if (Object.keys(this.inventoryObj.inventoryData.inventory).length != 0){
                        getHouseInfo().then(res=>{
                            this.houseList = JSON.parse(JSON.stringify(res))
                            let params = {
                                type:"SCRAP",
                                organUnitId:this.houseList.organUnitId
                            }
                            this.scrapList.warehouse.id = this.houseList.houseId
                            this.scrapList.warehouse.name = this.houseList.houseName
                            getApplyLeader(params).then(response=>{
                                let listA = JSON.parse(JSON.stringify(response.auditors))
                                this.leaderList=[]
                                this.processConfigId = response.id
                                console.log("this.processConfigId",this.processConfigId)
                                listA.forEach(item=>{
                                    if(item.level==1){
                                        this.leaderList.push(item.leader)
                                    }
                                })
                                console.log("this.leaderList",this.leaderList)
                            })
                        })
                        let listB = JSON.parse(JSON.stringify(this.inventoryObj.inventoryData.inventoryItems))
                        listB.forEach(item=>{
                            let a ={
                                id:item.equipInfo.equipId,
                                rfid:item.equipInfo.rfid,
                                name:item.equipInfo.equipName,
                                model:item.equipInfo.model
                            }
                            this.scrapList.equips.push(a)
                        })
                        console.log("this.scrapList.equips",this.scrapList.equips)
                        this.$refs.scrap_dialog.show()
                    }
                }
                
            },
            changeSelect(data){
                console.log("changeSelect data",data)
                this.nextAssignee = data
            },
            toScrap(){
                this.scrapList.applicant.id = JSON.parse(localStorage.getItem('user')).id
                this.scrapList.applicant.name = JSON.parse(localStorage.getItem('user')).name
                if(JSON.parse(localStorage.getItem('user')).organUnitName==this.houseList.organUnitName){
                    this.scrapList.applicant.organUnitId = this.houseList.organUnitId
                }else if(JSON.parse(localStorage.getItem('user')).organUnitName==this.houseList.houseName){
                    this.scrapList.applicant.organUnitId = this.houseList.houseId
                }
                scrapStarts(this.scrapList,this.nextAssignee,this.processConfigId).then(res=>{
                    this.$message.success('报废成功');
                    this.handleSubmission2()
                    this.$refs.scrap_dialog.hide()
                    this.leaderList=[],
                    this.scrapList={}
                }).catch(err => {
                    this.$message.error(err);
                });
            },
            handleSubmission2(data) {
                    console.log("this.inventoryObj.inventoryData",this.inventoryObj.inventoryData)
                    console.log("data",data)

                    let url = baseURL+'/equipMaintain/inventory';
                    let params={
                        startTime: this.inventoryObj.inventoryData.inventory.startTime,
                        inventoryCount: this.inventoryObj.inventoryData.inventory.inventoryCount,
                        inventoryDetailSet: this.inventoryObj.inventoryData.inventoryItems,
                        notCount: this.inventoryObj.inventoryData.inventory.outCount,
                        operatorInfo: {
                            operator: this.inventoryObj.inventoryData.inventory.adminName,
                            operatorId: this.inventoryObj.inventoryData.inventory.adminId
                        },
                        outHouseCount: this.inventoryObj.inventoryData.inventory.withoutRfidCount,
                        remark: this.inventoryObj.inventoryData.inventory.remark,
                    }
                    request({
                        method: 'post',
                        url: url,
                        data: params
                    }).then((res) => {
                        this.$message.success('操作成功');
                        this.$refs.inventoryComponent.remark = '';
                        this.inventoryObj = {
                            rflist: [],
                            inventoryData: {
                                inventory: {},
                                inventoryItems: []
                            },
                            getInventory: {},
                        };
                        this.size = ''
                    }).catch(err => {
                        this.$message.error(err);
                    });
            },
            submit(data) {
                let url = baseURL+'/equipMaintain/inventoryByRfid';
                let rfidC = [];
                this.inventoryObj.rflist.forEach(item => {
                    rfidC.push(item.rfId);
                });
                let rfid = this.getString(rfidC);
                if (data) {
                    /* request({
                         url:url,
                         method:'get',
                     })*/
                    request({
                        method: 'post',
                        url: url,
                        params: {rfids: rfid}
                    }).then((res) => {
                        /*res.inventoryItems.forEach((item,index)=>{
                            let num = index+1;
                            if(num<10){
                                num='0'+num;
                            }
                           item.number=num
                        });*/
                        /*this.overview.outCount=res.inventory.outCount;
                        this.overview.withoutRfidCount=res.inventory.withoutRfidCount;
                        this.overview.startTime=this.inventory.inventoryData.startTime;
                         this.overview.endTime=this.inventory.inventoryData.endTime;
                         this.overview.name=JSON.parse(localStorage.getItem('user')).name;
                         this.overview.size=this.inventory.inventoryData.size*/
                        console.log("res",res)
                        console.log("this.inventoryObj.getInventory",this.inventoryObj.getInventory)
                        this.inventoryObj.inventoryData.inventoryItems = res.inventoryDetailSet;
                        this.inventoryObj.inventoryData.inventory.outCount = res.notCount;
                        this.inventoryObj.inventoryData.inventory.withoutRfidCount = res.outHouseCount;
                        this.inventoryObj.inventoryData.inventory.startTime = this.inventoryObj.getInventory.startTime;
                        this.inventoryObj.inventoryData.inventory.adminName = res.operatorInfo.operator;
                        this.inventoryObj.inventoryData.inventory.adminId = res.operatorInfo.operatorId;
                        this.inventoryObj.inventoryData.inventory.inventoryCount = res.inventoryCount;
                        console.log("this.inventoryObj.inventoryData",this.inventoryObj.inventoryData)
                        
                        this.deleteFile();
                    }).catch(err => {
                        this.$message.error(err);
                    });
                }
            },
            deleteFile() {
                delFile(newFile_path, () => {})
                // fs.unlink(newFile_path, function (error) {
                //     if (error) {
                //         return false;
                //     }
                // })

            },
            getString(data) {
                let str = '';
                data.forEach(item => {
                    str = str + ',' + item
                });
                return str.substring(1, str.length);
            },
            /* 处理获得的rfid JSON数据 */
            getInventoryRf(data) {
                if(data){
                    this.inventoryObj.getInventory = data;
                    this.size = String(data.size);
                    data.rfid.forEach((item, index) => {
                        this.inventoryObj.rflist.push({
                            rfId: item
                        })
                    });
                    this.$refs['inventory_dialog'].show();
                }
                // this.inventory.endTime=data.endTime;
                // this.inventory.startTime=data.startTime;
                // this.inventory.size=data.size;
            },
            // getInventoryRfCopy(){
            //     this.inventoryObj.rflist=[];
            //     this.inventoryObj.getInventory=inventoryData;
            //     this.size=String(inventoryData.size);
            //     inventoryData.rfid.forEach((item,index)=>{
            //         this.inventoryObj.rflist.push({
            //             rfId:item
            //         })
            //     });
            //
            // }
        }
    }
</script>

<style scoped>
    .inventory {
        width: 100%;
    }

    .inventory .action-bar {
        height: 0.3021rem;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        border-top: 1px solid rgba(112, 112, 112, 0.13);
        padding-left: 0.0938rem;
    }

    .action-bar .in_button {
        color: #2F2F76;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
