<template>
    <div>
        <el-card shadow="never" v-if="storageListShow">

            <!--element card 的头部-->

            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>


            <!--操作拦-->
            <div>
                <tabs>
                    <el-button type="text" class="_textBt" @click="goInfo">
                        <svg-icon icon-class="加" class="textBt"/>
                        出库装备
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="单号"
                                suffix="el-icon-search"
                                v-model="table.search"
                                :wrapforlike="true"
                                style="width:285px;">
                        </BosInput>
                    </div>
                </tabs>
            </div>

            <!--list列表-->
            <r_label :table="table" ref="lable" @clickTable="clickTable"
                     ></r_label>
        </el-card>

        <in-storage-list v-if="!storageListShow" :title="title" :equipData="equipData" @black="storageListShow=true"></in-storage-list>
    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import serviceDialog from 'components/base/serviceDialog/index'
    import inStorageList from 'components/equipment/inStorageList'
    import r_label from 'common/vue/ajaxTabel'
    // nodejs调用子进程的方法

    // const cmdPath = 'C:\\Users\\Administrator';   //cmd命令的位置
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // import {killProcess} from "common/js/kill";

    export default {
        data() {
            return {
                inquire: '%%',
                options: [],
                commonHouseId: '',
                equipId: '',
                equipData: {},
                title: '',
                table: {
                    labelList: [
                        {lable: '出库单号', field: 'orderNumber'},
                        {lable: '装备数量', field: 'count'},
                        {lable: '操作人员', field: 'operatorInfo.operator', },
                        {lable: '出库时间', filter: (row) => this.$filterTime(row.createTime)},
                    ],
                    url: '/inouthouse/findOutHouseNumberLike',
                    tableAction:{
                        label:'操作',
                        button:[{name:'查看',type:'primary'}]
                    },
                    search:'',
                },
                mode: true,
                inlineForm: {
                    rfid: '',
                    newRfid: '',
                },
                delEquipObj: {},
                dialogVisible: false,
                storageListShow: true,
                writeAll: [],
                writeIndex: '',
                pid: '',
                modeType: '',
                com: 0,
                index: false, // 进程回调判断
            }
        },
        components: {
            tabs,
            r_label,
            inStorageList
        },
        methods: {
            clickTable(table) {
                this.equipData = table.row
                this.title="出库单详情"
               this.storageListShow = false
            },
            goInfo() {
                this.storageListShow = false;
                this.title = "出库装备";
            },
            
            black(data) {
                // this.refetch()
                this.storageInfoShow = false;
            },
        beforeDestroy() {
            killProcess(this.pid)
        }
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
        font-size: 0.0833rem;
    }
    
    // 可调整
    // ._card-title {
    //     font-size: 0.0938rem;
    // } 
    // 可调整
    // ._textBt {
    //     font-size: 0.0833rem !important;
    // }
    
    .pattern-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 1.5729rem;

        .pattern {
            width: 0.6354rem;
            height: 0.4844rem;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            opacity: 1;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .dialogButton {
        margin-left: 0.151rem;
        font-size: 0.0833rem;

        .icon {
            vertical-align: top !important;
        }
    }

    .rfidList {
        border: 1px solid rgba(112, 112, 112, 1);
        width: 2.7188rem;
        max-height: 0.9323rem;
        min-height: 0.9323rem;
        margin: auto;
        overflow: auto;
        padding: 0.0833rem;

        .rfid {
            margin-bottom: 0.0521rem;
            color: rgba(112, 112, 112, 1);
            font-size: 0.0833rem;
            display: flex;

            .rfid-left {
                width: 81%;
            }
        }
    }

</style>
