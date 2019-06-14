<template>
    <div>
        <dialogs ref="dialog" :width="1529" :title="'出库'">
            <div class="directAdjustmentDialog">
                <div class="directAdjustmentDialog-header">
                    <div class="header-item">
                        <div><span v-text="'调拨单号：'"></span><span v-text="directObj.number"></span></div>
                        <div class="d_select"><span v-text="'硬件选择：'"></span>
                            <el-select v-model="hardware" placeholder="请选择" size="mini">
                                <el-option
                                        v-for="item in hardwareList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="header-item"><span v-text="'装备清单：'"></span></div>
                </div>
                <div class="directAdjustmentDialog-body">
                    <div class="leftTable">
                        <el-table
                                :data="directObj.orderItems"
                                height="531"
                                border
                                style="width: 100%"
                                :align="align"
                        >
                            <el-table-column
                                    label="序号"
                                    type="index"
                                    :index="indexMethod" width="180" :align="align">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="装备名称"
                                    width="180"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="model"
                                    label="装备型号"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="count"
                                    label="装备数量"
                                    :align="align"
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="rightTable">
                        <el-table
                                :data="rightList"
                                height="531"
                                border
                                style="width: 100%"
                                :align="align"
                                :row-class-name="tableRowClassName"
                        >
                            <el-table-column
                                    label="序号"
                                    type="index"
                                    :index="indexMethod" width="180" :align="align">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="装备名称"
                                    width="180"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="model"
                                    label="装备型号"
                                    :align="align"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="count"
                                    label="装备数量"
                                    :align="align"
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="directAdjustmentDialog-bottom" v-if="directObj.state=='IN'">
                    <el-button class="cancel" @click="close">取消</el-button>
                    <el-button style="margin-left: 34px" class="submits" @click="submit">提交</el-button>
                </div>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from 'components/surroundings/surroundingDialog'
    import inventoryData from 'views/warehouse/inventoryData'
    import request from 'common/js/request'
    /*import {handheld} from 'common/js/handheld'*/

    export default {
        name: "directAdjustmentDialog",
        components: {
            dialogs
        },
        props: {
            directObj: {
                type: Object
            }
        },
        data() {
            return {
                hardware: '',
                hardwareList: [
                    {value: '手持机', label: '手持机'},
                    {value: 'RFID读写器', label: 'RFID读写器'},
                ],
                rightList: [],
                outList:[],
                align: 'center',
                submitFlag:true
            }
        },
        watch: {
            'hardware': {
                handler(newVal) {
                    if (newVal == '手持机') {
                        this.handheldMachine();
                    }
                }
            }
        },
        methods: {
            close() {
                this.$refs.dialog.close();
            },
            show() {
                this.$refs.dialog.show();
            },
            tableRowClassName({row, rowIndex}){
                /*if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';*/
                if (row.flag) {
                    return ''
                }else{
                    return 'colorDialog'
                }

            },
            handheldMachine() {
                /*handheld.then(data => {
                    this.getOutData(data)
                });*/
                //todo 要换回来
                let data = inventoryData;
                this.getOutDataCopy(['q2', '3', '4', '55','6','7','8','9','11','天下第一','sdfa','10','222','23252s'])
            },
            getOutData(data){
                console.log(data);
            },
            getOutDataCopy(data){
                let url = 'http://115.159.154.194/warehouse/equips/by-rfidlist';
                let params={
                    rfidList:data.rfid
                };
                request({
                    method:'PUT',
                    url:url,
                    data:data
                }).then(res=>{
                    if(res){
                        this.outList= res;
                        this.getCategroy(res);
                    }
                })
            },
            submit() {
                if(this.submitFlag){
                    let url='http://115.159.154.194/warehouse/transfers/up-to-down/equips-out/';
                    let param={
                        rfidList:this.outList,
                        transferOrderId: this.directObj.id
                    };
                    request({
                        method:'DELETE',
                        url:url,
                        data:param
                    }).then(res=>{
                        if(res){
                            console.log(res);
                        }
                    })
                }else {
                    this.$message.error('请重新确认出库装备')
                }
            },
            getCategroy(data){
                let r_list=[];
                let typeModel=[];
                this.rightList=[];
                data.forEach(item=>{
                    if(r_list==[]){
                        r_list.push({
                            name:item.equipArg.name,
                            model:item.equipArg.model,
                            count:1,
                            flag:false
                        });
                        typeModel.push(item.equipArg.model)
                    }else {
                        if(typeModel.indexOf(item.equipArg.model) > -1){
                            r_list.forEach(listItem=>{
                                if(listItem.model==item.equipArg.model){
                                    listItem.count=listItem.count+1
                                }
                            })
                        }else {
                            r_list.push({
                                name:item.equipArg.name,
                                model:item.equipArg.model,
                                count:1,
                                flag:false
                            });
                            typeModel.push(item.equipArg.model)
                        }
                    }
                })
                this.rightList=r_list;
                this.getTrueOrFalse();
            },
            getTrueOrFalse(){
                this.rightList.forEach(item=>{
                    this.directObj.orderItems.forEach(directItem=>{
                        if (directItem.model==item.model){
                            item.flag=true;
                            if(directItem.count==item.count){}else {
                                this.submitFlag=false
                                item.flag=false
                            }
                        }
                    })
                })
            },
            indexMethod(index) {
                return index +1;
            },
        }
    }
</script>

<style>
    .directAdjustmentDialog {
        height: 781px;
        width: 100%;
        padding: 15px 55px;
        color: #707070;
    }
    .colorDialog{
        color: #FF0000;
    }
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
    .directAdjustmentDialog .directAdjustmentDialog-body {
        margin-top: 14px;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .directAdjustmentDialog-body .leftTable {
        width: 700px;
    }

    .directAdjustmentDialog-body .rightTable {
        width: 700px;
    }

    .directAdjustmentDialog .directAdjustmentDialog-header {
        width: 100%;
    }

    .directAdjustmentDialog-header .header-item {
        display: flex;
        width: 100%;
        margin-top: 14px;
        justify-content: space-between;
        align-items: center;
    }

    .header-item .d_select {
        display: flex;
        align-items: center;
    }

    .directAdjustmentDialog .directAdjustmentDialog-bottom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 57px;
    }

    .directAdjustmentDialog-bottom .submits {
        width: 70px;
        height: 30px;
        background: rgba(47, 47, 118, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        color: white;
        line-height: 0px;
    }

    .directAdjustmentDialog-bottom .cancel {
        width: 70px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 6px;
        line-height: 0px;
    }
</style>