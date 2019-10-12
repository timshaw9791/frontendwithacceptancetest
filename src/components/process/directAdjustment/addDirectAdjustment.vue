<template>
    <div>
        <serviceDialog title="调拨申请" ref="checkTransferDialog" width="1040px" :button="false">
            <div class="addDirectAdjustment">
                <div class="addDirectAdjustment-label">
                    <div class="label">
                        <span v-text="'所在库房：'"></span>
                        <el-input class="input" :disabled="true" size="large" v-model="house.name"></el-input>
                        <!--<div class="default-span"><span v-text="house.name"></span></div>-->
                    </div>
                    <div class="label">
                        <span v-text="'出库机构：'"></span>
                        <el-input class="input" :disabled="true" size="large" v-model="unit.name"></el-input>
                    </div>
                    <div class="label">
                        <span v-text="'指定领导：'"></span>
                        <field-input-query size="large" v-model="leader.leaderName"
                                           :inputList="leader.leaderList"
                                           @select="getLeaderSelect"></field-input-query>
                    </div>
                </div>
                <div class="addDirectAdjustment-table">
                    <form-container ref="form" :model="form" style="width: 100%">
                        <el-table :data="form.orderItems" height="490">
                            <el-table-column label="序号" align="center">
                                <template scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="装备型号" align="center">
                                <template scope="scope">
                                    <field-input-query size="small" v-model="scope.row.model"
                                                       :inputList="restaurants"
                                                       @select="getEquipName(scope,$event)"></field-input-query>
                                </template>
                            </el-table-column>

                            <el-table-column label="装备名称" align="center">
                                <template scope="scope">
                                    {{scope.row.name}}
                                </template>
                            </el-table-column>
                            <el-table-column label="装备数量" align="center">
                                <template scope="scope">
                                    <el-input v-model="scope.row.count" size="small"
                                              @input="changeCount(scope,$event)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="120">
                                <template scope="scope">
                                    <el-button type="danger" @click="delqaq(scope)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </form-container>
                    <div class="addDirectAdjustment-label" style="margin-top: 12px;position: relative">
                        <div class="label" style="position: absolute;right: 0">
                            <span v-text="'申请人员：'"></span>
                            <el-input class="input" :disabled="true" size="small" v-model="userName"></el-input>
                            <!--<div class="default-span"><span v-text="getUserName()"></span></div>-->
                        </div>
                    </div>
                    <div class="addDirectAdjustment-bottom">
                        <el-button class="cancel" @click="cancel">取消</el-button>
                        <el-button style="margin-left: 34px" class="submit" @click="submit">提交</el-button>
                    </div>
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
    import {baseBURL} from "../../../api/config";

    export default {
        name: "addDirectAdjustment",
        components: {
            a_dialog,
            serviceDialog
        },
        props: {
            restaurants: {
                type: Array
            },
            unit: {
                type: Object
            },
            house: {
                type: Object
            },
            applyOrderId:{
                type:String,
                default:''
            },
            myUnit: {
                type: Object
            },
            addType: {
                type: String,
                default: 'add'
            },
            taskId:{
                type:String,
                default: ''
            }
        },
        data() {
            return {
                form: {},
                inHouseName: '',
                lastTime: '',
                unitName: '',
                userName: '',
                nowTime: 0,
                nowRow: {},
                nowCount: '',
                oldCount:'',
                processLevelId: '',
                leader: {
                    leaderList: [{value: '1', key: '21212'}, {value: '2', key: '12121'}, {value: '3', key: 'asas'}],
                    leaderName: '',
                    leaderItem: {},
                }
            }
        },
        created() {
            this.unitName = this.unit.name
        },
        watch: {
            'inHouseName': {
                handler(newVal) {
                    this.$emit('getInHouse', newVal)
                }
            },
            'nowCount': {
                handler(newVal) {
                    this.throttle(this.addRow, 1000)
                }
            }
        },
        methods: {
            getLeaderSelect(data) {
                this.leader.leaderItem = data.key;
            },
            getLeader() {
                // this.$ajax({
                //     method:'get',
                //     url:baseBURL+'/process-level/by-organ-unit-and-transfer-type',
                //     params:{
                //         organUnitId:this.unit.id,
                //         transferType:'DOWN_TO_UP'
                //     }
                // }).then(res=>{
                //     console.log(res);
                // })
                request({
                    method: 'get',
                    url: baseBURL + '/process-level/by-organ-unit-and-transfer-type',
                    params: {
                        organUnitId: JSON.parse(localStorage.getItem('user')).unitId,
                        transferType: 'DOWN_TO_UP'
                    }
                }).then(res => {
                    if(res){
                        this.leader.leaderList = [];
                        this.processLevelId = res.id;
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
                        this.$message.error('尚未设置调拨流程!')
                    }
                })
            },
            submit() {
                console.log(this.leader.leaderItem);
                let url = '';
                let orderItems=[];
                this.form.orderItems.forEach(item=>{
                   if(item.count!=undefined){
                       if(item.count!=''){
                           orderItems.push(item)
                       }
                   }
                });
                let transferApplyOrder = {
                    "applicant": {
                        "name": JSON.parse(localStorage.getItem('user')).name,
                        "organUnit": {
                            "id": JSON.parse(localStorage.getItem('user')).unitId,
                            "name": this.myUnit.name
                        },
                        "userId": JSON.parse(localStorage.getItem('user')).id
                    },
                    "inHouse": {
                        "id": this.house.id,
                        "name": this.house.name,
                        "organUnit": {
                            "id": JSON.parse(localStorage.getItem('user')).unitId,
                            "name": this.myUnit.name
                        }
                    },
                    "outOrganUnit": {
                        "id": this.unit.id,
                        "name": this.unit.name
                    },
                    "applyNeedEquips": orderItems,
                    "type": "DOWN_TO_UP"
                };
                if (this.addType == 'add') {
                    url = baseBURL + '/transfer/start' + '?nextApproveId=' + this.leader.leaderItem.userId + '&processLevelId=' + this.processLevelId
                }else {
                    transferApplyOrder.id=this.applyOrderId;
                    url = baseBURL + '/transfer/apply' + '?nextApproveId=' + this.leader.leaderItem.userId + '&taskId=' + this.taskId
                }
                this.allocationApplication(url, transferApplyOrder);
                // let transferOrder={};
                // transferOrder.applicant=JSON.parse(localStorage.getItem('user')).name;
                // transferOrder.inHouseName=this.inHouseName;
                // transferOrder.outHouseName=this.house.name;
                // transferOrder.orderItems = this.form.orderItems;
                // this.$emit('submit',transferOrder)

            },
            allocationApplication(url, transferApplyOrder) {
                if(this.addType=='add'){
                    this.$ajax.post(url, transferApplyOrder).then(res => {
                        this.sucesssAdd()
                    })
                }else {
                    request({
                        method: 'PUT',
                        url: url,
                        data: transferApplyOrder
                    }).then(res => {
                        this.sucesssAdd()
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
            },
            showAdd() {
                this.form = {};
                this.form['orderItems'] = [{model: ''}];
                this.$refs.checkTransferDialog.show();
                this.getLeader();
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
                this.nowRow = row;
                if(event!=this.oldCount)
                {
                this.nowCount = event
                this.oldCount=event
                }
                else{
                    this.nowCount=0
                    this.oldCount=0
                }
                
               
            },
            throttle(method, context) {
                clearTimeout(method.tId);
                method.tId = setTimeout(function () {
                    method.call(context)
                }, 1000)
            }
        }
    }
</script>

<style scoped>
    .addDirectAdjustment {
        height: 697px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .addDirectAdjustment-bottom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 53px;
    }

    .addDirectAdjustment-bottom .cancel {
        width: 70px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        line-height: 0px;
    }

    .addDirectAdjustment-bottom .submit {
        width: 70px;
        height: 30px;
        background: rgba(47, 47, 118, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        color: white;
        line-height: 0px;
    }

    .addDirectAdjustment-table {
        width: 974px;
        height: 492px;
        margin-top: 30px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(112, 112, 112, 1);
        opacity: 1;
    }

    .addDirectAdjustment-label {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
    }

    .addDirectAdjustment-label .label {
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
