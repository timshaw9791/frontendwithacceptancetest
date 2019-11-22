<template>
    <div>
        <el-card shadow="never" v-if="!storageInfoShow">

            <!--element card 的头部-->

            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>


            <!--操作拦-->
            <div>
                <tabs>
                    <div class="_buttons">
                        <BosInput
                                placeholder="RFID/名称/型号"
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

        <storageInfo :equipId="equipId" v-if="storageInfoShow" :title="title" @black="black"></storageInfo>
    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import serviceDialog from 'components/base/serviceDialog/index'
    import storageInfo from 'views/equipment/storageInfos'
    import r_label from 'common/vue/ajaxLabel'
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
                title: '',
                storageInfoShow: false,
                list: [],
                table: {
                    labelList: [
                        {lable: 'RFID', field: 'rfid'},
                        {lable: '装备序号', field: 'serial'},
                        {lable: '装备名称', field: 'equipArg.name'},
                        {lable: '装备型号', field: 'equipArg.model'},
                        {lable: '供应商', field: 'equipArg.supplier.name' },
                    ],
                    url:'/equip/findEquipsByRfidAndNameAndModel',
                    tableAction:{
                        label:'操作',
                        button:[{name:'查看',type:'primary'}, {name: '历史', type: 'primary'}]
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
            storageInfo
        },
        methods: {
            clickTable(table) {
              this.goInfo('look', table.row)
            },
            goInfo(data, row) {
                switch (data) {
                    case 'add':
                        this.storageInfoShow = true;
                        this.title = '新增装备信息';
                        this.equipId = '';
                        break;
                    case 'look':
                        this.storageInfoShow = true;
                        this.title = '装备信息详情';
                        this.equipId = row.id;
                        break;
                }
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
