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
                    <div class="header-item"><span v-text="'装备清单：'"></span>
                        <el-button class="resultButton" v-text="'重新读取数据'" v-if="!submitFlag"
                                   @click="clickResult"></el-button>
                    </div>
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
                            <el-table-column
                                    prop="flag"
                                    label="操作"
                                    :align="align"
                                    v-if="!submitFlag"
                            >
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" class="deleteButtom"
                                               @click="deleteRow(scope.$index)" :disabled="scope.row.flag"
                                               v-text="'【删除】'"></el-button>
                                </template>
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
    // import inventoryData from 'views/warehouse/inventoryData'
    import request from 'common/js/request'
    import {baseURL} from "../../../api/config";
    import { start, delFile, handheld } from 'common/js/rfidReader'

    // import {handheld} from 'common/js/pda'
    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;
    // const fs = window.require('fs');
    // const path = window.require('path');
    // const newFile_path = 'C:\\Users\\Administrator\\inventory.json';
    // import {killProcess} from "common/js/kill";

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
                outList: [],
                align: 'center',
                submitFlag: true,
                types: '',
                pid: '',
                flag: false,
                closeUsb: false,
                index:0,
                com: 0
            }
        },
        watch: {
            'hardware': {
                handler(newVal, oldVal) {
                    if (oldVal == 'RFID读写器' && newVal == '手持机') {
                        this.end(this.pid)
                    }
                    if (newVal == '手持机') {
                        this.rightList = [];
                        this.handheldMachine();
                    } else if (newVal == 'RFID读写器') {
                        this.closeUsb = false;
                        this.rightList = [];
                        this.getListUsb();
                    }
                }
            }
        },
        created() {
            this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];
        },
        methods: {
            deleteFile() {
                delFile(newFile_path, () => {console.log('删除文件' + newFile_path + '成功')})
                // fs.unlink(newFile_path, function (error) {
                //     if (error) {
                //         return false;
                //     }
                //     console.log('删除文件' + newFile_path + '成功');
                // })
            },
            end(pid) {
                // alert('关掉了');
                // this.closeUsb=true
                if (pid) {
                    spawn("taskkill", ["/PID", pid, "/T", "/F"]);
                }
            },
            getListUsb() {//todo

                start("java -jar scan.jar", (data) => {
                        if (this.index > 0) {
                        let arr = [];
                        arr.push(data);
                        this.getOutDataCopy(arr);
                    } else {
                        let newData = JSON.parse(data);
                        newData.status === 'succeed' ? this.index = 1 : this.index = 0;
                    }
                }, (fail) => {
                    this.$message.error(fail)
                }, (pid, err) => {
                    pid?this.pid = pid:this.$message.error(err)
                })

                // this.index = 0;
                // const process = exec(`java -jar scan.jar ${this.com}`, {cwd: cmdPath});
                // this.pid = process.pid;

                // process.stderr.on('data', (err) => {
                //     console.log(err);
                //     this.$message.error('设备故障请重新插拔!插入后请重新选择');
                //     this.index = 1;
                //     killProcess();
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
                //     if (this.index === 0) {
                //         this.$message.error('设备未插入或串口号错误,插入后请重新选择!');
                //     }
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
            deleteRow(index) {
                this.rightList.splice(index, 1)
            },
            close() {
                this.closeUsb = true;
                this.end(this.pid);
                this.$refs.dialog.close();
            },
            show() {
                this.$refs.dialog.show();
            },
            tableRowClassName({row, rowIndex}) {
                /*if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';*/
                if (row.flag) {
                    return ''
                } else {
                    return 'colorDialog'
                }

            },
            clickResult() {
                if (this.hardware == '手持机') {
                    this.handheldMachine();
                } else {
                    this.closeUsb = true;
                    this.end(this.pid);
                    setTimeout(() => {
                        this.closeUsb = false;
                        this.getListUsb()
                    }, 1000)
                }
            },
            handheldMachine() {
                handheld().then((data) => {
                    let json = JSON.parse(data);
                    console.log(data);
                    this.getOutDataCopy(json.rfid);
                    this.deleteFile();
                });
                //todo 要换回来
                // let data = inventoryData;
                // this.getOutDataCopy(['q2', '3', '4', '55','6','7','8','9','11','天下第一','sdfa','10','222','23252s'])
            },
            // getOutData(data){
            //     console.log(data);
            // },
            getOutDataCopy(data) {
                let url = baseURL+'/equips/by-rfidlist';
                request({
                    method: 'PUT',
                    url: url,
                    data: data
                }).then(res => {
                    if (res) {
                        this.getCategroy(res);
                    }
                })
            },
            submit() {
                if (this.submitFlag) {
                    let rfidC = [];
                    this.rightList.forEach(item => {
                        rfidC.push(item.rfid)
                    });

                    let url = baseURL+'/transfers/up-to-down/equips-out/';
                    let param = {
                        rfidList: rfidC,
                        transferOrderId: this.directObj.id
                    };
                    request({
                        method: 'DELETE',
                        url: url,
                        data: param
                    }).then(res => {
                        if (res) {
                            console.log(res);
                        }
                    })
                } else {
                    this.$message.error('请重新确认出库装备')
                }
            },
            getCategroy(data) {
                let typeModel = this.getTypeModel(data);
                data.forEach(item => {
                    if (this.rightList.length == 0) {
                        this.rightList.push({
                            name: item.equipArg.name,
                            model: item.equipArg.model,
                            rfid: item.rfid,
                            count: 1,
                            flag: false
                        });
                    } else {
                        let flag = false;
                        let indexI = 0
                        this.rightList.forEach((listItem, index) => {
                            if (listItem.model == item.equipArg.model) {
                                /* listItem.count=listItem.count+1*/
                                flag = true, indexI = index
                            } else {

                            }
                        });
                        if (flag) {
                            this.rightList[indexI].count = this.rightList[indexI].count + 1
                        } else {
                            this.rightList.push({
                                name: item.equipArg.name,
                                model: item.equipArg.model,
                                count: 1,
                                rfid: item.rfid,
                                flag: false
                            });
                        }
                        /*if(typeModel.indexOf(item.equipArg.model) > -1){
                            console.log(typeModel);
                            this.rightList.forEach(listItem=>{
                                if(listItem.model==item.equipArg.model){
                                    listItem.count=listItem.count+1
                                }else {
                                    this.rightList.push({
                                        name:item.equipArg.name,
                                        model:item.equipArg.model,
                                        count:1,
                                        flag:false
                                    });
                                }
                            })
                        }else {
                            this.rightList.push({
                                name:item.equipArg.name,
                                model:item.equipArg.model,
                                count:1,
                                flag:false
                            });
                        }*/
                    }
                });
                this.getTrueOrFalse();
            },
            getTypeModel(data) {
                let typeModel = [];
                data.forEach(item => {
                    if (typeModel.length == 0) {
                        typeModel.push(item.equipArg.model);
                    } else {
                        if (typeModel.indexOf(item.equipArg.model) > -1) {
                        } else {
                            typeModel.push(item.equipArg.model);
                        }
                    }
                });
                return typeModel
            },
            getTrueOrFalse() {
                this.rightList.forEach(item => {
                    this.directObj.orderItems.forEach(directItem => {
                        if (directItem.model == item.model) {
                            item.flag = true;
                            if (directItem.count == item.count) {
                            } else {
                                this.submitFlag = false
                                item.flag = false
                            }
                        } else {
                            this.submitFlag = false
                        }
                    })
                })
            },
            indexMethod(index) {
                return index + 1;
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

    .colorDialog {
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

    .rightTable .deleteButtom {
        color: #FF0000;
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

    .header-item .resultButton {
        width: 137px;
        height: 30px;
        background: rgba(47, 47, 118, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        line-height: 0px;
        color: white;
        border-radius: 6px;
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
